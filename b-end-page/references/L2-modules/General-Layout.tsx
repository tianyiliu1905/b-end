/*
 * G-1 顶导 + G-2 侧导 一体化模板
 * 直接复制，只替换 navGroups / systemName / 菜单文案。
 *
 * 图标注意：
 * - Icon 用 type 属性（不是 name）
 * - 统一 -o 线性风格，禁混 -fill
 * - 不存在的图标名（会渲染空白）：shop-o / store-o / wallet-o / team-o /
 *   usergroup-o / chart-o / data-o / report-o / filetext-o / application-o / layout-o / windows-o
 * - 替代：customer-o / cart-o / money-circle / contacts / areachart-o / bar-chart / piechart-o
 * - 不确定时 grep node_modules/@ss/mtd-react3/lib/style/icon.css 验证
 */

import { useState, useEffect, type ReactNode } from 'react';
import { Icon, Menu } from '@ss/mtd-react3';

/* ─── 类型 ─── */
interface NavItem {
  id: string;
  label: string;
  icon: string;        // MTD Icon type，一级项必带，统一 -o 线性
  path?: string;
  children?: NavItem[];
}

interface TopTab {
  key: string;
  label: string;
}

interface NavGroup {
  topTab: TopTab;      // 顶导 Tab
  items: NavItem[];    // 对应的侧导菜单项
}

interface LayoutProps {
  navGroups: NavGroup[];
  systemName?: string;
  defaultActiveTab?: string;
  defaultSelectedKey?: string;
  children: ReactNode;
}

