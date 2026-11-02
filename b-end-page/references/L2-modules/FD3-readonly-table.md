# FD3 · 只读数据表格（ReadonlyTable）

> **一句话定位**：在表单页/详情页中展示关联的只读数据列表，不可编辑。与可编辑表格（Form5）的区别：纯展示，无新增/删除行按钮，无行内编辑控件。

---

## 一、何时用

- 在表单页/详情页中展示关联的只读数据列表（合同列表、关联记录、明细等），不可编辑、无增删行。
- 当 prompt 提到关联数据 / 只读列表 / 合同列表 / 明细表 / 记录表时使用。
- 所有只读表格类需求一律收敛到 G3，差异用 columns 配置实现。
- 与可编辑表格（Form5）的区别：纯展示，无新增/删除行按钮，无行内编辑控件。

## 二、布局

- **表头**：浅灰背景（`#fafafa`），文字次要色（`rgba(17, 25, 37, 0.45)`），字号 12px，`font-weight: 600`，`white-space: nowrap` 防换行。
- **行样式**：正文色（`#1f2329`），字号 14px，行高 48px（默认）。行 hover 背景色 `#f5f6f7`，提供视觉反馈。
- **边框**：推荐 `bordered="row"`（仅行边框），视觉简洁。
- **空状态**：无数据时展示 MTD `<Empty>` 组件，居中显示，`padding: 48px 0`。
- **分页**：表格下方右侧放 `<Pagination>` 组件，`showTotal` 显示总数，`showSizeChanger` 支持切换每页条数。
- **操作列**：最多一个"查看"链接，蓝色主色调，纯文字，不用按钮组件。

```Plain
┌────────────────────────────────────────────────────────────────┐
│ 名称                     类型         创建时间       状态  操作 │ ← 浅灰表头，12px 次要色，不换行
├────────────────────────────────────────────────────────────────┤
│ 合同 A                   租赁         2024-01-15    [生效] 查看 │ ← 48px 数据行，状态用 Tag
├────────────────────────────────────────────────────────────────┤
│ 合同 B                   采购         2024-01-16    [失效] 查看 │ ← 纯文本 / Tag / 查看链接，无编辑控件
├────────────────────────────────────────────────────────────────┤
│ 合同 C                   租赁         2024-01-17    [草稿] 查看 │ ← 行 hover 显示浅灰反馈
├────────────────────────────────────────────────────────────────┤
│                                               共 50 条  ‹ 1 2 3 › │ ← 表格下方右侧分页
└────────────────────────────────────────────────────────────────┘
  ← 名称列为弹性列撑满余宽；状态 Tag 与操作列使用固定宽度
```

---

## 三、可配参数

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| columns | 列定义数组，每项含 `label`/`dataKey`/`width`/`render` 等 | — |
| data | 数据源数组 | — |
| rowKey | 行唯一标识字段名 | `'id'` |
| bordered | 边框模式：`'row'`（行边框）/ `'all'`（全边框）/ `false` | `'row'` |
| pagination | 是否显示分页 | `true` |
| sortable | 列是否可排序（`sortable: true` 在列配置中指定） | `false` |
| fixedColumns | 是否启用固定列（标识列固定左、操作列固定右） | `false` |
| emptyText | 空状态文案 | `'暂无数据'` |

### 3.1 列宽规则

> **核心原则**：至少保留一列不设固定 `width`（弹性列），让它吸收剩余宽度。

```tsx
// ✅ 正确：名称列不设 width，自动弹性撑满
const columns = [
  { label: '序号', dataKey: 'index', width: 64 },
  { label: '名称', dataKey: 'name' },           // ← 弹性列，不设 width
  { label: '类型', dataKey: 'type', width: 100 },
  { label: '状态', dataKey: 'status', width: 90 },
  { label: '操作', dataKey: 'action', width: 80 },
];

// ❌ 错误：每列都设了固定 width，总和 < 容器宽时右侧留白
const badColumns = [
  { label: '序号', dataKey: 'index', width: 64 },
  { label: '名称', dataKey: 'name', width: 120 },  // ← 不应固定
  { label: '类型', dataKey: 'type', width: 100 },
  { label: '状态', dataKey: 'status', width: 90 },
  { label: '操作', dataKey: 'action', width: 80 },
];
```

