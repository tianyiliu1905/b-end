import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Icon,
  Menu,
  Breadcrumb,
  Announcement,
  Table,
  Pagination,
} from '@ss/mtd-react3';
import ModuleWrapper from '../../components/ModuleWrapper';
import './MasterDetailPage.css';

// ===================== Types =====================

interface PlanItem {
  key: string;
  name: string;
}

interface SummaryField {
  label: string;
  value: string;
  link?: boolean;
}

interface DescItem {
  label: string;
  value: string;
  link?: boolean;
}

interface StatItem {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

interface TableRecord {
  id: string;
  date: string;
  city: string;
  impressions: number;
  clicks: number;
  ctr: string;
  cost: number;
  status: string;
}

/** 每个计划的完整数据 */
interface PlanData {
  title: string;
  summaryFields: SummaryField[];
  announcement?: string;
  statCards: StatItem[];
  basicInfo: DescItem[];
  deliveryConfig: DescItem[];
  records: TableRecord[];
}

// ===================== 左侧列表 =====================

const planList: PlanItem[] = [
  { key: 'plan-001', name: '夏季促销投放计划' },
  { key: 'plan-002', name: '新品上市推广计划' },
  { key: 'plan-003', name: '节日大促投放方案' },
  { key: 'plan-004', name: '品牌曝光提升计划' },
  { key: 'plan-005', name: '用户拉新投放计划' },
  { key: 'plan-006', name: '老客唤醒营销方案' },
];

// ===================== 各计划 Mock 数据 =====================
// 差异设计（摘要字段数）：
//   plan-001 夏季促销 → 6 个摘要字段，全量模块
//   plan-002 新品上市 → 13 个摘要字段（字段最多，多行展示）
//   plan-003 节日大促 → 7 个摘要字段，已结案
//   plan-004 品牌曝光 → 4 个摘要字段（单行）
//   plan-005 用户拉新 → 3 个摘要字段（最精简）
//   plan-006 老客唤醒 → 4 个摘要字段（单行）

const planDataMap: Record<string, PlanData> = {
  // ——————— plan-001：夏季促销（6 个摘要字段，全量模块）———————
  'plan-001': {
    title: '夏季促销投放计划',
    summaryFields: [
      { label: '计划编号', value: 'DLV-20260720-001' },
      { label: '投放城市', value: '北京、上海、广州、深圳' },
      { label: '负责人', value: '张明' },
      { label: '创建时间', value: '2026-07-15 10:30:00' },
      { label: '优先级', value: '高' },
      { label: '预算', value: '¥ 500,000' },
    ],
    announcement: '该投放计划将于 2026-08-20 结束，请及时关注投放效果并调整策略。',
    statCards: [
      { label: '总曝光量', value: '1,283,456', trend: '12.5%', trendUp: true },
      { label: '总点击量', value: '89,234', trend: '8.3%', trendUp: true },
      { label: '点击率', value: '6.95%', trend: '2.1%', trendUp: false },
      { label: '消耗金额', value: '¥ 234,560', trend: '15.7%', trendUp: true },
    ],
    basicInfo: [
      { label: '计划名称', value: '夏季促销投放计划' },
      { label: '计划编号', value: 'DLV-20260720-001' },
      { label: '投放类型', value: 'Push推送' },
      { label: '投放渠道', value: 'App Push、短信' },
      { label: '计划状态', value: '进行中' },
      { label: '创建人', value: '张明 (zhangming01)' },
      { label: '创建时间', value: '2026-07-15 10:30:00' },
      { label: '计划周期', value: '2026-07-20 至 2026-08-20' },
    ],
    deliveryConfig: [
      { label: '目标人群', value: '25-35岁，一二线城市' },
      { label: '投放频次', value: '每日 2 次' },
      { label: '单次预算', value: '¥ 15,000' },
      { label: '出价方式', value: 'CPC' },
      { label: '日预算上限', value: '¥ 8,000' },
      { label: '总预算', value: '¥ 500,000' },
    ],
    records: [
      { id: '1', date: '2026-07-20', city: '北京', impressions: 128000, clicks: 8900, ctr: '6.95%', cost: 18600, status: '生效' },
      { id: '2', date: '2026-07-20', city: '上海', impressions: 115000, clicks: 7200, ctr: '6.26%', cost: 15200, status: '生效' },
      { id: '3', date: '2026-07-19', city: '广州', impressions: 98000, clicks: 6100, ctr: '6.22%', cost: 12800, status: '生效' },
      { id: '4', date: '2026-07-19', city: '深圳', impressions: 89000, clicks: 5800, ctr: '6.52%', cost: 11500, status: '生效' },
      { id: '5', date: '2026-07-18', city: '北京', impressions: 134000, clicks: 9200, ctr: '6.87%', cost: 19400, status: '已结束' },
      { id: '6', date: '2026-07-18', city: '上海', impressions: 102000, clicks: 6800, ctr: '6.67%', cost: 14300, status: '已结束' },
      { id: '7', date: '2026-07-17', city: '广州', impressions: 87000, clicks: 5400, ctr: '6.21%', cost: 10800, status: '已结束' },
      { id: '8', date: '2026-07-17', city: '深圳', impressions: 76000, clicks: 4900, ctr: '6.45%', cost: 9600, status: '已结束' },
    ],
  },

  // ——————— plan-002：新品上市（13 个摘要字段，字段最多）———————
  'plan-002': {
    title: '新品上市推广计划',
    summaryFields: [
      { label: '计划编号', value: 'DLV-20260718-002' },
      { label: '投放城市', value: '全国' },
      { label: '负责人', value: '李娜' },
      { label: '创建时间', value: '2026-07-10 09:00:00' },
      { label: '优先级', value: '中' },
      { label: '预算', value: '¥ 300,000' },
      { label: '投放类型', value: '信息流广告' },
      { label: '投放渠道', value: '美团首页、外卖频道' },
      { label: '出价方式', value: 'CPM' },
      { label: '计划状态', value: '进行中' },
      { label: '目标人群', value: '18-45岁' },
      { label: '日预算上限', value: '¥ 12,000' },
      { label: '计划周期', value: '2026-07-10 至 2026-08-10' },
    ],
    statCards: [],
    basicInfo: [
      { label: '计划名称', value: '新品上市推广计划' },
      { label: '计划编号', value: 'DLV-20260718-002' },
      { label: '投放类型', value: '信息流广告' },
      { label: '投放渠道', value: '美团首页、外卖频道' },
      { label: '计划状态', value: '进行中' },
      { label: '创建人', value: '李娜 (lina02)' },
    ],
    deliveryConfig: [
      { label: '目标人群', value: '18-45岁，全国' },
      { label: '投放频次', value: '每日 3 次' },
      { label: '出价方式', value: 'CPM' },
      { label: '总预算', value: '¥ 300,000' },
    ],
    records: [
      { id: '1', date: '2026-07-20', city: '北京', impressions: 95000, clicks: 4750, ctr: '5.00%', cost: 14250, status: '生效' },
      { id: '2', date: '2026-07-20', city: '上海', impressions: 88000, clicks: 4400, ctr: '5.00%', cost: 13200, status: '生效' },
      { id: '3', date: '2026-07-19', city: '成都', impressions: 72000, clicks: 3600, ctr: '5.00%', cost: 10800, status: '生效' },
      { id: '4', date: '2026-07-19', city: '杭州', impressions: 65000, clicks: 3250, ctr: '5.00%', cost: 9750, status: '生效' },
    ],
  },

  // ——————— plan-003：节日大促（7 个摘要字段，已结案）———————
  'plan-003': {
    title: '节日大促投放方案',
    summaryFields: [
      { label: '计划编号', value: 'DLV-20260601-003' },
      { label: '投放城市', value: '北京、上海、成都、武汉、西安、南京' },
      { label: '负责人', value: '王强' },
      { label: '创建时间', value: '2026-05-20 14:00:00' },
      { label: '优先级', value: '高' },
      { label: '预算', value: '¥ 1,200,000' },
      { label: '实际ROI', value: '3.8' },
    ],
    announcement: '该投放计划已于 2026-06-30 结案，最终 ROI 达 3.8，超出预期目标 20%。',
    statCards: [],
    basicInfo: [
      { label: '计划名称', value: '节日大促投放方案' },
      { label: '计划编号', value: 'DLV-20260601-003' },
      { label: '投放类型', value: '多渠道组合' },
      { label: '投放渠道', value: 'App Push、短信、信息流、开屏广告' },
      { label: '计划状态', value: '已结案' },
      { label: '创建人', value: '王强 (wangqiang05)' },
      { label: '审核人', value: '赵总 (zhaozong01)' },
      { label: '创建时间', value: '2026-05-20 14:00:00' },
      { label: '计划周期', value: '2026-06-01 至 2026-06-30' },
      { label: '实际 ROI', value: '3.8' },
    ],
    deliveryConfig: [
      { label: '目标人群', value: '18-50岁，一至三线城市' },
      { label: '投放频次', value: '每日 5 次' },
      { label: '单次预算', value: '¥ 40,000' },
      { label: '出价方式', value: 'oCPM' },
      { label: '日预算上限', value: '¥ 45,000' },
      { label: '总预算', value: '¥ 1,200,000' },
      { label: '预算消耗率', value: '90.6%' },
      { label: '定向策略', value: '兴趣定向 + 地域定向 + 人群包' },
    ],
    records: [
      { id: '1', date: '2026-06-30', city: '北京', impressions: 210000, clicks: 14700, ctr: '7.00%', cost: 42000, status: '已结束' },
      { id: '2', date: '2026-06-30', city: '上海', impressions: 195000, clicks: 13650, ctr: '7.00%', cost: 39000, status: '已结束' },
      { id: '3', date: '2026-06-29', city: '成都', impressions: 156000, clicks: 10920, ctr: '7.00%', cost: 31200, status: '已结束' },
      { id: '4', date: '2026-06-29', city: '武汉', impressions: 132000, clicks: 9240, ctr: '7.00%', cost: 26400, status: '已结束' },
      { id: '5', date: '2026-06-28', city: '西安', impressions: 118000, clicks: 8260, ctr: '7.00%', cost: 23600, status: '已结束' },
      { id: '6', date: '2026-06-28', city: '南京', impressions: 104000, clicks: 7280, ctr: '7.00%', cost: 20800, status: '已结束' },
    ],
  },

  // ——————— plan-004：品牌曝光（4 个摘要字段，单行精简）———————
  'plan-004': {
    title: '品牌曝光提升计划',
    summaryFields: [
      { label: '计划编号', value: 'DLV-20260715-004' },
      { label: '负责人', value: '陈思' },
      { label: '创建时间', value: '2026-07-08 16:00:00' },
      { label: '优先级', value: '低' },
    ],
    statCards: [],
    basicInfo: [
      { label: '计划名称', value: '品牌曝光提升计划' },
      { label: '计划编号', value: 'DLV-20260715-004' },
      { label: '投放类型', value: '品牌展示' },
      { label: '投放渠道', value: '开屏广告' },
      { label: '计划状态', value: '待审核' },
      { label: '创建人', value: '陈思 (chensi03)' },
    ],
    deliveryConfig: [
      { label: '目标人群', value: '全量用户' },
      { label: '出价方式', value: 'CPT（按时段包断）' },
      { label: '投放时段', value: '早 8:00 ~ 10:00' },
      { label: '总预算', value: '¥ 80,000' },
    ],
    records: [],
  },

  // ——————— plan-005：用户拉新（3 个摘要字段，最精简）———————
  'plan-005': {
    title: '用户拉新投放计划',
    summaryFields: [
      { label: '计划编号', value: 'DLV-20260712-005' },
      { label: '负责人', value: '周杰' },
      { label: '计划状态', value: '审核驳回' },
    ],
    announcement: '该计划素材审核未通过，请修改后重新提交。驳回原因：落地页加载超时（> 3s）。',
    statCards: [],
    basicInfo: [
      { label: '计划名称', value: '用户拉新投放计划' },
      { label: '计划编号', value: 'DLV-20260712-005' },
      { label: '投放类型', value: '效果广告' },
      { label: '投放渠道', value: '信息流、短视频' },
      { label: '计划状态', value: '审核驳回' },
      { label: '创建人', value: '周杰 (zhoujie08)' },
      { label: '创建时间', value: '2026-07-05 11:20:00' },
      { label: '计划周期', value: '2026-07-12 至 2026-08-12' },
    ],
    deliveryConfig: [
      { label: '目标人群', value: '新用户，18-30岁' },
      { label: '投放频次', value: '每日 4 次' },
      { label: '单次预算', value: '¥ 6,000' },
      { label: '出价方式', value: 'oCPC' },
      { label: '日预算上限', value: '¥ 8,000' },
      { label: '总预算', value: '¥ 200,000' },
    ],
    records: [
      { id: '1', date: '2026-07-14', city: '成都', impressions: 68000, clicks: 5440, ctr: '8.00%', cost: 16320, status: '已暂停' },
      { id: '2', date: '2026-07-14', city: '重庆', impressions: 52000, clicks: 4160, ctr: '8.00%', cost: 12480, status: '已暂停' },
      { id: '3', date: '2026-07-13', city: '昆明', impressions: 34000, clicks: 2720, ctr: '8.00%', cost: 8160, status: '已暂停' },
    ],
  },

  // ——————— plan-006：老客唤醒（4 个摘要字段，草稿）———————
  'plan-006': {
    title: '老客唤醒营销方案',
    summaryFields: [
      { label: '计划编号', value: 'DLV-20260720-006' },
      { label: '负责人', value: '刘芳' },
      { label: '创建时间', value: '2026-07-20 08:45:00' },
      { label: '优先级', value: '中' },
    ],
    statCards: [],
    basicInfo: [
      { label: '计划名称', value: '老客唤醒营销方案' },
      { label: '计划编号', value: 'DLV-20260720-006' },
      { label: '投放类型', value: '短信触达' },
      { label: '计划状态', value: '草稿' },
      { label: '创建人', value: '刘芳 (liufang06)' },
      { label: '创建时间', value: '2026-07-20 08:45:00' },
    ],
    deliveryConfig: [
      { label: '目标人群', value: '30天未活跃老客' },
      { label: '总预算', value: '¥ 50,000' },
    ],
    records: [],
  },
};

// ===================== AppShell (G-topnavbar + G-sidenavbar) =====================

interface NavItem {
  id: string;
  label: string;
  icon: string;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '投放管理',
    items: [
      { id: 'dashboard', label: '工作台', icon: 'home-o' },
      {
        id: 'delivery',
        label: '投放管理',
        icon: 'cart',
        children: [
          { id: 'plan-list', label: '投放计划' },
          { id: 'plan-detail', label: '计划详情' },
          { id: 'creative', label: '创意管理' },
        ],
      },
      {
        id: 'supplier',
        label: '供应商管理',
        icon: 'customer-o',
        children: [
          { id: 'supplier-list', label: '供应商列表' },
          { id: 'contract', label: '合同管理' },
        ],
      },
      { id: 'order', label: '订单管理', icon: 'bill' },
    ],
  },
  {
    title: '数据中心',
    items: [
      { id: 'statistics', label: '数据统计', icon: 'piechart-o' },
    ],
  },
  {
    title: '系统设置',
    items: [
      { id: 'settings', label: '系统设置', icon: 'setting' },
    ],
  },
];

