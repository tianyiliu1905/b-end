# FD2 · 表头信息区（PageHeader）

> **一句话定位**：页面白色卡片内顶部的标题信息区域，由多个可选原子自由组合，承载"我在哪、这是什么页面"的信息。

---

## 一、何时用

- 落地页默认包含此模块。
- 用户提到标题、描述、面包屑、返回、公告时使用。
- 用户提到空间切换、多空间、切换空间、标签+选择器时使用。
- 用户提到状态标签、审核状态、当前状态时使用（详情页场景）。

### 技术栈判断（最先执行）

> ⚠️ 先确认技术栈，再按标注读取对应内容，标注不符的章节直接跳过。

| 判断方式 | 结果 |
| --- | --- |
| 用户指定"React" / 项目含 `@ss/mtd-react3` | → 只读标注「React」和「通用」的内容 |
| 用户指定"Vue3" / 项目含 `@ss/mtd-vue3` / 未指定 | → 只读标注「Vue3」和「通用」的内容 |

**关键差异速查**：

| 差异项 | Vue3（`@ss/mtd-vue3`） | React（`@ss/mtd-react3`） |
| --- | --- | --- |
| CSS 类名前缀 | `mtd-` | `mtd-prime-` |
| Anchor DOM 位置 | page-header 内部 | **必须放在 page-header 外部**（sticky 限制） |
| Anchor 吸顶 | 组件 `affix` + `offset-top` | `affix={false}` + CSS `position: sticky` |
| Anchor 容器 | `container=".app-content"` | `getContainer={() => document.querySelector('.app-content') \|\| window}` |
| Anchor items | 子组件 `<mtd-anchor-link>` | `items` 数组 prop |
| Anchor ink 线拉通 | 组件自带 | 需 `width: 100%` + `border-bottom` |
| Modal 显隐 | `v-model:visible` | `open={bool}`（默认 `true`） |
| Drawer 显隐 | `v-model:visible` | `visible={bool}`（默认 `false`） |

> 以下各节中：无标注 = 通用；标注【Vue3】= 仅 Vue3 适用；标注【React】= 仅 React 适用。

---

## 二、布局

PageHeader 是一个纵向堆叠的区块，位于 `.page-card` 内部顶部。自上而下可包含以下原子（均为可选）：

```
┌───────────────────────────────────────────────┐
│  [空间切换器 SpaceSwitcher]                     │ ← 可选（位于标题区最上方）
│  [面包屑 Breadcrumb]                            │ ← 可选
│  [←] 页面标题  [状态标签]                        │ ← 必选（返回icon、状态标签可选）
│  [摘要信息行 Summary]                            │ ← 可选（标签:值 字段流，与描述文字二选一）
│  [描述文字]                                      │ ← 可选
│  [公告横幅 Announcement]                         │ ← 可选
├───────────────────────────────────────────────┤
│  border-bottom: 1px solid #f0f0f0              │
└───────────────────────────────────────────────┘
```

> **空间切换器** 位于标题区最上方（面包屑之上），用于在多个业务空间之间切换。详见 §3.7。
>
> **状态标签**（详情页高频）紧跟在标题文字之后、同一行，用于展示当前记录的状态（如"审核中""已通过""已下架"）。详见 §3.8。
>
> **摘要信息行**（详情页高频）位于标题（含状态标签）下方，以"标签: 值"键值对流式排列展示该记录的核心标识与归属属性（如 ID、编号、负责人、所属分类），可多行。详见 §3.9。

---

## 三、原子定义（可配参数）

### 3.1 容器 `.page-header`

| 属性 | 值 | 说明 |
| --- | --- | --- |
| margin-bottom | `24px` | 与下方表单内容的间距 |
| padding-bottom | `16px` | 容器内底部留白 |
| border-bottom | `1px solid var(--divider)` | 底部分割线 |
| 修饰 class | `.page-header--no-border` | 有 Anchor 时加此 class，去掉底线和 padding-bottom |

### 3.2 面包屑 `.page-header__breadcrumb`

| 属性 | 值 | 说明 |
| --- | --- | --- |
| margin-bottom | `8px` | 与标题的间距 |
| 组件 | `<mtd-breadcrumb>` + `<mtd-breadcrumb-item>` | MTD 面包屑组件 |

### 3.3 标题 `.page-header__title`

| 属性 | 值 | 说明 |
| --- | --- | --- |
| font-size | `20px` | — |
| font-weight | `600` | — |
| color | `var(--text-1)` | — |
| line-height | `28px` | — |
| HTML 标签 | `<h1>` | 语义化，每页唯一 |

### 3.4 返回图标（标题前置 icon）

当标题含返回功能时，在 `<h1>` 内部标题文字**前面**放置返回图标，与文字**同一行**。

| 属性 | 值 | 说明 |
| --- | --- | --- |
| 修饰 class | `.page-header__title--with-back` 加在 `<h1>` 上 | 开启 flex 布局 |
| display | `flex` | — |
| align-items | `center` | 图标与文字垂直居中 |
| gap | `8px` | 图标与文字间距 |
| 图标组件 | `<mtd-icon name="arrow-left">` | ⚠️ 固定使用 `arrow-left`，不用 `left-thick` |
| 图标 class | `.page-header__back-icon` | — |
| 图标 font-size | `20px` | — |
| 图标 color | `var(--text-3)` | 常态色 |
| 图标 hover color | `var(--color-brand-primary)` | 悬停变主色 |
| cursor | `pointer` | — |
| flex-shrink | `0` | 图标不被压缩 |

**代码模板：**
```html
<h1 class="page-header__title page-header__title--with-back">
  <mtd-icon name="arrow-left" class="page-header__back-icon" />
  页面标题文字
</h1>
```

### 3.5 描述文字 `.page-header__desc`

| 属性 | 值 | 说明 |
| --- | --- | --- |
| font-size | `14px` | — |
| color | `var(--text-3)` | — |
| line-height | `22px` | — |
| margin-top | `4px` | 与标题的间距 |
| white-space | `nowrap` | 单行不换行 |
| overflow | `hidden` | 溢出隐藏 |
| text-overflow | `ellipsis` | 溢出省略号 |
| HTML 标签 | `<p>` | — |

### 3.6 公告横幅 `.page-header__announcement`

