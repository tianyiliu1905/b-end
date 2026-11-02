# Form6 · 复选组（CheckboxGroup）

> **一句话定位**：以横排、分组网格或表格等形式做多选、勾选、适用范围设定。
> **信号**：该模块出现基本可反推用户在做配置型表单。
> **适用边界**：候选项必须是封闭集合——即所有可选项是预定义的、有限的，用户只能从中勾选子集，不能自由输入集合外的新值。如果用户需要自己输入新内容、或者集合是动态开放的，应使用 F9 增删标签组。

---

## 一、何时用

- 以横排、分组网格或表格勾选等形式做多选、能力选择、适用范围设定。
- prompt 提到多选 / 勾选 / 能力选择 / 适用范围 / 矩阵时使用。
- 候选项是固定、已知、预定义的，用户只能从中选择，不能自由输入新值。
- 典型场景：开通能力（从预定义能力列表勾选）、消息通知类型（从固定几种方式勾选）、适用范围设定（从已知范围中选择）。

---

## 二、布局 (ASCII)

**布局示意（变体 A / B）**：

```Plain
变体 A · 基础横排 / 自动换行
┌────────────────────────────────────────────────────────────────┐
│ □ 短信通知    □ 邮件通知    □ 站内信      □ APP 推送            │ ← 无分组，单行最多 4 项
├────────────────────────────────────────────────────────────────┤
│ □ 语音通知    □ 企业消息                                      │ ← 超出后自动换行，横向间距 32px
└────────────────────────────────────────────────────────────────┘

变体 B · 分组多选矩阵
┌────────────────────────────────────────────────────────────────┐
│ 开通能力                         全选  清空  已选 4 / 12        │ ← label 行右侧操作栏
├────────────────────────────────────────────────────────────────┤
│ ┌─ 履约能力 ───┐ ┌─ 营销能力 ───┐ ┌─ 增值服务 ───┐ ┌─ 数据能力 ───┐ │
│ │ □ 配送       │ │ □ 优惠券     │ │ □ 会员权益   │ │ □ 数据报表   │ │ ← 四栏等宽分组卡片
│ │ □ 自提       │ │ □ 满减活动   │ │ □ 储值服务   │ │ □ 指标订阅   │ │ ← 卡片内 Checkbox 纵向排列
│ │ □ 到店       │ │ □ 拼团活动   │ │ □ 发票服务   │ │ □ 数据导出   │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
└────────────────────────────────────────────────────────────────┘
  ← 分组超过 4 个时换至下一行；同一行与跨行卡片统一等高
```

---

## 三、可配参数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| options | 可选项列表（含 value / label / group） | GridOption[] | - |
| value | 已选中的值 | string[] | [] |
| onChange | 选中值变化回调 | (values: string[]) => void | - |
| grouped | 是否按 group 字段分组展示（对应变体B） | boolean | false |
| showActions | 是否展示全选/清空操作栏 | boolean | false |
| mode | 展示模式：横排 / 分组网格 / 表格 | 'row' \| 'grid' \| 'table' | 'row' |
| searchable | 是否显示搜索框（对应变体C） | boolean | false |
| pageSize | 表格模式下的分页大小 | number | 8 |

---

## 四、变体

复选组模块包含三种样式变体，根据选项数量与是否需要分组来选择：

### 变体A · 基础横排（无分组）

选项数量少（约 10 项以内）、不需要按业务维度分组时的最简形态。

- **排列规则**：参考 G2 表头摘要信息行的排列方式——选项按自身内容的自然宽度横向排列，不做等宽网格拉伸。
- **每行数量**：一行最多 4 个，超出自动换行；每项宽度按 `(100% - 3 条间距) / 4` 均分计算，保证换行位置整齐对齐。
- **间距**：项之间横向间距 32px，换行后的行间距 12px。
- **容器**：不带底色卡片包裹，直接铺在表单区域内，视觉上与"无卡片包裹"的摘要信息行一致。

