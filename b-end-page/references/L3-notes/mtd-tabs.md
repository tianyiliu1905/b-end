# L3 · mtd-tabs（Tabs 标签页）

> **属于**：MTD 结构/交互组件。**被谁用**：D-3 趋势图（多视图切换）、综合驾驶舱（分组 Tab：趋势/构成/分布/进度）等。
> **怎么进来**：在 L2 说明或 SKILL.md L2 总表的「L3 实现」列看到 `mtd-tabs` 带链接 → 点进本文 → 按下方「准则」先立规矩、按「易错点」排查现象。
> **铁律**：所有写法必须仍是 MTD 合法用法 + 本项目 Token，不自造样式、不硬编码裸数值。

---

## 准则（写之前先立规矩）

- **结构**：`<mtd-tabs v-model="activeTab">` + 若干 `<mtd-tab-pane label="..." value="...">`；`value` 必须唯一且与 `v-model` 取值一致。
- **切换机制**：pane 用 `display:none` 切换（**不是** `v-if`），即所有 pane 内容**同时存在于 DOM**。
  - 含图表的 pane：图表实例会被同时挂载，注意首屏性能；隐藏 pane 里的 G2 图表可能因容器宽高为 0 渲染异常，需配合 `useG2Chart` 的 ResizeObserver 兜底（切到该 pane 可见后再 `forceFit()`）。
  - 自动化/E2E 切 Tab：点 `.mtd-tabs-item`（本体）而非内层 `.mtd-tabs-item-label`；激活态 class 为 `mtd-tab-active`。
- **间距**：Tab 容器左/右/下内边距用 `--gap-module`(8)。当前 `--gap-module` 与 `--gap-elem` 均为 8px（数值相等，无法再用更小的 token 抵消 tab 行高居中空隙），因此**上**内边距直接归零，靠 tab 文字自身约 9px 的居中空隙撑出顶部留白；并把 `:deep(.mtd-tabs-content)` 上 padding 也归零。否则顶部留白会比左侧大（详见下方易错点）。

---

## 易错点

### Tab 容器「上左间距」视觉不一致（顶部留白偏大）

**症状**：把 `mtd-tabs` 放进一个四周等距 padding 的白卡容器里（如 `.tabs-wrap { padding: var(--gap-module) }`），目测会发现**第一个 tab 文字（如「趋势」）到卡片上边缘的留白，比它到卡片左边缘的留白明显更大**，“上左不等距”，视觉发虚。

**根因（已用浏览器实测纠正——勿想当然）**：注意⚠️ **不是** “nav 自带 padding/margin”。实测 `@ss/mtd-vue3@1.3.5` 下 `.mtd-tabs-nav` / `.mtd-tabs`（根）的 padding、margin **全为 0**。真正叠加“上方留白”的是另外两层：

1. **tab 项行高撑高**：`.mtd-tabs-item`（含 `-label`）`line-height: 40px`、`height: 40px`，但字号只有 14px（实际行高 22px）。14px 文字在 40px 行高里**垂直居中**，于是文字字形顶离 nav 顶还有约 `(40-22)/2 ≈ 9px` 的居中空隙。
2. **content 自带上 padding**：`.mtd-tabs-content` 自带 `padding: 8px 0`（上下各 8px），切到 pane 后内容顶部又被顶下来一截。

**⚠️ Token 更新提示（--gap-module 已从 16px 调整为 8px）**：本文最初的修正写法是利用 `--gap-module`(16) 与 `--gap-elem`(8) 之间**恰好相差 8px**（约等于 tab 居中空隙）这一数值巧合，把容器上 padding 单独设为 `--gap-elem` 来抵消。**现在两个 token 都是 8px，数值上不再有差值可用**，原公式（`padding: var(--gap-elem) var(--gap-module) var(--gap-module)`）会退化成四向都是 8px，等于没有做任何补偿，上下留白不一致的问题会重新出现。下面的公式与写法已按新 token 值重新推导。

```
补偿前（容器四向都用 --gap-module=8 的情况）：
视觉「卡片顶 → tab 文字」 = 容器上 padding(8) + tab 文字在 40px 行高内的上居中空隙(≈9)  →  约 17
视觉「卡片左 → tab 文字」 = 容器左 padding(8)（仅此一项）                             →  8
```

左/右/下都只有容器这一层，唯独“上”被 tab 行高的居中空隙多顶了约 9px，于是上 ≈ 2 倍左，比 16px 时代的比例（25 : 16 ≈ 1.56 倍）更失衡。

**修正原则**：让「**容器上 padding + tab 文字在行高内的上居中空隙 ≈ 容器左 padding**」。由于 `--gap-elem`（当前体系里最小的间距 token，8px）已经小于居中空隙本身（≈9px），已经没有更小的语义 token 可用来做正向补偿，因此改为**容器上内边距直接归零**，让 tab 文字的居中空隙（≈9px）自然近似等于容器左 padding（8px），二者数值已经很接近，视觉上基本齐平；同时把 content 自带的上 8px 也归零，避免 nav 与内容之间再叠一层。

