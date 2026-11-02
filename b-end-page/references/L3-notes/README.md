# L3 组件说明索引（L3-notes）

> **定位**：每个 L3 原子组件（MTD 组件 + AntV G2 图表）的「**准则 + 易错点**」单独成一个文件。
> 这类知识 `mtd-rag` / `antv-g2-chart` 查得到 API、却查不出“该遵守什么、容易踩什么坑”；`interaction-patterns.md` 管交互范式、`base.md`/`style-profile.md` 管视觉规范，都不覆盖。

## 检索动线（核心用法）

```
读某个 L2 模块（如 D-3 趋势图）
  → 看它的「L3 实现」列：mtd-tabs、G2 line/area …
  → 凡是带链接的 L3 组件 = 有说明文件 = 有坑/有准则
  → 点链接进对应 L3 文件，先读「准则」再排查「易错点」
```

L2 说明（`references/L2-modules/*.md`）和 `SKILL.md` 的 L2 总表里，「L3 实现」列对**有说明文件**的组件用 `[组件名](../L3-notes/组件名.md)` / `[组件名](./L3-notes/组件名.md)` 链接挂载；没说明文件的就是普通文字。

## 已有说明的 L3 组件

| L3 组件 | 类型 | 说明文件 | 被哪些 L2 用 |
|---------|------|----------|--------------|
| mtd-tabs | MTD 结构/交互 | [mtd-tabs.md](./mtd-tabs.md) | D-3 趋势多视图切换、综合驾驶舱分组 Tab |
| mtd-row | MTD 结构（栅格） | [mtd-row.md](./mtd-row.md) | D-1 指标卡片组、DT-3 详情摘要、工作台快捷入口等多列栅格布局 |

> 新增一个 L3 说明时：① 在 `L3-notes/` 建 `组件名.md`（沿用 mtd-tabs.md 的「准则 / 易错点」分区格式）；② 在本表登记一行；③ 在用到它的 L2 说明与 SKILL.md L2 总表的「L3 实现」列把该组件名改成链接。

## 命名约定

- MTD 组件：直接用标签名做文件名，如 `mtd-tabs.md`、`mtd-table.md`、`mtd-card.md`。
- G2 图表：用 `g2-` 前缀 + 图表类型，如 `g2-treemap.md`、`g2-sankey.md`、`g2-radar.md`。
- 文件名即检索锚点，便于按组件名直接 grep / 跳转。
