import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Tag,
  Table,
  Pagination,
  Icon,
  Menu,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Switch,
  RangePicker,
  message,
} from '@ss/mtd-react3';
import ModuleWrapper from '../../components/ModuleWrapper';
import './ModalFormPage.css';

/* ────────────────────────────────────────────────────────────
 * 模拟数据
 * ──────────────────────────────────────────────────────────── */
interface CouponRecord {
  id: number;
  name: string;
  code: string;
  type: string;
  amount: string;
  status: string;
  statusTheme: 'green' | 'orange' | 'red' | 'gray';
  usageRate: string;
}

const couponList: CouponRecord[] = [
  {
    id: 1, name: '新客首单立减券', code: 'CPN-2026-071856', type: '满减券',
    amount: '¥20.00', status: '生效中', statusTheme: 'green', usageRate: '64.8%',
  },
  {
    id: 2, name: '暑期满100减15券', code: 'CPN-2026-071902', type: '满减券',
    amount: '¥15.00', status: '生效中', statusTheme: 'green', usageRate: '49.7%',
  },
  {
    id: 3, name: '新店开业9折券', code: 'CPN-2026-062311', type: '折扣券',
    amount: '9折', status: '已过期', statusTheme: 'gray', usageRate: '77.5%',
  },
  {
    id: 4, name: '会员专享免运费券', code: 'CPN-2026-080105', type: '免运费券',
    amount: '免运费', status: '待生效', statusTheme: 'orange', usageRate: '0%',
  },
  {
    id: 5, name: '七夕特惠满200减50', code: 'CPN-2026-080801', type: '满减券',
    amount: '¥50.00', status: '已停用', statusTheme: 'red', usageRate: '46.9%',
  },
];

/* ────────────────────────────────────────────────────────────
 * 侧导航数据（与弹窗详情页一致）
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
 * 弹窗表单页主组件 + AppShell 骨架
 * 装配逻辑：
 *   外壳 → G-topnavbar（顶导）+ G-sidenavbar（侧导）
 *   触发页面 → 优惠券管理列表页（G8 只读数据表格 + G2 表头信息区）
 *   弹窗表单 → Modal 弹窗容器 + F4 分组分段 + F5 单栏布局（Form + Form.Item）
 *   弹窗表单默认带 F3 操作栏（取消 + 确定提交）
 * z-index 策略（与弹窗详情页一致）：
 *   顶导保持 z-index: 1100，Modal 通过 className="form-modal"
 *   推到 z-index: 1200，确保弹窗在顶导之上。
 * ──────────────────────────────────────────────────────────── */
const statusThemeMap: Record<string, 'green' | 'orange' | 'red' | 'gray'> = {
  '生效中': 'green',
  '待生效': 'orange',
  '已停用': 'red',
  '已过期': 'gray',
};

const ModalFormPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* AppShell 状态 */
  const [collapsed, setCollapsed] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState(navGroups[0].title);

  /* 表单字段 */
  const [formData, setFormData] = useState({
    name: '',
    type: undefined as string | undefined,
    amount: null as number | string | null,
    threshold: null as number | string | null,
    scope: undefined as string | undefined,
    issueMethod: undefined as string | undefined,
    limitPerUser: null as number | string | null,
    totalCount: null as number | string | null,
    period: undefined as [Date, Date] | undefined,
    autoStop: true,
  });

  /* 窄屏自动收起 */
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767.98px)');
    const apply = (matches: boolean) => setCollapsed(matches);
    apply(mql.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const activeSideGroup = navGroups.find((g) => g.title === activeTopTab);

  const handlePageChange = (p: number, s: number) => {
    setPage(p);
    setPageSize(s);
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      type: undefined,
      amount: null,
      threshold: null,
      scope: undefined,
      issueMethod: undefined,
      limitPerUser: null,
      totalCount: null,
      period: undefined,
      autoStop: true,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    message.success({ message: '优惠券创建成功（示例）' });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  /* G8 只读数据表格 — columns 配置 */
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
  ];

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
              {/* G2 · 页面表头 + 新建按钮 */}
              <div className="page-header">
                <div className="page-header__row">
                  <div>
                    <h1 className="page-header__title">优惠券管理</h1>
                    <p className="page-header__desc">
                      管理所有优惠券的创建、发放与使用情况。点击「新建优惠券」按钮可弹窗创建新券。
                    </p>
                  </div>
                  <Button type="primary" onClick={handleOpenCreate}>
                    新建优惠券
                  </Button>
                </div>
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

          {/* ── 弹窗表单 ── */}
          <Modal
            open={open}
            title="新建优惠券"
            onClose={handleCancel}
            className="form-modal"
            style={{ width: '640px' }}
          >
            <Modal.Body>
              {/* F-4 分组分段 + F-5 单栏布局：基本信息 */}
              <ModuleWrapper moduleId="F-4 分组分段 + F-5 单栏布局" useFixed disableTooltip style={{ height: 'auto' }}>
              <div className="modal-section">
                <h3 className="modal-section__title">基本信息</h3>
                <Form className="modal-form" labelPosition="right" labelWidth="100px" useContext>
                  <Form.Item formItemKey="name" label="券名称" required>
                    <Input
                      placeholder="请输入优惠券名称"
                      value={formData.name}
                      onChange={(val) => setFormData((f) => ({ ...f, name: val }))}
                      toFormItem
                    />
                  </Form.Item>
                  <Form.Item formItemKey="type" label="券类型" required>
                    <Select
                      placeholder="请选择券类型"
                      value={formData.type}
                      onChange={(val) => setFormData((f) => ({ ...f, type: val as string }))}
                      toFormItem
                    >
                      <Select.Option value="满减券">满减券</Select.Option>
                      <Select.Option value="折扣券">折扣券</Select.Option>
                      <Select.Option value="免运费券">免运费券</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item formItemKey="amount" label="面额（元）" required>
                    <InputNumber
                      placeholder="请输入面额"
                      value={formData.amount}
                      min={0}
                      precision={2}
                      style={{ width: '100%' }}
                      onChange={(val) => setFormData((f) => ({ ...f, amount: val }))}
                      toFormItem
                    />
                  </Form.Item>
                  <Form.Item formItemKey="threshold" label="使用门槛（元）">
                    <InputNumber
                      placeholder="不填表示无门槛"
                      value={formData.threshold}
                      min={0}
                      precision={2}
                      style={{ width: '100%' }}
                      onChange={(val) => setFormData((f) => ({ ...f, threshold: val }))}
                      toFormItem
                    />
                  </Form.Item>
                  <Form.Item formItemKey="scope" label="适用范围" required>
                    <Select
                      placeholder="请选择适用范围"
                      value={formData.scope}
                      onChange={(val) => setFormData((f) => ({ ...f, scope: val as string }))}
                      toFormItem
                    >
                      <Select.Option value="全品类通用">全品类通用</Select.Option>
                      <Select.Option value="食品饮料">食品饮料</Select.Option>
                      <Select.Option value="鲜花礼品">鲜花礼品</Select.Option>
                      <Select.Option value="指定门店">指定门店</Select.Option>
                    </Select>
                  </Form.Item>
                </Form>
              </div>
              </ModuleWrapper>

              {/* F-4 分组分段：发放规则 */}
              <ModuleWrapper moduleId="F-4 分组分段 + F-5 单栏布局" useFixed disableTooltip style={{ height: 'auto' }}>
              <div className="modal-section">
                <h3 className="modal-section__title">发放规则</h3>
                <Form className="modal-form" labelPosition="right" labelWidth="100px" useContext>
                  <Form.Item formItemKey="issueMethod" label="发放方式" required>
                    <Radio.Group
                      value={formData.issueMethod}
                      onChange={(val) => setFormData((f) => ({ ...f, issueMethod: val as string }))}
                      toFormItem
                    >
                      <Radio value="系统自动发放">系统自动发放</Radio>
                      <Radio value="用户主动领取">用户主动领取</Radio>
                      <Radio value="定向推送">定向推送</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item formItemKey="limitPerUser" label="每人限领">
                    <InputNumber
                      placeholder="不填表示不限"
                      value={formData.limitPerUser}
                      min={1}
                      precision={0}
                      style={{ width: '100%' }}
                      onChange={(val) => setFormData((f) => ({ ...f, limitPerUser: val }))}
                      toFormItem
                    />
                  </Form.Item>
                  <Form.Item formItemKey="totalCount" label="发放总量" required>
                    <InputNumber
                      placeholder="请输入发放总量"
                      value={formData.totalCount}
                      min={1}
                      precision={0}
                      style={{ width: '100%' }}
                      onChange={(val) => setFormData((f) => ({ ...f, totalCount: val }))}
                      toFormItem
                    />
                  </Form.Item>
                  <Form.Item formItemKey="period" label="有效期" required>
                    <RangePicker
                      picker="date"
                      single
                      separator="至"
                      placeholder={['开始日期', '结束日期']}
                      style={{ width: '100%' }}
                      toFormItem
                    />
                  </Form.Item>
                  <Form.Item formItemKey="autoStop" label="到期自动停用">
                    <Switch
                      checked={formData.autoStop}
                      onChange={(e) => setFormData((f) => ({ ...f, autoStop: e.target.checked }))}
                    />
                  </Form.Item>
                </Form>
              </div>
              </ModuleWrapper>
            </Modal.Body>

            {/* F-3 操作栏（弹窗/抽屉版：内联 footer） */}
            <ModuleWrapper moduleId="F-3 操作栏（弹窗版）" useFixed disableTooltip style={{ height: 'auto' }}>
            <Modal.Footer>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" onClick={handleSubmit}>确定</Button>
            </Modal.Footer>
            </ModuleWrapper>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default ModalFormPage;
