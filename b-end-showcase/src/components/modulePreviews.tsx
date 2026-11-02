/**
 * 模块预览注册表
 * ─────────────────────────────────────────────
 * 为 ModuleDetail 页面右侧提供每个 L2 模块的实际渲染预览。
 * 每个 preview 是一个独立的 React 组件，无 props，直接渲染。
 *
 * 预览区会在右侧内容面板中水平居中展示。
 */
import { useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { Button, Input, InputNumber, Select, Tag, Table, Tabs, Radio, Card, Row, Col, Switch, RangePicker, Icon, Checkbox, Pagination, Progress } from '@ss/mtd-react3';
import { useG2Chart } from '../hooks/useG2Chart';
import { chartPalette, chartMono, chartTrend, getChartCategoricalPalette, getChartMonoScale } from '../lib/chartTokens';
import G4DataTable, { g4Variants } from './G4DataTable';
import DigestCard from './DigestCard';
import ShortcutGrid from './ShortcutGrid';
import { ConditionGroupEditor, FormulaTemplateEditor } from './FormulaEditor';
import { BasicCheckboxRow, CapabilityFormSection, TableCheckboxSelector } from './CheckboxGroupField';
import {
  PageHeaderV1,
  PageHeaderV2,
  PageHeaderV3,
  PageHeaderV5,
  PageHeaderV7,
  PageHeaderV9,
PageHeaderV11,
PageHeaderAnchor,
PageHeaderSpaceSwitcher,
} from './PageHeaderPreview';
import { ButtonUploadField, DraggerUploadField, ImageUploadField } from './FileUploadPreview';
import { StandardStepBar, DescriptionStepBar, DotStepBar } from './StepPageFlowPreview';
import {
  SequentialPagePreview,
  StepPagePreview,
  MasterDetailPagePreview,
  DrawerContainerPreview,
  ModalContainerPreview,
} from './PresentationContainerPreview';
import { BasicGroupSection, CollapsibleGroupSection, SteppedGroupSection } from './GroupSectionPreview';
import {
  SingleColumnHalfWidth,
  SingleColumnFullWidth,
  TwoColumnForm,
  ThreeColumnForm,
  LabelTopForm,
  CompactForm,
} from './SingleLayoutPreview';
import {
  GroupedTagEditor,
  SingleTagEditor,
  SelectTagEditor,
  ReadonlyTagDisplay,
} from './TagGroupEditorPreview';
import {
  SequentialActionBarDemo,
  StepActionBarDemo,
  PanelActionBarDemo,
  DangerActionBarDemo,
} from './ActionBarPreview';
import {
  TwoColumnDescription,
  ThreeColumnDescription,
  FourColumnDescription,
  MixedColumnsDescription,
} from './DescriptionListPreview';
import {
  FilesOnlyPreview,
  ImagesOnlyPreview,
  MixedAttachmentPreview,
  GroupSectionAttachmentPreview,
} from './AttachmentPreview';
import { BasicInfoTable, ImageInfoTable, DetailDataTable } from './ReadonlyTablePreview';
import type { PreviewVariant } from './VariantSwitcher';

/* ═══════════════════════════════════════════════
   通用「5 型头部」变体生成器
   ─────────────────────────────────────────────
   D-2~D-15 等图表卡片类模块的变体差异集中在卡片头部（操作/筛选/复杂筛选/描述/纯净），
   图表本体不变。用这个 helper 统一生成，避免每个模块重复写 5 份几乎相同的 Card+header 代码。
   ═══════════════════════════════════════════════ */
function buildHeaderVariants(title: string, body: ReactNode, opts?: {
  filterOptions?: string[];
  complexOptions?: string[];
  descText?: string;
  order?: Array<'操作型' | '筛选型' | '筛选（复杂）' | '描述型' | '纯净型'>;
  bodyMinHeight?: number;
}): PreviewVariant[] {
  const filterOptions = opts?.filterOptions || ['本期', '上期'];
  const complexOptions = opts?.complexOptions || ['全部', '选项 A', '选项 B', '选项 C'];
  const descText = opts?.descText || '统计周期：本月';
  const order = opts?.order || ['操作型', '筛选型', '筛选（复杂）', '描述型', '纯净型'];
  const bodyStyle: CSSProperties | undefined = opts?.bodyMinHeight ? { height: 'auto', minHeight: opts.bodyMinHeight } : undefined;

  const cardBody = <div className="card-body-area" style={bodyStyle}>{body}</div>;

  const factories: Record<string, () => ReactNode> = {
    操作型: () => (
      <Card className="chart-card" style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>{title}</span><Button.Link type="primary" shape="text">查看</Button.Link></div>}>
        {cardBody}
      </Card>
    ),
    筛选型: () => (
      <Card className="chart-card" style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>{title}</span><Radio.Group defaultValue={filterOptions[0]} size="small">{filterOptions.map((o) => <Radio.Button key={o} value={o}>{o}</Radio.Button>)}</Radio.Group></div>}>
        {cardBody}
      </Card>
    ),
    '筛选（复杂）': () => (
      <Card className="chart-card" style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>{title}</span><Select defaultValue={complexOptions[0]} size="small" style={{ width: 110 }}>{complexOptions.map((o) => <Select.Option key={o} value={o}>{o}</Select.Option>)}</Select></div>}>
        {cardBody}
      </Card>
    ),
    描述型: () => (
      <Card className="chart-card" style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>{title}</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{descText}</span></div>}>
        {cardBody}
      </Card>
    ),
    纯净型: () => (
      <Card className="chart-card" style={{ marginBottom: 0 }} header={<div className="card-title-bar"><span>{title}</span></div>}>
        {cardBody}
      </Card>
    ),
  };

  return order.map((name) => ({ name, render: factories[name] }));
}

/* ═══════════════════════════════════════════════
   通用容器 — 给预览提供一个居中 + 背景的壳
   ═══════════════════════════════════════════════ */
