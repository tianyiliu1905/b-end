# L1 · 表单页装配逻辑

本文件描述**表单页**如何从公共模块库装配成页面。所有模块的通用规则（核心视觉、可配参数）统一维护在 L2 模块规范中，本文件只负责说明「表单页用哪些模块、按什么逻辑组合、用多大的外壳承载」。

---

## 〇、技术栈判断（最先执行）

> ⚠️ **生码前必须先确认技术栈**，不同技术栈的组件 API、CSS 类名前缀、DOM 结构存在显著差异，选错会导致组件不渲染或功能失效。

**判断方式**（按优先级）：

1. 用户在 prompt 中明确指定（如"用 React"、"Vue3 项目"）→ 直接采用
2. 查看项目 `package.json` 依赖：`@ss/mtd-react3` → React；`@ss/mtd-vue3` → Vue3；`@ss/mtd-vue2` → Vue2
3. 无法判断 → 主动询问；若没有 `package.json` 且用户未指定，沿用主 Skill 的默认 React Vite 技术栈（`@ss/mtd-react3`）

**技术栈差异速查表**：

| 差异项 | Vue3（`@ss/mtd-vue3`） | React（`@ss/mtd-react3`） |
| --- | --- | --- |
| CSS 类名前缀 | `mtd-` | `mtd-prime-` |
| Modal 显隐控制 | `v-model:visible` | `open={bool}`（⚠️ 默认 `true`，必须显式传 `false`） |
| Drawer 显隐控制 | `v-model:visible` | `visible={bool}`（默认 `false`） |
| Menu 选中 | `v-model` + `name` | `selectedKeys={[key]}` + `onSelectChange` + `key` |
| Anchor 容器指定 | `container=".app-content"` | `getContainer={() => document.querySelector('.app-content') \|\| window}` |
| Anchor 吸顶方式 | 组件自带 `affix` + `offset-top` | `affix={false}` + CSS `position: sticky` |
| Anchor items | 子组件 `<mtd-anchor-link>` | `items` 数组 prop |
| Anchor DOM 位置 | 可放在 page-header 内部 | **必须放在 page-header 外部**（sticky 限制） |
| Anchor ink 线拉通 | 组件自带 | 需手动 `width: 100%` + `border-bottom` |

> 确认技术栈后，本文档中标注「Vue3」或「React」的章节按需适用，通用规则对所有技术栈生效。React 技术栈的 Anchor 详细规则见 §6.2。

---

> 💡 **核心思想**：在 B 端，用户打开表单的意图高度确定；真正分叉大、最影响最终形态的是**承载容器（落地页 / 抽屉 / 弹窗）**。因此采用容器优先的装配逻辑。

---

## 一、装配逻辑：默认外壳 + 两步装配

### 默认外壳：全局导航（G-topnav + G-sidebar）

> ⚠️ **任何落地页（顺序/步骤/主从）必须默认包含顶导和侧导**。抽屉和弹窗浮在已有页面之上，不包含顶导侧导。

```
G-topnav（顶导，fixed 顶部，52px 高）
  └─ G-sidebar（全局侧导，fixed 左侧，168px / 收起 60px）
      └─ app-content（主内容区，灰底 var(--bg-page)）
          └─ 承载容器（page-container → page-card 白卡）
```

**加载规则**：生成落地页时，默认加载 `General-Layout.tsx`（顶导+侧导一体化模板），将表单/详情内容作为 children 嵌入 `app-content` 内。顶导和侧导的菜单数据根据业务场景合理虚构（如库存管理系统、商户管理平台等），当前页面对应的菜单项设为选中态。

### 两步装配（容器 + 模块）

```
第一步（主维度）：先定承载容器 → 顺序落地页 / 步骤落地页 / 主从落地页 / 抽屉 / 弹窗
          以字段量、复杂度和是否需要保留背景上下文为判断依据
          落地页内再分：平铺填 → 顺序；分步引导 → 步骤；左选右配 → 主从

第二步（按需叠加）：扫描 prompt，按触发词直接匹配模块
          用户每多描述一项需求 → 多叠加一个对应模块
          叠加受容器约束：弹窗不承载分组、分步等重型结构
```

