# 交互组件使用范式 (Interaction Patterns)

> 看板从「静态展示」升级到「可交互」时，模块内引入 MTD 交互组件（分页/排序/筛选/切换/Tooltip/选择/二次确认）的**用法 + 选型决策**。
>
> **铁律**：所有交互组件必须用 **MTD 原生组件 + 推荐用法**，API 一律以 `mtd-rag --target=mtd-vue --mtd-version=1.3.5` 核验为准，**不自造、不臆测属性名**。深度要求「真功能」——分页真翻页、排序真排序、筛选真过滤、选择真联动、二次确认真拦截，禁止只有 UI 外壳。
>
> 本文 API 均为 mtd-vue 1.3.5 实测（2026-06）。如版本升级，重新 mtd-rag 核验后再用。

---

## 0. 交互引入的总原则（用户习惯优先）

引入交互组件不是越多越好，要**符合用户使用习惯**，按下面三条决策：

1. **选项少且互斥 → Radio/RadioButton 平铺**（如：日/周/月时间粒度、近7天/近30天）。一眼可见全部选项、点一下即切换，比下拉省一次点击。
2. **选项多或占空间 → Dropdown/Select 下拉**（如：维度 GMV/订单量/客单价/转化率…、区域列表）。收起来省空间，点开再选。
3. **辅助说明不占位 → Tooltip hover 触发**（如：指标口径说明）。用 `question-circle-o` info 图标承载，hover 才出，不挤占布局。
4. **二次确认仅用于危险操作 → Popconfirm**（如：删除/移除）。普通操作（查看/下钻）直接执行，别滥用确认弹窗打断用户。
5. **开关式布尔筛选 → Switch**（如：仅看正增长）。比「是/否」两项 Radio 更轻。

> 反面：把「日/周/月」做成下拉（多一次点击）、把「20个维度」全平铺（撑爆一行）、给「查看」加二次确认（多余打断）——都是不符合习惯。

---

## 1. 经 mtd-rag 核验的真实 API（mtd-vue 1.3.5）

### Switch 开关
```vue
<mtd-switch
  v-model="onlyGrowth"
  size="small"
  :disabled="false"
  :loading="false"
  checked-children="开"
  un-checked-children="关"
  @change="(actived:boolean) => onToggle(actived)"
/>
```
- 支持 `true-value`/`false-value` 自定义绑定值；`@change` 回调参数是 `boolean`。

### Radio / RadioButton / RadioGroup（选项卡式快捷切换）
```vue
<mtd-radio-group v-model="range" type="line" size="small" @change="(value) => onRangeChange(value)">
  <mtd-radio-button value="7d">近7天</mtd-radio-button>
  <mtd-radio-button value="30d">近30天</mtd-radio-button>
  <mtd-radio-button value="custom">自定义</mtd-radio-button>
</mtd-radio-group>
```
- `type`：`line`(线型选项卡) / `fill`(填充) / `slider`(滑块)；基础单选用 `<mtd-radio value>`。
- `@change` 参数为选中 value。

### Dropdown 下拉菜单（维度/更多操作）
```vue
<mtd-dropdown trigger="click">
  <mtd-button size="small">维度：{{ dimensionLabel }} <mtd-icon name="down" /></mtd-button>
  <template #dropdown>
    <mtd-dropdown-menu>
      <mtd-dropdown-menu-item
        v-for="opt in dimensions" :key="opt.value"
        :selected="opt.value === dimension"
        @click="onPick(opt.value)"
      >{{ opt.label }}</mtd-dropdown-menu-item>
    </mtd-dropdown-menu>
  </template>
</mtd-dropdown>
```
- `mtd-dropdown-menu-item` 支持 `icon` / `disabled` / `selected`；菜单插槽名是 `#dropdown`。

### Tooltip 文字提示（口径说明）
```vue
<mtd-tooltip content="GMV：统计周期内成交总额，按下单时间口径" placement="top" trigger="hover" theme="dark" size="small">
  <mtd-icon name="question-circle-o" class="tip-icon" />
</mtd-tooltip>
```
- `placement`(top/bottom/left/right…) / `trigger`(hover/click) / `theme`(dark/light) / `size`(small)；复杂内容用 `#content` 插槽。
- 包裹触发元素（图标/文字），自身不占布局空间。

