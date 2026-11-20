import { useEffect, useId, useRef, useState } from 'react';
import { Button, Input, Select, Tag } from '@ss/mtd-react3';
import './AiModules.css';

export type ComposerMode = 'assist' | 'plan';
export interface ComposerSubmission { text: string; attachments: File[]; model: string; mode: ComposerMode }
export interface ComposerProps {
  variant?: 'compact' | 'panel';
  context?: string;
  running?: boolean;
  onStop?: () => void;
  onSubmit: (payload: ComposerSubmission) => Promise<void>;
}
const models = [{ label: '标准模型（演示）', value: 'standard' }, { label: '推理模型（演示）', value: 'reasoning' }];

/** AI-1：本地附件暂存。文件上传、模型访问及实际执行权限均由业务服务实现。 */
export function ConversationComposer({ variant = 'panel', context, running = false, onStop, onSubmit }: ComposerProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [model, setModel] = useState('standard');
  const [mode, setMode] = useState<ComposerMode>('assist');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const lock = useRef(false);
  const fileId = useId();
  const live = useRef(true);
  useEffect(() => { live.current = true; return () => { live.current = false; }; }, []);
  const send = async () => {
    if (lock.current || running || !text.trim()) return;
    lock.current = true; setPending(true); setError('');
    try {
      await onSubmit({ text: text.trim(), attachments: [...attachments], model, mode });
      if (live.current) { setText(''); setAttachments([]); }
    } catch {
      if (live.current) setError('发送失败，草稿与附件已保留，请重试。');
    } finally {
      lock.current = false;
      if (live.current) setPending(false);
    }
  };
  return <form ref={form} className={`ai-module ai-composer ai-composer--${variant}`} onSubmit={event => { event.preventDefault(); void send(); }}>
    {variant === 'panel' && context && <div className="ai-context"><span>上下文 · {context}</span></div>}
    {attachments.length > 0 && <ul className="ai-attachments" aria-label="暂存附件">{attachments.map((file, index) => <li key={`${file.name}-${index}`}><span>{file.name}</span><Button size="small" shape="text" disabled={pending} aria-label={`移除附件 ${file.name}`} onClick={() => setAttachments(items => items.filter((_, i) => i !== index))}>移除</Button></li>)}</ul>}
    <Input.TextArea aria-label="对话内容" placeholder="描述你需要完成的任务…" value={text} maxLength={4000} disabled={pending}
      autosize={{ minRows: variant === 'compact' ? 1 : 3, maxRows: variant === 'compact' ? 3 : 10 }}
      onChange={event => setText((event.target as HTMLTextAreaElement).value)}
      onKeyDown={event => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
          event.preventDefault(); form.current?.requestSubmit();
        }
      }} />
    <div className="ai-composer-controls">
      <label className={`ai-attach ${pending ? 'is-disabled' : ''}`} htmlFor={fileId}>添加附件<input id={fileId} type="file" multiple disabled={pending} onChange={event => {
        const incoming = Array.from(event.target.files || []);
        const merged = [...attachments];
        for (const file of incoming) {
          if (!merged.some(old => old.name === file.name && old.size === file.size && old.lastModified === file.lastModified)) merged.push(file);
        }
        if (merged.length > 3 || merged.some(file => file.size > 10 * 1024 * 1024)) setError('最多暂存 3 个附件，每个不超过 10MB。');
        else { setAttachments(merged); setError(''); }
        event.target.value = '';
      }} /></label>
      <Select aria-label="工作模式" onlyKeyValue value={mode} disabled={pending || running} options={[{ label: '辅助模式', value: 'assist' }, { label: '规划模式', value: 'plan' }]} onChange={value => setMode(value as ComposerMode)} style={{ width: 116 }} />
      <Select aria-label="模型选择" onlyKeyValue value={model} disabled={pending || running} options={models} onChange={value => setModel(String(value))} style={{ width: 176 }} />
      <span className="ai-control-spacer" />
      {running ? <Button onClick={onStop} disabled={!onStop} aria-disabled={!onStop}>停止生成</Button> : <Button type="primary" htmlType="submit" loading={pending} disabled={pending || !text.trim()} aria-disabled={pending || !text.trim()}>发送</Button>}
    </div>
    {error && <p className="ai-feedback" role="alert">{error}</p>}
    <p className="ai-hint">Enter 发送 · Shift+Enter 换行 · 附件仅本地暂存</p>
  </form>;
}

