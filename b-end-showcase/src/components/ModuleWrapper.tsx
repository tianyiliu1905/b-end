import { useState, useRef, useCallback, useEffect, type ReactNode, type CSSProperties } from 'react';
import { getDesignSpec, hasDesignSpec } from '../data/designSpecs';
import { getModuleById } from '../data/l2Modules';

export interface ModuleVariant {
  name: string;
  render: () => ReactNode;
}

interface ModuleWrapperProps {
  moduleId: string;
  children?: ReactNode;
  variants?: ModuleVariant[];
  defaultVariant?: number;
  style?: CSSProperties;
  /** 浮层方向：top（默认，向上弹出）/ bottom（向下弹出，用于靠近顶部的模块避免被 header 遮挡） */
  tooltipPlacement?: 'top' | 'bottom';
  /** 使用 fixed 定位（用于父容器有 overflow:auto/hidden 的场景） */
  useFixed?: boolean;
  /** 禁用 hover 浮层（用于弹窗/抽屉等，避免浮层影响容器布局） */
  disableTooltip?: boolean;
}

/* 全局互斥：同一时间只允许一个 ModuleWrapper 显示 tooltip */
let globalHideCallback: (() => void) | null = null;

/**
 * L2 模块包装器
 * - 无 variants 时：hover 显示自定义 tooltip（模块名）
 * - 有 variants 时：hover 显示浮层面板（模块名 + 当前变体 + 切换按钮 + 复制 Design Spec）
 */
export default function ModuleWrapper({ moduleId, children, variants, defaultVariant = 0, style, tooltipPlacement = 'top', useFixed = false, disableTooltip = false }: ModuleWrapperProps) {
  const [activeIdx, setActiveIdx] = useState(defaultVariant);
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fixedPos, setFixedPos] = useState<{ top: number; left: number } | null>(null);

  const hasVariants = variants && variants.length > 0;
  const currentVariantName = hasVariants ? variants[activeIdx]?.name : null;
  // 是否存在已定义的 Design Spec —— 无 spec 时「复制 Spec」按钮置灰不可点
  const specAvailable = hasDesignSpec(moduleId);
  // 对齐模块库的展示方式：编号 + 中文名称
  const moduleMeta = getModuleById(moduleId);
  const displayName = moduleMeta ? `${moduleId} · ${moduleMeta.name}` : moduleId;

  const updateFixedPos = useCallback(() => {
    if (!useFixed || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const isBottom = tooltipPlacement === 'bottom';
    setFixedPos({
      top: isBottom ? rect.bottom + 8 : rect.top - 8,
      left: rect.left + rect.width / 2,
    });
  }, [useFixed, tooltipPlacement]);

  const hidePanel = useCallback(() => {
    setShowPanel(false);
    if (globalHideCallback === hidePanel) {
      globalHideCallback = null;
    }
  }, []);

  const handleMouseEnter = () => {
    if (disableTooltip) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    // 延迟显示，避免鼠标快速划过时误触发
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    showTimerRef.current = setTimeout(() => {
      // 互斥：先关闭其他已显示的 tooltip
      if (globalHideCallback && globalHideCallback !== hidePanel) {
        globalHideCallback();
      }
      globalHideCallback = hidePanel;
      updateFixedPos();
      setShowPanel(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    timerRef.current = setTimeout(() => {
      hidePanel();
    }, 200);
  };

  const handleCopySpec = useCallback(() => {
    if (!specAvailable) return;
    const spec = getDesignSpec(moduleId, currentVariantName || undefined);
    // 优先用 clipboard API，fallback 到 execCommand
    const doCopy = (text: string) => {
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      }
      return fallbackCopy(text);
    };
    const fallbackCopy = (text: string) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return Promise.resolve();
    };
    doCopy(spec).then(() => {
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [moduleId, currentVariantName, specAvailable]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (globalHideCallback === hidePanel) {
        globalHideCallback = null;
      }
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
    };
  }, [hidePanel]);

  // 滚动时更新 fixed 位置
  useEffect(() => {
    if (!useFixed || !showPanel) return;
    const scrollParent = containerRef.current?.closest('.scroll-content') || window;
    const onScroll = () => updateFixedPos();
    scrollParent.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollParent.removeEventListener('scroll', onScroll);
  }, [useFixed, showPanel, updateFixedPos]);

  const containerStyle: CSSProperties = { position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', ...style };

  const isBottom = tooltipPlacement === 'bottom';

  let panelPositionStyle: CSSProperties;
  if (useFixed && fixedPos) {
    panelPositionStyle = isBottom
      ? { position: 'fixed', top: fixedPos.top, left: fixedPos.left, transform: 'translateX(-50%)' }
      : { position: 'fixed', top: fixedPos.top, left: fixedPos.left, transform: 'translate(-50%, -100%)' };
  } else {
    panelPositionStyle = isBottom
      ? { position: 'absolute', bottom: -8, left: '50%', transform: 'translate(-50%, 100%)' }
      : { position: 'absolute', top: -8, left: '50%', transform: 'translate(-50%, -100%)' };
  }

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 渲染内容 */}
      {hasVariants ? variants[activeIdx].render() : children}

      {/* 浮层面板 */}
      {showPanel && (
        <div
          style={{
            ...panelPositionStyle,
            zIndex: 2147483647,
            background: '#1F2937',
            color: '#fff',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minWidth: 120,
            maxWidth: 260,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* 模块名称：对齐模块库展示方式（编号 · 中文名称） */}
          <div style={{ fontWeight: 600, fontSize: 13 }}>
            {displayName}
          </div>

          {/* 变体切换按钮（仅有 variants 时显示） */}
          {hasVariants && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {variants.map((v, i) => (
                <button
                  key={v.name}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 4,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: i === activeIdx ? 600 : 400,
                    background: i === activeIdx ? 'var(--color-brand-primary, #3B82F6)' : 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}

          {/* 当前状态提示 + 复制按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            {currentVariantName && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                当前：{currentVariantName}
              </div>
            )}
            <button
              onClick={handleCopySpec}
              disabled={!specAvailable}
              title={specAvailable ? '复制该模块的 Design Spec' : '暂无 Design Spec，无法复制'}
              style={{
                padding: '3px 10px',
                borderRadius: 4,
                border: specAvailable ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.12)',
                cursor: specAvailable ? 'pointer' : 'not-allowed',
                fontSize: 11,
                fontWeight: 500,
                background: copied ? '#10B981' : 'transparent',
                color: specAvailable ? '#fff' : 'rgba(255,255,255,0.35)',
                opacity: specAvailable ? 1 : 0.6,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  已复制
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <rect x="5" y="5" width="9" height="9" rx="1.5" stroke={specAvailable ? 'white' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5"/>
                    <path d="M3 11V3C3 2.44772 3.44772 2 4 2H11" stroke={specAvailable ? 'white' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  复制 Spec
                </>
              )}
            </button>
          </div>

          {/* 小三角 */}
          <div
            style={isBottom ? {
              position: 'absolute',
              top: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid #1F2937',
            } : {
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1F2937',
            }}
          />
        </div>
      )}
    </div>
  );
}
