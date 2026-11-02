import { Select, Radio, Table, Tag, Card, Button, Input, DatePicker } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';
import ModuleWrapper from '../../components/ModuleWrapper';
import { g4Variants } from '../../components/G4DataTable';

/* ─── 数据 ─── */

const tableData = [
  { key: '1', dept: '华北区', target: '¥350万', actual: '¥298万', rate: '85.1%', status: '进行中' },
  { key: '2', dept: '华东区', target: '¥280万', actual: '¥265万', rate: '94.6%', status: '进行中' },
  { key: '3', dept: '华南区', target: '¥200万', actual: '¥201万', rate: '100.5%', status: '已达成' },
  { key: '4', dept: '西南区', target: '¥100万', actual: '¥72万', rate: '72.0%', status: '落后' },
  { key: '5', dept: '西北区', target: '¥70万', actual: '¥20万', rate: '28.6%', status: '严重落后' },
];

const deptOptions = [
  { label: '全部', value: '' },
  { label: '华北区', value: '华北区' },
  { label: '华东区', value: '华东区' },
  { label: '华南区', value: '华南区' },
  { label: '西南区', value: '西南区' },
  { label: '西北区', value: '西北区' },
];

const bizLineOptions = [
  { label: '全部业务线', value: '' },
  { label: '到店', value: 'daodian' },
  { label: '外卖', value: 'waimai' },
  { label: '酒旅', value: 'jiulv' },
  { label: '买菜', value: 'maicai' },
  { label: '优选', value: 'youxuan' },
];

const goalTypeOptions = [
  { label: '全部目标', value: '' },
  { label: '销售额', value: 'sales' },
  { label: '新客获取', value: 'new_customer' },
  { label: '复购率', value: 'repurchase' },
  { label: '客户满意度', value: 'satisfaction' },
  { label: '成本控制', value: 'cost' },
];

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '已达成', value: 'achieved' },
  { label: '进行中', value: 'in_progress' },
  { label: '落后', value: 'behind' },
  { label: '严重落后', value: 'critical' },
];

const metrics = [
  { label: '总目标', value: '¥1,000万', change: '', trend: '' },
  { label: '已完成', value: '¥856万', change: '+12.3%', trend: 'up' },
  { label: '完成率', value: '85.6%', change: '+3.2%', trend: 'up' },
  { label: '剩余缺口', value: '¥144万', change: '-18.5%', trend: 'down' },
];

/* Tag 颜色策略：默认蓝色，仅用蓝/绿/橙三种，不使用红色 */
const statusThemeMap: Record<string, string> = {
  '已达成': 'green',
  '进行中': 'blue',
  '落后': 'orange',
  '严重落后': 'orange',
};

const tableColumns = [
  { label: '部门', dataKey: 'dept', width: 120 },
  { label: '目标值', dataKey: 'target', width: 120 },
  { label: '实际值', dataKey: 'actual', width: 120 },
  { label: '完成率', dataKey: 'rate', width: 100 },
  { label: '状态', dataKey: 'status', width: 120, render: (val: string) => <Tag theme={statusThemeMap[val] || 'blue'} size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 120, render: () => (<span style={{ display: 'inline-flex', gap: 8 }}><Button.Link type="primary" shape="text">详情</Button.Link><Button.Link type="primary" shape="text">催办</Button.Link></span>) },
];

/* ─── 主页面 ─── */

