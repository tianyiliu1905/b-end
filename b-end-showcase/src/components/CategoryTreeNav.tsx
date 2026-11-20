import { useState, type CSSProperties } from 'react';
import { Input, Select, Table, Tag, Tree } from '@ss/mtd-react3';

export interface CategoryNode { key: string; label: string; children?: CategoryNode[] }
export const exampleCategories: CategoryNode[] = [{ key: 'all', label: '全部分类', children: [
  { key: 'life', label: '生活服务', children: [{ key: 'clean', label: '保洁' }, { key: 'repair', label: '维修' }] },
  { key: 'food', label: '餐饮美食', children: [{ key: 'takeout', label: '外卖' }, { key: 'dine', label: '堂食' }] },
  { key: 'retail', label: '购物零售', children: [{ key: 'supermarket', label: '超市' }, { key: 'fresh', label: '生鲜' }] },
] }];

// 保留匹配节点的祖先路径；匹配父分类时保留其完整子树。
export function filterCategories(nodes: CategoryNode[], query: string): CategoryNode[] {
  const keyword = query.trim().toLocaleLowerCase();
  if (!keyword) return nodes;
  return nodes.flatMap(node => {
    if (node.label.toLocaleLowerCase().includes(keyword)) return [node];
    const children = filterCategories(node.children || [], keyword);
    return children.length ? [{ ...node, children }] : [];
  });
}
function findCategory(nodes: CategoryNode[], key: string): CategoryNode | undefined {
  for (const node of nodes) {
    if (node.key === key) return node;
    const child = findCategory(node.children || [], key);
    if (child) return child;
  }
}
function descendantKeys(node?: CategoryNode): string[] {
  return node ? [node.key, ...(node.children || []).flatMap(descendantKeys)] : [];
}

export function CategoryTreeNav({ nodes, selectedKey, onSelect, status, onStatusChange }: {
  nodes: CategoryNode[]; selectedKey: string; onSelect: (key: string) => void;
  status: string; onStatusChange: (status: string) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = filterCategories(nodes, query);
  const labelStyle: CSSProperties = { fontSize: 'var(--fs-14)', fontWeight: 500, marginBottom: 8, color: 'var(--text-2)' };
  return <div className="dash-card" style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div style={{ fontSize: 'var(--fs-16)', fontWeight: 600 }}>分类导航</div>
    <div><div style={labelStyle}>搜索分类</div><Input aria-label="搜索分类" placeholder="输入分类名称" value={query} onChange={event => setQuery(event.target.value)} clearable style={{ width: '100%' }} /></div>
    <div><div style={labelStyle}>分类树</div>
      {filtered.length ? <Tree key={query.trim() ? 'filtered' : 'all'} data={filtered} nodeExpansion={{ defaultExpandAll: true }} nodeSelection={{ selectedKeys: [selectedKey] }} onSelectChange={keys => { if (keys[0]) onSelect(String(keys[0])); }} /> : <p role="status" style={{ color: 'var(--text-3)', fontSize: 12 }}>没有匹配的分类</p>}
    </div>
    <div><div style={labelStyle}>状态筛选</div><Select onlyKeyValue aria-label="状态筛选" value={status} onChange={value => onStatusChange(String(value))} options={[{ label: '全部状态', value: 'all' }, { label: '已上线', value: '已上线' }, { label: '待审核', value: '待审核' }, { label: '已下线', value: '已下线' }]} style={{ width: '100%' }} /></div>
  </div>;
}

const records = [
  { id: '1', name: '日常保洁服务', category: 'clean', status: '已上线' },
  { id: '2', name: '深度保洁服务', category: 'clean', status: '待审核' },
  { id: '3', name: '家电维修服务', category: 'repair', status: '已上线' },
  { id: '4', name: '午餐外卖套餐', category: 'takeout', status: '已上线' },
  { id: '5', name: '堂食双人套餐', category: 'dine', status: '已下线' },
  { id: '6', name: '超市配送服务', category: 'supermarket', status: '已上线' },
  { id: '7', name: '生鲜到家服务', category: 'fresh', status: '待审核' },
];

/** 真实过滤演示：左侧 G-6 选型面板 + 右侧只演示联动结果，不伪装成完整 G-4。 */
export function CategoryTreeExample() {
  const [selectedKey, setSelectedKey] = useState('all');
  const [status, setStatus] = useState('all');
  const selected = findCategory(exampleCategories, selectedKey);
  const keys = new Set(descendantKeys(selected));
  const data = records.filter(row => keys.has(row.category) && (status === 'all' || row.status === status));
  return <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', gap: 'var(--gap-module)', width: '100%', minHeight: 440 }}>
    <CategoryTreeNav nodes={exampleCategories} selectedKey={selectedKey} onSelect={setSelectedKey} status={status} onStatusChange={setStatus} />
    <div className="dash-card" style={{ minWidth: 0 }}>
      <div style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16 }}>分类内容</div>
      <p role="status" style={{ fontSize: 12, color: 'var(--text-3)', margin: '0 0 16px' }}>{selected?.label} · {data.length} 条结果</p>
      <Table rowKey="id" data={data} pagination={false} columns={[
        { label: '名称', dataKey: 'name' },
        { label: '分类', dataKey: 'category', width: 80, render: (value: string) => findCategory(exampleCategories, value)?.label },
        { label: '状态', dataKey: 'status', width: 90, render: (value: string) => <Tag size="small" theme={value === '已上线' ? 'green' : value === '待审核' ? 'orange' : 'gray'}>{value}</Tag> },
      ]} />
    </div>
  </div>;
}
