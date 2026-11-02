# G-4 · 数据表格（含操作栏+分页器）(Data Table)

> 操作栏(List-2) + 通用表格 + 分页器(List-3) 一体模块。操作栏承载统计信息、操作按钮，分页器承载分页导航，表格承载多行多列数据展示。**所有表格类需求一律收敛到 Table，差异全部用 props/columns 配置实现，禁止新建独立模块。** 列表页和看板页均可使用。

## 何时用
- 看板页：排名/明细/异常/清单/待处理列表
- 列表页：所有 L1 的底层表格
- 任何需要展示多行多列结构化数据的场景

---

## 布局 (ASCII)

### 完整结构（操作栏上段 + 表格 + 操作栏下段）
```
┌──────────────────────────────────────────────────────────────────────┐
│ 共筛选出 357 条数据                            [↓导出数据] [+新增]    │  ← 操作栏·上段
├──────────────────────────────────────────────────────────────────────┤
│ [□]  #   名称            数值 ▼   状态       操作                    │  ← 表头
├──────────────────────────────────────────────────────────────────────┤
│ [□]  1   商品名称A       1,234    [成功]     查看  编辑              │
│ [□]  2   商品名称B         987    [警告]     查看  编辑              │
│ [□]  3   商品名称C         756    [异常]     查看  编辑              │
│ [□]  4   商品名称D         543    [成功]     查看  编辑              │
├──────────────────────────────────────────────────────────────────────┤
│ 共 357 条                        [‹] [1][2]...[36] [›] [10条/页▾]    │  ← 操作栏·下段(分页)
└──────────────────────────────────────────────────────────────────────┘
```

### 看板版操作栏（维度切换 toolbar）
```
┌──────────────────────────────────────────────────────────────────────┐
│ [本周|本月|本季] 筛选Tabs                  [↓导出] [⚙列设置] [刷新]  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "container": {
    "background": "var(--bg-card)",
    "border_radius": "var(--radius-3)",
    "border": "none",
    "shadow": "none"
  },
  "header_row": {
    "background": "var(--bg-card-inner)",
    "text_color": "var(--text-3)",
    "font_weight": "var(--fw-semibold)",
    "font_size": "var(--fs-12)"
  },
  "body_row": {
    "hover_bg": "var(--nav-hover-bg)",
    "font_size": "var(--fs-14)"
  },
  "status_tag": {
    "success": "绿",
    "warning": "橙",
    "danger": "红",
    "info": "蓝"
  },
  "delta_colors": {
    "up": "var(--chart-up) (红) + ↑",
    "down": "var(--chart-down) (绿) + ↓"
  },
  "amount_colors": {
    "positive": "var(--color-green)",
    "negative": "var(--color-red)"
  },
  "action_link": {
    "component": "Button.Link (React) / mtd-button (Vue)",
    "type": "primary",
    "shape": "text",
    "note": "React 用 Button.Link 渲染原生 <a> 标签；Vue 用 mtd-button type=\"text\"；均不支持 size prop"
  }
}
```

---

## 列宽规则（重要）

```json
{
  "rule": "至少保留一列不设固定 width（弹性列），让它吸收剩余宽度",
  "fixed_columns": "序号(64px)、状态(100px)、操作(80~180px) 用固定 width",
  "elastic_column": "中间主体列（如名称）不设 width",
  "min_width": "需要防止列被压过窄时用 minWidth 而非 width",
  "anti_pattern": "若给每列都设固定 width 且之和 < 容器宽，右侧留白；之和 > 容器宽则横向滚动"
}
```

---

## 数据结构

```json
{
  "TableColumn": {
    "key": "string",
    "label": "string",
    "width": "number | string?",
    "minWidth": "number | string?",
    "sortable": "boolean?",
    "fixed": "'left' | 'right'?",
    "type": "'status' | 'delta' | 'amount' | 'image' | 'index'?"
  },
  "RowAction": {
    "key": "string",
    "label": "string",
    "danger": "boolean? (危险操作用 Popconfirm)"
  },
  "DataTableProps": {
    "columns": "TableColumn[]",
    "data": "Record<string, unknown>[]",
    "showIndex": "boolean?",
    "selectable": "boolean?",
    "rowActions": "RowAction[]?",
    "showPagination": "boolean?",
    "total": "number?",
    "currentPage": "number?",
    "pageSize": "number?",
    "statusThemeMap": "Record<string, string>?",
    "actionWidth": "number | string?"
  }
}
```

---

## 变体体系 (Variants)

> **核心原则**：表格类需求一律收敛到 Table，差异全部用 columns/props/slots 配置实现。
> **判断口诀**：只要「行 + 列 + 单元格」结构没变，就是同一个 Table 模块。

### 三个视觉变体（g4Variants）

示例站 `b-end-spec` 中统一定义为 `g4Variants`，所有页面（列表页 + 看板页）统一引用同一份变体定义。