> **容器是约束，模块是在约束内的填充。** 先决定用多大的外壳，再在外壳里按用户描述直接叠模块——不需要先推断"录入型/配置型"再套底座，直接读 prompt 里说了什么、就叠什么模块。

---

## 二、第一步：选承载容器（顺序落地页 / 步骤落地页 / 主从落地页 / 抽屉 / 弹窗）

这是装配的主维度。落地页适合独立任务，抽屉适合在保留背景上下文时完成中等规模编辑，弹窗适合极少字段、聚焦完成后立即返回原页面的单一操作。

承载容器本身作为模块登记在 L2 的「承载容器（PresentationContainer）」中。

选哪种容器，**以「字段量 / 复杂度」为主，以「是否打断主流程」为辅**：

| 承载方式      | 适用的字段量 / 复杂度                                  | 与主流程的关系                                       | 典型场景                                 |
| ------------- | ----------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| 弹窗（Dialog）| 极少字段（约 1–5），无分组、无分步 | 需要用户聚焦完成后立刻回到原页面，遮罩背景（模态打断） | 快速确认、重命名、单条快速编辑、二次确认 |
| 抽屉（Drawer）| 少量到中等字段，可含少量分组 | 需要边看背后列表 / 上下文边填，不想跳走 | 快速编辑、列表页就地配置、筛选项设置 |
| 顺序落地页（Sequential Page）| 字段多 / 多分组 / 含左右预览等重型结构，但一屏平铺 | 本身就是一个独立任务，需要完整空间，用户**从上到下**浏览填写 | 商户入驻（不分步）、创建套餐、综合配置等长表单 |
| 步骤落地页（Step Page）| 顺序落地页的分步变体：拆成 N 步、一次只填一步、带上一步/下一步导航 | 同顺序落地页，但流程**强线性**、需逐步引导完成 | 商户入驻（分步）、实名认证、注册向导等分步流程 |
| 主从落地页（Master-Detail Page）| 左侧对象列表 + 右侧专属配置，字段因对象而异 | 需要在多个对象间切换配置，每个对象有独立的表单 | 门店差异化配置、按角色设置权限、个性化配置 |

**落地页三选一判断口诀**：

> 看到「从上到下平铺填表 / 分组 / 普通录入」→ **顺序落地页**
> 看到「分步 / 分几步 / 向导 / 流程 / 注册 / 认证 / 入驻（流程强线性、逐步引导）」→ **步骤落地页**（顺序落地页的分步变体）
> 看到「左边点选，右边配置 / 按对象配置 / 按门店设置 / 个性化 / 两级导航 / 两层导航 / 左侧配置项列表 + 右侧表单 / 列表 + 详情 / 不同对象不同配置」→ **主从落地页**
>
> ⚠️ **「两级导航」「两层导航」≠ 一个 Menu 里的两级 SubMenu**。用户说「两级导航」时，通常描述的是两个**独立的导航区域**：外层全局模块导航（G-sidebar）+ 内层对象/配置项导航（master-panel）。遇到这类描述时，先按下方 §2.1 拆解导航层级，再决定容器。

> **优先级原则**：用户明确要求弹窗、抽屉、主从布局或分步向导时采用对应容器；未指定时按字段量、复杂度与上下文关系推断。弹窗仅适用于约 1–5 个字段且无分组、无分步的单一操作。

### 2.1 多级导航拆解规则

当用户描述中出现**多级 / 多层导航**时，必须先拆清楚每层导航的归属，再决定容器。常见于「配置中心」「系统设置」等场景：外层是全局模块切换，内层是具体配置项切换。

**拆解原则**：

| 导航层级 | 特征词 | 归属模块 | 位置 |
| --- | --- | --- | --- |
| 全局导航 | 「全局」「功能模块」「流量录制 / 数据中心 / 配置中心」 | G-topnav + G-sidebar | 页面外壳（fixed 定位） |
| 对象/配置项导航 | 「配置项」「子菜单」「基础配置 / 通用配置」「选中后右侧…」 | FD1 主从落地页 master-panel | 内容区白卡内部（flex row 左侧） |

