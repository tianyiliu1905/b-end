# D-ChartCard · 图表模块统一外壳（所有数据图表类 L2 的唯一外壳）

> 📌 **核心原则**：所有「数据图表类」L2 模块（趋势 D-3 / 排名 D-9 / 饼环 D-7 / 漏斗 D-6 / 柱状 D-4 / 组合 D-5 / 散点 D-10 / 雷达 D-12 / 热力 D-14 / 玫瑰 D-15…）**都是同一个 L2 模块**——结构恒为「**标题 + 小筛选 + 图表**」，唯一差异是**图表类型**。

---

## 何时用

任何要在卡片里画一块图表的场景：折线、面积、柱、漏斗、双轴组合、气泡散点、环图/饼图……

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题] [?口径]          [维度▾] [粒度切换] [其它筛选]            │  ← 头部
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                    G2 图表画布                                    │  ← 主体
│                    (height: 280px)                               │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "card": {
    "background": "var(--bg-card)",
    "border_radius": "var(--radius-3)",
    "padding": "var(--gap-section)",
    "border": "none",
    "shadow": "none"
  },
  "header": {
    "title": {
      "font_size": "var(--fs-16)",
      "font_weight": "var(--fw-semibold)",
      "color": "var(--text-1)"
    },
    "tooltip_icon": "question-circle-o + hover",
    "controls_position": "标题同行右对齐",
    "dimension_switch": "Dropdown（选项多时）",
    "granularity_switch": "RadioButton 平铺（选项少）",
    "filter_switch": "Select / RadioButton"
  },
  "chart": {
    "default_height": 280,
    "mount": "useG2Chart（含 ResizeObserver 自适应兜底）"
  }
}
```

---

## 架构：外壳与业务分离

```
ChartCard (外壳，唯一)
├── .dash-card 容器
├── 头部（默认 ChartHeader 或 #header slot）
└── 图表挂载点（useG2Chart）

调用方组件 (业务，每种图表一个薄封装)
├── 筛选 ref
├── 筛选→数据 computed 联动
└── spec() → G2 spec
```

- 换图表类型 = 换 spec 里的 `type`
- 调用方不直接 import G2 / 不自己 new Chart

---

## 头部形态变体（5 型，跨 D-2~D-15 通用）

> 📌 这是**外壳级别**的变体系统，与「换图表类型」正交：无论 D-N 是哪种图表，头部右侧的控件形态都从下面 5 种里选（不是每个模块都要 5 种全上，通常挑 3~5 种）。源码里每个 D-N 的 `ModuleWrapper` 都直接把这 5 种当作 `variants` 数组的 `name`。

| 变体 name | 头部右侧内容 | 典型控件 | 何时用 |
|---|---|---|---|
| `操作型` | 一个文字链接 | `<Button.Link type="primary" shape="text">详情/设置/全部</Button.Link>` | 卡片需要跳转到详情页/二级配置 |
| `筛选型` | 一个简单二/三态切换 | `<Radio.Group size="small"><Radio.Button/>…</Radio.Group>` | 维度只有 2~3 个选项（如 日/周/月、年度/季度） |
| `筛选（复杂）` | 一个下拉选择 | `<Select size="small" style={{width:110~140}}>` 4 个以上 `Option` | 维度选项 ≥4 个（业务线/区域/指标类型等） |
| `描述型` | 一段静态说明文字 | `<span style={{fontSize:'var(--fs-12)', color:'var(--text-3)'}}>环比 +12.3%/目标 3000 家</span>` | 只需要补充只读的口径/目标值，不需要交互 |
| `纯净型` | 无任何头部控件 | 仅 `<span>标题</span>` | 卡片信息已足够自解释，无需筛选/跳转 |

**通用骨架**（每个变体都复用同一个 `chart-card` + `card-title-bar` + `card-body-area` 外壳，唯一差异是 `card-title-bar` 里第二个 `<span>`/控件）：

```jsx
<Card className="chart-card" style={{ marginBottom: 0, height: '100%' }}
  header={
    <div className="card-title-bar">
      <span>{title}</span>
      {/* 这里替换成 5 型之一，或留空 = 纯净型 */}
    </div>
  }>
  <div className="card-body-area"><ChartComponent /></div>
