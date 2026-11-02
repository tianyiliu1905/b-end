# G2 图表基座 · useG2Chart 封装范式（所有图表模块共用）

> 所有 L2 图表模块（D-3 趋势 / D-9 排名条形 / D-6 漏斗 / D-5 双轴组合 等，D-8 堆叠进度条除外）统一通过 `useG2Chart` 封装挂载 G2 v5 实例，**不要在每个组件里各写一套 new Chart / render / destroy**。
>
> - **Vue 项目** → 用 Composition API composable（§A）
> - **React 项目** → 用 React Hook（§B）
>
> 落地实现：`src/composables/useG2Chart.ts`（Vue）或 `src/hooks/useG2Chart.ts`（React）。

---

## 为什么需要 ResizeObserver 兜底（核心踩坑）

`new Chart({ autoFit: true })` 的 `autoFit` **只在 `window resize` 事件时触发重排**。

当容器宽度因「**侧栏折叠/展开**」「父容器布局变化」「Tab 切换显隐」而改变，但 **window 尺寸没变**时，G2 不会重排，图表保持旧尺寸 → 被拉歪 / 留白 / 溢出（典型现象：折叠侧栏后图表没跟着变宽，或条形图轴线错位）。

**解法**：在 `autoFit` 之外，额外用 `ResizeObserver` 监听**容器自身**尺寸变化，防抖后调用 `chart.forceFit()` 强制贴合当前宽高。

> 这是「图表歪掉/不自适应」类问题的根因与标准修复，凡是放在可折叠侧栏布局里的看板图表都要带这个兜底。

---

## §A. Vue 版范式（Composition API · 可整段复制）

```ts
import { onMounted, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { Chart } from '@antv/g2'

/**
 * G2 v5 图表封装（Spec 模式）。
 * 用法：const { containerRef } = useG2Chart(() => spec, [dep1, dep2])
 * - buildSpec 返回 chart.options() 的入参（遵循 antv-g2-chart skill 的 v5 写法）
 * - deps 变化时自动重渲染（维度/粒度/过滤后的数据等）
 */
export function useG2Chart(
  buildSpec: () => Record<string, any>,
  deps: Ref<any>[] = []
) {
  const containerRef = ref<HTMLDivElement | null>(null)
  let chart: Chart | null = null
  let ro: ResizeObserver | null = null
  let fitTimer: ReturnType<typeof setTimeout> | null = null
  let lastW = 0
  let lastH = 0

  const render = () => {
    if (!containerRef.value) return
    if (!chart) chart = new Chart({ container: containerRef.value, autoFit: true })
    chart.options(buildSpec())
    chart.render()
  }

  // 容器尺寸变化 → 防抖后强制贴合（解决侧栏折叠后图表歪掉）
  const handleResize = (w: number, h: number) => {
    if (w <= 0 || h <= 0) return                                  // 隐藏时尺寸为 0，跳过
    if (Math.abs(w - lastW) < 1 && Math.abs(h - lastH) < 1) return // 无有效变化，跳过避免抖动
    lastW = w; lastH = h
    if (fitTimer) clearTimeout(fitTimer)
    fitTimer = setTimeout(() => chart?.forceFit(), 120)           // 防抖 120ms
  }

  onMounted(() => {
    render()
    if (containerRef.value && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect
        if (rect) handleResize(rect.width, rect.height)
      })
      ro.observe(containerRef.value)
    }
  })

  deps.forEach((d) => watch(d, render, { deep: true }))

  onBeforeUnmount(() => {                                         // 必须清理，防泄漏
    if (fitTimer) clearTimeout(fitTimer)
    ro?.disconnect(); ro = null
    chart?.destroy(); chart = null
  })

  return { containerRef }
}
```

### Vue 组件使用示例
```vue
<template>
  <div ref="containerRef" class="chart"></div>
</template>

<script setup lang="ts">
import { useG2Chart } from '@/composables/useG2Chart'
const props = defineProps<{ data: TrendPoint[] }>()
const { containerRef } = useG2Chart(
  () => ({ type: 'line', data: props.data, encode: { x: 'date', y: 'value', color: 'type' } }),
  [toRef(props, 'data')],   // data 变化（如筛选后）自动重渲染
)
</script>

<style scoped>
.chart { width: 100%; height: 280px; }  /* 容器给定高度，宽度交给 autoFit + ResizeObserver */
</style>
```

---

## §B. React 版范式（Hook · 可整段复制）

