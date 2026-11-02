# D-7 · 饼图 / 环图 (Pie / Donut)

> 📌 **外壳统一**：饼图/环图是图表类 L2，共用同一个 `ChartCard` 外壳，见 `DashboardChartCard.md`。

表达类目维度的构成占比：饼图或环形图 + 图例。

## 何时用
- 占比 / 构成 / 饼图 / 环图。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]                              [阈值筛选▾]                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              ╭──────────╮                                       │
│            ╱              ╲         ■ 类目A  35%                │
│          │    总计          │       ■ 类目B  28%                │
│          │    1,234         │       ■ 类目C  20%                │
│            ╲              ╱         ■ 类目D  12%                │
│              ╰──────────╯           ■ 其他    5%                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "donut": {
    "inner_radius": 0.6,
    "palette": ["#166FF7", "#00A854", "#FF7700", "#FF1F1F", "#882EFF"],
    "max_categories": "6~7 色",
    "center_text": "总数",
    "label_position": "outside",
    "legend_position": "right",
    "legend_chart_gap": 16
  },
  "chart_card": {
    "height": 280
  }
}
```

---

## 数据结构

```json
{
  "pieData": [
    { "type": "string (类目名)", "value": "number" }
  ]
}
```

---

## G2 v5 Spec（环图）

```js
chart.options({
  type: 'interval',
  data: pieData,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', innerRadius: 0.6 },
  scale: { color: { range: chartPalette() } },
  labels: [{ text: 'value', position: 'outside' }],
});
```

纯饼图（无环心）去掉 `innerRadius` 即可；`innerRadius: 0` 或省略。

---

## 约束

1. 配色用多色色板，类别不超过 6~7 色。
2. 环图中心放总数（纯饼图无此项）。
3. 图例放右侧，与图表区块间距 16px。
4. 小于阈值的项可合并为「其他」（小筛选控制阈值）。

---

## 头部形态变体

D-7 实现了全部 5 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：操作型 / 筛选型 / 筛选（复杂）/ 描述型 / 纯净型。

---

## 自检
- [ ] 环图 innerRadius=0.6，中心有总数
- [ ] 类目色 ≤ 7
- [ ] 图例放右侧
- [ ] 通过 ChartCard 挂载

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard7-pie-donut.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 栅格 | `mtd-row` / `mtd-col` | `<Row>` / `<Col>` |
| 标签 | `mtd-tag` | `<Tag>` |

图表用 AntV G2 v5。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Row,Col,Tag --target=mtd-react --quiet
```

## 骨架代码 · Vue3（环图，配合 ChartCard）

```vue
<template>
  <ChartCard
    title="类目占比"
    :height="280"
    :spec="spec"
    :deps="[chartData]"
    :filters="thresholdOptions"
    v-model:filter="threshold"
  />
</template>

<script setup lang="ts">
const threshold = ref(5)
const chartData = computed(() => {
  const main = rawData.filter(d => d.value >= threshold.value)
  const otherSum = rawData.filter(d => d.value < threshold.value).reduce((s, d) => s + d.value, 0)
  return otherSum > 0 ? [...main, { type: '其他', value: otherSum }] : main
})
const spec = () => ({
  type: 'interval',
  data: chartData.value,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', innerRadius: 0.6 },
  scale: { color: { range: chartPalette() } },
  labels: [{ text: 'value', position: 'outside' }],
})
</script>
```

## 踩坑笔记

- 环图的 `coordinate` 是对象 `{ type: 'theta', innerRadius: 0.6 }`，不是数组。
- 纯饼图去掉 `innerRadius`（或设为 0）即可，其余 spec 不变。