| 变体 | 典型场景 | 核心特征 | 触发关键词 |
|------|---------|-----------|-----------|
| 纯文字表格 | 人员/订单/商品CRUD | 含表头操作区（标题+Radio排序+导出/新增按钮）+ 固定列 | 管理列表、XX管理、CRUD |
| 带图片列 | 商品/门店/人员 | 含表头操作区 + 首列缩略图+主副文字 | 商品、带图、门店列表 |
| 带切换tab | 需 tab 分类切换 + 表格 | 表格上方内联 G-5 切换tab（MTD Tabs + Tag 二级筛选），tab 与表格在同一个 dash-card 中 | tab切换、分类切换、状态切换 |

### 列配置变种（Presets，通过 columns 配置实现）

> 以下 6 种列配置风格通过 `columns`/`props`/`slots` 配置实现，不是独立的视觉变体，可在任意 g4Variants 变体上叠加。

| 列配置风格 | 典型场景 | 核心列特征 | 触发关键词 |
|------|---------|-----------|-----------|
| 基础管理表 | 人员/订单/商品CRUD | 文字+状态Tag+多操作 | 管理列表、XX管理 |
| 图文信息表 | 商品/门店/人员 | 缩略图+主副文字 | 商品、带图、卡片式 |
| 数据分析表 | 销量对比/指标排名 | 数值+涨跌+排序 | 数据分析、对比、涨跌 |
| 流水明细表 | 财务/结算/收支 | 时间+金额正负色 | 流水、结算、收支 |
| 日志追溯表 | 操作/变更/审计 | 时间+类型Tag+操作人 | 日志、记录、审计 |
| 排名榜单表 | Top排名/异常清单 | 序号+高亮首列 | 排名、Top、异常明细 |

### 选型决策

```
用户需求 → 表格里的"核心列"是什么？
├─ 对象+状态+操作      → 基础管理表
├─ 图片/头像+名称      → 图文信息表
├─ 数值+涨跌+排序      → 数据分析表
├─ 时间+金额正负       → 流水明细表
├─ 时间+操作类型+操作人 → 日志追溯表
└─ 排名序号+指标       → 排名榜单表
```

---

## 约束

0. **分页器与表格必须同属一个模块**：`Pagination` 放在表格所在的同一个容器（同一个 `dash-card` / 同一个 `ModuleWrapper`）内部、表格下方，禁止把分页器拆成页面级别的独立卡片单独摆放在模块外面。哪怕表格本身不分页（`pagination={false}` 关闭 Table 内置分页），也要用外置的 `<Pagination>` 组件放在同一容器内实现真分页，而不是在模块外再包一层 `dash-card`。
0.1. **需要与旁边模块（如左树导航、左侧统计面板）等高、分页器贴底时**：给 `ModuleWrapper` 传 `style={{ flex: 1, minHeight: 0 }}`，并确保这层 `flex:1/minHeight:0` 从外到内逐层传递（`ModuleWrapper` → `.dash-card` → `Table-wrapper`），表格内容区才会撑满剩余高度、分页器被推到底部而不是紧跟在最后一行下面。**同时给外层 grid/flex 容器保留一个 `minHeight` 兜底**（如 `calc(100vh - 顶导高度 - 页面上下留白)`），不要只写 `flex:1`——`flex:1` 需要祖先链存在确定高度的容器才能生效，否则整块布局会塌缩成内容自身高度，下方留出大片空白。详见 `L1-templates/page-列表页装配逻辑.md` §7.2 的踩坑记录。仅表格独占一行、不需要跟别的模块对齐高度时，不需要加这层处理。
1. 至少一列不设固定 width（弹性撑满）。
2. **Tag 颜色策略**：
   - 尺寸：一律 `size="small"` + `type="bordered"`。
   - 默认蓝色：`theme` 默认值用 `'blue'`（不是 `'gray'`），蓝色覆盖大部分正常/进行中/通用状态。
   - 颜色不超过 3 种：一张表里的 Tag 最多用 蓝(`blue`) + 绿(`green`) + 橙(`orange`) 三种。
   - **慎用红色**：`theme="red"` 仅用于极端异常（如已删除/封禁），普通的"已关店/严重落后/已下架"用橙色替代。
   - fallback 用蓝色：`statusThemeMap[val] || 'blue'`。
