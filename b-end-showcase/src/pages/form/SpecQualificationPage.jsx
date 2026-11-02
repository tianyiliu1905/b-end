import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Tag, Menu, Icon } from '@ss/mtd-react3';
import SpecQualificationDrawer from './SpecQualificationDrawer.jsx';
import './SpecQualificationPage.css';

/* ============================================
   模拟数据
   ============================================ */
const mockData = [
  { key: 1, specNo: 'VEG-2026-001', productName: '青椒（螺丝椒）', specType: '外观品质', inspectionItem: '果长', standardValue: '18-25cm', measuredValue: '22cm', result: 'qualified', inspectionDate: '2026-06-15' },
  { key: 2, specNo: 'VEG-2026-002', productName: '青椒（线椒）', specType: '农药残留', inspectionItem: '毒死蜱', standardValue: '≤0.1mg/kg', measuredValue: '0.15mg/kg', result: 'unqualified', inspectionDate: '2026-06-16' },
  { key: 3, specNo: 'VEG-2026-003', productName: '青椒（甜椒）', specType: '理化指标', inspectionItem: '水分含量', standardValue: '90-93%', measuredValue: '91.5%', result: 'qualified', inspectionDate: '2026-06-18' },
];

const resultMap = {
  qualified: { text: '合格', color: 'green' },
  unqualified: { text: '不合格', color: 'red' },
  concession: { text: '让步接收', color: 'orange' },
};

/* ============================================
   主页面组件
   装配产物：抽屉表单页[ 表格列表 + 抽屉表单 ]
   ============================================ */
export default function SpecQualificationPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  /* --- 窄屏自动收起侧导 --- */
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 480px)');
    const apply = (matches) => setCollapsed(matches);
    apply(mql.matches);
    const onChange = (e) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const columns = [
    { label: '检测编号', dataKey: 'specNo', width: 140 },
    { label: '产品名称', dataKey: 'productName', width: 160 },
    { label: '规格类型', dataKey: 'specType', width: 120 },
    { label: '检测项目', dataKey: 'inspectionItem', width: 120 },
    { label: '标准值', dataKey: 'standardValue', width: 140 },
    { label: '实测值', dataKey: 'measuredValue', width: 140 },
    {
      label: '判定结果',
      dataKey: 'result',
      width: 100,
      render: (val) => {
        const m = resultMap[val] || {};
        return <Tag color={m.color}>{m.text}</Tag>;
      },
    },
    { label: '检测日期', dataKey: 'inspectionDate', width: 120 },
    {
      label: '操作',
      width: 100,
      render: (_, record) => (
        <Button size="small" onClick={() => setDrawerVisible(true)}>判定</Button>
      ),
    },
  ];

  return (
    <div className="app-shell spec-qualification">
      {/* ============================
          G · 顶导航栏 TopNavBar
          ============================ */}
      <header className="top-nav-bar">
        <div className="top-nav-logo">
          <div className="logo-icon" />
          <span className="logo-name">质量管理系统</span>
        </div>
        <nav className="top-nav-menus">
          <a className="top-nav-tab active">规格判定</a>
          <a className="top-nav-tab">检测报告</a>
          <a className="top-nav-tab">统计分析</a>
        </nav>
        <div className="top-nav-actions">
          <Icon type="bell-o" style={{ fontSize: 20, cursor: 'pointer' }} />
          <Icon type="comment-o" style={{ fontSize: 20, cursor: 'pointer' }} />
          <div className="avatar" />
        </div>
      </header>

      <div className="app-body">
        {/* ============================
            G · 侧导航栏 SideNavBar
            ============================ */}
        <aside
          className="side-nav"
          style={{ width: collapsed ? 60 : 200 }}
        >
          <Menu
            inlineCollapsed={collapsed}
            selectedKeys={['spec-judgment']}
            defaultExpandedKeys={['quality', 'data']}
            className="side-nav-menu"
          >
            <Menu.SubMenu key="quality" icon={<Icon type="file-o" />} label="质量判定">
              <Menu.Item key="spec-judgment">规格合格判断</Menu.Item>
              <Menu.Item key="batch-judgment">批次综合判定</Menu.Item>
              <Menu.Item key="sampling">抽检管理</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="data" icon={<Icon type="barschart-o" />} label="检测数据">
              <Menu.Item key="data-entry">数据录入</Menu.Item>
              <Menu.Item key="data-query">数据查询</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="settings" icon={<Icon type="setting" />} label="系统设置">
              <Menu.Item key="spec-template">规格模板</Menu.Item>
              <Menu.Item key="user-manage">用户管理</Menu.Item>
            </Menu.SubMenu>
          </Menu>

          <div className={`side-nav-collapse ${collapsed ? 'side-nav-collapse--collapsed' : ''}`}>
            <button
              className="side-nav-collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? '展开' : '收起'}
            >
              <Icon type={collapsed ? 'expand' : 'collapse'} />
            </button>
          </div>
        </aside>

        {/* ============================
            内容区
            ============================ */}
        <main
          className="app-content"
          style={{ marginLeft: collapsed ? 60 : 200 }}
        >
          {/* F1 · 承载容器：灰底 + 白卡 */}
          <div className="page-container">
            <div className="page-card">
              {/* F2 · 表头信息区 */}
              <div className="page-header">
                <h1 className="page-header__title">青椒 — 入库品质检测记录</h1>
                <p className="page-header__desc">
                  供应商：寿光蔬菜合作社，批次 BAT-2026-06，当前共 3 条检测记录。
                </p>
              </div>

              {/* 可滚动内容区 */}
              <div className="scroll-content">
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={() => setDrawerVisible(true)}>
                    新增判定（抽屉）
                  </Button>
                </div>
                <Table
                  columns={columns}
                  data={mockData}
                  pagination={false}
                  rowKey="key"
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 抽屉表单 */}
      <SpecQualificationDrawer visible={drawerVisible} setVisible={setDrawerVisible} />

      {/* Floating home navigation */}
      <div style={{
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
      }}>
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