**适用场景**：如"消息通知类型"这类扁平选项列表，选项之间没有分组关系。

### 变体B · 分组多选矩阵（标准形态）

选项按业务维度分组展示，是复选组的标准、最常用形态。

- **分组布局**：横向四栏等宽网格，每个分组默认占一栏；分组数量不固定时，多余分组自动换到下一行，仍保持四栏对齐。
- **分组卡片**：浅灰底色（不描边），圆角，内部选项纵向排列。
- **跨行高度对齐**：当分组超过 4 个、产生多行时，同一行内以及跨行的分组卡片高度统一取最高一组的高度，避免参差不齐。
- **操作栏位置**：全选、清空两个操作按钮，与"已选 X / Y"计数文字，一起放在该字段 label 的同一行，整体靠右对齐——不占用勾选区域的独立一行。
- **操作栏样式**：全选/清空为蓝色文字按钮（与主题色一致）；按钮文字与计数文字统一为 14px 字号。

**适用场景**：如"开通能力"这类需要按业务维度（履约能力/营销能力/增值服务等）分组展示的多选场景。

### 变体C · 大数据量勾选（Table + rowSelection）

当可选项数量超过 50–100 个时，网格布局不便于查找，改用表格形态。

- **工具栏**：表格上方放置搜索输入框（按名称过滤）与"已选 X / Y 家"计数文字，计数靠右对齐。
- **表格**：使用行选择（rowSelection）机制勾选，支持横向滚动与纵向滚动固定表头，并分页展示（如每页 8 条）。
- **状态展示**：如有状态类列，用 Tag 展示（如"营业中"/"筹备中"），不同状态用不同主题色区分。

**适用场景**：如"适用门店范围"这类候选项可能有几十上百条的场景，需要搜索定位后勾选。

---

## 五、约束

### 样式变体选择规则

- **变体A 基础横排**：选项数量少（约 10 项以内）、且选项之间没有分组关系时使用，是复选组的最简形态。
- **变体B 分组多选矩阵**：选项存在业务维度分组、且总量在数十项以内时使用，是复选组的标准、默认形态。
- **变体C 大数据量勾选**：可选项超过 50–100 个时使用，网格布局此时不便查找，须切换为 Table + rowSelection + 搜索。

### 布局约束

- 变体A、变体B 的复选框组容器（`Checkbox.Group` 渲染的外层节点）默认是 `display: flex` 布局，子节点默认不会自动撑满，需要显式设置宽度撑满整行或网格（具体 CSS 处理见下方 CSS 部分的注释）。
- 变体B 的全选/清空操作栏放在 Form.Item 的 label 行而非勾选区域内，需要将 `label` 由纯文本改为自定义节点（标题 + 操作栏），并整体靠右对齐操作栏部分。
- 变体B 分组卡片的跨行高度对齐优先使用纯 CSS 方案（网格容器 `grid-auto-rows: 1fr`），无需 JS 测量各卡片高度。
- 变体C 中表格所在的 Form.Item 通常需要独占整行（不与其他普通字段并列），布局规则参见 F3 基础布局中"横向密集复合组件"一类的处理方式。

### 数据量约束

- 变体A、变体B 适用于选项总量在数十项以内的场景；一旦选项数量超过 50–100 个，必须切换到变体C，否则勾选区域会过高、难以扫视和查找。

---

## 六、L3 组件映射与 MTD 查询

### 6.1 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) | 关键 Props |
|------|--------------------------|----------------------|------------|
| 复选框 | `<Checkbox>` | `<mtd-checkbox>` | `value`, `disabled` |
| 复选框组 | `<Checkbox.Group>` | `<mtd-checkbox-group>` | `value` / `v-model`, `onChange` |
| 操作按钮（全选/清空） | `<Button>` | `<mtd-button>` | `type="primary"`, `shape="text"`（⚠️ 不要加 `size="small"`，会使文字变 12px，违反"操作栏统一 14px"） |
| 表格（变体C 大数据量） | `<Table>` | `<mtd-table>` | `rowSelection`, `dataSource` |
| 搜索输入框（变体C） | `<Input>` | `<mtd-input>` | `value`, `onChange`, `prefix` |
| 状态标签（变体C） | `<Tag>` | `<mtd-tag>` | `theme`, `type="bordered"` |

