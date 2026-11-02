# W-5 · 公告通知 (Announcement)

工作台右侧边栏卡片：公告/通知列表，单行省略展示。两种变体差异仅在每行的「前缀」形式——日期前缀或分类标签前缀。

## 何时用
- 公告 / 通知 / 消息列表 / 系统公告 / 最新公告。

---

## 布局 (ASCII)

```
变体 A · 日期前缀
┌───────────────────────────┐
│ 最新公告                  │
├───────────────────────────┤
│ 03-15  618 大促方案已发布…│
│ 03-14  新版商品审核流程…  │
│ 03-13  Q1 复盘会议安排…   │
└───────────────────────────┘

变体 B · 标签前缀
┌───────────────────────────┐
│ 最新公告                  │
├───────────────────────────┤
│ [活动] 618 大促方案已发布…│
│ [系统] 新版商品审核流程…  │
│ [会议] Q1 复盘会议安排…   │
└───────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "card": {
    "width": 240,
    "background": "var(--bg-card)",
    "border_radius": "var(--radius-3)"
  },
  "row": {
    "font_size": "var(--fs-12)",
    "color": "var(--text-2)",
    "overflow": "hidden",
    "text_overflow": "ellipsis",
    "white_space": "nowrap"
  },
  "date_prefix": {
    "color": "var(--text-3)",
    "margin_right": 8
  },
  "tag_prefix": {
    "size": "small",
    "theme_map": { "活动": "blue", "系统": "green", "会议": "orange" }
  },
  "row_gap": 10
}
```

---

## 数据结构

```json
{
  "dateVariant": {
    "items": [{ "date": "MM-DD", "text": "string" }]
  },
  "tagVariant": {
    "items": [{ "tag": "string", "tagColor": "string", "text": "string" }]
  }
}
```

---

## 约束

1. 固定出现在工作台右侧边栏，与 W-4 今日待办、W-6 最新动态并列排布（垂直堆叠）。
2. 单行文字超长必须 `overflow:hidden; text-overflow:ellipsis; white-space:nowrap` 截断，不换行、不撑高卡片。
3. 「日期前缀」变体：日期用弱化色（`--text-3`），与正文之间留 8px 间距，日期本身不需要 Tag 包裹。
4. 「标签前缀」变体：用彩色 `Tag size="small"`，颜色按分类语义映射（活动→蓝、系统→绿、会议→橙），标签与正文之间保持基线对齐。
5. 两种变体二选一，不混用（同一卡片内所有行统一同一种前缀形式）。
6. 通常展示 3 条左右，不做分页/加载更多——公告类信息以「最新几条」为主，非完整列表。

---

## 变体

### 日期前缀
弱化时间感知，适合内容本身自带时间线索（如按日期排序即表达新旧）的场景。

### 标签前缀
强调分类区分，适合公告来源多样（活动/系统/会议等）需要一眼分辨类型的场景。

---

## 自检
- [ ] 单行文字用 ellipsis 截断，不换行
- [ ] 日期前缀变体用弱化色，标签前缀变体用语义色 Tag
- [ ] 两变体不混用
- [ ] 展示条数克制（约 3 条），不做分页

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Workbench5-announcement.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 标签 | `mtd-tag` | `<Tag>` |

纯 MTD，无图表。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Tag --target=mtd-react --quiet
```

## 骨架代码 · React（日期前缀变体）

```jsx
import { Card } from '@ss/mtd-react3'

<Card style={{ marginBottom: 0 }} header="最新公告">
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map((item) => (
      <div key={item.date} style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <span style={{ color: 'var(--text-3)', marginRight: 8 }}>{item.date}</span>
        {item.text}
      </div>
    ))}
  </div>
</Card>
```

## 骨架代码 · React（标签前缀变体）

```jsx
import { Card, Tag } from '@ss/mtd-react3'

<Card style={{ marginBottom: 0 }} header="最新公告">
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map((item) => (
      <div key={item.text} style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Tag theme={item.tagColor} size="small">{item.tag}</Tag>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</span>
      </div>
    ))}
  </div>
</Card>
```

## 骨架代码 · Vue3

```vue
<template>
  <mtd-card>
    <template #header>最新公告</template>
    <div class="announcement-rows">
      <div v-for="item in items" :key="item.text || item.date" class="announcement-row">
        <span v-if="variant === 'date'" class="date-prefix">{{ item.date }}</span>
        <mtd-tag v-else :theme="item.tagColor" size="small">{{ item.tag }}</mtd-tag>
        <span class="announcement-text">{{ item.text }}</span>
      </div>
    </div>
  </mtd-card>
</template>
```

## 踩坑笔记

- `text-overflow: ellipsis` 生效前提是父元素有明确宽度 + `overflow: hidden` + `white-space: nowrap` 三者齐全，缺一不可。
- `Tag` 变体行需要 `display: flex; align-items: center` 保证 Tag 与文字基线对齐，且文字部分单独包一层 `flex: 1` 才能正确截断。
