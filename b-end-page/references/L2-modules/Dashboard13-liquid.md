# D-13 · 水波球 (Liquid Gauge)

> **统一描述字段**：用途与边界 → 输入 → 布局与组合 → 状态 → 事件 → 约束与验证 → 实现映射。按 [模块描述规范](../module-contract.md) 解读本文；原章节保留具体规格与代码，静态模块无交互时标注不适用。

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
    "fill": "chartPalette.c1",
    "stroke": "chartPalette.c1",
    "outline_border": 4,
    "outline_distance": 6,
    "wave_length": 128,
    "text_fill": "蓝主题 #fff；黄主题 #111925",
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

> `data` 是比例数字，绘制水位取 `Math.min(ratio, 1)`；中心文案保留未截断的实际完成率。无效目标不参与除法。

---

## G2 v5 Spec

```js
const valid = Number.isFinite(actual) && actual >= 0 && Number.isFinite(target) && target > 0;
const ratio = valid ? actual / target : 0;
chart.options({
  type: 'liquid',
  data: Math.min(ratio, 1),
  style: {
    fill: chartPalette.c1,
    stroke: chartPalette.c1,
    outlineBorder: 4,
    outlineDistance: 6,
    waveLength: 128,
    textFill: theme === 'brand-yellow' ? '#111925' : '#fff',
    textFontSize: 20,
    textFontWeight: 700,
    contentText: valid ? `${(ratio * 100).toFixed(2)} %` : '—',
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
function LiquidProgress({ actual, target }: { actual: number; target: number }) {
  const { theme } = useTheme();
  const [color, setColor] = useState(() => chartPalette.c1);
  // ThemeProvider 在 effect 中更新 html 属性，下一帧读取才是新主题 token。
  useEffect(() => {
    const frame = requestAnimationFrame(() => setColor(chartPalette.c1));
    return () => cancelAnimationFrame(frame);
  }, [theme]);
  const valid = Number.isFinite(actual) && actual >= 0 && Number.isFinite(target) && target > 0;
  const ratio = valid ? actual / target : 0;
  const ref = useG2Chart(() => ({
    type: 'liquid',
    data: Math.min(ratio, 1),
    style: {
      fill: color, stroke: color, outlineBorder: 4, outlineDistance: 6,
      waveLength: 128, textFill: theme === 'brand-yellow' ? '#111925' : '#fff',
      textFontSize: 20, textFontWeight: 700,
      contentText: valid ? `${(ratio * 100).toFixed(2)} %` : '—',
    },
    axis: false, legend: false, tooltip: false,
  }), [actual, target, theme, color]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
      <div ref={ref} role="img" aria-label={valid ? `目标完成率 ${(ratio * 100).toFixed(2)}%` : '目标数据不可用'} style={{ width: 160, height: 160 }} />
      <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)' }}>
        {valid ? <>实际 <b>¥{actual}万</b> / 目标 <b>¥{target}万</b></> : '暂无有效目标数据'}
      </div>
    </div>
  );
}
```

## 踩坑笔记

- `data` 字段直接是数字（比例值），这是 G2 v5 `liquid` 类型的特殊之处，和其他图表类型 `data` 传数组不同。
- `contentText` 用于自定义中心文案，不设置的话会显示默认的原始比例数字（不带 `%`、不带小数位格式化）。
- 外层容器需要用 flex 布局把水波球和底部说明文字垂直居中排列，水波球本身固定宽高为正方形。

## 状态、事件与实现对齐

- D-13 的唯一身份是水波球；区间评分仪表盘不使用此编号。预览与经营概览共同复用 `LiquidProgress`。
- 输入 actual / target 都必须有限，actual >= 0 且 target > 0；无效时水位为 0、中心显示“—”，下方显示“暂无有效目标数据”。目标为 0 不参与除法。
- 超额完成时水位截到 1，中心百分比仍显示真实比例，不能截断业务结果。
- 颜色读取 `chartPalette.c1`；中心蓝主题白字、黄主题深字。`useG2Chart` 的依赖包含 actual、target、theme 和已解析的颜色，保证数据更新与蓝→黄→蓝都能重绘。
- 160×160 球体下方保留原始实际值 / 目标值；演示金额和单位可由业务替换，不作为所有比例指标的固定单位。
- 外层支持纯净型、筛选型、筛选（复杂）、操作型、描述型五种头部；本体只读，无业务操作事件。筛选控件的联动由父页面声明，静态预览不代表已接入数据接口。

主题切换时 ThemeProvider 在 effect 更新 html 属性，下一帧再读取 chartPalette.c1 并更新颜色状态，避免读取到旧主题 token；代码需导入 useEffect / useState / useTheme / useG2Chart / chartPalette。
