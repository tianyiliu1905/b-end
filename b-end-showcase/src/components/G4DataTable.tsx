/**
 * G-4 数据表格 — 统一变体定义
 * 所有看板页面的 G-4 都引用此组件，保证变体结构完全一致。
 * 约定：分页器与表格同属一个模块（同一个 dash-card），不拆成独立卡片。
 */
import { useState } from 'react';
import { Button, Pagination, Radio, Table, Tag, Tabs } from '@ss/mtd-react3';
import { useTheme } from '../theme/useTheme';

/* ═══ 数据 ═══ */

/* Tag 颜色策略：默认蓝色，仅用蓝/绿/橙三种，不使用红色 */
const statusThemeMap: Record<string, string> = { '营业中': 'blue', '装修中': 'orange', '筹备中': 'blue', '已关店': 'orange' };

const detailTableData = [
  { key: '1', id: 'ST-001', name: '春熙路旗舰店', city: '成都', region: '西南区', area: '120㎡', brand: '富王茶泰', revenue: '¥58.6万', openDate: '2023-01-15', contract: '直营', manager: '张三', status: '营业中' },
  { key: '2', id: 'ST-002', name: '国贸CBD店', city: '北京', region: '华北区', area: '85㎡', brand: '奈雪的茶', revenue: '¥42.3万', openDate: '2023-03-20', contract: '加盟', manager: '李四', status: '营业中' },
  { key: '3', id: 'ST-003', name: '南京路概念店', city: '上海', region: '华东区', area: '150㎡', brand: '茶沐青', revenue: '¥73.1万', openDate: '2023-05-10', contract: '直营', manager: '王五', status: '营业中' },
  { key: '4', id: 'ST-004', name: '天河城店', city: '广州', region: '华南区', area: '90㎡', brand: '富王茶泰', revenue: '¥35.8万', openDate: '2024-01-08', contract: '加盟', manager: '赵六', status: '装修中' },
  { key: '5', id: 'ST-005', name: '西湖银泰店', city: '杭州', region: '华东区', area: '75㎡', brand: '奈雪的茶', revenue: '¥28.4万', openDate: '2023-08-25', contract: '直营', manager: '孙七', status: '营业中' },
  { key: '6', id: 'ST-006', name: '解放碑店', city: '重庆', region: '西南区', area: '95㎡', brand: '茶沐青', revenue: '¥31.2万', openDate: '2022-11-14', contract: '加盟', manager: '周八', status: '营业中' },
];

const detailTableColumns = [
  { label: '门店', dataKey: 'name', width: 140, fixed: 'left', render: (_val: string, row: typeof detailTableData[0]) => (<div><div style={{ fontWeight: 500 }}>{row.name}</div><div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{row.id}</div></div>) },
  { label: '城市', dataKey: 'city', width: 80 },
  { label: '区域', dataKey: 'region', width: 90 },
  { label: '面积', dataKey: 'area', width: 80 },
  { label: '品牌', dataKey: 'brand', width: 100 },
  { label: '月营收', dataKey: 'revenue', width: 100 },
  { label: '开业日期', dataKey: 'openDate', width: 110 },
  { label: '合同类型', dataKey: 'contract', width: 90 },
  { label: '店长', dataKey: 'manager', width: 80 },
  { label: '状态', dataKey: 'status', width: 90, render: (val: string) => <Tag theme={statusThemeMap[val] || 'blue'} type="bordered" size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 140, fixed: 'right', render: () => (<span style={{ display: 'inline-flex', gap: 4 }}><Button.Link type="primary" shape="text">编辑</Button.Link><Button.Link type="primary" shape="text">详情</Button.Link><Button.Link type="primary" shape="text">关店</Button.Link></span>) },
];

const storeData = [
  { key: '1', img: 'https://picsum.photos/seed/s1/40/40', name: '春熙路旗舰店', city: '成都', area: '120㎡', revenue: '¥58.6万', status: '营业中' },
  { key: '2', img: 'https://picsum.photos/seed/s2/40/40', name: '国贸CBD店', city: '北京', area: '85㎡', revenue: '¥42.3万', status: '营业中' },
  { key: '3', img: 'https://picsum.photos/seed/s3/40/40', name: '南京路概念店', city: '上海', area: '150㎡', revenue: '¥73.1万', status: '营业中' },
  { key: '4', img: 'https://picsum.photos/seed/s4/40/40', name: '天河城店', city: '广州', area: '90㎡', revenue: '¥35.8万', status: '装修中' },
  { key: '5', img: 'https://picsum.photos/seed/s5/40/40', name: '西湖银泰店', city: '杭州', area: '75㎡', revenue: '¥28.4万', status: '营业中' },
];

const storeColumns = [
  {
    label: '门店', dataKey: 'name', width: 180,
    render: (_val: string, row: typeof storeData[0]) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={row.img} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: '#f5f5f5' }} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 'var(--fs-14)' }}>{row.name}</div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{row.city}</div>
        </div>
      </div>
    ),
  },
  { label: '面积', dataKey: 'area', width: 100 },
  { label: '月营收', dataKey: 'revenue', width: 120 },
  { label: '状态', dataKey: 'status', width: 100, render: (val: string) => <Tag theme={val === '营业中' ? 'blue' : 'orange'} type="bordered" size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 120, render: () => (<span style={{ display: 'inline-flex', gap: 8 }}><Button.Link type="primary" shape="text">详情</Button.Link><Button.Link type="primary" shape="text">编辑</Button.Link></span>) },
];