```tsx
import { useRef, useEffect } from 'react';
import { Chart } from '@antv/g2';

/**
 * G2 v5 图表封装（Spec 模式）— React Hook 版。
 * 用法：const containerRef = useG2Chart(() => spec, [dep1, dep2])
 */
export function useG2Chart(buildSpec: () => Record<string, any>, deps: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = new Chart({ container: containerRef.current, autoFit: true });
    }
    chartRef.current.options(buildSpec());
    chartRef.current.render();

    // ResizeObserver 兜底（侧栏折叠/Tab 切换）
    let fitTimer: ReturnType<typeof setTimeout> | null = null;
    let lastW = 0, lastH = 0;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      if (Math.abs(rect.width - lastW) < 1 && Math.abs(rect.height - lastH) < 1) return;
      lastW = rect.width; lastH = rect.height;
      if (fitTimer) clearTimeout(fitTimer);
      fitTimer = setTimeout(() => chartRef.current?.forceFit(), 120);
    });
    ro.observe(containerRef.current);

    return () => {
      if (fitTimer) clearTimeout(fitTimer);
      ro.disconnect();
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return containerRef;
}
```

### React 组件使用示例
```tsx
import React from 'react';
import { useG2Chart } from '@/hooks/useG2Chart';

interface TrendPoint { date: string; value: number; type: string; }

const TrendChart: React.FC<{ data: TrendPoint[] }> = ({ data }) => {
  const containerRef = useG2Chart(
    () => ({ type: 'line', data, encode: { x: 'date', y: 'value', color: 'type' } }),
    [data],
  );
  return <div ref={containerRef} style={{ width: '100%', height: 280 }} />;
};

export default TrendChart;
```

---

## 图表配色接入 chartTokens.ts（`buildSpec()` 内取色的标准写法）

> G2 是 Canvas 渲染，`scale.color.range` 等配色字段**不能直接写 `var(--chart-1)`**，必须在 `buildSpec()` 执行时（每次渲染都会重新调用）用 `chartTokens.ts` 暴露的 getter 读取运行时 `getComputedStyle` 计算出的十六进制值。完整 token 定义与取值规则见 `style-profile.md` §6，可直接复制的实现见 `references/theme-examples/chartTokens.react.ts`（React 路径 `src/lib/chartTokens.ts`，Vue 路径 `src/composables/chartTokens.ts`）。

**多系列分类色（折线/柱状/饼图等）**：
```tsx
import { getChartCategoricalPalette } from '@/lib/chartTokens';

const containerRef = useG2Chart(
  () => ({
    type: 'line',
    data,
    encode: { x: 'date', y: 'value', color: 'type' },
    scale: { color: { range: getChartCategoricalPalette() } }, // 7 色分类色板，随主题联动
  }),
  [data],
);
```

**单系列图表 + 涨跌语义色**：
```tsx
import { chartMono, chartTrend } from '@/lib/chartTokens';

const containerRef = useG2Chart(
  () => ({
    type: 'interval',
    data,
    encode: { x: 'month', y: 'value' },
    style: { fill: chartMono.base }, // 单系列默认主题色，随主题联动
    // 涨跌类图表另外按数据正负映射 chartTrend.up / chartTrend.down（固定色，不随主题变化）
  }),
  [data],
);
```

**同色系热力图 / 排名渐变色阶**：
```tsx
import { getChartMonoScale } from '@/lib/chartTokens';

const containerRef = useG2Chart(
  () => ({
    type: 'cell',
    data,
    encode: { x: 'hour', y: 'day', color: 'value' },
    scale: { color: { type: 'linear', range: getChartMonoScale() } }, // strong→lightest 5 档
  }),
  [data],
);
```

> ⚠️ `buildSpec` 每次渲染都会重新执行，`chartTokens.ts` 的 getter 内部用 `getComputedStyle(document.documentElement)` 现读，因此主题切换后只要触发一次重渲染（如 `deps` 变化，或额外把 `theme` 状态塞进 `deps`），分类色/单色色阶就会自动取到新主题下的最新色值；涨跌色（`chartTrend.up/.down`）本身固定不随主题变化，无需特殊处理。

---

## G2 v5 图表类型清单 + 特殊数据结构速查

`buildSpec()` 返回的 `type` 决定图表形态。常用类型与「数据结构是否特殊」如下（详细 spec 按图表类型分别见 `L2-modules/Dashboard3-trend.md`、`Dashboard4-bar.md`、`Dashboard5-combo.md`、`Dashboard6-funnel.md`、`Dashboard7-pie-donut.md`、`Dashboard9-rank-bar.md`、`Dashboard10-scatter.md`、`Dashboard12-radar.md`、`Dashboard13-liquid.md`、`Dashboard14-heatmap.md`、`Dashboard15-rose.md`，图表外壳统一见 `DashboardChartCard.md`）：