3. **操作用 `Button.Link`（React）或 `mtd-button type="text"`（Vue）**，禁止用 `danger` 红色按钮做常规操作（如"关店"应和"编辑""详情"同样式）。`Button.Link` 不支持 `size` prop。
3.1. **操作列按钮外观铁律（只允许文字按钮，禁止面型按钮）**：React 中 `Button.Link` 必须同时传 `type="primary"` + `shape="text"` 两个 prop——`type="primary"` 只决定文字颜色（跟随主题色），真正决定"文字链接 vs 面型按钮"外观的是 `shape="text"`；**缺少 `shape="text"` 会导致渲染成带背景色块/描边的面型按钮**，而不是纯文字链接。Vue 用 `mtd-button type="text"` 天然就是文字按钮，无需额外处理。表格操作列（编辑/详情/删除/查看等）**禁止出现任何面型按钮**，只能是纯文字链接。自检时若发现操作列按钮带背景色或边框，第一时间检查是否遗漏了 `shape="text"`。
3.2. **操作列宽度与防折行**：操作列宽度不能只取「列宽规则」给出的区间下限（80px）想当然地拍数字，要按"单个按钮最长文案字数 + 按钮间距 × (按钮数-1) + 左右 padding（约 24~32px）"估算——中文场景最长文案通常是"查看详情"/"设置权限"等 4 字词，单个文字按钮至少预留 60~70px；多个按钮并列时（如 编辑/详情/删除 三个）建议 130~160px，宁可偏宽留一点空白，也不能偏窄导致文字换行成两行破坏行高。同时给操作列的按钮容器加 `style={{ whiteSpace: 'nowrap' }}`，作为防折行兜底，即使列宽估算有误也不会撑破行高。
4. **Tag `type` 与 `theme` 严格分离**：`type` 只控制视觉样式（bordered/pure/text/pure-bordered），`theme` 控制颜色（blue/green/orange/red/gray…）。禁止把 Button 的 `type` 值（warning/danger/success/primary/grey/normal）传给 Tag。
5. 排序是真排序（computed / state）。
6. 分页真翻页。
7. 行 hover 有视觉反馈。
8. 危险操作（删除）用 Popconfirm 二次确认。
9. 操作多个时收进「更多」Dropdown。
10. 禁止用 `Button ghost` 模拟 Tag 筛选器；二级筛选用 `Tag` 组件。
11. Token 化，无硬编码色值。
12. **可点击筛选 Tag 的选中/未选中态颜色策略与交互**：两种状态都用默认矩形（不加 `shape="circle"`）。选中态用**浅色面型** `type="pure-bordered"`，`theme` 随全局主题联动（工具蓝主题用 `blue`，美团黄主题用 `yellow`，需通过 `useTheme()` 读取当前主题，不能写死）；未选中态统一用 `theme="gray"`（默认 `type="bordered"`，灰色线型标签，不需要再叠加 `pure-bordered`）。**禁止选中态使用 `type="pure"`**（该 type 实际渲染为深色纯色实底，不是浅色面型）。筛选标签必须是**真实点击交互**：用 `useState` 记录当前选中的标签，点击任意标签即切换其为选中态、其余自动回落为未选中态，**禁止用写死的数组下标（如 `idx === 0`）模拟选中效果**。

---

## 自检
- [ ] 表格组件（非 div/原生 table）
- [ ] **分页器与表格同属一个模块容器**，不拆成独立卡片
- [ ] 至少一列不设固定 width（弹性撑满）
- [ ] Tag 用 `size="small"` + `type="bordered"` + `theme`（颜色由 theme 控制，type 不控制颜色）
- [ ] Tag 默认 `theme="blue"`，fallback 也是 `'blue'`
- [ ] Tag 颜色不超过 3 种（蓝/绿/橙），不用红色
- [ ] 操作列用 `Button.Link`（React）或 `mtd-button type="text"`（Vue），不用 `danger` 红色按钮做常规操作
- [ ] `Button.Link` 同时传了 `type="primary"` + `shape="text"`，操作列渲染为纯文字按钮而非带背景色/边框的面型按钮
- [ ] 操作列宽度按最长文案（如"查看详情"4字）+ 按钮数量估算，未出现文字折行；按钮容器加了 `whiteSpace: 'nowrap'` 兜底
- [ ] 分页组件，真翻页
- [ ] 排序真排序
- [ ] 行 hover 有视觉反馈
- [ ] 禁止用 `Button ghost` 模拟 Tag 筛选器
- [ ] 筛选 Tag 选中/未选中态都用默认矩形（不加 `shape="circle"`）；选中态用 `type="pure-bordered"` + 随主题联动的 `theme`（工具蓝=`blue`，美团黄=`yellow`），未选中态用 `theme="gray"`（默认 `type="bordered"`），禁止选中态用 `type="pure"`
- [ ] 筛选 Tag 是真实点击交互（`useState` 记录选中标签 + `onClick` 切换），不是写死数组下标模拟的假选中
- [ ] Token 化，无硬编码色值

---

## MTD 实现

> MTD component library implementation details. Universal design spec in `General4-data-table.md`.

## L3 Component Mapping

| Function | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) | Props |
|----------|----------------------|--------------------------|-------|
| Table container | `mtd-table` | `<Table>` | `:data`/`data`, `@sort-change`/`onSortChange`, `useSticky`, `scroll` |
| Table column | `mtd-table-column` | `<Column>` / `columns` prop | `prop`/`dataKey`, `label`/`label`, `width`, `sortable`/`sorter`, `fixed` |
| Status tag | `mtd-tag` | `<Tag>` | `theme` = blue/green/orange/red/gray… 控制颜色；`type` = bordered/pure/text/pure-bordered 控制样式；`size="small"` |
| Action link | `mtd-button` | `<Button.Link>` | `type="primary"` + `shape="text"`（**两者缺一不可**，缺 `shape="text"` 会渲染成面型按钮而非文字链接，渲染原生 `<a>`）；不支持 `size` prop；Vue 用 `mtd-button type="text"` |
| Pagination | `mtd-pagination` | `<Pagination>` | `:total`, `@current-change`/`onChange` |
| Row selection | `type="selection"` | `rowSelection` | Batch operations |
| Empty state | `mtd-empty` | `<Empty>` | No data |
| Loading state | `mtd-loading` | `loading` prop | Wrap/built-in |

