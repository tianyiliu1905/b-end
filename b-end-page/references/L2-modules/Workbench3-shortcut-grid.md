# W-3 · 常用功能/快捷入口网格 (ShortcutGrid)

工作台首页的快捷功能入口网格，2×4 图标布局，每项含图标+标题+描述。

## 何时用
- 工作台看板首页
- 需要提供多个快捷功能入口/跳转
- 「常用功能」「快捷操作」类场景

---

## 布局 (ASCII)

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                        │
│  │ Icon │  │ Icon │  │ Icon │  │ Icon │                        │
│  │ 标题 │  │ 标题 │  │ 标题 │  │ 标题 │                        │
│  │ 描述 │  │ 描述 │  │ 描述 │  │ 描述 │                        │
│  └──────┘  └──────┘  └──────┘  └──────┘                        │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                        │
│  │ Icon │  │ Icon │  │ Icon │  │ Icon │                        │
│  │ 标题 │  │ 标题 │  │ 标题 │  │ 标题 │                        │
│  │ 描述 │  │ 描述 │  │ 描述 │  │ 描述 │                        │
│  └──────┘  └──────┘  └──────┘  └──────┘                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "container": {
    "background": "var(--bg-card)",
    "border_radius": "var(--radius-3)",
    "padding": "var(--card-padding)",
    "border": "none",
    "shadow": "none"
  },
  "grid": {
    "columns": 4,
    "rows": 2,
    "gutter": "var(--gap-module)"
  },
  "item": {
    "background": "var(--bg-card-inner)",
    "border_radius": "var(--radius-4)",
    "padding": "var(--card-padding)",
    "text_align": "center",
    "cursor": "pointer",
    "hover_bg": "var(--nav-hover-bg)"
  },
  "icon": {
    "size": "32px",
    "color": "var(--color-brand-primary)",
    "margin_bottom": "var(--gap-elem)"
  },
  "title": {
    "font_size": "var(--fs-14)",
    "font_weight": "var(--fw-medium)",
    "color": "var(--text-1)"
  },
  "description": {
    "font_size": "var(--fs-12)",
    "color": "var(--text-3)",
    "margin_top": "4px"
  }
}
```

---

## 数据结构

```json
{
  "ShortcutItem": {
    "key": "string",
    "icon": "string (MTD Icon type)",
    "title": "string",
    "description": "string?",
    "href": "string? (跳转链接)",
    "onClick": "() => void?"
  },
  "ShortcutGridProps": {
    "items": "ShortcutItem[] (推荐8项，2×4网格)",
    "columns": "number? (默认4)"
  }
}
```

---

## 约束

1. 网格项数量推荐 8 个（2×4），最少 4 个，最多 12 个。
2. 图标统一 `-o` 线性风格。
3. 每项可点击跳转。
4. hover 有视觉反馈。
5. 标题不超过 6 字。

---

## 自检
- [ ] 图标来自 MTD Icon（确认 icon_name.md 中存在）
- [ ] 统一 -o 线性风格
- [ ] hover 有视觉反馈
- [ ] 网格等宽等高
- [ ] 无 Emoji

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Workbench3-shortcut-grid.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 栅格 | `mtd-row` + `mtd-col` | `<Row>` + `<Col>` |
| 卡片 | `mtd-card` | `<Card>` |
| 图标 | `mtd-icon` | `<Icon>` |

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Row,Col,Card,Icon --target=mtd-vue --quiet
```

## 骨架代码 · Vue3

```vue
<template>
  <div class="shortcut-grid dash-card">
    <mtd-row :gutter="16">
      <mtd-col v-for="item in items" :key="item.key" :span="6">
        <div class="shortcut-item" @click="handleClick(item)">
          <mtd-icon :name="item.icon" class="shortcut-icon" />
          <div class="shortcut-title">{{ item.title }}</div>
          <div v-if="item.description" class="shortcut-desc">{{ item.description }}</div>
        </div>
      </mtd-col>
    </mtd-row>
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, required: true }
})

function handleClick(item) {
  if (item.href) window.open(item.href)
  else item.onClick?.()
}
</script>

<style scoped>
.shortcut-grid { padding: var(--card-padding); }
.shortcut-item {
  background: var(--bg-card-inner);
  border-radius: var(--radius-4);
  padding: var(--card-padding);
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}
.shortcut-item:hover { background: var(--nav-hover-bg); }
.shortcut-icon { font-size: 32px; color: var(--color-brand-primary); margin-bottom: var(--gap-elem); }
.shortcut-title { font-size: var(--fs-14); font-weight: var(--fw-medium); color: var(--text-1); }
.shortcut-desc { font-size: var(--fs-12); color: var(--text-3); margin-top: 4px; }
</style>
```

## 踩坑笔记

- `span=6` 即一行 4 列（24/6=4）。
- 两行 8 个入口时，自动换行即可（Row 不设 flex-wrap:nowrap）。
- 图标统一用 `-o` 后缀版本。
