import React, { useState, useEffect } from 'react';
import { Modal, Button, Tag, Table, Pagination, Icon, Menu } from '@ss/mtd-react3';
import ModuleWrapper from '../../components/ModuleWrapper';
import './ModalDetailPage.css';

/* ────────────────────────────────────────────────────────────
 * D5 描述列表（DescriptionList）
 * MTD 无原生 Descriptions 组件，基于 Row/Col 24 栅格 + div 自建
 * ──────────────────────────────────────────────────────────── */
interface DescItem {
  label: string;
  value: React.ReactNode;
  link?: boolean;
}

function DescriptionList({
  items,
  columns = 2,
}: {
  items: DescItem[];
  columns?: 2 | 4;
}) {
  const cls =
    columns > 2
      ? `description-list description-list--col${columns}`
      : 'description-list';

  return (
    <div className={cls}>
      {items.map((item) => (
        <div className="description-list__item" key={String(item.label)}>
          <span className="description-list__label">{item.label}</span>
          <span
            className={
              item.link
                ? 'description-list__value description-list__value--link'
                : 'description-list__value'
            }
          >
            {item.value || '-'}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * 模拟数据
 * ──────────────────────────────────────────────────────────── */
interface CouponRecord {
  id: number;
  name: string;
  code: string;
  type: string;
  amount: string;
  threshold: string;
  status: string;
  statusTheme: 'green' | 'orange' | 'red' | 'gray';
  startDate: string;
  endDate: string;
  scope: string;
  issueMethod: string;
  limitPerUser: string;
  totalCount: string;
  claimedCount: string;
  usedCount: string;
  usageRate: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  campaign: string;
}

const couponList: CouponRecord[] = [
  {
    id: 1, name: '新客首单立减券', code: 'CPN-2026-071856', type: '满减券',
    amount: '¥20.00', threshold: '订单金额满 ¥50.00 可用', status: '生效中', statusTheme: 'green',
    startDate: '2026-07-01 00:00', endDate: '2026-08-31 23:59', scope: '全品类通用',
    issueMethod: '系统自动发放', limitPerUser: '1 张', totalCount: '10,000 张',
    claimedCount: '6,328 张', usedCount: '4,102 张', usageRate: '64.8%',
    creator: 'zhangsan', createdAt: '2026-06-28 14:30:00', updatedAt: '2026-07-01 09:15:22',
    campaign: '2026 暑期大促',
  },
  {
    id: 2, name: '暑期满100减15券', code: 'CPN-2026-071902', type: '满减券',
    amount: '¥15.00', threshold: '订单金额满 ¥100.00 可用', status: '生效中', statusTheme: 'green',
    startDate: '2026-07-10 00:00', endDate: '2026-09-10 23:59', scope: '食品饮料',
    issueMethod: '用户主动领取', limitPerUser: '2 张', totalCount: '50,000 张',
    claimedCount: '18,542 张', usedCount: '9,210 张', usageRate: '49.7%',
    creator: 'lisi', createdAt: '2026-07-05 10:00:00', updatedAt: '2026-07-10 08:30:11',
    campaign: '2026 暑期大促',
  },
  {
    id: 3, name: '新店开业9折券', code: 'CPN-2026-062311', type: '折扣券',
    amount: '9折', threshold: '无门槛', status: '已过期', statusTheme: 'gray',
    startDate: '2026-06-01 00:00', endDate: '2026-06-30 23:59', scope: '指定门店',
    issueMethod: '定向推送', limitPerUser: '1 张', totalCount: '5,000 张',
    claimedCount: '4,998 张', usedCount: '3,871 张', usageRate: '77.5%',
    creator: 'wangwu', createdAt: '2026-05-25 16:00:00', updatedAt: '2026-07-01 00:00:01',
    campaign: '新店开业活动',
  },
  {
    id: 4, name: '会员专享免运费券', code: 'CPN-2026-080105', type: '免运费券',
    amount: '免运费', threshold: '订单金额满 ¥30.00 可用', status: '待生效', statusTheme: 'orange',
    startDate: '2026-08-01 00:00', endDate: '2026-08-31 23:59', scope: '全品类通用',
    issueMethod: '系统自动发放', limitPerUser: '3 张', totalCount: '20,000 张',
    claimedCount: '0 张', usedCount: '0 张', usageRate: '0%',
    creator: 'zhangsan', createdAt: '2026-07-15 11:20:00', updatedAt: '2026-07-15 11:20:00',
    campaign: '8月会员月',
  },
  {
    id: 5, name: '七夕特惠满200减50', code: 'CPN-2026-080801', type: '满减券',
    amount: '¥50.00', threshold: '订单金额满 ¥200.00 可用', status: '已停用', statusTheme: 'red',
    startDate: '2026-08-08 00:00', endDate: '2026-08-15 23:59', scope: '鲜花礼品',
    issueMethod: '用户主动领取', limitPerUser: '1 张', totalCount: '8,000 张',
    claimedCount: '2,105 张', usedCount: '987 张', usageRate: '46.9%',
    creator: 'lisi', createdAt: '2026-07-20 09:00:00', updatedAt: '2026-08-10 14:22:38',
    campaign: '七夕活动',
  },
];

/* ────────────────────────────────────────────────────────────
 * 侧导航数据
 * 顶导 tab 对应不同侧导菜单组
 * ──────────────────────────────────────────────────────────── */
interface NavItem {
  id: string;
  label: string;
  icon: string;
  children?: { id: string; label: string }[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '营销中心',
    items: [
      { id: 'home', label: '工作台', icon: 'home-o' },
      {
        id: 'coupon',
        label: '优惠券管理',
        icon: 'coupon',
        children: [
          { id: 'coupon-list', label: '优惠券列表' },
          { id: 'coupon-create', label: '创建优惠券' },
          { id: 'coupon-stats', label: '核销统计' },
        ],
      },
      {
        id: 'activity',
        label: '活动管理',
        icon: 'label',
        children: [
          { id: 'activity-list', label: '活动列表' },
          { id: 'activity-config', label: '活动配置' },
        ],
      },
      { id: 'stats', label: '数据统计', icon: 'piechart-o' },
    ],
  },
  {
    title: '商品管理',
    items: [
      { id: 'goods-home', label: '商品概览', icon: 'home-o' },
      {
        id: 'goods-mgr',
        label: '商品列表',
        icon: 'file-o',
        children: [
          { id: 'goods-all', label: '全部商品' },
          { id: 'goods-on', label: '已上架' },
          { id: 'goods-off', label: '已下架' },
        ],
      },
    ],
  },
  {
    title: '系统设置',
    items: [
      { id: 'sys-basic', label: '基础设置', icon: 'setting' },
      { id: 'sys-role', label: '角色管理', icon: 'invoice-o' },
    ],
  },
];

/* ────────────────────────────────────────────────────────────
 * 弹窗详情页主组件 + AppShell 骨架
 * 装配逻辑：
 *   外壳 → G-topnavbar（顶导）+ G-sidenavbar（侧导）
 *   触发页面 → 优惠券管理列表页（G8 只读数据表格 + G2 表头信息区）
 *   详情弹窗 → Modal 弹窗容器 + D5 描述列表 + F4 分组分段
 *   详情页默认不带 F3 操作栏（用户未提及操作按钮）
 * z-index 策略（与抽屉页相反）：
 *   顶导保持 z-index: 1100（标准值），Modal 通过 className="detail-modal"
 *   推到 z-index: 1200，确保弹窗在顶导之上。
 * ──────────────────────────────────────────────────────────── */
/* G8 只读数据表格 — 状态 theme 映射 */
const statusThemeMap: Record<string, 'green' | 'orange' | 'red' | 'gray'> = {
  '生效中': 'green',
  '待生效': 'orange',
  '已停用': 'red',
  '已过期': 'gray',
};

const ModalDetailPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<CouponRecord | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* AppShell 状态 */
  const [collapsed, setCollapsed] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState(navGroups[0].title);

  /* 窄屏自动收起（§3.5） */
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767.98px)');
    const apply = (matches: boolean) => setCollapsed(matches);
    apply(mql.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const activeSideGroup = navGroups.find((g) => g.title === activeTopTab);

  const handleViewDetail = (record: CouponRecord) => {
    setCurrent(record);
    setOpen(true);
  };

  const handlePageChange = (p: number, s: number) => {
    setPage(p);
    setPageSize(s);
  };

  /* G8 只读数据表格 — columns 配置（与抽屉版对齐） */
  const columns = [
    { label: '券名称', dataKey: 'name' },
    { label: '券编号', dataKey: 'code', width: 160 },
    { label: '券类型', dataKey: 'type', width: 100 },
    { label: '面额', dataKey: 'amount', width: 100 },
    {
      label: '状态',
      dataKey: 'status',
      width: 90,
      render: (val: string) => (
        <Tag theme={statusThemeMap[val] || 'gray'} type="bordered" size="small">
          {val}
        </Tag>
      ),
    },
    { label: '使用率', dataKey: 'usageRate', width: 100 },
    {
      label: '操作',
      dataKey: 'action',
      width: 140,
      render: (_: unknown, record: CouponRecord) => (
        <a onClick={() => handleViewDetail(record)}>查看（弹窗）</a>
      ),
    },
  ];

  /* 构建描述列表数据 */
  const basicItems: DescItem[] = current
    ? [
        { label: '券名称', value: current.name },
        { label: '券编号', value: current.code },
        {
          label: '券状态',
          value: (
            <Tag theme={current.statusTheme} type="bordered" size="small">
              {current.status}
            </Tag>
          ),
        },
        { label: '券类型', value: current.type },
        { label: '面额', value: current.amount },
        { label: '使用门槛', value: current.threshold },
        {
          label: '有效期',
          value: `${current.startDate} ~ ${current.endDate}`,
        },
        { label: '适用范围', value: current.scope },
      ]
    : [];

  const ruleItems: DescItem[] = current
    ? [
        { label: '发放方式', value: current.issueMethod },
        { label: '每人限领', value: current.limitPerUser },
        { label: '发放总量', value: current.totalCount },
        { label: '已领取', value: current.claimedCount },
        { label: '已使用', value: current.usedCount },
        { label: '使用率', value: current.usageRate },
      ]
    : [];

  const otherItems: DescItem[] = current
    ? [
        { label: '创建人', value: current.creator },
        { label: '创建时间', value: current.createdAt },
        { label: '最近修改', value: current.updatedAt },
        { label: '所属活动', value: current.campaign, link: true },
      ]
    : [];

  return (
    <div className="app-shell">
      {/* ===== G-topnavbar 顶部导航 ===== */}
      <header className="top-nav-bar">
        <div className="top-nav-logo">
          <div className="logo-mark" aria-hidden="true" />
          <span className="logo-name">营销平台</span>
        </div>
        <nav className="top-nav-menus">
          {navGroups.map((group) => (
            <a
              key={group.title}
              className={`top-nav-tab ${group.title === activeTopTab ? 'active' : ''}`}
              onClick={() => setActiveTopTab(group.title)}
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
        {/* ===== G-sidenavbar 侧边导航 ===== */}
        <aside className={`side-nav ${collapsed ? 'side-nav--collapsed' : ''}`}>
          <div className="side-nav-menus">
            {activeSideGroup && (
              <Menu
                inlineCollapsed={collapsed}
                inlineIndent={28}
                defaultSelectedKeys={['coupon-list']}
                defaultExpandedKeys={['coupon']}
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
                  ),
                )}
              </Menu>
            )}
          </div>

          {/* 折叠按钮（MTD 不提供此 UI，需自实现） */}
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
        <main className={`app-content ${collapsed ? 'app-content--collapsed' : ''}`}>
          <div className="page-container">
            <div className="page-card">
              {/* G2 · 页面表头 */}
              <div className="page-header">
                <h1 className="page-header__title">优惠券管理</h1>
                <p className="page-header__desc">
                  管理所有优惠券的创建、发放与使用情况。点击操作列「查看（弹窗）」可弹窗查看完整信息。
                </p>
              </div>

              {/* G8 · 只读数据表格 */}
              <div className="scroll-content">
                <div className="readonly-table">
                  <Table columns={columns} data={couponList} rowKey="id" bordered="row" emptyText="暂无优惠券数据" />
                  <div className="readonly-table__pagination">
                    <Pagination
                      current={page}
                      pageSize={pageSize}
                      total={couponList.length}
                      onChange={handlePageChange}
                      showSizeChanger
                      showTotal
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 弹窗详情页 ── */}
          <Modal
            open={open}
            title={current ? `${current.name} — 详情` : '优惠券详情'}
            onClose={() => setOpen(false)}
            className="detail-modal"
            style={{ width: '640px' }}
          >
            <Modal.Body>
              {current && (
                <>
                  {/* Detail-1 描述列表（弹窗变体）：基本信息 */}
                  <ModuleWrapper moduleId="Detail-1 描述列表（弹窗变体）" useFixed disableTooltip style={{ height: 'auto' }}>
                  <div className="modal-section">
                    <h3 className="modal-section__title">基本信息</h3>
                    <DescriptionList items={basicItems} />
                  </div>
                  </ModuleWrapper>

                  {/* Detail-1 描述列表：发放规则 */}
                  <ModuleWrapper moduleId="Detail-1 描述列表（弹窗变体）" useFixed disableTooltip style={{ height: 'auto' }}>
                  <div className="modal-section">
                    <h3 className="modal-section__title">发放规则</h3>
                    <DescriptionList items={ruleItems} />
                  </div>
                  </ModuleWrapper>

                  {/* Detail-1 描述列表：其他信息 */}
                  <ModuleWrapper moduleId="Detail-1 描述列表（弹窗变体）" useFixed disableTooltip style={{ height: 'auto' }}>
                  <div className="modal-section">
                    <h3 className="modal-section__title">其他信息</h3>
                    <DescriptionList items={otherItems} />
                  </div>
                  </ModuleWrapper>
                </>
              )}
            </Modal.Body>

            {/* F-3 操作栏（弹窗版：取消 + 确定，左次右主） */}
            <ModuleWrapper moduleId="F-3 操作栏（弹窗版）" useFixed disableTooltip style={{ height: 'auto' }}>
            <Modal.Footer>
              <Button onClick={() => setOpen(false)}>取消</Button>
              <Button type="primary" onClick={() => setOpen(false)}>确定</Button>
            </Modal.Footer>
            </ModuleWrapper>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default ModalDetailPage;