| 属性 | 值 | 说明 |
| --- | --- | --- |
| margin-top | `12px` | 与上方元素（标题/描述）的间距 |
| 组件 | `<mtd-announcement>` | MTD 公告组件 |
| type | `info`（默认） | 蓝色信息样式 |
| show-icon | 必须加 | 显示前置图标 |
| closable | 可选 | 允许用户关闭 |
| 内容传入方式 | `title` 属性 | 一行简短文案用 `title` prop |

**代码模板：**
```html
<mtd-announcement
  type="info"
  show-icon
  closable
  class="page-header__announcement"
  title="公告文案内容"
/>
```

> 公告 type 可选值：`info`（蓝色，默认）、`warning`（黄色）、`success`（绿色）、`error`（红色）。无特殊要求时统一使用 `info`。

### 3.7 空间切换器 `.space-switcher`

位于 `.page-header` 之上、`.page-card` 内部最顶部，用于多业务空间切换场景（如外卖/点评/酒店/闪购）。

| 属性 | 值 | 说明 |
| --- | --- | --- |
| display | `flex` | 标签与选择器横向排列 |
| align-items | `center` | 垂直居中对齐 |
| gap | `12px` | 标签与选择器间距 |
| padding-bottom | `16px` | 底部留白 |
| border-bottom | `1px solid var(--divider)` | 与下方标题区的分割线 |
| margin-bottom | `16px` | 与 `.page-header` 的间距 |

**标签 `.space-switcher__label`：**

| 属性 | 值 | 说明 |
| --- | --- | --- |
| font-size | `14px` | — |
| font-weight | `500` | — |
| color | `var(--text-3)` | 次级文字色 |
| text-align | `left` | ⚠️ **硬约束：标签必须左对齐** |
| flex-shrink | `0` | 不被压缩 |
| line-height | `22px` | — |

**选择器 `.space-switcher__select`：**

| 属性 | 值 | 说明 |
| --- | --- | --- |
| width | `240px` | 固定宽度，不做撑满 |

**代码模板：**
```html
<div class="space-switcher">
  <span class="space-switcher__label">当前空间</span>
  <mtd-select class="space-switcher__select" v-model="currentSpace">
    <mtd-option value="space1">空间一</mtd-option>
    <mtd-option value="space2">空间二</mtd-option>
  </mtd-select>
</div>
```

> **使用场景**：当同一表单需要支持多个业务空间的独立配置时使用。切换空间后表单数据应独立保存/恢复。

### 3.8 状态标签 `.page-header__status`（详情页专用原子）

紧跟在标题文字之后、同一行展示，用于标识当前记录所处的状态（审核中/已通过/已驳回/已下架等）。表单页通常不需要此原子；详情页几乎默认携带。

| 属性 | 值 | 说明 |
| --- | --- | --- |
| 组件 | MTD `Tag` | 优先用 `Tag`，纯数字/角标类状态用 `Badge` |
| margin-left | `8px` | 与标题文字的间距 |
| 垂直对齐 | `vertical-align: middle` | 与标题文字基线对齐，不错位 |
| 尺寸 | `size="small"`（如组件支持） | 避免标签视觉权重超过标题 |

**状态 → 颜色映射（示例，按业务语义调整）**：

| 语义 | Tag `type` | 说明 |
| --- | --- | --- |
| 进行中 / 审核中 | `warning`（黄） | 中性等待态 |
| 成功 / 已通过 / 已上线 | `success`（绿） | 正向完成态 |
| 失败 / 已驳回 / 已拒绝 | `danger`（红） | 负向终止态 |
| 已下架 / 已失效 / 已归档 | `default`（灰） | 中性失效态 |

**代码模板：**
```html
<h1 class="page-header__title">
  页面标题文字
  <mtd-tag theme="orange" type="bordered" size="small" class="page-header__status">审核中</mtd-tag>
</h1>
```

> **决策规则**：状态标签由 prompt 中的"状态""审核中""已通过"等触发词决定是否加载；一旦加载，颜色映射按上表语义选取，不臆造新的状态色。

### 3.9 摘要信息行 `.page-header__summary`（详情页高频原子）

位于标题（含状态标签）**下方**，用于把该记录的核心标识和归属属性以"标签: 值"键值对的形式平铺展示，是详情页最常见的表头信息密度形态（如"项目ID、项目名称、项目状态"或"任务ID、采购单、供应商"等一批字段紧跟在标题下面）。

**定位边界**：这是标题区（页头）的延伸，展示的是"这条记录是什么、属于谁"的身份类信息；不是正文分组内的详情字段展示——正文分组里成块的详情字段展示用描述列表（键值对网格，每对由 label + value 组成，`display: grid` 多列排列），两者的区别在于摘要信息行紧贴标题、无独立分组标题/卡片包裹，且字段数量精简（通常是最核心的一批标识字段），而描述列表出现在内容区分组内部，字段更完整、更详尽。

| 属性 | 值 | 说明 |
| --- | --- | --- |
| margin-top | `16px` | 与标题（或状态标签）的间距 |
| display | `flex` | 每一行内部横向排列 |
| flex-wrap | `wrap` | 超出容器宽度自动换行，不做横向滚动 |
| 行间距 | `8px`（多行时，行与行的 `row-gap`） | 见下方"两行分层" |
| 字段间距 | `32px`（同行相邻字段的间距） | 字段之间不加分隔线，纯靠间距区隔 |

**单个字段 `.page-header__summary-item`：**

| 属性 | 值 | 说明 |
| --- | --- | --- |
| display | `inline-flex` | label 与 value 同行 |
| align-items | `baseline` | 文字基线对齐 |
| gap | `4px` | label 与 value 间距 |
| white-space | `nowrap` | 单个字段内部不换行（字段之间才换行） |

**标签 `.page-header__summary-label`：**

| 属性 | 值 | 说明 |
| --- | --- | --- |
| font-size | `14px` | — |
| color | `var(--text-4)` | MTD 颜色 token `$color-text-2`（次要信息文字色） |
| line-height | `22px` | — |
| flex-shrink | `0` | 不被压缩、不换行截断 |

**值 `.page-header__summary-value`：**

| 属性 | 值 | 说明 |
| --- | --- | --- |
| font-size | `14px` | — |
| color | `var(--text-2)` | MTD 颜色 token `$color-text-4`（正文），与标签的次要文字色形成对比 |
| line-height | `22px` | — |
| 可点击态 | `color: var(--color-brand-primary)` + `cursor: pointer` | 仅当值本身是链接（如详情跳转、外链）时才使用，整行不可点击 |