export default function FilterTableDashboard() {

  return (
    <PageLayout title="筛选+表格看板">
      {/* G-3 看板筛选器栏 — 简单版/复杂版切换，默认复杂版 */}
      <ModuleWrapper
        moduleId="G-3 看板筛选器栏"
        tooltipPlacement="bottom"
        defaultVariant={1}
        variants={[
          {
            name: '简单版',
            render: () => (
              <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-module)', flexWrap: 'wrap' }}>
                <Radio.Group defaultValue="month">
                  <Radio.Button value="month">本月</Radio.Button>
                  <Radio.Button value="quarter">本季</Radio.Button>
                  <Radio.Button value="year">本年</Radio.Button>
                </Radio.Group>
                <Select options={deptOptions} placeholder="全部部门" style={{ width: 140 }} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--gap-elem)' }}>
                  <Button>重置</Button>
                  <Button type="primary">查询</Button>
                </div>
              </div>
            ),
          },
          {
            name: '复杂版',
            render: () => (
              <Card style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-module)', flexWrap: 'wrap' }}>
                  <Radio.Group defaultValue="month">
                    <Radio.Button value="month">本月</Radio.Button>
                    <Radio.Button value="quarter">本季</Radio.Button>
                    <Radio.Button value="year">本年</Radio.Button>
                  </Radio.Group>
                  <DatePicker type="daterange" placeholder={['开始日期', '结束日期']} style={{ width: 240 }} />
                  <Select options={deptOptions} placeholder="全部部门" style={{ width: 140 }} />
                  <Select options={bizLineOptions} placeholder="全部业务线" style={{ width: 140 }} />
                  <Select options={goalTypeOptions} placeholder="全部目标" style={{ width: 140 }} />
                  <Select options={statusOptions} placeholder="全部状态" style={{ width: 140 }} />
                  <Input placeholder="搜索关键词" style={{ width: 180 }} />
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--gap-elem)' }}>
                    <Button>重置</Button>
                    <Button type="primary">查询</Button>
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
      />

      {/* D-1 指标卡片组 — 支持 3 种变体切换 */}
      <ModuleWrapper
        moduleId="D-1 指标卡片组"
        variants={[
          {
            name: '纯大数字',
            render: () => (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                {metrics.map((m) => (
                  <Card key={m.label} style={{ marginBottom: 0 }}>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)' }}>{m.label}</span>
                    <div style={{ margin: '8px 0 4px' }}>
                      <span style={{ fontSize: 'var(--fs-30)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
                    </div>
                    {m.change && (
                      <span style={{ fontSize: 'var(--fs-12)', fontWeight: 500, color: m.trend === 'up' ? '#00A854' : '#FF1F1F' }}>
                        {m.trend === 'up' ? '↑' : '↓'} {m.change}
                      </span>
                    )}
                  </Card>
                ))}
              </div>
            ),
          },
          {
            name: '带迷你图',
            render: () => (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                {metrics.map((m) => (
                  <Card key={m.label} style={{ marginBottom: 0 }}>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{m.label}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '8px 0 4px' }}>
                      <span style={{ fontSize: 'var(--fs-30)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
                      {m.change && (
                        <span style={{ fontSize: 'var(--fs-12)', fontWeight: 500, color: m.trend === 'up' ? '#00A854' : '#FF1F1F' }}>
                          {m.trend === 'up' ? '↑' : '↓'} {m.change}
                        </span>
                      )}
                    </div>
                    <svg width="100%" height="24" viewBox="0 0 120 24" preserveAspectRatio="none" style={{ display: 'block', marginTop: 4 }}>
                      <polygon
                        points={m.trend === 'up' ? '0,20 24,16 48,12 72,8 96,5 120,2 120,24 0,24' : '0,2 24,6 48,12 72,16 96,19 120,22 120,24 0,24'}
                        fill={m.trend === 'up' ? 'rgba(0,168,84,0.12)' : 'rgba(245,72,59,0.12)'}
                        stroke="none"
                      />
                      <polyline
                        points={m.trend === 'up' ? '0,20 24,16 48,12 72,8 96,5 120,2' : '0,2 24,6 48,12 72,16 96,19 120,22'}
                        fill="none"
                        stroke={m.trend === 'up' ? '#00A854' : '#FF1F1F'}
                        strokeWidth="1.5"
                      />
                    </svg>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            name: '带操作',
            render: () => (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                {metrics.map((m) => (
                  <Card key={m.label} style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{m.label}</span>
                      <Button.Link type="primary" shape="text" style={{ padding: 0, height: 'auto', fontSize: 'var(--fs-12)' }}>查看</Button.Link>
                    </div>
                    <div style={{ margin: '8px 0 4px' }}>
                      <span style={{ fontSize: 'var(--fs-30)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
                    </div>
                    {m.change && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 'var(--fs-12)', fontWeight: 500, color: m.trend === 'up' ? '#00A854' : '#FF1F1F' }}>
                          {m.trend === 'up' ? '↑' : '↓'} {m.change}
                        </span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ),
          },
        ]}
      />

{/* G-4 数据表格（主体，带操作列） */}
<ModuleWrapper moduleId="G-4 数据表格" variants={g4Variants} />
    </PageLayout>
  );
}