/* ─── 组件 ─── */
export default function Layout({
  navGroups,
  systemName = '系统名称',
  defaultActiveTab,
  defaultSelectedKey = '',
  children,
}: LayoutProps) {
  const [activeTopTab, setActiveTopTab] = useState(
    defaultActiveTab || navGroups[0]?.topTab.key || ''
  );
  const [collapsed, setCollapsed] = useState(false);

  // 窄屏（<768px）自动收起侧导，用 matchMedia 而非 resize
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767.98px)');
    const apply = (matches: boolean) => setCollapsed(matches);
    apply(mql.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const activeSideGroup = navGroups.find(g => g.topTab.key === activeTopTab);

  return (
    <div className="app-shell">
      {/* ===== G-1 顶部导航（原生 <a> 标签，禁止用 MTD Tabs） ===== */}
      <header className="top-nav">
        <div className="top-nav-logo">
          <span className="top-nav-logo-mark" />
          <span className="top-nav-logo-name">{systemName}</span>
        </div>
        <nav className="top-nav-menus">
          {navGroups.map(group => (
            <a
              key={group.topTab.key}
              className={`top-nav-tab${activeTopTab === group.topTab.key ? ' active' : ''}`}
              onClick={() => setActiveTopTab(group.topTab.key)}
            >
              {group.topTab.label}
            </a>
          ))}
        </nav>
        <div className="top-nav-actions">
          <Icon type="bell-o" className="top-nav-icon" />
          <Icon type="comment-o" className="top-nav-icon" />
          <div className="top-nav-avatar" />
        </div>
      </header>

      <div className={`app-body${collapsed ? ' is-collapsed' : ''}`}>
        {/* ===== G-2 侧边栏 ===== */}
        <aside className="side-nav">
          <div className="side-nav-menus">
            {activeSideGroup && (
              <Menu
                theme="light"
                inlineCollapsed={collapsed}
                inlineIndent={28}
                defaultSelectedKeys={defaultSelectedKey ? [defaultSelectedKey] : []}
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

          {/* 折叠按钮：用原生 button，不用 MTD Button */}
          <div className="side-nav-collapse">
            <button
              type="button"
              className="side-nav-collapse-btn"
              onClick={() => setCollapsed(c => !c)}
              aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
            >
              <Icon type={collapsed ? 'expand' : 'collapse'} />
            </button>
          </div>
        </aside>

        {/* ===== 主内容区 ===== */}
        <main className="app-content">
          {children}
        </main>
      </div>

      {/* ===== 内联样式 ===== */}
      <style>{`
        /* ─── 整体骨架 ─── */
        .app-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          min-width: 1024px;
          background: var(--bg-page);
        }

        /* ─── G-1 顶部导航（原生 <a> + CSS ::after，禁止 MTD Tabs） ─── */
        .top-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--top-nav-h, 52px);
          display: flex;
          align-items: center;
          padding: 0 20px;
          background: var(--bg-card);
          box-shadow: var(--shadow-min);
          z-index: 100;
        }

        /* Logo 区 */
        .top-nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 0 0 auto;
        }

        .top-nav-logo-mark {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--color-brand-primary), var(--color-primary-1));
          flex-shrink: 0;
        }

        .top-nav-logo-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-1);
          white-space: nowrap;
        }

        /* Tab 区（原生 <a> 标签） */
        .top-nav-menus {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
          margin-left: 32px;
        }

        .top-nav-tab {
          position: relative;
          height: var(--top-nav-h, 52px);
          line-height: var(--top-nav-h, 52px);
          font-size: 14px;
          color: var(--text-2);
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
        }

        .top-nav-tab:hover {
          color: var(--text-1);
          text-decoration: none;
        }

        .top-nav-tab.active {
          color: var(--text-1);
          font-weight: 600;
        }

        .top-nav-tab.active::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: var(--color-brand-primary);
        }

        /* 操作区 */
        .top-nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 0 0 auto;
        }

        .top-nav-icon {
          font-size: 20px;
          color: var(--text-2);
          cursor: pointer;
        }

        .top-nav-icon:hover {
          color: var(--color-brand-primary);
        }

        .top-nav-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--bg-card-inner);
        }

        /* ─── app-body ─── */
        .app-body {
          display: flex;
          flex: 1;
          overflow: hidden;
          padding-top: var(--top-nav-h, 52px);
        }

        /* ─── G-2 侧边栏 ─── */
        .side-nav {
          position: fixed;
          top: var(--top-nav-h, 52px);
          left: 0;
          bottom: 0;
          width: var(--side-nav-w, 168px);
          background: var(--bg-card);
          box-shadow: var(--shadow-min);
          display: flex;
          flex-direction: column;
          z-index: 50;
          transition: width 0.2s ease;
          padding: 6px 0 4px;
        }

        .app-body.is-collapsed .side-nav {
          width: var(--side-nav-w-collapsed, 56px);
        }

        .side-nav-menus {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .side-nav-menus::-webkit-scrollbar {
          display: none;
        }

        .side-nav-menu {
          width: 100%;
        }

        /* 菜单项圆角和间距（结构性覆盖，不涉及颜色） */
        .side-nav-menu .mtd-prime-menu-item {
          border-radius: 6px;
          margin: 0 8px;
        }

        /* ⚠️ 选中/hover 态颜色不覆盖：MTD Menu 组件内部默认样式（.mtd-prime-menu-item-selected /
           .mtd-prime-menu-item-active 等）完全交给 MTD 官方主题 CSS 决定，随 MTD CSS 主题包
           （index.css / theme-yellow.css）切换联动。业务 tokens.css 不对组件内部 class 做颜色覆盖，
           保证「组件层」与「业务 Token 层」职责边界清晰：业务 token 只作用于本文件自己写的非 MTD
           元素（如上方 logo 占位块、顶导手写 router-link 菜单）。 */

        /* ─── 折叠按钮（原生 button） ─── */
        .side-nav-collapse {
          width: 100%;
          height: 40px;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: auto;
          border-top: 1px solid var(--divider);
        }

        .app-body.is-collapsed .side-nav-collapse {
          justify-content: center;
          border-top: none;
        }

        .side-nav-collapse-btn {
          width: 32px;
          height: 32px;
          padding: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 20px;
          color: var(--text-2);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }

        .side-nav-collapse-btn:hover {
          background: var(--bg-page);
        }

        /* ─── 主内容区 ─── */
        .app-content {
          margin-left: var(--side-nav-w, 168px);
          flex: 1;
          min-width: 0;
          overflow: auto;
          background: var(--bg-page);
          transition: margin-left 0.2s ease;
        }

        .app-body.is-collapsed .app-content {
          margin-left: var(--side-nav-w-collapsed, 56px);
        }
      `}</style>
    </div>
  );
}