**判断信号**：

- 用户同时描述了**两个独立的选中状态**（如「当前选中配置中心」+「当前高亮基础配置」）→ 两个独立导航，外层 G-sidebar + 内层 master-panel
- 用户用「第一级是…第二级是…」描述导航 → 拆成两层，分别归 G-sidebar 和 master-panel
- 用户说「左侧有**两级导航**」→ 不是 SubMenu 展开关系，而是两个独立导航区域

**嵌套关系**：

```
G-topnav（顶导）
  └─ G-sidebar（全局侧导，一级/二级模块切换）
      └─ app-content（内容区，灰底）
          └─ FD1 主从落地页 content-card（白卡）
              ├─ master-panel（左：配置项列表，第二个导航）
              └─ detail-panel（右：选中配置项的表单）
```

> ⚠️ **G-sidebar 和 master-panel 不是替代关系**。G-sidebar 是页面外壳的全局导航（fixed 定位，跨页面复用），master-panel 是当前页面内部的配置项导航（白卡内 flex row 左侧）。两者各管各的选中状态，互不干扰。

---

## 三、第二步：按需叠加（触发词 → 模块映射）

容器选定后，**直接扫描 prompt**：用户每多描述一项需求，就从下表匹配一个模块叠加进容器。不需要先判断意图类型，触发词命中即叠加。

| 用户多说了什么（触发词）                  | 叠加模块                  |
| ----------------------------------------- | ------------------------- |
| 填写 / 录入 / 字段 / 表单（基础信息收集）  | 基础布局（BaseLayout） |
| 提交 / 保存 / 取消 / 确定 / 操作按钮       | 操作栏（ActionBar）   |
| 分组 / 多个区域 / 分几块填                | 分组分段（GroupSection）  |
| 多条明细 / 增删行 / 列表录入              | 可编辑表格（EditableTable）|
| 上传 / 附件 / 证件 / 图片 / 凭证          | 文件上传（FileUpload）    |
| 公式 / 计算规则 / 表达式 / 指标定义       | 公式编辑器（FormulaEditor）|
| 多选 / 勾选 / 能力选择 / 适用范围         | 复选组（CheckboxGroup）|
| 分别给不同对象配置 / 按门店设置 / 个性化 / 两级导航 / 两层导航 / 配置项列表  | ⚠️ **不是叠加模块，回第一步选「主从落地页」容器；若同时存在全局导航，按 §2.1 拆解为 G-sidebar + master-panel 嵌套** |
| 分步 / 分几步 / 向导 / 流程 / 注册 / 认证 / 入驻   | ⚠️ **流程强线性时不只是叠加模块，回第一步选「步骤落地页」容器**（容器内置 Form4 步骤条，使用 MTD Steps） |
| 关联数据 / 只读列表 / 合同列表            | 只读数据表格（ReadonlyTable）|

> **基础底座**：任何表单页默认至少包含「基础布局 + 操作栏」——这是表单成立的最小集，prompt 即使没提交按钮也要补上操作栏。其余模块全部按触发词叠加。

> **内外分区不冲突**：「主从布局」管表单**内部**怎么分区（左列表 + 右详情），承载容器管整个表单**对外**用多大的外壳出现，两者可叠加。

---

## 四、容器 × 模块：约束自检

因为容器是主维度，它会反过来约束能叠加哪些重型模块。装配时先用下表自检，避免在小容器里塞重型模块：

