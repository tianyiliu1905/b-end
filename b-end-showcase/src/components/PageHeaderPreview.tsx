/**
 * FD2 · 表头信息区（PageHeader）
 * ─────────────────────────────────────────────
 * 页面白色卡片内顶部的标题信息区域，由多个可选原子自由组合：
 * 空间切换器 → 面包屑 → 标题（含返回icon、状态标签）→ 摘要信息行 → 描述 → 公告。
 *
 * 变体矩阵（按复杂度递增）：
 * V1 标题 / V2 标题+描述 / V3 面包屑+标题 / V5 返回icon+标题 /
 * V7 面包屑+标题+公告 / V9 返回icon+标题+状态标签（详情页最常见）/
 * V11 返回icon+标题+状态标签+摘要信息行（详情页信息密度较高） /
 * V-空间 空间切换器+标题
 */
import { useState } from 'react';
import { Breadcrumb, Icon, Announcement, Tag, Select, Anchor } from '@ss/mtd-react3';
import './PageHeaderPreview.css';

/* ══════════════════════════════════════════════
   V1 · 仅标题
   ══════════════════════════════════════════════ */
export function PageHeaderV1() {
  return (
    <div className="page-header">
      <h1 className="page-header__title">新建门店</h1>
    </div>
  );
}

/* ══════════════════════════════════════════════
   V2 · 标题 + 描述
   ══════════════════════════════════════════════ */
