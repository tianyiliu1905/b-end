# W-4 · 今日待办 (Today Todo)

> **统一描述字段**：用途与边界 → 输入 → 布局与组合 → 状态 → 事件 → 约束与验证 → 实现映射。按 [模块描述规范](../module-contract.md) 解读本文；原章节保留具体规格与代码，静态模块无交互时标注不适用。

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
    "react_btn_type": "normal",
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
      "id": "string (稳定业务标识)",
      "label": "string",
      "count": "string (如 '3 项' 或 '85.6%')",
      "tone": "urgent | normal | success",
      "action": "string (按钮文案：去审批/去处理/去回复/查看)"
    }
  ]
}
```

---

## 约束

1. 放在工作台页面右侧 240px 边栏；由侧栏父容器设置 `position: sticky; top: 16px`，卡片不单独叠加 sticky。
2. 标题栏右侧固定放「更多」文字入口，`cursor: pointer`，弱化配色（`--text-3`）。
3. 每行左侧「标签+计数」在同一行内联展示，计数颜色按紧急程度区分：紧急用红、常规用主文本色、达成类指标用绿色。
4. 每行右侧按钮统一用 React `type="normal"`（默认描边外观）+ `size="small"`，`minWidth: 64` 保证不同文案长度下按钮宽度一致对齐。
5. 无变体——保持单一形态，不做筛选/切换（工作台侧栏模块以轻量、信息密度低为原则）。
6. 与 D 系图表模块不同，本模块无图表/无 ChartCard 依赖，是纯 Card + flex 布局的轻量列表。

---

## 自检
- [ ] 侧栏父容器 sticky 定位，卡片不重复叠加 sticky
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
      <Button size="small" shape="text" onClick={onMore} style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>更多</Button>
    </div>
  }
>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map((item) => (
      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>
          {item.label}
          <span style={{ fontSize: 'var(--fs-12)', fontWeight: 600, color: item.tone === 'urgent' ? 'var(--color-red)' : item.tone === 'success' ? 'var(--color-green)' : 'var(--text-1)', marginLeft: 6 }}>{item.count}</span>
        </span>
        <Button type="normal" size="small" style={{ minWidth: 64 }} onClick={() => onAction(item.id)}>{item.action}</Button>
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
        <mtd-button size="small" shape="text" @click="onMore">更多</mtd-button>
      </div>
    </template>
    <div class="todo-rows">
      <div v-for="item in items" :key="item.id" class="todo-row">
        <span class="todo-label">
          {{ item.label }}
          <span class="todo-count" :style="{ color: item.tone === 'urgent' ? 'var(--color-red)' : item.tone === 'success' ? 'var(--color-green)' : 'var(--text-1)' }">{{ item.count }}</span>
        </span>
        <mtd-button type="outline" size="small" style="min-width: 64px" @click="onAction(item.id)">{{ item.action }}</mtd-button>
      </div>
    </div>
  </mtd-card>
</template>
```

## 踩坑笔记

- `Card` 的 `header` prop（React）传 JSX 时，内层需要自行加 `width: 100%` + `justifyContent: space-between`，Card 不会自动撑满头部。
- 按钮 `minWidth: 64` 是为了防止「去审批/去处理/去回复/查看」等不同长度文案导致按钮宽度参差不齐。

## 状态与事件

`items` 由父页面持有，空集合显示“暂无待办”。`onAction(id)` 打开该类别的处理入口，`onMore()` 打开全部待办；不要在点击入口时自行减少计数或伪造审批成功。业务接入导航或异步动作后须处理加载和失败。预览与工作台示例共用 TodoCard；Demo 仅回显所选入口，未接真实工单。