### Pagination 分页（真翻页）
```vue
<mtd-pagination
  :total="sortedRows.length"
  :current-page.sync="currentPage"
  :page-size.sync="pageSize"
  size="small"
  show-total
  show-size-changer
  @change="(current, size) => onPageChange(current, size)"
/>
```
- `:current-page.sync` / `:page-size.sync` 双向绑定；`@change(current, size)`。
- 真翻页靠 computed 切片：`pagedRows = rows.slice((page-1)*size, page*size)`。

### Table 排序 / 筛选 / 选择 / 展开（真功能）
```vue
<mtd-table :data="pagedRows" @sort-change="onSortChange">
  <mtd-table-column type="selection" />                          <!-- 行选择 -->
  <mtd-table-column type="expand">                               <!-- 行展开 -->
    <template #default="{ row }">…明细…</template>
  </mtd-table-column>
  <mtd-table-column prop="gmv" label="GMV" sortable :sort-method="(a,b)=>a.gmv-b.gmv" />
  <mtd-table-column prop="region" label="区域"
    :filters="[{text:'华东',value:'华东'}]" :filter-method="(v,row)=>row.region===v" />
</mtd-table>
```
- 排序：列加 `sortable`（+可选 `:sort-method`）；`@sort-change` 返回 `{ prop, order }`，order ∈ `'ascending' | 'descending' | ''`。
- 筛选：`:filters="[{text,value}]"` + `:filter-method="(value,row)=>boolean"`。
- 选择：`type="selection"` + `:selection` + `@update:selection`（或监听拿选中行做联动）。
- 展开：`type="expand"` + `#default` 插槽渲染明细。

### Popconfirm 二次确认（危险操作）
```vue
<mtd-popconfirm message="确认移除该区域？" placement="top" @ok="onRemove(row)">
  <mtd-button type="text" size="small">移除</mtd-button>
</mtd-popconfirm>
```

> ⚠️ **踩坑警示（mtd-vue 1.3.5 实测）**：MTD Popconfirm 的确认内容属性是 **`message`**（不是 `title`，`title` 仅是可选标题），确认事件是 **`@ok`**（不是 `@confirm`/`@on-confirm`）。用错事件名时弹窗能弹出、点「确定」却**毫无反应**（事件没监听），极易被误判为「确认弹窗正常」而漏掉真功能断裂。可选自定义按钮文案：`ok-button-text` / `cancel-button-text`。务必浏览器实测「点确定后数据真变化」，不能只看弹窗弹出。

### Empty 空态 / Loading 加载态
```vue
<!-- 表格无数据 -->
<mtd-empty description="暂无数据" />
<!-- 区块加载（包裹内容，加载时模糊） -->
<mtd-loading :loading="tableLoading" message="加载中">
  <DataTable ... />
</mtd-loading>
```
- Empty 支持 `description`/`title`/`image` + `#image`/`#title`/`#description` 插槽。
- Loading 支持 `:delay`/`message`/`message-position`/`fullscreen` + `#default`(被包裹模糊)/`#indicator`/`#message` 插槽。

### Select / Option 下拉选择（筛选维度）
```vue
<mtd-select :model-value="value" clearable size="small" placeholder="部门/业务线"
  style="width: 160px" @update:model-value="(v) => onChange('dept', v)">
  <mtd-option v-for="o in options" :key="o.value" :value="o.value" :label="o.label" />
</mtd-select>
```
- 也可用 `:options="[{label,value}]"` 简写替代 `mtd-option` 子节点。
- **配置驱动/受控写法**（复杂筛选器必用）：用 `:model-value` + `@update:model-value` 而非 `v-model`，便于父级集中收集为 `{ [key]: value }`。
- `clearable` 让用户能清空回「不限」；`size="small"` 与紧凑密度一致。

### Input 文本输入（关键词筛选）
```vue
<mtd-input :model-value="value" clearable size="small" placeholder="请输入名称"
  style="width: 200px" @update:model-value="(v) => onChange('name', v)" />
```

