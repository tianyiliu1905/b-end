import { useState } from 'react';
import { Select, Button, Card, Table, Radio, Icon, Tag, Tabs } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';
import ModuleWrapper from '../../components/ModuleWrapper';
import { useG2Chart } from '../../hooks/useG2Chart';
import { g4Variants } from '../../components/G4DataTable';
import { chartPalette, chartMono, chartTrend, getChartCategoricalPalette, getChartMonoScale } from '../../lib/chartTokens';

/* ─── 数据 ─── */

// D-1 筛选器数据
const timeOptions = [
  { label: '今年', value: 'year' },
  { label: '上年', value: 'last' },
  { label: '近3个月', value: '3m' },
  { label: '近6个月', value: '6m' },
  { label: '自定义', value: 'custom' },
];

const regionOptions = [
  { label: '全国', value: '' },
  { label: '华北区', value: 'huabei' },
  { label: '华东区', value: 'huadong' },
  { label: '华南区', value: 'huanan' },
  { label: '西南区', value: 'xinan' },
  { label: '东南区', value: 'dongnan' },
];

// D-3 指标卡片组
// badge: 右上角内容，可以是 icon 名称（渲染为 Icon），也可以是一段文字
const metrics = [
  { label: '营业门店数', value: '2,668', change: '+15.5%', trend: 'up', vs: '2,310', badge: 'home-o' },
  { label: '筹备门店数', value: '1,200', change: '+8.4%', trend: 'up', vs: '1,107', badge: 'avatar-group' },
  { label: '候选点位数', value: '1,008', change: '-10.5%', trend: 'down', vs: '1,127', badge: 'location-o' },
  { label: '新开门店数', value: '1,480', change: '+4.4%', trend: 'up', vs: '1,418', badge: '本月' },
];

// D-4 年度开店目标（环形进度）
const annualTarget = { actual: 2280, target: 3000 };

// D-5 全国跟随品牌新开趋势
const brandTrendData = [
  ...['1月', '3月', '5月', '7月', '9月', '11月'].flatMap((m) => [
    { month: m, value: 400 + Math.floor(Math.random() * 1600), brand: '富王茶泰' },
    { month: m, value: 200 + Math.floor(Math.random() * 800), brand: '奈雪的茶' },
    { month: m, value: 100 + Math.floor(Math.random() * 600), brand: '茶沐青' },
  ]),
];

// D-9 铺位漏斗
const funnelData = [
  { stage: '规划点位', value: 476 },
  { stage: '勘查点位', value: 676 },
  { stage: '提报点位', value: 480 },
  { stage: '过审点位', value: 236 },
];

// D-8 区域分布数据
const regionDistData = [
  { region: '华北', value: 420 },
  { region: '华东', value: 680 },
  { region: '华南', value: 350 },
  { region: '西南', value: 280 },
  { region: '西北', value: 120 },
  { region: '东北', value: 180 },
  { region: '华中', value: 320 },
];

// D-5 全国开店趋势（柱+线 双轴）
const storeTrendData = [
  ...['1月', '3月', '5月', '7月', '9月', '11月'].flatMap((m) => [
    { month: m, value: 80 + Math.floor(Math.random() * 350), type: '营业门店数' },
    { month: m, value: 20 + Math.floor(Math.random() * 80), type: '新开门店数' },
  ]),
];

// D-8 城市等级占比
const cityLevelData = [
  { level: '一线城市', value: 22.7 },
  { level: '新一线城市', value: 26.4 },
  { level: '二线城市', value: 19.8 },
  { level: '三线城市', value: 15.1 },
  { level: '四线城市', value: 10.3 },
  { level: '五线城市', value: 5.7 },
];

// D-4 开店进度（分公司堆叠进度）
const expandProgress = [
  { branch: '华北分公司', phases: [12, 20, 28, 14, 6] },
  { branch: '华南分公司', phases: [29, 16, 11, 18, 12] },
  { branch: '西南分公司', phases: [24, 17, 11, 20, 8] },
  { branch: '东南分公司', phases: [42, 18, 9, 5, 6] },
];
const phaseLabels = ['待勘查', '勘查中', '审批中', '已通过', '已开门店'];
const phaseColors = getChartCategoricalPalette(5);  /* --chart-1 ~ --chart-5：主题色/绿/橙/蓝绿/紫 */

// G-4 门店明细表（折叠态：左固定标识列 + 横滚多列 + 右固定操作列 + sticky 表头）
const detailTableData = [
  { key: '1', id: 'ST-001', name: '春熙路旗舰店', city: '成都', region: '西南区', area: '120㎡', brand: '富王茶泰', revenue: '¥58.6万', openDate: '2023-01-15', contract: '直营', manager: '张三', status: '营业中' },
  { key: '2', id: 'ST-002', name: '国贸CBD店', city: '北京', region: '华北区', area: '85㎡', brand: '奈雪的茶', revenue: '¥42.3万', openDate: '2023-03-20', contract: '加盟', manager: '李四', status: '营业中' },
  { key: '3', id: 'ST-003', name: '南京路概念店', city: '上海', region: '华东区', area: '150㎡', brand: '茶沐青', revenue: '¥73.1万', openDate: '2023-05-10', contract: '直营', manager: '王五', status: '营业中' },
  { key: '4', id: 'ST-004', name: '天河城店', city: '广州', region: '华南区', area: '90㎡', brand: '富王茶泰', revenue: '¥35.8万', openDate: '2024-01-08', contract: '加盟', manager: '赵六', status: '装修中' },
  { key: '5', id: 'ST-005', name: '西湖银泰店', city: '杭州', region: '华东区', area: '75㎡', brand: '奈雪的茶', revenue: '¥28.4万', openDate: '2023-08-25', contract: '直营', manager: '孙七', status: '营业中' },
  { key: '6', id: 'ST-006', name: '解放碑店', city: '重庆', region: '西南区', area: '95㎡', brand: '茶沐青', revenue: '¥31.2万', openDate: '2022-11-14', contract: '加盟', manager: '周八', status: '营业中' },
];

