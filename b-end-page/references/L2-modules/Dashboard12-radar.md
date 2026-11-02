# D-12 · 雷达图 (Radar Chart)

> 📌 图表挂载统一用 `useG2Chart`（含 ResizeObserver 自适应兜底）。

多维度能力/画像对比，每个维度一个轴，围成一个闭合多边形表达综合评分分布。

## 何时用
- 多维能力对比 / 画像分析 / 综合评分（营收、客流、好评率等多个维度同时展示）。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]                                                           │
├─────────────────────────────────────────────────────────────────┤
│                        营收                                     │
│                  ／          ＼                                 │
│         环境评分         客流                                    │
│              ＼          ／                                      │
│                ╲        ╱                                       │
│      员工满意 ── ⬡⬡⬡⬡ ── 好评率                                  │
│                ╱        ╲                                       │
│                       翻台率                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "chart": {
    "height": 280,
    "type": "area + coordinate:polar（闭合多边形填充）"
  },
  "shape": {
    "fill": "chartPrimary() @ 25% opacity",
    "stroke": "chartPrimary()",
    "line_width": 2
  },
  "axis": {
    "x": { "grid": true, "grid_stroke": "chartAxisDefaults().gridStroke", "label_font_size": 11 },
    "y": { "grid": true, "grid_stroke": "chartAxisDefaults().gridStroke", "label": false, "tick_count": 5 }
  },
  "scale": {
    "y_domain": "[0, 100]（按评分量纲固定值域，避免不同维度自动缩放导致误读）"
  }
}
```

---

## 数据结构

```json
{
  "radarData": [
    { "dimension": "string", "value": "number" }
  ]
}
```

> 单一系列雷达图：一个对象对应一组维度-数值。多对象对比需扩展为多系列（每个对象一条闭合线，颜色区分）。

---

## G2 v5 Spec

```js
chart.options({
  type: 'area',
  data: radarData,
  encode: { x: 'dimension', y: 'value' },
  coordinate: { type: 'polar' },
  style: { fill: 'rgba(22,111,247,0.25)' /* = chartPrimary() @ 25% */, stroke: chartPrimary(), lineWidth: 2 },
  axis: {
    x: { grid: true, gridStroke: chartAxisDefaults().gridStroke, labelFontSize: 11 },
    y: { grid: true, gridStroke: chartAxisDefaults().gridStroke, label: false, tickCount: 5 },
  },
  scale: { y: { domainMin: 0, domainMax: 100 } },
});
```

---

## 约束

1. **用 `type: 'area'` + `coordinate: { type: 'polar' }`**，不是 `type: 'radar'`（G2 v5 没有这个内置类型）。
2. y 轴（半径方向）`label: false`，避免同心圆刻度文字和多维度标签互相干扰；改用固定 `tickCount` 控制同心圆密度。
3. 值域用 `scale.y.domainMin/domainMax` 固定（如评分制 0~100），不要让不同维度各自自动缩放，否则多边形形状会失真误导判断。
4. 填充色用低透明度（`fillOpacity` 约 0.25），保证多边形重叠时仍可分辨背后的网格线。
5. 多对象对比时每个对象一条线，颜色从 `chartPalette()` 取，避免相近色混淆。

---

## 头部形态变体

D-12 实现了 4 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：纯净型 / 操作型 / 筛选型 / 筛选（复杂），缺描述型。

---

## 自检
- [ ] 使用 `area` + `polar` 而非不存在的 `radar` 类型
- [ ] y 轴刻度文字已隐藏，仅保留同心圆网格
- [ ] 已固定值域，多维度评分量纲一致可比
- [ ] 多对象场景下颜色区分明显

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard12-radar.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 筛选切换 | `mtd-select` | `<Select>` |

图表用 AntV G2 v5，通过 `useG2Chart` 挂载。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Select --target=mtd-react --quiet
```

## 骨架代码 · React

```tsx
function RadarChart() {
  const containerRef = useG2Chart(() => ({
    type: 'area',
    data: radarData,
    encode: { x: 'dimension', y: 'value' },
    coordinate: { type: 'polar' },
    style: { fill: 'rgba(22,111,247,0.25)' /* = chartPrimary() @ 25% */, stroke: chartPrimary(), lineWidth: 2 },
    axis: {
      x: { grid: true, gridStroke: chartAxisDefaults().gridStroke, labelFontSize: 11 },
      y: { grid: true, gridStroke: chartAxisDefaults().gridStroke, label: false, tickCount: 5 },
    },
    scale: { y: { domainMin: 0, domainMax: 100 } },
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

<Card className="chart-card" header={<div className="card-title-bar"><span>门店综合评分</span></div>}>
  <div className="card-body-area"><RadarChart /></div>
</Card>
```

## 踩坑笔记

- 雷达图不是 `type: 'radar'`，是 `type: 'area'` + `coordinate: { type: 'polar' }`，容易和其他图表库的 API 记混。
- 多系列雷达图（多对象对比）用 `type: 'view'` + `children` 数组，每个 children 是一个 `area` 子层，各自 `encode.color` 区分。
- y 轴 `label: false` 只隐藏刻度文字，同心圆网格线仍由 `grid: true` 控制显示。