**⚠️ label 宽度规则（单行 / 两行两种模式，硬约束）**：

- **单行模式**（字段数 ≤ 4 个）：label 使用自然宽度（`width: auto`），不做固定宽度处理，跟随文字内容宽度即可，字段之间靠 `gap` 区隔，用 `flex-wrap` 按自然顺序铺开，不套用 Grid 分栏。
- **两行模式**（字段数 > 4 个，即 ≥ 5 个字段时才拆两行）：**仅固定 label 宽度不足以对齐**——因为每个字段项（label+value）的总宽度仍会随 value 内容长短不一而不同，导致第二列、第三列往后的字段在两行之间依然错位。正确做法是：每个 `.page-header__summary-row` 改用 **CSS Grid**，`grid-template-columns: repeat(N, 1fr)` 中的列数 **N 两行必须统一取两行字段数中较大的那个值**（即 `N = Math.max(第一行字段数, 第二行字段数)`），**不能各自按自身字段数设置列数**——例如 4+2 拆分时，两行的列数都设为 4；字段数较少的那一行（2 个字段）只会占据 Grid 的前 2 列，第 3、4 列自然留空，这样它的列宽才会与第一行完全一致（都是"整行宽度 ÷ 4"），从而实现真正的同列对齐；如果让字段少的行按自身字段数设置列数（如 2 列），该行每列会被拉伸到整行的一半宽，与第一行的列宽完全不匹配，看起来是"对齐了行首"但实际列宽对不上、且字段少的行会被不自然地拉得很宽。每一列内部再固定 label 宽度为 `96px`（`flex-shrink: 0`），value 用 `flex: 1` 撑满该列剩余空间（超长时 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` 截断）。给 `.page-header__summary` 加修饰类 `.page-header__summary--aligned` 来整体切换到这个对齐模式。
- 两种模式二选一，由字段数量/是否分两行决定，不要在单行场景下也套用 Grid 固定列宽（字段少时固定宽度会造成不必要的留白，且单行场景本身不存在跨行对齐的需求）。
- **已知限制**：两行 Grid 对齐模式假定容器有足够宽度（详情页卡片通常 ≥ 1000px）。当一行字段数较多（如 4 个）且容器被压缩到很窄（如 900px 以内）时，均分后的单列宽度可能明显小于常见 value 内容所需宽度，导致 value 截断偏多；这是固定 96px label + 等分列宽方案的固有取舍，不需要为极端窄容器场景做特殊兜底，正常详情页容器宽度下不会出现该问题。

**⚠️ 分行时每行字段数必须为偶数（硬约束）**：两行模式下拆分字段时，每一行展示的字段个数必须是偶数（2、4、6…），不能是奇数（如 3、5）。例如 6 个字段拆两行时应拆成"第一行 4 个、第二行 2 个"，而不是"3 个 + 3 个"。若总字段数本身为奇数导致无法让每行都凑成偶数，优先把多出来的那一个字段归到第一行（此时第一行会出现奇数个，属于无法避免的退化情况，应尽量避免这种字段总数，业务上凑成偶数总数）。这样约束的原因是"标签: 值"字段本质是成对信息，按偶数个铺排更符合双栏/多栏对齐的视觉习惯，也让每行的 Grid 列数更容易统一简化（如统一按 2 的倍数分列）。

**代码模板（结构示意，两行对齐模式，6 个字段按 4+2 偶数拆行）：**
```html
<div class="page-header__summary page-header__summary--aligned">
  <!-- 第一行：4 个字段，Grid 4 列 -->
  <div class="page-header__summary-row" style="grid-template-columns: repeat(4, 1fr);">
    <span class="page-header__summary-item">
      <span class="page-header__summary-label">项目ID</span>
      <span class="page-header__summary-value">xasirvwpowp</span>
    </span>
    <span class="page-header__summary-item">
      <span class="page-header__summary-label">项目名称</span>
      <span class="page-header__summary-value">杭州酒店营建计划</span>
    </span>
    <span class="page-header__summary-item">
      <span class="page-header__summary-label">项目状态</span>
      <span class="page-header__summary-value">进行中</span>
    </span>
    <span class="page-header__summary-item">
      <span class="page-header__summary-label">优先级</span>
      <span class="page-header__summary-value">高</span>
    </span>
  </div>
  <!-- 第二行：2 个字段，但 Grid 列数仍用 4（与第一行相同），只占前 2 列，第 3/4 列留空 -->
  <div class="page-header__summary-row" style="grid-template-columns: repeat(4, 1fr);">
    <span class="page-header__summary-item">
      <span class="page-header__summary-label">组织信息</span>
      <span class="page-header__summary-value">标准店三区</span>
    </span>
    <span class="page-header__summary-item">
      <span class="page-header__summary-label">项目经理</span>
      <span class="page-header__summary-value">difcjeowp02</span>
    </span>
  </div>