- **固定宽度列**：序号（64px）、状态（90~100px）、操作（80~120px）。
- **弹性列**：中间主体列（如名称）不设 `width`。
- **最小宽度**：需要防止列被压过狭窄时用 `minWidth` 而非 `width`。

### 3.2 固定列（Sticky Columns）

当列数多、总宽度超出容器可视区域时，将标识列固定在左侧，操作列固定在右侧，中间区域水平滚动。

#### 触发条件

- 列数 ≥ 8 列，或列宽总和 > 容器宽度

#### 实现三要素（缺一不可）

| 要素 | 说明 |
|------|------|
| `fixed: 'left' \| 'right'` | 列配置中指定固定方向 |
| `useSticky` | Table 组件必须添加此 prop 开启 sticky 定位 |
| `scroll={{ x: number }}` | 设置表格横向滚动宽度，必须 ≥ 所有列 width 之和 |

#### 固定列分配规则

| 位置 | 固定列 | 说明 |
|------|--------|------|
| Left | 前 1~2 列（标识列） | 如：ID/工号、姓名/名称 |
| Right | 末 1~2 列（操作列） | 如：状态 Tag、查看链接 |
| 中间 | 不固定 | 业务信息列，水平可滚动 |

#### React 固定列示例

```tsx
const columns = [
  // ─── Fixed Left: 标识列 ───
  { label: '编号', dataKey: 'id', width: 120, fixed: 'left' },
  { label: '名称', dataKey: 'name', width: 160, fixed: 'left' },

  // ─── 滚动区域: 业务列 ───
  { label: '类型', dataKey: 'type', width: 100 },
  { label: '金额', dataKey: 'amount', width: 120 },
  { label: '日期', dataKey: 'date', width: 120 },
  { label: '备注', dataKey: 'remark' },  // ← 弹性列

  // ─── Fixed Right: 状态 + 操作 ───
  { label: '状态', dataKey: 'status', width: 100, fixed: 'right',
    render: (val: string) => <Tag theme={statusMap[val] || 'gray'} type="bordered" size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 80, fixed: 'right',
    render: (_: unknown, row: any) => <a onClick={() => handleView(row)}>查看</a> },
];

<Table
  columns={columns}
  data={tableData}
  rowKey="id"
  bordered="row"
  pagination={false}
  useSticky
  scroll={{ x: 1000 }}
/>
```

#### Vue3 固定列示例

```vue
<mtd-table :data="tableData" row-key="id" use-sticky :scroll="{ x: 1000 }">
  <mtd-table-column prop="id" label="编号" width="120" fixed="left" />
  <mtd-table-column prop="name" label="名称" width="160" fixed="left" />
  <!-- 中间滚动列 -->
  <mtd-table-column prop="type" label="类型" width="100" />
  <mtd-table-column prop="amount" label="金额" width="120" />
  <mtd-table-column prop="remark" label="备注" />
  <!-- 固定右列 -->
  <mtd-table-column prop="status" label="状态" width="100" fixed="right">
    <template #default="{ row }">
      <mtd-tag :theme="statusMap[row.status]" size="small">{{ row.status }}</mtd-tag>
    </template>
  </mtd-table-column>
  <mtd-table-column label="操作" width="80" fixed="right">
    <template #default="{ row }">
      <a @click="handleView(row)">查看</a>
    </template>
  </mtd-table-column>
</mtd-table>
```

---

## 四、变体

> **核心原则**：只读表格类需求一律收敛到 G3，差异全部用 columns 配置实现。只要「行 + 列 + 单元格」结构没变，就是同一个 G3 模块。

| 变种 | 典型场景 | 核心列特征 | 触发关键词 |
|------|---------|-----------|-----------|
| 基础信息表 | 关联记录、合同列表 | 文字 + 状态 Tag + 查看链接 | 关联数据、合同列表 |
| 图文信息表 | 商品关联、门店关联 | 缩略图 + 主副文字 | 带图、商品关联 |
| 明细数据表 | 运力明细、费用明细 | 数值 + 涨跌/正负色 | 明细、数值对比 |
| 日志记录表 | 操作记录、变更记录 | 时间 + 类型 Tag + 操作人 | 日志、记录、审计 |
| 排名列表表 | Top 排名、异常清单 | 序号 + 高亮首列 | 排名、Top、异常 |

