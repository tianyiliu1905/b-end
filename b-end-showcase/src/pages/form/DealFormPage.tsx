import { useNavigate } from 'react-router-dom';
import DealAppShell from './DealAppShell';

/**
 * 顺序落地页表单 — 到店套餐活动
 * 包装 DealAppShell（顶导 + 侧导 + DealCampaignForm）+ 浮动首页按钮
 */
export default function DealFormPage() {
  const navigate = useNavigate();

  return (
    <>
      <DealAppShell />

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
    </>
  );
}