</div>
```

> 示例中 `grid-template-columns` 写成行内样式仅为直观展示"两行列数统一取较大字段数"这一关系；实际实现时用 `Math.max(第一行字段数, 第二行字段数)` 算出统一的列数 N，两行的 `style` 都绑定 `repeat(N, 1fr)`（不要分别按各自字段数算，否则字段少的行会被拉伸成不同的列宽），不要在公共 CSS 类里写死某个具体的列数。

> 单行模式（字段数 ≤ 4 个）不加 `.page-header__summary--aligned` 修饰类，也不使用第二个 `.page-header__summary-row`，也不套用 Grid，所有字段按自然顺序直接铺在同一个 `.page-header__summary-row` 里，用 `flex-wrap` 展示即可。

> **决策规则**：摘要信息行由 prompt 中"标题下面展示 XX 信息""详情页头部要有 ID/编号/负责人等字段"等触发词决定是否加载；字段列表、字段数量、是否分两行均由业务数据决定，规范不写死具体字段。空值字段（无值）直接不渲染该字段项，不展示"-"占位（除非业务明确要求统一占位）。

---

## 四、变体

### 4.1 变体组合矩阵

PageHeader 的原子可自由组合。以下为所有合法变体（按复杂度递增排列）：

| 编号 | 组合 | 适用场景 |
| --- | --- | --- |
| V1 | 标题 | 最简单的创建/新建页 |
| V2 | 标题 + 描述 | 需要额外说明的页面 |
| V3 | 面包屑 + 标题 | 有路径层级的页面 |
| V4 | 面包屑 + 标题 + 描述 | 有路径且需说明 |
| V5 | 返回icon + 标题 | 编辑详情页（从列表进入） |
| V6 | 返回icon + 标题 + 描述 | 编辑详情页 + 说明 |
| V7 | 面包屑 + 标题 + 公告 | 有路径且需通知 |
| V8 | 返回icon + 面包屑 + 标题 + 公告 | 最完整形态 |
| V9 | 返回icon + 标题 + 状态标签 | 详情页最常见形态 |
| V10 | 面包屑 + 标题 + 状态标签 + 描述 | 详情页 + 路径层级 |
| V11 | 返回icon + 标题 + 状态标签 + 摘要信息行 | 详情页信息密度较高时的最常见形态 |

#### 变体选择决策规则

```
1. 标题 → 必选（所有页面都有标题）
2. 面包屑 → 有上级路径时加（用户提到"从XX进入"、页面有层级关系）
3. 返回icon → 从详情/编辑返回列表时加（用户提到"返回"、"编辑XX"、"从列表进入"）
4. 描述 → 需要补充说明时加（用户提到页面用途、审核时间等辅助信息）
5. 公告 → 有临时通知时加（用户提到"提醒"、"过期"、"升级"、"注意"）
6. 状态标签 → 详情页且用户提到"状态"、"审核中"、"已通过"等时加（表单页通常不加）
7. 摘要信息行 → 详情页且需要在标题下方展示一批核心标识/归属字段时加（用户提到"标题下面展示XX信息"、给出一批 ID/编号/负责人等字段）；描述文字与摘要信息行二选一，不同时使用（前者是一句话说明，后者是结构化字段流，语义重复时优先摘要信息行）
```

> **注意**：返回icon 和面包屑可同时存在（V8），此时面包屑在标题上方，返回icon在标题文字前。

### 4.2 抽屉与弹窗场景的标题区

落地页使用自定义 `.page-header`，但抽屉（Drawer）和弹窗（Modal）**使用组件自带的标题栏**，不再构建 `.page-header` 结构。

#### 抽屉（Drawer）标题区

| 要素 | 实现方式 | 说明 |
| --- | --- | --- |
| 标题 | `<mtd-drawer title="标题文字">` 或 `#title` slot | 组件自带标题栏，顶部固定，右侧有关闭按钮 |
| 辅助信息 | `<p class="drawer-desc">` 放在 body 区顶部（默认 slot 的第一个元素） | 位于标题栏下方、表单上方 |
| 面包屑 | 不使用 | 抽屉没有路径层级概念 |
| 返回 icon | 不使用 | 关闭抽屉即为"返回" |
| 公告 | 不使用 | 抽屉场景不加公告 |
| Anchor | 不使用 | 抽屉空间有限，不适合分区导航 |

**辅助信息样式 `.drawer-desc`：**

| 属性 | 值 | 说明 |
| --- | --- | --- |
| font-size | `14px` | — |
| color | `var(--text-3)` | 同落地页描述色 |
| line-height | `22px` | — |
| margin-bottom | `16px` | 与下方表单的间距 |

**代码模板：**
```html
<mtd-drawer v-model="visible" title="抽屉标题" width="640px" :mask-closable="false">
  <p class="drawer-desc">辅助信息文案，说明操作的背景或注意事项。</p>
  <mtd-form label-width="100px">
    <!-- 表单字段 -->
  </mtd-form>
  <template #footer>
    <mtd-button @click="visible = false">取消</mtd-button>
    <mtd-button type="primary">提交</mtd-button>
  </template>
</mtd-drawer>
```

#### 弹窗（Modal）标题区

| 要素 | 实现方式 | 说明 |
| --- | --- | --- |
| 标题 | `<mtd-modal title="标题文字">` 或 `#title` slot | 组件自带标题栏，右上角有关闭按钮 |
| 辅助信息 | `<p class="modal-desc">` 放在 body 区顶部（默认 slot 的第一个元素） | 位于标题栏下方、表单上方 |
| 面包屑 | 不使用 | 弹窗没有路径层级概念 |
| 返回 icon | 不使用 | 关闭弹窗即为"返回" |
| 公告 | 不使用 | 弹窗场景不加公告 |
| Anchor | 不使用 | 弹窗内容不宜过长，不适合分区导航 |

**辅助信息样式 `.modal-desc`：**

| 属性 | 值 | 说明 |
| --- | --- | --- |
| font-size | `14px` | — |
| color | `var(--text-3)` | 同落地页描述色 |
| line-height | `22px` | — |
| margin-bottom | `16px` | 与下方表单的间距 |

**代码模板：**
```html
<mtd-modal v-model="visible" title="弹窗标题" width="520px">
  <p class="modal-desc">辅助信息文案，说明操作的背景或注意事项。</p>
  <mtd-form label-width="80px">
    <!-- 表单字段 -->
  </mtd-form>
  <template #footer>
    <mtd-button @click="visible = false">取消</mtd-button>
    <mtd-button type="primary">确定</mtd-button>
  </template>
</mtd-modal>
```

#### 容器标题区对照总结

| 容器类型 | 标题实现 | 辅助信息位置 | 可用原子 |
| --- | --- | --- | --- |
| 落地页（Page） | 自定义 `.page-header` | `.page-header__desc`（标题下方） | 面包屑、返回icon、描述、公告 |
| 抽屉（Drawer） | 组件 `title` prop/slot | `.drawer-desc`（body 顶部） | 仅辅助描述 |
| 弹窗（Modal） | 组件 `title` prop/slot | `.modal-desc`（body 顶部） | 仅辅助描述 |

> **决策规则**：只有落地页才使用完整的 PageHeader 组合结构；抽屉和弹窗使用组件自带标题 + body 顶部辅助描述即可。

---

## 五、约束（⚠️ 硬约束，逐条执行）