## MTD Query Commands

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Table,Tag,Button,Pagination,Input,Empty,Loading \
  --target=mtd-vue --quiet

node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Table,Tag,Button,Pagination,Input,Empty,Loading \
  --target=mtd-react --quiet
```

## Skeleton Code - Vue3

```vue
<template>
  <div class="data-table-wrapper dash-card">
    <mtd-table :data="paginatedData" style="width: 100%" @sort-change="onSort">
      <mtd-table-column v-if="showIndex" type="index" label="#" width="64" />
      <mtd-table-column v-if="selectable" type="selection" width="48" />

      <mtd-table-column
        v-for="col in columns" :key="col.key"
        :prop="col.key" :label="col.label"
        :width="col.width" :min-width="col.minWidth"
        :sortable="col.sortable"
      >
        <template #default="{ row }">
          <slot :name="`col-${col.key}`" :row="row" :col="col">
            <mtd-tag v-if="col.type === 'status'" :theme="statusThemeMap[row[col.key]]" size="small">
              {{ row[col.key] }}
            </mtd-tag>
            <span v-else-if="col.type === 'delta'" :class="row[col.key] >= 0 ? 'up' : 'down'">
              {{ row[col.key] >= 0 ? 'up' : 'down' }}{{ Math.abs(row[col.key]) }}%
            </span>
            <span v-else-if="col.type === 'amount'">
              {{ typeof row[col.key] === 'number' ? row[col.key].toFixed(2) : row[col.key] }}
            </span>
            <span v-else>{{ row[col.key] }}</span>
          </slot>
        </template>
      </mtd-table-column>

      <mtd-table-column v-if="rowActions.length" label="操作" :width="actionWidth" fixed="right">
        <template #default="{ row }">
          <mtd-button v-for="action in rowActions" :key="action.key"
            type="text" @click="$emit('row-action', action.key, row)">
            {{ action.label }}
          </mtd-button>
        </template>
      </mtd-table-column>
    </mtd-table>

    <div v-if="showPagination" class="table-pagination">
      <mtd-pagination
        :total="total" :current-page="currentPage" :page-size="pageSize"
        show-size-changer show-total
        @current-change="onPageChange" @size-change="onSizeChange"
      />
    </div>
  </div>
</template>
```

## Skeleton Code - React

> 以下为示例站 `b-end-spec/src/components/G4DataTable.tsx` 中的真实写法，列配置用 `render` 回调 + `label`/`dataKey`，`Tag` 用 `theme` + `type="bordered"`。**分页器 `<Pagination>` 必须放在表格所在的同一个容器（`dash-card`）内、表格下方**，不要拆到模块外面单独包一层卡片。

```tsx
import { useState } from 'react'
import { Button, Pagination, Radio, Select, Table, Tag } from '@ss/mtd-react3'

/* Tag 颜色策略：默认蓝色，仅用蓝/橙两种，不使用红色 */
const statusThemeMap: Record<string, string> = {
  '营业中': 'blue', '装修中': 'orange', '筹备中': 'blue', '已关店': 'orange',
}

const columns = [
  { label: '门店', dataKey: 'name', width: 160, fixed: 'left',
    render: (_val: string, row: any) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.name}</div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{row.id}</div>
      </div>
    ) },
  { label: '城市', dataKey: 'city', width: 80 },   // 弹性/固定宽度业务列
  { label: '月营收', dataKey: 'revenue', width: 100 },
  { label: '状态', dataKey: 'status', width: 90,
    render: (val: string) => (
      <Tag theme={statusThemeMap[val] || 'blue'} type="bordered" size="small">{val}</Tag>
    ) },
  { label: '操作', dataKey: 'action', width: 140, fixed: 'right',
    render: () => (
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <Button.Link type="primary" shape="text">编辑</Button.Link>
        <Button.Link type="primary" shape="text">详情</Button.Link>
        <Button.Link type="primary" shape="text">关店</Button.Link>
      </span>
    ) },
]

