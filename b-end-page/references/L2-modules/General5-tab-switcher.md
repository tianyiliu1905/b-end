# G-5 · 切换tab (Tab Switcher) — 已内联至 G-4

> ⚠️ **已内联**：G-5 的 Tabs + ghost 按钮功能已内联至 G-4 数据表格的第三变体「带切换tab」中。需要 tab 切换 + 表格时直接选 G-4 的「带切换tab」变体即可，不再作为独立模块单独渲染。本文件保留设计知识供参考。

页面内容区的分类切换栏，用 MTD Tabs 组件承载一级分类切换，可选第二行 ghost 按钮做二级维度筛选。

## 何时用
- 切换tab / tab切换 / 标签页 / 分类切换 / 状态切换 / tab栏。
- 当需要 tab + 表格组合时，直接用 G-4 的「带切换tab」变体。

---

## 布局 (ASCII)

### 变体一：单行tab

```
┌─────────────────────────────────────────────────────────────────┐
│ [全部] [已达成] [进行中] [落后] [严重落后]                         │
├─────────────────────────────────────────────────────────────────┤
│  （下方为表格内容区）                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 变体二：双行tab+按钮

```
┌─────────────────────────────────────────────────────────────────┐
│ [全部] [已达成] [进行中] [落后] [严重落后]                         │
│ [全部业务线] [到店] [外卖] [酒旅] [买菜] [优选]                    │
├─────────────────────────────────────────────────────────────────┤
│  （下方为表格内容区）                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "container": {
    "class": "dash-card",
    "padding_bottom": 0
  },
  "tabs": {
    "component": "MTD Tabs",
    "defaultActiveKey": "当前选中 key",
    "tabpane": "Tabs.TabPane，key + label 属性"
  },
  "button_row": {
    "display": "flex",
    "gap": 8,
    "margin_top": 12,
    "padding_bottom": 12,
    "flex_wrap": "wrap"
  },
  "button": {
    "type": "primary",
    "ghost": true,
    "size": "small",
    "text": "分类名称"
  }
}
```

---

## 数据结构

```json
{
  "tabs": [
    { "key": "string", "label": "string" }
  ],
  "subFilters": [
    { "key": "string", "label": "string" }
  ]
}
```

---

## 约束

1. 第一行固定用 MTD `Tabs` + `Tabs.TabPane`，不用原生 `<a>` 或自定义按钮模拟 tab。
2. 第二行（双行变体）按钮固定用 `Button size="small" ghost type="primary"`，不用 `Radio.Group` 或 `Select` 替代——ghost 按钮视觉更轻量，适合二级筛选场景。
3. 容器用 `.dash-card` 且 `paddingBottom: 0`，让 Tabs 自带的底部边框线充当分隔，不需额外 border。
4. 两个变体共享同一个 Tabs 数据源，双行变体额外加 `subFilters` 按钮行。
5. tab 切换必须是真功能——切换后下方图表/表格数据需联动过滤，不能只有 UI 外壳。
6. MTD React3 的 `Tabs` 用 `defaultActiveKey`（非 `value`），`TabPane` 用 `label`（非 `tab`）。

---

## 变体

### 单行tab
仅一行 MTD Tabs，用于一级分类切换（如：全部 / 已达成 / 进行中 / 落后 / 严重落后）。适合分类维度单一、无需二级筛选的场景。

### 双行tab+按钮
第一行同单行 Tabs；第二行一排 `size="small" ghost primary` 按钮，用于二级维度筛选（如业务线：全部 / 到店 / 外卖 / 酒旅 / 买菜 / 优选）。适合需要两级分类联动的场景——一级用 tab 切主分类，二级用按钮切子维度。

---

## 自检
- [ ] 第一行用 MTD Tabs + Tabs.TabPane，非原生标签模拟
- [ ] 双行变体第二行按钮用 size="small" ghost primary，非 Radio.Group
- [ ] 容器 paddingBottom: 0，Tabs 底框充当分隔
- [ ] tab 切换联动下方数据（真过滤，非只改标签）
- [ ] 需 tab + 表格时直接用 G-4「带切换tab」变体，不单独渲染 G-5

---

## MTD 实现

> ⚠️ **已内联**：G-5 的 Tabs + ghost 按钮功能已内联至 G-4 数据表格的第三变体「带切换tab」中。本文件保留 MTD 组件实现细节供参考，实际使用时直接选 G-4 的「带切换tab」变体。通用设计规格见 `General5-tab-switcher.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 标签页 | `mtd-tabs` / `mtd-tab-pane` | `<Tabs>` / `<Tabs.TabPane>` |
| 按钮（二级筛选） | `mtd-button` | `<Button>` |

