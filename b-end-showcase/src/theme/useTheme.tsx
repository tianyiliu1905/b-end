/**
 * 主题入口（ThemeProvider 模式）
 *
 * 统一管理「MTD 组件层 CSS」与「业务 Token 层 tokens.css 变量」的联动切换。
 * 完整规范见 b-end-page skill 的 references/theme-system.md，本文件是该文档
 * §4 React 参考实现在本项目内的落地版本。
 *
 * 新增主题时只需要在下方 `themes` 对象里新增一条记录，不需要改动本文件其余逻辑，
 * 也不需要改动任何业务组件代码——业务代码只认 CSS 变量名，不关心当前是哪套主题。
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// 1. 主题配置表：新增主题只改这里
// ---------------------------------------------------------------------------

export type ThemeKey = 'primary' | 'brand-yellow';

export interface ThemeConfig {
  key: ThemeKey;
  label: string;
  /** 动态 import 对应 MTD 主题 CSS 文件的 URL（?url 后缀），交由打包器做代码分割，避免所有主题 CSS 都打进首屏包 */
  loadMtdCssUrl: () => Promise<string>;
  /**
   * 该主题的品牌主色，仅供 JS 内联样式场景使用（如主题切换器上的小圆点）。
   * 页面样式一律走 CSS 变量 --color-brand-primary，不要读这个字段。
   */
  swatch: string;
}

export const themes: Record<ThemeKey, ThemeConfig> = {
  primary: {
    key: 'primary',
    label: '工具蓝',
    loadMtdCssUrl: async () => (await import('@ss/mtd-react3/lib/style/index.css?url')).default,
    // 对应 tokens.css 原子层的 --blue-5
    swatch: '#166FF7',
  },
  'brand-yellow': {
    key: 'brand-yellow',
    label: '美团黄',
    loadMtdCssUrl: async () => (await import('@ss/mtd-react3/lib/style/theme-yellow.css?url')).default,
    // 对应 tokens.css 原子层的 --yellow-5
    swatch: '#FFDD00',
  },
};

export const DEFAULT_THEME: ThemeKey = 'primary';
const STORAGE_KEY = 'b-end-spec-theme';

// ---------------------------------------------------------------------------
// 2. 主题入口组件：应用启动时挂载一次
// ---------------------------------------------------------------------------

interface ThemeContextValue {
  theme: ThemeKey;
  themeConfig: ThemeConfig;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * 在 <html> 上标记当前主题，激活 tokens.css 里对应的 [data-theme='xxx'] 覆盖块。
 * JS 不参与任何色值计算：语义层指向哪个原子层色阶，完全由 CSS 决定。
 * 默认主题（工具蓝）的引用关系写在 :root 上，因此不需要额外属性。
 */
function applyThemeAttr(key: ThemeKey) {
  document.documentElement.setAttribute('data-theme', key);
}

const MTD_THEME_LINK_ID = 'mtd-theme-css';

/**
 * 用唯一 id 的 <link> 标签承载当前 MTD 主题 CSS，切换主题时直接改写 href，
 * 而不是用动态 import() 追加新的 <style>。
 * 原因：import() 加载过的 CSS 模块会被 ES Module 缓存，第二次 import 同一个
 * 模块不会重新执行副作用（不会把它的 <style> 标签移到文档末尾）。这会导致
 * 「蓝→黄→蓝」切换时，黄色主题的样式标签仍然排在蓝色样式标签之后，层叠顺序
 * 未被重置，部分按钮/组件颜色不会随切换恢复。用单一 <link> 显式替换 href，
 * 保证任意时刻文档中只有一份当前主题的 MTD CSS 在生效。
 */
function applyMtdCssUrl(url: string) {
  let link = document.getElementById(MTD_THEME_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = MTD_THEME_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = url;
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
    let cancelled = false;
    // 第 1 层：加载 MTD 组件层 CSS 的 URL，再显式替换唯一 <link> 的 href
    config.loadMtdCssUrl().then((url) => {
      if (!cancelled) applyMtdCssUrl(url);
    });
    // 第 2 层：切换业务 Token 层主题标识，由 tokens.css 的 [data-theme] 规则完成语义层重定向
    applyThemeAttr(theme);
    return () => {
      cancelled = true;
    };
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
