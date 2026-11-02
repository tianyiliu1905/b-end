import React, { useEffect, useState } from 'react';
import { Menu, Icon } from '@ss/mtd-react3';

/**
 * 商家入驻申请 — AppShell（页面骨架）
 * 顶导（G-topnavbar）+ 侧导（G-sidenavbar）+ 内容区
 *
 * 技术栈：React（@ss/mtd-react3）
 * 遵循 L2 模块规范：
 *   - 顶导：三段式布局、tab 用手写 a + CSS §3.2
 *   - 侧导：一级项必带线框 icon §3.2、SubMenu 用 label prop §约束9
 *   - 侧导折叠按钮自实现 §3.4、窄屏自动收起 §3.5
 */
export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // §3.5 窄屏自动收起：断点 767.98px
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767.98px)');
    const apply = (matches) => setCollapsed(matches);
    apply(mql.matches);
    const onChange = (e) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="app-shell merchant-onboarding">
      {/* ===== 顶导航栏（G-topnavbar）===== */}
      <header className="top-nav-bar">
        <div className="top-nav-logo">
          <span className="top-nav-logo-icon" />
          <span className="top-nav-logo-text">商家中心</span>
        </div>
        <nav className="top-nav-menus">
          <a className="top-nav-tab active">商家入驻</a>
          <a className="top-nav-tab">门店管理</a>
          <a className="top-nav-tab">经营数据</a>
        </nav>
        <div className="top-nav-actions">
          <Icon type="bell-o" style={{ fontSize: 20, cursor: 'pointer' }} />
          <Icon type="comment-o" style={{ fontSize: 20, cursor: 'pointer' }} />
          <div className="top-nav-avatar" />
        </div>
      </header>

      {/* ===== 侧导航栏（G-sidenavbar）===== */}
      <aside className={`side-nav${collapsed ? ' is-collapsed' : ''}`}>
        <Menu
          className="side-nav-menu"
          theme="light"
          inlineCollapsed={collapsed}
          selectedKeys={['merchant-apply']}
          defaultExpandedKeys={['merchant']}
          onSelectChange={() => {}}
        >
          {/* 一级项必带 icon（线框 -o 风格）；SubMenu 用 label prop */}
          <Menu.SubMenu key="merchant" icon={<Icon type="customer-o" />} label="商家管理">
            <Menu.Item key="merchant-apply">入驻申请</Menu.Item>
            <Menu.Item key="merchant-list">商家列表</Menu.Item>
            <Menu.Item key="merchant-review">审核管理</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="store" icon={<Icon type="home-o" />}>门店管理</Menu.Item>
          <Menu.Item key="order" icon={<Icon type="invoice-o" />}>订单中心</Menu.Item>
          <Menu.Item key="finance" icon={<Icon type="money-circle" />}>财务结算</Menu.Item>
          <Menu.Item key="data" icon={<Icon type="areachart-o" />}>经营数据</Menu.Item>
          <Menu.Item key="setting" icon={<Icon type="setting" />}>系统设置</Menu.Item>
        </Menu>

        {/* §3.4 折叠按钮：MTD 不提供，自实现 */}
        <div className={`side-nav-collapse${collapsed ? ' is-collapsed' : ''}`}>
          <button
            type="button"
            className="side-nav-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? '展开' : '收起'}
          >
            <Icon type={collapsed ? 'expand' : 'collapse'} />
          </button>
        </div>
      </aside>

      {/* ===== 内容区（F1 承载容器: 灰底）===== */}
      <main className={`app-content${collapsed ? ' is-collapsed' : ''}`}>
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