### 6.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Checkbox,Table,Tag,Button,Input --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Checkbox,Table,Tag,Button,Input --target=mtd-vue --quiet
```

---

## 七、代码骨架（React / Vue3）

### 7.1 类型定义 · React

```tsx
interface GridOption {
  value: string;
  label: string;
  group?: string;
}
```

### 7.2 变体A · 基础横排骨架 · React

无分组，仅勾选，选项按自身内容自然宽度横向排列，一行最多 4 个。

```tsx
function BasicCheckboxRow({ options, value, onChange }: {
  options: GridOption[];
  value: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="grid-selector-basic">
      <Checkbox.Group value={value} onChange={(v) => onChange(v as string[])}>
        <div className="checkbox-row">
          {options.map((opt) => (
            <div key={opt.value} className="checkbox-row__item">
              <Checkbox value={opt.value}>{opt.label}</Checkbox>
            </div>
          ))}
        </div>
      </Checkbox.Group>
    </div>
  );
}
```

### 7.3 变体B · 分组多选矩阵骨架 · React

分组勾选区（受控组件）+ 全选/清空操作栏上移至 Form.Item 的 label 行。

```tsx
import { useMemo, useState } from 'react';
import { Checkbox, Button, Form } from '@ss/mtd-react3';

/** 分组勾选区：受控组件，选中状态由外层页面统一管理，
 *  因为操作栏和勾选区分别渲染在 label 行与表单控件区，是两个兄弟节点 */