function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState('投放管理');
  const [activeKey, setActiveKey] = useState('plan-detail');

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767.98px)');
    const apply = (matches: boolean) => setCollapsed(matches);
    apply(mql.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const activeSideGroup = navGroups.find((g) => g.title === activeTopTab);

  return (
    <div className="app-shell">
      {/* ===== G-top 顶部导航 ===== */}
      <header className="top-nav-bar">
        <div className="top-nav-logo">
          <div className="logo-mark" aria-hidden="true" />
          <span className="logo-name">投放管家</span>
        </div>
        <nav className="top-nav-menus">
          {navGroups.map((group) => (
            <a
              key={group.title}
              className={`top-nav-tab ${group.title === activeTopTab ? 'active' : ''}`}
              onClick={() => group.title !== activeTopTab && setActiveTopTab(group.title)}
            >
              {group.title}
            </a>
          ))}
        </nav>
        <div className="top-nav-actions">
          <Icon type="bell-o" className="top-nav-icon" />
          <Icon type="comment-o" className="top-nav-icon" />
          <div className="top-nav-avatar" />
        </div>
      </header>

      <div className="app-body">
        {/* ===== G-side 侧边栏 ===== */}
        <aside className={`side-nav ${collapsed ? 'side-nav--collapsed' : ''}`}>
          <div className="side-nav-menus">
            {activeSideGroup && (
              <Menu
                inlineCollapsed={collapsed}
                inlineIndent={28}
                selectedKeys={[activeKey]}
                onSelectChange={(key: string) => setActiveKey(key)}
                className="side-nav-menu"
              >
                {activeSideGroup.items.map((item) =>
                  item.children ? (
                    <Menu.SubMenu
                      key={item.id}
                      label={item.label}
                      icon={<Icon type={item.icon} />}
                    >
                      {item.children.map((child) => (
                        <Menu.Item key={child.id}>{child.label}</Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  ) : (
                    <Menu.Item key={item.id} icon={<Icon type={item.icon} />}>
                      {item.label}
                    </Menu.Item>
                  )
                )}
              </Menu>
            )}
          </div>
          <div className="side-nav-collapse">
            <button
              className="side-nav-collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? '展开' : '收起'}
            >
              <Icon type={collapsed ? 'expand' : 'collapse'} />
            </button>
          </div>
        </aside>

        {/* ===== 主内容区 ===== */}
        <main className="app-content">{children}</main>
      </div>

      {/* 浮动首页导航 */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: 12,
          padding: 4,
          gap: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '7px 14px',
            borderRadius: 9,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.01em',
            background: '#ffffff',
            color: '#0f172a',
            transition: 'all 0.2s ease',
          }}
        >
          ← 首页
        </button>
      </div>
    </div>
  );
}

// ===================== G2 PageHeader =====================

function PageHeaderSection({ data, onBack }: { data: PlanData; onBack: () => void }) {
  const fields = data.summaryFields;
  // ≤3 字段：单行 flex，label 自然宽度；≥4 字段：Grid 4 列，label 96px
  const isAligned = fields.length >= 4;

  return (
    <ModuleWrapper moduleId="F2 表头信息区" tooltipPlacement="bottom" style={{ height: 'auto' }} useFixed>
    <div className="page-header">
      {/* 面包屑 */}
      <div className="page-header__breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="/delivery/plans">投放管理</Breadcrumb.Item>
          <Breadcrumb.Item href="/delivery/plans">投放计划</Breadcrumb.Item>
          <Breadcrumb.Item>计划详情</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {/* 标题 */}
      <h1 className="page-header__title page-header__title--with-back">
        <Icon
          type="arrow-left"
          className="page-header__back-icon"
          onClick={onBack}
        />
        {data.title}
      </h1>
      {/* 摘要信息行：≥4 字段用 Grid repeat(4,1fr) 自动换行 */}
      <div className={`page-header__summary${isAligned ? ' page-header__summary--aligned' : ''}`}>
        <div className="page-header__summary-row">
          {fields.map((f) => (
            <span className="page-header__summary-item" key={f.label}>
              <span className="page-header__summary-label">{f.label}</span>
              <span className="page-header__summary-value">{f.value}</span>
            </span>
          ))}
        </div>
      </div>
      {/* 公告横幅（可选） */}
      {data.announcement && (
        <Announcement
          type="info"
          showIcon
          closable
          className="page-header__announcement"
          title={data.announcement}
        />
      )}
    </div>
    </ModuleWrapper>
  );
}

// ===================== D8 数据统计卡片 =====================

function StatCardSection({ cards }: { cards: StatItem[] }) {
  if (cards.length === 0) return null;
  return (
    <ModuleWrapper moduleId="D8 数据统计卡片" style={{ height: 'auto' }} useFixed>
    <div className="stat-cards">
      {cards.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <div className="stat-card__value">{stat.value}</div>
          <div className="stat-card__label">{stat.label}</div>
          {stat.trend && (
            <div className={`stat-card__trend ${stat.trendUp ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
              {stat.trend !== '—' && (
                <Icon type={stat.trendUp ? 'arrow-up' : 'arrow-down'} style={{ fontSize: 12 }} />
              )}
              <span>{stat.trend}</span>
              {stat.trend !== '—' && <span className="stat-card__trend-label">较昨日</span>}
            </div>
          )}
        </div>
      ))}
    </div>
    </ModuleWrapper>
  );
}

// ===================== D5 描述列表 =====================

function DescriptionList({ items, columns = 2 }: { items: DescItem[]; columns?: 2 | 4 }) {
  const cls = `description-list description-list--col${columns}`;

  return (
    <div className={cls}>
      {items.map((item) => (
        <div className="description-list__item" key={item.label}>
          <span className="description-list__label">{item.label}</span>
          <span
            className={
              item.link
                ? 'description-list__value description-list__value--link'
                : 'description-list__value'
            }
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ===================== 详情内容区 =====================

function DetailContent({ data }: { data: PlanData }) {
  const tableColumns = [
    { label: '日期', dataKey: 'date', width: 120 },
    { label: '城市', dataKey: 'city', width: 100 },
    { label: '曝光量', dataKey: 'impressions', width: 120,
      render: (val: number) => <span>{val.toLocaleString()}</span> },
    { label: '点击量', dataKey: 'clicks', width: 120,
      render: (val: number) => <span>{val.toLocaleString()}</span> },
    { label: '点击率', dataKey: 'ctr', width: 100 },
    { label: '消耗', dataKey: 'cost', width: 120,
      render: (val: number) => <span>¥ {val.toLocaleString()}</span> },
    { label: '状态', dataKey: 'status' },
  ];

  return (
    <div className="detail-sections">
      {/* ===== 计划信息 ===== */}
      <ModuleWrapper moduleId="D5 描述列表（计划信息）" style={{ height: 'auto' }} useFixed>
      <div className="form-section" id="group-basic-info">
        <h3 className="form-section__title">计划信息</h3>
        <DescriptionList items={data.basicInfo} columns={2} />
      </div>
      </ModuleWrapper>

      {/* ===== 投放配置 ===== */}
      <ModuleWrapper moduleId="D5 描述列表（投放配置）" style={{ height: 'auto' }} useFixed>
      <div className="form-section" id="group-delivery-config">
        <h3 className="form-section__title">投放配置</h3>
        <DescriptionList items={data.deliveryConfig} columns={2} />
      </div>
      </ModuleWrapper>

      {/* ===== 投放记录（有记录时才展示） ===== */}
      {data.records.length > 0 && (
        <ModuleWrapper moduleId="F8 只读表格" style={{ height: 'auto' }} useFixed>
        <div className="form-section" id="group-records">
          <h3 className="form-section__title">投放记录</h3>
          <div className="readonly-table">
            <Table
              columns={tableColumns}
              data={data.records}
              rowKey="id"
              bordered="row"
              emptyText="暂无投放记录"
            />
            <div className="readonly-table__pagination">
              <Pagination
                current={1}
                pageSize={10}
                total={data.records.length}
                showSizeChanger
                showTotal
              />
            </div>
          </div>
        </div>
        </ModuleWrapper>
      )}
    </div>
  );
}

// ===================== 主页面：主从落地详情页 =====================

export default function MasterDetailPage() {
  const [activePlanKey, setActivePlanKey] = useState('plan-001');

  const handleBack = () => {
    window.history.back();
  };

  const currentData = planDataMap[activePlanKey] || planDataMap['plan-001'];

  return (
    <AppShell>
      <div className="page-container">
        <div className="content-card">
          {/* ===== 左侧：投放计划列表（Master） ===== */}
          <aside className="master-panel">
            <div className="master-panel__header">投放计划</div>
            <Menu
              mode="inline"
              className="master-panel__menu"
              selectedKeys={[activePlanKey]}
              onSelectChange={(key: string) => setActivePlanKey(key)}
            >
              {planList.map((plan) => (
                <Menu.Item key={plan.key}>{plan.name}</Menu.Item>
              ))}
            </Menu>
          </aside>

          {/* ===== 右侧：详情内容（Detail） ===== */}
          <div className="detail-panel">
            <div className="detail-panel__content">
              {/* G2 表头信息区 */}
              <PageHeaderSection data={currentData} onBack={handleBack} />

              {/* D8 数据统计卡片 */}
              <StatCardSection cards={currentData.statCards} />

              {/* 详情内容 */}
              <DetailContent data={currentData} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
