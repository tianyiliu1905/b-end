/**
 * 图表色板 token 读取工具（React / Vue 通用逻辑，纯 TS，无框架依赖）
 *
 * 用途：为 AntV G2 等 Canvas 图表提供与 tokens.css 完全一致的色值，
 * 避免在图表 spec 里重复硬编码与 token 相同的十六进制字面量。
 * 完整说明见 references/style-profile.md §6，本文件是可直接复制使用的独立工具文件。
 *
 * 设计约定：
 * - 图表颜色不跟随主题切换（蓝/黄）实时变化（`chartPalette.c1`/`chartMono.strong`/
 *   `chartMono.weak` 例外，这三者随主题联动，因为它们绑定的是 `--chart-1`/
 *   `--chart-primary-strong`/`--chart-primary-weak`），但颜色取值必须来自 token 体系。
 * - 因为 AntV G2 的图表配置是纯 JS 对象字面量，无法直接写 `var(--chart-1)`，
 *   所以在访问时通过 getComputedStyle 读取一次 :root 上的 CSS 变量值，
 *   取不到时 fallback 到 tokens.css 里声明的默认值（与其保持完全一致）。
 *
 * 使用方式：
 *   React 项目 → 放入 src/lib/chartTokens.ts
 *   Vue 项目   → 放入 src/composables/chartTokens.ts（无需响应式包装，
 *                这些值只在图表重渲染时读取一次，不需要响应式追踪）
 */

function readVar(name: string, fallback: string): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** 7 色分类色板：--chart-1（主题色联动）→ --chart-7（棕色，固定），不含黄色 */
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
 *
 * ⚠️ 注意 --color-primary-N 的编号语义（来自官方 _base_color.scss，**不是**按深浅递增）：
 *   -1 = hover态（Blue-4）、-2 = active 态（Blue-6）、-3 = disabled（Blue-2）、
 *   -4 = 浅色背景（Blue-1）、-5 = 备用（Blue-3）。
 * 因此下方 medium 取 --color-primary-1（Blue-4 中间色）、
 * lightest 取 --color-primary-4（Blue-1 最浅），编号看上去“反”但语义是对的。
 *
 * tokens.css 目前声明的五级单色色阶：Blue-6 → Blue-5 → Blue-4 → Blue-3 → Blue-1。
 * 需要更细粒度（如 Blue-2）时在 weak 与 lightest 之间插值，不要发明新 token 名。
 */
export const chartMono = {
  get strong() { return readVar('--chart-primary-strong', '#0E65E8'); },   // Blue-6
  get base() { return readVar('--chart-1', '#166FF7'); },                  // Blue-5（主题色）
  get medium() { return readVar('--color-primary-1', '#468DFB'); },        // Blue-4（语义层 -1 = hover 色阶）
  get weak() { return readVar('--chart-primary-weak', '#8FBCFF'); },       // Blue-3（主题联动）
  get lightest() { return readVar('--color-primary-4', '#F0F6FF'); },      // Blue-1（语义层 -4 = 浅色背景）
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

// ---------------------------------------------------------------------------
// 使用示例（仅供参考，接入时按需删除）
// ---------------------------------------------------------------------------

/**
 * // 多系列分类图（如折线图 encode.color 分系列）
 * import { getChartCategoricalPalette } from '@/lib/chartTokens';
 *
 * const spec = {
 *   type: 'line',
 *   data,
 *   encode: { x: 'date', y: 'value', color: 'type' },
 *   scale: { color: { range: getChartCategoricalPalette() } },
 * };
 *
 * // 单系列图表默认色 / 涨跌语义色
 * import { chartPalette, chartTrend } from '@/lib/chartTokens';
 *
 * const barSpec = { type: 'interval', encode: { color: () => chartPalette.c1 } };
 * const deltaColor = value >= 0 ? chartTrend.up : chartTrend.down;
 *
 * // 热力图 / 排名条形图单色渐变
 * import { getChartMonoScale } from '@/lib/chartTokens';
 *
 * const heatmapSpec = { type: 'cell', scale: { color: { type: 'linear', range: getChartMonoScale() } } };
 */
