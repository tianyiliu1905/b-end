import { themes, useTheme, type ThemeKey } from '../theme/useTheme';

/**
 * 底部悬浮主题切换栏：在默认主题（工具蓝）与黄色主题（美团黄）之间切换。
 * 视觉上与 App.tsx 的 HomeFloatingButton 保持同一套「深色悬浮胶囊」风格，
 * 两者共享同一个底部区域，切换栏在返回首页按钮左侧。
 */
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const options: ThemeKey[] = ['primary', 'brand-yellow'];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
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
      {options.map((key) => {
        const config = themes[key];
        const active = theme === key;
        return (
          <button
            key={key}
            onClick={() => setTheme(key)}
            title={config.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.01em',
              background: active ? 'rgba(255,255,255,0.16)' : 'transparent',
              color: active ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s ease',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: config.swatch,
                boxShadow: active ? '0 0 0 2px rgba(255,255,255,0.25)' : 'none',
                flexShrink: 0,
              }}
            />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
