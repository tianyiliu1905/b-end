# D-13 · 水波球 (Liquid Gauge)

> 📌 图表挂载统一用 `useG2Chart`（含 ResizeObserver 自适应兜底）。

用波浪水位高度表达单一比例（如目标完成率），中心叠加百分比数字，强调"进度感"和视觉趣味性。

## 何时用
- 单一比例强调 / 目标完成率 / 年度进度 / 需要比普通进度条更强的视觉焦点时。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────┐
│ [标题]                                                   │
├─────────────────────────────────────────────────────────┤
│                    ╭───────────╮                         │
│                  ╱   ~~~~~~~~~   ╲                       │
│                 │   ~~~~~~~~~~~   │                       │
│                 │  ~~ 77.82% ~~   │                       │
│                 │   ~~~~~~~~~~~   │                       │
│                  ╲   ~~~~~~~~~   ╱                       │
│                    ╰───────────╯                         │
│           实际 ¥4280万 / 目标 ¥5500万                    │
└─────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "chart": {
    "size": "160 x 160（正方形，居中）",
    "type": "liquid"
  },
  "style": {
    "fill": "chartPrimary()",
    "stroke": "chartPrimary()",
    "outline_border": 4,
    "outline_distance": 6,
    "wave_length": 128,
    "text_fill": "#fff",
    "text_font_size": 20,
    "text_font_weight": 700
  },
  "footer_text": {
    "content": "实际 X万 / 目标 Y万",
    "font_size": "var(--fs-12)",
    "color": "var(--text-2)",
    "position": "水波球下方，居中"
  }
}
```

---

## 数据结构

```json
{
  "revenueTarget": { "actual": "number", "target": "number" }
}
```

> `data` 传给 G2 的是比例值 `ratio = actual / target`（0~1 之间的小数），不是原始 actual/target 两个数。

---

## G2 v5 Spec

```js
const ratio = revenueTarget.actual / revenueTarget.target; // 0~1
chart.options({
  type: 'liquid',
  data: ratio,
  style: {
    fill: chartPrimary(),
    stroke: chartPrimary(),
    outlineBorder: 4,
    outlineDistance: 6,
    waveLength: 128,
    textFill: '#fff',
    textFontSize: 20,
    textFontWeight: 700,
    contentText: `${(ratio * 100).toFixed(2)} %`,
  },
  axis: false,
  legend: false,
  tooltip: false,
});
```

---

## 约束

1. `data` 直接传数字比例（0~1），不要传对象或数组；百分比文案通过 `style.contentText` 自定义渲染。
2. 图表容器固定为正方形（如 160×160），过长/过扁的容器会导致水波球被拉伸变形。
3. `axis`、`legend`、`tooltip` 均设为 `false`——水波球是纯装饰性单值展示，不需要坐标轴和交互提示。
4. 容器下方用普通文本（非图表内文字）展示"实际 X / 目标 Y"的原始数值，方便用户核对百分比含义。
5. 单个看板页不宜堆叠过多水波球（视觉噪音大），一般 1 个用于强调最核心的单一指标。

---

## 头部形态变体

D-13 实现了全部 5 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：纯净型 / 筛选型 / 筛选（复杂）/ 操作型 / 描述型。

---

## 自检
- [ ] `data` 传的是 0~1 比例值而非原始数值
- [ ] 容器为正方形，未被拉伸变形
- [ ] `axis/legend/tooltip` 均已关闭
- [ ] 容器外有清晰的原始数值说明文案

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard13-liquid.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |

图表用 AntV G2 v5 `liquid` 类型，通过 `useG2Chart` 挂载。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card --target=mtd-react --quiet
```

## 骨架代码 · React

```tsx
function LiquidGauge() {
  const ratio = revenueTarget.actual / revenueTarget.target; // 0~1
  const containerRef = useG2Chart(() => ({
    type: 'liquid',
    data: ratio,
    style: {
      fill: chartPrimary(), stroke: chartPrimary(), outlineBorder: 4, outlineDistance: 6,
      waveLength: 128, textFill: '#fff', textFontSize: 20, textFontWeight: 700,
      contentText: `${(ratio * 100).toFixed(2)} %`,
    },
    axis: false,
    legend: false,
    tooltip: false,
  }), []);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={containerRef} style={{ width: 160, height: 160 }} />
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)' }}>
          实际 <b>¥{revenueTarget.actual}万</b> / 目标 <b>¥{revenueTarget.target}万</b>
        </div>
      </div>
    </div>
  );
}
```

## 踩坑笔记

- `data` 字段直接是数字（比例值），这是 G2 v5 `liquid` 类型的特殊之处，和其他图表类型 `data` 传数组不同。
- `contentText` 用于自定义中心文案，不设置的话会显示默认的原始比例数字（不带 `%`、不带小数位格式化）。
- 外层容器需要用 flex 布局把水波球和底部说明文字垂直居中排列，水波球本身固定宽高为正方形。
