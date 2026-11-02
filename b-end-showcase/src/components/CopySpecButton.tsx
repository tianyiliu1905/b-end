import { useRef, useState, type MouseEvent } from 'react';
import { getDesignSpec, hasDesignSpec } from '../data/designSpecs';

interface CopySpecButtonProps {
  moduleId: string;
  variantName?: string;
  className?: string;
}

function doCopy(text: string) {
  const fallbackCopy = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return Promise.resolve();
  };
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(fallbackCopy);
  }
  return fallbackCopy();
}

/**
 * 通用「复制 Design Spec」按钮 —— 供模块详情页 / 模块库列表页复用，
 * 与 ModuleWrapper 内 hover 浮层中的复制逻辑保持一致的数据来源（designSpecs.ts）。
 */
export default function CopySpecButton({ moduleId, variantName, className }: CopySpecButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const specAvailable = hasDesignSpec(moduleId);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // 卡片本身可能是 <Link>，阻止冒泡/默认跳转，避免点击复制按钮时触发导航
    e.preventDefault();
    e.stopPropagation();
    if (!specAvailable) return;
    const spec = getDesignSpec(moduleId, variantName);
    doCopy(spec).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={!specAvailable}
      title={specAvailable ? '复制该模块的 Design Spec' : '暂无 Design Spec，无法复制'}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          已复制
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 11V3C3 2.44772 3.44772 2 4 2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          复制 Spec
        </>
      )}
    </button>
  );
}
