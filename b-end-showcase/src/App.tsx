import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import ModulesIndex from './pages/ModulesIndex';
import ModuleDetail from './pages/ModuleDetail';
import TopNav from './components/TopNav';
import VersionSwitcher from './components/VersionSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import { ThemeProvider } from './theme/useTheme';

// MTD versions
import OverviewDashboard from './pages/dashboard/OverviewDashboard';
import AiSummaryDashboard from './pages/dashboard/AiSummaryDashboard';
import FilterTableDashboard from './pages/dashboard/FilterTableDashboard';
import WorkbenchDashboard from './pages/dashboard/WorkbenchDashboard';
import CrudList from './pages/list/CrudList';
import TreeList from './pages/list/TreeList';
import MetricDetail from './pages/list/MetricDetail';

// Form pages
import BasicForm from './pages/form/BasicForm';
import DealFormPage from './pages/form/DealFormPage';
import StoreSettingsPage from './pages/form/StoreSettingsPage';
import StepForm from './pages/form/StepForm';
import GroupForm from './pages/form/GroupForm';
import MerchantOnboardingPage from './pages/form/MerchantOnboardingPage';
import SpecQualificationPage from './pages/form/SpecQualificationPage';
import Placeholder from './pages/form/Placeholder';
import ModalFormPage from './pages/form/ModalFormPage';

// Detail pages
import CampaignAppShell from './pages/detail/AppShell';
import MasterDetailPage from './pages/detail/MasterDetailPage';
import DrawerDetailPage from './pages/detail/DrawerDetailPage';
import ModalDetailPage from './pages/detail/ModalDetailPage';

import TokenSheet from './pages/TokenSheet';

import './styles/tokens.css';

function ScrollLockCleanup() {
  const location = useLocation();
  useEffect(() => {
    // MTD Drawer 在卸载时可能未清除 body 上的锁滚动类，路由切换时兜底清理
    document.body.classList.remove('mtd-prime-lock-scroll');
    document.body.style.overflow = '';
  }, [location.pathname]);
  return null;
}

/** 首页：顶部导航栏 + 页面模板内容（Landing 内容保持不变） */
function Home() {
  return (
    <>
      <TopNav />
      <Landing />
    </>
  );
}

/** 全局主题切换悬浮栏：首页/模板/模块相关页面已在 TopNav 内置主题下拉，此处隐藏避免重复 */
function GlobalThemeSwitcher() {
  const location = useLocation();
  const hideOn = location.pathname === '/' || location.pathname === '/templates' || location.pathname === '/modules' || location.pathname.startsWith('/modules/') || location.pathname === '/tokens';
  if (hideOn) return null;
  return <ThemeSwitcher />;
}

/** 非首页时显示的全局「← 首页」浮动按钮 */
function HomeFloatingButton() {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === '/' || location.pathname === '/templates' || location.pathname === '/modules' || location.pathname.startsWith('/modules/') || location.pathname === '/tokens') return null;
  return (
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
          background: 'transparent',
          color: 'rgba(255,255,255,0.6)',
          transition: 'all 0.2s ease',
        }}
      >
        ← 首页
      </button>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollLockCleanup />
        <HomeFloatingButton />
        <GlobalThemeSwitcher />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Home />} />
          <Route path="/modules" element={<ModulesIndex />} />
          <Route path="/modules/:id" element={<ModuleDetail />} />
          <Route path="/tokens" element={<TokenSheet />} />

          {/* Dashboard 页面 */}
          <Route path="/dashboard/overview" element={
            <VersionSwitcher title="数据通览看板" mtdVersion={<OverviewDashboard />} />
          } />
          <Route path="/dashboard/ai-summary" element={
            <VersionSwitcher title="AI 总结看板" mtdVersion={<AiSummaryDashboard />} />
          } />
          <Route path="/dashboard/filter-table" element={
            <VersionSwitcher title="筛选+表格看板" mtdVersion={<FilterTableDashboard />} />
          } />
          <Route path="/dashboard/workbench" element={
            <VersionSwitcher title="工作台" mtdVersion={<WorkbenchDashboard />} />
          } />

          {/* 列表页面 */}
          <Route path="/list/crud" element={
            <VersionSwitcher title="CRUD 管理列表" mtdVersion={<CrudList />} />
          } />
          <Route path="/list/tree" element={
            <VersionSwitcher title="树形层级列表" mtdVersion={<TreeList />} />
          } />
          <Route path="/list/metric-detail" element={
            <VersionSwitcher title="指标+明细列表" mtdVersion={<MetricDetail />} />
          } />

          {/* 表单页面 */}
          <Route path="/form/basic" element={<DealFormPage />} />
          <Route path="/form/step" element={<StoreSettingsPage />} />
          <Route path="/form/stepper" element={<MerchantOnboardingPage />} />
          <Route path="/form/group" element={<SpecQualificationPage />} />
          <Route path="/form/modal" element={<ModalFormPage />} />

          {/* 详情页面 */}
          <Route path="/detail/basic" element={<CampaignAppShell />} />
          <Route path="/detail/card" element={<MasterDetailPage />} />
          <Route path="/detail/timeline" element={<DrawerDetailPage />} />
          <Route path="/detail/modal" element={<ModalDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
