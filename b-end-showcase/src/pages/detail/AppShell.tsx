import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Menu } from '@ss/mtd-react3';
import CampaignDetail from './CampaignDetail';
import './AppShell.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '营销中心',
    items: [
      {
        id: 'campaign-list',
        label: '活动管理',
        icon: 'market-o',
        children: [
          { id: 'campaign-detail', label: '活动详情' },
          { id: 'campaign-create', label: '创建活动' },
        ],
      },
      { id: 'coupon', label: '优惠券管理', icon: 'present' },
      { id: 'budget', label: '预算管理', icon: 'wallet' },
    ],
  },
  {
    title: '数据中心',
    items: [
      { id: 'dashboard', label: '数据概览', icon: 'bar-chart' },
      { id: 'report', label: '分析报告', icon: 'page-o' },
    ],
  },
];

export default function AppShell() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState(navGroups[0]?.title || '');

  // 窄屏自动收起
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767.98px)');
    const apply = (matches: boolean) => setCollapsed(matches);
    apply(mql.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const activeSideGroup = navGroups.find(g => g.title === activeTopTab);

  return (
    <div className="app-shell">
      {/* ===== G-top 顶部导航 ===== */}
      <header className="top-nav-bar">
        <div className="top-nav-logo">
          <div className="logo-mark" aria-hidden="true" />
          <span className="logo-name">营销管理平台</span>
        </div>
        <nav className="top-nav-menus">
          {navGroups.map(group => (
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
        {/* ===== G-side 侧边栏 ===== */}
        <aside className={`side-nav ${collapsed ? 'side-nav--collapsed' : ''}`}>
          <div className="side-nav-menus">
            {activeSideGroup && (
              <Menu
                inlineCollapsed={collapsed}
                inlineIndent={28}
                defaultSelectedKeys={['campaign-detail']}
                className="side-nav-menu"
              >
                {activeSideGroup.items.map(item =>
                  item.children ? (
                    <Menu.SubMenu
                      key={item.id}
                      label={item.label}
                      icon={<Icon type={item.icon} />}
                    >
                      {item.children.map(child => (
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

          {/* 折叠按钮 */}
          <div className="side-nav-collapse">
            <button
              className="side-nav-collapse-btn"
              onClick={() => setCollapsed(c => !c)}
              aria-label={collapsed ? '展开' : '收起'}
            >
              <Icon type={collapsed ? 'expand' : 'collapse'} />
            </button>
          </div>
        </aside>

        {/* ===== 主内容区 ===== */}
        <main className="app-content">
          <CampaignDetail />
        </main>
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