function GroupedCheckboxGrid({
  options,
  selected,
  onChange,
}: {
  options: GridOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, GridOption[]>();
    options.forEach((opt) => {
      const group = opt.group || '默认';
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(opt);
    });
    return map;
  }, [options]);

  return (
    <div className="checkbox-grid-wrapper">
      <Checkbox.Group value={selected} onChange={(v) => onChange(v as string[])}>
        <div className="checkbox-grid__groups">
          {[...grouped.entries()].map(([groupName, items]) => (
            <div key={groupName} className="checkbox-grid__group">
              <div className="checkbox-grid__group-title">{groupName}</div>
              <div className="checkbox-grid">
                {items.map((item) => (
                  <div key={item.value} className="checkbox-grid__item">
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Checkbox.Group>
    </div>
  );
}

/** 页面装配处：状态提升到页面层，label 传自定义节点（标题 + 操作栏） */
function CapabilityFormItem({ options }: { options: GridOption[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectAll = () => setSelected(options.map((o) => o.value));
  const handleClearAll = () => setSelected([]);

  const label = (
    <div className="checkbox-grid__label-row">
      <span>开通能力</span>
      <div className="checkbox-grid__actions">
        {/* ⚠️ 不要加 size="small"：会使文字变 12px，违反"操作栏统一 14px" */}
        <Button type="primary" shape="text" onClick={handleSelectAll}>
          全选
        </Button>
        <Button type="primary" shape="text" onClick={handleClearAll}>
          清空
        </Button>
        <span className="checkbox-grid__count">
          已选 {selected.length} / {options.length}
        </span>
      </div>
    </div>
  );

  return (
    <Form.Item className="form-item--capability" formItemKey="capability" label={label}>
      <GroupedCheckboxGrid options={options} selected={selected} onChange={setSelected} />
    </Form.Item>
  );
}
```

### 7.4 变体C · 大数据量勾选骨架 · React

选项超过 50–100 个时改用 Table + rowSelection，支持搜索与分页。

```tsx
import { useMemo, useState } from 'react';
import { Table, Input, Tag } from '@ss/mtd-react3';

interface StoreRow {
  key: string;
  name: string;
  city: string;
  type: string;
  status: string;
}

function TableCheckboxSelector({ rows }: { rows: StoreRow[] }) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');

  const filteredRows = useMemo(() => {
    if (!keyword.trim()) return rows;
    return rows.filter((row) => row.name.includes(keyword.trim()));
  }, [keyword, rows]);

  const columns = [
    { dataKey: 'name', label: '门店名称', width: 260 },
    { dataKey: 'city', label: '所在城市', width: 100 },
    { dataKey: 'type', label: '门店类型', width: 100 },
    {
      dataKey: 'status',
      label: '经营状态',
      width: 100,
      render: (_: unknown, row: StoreRow) => (
        <Tag theme={row.status === '营业中' ? 'green' : 'gray'} type="bordered">
          {row.status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="grid-selector-table">
      <div className="grid-selector-table__toolbar">
        <Input
          className="grid-selector-table__search"
          placeholder="搜索门店名称"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          prefix="🔍"
        />
        <span className="grid-selector-table__count">
          已选 {selectedKeys.length} / {rows.length} 家门店
        </span>
      </div>
      <Table
        rowKey="key"
        columns={columns}
        data={filteredRows}
        scroll={{ x: true, y: 320 }}
        pagination={{ pageSize: 8 }}
        rowSelection={{ selectedKeys }}
        onSelectChange={(keys) => setSelectedKeys(keys as string[])}
      />
    </div>
  );
}
```

### 7.5 变体B · 分组多选矩阵骨架 · Vue3

```vue
<template>
  <div class="checkbox-grid-wrapper">
    <mtd-checkbox-group v-model="selected" @change="handleChange">
      <div class="checkbox-grid__groups">
        <div
          v-for="[groupName, items] in grouped"
          :key="groupName"
          class="checkbox-grid__group"
        >
          <div class="checkbox-grid__group-title">{{ groupName }}</div>
          <div class="checkbox-grid">
            <div
              v-for="item in items"
              :key="item.value"
              class="checkbox-grid__item"
            >
              <mtd-checkbox :value="item.value">{{ item.label }}</mtd-checkbox>
            </div>
          </div>
        </div>
      </div>
    </mtd-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface GridOption {
  value: string;
  label: string;
  group?: string;
}

const props = defineProps<{
  options: GridOption[];
  modelValue?: string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void;
  (e: 'change', val: string[]): void;
}>();

const selected = ref<string[]>(props.modelValue || []);

const grouped = computed(() => {
  const map = new Map<string, GridOption[]>();
  props.options.forEach((opt) => {
    const group = opt.group || '默认';
    if (!map.has(group)) map.set(group, []);
    map.get(group)!.push(opt);
  });
  return map;
});

const handleChange = (checkedValues: string[]) => {
  selected.value = checkedValues;
  emit('update:modelValue', checkedValues);
  emit('change', checkedValues);
};
</script>
```

> 变体A（横排）与变体C（表格）的 Vue3 写法与上面 React 版本一一对应：`Checkbox.Group` → `mtd-checkbox-group` + `v-model`，`Table` → `mtd-table` + `row-selection`，`Input` → `mtd-input` + `v-model`，`Tag` → `mtd-tag`，全选/清空按钮 `<mtd-button type="primary" shape="text">`（不要加 `size="small"`，文字须保持 14px）。全选/清空操作栏上移到 label 行的写法与 React 一致：给对应 `mtd-form-item` 的 `label` slot 传入包含标题与操作栏的自定义内容。

---

## 八、CSS

```css
/* --- 变体B 分组卡片内部选项容器：纵向单列排列 ---
 * ⚠️ 组内选项必须纵向堆叠（配合"分组横排四栏"，见 .checkbox-grid__groups）。
 * 切勿改成 grid-template-columns: repeat(auto-fill, ...) 之类的横向多列，
 * 否则就把"分组横排/组内纵排"整个对调了。 */
.checkbox-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-grid__item,
.checkbox-row__item {
  display: flex;
  align-items: center;
}

/* --- 变体A：基础横排（无分组，仅勾选）
 * 参考 G2 表头摘要信息行的排列规则：选项按自身内容自然宽度排列，
 * 用 flex-wrap 横向铺开、一行最多 4 个，超出自动换行，不做等宽 Grid 拉伸。
 * 不带底色容器，直接铺在表单区域内。 --- */
.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  /* Checkbox.Group 渲染的父节点自身 display 为 flex，
     此时子元素默认按 flex-shrink 收缩到内容宽度，不会像普通块级元素
     那样自动撑满父容器，必须显式撑满，flex-basis 的百分比换行计算才准确 */
  width: 100%;
}

.checkbox-row__item {
  /* 一行最多 4 个：4 项之间共 3 条 32px 横向 gap（3 × 32px = 96px），
     从容器总宽里精确扣除后再均分成 4 份，避免等宽拉伸误差导致换行错位。
     flex-shrink/grow 均为 0，宽度固定分配，超出部分交给文字自身处理。 */
  flex: 0 0 calc((100% - 96px) / 4);
}

/* --- 变体B：分组网格 + 操作栏（操作栏上移至 label 行） --- */
/* mtd Form.Item 的 label 传入 ReactNode 时，会被塞进
   .mtd-prime-form-item-label-ctx（默认 width:6em，且限制 2 行截断），
   需要撑满宽度，自定义 label 行才能左右布局、操作栏靠右 */
.form-item--capability .mtd-prime-form-item-label {
  height: auto;
}

.form-item--capability .mtd-prime-form-item-label-ctx {
  width: 100%;
  -webkit-line-clamp: unset;
}

.checkbox-grid__label-row {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}

.checkbox-grid__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 14px;
}

.checkbox-grid__actions .mtd-prime-button {
  font-size: 14px;
}

.checkbox-grid__count {
  font-size: 14px;
  color: var(--text-4);
  margin-left: auto;
}

/* 分组横排容器：四栏等宽 Grid，每个分组默认占一栏；
   用 Grid 而非 flex 是因为分组数量不固定，Grid 能让空余栏位天然
   留白对齐，不需要额外计算 flex-basis 或处理换行 */
.checkbox-grid__groups {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr; /* 所有行统一为最高行的高度，跨行也对齐 */
  gap: 16px;
  /* 父节点 .mtd-prime-checkbox-group 自身 display 为 flex，
     子元素默认收缩到内容宽度，不会自动撑满，必须显式撑满宽度
     （与变体A .checkbox-row 是同一个坑） */
  width: 100%;
}

.checkbox-grid__group {
  padding: 16px;
  background: var(--bg-card-inner);
  border-radius: 6px;
}

.checkbox-grid__group-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-1);
  margin-bottom: 12px;
}

/* --- 变体C：大数据量场景 — Table + rowSelection --- */
.grid-selector-table {
  border: 1px solid var(--divider);
  border-radius: 6px;
  overflow: hidden;
}

.grid-selector-table__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-card-inner);
  border-bottom: 1px solid var(--divider);
}

.grid-selector-table__search {
  width: 240px;
}

.grid-selector-table__count {
  font-size: 12px;
  color: var(--text-4);
  margin-left: auto;
}

/* --- 响应式：小屏下分组网格退化为单栏 ---
 * 组内选项本就是纵向单列（.checkbox-grid 为 flex column），无需处理；
 * 需要退化的是分组容器：四栏 → 一栏 */
@media (max-width: 767.98px) {
  .checkbox-grid__groups {
    grid-template-columns: 1fr;
  }

  .checkbox-row__item {
    flex: 1 1 100%;
  }
}
```

---

## 九、踩坑笔记

- **变体A 一行最多 4 个的宽度计算**：不能简单用 `flex-basis: 25%` 等宽拉伸，需要精确扣除间距后再均分——`flex: 0 0 calc((100% - 96px) / 4)`（96px = 3 条 32px 间距），否则换行位置会因为间距误差错位。
- **变体B 分组数量不固定时优先用 CSS Grid 而非 Flex**：`grid-template-columns: repeat(4, 1fr)` 能让分组数量不是 4 的倍数时，多余栏位自然留白对齐、自动换行到下一行且仍保持列对齐，不需要像 Flex 那样手动计算 `flex-basis` 百分比或处理换行逻辑。
- **变体B 操作栏上移到 label 行时，注意 mtd `Form.Item` 的 `label-ctx` 宽度限制**：`label` 传入字符串时会被截断显示（`.mtd-prime-form-item-label-ctx` 默认 `width: 6em` 且 `-webkit-line-clamp: 2`），传入自定义 ReactNode（标题 + 操作栏的 flex 行）也会被塞进这个容器里，必须针对该 Form.Item 单独加 className，覆盖 `width: 100%` 和取消行数截断，自定义行内的 `margin-left: auto` 才能让操作栏靠右。
- **全选/清空按钮使用 `type="primary"` + `shape="text"`**：`type="primary"` 让按钮文字呈现主题蓝色，`shape="text"` 去掉边框和背景，两者结合即为"蓝色文字按钮"，不需要额外写自定义颜色 CSS。
- **变体B 使用 `Checkbox.Group` 的 `value` 数组做受控选择**：React 传 `value={selected}` + `onChange`；Vue3 直接 `v-model`。`onChange` 回调参数是完整的已选值数组，不是增量。

---

## 十、自查清单

> 变体B 是复选组最常用形态，也是最容易凭"多选矩阵大概长这样"的印象写反的地方。**生成变体B 代码后，逐条核对以下 5 条，缺一不可**（对应 §四 变体B 的 5 条视觉规则）：

- [ ] **分组横排四栏**：分组卡片是**横向四栏等宽网格**（每个分类占一栏），不是纵向堆叠。CSS = `.checkbox-grid__groups { display: grid; grid-template-columns: repeat(4, 1fr); width: 100%; }`。⚠️ **切勿**把分组做成 `flex-direction: column` 的纵向堆叠。
- [ ] **组内选项纵排**：每个分组卡片**内部**的选项是**纵向单列**排列，不是横向多列。CSS = `.checkbox-grid { display: flex; flex-direction: column; }`。⚠️ **切勿**给组内 `.checkbox-grid` 套 `grid-template-columns: repeat(auto-fill, ...)` 之类的横向多列网格——那是把"分组横排/组内纵排"整个对调了。
- [ ] **卡片浅灰底**：分组卡片浅灰底色（不描边）、圆角。CSS = `.checkbox-grid__group { background: var(--bg-card-inner); border-radius: 6px; padding: 16px; }`。
- [ ] **跨行等高**：分组超过 4 个换行时，卡片高度统一。CSS = `.checkbox-grid__groups { grid-auto-rows: 1fr; }`（纯 CSS，禁止用 JS 测量各卡片高度）。
- [ ] **操作栏 14px**：全选/清空按钮文字 + "已选 X / Y" 计数文字**统一 14px**。⚠️ **切勿**给全选/清空 `<Button>` 加 `size="small"`（会渲染成 12px，违反规范）；计数文字 `.checkbox-grid__count` 也必须是 `font-size: 14px`，不要凭"计数是次要信息"的惯例写成 12px。

> **根因提醒**：上述第 1、2 条最易犯的错是"分组纵排 + 组内横排"（正好写反）；第 5 条最易犯的错是给按钮加 `size="small"` 和把计数写成 12px。这两类错误都源于**没读规范、凭印象生码**——务必对着本清单逐条核对，而不是依赖记忆。