1. **标题必选** —— 任何表单页 PageHeader 至少有一个 `<h1>` 标题。⚠️ 硬约束
2. **返回图标固定用 `arrow-left`** —— 不用 `left-thick`、`left`、`triangle-left`。⚠️ 硬约束
3. **返回icon 在标题内部** —— 不单独成行，不做文字按钮，直接在 `<h1>` 内标题文字前。⚠️ 硬约束
4. **公告默认 info 类型** —— 蓝色样式，必须加 `show-icon`。
5. **原子纵向顺序固定** —— 空间切换器 → 面包屑 → 标题（含返回icon、状态标签）→ 摘要信息行 → 描述 → 公告，不可调换。⚠️ 硬约束
6. **空间切换器标签左对齐** —— `.space-switcher__label` 必须使用 `text-align: left`，不可右对齐或居中。⚠️ 硬约束
7. **抽屉/弹窗不构建 `.page-header`** —— 使用组件自带标题栏，辅助信息用 `.drawer-desc` / `.modal-desc` 放在 body 顶部。⚠️ 硬约束
8. **不主动添加 Anchor** —— PageHeader 不主动添加锚点导航，除非用户明确要求。
9. **摘要信息行不与整行链接混用** —— 单个字段的值可以是链接（`color: var(--primary)`），但不允许把整个字段项或整行都做成可点击区域；空值字段直接不渲染，不用「-」占位（除非业务明确要求）。⚠️ 硬约束
10. **摘要信息行 label 不加冒号** —— `.page-header__summary-label` 只放标签文字本身（如"计划编号"），不拼接冒号，label 与 value 已通过间距/固定宽度做视觉分隔。⚠️ 硬约束
11. **摘要信息行 label / value 颜色必须使用 MTD 颜色 token** —— 不允许凭视觉直觉手写近似灰色，具体 token 名称与查询路径见 §九踩坑笔记。⚠️ 硬约束

---

## 六、L3 组件映射与 MTD 查询

### 6.1 L3 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) | 关键 Props |
|------|--------------------------|----------------------|------------|
| 面包屑 | `<Breadcrumb>` + `<Breadcrumb.Item>` | `<mtd-breadcrumb>` + `<mtd-breadcrumb-item>` | — |
| 返回图标 | `<Icon type="arrow-left">` | `<mtd-icon name="arrow-left">` | React 用 `type`，Vue 用 `name` |
| 公告横幅 | `<Announcement>` | `<mtd-announcement>` | `type`, `showIcon`, `closable`, `title` |
| 空间切换器选择器 | `<Select>` + `<Select.Option>` | `<mtd-select>` + `<mtd-option>` | React 用 `onChange`，Vue 用 `v-model` |
| 状态标签（详情页） | `<Tag>` | `<mtd-tag>` | `type`（warning/success/danger/default） |
| 摘要信息行 | 原生 `<span>`（无需组件库） | 原生 `<span>`（无需组件库） | 值为链接时可选用 `<a>` |

### 6.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Breadcrumb,Icon,Announcement,Select,Tag --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Breadcrumb,Icon,Announcement,Select,Tag --target=mtd-vue --quiet
```

---

## 七、代码骨架

### 7.1 全变体骨架 · React

```tsx
import { Breadcrumb, Icon, Announcement, Tag } from '@ss/mtd-react3';

/**
 * PageHeader 变体展示（React）
 * V1: 仅标题
 * V2: 标题 + 描述
 * V3: 面包屑 + 标题
 * V5: 返回icon + 标题
 * V7: 面包屑 + 标题 + 公告
 * V9: 返回icon + 标题 + 状态标签（详情页）
 */

/* ===== V1: 仅标题 ===== */
function PageHeaderV1() {
  return (
    <div className="page-header">
      <h1 className="page-header__title">页面标题</h1>
    </div>
  );
}

/* ===== V2: 标题 + 描述 ===== */
function PageHeaderV2() {
  return (
    <div className="page-header">
      <h1 className="page-header__title">页面标题</h1>
      <p className="page-header__desc">这是页面描述文案，说明页面用途或辅助信息。</p>
    </div>
  );
}

/* ===== V3: 面包屑 + 标题 ===== */
function PageHeaderV3() {
  return (
    <div className="page-header">
      <div className="page-header__breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="/list">上级页面</Breadcrumb.Item>
          <Breadcrumb.Item>当前页面</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <h1 className="page-header__title">页面标题</h1>
    </div>
  );
}

/* ===== V5: 返回icon + 标题 ===== */
function PageHeaderV5({ onBack }: { onBack: () => void }) {
  return (
    <div className="page-header">
      <h1 className="page-header__title page-header__title--with-back">
        <Icon
          type="arrow-left"
          className="page-header__back-icon"
          onClick={onBack}
        />
        编辑详情
      </h1>
    </div>
  );
}

/* ===== V7: 面包屑 + 标题 + 公告 ===== */
function PageHeaderV7() {
  return (
    <div className="page-header">
      <div className="page-header__breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="/list">配置中心</Breadcrumb.Item>
          <Breadcrumb.Item>当前配置</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <h1 className="page-header__title">配置管理</h1>
      <Announcement
        type="info"
        showIcon
        closable
        className="page-header__announcement"
        title="系统将于本周五 22:00 进行升级维护，届时该功能不可用。"
      />
    </div>
  );
}

/* ===== V9: 返回icon + 标题 + 状态标签（详情页最常见形态） ===== */
function PageHeaderV9({ onBack, status }: { onBack: () => void; status: 'warning' | 'success' | 'danger' | 'default' }) {
  const statusText = { warning: '审核中', success: '已通过', danger: '已驳回', default: '已下架' }[status];
  return (
    <div className="page-header">
      <h1 className="page-header__title page-header__title--with-back">
        <Icon
          type="arrow-left"
          className="page-header__back-icon"
          onClick={onBack}
        />
        详情标题
        <Tag theme={status} type="bordered" size="small" className="page-header__status">{statusText}</Tag>
      </h1>
    </div>
  );
}

/* ===== V11: 返回icon + 标题 + 状态标签 + 摘要信息行（详情页信息密度较高时的最常见形态） ===== */
interface SummaryField {
  label: string;
  value: string;
  link?: boolean;
}

function PageHeaderSummaryRow({
  fields,
  columnCount,
}: {
  fields: SummaryField[];
  columnCount: number; // 列数统一规则见 §3.9
}) {
  const visible = fields.filter((f) => f.value != null && f.value !== '');
  return (
    <div
      className="page-header__summary-row"
      style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
    >
      {visible
        .map((f) => (
          <span className="page-header__summary-item" key={f.label}>
            <span className="page-header__summary-label">{f.label}</span>
            <span
              className={
                f.link
                  ? 'page-header__summary-value page-header__summary-value--link'
                  : 'page-header__summary-value'
              }
            >
              {f.value}
            </span>
          </span>
        ))}
    </div>
  );
}

