# D-10 · 散点图 (Scatter)

> 📌 **外壳统一**：散点图是图表类 L2，共用同一个 `ChartCard` 外壳，见 `DashboardChartCard.md`。

表达双维度数据的相关性/分布：气泡或纯散点，气泡大小可映射第三维数值。

## 何时用
- 相关性 / 分布分析 / 双变量对比。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]                              [区域筛选▾]                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│         ●                                                       │
│    ●         ●●                                                 │
│       ●●           ●                                            │
│              ●                ●                                  │
│                    ●     ●                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
  气泡大小 = 数值，颜色 = 类别
```

---

## 视觉规格 (JSON)

```json
{
  "bubble": {
    "color": "var(--color-brand-primary) 半透明",
    "size_encode": "数值映射气泡大小",
    "legend_position": "right"
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
  "bubbleData": [
    { "x": "number", "y": "number", "size": "number", "category": "string" }
  ]
}
```

---

## G2 v5 Spec

```js
chart.options({
  type: 'point',
  data: bubbleData,
  encode: { x: 'x', y: 'y', size: 'size', color: 'category' },
  scale: { color: { range: chartPalette().slice(0, 5) } },
  style: { fillOpacity: 0.65 },
});
```

---

## 约束

1. 气泡图用 `type:'point'` + `encode.size`，不是 `type:'bubble'`。
2. 气泡颜色主蓝半透明（单类目）或多色色板（多类目，≤7色）。
3. 图例放右侧。

---

## 头部形态变体

D-10 实现了全部 5 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：操作型 / 筛选型 / 筛选（复杂）/ 描述型 / 纯净型。

---

## 自检
- [ ] 使用 `point` type，非虚构的 `bubble` type
- [ ] 类目色 ≤ 7
- [ ] 图例放右侧
- [ ] 通过 ChartCard 挂载

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard10-scatter.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 下拉筛选 | `mtd-select` | `<Select>` |

图表用 AntV G2 v5。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Select --target=mtd-react --quiet
```

## 骨架代码 · React（配合 ChartCard）

```jsx
<ChartCard
  title="相关性分布"
  height={280}
  spec={() => ({
    type: 'point',
    data: bubbleData,
    encode: { x: 'x', y: 'y', size: 'size', color: 'category' },
    scale: { color: { range: chartPalette() } },
    style: { fillOpacity: 0.65 },
  })}
  deps={[bubbleData]}
/>
```

## 踩坑笔记

- 气泡图用 `type:'point'` + `encode.size`，不是 `type:'bubble'`（G2 v5 无此内置类型）。
- 单类目场景可省略 `encode.color`，直接用 `style.fill` 固定主蓝。