纯 MTD，无图表。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Tabs,Button --target=mtd-react --quiet
```

## 骨架代码 · React

> 以下代码已内联至 `G4DataTable.tsx` 的 `g4Variants` 第三变体「带切换tab」中。

```jsx
import { Tabs, Button } from '@ss/mtd-react3'

const tabItems = [
  { key: 'all', label: '全部' },
  { key: 'achieved', label: '已达成' },
  { key: 'in_progress', label: '进行中' },
  { key: 'behind', label: '落后' },
  { key: 'critical', label: '严重落后' },
];

const subFilters = [
  { key: 'all', label: '全部业务线' },
  { key: 'daodian', label: '到店' },
  { key: 'waimai', label: '外卖' },
  { key: 'jiulv', label: '酒旅' },
  { key: 'maicai', label: '买菜' },
  { key: 'youxuan', label: '优选' },
];

// 内联在 G-4 的 dash-card 中
<div className="dash-card">
  <Tabs defaultActiveKey="all">
    {tabItems.map(t => (
      <Tabs.TabPane key={t.key} label={t.label} />
    ))}
  </Tabs>
  <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingBottom: 12, flexWrap: 'wrap' }}>
    {subFilters.map(f => (
      <Button key={f.key} size="small" ghost type="primary">{f.label}</Button>
    ))}
  </div>
  {/* 下方接 Table */}
</div>
```

## 骨架代码 · Vue3

```vue
<template>
  <div class="dash-card" style="padding-bottom: 0">
    <mtd-tabs v-model="activeTab">
      <mtd-tab-pane
        v-for="t in tabItems"
        :key="t.key"
        :label="t.label"
        :name="t.key"
      />
    </mtd-tabs>
    <div class="sub-filter-row">
      <mtd-button
        v-for="f in subFilters"
        :key="f.key"
        size="small"
        ghost
        type="primary"
        @click="onSubFilter(f.key)"
      >{{ f.label }}</mtd-button>
    </div>
    <!-- 下方接 mtd-table -->
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('all');

const tabItems = [
  { key: 'all', label: '全部' },
  { key: 'achieved', label: '已达成' },
  { key: 'in_progress', label: '进行中' },
  { key: 'behind', label: '落后' },
  { key: 'critical', label: '严重落后' },
];

const subFilters = [
  { key: 'all', label: '全部业务线' },
  { key: 'daodian', label: '到店' },
  { key: 'waimai', label: '外卖' },
  { key: 'jiulv', label: '酒旅' },
  { key: 'maicai', label: '买菜' },
  { key: 'youxuan', label: '优选' },
];
</script>

<style scoped>
.sub-filter-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-bottom: 12px;
  flex-wrap: wrap;
}
</style>
```

## 踩坑笔记

- `Tabs` 容器需 `paddingBottom: 0`，否则 Tabs 底部边框线下方会多出一段空白间距。
- React 版用 `<Tabs.TabPane>`，Vue 版用 `<mtd-tab-pane>`，注意 prop 名差异：React 用 `label` 属性 + `Tabs` 用 `defaultActiveKey`（非 `value`），Vue 用 `label` 属性 + `mtd-tabs` 用 `v-model`。
- ghost 按钮的选中态需自行管理（`ghost` 只控制样式，不自带选中/取消逻辑），建议用 state 跟踪当前选中的 subFilter key 并切换按钮样式。
- Tabs 的 `defaultActiveKey`/`activeKey`（React）/ `v-model`（Vue）必须绑定状态，`onChange` / `@change` 时联动过滤下方数据。注意 React 版 Tabs 没有 `value` prop，用 `defaultActiveKey`（非受控）或 `activeKey`（受控）。
- **已内联至 G-4**：G-5 不再作为独立模块单独渲染。需要 tab 切换 + 表格时直接选 G-4 的「带切换tab」变体，Tabs 和按钮内联在 G-4 的 `.dash-card` 中。
