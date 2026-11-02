# D-6 · 漏斗图 (Funnel)

> 📌 **外壳统一**：漏斗也是图表类 L2，共用 `ChartCard` 外壳（见 `DashboardChartCard.md`）。漏斗头部含口径 Radio，用 ChartCard 的 `#header` slot 自定义。

表达逐层递减的转化/流失链路：曝光 → 点击 → 加购 → 下单 → 支付。

## 何时用
- 漏斗 / 转化 / 流失 / 链路 / 转化率。
- 典型落在「营销运营」「增长」类看板。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]                    [绝对值|整体转化|单步转化]              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐        │
│  │              曝光  1,000,000                         │        │
│  └─────────────────────────────────────────────────────┘        │
│     ┌───────────────────────────────────────────┐               │
│     │           点击  320,000                    │               │
│     └───────────────────────────────────────────┘               │
│        ┌─────────────────────────────────┐                      │
│        │        加购  85,000              │                      │
│        └─────────────────────────────────┘                      │
│           ┌───────────────────────┐                             │
│           │     下单  42,000       │                             │
│           └───────────────────────┘                             │
│              ┌─────────────┐                                    │
│              │ 支付 28,000  │                                    │
│              └─────────────┘                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "chart": {
    "height": 300,
    "shape": "funnel (居中对称，逐层收窄)"
  },
  "colors": {
    "palette": "chartPalette().slice(0, 5)",
    "max_layers": "≤6 色",
    "stroke": "#fff",
    "stroke_width": 1
  },
  "labels": {
    "position": "inside",
    "color": "#fff",
    "font_weight": 600
  },
  "header": {
    "caliber_switch": "RadioButton (绝对值/整体转化/单步转化)",
    "size": "small",
    "position": "标题同行右对齐"
  },
  "legend": false,
  "axis": false
}
```

---

## 数据结构

```json
{
  "funnelData": [
    { "stage": "string", "value": "number" }
  ]
}
```

---

## G2 v5 Spec

```js
chart.options({
  type: 'interval',
  data: funnelData,
  encode: { x: 'stage', y: 'value', color: 'stage', shape: 'funnel' },
  transform: [{ type: 'symmetryY' }],
  coordinate: { transform: [{ type: 'transpose' }] },
  scale: { color: { range: chartPalette().slice(0, 5) } },
  axis: false,
  legend: false,
  style: { stroke: '#fff', lineWidth: 1 },
  labels: [{ text: 'stage', position: 'inside', fill: '#fff', fontWeight: 600 }],
});
```

---

## 约束

1. `shape:'funnel'` 写在 **encode**（不是 style）。
2. `coordinate` 是**对象**（`{transform:[...]}`）不是数组。
3. **量级悬殊处理**：各层量级常相差百倍，直接按真实值映射面积尾段会细到不可见。做法：绘图值开方压缩 `Math.sqrt(value)`，标签/tooltip 仍显示真实值。
4. 百分比漏斗：`transform:[{type:'normalizeY'},{type:'symmetryY'}]`（**normalizeY 必须在 symmetryY 之前**，顺序不能反）。
5. 口径切换是真联动——切口径真换标签计算（绝对值/相对首层/相对上一层）。

---

## 变体

### 口径切换
- **绝对值**：标签显示原始数值
- **整体转化**：标签显示相对首层的百分比
- **单步转化**：标签显示相对上一层的百分比

---

## 头部形态变体

D-6 实现了全部 5 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：描述型 / 筛选型 / 筛选（复杂）/ 操作型 / 纯净型。此变体系统与上方「口径切换」是两个独立维度，前者控制头部右侧控件形态，后者控制标签数值的计算口径，二者可正交组合。

---

## 自检
- [ ] shape:'funnel' 在 encode 里
- [ ] coordinate 是对象不是数组
- [ ] 量级悬殊时用 sqrt 压缩绘图值
- [ ] normalizeY 在 symmetryY 之前
- [ ] 口径切换真联动

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard6-funnel.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 口径切换 | `mtd-radio-group` + `mtd-radio-button` | `<Radio.Group>` + `<Radio.Button>` |

图表用 AntV G2 v5。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Radio --target=mtd-vue --quiet
```

## 骨架代码 · Vue3（配合 ChartCard #header slot）

```vue
<template>
  <ChartCard :height="300" :spec="spec" :deps="[caliber]">
    <template #header>
      <div class="dash-title-row">
        <span class="dash-title">营销转化漏斗</span>
        <mtd-radio-group v-model="caliber" size="small">
          <mtd-radio-button value="abs">绝对值</mtd-radio-button>
          <mtd-radio-button value="overall">整体转化</mtd-radio-button>
          <mtd-radio-button value="step">单步转化</mtd-radio-button>
        </mtd-radio-group>
      </div>
    </template>
  </ChartCard>
</template>

<script setup lang="ts">
const caliber = ref('abs')
const spec = () => {
  const drawData = rawData.map(d => ({ ...d, draw: Math.sqrt(d.value) }))
  return {
    type: 'interval',
    data: drawData,
    encode: { x: 'stage', y: 'draw', color: 'stage', shape: 'funnel' },
    transform: [{ type: 'symmetryY' }],
    coordinate: { transform: [{ type: 'transpose' }] },
    scale: { color: { range: chartPalette().slice(0, 5) } },
    axis: false, legend: false,
    style: { stroke: '#fff', lineWidth: 1 },
    labels: [{ text: (d) => formatLabel(d, caliber.value), position: 'inside', fill: '#fff', fontWeight: 600 }],
  }
}
</script>
```

## 踩坑笔记

- `shape:'funnel'` 必须在 `encode` 对象里，不是 `style`。
- `coordinate` 是对象 `{ transform: [...] }`，不是数组 `[{ type: 'transpose' }]`。
- 量级悬殊时 encode.y 用 `Math.sqrt(value)` 的 draw 字段，labels 仍显示真实 value。
- 百分比漏斗 transform 顺序：`[{normalizeY}, {symmetryY}]`，反了会报错。