| 容器          | 可叠加的模块                                         | 约束提示                                       |
| ------------- | ---------------------------------------------------- | ---------------------------------------------- |
| 弹窗（Dialog）| 基础布局、操作栏、文件上传、公式编辑器（精简） | ⚠️ 不放分组分段、步骤条、可编辑表格；字段超 5 条或需分组应升级为抽屉/落地页 |
| 抽屉（Drawer）| 基础布局、操作栏、文件上传、精简公式编辑器、少量分组、可编辑表格 | △ 字段控制在中等量，复杂分组需升级为落地页 |
| 顺序落地页（Sequential Page）| 全部模块（分组分段等重型结构在这里才真正展开） | ✅ 重型结构（多分组）只在落地页展开；一屏平铺，不分步 |
| 步骤落地页（Step Page）| 内置 Form4 步骤条 + 当前步可含分组分段、基础布局、文件上传、可编辑表格等 | ✅ 顺序落地页的分步变体；Form4 仅在该容器内生效，每一步内部等同一个顺序落地页白卡 |
| 主从落地页（Master-Detail Page）| 左侧对象列表 + 右侧可含分组分段、基础布局、可编辑表格等 | ✅ 右侧配置区等同一个「顺序落地页白卡」的内部，但无需再嵌套主从 |

> 弹窗命中字段超 5 条、分组、分步或可编辑表格等重型需求时，自动升级到能承载它的最小容器（弹窗 → 抽屉 → 顺序落地页）。
> 抽屉命中多分组等重型模块时，升级为顺序落地页。
> 命中分步意图时直接选步骤落地页；命中主从意图时直接选主从落地页。

---

## 五、装配示例（按承载容器分组）

以下示例先按**承载容器**归类，体现「容器是主维度」；每个示例再展示「扫描 prompt → 直接叠加模块」。

### （一）顺序落地页 Sequential Page —— 字段多 / 多分组 / 一屏平铺 / 从上到下

**例1 · 长表单分组（美团管家-创建套餐）**

Prompt：「创建套餐页面，4个分组（基础信息/套餐菜品/销售信息/点餐端展示），菜品区可增删行」

- 承载容器：**顺序落地页**（4 个分组属重型结构，但一屏平铺、不分步）
- 按需叠加：基础底座 → 基础布局 + 操作栏；"4个分组" → 分组分段；"可增删行" → 可编辑表格；"点餐端展示图片" → 文件上传
- **最终**：顺序落地页[ 分组分段 + 基础布局 + 可编辑表格 + 文件上传 + 操作栏 ]

**例2 · 综合复杂（美团管家-预估计算方式配置）**

Prompt：「预估计算方式配置，分组组织（基础/公式/例外/适用机构），含公式编辑器、动态表格和多选矩阵」

- 承载容器：**顺序落地页**（多分组 + 多重型模块，一屏平铺）
- 按需叠加：基础底座 → 基础布局 + 操作栏；"分组组织" → 分组分段；"公式编辑器" → 公式编辑器；"动态表格" → 可编辑表格；"多选矩阵" → 复选组
- **最终**：顺序落地页[ 分组分段 + 基础布局 + 公式编辑器 + 可编辑表格 + 复选组 + 操作栏 ]

### （二）步骤落地页 Step Page —— 强线性流程 / 分步引导

**例3 · 多步带上传（商户入驻-法定代表人）**

Prompt：「商户入驻流程，分4步，需要上传身份证、填写姓名证件号，还能动态添加受益人」

- 承载容器：**步骤落地页**（"分4步"命中强线性流程，容器内置步骤条）
- 按需叠加：基础底座 → 基础布局 + 操作栏（上一步/下一步/提交）；"上传身份证" → 文件上传；"动态添加受益人" → 可编辑表格；每步内多块信息 → 分组分段
- **最终**：步骤落地页[ 内置步骤条 + （当前步：分组分段 + 基础布局 + 文件上传 + 可编辑表格）+ 操作栏 ]

### （三）主从落地页 Master-Detail Page —— 左边点选 / 右边配置

**例4 · 主从联动（美团酒店-不同门店不同设置）**

Prompt：「门店差异化配置，左侧列出所有门店（可多选），选中后右侧显示该门店的配置项」

- 承载容器：**主从落地页**（左侧门店列表点选，右侧显示该门店专属配置表单）
- 左侧：门店对象列表（支持搜索/多选）
- 右侧：选中门店的配置表单（基础布局 + 操作栏）
- **最终**：主从落地页[ 左：门店列表 | 右：基础布局 + 操作栏 ]

