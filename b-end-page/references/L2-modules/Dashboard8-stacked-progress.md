# D-8 · 堆叠进度条 (Stacked Progress Bar)

> ⚠️ **非 G2 图表**：本模块是手工 flex/div 实现的多阶段堆叠进度条，不经过 `useG2Chart`/ChartCard，不使用 AntV G2。如果需要真正的 G2 堆叠柱状图（时间序列/分类维度上的 stackY），请用 D-4（柱状图）的堆叠变体，而不是本模块。

按"对象（如分公司/门店）"分行，每行用多段不同颜色的色块表达该对象在多个阶段/状态上的数量分布，色块宽度按数值比例（flex 权重）自适应，常用于开店进度、审批流转等多阶段流程的横向对比。

## 何时用
- 开店进度 / 审批流转 / 多阶段状态占比 / 多个对象在同一组阶段上的分布对比。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]                                        [筛选/操作]        │
├─────────────────────────────────────────────────────────────────┤
│ 华北分公司  ██████ 待勘查 ████████ 勘查中 ██████ 审批中 ...      │
│ 华南分公司  ████████████ 待勘查 ██████ 勘查中 ████ 审批中 ...    │
│ 西南分公司  █████████ 待勘查 ███████ 勘查中 ████ 审批中 ...      │
│ 东南分公司  ████████████████ 待勘查 ███████ 勘查中 ...           │
├─────────────────────────────────────────────────────────────────┤
│ ● 待勘查  ● 勘查中  ● 审批中  ● 已通过  ● 已开门店               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "row": {
    "layout": "flex, align-items: center, gap: 12",
    "label_width": 90,
    "label_font_size": "var(--fs-12)",
    "label_color": "var(--text-2)"
  },
  "bar_track": {
    "layout": "flex（每段宽度 = flex: 该段数值）",
    "height": 22,
    "border_radius": 4,
    "overflow": "hidden"
  },
  "segment": {
    "display": "flex, align-items: center, justify-content: center",
    "font_size": "var(--fs-12)",
    "color": "#fff",
    "font_weight": 500,
    "min_width": "20px（当值 > 0 时，避免过窄段挤没数字）"
  },
  "legend": {
    "layout": "flex, flex-wrap: wrap, gap: 16",
    "dot": { "width": 10, "height": 10, "border_radius": 2 },
    "label_font_size": "var(--fs-12)",
    "label_color": "var(--text-3)"
  },
  "container": {
    "min_height": 200,
    "flex_direction": "column",
    "align_items": "stretch",
    "gap": 12
  }
}
```

---

## 数据结构

```json
{
  "expandProgress": [
    { "branch": "string（对象名，如分公司）", "phases": "number[]（各阶段数值，与 phaseLabels 一一对应）" }
  ],
  "phaseLabels": "string[]（阶段名称，如 ['待勘查','勘查中','审批中','已通过','已开门店']）",
  "phaseColors": "string[]（每个阶段对应的固定色，与 phaseLabels 等长）"
}
```

---

## 实现方式（非 G2，手工 flex 布局）

每一行是一个 `flex` 容器：左侧固定宽度的对象名标签 + 右侧一个 `flex:1` 的横向色块条。色块条内部按 `phases` 数组逐项渲染 `div`，每个 `div` 的 `flex` 样式值等于该阶段的数值（浏览器按比例自动分配宽度，无需手动计算百分比）。条形下方是全局共用的图例（阶段名 + 色块），所有行共享同一套 `phaseColors`。

```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  <span style={{ width: 90, fontSize: 'var(--fs-12)', color: 'var(--text-2)', flexShrink: 0 }}>{row.branch}</span>
  <div style={{ flex: 1, display: 'flex', height: 22, borderRadius: 4, overflow: 'hidden' }}>
    {row.phases.map((val, i) => (
      <div key={i} style={{
        flex: val, background: phaseColors[i],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 'var(--fs-12)', color: '#fff', fontWeight: 500,
        minWidth: val > 0 ? 20 : 0,
      }}>{val}</div>
    ))}
  </div>
