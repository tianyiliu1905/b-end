# D-4 · 柱状图 (Bar Chart)

> 📌 图表挂载统一用 `useG2Chart`（含 ResizeObserver 自适应兜底）。

竖向柱状图，表达分类维度上的数值分布/对比（如区域分布、分类销量）。

## 何时用
- 分类对比 / 区域分布 / 达成率 / 数量分布（无需排名、无需横向展示时优先用竖向柱）。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]                                        [筛选/操作]        │
├─────────────────────────────────────────────────────────────────┤
│   █                                                              │
│   █       █                                                     │
│   █       █      █                                              │
│   █       █      █      █      █      █      █                 │
│  华北    华东    华南   西南   西北   东北   华中               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "chart": {
    "height": 280,
    "type": "interval（竖向柱）"
  },
  "bar": {
    "color_mode": "按分类着色（每个柱不同色）或单色系分类",
    "palette": "[...chartPrimaryRamp(), chartPalette()[1], chartPalette()[2]]"
  },
  "axis": {
    "x": { "label_font_size": 11 },
    "y": { "label_font_size": 11, "grid_stroke": "chartAxisDefaults().gridStroke" }
  },
  "legend": "false（分类已在 x 轴标注时不需要图例）"
}
```

---

## 数据结构

```json
{
  "barData": [
    { "region": "string", "value": "number" }
  ]
}
```

---

## G2 v5 Spec

```js
chart.options({
  type: 'interval',
  data: regionDistData,
  encode: { x: 'region', y: 'value', color: 'region' },
  scale: { color: { range: [...chartPrimaryRamp(), chartPalette()[1], chartPalette()[2]] } },
  axis: {
    x: { labelFontSize: 11 },
    y: { labelFontSize: 11, gridStroke: chartAxisDefaults().gridStroke },
  },
  legend: false,
});
```

---

## 约束

1. 每个分类一个颜色（`encode.color` 绑定分类字段），配色从 `chartPalette()` 取，不超过 7~8 类。
2. 分类已在 x 轴标注时 `legend: false`，避免重复信息。
3. y 轴网格线用低透明度灰 `rgba(17,25,37,.06)`，不用实色网格。
4. 竖向柱状图不需要 `coordinate.transform transpose`；需要横向排名时用 D-9（排名条形图）而非本模块加 transpose。
5. 分组柱（同一分类下多系列并列）属于本模块变体，用 `transform: [{ type: 'dodgeX' }]`，横向分组柱再叠加 `coordinate: { transform: [{ type: 'transpose' }] }`。

---

## 头部形态变体

D-4 实现了 4 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：筛选型 / 筛选（复杂）/ 操作型 / 纯净型，缺描述型。

---

## 自检
- [ ] 柱子配色数量与分类数匹配，未超出色板
- [ ] 有明确分类轴标签时未重复显示图例
- [ ] y 轴网格线为低透明度灰
- [ ] 未与 D-9（排名条形图）混淆使用场景

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard4-bar.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 筛选切换 | `mtd-radio-group` / `mtd-select` | `<Radio.Group>` / `<Select>` |
| 操作按钮 | `mtd-button` (Vue) | `<Button.Link>` (React) `type="primary"` `shape="text"` |

图表用 AntV G2 v5，通过 ChartCard/`useG2Chart` 统一挂载。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,RadioGroup,Select,Button --target=mtd-react --quiet
```

## 骨架代码 · React

```tsx
function RegionBarChart() {
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: regionDistData,
    encode: { x: 'region', y: 'value', color: 'region' },
    scale: { color: { range: [...chartPrimaryRamp(), chartPalette()[1], chartPalette()[2]] } },
    axis: {
      x: { labelFontSize: 11 },
      y: { labelFontSize: 11, gridStroke: chartAxisDefaults().gridStroke },
    },
    legend: false,
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

<Card className="chart-card" header={<div className="card-title-bar"><span>区域分布</span><Radio.Group defaultValue="stores" size="small"><Radio.Button value="stores">营业门店</Radio.Button><Radio.Button value="revenue">营收</Radio.Button></Radio.Group></div>}>
  <div className="card-body-area"><RegionBarChart /></div>
</Card>
```

## 踩坑笔记

- 分组柱横向展示时用 `coordinate: { transform: [{ type: 'transpose' }] }`，与竖向分组柱共用同一份 `dodgeX` transform。
- 需要排名/TOP 榜单时优先用 D-9（排名条形图），不要在本模块里叠加排序+横向变成排名条形图的语义。
- `encode.color` 绑定分类字段而非固定色，才能让图例/自动配色生效。