### 选型决策

```
用户需求 → 表格里的"核心列"是什么？
├─ 对象 + 状态 + 查看      → 基础信息表
├─ 图片/头像 + 名称        → 图文信息表
├─ 数值 + 涨跌/正负        → 明细数据表
├─ 时间 + 操作类型 + 操作人 → 日志记录表
└─ 排名序号 + 指标         → 排名列表表
```

### 变体一：基础信息表（文字 + 状态 Tag + 查看链接）

```tsx
import { Table, Tag } from '@ss/mtd-react3';

const statusMap: Record<string, string> = {
  active: 'green', inactive: 'red', draft: 'gray', pending: 'orange',
};

const columns = [
  { label: '名称', dataKey: 'name' },
  { label: '类型', dataKey: 'type', width: 100 },
  { label: '创建时间', dataKey: 'createdAt', width: 140 },
  { label: '状态', dataKey: 'status', width: 100,
    render: (val: string) => <Tag theme={statusMap[val] || 'gray'} type="bordered" size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 80,
    render: (_: unknown, row: any) => <a onClick={() => handleView(row)}>查看</a> },
];

<Table columns={columns} data={data} rowKey="id" bordered="row" />
```

### 变体二：图文信息表（缩略图 + 主副文字）

```tsx
const columns = [
  { label: '商品', dataKey: 'name', width: 240,
    render: (_: string, row: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={row.img} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
        <div>
          <div style={{ fontWeight: 500 }}>{row.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-4)' }}>{row.sku}</div>
        </div>
      </div>
    ) },
  { label: '数量', dataKey: 'qty', width: 80 },
  { label: '状态', dataKey: 'status', width: 100,
    render: (val: string) => <Tag theme={val === '正常' ? 'green' : 'orange'} type="bordered" size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 80,
    render: (_: unknown, row: any) => <a onClick={() => handleView(row)}>查看</a> },
];

<Table columns={columns} data={data} rowKey="id" bordered="row" />
```

### 变体三：明细数据表（数值 + 涨跌色）

```tsx
const columns = [
  { label: '日期', dataKey: 'date', width: 120 },
  { label: '项目', dataKey: 'item' },
  { label: '金额', dataKey: 'amount', width: 120,
    render: (val: number) => (
      <span style={{ color: val >= 0 ? 'var(--color-green)' : 'var(--color-red)', fontWeight: 500 }}>
        {val >= 0 ? '+' : ''}{val.toFixed(2)}
      </span>
    ) },
  { label: '变动', dataKey: 'delta', width: 100,
    render: (val: number) => (
      <span style={{ color: val >= 0 ? 'var(--color-red)' : 'var(--color-green)' }}>
        {val >= 0 ? '↑' : '↓'}{Math.abs(val)}%
      </span>
    ) },
  { label: '操作', dataKey: 'action', width: 80,
    render: (_: unknown, row: any) => <a onClick={() => handleView(row)}>查看</a> },
];

<Table columns={columns} data={data} rowKey="id" bordered="row" />
```

---

## 五、约束

1. 至少一列不设固定 `width`（弹性撑满），避免右侧留白。
2. 状态列用 `<Tag>` + 正确 `theme` 映射（green/orange/red/gray/blue）。
3. 操作列用纯文字链接（`<a>`），不用按钮组件；只读表格操作列最多一个"查看"链接。
4. 排序是真排序（computed / state），不是仅 UI 高亮。
5. 分页真翻页，`onChange` 回调中重新请求数据。
6. 行 hover 有视觉反馈。
7. Token 化，无硬编码色值。
8. 与表单区混排时，只读表格必须放在 `<Form className="section-form">` 外部、与 `<Form>` 平级，避免被栅格分栏限宽；表格数据通过独立 state 管理。
9. 与可编辑表格（Form5）的区别：G3 无新增/删除行按钮，无行内编辑控件，列内容全部为纯文本或 Tag/链接等只读元素。

