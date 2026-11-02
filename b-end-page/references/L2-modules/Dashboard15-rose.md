# D-15 · 玫瑰图 (Rose / Nightingale Chart)

> 📌 图表挂载统一用 `useG2Chart`（含 ResizeObserver 自适应兜底）。

极坐标下的分类占比图，用扇形半径长短表达数值大小（区别于普通饼图用扇形角度表达占比），适合多类目占比+数值双维展示。

## 何时用
- 多类目占比 + 数值双维 / 品牌分布 / 需要比饼图更强调"数值大小差异"的可视化时。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────┐
│ [标题]                                                   │
├─────────────────────────────────────────────────────────┤
│                    ╭───╮                                │
│                ╱───┤680├───╲                             │
│            ╱───┤520├   ├───╲                            │
│        ╱───┤380├         ├───╲                          │
│       │  290 │             │ 240 │                       │
│        ╲───┤160├         ├───╱                          │
│                                                           │
│  ● 富王茶泰 ● 奈雪的茶 ● 茶沐青 ● 瑞幸咖啡 ● 星巴克 ● 蜜雪冰城 │
└─────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "chart": {
    "height": 280,
    "type": "interval + coordinate:polar"
  },
  "coordinate": {
    "type": "polar",
    "inner_radius": 0.2
  },
  "palette": "chartPalette().slice(0, 6)",
  "axis": { "x": false, "y": false },
  "legend": { "color": { "position": "bottom" } },
  "labels": [{ "text": "value", "position": "outside", "font_size": 11 }]
}
```

---

## 数据结构

```json
{
  "roseData": [
    { "brand": "string", "value": "number" }
  ]
}
```

---

## G2 v5 Spec

```js
chart.options({
  type: 'interval',
  data: roseData,
  encode: { x: 'brand', y: 'value', color: 'brand' },
  coordinate: { type: 'polar', innerRadius: 0.2 },
  scale: { color: { range: chartPalette().slice(0, 6) } },
  axis: { x: false, y: false },
  legend: { color: { position: 'bottom' } },
  labels: [{ text: 'value', position: 'outside', fontSize: 11 }],
});
```

---

## 约束

1. 用 `type: 'interval'` + `coordinate: { type: 'polar', innerRadius: 0.2 }`，`innerRadius` 留出中心空洞避免所有扇形挤到圆心。
2. `axis.x/y` 均设为 `false`——玫瑰图不需要显示坐标轴刻度，分类信息通过图例和外部数值标签传达。
3. 数值标签放在扇形外侧（`position: 'outside'`），避免小扇区的数字被压缩不可读。
4. 类目数量建议控制在 6~8 个以内，超过此数需要用阈值合并"其他"类目（参考 D-7 饼图/环图的阈值筛选做法）。
5. 与饼图/环图（D-7）的核心区别：玫瑰图用半径表达数值大小（各扇形角度相等，半径不同），饼图/环图用角度表达占比（半径相等，角度不同）——不要混淆两者的数据语义。

---

## 头部形态变体

D-15 实现了 4 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：纯净型 / 筛选型 / 筛选（复杂）/ 操作型，缺描述型。

---

## 自检
- [ ] 使用 `interval` + `polar` 坐标系而非 `theta`（theta 是饼图/环图用法）
- [ ] 坐标轴已隐藏，标签放置在扇形外侧
- [ ] 类目数量在可辨识范围内（≤ 8 个）
- [ ] 未与 D-7 饼图/环图的数据语义混淆

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard15-rose.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |

图表用 AntV G2 v5，通过 `useG2Chart` 挂载。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card --target=mtd-react --quiet
```

## 骨架代码 · React

```tsx
function RoseChart() {
  const containerRef = useG2Chart(() => ({
    type: 'interval',
    data: roseData,
    encode: { x: 'brand', y: 'value', color: 'brand' },
    coordinate: { type: 'polar', innerRadius: 0.2 },
    scale: { color: { range: chartPalette().slice(0, 6) } },
    axis: { x: false, y: false },
    legend: { color: { position: 'bottom' } },
    labels: [{ text: 'value', position: 'outside', fontSize: 11 }],
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

<Card className="chart-card" header={<div className="card-title-bar"><span>品牌门店分布</span></div>}>
  <div className="card-body-area"><RoseChart /></div>
</Card>
```

## 踩坑笔记

- `coordinate: { type: 'polar', innerRadius: 0.2 }` 中 `innerRadius` 是留白比例（0~1），不是绝对像素值。
- 玫瑰图与环图（D-7）容易混淆：玫瑰图坐标系是 `polar`（半径表大小），环图是 `theta`（角度表占比）——两者 `coordinate.type` 不同，不能互换。
- 标签 `position: 'outside'` 在数值差异很大时可能重叠，必要时可只显示 TOP N 类目 + "其他"合并。