export type AnswerState = 'streaming' | 'completed' | 'stopped' | 'failed';
export interface AnswerSource { id: string; title: string; href: string }
export function AiAnswer({ text, state, sources = [], onRetry, onStop }: { text: string; state: AnswerState; sources?: AnswerSource[]; onRetry?: () => void; onStop?: () => void }) {
  const [feedback, setFeedback] = useState('');
  useEffect(() => setFeedback(''), [text, state]);
  const labels: Record<AnswerState, string> = { streaming: '正在生成', completed: '已完成', stopped: '已停止', failed: '生成失败' };
  return <article className="ai-module ai-answer" aria-label="助手回答" aria-busy={state === 'streaming'}>
    <header className="ai-section-header"><strong>助手</strong><span role="status">{labels[state]}</span></header>
    <div className="ai-answer-text">{text || (state === 'streaming' ? '正在准备回答…' : state === 'failed' ? '没有收到回答，请重试。' : '暂无回答')}</div>
    {sources.length > 0 && <div className="ai-sources"><span>参考来源</span><ol>{sources.map(source => <li key={source.id}>{/^https?:\/\//.test(source.href) ? <a href={source.href} target="_blank" rel="noreferrer">{source.title}</a> : <span>{source.title}（链接不可用）</span>}</li>)}</ol></div>}
    <footer className="ai-actions">
      <Button size="small" disabled={!text} aria-disabled={!text} onClick={async () => {
        try { await navigator.clipboard.writeText(text); setFeedback('回答已复制'); } catch { setFeedback('复制失败，请选择文本复制'); }
      }}>复制回答</Button>
      {state === 'streaming' ? <Button size="small" disabled={!onStop} aria-disabled={!onStop} onClick={onStop}>停止生成</Button> : <Button size="small" disabled={!onRetry} aria-disabled={!onRetry} onClick={onRetry}>{state === 'failed' ? '重试生成' : '重新生成'}</Button>}
      {feedback && <span role="status">{feedback}</span>}
    </footer>
  </article>;
}

const sampleAnswer = '建议优先核对异常门店的营业状态，再检查缺货与配送时效。将问题按影响范围排序，明确负责人和复查时间。\n\n这是一段本地模拟回答，未调用模型或业务接口。';
export function AnswerDemo({ initial = 'completed' }: { initial?: AnswerState }) {
  const [state, setState] = useState<AnswerState>(initial);
  const [text, setText] = useState(initial === 'completed' ? sampleAnswer : initial === 'failed' ? '' : sampleAnswer.slice(0, 24));
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimer = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
  useEffect(() => () => stopTimer(), []);
  const run = () => {
    stopTimer(); setState('streaming'); setText('');
    let length = 0;
    timer.current = setInterval(() => {
      length += 6; setText(sampleAnswer.slice(0, length));
      if (length >= sampleAnswer.length) { stopTimer(); setState('completed'); }
    }, 100);
  };
  return <div className="ai-demo"><p className="ai-demo-note">本地模拟 · 可体验生成、停止与重试</p>
    <div className="ai-user-message">帮我梳理门店异常的处理顺序。</div>
    <AiAnswer text={text} state={state} sources={[{ id: 'mtd', title: '组件参考：BoardUI（非业务依据）', href: 'https://www.boardui.com/zh-hans/components/composer-panel' }]} onRetry={run} onStop={() => { stopTimer(); setState('stopped'); }} />
    <div className="ai-actions"><Button size="small" onClick={run} disabled={state === 'streaming'}>演示生成</Button><Button size="small" disabled={state === 'streaming'} onClick={() => { stopTimer(); setState('failed'); }}>演示失败</Button></div>
  </div>;
}

export type AgentState = 'idle' | 'running' | 'awaiting_confirmation' | 'completed' | 'failed' | 'cancelled';
export interface AgentStep { id: string; title: string; state: 'pending' | 'running' | 'completed' | 'failed' }
export function AgentTask({ state, steps, title = '智能体执行', confirmation, onConfirm, onCancel, onRetry }: { state: AgentState; steps: AgentStep[]; title?: string; confirmation?: { title: string; description: string }; onConfirm?: () => void; onCancel?: () => void; onRetry?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const labels: Record<AgentState, string> = { idle: '尚未开始', running: '正在执行', awaiting_confirmation: '等待确认', completed: '执行完成', failed: '执行失败', cancelled: '已取消' };
  const stepLabels = { pending: '待执行', running: '进行中', completed: '已完成', failed: '失败' };
  return <section className="ai-module" aria-label="智能体执行进度">
    <header className="ai-section-header"><strong>{title}</strong><Tag theme={state === 'failed' ? 'red' : state === 'completed' ? 'green' : 'gray'}>{labels[state]}</Tag></header>
    <ol className="ai-step-list">{steps.map(step => <li key={step.id}><span className={`ai-state-dot ai-state-dot--${step.state}`} /><span>{step.title}</span><span>{stepLabels[step.state]}</span></li>)}</ol>
    {state === 'awaiting_confirmation' && <div className="ai-confirmation"><strong>{confirmation?.title || '是否继续执行当前操作？'}</strong><p>{confirmation?.description || '继续前请核对操作对象和影响范围。'}</p><Button type="primary" size="small" onClick={onConfirm} disabled={!onConfirm} aria-disabled={!onConfirm}>确认继续</Button></div>}
    {state === 'failed' && <p className="ai-feedback" role="alert">分析步骤失败，已保留此前完成的步骤。</p>}
    <div className="ai-actions">
      {['running', 'awaiting_confirmation'].includes(state) && <Button size="small" onClick={onCancel} disabled={!onCancel} aria-disabled={!onCancel}>取消任务</Button>}
      {state === 'failed' && <Button size="small" onClick={onRetry} disabled={!onRetry} aria-disabled={!onRetry}>重试任务</Button>}
      <Button size="small" shape="text" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? '收起执行记录' : '查看执行记录'}</Button>
    </div>
    {expanded && <p className="ai-hint">仅展示公开步骤与执行状态，不展示模型内部思考。当前状态：{labels[state]}。</p>}
  </section>;
}
const initialSteps: AgentStep[] = [{ id: 'read', title: '读取异常摘要', state: 'pending' }, { id: 'analyse', title: '分析影响范围', state: 'pending' }, { id: 'write', title: '整理处理建议', state: 'pending' }];
export function AgentTaskDemo({ initial = 'idle' }: { initial?: AgentState }) {
  const [state, setState] = useState<AgentState>(initial);
  const [steps, setSteps] = useState<AgentStep[]>(initialSteps.map((step, i) => ({ ...step, state: initial === 'failed' ? i === 0 ? 'completed' : i === 1 ? 'failed' : 'pending' : initial === 'awaiting_confirmation' ? i < 2 ? 'completed' : 'pending' : 'pending' })));
  const begin = () => { setState('running'); setSteps(initialSteps.map((step, i) => ({ ...step, state: i === 0 ? 'running' : 'pending' }))); };
  const advance = () => {
    const current = steps.findIndex(step => step.state === 'running');
    setSteps(items => items.map((step, i) => ({ ...step, state: i <= current ? 'completed' : i === current + 1 && current === 0 ? 'running' : 'pending' })));
    if (current === 1) setState('awaiting_confirmation');
  };
  return <div className="ai-demo"><p className="ai-demo-note">本地状态演示 · “推进一步”模拟服务端执行结果</p>
    <AgentTask state={state} steps={steps} title="异常分析任务" confirmation={{ title: '是否继续执行“整理处理建议”？', description: '本地模拟：只更新演示状态，不执行真实工具操作。' }} onCancel={() => { setState('cancelled'); setSteps(items => items.map(step => step.state === 'running' ? { ...step, state: 'pending' } : step)); }} onConfirm={() => { setState('completed'); setSteps(items => items.map(step => ({ ...step, state: 'completed' }))); }} onRetry={() => { setState('running'); setSteps(items => items.map(step => step.state === 'failed' ? { ...step, state: 'running' } : step)); }} />
    <div className="ai-actions">{['idle', 'completed', 'cancelled'].includes(state) && <Button onClick={begin}>{state === 'idle' ? '开始演示任务' : '重新演示'}</Button>}{state === 'running' && <><Button type="primary" onClick={advance}>推进一步</Button><Button onClick={() => { setState('failed'); setSteps(items => items.map(step => step.state === 'running' ? { ...step, state: 'failed' } : step)); }}>演示执行失败</Button></>}</div>
  </div>;
}

export function ComposerDemo({ variant = 'panel' }: { variant?: 'compact' | 'panel' }) {
  const [last, setLast] = useState('');
  const [fail, setFail] = useState(false);
  const [running, setRunning] = useState(false);
  return <div className="ai-demo"><p className="ai-demo-note">本地演示 · 不调用模型、不上传附件</p>
    <ConversationComposer variant={variant} context="运营知识库" running={running} onStop={() => { setRunning(false); setLast('已停止本地演示生成'); }} onSubmit={async payload => {
      if (fail) throw new Error('演示发送失败');
      setLast(`已接收：${payload.text}；${payload.mode === 'plan' ? '规划模式' : '辅助模式'}；${payload.model === 'standard' ? '标准模型' : '推理模型'}；附件 ${payload.attachments.length} 个`); setRunning(true);
    }} />
    <label className="ai-demo-toggle"><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)} />模拟发送失败</label>
    {last && <p role="status" className="ai-hint">{last}</p>}
  </div>;
}
