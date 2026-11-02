import { useNavigate } from 'react-router-dom';

export default function Placeholder() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f6f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      <p style={{
        fontSize: 20,
        color: '#8f959e',
        fontWeight: 500,
      }}>
        建设中...
      </p>

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
