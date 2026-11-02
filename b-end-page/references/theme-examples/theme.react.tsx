/**
 * React 主题入口示例（ThemeProvider 模式 · data-theme 属性驱动）
 *
 * 用途：统一管理「MTD 组件层 CSS」与「业务 Token 层」的联动切换。
 * 完整说明见 references/theme-system.md，本文件是可直接复制使用的独立主题入口。
 *
 * 使用方式：
 *   1. 把本文件拆分为 theme/themes.ts + theme/ThemeProvider.tsx 放入项目（也可保持单文件）
 *   2. 在应用根组件外包一层 <ThemeProvider>
 *   3. 业务组件内用 useTheme() 读取/切换当前主题
 *
 * ─────────────────────────────────────────────
 * 核心设计：JS 不参与任何色值计算
 *
 * 主题切换只做两件事：
 *   ① 动态加载对应的 MTD 组件层 CSS（换 <link>）
 *   ② 给 <html> 设置 data-theme 属性
 *
 * 业务 Token 层的所有色彩决策都留在 tokens.css 里（由
 * html[data-theme='brand-yellow'] 覆盖块表达），JS 只负责切换一个标识符字符串。
 * 因此这里**没有** tokens 取值表、**没有** applyTokens()、
 * **没有** document.documentElement.style.setProperty() —— 这是刻意为之：
 *   - 避免「语义层 → 原子层」的引用关系被割裂到 JS 里；
 *   - 避免 setProperty('--x', 'var(--y)') 这种语义混乱的写法；
 *   - 新增主题只需在 tokens.css 追加一个 [data-theme] 块 + 本文件加一条记录，
 *     不需要在 JS 里维护一份完整色值表（消除取值漂移的可能性）。
 *
 * swatch 字段是唯一的例外：它是主题切换器上那个小圆点的颜色，必须走 JS 内联样式，
 * 所以保留一个字面量。页面其余样式一律走 CSS 变量 var(--color-brand-primary)，
 * 不要读这个字段。
 * ─────────────────────────────────────────────
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// 1. 主题配置表：新增主题只改这里（+ tokens.css 里加一个 [data-theme] 覆盖块）
// ---------------------------------------------------------------------------

export type ThemeKey = 'primary' | 'brand-yellow';

export interface ThemeConfig {
  key: ThemeKey;
  label: string;
  /** 动态 import 对应 MTD 主题 CSS 的 URL（?url 后缀），交由打包器做代码分割，避免所有主题 CSS 都打进首屏包 */
  loadMtdCssUrl: () => Promise<string>;
  /**
   * 该主题的品牌主色，**仅供 JS 内联样式场景使用**（如主题切换器上的小圆点）。
   * 页面样式一律走 CSS 变量 --color-brand-primary，不要读这个字段。
   */
  swatch: string;
}

export const themes: Record<ThemeKey, ThemeConfig> = {
  primary: {
    key: 'primary',
    label: '工具蓝（默认）',
    loadMtdCssUrl: async () => (await import('@ss/mtd-react3/lib/style/index.css?url')).default,
    // 对应 tokens.css 原子层的 --blue-5
    swatch: '#166FF7',
  },
  'brand-yellow': {
    key: 'brand-yellow',
    label: '美团黄',
    loadMtdCssUrl: async () => (await import('@ss/mtd-react3/lib/style/theme-yellow.css?url')).default,
    // 对应 tokens.css 原子层的 --yellow
    swatch: '#FFDD00',
  },
};

export const DEFAULT_THEME: ThemeKey = 'primary';
const STORAGE_KEY = 'app-theme';

// ---------------------------------------------------------------------------
// 2. 主题入口组件：应用启动时挂载一次
// ---------------------------------------------------------------------------

interface ThemeContextValue {
  theme: ThemeKey;
  themeConfig: ThemeConfig;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** 第 2 层：业务 Token 层切换 —— 只设置一个属性，色值决策全在 CSS 里 */
function applyThemeAttr(key: ThemeKey) {
  if (key === DEFAULT_THEME) {
    // 默认主题对应 tokens.css 的 :root 基础声明，不需要属性
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', key);
  }
}

/** 第 1 层：MTD 组件层 CSS —— 替换 <link> 标签 */
const MTD_LINK_ID = 'mtd-theme-css';

async function applyMtdCss(config: ThemeConfig) {
  const href = await config.loadMtdCssUrl();
  let link = document.getElementById(MTD_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = MTD_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = href;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return (saved as ThemeKey) || DEFAULT_THEME;
  });

  const setTheme = useCallback((key: ThemeKey) => {
    setThemeState(key);
    localStorage.setItem(STORAGE_KEY, key);
  }, []);

  useEffect(() => {
    const config = themes[theme];
    // 第 1 层：动态加载 MTD 组件层 CSS
    applyMtdCss(config);
    // 第 2 层：切换业务 Token 层（只设一个属性，CSS 自行完成全部色值联动）
    applyThemeAttr(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeConfig: themes[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme 必须在 <ThemeProvider> 内使用');
  return ctx;
}

// ---------------------------------------------------------------------------
// 3. 使用示例（仅供参考，接入时按需删除）
// ---------------------------------------------------------------------------

/**
 * // 入口文件 App.tsx
 * import { ThemeProvider } from './theme.react';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 *
 * // 业务组件内切换主题（swatch 用于小圆点内联样式，这是 swatch 的唯一用途）
 * import { useTheme, themes } from './theme.react';
 *
 * function ThemeSwitcher() {
 *   const { theme, setTheme } = useTheme();
 *   return (
 *     <div style={{ display: 'flex', gap: 8 }}>
 *       {Object.values(themes).map((t) => (
 *         <button
 *           key={t.key}
 *           onClick={() => setTheme(t.key)}
 *           style={{
 *             width: 20, height: 20, borderRadius: '50%',
 *             background: t.swatch,
 *             outline: theme === t.key ? '2px solid var(--color-brand-primary)' : 'none',
 *           }}
 *           title={t.label}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 */
