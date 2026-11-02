# D-14 · 热力图 (Heatmap)

> 📌 图表挂载统一用 `useG2Chart`（含 ResizeObserver 自适应兜底）。

用色块矩阵表达两个分类维度交叉下的数值密度（如"星期 × 时段"客流分布），颜色深浅代表数值高低。

## 何时用
- 时段分布 / 区域密度 / 两个分类维度交叉分析 / 需要一眼看出"热点"位置时。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]                                                           │
├─────────────────────────────────────────────────────────────────┤
│ 周一 ░ ▒ ▓ █ █ ▓ ▒ ░ ░ ▒ ▓ █                                    │
│ 周二 ▒ ▓ █ █ ▓ ▒ ░ ░ ▒ ▓ █ █                                    │
│ 周三 ░ ▒ ▓ ▓ ▒ ░ ░ ▒ ▓ █ █ ▓                                    │
│  ...                                                             │
│ 周日 ▓ █ █ ▓ ▒ ░ ░ ▒ ▓ █ █ ▓                                    │
│      10 11 12 13 14 15 16 17 18 19 20 21时                      │
├─────────────────────────────────────────────────────────────────┤
│         浅 ░▒▓█ 深  （颜色深浅代表数值高低）                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "chart": {
    "height": 280,
    "type": "cell"
  },
  "cell": {
    "inset": 1,
    "radius": 2
  },
  "color_scale": {
    "type": "linear",
    "range": ["#F0F5FF", "#ADC6FF", "#597EF7", "#1D39C4", "#10239E"]
  },
  "axis": {
    "x": { "label_font_size": 10, "position": "bottom", "title": false },
    "y": { "label_font_size": 11, "title": false }
  },
  "legend": {
    "color": { "position": "bottom", "length": 240, "label_font_size": 10 }
  }
}
```

---

## 数据结构

```json
{
  "heatmapData": [
    { "day": "string（如'周一'）", "hour": "string（如'10时'）", "value": "number" }
  ]
}
```

> 需要预先生成两个维度的笛卡尔积（如 7 天 × 12 个时段 = 84 条记录），每条记录携带一个数值。

---

## G2 v5 Spec

```js
chart.options({
  type: 'cell',
  data: heatmapData,
  encode: { x: 'hour', y: 'day', color: 'value' },
  scale: { color: { type: 'linear', range: ['#F0F5FF', '#ADC6FF', '#597EF7', '#1D39C4', '#10239E'] } },
  style: { inset: 1, radius: 2 },
  axis: {
    x: { labelFontSize: 10, position: 'bottom', title: false },
    y: { labelFontSize: 11, title: false },
  },
  legend: { color: { position: 'bottom', length: 240, labelFontSize: 10 } },
});
```

---

## 约束

1. 用 `type: 'cell'`，`encode.color` 绑定数值字段，`scale.color.type: 'linear'` + 渐变色阶（浅→深）表达数值大小。
2. 色块之间用 `style.inset: 1` 留出 1px 间隙，`radius: 2` 做轻微圆角，避免色块完全贴合显得生硬。
3. x/y 轴均不需要 `title`（维度含义已通过图例说明），标签字号可比常规图表略小（10~11px）以容纳更多分类。
4. 图例必须显示（`legend.color`），并放在底部横向展示渐变色阶，帮助用户理解颜色深浅对应的数值区间。
5. 两个分类维度的数量不宜过多（建议单轴 ≤ 15~20 个分类），否则色块过密难以辨识。

---

## 头部形态变体

D-14 实现了全部 5 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：操作型 / 筛选型 / 筛选（复杂）/ 描述型 / 纯净型。

---

## 自检
- [ ] 使用线性渐变色阶（浅→深）而非分类色板
- [ ] x/y 轴标题已隐藏，仅保留分类标签
- [ ] 底部图例展示了颜色-数值映射
- [ ] 两个维度的分类数量在可辨识范围内

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard14-heatmap.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |

图表用 AntV G2 v5 `cell` 类型，通过 `useG2Chart` 挂载。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card --target=mtd-react --quiet
```

## 骨架代码 · React

```tsx
function HeatmapChart() {
  const containerRef = useG2Chart(() => ({
    type: 'cell',
    data: heatmapData,
    encode: { x: 'hour', y: 'day', color: 'value' },
    scale: { color: { type: 'linear', range: ['#F0F5FF', '#ADC6FF', '#597EF7', '#1D39C4', '#10239E'] } },
    style: { inset: 1, radius: 2 },
    axis: {
      x: { labelFontSize: 10, position: 'bottom', title: false },
      y: { labelFontSize: 11, title: false },
    },
    legend: { color: { position: 'bottom', length: 240, labelFontSize: 10 } },
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

<Card className="chart-card" header={<div className="card-title-bar"><span>每日各时段客流</span></div>}>
  <div className="card-body-area"><HeatmapChart /></div>
</Card>
```

## 数据生成示例

```ts
const heatmapData: { day: string; hour: string; value: number }[] = [];
const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const hours = ['10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时'];
days.forEach(day => {
  hours.forEach(hour => {
    heatmapData.push({ day, hour, value: Math.floor(Math.random() * 100) });
  });
});
```

## 踩坑笔记

- `type: 'cell'` 是热力图专用类型，`encode.color` 必须绑定连续数值字段，配合 `scale.color.type: 'linear'` 才能出现渐变色阶（否则会退化成分类色板）。
- 两个分类维度需要预先做笛卡尔积展开为扁平数组，不要传嵌套的二维数组结构。
- 图例的 `length` 属性控制渐变条长度，过短会导致颜色区分度在视觉上不明显。
