import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon, Menu } from '@ss/mtd-react3';
import styles from './MtdLayout.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const defaultNavGroups: NavGroup[] = [
  {
    title: '一级类目一',
    items: [
      { id: 'overview', label: '二级类目一', icon: 'areachart-o', path: '/dashboard/overview' },
      { id: 'ai-summary', label: '二级类目二', icon: 'areachart-o', path: '/dashboard/ai-summary' },
      { id: 'filter-table', label: '二级类目三', icon: 'areachart-o', path: '/dashboard/filter-table' },
    ],
  },
  {
    title: '一级类目二',
    items: [
      { id: 'crud', label: '二级类目一', icon: 'file-o', path: '/list/crud' },
      { id: 'tree', label: '二级类目二', icon: 'file-o', path: '/list/tree' },
    ],
  },
  {
    title: '一级类目三',
    items: [
      { id: 'form-basic', label: '二级类目一', icon: 'edit-o', path: '/form/basic' },
      { id: 'form-step', label: '二级类目二', icon: 'success-o', path: '/form/step' },
      { id: 'form-group', label: '二级类目三', icon: 'group-o', path: '/form/group' },
    ],
  },
  {
    title: '一级类目四',
    items: [
      { id: 'settings', label: '一级类目四', icon: 'setting', path: '/settings' },
    ],
  },
  {
    title: '一级类目五',
    items: [
      { id: 'monitor', label: '一级类目五', icon: 'monitor', path: '/monitor' },
    ],
  },
  {
    title: '一级类目六',
    items: [
      { id: 'report', label: '一级类目六', icon: 'barschart-o', path: '/report' },
    ],
  },
];

export interface MtdLayoutProps {
  children: ReactNode;
  systemName?: string;
  navGroups?: NavGroup[];
  hideSidebar?: boolean;
}

export default function MtdLayout({ children, systemName, navGroups, hideSidebar }: MtdLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const groups = navGroups || defaultNavGroups;
  const displayName = systemName || 'MTD B端知识库预览';

  // 判断是否自定义导航（自定义时顶部显示自定义 tab）
  const isCustomNav = !!navGroups;

  // 侧边栏始终展示所有组
  const sidebarGroups = groups;

  // 找到当前选中的菜单项 id
  const allItems = sidebarGroups.flatMap(g => g.items);
  const activeItem = allItems.find(item => item.path === location.pathname);
  const activeKey = activeItem?.id || allItems[0]?.id || '';

  return (
    <div className={styles.layout}>
      {/* G-1 顶部导航 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoMark} aria-hidden="true" />
          <div className={styles.logo}>{displayName}</div>
          {isCustomNav && (
            <nav className={styles.domainNav}>
              <button className={`${styles.domainItem} ${styles.domainItemActive}`}>首页</button>
              <button className={styles.domainItem}>铺位配置</button>
            </nav>
          )}
        </div>
        <div className={styles.headerRight}>
          {isCustomNav && (
            <>
              <span style={{ fontSize: 13, color: '#5a5f66' }}>品牌名称</span>
              <div style={{ width: 1, height: 16, background: '#e8e8ea' }} />
              <span style={{ fontSize: 13, color: '#5a5f66' }}>账号名称</span>
            </>
          )}
          {!isCustomNav && (
            <>
              <Icon type="bell-o" className={styles.headerAction} />
              <Icon type="comment-o" className={styles.headerAction} />
            </>
          )}
          <div className={styles.avatar} />
        </div>
      </header>

      <div className={styles.body}>
        {/* G-2 侧边栏 */}
        {!hideSidebar && <aside className={`${styles.sider} ${collapsed ? styles.siderCollapsed : ''}`}>
          <div className={styles.siderMenus}>
            {sidebarGroups.length > 0 && (
              <Menu
                inlineCollapsed={collapsed}
                defaultSelectedKeys={[activeKey]}
                defaultExpandedKeys={sidebarGroups.map(g => `group-${g.title}`)}
                className={styles.sideMenu}
              >
                {sidebarGroups.map(group => {
                  // 只有 1 个 item 且 label 等于 title：视为无二级类目，直接渲染为一级菜单项
                  const isSingle = group.items.length === 1 && group.items[0].label === group.title;
                  if (isSingle) {
                    const item = group.items[0];
                    return (
                      <Menu.Item key={item.id} icon={item.icon}>
                        {item.label}
                      </Menu.Item>
                    );
                  }
                  return (
                    <Menu.SubMenu
                      key={`group-${group.title}`}
                      icon={<Icon type={group.items[0]?.icon || 'list-view'} />}
                      label={group.title}
                    >
                      {group.items.map(item => (
                        <Menu.Item key={item.id}>
                          {item.label}
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  );
                })}
              </Menu>
            )}
          </div>

          {/* 折叠按钮 */}
          <div className={styles.siderFooter}>
            <button
              className={styles.collapseBtn}
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? '展开侧栏' : '收起侧栏'}
            >
              <Icon type={collapsed ? 'expand' : 'collapse'} />
            </button>
          </div>
        </aside>}

        {/* 主内容区 */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