</div>
```

---

## 约束

1. **不要用 G2 实现本模块**：这是纯 flex/div 布局，不需要挂 `useG2Chart`、不需要图表容器 ref、不需要 ResizeObserver 兜底（浏览器原生 flex 自适应即可）。
2. 每个阶段用固定色（`phaseColors`），所有行共享同一套配色和图例，不要每行单独配色。
3. 数值为 0 的阶段段 `minWidth` 设为 0（不占最小宽度），避免空阶段也画出一条可见色块。
4. 数值较小的阶段段设 `minWidth: 20`，防止数字被挤压不可读。
5. 图例统一放在所有行下方，横向 `flex-wrap`，不要每行重复画图例。

---

## 头部形态变体

D-8 虽非 G2 图表（纯 flex/div 实现），但头部右侧控件仍复用与其它 D-N 相同的 5 型命名词汇（见 `DashboardChartCard.md` 的「头部形态变体」小节），实现了全部 5 型：筛选型 / 筛选（复杂）/ 操作型 / 描述型 / 纯净型。

---

## 自检
- [ ] 未误用 G2/`useG2Chart` 实现本模块（纯 flex/div）
- [ ] 各阶段颜色固定且全局一致，图例只画一份
- [ ] 数值为 0 的段不占最小宽度、非 0 小数值段有 `minWidth` 兜底
- [ ] 对象名标签宽度固定，不随内容长度撑开导致错位

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard8-stacked-progress.md`。
> ⚠️ 本模块不使用 G2，不需要 ChartCard/`useG2Chart`，纯 flex/div 布局 + MTD 基础组件即可。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 筛选切换 | `mtd-radio-group` / `mtd-select` | `<Radio.Group>` / `<Select>` |
| 操作按钮 | `mtd-button` (Vue) | `<Button.Link>` (React) `type="primary"` `shape="text"` |
| 进度色块 | 原生 `div`（flex 权重布局） | 原生 `div`（flex 权重布局） |

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,RadioGroup,Select,Button --target=mtd-react --quiet
```

## 骨架代码 · React

```tsx
const expandProgress = [
  { branch: '华北分公司', phases: [12, 20, 28, 14, 6] },
  { branch: '华南分公司', phases: [29, 16, 11, 18, 12] },
  { branch: '西南分公司', phases: [24, 17, 11, 20, 8] },
  { branch: '东南分公司', phases: [42, 18, 9, 5, 6] },
];
const phaseLabels = ['待勘查', '勘查中', '审批中', '已通过', '已开门店'];
const phaseColors = chartPalette().slice(0, 5);

const progressBody = (
  <div className="card-body-area" style={{ height: 'auto', minHeight: 200, flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
    {expandProgress.map(row => (
      <div key={row.branch} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 90, fontSize: 'var(--fs-12)', color: 'var(--text-2)', flexShrink: 0 }}>{row.branch}</span>
        <div style={{ flex: 1, display: 'flex', height: 22, borderRadius: 4, overflow: 'hidden' }}>
          {row.phases.map((val, i) => (
            <div key={i} style={{ flex: val, background: phaseColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-12)', color: '#fff', fontWeight: 500, minWidth: val > 0 ? 20 : 0 }}>{val}</div>
          ))}
        </div>
      </div>
    ))}
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {phaseLabels.map((label, i) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: phaseColors[i], display: 'inline-block' }} />
          {label}
        </span>
      ))}
    </div>
  </div>
);

<Card className="chart-card" header={<div className="card-title-bar"><span>分公司开店进度</span><Select defaultValue="all" size="small" style={{ width: 110 }}><Select.Option value="all">全部分公司</Select.Option></Select></div>}>
  {progressBody}
</Card>
```

## 踩坑笔记

- 不要给本模块接入 `useG2Chart` 或 ChartCard —— 它是纯 CSS flex 布局，接入图表挂载 hook 反而多余且没有意义。
- 每段色块宽度用 `flex: val` 由浏览器按比例自动计算，不要手动算百分比再传 `width`。
- 图例只在所有行下方渲染一次，不要在每一行内重复渲染。
- 与"D-4 柱状图"的堆叠变体（G2 `interval` + `stackY`）是两个不同的实现路径：如果业务场景是"时间序列/分类维度上的数值堆叠对比"用 D-4；如果是"多个对象在固定阶段集合上的分布对比、以整行横向色块直观呈现"用本模块。
