import { useState } from 'react';
import { Button, Select, Card, Radio, Breadcrumb, Table, Tabs } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';
import ModuleWrapper from '../../components/ModuleWrapper';
import { useG2Chart } from '../../hooks/useG2Chart';
import DigestCard from '../../components/DigestCard';
import { g4Variants } from '../../components/G4DataTable';
import { chartMono, getChartMonoScale } from '../../lib/chartTokens';

/* ─── 数据 ─── */

const metrics = [
  { label: 'GMV', value: '1,258.6万', change: '+12.3%', trend: 'up' },
  { label: '订单数', value: '23,456', change: '+8.7%', trend: 'up' },
  { label: '客单价', value: '536', change: '-2.1%', trend: 'down' },
  { label: '转化率', value: '4.8%', change: '+0.5%', trend: 'up' },
];

const trendData = [
  { date: '03-01', value: 320, type: '本周' }, { date: '03-02', value: 410, type: '本周' },
  { date: '03-03', value: 380, type: '本周' }, { date: '03-04', value: 520, type: '本周' },
  { date: '03-05', value: 490, type: '本周' }, { date: '03-06', value: 610, type: '本周' },
  { date: '03-07', value: 580, type: '本周' },
  { date: '03-01', value: 280, type: '上周' }, { date: '03-02', value: 350, type: '上周' },
  { date: '03-03', value: 320, type: '上周' }, { date: '03-04', value: 430, type: '上周' },
  { date: '03-05', value: 410, type: '上周' }, { date: '03-06', value: 500, type: '上周' },
  { date: '03-07', value: 470, type: '上周' },
];

const rankData = [
  { name: '美食餐饮', value: 3280 }, { name: '生活服务', value: 2650 },
  { name: '休闲娱乐', value: 2100 }, { name: '丽人健康', value: 1820 },
  { name: '教育培训', value: 1560 }, { name: '酒店旅游', value: 1230 },
  { name: '购物零售', value: 980 }, { name: '医疗健康', value: 760 },
];

const bizOptions = [
  { label: '全部业务线', value: '' },
  { label: '到店', value: 'daodian' },
  { label: '外卖', value: 'waimai' },
  { label: '酒旅', value: 'jiulv' },
];

/* ─── 图表组件 ─── */

function TrendChart({ granularity }: { granularity: string }) {
  const containerRef = useG2Chart(() => ({
    type: 'line',
    data: trendData,
    encode: { x: 'date', y: 'value', color: 'type' },
    style: { shape: 'smooth' },
    scale: { color: { range: [chartMono.base, chartMono.weak] } },  /* 主题色 + 单色色阶淡色 */
    axis: {
      x: { labelFontSize: 11, line: true, lineStroke: 'rgba(17,25,37,.10)' },
      y: { labelFontSize: 11, gridStroke: 'rgba(17,25,37,.06)', labelFormatter: (v: number) => `${v}万` },
    },
    legend: { color: { position: 'bottom' } },
  }), [granularity]);
  return <div ref={containerRef} style={{ width: '100%', height: 260 }} />;
}

function RankChart() {
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: rankData,
    encode: { x: 'name', y: 'value', color: 'name' },
    transform: [{ type: 'sortX', by: 'y', reverse: true }],
    coordinate: { transform: [{ type: 'transpose' }] },
    scale: { color: { range: getChartMonoScale() } },  /* 单色色阶：Blue-6 → Blue-1 */
    axis: {
      x: { labelFontSize: 11 },
      y: { labelFontSize: 11, gridStroke: 'rgba(17,25,37,.06)' },
    },
    legend: false,
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: 260 }} />;
}

/* ─── 主页面 ─── */

