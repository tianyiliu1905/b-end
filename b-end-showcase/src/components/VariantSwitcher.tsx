import { useState, type ReactNode } from 'react';
import styles from './VariantSwitcher.module.css';
import CopySpecButton from './CopySpecButton';

export interface PreviewVariant {
  name: string;
  render: () => ReactNode;
}

interface VariantSwitcherProps {
  variants: PreviewVariant[];
  /** 用于查找 / 复制 Design Spec 的模块标识（通常传 L2Module.id，如 'D-1'、'G-4'） */
  moduleId?: string;
}

/**
 * 模块详情页专用的变体切换器 —— 点击式 tab，始终可见（区别于 ModuleWrapper 的 hover 浮层，
 * 更适合静态文档场景：用户进入模块详情页就是为了逐个看清每个变体的真实样式）。
 * 切换栏左对齐、方形按钮；右侧提供「复制 Spec」按钮，一键复制当前变体的完整 Design Spec。
 */
export default function VariantSwitcher({ variants, moduleId }: VariantSwitcherProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!variants || variants.length === 0) return null;

  const currentVariantName = variants[activeIdx]?.name;

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {variants.map((v, i) => (
            <button
              key={v.name}
              className={`${styles.tab} ${i === activeIdx ? styles.tabActive : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              {v.name}
            </button>
          ))}
        </div>
        {moduleId && (
          <CopySpecButton moduleId={moduleId} variantName={currentVariantName} className={styles.copyBtn} />
        )}
      </div>
      <div className={styles.stage}>{variants[activeIdx].render()}</div>
    </div>
  );
}