**落地写法（按新 token 值调整，统一用 Token、禁止裸数值）**：

```css
.tabs-wrap {
  background: var(--bg-card);
  border-radius: var(--radius-3);
  /* 上内边距归零：--gap-module 与 --gap-elem 现均为 8px，已无更小 token 可做正向补偿，
     故直接让 tab 文字自身约 9px 的居中空隙近似顶替「上 padding」，与左 padding(8) 基本齐平 */
  padding: 0 var(--gap-module) var(--gap-module);
}
/* content 自带上 8px 归零，nav 与内容间不再叠一层，间距由容器统一控 */
.tabs-wrap :deep(.mtd-tabs-content) { padding-top: 0; }
```

> 若未来 `--gap-module` 与 `--gap-elem` 的数值再次拉开差距（例如恢复到 16 / 8），应重新按「容器上 padding + 居中空隙(≈9) ≈ 容器左 padding」反推一个介于两者之间的上 padding 值，而不是直接沿用本节任一版本的写法。

> 不要去改 `.mtd-tabs-item` 的 `line-height/height`：那是 tab 的点击热区，调小会破坏可点区域与对齐。补偿要放在**外层容器 padding**上。

**核对步骤（务必实测，别凭感觉）**：① dev server 起在独立端口（注意别撞到别的项目占用的 5173），浏览器导航到目标页；② `evaluate` 量 `.mtd-tabs-item` 的 `line-height`、`.mtd-tabs-content` 的 `paddingTop`、以及 tab 文字字形顶（`Range.getBoundingClientRect`）到 `.tabs-wrap` 顶/左的距离；③ 改容器上 padding 后再量一次 + `screenshot` 比对“上边距”与“左边距”是否目测等大。

**通用心智**：“顶部留白偏大”别急着归因到“组件自带 padding”。先用 DevTools/`evaluate` **量出各层真实盒模型**（行高、自带 padding、margin），定位到底是哪层在顶。本例真凶是“行高居中空隙 + content padding”而非 nav padding。任何“组件自带间距 + 外层容器 padding”叠加的场景，都按「**容器边距 + 组件自带边距 = 目标视觉边距**」反推容器值。这条同样适用于 mtd-table 表头、mtd-card 内置 padding 等“双层间距”情形。

### Tabs + Table 组合时 tab 与表格之间出现空白间距

**症状**：Tabs 做一级切换、Table 作为 Tabs 的**兄弟元素**（而非放在 TabPane 内部）时，tab 栏和表格之间出现一段莫名的空白区域。

**根因**：MTD Tabs 组件内部始终会渲染一个 `.mtd-prime-tabs-content`（React 类名同）容器，用于承载 `TabPane` 的内容。当 Table 不在 TabPane 里面（而是和 Tabs 平级），`.mtd-prime-tabs-content` 内部为空，但它默认有 `padding: 8px 0`，加上容器本身的 `min-height` / 块级盒模型，就撑出了一块空白。

**修正原则（正解）**：**把 Table（及筛选行、Pagination）放进 `TabPane` 内部**，而不是和 Tabs 平级。这样 `.mtd-prime-tabs-content` 有实际内容，不会产生空白问题，也不需要 hack 式的 `display: none`。MTD Tabs 切换机制为 `display:none`（非销毁重建），所有 TabPane 同时存在于 DOM，因此多个 pane 共享同一个 `renderTabContent()` 函数不会触发重复挂载。

**落地写法（React）**：

```tsx
<Tabs activeKey={activeTab} onChange={setActiveTab}>
  <Tabs.TabPane key="all" label="全部">
    {renderTabContent()}  {/* Tag 筛选 + Table + Pagination */}
  </Tabs.TabPane>
  <Tabs.TabPane key="achieved" label="已达成">
    {renderTabContent()}
  </Tabs.TabPane>
  ...
</Tabs>
```

**落地写法（Vue3）**：

```vue
<mtd-tabs v-model="activeTab">
  <mtd-tab-pane name="all" label="全部">
    <TabContent />  <!-- Tag 筛选 + Table + Pagination -->
  </mtd-tab-pane>
  <mtd-tab-pane name="achieved" label="已达成">
    <TabContent />
  </mtd-tab-pane>
  ...
</mtd-tabs>
```

> **降级方案**：如果业务逻辑不允许把 Table 放进 TabPane（极少见），可用 CSS 隐藏空容器：`.dash-card--tab-table .mtd-prime-tabs-content { display: none; }`（Vue 中用 `:deep()`），但这是 hack，优先用正解。

**核对步骤**：① 浏览器 DevTools 检查 `.mtd-prime-tabs-content` 内部有实际子元素（Table 等）；② 确认 tab 栏下方紧接 Tag 筛选行或 Table，无多余空白；③ 切换 tab 后内容正常切换、无闪烁或重复挂载。

---

> 新坑/新准则按本文分区追加：准则进「准则」区，现象进「易错点」区（格式：`### 症状关键词` → 症状 / 根因 / 修正原则 / 落地写法 / 核对步骤）。
