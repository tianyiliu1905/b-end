# Form5 · 可编辑表格（EditableTable）

> **一句话定位**：支持增删行、行内编辑的明细录入表格。

---

## 一、何时用

- 支持增删行、行内编辑的明细录入表格。
- prompt 提到多条明细 / 增删行 / 列表录入 / 动态添加时使用。
- 适用于需要录入多条结构化明细数据（如订单明细、费用明细、物料清单）的场景。

---

## 二、布局 (ASCII)

### 2.1 结构

```
┌─────────────────────────────────────────────────┐
│  表头行（灰底，由组件库 Table 自带）               │
├─────────────────────────────────────────────────┤
│  数据行（每个单元格始终是输入控件）                  │
│  ┌──────────┬──────────┬────────┬──────┬──────┐ │
│  │ Input    │ Select ▼ │ Number │ Num  │ 删除 │ │
│  └──────────┴──────────┴────────┴──────┴──────┘ │
├─────────────────────────────────────────────────┤
│  + 添加一行（蓝色文字按钮，居左）                   │
├─────────────────────────────────────────────────┤
│                          合计金额：¥XXX.XX（右对齐）│
└─────────────────────────────────────────────────┘
```

### 2.2 视觉要素

| 元素 | 说明 |
|------|------|
| 表头 | 组件库 Table 自带灰底样式，表头文字不换行 |
| 数据行 | 每个单元格始终是编辑控件（Input / Select / InputNumber 等） |
| 操作列 | 蓝色文字按钮（如"删除"），非图标按钮 |
| 添加行按钮 | 蓝色无框文字按钮，带"+"图标，居左，紧贴表格下方（无额外间距） |
| 汇总行（可选） | 右对齐，展示合计等统计信息 |

### 2.3 数值规格

| 属性 | 值 |
|------|------|
| 单元格内边距 | `8px` |
| 表格内控件宽度 | `100%`（撑满单元格） |
| 表格容器底部间距 | `16px`（margin-bottom） |
| 添加按钮与表格间距 | `0`（无额外 margin-top） |
| 汇总行上下内边距 | `8px 0` |

---

## 三、可配参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| 列定义 | 每列的标题、字段名、宽度、渲染控件类型 | 由业务决定 |
| 初始行数 | 打开表单时预填的空行数 | 1 |
| 最少行数 | 允许删除到的最少行数，少于此数时删除按钮 disabled | 1 |
| 汇总行 | 是否在表格下方展示合计等统计信息 | 可选 |

---

## 四、约束

1. **全行始终编辑态** —— 每个数据单元格始终渲染为输入控件，不做"查看/编辑"态切换。
2. **操作列使用蓝色文字按钮** —— 操作列（如"删除"）使用蓝色无框文字按钮，不使用图标按钮或红色危险按钮。
3. **添加行按钮为蓝色无框文字按钮** —— 带"+"图标，居左对齐，紧贴表格下方（无额外间距），不使用虚线全宽按钮。
4. **表格内控件撑满单元格** —— Input / Select / InputNumber 等控件宽度设为 100%。
5. **表头不换行** —— 表头文字强制 `white-space: nowrap`，防止窄屏下列名折行。
6. **独立状态管理** —— 可编辑表格数据通过独立 state 管理，不嵌套在 Form.Item 内；提交时将表格数据与主表单数据合并。
7. **稳定行 key** —— 每行数据必须有唯一稳定的 key（如递增计数器），不可使用数组下标，否则增删行后编辑状态错乱。

---

## 五、L3 组件映射与 MTD 查询

### 5.1 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) | 关键 Props |
|------|--------------------------|----------------------|------------|
| 表格 | `<Table>` | `<mtd-table>` | `columns`（React）, `data` |
| 输入框 | `<Input>` | `<mtd-input>` | `value`, `placeholder` |
| 下拉选择 | `<Select>` + `<Select.Option>` | `<mtd-select>` + `<mtd-option>` | `value`, `placeholder` |
| 数字输入 | `<InputNumber>` | `<mtd-input-number>` | `value`, `min`, `precision` |
| 按钮 | `<Button>` | `<mtd-button>` | `shape`, `type`, `onClick` / `@click` |
| 图标 | `<Icon>` | `<mtd-icon>` | `type="add"` / `type="delete"` |

### 5.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Table,Input,Select,InputNumber,Button --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Table,Input,Select,InputNumber,Button --target=mtd-vue --quiet
```

---

## 六、代码骨架（React / Vue3）

### 6.1 可编辑表格 · React

```tsx
import { useState } from 'react';
import { Table, Input, Select, InputNumber, Button } from '@ss/mtd-react3';

