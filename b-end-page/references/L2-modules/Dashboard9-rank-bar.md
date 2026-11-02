# D-9 · 排名条形图 (Rank Bar)

> 📌 图表挂载统一用 `useG2Chart`（含 ResizeObserver 自适应兜底）。

横向条形表达 TOP 排名或占比构成，可带名次/奖杯。

## 何时用
- TOP / 排名 / 排行 / 占比 / 构成。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ [标题]                                                           │
├─────────────────────────────────────────────────────────────────┤
│  🥇 [名称A]  ████████████████████████████████████████  1,234    │
│  🥈 [名称B]  ██████████████████████████████           987      │
│  🥉 [名称C]  ████████████████████████                 756      │
│   4  [名称D]  ██████████████████                       543      │
│   5  [名称E]  ████████████████                         432      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "chart": {
    "height": 280,
    "margin_right": 36,
    "type": "interval + transpose (横向条形)"
  },
  "bar": {
    "primary_color": "var(--color-brand-primary)",
    "top3_highlight": "可加深或用 var(--color-orange)",
    "sort": "降序（最长在上）"
  },
  "label": {
    "position": "right (条形右端)",
    "font_size": "var(--fs-12)"
  },
  "rank_badge": {
    "top3": "奖杯/高亮色",
    "others": "小号 Tag 或序号"
  },
  "container": {
    "width": "100%",
    "overflow": "visible (禁止 overflow:hidden)"
  }
}
```

---

## 数据结构

```json
{
  "rankData": [
    { "name": "string", "value": "number" }
  ]
}
```

---

## G2 v5 Spec

```js
chart.options({
  type: 'interval',
  data: rankData,
  encode: { x: 'name', y: 'value' },
  transform: [{ type: 'sortX', by: 'y', reverse: true }],
  coordinate: { transform: [{ type: 'transpose' }] },
  scale: { color: { range: [chartPrimary()] } },
  labels: [{ text: 'value', position: 'right' }],
  marginRight: 36,
});
```

---

## 约束

1. **`marginRight: 36`（数字）**：横向条形把数值 label 放右端时，最长条形的 label 会贴边被裁。必须加 marginRight 留白。
2. **禁止用 `inset: { right: 36 }`**：G2 v5 顶层不支持该对象写法，会把整个绘图区画没。
3. **禁止用 `overflow:hidden` 遮挡溢出 label**：那是掩盖问题不是解决。
4. 条形主色主蓝；前三名可加深或用橙色高亮。
5. 容器样式 `width:100%; height:280px`，不加 `overflow:hidden`。

---

## 头部形态变体

D-9 实现了 4 型（见 `DashboardChartCard.md` 的「头部形态变体」小节）：筛选型 / 筛选（复杂）/ 操作型 / 纯净型，缺描述型。

---

## 自检
- [ ] 右端数值 label 不被裁切（加了 `marginRight:36` 数字）
- [ ] 未用 `inset` 对象 / `overflow:hidden`
- [ ] 极窄容器下条形不错位（靠 useG2Chart 的 ResizeObserver 兜底）
- [ ] 前三名有视觉区分

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Dashboard9-rank-bar.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 名次标签 | `mtd-tag` | `<Tag>` |
| 图标 | `mtd-icon` / `<i class="mtdicon">` | `<Icon>` |

图表用 AntV G2 v5。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Tag,Icon --target=mtd-react --quiet
```

## 骨架代码 · Vue3

```vue
<template>
  <ChartCard title="TOP 排名" :height="280" :spec="spec" :deps="[rankData]" />
</template>

<script setup lang="ts">
const spec = () => ({
  type: 'interval',
  data: rankData.value,
  encode: { x: 'name', y: 'value' },
  transform: [{ type: 'sortX', by: 'y', reverse: true }],
  coordinate: { transform: [{ type: 'transpose' }] },
  scale: { color: { range: [chartPrimary()] } },
  labels: [{ text: 'value', position: 'right' }],
  marginRight: 36,
})
</script>
```

## 踩坑笔记

- `marginRight` 是**数字**（不是字符串），放在 spec 顶层。
- `inset: { right: 36 }` 在 G2 v5 顶层不支持，会导致绘图区消失。
- 容器 CSS 不要加 `overflow:hidden`，否则 label 被裁。
