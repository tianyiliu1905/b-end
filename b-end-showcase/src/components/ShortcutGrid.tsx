import { type ReactNode } from 'react';
import { Button } from '@ss/mtd-react3';

interface ShortcutItem {
  icon: ReactNode;
  color: string;
  label: string;
}

interface ShortcutGridProps {
  title?: string;
  items: ShortcutItem[];
}

/**
 * D-11 功能卡片（快捷入口）
 * 横向图标网格，每个入口有彩色图标 + 文字标签，右上角有"自定义"按钮
 */
export default function ShortcutGrid({ title = '常用功能', items }: ShortcutGridProps) {
  return (
    <div className="dash-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 'var(--fs-16, 16px)', fontWeight: 'var(--fw-medium, 500)', color: 'var(--text-1, #111929)' }}>
          {title}
        </span>
        <Button.Link type="primary" shape="text">自定义</Button.Link>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '16px 8px',
              borderRadius: 'var(--radius-elem, 8px)',
              background: '#F9FAFB',
              cursor: 'pointer',
              transition: 'background 0.15s',
              flex: '1 1 0',
              minWidth: 72,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              {item.icon}
            </div>
            <span style={{ fontSize: 'var(--fs-12, 12px)', color: 'var(--text-2, #4B5563)', textAlign: 'center', lineHeight: 1.3 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
