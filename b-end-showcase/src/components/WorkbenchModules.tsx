import { useState } from 'react';
import { Button, Card, Carousel } from '@ss/mtd-react3';

export interface TodoItem { id: string; label: string; count: string; tone?: 'urgent' | 'normal' | 'success'; action: string }
export const exampleTodos: TodoItem[] = [
  { id: 'approval', label: '待审批工单', count: '3 项', tone: 'urgent', action: '去审批' },
  { id: 'process', label: '待处理工单', count: '5 项', action: '去处理' },
  { id: 'reply', label: '待回复咨询', count: '2 项', action: '去回复' },
  { id: 'target', label: '本周目标', count: '85.6%', tone: 'success', action: '查看' },
];
export function TodoCard({ items, onAction, onMore }: { items: TodoItem[]; onAction: (id: string) => void; onMore: () => void }) {
  return <Card style={{ marginBottom: 0 }} header={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    <span>今日待办</span><Button size="small" shape="text" onClick={onMore} style={{ color: 'var(--text-3)', fontSize: 'var(--fs-12)' }}>更多</Button>
  </div>}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.length === 0 && <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>暂无待办</span>}
      {items.map(item => <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{item.label}<span style={{ fontWeight: 600, marginLeft: 6, color: item.tone === 'urgent' ? 'var(--color-red)' : item.tone === 'success' ? 'var(--color-green)' : 'var(--text-1)' }}>{item.count}</span></span>
        <Button type="normal" size="small" style={{ minWidth: 64 }} onClick={() => onAction(item.id)}>{item.action}</Button>
      </div>)}
    </div>
  </Card>;
}
export function TodoCardDemo() {
  const [message, setMessage] = useState('');
  return <div><TodoCard items={exampleTodos} onMore={() => setMessage('已选择全部待办（演示，未接业务路由）')} onAction={id => setMessage(`已选择${exampleTodos.find(item => item.id === id)?.label}（演示，未接业务路由）`)} />{message && <p role="status" style={{ fontSize: 12, color: 'var(--text-3)', margin: '8px 0 0' }}>{message}</p>}</div>;
}

export interface UpdateSlide { id: string; label: string }
export const exampleUpdates: UpdateSlide[] = [1, 2, 3].map(i => ({ id: String(i), label: `动态 ${i}` }));
export function LatestUpdates({ slides }: { slides: UpdateSlide[] }) {
  return <Card style={{ marginBottom: 0 }} header="最新动态">
    {slides.length ? <div style={{ borderRadius: 8, overflow: 'hidden' }}><Carousel autoplay={slides.length > 1} arrow="never" height={120} style={{ width: '100%' }}>
      {slides.map(slide => <div key={slide.id} style={{ height: 120, background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', fontSize: 'var(--fs-12)' }}>{slide.label}</div>)}
    </Carousel></div> : <span style={{ fontSize: 12, color: 'var(--text-3)' }}>暂无动态</span>}
  </Card>;
}

export interface ToolItem { id: string; title: string; desc: string }
export const exampleTools: ToolItem[] = [
  { id: 'discount', title: '折扣活动', desc: '指定商品折扣价' },
  { id: 'single', title: '超值单品', desc: '任选1件享低价' },
  { id: 'bundle', title: 'X件优惠', desc: '多件折扣或立减' },
  { id: 'coupon', title: '商家券', desc: '满额立减优惠券' },
  { id: 'new', title: '新客立减', desc: '新客首单立减' },
  { id: 'store', title: '店铺满减', desc: '全店满额减' },
];
export function ToolGrid({ tools, onCreate }: { tools: ToolItem[]; onCreate: (id: string) => void }) {
  return <div className="dash-card">
    <div style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16 }}>常用工具</div>
    {!tools.length && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>暂无可用工具</span>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
      {tools.map(tool => <div key={tool.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-3)', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div aria-hidden="true" style={{ width: 36, height: 36, background: 'var(--bg-page)', borderRadius: 8 }} />
        <div style={{ fontSize: 'var(--fs-14)', fontWeight: 600, marginTop: 8 }}>{tool.title}</div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', marginTop: 4, flex: 1 }}>{tool.desc}</div>
        <Button size="small" style={{ alignSelf: 'flex-end', marginTop: 8 }} onClick={() => onCreate(tool.id)}>立即创建</Button>
      </div>)}
    </div>
  </div>;
}
export function ToolGridDemo() {
  const [message, setMessage] = useState('');
  return <div><ToolGrid tools={exampleTools} onCreate={id => setMessage(`已选择${exampleTools.find(tool => tool.id === id)?.title}（演示，未接创建流程）`)} />{message && <p role="status" style={{ fontSize: 12, color: 'var(--text-3)', margin: '8px 0 0' }}>{message}</p>}</div>;
}
