import { useState, useEffect } from 'react';
import { Icon, Menu } from '@ss/mtd-react3';
import DealCampaignForm from './DealCampaignForm';
import './DealAppShell.css';

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
    title: '工作台',
    items: [{ id: 'overview', label: '经营概览', icon: 'home-o' }],
  },
  {
    title: '营销中心',
    items: [
      {
        id: 'campaign',
        label: '到店营销',
        icon: 'coupon',
        children: [
          { id: 'campaign-list', label: '活动列表' },
          { id: 'campaign-create', label: '创建到店套餐活动' },
          { id: 'campaign-data', label: '活动数据' },
        ],
      },
      {
        id: 'deal',
        label: '团购套餐',
        icon: 'shoppingcart-add',
        children: [
          { id: 'deal-list', label: '套餐管理' },
          { id: 'deal-audit', label: '套餐审核' },
        ],
      },
    ],
  },
  {
    title: '门店管理',
    items: [{ id: 'store', label: '门店中心', icon: 'location-o' }],
  },
  {
    title: '数据报表',
    items: [{ id: 'report', label: '经营分析', icon: 'bar-chart' }],
  },
  {
    title: '系统设置',
    items: [{ id: 'sys-setting', label: '系统设置', icon: 'setting' }],
  },
];

export default function DealAppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState(navGroups[1].title);
  const [activeKey, setActiveKey] = useState('campaign-create');

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
    <div className="deal-app-shell">
      <header className="deal-top-nav-bar">
        <div className="deal-top-nav-logo">
          <div className="deal-logo-mark" aria-hidden="true" />
          <span className="deal-logo-name">本地生活商家中心</span>
        </div>
        <nav className="deal-top-nav-menus">
          {navGroups.map((group) => (
            <a
              key={group.title}
              className={`deal-top-nav-tab ${group.title === activeTopTab ? 'active' : ''}`}
              onClick={() => group.title !== activeTopTab && setActiveTopTab(group.title)}
            >
              {group.title}
            </a>
          ))}
        </nav>
        <div className="deal-top-nav-actions">
          <Icon type="bell-o" className="deal-top-nav-icon" />
          <Icon type="comment-o" className="deal-top-nav-icon" />
          <div className="deal-top-nav-avatar" />
        </div>
      </header>

      <div className="deal-app-body">
        <aside className={`deal-side-nav ${collapsed ? 'deal-side-nav--collapsed' : ''}`}>
          <div className="deal-side-nav-menus">
            {activeSideGroup && (
              <Menu
                inlineCollapsed={collapsed}
                inlineIndent={28}
                selectedKeys={[activeKey]}
                defaultExpandedKeys={activeSideGroup.items.filter((i) => i.children).map((i) => i.id)}
                className="deal-side-nav-menu"
                onSelectChange={(key) => setActiveKey(key)}
              >
                {activeSideGroup.items.map((item) =>
                  item.children ? (
                    <Menu.SubMenu key={item.id} label={item.label} icon={<Icon type={item.icon} />}>
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
          <div className="deal-side-nav-collapse">
            <button
              className="deal-side-nav-collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? '展开' : '收起'}
            >
              <Icon type={collapsed ? 'expand' : 'collapse'} />
            </button>
          </div>
        </aside>

        <main className={`deal-app-content ${collapsed ? 'deal-app-content--collapsed' : ''}`}>
          <DealCampaignForm />
        </main>
      </div>
    </div>
  );
}