/* Tag 颜色策略：默认蓝色，仅用蓝/橙两种，不使用红色 */
const statusThemeMap: Record<string, string> = { '营业中': 'blue', '装修中': 'orange', '筹备中': 'blue', '已关店': 'orange' };

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

// 带图片变体 — 门店数据
const storeData = [
  { key: '1', img: 'https://picsum.photos/seed/s1/40/40', name: '春熙路旗舰店', city: '成都', area: '120㎡', revenue: '¥58.6万', status: '营业中' },
  { key: '2', img: 'https://picsum.photos/seed/s2/40/40', name: '国贸CBD店', city: '北京', area: '85㎡', revenue: '¥42.3万', status: '营业中' },
  { key: '3', img: 'https://picsum.photos/seed/s3/40/40', name: '南京路概念店', city: '上海', area: '150㎡', revenue: '¥73.1万', status: '营业中' },
  { key: '4', img: 'https://picsum.photos/seed/s4/40/40', name: '天河城店', city: '广州', area: '90㎡', revenue: '¥35.8万', status: '装修中' },
  { key: '5', img: 'https://picsum.photos/seed/s5/40/40', name: '西湖银泰店', city: '杭州', area: '75㎡', revenue: '¥28.4万', status: '营业中' },
];

const storeColumns = [
  {
    label: '门店',
    dataKey: 'name',
    width: 180,
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

// D-9 TOP 门店排名（横向条形图）
const topStoreData = [
  { store: '春熙路旗舰店', value: 586000 },
  { store: '南京路概念店', value: 731000 },
  { store: '国贸CBD店', value: 423000 },
  { store: '天河城店', value: 358000 },
  { store: '西湖银泰店', value: 284000 },
  { store: '解放碑店', value: 312000 },
  { store: '中关村店', value: 256000 },
].sort((a, b) => b.value - a.value);

// D-10 散点图（门店面积 vs 月营收）
const scatterData = [
  { area: 120, revenue: 58.6, city: '成都' },
  { area: 85, revenue: 42.3, city: '北京' },
  { area: 150, revenue: 73.1, city: '上海' },
  { area: 90, revenue: 35.8, city: '广州' },
  { area: 75, revenue: 28.4, city: '杭州' },
  { area: 95, revenue: 31.2, city: '重庆' },
  { area: 110, revenue: 48.7, city: '深圳' },
  { area: 68, revenue: 22.5, city: '武汉' },
  { area: 130, revenue: 62.3, city: '南京' },
  { area: 105, revenue: 44.9, city: '长沙' },
  { area: 145, revenue: 68.2, city: '上海' },
  { area: 78, revenue: 33.5, city: '北京' },
  { area: 200, revenue: 92.4, city: '成都' },
  { area: 55, revenue: 18.7, city: '武汉' },
  { area: 165, revenue: 78.3, city: '深圳' },
  { area: 88, revenue: 37.1, city: '杭州' },
  { area: 135, revenue: 55.9, city: '广州' },
  { area: 72, revenue: 26.8, city: '重庆' },
  { area: 180, revenue: 85.6, city: '南京' },
  { area: 98, revenue: 41.2, city: '长沙' },
  { area: 115, revenue: 52.1, city: '北京' },
  { area: 62, revenue: 19.8, city: '杭州' },
  { area: 142, revenue: 64.5, city: '上海' },
  { area: 82, revenue: 30.4, city: '成都' },
  { area: 170, revenue: 81.7, city: '深圳' },
];

// D-3 面积图（月度营收趋势）
const areaChartData = [
  { month: '1月', value: 186 },
  { month: '2月', value: 215 },
  { month: '3月', value: 347 },
  { month: '4月', value: 298 },
  { month: '5月', value: 462 },
  { month: '6月', value: 531 },
  { month: '7月', value: 495 },
  { month: '8月', value: 578 },
  { month: '9月', value: 643 },
  { month: '10月', value: 612 },
  { month: '11月', value: 689 },
  { month: '12月', value: 742 },
];

// D-12 雷达图（门店综合评分）
const radarData = [
  { dimension: '营收', value: 85 },
  { dimension: '客流', value: 72 },
  { dimension: '好评率', value: 91 },
  { dimension: '翻台率', value: 68 },
  { dimension: '员工满意', value: 78 },
  { dimension: '环境评分', value: 88 },
];

// D-13 水波进度（年度营收目标）
const revenueTarget = { actual: 4280, target: 5500 };

// D-14 热力图（每日各时段客流）
const heatmapData: { day: string; hour: string; value: number }[] = [];
const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const hours = ['10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时'];
days.forEach(day => {
  hours.forEach(hour => {
    heatmapData.push({ day, hour, value: Math.floor(Math.random() * 100) });
  });
});

// D-15 玫瑰图（品牌门店分布）
const roseData = [
  { brand: '富王茶泰', value: 680 },
  { brand: '奈雪的茶', value: 520 },
  { brand: '茶沐青', value: 380 },
  { brand: '瑞幸咖啡', value: 290 },
  { brand: '星巴克', value: 240 },
  { brand: '蜜雪冰城', value: 160 },
];


/* ─── 图表组件 ─── */

function BrandTrendChart() {
  const containerRef = useG2Chart(() => ({
    type: 'line',
    data: brandTrendData,
    encode: { x: 'month', y: 'value', color: 'brand' },
    style: { shape: 'smooth' },
    scale: { color: { range: [chartPalette.c1, chartPalette.c3, chartPalette.c2] } },  /* --chart-1/3/2：主题色、橙、绿 */
    axis: {
      x: { labelFontSize: 11, line: true, lineStroke: 'rgba(17,25,37,.10)' },
      y: { labelFontSize: 11, gridStroke: 'rgba(17,25,37,.06)' },
    },
    legend: { color: { position: 'bottom' } },
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

function FunnelChart() {
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: funnelData,
    encode: { x: 'stage', y: 'value', color: 'stage', shape: 'funnel' },
    transform: [{ type: 'symmetryY' }],
    coordinate: { transform: [{ type: 'transpose' }] },
    scale: { color: { range: getChartCategoricalPalette(4) } },  /* --chart-1~4 */
    labels: [{ text: 'value', position: 'inside', fill: '#fff', fontSize: 13, fontWeight: 600 }],
    axis: { x: { labelFontSize: 11 }, y: false },
    legend: false,
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

function RegionBarChart() {
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: regionDistData,
    encode: { x: 'region', y: 'value', color: 'region' },
    scale: { color: { range: [...getChartMonoScale(), chartPalette.c2, chartPalette.c3] } },  /* 单色色阶 + --chart-2/3 */
    axis: {
      x: { labelFontSize: 11 },
      y: { labelFontSize: 11, gridStroke: 'rgba(17,25,37,.06)' },
    },
    legend: false,
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

function StoreTrendChart() {
  const containerRef = useG2Chart(() => ({
    type: 'view',
    children: [
      {
        type: 'interval',
        data: storeTrendData.filter(d => d.type === '营业门店数'),
        encode: { x: 'month', y: 'value' },
        style: { fill: chartPalette.c1, fillOpacity: 0.8 },
        axis: {
          x: { labelFontSize: 11 },
          y: { labelFontSize: 11, gridStroke: 'rgba(17,25,37,.06)', title: '门店数' },
        },
      },
      {
        type: 'line',
        data: storeTrendData.filter(d => d.type === '新开门店数'),
        encode: { x: 'month', y: 'value' },
        style: { stroke: chartPalette.c3, lineWidth: 2 },
        axis: { y: { position: 'right', title: '新开数', labelFontSize: 11 } },
      },
    ],
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

function CityLevelPieChart() {
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: cityLevelData,
    encode: { y: 'value', color: 'level' },
    transform: [{ type: 'stackY' }],
    coordinate: { type: 'theta', outerRadius: 0.85, innerRadius: 0.55 },
    scale: { color: { range: getChartCategoricalPalette(6) } },  /* --chart-1~6 */
    labels: [],
    legend: { color: { position: 'bottom' } },
    tooltip: { items: [{ channel: 'y', valueFormatter: (v: number) => `${v}%` }] },
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

/** 每个灰色卡片内的小 Donut，表示该指标在总量中的占比 */
function MiniDonutChart({ value, total, color }: { value: number; total: number; color: string }) {
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: [
      { type: 'value', val: value },
      { type: 'rest', val: total - value },
    ],
    encode: { y: 'val', color: 'type' },
    transform: [{ type: 'stackY' }],
    coordinate: { type: 'theta', outerRadius: 0.92, innerRadius: 0.7 },
    scale: { color: { domain: ['value', 'rest'], range: [color, '#f0f1f2'] } },
    legend: false,
    labels: [],
    animate: false,
    interaction: { tooltip: false },
  }), [value, total, color]);
  return <div ref={containerRef} style={{ width: 80, height: 80, flexShrink: 0 }} />;
}

function AnnualTargetChart() {
  const pct = Math.round((annualTarget.actual / annualTarget.target) * 100);
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: [{ type: '完成率', value: pct }, { type: '剩余', value: 100 - pct }],
    encode: { y: 'value', color: 'type' },
    transform: [{ type: 'stackY' }],
    coordinate: { type: 'theta', outerRadius: 0.85, innerRadius: 0.7 },
    scale: { color: { range: [chartPalette.c1, '#f0f1f2'] } },
    legend: false,
    labels: [],
    animate: false,
  }), []);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={containerRef} style={{ width: '100%', height: 160 }} />
      <div style={{
        position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 'var(--fs-24)', fontWeight: 700, color: 'var(--text-1)' }}>{pct}%</div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', marginTop: 2 }}>完成率</div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 'var(--fs-12)', color: 'var(--text-2)', marginTop: 4 }}>
        实际 <b style={{ color: 'var(--text-1)' }}>{annualTarget.actual}</b> / 目标 <b style={{ color: 'var(--text-1)' }}>{annualTarget.target}</b>
      </div>
    </div>
  );
}

// D-9 横向排名条形图
function TopStoreBarChart() {
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: topStoreData,
    encode: { x: 'store', y: 'value', color: 'store' },
    coordinate: { transform: [{ type: 'transpose' }] },
    scale: { color: { range: getChartMonoScale() } },  /* 单色色阶：Blue-6 → Blue-1 */
    axis: {
      x: { title: false, labelFontSize: 11 },
      y: { title: false, labelFontSize: 11, labelFormatter: (v: number) => `¥${(v / 10000).toFixed(0)}万` },
    },
    legend: false,
    labels: [{ text: 'value', position: 'right', fontSize: 11, formatter: (v: number) => `¥${(v / 10000).toFixed(1)}万` }],
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// D-10 散点图
function ScatterChart() {
  const containerRef = useG2Chart(() => ({
    type: 'point',
    data: scatterData,
    encode: { x: 'area', y: 'revenue', color: 'city', shape: 'point', size: 'revenue' },
    scale: {
      x: { nice: true },
      y: { nice: true },
      size: { range: [4, 20] },
      color: { range: getChartCategoricalPalette() },  /* --chart-1~7：7色分类色板 */
    },
    style: { fillOpacity: 0.75, stroke: '#fff', lineWidth: 1 },
    axis: {
      x: { title: '面积 (㎡)', labelFontSize: 11, grid: true, gridStroke: 'rgba(17,25,37,.06)' },
      y: { title: '月营收 (万)', labelFontSize: 11, grid: true, gridStroke: 'rgba(17,25,37,.06)' },
    },
    legend: { color: { position: 'bottom' }, size: false },
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// D-3 面积图
function AreaChart() {
  const containerRef = useG2Chart(() => ({
    type: 'area',
    data: areaChartData,
    encode: { x: 'month', y: 'value' },
    style: { fill: `linear-gradient(-90deg, ${chartPalette.c1}40 0%, ${chartPalette.c1}05 100%)`, shape: 'smooth' },
    line: { style: { stroke: chartPalette.c1, lineWidth: 2 } },
    axis: {
      x: { title: false, labelFontSize: 11, line: true, lineStroke: 'rgba(17,25,37,.10)' },
      y: { title: false, labelFontSize: 11, gridStroke: 'rgba(17,25,37,.06)', labelFormatter: (v: number) => `¥${v}万` },
    },
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// D-12 雷达图
function RadarChart() {
  const containerRef = useG2Chart(() => ({
    type: 'area',
    data: radarData,
    encode: { x: 'dimension', y: 'value' },
    coordinate: { type: 'polar' },
    style: { fill: `${chartPalette.c1}40`, stroke: chartPalette.c1, lineWidth: 2 },
    axis: {
      x: { grid: true, gridStroke: 'rgba(17,25,37,.08)', labelFontSize: 11 },
      y: { grid: true, gridStroke: 'rgba(17,25,37,.08)', label: false, tickCount: 5 },
    },
    scale: { y: { domainMin: 0, domainMax: 100 } },
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// D-13 水波球（Liquid）
function LiquidGauge() {
  const ratio = revenueTarget.actual / revenueTarget.target; // 0~1
  const containerRef = useG2Chart(() => ({
    type: 'liquid',
    data: ratio,
    style: { fill: chartPalette.c1, stroke: chartPalette.c1, outlineBorder: 4, outlineDistance: 6, waveLength: 128, textFill: '#fff', textFontSize: 20, textFontWeight: 700, contentText: `${(ratio * 100).toFixed(2)} %` },
    axis: false,
    legend: false,
    tooltip: false,
  }), []);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={containerRef} style={{ width: 160, height: 160 }} />
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)' }}>
          实际 <b>¥{revenueTarget.actual}万</b> / 目标 <b>¥{revenueTarget.target}万</b>
        </div>
      </div>
    </div>
  );
}

// D-14 热力图
function HeatmapChart() {
  const containerRef = useG2Chart(() => ({
    type: 'cell',
    data: heatmapData,
    encode: { x: 'hour', y: 'day', color: 'value' },
    scale: { color: { type: 'linear', range: [...getChartMonoScale()].reverse() } },  /* 单色色阶：Blue-1 → Blue-6 */
    style: { inset: 1, radius: 2 },
    axis: {
      x: { labelFontSize: 10, position: 'bottom', title: false },
      y: { labelFontSize: 11, title: false },
    },
    legend: { color: { position: 'bottom', length: 240, labelFontSize: 10 } },
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// D-15 玫瑰图（南丁格尔）
function RoseChart() {
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: roseData,
    encode: { x: 'brand', y: 'value', color: 'brand' },
    coordinate: { type: 'polar', innerRadius: 0.2 },
    scale: { color: { range: getChartCategoricalPalette(6) } },  /* --chart-1~6 */
    axis: { x: false, y: false },
    legend: { color: { position: 'bottom' } },
    labels: [{ text: 'value', position: 'outside', fontSize: 11 }],
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}


/* ─── 主页面 ─── */

export default function OverviewDashboard() {
  const [timePeriod, setTimePeriod] = useState('year');
  const [storeTrendTab, setStoreTrendTab] = useState<'operating' | 'newOpen'>('operating');

  return (
    <PageLayout title="数据通览看板">
      {/* G-3 看板筛选器栏 — 简单版/复杂版切换，默认简单版 */}
      <ModuleWrapper
        moduleId="G-3 看板筛选器栏"
        tooltipPlacement="bottom"
        defaultVariant={0}
        variants={[
          {
            name: '简单版',
            render: () => (
              <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-module)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>时间周期：</span>
                <Radio.Group value={timePeriod} onChange={(val) => setTimePeriod(val as string)}>
                  {timeOptions.map(o => <Radio.Button key={o.value} value={o.value}>{o.label}</Radio.Button>)}
                </Radio.Group>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', marginLeft: 16 }}>目标区域：</span>
                <Select options={regionOptions} placeholder="全国" style={{ width: 120 }} />
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
                  <Radio.Group value={timePeriod} onChange={(val) => setTimePeriod(val as string)}>
                    {timeOptions.map(o => <Radio.Button key={o.value} value={o.value}>{o.label}</Radio.Button>)}
                  </Radio.Group>
                  <Select options={regionOptions} placeholder="全国" style={{ width: 120 }} />
                  <Select options={[{ label: '全部业务线', value: '' }, { label: '餐饮', value: 'food' }, { label: '零售', value: 'retail' }, { label: '服务', value: 'service' }]} placeholder="全部业务线" style={{ width: 140 }} />
                  <Select options={[{ label: '全部状态', value: '' }, { label: '营业中', value: 'open' }, { label: '筹备中', value: 'preparing' }, { label: '已关闭', value: 'closed' }]} placeholder="全部状态" style={{ width: 140 }} />
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
                      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{m.label}<Icon type="info-circle-o" style={{ fontSize: 'var(--fs-12)', color: 'var(--text-4, rgba(17,25,37,0.3))' }} /></span>
                      <div style={{ margin: '8px 0 4px' }}>
                        <span style={{ fontSize: 'var(--fs-30)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 'var(--fs-12)', fontWeight: 500, color: m.trend === 'up' ? '#00A854' : '#FF1F1F' }}>
                          {m.trend === 'up' ? '↑' : '↓'} {m.change}
                        </span>
                        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>vs. {m.vs} 上期</span>
                      </div>
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
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{m.label}<Icon type="info-circle-o" style={{ fontSize: 'var(--fs-12)', color: 'var(--text-4, rgba(17,25,37,0.3))' }} /></span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '8px 0 4px' }}>
                      <span style={{ fontSize: 'var(--fs-30)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
                      <span style={{ fontSize: 'var(--fs-12)', fontWeight: 500, color: m.trend === 'up' ? '#00A854' : '#FF1F1F' }}>
                        {m.trend === 'up' ? '↑' : '↓'} {m.change}
                      </span>
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
                      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{m.label}<Icon type="info-circle-o" style={{ fontSize: 'var(--fs-12)', color: 'var(--text-4, rgba(17,25,37,0.3))' }} /></span>
                      <Button.Link type="primary" shape="text" style={{ padding: 0, height: 'auto', fontSize: 'var(--fs-12)' }}>查看</Button.Link>
                    </div>
                    <div style={{ margin: '8px 0 4px' }}>
                      <span style={{ fontSize: 'var(--fs-30)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 'var(--fs-12)', fontWeight: 500, color: m.trend === 'up' ? '#00A854' : '#FF1F1F' }}>
                        {m.trend === 'up' ? '↑' : '↓'} {m.change}
                      </span>
                      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>vs. {m.vs} 上期</span>
                    </div>
                  </Card>
                ))}
              </div>
            ),
          },
        ]}
      />

      {/* 第一行：年度开店目标(窄) + 进度指标(宽) + 跟随品牌新开(中) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
        {/* D-2 品牌年度开店目标（进度展示） */}
        <ModuleWrapper
          moduleId="D-2 环形进度"
          variants={[
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品牌年度开店目标</span><Button.Link type="primary" shape="text">设置</Button.Link></div>}>
                  <div className="card-body-area"><AnnualTargetChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品牌年度开店目标</span><Radio.Group defaultValue="year" size="small"><Radio.Button value="year">年度</Radio.Button><Radio.Button value="quarter">季度</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><AnnualTargetChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品牌年度开店目标</span><Select defaultValue="2024" size="small" style={{ width: 110 }}><Select.Option value="2024">2024年</Select.Option><Select.Option value="2023">2023年</Select.Option><Select.Option value="2022">2022年</Select.Option><Select.Option value="2021">2021年</Select.Option></Select></div>}>
                  <div className="card-body-area"><AnnualTargetChart /></div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品牌年度开店目标</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>目标 3000 家</span></div>}>
                  <div className="card-body-area"><AnnualTargetChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品牌年度开店目标</span></div>}>
                  <div className="card-body-area"><AnnualTargetChart /></div>
                </Card>
              ),
            },
          ]}
        />

        {/* D-2 进度指标（2x2 灰色卡片，每卡带小 donut） */}
        <ModuleWrapper
          moduleId="D-2 进度指标"
          variants={[
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>进度指标</span></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 200, flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, flex: 1 }}>
                      {(() => { const total = metrics.reduce((s, m) => s + parseInt(m.value.replace(/,/g, ''), 10), 0); const donutColors = getChartCategoricalPalette(4); return metrics.map((m, i) => { const numVal = parseInt(m.value.replace(/,/g, ''), 10); return (<div key={m.label} style={{ background: 'var(--bg-card-inner)', borderRadius: 'var(--radius-4)', padding: '4px 12px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ minWidth: 0 }}><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', display: 'block', whiteSpace: 'nowrap' }}>{m.label}</span><span style={{ fontSize: 'var(--fs-20)', fontWeight: 600, color: 'var(--text-1)', display: 'block', marginTop: 4 }}>{m.value}</span></div><MiniDonutChart value={numVal} total={total} color={donutColors[i]} /></div>); }); })()}
                    </div>
                  </div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>进度指标</span><Button.Link type="primary" shape="text">详情</Button.Link></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 200, flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, flex: 1 }}>
                      {(() => { const total = metrics.reduce((s, m) => s + parseInt(m.value.replace(/,/g, ''), 10), 0); const donutColors = getChartCategoricalPalette(4); return metrics.map((m, i) => { const numVal = parseInt(m.value.replace(/,/g, ''), 10); return (<div key={m.label} style={{ background: 'var(--bg-card-inner)', borderRadius: 'var(--radius-4)', padding: '4px 12px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ minWidth: 0 }}><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', display: 'block', whiteSpace: 'nowrap' }}>{m.label}</span><span style={{ fontSize: 'var(--fs-20)', fontWeight: 600, color: 'var(--text-1)', display: 'block', marginTop: 4 }}>{m.value}</span></div><MiniDonutChart value={numVal} total={total} color={donutColors[i]} /></div>); }); })()}
                    </div>
                  </div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>进度指标</span><Radio.Group defaultValue="week" size="small"><Radio.Button value="week">本周</Radio.Button><Radio.Button value="month">本月</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 200, flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, flex: 1 }}>
                      {(() => { const total = metrics.reduce((s, m) => s + parseInt(m.value.replace(/,/g, ''), 10), 0); const donutColors = getChartCategoricalPalette(4); return metrics.map((m, i) => { const numVal = parseInt(m.value.replace(/,/g, ''), 10); return (<div key={m.label} style={{ background: 'var(--bg-card-inner)', borderRadius: 'var(--radius-4)', padding: '4px 12px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ minWidth: 0 }}><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', display: 'block', whiteSpace: 'nowrap' }}>{m.label}</span><span style={{ fontSize: 'var(--fs-20)', fontWeight: 600, color: 'var(--text-1)', display: 'block', marginTop: 4 }}>{m.value}</span></div><MiniDonutChart value={numVal} total={total} color={donutColors[i]} /></div>); }); })()}
                    </div>
                  </div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>进度指标</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部指标</Select.Option><Select.Option value="revenue">营收</Select.Option><Select.Option value="orders">订单</Select.Option><Select.Option value="stores">门店</Select.Option></Select></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 200, flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, flex: 1 }}>
                      {(() => { const total = metrics.reduce((s, m) => s + parseInt(m.value.replace(/,/g, ''), 10), 0); const donutColors = getChartCategoricalPalette(4); return metrics.map((m, i) => { const numVal = parseInt(m.value.replace(/,/g, ''), 10); return (<div key={m.label} style={{ background: 'var(--bg-card-inner)', borderRadius: 'var(--radius-4)', padding: '4px 12px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ minWidth: 0 }}><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', display: 'block', whiteSpace: 'nowrap' }}>{m.label}</span><span style={{ fontSize: 'var(--fs-20)', fontWeight: 600, color: 'var(--text-1)', display: 'block', marginTop: 4 }}>{m.value}</span></div><MiniDonutChart value={numVal} total={total} color={donutColors[i]} /></div>); }); })()}
                    </div>
                  </div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>进度指标</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>共 4 项指标</span></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 200, flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, flex: 1 }}>
                      {(() => { const total = metrics.reduce((s, m) => s + parseInt(m.value.replace(/,/g, ''), 10), 0); const donutColors = getChartCategoricalPalette(4); return metrics.map((m, i) => { const numVal = parseInt(m.value.replace(/,/g, ''), 10); return (<div key={m.label} style={{ background: 'var(--bg-card-inner)', borderRadius: 'var(--radius-4)', padding: '4px 12px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ minWidth: 0 }}><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', display: 'block', whiteSpace: 'nowrap' }}>{m.label}</span><span style={{ fontSize: 'var(--fs-20)', fontWeight: 600, color: 'var(--text-1)', display: 'block', marginTop: 4 }}>{m.value}</span></div><MiniDonutChart value={numVal} total={total} color={donutColors[i]} /></div>); }); })()}
                    </div>
                  </div>
                </Card>
              ),
            },
          ]}
        />

        {/* D-3 全国跟随品牌新开（趋势图） */}
        <ModuleWrapper
          moduleId="D-3 折线图"
          variants={[
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国跟随品牌新开</span><Button.Link type="primary" shape="text">设置</Button.Link></div>}>
                  <div className="card-body-area"><BrandTrendChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国跟随品牌新开</span><Radio.Group defaultValue="6m" size="small"><Radio.Button value="3m">3个月</Radio.Button><Radio.Button value="6m">6个月</Radio.Button><Radio.Button value="12m">12个月</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><BrandTrendChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国跟随品牌新开</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部品牌</Select.Option><Select.Option value="direct">直营品牌</Select.Option><Select.Option value="franchise">加盟品牌</Select.Option><Select.Option value="new">新签品牌</Select.Option></Select></div>}>
                  <div className="card-body-area"><BrandTrendChart /></div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国跟随品牌新开</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>近6个月趋势</span></div>}>
                  <div className="card-body-area"><BrandTrendChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国跟随品牌新开</span></div>}>
                  <div className="card-body-area"><BrandTrendChart /></div>
                </Card>
              ),
            },
          ]}
        />
      </div>

      {/* 第二行：左列(时段客流热力大图 跨2行) + 右列(城市等级饼图 + 全国开店趋势) — 2×2 grid */}
      <div className="grid-2x2-responsive">
        {/* 左侧：时段客流热力图（跨2行，热力矩阵放大后信息密度高） */}
        <ModuleWrapper
          moduleId="D-14 热力图"
          style={{ gridRow: '1 / 3' }}
          variants={[
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>时段客流热力</span><Button.Link type="primary" shape="text">全屏</Button.Link></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 380 }}><HeatmapChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>时段客流热力</span><Radio.Group defaultValue="week" size="small"><Radio.Button value="week">本周</Radio.Button><Radio.Button value="month">本月</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 380 }}><HeatmapChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>时段客流热力</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部门店</Select.Option><Select.Option value="direct">直营店</Select.Option><Select.Option value="franchise">加盟店</Select.Option><Select.Option value="top">TOP50店</Select.Option></Select></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 380 }}><HeatmapChart /></div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>时段客流热力</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>统计周期：本周</span></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 380 }}><HeatmapChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>时段客流热力</span></div>}>
                  <div className="card-body-area" style={{ height: 'auto', minHeight: 380 }}><HeatmapChart /></div>
                </Card>
              ),
            },
          ]}
        />

        {/* 右上：城市等级占比（窄卡片 + 饼图） */}
        <ModuleWrapper
          moduleId="D-7 饼图/环图"
          variants={[
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>城市等级占比</span><Button.Link type="primary" shape="text">详情</Button.Link></div>}>
                  <div className="card-body-area"><CityLevelPieChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>城市等级占比</span><Select defaultValue="stores" size="small" style={{ width: 100 }}><Select.Option value="stores">门店数</Select.Option><Select.Option value="revenue">营收</Select.Option></Select></div>}>
                  <div className="card-body-area"><CityLevelPieChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>城市等级占比</span><Select defaultValue="stores" size="small" style={{ width: 110 }}><Select.Option value="stores">门店数</Select.Option><Select.Option value="revenue">营收</Select.Option><Select.Option value="area">面积</Select.Option><Select.Option value="staff">人员</Select.Option></Select></div>}>
                  <div className="card-body-area"><CityLevelPieChart /></div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>城市等级占比</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>共 6 个等级</span></div>}>
                  <div className="card-body-area"><CityLevelPieChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>城市等级占比</span></div>}>
                  <div className="card-body-area"><CityLevelPieChart /></div>
                </Card>
              ),
            },
          ]}
        />

        {/* 右下：铺位漏斗（窄卡片） */}
        <ModuleWrapper
          moduleId="D-6 漏斗图"
          variants={[
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>铺位漏斗</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>总铺位数 1918 个</span></div>}>
                  <div className="card-body-area"><FunnelChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>铺位漏斗</span><Radio.Group defaultValue="all" size="small"><Radio.Button value="all">全部</Radio.Button><Radio.Button value="new">新签</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><FunnelChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>铺位漏斗</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部区域</Select.Option><Select.Option value="east">华东</Select.Option><Select.Option value="south">华南</Select.Option><Select.Option value="north">华北</Select.Option></Select></div>}>
                  <div className="card-body-area"><FunnelChart /></div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>铺位漏斗</span><Button.Link type="primary" shape="text">全部点位</Button.Link></div>}>
                  <div className="card-body-area"><FunnelChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>铺位漏斗</span></div>}>
                  <div className="card-body-area"><FunnelChart /></div>
                </Card>
              ),
            },
          ]}
        />
      </div>

      {/* 开店进度（堆叠进度条）— 独立一行 */}
      <ModuleWrapper
        moduleId="D-8 堆叠进度条"
        variants={(() => {
          const progressBody = (
            <div className="card-body-area" style={{ height: 'auto', minHeight: 200, flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
              {expandProgress.map(row => (
                <div key={row.branch} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 90, fontSize: 'var(--fs-12)', color: 'var(--text-2)', flexShrink: 0 }}>{row.branch}</span>
                  <div style={{ flex: 1, display: 'flex', height: 22, borderRadius: 4, overflow: 'hidden' }}>
                    {row.phases.map((val, i) => (
                      <div key={i} style={{ flex: val, background: phaseColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-12)', color: '#fff', fontWeight: 500, minWidth: val > 0 ? 20 : 0 }}>{val}</div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {phaseLabels.map((label, i) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: phaseColors[i], display: 'inline-block' }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          );
          return [
            {
              name: '筛选型',
              render: () => (
                <Card style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>开店进度</span><Radio.Group defaultValue="org" size="small"><Radio.Button value="org">组织</Radio.Button><Radio.Button value="person">人员</Radio.Button></Radio.Group></div>}>
                  {progressBody}
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>开店进度</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部分公司</Select.Option><Select.Option value="bj">北京</Select.Option><Select.Option value="sh">上海</Select.Option><Select.Option value="gz">广州</Select.Option><Select.Option value="sz">深圳</Select.Option></Select></div>}>
                      {progressBody}
                    </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>开店进度</span><Button.Link type="primary" shape="text">导出</Button.Link></div>}>
                  {progressBody}
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>开店进度</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>2024/06/01 ~ 2024/06/30</span></div>}>
                  {progressBody}
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>开店进度</span></div>}>
                  {progressBody}
                </Card>
              ),
            },
          ];
        })()}
      />

      {/* 第三行：全国开店趋势 + 区域分布柱图 + 横向排名 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 8 }}>
        <ModuleWrapper
          moduleId="D-5 双轴组合图"
          variants={[
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国开店趋势</span><Radio.Group value={storeTrendTab} onChange={(val) => setStoreTrendTab(val as 'operating' | 'newOpen')} size="small"><Radio.Button value="operating">营业</Radio.Button><Radio.Button value="newOpen">新开</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><StoreTrendChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国开店趋势</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部区域</Select.Option><Select.Option value="east">华东</Select.Option><Select.Option value="south">华南</Select.Option><Select.Option value="north">华北</Select.Option><Select.Option value="west">西部</Select.Option></Select></div>}>
                  <div className="card-body-area"><StoreTrendChart /></div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国开店趋势</span><Button.Link type="primary" shape="text">详情</Button.Link></div>}>
                  <div className="card-body-area"><StoreTrendChart /></div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国开店趋势</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>累计 2668 家</span></div>}>
                  <div className="card-body-area"><StoreTrendChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>全国开店趋势</span></div>}>
                  <div className="card-body-area"><StoreTrendChart /></div>
                </Card>
              ),
            },
          ]}
        />

        <ModuleWrapper
          moduleId="D-4 柱状图"
          variants={[
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>区域分布</span><Radio.Group defaultValue="stores" size="small"><Radio.Button value="stores">营业门店</Radio.Button><Radio.Button value="revenue">营收</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><RegionBarChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>区域分布</span><Select defaultValue="stores" size="small" style={{ width: 110 }}><Select.Option value="stores">营业门店</Select.Option><Select.Option value="revenue">营收</Select.Option><Select.Option value="area">面积</Select.Option><Select.Option value="growth">增长率</Select.Option></Select></div>}>
                  <div className="card-body-area"><RegionBarChart /></div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>区域分布</span><Button.Link type="primary" shape="text">详情</Button.Link></div>}>
                  <div className="card-body-area"><RegionBarChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>区域分布</span></div>}>
                  <div className="card-body-area"><RegionBarChart /></div>
                </Card>
              ),
            },
          ]}
        />

        <ModuleWrapper
          moduleId="D-9 排名条形图"
          variants={[
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>TOP 门店月营收</span><Radio.Group defaultValue="revenue" size="small"><Radio.Button value="revenue">营收</Radio.Button><Radio.Button value="orders">订单</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><TopStoreBarChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>TOP 门店月营收</span><Select defaultValue="revenue" size="small" style={{ width: 110 }}><Select.Option value="revenue">营收</Select.Option><Select.Option value="orders">订单</Select.Option><Select.Option value="customers">客流</Select.Option><Select.Option value="aov">客单价</Select.Option></Select></div>}>
                  <div className="card-body-area"><TopStoreBarChart /></div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>TOP 门店月营收</span><Button.Link type="primary" shape="text">全部</Button.Link></div>}>
                  <div className="card-body-area"><TopStoreBarChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>TOP 门店月营收</span></div>}>
                  <div className="card-body-area"><TopStoreBarChart /></div>
                </Card>
              ),
            },
          ]}
        />
      </div>

      {/* 第四行：面积图 + 散点图 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 8 }}>
        {/* D-3 面积图（月度营收趋势） */}
        <ModuleWrapper
          moduleId="D-3 面积图"
          variants={[
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>月度营收趋势</span><Button.Link type="primary" shape="text">详情</Button.Link></div>}>
                  <div className="card-body-area"><AreaChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>月度营收趋势</span><Radio.Group defaultValue="revenue" size="small"><Radio.Button value="revenue">营收</Radio.Button><Radio.Button value="orders">订单</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><AreaChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>月度营收趋势</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部品类</Select.Option><Select.Option value="food">餐饮</Select.Option><Select.Option value="retail">零售</Select.Option><Select.Option value="service">服务</Select.Option><Select.Option value="other">其他</Select.Option></Select></div>}>
                  <div className="card-body-area"><AreaChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>月度营收趋势</span></div>}>
                  <div className="card-body-area"><AreaChart /></div>
                </Card>
              ),
            },
          ]}
        />

        {/* D-10 散点图（面积 vs 营收） */}
        <ModuleWrapper
          moduleId="D-10 散点图"
          variants={[
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>面积-营收关联</span><Button.Link type="primary" shape="text">筛选</Button.Link></div>}>
                  <div className="card-body-area"><ScatterChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>面积-营收关联</span><Radio.Group defaultValue="all" size="small"><Radio.Button value="all">全部</Radio.Button><Radio.Button value="direct">直营</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><ScatterChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>面积-营收关联</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部城市</Select.Option><Select.Option value="t1">一线</Select.Option><Select.Option value="t2">新一线</Select.Option><Select.Option value="t3">二线</Select.Option></Select></div>}>
                  <div className="card-body-area"><ScatterChart /></div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>面积-营收关联</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>R²=0.82</span></div>}>
                  <div className="card-body-area"><ScatterChart /></div>
                </Card>
              ),
            },
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>面积-营收关联</span></div>}>
                  <div className="card-body-area"><ScatterChart /></div>
                </Card>
              ),
            },
          ]}
        />
      </div>

      {/* 第五行：雷达图 + 水波进度 + 玫瑰图 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
        {/* D-12 雷达图 */}
        <ModuleWrapper
          moduleId="D-12 雷达图"
          variants={[
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>门店综合评分</span></div>}>
                  <div className="card-body-area"><RadarChart /></div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>门店综合评分</span><Button.Link type="primary" shape="text">详情</Button.Link></div>}>
                  <div className="card-body-area"><RadarChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>门店综合评分</span><Select defaultValue="all" size="small" style={{ width: 100 }}><Select.Option value="all">全部门店</Select.Option><Select.Option value="direct">直营</Select.Option><Select.Option value="franchise">加盟</Select.Option></Select></div>}>
                  <div className="card-body-area"><RadarChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>门店综合评分</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部门店</Select.Option><Select.Option value="direct">直营</Select.Option><Select.Option value="franchise">加盟</Select.Option><Select.Option value="top">TOP门店</Select.Option></Select></div>}>
                  <div className="card-body-area"><RadarChart /></div>
                </Card>
              ),
            },
          ]}
        />

        {/* D-13 仪表盘/水波进度 */}
        <ModuleWrapper
          moduleId="D-13 水波球"
          variants={[
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>年度营收目标</span></div>}>
                  <div className="card-body-area"><LiquidGauge /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>年度营收目标</span><Radio.Group defaultValue="year" size="small"><Radio.Button value="year">年度</Radio.Button><Radio.Button value="q">季度</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><LiquidGauge /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>年度营收目标</span><Select defaultValue="2024" size="small" style={{ width: 100 }}><Select.Option value="2024">2024年</Select.Option><Select.Option value="2023">2023年</Select.Option><Select.Option value="2022">2022年</Select.Option><Select.Option value="2021">2021年</Select.Option></Select></div>}>
                  <div className="card-body-area"><LiquidGauge /></div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>年度营收目标</span><Button.Link type="primary" shape="text">设置</Button.Link></div>}>
                  <div className="card-body-area"><LiquidGauge /></div>
                </Card>
              ),
            },
            {
              name: '描述型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>年度营收目标</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>¥5500万</span></div>}>
                  <div className="card-body-area"><LiquidGauge /></div>
                </Card>
              ),
            },
          ]}
        />

        {/* D-15 玫瑰图 */}
        <ModuleWrapper
          moduleId="D-15 玫瑰图"
          variants={[
            {
              name: '纯净型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品牌门店分布</span></div>}>
                  <div className="card-body-area"><RoseChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品牌门店分布</span><Radio.Group defaultValue="stores" size="small"><Radio.Button value="stores">门店数</Radio.Button><Radio.Button value="area">面积</Radio.Button></Radio.Group></div>}>
                  <div className="card-body-area"><RoseChart /></div>
                </Card>
              ),
            },
            {
              name: '筛选（复杂）',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品牌门店分布</span><Select defaultValue="stores" size="small" style={{ width: 110 }}><Select.Option value="stores">门店数</Select.Option><Select.Option value="area">面积</Select.Option><Select.Option value="revenue">月营收</Select.Option><Select.Option value="growth">同比增长</Select.Option></Select></div>}>
                  <div className="card-body-area"><RoseChart /></div>
                </Card>
              ),
            },
            {
              name: '操作型',
              render: () => (
                <Card className="chart-card" style={{ marginBottom: 0, height: '100%' }} header={<div className="card-title-bar"><span>品牌门店分布</span><Button.Link type="primary" shape="text">详情</Button.Link></div>}>
                  <div className="card-body-area"><RoseChart /></div>
                </Card>
              ),
            },
          ]}
        />
      </div>

{/* G-4 数据表格 — 支持变体切换 */}
<ModuleWrapper moduleId="G-4 数据表格" variants={g4Variants} />
    </PageLayout>
  );
}