</Card>
```

**选型与收录规则**：
1. 不是所有模块都要收录全部 5 型——实际项目里常见 4~5 型组合，具体以各 D-N.md 文件「变体」小节标注的清单为准。
2. 若同一 `moduleId` 数字前缀被两个视觉/数据完全不同的组件复用（如 `D-2 环形进度` 与 `D-2 进度指标`，`D-3 折线图` 与 `D-3 面积图`），两者各自独立维护一套 5 型子集，互不共享 `render`，仅共享外壳与变体命名词汇表。
3. 新增 D-N 图表时，头部控件形态直接从这 5 型里选，不要发明新词汇；确需新形态时先来这张表补充，而不是散落到各 D-N 文件里各写各的。

---

## 对外接口

```json
{
  "props": {
    "title": "string? (卡片标题)",
    "tip": "string? (口径说明 Tooltip)",
    "height": "number (图表高度 px，默认 280)",
    "spec": "() => G2Spec (必传，图表配置函数)",
    "deps": "Ref[] (重渲染依赖，变化触发重渲)",
    "dimensions": "Option[]? (维度切换选项)",
    "dimension": "string? (当前维度，v-model)",
    "granularities": "Option[]? (时间粒度选项)",
    "granularity": "string? (当前粒度，v-model)",
    "filters": "Option[]? (其它小筛选选项)",
    "filter": "string? (当前筛选值，v-model)"
  },
  "emits": ["update:dimension", "update:granularity", "update:filter"],
  "slots": {
    "header": "复杂头部自定义（双轴双色图例 / 漏斗口径 Radio）"
  }
}
```

---

## 图表色板规范（对齐 `style-profile.md` 文首【1】色彩规范文档）

### 分类色板（多系列区分）

按优先级取色，不超过 7 种：

| 序号 | Token 名 | 色值 | 对应官方色名 |
|------|----------|------|-------------|
| 1 | `--chart-1` | `#166FF7` | 工具蓝（主色） |
| 2 | `--chart-2` | `#00A854` | 绿色 |
| 3 | `--chart-3` | `#FF7700` | 橙色 |
| 4 | `--chart-4` | `#00A3A3` | 蓝绿色 |
| 5 | `--chart-5` | `#882EFF` | 紫色 |
| 6 | `--chart-6` | `#EB2F93` | 粉色 |
| 7 | `--chart-7` | `#9E7549` | 棕色 |

### 同色系单色色阶（排名/渐变/热力图）

> ⚠️ 本表曾错误地列举过一套不存在的 `--chart-blue-1..6` 独立 token（包括臆想中的 `--chart-blue-2: #BFD8FE`）——实际 tokens.css 里并没有这一套独立变量。真实可用的是 `chartTokens.ts`（React: `src/lib/chartTokens.ts`，Vue: `src/composables/chartTokens.ts`）导出的 `chartMono` getter 对象，共 5 个档位（没有独立的 Blue-2 中间档）：

| 获取方式 | 对应 CSS 变量 | 默认值（工具蓝主题） | 说明 |
|----------|-------------|-----------------|------|
| `chartMono.strong` | `--chart-primary-strong` | `#0E65E8`（= `--color-primary-2`，active 色阶） | 最深，强对比/高亮 |
| `chartMono.base` | `--chart-1` | `#166FF7`（= `--color-brand-primary`） | 基准主色 |
| `chartMono.medium` | `--color-primary-1` | `#468DFB`（hover 色阶） | 中间色 |
| `chartMono.weak` | `--chart-primary-weak` | `#8FBCFF`（= `--color-primary-5`，备用色阶） | 浅色 |
| `chartMono.lightest` | `--color-primary-4` | `#F0F6FF`（浅色背景色阶） | 最浅，背景级 |

> ⚠️ 上表中 `--color-primary-N` 的编号不是按深浅排列的，取用时以 `chartMono.*` 的语义（strong/medium/weak/lightest）为准，详见 `theme-system.md` §0.1。

以上所有值都会随主题（工具蓝/美团黄）实时联动，不要在代码里硬编码中间色值。完整实现参考 `references/theme-examples/chartTokens.react.ts`。

### 涨跌色

| 获取方式 | 对应 CSS 变量 | 色值（固定，不随主题变化） | 用途 |
|----------|-------------|------|------|
| `chartTrend.up` | `--chart-up` | `#FF1F1F` | 正向涨幅 |
| `chartTrend.down` | `--chart-down` | `#00A854` | 负向跌幅 |

### ⚠️ 使用约束

1. **禁止自行插值**：不要自造中间色（如 `#6DA3FC`、`#A8CDFF`），一律通过 `chartPalette`/`chartMono`/`chartTrend` 读取标准值。
2. **AntV G2 不支持 CSS 变量**：G2 是 Canvas 渲染，`scale.color.range` 必须传十六进制字符串数组，不能写 `var(--chart-1)`；正确用法是先通过 `chartPalette.c1` 等 getter 在运行时调用 `getComputedStyle` 读到实际十六进制值，再传给 G2 spec。
3. **默认首选主题色**：单系列图表默认用 `chartMono.base`（`#166FF7`）；需要渐变色阶时用 `getChartMonoScale()`（strong→lightest 共 5 档）。
4. **涨跌色不可互换**：上涨/正向恒用 `chartTrend.up`（红色 `#FF1F1F`），下跌/负向恒用 `chartTrend.down`（绿色 `#00A854`），两者固定不随主题变化。