### DatePicker 区间（daterange）
```vue
<mtd-date-picker :model-value="value" type="daterange" size="small" clearable
  style="width: 240px" @update:model-value="(v) => onChange('dateRange', v)" />
```
- `type="daterange"` 绑定/回调为 `[start, end]` 数组。

### Message 全局提示（操作反馈）
```ts
import { Message } from '@ss/mtd-vue3'   // 具名导出，非默认导出
Message.success('查询完成')
Message.info('已重置筛选条件')
```

---

## 2. 三个交互范式（可直接套用）

### 范式 A · 图表卡片头部（ChartHeader.vue）
图表右上角的标准交互组合：**标题 + 口径 Tooltip + 维度 Dropdown + 粒度 RadioButton**。
- 口径说明用 `question-circle-o` + Tooltip(hover)；
- 维度选项多 → Dropdown；时间粒度选项少 → RadioButton(line) 平铺；
- 切维度/粒度后**真换数据**（重算喂给 G2 的 chartData，靠 `useG2Chart(deps)` 触发重渲染），不是只改标签。
- 封装为可复用 L3：props `title/tip/dimensions/dimension/granularities/granularity`，emit `update:dimension`/`update:granularity` 支持 v-model。

### 范式 B · 可交互数据表格（DataTable.vue）
向后兼容设计——**所有新能力走可选 props**，仅传 `title/columns/rows` 仍可用。
- 列排序 `sortable`（computed `sortedRows` 真排序：数字按 number 比、字符串 `localeCompare('zh')`）；
- 分页 `pageSize`(默认10，0=关闭)（computed `pagedRows` 真切片，`watch rows` 回第一页）；
- 行选择 `selectable`（头部显示「已选 N 条 + 取消选择」，emit `selection-change`）；
- 行操作 `rowActions`（单操作出按钮，多操作收进「更多」Dropdown；`confirm` 项用 Popconfirm 包裹）；
- 空态 `emptyText` + Empty，加载态 `loading` + Loading 包裹。

### 范式 C · 真过滤筛选栏（G-3 简单档升级）
- 快捷时间段用 RadioButton（近7天/近30天/自定义，选「自定义」才出 DatePicker）；
- 布尔筛选用 Switch（仅看正增长）；区域/维度用 Select(clearable)；
- **真过滤**：`filteredRows = computed(() => rows.filter(r => 命中所有条件))`，表格绑 `:rows="filteredRows"`；
- 查询按钮模拟 loading + `Message.success`，重置清空 + `Message.info`。

### 范式 D · 复杂筛选器（G-3 复杂档，AdvancedFilterBar.vue）
> 维度多（>5）、需按业务域分组、要保存常用方案/收起时使用。对标真实业务后台「高级筛选」。落地：`dashboard-app/src/modules/AdvancedFilterBar.vue` + 范例 `dashboard-app/src/pages/GoalDashboard.vue`（已浏览器全功能验证）。

**① 配置驱动渲染**——组件接 `groups: FilterGroup[]`，不写死字段：
```ts
interface FilterField { key; label; type:'select'|'input'|'daterange'|'switch'; options?; placeholder?; width? }
interface FilterGroup { label: string; fields: FilterField[] }
// 按 field.type 分支渲染：select→mtd-select / input→mtd-input / daterange→mtd-date-picker / switch→mtd-switch
// 全部 :model-value + @update:model-value，size="small"，clearable
```

**② 多行分组布局**——每个 group 一行：`.adv-row` 用 `display:flex; align-items:center` 让标签与控件**垂直居中对齐**；左 label 列 `width:5em` 右对齐、`line-height:var(--lh-14)`（靠 flex center 自动居中）；右侧字段区 `flex-wrap:wrap`。
> ⚠️ 别用 `align-items:flex-start` + `padding-top:5px` 凑居中——同行控件高度不一（如 daterange）时标签会偏上错位；统一 `align-items:center` 才稳。

**③ 收起/展开**——`expanded = ref(true)`，收起只显第 0 行：
```vue
<div v-for="(g, gi) in groups" :key="gi" v-show="expanded || gi === 0" class="adv-row">…</div>
<!-- 仅 groups.length > 1 才出收起/展开按钮 -->
```