function PreviewShell({ children, width = '100%', maxW = 640 }: { children: React.ReactNode; width?: string; maxW?: number }) {
  return (
    <div style={{ width, maxWidth: maxW, margin: '0 auto' }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   G-1+G-2 顶导+侧导 Layout
   ═══════════════════════════════════════════════ */
const G1G2_TABS = ['概览', '门店管理', '数据分析'];
const G1G2_MENUS: Record<string, { icon: string; label: string }[]> = {
  '概览':   [{ icon: 'areachart-o', label: '数据总览' }, { icon: 'bar-chart', label: '运营指标' }],
  '门店管理': [{ icon: 'customer-o', label: '门店列表' }, { icon: 'contacts', label: '区域管理' }, { icon: 'cart-o', label: '品牌管理' }, { icon: 'money-circle', label: '合同管理' }],
  '数据分析': [{ icon: 'piechart-o', label: '营收分析' }, { icon: 'bar-chart', label: '流量分析' }],
};

function G1G2Preview() {
  const [activeTab, setActiveTab] = useState('门店管理');
  const [activeMenu, setActiveMenu] = useState('门店列表');
  const [collapsed, setCollapsed] = useState(false);

  const sideW = collapsed ? 48 : 160;
  const menus = G1G2_MENUS[activeTab] || [];

  return (
    <PreviewShell maxW={600}>
      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--divider, rgba(17,25,37,0.1))', background: 'var(--bg-page, #F3F3F4)', userSelect: 'none' }}>

        {/* ── G-1 顶导 ── */}
        <div style={{ height: 52, background: 'var(--bg-card, #fff)', boxShadow: '0 1px 0 rgba(17,25,37,0.07)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 0, position: 'relative', zIndex: 2 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, var(--color-brand-primary, #166FF7), #5B9BFF)', flexShrink: 0 }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1, #111925)', whiteSpace: 'nowrap' }}>门店管理平台</span>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginLeft: 28, height: 52, flex: 1 }}>
            {G1G2_TABS.map(t => {
              const isActive = t === activeTab;
              return (
                <span
                  key={t}
                  onClick={() => { setActiveTab(t); setActiveMenu(G1G2_MENUS[t]?.[0]?.label ?? ''); }}
                  style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', padding: '0 12px', fontSize: 14, cursor: 'pointer', color: isActive ? 'var(--text-1, #111925)' : 'var(--text-2, rgba(17,25,37,0.6))', fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}
                >
                  {t}
                  {isActive && <span style={{ position: 'absolute', left: 12, right: 12, bottom: 0, height: 2, background: 'var(--color-brand-primary, #166FF7)', borderRadius: 1 }} />}
                </span>
              );
            })}
          </div>
          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <Icon type="bell-o" style={{ fontSize: 18, color: 'var(--text-2, rgba(17,25,37,0.6))', cursor: 'pointer' }} />
            <Icon type="comment-o" style={{ fontSize: 18, color: 'var(--text-2, rgba(17,25,37,0.6))', cursor: 'pointer' }} />
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-primary-5, #E8F0FF)' }} />
          </div>
        </div>

        {/* ── 主体区：G-2 侧导 + 内容 ── */}
        <div style={{ display: 'flex', height: 228 }}>

          {/* G-2 侧导 */}
          <div style={{ width: sideW, background: 'var(--bg-card, #fff)', boxShadow: '1px 0 0 rgba(17,25,37,0.07)', display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'width 0.2s ease', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0', scrollbarWidth: 'none' }}>
              {menus.map(({ icon, label }) => {
                const isActive = label === activeMenu;
                return (
                  <div
                    key={label}
                    onClick={() => setActiveMenu(label)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '8px 0' : '7px 12px', margin: '1px 8px', borderRadius: 6, fontSize: 13, cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start', background: isActive ? 'color-mix(in srgb, var(--color-brand-primary, #166FF7) 10%, transparent)' : 'transparent', color: isActive ? 'var(--color-brand-primary, #166FF7)' : 'var(--text-2, rgba(17,25,37,0.6))', fontWeight: isActive ? 600 : 400 }}
                  >
                    <Icon type={icon} style={{ fontSize: 16, flexShrink: 0 }} />
                    {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
                  </div>
                );
              })}
            </div>
            {/* 折叠按钮 */}
            <div style={{ borderTop: collapsed ? 'none' : '1px solid var(--divider, rgba(17,25,37,0.07))', padding: '4px 8px', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCollapsed(c => !c)}
                style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: 'var(--text-2, rgba(17,25,37,0.6))', fontSize: 16 }}
              >
                <Icon type={collapsed ? 'expand' : 'collapse'} />
              </button>
            </div>
          </div>

          {/* 内容区 */}
          <div style={{ flex: 1, minWidth: 0, background: 'var(--bg-page, #F3F3F4)', padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="dash-card" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3, rgba(17,25,37,0.35))', fontSize: 13 }}>
              {activeMenu} · 页面内容区域
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

/* ═══════════════════════════════════════════════
   G-3 筛选器栏（简单版 / 复杂版）
   ═══════════════════════════════════════════════ */
function SimpleFilterBar() {
  return (
    <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 16px' }}>
      <RangePicker style={{ width: 240 }} />
      <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部区域' }, { value: 'east', label: '华东区' }]} />
      <Input style={{ width: 160 }} placeholder="搜索门店名称" prefix={<Icon type="search-o" />} />
      <div style={{ flex: 1 }} />
      <Button type="primary">查询</Button>
      <Button>重置</Button>
    </div>
  );
}
function ComplexFilterBar() {
  return (
    <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <RangePicker style={{ width: 240 }} />
        <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部区域' }, { value: 'east', label: '华东区' }]} />
        <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部品牌' }, { value: 'a', label: '品牌A' }]} />
        <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部渠道' }, { value: 'store', label: '到店' }]} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Input style={{ width: 160 }} placeholder="搜索门店名称" prefix={<Icon type="search-o" />} />
        <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部状态' }, { value: 'active', label: '营业中' }]} />
        <div style={{ flex: 1 }} />
        <Button.Link type="primary" shape="text">保存为方案</Button.Link>
        <Button type="primary">查询</Button>
        <Button>重置</Button>
      </div>
    </div>
  );
}
function G3Preview() {
  return (
    <PreviewShell maxW={640}>
      <SimpleFilterBar />
    </PreviewShell>
  );
}
export const g3Variants: PreviewVariant[] = [
  { name: '简单版', render: () => <PreviewShell maxW={640}><SimpleFilterBar /></PreviewShell> },
  { name: '复杂版', render: () => <PreviewShell maxW={640}><ComplexFilterBar /></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   G-4 数据表格 — 直接复用现有组件
   ═══════════════════════════════════════════════ */
function G4Preview() {
  return <PreviewShell maxW={720}>{g4Variants[0].render()}</PreviewShell>;
}
export const g4PreviewVariants: PreviewVariant[] = g4Variants.map((v) => ({
  name: v.name,
  render: () => <PreviewShell maxW={720}>{v.render()}</PreviewShell>,
}));

/* ═══════════════════════════════════════════════
   D-1 指标卡片组（纯大数字 / 带迷你图 / 带操作）
   ═══════════════════════════════════════════════ */
const d1Metrics = [
  { label: '总营收', value: '¥1,286万', delta: '+12.5%', up: true },
  { label: '门店数', value: '342', delta: '+8', up: true },
  { label: '客单价', value: '¥86.2', delta: '-2.1%', up: false },
  { label: '订单量', value: '14.9万', delta: '+15.3%', up: true },
];

function D1PlainCards() {
  return (
    <Row gutter={[8, 8]}>
      {d1Metrics.map((m) => (
        <Col key={m.label} span={6}>
          <Card>
            <div style={{ fontSize: 13, color: 'var(--text-3, rgba(17,25,37,0.5))', marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-1, #111925)', marginBottom: 6 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: m.up ? chartTrend.down : chartTrend.up, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon type={m.up ? 'arrow-up-o' : 'arrow-down-o'} style={{ fontSize: 12 }} />
              {m.delta}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function D1MiniDonut({ percent, color }: { percent: number; color: string }) {
  const ref = useG2Chart(() => ({
    type: 'interval',
    data: [
      { type: 'val', value: percent },
      { type: 'rest', value: 100 - percent },
    ],
    coordinate: { type: 'theta', innerRadius: 0.75 },
    encode: { y: 'value', color: 'type' },
    scale: { color: { range: [color, 'rgba(17,25,37,0.06)'] } },
    legend: false,
    tooltip: false,
    animate: { enter: { type: 'waveIn' } },
  }), [percent, color]);
  return <div ref={ref} style={{ width: 44, height: 44 }} />;
}

function D1WithMiniChart() {
  return (
    <Row gutter={[8, 8]}>
      {d1Metrics.map((m, i) => (
        <Col key={m.label} span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <D1MiniDonut percent={60 + i * 8} color={getChartCategoricalPalette(4)[i]} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--text-3, rgba(17,25,37,0.5))', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1, #111925)' }}>{m.value}</div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function D1WithAction() {
  return (
    <Row gutter={[8, 8]}>
      {d1Metrics.map((m) => (
        <Col key={m.label} span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-3, rgba(17,25,37,0.5))' }}>{m.label}</span>
              <Button.Link type="primary" shape="text" style={{ fontSize: 12, padding: 0 }}>详情</Button.Link>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-1, #111925)', marginBottom: 6 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: m.up ? chartTrend.down : chartTrend.up, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon type={m.up ? 'arrow-up-o' : 'arrow-down-o'} style={{ fontSize: 12 }} />
              {m.delta}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function D1Preview() {
  return (
    <PreviewShell maxW={600}>
      <D1PlainCards />
    </PreviewShell>
  );
}
export const d1Variants: PreviewVariant[] = [
  { name: '纯大数字', render: () => <PreviewShell maxW={600}><D1PlainCards /></PreviewShell> },
  { name: '带迷你图', render: () => <PreviewShell maxW={600}><D1WithMiniChart /></PreviewShell> },
  { name: '带操作', render: () => <PreviewShell maxW={600}><D1WithAction /></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   D-2 进度展示 — 环形进度 / 进度指标 两个子模块，各自 5 型头部
   ═══════════════════════════════════════════════ */
function RingProgressBody() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <Progress type="circle" percentage={78} color={chartPalette.c1} width={120} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>年度目标达成率</div>
        <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-1)' }}>78%</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>目标 ¥5,000万 / 已完成 ¥3,900万</div>
      </div>
    </div>
  );
}

const d2MetricsData = [
  { label: '新签合同', percent: 82 },
  { label: '开店进度', percent: 64 },
  { label: '培训完成', percent: 91 },
  { label: '验收通过', percent: 57 },
];

function MetricsProgressBody() {
  const palette = getChartCategoricalPalette(d2MetricsData.length);
  return (
    <Row gutter={[8, 8]}>
      {d2MetricsData.map((m, i) => (
        <Col key={m.label} span={6}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <D1MiniDonut percent={m.percent} color={palette[i]} />
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{m.label}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>{m.percent}%</div>
          </div>
        </Col>
      ))}
    </Row>
  );
}

function D2Preview() {
  return (
    <PreviewShell maxW={400}>
      <Card>
        <RingProgressBody />
      </Card>
    </PreviewShell>
  );
}
export const d2RingVariants: PreviewVariant[] = buildHeaderVariants('年度目标达成率', <RingProgressBody />, {
  filterOptions: ['本年', '本季'],
  descText: '统计周期：2024 年',
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={480}>{v.render()}</PreviewShell> }));
export const d2MetricsVariants: PreviewVariant[] = buildHeaderVariants('进度指标', <MetricsProgressBody />, {
  filterOptions: ['本月', '本季'],
  descText: '统计周期：本月',
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={600}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-3 折线图
   ═══════════════════════════════════════════════ */
const d3LineData = [
  { month: '1月', value: 420, type: '本期' },
  { month: '2月', value: 380, type: '本期' },
  { month: '3月', value: 510, type: '本期' },
  { month: '4月', value: 460, type: '本期' },
  { month: '5月', value: 580, type: '本期' },
  { month: '6月', value: 620, type: '本期' },
  { month: '1月', value: 350, type: '上期' },
  { month: '2月', value: 360, type: '上期' },
  { month: '3月', value: 420, type: '上期' },
  { month: '4月', value: 410, type: '上期' },
  { month: '5月', value: 480, type: '上期' },
  { month: '6月', value: 510, type: '上期' },
];
function LineTrendChart() {
  const ref = useG2Chart(() => ({
    type: 'line',
    data: d3LineData,
    encode: { x: 'month', y: 'value', color: 'type' },
    scale: { color: { range: [chartPalette.c1, chartMono.weak] } },
    axis: { x: { title: false }, y: { title: false } },
    legend: { color: { position: 'top-right' } },
    style: { lineWidth: 2 },
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function AreaTrendChart() {
  const ref = useG2Chart(() => ({
    type: 'area',
    data: d3LineData.filter((d) => d.type === '本期'),
    encode: { x: 'month', y: 'value' },
    style: { fill: `linear-gradient(-90deg, white 0%, ${chartPalette.c1} 100%)`, fillOpacity: 0.6, stroke: chartPalette.c1, lineWidth: 2 },
    axis: { x: { title: false }, y: { title: false } },
    legend: false,
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D3Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>月度营收趋势</div>
        <LineTrendChart />
      </Card>
    </PreviewShell>
  );
}
export const d3LineVariants: PreviewVariant[] = buildHeaderVariants('月度营收趋势', <LineTrendChart />, {
  filterOptions: ['本期', '同比'],
  descText: '统计周期：近6个月',
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));
export const d3AreaVariants: PreviewVariant[] = buildHeaderVariants('月度营收趋势（面积图）', <AreaTrendChart />, {
  filterOptions: ['本期', '同比'],
  order: ['操作型', '筛选型', '筛选（复杂）', '纯净型'],
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-4 柱状图
   ═══════════════════════════════════════════════ */
function BarChart() {
  const data = [
    { region: '华东', value: 386 },
    { region: '华北', value: 295 },
    { region: '华南', value: 248 },
    { region: '西南', value: 172 },
    { region: '华中', value: 153 },
    { region: '东北', value: 98 },
  ];
  const ref = useG2Chart(() => ({
    type: 'interval',
    data,
    encode: { x: 'region', y: 'value', color: 'region' },
    scale: { color: { range: getChartCategoricalPalette(6) } },
    axis: { x: { title: false }, y: { title: false } },
    legend: false,
    style: { radius: 4 },
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D4Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>各区域营收对比</div>
        <BarChart />
      </Card>
    </PreviewShell>
  );
}
export const d4Variants: PreviewVariant[] = buildHeaderVariants('各区域营收对比', <BarChart />, {
  order: ['筛选型', '筛选（复杂）', '操作型', '纯净型'],
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-5 双轴组合图
   ═══════════════════════════════════════════════ */
function ComboChart() {
  const data = [
    { month: '1月', revenue: 420, growth: 12 },
    { month: '2月', revenue: 380, growth: 8 },
    { month: '3月', revenue: 510, growth: 15 },
    { month: '4月', revenue: 460, growth: 10 },
    { month: '5月', revenue: 580, growth: 18 },
    { month: '6月', revenue: 620, growth: 22 },
  ];
  const ref = useG2Chart(() => ({
    type: 'view',
    children: [
      { type: 'interval', data, encode: { x: 'month', y: 'revenue' }, style: { fill: chartPalette.c1, radius: 4 }, axis: { y: { position: 'left', title: '营收(万)' } } },
      { type: 'line', data, encode: { x: 'month', y: 'growth' }, style: { stroke: chartPalette.c3, lineWidth: 2 }, axis: { y: { position: 'right', title: '增速(%)' } }, scale: { y: { independent: true } } },
    ],
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D5Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>营收与增速双轴</div>
        <ComboChart />
      </Card>
    </PreviewShell>
  );
}
export const d5Variants: PreviewVariant[] = buildHeaderVariants('营收与增速双轴', <ComboChart />).map((v) => ({
  name: v.name,
  render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell>,
}));

/* ═══════════════════════════════════════════════
   D-6 漏斗图
   ═══════════════════════════════════════════════ */
function FunnelChartPreview() {
  const data = [
    { stage: '曝光', value: 10000 },
    { stage: '点击', value: 4200 },
    { stage: '加购', value: 1850 },
    { stage: '下单', value: 920 },
    { stage: '支付', value: 680 },
  ];
  const ref = useG2Chart(() => ({
    type: 'interval',
    data,
    transform: [{ type: 'symmetryY' }],
    encode: { x: 'stage', y: 'value', color: 'stage' },
    scale: { color: { range: getChartCategoricalPalette(5) } },
    axis: { x: { title: false }, y: { title: false, labelFormatter: (d: number) => `${(d / 100).toFixed(0)}%` } },
    legend: false,
    coordinate: { transform: [{ type: 'transpose' }] },
    style: { radius: 4 },
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D6Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>转化漏斗</div>
        <FunnelChartPreview />
      </Card>
    </PreviewShell>
  );
}
export const d6Variants: PreviewVariant[] = buildHeaderVariants('转化漏斗', <FunnelChartPreview />, {
  order: ['描述型', '筛选型', '筛选（复杂）', '操作型', '纯净型'],
  descText: '总曝光量 10,000 次',
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-7 饼/环图
   ═══════════════════════════════════════════════ */
function PieDonutChart() {
  const data = [
    { channel: '到店', value: 386 },
    { channel: '外卖', value: 295 },
    { channel: '酒旅', value: 148 },
    { channel: '买菜', value: 98 },
  ];
  const ref = useG2Chart(() => ({
    type: 'interval',
    data,
    transform: [{ type: 'stackY' }],
    coordinate: { type: 'theta' },
    encode: { y: 'value', color: 'channel' },
    scale: { color: { range: getChartCategoricalPalette(4) } },
    legend: { color: { position: 'right' } },
    style: { radius: 4 },
    labels: [{ text: 'channel', position: 'outside', fontSize: 12 }],
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D7Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>渠道占比</div>
        <PieDonutChart />
      </Card>
    </PreviewShell>
  );
}
export const d7Variants: PreviewVariant[] = buildHeaderVariants('渠道占比', <PieDonutChart />, {
  descText: '共 4 个渠道',
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-8 堆叠进度条
   ═══════════════════════════════════════════════ */
const d8Segments = [
  { label: '直营', value: 45, color: chartPalette.c1 },
  { label: '加盟', value: 30, color: chartPalette.c2 },
  { label: '联营', value: 15, color: chartPalette.c3 },
  { label: '其他', value: 10, color: chartPalette.c4 },
];
function StackedProgressBar() {
  return (
    <div>
      <div style={{ display: 'flex', height: 32, borderRadius: 6, overflow: 'hidden' }}>
        {d8Segments.map((s) => (
          <div key={s.label} style={{ width: `${s.value}%`, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 500 }}>
            {s.value}%
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {d8Segments.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-2)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
function D8Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>合同类型占比</div>
        <StackedProgressBar />
      </Card>
    </PreviewShell>
  );
}
export const d8Variants: PreviewVariant[] = buildHeaderVariants('合同类型占比', <StackedProgressBar />, {
  order: ['筛选型', '筛选（复杂）', '操作型', '描述型', '纯净型'],
  descText: '统计截止：2024-06-30',
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-9 排名条形图
   ═══════════════════════════════════════════════ */
function RankingBarChart() {
  const data = [
    { name: '春熙路旗舰店', value: 586 },
    { name: '南京路概念店', value: 731 },
    { name: '国贸CBD店', value: 423 },
    { name: '天河城店', value: 358 },
    { name: '西湖银泰店', value: 284 },
  ].sort((a, b) => b.value - a.value);
  const ref = useG2Chart(() => ({
    type: 'interval',
    data,
    encode: { x: 'value', y: 'name', color: 'name' },
    transform: [{ type: 'sortX', by: 'y', reverse: true }],
    scale: { color: { range: getChartMonoScale().slice(0, 5).reverse() } },
    axis: { x: { title: false }, y: { title: false } },
    legend: false,
    coordinate: { transform: [{ type: 'transpose' }] },
    style: { radius: 4 },
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D9Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>门店营收 Top 5</div>
        <RankingBarChart />
      </Card>
    </PreviewShell>
  );
}
export const d9Variants: PreviewVariant[] = buildHeaderVariants('门店营收 Top 5', <RankingBarChart />, {
  order: ['筛选型', '筛选（复杂）', '操作型', '纯净型'],
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-10 散点图
   ═══════════════════════════════════════════════ */
const d10ScatterData = Array.from({ length: 40 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 20 + 5,
}));
function ScatterChartPreview() {
  const ref = useG2Chart(() => ({
    type: 'point',
    data: d10ScatterData,
    encode: { x: 'x', y: 'y', size: 'size' },
    scale: { size: { range: [4, 16] } },
    axis: { x: { title: '客单价' }, y: { title: '订单量' } },
    style: { fill: chartPalette.c1, fillOpacity: 0.6 },
    legend: false,
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D10Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>客单价 vs 订单量</div>
        <ScatterChartPreview />
      </Card>
    </PreviewShell>
  );
}
export const d10Variants: PreviewVariant[] = buildHeaderVariants('客单价 vs 订单量', <ScatterChartPreview />, {
  descText: '样本量：40 家门店',
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-11 AI摘要卡 — 直接复用 DigestCard
   ═══════════════════════════════════════════════ */
function D11Preview() {
  return (
    <PreviewShell maxW={520}>
      <DigestCard
        variant="summary"
        title="经营诊断结论"
        tagText="稳步增长"
        tagType="success"
        richContent={[
          { text: '本期总营收 ', bold: false },
          { text: '¥1,286万', bold: true },
          { text: '，环比增长 ', bold: false },
          { text: '12.5%', bold: true },
          { text: '，主要驱动来自华东区门店扩容和客单价提升。建议持续关注西南区客流下滑趋势。', bold: false },
        ]}
      />
    </PreviewShell>
  );
}
export const d11Variants: PreviewVariant[] = [
  {
    name: '列表型',
    render: () => (
      <PreviewShell maxW={520}>
        <DigestCard
          variant="list"
          title="经营诊断摘要"
          items={[
            { label: '营收增长', text: '华东区营收环比增长 12.5%，主要由门店扩容驱动' },
            { label: '客流预警', text: '西南区客流连续 3 周下滑，建议关注' },
            { label: '客单价', text: '较上月提升 ¥3.2，处于历史高位' },
          ]}
        />
      </PreviewShell>
    ),
  },
  {
    name: '卡片型',
    render: () => (
      <PreviewShell maxW={620}>
        <DigestCard
          variant="cards"
          title="经营诊断摘要"
          items={[
            { label: '营收增长', text: '环比增长 12.5%' },
            { label: '客流预警', text: '西南区连续 3 周下滑' },
            { label: '客单价', text: '较上月提升 ¥3.2' },
          ]}
        />
      </PreviewShell>
    ),
  },
];

/* ═══════════════════════════════════════════════
   D-12 雷达图
   ═══════════════════════════════════════════════ */
function RadarChartPreview() {
  const data = [
    { dim: '营收', score: 85 },
    { dim: '客流', score: 72 },
    { dim: '满意度', score: 90 },
    { dim: '复购', score: 68 },
    { dim: '履约', score: 80 },
    { dim: '口碑', score: 76 },
  ];
  const ref = useG2Chart(() => ({
    type: 'line',
    data,
    coordinate: { type: 'polar' },
    encode: { x: 'dim', y: 'score' },
    style: { lineWidth: 2, stroke: chartPalette.c1 },
    axis: { x: { grid: true }, y: { grid: true } },
    legend: false,
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D12Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>门店综合能力</div>
        <RadarChartPreview />
      </Card>
    </PreviewShell>
  );
}
export const d12Variants: PreviewVariant[] = buildHeaderVariants('门店综合能力', <RadarChartPreview />, {
  order: ['纯净型', '操作型', '筛选型', '筛选（复杂）'],
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-13 仪表盘
   ═══════════════════════════════════════════════ */
function GaugeChartPreview() {
  const ref = useG2Chart(() => ({
    type: 'gauge',
    data: { target: 82, total: 100 },
    scale: { color: { range: [chartTrend.down, '#FFD700', chartTrend.up] } },
    style: { arcLineCap: 'round' },
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D13Preview() {
  return (
    <PreviewShell maxW={420}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>健康度评分</div>
        <GaugeChartPreview />
      </Card>
    </PreviewShell>
  );
}
export const d13Variants: PreviewVariant[] = buildHeaderVariants('健康度评分', <GaugeChartPreview />, {
  order: ['纯净型', '筛选型', '筛选（复杂）', '操作型', '描述型'],
  descText: '评分周期：本月',
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={460}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-14 热力图
   ═══════════════════════════════════════════════ */
const d14Days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const d14Hours = [10, 12, 14, 16, 18, 20, 22];
const d14Data: { day: string; hour: number; value: number }[] = [];
d14Days.forEach((day) => d14Hours.forEach((hour) => d14Data.push({ day, hour, value: Math.floor(Math.random() * 100) })));
function HeatmapChartPreview() {
  const ref = useG2Chart(() => ({
    type: 'cell',
    data: d14Data,
    encode: { x: 'hour', y: 'day', color: 'value' },
    scale: { color: { range: getChartMonoScale().reverse(), domainMin: 0, domainMax: 100 } },
    axis: { x: { title: false }, y: { title: false } },
    legend: false,
    style: { radius: 3 },
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D14Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>时段活跃度热力图</div>
        <HeatmapChartPreview />
      </Card>
    </PreviewShell>
  );
}
export const d14Variants: PreviewVariant[] = buildHeaderVariants('时段活跃度热力图', <HeatmapChartPreview />, {
  descText: '统计周期：本周',
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   D-15 玫瑰图
   ═══════════════════════════════════════════════ */
function RoseChartPreview() {
  const data = [
    { category: '餐饮', value: 386 },
    { category: '零售', value: 295 },
    { category: '娱乐', value: 148 },
    { category: '服务', value: 98 },
    { category: '其他', value: 62 },
  ];
  const ref = useG2Chart(() => ({
    type: 'interval',
    data,
    coordinate: { type: 'polar', innerRadius: 0.3 },
    encode: { x: 'category', y: 'value', color: 'category' },
    scale: { color: { range: getChartCategoricalPalette(5) } },
    axis: { x: { title: false }, y: { title: false } },
    legend: { color: { position: 'right' } },
    style: { radius: 4 },
  }), []);
  return <div ref={ref} style={{ height: 220 }} />;
}
function D15Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-1)' }}>品类分布玫瑰图</div>
        <RoseChartPreview />
      </Card>
    </PreviewShell>
  );
}
export const d15Variants: PreviewVariant[] = buildHeaderVariants('品类分布玫瑰图', <RoseChartPreview />, {
  order: ['纯净型', '筛选型', '筛选（复杂）', '操作型'],
}).map((v) => ({ name: v.name, render: () => <PreviewShell maxW={560}>{v.render()}</PreviewShell> }));

/* ═══════════════════════════════════════════════
   W-1 欢迎栏
   ═══════════════════════════════════════════════ */
function TextWelcomeBanner() {
  return (
    <Card style={{ background: 'linear-gradient(135deg, var(--color-primary-4, #F0F6FF) 0%, #ffffff 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary-4, #F0F6FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600, color: 'var(--color-heading-accent, #FF7700)' }}>张</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-1, #111925)' }}>早上好，张三 👋</div>
          <div style={{ fontSize: 13, color: 'var(--text-3, rgba(17,25,37,0.5))', marginTop: 2 }}>今天是 7月30日，你有 3 项待处理任务</div>
        </div>
        <Button type="primary">去处理</Button>
      </div>
    </Card>
  );
}

function CarouselWelcomeBanner() {
  const slides = [
    { title: '7月运营月报已发布', desc: '点击查看本月经营数据全景', color: '#166FF7' },
    { title: '新店入驻政策更新', desc: '了解最新的加盟审核流程', color: '#00A854' },
  ];
  const s = slides[0];
  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: `linear-gradient(120deg, ${s.color} 0%, color-mix(in srgb, ${s.color} 60%, #6C3CE9) 100%)`, padding: 24, color: '#fff', minHeight: 100 }}>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
      <div style={{ fontSize: 13, opacity: 0.85 }}>{s.desc}</div>
      <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>›</div>
      <div style={{ position: 'absolute', left: 24, bottom: 12, display: 'flex', gap: 4 }}>
        {slides.map((_, i) => (
          <span key={i} style={{ width: i === 0 ? 14 : 5, height: 5, borderRadius: 3, background: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)' }} />
        ))}
      </div>
    </div>
  );
}

function W1Preview() {
  return (
    <PreviewShell maxW={560}>
      <TextWelcomeBanner />
    </PreviewShell>
  );
}
export const w1Variants: PreviewVariant[] = [
  { name: '文字欢迎', render: () => <PreviewShell maxW={560}><TextWelcomeBanner /></PreviewShell> },
  { name: '轮播图', render: () => <PreviewShell maxW={560}><CarouselWelcomeBanner /></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   W-2 操作引导卡
   ═══════════════════════════════════════════════ */
function W2Preview() {
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-primary-4, #F0F6FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon type="info-o" style={{ fontSize: 18, color: 'var(--color-brand-primary, #166FF7)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1, #111925)', marginBottom: 4 }}>完成店铺信息认证</div>
            <div style={{ fontSize: 13, color: 'var(--text-3, rgba(17,25,37,0.5))', marginBottom: 10 }}>完善店铺信息可提升曝光排名，已完成 2/4 步</div>
            <div style={{ height: 4, background: 'rgba(17,25,37,0.06)', borderRadius: 2, marginBottom: 12 }}>
              <div style={{ width: '50%', height: '100%', borderRadius: 2, background: 'var(--color-brand-primary, #166FF7)' }} />
            </div>
            <Button type="primary" size="small">继续完善</Button>
          </div>
        </div>
      </Card>
    </PreviewShell>
  );
}

/* ═══════════════════════════════════════════════
   W-3 快捷入口 — 直接复用 ShortcutGrid
   ═══════════════════════════════════════════════ */
function W3Preview() {
  return (
    <PreviewShell maxW={560}>
      <ShortcutGrid
        title="常用功能"
        items={[
          { icon: <Icon type="shop-o" />, color: '#166FF7', label: '门店管理' },
          { icon: <Icon type="file-text-o" />, color: '#00A854', label: '订单查询' },
          { icon: <Icon type="bar-chart-o" />, color: '#FF7700', label: '数据看板' },
          { icon: <Icon type="team-o" />, color: '#882EFF', label: '员工管理' },
          { icon: <Icon type="setting-o" />, color: '#00A3A3', label: '店铺设置' },
          { icon: <Icon type="gift-o" />, color: '#EB2F93', label: '营销活动' },
        ]}
      />
    </PreviewShell>
  );
}

/* ═══════════════════════════════════════════════
   W-4 个人信息卡
   ═══════════════════════════════════════════════ */
function W4Preview() {
  return (
    <PreviewShell maxW={400}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-4, #F0F6FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600, color: 'var(--color-heading-accent, #FF7700)' }}>张</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>张三</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>技术部 · 前端工程师</div>
            <div style={{ marginTop: 4 }}><Tag type="bordered" size="small" theme="blue">P6</Tag></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
          {[{ l: '管理门店', v: '12' }, { l: '本月订单', v: '1,286' }, { l: '任务完成', v: '89%' }].map((s) => (
            <div key={s.l} style={{ padding: '8px 0', background: 'rgba(17,25,37,0.03)', borderRadius: 6 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>{s.v}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </Card>
    </PreviewShell>
  );
}

/* ═══════════════════════════════════════════════
   W-5 公告通知
   ═══════════════════════════════════════════════ */
const w5Notices = [
  { title: '系统升级通知', date: '08-01', time: '10分钟前', type: '系统', theme: 'gray' as const },
  { title: '7月运营月报已发布', date: '07-30', time: '2小时前', type: '运营', theme: 'blue' as const },
  { title: '新店入驻流程变更', date: '07-28', time: '昨天', type: '政策', theme: 'orange' as const },
];

function NoticeListShell({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-1)' }}>公告通知</span>
        <Button.Link type="primary" shape="text">查看全部</Button.Link>
      </div>
      {children}
    </Card>
  );
}

function DatePrefixNotices() {
  return (
    <NoticeListShell>
      {w5Notices.map((n, i) => (
        <div key={n.title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < w5Notices.length - 1 ? '1px solid rgba(17,25,37,0.06)' : 'none', cursor: 'pointer' }}>
          <span style={{ fontSize: 12, color: 'var(--text-4)', width: 44, flexShrink: 0 }}>{n.date}</span>
          <span style={{ flex: 1, fontSize: 13, color: 'var(--text-1)' }}>{n.title}</span>
        </div>
      ))}
    </NoticeListShell>
  );
}

function TagPrefixNotices() {
  return (
    <NoticeListShell>
      {w5Notices.map((n, i) => (
        <div key={n.title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < w5Notices.length - 1 ? '1px solid rgba(17,25,37,0.06)' : 'none', cursor: 'pointer' }}>
          <Tag type="bordered" size="small" theme={n.theme}>{n.type}</Tag>
          <span style={{ flex: 1, fontSize: 13, color: 'var(--text-1)' }}>{n.title}</span>
          <span style={{ fontSize: 12, color: 'var(--text-4)' }}>{n.time}</span>
        </div>
      ))}
    </NoticeListShell>
  );
}

function W5Preview() {
  return (
    <PreviewShell maxW={520}>
      <TagPrefixNotices />
    </PreviewShell>
  );
}
export const w5Variants: PreviewVariant[] = [
  { name: '日期前缀', render: () => <PreviewShell maxW={520}><DatePrefixNotices /></PreviewShell> },
  { name: '标签前缀', render: () => <PreviewShell maxW={520}><TagPrefixNotices /></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   W-6 工作台指标区
   ═══════════════════════════════════════════════ */
function W6Preview() {
  const items = [
    { label: '今日营收', value: '¥38.6万', icon: 'money-o', color: '#166FF7' },
    { label: '今日订单', value: '1,580', icon: 'file-text-o', color: '#00A854' },
    { label: '新增用户', value: '126', icon: 'user-add-o', color: '#FF7700' },
  ];
  return (
    <PreviewShell maxW={520}>
      <Row gutter={[8, 8]}>
        {items.map((it) => (
          <Col key={it.label} span={8}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${it.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon type={it.icon} style={{ fontSize: 16, color: it.color }} />
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-1)' }}>{it.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{it.label}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </PreviewShell>
  );
}

/* ═══════════════════════════════════════════════
   W-7 待办列表
   ═══════════════════════════════════════════════ */
function W7Preview() {
  const todos = [
    { title: '审核「春熙路店」资质变更', priority: '紧急', done: false },
    { title: '确认 8 月营销活动预算', priority: '高', done: false },
    { title: '回复区域经理周报', priority: '中', done: true },
  ];
  const priColor: Record<string, string> = { '紧急': '#FF1F1F', '高': '#FF7700', '中': '#166FF7' };
  return (
    <PreviewShell maxW={520}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-1)' }}>待办事项</span>
          <Tag type="bordered" size="small" theme="blue">3 项</Tag>
        </div>
        {todos.map((t, i) => (
          <div key={t.title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < todos.length - 1 ? '1px solid rgba(17,25,37,0.06)' : 'none' }}>
            <Checkbox checked={t.done} />
            <span style={{ flex: 1, fontSize: 13, color: t.done ? 'var(--text-4)' : 'var(--text-1)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
            {!t.done && <span style={{ fontSize: 11, color: priColor[t.priority], background: `${priColor[t.priority]}10`, padding: '2px 6px', borderRadius: 4 }}>{t.priority}</span>}
          </div>
        ))}
      </Card>
    </PreviewShell>
  );
}

/* ═══════════════════════════════════════════════
   FD1 承载容器（PresentationContainer）
   变体 A 顺序落地页（默认）／变体 B 步骤落地页／变体 C 主从落地页／
   变体 D 抽屉（Drawer）／变体 E 弹窗（Dialog，仅表单页）
   ═══════════════════════════════════════════════ */
function FD1Preview() {
  return (
    <PreviewShell maxW={640}>
      <SequentialPagePreview />
    </PreviewShell>
  );
}
export const fd1Variants: PreviewVariant[] = [
  { name: '顺序落地页', render: () => <PreviewShell maxW={640}><SequentialPagePreview /></PreviewShell> },
  { name: '步骤落地页', render: () => <PreviewShell maxW={640}><StepPagePreview /></PreviewShell> },
  { name: '主从落地页', render: () => <PreviewShell maxW={640}><MasterDetailPagePreview /></PreviewShell> },
  { name: '抽屉 Drawer', render: () => <PreviewShell maxW={640}><DrawerContainerPreview /></PreviewShell> },
  { name: '弹窗 Dialog', render: () => <PreviewShell maxW={640}><ModalContainerPreview /></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   FD2 表头信息区（PageHeader）
   V1 标题 / V2 标题+描述 / V3 面包屑+标题 / V5 返回icon+标题 /
   V7 面包屑+标题+公告 / V9 返回icon+标题+状态标签 /
   V11 返回icon+标题+状态标签+摘要信息行 / V-空间 空间切换器+标题
   ═══════════════════════════════════════════════ */
function FD2Preview() {
  return (
    <PreviewShell maxW={560}>
      <div className="dash-card" style={{ padding: 20 }}>
        <PageHeaderV11 />
      </div>
    </PreviewShell>
  );
}
export const fd2Variants: PreviewVariant[] = [
  // 只展示最复杂/特殊的代表性变体，简单的 V1/V2/V3/V5 省略
  { name: '面包屑+标题+公告', render: () => <PreviewShell maxW={560}><div className="dash-card" style={{ padding: 20 }}><PageHeaderV7 /></div></PreviewShell> },
  { name: '返回+标题+状态', render: () => <PreviewShell maxW={560}><div className="dash-card" style={{ padding: 20 }}><PageHeaderV9 /></div></PreviewShell> },
  { name: '详情+摘要信息行', render: () => <PreviewShell maxW={560}><div className="dash-card" style={{ padding: 20 }}><PageHeaderV11 /></div></PreviewShell> },
  { name: '面包屑+标题+锚点导航', render: () => <PreviewShell maxW={560}><div className="dash-card" style={{ padding: 20 }}><PageHeaderAnchor /></div></PreviewShell> },
  { name: '空间切换器+标题', render: () => <PreviewShell maxW={560}><div className="dash-card" style={{ padding: 20 }}><PageHeaderSpaceSwitcher /></div></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   FD3 只读数据表格
   变体A 基础信息表 / 变体B 图文信息表 / 变体C 明细数据表
   ═══════════════════════════════════════════════ */
export const fd3Variants: PreviewVariant[] = [
  { name: '基础信息表', render: () => <PreviewShell maxW={640}><div className="dash-card" style={{ padding: 20 }}><BasicInfoTable /></div></PreviewShell> },
  { name: '图文信息表', render: () => <PreviewShell maxW={560}><div className="dash-card" style={{ padding: 20 }}><ImageInfoTable /></div></PreviewShell> },
  { name: '明细数据表（固定列）', render: () => <PreviewShell maxW={640}><div className="dash-card" style={{ padding: 20 }}><DetailDataTable /></div></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   Form1 操作栏（ActionBar）
   变体A 顺序表单 / 变体B 分步表单（交互）/ 变体C 抽屉弹窗 / 变体D 带危险操作
   ═══════════════════════════════════════════════ */
function Form1Preview() {
  return (
    <PreviewShell maxW={480}>
      <SequentialActionBarDemo />
    </PreviewShell>
  );
}
export const form1Variants: PreviewVariant[] = [
  { name: '顺序表单操作栏', render: () => <PreviewShell maxW={480}><SequentialActionBarDemo /></PreviewShell> },
  { name: '分步表单操作栏', render: () => <PreviewShell maxW={480}><StepActionBarDemo /></PreviewShell> },
  { name: '抽屉/弹窗操作栏', render: () => <PreviewShell maxW={480}><PanelActionBarDemo /></PreviewShell> },
  { name: '带危险操作', render: () => <PreviewShell maxW={480}><DangerActionBarDemo /></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   Form2 分组分段（GroupSection）
   变体 A · 基础分组／变体 B · 折叠分组／变体 C · 分步分组
   ═══════════════════════════════════════════════ */
function Form2Preview() {
  return (
    <PreviewShell maxW={560}>
      <Card><BasicGroupSection /></Card>
    </PreviewShell>
  );
}
export const form2Variants: PreviewVariant[] = [
  { name: '基础分组', render: () => <PreviewShell maxW={560}><Card><BasicGroupSection /></Card></PreviewShell> },
  { name: '折叠分组', render: () => <PreviewShell maxW={560}><Card><CollapsibleGroupSection /></Card></PreviewShell> },
  { name: '分步分组', render: () => <PreviewShell maxW={560}><Card><SteppedGroupSection /></Card></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   Form3 单栏布局（SingleLayout）
   参数① 表单区宽度：半宽留白（默认）/ 全宽拉通
   参数② 栏内列数：单列（默认）/ 双列 / 三列 / 混合列
   另有：标签顶部、紧凑模式
   ═══════════════════════════════════════════════ */
function Form3Preview() {
  return (
    <PreviewShell maxW={640}>
      <Card>
        <SingleColumnHalfWidth />
      </Card>
    </PreviewShell>
  );
}
export const form3Variants: PreviewVariant[] = [
  { name: '①半宽留白 + ②单列（默认）', render: () => <PreviewShell maxW={640}><Card><SingleColumnHalfWidth /></Card></PreviewShell> },
  { name: '①全宽拉通 + ②单列', render: () => <PreviewShell maxW={640}><Card><SingleColumnFullWidth /></Card></PreviewShell> },
  { name: '②双列（span=12）', render: () => <PreviewShell maxW={640}><Card><TwoColumnForm /></Card></PreviewShell> },
  { name: '②三列（span=8）', render: () => <PreviewShell maxW={640}><Card><ThreeColumnForm /></Card></PreviewShell> },
  { name: '标签顶部（labelPosition=top）', render: () => <PreviewShell maxW={480}><Card><LabelTopForm /></Card></PreviewShell> },
  { name: '紧凑模式（弹窗/抽屉）', render: () => <PreviewShell maxW={400}><Card><CompactForm /></Card></PreviewShell> },
];

/* ═══════════════════════════════════════════════
Form4 步骤条（StepBar）
MTD Steps 步骤导航条，active 驱动状态、不可点击跳转
═══════════════════════════════════════════════ */
export const form4Variants: PreviewVariant[] = [
{ name: '标准横向', render: () => <PreviewShell maxW={760}><Card><StandardStepBar /></Card></PreviewShell> },
  { name: '带描述', render: () => <PreviewShell maxW={760}><Card><DescriptionStepBar /></Card></PreviewShell> },
  { name: '点状', render: () => <PreviewShell maxW={760}><Card><DotStepBar /></Card></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   Form5 可编辑表格（EditableTable）
   规范要点：
   - 全行始终编辑态：每个数据单元格始终渲染为输入控件
   - 操作列为蓝色文字按钮（非图标 / 非红色危险按钮），行数达到最小值时 disabled
   - 添加行按钮为蓝色无框文字按钮，带 + 图标，居左，紧贴表格下方（无额外间距）
   - 独立 state 管理，不嵌套在 Form.Item 内
   - 稳定行 key（递增计数器），不使用数组下标
   ═══════════════════════════════════════════════ */
interface Form5Row {
  key: string;
  name: string;
  type: string;
  amount: number | null;
}

let form5RowSeq = 0;
function createForm5Row(): Form5Row {
  return { key: `f5_row_${++form5RowSeq}`, name: '', type: '', amount: null };
}

function Form5EditableTable() {
  const [dataSource, setDataSource] = useState<Form5Row[]>(() => [
    { key: 'f5_row_seed_1', name: '招牌奶茶', type: 'income', amount: 18 },
    { key: 'f5_row_seed_2', name: '水果茶', type: 'income', amount: 22 },
    { key: 'f5_row_seed_3', name: '包装费', type: 'expense', amount: 2 },
  ]);

  const handleFieldChange = (key: string, field: keyof Form5Row, value: any) => {
    setDataSource((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  };
  const handleAdd = () => setDataSource((prev) => [...prev, createForm5Row()]);
  const handleDelete = (key: string) => setDataSource((prev) => prev.filter((row) => row.key !== key));

  const total = dataSource.reduce((sum, row) => sum + (row.amount || 0), 0);

  const columns = [
    {
      label: '名称',
      dataKey: 'name',
      render: (_v: string, row: Form5Row) => (
        <Input
          value={row.name}
          placeholder="请输入名称"
          onChange={(val: string) => handleFieldChange(row.key, 'name', val)}
        />
      ),
    },
    {
      label: '类型',
      dataKey: 'type',
      width: 140,
      render: (_v: string, row: Form5Row) => (
        <Select
          value={row.type || undefined}
          placeholder="请选择类型"
          style={{ width: '100%' }}
          onChange={(val: string) => handleFieldChange(row.key, 'type', val)}
        >
          <Select.Option value="income">收入</Select.Option>
          <Select.Option value="expense">支出</Select.Option>
          <Select.Option value="transfer">转账</Select.Option>
        </Select>
      ),
    },
    {
      label: '金额',
      dataKey: 'amount',
      width: 140,
      render: (_v: number | null, row: Form5Row) => (
        <InputNumber
          value={row.amount}
          placeholder="请输入"
          min={0}
          precision={2}
          style={{ width: '100%' }}
          onChange={(val: number | null) => handleFieldChange(row.key, 'amount', val)}
        />
      ),
    },
    {
      label: '操作',
      dataKey: 'actions',
      width: 60,
      render: (_v: any, row: Form5Row) => (
        <Button
          shape="text"
          type="primary"
          onClick={() => handleDelete(row.key)}
          disabled={dataSource.length <= 1}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="editable-table">
      <Table columns={columns} data={dataSource} rowKey="key" pagination={false} />
      <Button className="editable-table__add-row" shape="text" type="primary" onClick={handleAdd} icon="add">
        添加一行
      </Button>
      <div className="editable-table__summary">
        合计金额：<strong>¥{total.toFixed(2)}</strong>
      </div>
    </div>
  );
}

function Form5Preview() {
  return (
    <PreviewShell maxW={560}>
      <Card><Form5EditableTable /></Card>
    </PreviewShell>
  );
}
export const form5Variants: PreviewVariant[] = [
  { name: '带汇总行（默认）', render: () => <PreviewShell maxW={560}><Card><Form5EditableTable /></Card></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   Form6 复选组（CheckboxGroup）
   变体 A · 基础横排／变体 B · 分组多选矩阵／变体 C · 大数据量勾选
   ═══════════════════════════════════════════════ */
function Form6Preview() {
  return (
    <PreviewShell maxW={640}>
      <Card><CapabilityFormSection /></Card>
    </PreviewShell>
  );
}
export const form6Variants: PreviewVariant[] = [
  { name: '基础横排', render: () => <PreviewShell maxW={640}><Card><BasicCheckboxRow /></Card></PreviewShell> },
  { name: '分组多选矩阵', render: () => <PreviewShell maxW={640}><Card><CapabilityFormSection /></Card></PreviewShell> },
  { name: '大数据量勾选', render: () => <PreviewShell maxW={640}><Card><TableCheckboxSelector /></Card></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   Form7 文件/图片上传（FileUpload）
   变体 A · 按钮上传／变体 B · 拖拽上传／变体 C · 图片上传
   ═══════════════════════════════════════════════ */
function Form7Preview() {
  return (
    <PreviewShell maxW={560}>
      <Card><ButtonUploadField /></Card>
    </PreviewShell>
  );
}
export const form7Variants: PreviewVariant[] = [
  { name: '按钮上传', render: () => <PreviewShell maxW={560}><Card><ButtonUploadField /></Card></PreviewShell> },
  { name: '拖拽上传', render: () => <PreviewShell maxW={560}><Card><DraggerUploadField /></Card></PreviewShell> },
  { name: '图片上传', render: () => <PreviewShell maxW={560}><Card><ImageUploadField /></Card></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   Form8 公式编辑器（FormulaEditor）
   条件规则型（条件组树）／计算公式配置型
   ═══════════════════════════════════════════════ */
function Form8Preview() {
  return (
    <PreviewShell maxW={640}>
      <Card><ConditionGroupEditor /></Card>
    </PreviewShell>
  );
}
export const form8Variants: PreviewVariant[] = [
{ name: '条件规则型（条件组树/且或逻辑）', render: () => <PreviewShell maxW={640}><Card><ConditionGroupEditor /></Card></PreviewShell> },
  { name: '计算公式配置型（固定文本+变量+运算符）', render: () => <PreviewShell maxW={640}><Card><FormulaTemplateEditor /></Card></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   Form9 增删标签组（TagGroupEditor）
   分组标签行 / 无分组 / 下拉选择 / 只读展示
   ═══════════════════════════════════════════════ */
function Form9Preview() {
  return (
    <PreviewShell maxW={560}>
      <Card>
        <GroupedTagEditor />
      </Card>
    </PreviewShell>
  );
}
export const form9Variants: PreviewVariant[] = [
  { name: '分组标签行（标准）', render: () => <PreviewShell maxW={560}><Card><GroupedTagEditor /></Card></PreviewShell> },
  { name: '无分组标签（单行）', render: () => <PreviewShell maxW={480}><Card><SingleTagEditor /></Card></PreviewShell> },
  { name: '下拉选择标签', render: () => <PreviewShell maxW={480}><Card><SelectTagEditor /></Card></PreviewShell> },
  { name: '只读标签展示', render: () => <PreviewShell maxW={480}><Card><ReadonlyTagDisplay /></Card></PreviewShell> },
];

/* ═══════════════════════════════════════════════
   Detail1 Tab 切换（TabPanel）
   变体：5Tab 多维度，Tab 数量接近上限，演示横向铺满效果
   受控模式：activeKey + onChange
   ═══════════════════════════════════════════════ */
function TabPanel5Tabs() {
  const [active, setActive] = useState('basic');
  return (
    <Tabs activeKey={active} onChange={(k: string) => setActive(k)} className="detail-tabs">
      <Tabs.TabPane key="basic"    label="基本信息">
        <div style={{ paddingTop: 16 }}>
          <TwoColumnDescription />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane key="capacity" label="运力明细">
        <div style={{ padding: '24px 0', fontSize: 14, color: 'var(--text-3)', textAlign: 'center' }}>
          可承载 FD3 只读数据表格
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane key="finance"  label="财务数据">
        <div style={{ padding: '24px 0', fontSize: 14, color: 'var(--text-3)', textAlign: 'center' }}>
          财务数据面板
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane key="history"  label="审批记录">
        <div style={{ padding: '24px 0', fontSize: 14, color: 'var(--text-3)', textAlign: 'center' }}>
          可承载 MTD Timeline 时间线
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane key="log"      label="操作日志">
        <div style={{ padding: '24px 0', fontSize: 14, color: 'var(--text-3)', textAlign: 'center' }}>
          操作日志面板
        </div>
      </Tabs.TabPane>
    </Tabs>
  );
}

export function Detail1Preview() {
  return (
    <PreviewShell maxW={680}><Card><TabPanel5Tabs /></Card></PreviewShell>
  );
}

/* ═══════════════════════════════════════════════
   Detail2 描述列表
   变体 A · 2 列横向 / 变体 B · 3 列横向 / 变体 C · 4 列纵向 / 变体 D · 混用列数
   ═══════════════════════════════════════════════ */
export const detail2Variants: PreviewVariant[] = [
  {
    name: '2列横向（默认）',
    render: () => (
      <PreviewShell maxW={680}>
        <Card><TwoColumnDescription /></Card>
      </PreviewShell>
    ),
  },
  {
    name: '3列横向',
    render: () => (
      <PreviewShell maxW={760}>
        <Card><ThreeColumnDescription /></Card>
      </PreviewShell>
    ),
  },
  {
    name: '4列纵向（信息密集）',
    render: () => (
      <PreviewShell maxW={760}>
        <Card><FourColumnDescription /></Card>
      </PreviewShell>
    ),
  },
  {
    name: '混用列数',
    render: () => (
      <PreviewShell maxW={760}>
        <Card><MixedColumnsDescription /></Card>
      </PreviewShell>
    ),
  },
];

function Detail2Preview() {
  return (
    <PreviewShell maxW={680}>
      <Card><TwoColumnDescription /></Card>
    </PreviewShell>
  );
}

/* ═══════════════════════════════════════════════
Detail3 附件预览
变体 A · 仅文件链接 / 变体 B · 仅图片 / 变体 C · 图片+文件混合 / 变体 D · 嵌入 GroupSection
═══════════════════════════════════════════════ */
export const detail3Variants: PreviewVariant[] = [
{
name: '文件链接列表',
render: () => (
<PreviewShell maxW={600}>
<Card><FilesOnlyPreview /></Card>
</PreviewShell>
),
},
{
name: '图片缩略图',
render: () => (
<PreviewShell maxW={600}>
<Card><ImagesOnlyPreview /></Card>
</PreviewShell>
),
},
{
name: '图片+文件混合',
render: () => (
<PreviewShell maxW={600}>
<Card><MixedAttachmentPreview /></Card>
</PreviewShell>
),
},
{
name: '嵌入分组（实际场景）',
render: () => (
<PreviewShell maxW={600}>
<GroupSectionAttachmentPreview />
</PreviewShell>
),
},
];

function Detail3Preview() {
  return (
    <PreviewShell maxW={600}>
      <Card><FilesOnlyPreview /></Card>
    </PreviewShell>
  );
}

/* ═══════════════════════════════════════════════
   注册表
   ═══════════════════════════════════════════════ */
export const modulePreviews: Record<string, React.ComponentType> = {
  'G-1+G-2': G1G2Preview,
  'G-3': G3Preview,
  'G-4': G4Preview,
  'D-1': D1Preview,
  'D-2': D2Preview,
  'D-3': D3Preview,
  'D-4': D4Preview,
  'D-5': D5Preview,
  'D-6': D6Preview,
  'D-7': D7Preview,
  'D-8': D8Preview,
  'D-9': D9Preview,
  'D-10': D10Preview,
  'D-11': D11Preview,
  'D-12': D12Preview,
  'D-13': D13Preview,
  'D-14': D14Preview,
  'D-15': D15Preview,
  'W-1': W1Preview,
  'W-2': W2Preview,
  'W-3': W3Preview,
  'W-4': W4Preview,
  'W-5': W5Preview,
  'W-6': W6Preview,
  'W-7': W7Preview,
  'FD1': FD1Preview,
  'FD2': FD2Preview,
  'Form1': Form1Preview,
  'Form2': Form2Preview,
'Form3': Form3Preview,
'Form5': Form5Preview,
  'Form6': Form6Preview,
  'Form7': Form7Preview,
  'Form8': Form8Preview,
  'Form9': Form9Preview,
  'Detail1': Detail1Preview,
  'Detail2': Detail2Preview,
  'Detail3': Detail3Preview,
};

/* ═══════════════════════════════════════════════
   变体注册表 — 用于 ModuleDetail 页面的 VariantSwitcher
   ─────────────────────────────────────────────
   仅收录 l2Modules.ts 中声明了 variants 的模块，key 与 L2Module.id 一致。
   D-2/D-3 在 l2Modules.ts 中各自只有一个条目，但实际有两个子模块（如 环形进度/进度指标），
   这里用 { subModule: variants[] } 的分组形式表达，ModuleDetail 按分组依次渲染多个 VariantSwitcher。
   ═══════════════════════════════════════════════ */
export const modulePreviewVariants: Record<string, PreviewVariant[]> = {
  'G-3': g3Variants,
  'G-4': g4PreviewVariants,
  'D-1': d1Variants,
  'D-4': d4Variants,
  'D-5': d5Variants,
  'D-6': d6Variants,
  'D-7': d7Variants,
  'D-8': d8Variants,
  'D-9': d9Variants,
  'D-10': d10Variants,
  'D-12': d12Variants,
  'D-13': d13Variants,
  'D-14': d14Variants,
  'D-15': d15Variants,
  'W-1': w1Variants,
  'W-5': w5Variants,
  'FD1': fd1Variants,
  'FD2': fd2Variants,
  'FD3': fd3Variants,
  'Form1': form1Variants,
  'Form2': form2Variants,
  'Form3': form3Variants,
  'Form4': form4Variants,
  'Form6': form6Variants,
  'Form7': form7Variants,
  'Form8': form8Variants,
  'Form9': form9Variants,
  'Detail2': detail2Variants,
  'Detail3': detail3Variants,
};

/* D-2/D-3/D-11 存在多个子模块，各自维护独立的一套变体，
   ModuleDetail 需要依次展示「子模块名 + VariantSwitcher」，故单独导出分组信息。 */
export const modulePreviewSubGroups: Record<string, { label: string; variants: PreviewVariant[] }[]> = {
  'D-2': [
    { label: '环形进度', variants: d2RingVariants },
    { label: '进度指标', variants: d2MetricsVariants },
  ],
  'D-3': [
    { label: '折线图', variants: d3LineVariants },
    { label: '面积图', variants: d3AreaVariants },
  ],
  'D-11': [
    { label: 'AI摘要卡', variants: d11Variants },
  ],
};
