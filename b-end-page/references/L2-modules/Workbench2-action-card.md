# W-2 · 操作引导卡 (Action Card)

把「可操作的策略/待办/建议」做成卡片：描述 + 效果数据 + 操作按钮。看板从「看」走向「做」。

## 何时用
- 策略 / 待办 / 操作 / 建议 / 运营动作。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ [标题]    [状态]  │  │ [标题]    [状态]  │  │ [标题]    [状态]  │  │
│  │                   │  │                   │  │                   │  │
│  │ 一句描述文案      │  │ 一句描述文案      │  │ 一句描述文案      │  │
│  │                   │  │                   │  │                   │  │
│  │ 预计提升          │  │ 预计提升          │  │ 预计提升          │  │
│  │ ██ 12.5%         │  │ ██ 8.3%          │  │ ██ 15.2%         │  │
│  │                   │  │                   │  │                   │  │
│  │ [立即执行]        │  │ [立即执行]        │  │ [立即执行]        │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "grid": {
    "columns": "一行 2~3 张",
    "gutter": 16,
    "span_3cards": 8,
    "span_2cards": 12
  },
  "card": {
    "padding": 24,
    "background": "var(--bg-card)",
    "border_radius": "var(--radius-3)",
    "border": "none",
    "shadow": "none"
  },
  "title": {
    "font_size": "var(--fs-16)",
    "font_weight": "var(--fw-semibold)",
    "color": "var(--text-1)"
  },
  "status_tag": {
    "position": "标题右侧",
    "types": ["待处理(warning)", "进行中(info)", "已完成(success)"]
  },
  "description": {
    "font_size": "var(--fs-14)",
    "color": "var(--text-2)",
    "max_lines": 2
  },
  "effect_number": {
    "font_size": "var(--fs-24)",
    "color": "var(--color-brand-primary)",
    "font_weight": "var(--fw-semibold)"
  },
  "cta_button": {
    "type": "primary",
    "size": "default",
    "position": "卡片底部"
  },
  "secondary_button": {
    "type": "text",
    "position": "主按钮右侧"
  }
}
```

---

## 数据结构

```json
{
  "actions": [
    {
      "id": "string",
      "title": "string",
      "desc": "string",
      "status": "'pending' | 'running' | 'done'",
      "statusColor": "string",
      "effect": "number",
      "effectUnit": "string (如 '%')",
      "cta": "string (按钮文案)"
    }
  ]
}
```

---

## 约束

1. 一行 2~3 张操作卡（24 栅格，span=8 或 12）。
2. 主操作按钮用主蓝实心 `type="primary"`；次操作用文字按钮。
3. 效果数字用主色强调。
4. 状态 Tag 放标题右侧（待处理/进行中/已完成）。
5. 纯结构组件，无图表。

---

## 自检
- [ ] 主按钮 type="primary"
- [ ] 效果数字用主色
- [ ] 状态 Tag 颜色正确映射
- [ ] 卡片无边框无阴影

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Workbench2-action-card.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 栅格 | `mtd-row` / `mtd-col` | `<Row>` / `<Col>` |
| 卡片容器 | `mtd-card` | `<Card>` |
| 按钮 | `mtd-button` | `<Button>` |
| 状态标签 | `mtd-tag` | `<Tag>` |
| 数值展示 | `mtd-statistic` | `<Statistic>` |

纯 MTD，无图表。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Button,Tag,Statistic,Row,Col --target=mtd-react --quiet
```

## 骨架代码 · React

```jsx
import { Row, Col, Card, Button, Tag, Statistic } from '@ss/mtd-react3'

<Row gutter={16}>
  {actions.map(a => (
    <Col span={8} key={a.id}>
      <Card title={a.title} extra={<Tag color={a.statusColor}>{a.status}</Tag>}>
        <p className="desc">{a.desc}</p>
        <Statistic title="预计提升" value={a.effect} suffix={a.effectUnit} />
        <Button type="primary">{a.cta}</Button>
      </Card>
    </Col>
  ))}
</Row>
```

## 骨架代码 · Vue3

```vue
<template>
  <mtd-row :gutter="16">
    <mtd-col v-for="a in actions" :key="a.id" :span="8">
      <mtd-card class="action-card">
        <div class="card-header">
          <span class="card-title">{{ a.title }}</span>
          <mtd-tag :theme="statusThemeMap[a.status]" size="small">{{ a.statusLabel }}</mtd-tag>
        </div>
        <p class="desc">{{ a.desc }}</p>
        <mtd-statistic :title="'预计提升'" :value="a.effect" :suffix="a.effectUnit" />
        <mtd-button type="primary" @click="onAction(a)">{{ a.cta }}</mtd-button>
      </mtd-card>
    </mtd-col>
  </mtd-row>
</template>
```

## 踩坑笔记

- `Card` 的 `extra` prop（React）/ `#extra` slot（Vue）放状态 Tag。
- `Statistic` 的 `suffix` 用于单位（如 "%"），不要拼进 value 字符串。