export default function AiSummaryDashboard() {
  const [granularity, setGranularity] = useState('day');

  return (
    <PageLayout title="AI 总结看板">
      {/* 面包屑导航 */}
      <Breadcrumb separator="/">
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>数据看板</Breadcrumb.Item>
        <Breadcrumb.Item>AI 总结</Breadcrumb.Item>
      </Breadcrumb>


      {/* D-11 AI 摘要卡 — 四种变体 */}
      <ModuleWrapper
        moduleId="D-11 AI诊断摘要卡"
        tooltipPlacement="bottom"
        variants={[
          {
            name: '智能洞察',
            render: () => (
              <DigestCard
                variant="insight"
                title="智能洞察"
                hint="由大模型基于公开信息生成，仅供参考"
                richContent={[
                  { text: '您好！上周整体经营状况表现平稳，但暴露了"' },
                  { text: '高流量、低转化', bold: true },
                  { text: '"的核心问题。虽然访客数有所提升，但付费流量的效率有待优化，同时老客的复购动力不足。建议针对购买超过30天未复购的老客，发起一次"会员专享"上新或专属优惠券活动。' },
                ]}
              />
            ),
          },
          {
            name: '列表型',
            render: () => (
              <DigestCard
                variant="list"
                items={[
                  { label: '经营诊断', text: '营业收入 1,258.6 万元，完成月度目标 85.4%，订单数 23,456 单，整体经营稳步增长；折扣率（12.5%）与差评率（1.2%）略超目标，需关注成本管控与口碑优化。' },
                  { label: '风险提醒', text: '当前全品类共有 58 条预警，其中一级预警占比 31%（18条），涉及 24 家门店，建议重点关注华东区域的营收下滑与食安风险，需在 48 小时内完成整改。' },
                  { label: '任务提醒', text: '当前共下发 76 项任务，执行中 23 项，已闭环 45 项，整体闭环率 66%；西北大区闭环率最低(38%)，成都春熙路店仅 20%，建议督促相关责任人尽快推进落实。' },
                ]}
              />
            ),
          },
          {
            name: '卡片型',
            render: () => (
              <DigestCard
                variant="cards"
                items={[
                  { label: '经营诊断', text: '营业收入 1,258.6 万元，完成月度目标 85.4%，订单数 23,456 单，整体经营稳步增长；折扣率（12.5%）与差评率（1.2%）略超目标，需关注成本管控与口碑优化。' },
                  { label: '风险提醒', text: '当前全品类共有 58 条预警，其中一级预警占比 31%（18条），涉及 24 家门店，建议重点关注华东区域的营收下滑与食安风险，需在 48 小时内完成整改。' },
                  { label: '任务提醒', text: '当前共下发 76 项任务，执行中 23 项，已闭环 45 项，整体闭环率 66%；西北大区闭环率最低(38%)，成都春熙路店仅 20%，建议督促相关责任人尽快推进落实。' },
                ]}
              />
            ),
          },
          {
            name: '标的结论',
            render: () => (
              <DigestCard
                variant="summary"
                title="标的结论"
                tagText="强烈建议推进开店"
                tagType="success"
                richContent={[
                  { text: '项目位在朝阳区朝青板块的高密社区型商圈，人口密度24,000，各圈层人数基本盘优秀（1km人数1,309，500m人数735）。商圈由大型商场伴数个小型商场构成的半封闭型商圈，家庭居住氛围浓厚，为Ⅱ级商圈，城市排名2/235。项目落位在"流量中心"，L4*L6街角+地铁上盖物业，在周边居民的出行动线上，门前自然流量丰富（周末步行3133，骑行16530）；周边竞争温和，近距离主要竞争对手为物美大卖场超市（原物美，6.8w），5km处有CHSNB（日商8.2w），落位B1可达性很差。\n综上' },
                  { text: '建议推进开店', bold: true },
                  { text: '，但需要注意如下风险：\n1、商铺位于物业深处，进店动线40m左右，需要增加大量的曝光/指引资源，弥补可达不足。\n2、新交付商业，一楼体量不大，仅有星巴克、麦当劳2个共生品牌，未来聚客能力存在不确定性。' },
                ]}
              />
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
                        fill={m.trend === 'up' ? 'rgba(0,168,84,0.12)' : 'rgba(255,31,31,0.12)'}  /* Green-5 12%, Red-5 12% */
                        stroke="none"
                      />
                      <polyline
                        points={m.trend === 'up' ? '0,20 24,16 48,12 72,8 96,5 120,2' : '0,2 24,6 48,12 72,16 96,19 120,22'}
                        fill="none"
                        stroke={m.trend === 'up' ? '#00A854' : '#FF1F1F'}  /* Green-5, Red-5 */
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

      {/* D-3 趋势图 + D-9 排名占比条形 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
        <ModuleWrapper
          moduleId="D-3 折线图"
          variants={[
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>GMV 趋势</span><Radio.Group value={granularity} onChange={(val) => setGranularity(val as string)} size="small"><Radio.Button value="day">日</Radio.Button><Radio.Button value="week">周</Radio.Button><Radio.Button value="month">月</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><TrendChart granularity={granularity} /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>GMV 趋势</span><Select defaultValue="" options={bizOptions} placeholder="全部业务线" size="small" style={{ width: 120 }} /></div>}>
                  <div className="card-body-area"><TrendChart granularity={granularity} /></div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>GMV 趋势</span><Button.Link type="primary" shape="text">详情</Button.Link></div>}>
                  <div className="card-body-area"><TrendChart granularity={granularity} /></div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>GMV 趋势</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>环比 +12.3%</span></div>}>
                  <div className="card-body-area"><TrendChart granularity={granularity} /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>GMV 趋势</span></div>}>
                  <div className="card-body-area"><TrendChart granularity={granularity} /></div>
                </Card>
              ),
            },
          ]}
        />
        <ModuleWrapper
          moduleId="D-9 排名条形图"
          variants={[
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品类 TOP8 排名</span></div>}>
                  <div className="card-body-area"><RankChart /></div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品类 TOP8 排名</span><Button.Link type="primary" shape="text">全部</Button.Link></div>}>
                  <div className="card-body-area"><RankChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品类 TOP8 排名</span><Radio.Group defaultValue="gmv" size="small"><Radio.Button value="gmv">GMV</Radio.Button><Radio.Button value="orders">订单</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><RankChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品类 TOP8 排名</span><Select defaultValue="gmv" size="small" style={{ width: 100 }}><Select.Option value="gmv">GMV</Select.Option><Select.Option value="orders">订单数</Select.Option><Select.Option value="aov">客单价</Select.Option><Select.Option value="rate">转化率</Select.Option></Select></div>}>
                  <div className="card-body-area"><RankChart /></div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品类 TOP8 排名</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>按GMV排序</span></div>}>
                  <div className="card-body-area"><RankChart /></div>
                </Card>
              ),
            },
          ]}
        />
      </div>

{/* G-4 数据表格 */}
<ModuleWrapper moduleId="G-4 数据表格" variants={g4Variants} />
    </PageLayout>
  );
}