---

## 六、L3 组件映射与 MTD 查询

### 6.1 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) | 关键 Props |
|------|--------------------------|----------------------|------------|
| 表格 | `<Table>` | `<mtd-table>` | `columns` / `data` / `rowKey` / `bordered` / `useSticky` / `scroll` |
| 列定义 | `columns` prop 中的对象 | `<mtd-table-column>` 子组件 | `label` / `dataKey`(`prop`) / `width` / `minWidth` / `sortable` / `fixed` / `render` |
| 分页 | `<Pagination>` | `<mtd-pagination>` | `current` / `pageSize` / `total` / `onChange` / `showSizeChanger` / `showTotal` |
| 状态标签 | `<Tag>` | `<mtd-tag>` | `theme` (`green` / `orange` / `red` / `gray` / `blue` 等), `type` (`bordered`), `size` (`small` / `normal`) |
| 空状态 | `<Empty>` | `<mtd-empty>` | 无数据时展示 |
| 加载态 | `loading` prop | `<mtd-loading>` | 数据加载中 |

### 6.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Table,Pagination,Tag,Empty --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Table,Pagination,Tag,Empty --target=mtd-vue --quiet
```

---

## 七、代码骨架

### 7.1 只读表格 · React（完整版，含分页）

```tsx
import { useState } from 'react';
import { Table, Pagination, Tag, Empty } from '@ss/mtd-react3';

const statusMap: Record<string, { label: string; theme: 'green' | 'orange' | 'red' | 'gray' }> = {
  active: { label: '生效', theme: 'green' },
  inactive: { label: '失效', theme: 'red' },
  draft: { label: '草稿', theme: 'gray' },
  pending: { label: '待审核', theme: 'orange' },
};

const columns = [
  { label: '名称', dataKey: 'name' },
  { label: '类型', dataKey: 'type', width: 100 },
  { label: '创建时间', dataKey: 'createdAt', width: 140 },
  { label: '状态', dataKey: 'status', width: 100,
    render: (val: string) => {
      const info = statusMap[val] || { label: val, theme: 'gray' as const };
      return <Tag theme={info.theme} type="bordered" size="small">{info.label}</Tag>;
    } },
  { label: '操作', dataKey: 'action', width: 80,
    render: (_: unknown, record: any) => (
      <a onClick={() => handleView(record)}>查看</a>
    ) },
];

export default function ReadonlyTableSection() {
  const [dataSource] = useState([
    { id: '1', name: '合同A', type: '租赁', createdAt: '2024-01-15', status: 'active' },
    { id: '2', name: '合同B', type: '采购', createdAt: '2024-01-16', status: 'inactive' },
    { id: '3', name: '合同C', type: '租赁', createdAt: '2024-01-17', status: 'draft' },
  ]);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const total = 50;

  const handleView = (record: any) => {
    console.log('查看详情:', record);
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
    // 重新请求数据
  };

  return (
    <div className="readonly-table">
      <Table
        columns={columns}
        data={dataSource}
        rowKey="id"
        bordered="row"
        emptyText="暂无关联数据"
      />
      <div className="readonly-table__pagination">
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger
          showTotal
        />
      </div>
    </div>
  );
}
```

### 7.2 只读表格 · Vue3（完整版，含分页）

```vue
<template>
  <div class="readonly-table">
    <mtd-table :data="dataSource" row-key="id" bordered="row">
      <mtd-table-column prop="name" label="名称" />
      <mtd-table-column prop="type" label="类型" width="100" />
      <mtd-table-column prop="createdAt" label="创建时间" width="140" />
      <mtd-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <mtd-tag :theme="getStatusTheme(row.status)" size="small">
            {{ getStatusLabel(row.status) }}
          </mtd-tag>
        </template>
      </mtd-table-column>
      <mtd-table-column label="操作" width="80">
        <template #default="{ row }">
          <a @click="handleView(row)">查看</a>
        </template>
      </mtd-table-column>
    </mtd-table>

    <div class="readonly-table__pagination">
      <mtd-pagination
        :current="current"
        :page-size="pageSize"
        :total="total"
        show-size-changer
        show-total
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const statusMap = {
  active: { label: '生效', theme: 'green' },
  inactive: { label: '失效', theme: 'red' },
  draft: { label: '草稿', theme: 'gray' },
};

