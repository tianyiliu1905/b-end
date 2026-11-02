# D-2 · 进度展示 (Progress)

展示目标完成度 / 预算消耗 / 达成率。环形进度 + 进度条列表 + 百分比。

## 何时用
- 目标 / 进度 / 完成率 / 预算 / 达成率。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐   ┌──────────────────────────────────────────┐│
│  │              │   │ [子目标A]  ████████░░░░░░░░░░░░  72%     ││
│  │    ╭────╮    │   │ [子目标B]  ██████████████░░░░░░  85%     ││
│  │   │ 72% │   │   │ [子目标C]  ████░░░░░░░░░░░░░░░░  45%     ││
│  │    ╰────╯    │   │ [子目标D]  ██████████████████░░  92%     ││
│  │  核心达成率   │   │                                          ││
│  └──────────────┘   └──────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
  左侧：大环形(gauge)        右侧：进度条列表(line progress)
```

或纯进度条列表（多目标横向对比，无左侧环形）。

---

## 视觉规格 (JSON)

```json
{
  "layout": {
    "type": "左环形 + 右列表 | 纯列表",
    "left_ratio": "约 1/3",
    "right_ratio": "约 2/3",
    "gap": "var(--gap-module)"
  },
  "gauge": {
    "type": "gauge 或 liquid(水波球)",
    "color_completed": "var(--color-brand-primary)",
    "color_track": "var(--bg-card-inner)",
    "text_center": "百分比数值",
    "text_font_size": "28~32px"
  },
  "progress_list": {
    "item_gap": 16,
    "bar_height": 8,
    "bar_radius": 4,
    "color_completed": "var(--color-brand-primary)",
    "color_track": "var(--bg-card-inner)",
    "color_warning": "var(--color-orange)",
    "color_danger": "var(--color-red)"
  },
  "progress_row": {
    "layout": "flex 三段：固定宽标签 + flex:1 进度条 + 固定宽百分比",
    "label_width": "4.5em (按业务最长名预留)",
    "label_overflow": "ellipsis",
    "percent_width": "48px",
    "percent_align": "right"
  },
  "card": {
    "padding": 24,
    "background": "var(--bg-card)",
    "border_radius": "var(--radius-3)",
    "border": "none",
    "shadow": "none"
  }
}
```

---

## 数据结构

```json
{
  "overall": {
    "rate": "number (0~100)",
    "target": "number",
    "current": "number"
  },
  "items": [
    {
      "name": "string",
      "rate": "number (0~100)",
      "status": "'normal' | 'warning' | 'danger'"
    }
  ]
}
```

---

## 约束

1. 进度条行 = flex 三段：固定宽标签 + `flex:1` 进度条 + 固定宽百分比。
2. **标签列宽度禁止按当前页字数写死**——按业务可能出现的最长内容预留（4.5em）+ `overflow:hidden; text-overflow:ellipsis` 兜底。跨页复用时不同页面名称长度不同，写死会溢出覆盖进度条。
3. 进度色：未完成灰底，已完成主蓝；超额/预警用橙/红。
4. 排序按钮文案用「降序 / 升序」（直白），不用「高→低 / 低→高」。
5. 所有色值/间距引用 token，禁止硬编码。
6. **等高行内垂直居中（必做）**：当进度卡片位于 `Row type="flex"` 等高行中、被同行其它高卡撑高时，内容区（进度条列表+图例）必须在撑高后的卡片内垂直居中，不能贴顶留大片底部空白。实现方式：
   - Card 加 `display: flex; flex-direction: column`
   - 内容区（标题下方）加 `flex: 1; display: flex; flex-direction: column; justify-content: center`
   - 图例/legend 放在内容区容器内部（跟着一起居中），不要单独放在容器外

**React 示例**：
```jsx
<Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  {/* 标题行 */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
    <span>开店进度</span>
    <Radio.Group .../>
  </div>
  {/* 内容区：flex:1 + justify-content:center 实现垂直居中 */}
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
    {rows.map(row => <ProgressRow ... />)}
    <Legend />
  </div>
</Card>
```

---

## 变体

### 纯进度条列表
无左侧环形，多目标横向对比，适合子项较多（>6）的场景。

### 带排序
顶部加排序切换（降序/升序），按完成率排列。

---

## 头部形态变体

D-2 实际对应源码中**两个独立子模块**，各自都实现了完整的 5 型头部形态变体（见 `DashboardChartCard.md` 的「头部形态变体」小节）：

- **D-2 环形进度**（AnnualTargetChart，单一大环形+数字）：操作型 / 筛选型 / 筛选（复杂）/ 描述型 / 纯净型，5 型全实现。
- **D-2 进度指标**（MiniDonutChart，2x2 网格小环图）：纯净型 / 操作型 / 筛选型 / 筛选（复杂）/ 描述型，5 型全实现。

两者共享「D-2」编号前缀与变体命名词汇，但 `render` 逻辑完全独立，选型时需先确定用的是哪个子模块。

---

## 自检
- [ ] 标签列宽按最长名预留 + ellipsis 兜底，非按当前页字数写死
- [ ] 进度条行三段 flex 布局，百分比右对齐
- [ ] 进度色引用 token（主蓝/橙/红）
- [ ] 排序文案用「降序/升序」
- [ ] 卡片无边框无阴影

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard2-progress.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 进度条 | `mtd-progress` | `<Progress>` |
| 数值展示 | `mtd-statistic` | `<Statistic>` |
| 栅格 | `mtd-row` / `mtd-col` | `<Row>` / `<Col>` |

环形/仪表盘用 AntV G2 `type:'gauge'` 或 `type:'liquid'`。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Progress,Statistic,Row,Col --target=mtd-react --quiet
```

## G2 环形/仪表盘 (v5 Spec)

```js
chart.options({
  type: 'gauge',
  data: { value: { target: 72, total: 100 } },
  style: { textContent: (t) => `${t}%` },
  scale: { color: { range: [chartPrimary()] } },
});
```

## 骨架代码 · Vue3

```vue
<template>
  <mtd-card class="progress-panel">
    <div class="progress-layout">
      <!-- 左侧环形 -->
      <div class="gauge-area" ref="gaugeRef"></div>
      <!-- 右侧进度条列表 -->
      <div class="progress-list">
        <div v-for="item in items" :key="item.name" class="sub-row">
          <span class="sub-name">{{ item.name }}</span>
          <mtd-progress
            :percentage="item.rate"
            :stroke-width="8"
            :show-text="false"
            class="sub-bar"
          />
          <span class="sub-num">{{ item.rate }}%</span>
        </div>
      </div>
    </div>
  </mtd-card>
</template>
```

## 样式要点

```css
.progress-layout { display: flex; gap: var(--gap-module); }
.gauge-area { width: 33%; min-height: 160px; }
.progress-list { flex: 1; display: flex; flex-direction: column; gap: var(--gap-module); }
.sub-row { display: flex; align-items: center; gap: var(--gap-elem); }
.sub-name {
  flex-shrink: 0; width: 4.5em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sub-bar { flex: 1; }
.sub-num { width: 48px; text-align: right; font-size: var(--fs-12); color: var(--text-2); }
```

## 踩坑笔记

- **标签列宽度禁止按字数写死**：同一个 ProgressPanel 被多页复用（经营概览=2字名，目标管理=4字名），写死 `width:2.2em` 会导致长名溢出覆盖进度条。正确做法：`width:4.5em` + `overflow:hidden; text-overflow:ellipsis`。
- `Progress` 组件的 `stroke-width` 控制条形粗细（px），`percentage` 传 0~100 的数字。
- 排序逻辑：`order==='desc' ? b.rate-a.rate : a.rate-b.rate`。