/* ═══ 变体组件（分页器与表格放在同一个 dash-card 内） ═══ */

function TextTableVariant() {
  const [current, setCurrent] = useState(1);
  return (
    <div className="dash-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--gap-module)' }}>
        <span style={{ fontSize: 'var(--fs-14)', fontWeight: 500, color: 'var(--text-1)' }}>门店明细</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-elem)' }}>
          <Radio.Group defaultValue="revenue" size="small">
            <Radio.Button value="revenue">按月营收</Radio.Button>
            <Radio.Button value="openDate">按开业日期</Radio.Button>
            <Radio.Button value="area">按面积</Radio.Button>
          </Radio.Group>
          <Button size="small" icon="export-o">导出</Button>
          <Button size="small" type="primary" icon="add">新增门店</Button>
        </div>
      </div>
      {/* 表格区擑满剩余高度，使分页器始终贴卡片底部 */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Table columns={detailTableColumns} data={detailTableData} rowKey="key" pagination={false} useSticky scroll={{ x: 1400 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--gap-module)' }}>
        <Pagination current={current} total={detailTableData.length} pageSize={10} onChange={setCurrent} showTotal showJumper />
      </div>
    </div>
  );
}

function ImageTableVariant() {
  const [current, setCurrent] = useState(1);
  return (
    <div className="dash-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--gap-module)' }}>
        <span style={{ fontSize: 'var(--fs-14)', fontWeight: 500, color: 'var(--text-1)' }}>门店列表</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-elem)' }}>
          <Radio.Group defaultValue="revenue" size="small">
            <Radio.Button value="revenue">按月营收</Radio.Button>
            <Radio.Button value="openDate">按开业日期</Radio.Button>
            <Radio.Button value="area">按面积</Radio.Button>
          </Radio.Group>
          <Button size="small" icon="export-o">导出</Button>
          <Button size="small" type="primary" icon="add">新增门店</Button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Table columns={storeColumns} data={storeData} rowKey="key" pagination={false} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--gap-module)' }}>
        <Pagination current={current} total={storeData.length} pageSize={10} onChange={setCurrent} showTotal showJumper />
      </div>
    </div>
  );
}

function TabTableVariant() {
  const [current, setCurrent] = useState(1);
  const [activeFilter, setActiveFilter] = useState('全部业务线');
  const { theme } = useTheme();
  // 选中态强调色随全局主题联动：工具蓝主题用 blue，美团黄主题用 yellow（更贴合品牌色，且视觉上比 blue 更醒目）。
  const activeTagTheme = theme === 'brand-yellow' ? 'yellow' : 'blue';
  return (
    <div className="dash-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* 内联 G-5 切换tab */}
      <Tabs defaultActiveKey="all">
        <Tabs.TabPane key="all" label="全部" />
        <Tabs.TabPane key="achieved" label="已达成" />
        <Tabs.TabPane key="in_progress" label="进行中" />
        <Tabs.TabPane key="behind" label="落后" />
        <Tabs.TabPane key="critical" label="严重落后" />
      </Tabs>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingBottom: 12, flexWrap: 'wrap' }}>
        {/* 选中态：浅色面型 type="pure-bordered"，theme 随主题联动（工具蓝=blue，美团黄=yellow）。
            未选中态：theme="gray"（默认 type="bordered"，灰色线型标签）。
            两者都用默认矩形（不加 shape="circle"）。
            点击任意标签即切换选中态：activeFilter 记录当前选中的标签文案，点击时 setActiveFilter(label)，
            被点击的标签变为选中态（有颜色），其余标签自动回落为未选中态（灰色线型）。
            注意：MTD Tag 的 type="pure" 实际渲染为深色纯色实底，不是浅色面型，选中态禁止使用 type="pure"。 */}
        {['全部业务线', '到店', '外卖', '酒旅', '买菜', '优选'].map((label) => (
          label === activeFilter ? (
            <Tag
              key={label}
              type="pure-bordered"
              theme={activeTagTheme}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter(label)}
            >
              {label}
            </Tag>
          ) : (
            <Tag
              key={label}
              theme="gray"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter(label)}
            >
              {label}
            </Tag>
          )
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Table columns={detailTableColumns} data={detailTableData} rowKey="key" pagination={false} useSticky scroll={{ x: 1400 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--gap-module)' }}>
        <Pagination current={current} total={detailTableData.length} pageSize={10} onChange={setCurrent} showTotal showJumper />
      </div>
    </div>
  );
}

/* ═══ 变体导出 ═══ */

export const g4Variants = [
  { name: '纯文字表格', render: () => <TextTableVariant /> },
  { name: '带图片列', render: () => <ImageTableVariant /> },
  { name: '带切换tab', render: () => <TabTableVariant /> },
];
