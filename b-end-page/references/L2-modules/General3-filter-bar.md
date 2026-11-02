# G-3 · 看板筛选器栏 (Dashboard Filter Bar)

看板页顶部的全局筛选条，控制整个看板主体区的数据维度（时间周期、区域、业务线、状态等）。是 G-1/G-2 之后、内容区之前的第一个模块。

> 看板页和列表页统一使用 G-3 编号（原 List-1 已合并）。本文件聚焦看板/列表页场景下的真实代码实现。

## 何时用
- 看板页默认在 G-1/G-2 之后固定输出一个 G-3（除非用户明确不要）。
- 场景 A（新建整页）：先输出 G-1 + G-2，再输出 G-3。

---

## ⭐ 两档形态：简单版 / 复杂版

按筛选维度数量分两档，**同一组件通过 `variants` 切换**，不是两个独立模块：

| 判断信号 | 选用 | 形态 |
|---------|------|------|
| 筛选维度 ≤ 4~5 个，一行排得下 | **简单版** | 白底卡片，一行：标签+时间周期 Radio.Button + 区域 Select + 右侧 重置/查询 |
| 筛选维度较多（业务线/状态等多个下拉）需要更正式的分组容器 | **复杂版** | 用 `Card` 包裹一行多个 Select/Radio 控件 + 右侧 重置/查询，视觉上比简单版更"正式"（有 Card 容器） |

> **意图判断口诀**：数据通览类看板（图表多、筛选弱）默认用简单版；筛选+表格类看板（复杂筛选、以操作为主）默认用复杂版。可通过 `defaultVariant` 直接指定默认展示哪一档，两档仍都要在 `variants` 数组中提供以便切换。

---

## 布局 (ASCII)

### 简单版
```
┌──────────────────────────────────────────────────────────────────┐
│ 时间周期：[今年][上年][近30天]    目标区域：[全国 ▾]      [重置][查询] │
└──────────────────────────────────────────────────────────────────┘
```

### 复杂版
```
┌──────────────────────────────────────────────────────────────────┐
│┌────────────────────────────────────────────────────────────────┐│
││ [今年][上年][近30天]  [全国 ▾]  [全部业务线 ▾]  [全部状态 ▾]  [重置][查询] ││
│└────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```
（复杂版比简单版多一层 `Card` 容器，且下拉维度更多）

---

## 数据结构

```json
{
  "timeOptions": [
    { "label": "今年", "value": "year" },
    { "label": "上年", "value": "last" },
    { "label": "近30天", "value": "recent30" }
  ],
  "regionOptions": [
    { "label": "全国", "value": "" },
    { "label": "华北区", "value": "huabei" }
  ]
}
```

---

## 视觉规格 (JSON)

```json
{
  "container": {
    "simple": "白底 dash-card，无边框无阴影，padding: var(--card-padding)",
    "complex": "Card 组件包裹（marginBottom: 0），内部同样 flex 一行"
  },
  "layout": "display:flex; alignItems:center; gap:var(--gap-module); flexWrap:wrap",
  "label": { "font_size": "var(--fs-12)", "color": "var(--text-3)" },
  "actions": { "position": "marginLeft:auto，靠右", "buttons": ["重置", "查询(type=primary)"] }
}
```

---

## 约束

1. 两档视觉装饰保持一致：白底、`--radius-3` 圆角、无边框无阴影，仅简单版直接用容器 div，复杂版多包一层 `Card`。
2. 筛选控件统一 `flex-wrap: wrap` 防止窄屏溢出。
3. 右侧操作区（重置/查询）用 `marginLeft: auto` 推到最右侧，查询按钮 `type="primary"`，重置为默认按钮。
4. 时间周期用 `Radio.Group` + `Radio.Button` 平铺展示（选项少且互斥），不用 Select 下拉。
5. 区域/业务线/状态等多值域用 `Select` 下拉，不用 Radio（避免选项过多撑爆一行）。
6. 筛选变化需驱动真实数据联动（如切换时间周期后图表数据应变化），不能只有 UI 外壳。

---

## 自检
- [ ] 简单档 ≤4~5 维度一行排列；复杂档维度较多且用 Card 包裹
- [ ] 时间周期用 Radio.Button 平铺，多值域用 Select 下拉
- [ ] 查询/重置按钮靠右对齐，查询为 primary
- [ ] 两档装饰一致（白底圆角无边框无阴影）
- [ ] 筛选值变化后页面数据真实联动，非静态展示

---

## MTD 实现

> MTD component library implementation details. Universal design spec in `General3-filter-bar.md`.

## L3 Component Mapping

| Function | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) | Props |
|----------|----------------------|--------------------------|-------|
| Time period switch | `mtd-radio-group` + `mtd-radio-button` | `Radio.Group` + `Radio.Button` | `value`/`onChange`，`button-style="outline"`（Vue） |
| Dimension dropdown | `mtd-select` + `mtd-option` | `Select`（`options` prop） | `v-model`/受控 value，`clearable`，`placeholder` |
| Complex-variant container | `mtd-card` | `Card` | `style={{ marginBottom: 0 }}` |
| Action buttons | `mtd-button` | `Button` | `type="primary"` 用于查询，默认态用于重置 |

