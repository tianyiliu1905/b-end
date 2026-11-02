import { useState, useEffect, type ReactNode } from 'react';
import { Table, Tag, Pagination, Icon, Menu } from '@ss/mtd-react3';
import { ProductDetailDrawer, ProductRecord } from './DrawerDetailDrawer';
import './DrawerDetailDrawer.css';
import './DrawerDetailPage.css';

/* ============================================================
 * 商品列表 — 顺序落地页（真实触发场景）
 * 技术栈：React (@ss/mtd-react3)
 * 装配：AppShell（G-topnavbar 顶部导航 + G-sidenavbar 侧边导航）
 *       + G1 顺序落地页（灰底 + 白卡） + G2 表头信息区（标题，无面包屑/返回）
 *       + G8 只读数据表格（基础信息表变种：文字 + 状态 Tag + 查看链接）
 * 交互：点击表格「操作」列的"查看（抽屉）"链接，打开 ProductDetailDrawer 抽屉展示该行商品详情。
 *       这是详情抽屉在真实业务中的标准触发方式——顶导+侧导的完整业务系统 → 列表页 → 查看 → 抽屉。
 * z-index 硬约束（G1-PresentationContainer.md §3.6）：
 *   抽屉蒙层 z-index 固定为 900，顶导必须 < 900（建议 100），
 *   否则抽屉打开时蒙层无法覆盖顶导。
 * ============================================================ */

/* ===== AppShell — G-topnavbar + G-sidenavbar ===== */

interface NavItem {
  id: string;
  label: string;
  icon?: string;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '商品管理',
    items: [
      { id: 'dashboard', label: '工作台', icon: 'home-o' },
      {
        id: 'product',
        label: '商品管理',
        icon: 'cart',
        children: [
          { id: 'product-list', label: '商品列表' },
          { id: 'category', label: '类目管理' },
          { id: 'brand', label: '品牌管理' },
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
    items: [{ id: 'statistics', label: '数据统计', icon: 'piechart-o' }],
  },
  {
    title: '系统设置',
    items: [{ id: 'settings', label: '系统设置', icon: 'setting' }],
  },
];

function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState('商品管理');
  const [activeKey, setActiveKey] = useState('product-list');

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
      {/* ===== G-topnavbar 顶部导航 ===== */}
      <header className="top-nav-bar">
        <div className="top-nav-logo">
          <div className="logo-mark" aria-hidden="true" />
          <span className="logo-name">商品管家</span>
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
        {/* ===== G-sidenavbar 侧边导航 ===== */}
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
                    <Menu.SubMenu key={item.id} label={item.label} icon={<Icon type={item.icon || 'file-o'} />}>
                      {item.children.map((child) => (
                        <Menu.Item key={child.id}>{child.label}</Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  ) : (
                    <Menu.Item key={item.id} icon={<Icon type={item.icon || 'file-o'} />}>
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
        {children}
      </div>
    </div>
  );
}

/* ===== 商品列表页 ===== */

const statusThemeMap: Record<string, 'green' | 'orange' | 'gray'> = {
  在售: 'green',
  待上架: 'orange',
  已下架: 'gray',
};

const PRODUCT_LIST: ProductRecord[] = [
  {
    id: '1',
    code: 'SP202607180001',
    name: '轻薄羽绒服 女款 2026冬季新款',
    category: '服饰内衣 / 女装 / 羽绒服',
    brand: '自有品牌',
    price: '¥399.00',
    originalPrice: '¥599.00',
    stock: '1,286 件',
    status: '在售',
    onlineAt: '2026-07-01 10:00:00',
    creator: '张三',
    createdAt: '2026-06-28 15:23:10',
  },
  {
    id: '2',
    code: 'SP202607180002',
    name: '纯棉印花短袖T恤 男款',
    category: '服饰内衣 / 男装 / T恤',
    brand: '自有品牌',
    price: '¥89.00',
    originalPrice: '¥129.00',
    stock: '4,520 件',
    status: '在售',
    onlineAt: '2026-06-15 09:00:00',
    creator: '李四',
    createdAt: '2026-06-10 11:02:45',
  },
  {
    id: '3',
    code: 'SP202607180003',
    name: '无线蓝牙降噪耳机 Pro',
    category: '数码电器 / 音频设备 / 耳机',
    brand: '声波科技',
    price: '¥599.00',
    originalPrice: '¥799.00',
    stock: '0 件',
    status: '已下架',
    onlineAt: '2026-03-20 10:00:00',
    creator: '王五',
    createdAt: '2026-03-18 16:40:12',
  },
  {
    id: '4',
    code: 'SP202607180004',
    name: '不锈钢真空保温杯 500ml',
    category: '家居生活 / 厨房用品 / 水杯',
    brand: '暖萃',
    price: '¥69.00',
    originalPrice: '¥99.00',
    stock: '2,310 件',
    status: '待上架',
    onlineAt: '—',
    creator: '赵六',
    createdAt: '2026-07-15 14:20:00',
  },
  {
    id: '5',
    code: 'SP202607180005',
    name: '人体工学电脑椅',
    category: '家居生活 / 办公家具 / 椅类',
    brand: '坐享',
    price: '¥899.00',
    originalPrice: '¥1299.00',
    stock: '156 件',
    status: '在售',
    onlineAt: '2026-05-01 10:00:00',
    creator: '张三',
    createdAt: '2026-04-25 09:18:30',
  },
];

export default function DrawerDetailPage() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeRecord, setActiveRecord] = useState<ProductRecord | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleView = (record: ProductRecord) => {
    setActiveRecord(record);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const columns = [
    { label: '商品编号', dataKey: 'code', width: 130 },
    { label: '商品名称', dataKey: 'name', width: 160 },
    { label: '所属类目', dataKey: 'category', width: 150 },
    { label: '售价', dataKey: 'price', width: 70 },
    { label: '库存', dataKey: 'stock', width: 70 },
    {
      label: '状态',
      dataKey: 'status',
      width: 60,
      render: (val: string) => (
        <Tag theme={statusThemeMap[val] || 'gray'} type="bordered" size="small">
          {val}
        </Tag>
      ),
    },
    {
      label: '操作',
      dataKey: 'action',
      width: 56,
      render: (_: unknown, record: ProductRecord) => <a onClick={() => handleView(record)}>查看</a>,
    },
  ];

  return (
    <AppShell>
      <main className="app-content">
        <div className="page-container">
          <div className="page-card">
            <div className="page-header">
              <h1 className="page-header__title">商品列表</h1>
            </div>
            <div className="scroll-content">
              <div className="readonly-table">
                <Table columns={columns} data={PRODUCT_LIST} rowKey="id" bordered="row" emptyText="暂无商品数据" />
                <div className="readonly-table__pagination">
                  <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={PRODUCT_LIST.length}
                    onChange={handlePageChange}
                    showSizeChanger
                    showTotal
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductDetailDrawer visible={drawerVisible} record={activeRecord} onClose={handleDrawerClose} />
      </main>
    </AppShell>
  );
}
