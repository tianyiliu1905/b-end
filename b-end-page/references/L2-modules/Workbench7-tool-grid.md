# W-7 · 常用工具 (Tool Grid)

工作台主内容区的工具入口网格：三列卡片，每格图标 + 标题 + 描述文案 + 独立操作按钮。比 W-3「常用功能」更重——W-3 是纯图标跳转入口（无描述无按钮），W-7 每格自带描述文案+独立创建按钮，信息密度更高，适合需要说明用途的工具集合。

## 何时用
- 常用工具 / 工具箱 / 快捷创建入口 / 需附带说明文案的功能网格。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│ 常用工具                                                     │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐    │
│ │ [图标]         │  │ [图标]         │  │ [图标]         │    │
│ │ 工具标题       │  │ 工具标题       │  │ 工具标题       │    │
│ │ 一句描述文案   │  │ 一句描述文案   │  │ 一句描述文案   │    │
│ │      [立即创建]│  │      [立即创建]│  │      [立即创建]│    │
│ └───────────────┘  └───────────────┘  └───────────────┘    │
│ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐    │
│ │      ...       │  │      ...       │  │      ...       │    │
│ └───────────────┘  └───────────────┘  └───────────────┘    │
└─────────────────────────────────────────────────────────────┘
              3 列网格，行数按工具数量自动换行
```

---

## 视觉规格 (JSON)

```json
{
  "container": {
    "class": "dash-card",
    "padding": 16
  },
  "header": {
    "title": "常用工具",
    "controls": "无（纯静态标题）"
  },
  "grid": {
    "display": "grid",
    "grid_template_columns": "repeat(3, 1fr)",
    "gap": 16
  },
  "tool_card": {
    "border": "1px solid var(--border)",
    "border_radius": "var(--radius-3)",
    "padding": 16
  },
  "icon_placeholder": {
    "size": "36x36",
    "background": "var(--bg-page)",
    "border_radius": 8
  },
  "title_text": {
    "font_size": "var(--fs-14)",
    "font_weight": "var(--fw-semibold)"
  },
  "desc_text": {
    "font_size": "var(--fs-12)",
    "color": "var(--text-3)"
  },
  "cta_button": {
    "text": "立即创建",
    "size": "small",
    "position": "卡片右下角"
  }
}
```

---

## 数据结构

```json
{
  "tools": [
    {
      "id": "string",
      "icon": "string (icon key)",
      "title": "string",
      "desc": "string (一句话描述)"
    }
  ]
}
```

---

## 约束

1. 固定 3 列网格（`grid-template-columns: repeat(3, 1fr)`），行数随工具数量自动换行，不做横向滚动。
2. 每格结构固定：图标占位（36x36，浅灰底）→ 标题 → 描述文案 → 右下角小号「立即创建」按钮，四要素齐全，不可省略描述文案（这是与 W-3 的核心区别）。
3. 卡片带描边（`1px solid`），区别于 D 系无边框卡片——W-7 的工具格需要视觉分隔以突出网格感。
4. 头部标题纯静态展示，无筛选/操作控件。
5. 无变体，保持单一网格形态。
6. 图标为占位色块即可，不强制真实图标语义，视具体工具集合按需替换。

---

## 自检
- [ ] 3 列网格，`repeat(3, 1fr)`
- [ ] 每格含图标+标题+描述+按钮，四要素齐全
- [ ] 卡片带 1px 描边，圆角引用 token
- [ ] 头部无控件，纯标题

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Workbench7-tool-grid.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` / 原生 div（`.dash-card`） | `<Card>` / 原生 div（`.dash-card`） |
| 按钮 | `mtd-button` | `<Button>` |
| 图标 | `mtd-icon` | `<Icon>` |

纯 MTD + 原生 CSS Grid，无图表，无变体。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Button,Icon --target=mtd-react --quiet
```

## 骨架代码 · React

```jsx
import { Button, Icon } from '@ss/mtd-react3'

<div className="dash-card" style={{ padding: 16 }}>
  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>常用工具</div>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
    {tools.map(t => (
      <div
        key={t.id}
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-3)',
          padding: 16,
        }}
      >
        <div style={{ width: 36, height: 36, background: 'var(--bg-page)', borderRadius: 8 }}>
          <Icon type={t.icon} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>{t.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{t.desc}</div>
        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <Button size="small">立即创建</Button>
        </div>
      </div>
    ))}
  </div>
</div>
```

## 骨架代码 · Vue3

```vue
<template>
  <div class="dash-card" style="padding: 16px">
    <div class="tool-grid-header">常用工具</div>
    <div class="tool-grid">
      <div v-for="t in tools" :key="t.id" class="tool-card">
        <div class="tool-icon">
          <mtd-icon :name="t.icon" />
        </div>
        <div class="tool-title">{{ t.title }}</div>
        <div class="tool-desc">{{ t.desc }}</div>
        <div class="tool-cta">
          <mtd-button size="small" @click="onCreate(t)">立即创建</mtd-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-grid-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}
.tool-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.tool-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-3);
  padding: 16px;
}
.tool-icon {
  width: 36px;
  height: 36px;
  background: var(--bg-page);
  border-radius: 8px;
}
.tool-title {
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
}
.tool-desc {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 4px;
}
.tool-cta {
  text-align: right;
  margin-top: 8px;
}
</style>
```

## 踩坑笔记

- 网格用原生 CSS Grid（`repeat(3, 1fr)`），不要用 24 栅格 `Row/Col` 拼三列——工具格宽度需完全均分，栅格 span 取整易出现像素级不对齐。
- 描述文案 `desc_text` 容易被漏写（对齐 W-3 时误删），务必保留，这是与 W-3 的关键区分点。
- 按钮固定右下角对齐（`textAlign: 'right'` 包裹），不要跟标题同行。
