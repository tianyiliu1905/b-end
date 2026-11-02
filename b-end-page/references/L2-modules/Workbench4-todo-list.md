# W-4 · 今日待办 (Today Todo)

工作台右侧边栏卡片：待审批/待处理/待回复等工单类目清单，每行「标签+计数+小按钮」，标题栏右侧带「更多」入口。用于个人视角的轻量待办提醒，区别于 D-系图表模块的数据可视化定位。

## 何时用
- 今日待办 / 待办事项 / 工单提醒 / 待处理清单 / 个人待办。

---

## 布局 (ASCII)

```
┌───────────────────────────┐
│ 今日待办            更多  │
├───────────────────────────┤
│ 待审批工单 3 项     [去审批]│
│ 待处理工单 5 项     [去处理]│
│ 待回复咨询 2 项     [去回复]│
│ 本周目标 85.6%      [查看] │
└───────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "card": {
    "width": 240,
    "background": "var(--bg-card)",
    "border_radius": "var(--radius-3)",
    "border": "none",
    "shadow": "none"
  },
  "header": {
    "title_font_size": "var(--fs-16)",
    "more_link": {
      "font_size": "var(--fs-12)",
      "color": "var(--text-3)",
      "cursor": "pointer"
    }
  },
  "row": {
    "layout": "flex, justify-content: space-between",
    "label_font_size": "var(--fs-12)",
    "label_color": "var(--text-3)",
    "count_font_size": "var(--fs-12)",
    "count_font_weight": 600,
    "count_color_urgent": "var(--color-red)",
    "count_color_normal": "var(--text-1)",
    "count_color_success": "var(--color-green)",
    "btn_type": "outline",
    "btn_size": "small",
    "btn_min_width": 64
  },
  "row_gap": 10
}
```

---

## 数据结构

```json
{
  "items": [
    {
      "label": "string",
      "count": "string (如 '3 项' 或 '85.6%')",
      "color": "string (计数颜色：紧急红/常规黑/达成绿)",
      "btn": "string (按钮文案：去审批/去处理/去回复/查看)"
    }
  ]
}
```

---

## 约束

1. 固定出现在工作台页面右侧边栏（`position: sticky; top: 16px`），随主内容区滚动跟随。
2. 标题栏右侧固定放「更多」文字入口，`cursor: pointer`，弱化配色（`--text-3`）。
3. 每行左侧「标签+计数」在同一行内联展示，计数颜色按紧急程度区分：紧急用红、常规用主文本色、达成类指标用绿色。
4. 每行右侧按钮统一用 `type="outline"` + `size="small"`，`minWidth: 64` 保证不同文案长度下按钮宽度一致对齐。
5. 无变体——保持单一形态，不做筛选/切换（工作台侧栏模块以轻量、信息密度低为原则）。
6. 与 D 系图表模块不同，本模块无图表/无 ChartCard 依赖，是纯 Card + flex 布局的轻量列表。

---

## 自检
- [ ] 卡片 sticky 定位，跟随主内容区滚动
- [ ] 「更多」入口存在且样式弱化
- [ ] 计数颜色按紧急/常规/达成三态区分
- [ ] 按钮统一 outline + small + minWidth 对齐
- [ ] 无多余筛选/切换控件（保持轻量）

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Workbench4-todo-list.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 按钮 | `mtd-button` | `<Button>` |

纯 MTD，无图表。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Button --target=mtd-react --quiet
```

## 骨架代码 · React

```jsx
import { Card, Button } from '@ss/mtd-react3'

<Card
  style={{ marginBottom: 0 }}
  header={
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span>今日待办</span>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', cursor: 'pointer' }}>更多</span>
    </div>
  }
>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map((item) => (
      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>
          {item.label}
          <span style={{ fontSize: 'var(--fs-12)', fontWeight: 600, color: item.color, marginLeft: 6 }}>{item.count}</span>
        </span>
        <Button type="outline" size="small" style={{ minWidth: 64 }}>{item.btn}</Button>
      </div>
    ))}
  </div>
</Card>
```

## 骨架代码 · Vue3

```vue
<template>
  <mtd-card>
    <template #header>
      <div class="todo-header">
        <span>今日待办</span>
        <span class="more-link">更多</span>
      </div>
    </template>
    <div class="todo-rows">
      <div v-for="item in items" :key="item.label" class="todo-row">
        <span class="todo-label">
          {{ item.label }}
          <span class="todo-count" :style="{ color: item.color }">{{ item.count }}</span>
        </span>
        <mtd-button type="outline" size="small" style="min-width: 64px">{{ item.btn }}</mtd-button>
      </div>
    </div>
  </mtd-card>
</template>
```

## 踩坑笔记

- `Card` 的 `header` prop（React）传 JSX 时，内层需要自行加 `width: 100%` + `justifyContent: space-between`，Card 不会自动撑满头部。
- 按钮 `minWidth: 64` 是为了防止「去审批/去处理/去回复/查看」等不同长度文案导致按钮宽度参差不齐。