function PageHeaderV11({ onBack }: { onBack: () => void }) {
  // 分行硬约束：每行字段数必须为偶数（2/4/6…），6 个字段拆成 4+2 而不是 3+3
  // 第一行：核心标识字段（4个）；第二行：归属/分类属性（2个）
  const row1: SummaryField[] = [
    { label: '项目ID', value: 'xasirvwpowp' },
    { label: '项目名称', value: '杭州酒店营建计划' },
    { label: '项目状态', value: '进行中' },
    { label: '优先级', value: '高' },
  ];
  const row2: SummaryField[] = [
    { label: '组织信息', value: '标准店三区' },
    { label: '项目经理', value: 'difcjeowp02' },
  ];
  // 列数统一规则见 §3.9
  const columnCount = Math.max(row1.length, row2.length);

  return (
    <div className="page-header">
      <h1 className="page-header__title page-header__title--with-back">
        <Icon type="arrow-left" className="page-header__back-icon" onClick={onBack} />
        项目概览
      </h1>
      {/* 两行模式加 --aligned 修饰类：label 固定 96px，上下两行同列字段纵向对齐 */}
      <div className="page-header__summary page-header__summary--aligned">
        <PageHeaderSummaryRow fields={row1} columnCount={columnCount} />
        <PageHeaderSummaryRow fields={row2} columnCount={columnCount} />
      </div>
    </div>
  );
}

/* ===== V8: 空间切换器 + 标题 ===== */
function PageHeaderV8({ currentSpace, onSpaceChange, spaces }) {
  return (
    <>
      {/* 空间切换器：位于 page-header 之上 */}
      <div className="space-switcher">
        <span className="space-switcher__label">当前空间</span>
        <Select
          value={currentSpace}
          onChange={onSpaceChange}
          className="space-switcher__select"
        >
          {spaces.map((s) => (
            <Select.Option key={s.value} value={s.value}>
              {s.label}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="page-header">
        <h1 className="page-header__title">页面标题</h1>
      </div>
    </>
  );
}
```

### 7.2 全变体骨架 · Vue3

```vue
<template>
  <!-- ===== V1: 仅标题 ===== -->
  <div class="page-header">
    <h1 class="page-header__title">页面标题</h1>
  </div>

  <!-- ===== V2: 标题 + 描述 ===== -->
  <div class="page-header">
    <h1 class="page-header__title">页面标题</h1>
    <p class="page-header__desc">这是页面描述文案，说明页面用途或辅助信息。</p>
  </div>

  <!-- ===== V3: 面包屑 + 标题 ===== -->
  <div class="page-header">
    <div class="page-header__breadcrumb">
      <mtd-breadcrumb>
        <mtd-breadcrumb-item to="/list">上级页面</mtd-breadcrumb-item>
        <mtd-breadcrumb-item>当前页面</mtd-breadcrumb-item>
      </mtd-breadcrumb>
    </div>
    <h1 class="page-header__title">页面标题</h1>
  </div>

  <!-- ===== V5: 返回icon + 标题 ===== -->
  <div class="page-header">
    <h1 class="page-header__title page-header__title--with-back">
      <mtd-icon name="arrow-left" class="page-header__back-icon" @click="handleBack" />
      编辑详情
    </h1>
  </div>

  <!-- ===== V7: 面包屑 + 标题 + 公告 ===== -->
  <div class="page-header">
    <div class="page-header__breadcrumb">
      <mtd-breadcrumb>
        <mtd-breadcrumb-item to="/list">配置中心</mtd-breadcrumb-item>
        <mtd-breadcrumb-item>当前配置</mtd-breadcrumb-item>
      </mtd-breadcrumb>
    </div>
    <h1 class="page-header__title">配置管理</h1>
    <mtd-announcement
      type="info"
      show-icon
      closable
      class="page-header__announcement"
      title="系统将于本周五 22:00 进行升级维护，届时该功能不可用。"
    />
  </div>

  <!-- ===== V9: 返回icon + 标题 + 状态标签（详情页最常见形态） ===== -->
  <div class="page-header">
    <h1 class="page-header__title page-header__title--with-back">
      <mtd-icon name="arrow-left" class="page-header__back-icon" @click="handleBack" />
      详情标题
      <mtd-tag theme="orange" type="bordered" size="small" class="page-header__status">审核中</mtd-tag>
    </h1>
  </div>

  <!-- ===== V11: 返回icon + 标题 + 状态标签 + 摘要信息行（详情页信息密度较高时的最常见形态） ===== -->
  <!-- 两行模式加 --aligned 修饰类：label 固定 96px，上下两行同列字段纵向对齐 -->
  <div class="page-header">
    <h1 class="page-header__title page-header__title--with-back">
      <mtd-icon name="arrow-left" class="page-header__back-icon" @click="handleBack" />
      项目概览
    </h1>
    <div class="page-header__summary page-header__summary--aligned">
      <div
        class="page-header__summary-row"
        :style="{ gridTemplateColumns: `repeat(${summaryColumnCount}, 1fr)` }"
      >
        <span
          v-for="field in summaryRow1"
          :key="field.label"
          class="page-header__summary-item"
        >
          <span class="page-header__summary-label">{{ field.label }}</span>
          <span
            :class="[
              'page-header__summary-value',
              field.link && 'page-header__summary-value--link',
            ]"
          >{{ field.value }}</span>
        </span>
      </div>
      <div
        class="page-header__summary-row"
        :style="{ gridTemplateColumns: `repeat(${summaryColumnCount}, 1fr)` }"
      >
        <span
          v-for="field in summaryRow2"
          :key="field.label"
          class="page-header__summary-item"
        >
          <span class="page-header__summary-label">{{ field.label }}</span>
          <span class="page-header__summary-value">{{ field.value }}</span>
        </span>
      </div>
    </div>
  </div>

  <!-- ===== V8: 空间切换器 + 标题 ===== -->
  <div class="space-switcher">
    <span class="space-switcher__label">当前空间</span>
    <mtd-select
      v-model="currentSpace"
      class="space-switcher__select"
    >
      <mtd-option
        v-for="s in spaces"
        :key="s.value"
        :value="s.value"
      >{{ s.label }}</mtd-option>
    </mtd-select>
  </div>
  <div class="page-header">
    <h1 class="page-header__title">页面标题</h1>
  </div>
</template>

<script setup lang="ts">
const handleBack = () => {
  window.history.back();
};

// 摘要信息行数据：分行硬约束——每行字段数必须为偶数（2/4/6…），6 个字段拆成 4+2 而不是 3+3
// 第一行：核心标识字段（4个）
const summaryRow1 = [
  { label: '项目ID', value: 'xasirvwpowp' },
  { label: '项目名称', value: '杭州酒店营建计划' },
  { label: '项目状态', value: '进行中' },
  { label: '优先级', value: '高' },
];
// 第二行：归属/分类属性（2个）
const summaryRow2 = [
{ label: '组织信息', value: '标准店三区' },
{ label: '项目经理', value: 'difcjeowp02' },
];
// 列数统一规则见 §3.9
const summaryColumnCount = Math.max(summaryRow1.length, summaryRow2.length);
</script>
```

---

## 八、CSS

```css
/* G2 · 表头信息区 (PageHeader) */
.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--divider);
}

