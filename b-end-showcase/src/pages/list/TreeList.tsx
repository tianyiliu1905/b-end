import { useState } from 'react';
import { Button, Input, Select, Tree } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';
import ModuleWrapper from '../../components/ModuleWrapper';
import { g4Variants } from '../../components/G4DataTable';

const treeData = [
  {
    label: '全部分类',
    key: 'all',
    children: [
      {
        label: '生活服务',
        key: 'life',
        children: [
          { label: '保洁', key: 'clean' },
          { label: '维修', key: 'repair' },
          { label: '搬运', key: 'move' },
        ],
      },
      {
        label: '餐饮美食',
        key: 'food',
        children: [
          { label: '外卖', key: 'takeout' },
          { label: '堂食', key: 'dine' },
        ],
      },
      {
        label: '购物零售',
        key: 'retail',
        children: [
          { label: '超市', key: 'supermarket' },
          { label: '生鲜', key: 'fresh' },
        ],
      },
    ],
  },
];

const statusOptions = [
  { label: '全部', value: '' },
  { label: '已上线', value: '已上线' },
  { label: '待审核', value: '待审核' },
  { label: '已下线', value: '已下线' },
];

export default function TreeList() {
  const [selectedNode, setSelectedNode] = useState('clean');
  const [statusFilter, setStatusFilter] = useState('');

  /* ── 参考 StepForm 的 labelStyle / fieldStyle 排列方式 ── */
  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--fs-14)',
    color: 'var(--text-2)',
    marginBottom: 8,
    fontWeight: 500,
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 24,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 'var(--fs-16)',
    color: 'var(--text-1)',
    fontWeight: 600,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid var(--line)',
  };

  return (
    <PageLayout title="树形层级列表">
      {/* flex:1 跟随 PageLayout 剩余高度；minHeight 兜底保证内容不足一屏时左右两栏仍撑满可视区 */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--gap-module)', flex: 1, minHeight: 'calc(100vh - 52px - 48px)' }}>
        {/* 左树面板 — 参考 StepForm 的 label+field 排列方式 */}
        <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={sectionTitle}>分类导航</div>

          <div style={fieldStyle}>
            <div style={labelStyle}>搜索分类</div>
            <Input placeholder="输入分类名称" style={{ width: '100%' }} />
          </div>

          <div style={fieldStyle}>
            <div style={labelStyle}>分类树</div>
            <Tree
              data={treeData}
              defaultExpandAll
              onSelect={(_keys: string[], info: { node: { key: string } }) => {
                if (info.node.key !== 'all') {
                  setSelectedNode(info.node.key);
                }
              }}
            />
          </div>

          <div style={fieldStyle}>
            <div style={labelStyle}>状态筛选</div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(val: string) => setStatusFilter(val)}
              placeholder="全部状态"
              style={{ width: '100%' }}
            />
          </div>

          <Button type="primary" style={{ marginTop: 'auto' }}>新增节点</Button>
        </div>

{/* 右表格区 — G-4 数据表格
    flex:1 让表格模块撑满与左侧导航同等高度，分页器贴底 */}
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-module)', minWidth: 0 }}>
  <ModuleWrapper moduleId="G-4 数据表格" variants={g4Variants} defaultVariant={0} style={{ flex: 1, minHeight: 0 }} />
</div>
      </div>
    </PageLayout>
  );
}
