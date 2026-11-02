# D-5 · 双轴组合图 (Combo Chart)

> 📌 图表挂载统一用 `useG2Chart`（含 ResizeObserver 自适应兜底）。

同一图表内用柱状图 + 折线图表达两个量纲不同但相关的指标（如"营业门店数"用柱、"新开门店数"用线，左右各一个 y 轴）。

## 何时用
- 双指标关联 / 存量+增量对比 / 需要在同一时间轴上同时看基数和变化量。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]                                        [筛选/操作]        │
├─────────────────────────────────────────────────────────────────┤
│ 门店数                                                  新开数   │
│  █                                                     ╭╮        │
│  █   █       █                                   ╭─────╯╰─╮     │
│  █   █   █   █   ╭───╮   █   █   █   █   █   █  ╱          ╲    │
│  █   █   █   █  ╱     ╲  █   █   █   █   █   █╱             ╲   │
│ 1月  2月  3月 ...                                        12月    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "chart": {
    "height": 280,
    "type": "view（interval + line 双子层）"
  },
  "bar_series": {
    "fill": "chartPrimary()",
    "fill_opacity": 0.8,
    "y_axis": "left，title 标注单位（如'门店数'）"
  },
  "line_series": {
    "stroke": "chartPalette()[2]",
    "line_width": 2,
    "y_axis": "right，title 标注单位（如'新开数'）"
  },
  "axis": {
    "x": { "label_font_size": 11 },
    "y_left": { "label_font_size": 11, "grid_stroke": "chartAxisDefaults().gridStroke" },
    "y_right": { "position": "right", "label_font_size": 11 }
  }
}
```

---

## 数据结构

```json
{
  "comboData": [
    { "month": "string", "value": "number", "type": "'柱系列名' | '线系列名'" }
  ]
}
```

> 单一数组，靠 `type` 字段区分柱/线两个系列，各自 `filter` 出子数据传给 `view` 的两个 children。

---

## G2 v5 Spec

```js
chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
      data: comboData.filter(d => d.type === '营业门店数'),
      encode: { x: 'month', y: 'value' },
      style: { fill: chartPrimary(), fillOpacity: 0.8 },
      axis: {
        x: { labelFontSize: 11 },
        y: { labelFontSize: 11, gridStroke: chartAxisDefaults().gridStroke, title: '门店数' },
      },
    },
    {
      type: 'line',
      data: comboData.filter(d => d.type === '新开门店数'),
      encode: { x: 'month', y: 'value' },
      style: { stroke: chartPalette()[2], lineWidth: 2 },
      axis: { y: { position: 'right', title: '新开数', labelFontSize: 11 } },
    },
  ],
});
```

---

## 约束

1. 必须用 `type: 'view'` + `children` 数组承载两个子图层，不要试图在单一 `interval`/`line` spec 上叠加双轴（G2 v5 不支持这种写法）。
2. 柱系列颜色用主蓝 `#166FF7`（`fillOpacity: 0.8`），线系列用橙色 `#FF7700` 做强对比，避免同色系混淆。
3. 左轴（柱）和右轴（线）都要标注 `title`，说明各自量纲单位，否则用户会误读双轴关系。
4. 两个系列共享同一个 x 轴（月份/时间），靠 `data.filter` 从统一数据源里拆出各自子集，不要维护两份独立数据。
5. 图例可用 header 区的色块文字代替（如"筛选型"变体里的 Radio.Group 切换维度），不强制用标准 G2 legend。

---

## 头部形态变体

D-5 实现了全部 5 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：筛选型 / 筛选（复杂）/ 操作型 / 描述型 / 纯净型。

---

## 自检
- [ ] 使用 `type:'view'` + `children`，未使用不支持的双轴单层写法
- [ ] 柱、线两个系列颜色区分明显
- [ ] 左右轴都标注了单位 title
- [ ] 两系列数据来自同一数据源的 filter 拆分

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard5-combo.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 筛选切换 | `mtd-radio-group` / `mtd-select` | `<Radio.Group>` / `<Select>` |
| 操作按钮 | `mtd-button` (Vue) | `<Button.Link>` (React) `type="primary"` `shape="text"` |

图表用 AntV G2 v5，通过 `useG2Chart` 挂载。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,RadioGroup,Select,Button --target=mtd-react --quiet
```

## 骨架代码 · React

```tsx
function StoreTrendChart() {
  const containerRef = useG2Chart(() => ({
    type: 'view',
    children: [
      {
        type: 'interval',
        data: storeTrendData.filter(d => d.type === '营业门店数'),
        encode: { x: 'month', y: 'value' },
        style: { fill: chartPrimary(), fillOpacity: 0.8 },
        axis: {
          x: { labelFontSize: 11 },
          y: { labelFontSize: 11, gridStroke: chartAxisDefaults().gridStroke, title: '门店数' },
        },
      },
      {
        type: 'line',
        data: storeTrendData.filter(d => d.type === '新开门店数'),
        encode: { x: 'month', y: 'value' },
        style: { stroke: chartPalette()[2], lineWidth: 2 },
        axis: { y: { position: 'right', title: '新开数', labelFontSize: 11 } },
      },
    ],
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

<Card className="chart-card" header={<div className="card-title-bar"><span>全国开店趋势</span><Radio.Group defaultValue="operating" size="small"><Radio.Button value="operating">营业</Radio.Button><Radio.Button value="newOpen">新开</Radio.Button></Radio.Group></div>}>
  <div className="card-body-area"><StoreTrendChart /></div>
</Card>
```

## 踩坑笔记

- G2 v5 里没有"单层双轴"的写法，双轴组合必须用 `type:'view'` + `children:[interval, line]`，两个子层各自声明自己的 `axis`。
- 右轴通过子层 `axis: { y: { position: 'right' } }` 声明，不是在顶层配置。
- 两个系列的数据源来自同一个数组按 `type` 字段 `filter`，避免维护两份独立请求/状态。
- 若两个系列量纲差异极大（如百万级 vs 个位数），务必分别设置左右轴 `title` 提示单位，否则容易被误读为同一量纲对比。