| 图表 | type | 数据结构 | 关键点 |
|---|---|---|---|
| 折线/多系列折线 | `line` | 扁平数组 | `encode.color` 分系列，`shape:'smooth'` 平滑 |
| 面积 | `area` | 扁平数组 | 常配 `stackY` |
| 柱/堆叠/分组 | `interval` | 扁平数组 | `stackY`/`normalizeY`/`dodgeX` + transpose 横向 |
| 环图/饼图 | `interval` | 扁平数组 | `coordinate:{type:'theta'}` |
| 玫瑰图 | `interval` | 扁平数组 | `coordinate:{type:'polar', innerRadius:0.2}` |
| 双轴组合 | `view` | 扁平数组（按系列 filter） | `children:[interval, line]` 两层子图，非单层双轴 spec |
| 散点/气泡 | `point` | 扁平数组 | `encode.size` 做气泡 |
| 漏斗 | `interval` | 扁平数组 | `symmetryY` + transpose |
| 热力图 | `cell` | 扁平数组 | `encode.color=value` + 顺序色阶（`scale.color.type:'linear'`） |
| 水波球 | `liquid` | 单一比例值（0~1） | `style.contentText` 自定义中心文案 |
| 雷达 | `area` ⚠️ | 扁平数组 | **`coordinate:{type:'polar'}`**，不是 `type:'radar'` 或 `view+children` |
| 矩形树图 | `treemap` ⚠️ | **`{value:{name,children}}`** | color/label 取 `d.data.xxx` |
| 桑基图 | `sankey` ⚠️ | **`{value:{links:[{source,target,value}]}}`** | 节点自动从 links 推导 |
| 词云 | `wordCloud` ⚠️ | 扁平 `{text,value}` | `encode.fontSize:{field,range}` + `layout.spiral` |

> ⚠️ **D-8（堆叠进度条）不在此表中**：它不是 G2 图表，而是手工 flex/div 实现的多阶段进度条，不经过 `useG2Chart`。详见 `L2-modules/Dashboard8-stacked-progress.md`。

> ⚠️ = 数据结构与普通扁平数组不同，是高频踩坑点：
> - **treemap**：`data: { value: { name:'root', children: items } }`；回调里用 `d.data?.name`（不是 `d.name`）。
> - **sankey**：`data: { value: { links } }`，links 元素 `{source, target, value}`，**不要单独传 nodes**。
> - **雷达**：不存在 `type:'radar'`；用 `type:'area'` + `coordinate:{type:'polar'}`，`scale.y` 设 `domainMin/domainMax` 控制刻度范围，`axis.y` 通常 `label:false` 隐藏径向刻度文字。
> - **词云**：字号靠 `encode.fontSize:{field:'value', range:[12,44]}` 映射，不要手动算字号。

---

## 要点 / 约束
- **容器必须有确定高度**（如 `height:280px`），宽度走 `width:100%`；高度塌成 0 时 G2 画不出来。
**不要给图表容器加 `overflow:hidden` 试图“裁掉溢出”**——溢出通常是 spec（边距/留白）问题，遮挡只会掩盖 bug（见 D-4 marginRight 踩坑）。
- deps 用 `toRef(props,'xxx')` / `ref`，数据/维度/粒度变化靠它驱动重渲染，**不要手动 new 第二个 Chart**。
- 卸载务必 `ro.disconnect()` + `chart.destroy()` + 清 timer，避免内存泄漏与幽灵重排。
- `forceFit()` 防抖（~120ms）避免折叠动画过程中频繁重排卡顿。

## 自检
- [ ] 图表通过 `useG2Chart` 挂载，未在组件内各写一套 new Chart/destroy。
- [ ] **带 ResizeObserver 兜底**：折叠/展开侧栏后图表能跟着重排贴合（浏览器实测，不只靠 window resize）。
- [ ] 容器有确定高度、宽度 100%；未用 `overflow:hidden` 遮溢出。
- [ ] deps 正确：数据/维度/粒度变化时图表真重渲染。
- [ ] **Vue**：`onBeforeUnmount` 清理了 ResizeObserver、Chart、timer。
- [ ] **React**：useEffect 返回 cleanup 函数清理了 ResizeObserver、Chart、timer。
- [ ] 使用了正确框架版本的 hook/composable（Vue → `@/composables/useG2Chart`；React → `@/hooks/useG2Chart`）。
