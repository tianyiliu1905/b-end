# Detail1 · Tab 切换（TabPanel）

> **一句话定位**：详情页内部用横向 Tab 标签切换查看不同维度的信息面板，管详情页**内部**的信息切换，与承载容器（G1，管**对外**用多大外壳）互不冲突、可叠加。

---

## 一、何时用

- 横向 Tab 标签切换详情页内部不同维度的信息面板（如"基本信息 / 投放记录 / 效果数据"）。
- 当 prompt 提到 Tab / 多维度 / 切换查看 / 不同面板时使用（详情页场景）。
- 表单页一般不需要 Tab 切换。

## 二、布局

- **Tab 样式**：线条式（line），默认风格，选中态为底部主色下划线 + 文字加粗。
- **Tab 位置**：位于 G2 表头信息区下方、内容区顶部，作为内容区的维度切换入口。
- **选中态**：选中 Tab 文字颜色加深（`#1f2329`），底部出现 2px 主色（`--primary`）下划线；非选中 Tab 文字为次要色（`rgba(17, 25, 37, 0.45)`）。
- **Tab 数量上限**：建议 ≤ 5 个；超过 5 个时启用横向滚动箭头（MTD Tabs 组件内置），不要换行。
- **间距**：Tab 栏与上方表头信息区间距 16px（由 `.detail-tabs` 的 `margin-top` 控制）；Tab 栏与下方内容区间距由 TabPane 内部 padding 自然撑开。

```Plain
┌────────────────────────────────────────────────────────────────┐
│ 基本信息        运力明细        审批记录                       │ ← 横向 Tab 头，建议 2–5 项
│ ════════                                                       │ ← 选中项主色 2px 下划线 + 加粗文字
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  基本信息面板                                                  │ ← 当前 TabPane 内容，切换时替换
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 名称：配送规则 A        状态：生效                        │  │ ← 可承载描述列表、表格、分组等模块
│  │ 创建人：张三            创建时间：2024-01-15              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 三、可配参数

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| Tab 数量 | 根据信息维度数量决定，建议 2~5 个 | — |
| 每个 Tab 面板内容 | 可承载当前已开放的内容区模块（F2 分组 / G3 只读表格 / D2 描述列表 / MTD Timeline 时间线 / D3 附件预览等） | — |
| 默认选中项 | 第一个 Tab | `activeKey = tabs[0].key` |
| 受控模式 | 推荐受控用法（`activeKey` + `onChange`），便于与外部状态联动 | 受控 |
| type | Tab 风格：`line`（线条）/ `card`（卡片）/ `text`（文本） | `line` |

## 四、约束

1. **与分组分段（F2）的选择边界**：内容互斥（同一时刻只看一个维度）用 Tab；内容并列（所有分组同时展示）用 F2 分组。不要把并列的信息塞进 Tab 里强制切换。
2. **Tab 内不要再嵌套 Tab**：一个详情页只允许一层 Tab 切换。如果维度太多需要二级切换，考虑用 F2 分组在 Tab 面板内部组织，而不是嵌套 Tabs。
3. **弹窗容器内慎用 Tab**：弹窗信息量少（1~5 字段），Tab 会增加交互成本。如果信息量确实需要 Tab，说明应该升级为抽屉或落地页容器。
4. **Tab 标签文字简洁**：每个 Tab 标签建议 ≤ 4 个汉字，不要放完整句子。超长文字会被截断并显示 tooltip（MTD 内置 `tabBarItemMaxWidth` 机制）。
5. **每个 TabPane 的 key 必须唯一且稳定**：使用有语义的字符串（如 `basic`、`capacity`），不要用数组索引，避免动态增删时状态错乱。

---

## 五、L3 组件映射与 MTD 查询

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) |
|------|--------------------------|----------------------|
| Tab 容器 | `<Tabs>` | `<mtd-tabs>` |
| Tab 面板 | `<Tabs.TabPane>` | `<mtd-tab-pane>` |

### MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Tabs --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Tabs --target=mtd-vue --quiet
```

---

## 六、代码骨架

### React

```tsx
import { useState } from 'react';
import { Tabs } from '@ss/mtd-react3';

const { TabPane } = Tabs;

const tabItems = [
  { key: 'basic', label: '基本信息', content: '/* D2 描述列表 / F2 分组等 */' },
  { key: 'capacity', label: '运力明细', content: '/* G3 只读数据表格等 */' },
  { key: 'history', label: '审批记录', content: '/* MTD Timeline 时间线等 */' },
];

<Tabs activeKey={activeTab} onChange={setActiveTab} className="detail-tabs">
  {tabItems.map((tab) => (
    <TabPane label={tab.label} key={tab.key}>
      {tab.content}
    </TabPane>
  ))}
</Tabs>
```

### Vue3

```vue
<template>
  <mtd-tabs :active-key="activeTab" @change="setActiveTab" class="detail-tabs">
    <mtd-tab-pane v-for="tab in tabItems" :label="tab.label" :key="tab.key">
      {{ tab.content }}
    </mtd-tab-pane>
  </mtd-tabs>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('basic');
const tabItems = [
  { key: 'basic', label: '基本信息', content: '/* D2 描述列表 / F2 分组等 */' },
  { key: 'capacity', label: '运力明细', content: '/* G3 只读数据表格等 */' },
  { key: 'history', label: '审批记录', content: '/* MTD Timeline 时间线等 */' },
];
</script>
```

---

## 七、CSS

```css
.detail-tabs {
  margin-top: 4px;
}
```

> Tab 的线条样式、选中态下划线、间距等视觉表现由 MTD Tabs 组件内部保证，**不需要也不应该在外部 CSS 中覆写 Tab 标签的样式**。`.detail-tabs` 仅控制 Tab 容器与上方表头信息区之间的间距。

---

## 八、踩坑笔记

- **用 `label` 属性而非 `title`**：`TabPane` 的标题属性是 `label`，不是 `title`。写成 `<TabPane title="基本信息" />` 不会报错但标题不显示。
- **受控模式用 `activeKey` + `onChange`，不要混用 `defaultActiveKey`**：详情页的 Tab 切换通常需要与外部状态联动（如 URL hash 同步、父组件状态），推荐受控用法。混用受控和非受控会导致 Tab 切换行为不可预期。
- **不要手动覆写 Tab 的样式**：选中态下划线颜色、未选中文字色、Tab 间距等由 MTD 组件内部保证。在外部 CSS 中写 `.mtd-prime-tabs-nav-item { color: ... }` 之类的覆写会与组件升级产生冲突。注意 MTD 实际渲染类名为 `mtd-prime-tabs-nav-item`（非 `mtd-prime-tabs-tab`）。