### （四）抽屉 Drawer —— 中等字段 / 要边看背景边填

**例5 · 抽屉编辑（列表页点编辑就地修改）**

Prompt：「在订单列表页点击编辑，弹出右侧抽屉填写修改备注和状态」

- 承载容器：**抽屉**（从列表页就地编辑，需边看列表边填，字段中等）
- 按需叠加：基础底座 → 基础布局 + 操作栏
- **最终**：抽屉[ 基础布局 + 操作栏 ]

### （五）弹窗 Dialog —— 极少字段 / 聚焦单一操作

**例6 · 最简录入（飞天平台-新建指标）**

Prompt：「做一个新建指标的表单页，填写指标名称、类型、计算公式和描述，底部有取消和新建按钮」

- 承载容器：**弹窗**（字段少、单一聚焦、填完即回；若字段超 5 条或需分组，则升级为抽屉/落地页）
- 按需叠加：基础底座 → 基础布局 + 操作栏；“计算公式” → 精简公式编辑器
- **最终**：弹窗[ 基础布局 + 精简公式编辑器 + 操作栏 ]

> 同一份模块组合会受容器容量约束：字段变多或需要分组时，应从弹窗升级为抽屉或落地页。

---

## 六、装配后处理（页面级补强规则）

模块清单装配完成后，再根据**整页形态**做一遍补强。这类规则不属于任何单个模块的内部样式，而是「整页装配到一定复杂度后该不该补一个页面级辅助」的编排决策，因此放在 L1。

### 6.1 锚点定位导航（Anchor）—— 分组超 3 组时自动叠加

**判断规则**：当落地页内的 Form2 分组分段（GroupSection）**超过 3 组**时，必须在 FD2 表头信息区（PageHeader）末尾叠加一排水平锚点 tab，供用户快速跳转到目标分区。≤3 组不加。

> ⚠️ 仅落地页触发此规则；抽屉和弹窗不加 Anchor。

**Anchor 组件用法（硬约束，必须严格一致）：**

```html
<div class="page-header__anchor">
  <mtd-anchor direction="horizontal" type="card" :affix="true" :offset-top="68" container=".app-content">
    <mtd-anchor-link href="#group-id-1" title="分组标题1" />
    <mtd-anchor-link href="#group-id-2" title="分组标题2" />
    <!-- 每个分组对应一个 anchor-link，href 与分组标题 id 一一对应 -->
  </mtd-anchor>
</div>
```

**Anchor 组件属性（不可更改）：**

| 属性 | 值 | 说明 |
| --- | --- | --- |
| direction | `horizontal` | 水平方向 |
| type | `card` | 卡片 tab 样式 ⚠️ 硬约束 |
| affix | `true` | 滚动超出原位置后吸顶 |
| offset-top | `68` | 吸顶距顶部距离（顶导52px + 间距16px） |
| container | `.app-content` | 指定滚动容器 |

**Anchor 样式修正（覆盖 MTD 默认值，确保对齐与遮挡正确）：**

```css
.page-header__anchor {
  margin-top: 12px;
}
.page-header__anchor .mtd-anchor-wrapper {
  margin-left: 0;        /* 覆盖 MTD 自带 -4px，确保与标题左对齐 */
  background: var(--bg-card);      /* 白底，吸顶时不透出下方内容 */
  padding-top: 16px;     /* 白底向上延伸填充吸顶间隙 */
  margin-top: -16px;     /* 配合 padding-top 偏移 */
  z-index: 10;
}
.page-header__anchor .mtd-affix {
  z-index: 49;           /* 低于顶导(1100)和侧导(50)，不遮挡顶导阴影 */
}
```

**有 Anchor 时的 PageHeader 处理：**

- `.page-header` 加 `.page-header--no-border` 修饰类，去掉底部分割线（Anchor 本身起到视觉分隔作用）

```css
.page-header--no-border {
  border-bottom: none;
  padding-bottom: 0;
}
```

**每个分组标题（Anchor 定位目标）：**