## MTD Query Commands

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Radio,Select,Button,Card --target=mtd-react --quiet

node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Radio,Select,Button,Card --target=mtd-vue --quiet
```

## Skeleton Code - React

> 以下为示例站 `b-end-spec/src/pages/dashboard/OverviewDashboard.tsx` 中的真实写法，`ModuleWrapper` 通过 `variants` 数组承载简单版/复杂版两档，`defaultVariant` 控制默认展示哪一档。

```tsx
import { Select, Button, Card, Radio } from '@ss/mtd-react3'

const timeOptions = [
  { label: '今年', value: 'year' },
  { label: '上年', value: 'last' },
  { label: '近30天', value: 'recent30' },
]
const regionOptions = [
  { label: '全国', value: '' },
  { label: '华北区', value: 'huabei' },
]

const [timePeriod, setTimePeriod] = useState('year')

// 简单版
function SimpleFilterBar() {
  return (
    <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-module)', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>时间周期：</span>
      <Radio.Group value={timePeriod} onChange={(val) => setTimePeriod(val as string)}>
        {timeOptions.map(o => <Radio.Button key={o.value} value={o.value}>{o.label}</Radio.Button>)}
      </Radio.Group>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', marginLeft: 16 }}>目标区域：</span>
      <Select options={regionOptions} placeholder="全国" style={{ width: 120 }} />
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--gap-elem)' }}>
        <Button>重置</Button>
        <Button type="primary">查询</Button>
      </div>
    </div>
  )
}

// 复杂版：多包一层 Card，维度更多
function ComplexFilterBar() {
  return (
    <Card style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-module)', flexWrap: 'wrap' }}>
        <Radio.Group value={timePeriod} onChange={(val) => setTimePeriod(val as string)}>
          {timeOptions.map(o => <Radio.Button key={o.value} value={o.value}>{o.label}</Radio.Button>)}
        </Radio.Group>
        <Select options={regionOptions} placeholder="全国" style={{ width: 120 }} />
        <Select
          options={[{ label: '全部业务线', value: '' }, { label: '餐饮', value: 'food' }, { label: '零售', value: 'retail' }, { label: '服务', value: 'service' }]}
          placeholder="全部业务线" style={{ width: 140 }}
        />
        <Select
          options={[{ label: '全部状态', value: '' }, { label: '营业中', value: 'open' }, { label: '筹备中', value: 'preparing' }, { label: '已关闭', value: 'closed' }]}
          placeholder="全部状态" style={{ width: 140 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--gap-elem)' }}>
          <Button>重置</Button>
          <Button type="primary">查询</Button>
        </div>
      </div>
    </Card>
  )
}
```

## ModuleWrapper 接入（示例站写法）

```tsx
<ModuleWrapper
  moduleId="G-3 筛选器栏"
  tooltipPlacement="bottom"
  defaultVariant={0} // 数据通览类看板默认简单版；筛选+表格类看板可设为 1（复杂版）
  variants={[
    { name: '简单版', render: () => <SimpleFilterBar /> },
    { name: '复杂版', render: () => <ComplexFilterBar /> },
  ]}
/>
```

## Skeleton Code - Vue3

```vue
<template>
  <div class="filter-bar dash-card" style="display:flex;align-items:center;gap:var(--gap-module);flex-wrap:wrap">
    <span style="font-size:var(--fs-12);color:var(--text-3)">时间周期：</span>
    <mtd-radio-group v-model="timePeriod" button-style="outline">
      <mtd-radio-button v-for="o in timeOptions" :key="o.value" :value="o.value">{{ o.label }}</mtd-radio-button>
    </mtd-radio-group>
    <span style="font-size:var(--fs-12);color:var(--text-3);margin-left:16px">目标区域：</span>
    <mtd-select v-model="region" placeholder="全国" clearable style="width:120px">
      <mtd-option v-for="o in regionOptions" :key="o.value" :value="o.value" :label="o.label" />
    </mtd-select>
    <div style="margin-left:auto;display:flex;gap:var(--gap-elem)">
      <mtd-button @click="onReset">重置</mtd-button>
      <mtd-button type="primary" @click="onQuery">查询</mtd-button>
    </div>
  </div>
</template>
```

## 踩坑笔记

1. **简单版和复杂版不是两个模块，是同一 `moduleId="G-3 筛选器栏"` 的两个 `variants`**：切换只影响是否多包一层 `Card` 容器和下拉维度数量，视觉底层装饰（白底、圆角、无边框无阴影）必须一致。
2. **时间周期用 `Radio.Group`+`Radio.Button`，禁止用 `Select` 代替**：选项少且互斥的场景统一走 Radio 平铺，参见 `interaction-patterns.md`。
3. **右侧操作区用 `marginLeft: auto` 而非额外包一层 flex 容器**：保持与真实代码一致的简洁写法。
4. **筛选值必须驱动真实状态**（如 `timePeriod` 通过 `useState`/`ref` 管理并联动下方图表 mock 数据切换），不能是纯静态展示。