function DataTableModule() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="dash-card">
      <Table columns={columns} data={rows} rowKey="key" pagination={false} useSticky scroll={{ x: 1400 }} />
      {/* 分页器与表格同属一个 dash-card，不单独拆卡片 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--gap-module)' }}>
        <Pagination current={current} total={rows.length} pageSize={10} onChange={setCurrent} showTotal showJumper />
      </div>
    </div>
  )
}
```

> **⚠️ React Prop 命名注意**: MTD React3 的 Table 列配置使用 `label`（表头文字）和 `dataKey`（字段映射），而非 `title`/`dataIndex`；单元格自定义渲染用 `render(val, row)` 回调，而非 slot。数据通过 `data` prop 传入，非 `dataSource`。`Tag` 用 `theme`（blue/green/orange，慎用 red）+ `type="bordered"` + `size="small"`，而非 `color`。

## 变体示例（React，来自示例站 `b-end-spec`）

> G-4 数据表格在示例站 `b-end-spec/src/components/G4DataTable.tsx` 中统一定义为 `g4Variants`，共 3 个变体：**纯文字表格 / 带图片列 / 带切换tab**。所有页面（列表页 + 看板页）统一引用同一份变体定义，保证结构一致。以下为真实 React 代码。

### 变体一：纯文字表格（含表头操作区 + 固定列）

标识列固定左侧（`fixed: 'left'`），操作列固定右侧（`fixed: 'right'`），中间业务列水平滚动；表头右侧带 `Radio.Group` 排序切换 + 导出/新增按钮；**表格下方内置 `<Pagination>`，与表格同属一个 `dash-card`**。

```tsx
/* Tag 颜色策略：默认蓝色，仅用蓝/橙两种，不使用红色 */
const statusThemeMap: Record<string, string> = {
  '营业中': 'blue', '装修中': 'orange', '筹备中': 'blue', '已关店': 'orange',
}

const detailTableColumns = [
  { label: '门店', dataKey: 'name', width: 140, fixed: 'left',
    render: (_val: string, row: any) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.name}</div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{row.id}</div>
      </div>
    ) },
  { label: '城市', dataKey: 'city', width: 80 },
  { label: '区域', dataKey: 'region', width: 90 },
  { label: '面积', dataKey: 'area', width: 80 },
  { label: '品牌', dataKey: 'brand', width: 100 },
  { label: '月营收', dataKey: 'revenue', width: 100 },
  { label: '开业日期', dataKey: 'openDate', width: 110 },
  { label: '合同类型', dataKey: 'contract', width: 90 },
  { label: '店长', dataKey: 'manager', width: 80 },
  { label: '状态', dataKey: 'status', width: 90,
    render: (val: string) => <Tag theme={statusThemeMap[val] || 'blue'} type="bordered" size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 140, fixed: 'right',
    render: () => (
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <Button.Link type="primary" shape="text">编辑</Button.Link>
        <Button.Link type="primary" shape="text">详情</Button.Link>
        <Button.Link type="primary" shape="text">关店</Button.Link>
      </span>
    ) },
]

function TextTableVariant() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="dash-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--gap-module)' }}>
        <span style={{ fontSize: 'var(--fs-14)', fontWeight: 500, color: 'var(--text-1)' }}>门店明细</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-elem)' }}>
          <Radio.Group defaultValue="revenue" size="small">
            <Radio.Button value="revenue">按月营收</Radio.Button>
            <Radio.Button value="openDate">按开业日期</Radio.Button>
            <Radio.Button value="area">按面积</Radio.Button>
          </Radio.Group>
          <Button size="small" icon="export-o">导出</Button>
          <Button size="small" type="primary" icon="add">新增门店</Button>
        </div>
      </div>
      <Table columns={detailTableColumns} data={detailTableData} rowKey="key" pagination={false} useSticky scroll={{ x: 1400 }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--gap-module)' }}>
        <Pagination current={current} total={detailTableData.length} pageSize={10} onChange={setCurrent} showTotal showJumper />
      </div>
    </div>
  )
}
```

### 变体二：带图片列（图文信息）

首列用 `render` 组合缩略图 + 名称 + 副信息（城市），缩略图 36×36 圆角 `--radius-3`。**同样在 `dash-card` 内、表格下方内置 `<Pagination>`。**

```tsx
const storeColumns = [
  { label: '门店', dataKey: 'name', width: 180,
    render: (_val: string, row: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={row.img} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: 'var(--bg-card-inner)' }} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 'var(--fs-14)' }}>{row.name}</div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{row.city}</div>
        </div>
      </div>
    ) },
  { label: '面积', dataKey: 'area', width: 100 },
  { label: '月营收', dataKey: 'revenue', width: 120 },
  { label: '状态', dataKey: 'status', width: 100,
    render: (val: string) => <Tag theme={val === '营业中' ? 'blue' : 'orange'} type="bordered" size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 120,
    render: () => (
      <span style={{ display: 'inline-flex', gap: 8 }}>
        <Button.Link type="primary" shape="text">详情</Button.Link>
        <Button.Link type="primary" shape="text">编辑</Button.Link>
      </span>
    ) },
]

