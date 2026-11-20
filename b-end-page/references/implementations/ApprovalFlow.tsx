import { useId, useState } from 'react';
import { Button, Input, Tag } from '@ss/mtd-react3';
import './AiModules.css';

export type ApprovalState = 'pending' | 'approved' | 'rejected';
export interface ApprovalNode { id: string; title: string; owner: string; state: 'pending' | 'current' | 'approved' | 'rejected'; comment?: string }
/** Detail4 是业务状态回显，不负责校验审批权限或直接提交审批。 */
export function ApprovalFlow({ state, nodes, title = '审批流程' }: { state: ApprovalState; nodes: ApprovalNode[]; title?: string }) {
  const label = { pending: '审批中', approved: '已通过', rejected: '已驳回' };
  const nodeLabel = { pending: '待处理', current: '待审批', approved: '已通过', rejected: '已驳回' };
  return <section className="ai-module" aria-label="审批状态流程">
    <header className="ai-section-header"><strong>{title}</strong><Tag theme={state === 'approved' ? 'green' : state === 'rejected' ? 'red' : 'orange'}>{label[state]}</Tag></header>
    {nodes.length ? <ol className="approval-flow">{nodes.map((node, index) => <li key={node.id}>
      <span className={`approval-number approval-number--${node.state}`} aria-hidden="true">{index + 1}</span>
      <div><strong>{node.title}</strong><p>{node.owner} · {nodeLabel[node.state]}</p>{node.comment && <p className="approval-comment">审批意见：{node.comment}</p>}</div>
      {node.state === 'current' && <span className="approval-current">当前节点</span>}
    </li>)}</ol> : <p className="ai-hint">暂无审批流程</p>}
  </section>;
}
const approvalNodes: ApprovalNode[] = [
  { id: 'submit', title: '提交申请', owner: '申请人', state: 'approved', comment: '资质资料已提交' },
  { id: 'review', title: '业务审核', owner: '业务负责人', state: 'current' },
  { id: 'final', title: '最终确认', owner: '审批负责人', state: 'pending' },
];
export function ApprovalFlowDemo({ initial = 'pending' }: { initial?: ApprovalState }) {
  const makeNodes = () => approvalNodes.map((node, index): ApprovalNode => initial === 'approved' ? { ...node, state: 'approved' } : initial === 'rejected' && index === 1 ? { ...node, state: 'rejected', comment: '资料缺少有效期，请补充后重新提交' } : { ...node });
  const reasonId = useId();
  const [state, setState] = useState<ApprovalState>(initial);
  const [nodes, setNodes] = useState<ApprovalNode[]>(makeNodes);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const act = (action: 'approve' | 'reject') => {
    const current = nodes.findIndex(node => node.state === 'current');
    if (state !== 'pending' || current < 0) return;
    if (action === 'reject' && !reason.trim()) { setError('请填写驳回原因'); return; }
    setError('');
    setNodes(items => items.map((node, index) => index === current ? { ...node, state: action === 'approve' ? 'approved' : 'rejected', comment: reason.trim() || '审核通过' } : action === 'approve' && index === current + 1 ? { ...node, state: 'current' } : node));
    setState(action === 'reject' ? 'rejected' : current === nodes.length - 1 ? 'approved' : 'pending');
    setReason(''); setMessage(action === 'reject' ? '演示流程已驳回' : current === nodes.length - 1 ? '演示流程已全部通过' : '演示流程已流转到下一节点');
  };
  return <div className="ai-demo"><p className="ai-demo-note">本地审批演示 · 未接审批服务，不代表拥有业务审批权限</p>
    <ApprovalFlow state={state} nodes={nodes} title="资质变更审批" />
    {state === 'pending' && <div className="approval-actions">
      <label htmlFor={reasonId}>审批意见（驳回时必填）</label>
      <Input.TextArea id={reasonId} aria-label="审批意见" value={reason} maxLength={300} autosize={{ minRows: 2, maxRows: 4 }} onChange={event => setReason((event.target as HTMLTextAreaElement).value)} />
      {error && <p role="alert" className="ai-feedback">{error}</p>}
      <div className="ai-actions"><Button type="primary" onClick={() => act('approve')}>通过（演示）</Button><Button type="danger" onClick={() => act('reject')}>驳回（演示）</Button></div>
    </div>}
    {message && <p role="status" className="ai-hint">{message}</p>}
    <Button size="small" onClick={() => { setState(initial); setNodes(makeNodes()); setReason(''); setError(''); setMessage(''); }}>重置演示</Button>
  </div>;
}
