import { useState } from 'react';

interface ModuleBlockProps {
  moduleId: string;
  moduleName: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * L2 模块区块包装器
 * hover 时在左上角显示对应的 L2 模块编号和名称
 */
export default function ModuleBlock({
  moduleId,
  moduleName,
  children,
  className,
  style,
}: ModuleBlockProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      style={{ position: 'relative', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 100,
            background: 'var(--color-brand-primary, #166FF7)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 500,
            padding: '3px 8px',
            borderRadius: '4px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {moduleId} · {moduleName}
        </div>
      )}
      {children}
    </div>
  );
}