function ImageTableVariant() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="dash-card">
      <Table columns={storeColumns} data={storeData} rowKey="key" pagination={false} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--gap-module)' }}>
        <Pagination current={current} total={storeData.length} pageSize={10} onChange={setCurrent} showTotal showJumper />
      </div>
    </div>
  )
}
```

### 变体三：带切换tab（内联 G-5 Tabs + Tag 二级筛选 + Table）

表格上方内联了 G-5 切换tab 功能——MTD Tabs 做一级分类切换，下方一排 `Tag` 做二级筛选（默认矩形，不加 `shape="circle"`；选中态 `type="pure-bordered"` 浅色面型，`theme` 随全局主题联动：工具蓝主题用 `blue`，美团黄主题用 `yellow`；未选中态 `theme="gray"`，默认 `type="bordered"`，灰色线型标签），再接 Table。筛选标签必须是**真实可点击交互**：用 `useState` 记录当前选中的标签，点击任意标签即把它设为选中态（有颜色），其余标签自动回落为未选中态（灰色线型），不能用写死的数组下标（如 `idx === 0`）模拟"选中"效果。Tab、筛选标签、表格和分页器都在同一个 `.dash-card` 中，无需独立 G-5 模块，也不单独拆分页卡片。

> ⚠️ **`type="pure"` 陷阱**：MTD Tag 的 `type="pure"` 实际渲染效果是**深色纯色实底**（`background-color` 直接取该 `theme` 的实色，如蓝色即 `#166FF7` 实底白字），并不是视觉上的"浅色面型"；真正的浅色面型（浅底 + 浅色细边框 + 深色文字，如 6% 透明度底色 + 10% 透明度边框）对应的是 `type="pure-bordered"`。因此筛选标签的选中态**必须使用 `type="pure-bordered"`**，**禁止用 `type="pure"` 表达选中态**，否则会渲染成一个突兀的深色色块。
>
> ⚠️ **选中态强调色随主题联动**：筛选标签的选中态不能固定写死 `theme="blue"`，需用 `useTheme()` 读取当前全局主题，工具蓝主题下用 `theme="blue"`，美团黄主题下用 `theme="yellow"`（MTD Tag 原生支持 `yellow` 预设色，`pure-bordered` 下为浅黄底+黄字+浅黄边框，与品牌色呼应）。
>
> ⚠️ **形状**：两种状态都用默认矩形（不加 `shape="circle"`），保持与页面其它矩形圆角元素（按钮、输入框等）视觉一致；不要给筛选标签额外加胶囊形状。
>
> ⚠️ **必须是真交互，不能是假选中**：筛选标签禁止用写死的数组下标（如 `.map((label, idx) => idx === 0 ? 选中样式 : 未选中样式)`）模拟选中态——这样点击任何标签都不会有反馈，是无效交互。正确做法是用 `useState` 保存当前选中的标签（如 `activeFilter`），每个 `Tag` 都绑定 `onClick={() => setActiveFilter(label)}`，再用 `label === activeFilter` 判断该标签是否渲染为选中态。

```tsx
function TabTableVariant() {
  const [current, setCurrent] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const [activeFilter, setActiveFilter] = useState('全部业务线')
  const { theme } = useTheme()
  // 选中态强调色随全局主题联动：工具蓝主题用 blue，美团黄主题用 yellow。
  const activeTagTheme = theme === 'brand-yellow' ? 'yellow' : 'blue'

  // 每个 tab 共享筛选+表格结构，数据按 activeTab 过滤（示例中简化为同一份数据）
  const renderTabContent = () => (
    <>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingBottom: 12, flexWrap: 'wrap' }}>
        {/* 选中态：浅色面型 type="pure-bordered"，theme 随主题联动（工具蓝=blue，美团黄=yellow）。
            未选中态：theme="gray"（默认 type="bordered"，灰色线型标签）。
            两种状态都用默认矩形（不加 shape="circle"）。
            真实点击交互：activeFilter 记录当前选中的标签文案，点击时 setActiveFilter(label)，
            被点击的标签变为选中态，其余标签自动回落为未选中态。
            禁止选中态用 type="pure"（会渲染成深色实底，见上方陷阱说明），
            也禁止用写死的数组下标模拟选中态（见上方"真交互"说明）。 */}
        {['全部业务线', '到店', '外卖', '酒旅', '买菜', '优选'].map((label) => (
          label === activeFilter ? (
            <Tag
              key={label}
              type="pure-bordered"
              theme={activeTagTheme}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter(label)}
            >
              {label}
            </Tag>
          ) : (
            <Tag
              key={label}
              theme="gray"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter(label)}
            >
              {label}
            </Tag>
          )
        ))}
      </div>
      <Table columns={detailTableColumns} data={detailTableData} rowKey="key" pagination={false} useSticky scroll={{ x: 1400 }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--gap-module)' }}>
        <Pagination current={current} total={detailTableData.length} pageSize={10} onChange={setCurrent} showTotal showJumper />
      </div>
    </>
  )

  return (
    <div className="dash-card dash-card--tab-table">
      {/* ⚠️ Tabs 间距修正（来自 L3-notes/mtd-tabs.md）：
         dash-card--tab-table 上内边距归零，让 tab 文字自身约 9px 的居中空隙近似等于左 padding(8px)，
         避免「顶部留白明显比左侧大」的视觉问题。 */}
      {/* ⚠️ Table 必须放在 TabPane 内部（而非 Tabs 的兄弟元素），
         否则 .mtd-prime-tabs-content 空容器会在 tab 栏和表格之间撑出空白间距。
         详见 L3-notes/mtd-tabs.md「Tabs + Table 组合时空白间距」。 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ paddingTop: 12, width: '100%' }}>
        <Tabs.TabPane key="all" label="全部">
          {renderTabContent()}
        </Tabs.TabPane>
        <Tabs.TabPane key="achieved" label="已达成">
          {renderTabContent()}
        </Tabs.TabPane>
        <Tabs.TabPane key="in_progress" label="进行中">
          {renderTabContent()}
        </Tabs.TabPane>
        <Tabs.TabPane key="behind" label="落后">
          {renderTabContent()}
        </Tabs.TabPane>
        <Tabs.TabPane key="critical" label="严重落后">
          {renderTabContent()}
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}
```