.page-header--no-border {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0; /* Anchor 容器自带 margin-bottom: 24px 接管间距 */
}

.page-header__breadcrumb {
  margin-bottom: 8px;
}

.page-header__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-1);
  line-height: 28px;
}

.page-header__desc {
  font-size: 14px;
  color: var(--text-3);
  line-height: 22px;
  margin: 4px 0 0; /* ⚠️ 必须用 margin 简写清除 <p> 标签默认 margin-bottom，否则会多出 1em 下间距 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-header__title--with-back {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-header__back-icon {
  font-size: 20px;
  color: var(--text-3);
  cursor: pointer;
  flex-shrink: 0;
}
.page-header__back-icon:hover {
  color: var(--color-brand-primary);
}

.page-header__announcement {
  margin-top: 12px;
}

/* 状态标签（详情页专用）—— 紧跟标题文字同行 */
.page-header__status {
  margin-left: 8px;
  vertical-align: middle;
}

.page-header__summary {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-header__summary-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
}

.page-header__summary-item {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
}

.page-header__summary-label {
font-size: 14px;
/* 等价 rgba(17, 25, 37, 0.45)，MTD 颜色 token：$color-text-2 次要信息文字色 */
color: var(--text-4);
line-height: 22px;
flex-shrink: 0;
}

.page-header__summary-value {
font-size: 14px;
/* 等价 rgba(17, 25, 37, 0.85)，MTD 颜色 token：$color-text-4 正文 */
color: var(--text-2);
line-height: 22px;
}

.page-header__summary-value--link {
  color: var(--color-brand-primary);
  cursor: pointer;
}

/* 两行模式：用 Grid 把每行均分成等宽列，列内 label 固定 96px、value 撑满剩余空间。
* 分行、列数统一规则见 §3.9。
* 不要在公共 CSS 类里写死具体列数，N 由 JS 动态计算后通过行内 style 绑定。 */
.page-header__summary--aligned .page-header__summary-row {
  display: grid;
  gap: 8px 16px;
  /* grid-template-columns 由 JS 动态绑定，列数统一规则见 §3.9 */
}

.page-header__summary--aligned .page-header__summary-item {
display: flex;
width: 100%;
min-width: 0;
}

.page-header__summary--aligned .page-header__summary-label {
display: inline-block;
width: 96px;
flex-shrink: 0;
}

.page-header__summary--aligned .page-header__summary-value {
flex: 1;
min-width: 0;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}

/* 【React】Anchor 吸顶容器 — affix={false} + CSS sticky
 * 必须放在 .page-header 外部（sticky 祖先不能有 overflow: hidden）
 * 用负 margin 撑满白卡宽度（抵消 .page-card 的 padding-left/right: 24px） */
.page-header__anchor {
  margin-top: 0;
  margin-bottom: 24px;
  position: sticky;
  top: 0;
  background: var(--bg-card);
  z-index: 10;
  padding-top: 16px;
  padding-bottom: 4px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
}
.page-header__anchor .mtd-prime-anchor-wrapper {
  margin-left: 0;
  width: 100%;
}
.page-header__anchor .mtd-prime-anchor {
  width: 100%;
  border-bottom: 1px solid var(--divider);
}

/* 空间切换器 — 位于 .page-header 之上，用于多空间切换 */
.space-switcher {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--divider);
  margin-bottom: 16px;
}

.space-switcher__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-3);
  text-align: left; /* ⚠️ 硬约束：标签必须左对齐 */
  flex-shrink: 0;
  line-height: 22px;
}

.space-switcher__select {
  width: 240px;
}