- 使用 `<h3 id="group-id" class="form-section__title">` 作为锚点定位目标
- id 值与 anchor-link 的 `href` 去掉 `#` 后完全一致
- 标题前必须有蓝色方块装饰（`::before`，2px × 16px，主题色 `var(--primary)`，无圆角）

```css
.form-section__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-1);
  line-height: 24px;
  margin: 24px 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--divider);
  display: flex;
  align-items: center;
  gap: 8px;
}
.form-section__title::before {
  content: '';
  display: inline-block;
  width: 2px;
  height: 16px;
  background: var(--primary);  /* 随主题色变化 */
  flex-shrink: 0;
}
.form-section__title:first-child {
  margin-top: 0;
}
```

**整体流程**：

```
分组数量 > 3 ?
  ├─ 是 → PageHeader 末尾加 Anchor（card 样式、吸顶）
  │        + PageHeader 加 .page-header--no-border
  │        + 每个分组标题用 <h3 id class="form-section__title"> + 蓝色方块
  └─ 否 → 不加 Anchor，PageHeader 保持默认底线
```

---

### 6.2 React 技术栈（`@ss/mtd-react3`）Anchor 差异

> ⚠️ 当技术栈为 React（`@ss/mtd-react3`）时，Anchor 的 API 和 CSS 类名与 Vue3 版本存在显著差异，必须按以下规则生成代码。

**DOM 结构差异**：

- Anchor 必须放在 `.page-header` div **外部**（作为兄弟元素），不能放在内部。原因：CSS `position: sticky` 的限制——sticky 元素不能超出其父容器边界，放在 page-header 内部会导致吸顶失效。

```jsx
{/* ✅ 正确：anchor 独立于 page-header 外部 */}
<div className="page-header page-header--no-border">
  <Breadcrumb>...</Breadcrumb>
  <h1 className="page-header__title">标题</h1>
</div>
<div className="page-header__anchor">
  <Anchor ... />
</div>
<div className="form-section">...</div>
```

**Anchor 组件用法（React 版硬约束）：**

```jsx
<div className="page-header__anchor">
  <Anchor
    direction="horizontal"
    type="card"
    affix={false}
    getContainer={() => document.querySelector('.app-content') || window}
    items={[
      { href: '#group-id-1', title: '分组标题1' },
      { href: '#group-id-2', title: '分组标题2' },
    ]}
  />
</div>
```

**React 版 Anchor 属性对比（与 Vue3 差异）：**

| 属性 | Vue3 值 | React 值 | 说明 |
| --- | --- | --- | --- |
| affix | `:affix="true"` | `affix={false}` | React 版 affix 不支持非 window 滚动容器，改用 CSS sticky |
| container/getContainer | `container=".app-content"` | `getContainer={() => document.querySelector('.app-content') \|\| window}` | React 用函数形式返回 DOM 元素 |
| items | 子组件 `<mtd-anchor-link>` | `items` 数组 prop | React 用数据驱动，不用子组件 |
| offset-top | `:offset-top="68"` | 不需要 | 由 CSS sticky `top: 0` 控制 |

**React 版 CSS 类名前缀**：`mtd-prime-`（Vue3 为 `mtd-`）

**Anchor 样式修正（React 版，覆盖 MTD 默认值）：**

```css
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
  margin-left: 0;       /* 覆盖 MTD 默认值，确保与标题左对齐 */
  width: 100%;          /* 让 anchor 组件占满容器宽度 */
}
.page-header__anchor .mtd-prime-anchor {
  width: 100%;          /* ink 线拉通全宽 */
  border-bottom: 1px solid var(--divider);  /* 底部分割线拉通 */
}
```

**有 Anchor 时的 PageHeader 处理（React 版）：**

```css
.page-header--no-border {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;   /* React 版去掉下方 margin，由 anchor 的 margin-bottom 控制间距 */
}
```

**React 版其他组件 API 差异（常见踩坑）：**

| 组件 | Vue3 属性 | React 属性 | 说明 |
| --- | --- | --- | --- |
| Modal | `v-model:visible` | `open={bool}` | React Modal 默认 `open=true`，必须显式传 `open={false}` |
| Drawer | `v-model:visible` | `visible={bool}` | Drawer 默认关闭，由业务状态控制 |
| Menu | `v-model` + `name` | `selectedKeys={[key]}` + `onSelectChange` + `key` | React Menu 用受控数组 |