interface RowData {
  key: string;
  name: string;
  type: string;
  amount: number | null;
}

let rowKey = 0;
const createEmptyRow = (): RowData => ({
  key: `row_${++rowKey}`,
  name: '',
  type: '',
  amount: null,
});

export default function EditableTable() {
  const [dataSource, setDataSource] = useState<RowData[]>([createEmptyRow()]);

  const handleFieldChange = (key: string, field: keyof RowData, value: any) => {
    setDataSource((prev) =>
      prev.map((row) => (row.key === key ? { ...row, [field]: value } : row))
    );
  };

  const handleAdd = () => {
    setDataSource((prev) => [...prev, createEmptyRow()]);
  };

  const handleDelete = (key: string) => {
    setDataSource((prev) => prev.filter((row) => row.key !== key));
  };

  const columns = [
    {
      label: '名称',
      dataKey: 'name',
      render: (_value: string, record: RowData) => (
        <Input
          value={record.name}
          placeholder="请输入名称"
          onChange={(val) => handleFieldChange(record.key, 'name', val)}
        />
      ),
    },
    {
      label: '类型',
      dataKey: 'type',
      render: (_value: string, record: RowData) => (
        <Select
          value={record.type || undefined}
          placeholder="请选择类型"
          onChange={(val) => handleFieldChange(record.key, 'type', val)}
          style={{ width: '100%' }}
        >
          <Select.Option value="income">收入</Select.Option>
          <Select.Option value="expense">支出</Select.Option>
          <Select.Option value="transfer">转账</Select.Option>
        </Select>
      ),
    },
    {
      label: '金额',
      dataKey: 'amount',
      render: (_value: number | null, record: RowData) => (
        <InputNumber
          value={record.amount}
          placeholder="请输入"
          min={0}
          precision={2}
          style={{ width: '100%' }}
          onChange={(val) => handleFieldChange(record.key, 'amount', val)}
        />
      ),
    },
    {
      label: '操作',
      dataKey: 'actions',
      width: 60,
      render: (_value: any, record: RowData) => (
        <Button
          shape="text"
          type="primary"
          onClick={() => handleDelete(record.key)}
          disabled={dataSource.length <= 1}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="editable-table">
      <Table
        columns={columns}
        data={dataSource}
        rowKey="key"
        pagination={false}
      />
      <Button
        className="editable-table__add-row"
        shape="text"
        type="primary"
        onClick={handleAdd}
        icon="add"
      >
        添加一行
      </Button>
    </div>
  );
}
```

### 6.2 可编辑表格 · Vue3

```vue
<template>
  <div class="editable-table">
    <mtd-table :data="dataSource" row-key="key" :pagination="false">
      <mtd-table-column label="名称" prop="name">
        <template #default="{ row, $index }">
          <mtd-input
            v-model="row.name"
            placeholder="请输入名称"
            @input="(val) => handleFieldChange($index, 'name', val)"
          />
        </template>
      </mtd-table-column>

      <mtd-table-column label="类型" prop="type">
        <template #default="{ row, $index }">
          <mtd-select
            v-model="row.type"
            placeholder="请选择类型"
            style="width: 100%"
            @change="(val) => handleFieldChange($index, 'type', val)"
          >
            <mtd-option value="income" label="收入" />
            <mtd-option value="expense" label="支出" />
            <mtd-option value="transfer" label="转账" />
          </mtd-select>
        </template>
      </mtd-table-column>

      <mtd-table-column label="金额" prop="amount">
        <template #default="{ row, $index }">
          <mtd-input-number
            v-model="row.amount"
            placeholder="请输入"
            :min="0"
            :precision="2"
            style="width: 100%"
            @change="(val) => handleFieldChange($index, 'amount', val)"
          />
        </template>
      </mtd-table-column>

      <mtd-table-column label="操作" width="60">
        <template #default="{ row, $index }">
          <mtd-button
            shape="text"
            type="primary"
            :disabled="dataSource.length <= 1"
            @click="handleDelete($index)"
          >
            删除
          </mtd-button>
        </template>
      </mtd-table-column>
    </mtd-table>

    <mtd-button
      class="editable-table__add-row"
      shape="text"
      type="primary"
      icon="add"
      @click="handleAdd"
    >
      添加一行
    </mtd-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface RowData {
  key: string;
  name: string;
  type: string;
  amount: number | null;
}

let rowKey = 0;
const createEmptyRow = (): RowData => ({
  key: `row_${++rowKey}`,
  name: '',
  type: '',
  amount: null,
});

const dataSource = ref<RowData[]>([createEmptyRow()]);

const handleFieldChange = (index: number, field: keyof RowData, value: any) => {
  (dataSource.value[index] as any)[field] = value;
};

const handleAdd = () => {
  dataSource.value.push(createEmptyRow());
};

const handleDelete = (index: number) => {
  dataSource.value.splice(index, 1);
};
</script>
```

---

## 七、CSS

```css
/* 可编辑表格容器 */
.editable-table {
  margin-bottom: 16px;
  overflow-x: auto;
}

/* 添加行按钮紧贴表格，无额外间距 */
.editable-table__add-row {
  margin-top: 0;
}

/* 单元格内边距 */
.editable-table .mtd-prime-table-cell {
  padding: 8px 8px;
}

/* 表格内控件撑满单元格 */
.editable-table .mtd-prime-input,
.editable-table .mtd-prime-select,
.editable-table .mtd-prime-input-number {
  width: 100%;
}

/* 表头不换行 */
.editable-table .mtd-prime-table-header-cell {
  white-space: nowrap;
}

/* 汇总行（可选） */
.editable-table__summary {
  text-align: right;
  font-size: 14px;
  color: var(--text-3);
  padding: 8px 0;
}
.editable-table__summary strong {
  color: var(--text-1);
  font-size: 16px;
}
```

---

## 八、踩坑笔记

- **MTD React Table 的 API 差异**：列配置用 `label`（非 `title`）、`dataKey`（非 `dataIndex`）；数据源用 `data`（非 `dataSource`）。
- **每行数据必须有稳定的 `key` 字段**：React 的 reconciliation 依赖 `rowKey="key"`，如果用数组下标会导致编辑状态错乱。
- **行内编辑时不可变更新 dataSource**：`setDataSource(prev => prev.map(...))` 进行 immutable 更新，直接修改对象属性不会触发重渲染。
- **不要在表格单元格内使用 `Form.Item`** —— 可编辑表格的状态应独立于主 Form 管理，通过独立 state 收集表格数据，提交时再合并到表单整体数据。
- **操作列使用 `shape="text" type="primary"`（蓝色文字按钮）**，不要用红色图标或 `type="danger"`，保持视觉一致性。注意 MTD Button 的 `type` 是颜色类型（primary/danger/grey 等），`shape` 是形状（text/circle/round/rect）。
- **添加行按钮使用 `shape="text" type="primary" icon="add"`**：蓝色无框文字按钮，居左对齐，紧贴表格下方（margin-top: 0）。
- **Vue3 使用 scoped slot 渲染自定义单元格**：`<template #default="{ row, $index }">`，与 React 的 `render` 函数等价。
- **Icon 组件用 `type` 属性**（非 `name`）：如 `<Icon type="add" />`、`<Icon type="delete" />`。

---

## 九、与 Form3 表单区混排规则

当同一页面中 Form5（可编辑表格）和 Form3（表单区）需要上下混排时，两者的宽度策略不同：表单区宽度由外层 Row/Col 栅格分栏控制，而可编辑表格通常列数多、需要更大的水平空间，应**拉通整个内容区宽度**。

#### 混排硬约束

1. **可编辑表格必须放在 `<Form className="section-form">` 外部**，不受栅格分栏限宽约束
2. 表格区域的 `.form-section`（含标题）直接放在 `.scroll-content` 内，与 `<Form>` 平级
3. 表格数据通过独立 state 管理，提交时与 Form 数据合并

**结构示意（React）**：

```tsx
<div className="scroll-content">
  {/* F3 表单区 — 宽度由外层 Row/Col 栅格控制 */}
  <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
    <div className="form-section form-section--multicol">
      <h3 className="form-section__title">基本信息</h3>
      <Form.Item formItemKey="name" label="名称" required span={12}>
        <Input placeholder="请输入" toFormItem />
      </Form.Item>
    </div>
  </Form>

  {/* F5 可编辑表格 — 宽度拉通内容区，不受 section-form 限宽 */}
  <div className="form-section">
    <h3 className="form-section__title">明细表</h3>
    <div className="editable-table">
      <Table columns={columns} data={dataSource} rowKey="key" pagination={false} />
      <Button className="editable-table__add-row" shape="text" type="primary" onClick={handleAdd} icon="add">
        添加一行
      </Button>
    </div>
  </div>
</div>
```

**反模式（禁止）**：不要把可编辑表格放在受栅格限宽的 `<Form>` 内部，列数多时宽度不够会横向溢出。