/* 抽屉/弹窗内辅助信息 */
.drawer-desc,
.modal-desc {
  font-size: 14px;
  color: var(--text-3);
  line-height: 22px;
  margin: 0 0 16px; /* ⚠️ 必须用 margin 简写清除 <p> 标签默认 margin-top，否则会多出 ~14px 上间距 */
}
```

---

## 九、踩坑笔记

- **React Anchor 必须放在 `.page-header` 外部**：sticky 定位要求祖先链不能有 `overflow: hidden`，而 `.page-card` 设了 `overflow: hidden`。所以 Anchor 要作为白卡的独立 flex 子项（在 `.page-header` 之后、`.scroll-content` 之前），而不是嵌套在 `.page-header` 内。
- **React Icon 用 `type` prop 而非 `name`**：`@ss/mtd-react3` 的 Icon 使用 `type="arrow-left"` 指定图标名，不是 `name="arrow-left"`（Vue3 才用 `name`）。写错会渲染空白。
- **React Breadcrumb 子项是 `Breadcrumb.Item`**：不要写 `<BreadcrumbItem>`，正确写法是 `<Breadcrumb.Item>`，这是 React 版命名空间组件的约定。
- **Drawer/Modal 用组件自带 `title` prop，不要在内部构建 `.page-header`**：抽屉和弹窗的标题区由组件自身渲染（顶部固定、带关闭按钮），在 body 内再建 `.page-header` 会导致双标题栏。辅助信息用 `.drawer-desc` / `.modal-desc` 放在 body 顶部即可。
- **返回图标固定用 `arrow-left`**：不要用 `left-thick`、`left`、`triangle-left` 等变体，统一使用 `arrow-left`。
- **描述 `<p>` 标签的 margin 陷阱**：浏览器对 `<p>` 有默认 `margin-top` 和 `margin-bottom`（约 1em），必须用 `margin: 4px 0 0` 简写一次性清除，否则间距异常。
- **公告 `showIcon` 必须加**：React 写 `showIcon`（camelCase），Vue3 写 `show-icon`（kebab-case）。不加则前置图标不显示，视觉上公告区偏空。
- **绝对禁止手写 div 模拟公告栏**：只要页面有"提示信息、注意事项、警告、公告"类文案，必须用 MTD `<Announcement>` 组件，禁止用 `<div>` + `<Icon>` + `<span>` 自行拼装。自写版本无法继承 MTD 组件内置的主题色、圆角、图标对齐等视觉规范。
- **摘要信息行用原生 `<span>` 即可，不需要引入组件库**：字段展示本质是纯文本标签+值，用原生 HTML 元素加 CSS 着色最简单，无需依赖 Descriptions 等组件；仅当某个字段值需要可点击跳转时才额外加 `page-header__summary-value--link` 修饰类（或替换为 `<a>`），且只修饰该字段的值本身，不做整行/整项可点击。
- **摘要信息行与描述文字 `.page-header__desc` 不要同时使用**：两者语义重叠（都是标题下方的补充信息），同时出现会造成信息冗余和间距混乱；文案类说明用描述文字，结构化字段用摘要信息行，二选一。
- **空值字段直接不渲染，不要保留空 label**：如果某个摘要字段没有值（如负责人字段为空），直接从数组/列表中过滤掉该项，不要渲染成"标签: "这种半截字段，也不要用「-」占位（除非业务明确要求统一占位符）。
- **字段数 ≤ 4 个时单行展示，不套用 Grid；超过 4 个（≥ 5 个）才拆两行**：字段数 ≤ 4 时直接单行 `flex-wrap` 按自然顺序铺开即可，不套用 Grid 分栏；只有字段数 > 4 个时才按"核心标识 / 归属属性"拆成两行并切到 Grid 对齐模式，不要为了视觉规整对 ≤ 4 个字段的场景也强行套用 Grid 或拆成两行。
- **只有两行模式（字段数 > 4）才加 `page-header__summary--aligned`**：字段数 ≤ 4 能单行放下时不要加这个修饰类，label 保持自然宽度、`flex-wrap` 铺开即可；只有拆成两行展示时才需要切到 Grid 对齐模式。
- **仅固定 label 宽度不能实现纵向对齐，必须配合 Grid 布局**：早期方案只给 `.page-header__summary-label` 加 `width: 96px`，结果发现每个字段项（label+value）整体宽度仍随 value 内容长短不同而不同，导致第二列、第三列往后的字段在两行之间依然对不齐（label 对齐了，value 却错落）。正确做法是把 `.page-header__summary-row` 改成 `display: grid`，用 `grid-template-columns: repeat(N, 1fr)` 均分成等宽列，列内再固定 label 宽度、value 用 `flex: 1` 撑满剩余空间，这样才能让每一行都均匀铺满整行、每一列的起始位置纵向对齐。
- **两行 Grid 列数统一规则、分行偶数规则**：见 §3.9 正文说明，此处不重复。
- **Grid 列间距（gap）过大会导致窄列下 value 宽度塌陷为 0**：4 列 + `gap: 8px 32px` 组合下，3 个列间距共占用 96px，若容器不够宽（如卡片宽度约 470px 左右），每列均分后的可用宽度会小于固定的 96px label 宽度，导致 `value` 的 `flex: 1` 计算出负可用空间、渲染宽度变成 0（表现为整列 value 内容完全不可见，而不是普通截断）。排查方法：用 `getComputedStyle` 依次检查 `.page-header__summary-value` 宽度、`.page-header__summary-item` 宽度、`.page-header__summary-row` 的 `gridTemplateColumns` 计算值，确认是否出现单列宽度 < 96px 的情况。修复方式是把 Grid 的列间距从 `32px` 减小到 `16px`（`gap: 8px 16px`），在常见详情页卡片宽度（约 1000px+）下即可保证每列可用宽度明显大于 96px；这只是缓解、不是根治——容器如果被压缩到很窄（如 900px 以内的卡片宽度）时 value 仍会明显截断，但属于极端窄容器的正常取舍，不需要额外兜底。
- **value 塌陷时绝对不要把 Grid 改成 Flex**：当发现摘要行 value 不显示时，最容易犯的错误是放弃 `display: grid` 改成 `display: flex` + `flex-wrap`——这会直接丢失四栏等宽拉通对齐的核心约束，导致上下两行的同列字段无法纵向对齐。正确的排查和修复步骤：①先用 `getComputedStyle` 检查 `.page-header__summary-row` 的 `gridTemplateColumns` 计算值和每列实际宽度；②确认是 label 固定宽度（96px）+ gap 占用了过多空间导致 value 区域不足；③**只调参数，不改结构**——优先缩小 label 宽度（如 96px → 70px），其次缩小 gap（16px → 12px），或在极端窄容器场景下减少每行列数。总原则是：Grid + 等宽列 + 固定 label + flex:1 value 这套结构是摘要行对齐的基石，任何时候都不要改掉它。
- **字段数 > 8（即需要拆 3 行及以上）时，按每组 4 个顺序切片，最后一组允许是不足 4 的余数**：两行模式的"偶数拆分"规则（如 6 拆 4+2）只覆盖了两行场景；当字段数更多、需要拆 3 行及以上时（如 11 个字段），统一按 `Math.ceil(fields.length / 4)` 计算行数，用 `fields.slice(i, i + 4)` 顺序分组（即 11 个字段拆成 4+4+3），前面各组保持满员 4 个以维持密度一致，只有最后一组允许是不可避免的余数；所有行的 Grid 列数仍统一取所有组里字段数最大值（此时通常就是 4），最后一组字段较少时占据前 N 列、其余列留空，与前面各行对齐规则完全一致。
- **label / value 颜色必须使用 MTD 颜色 token，不要手写近似灰色**：容易犯的错误是凭视觉直觉手写一个"看起来差不多"的灰色（如 `#8c8c8c` 当次要文字色、`#1f2329` 当正文色），这类色值往往和组件库真正的 token 对不上，长期会导致同一产品里出现多套灰度、难以维护换肤。正确做法是去 `@ss/mtd-react3` 包内 `lib/style/common/_base_color.scss` 查询官方文字色阶（`$color-text-1` 到 `$color-text-5`，对应不同透明度的 `rgba(17, 25, 37, *)`），按语义选取：label（次要信息）用 `$color-text-2` 即 `rgba(17, 25, 37, 0.45)`，value（正文内容）用 `$color-text-4` 即 `rgba(17, 25, 37, 0.85)`。项目未引入 scss 变量时，直接写编译后的 rgba 具体值，并在 CSS 注释里标明对应的 token 名称，方便后续追溯语义来源。