---

## 约束

1. 新增图表诉求时，先确认是否就是 ChartCard（卡片+头部+一块画布），是则复用外壳，只写 spec+联动。
2. 调用方不直接 `import G2` / 不自己 `new Chart`，图表接线一律走 ChartCard 内的 useG2Chart。
3. 筛选是「真联动」：切换后重算喂给 G2 的数据（放进 deps），不是只改标签。
4. 复杂头部（双轴/漏斗）用 `#header` slot，简单头部用默认 ChartHeader props。
5. `height` 与 `spec` 内 `height` 一致。
6. 头部渲染规则：有 title/tip 或任一筛选项数组非空时才渲默认 ChartHeader；用 #header slot 时完全自定义。
7. **图表在卡片内垂直居中（等高行必做）**：当图表卡片位于 `Row type="flex"` 等高行中时，卡片会被 stretch 撑高。图表区域（canvas）必须在撑高后的卡片内垂直+水平居中，不能贴顶留大片底部空白。

   **结构拆分**：卡片内容分为两部分——**标题区**（固定高度）+ **图表区**（`flex:1` 撑满剩余空间）。canvas 在图表区内居中。

   **⚠️ MTD Card body 穿透（关键）**：MTD `Card` 组件内部有 `.mtd-prime-card-body` wrapper，直接在 Card 上加 `display:flex` 无法穿透到 children。**必须通过全局 CSS 让 card-body 也成为 flex column**：
```css
/* tokens.css — 等高行内 Card body 穿透
   ⚠️ 必须同时覆盖 .mtd-prime-row 和 .mtd-prime-row-flex 两个选择器！
   MTD Row 不传 type="flex" 时渲染 .mtd-prime-row（无 -flex 后缀），
   只写 .mtd-prime-row-flex 会导致等高规则静默失效。 */
.mtd-prime-row > [class*='mtd-prime-col'] > .mtd-prime-card,
.mtd-prime-row-flex > [class*='mtd-prime-col'] > .mtd-prime-card {
flex: 1;
display: flex;
flex-direction: column;
}
.mtd-prime-row > [class*='mtd-prime-col'] > .mtd-prime-card > .mtd-prime-card-body,
.mtd-prime-row-flex > [class*='mtd-prime-col'] > .mtd-prime-card > .mtd-prime-card-body {
flex: 1;
display: flex;
flex-direction: column;
min-height: 0;
}
   ```
   有了这层 CSS 保障，Card 内容中的 `flex: 1` 图表容器才能正确撑满并居中。

   **图表区实现**：
   - 图表容器（标题下方）加 `flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%`
   - 图表组件本身保持 `width: 100%`，高度由 spec 控制（如 `height: 240px`）
   - `min-height: 0` 防止 flex item 被内容撑开超出容器

**React 骨架代码（图表居中范式）**：

> ⚠️ 卡片内部嵌套结构：**标题区（`.card-title-bar`）** 和 **图表区（`.card-body-area`）** 是同级兄弟，二者都在 `.mtd-prime-card-body` 内部。Card 上只需 `height: 100%`，其余 flex 布局由 tokens.css 全局规则驱动。

```jsx
<Card style={{ marginBottom: 0, height: '100%' }}>
  {/* 标题区：固定高度，不参与 flex 拉伸 */}
  <div className="card-title-bar">
    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>标题</span>
    {/* 右侧筛选/按钮 */}
  </div>
  {/* 图表区：flex:1 撑满剩余高度，canvas 在内垂直+水平居中 */}
  <div className="card-body-area">
    <ChartComponent /> {/* 内部有固定 height，如 height:240px */}
  </div>
</Card>
```

**工具类定义（tokens.css 已内置）**：
```css
.card-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}
.card-body-area {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
```

> 对于纵向排列的内容（如进度条列表+图例），在 `.card-body-area` 上额外加 `style={{ flexDirection: 'column', justifyContent: 'center' }}` 覆盖默认居中行为。

---

## 已收录的图表类型