---

## 七、黄色主题 + 底部悬浮切换栏（可选装配项）

> 完整主题机制（双层联动、token 取值表、React/Vue3 接入代码）见 `references/theme-system.md`，本节只说明**表单页何时装配、切换栏放在哪、长什么样**。

**触发条件**：仅当用户明确要求"支持主题切换""加个黄色版本""要美团黄主题"等诉求时才装配本节内容；未提及主题切换时，表单页默认只用 `primary` 主题，不生成切换栏。

**装配方式**：

1. 应用最外层（路由出口之外、全局只挂一次）包一层 `ThemeProvider`（React）或调用 `useTheme()` 组合式函数完成初始化（Vue3），参考 `references/theme-examples/theme.react.tsx` / `theme.vue3.ts`。
2. 在页面根节点（或全局布局组件）追加一个**底部悬浮切换栏**，与表单页其余内容同层级渲染，不占据页面正常文档流：
   - `position: fixed; bottom: 24px; right: 24px; z-index: 9999`（表单页底部通常已有固定操作栏 Form1-action-bar，本切换栏需避开操作栏区域，可放在操作栏上方或页面右下角空白处，间距 `--gap-elem`，避免遮挡提交/取消按钮）。
   - 深色悬浮胶囊背景 `rgba(15, 23, 42, .92)` + `backdrop-filter: blur(12px)`，圆角 `--radius-2`，内部两个分段按钮（`工具蓝` / `美团黄`），当前选中项高亮（半透明白色底 `rgba(255,255,255,.16)` + 白色文字），未选中为 `rgba(255,255,255,.6)` 文字。
   - 每个分段按钮前置一个 8px 圆点色块，色值取该主题的 `--color-brand-primary` 取值，作为主题预览色标。
   - 点击分段按钮调用 `setTheme(themeKey)`，同时触发 MTD 组件层 CSS 替换与业务 token 层重新赋值（两层联动细节见 `theme-system.md` §3）。
3. 该切换栏是**全局悬浮控件**，不属于任何一种承载容器（落地页/步骤落地页/主从落地页/抽屉/弹窗）的模块清单，不在装配示例的模块列表中出现，只在"用户要求主题切换"时作为页面外层的附加装配项处理；抽屉/弹窗承载容器场景下，切换栏应挂在触发抽屉/弹窗的宿主页面上，而非抽屉/弹窗内部。
4. 黄色主题下，表单页内所有走 `var(--color-brand-primary)` 等中性 token 的元素（主提交按钮、必填星号、Steps 当前步高亮等）会自动随主题联动；**不要**为黄色主题额外写一套硬编码色值或按主题名做条件分支。

**自检**：

- [ ] 仅在用户明确要求主题切换时才装配，未要求时不生成切换栏。
- [ ] 切换栏为页面级悬浮控件，`fixed` 定位，不遮挡 Form1 底部操作栏的提交/取消按钮。
- [ ] 抽屉/弹窗承载容器时，切换栏挂在宿主页面而非浮层内部。
- [ ] 主题切换同时驱动 MTD 组件层 CSS 与业务 Token 层，两层不脱节。
- [ ] 业务代码不出现颜色字面量硬编码或按主题名分支，全部走中性 token。

---

## 八、装配产物 → 交给 L2 / L3

装配完成后得到「容器 + 模块清单」，接下来：

1. 每个模块的内部排版规则、可配参数 → 查 **L2 模块规范**（`references/L2-modules/{编号}-{模块名}.md`）。
2. 模块内具体用什么 MTD 组件、组件 API → 查 **L3**（调用 `mtd-rag.js` 实时查询知识库）。
3. 页面视觉规则 → 读取 FD1 承载容器及命中的 L2 模块，不再读取页面级全局样式文件。
4. 主题与切换栏规则 → 查 `references/theme-system.md`（双层联动机制）。
