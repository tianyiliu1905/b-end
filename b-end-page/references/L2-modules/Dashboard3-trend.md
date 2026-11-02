# D-3 · 折线图/面积图（趋势） (Trend)

> 📌 **外壳统一**：所有图表类 L2 模块都共用同一个外壳 `ChartCard`（标题 + 小筛选 + 图表），见 `DashboardChartCard.md`。D-3 本身只是「`type:'line'/'area'/'view'` 的 spec」。

时间序列趋势：折线 / 面积图 + 时间轴，支持多指标对比、同环比、时间粒度切换。

## 何时用
- 趋势 / 走势 / 同比环比 / 时间序列。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题] [?口径]          [维度▾] [日|周|月]                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│         ╱╲    ╱╲                                                │
│   ─────╱──╲──╱──╲─────────── 指标A                             │
│        ╱    ╲╱    ╲                                             │
│   ────╱──────────────────── 指标B                               │
│                                                                 │
│   ──┬──────┬──────┬──────┬──────┬──                             │
│    1月    2月    3月    4月    5月                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "chart_card": {
    "height": 280,
    "padding": "var(--gap-section)"
  },
  "header": {
    "title_font_size": "var(--fs-16)",
    "title_font_weight": "var(--fw-semibold)",
    "controls": {
      "dimension_switch": "Dropdown（选项多时）",
      "granularity_switch": "RadioButton 平铺（选项少：日/周/月）",
      "tooltip_icon": "question-circle-o + hover"
    }
  },
  "line": {
    "primary_color": "var(--color-brand-primary)",
    "multi_line_palette": "chartPalette().slice(0, 3)",
    "max_lines": "4~5 条",
    "line_width": 2,
    "point_radius": 3
  },
  "axis": {
    "grid_color": "浅灰，弱化",
    "label_font_size": "var(--fs-12)",
    "y_title": false
  },
  "area_variant": {
    "fill_opacity": 0.12,
    "stacked": "transform:[{type:'stackY'}]"
  }
}
```

---

## 数据结构

```json
{
  "trendData": [
    { "date": "string", "value": "number", "type": "string (系列名)" }
  ]
}
```

---

## 约束

1. 折线主色用主蓝，多线用色板（蓝/绿/橙），不超过 4~5 条。
2. 头部维度/粒度切换要**真换数据**——切换后重算喂给图表的 chartData（如维度按系数缩放、周粒度按 N 天聚合求和），不是只改标签。
3. 维度选项多 → Dropdown；时间粒度选项少 → RadioButton 平铺。
4. 口径说明 → info 图标 + Tooltip(hover)。
5. 图表挂载统一走 `useG2Chart`（含 ResizeObserver 自适应兜底）。
6. 网格线浅灰弱化；时间轴标签 12px。

---

## G2 v5 Spec（折线）

```js
chart.options({
  type: 'line',
  data: trendData,           // [{date, value, type}]
  encode: { x: 'date', y: 'value', color: 'type' },
  scale: { color: { range: chartPalette().slice(0, 3) } },
  axis: { y: { title: false } },
});
```

---

## 变体

### 双轴组合图 (DualAxisChart)
两指标量级悬殊需对照趋势时（投放金额 vs ROI），用 view 组合 + 左右双 Y 轴。

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]  [■柱=金额 ■线=ROI]                                      │
├─────────────────────────────────────────────────────────────────┤
│ 万元│  ┌┐  ┌┐  ┌┐  ┌┐  ┌┐  ┌┐         ╱╲         │ROI        │
│     │  ││  ││  ││  ││  ││  ││   ─────╱──╲────    │           │
│     │  ││  ││  ││  ││  ││  ││                     │           │
│     └──┴┴──┴┴──┴┴──┴┴──┴┴──┴┴─────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

- 关键：`type:'view'` + `children:[interval(柱), line+point(线)]`
- 折线 child 加 `scale.y.independent:true` 实现独立右轴
- 柱/线颜色用 `style.fill`/`style.stroke` 固定单色，不走 `encode.color`（多 child 易串色）

---

## 头部形态变体

D-3 实际对应源码中**两个独立子模块**，各自实现的头部形态子集不同（见 `DashboardChartCard.md` 的「头部形态变体」小节）：

- **D-3 折线图**（BrandTrendChart/TrendChart）：操作型 / 筛选型 / 筛选（复杂）/ 描述型 / 纯净型，5 型全实现。
- **D-3 面积图**（AreaChart）：操作型 / 筛选型 / 筛选（复杂）/ 纯净型，缺描述型，共 4 型。

两者共享「D-3」编号前缀，选型时需先确定折线还是面积。

---

## 自检
- [ ] 折线不超过 5 条，颜色取自色板
- [ ] 头部切换是真联动（重算数据），非只改标签
- [ ] 图表通过 ChartCard + useG2Chart 挂载
- [ ] 网格线浅灰弱化
- [ ] 双轴变体：折线 scale.y.independent:true

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard3-trend.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 粒度切换 | `mtd-radio-group` + `mtd-radio-button` | `<Radio.Group>` + `<Radio.Button>` |
| 维度切换 | `mtd-select` / `mtd-dropdown` | `<Select>` / `<Dropdown>` |
| Tabs 多视图 | `mtd-tabs` + `mtd-tab-pane` | `<Tabs>` + `<TabPane>` |

图表用 AntV G2 v5。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Radio,Tabs,Select,Dropdown --target=mtd-vue --quiet
```

## 骨架代码 · Vue3（调用方，配合 ChartCard）

```vue
<template>
  <ChartCard
    :title="title" :tip="currentTip"
    :dimensions="dimensions" v-model:dimension="dimension"
    :granularities="granularities" v-model:granularity="granularity"
    :height="280" :spec="spec" :deps="[chartData]"
  />
</template>

<script setup lang="ts">
import ChartCard from './ChartCard.vue'
const dimension = ref('gmv')
const granularity = ref('day')
// 真联动：筛选变 → 重算 chartData
const chartData = computed(() => /* 按 dimension/granularity 重算 */)
const spec = () => ({
  type: 'line', height: 280, data: chartData.value,
  encode: { x: 'date', y: 'value', color: 'type' },
  scale: { color: { range: chartPalette().slice(0, 3) } },
  axis: { y: { title: false } },
})
</script>
```

## 双轴变体骨架（自定义 #header slot）

```vue
<template>
  <ChartCard :height="300" :spec="spec" :deps="[data]">
    <template #header>
      <div class="dash-title-row">
        <span class="dash-title">投放金额 vs ROI</span>
        <div class="legend">
          <span class="legend-item"><i class="dot blue"></i>金额</span>
          <span class="legend-item"><i class="dot orange"></i>ROI</span>
        </div>
      </div>
    </template>
  </ChartCard>
</template>
```

## 踩坑笔记

- MTD `Tabs` 必须加 `style={{paddingTop:12, width:'100%'}}`。
- 用 mtd-tabs 做多视图切换时，切换机制用 `display:none`（非 v-if），避免图表重复初始化。
- `Radio.Group` 的 `size="small"` 与 ChartCard 头部对齐。
- 头部可封装为 L3 复用组件 `ChartHeader.vue`：props `title/tip/dimensions/dimension/granularities/granularity`，emit 支持 v-model。