const getStatusTheme = (status) => statusMap[status]?.theme || 'gray';
const getStatusLabel = (status) => statusMap[status]?.label || status;

const dataSource = ref([
  { id: '1', name: '合同A', type: '租赁', createdAt: '2024-01-15', status: 'active' },
  { id: '2', name: '合同B', type: '采购', createdAt: '2024-01-16', status: 'inactive' },
  { id: '3', name: '合同C', type: '租赁', createdAt: '2024-01-17', status: 'draft' },
]);

const current = ref(1);
const pageSize = ref(10);
const total = ref(50);

const handleView = (record) => {
  console.log('查看详情:', record);
};

const handlePageChange = (page, size) => {
  current.value = page;
  pageSize.value = size;
  // 重新请求数据
};
</script>
```

---

## 八、CSS

```css
/* 只读表格容器（宽度规则与 Form5 可编辑表格对齐） */
.readonly-table {
  margin-bottom: 16px;
  overflow-x: auto;
}

.readonly-table .mtd-prime-table-wrapper {
  background: var(--bg-card);
}

/* 单元格内边距（与 Form5 一致） */
.readonly-table .mtd-prime-table-cell {
  padding: 8px 8px;
}

/* 表头不换行（与 Form5 一致） */
.readonly-table .mtd-prime-table-header-cell {
  white-space: nowrap;
}

.readonly-table__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 空状态 */
.readonly-table__empty {
  padding: 48px 0;
  text-align: center;
  color: var(--text-4);
  font-size: 14px;
}

/* 操作列链接 */
.readonly-table a {
  color: var(--color-brand-primary);
  cursor: pointer;
  font-size: 14px;
}

.readonly-table a:hover {
  text-decoration: underline;
}
```

---

## 九、踩坑笔记

- **MTD Table API 差异**：列配置用 `label`（非 `title`）、`dataKey`（非 `dataIndex`）；数据源用 `data`（非 `dataSource`）。
- **列的 `render` 函数签名**（React）：`render: (value, record) => ReactNode`，其中 `value` 是该列 `dataKey` 对应的值，`record` 是整行数据。用 `render` 做自定义渲染（如 Tag 状态、操作链接）。
- **Tag 组件用 `theme` 不用 `type`**：MTD React Tag 的颜色属性是 `theme`（可选 `green` / `orange` / `red` / `gray` / `blue` / `yellow` / `brown` / `purple` / `lightgray`），不是 `type`。推荐搭配 `type="bordered"` 使用（描边态），只读表格中 `size="small"`。
- **Vue3 自定义列渲染用具名插槽**：`<template #default="{ row }">` 拿到行数据后自行渲染 Tag 或操作链接，不像 React 用 `render` 函数。
- **只读表格 vs 可编辑表格（Form5）**：只读表格没有新增行/删除行按钮，没有行内编辑控件（Input、Select 等），列内容全部为纯文本或 Tag/链接等只读元素。操作列最多一个"查看"链接，不用按钮组件。
- **Pagination 需单独使用**：MTD Table 不内置分页功能，需要在表格下方单独放 `<Pagination>` 组件，并自行管理 `current` / `pageSize` / `total` 以及翻页后的数据请求逻辑。
- **宽度规则与 Form5 可编辑表格对齐**：容器设 `overflow-x: auto` 防止列溢出；单元格内边距 `padding: 8px 8px`；表头 `white-space: nowrap` 防止换行。三条规则与 Form5 保持一致。
- **至少一列不设固定 `width`**：若给每列都设固定 `width` 且总和 < 容器宽，右侧留白；之和 > 容器宽则横向滚动。务必保留一列弹性列不设 `width`。
- **固定列三件套**：`fixed` 字段 + `useSticky` prop + `scroll={{ x }}` 缺一不可，否则固定列不生效。仅设 `fixed` 不起作用。
- **scroll.x 计算**：推荐取所有列 `width` 之和再加 20~50px 余量，避免最后一列紧贴边缘。