> MTD React3 的 `Tabs` 用 `activeKey` + `onChange` 做受控切换（若无需受控可用 `defaultActiveKey`），`TabPane` 用 `label`（非 `tab`）。**Table、Tag 筛选行、Pagination 必须放在 `TabPane` 内部**（而非 Tabs 的兄弟元素），否则 `.mtd-prime-tabs-content` 空容器会在 tab 栏和表格之间撑出空白间距（详见 `L3-notes/mtd-tabs.md`）。MTD Tabs 切换机制为 `display:none`（非 `v-if`），所有 TabPane 同时存在于 DOM，不销毁重建，因此共享 `renderTabContent` 不会触发重复挂载。第二行筛选标签用 `Tag` 组件，两种状态都用默认矩形（不加 `shape="circle"`）；选中态用 `type="pure-bordered"` + 随主题联动的 `theme`（工具蓝=`blue`，美团黄=`yellow`），未选中态用 `theme="gray"`（默认 `type="bordered"`），与 tab 行之间留 `marginTop: 12` 间距。筛选标签必须用 `useState` 实现真实点击选中交互（点击哪个哪个就变成选中态，其余自动回落），不能用写死的数组下标模拟。禁止用 `Button ghost` 模拟 Tag 外观，也禁止用 `type="pure"` 表达选中态（见上方陷阱说明）。需要从 `../theme/useTheme`（或项目对应的主题 hook 路径）导入 `useTheme`，确保该组件在 `<ThemeProvider>` 内部渲染。
>
> ⚠️ **Tabs 间距修正（必须遵循 `L3-notes/mtd-tabs.md`）**：变体三的容器 padding 全部归零（`.dash-card--tab-table { padding: 0 }`），间距完全由 Tabs 组件和 TabPane 内部内容自行控制。Tabs 加 `style={{ paddingTop: 12, width: '100%' }}` 控制顶部留白，TabPane 内部的 Tag 筛选行和 Table 自带的 margin/padding 控制其余间距。对应的 CSS：
> ```css
> .dash-card--tab-table { padding: 0; }
> ```

### 变体统一导出

```tsx
export const g4Variants = [
  { name: '纯文字表格', render: () => <TextTableVariant /> },
  { name: '带图片列', render: () => <ImageTableVariant /> },
  { name: '带切换tab', render: () => <TabTableVariant /> },
]
```

> **约束**：三种变体共用同一份 `g4Variants` 定义，任何页面（列表页/看板页）只 import 不重写，确保跨页面结构完全一致。状态 `Tag` 一律用 `theme` + `type="bordered"` + `size="small"`，默认蓝色、不超过 3 种颜色、慎用红色；固定列必须 `fixed` + `useSticky` + `scroll={{ x }}` 三件套齐全；**`<Pagination>` 必须内置在每个变体的 `dash-card` 内、表格下方，页面侧引用 `g4Variants` 时不再额外包裹独立的分页器卡片**。

## Fixed Columns（固定列 / Sticky Columns）

当表格列数多、总宽度超出容器可视区域时，需要将标识列（如工号、姓名）固定在左侧，操作列（如编辑/删除按钮、状态）固定在右侧，中间区域水平滚动。

### 触发条件

- 列数 ≥ 8 列，或列宽总和 > 容器宽度
- 页面包含 CRUD 操作列（编辑/详情/删除等）

### 实现三要素（缺一不可）

| 要素 | 说明 |
|------|------|
| `fixed: 'left'\|'right'` | 列配置中指定固定方向 |
| `useSticky` | Table 组件必须添加此 prop 开启 sticky 定位 |
| `scroll={{ x: number }}` | 设置表格横向滚动宽度，必须 ≥ 所有列 width 之和 |

### 固定列分配规则

| 位置 | 固定列 | 说明 |
|------|--------|------|
| Left | 前 1~2 列（标识列） | 如：ID/工号、姓名/名称 |
| Right | 末 1~2 列（操作列） | 如：状态 Tag、操作按钮组 |
| 中间 | 不固定 | 业务信息列，水平可滚动 |

### React 示例