| 图表 | type | 头部方式 | 所属模块 |
|------|------|---------|---------|
| 折线趋势 | `line` | 默认头：维度+粒度 | D-3 |
| 面积趋势 | `area` | 默认头：时间范围 | D-3 |
| 双轴组合 | `view`(柱+线) | #header：双色图例 | D-5 |
| 环图/饼图 | `interval`+theta | 默认头：阈值 | D-7 |
| 气泡散点 | `point` | 默认头：区域筛选 | D-10 |
| 漏斗 | `interval`+funnel+symmetryY | #header：口径 Radio | D-6 |
| 横向排名条形 | `interval`+transpose | — | D-9 |
| 竖向柱状/分组柱 | `interval`(+dodgeX/transpose) | 默认头：竖向/横向 | D-4 |
| 玫瑰图 | `interval`+polar | 默认头：原序/降序 | D-15 |
| 雷达图 | `area`+polar | 无筛选 | D-12 |
| 热力图 | `cell` | 默认头：显示/隐藏数值 | D-14 |
| 水波球 | `liquid` | 无筛选 | D-13 |
| 矩形树图 | `treemap` | 无筛选 | 自由组合（暂无独立 D 编号，可挂 D-4/D-7 语境） |
| 桑基图 | `sankey` | 无筛选 | 自由组合（暂无独立 D 编号） |
| 词云 | `wordCloud` | 无筛选 | 自由组合（暂无独立 D 编号） |

> ⚠️ **D-8（堆叠进度条）不在本表中**：它不是 G2 图表，而是手工 flex/div 实现的多阶段进度条组件，不经过 ChartCard/`useG2Chart`。详见 `Dashboard8-stacked-progress.md`。若需要真正的 G2 堆叠柱图（`interval`+`stackY`），归入 D-4 柱状图的堆叠变体。

---

## 自检
- [ ] 新增图表先确认是 ChartCard，不另造外壳
- [ ] 调用方不直接 import G2
- [ ] 筛选是真联动（重算数据）
- [ ] 复杂头部用 #header slot
- [ ] height 与 spec 内 height 一致

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `DashboardChartCard.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 维度切换 | `mtd-dropdown` | `<Dropdown>` |
| 粒度切换 | `mtd-radio-group` + `mtd-radio-button` | `<Radio.Group>` + `<Radio.Button>` |
| 口径提示 | `mtd-tooltip` | `<Tooltip>` |
| 图标 | `<i class="mtdicon mtdicon-question-circle-o">` | `<Icon type="question-circle-o">` |

图表用 AntV G2 v5，通过 `useG2Chart` composable 统一挂载。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Dropdown,Radio,Tooltip,Icon --target=mtd-vue --quiet
```

## ChartCard 外壳骨架 · Vue3

```vue
<template>
  <div class="dash-card chart-card">
    <!-- 头部：默认 ChartHeader 或 #header slot -->
    <slot name="header">
      <ChartHeader
        v-if="title || tip || dimensions || granularities || filters"
        :title="title" :tip="tip"
        :dimensions="dimensions" :dimension="dimension"
        :granularities="granularities" :granularity="granularity"
        :filters="filters" :filter="filter"
        @update:dimension="$emit('update:dimension', $event)"
        @update:granularity="$emit('update:granularity', $event)"
        @update:filter="$emit('update:filter', $event)"
      />
    </slot>
    <!-- 图表挂载点 -->
    <div ref="chartRef" class="chart" :style="{ height: height + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useG2Chart } from '../composables/useG2Chart'
import ChartHeader from './ChartHeader.vue'

const props = defineProps<{
  title?: string; tip?: string; height?: number
  spec: () => Record<string, any>; deps?: any[]
  dimensions?: Option[]; dimension?: string
  granularities?: Option[]; granularity?: string
  filters?: Option[]; filter?: string
}>()

const chartRef = ref<HTMLElement>()
useG2Chart(chartRef, props.spec, props.deps ?? [])
</script>
```

## 调用方骨架（用法 A：默认头）

```vue
<template>
  <ChartCard
    :title="title" :tip="currentTip"
    :dimensions="dimensions" v-model:dimension="dimension"
    :granularities="granularities" v-model:granularity="granularity"
    :height="280" :spec="spec" :deps="[chartData]"
  />
</template>
```

## 调用方骨架（用法 B：自定义 #header）

```vue
<template>
  <ChartCard :height="300" :spec="spec" :deps="[caliber]">
    <template #header>
      <div class="dash-title-row">
        <span class="dash-title">营销转化漏斗</span>
        <mtd-radio-group v-model="caliber" size="small">
          <mtd-radio-button value="abs">绝对值</mtd-radio-button>
          <mtd-radio-button value="overall">整体转化</mtd-radio-button>
        </mtd-radio-group>
      </div>
    </template>
  </ChartCard>
</template>
```

## 踩坑笔记

- ChartHeader 可封装为 L3 复用组件：props `title/tip/dimensions/dimension/granularities/granularity`，emit 支持 v-model。
- `useG2Chart` 内部含 ResizeObserver，侧栏折叠后图表自动重绘，调用方无需处理。
- `deps` 一般放参与联动的 computed ref（如 `chartData`），变化触发 chart.render()。
- MTD `Tabs` 做多视图切换时用 `display:none`（非 v-if），避免图表重复初始化。