**④ 关注点分离 + 集中收集**——组件只收集，不持有业务数据：
```ts
function onChange(key: string, value: unknown) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })  // 集中成扁平值对象
}
function onReset() {
  const cleared: Record<string, unknown> = {}
  Object.keys(props.modelValue).forEach((k) => (cleared[k] = undefined))
  emit('update:modelValue', cleared); emit('reset')
}
```
真过滤永远在父组件：`filteredRows = computed(() => rows.filter(r => 命中所有已填条件))`。

**⑤ 快捷筛选方案（真功能，Dropdown 承载）**——保存/应用/删除：
```ts
interface Scheme { id: number; name: string; values: Record<string, unknown> }
const schemes = ref<Scheme[]>([])
function saveScheme(name: string) {                       // 保存：当前 modelValue 快照
  schemes.value.push({ id: Date.now(), name, values: { ...props.modelValue } })
}
function applyScheme(s: Scheme) {                          // 应用：回填 + 触发查询
  emit('update:modelValue', { ...s.values }); emit('query')
}
function removeScheme(id: number) {                        // 删除
  schemes.value = schemes.value.filter((x) => x.id !== id)
}
```
> ⚠️ 方案必须**真生效**：应用后表格要回到保存时的过滤结果（实测：保存「仅看已达标」3 行 → 重置 8 行 → 应用方案回到 3 行），不能只弹下拉做样子。

**⑥ 操作区**（右侧）：查询(primary) / 重置 / 快捷筛选(Dropdown：方案列表 + 保存项 + 每项删除图标) / 收起展开(`v-if groups.length>1`)。

---

## 3. 放置 / 间距规范（沿用既有约束）

- 裸写 `<mtd-row>` 做横向分栏时**必须加 `class="dash-block"`**（否则丢失纵向模块间距）。
- 交互控件（Radio/Switch/Dropdown）尺寸统一 `size="small"`，与紧凑(compact)密度一致。
- 分页放表格底部右对齐；筛选栏放主体区顶部、`flex-wrap:wrap` 防溢出。
- Tooltip info 图标颜色用最浅文字色(`--text-4`)，hover 加深，`cursor: help`。
- 涨跌趋势用胶囊(pill)：涨 `#00875a`/淡绿底，跌 `#d83931`/淡红底。

---

## 4. 自检清单

- [ ] 每个交互组件的属性/事件都经 mtd-rag 核验，无臆造。
- [ ] 选型符合习惯：少选项平铺 Radio、多选项下拉、说明走 Tooltip、危险操作才 Popconfirm。
- [ ] 是「真功能」：翻页换数据、排序换序、筛选过滤行、选择有联动、确认能拦截。
- [ ] **复杂筛选器（范式 D）**：配置驱动（groups 数组）、组件只收集不持业务数据、真过滤在父级 computed；**快捷方案保存→重置→应用能回到保存时结果**（浏览器实测）；收起只显第一行。
- [ ] **Popconfirm 用 `message` + `@ok`**（非 `title`/`@confirm`），且实测「点确定后数据/列表真变化」，不能只看弹窗弹出。
- [ ] **数值列排序**：带单位/千分位的展示值（如 "12.4 亿"/"3,860"）必须提取数字按 number 比，否则会退化成字符串序（"1.5"<"12.4" 错排）。MTD 原生写法：`sortable :sort-method="(a,b)=>数值比较"`。
- [ ] **行操作真生效**：`@action` 监听后要真改数据源（如 `ref` + `splice`），别只 `Message` 提示假装完成；「重置」应一并恢复被改动的数据。
- [ ] **指标卡/图表 Tooltip 要有数据**：`tip` 字段需在 mock/接口里真填，否则 `v-if="tip"` 下图标根本不渲染。
- [ ] 新能力向后兼容（可选 props），旧调用不破坏。
- [ ] 裸 `mtd-row` 加了 `dash-block`；控件 `size="small"`。
- [ ] `vue-tsc --noEmit` 0 错误；浏览器实测各交互生效。