export function PageHeaderV2() {
  return (
    <div className="page-header">
      <h1 className="page-header__title">门店基础信息配置</h1>
      <p className="page-header__desc">用于维护门店的基础档案信息，提交后将进入审核流程，预计 1 个工作日内完成审核。</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   V3 · 面包屑 + 标题
   ══════════════════════════════════════════════ */
export function PageHeaderV3() {
  return (
    <div className="page-header">
      <div className="page-header__breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item>门店管理</Breadcrumb.Item>
          <Breadcrumb.Item>门店详情</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <h1 className="page-header__title">春熙路旗舰店</h1>
    </div>
  );
}

/* ══════════════════════════════════════════════
   V5 · 返回icon + 标题
   ══════════════════════════════════════════════ */
export function PageHeaderV5() {
  return (
    <div className="page-header">
      <h1 className="page-header__title page-header__title--with-back">
        <Icon type="arrow-left" className="page-header__back-icon" />
        编辑门店信息
      </h1>
    </div>
  );
}

/* ══════════════════════════════════════════════
   V7 · 面包屑 + 标题 + 公告
   ══════════════════════════════════════════════ */
export function PageHeaderV7() {
  return (
    <div className="page-header">
      <div className="page-header__breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item>配置中心</Breadcrumb.Item>
          <Breadcrumb.Item>门店配置</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <h1 className="page-header__title">门店配置管理</h1>
      <Announcement
        type="info"
        showIcon
        closeable
        className="page-header__announcement"
        title="系统将于本周五 22:00 进行升级维护，届时该功能不可用。"
      />
    </div>
  );
}

/* ══════════════════════════════════════════════
   V9 · 返回icon + 标题 + 状态标签（详情页最常见形态）
   ══════════════════════════════════════════════ */
export function PageHeaderV9() {
  return (
    <div className="page-header">
      <h1 className="page-header__title page-header__title--with-back">
        <Icon type="arrow-left" className="page-header__back-icon" />
        春熙路旗舰店审核详情
        <Tag theme="orange" className="page-header__status">审核中</Tag>
      </h1>
    </div>
  );
}

/* ══════════════════════════════════════════════
   V11 · 返回icon + 标题 + 状态标签 + 摘要信息行
   （详情页信息密度较高时的最常见形态）
   ══════════════════════════════════════════════ */
interface SummaryField {
  label: string;
  value: string;
  link?: boolean;
}

function PageHeaderSummaryRow({
  fields,
  columnCount,
}: {
  fields: SummaryField[];
  columnCount: number;
}) {
  const visible = fields.filter((f) => f.value != null && f.value !== '');
  return (
    <div
      className="page-header__summary-row"
      style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
    >
      {visible.map((f) => (
        <span className="page-header__summary-item" key={f.label}>
          <span className="page-header__summary-label">{f.label}</span>
          <span
            className={
              f.link
                ? 'page-header__summary-value page-header__summary-value--link'
                : 'page-header__summary-value'
            }
          >
            {f.value}
          </span>
        </span>
      ))}
    </div>
  );
}

export function PageHeaderV11() {
  // 分行硬约束：每行字段数必须为偶数（2/4/6…），6 个字段拆成 4+2 而不是 3+3
  const row1: SummaryField[] = [
    { label: '门店ID', value: 'ST-0000123' },
    { label: '门店名称', value: '春熙路旗舰店' },
    { label: '门店状态', value: '营业中' },
    { label: '门店类型', value: '直营' },
  ];
  const row2: SummaryField[] = [
    { label: '所属区域', value: '成都·西南区' },
    { label: '负责人', value: 'wangxiaoming' },
  ];
  const columnCount = Math.max(row1.length, row2.length);

  return (
    <div className="page-header">
      <h1 className="page-header__title page-header__title--with-back">
        <Icon type="arrow-left" className="page-header__back-icon" />
        春熙路旗舰店
        <Tag theme="green" className="page-header__status">已通过</Tag>
      </h1>
      <div className="page-header__summary page-header__summary--aligned">
        <PageHeaderSummaryRow fields={row1} columnCount={columnCount} />
        <PageHeaderSummaryRow fields={row2} columnCount={columnCount} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   V-Anchor · 面包屑 + 标题 + 描述 + 锚点导航
   （分组数 > 3 的长表单/详情页，Anchor 横向锚点条紧贴表头底部，
    sticky 固定，随内容区滚动高亮当前分组）
   ══════════════════════════════════════════════ */
const ANCHOR_ITEMS = [
  { key: 'group-basic', href: '#group-basic', title: '基本信息' },
  { key: 'group-scope', href: '#group-scope', title: '适用范围' },
  { key: 'group-rule', href: '#group-rule', title: '规则配置' },
  { key: 'group-material', href: '#group-material', title: '素材与标签' },
];

export function PageHeaderAnchor() {
  return (
    <>
      {/* .page-header 与 .page-header__anchor 必须是同级兄弟节点：
          Anchor 容器用 position: sticky 吸顶，其祖先链上不能出现 overflow: hidden，
          若嵌套在 .page-header 内部会被父级卡片的 overflow: hidden 影响吸顶效果 */}
      <div className="page-header page-header--no-border">
        <div className="page-header__breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>营销中心</Breadcrumb.Item>
            <Breadcrumb.Item>创建到店套餐活动</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <h1 className="page-header__title">创建到店套餐活动</h1>
        <p className="page-header__desc">配置一款到店核销的团购套餐活动，完善基本信息与规则后即可提交审核。</p>
      </div>
      <div className="page-header__anchor">
        <Anchor direction="horizontal" type="card" affix={false} items={ANCHOR_ITEMS} />
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════
   V-空间 · 空间切换器 + 标题
   ══════════════════════════════════════════════ */
export function PageHeaderSpaceSwitcher() {
  const [space, setSpace] = useState('waimai');
  return (
    <div>
      <div className="space-switcher">
        <span className="space-switcher__label">当前空间</span>
        <Select
          value={space}
          onChange={(v: any) => setSpace(v)}
          className="space-switcher__select"
        >
          <Select.Option value="waimai">外卖</Select.Option>
          <Select.Option value="dianping">点评</Select.Option>
          <Select.Option value="hotel">酒店</Select.Option>
        </Select>
      </div>
      <div className="page-header">
        <h1 className="page-header__title">门店经营数据看板</h1>
      </div>
    </div>
  );
}