```tsx
const columns = [
  // ─── Fixed Left: 标识列 ───
  { label: '工号', dataKey: 'id', width: 120, fixed: 'left' },
  { label: '姓名', dataKey: 'name', width: 100, fixed: 'left' },

  // ─── 滚动区域: 业务列 ───
  { label: '手机号', dataKey: 'phone', width: 140 },
  { label: '部门', dataKey: 'dept', width: 100 },
  { label: '角色', dataKey: 'role', width: 130 },
  { label: '入职日期', dataKey: 'joinDate', width: 120 },

  // ─── Fixed Right: 状态 + 操作 ───
  { label: '状态', dataKey: 'status', width: 100, fixed: 'right',
    render: (status: string) => <Tag theme={statusMap[status]} type="bordered" size="small">{status}</Tag> },
  { label: '操作', dataKey: 'action', width: 150, fixed: 'right',
    render: (_: unknown, row: any) => (
      <span style={{ display: 'flex', gap: '4px' }}>
        <Button.Link type="primary" shape="text">编辑</Button.Link>
        <Button.Link type="primary" shape="text">详情</Button.Link>
        <Button.Link type="primary" shape="text">删除</Button.Link>
      </span>
    ) },
]

<Table
  columns={columns}
  data={tableData}
  rowKey="id"
  pagination={false}
  useSticky
  scroll={{ x: 1680 }}
/>
```

### Vue3 示例

```vue
<mtd-table :data="tableData" style="width: 100%" use-sticky :scroll="{ x: 1680 }">
  <mtd-table-column prop="id" label="工号" width="120" fixed="left" />
  <mtd-table-column prop="name" label="姓名" width="100" fixed="left" />
  <!-- 中间滚动列 -->
  <mtd-table-column prop="phone" label="手机号" width="140" />
  <mtd-table-column prop="dept" label="部门" width="100" />
  <!-- ... -->
  <mtd-table-column prop="status" label="状态" width="100" fixed="right">
    <template #default="{ row }">
      <mtd-tag :theme="statusMap[row.status]" type="bordered" size="small">{{ row.status }}</mtd-tag>
    </template>
  </mtd-table-column>
  <mtd-table-column label="操作" width="150" fixed="right">
    <template #default="{ row }">
      <mtd-button type="text">编辑</mtd-button>
      <mtd-button type="text">详情</mtd-button>
      <mtd-button type="text">删除</mtd-button>
    </template>
  </mtd-table-column>
</mtd-table>
```

### 常见问题

- **固定列不生效**: 必须同时设置 `useSticky` + `scroll.x`，仅设 `fixed` 不起作用
- **scroll.x 的值**: 取所有列 width 之和，或稍大一些留出余量
- **固定列层级**: 固定列通过 CSS `position: sticky` 实现，自动提升 z-index
- **弹性列搭配**: 若所有列都设了 width 且总和 < scroll.x，会有空白区域；可以保留一列不设 width 做弹性填充

## Interaction Patterns

- Column sort: `sortable` prop (computed real sort)
- Pagination: real page change (computed slice)
- Row selection: `type="selection"` with batch action linkage
- Multiple actions: collapse into "More" Dropdown
- Danger actions (delete): use Popconfirm for confirmation
- Empty state: `mtd-empty`
- Loading: `mtd-loading`
- Feedback: `Message` (Vue: named import from `@ss/mtd-vue3`; React: from `@ss/mtd-react3`)

## Pitfall Notes

- MTD Table default behavior: if every column has fixed `width` and sum < container width, the table won't fill and leaves white space on the right. Always keep at least one elastic column without fixed width.
- Use `minWidth` instead of `width` for columns that need a minimum but should be flexible.
- Index/status/action columns use fixed width; main content columns stay elastic.
- `sort-change` event provides `{ prop, order }` - order is `'ascending'|'descending'|null`.
- **React3 prop 命名**: 列配置用 `label` + `dataKey`（非 `title`/`dataIndex`）；表格数据用 `data`（非 `dataSource`）。
- **Tag type vs theme**: `type` 只控制样式（bordered/pure/text/pure-bordered），`theme` 控制颜色（blue/green/orange/red/gray/yellow/brown/purple/lightgray）。禁止把 Button 的 `type` 枚举（warning/danger/success/primary/grey/normal）传给 Tag。
- **Button.Link 限制**: React 中操作列链接用 `Button.Link`（渲染 `<a>`），支持 `type` + `shape` + `href` 等原生 `<a>` 属性，但**不支持 `size`/`hoverShape`/`rightIcon`/`ghost`/`dashed`** 等 Button 专属属性。**`shape="text"` 必须显式传，不是默认值**——只传 `type="primary"` 不传 `shape="text"` 会渲染成带背景色的面型按钮，而不是文字链接，表格操作列出现面型按钮基本都是这个原因。
- **操作列文字折行**: 操作列宽度只按区间下限（80px）取值、或未按最长文案预留宽度时，"查看详情"等 4 字文案会在单元格内换行成两行，撑高整行高度。给操作列宽度按文案长度留足余量（多按钮并列建议 130~160px），并给按钮容器加 `whiteSpace: 'nowrap'` 兜底。
- **禁止 ghost Button 模拟 Tag**: 筛选/标签类 UI 一律用 `Tag` 组件，不用 `Button ghost type="primary"` 冒充标签外观。
- **固定列三件套**: `fixed` 字段 + `useSticky` prop + `scroll={{ x }}` 缺一不可，否则固定列不生效。
- **scroll.x 计算**: 推荐取所有列 `width` 之和再加 20~50px 余量，避免最后一列紧贴边缘。
