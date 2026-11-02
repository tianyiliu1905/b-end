/**
 * 图表色板 token 读取工具
 *
 * 设计约定（见 src/styles/tokens.css §图表色板）：
 * - 图表颜色不跟随主题切换（蓝/黄）实时变化，但颜色取值必须来自 token 体系，
 *   不能在图表配置里重复硬编码与 token 相同的十六进制值。
 * - 因为 AntV G2 的图表配置是纯 JS 对象字面量，无法直接写 `var(--chart-1)`，
 *   所以在模块加载时通过 getComputedStyle 读取一次 :root 上的 CSS 变量值，
 *   取不到时 fallback 到 tokens.css 里声明的默认值（与其保持完全一致）。
 */

function readVar(name: string, fallback: string): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** 7 色分类色板：--chart-1（主题色联动）→ --chart-7（棕色，固定） */
export const chartPalette = {
  get c1() { return readVar('--chart-1', '#166FF7'); },
  get c2() { return readVar('--chart-2', '#00A854'); },
  get c3() { return readVar('--chart-3', '#FF7700'); },
  get c4() { return readVar('--chart-4', '#00A3A3'); },
  get c5() { return readVar('--chart-5', '#882EFF'); },
  get c6() { return readVar('--chart-6', '#EB2F93'); },
  get c7() { return readVar('--chart-7', '#9E7549'); },
};

/**
 * 单色色阶（用于热力图/渐变类图表），随主题联动。
 * 注意：tokens.css 目前只声明了 Blue-6/5/4/3(--chart-primary-weak)/1 五级，
 * 没有独立的 Blue-2 token，需要 Blue-2 时用 weak 与 lightest 的插值代替，
 * 不再额外发明一个不存在的 token 名。
 */
export const chartMono = {
  get strong() { return readVar('--chart-primary-strong', '#0E65E8'); },   // Blue-6
  get base() { return readVar('--chart-1', '#166FF7'); },                  // Blue-5（主题色）
  get medium() { return readVar('--color-primary-1', '#468DFB'); },        // Blue-4（新语义层 -1 = hover）
  get weak() { return readVar('--chart-primary-weak', '#8FBCFF'); },       // Blue-3（主题联动）
  get lightest() { return readVar('--color-primary-4', '#F0F6FF'); },      // Blue-1（新语义层 -4 = 背景）
};

/** 涨跌色（固定，不随主题变化） */
export const chartTrend = {
  get up() { return readVar('--chart-up', '#FF1F1F'); },
  get down() { return readVar('--chart-down', '#00A854'); },
};

/** 获取 7 色分类色板数组，按 tokens.css 中声明的顺序 */
export function getChartCategoricalPalette(count?: number): string[] {
  const all = [chartPalette.c1, chartPalette.c2, chartPalette.c3, chartPalette.c4, chartPalette.c5, chartPalette.c6, chartPalette.c7];
  return typeof count === 'number' ? all.slice(0, count) : all;
}

/** 获取单色色阶数组（Blue-6 → Blue-1，共 5 级），用于渐变/热力类图表 */
export function getChartMonoScale(): string[] {
  return [chartMono.strong, chartMono.base, chartMono.medium, chartMono.weak, chartMono.lightest];
}
