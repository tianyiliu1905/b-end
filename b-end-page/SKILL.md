---
name: b-end-page
description: B端页面与组件的生成及修改技能（列表页+数据看板+表单页+详情页）。支持页面级（整页）、模块级（筛选器/表格/指标卡片组/趋势图等区块）、组件级（MTD 组件用法与报错排查）三种粒度，以及抽屉、弹窗等浮层形态；既可从零生成，也可对已有页面或组件做局部修改与增量迭代（改样式、调布局、增删字段列、替换组件、按截图修正、存量适配）。支持文字、截图、已有代码输入。当用户提到列表页、管理列表、看板、dashboard、表单页、新建/录入、详情页、查看详情、抽屉/侧滑/弹窗/Drawer/Modal、二次确认，或做筛选器/表格/图表模块、MTD 组件怎么用、修改优化现有 B 端页面或组件时激活。

metadata:
  skillhub.creator: "liutianyi06"
  skillhub.updater: "liutianyi06"
  skillhub.version: "V27"
  skillhub.source: "FRIDAY Skillhub"
  skillhub.skill_id: "97696"
  skillhub.high_sensitive: "false"
---

# B 端页面生成技能 (B-End Page Skill)

本 skill 用于把一句话的 B 端页面需求，自动落地为一套**符合 B 端通用设计规范**的页面代码。覆盖四大页面类型：**列表页**、**数据看板**、**表单页**和**详情页**。

组件库：**MTD 3.0**（React 用 `@ss/mtd-react3`，Vue 用 `@ss/mtd-vue3`）。

> ### ⚠️ NoCode 项目前置：必须先切换脚手架
>
> 如果识别到当前为 **NoCode 平台项目**（特征：项目路径含 `mcopilot-frontend-init`、已有 shadcn/ui 依赖、或用户提及 nocode），且环境中存在 `/nocode-frontend-init` skill，则在生成任何页面代码**之前**，必须先调用该 skill 将脚手架从默认的 React+Shadcn 切换为 **React+MTD**。
>
> **选项规则**：
> - **平台**：固定 Web（本 skill 生成 B 端页面），不询问。
> - **框架**：默认 React。但如果用户明确指定了 Vue3，则用 Vue3。
> - **组件库**：固定 MTD（本 skill 铁律），不询问。
>
> 即模板 ID 默认为 `nocode-react-mtd`，用户指定 Vue3 时为 `nocode-vue3-mtd`。调用 `nocode-frontend-init` 时，平台和组件库跳过询问，框架仅在用户未指定时默认 React（已指定则直接采用），然后执行其四个脚本（`init.sh` → `write-mcp.py` → `write-rule.py` → `restart-vite.sh`）。
>
> - 脚手架切换完成后，再按本 skill 后续流程生成页面代码。
> - 如果 `nocode-frontend-init` skill 不可用（未安装），则跳过此步骤，直接按本 skill 流程生成代码（MTD 依赖通过 npm install 安装）。

> **模块体系分流**：列表页与数据看板继续使用本目录的 G / List / D / W 模块。表单页与详情页不再使用 `references/L2-modules/` 中的旧 Form/Detail 模块，也不复用旧 L1 文件；两类页面统一读取 `references/INDEX-form-detail.md` 索引，按其中 G/F/D 模块编号、L1 装配逻辑和 L3 MTD 查询流程执行。两套 D 编号语义不同：看板 D-* 仅在看板分支使用；表单/详情的 D3/D5/D9 仅在详情页分支使用，禁止跨分支混用。

---

## 0. 何时激活

本 skill 覆盖 B 端四大页面类型。支持三种输入方式：**文字描述**（一句话需求）、**图片截图**（设计稿截图/竞品截图/手绘草图，通过图片识别页面结构并匹配 L1 模板和 L2 模块）、**已有代码**（提供现有代码文件进行增量修改）。

根据用户诉求判断粒度和类型：

### 粒度触发词

> **页面级**（L1）：做个XX管理页面 / 做个看板 / 做个数据大盘 / 生成一个列表页 / 搭一个工作台 → 走完整 §7 工作流
>
> **模块级**（L2）：做个筛选器 / 做个数据表格 / 做个指标卡片组 / 做个趋势图 → 先问"用在什么页面/什么位置"，再从 L2 模块库选型并输出模块级 Design Spec
>
> **组件级**（L3）：MTD 的 Table 怎么用 / Tabs 怎么配置 / Progress 组件用法 → 直接查 mtd-rag 并给出组件用法，不走 Design Spec 流程

### 看板页触发词
> 看板、数据看板、数据观测平台、监控大盘、数据大盘、数据驾驶舱、经营驾驶舱、dashboard、监控页、数据可视化页面、经营/营销/运营/财务/履约大盘、KPI 监控、指标监控……

### 列表页触发词
> 列表页、管理列表、人员列表、商品列表、XX管理、数据表格、数据分析表格、操作记录、日志记录、流水明细、结算明细、CRUD列表、竞品对比列表……

### 表单页触发词
> 表单页、新建、创建、新增、录入、填写、配置、设置、表单、提交表单、商户入驻、套餐创建、编辑表单、抽屉编辑、弹窗录入……

### 详情页触发词
> 详情页、查看详情、只读展示、信息展示页、审核详情、订单详情、商品详情、门店详情、投放计划详情、违规详情……

如果用户只是要一张**单独的图表**（不是一整个页面），优先用 `antv-g2-chart` skill。

---

## 1. 三层架构（核心心智模型）

```
入口路由
├── 列表页 / 数据看板
│   └── L1 模板 → L2（G/List/D/W）→ L3（MTD + AntV G2）
└── 表单页 / 详情页
    └── references/INDEX-form-detail.md
        ├── L1：references/L1-templates/page-表单页装配逻辑 / page-详情页装配逻辑
        ├── L2：按 INDEX 命中的 G/F/D 单文件模块（references/L2-modules/）
        └── L3：references/L3-notes/component-MTD组件清单.md + mtd3/ 实时知识库
```

- **L1（页面）**：决定整页骨架与模块排布。
- **L2（模块）**：可复用的功能区块。每个 L2 模块都明确「用哪些 L3 + 什么数据形态 + 什么时候用」。
- **L3（原子）**：
  - **结构/交互类** → MTD 组件，通过 `mtd3/scripts/mtd-rag.js` 在线查询真实用法（见 §4）。
  - **数据图表类** → AntV G2，遵循 `antv-g2-chart` skill 的 v5 Spec 写法。

---

## 2. L2 模块库

### 表单页 / 详情页专用模块库（最高优先级）

识别到表单页或详情页后，不读取 `references/L2-modules/index.json` 进行选型，立即读取 `references/INDEX-form-detail.md`。该索引是这两类页面的唯一模块入口：G 系为表单/详情共用，F 系为表单模块（F3/F4 可按规范复用于详情），D3/D5/D9 为详情专属。只读取 L1 装配清单命中的模块文件，禁止一次性全读。

`references/L2-modules/index.json` 只服务列表页和数据看板。

> **单文件架构**：每个 L2 模块一个 `.md` 文件——
> - 通用描述（ASCII 布局图 + JSON 视觉规格 + 数据结构 + 约束规则 + 变体 + 自检清单）在前，「## MTD 实现」章节（L3 组件映射 + 查询命令 + Vue3/React 骨架代码 + 踩坑笔记）在后。主场景为 MTD，直接读全文即可。
>
> **分层读取策略**：
> 1. 先读 `references/L2-modules/index.json`（轻量选型索引，含所有模块触发词/L3/变体/文件路径）→ 完成模块选型
> 2. 按需读命中模块的 `.md` 全文 → 获取设计规格 + MTD 实现代码
>
> L3 组件如有专属「准则+易错点」，文件在 `references/L3-notes/<组件名>.md`，**写该组件前先检查是否存在**。

### G 页面级共用模块（导航骨架 + 看板页筛选器/表格）

| 编号 | 模块 | 形态 | L3 实现 | 何时用 |
|------|------|------|---------|--------|
| G-1 | 顶部导航 | 左侧 logo 方块(24px) + 系统名(深黑) + 一级菜单 + 右侧操作区(铃铛+评论+头像) | MTD: Tabs/Icon + 模块 CSS | 所有 B 端页面 |
| G-2 | 侧边栏 | 当前业务域内部子模块 tab（可折叠）| MTD: Menu + Icon + Button | 多页面/多业务域时 |

> **G-1 + G-2 代码模板**：`references/L2-modules/General-Layout.tsx` 提供顶导+侧导一体化的完整可运行 React 模板（含内联 CSS + 踩坑笔记注释）。生成页面时直接读取并复制该模板，只替换 `navGroups` 数据、Logo/系统名称、菜单文案，保留 DOM 结构与样式。
| G-3 | 筛选器栏 | **两档**：简单档(单行 时间+下拉+查询/重置) / 复杂档(多行分组+多控件+快捷方案+收起) | MTD: DatePicker/Select/Input/Switch/Button/Dropdown | 看板页和列表页顶部（原 List-1 已合并） |
| G-4 | 数据表格 | 带序号/排序/状态标签的通用表格，3 个视觉变体（纯文字表格/带图片列/带切换tab），第三变体内联 G-5 的 Tabs+Tag 筛选 | MTD: Table/Tag/Button/Radio/Tabs | 明细/清单/管理列表/异常榜单（列表页和看板页均用此编号） |

> **G-1 + G-2 关键点**（不读源文件也要知道）：顶导(G-1) + 侧导(G-2) 一体实现为 `MtdLayout`。顶导承载「全局/跨业务域」维度并使用 MTD `Tabs`，侧导承载「当前域内子模块」。顶栏高 52px，侧栏展开 168px/折叠 60px。侧导用 MTD `Menu` + `inlineCollapsed` 控制折叠，底部触发器使用 MTD `Button`。Logo 方块 24×24 品牌蓝(`#166FF7`)实心圆角 4px，系统名颜色为深黑(`#1f2329`)而非品牌蓝。顶导与内容区通过 `box-shadow` 分隔（无 `border-bottom`），侧栏同理用 `box-shadow`（无 `border-right`）。右侧操作区为 `bell-o` + `comment-o` 图标 + 24px 灰底圆形 avatar。
>
> **G-3 / G-4 命名说明**：G-3（筛选器栏）、G-4（数据表格）在看板页和列表页均统一挂 G 前缀编号。原列表页筛选器 List-1 已合并入 G-3，不再区分页面类型。G-4 数据表格无论列表页还是看板页均统一编号为 **G-4**。

### G-4 内联逻辑子模块

G-5（切换 tab）、List-2（操作栏）、List-3（分页器）只保留逻辑 ID，全部由 `General4-data-table.md` 承载，不作为独立选型项，也不在 Design Spec 中单列。列表页固定加载单元为 `G-3 → G-4`；G-4 内部按需求启用操作栏、表格、分页器与切换 tab。原 List-1 已合并入 G-3。

### D 图表卡片类模块（看板页 + 列表页「指标+明细」均可用）

| 编号 | 模块 | 形态 | L3 实现 | 何时用 |
|------|------|------|---------|--------|
| D-1 | 指标卡片组 | 横向多卡 + 大数字 + 涨跌色标，3 种变体（纯大数字/带迷你图/带操作） | MTD: Row/Col/Card/Statistic/Tag/Icon | 概览/大盘 顶部核心指标 |
| D-2 | 环形进度 / 进度指标 | 环形进度卡 或 2×2 灰底卡片+小 Donut 组合 | MTD: Progress/Card + G2: gauge/liquid | 目标完成/预算进度 |
| D-3 | 折线图 / 面积图 | 折线/面积 + 时间轴 + sparkline | G2: line/area + MTD: Card/Radio/Tabs | 趋势/走势/同环比 |
| D-4 | 柱状图 | 竖向/横向柱状对比 | G2: interval + MTD: Card | 分类对比/进度达成 |
| D-5 | 双轴组合图 | 折线+柱状双轴组合 | G2: line+interval dual axis + MTD: Card | 双指标关联趋势 |
| D-6 | 漏斗图 | 逐层收窄漏斗 + 各层转化率 | G2: interval(funnel)+symmetryY+transpose + MTD: Card/Radio | 转化/流失/增长链路 |
| D-7 | 饼图 / 环图 | 饼图或环形图 + 图例 | G2: pie + MTD: Card | 构成占比 |
| D-8 | 堆叠进度条 | 多段堆叠横向进度条 | MTD: Card + flex/div（唯一非 G2 图表例外） | 多状态占比构成/开店进度 |
| D-9 | 排名条形图 | 横向条形 + 百分比 + 排行 | G2: interval(transpose) + MTD: Card | TOP 排名/占比构成 |
| D-10 | 散点图 | 双维度散点分布 | G2: point + MTD: Card | 相关性/分布分析 |
| D-11 | AI 诊断摘要卡 | 紫色渐变背景 + 左侧文字摘要 + 右侧指标列表 | MTD: Card/Tag/Icon + CSS gradient | AI 总结看板顶部诊断 |
| D-12 | 雷达图 | 多维度能力雷达 | G2: coordinate(radar) + MTD: Card | 多维能力/画像对比 |
| D-13 | 水波球 | 液态进度球 | G2: liquid + MTD: Card | 单一比例强调展示 |
| D-14 | 热力图 | 矩阵热力分布 | G2: cell(heatmap) + MTD: Card | 时段/区域密度分布 |
| D-15 | 玫瑰图 | 南丁格尔玫瑰图 | G2: interval(coordinate polar) + MTD: Card | 多类目占比+数值双维展示 |
| D-ChartCard | 图表统一外壳 | ChartCard：标题+小筛选+图表画布 | 所有 D 系图表模块共用 | 任何「卡片+图表」形态 |

**工作台专用 W 模块**（仅用于工作台/首页看板）：

| 编号 | 模块 | 形态 | 规格要点 | 何时用 |
|------|------|------|---------|--------|
| W-1 | 欢迎栏 | 渐变背景卡片 | 两个变体：①文字欢迎（padding: 32 28 28 32，标题 fs-24 + 副标题 fs-14，gap 12px，副标题下方「去处理」按钮 alignSelf: flex-start）②轮播图（MTD3 `<Carousel autoplay arrow="hover">`，高 160px，多 slide）| 工作台顶部问候/运营 banner |
| W-2 | 操作引导卡 | 横向三等分卡片（标题+描述+效果文字+按钮） | 标题与描述 gap 8px；效果数据用蓝色纯文字（非 Tag）；按钮 size=small | 有待办/策略推荐时 |
| W-3 | 常用功能 | flex 自适应宫格（图标+文字） | 图标为灰色占位（#9CA3AF icon + #F3F4F6 背景圆角方块），flex: 1 1 0 + minWidth 72px 实现自适应；标题行含「自定义」文字按钮 | 工作台快捷入口 |
| W-4 | 今日待办 | 右侧边栏待办列表 | 每行：左侧 label + 数字，右侧 outline 按钮（minWidth 64px 统一宽度）；header 右侧含灰色「更多」文字；待审批数字用红色 | 待办/审批/工单入口 |
| W-5 | 最新公告 | 右侧边栏公告列表 | 两个变体：①日期前缀（灰色日期+标题，fs-12，超长打点截断）②标签前缀（彩色小 Tag + 标题，超长打点截断）| 系统/业务通知 |
| W-6 | 最新动态 | 右侧边栏轮播 | MTD3 `<Carousel autoplay arrow="never">`，灰色占位 slide，Card 默认 padding | 运营/活动动态 |
| W-7 | 常用工具 | 3列网格工具卡片 | 每卡片：左侧灰色占位图标(36×36) + 标题/描述 + 右侧「立即创建」按钮；标题 fs-14，描述 fs-12 简短 | 工具/活动快捷入口 |

**工作台布局规格**：右侧边栏宽度 240px（sticky），页面统一使用 6 种字号：fs-30/fs-24/fs-18/fs-16/fs-14/fs-12。

**工作台 D-1 默认变体**：工作台页面的 D-1 指标卡片组默认使用「带迷你图」变体（sparkline），而非纯数字变体。

> **G-3 筛选器关键点**：维度 ≤5 用简单档（单行 flex）；≥6 或有分组/方案需求用复杂档（AdvancedFilterBar，配置驱动 `groups: FilterGroup[]`，v-model 吐扁平值对象，真过滤在父组件 computed）。两档装饰一致：白底圆角无边框无阴影。看板页和列表页统一用 G-3 编号（原 List-1 已合并）。
>
> **G-4 数据表格关键点**：G-4 是操作栏、表格、分页器和可选切换 tab 的唯一加载单元。List-2、List-3、G-5 仅作为内部逻辑 ID，不独立选型或渲染。所有表格差异靠 columns/props/slots 配置，且至少一列不设固定 width（弹性列）。
>
> **D-ChartCard 关键点**（不读源文件也要知道）：所有「卡片+头部+一块图表画布」统一用 ChartCard 外壳。ChartCard props: `title/tip/height/spec()/deps[]` + 可选筛选项 `dimensions/granularities/filters`。内部统一 `useG2Chart(spec, deps)` 接线，调用方不直接 import G2。复杂头部用 `#header` slot。
>
> 📎 **同模块变体**：D-1 同环比对比变体 / D-5 双轴组合本身即为独立编号（不再靠 D-3 props 实现）。

---

## 3. 意图 → 模块 映射规则

### 3.0 通用基底

每个 B 端页面默认包含 **G 页面级共用模块**：
- **所有页面**：G-1 顶导 + G-2 侧导
- **列表页额外**：G-3 筛选器栏 + G-4 数据表格（内部按需启用 List-2 操作栏、List-3 分页器和 G-5 切换 tab）
- **看板页额外**：G-3 筛选器栏 + 按业务意图选 D-1~D-15 数据模块 + 可选 G-4（需 tab 切换时用 G-4「带切换tab」变体）

> **G-3 筛选器分两档**：原 List-1 已合并入 G-3，看板页和列表页统一使用 G-3 编号。维度≤5 用简单档；≥6 或有分组/方案需求用复杂档。

#### ⚠️ G-1 + G-2 导航框架默认包含规则

**场景 A（从零生成整页）**：默认必须包含 G-1 顶部导航 + G-2 侧边栏，形成完整的页面框架（`Layout` 包裹）。直接读取 `references/L2-modules/General-Layout.tsx` 复制模板，只替换业务数据（navGroups、系统名称、菜单文案），保留 DOM 结构与内联样式。除非用户**明确要求**"不需要导航"/"不要侧栏"/"只要内容区"等排除性表述时，才可省略。

**场景 B（增量/在已有页面上增加模块）**：如果目标代码文件中**已经存在** sidebar 组件或 header/topnav 组件（如 `Layout.Sider`、`Sidebar`、`Layout.Header`、`Layout` 等），则不重复添加 G-1/G-2，只输出内容区代码即可。判断标准：读取目标文件或其父级布局文件，搜索 sidebar/header 相关组件引用。

> 简言之：**默认加，除非用户说不加，或目标已经有。** 加的时候直接用 `references/L2-modules/General-Layout.tsx` 模板起步。

### 3.1 列表页意图速查

| 用户说的关键词 | 命中编排模式 | 组合方式 | G-4 变种 |
|--------|----------------|--------|---------|
| 管理列表 / 人员列表 / XX管理 | CRUD管理列表 | G-3 + G-4（含操作栏/分页） | 基础管理表 |
| 商品列表 / 门店管理 / 带图列表 | CRUD管理列表 | G-3 + G-4（含操作栏/分页） | 图文信息表 |
| 销量分析 / 竞品对比 / 数据排名 | CRUD管理列表 | G-3 + G-4（含操作栏/分页） | 数据分析表 |
| 组织架构 / 分类管理 / 目录 / 层级 | 树形层级列表 | 左Tree + 右(G-3 + G-4) | 基础管理表 |
| 操作记录 / 日志 / 变更记录 / 审计 | 时间轴列表 | Timeline + EventCard | — |
| 账户流水 / 结算明细 / 收支记录 | 指标+明细 | D-1 + D-3(可选) + G-4（含操作栏/分页） | 流水明细表 |
| 数据分析 / 先总后分 / 指标+明细 | 指标+明细 | D-1 + D-3(可选) + G-4（含操作栏/分页） | 数据分析表 |

> 编排模式决定页面骨架（见 `references/L1-templates/page-列表页装配逻辑.md`），G-4 变种决定表格内单元格的渲染风格，两者独立判断、组合使用。变种选型决策树见下方，完整 slot 示例见 `references/L2-modules/General4-data-table.md`。

> **G-4 变种快速决策**：核心列是「对象+状态+操作」→ 基础管理表 | 有「图片/头像+名称」→ 图文信息表 | 是「数值+涨跌+排序」→ 数据分析表 | 是「时间+金额正负」→ 流水明细表 | 是「时间+操作类型+操作人」→ 日志追溯表 | 是「排名序号+指标」→ 排名榜单表。变种可混搭（如图文+涨跌列）。

### 3.2 看板页意图速查

| 用户说的关键词 | 命中的模块 | 数据形态前提 |
|--------|----------------|--------|
| 概览 / 大盘 / 核心指标 | D-1 指标卡片组 | 有几个并列的关键数字 |
| 目标 / 进度 / 完成率 | D-2 环形进度/进度指标 | 有「实际 vs 目标」的比值 |
| 趋势 / 走势 / 同比环比 | D-3 折线图/面积图 | 有时间序列数据 |
| 分类对比 / 达成率 | D-4 柱状图 | 有类目化的数值对比 |
| 双指标关联 / 量价齐看 | D-5 双轴组合图 | 有两个量纲不同但需同图对照的指标 |
| 漏斗 / 转化 / 流失 | D-6 漏斗图 | 有逐层递减的流程节点 |
| 占比 / 构成 / 饼图 | D-7 饼图/环图 | 有类目维度的构成占比 |
| 开店进度 / 多状态占比 | D-8 堆叠进度条 | 有多段状态需堆叠展示 |
| TOP / 排名 | D-9 排名条形图 | 有可排序的类目 + 数值 |
| 相关性 / 分布分析 | D-10 散点图 | 有双变量需看相关性 |
| AI 诊断 / 智能总结 / 洞察摘要 | D-11 AI 诊断摘要卡 | 有 AI 生成的文字洞察 |
| 多维能力 / 画像对比 | D-12 雷达图 | 有多个维度需同时对比 |
| 单一比例强调 | D-13 水波球 | 有一个关键比例指标需强调展示 |
| 时段/区域密度分布 | D-14 热力图 | 有双维度矩阵式分布数据 |
| 多类目占比+数值双维 | D-15 玫瑰图 | 有多个类目且需同时展现占比与数值 |
| 快捷入口 / 工作台功能网格 | W-3 常用功能 / W-7 常用工具（工作台专属，见 W 模块表） | 有多个可跳转的功能入口 |
| 明细 / 清单 / 异常项 | G-4 数据表格 | 有多行多列结构化记录 |

### 3.3 决策流程（输入 → 粒度 → 场景 → 存量扫描 → 选型）

> 这是整个 skill 的核心决策树，决定了后续走哪条路径生成代码。

#### 步骤 1：输入识别

判断用户提供了什么输入：

| 输入类型 | 识别特征 | 处理方式 |
|---------|---------|---------|
| 文字描述 | 纯文字需求，如"做个商品管理列表" | 走意图速查（§3.1/§3.2）匹配模块 |
| 图片截图 | 用户上传了图片（设计稿截图/竞品截图/手绘草图） | 用图片识别能力分析页面结构 → 匹配 L1 模板和 L2 模块 |
| 已有代码 | 用户提供了现有代码文件或指向某个文件路径 | 进入存量扫描流程（步骤 4） |

#### 步骤 2：粒度判断

根据用户意图判断生成粒度（见 §0 粒度触发词）：

- **页面级（L1）**：用户要一个完整页面 → 走完整 §7 工作流，选 L1 模板 + 组装 L2 模块
- **模块级（L2）**：表单/详情模块读取 `references/INDEX-form-detail.md` 按需加载并直接生码；列表/看板模块先问页面上下文，再从通用 L2 库选型并输出模块级 Design Spec
- **组件级（L3）**：用户问某组件怎么用 → 直接查 mtd-rag 给出用法，不走 Design Spec

#### 步骤 3：场景判断（增量 vs 存量）

| 场景 | 识别特征 | 处理方式 |
|------|---------|---------|
| **增量**（新项目/新页面） | 用户从零开始，无现有代码约束 | 用标准 MTD 风格 + 本 skill 的 Token 体系 |
| **存量**（在已有仓库中开发） | 用户指明了现有项目路径，或在工作区中已有前端代码 | 进入步骤 4 存量扫描 |

> ⚠️ **组件库铁律：使用本 skill = 使用 MTD，没有商量余地。**
>
> - 调用本 skill 生成的任何页面/模块，**一律使用 MTD 组件库**（`@ss/mtd-react3` / `@ss/mtd-vue3`）。这是使用本 skill 的前提，不需要用户额外"说要用 MTD"——**用户选择调用本 skill 本身就意味着选择 MTD**。
> - **严禁以下任何理由跳过 MTD**：① "项目已使用 shadcn/ui / Ant Design / Element / 其他组件库"；② "不应引入新的重型组件库"；③ "用户没有明确说要用 MTD"；④ "考虑到技术栈约束"；⑤ 任何 AI 自行推理出的理由。这些统统不成立。
> - 未安装 MTD 时，**先安装依赖再生成代码**，而非绕过 MTD 改用别的。
> - **唯一放弃 MTD 的条件**：用户本人亲口说出类似"用存量组件库""不要引入 MTD""用项目现有的 shadcn"这样的话。注意：用户没提 MTD ≠ 用户拒绝 MTD。沉默等于同意用 MTD。
> - 典型场景：nocode 等工具会预装 shadcn/ui + Tailwind 脚手架，项目目录和组件库已存在，但这不构成放弃 MTD 的理由。

#### 步骤 4：存量风格快照（仅存量场景）

当判定为存量场景时，先扫描用户现有代码库，输出风格摘要并说明适配依据，随后继续实施：

**扫描范围**（三项）：

1. **CSS 变量 / Token 体系**：搜索现有 CSS/样式文件中的 `:root` 变量定义、SCSS/Less 变量，提取颜色、间距、字号、圆角的命名和值。若用户已有 Token 体系，生成代码时优先用对方的变量名；若无，用本 skill 的标准 Token。

2. **状态管理方式**：检查 `package.json` 和代码中是否使用 Redux / Zustand / Pinia / Context / Vuex 等，以及组件间通信模式。生成代码时遵循对方的状态管理习惯。

3. **MTD 主题色**：检查是否存在自定义 MTD 主题——搜索 `.scss` 文件中的 `$color-primary` 变量覆盖、`@import '~@ss/mtd-react3/lib/style/index.scss'` 引用、或 `theme-yellow.css` / `leez-*.css` 等非默认主题引用。同时留意用户是否口述了主题色需求（如"我们系统是绿色的""主题色改成 #FFC300"）。若检测到或用户指定了非默认主题色，需生成自定义主题 SCSS 文件（见 §5.2）。

**输出格式**（存量风格快照）：
```
## 存量风格快照
- Token 体系：[有/无] — [如：已定义 --color-primary: #166FF7, --spacing-md: 16px ...]
- 状态管理：[useState / Redux / Pinia / Context / ...]
- 组件引用方式：[如：import { Button } from '@ss/mtd-react3']
- MTD 主题色：[默认蓝 #166FF7 / 美团黄 #FFDD00 / 自定义 #XXXXXX] — [如：检测到 custom-theme.scss 覆盖 $color-primary: #FFC300]
- 建议适配策略：[如：沿用对方 Token 变量名 + MTD 组件 + 本 skill L2 模块结构 + 生成 custom-theme.scss 覆盖主题色]
```

> ⚠️ 存量场景的铁律：**组件用 MTD，模块用本 skill 的 L2 结构，但样式遵循对方的 Token 体系和代码风格**。不是把对方的代码推翻重来，而是在对方的项目框架内按本 skill 的模块规范填充内容。

#### 步骤 5：模板选型 + 模块定制

根据前 4 步的判断结果进行选型：

**页面级**：列表/看板从 §6 的 2 份装配逻辑文件中匹配编排模式；表单/详情进入 2 类专用装配流程。允许删减不需要的模块、追加 L2 模块或调整模块变体。

**模块级**：直接从 L2 模块库选型，结合页面上下文选择最合适的变体

**选型规则**：
- 列表页：先按数据形态选编排模式（§3.1 决策树，详见 `page-列表页装配逻辑.md`），再定 G-4 变种和辅助组件
- 看板页：先按业务意图命中编排模式（§3.2 意图速查，详见 `page-看板页装配逻辑.md`），否则按信息递进组装 3~5 个 D 模块
- 表单页/详情页：不要在通用模块库中选型，立即进入表单/详情专用分支，严格执行 §7.0 流程：技术栈确认 → 读取 INDEX → L1 装配 → 按需加载 L2 → 查询 L3 → 直接生码。
- 列表页/看板页：选型完成后，**必读**命中模块的 `.md` 全文（含「## MTD 实现」章节）。

**渐进式精化**：用户可能先给出粗略需求（如"做个管理列表"），生成基础 spec 后再逐步补充（"加个复杂筛选""表格要带图片列"）。每次补充都更新 Design Spec 并增量生成代码。

---

## 4. L3 获取方式

> ⚠️ **本 skill 同时支持 Vue（2/3）和 React，统一使用 MTD 组件库**。生成代码前必须先确定目标框架。

### 4.0 框架探测（先做这一步）

检查 `package.json` 的 dependencies，判断当前框架（React / Vue）：

| 检测到的依赖 | 框架 | MTD 包 |
|---|---|---|
| `react` / `@ss/mtd-react3` | React | `@ss/mtd-react3` |
| `vue` / `@ss/mtd-vue2` / `@ss/mtd-vue3` | Vue 2/3 | `@ss/mtd-vue2` 或 `@ss/mtd-vue3` |

- 若项目尚未安装 MTD，自动安装对应的 MTD 包。
- 若没有 `package.json`（从零创建项目），默认创建 React + `@ss/mtd-react3` + `@antv/g2` 的 Vite 项目。
- 无法探测框架时**主动询问**。

读取策略：读 L2 模块的 `.md` 全文（通用规格 + MTD 实现代码）+ 执行 mtd-rag 查询。

框架决定了后续所有代码模式：
- **React**：函数组件 + JSX + 大驼峰标签 `<Button>` + `onClick`/`onChange` + `message.success()` 小写导入 + Form 第一层仅 `Form.Item`(否则加 `useContext`) + Tabs 必须加 `style={{ paddingTop: 12, width: '100%' }}`
- **Vue**：`<script setup>` + `<template>` + kebab-case `<mtd-button>` + `@click`/`v-model` + `Message.success()` 具名导入 + Form 直接 `v-model` + 受控用 `:model-value` + `@update:model-value`

> 更多差异细节（安装引入/Grid/RangePicker/useG2Chart 双版本等）见 `references/framework-guide.md`。

### 4.1 MTD 组件（结构 / 交互 / 表格 / 表单）

**⚠️ 铁律：必须**先用本 skill 自带的 `mtd3/scripts/mtd-rag.js` 查询真实组件用法，**然后再写代码**。禁止凭记忆/经验写 MTD API（prop 名、事件名、slot 结构均以 RAG 查询结果为准）。**违反此规则等于整页作废。** 典型易错：Tooltip 用 `message` 不是 `content`、Progress 用 `showInfo` 不是 `showText`、Popconfirm 用 `message` 不是 `title`。查询命令：

```bash
# React 项目
node "<本skill路径>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Card,Row,Col,Table,Tag,Progress,Select,DatePicker,Button,Pagination \
  --target=mtd-react --quiet

# Vue 项目（Vue 2/3 共用 target）
node "<本skill路径>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Card,Row,Col,Table,Tag,Progress,Select,DatePicker,Button,Pagination \
  --target=mtd-vue --quiet
```

- 特殊组件注意事项遵循 `mtd3/MTD3-SKILL.md`；详细命令见 `mtd3/scripts/HOW_TO_USE.md`；安装与包名见 `mtd3/references/INSTALLATION.md`。
- ⚠️ **写某个 L3 组件前，先检查 `references/L3-notes/<组件名>.md` 是否存在**。当前已有特殊描述的 L3 组件：
  - **mtd-tabs**（`references/L3-notes/mtd-tabs.md`）：Tabs 的间距补偿（上左留白不一致）、Tabs+Table 组合时 `.mtd-prime-tabs-content` 空容器撑出空白间距，被 D-3 趋势图、综合驾驶舱、G-4 变体三等使用
  - **mtd-row**（`references/L3-notes/mtd-row.md`）：Row/Col 栅格的用法约束，被 D-1 指标卡片组、详情页摘要等使用
  - 凡是用到以上组件，**必须先读对应说明文件**，按「准则」立规矩、按「易错点」排查，不得跳过。

### 4.2 AntV G2 图表（趋势 / 占比 / 分布 / 排名）

数据图表统一用 **AntV G2 v5（Spec 模式）**，完整约束遵循同目录 `antv-g2-chart` skill：
- 只用 `chart.options({ type, data, encode, transform, ... })`，`options()` 只调一次；
- `transform` 是数组；label 用复数 `labels`；坐标系/比例尺按 references 写法。

**图表挂载**：统一通过 `useG2Chart` 封装（`references/g2-chart-foundation.md` 有完整可复制代码）：
- Vue：`const { containerRef } = useG2Chart(() => spec, [dep1Ref])`（Composition API composable）
- React：`const containerRef = useG2Chart(() => spec, [dep1])`（Hook）
- 内部含 `ResizeObserver` 兜底（解决侧栏折叠后图表不自适应）+ `autoFit` + 清理
- 容器必须有确定高度（如 `height:280px`），宽度 `width:100%`
- deps 变化时自动重渲染，**不要手动 new 第二个 Chart**

**图表外壳**：所有「卡片+头部+图表画布」形态统一用 `ChartCard`（已在 §2 D-ChartCard 内联说明，文件见 `references/L2-modules/DashboardChartCard.md`）。

### 4.3 交互组件使用范式

当模块需要从「静态展示」升级到「可交互」时，读 `references/interaction-patterns.md`。核心选型原则：
- 选项少且互斥 → **Radio.Group + Radio.Button（`buttonStyle="outline"`）平铺**（如：日/周/月 切换）。⚠️ 禁止用原生 `<button>` 或自定义样式代替
- 选项多 → **Dropdown/Select 下拉**
- 辅助说明 → **Tooltip** + `question-circle-o` hover
- 危险操作 → **Popconfirm**（`message` 属性 + `@ok` 事件，⚠️ 不是 `title`/`@confirm`）
- 布尔开关 → **Switch**
- 分页/排序/筛选/选择都必须是**真功能**（computed 真排序/真切片/真过滤），不能只有 UI 外壳

---

## 5. 视觉规范（强约束）

> 样式唯一指令源：`references/style-profile.md`（完整 Token 定义 + 图表色板 + 通用工具类 + 自检清单）。
> **禁止凭记忆或自行发明色值/字号/间距**，全部用 `var(--token)`。

> **⚠️ 品牌色/主题色铁律**：当用户要求使用特定品牌色（如"美团黄"、"品牌蓝"）时，**禁止凭印象编造色值**——AI 对具体 hex 值的"记忆"极不可靠（例如会把美团黄 `#FFDD00` 错写成 `#FFC300`）。必须按以下优先级获取真实色值：① 用户明确给出的 hex 值；② 组件库官方主题包（如 MTD 的 `theme-yellow.css`）；③ 设计稿/Design Token 文件。三者都无法获取时，**必须主动向用户确认色值**，不得猜测。同理，品牌色覆盖组件库主色时，禁止用 inline style 逐个组件覆盖，应使用组件库提供的主题包或 CSS 变量全局覆盖机制。

### 5.1 核心 Token 速查（写代码时直接用，不必跳转）

**色彩**：主色 `--color-brand-primary: #166FF7` | 品牌黄 `--color-accent: #FFDD00`（仅小面积点缀）| 文字 `--text-1:#111925` / `--text-2:rgba(17,25,37,.85)` / `--text-3:rgba(17,25,37,.65)` | 背景 `--bg-page:#F3F3F4` / `--bg-card:#FFF` / `--bg-card-inner:#F8F8F8` | 分割 `--divider:rgba(17,25,37,.10)` | 涨跌 `--chart-up:#FF1F1F`(红) / `--chart-down:#00A854`(绿)

**文字**：字阶 `--fs-30/24/20/18/16/14/12`，行高 = 字号+8（`--lh-30..12`）。字重 `--fw-regular:400` / `--fw-medium:500` / `--fw-semibold:600`。

**间距（5 级语义）**：`--gap-elem:8px`（组内最小）/ `--gap-module:8px`（模块间外部间距/栅格gutter）/ `--card-padding:16px`（卡片/容器内边距、表格单元格、tab、分页器）/ `--gap-section:24px`（逻辑大段分区）/ `--gap-page:16px`（内容区外缘）。**盒模型 padding 四向一致**，卡片类容器写 `padding: var(--card-padding)`，纯外间距容器写 `padding: var(--gap-module)`，禁止上下/左右不等的两值写法（表格单元格/tab 等组件内部排版除外，详见 style-profile.md §3）。

**圆角**：`--radius-1:16px`（最大容器）/ `--radius-2:10px`（弹窗）/ `--radius-3:6px`（**卡片默认**，别名 `--radius`）/ `--radius-4:4px`（小组件/标签/柱条）。嵌套规则：外圆 > 内圆。

**阴影**：`--shadow-high`(悬浮栏) / `--shadow-mid`(悬浮按钮) / `--shadow-low`(一般卡片) / `--shadow-min`(分段器) / `--shadow-card`=`--shadow-min`。**看板平面内的卡片/筛选栏/图表容器统一不用阴影也不用描边**（阴影只用于真正悬浮元素：弹窗/浮层/下拉/气泡）。

**装饰一致性（硬性）**：灰底（`--bg-page`）页面内白底模块只用「白底 + `--radius-3` 圆角」，**无 border 无 box-shadow**。同层级装饰必须完全一致，禁止混搭。

**同行卡片等高（硬性）**：同一 `mtd-row` 内卡片顶边对齐 + 底边齐平，由 `tokens.css` 的 `display:flex; align-items:stretch` 机制实现，**禁止用 `min-height` 硬凑**。⚠️ **MTD Row class 名踩坑**：MTD Row 组件不传 `type="flex"` 时渲染 class 为 `.mtd-prime-row`（无 `-flex` 后缀），传了才有 `.mtd-prime-row-flex`。tokens.css 等高选择器必须**同时覆盖两者**（`.mtd-prime-row, .mtd-prime-row-flex`），否则等高规则静默失效，左右卡片底边错位却无报错。

**禁止 Emoji（零容忍）**：全文**绝对禁止**使用任何 Emoji 表情（含装饰性 Emoji）。所有图标一律使用 MTD `<Icon type="xxx" />`，图标名须在 `mtd3/references/icon_name.md` 确认存在。**统一 `-o` 线性风格**：若某图标同时存在无后缀版和 `-o` 版（如 `bell` vs `bell-o`），必须选用 `-o`；若只有无后缀版无 `-o` 变体（如 `search`），则直接用无后缀版。**同一功能区域（顶导/侧导/卡片组）内图标风格必须完全一致，禁止线性与面性混用。**

**主题体系**：默认主题为工具蓝（`primary`）。完整的主题清单、MTD 组件层与业务 Token 层的联动切换机制、React/Vue3 主题入口参考实现，统一见独立文档 **`references/theme-system.md`**（生成涉及主题切换的代码前必须先读）；**各主题下 Token 的具体取值不查该文档，直接查两份可复制的 CSS 对照表**：`references/theme-examples/tokens.css`（原子层 + 语义层全量取值）+ `references/theme-examples/tokens.brand-yellow.overrides.css`（`brand-yellow` 主题的 `data-theme` 覆盖块）。此处仅速记核心原则：

1. **两层必须联动，不可单独切换其一**：MTD 组件层（换 CSS import 路径，如 `index.css` ↔ `theme-yellow.css`）与业务 Token 层（给 `<html>` 打/去 `data-theme` 属性）必须由**同一个主题配置对象**驱动，禁止只改 import 路径而不同步 `data-theme`，也禁止只改 `data-theme` 而不换 MTD 主题包。
2. **颜色 Token 采用原子层 + 语义层两层结构**：原子层（`--blue-1~6`、`--yellow-1~7` 等，命名直接对齐官方 `_base_color.scss`）只是色板字典，**业务代码禁止直接引用**；语义层（`--color-brand-primary`、`--color-primary-1~5` 等）才是业务代码唯一能引用的层次，命名不包含具体颜色字面量。注意 `--color-primary-N` 的编号不是按深浅排列的（`-1`=hover、`-2`=active、`-3`=disabled、`-4`=浅色背景、`-5`=备用），详见 `theme-system.md` §0.1。固定不随主题变化的辅助色（如美团品牌黄点缀色）用 `--color-accent`，与主题色阶体系分开。
3. **新增主题只改配置，不改业务代码**：新增一套主题时，只需新增一份 `references/theme-examples/tokens.<主题key>.overrides.css`（`html[data-theme='<key>']` 覆盖块），并在 `theme.react.tsx`/`theme.vue3.ts` 的 `themes` 配置对象中新增一条对应记录（`swatch` 取该主题主色），业务组件代码不需要任何改动，具体步骤见 `references/theme-system.md` §6。
4. **自定义非预置主题色**（如用户口述"主题色改成 #FFC300"）：走 SCSS 覆盖方式，做法与新增主题一致，同样在主题配置层处理，具体步骤见 `references/theme-system.md` §自定义主题色。

> ⚠️ **主题色变更必须在 Design Spec 中明确标注**（见 §7 步骤 6），说明主题色来源与适配依据后直接生成，无需等待确认。SCSS 自定义主题需要项目支持 SCSS 编译（Vite 开箱即用，Webpack 需配置 sass-loader）。

**图表色板**：分类色 `--chart-1..7`（主题色/绿/橙/蓝绿/紫/粉/棕，共 7 色不含黄，`--chart-1` = `--color-brand-primary` 随主题联动）| 同色深浅 `--chart-primary-strong`(= `--color-primary-2`，active 色阶) vs `--chart-primary-weak`(= `--color-primary-5`，`#8FBCFF`) | 取色统一走 `src/lib/chartTokens.ts`（React）/ `src/composables/chartTokens.ts`（Vue）的 `chartPalette`/`chartMono`/`chartTrend` getter 对象，详见 `style-profile.md` §6。

---

## 6. 页面装配入口（2 份装配逻辑 + 2 类专用流程）

### 看板页装配逻辑（`references/L1-templates/page-看板页装配逻辑.md`）

一份文件覆盖 4 种编排模式，按「容器优先 + 触发词驱动」两步装配：

1. **数据通览**：图表多、筛选弱(简单档)、纯展示/只读概览。G-1 + G-2 + G-3(简单) + D-1 + D-2~D-15(按业务意图挑 3~6 个组合) + G-4(可选)
2. **AI 总结**：和"数据通览"类似(图表多、只读)，但顶部有 AI 诊断摘要卡。G-1 + G-2 + G-3(简单) + D-11 + D-1 + D-3 + D-9
3. **筛选+表格**：复杂筛选(复杂档)、图表少(1~2个指标/趋势)、底部大表格、以操作/修改为主。G-1 + G-2 + G-3(复杂) + D-1(可选) + D-3(可选) + G-4（需 tab 切换时用「带切换tab」变体）
4. **工作台**：主-侧分栏布局，偏"门户"而非"数据"。左侧主列：W-1 + W-2 + W-3 + W-7 + D-1(带迷你图变体) + G-4(待办任务)。右侧边栏(240px, sticky)：W-4 + W-5 + W-6。

> **数据通览选型提示**：D-1~D-15 是全量图表卡片库，实际项目中应按业务意图挑选 3~6 个核心模块组合（见 §3.2 意图速查），而非机械复制全部 D 系模块。

### 列表页装配逻辑（`references/L1-templates/page-列表页装配逻辑.md`）

一份文件覆盖 6 种编排模式，按「数据形态匹配 + 触发词驱动」两步装配：

| 编排模式 | 骨架差异 | 典型场景 |
|------|---------|----------|
| CRUD管理列表 | 全宽: G-3 → G-4（含操作栏/分页） | 人员/订单/商品管理 |
| 主从详情列表 | 左列表 + 右详情面板 | 邮件/工单/聊天 |
| 树形层级列表 | 左树导航(240px) + 右(G-3 + G-4) | 组织架构/目录/分类 |
| 看板列表 | 多列泳道拖拽卡片 | 任务管理/工单流转 |
| 时间轴列表 | 垂直时间轴 + 事件卡片 | 操作日志/变更记录 |
| 指标+明细 | D-1 → D-3(可选) → G-4（含操作栏/分页） | 财务流水/数据分析 |

> 所有模式默认含 G 导航模块（G-1 顶导 + G-2 侧导，见 §3.0 默认包含规则）。选型决策树和各模式详细规格见装配逻辑文件。
>
> **骨架图 tooltip 标注规范**：每个编排模式的 ASCII 骨架图，在各区块行末以 `← L2模块名 见 文件名.md` 格式标注对应的 L2 模块文档出处。生成代码时按骨架图自上而下逐行读取模块 → 跳转对应 `.md` 获取详细规格。

### 表单页与详情页 L1（`references/INDEX-form-detail.md`）

这两类页面已整体替换为表单/详情专用规范，不再维护 `references/L1-templates/form/`、`references/L1-templates/detail/` 或旧 Form/Detail L2 文件。

识别到表单页 L1 时必读：`references/INDEX-form-detail.md`、`references/L1-templates/page-表单页装配逻辑.md`。

识别到详情页 L1 时必读：`references/INDEX-form-detail.md`、`references/L1-templates/page-详情页装配逻辑.md`。全局视觉规则由命中的 G/F/D 模块各自提供，不再加载未完成的页面级全局样式文件。

随后根据 L1 得到的模块清单，只读取 `references/L2-modules/` 中命中的单文件模块，并通过 `mtd3/scripts/mtd-rag.js` 查询组件知识。

---

## 7. 工作流（每次生成按此执行）

> 本工作流与 §3.3 决策流程衔接。§3.3 是决策逻辑，§7 是执行步骤。

### 7.0 表单页 / 详情页 L1 强制分支

步骤 1 一旦识别页面级需求为表单页或详情页，进入专用分支，但仍先执行四类页面共用的输入识别、场景判断、框架探测与存量扫描，避免绕过现有项目约束：

1. **执行公共前置流程**：按 §3.3 步骤 1–4 识别输入和粒度、判断增量/存量；存量场景扫描 Token、状态管理、现有导航、组件引用方式与 MTD 主题。生成代码时沿用项目文件结构、Token 和状态管理习惯。
2. **确认技术栈**：优先采用用户指定；否则检查 `package.json`（`@ss/mtd-react3` → React，`@ss/mtd-vue3` → Vue3，`@ss/mtd-vue2` → Vue2）；仍无法判断时主动询问。无 `package.json` 且用户未指定时，按 §4.0 使用默认 React Vite 技术栈。
3. **组件库铁律：使用本 skill = 使用 MTD**。不需要用户额外说“用 MTD”，也不得因检测到项目已有 shadcn/ui、Ant Design 等而跳过。只有用户亲口说“用存量组件库”“不要引入 MTD”时才可放弃，没提 = 同意用 MTD。直接按 MTD 生成代码，无需询问确认。
4. **建立索引认知**：读取 `references/INDEX-form-detail.md`，判断页面大类与需要的模块，不一次性读取全部规范。
5. **加载 L1**：表单页读取 `references/L1-templates/page-表单页装配逻辑.md`，详情页读取 `references/L1-templates/page-详情页装配逻辑.md`。表单按顺序/步骤/主从落地页、抽屉或弹窗选容器；弹窗仅用于约 1–5 个字段且无分组、无分步的聚焦操作。详情仍按落地页（默认）或抽屉选容器，不开放弹窗。
6. **装配 L2**：按 L1 的触发词与容器约束生成「容器 + 模块清单」，只读取清单命中的 `references/L2-modules/*.md`。优先复用 G/F；详情专属语义才用 D3/D5/D9。
7. **查询 L3**：先读 `references/L3-notes/component-MTD组件清单.md`，校验组件名，再使用 `mtd3/scripts/mtd-rag.js` 查询当前框架的 API；读取 precautions 与 base 规范。不得凭记忆写 MTD API。
8. **直接生成代码**：遵循 L1 容器与全局样式、L2 排版和 L3 API 生成可运行代码。此分支**不强制输出通用 Design Spec，也不等待确认**。
9. **验证**：执行项目可用的构建/类型检查/测试，并逐项核对表单/详情 L1/L2/L3 规则；有组件报错时重新查询知识库，最多重试 3 次。

完成该分支后直接结束，不再进入下方通用步骤 2–8。下方通用 Design Spec 流程只适用于列表页和数据看板。

### 步骤 1：输入识别 + 粒度判断

判断用户提供了什么输入（文字/图片/代码），以及要什么粒度（页面级/模块级/组件级）。详见 §3.3 步骤 1-2。

- 组件级 → 直接跳步骤 6（查 mtd-rag 给出用法），不走 Design Spec
- 表单/详情模块级 → 读取 `references/INDEX-form-detail.md` 和命中模块，按专用 L2/L3 规则直接生码
- 列表/看板模块级 → 先问页面上下文，再从步骤 4 开始
- 页面级表单/详情 → 走 §7.0 专用流程；页面级列表/看板 → 走下方完整通用流程

### 步骤 2：场景判断（增量/存量）

详见 §3.3 步骤 3。判断是增量新建还是存量适配。

> ⚠️ **铁律：使用本 skill = 使用 MTD**。无论增量还是存量，一律使用 MTD 组件库。不得因检测到项目已有其他组件库而跳过。只有用户亲口说“用存量组件库”“不要引入 MTD”时才可放弃，用户没提 = 同意用 MTD。

### 步骤 3：存量风格快照（仅存量）

详见 §3.3 步骤 4。扫描 CSS 变量/Token 体系 + 状态管理方式，输出风格快照并说明适配依据，无需等待确认。

> 增量场景跳过此步。

### 步骤 4：读样式规范 + 模块选型

1. 读 `references/style-profile.md`，建立 Token 心智（存量场景同时对照步骤 3 的快照，优先用对方 Token）
2. 读 `references/L2-modules/index.json` 辅助选型
3. 本通用步骤只处理看板/列表，按 §6 装配逻辑文件匹配编排模式或按信息递进自由组装。若此时发现实际是表单/详情，返回 §7.0，禁止继续。
4. **G-1 + G-2 导航框架**：直接读取 `references/L2-modules/General-Layout.tsx` 获取完整可运行模板（踩坑笔记已内嵌为文件头部注释），不需要再从其他文档中提取代码。
5. **其他命中模块**：**必读**命中模块的通用描述 `.md`（ASCII 布局 + JSON 规格 + 约束），直接读全文（含「## MTD 实现」章节获取代码骨架和踩坑笔记）

### 步骤 5：定框架 + 查 L3

1. 探测用户项目（package.json）→ 确定 React / Vue 2 / Vue 3 → 选对应 MTD 包名与 `--target`。详见 §4.0。
2. 用 `mtd-rag.js --target=mtd-react|mtd-vue` 查询本页用到的所有 MTD 组件
3. 图表查 `antv-g2-chart` skill 的 G2 v5 Spec 写法

### 步骤 6：输出有依据的 Design Spec（输出后直接继续）

列表页和数据看板写代码前，先输出 Design Spec（Markdown 给人看 + JSON 给程序解析），说明页面模式、模块、变体、主题及关键交互的选型依据，**输出后直接进入实施前自检与代码生成，不暂停等待用户确认**。依据应来自用户需求、现有项目代码、命中的 L1/L2 规范及 L3 查询结果；合理补全的需求须标为假设，不得伪装成用户要求。只有缺少影响正确性的关键信息且无法从上下文推断，或用户明确要求先审方案时，才提出必要问题。表单页和详情页按 §7.0 直接生码，不强制套用本通用 Spec 模板。

**Markdown 格式**（直接输出到对话中）：

```markdown
## Design Spec

- 输入方式：[文字描述 / 图片截图 / 已有代码]
- 粒度：[页面级 L1 / 模块级 L2]
- 场景：[增量 / 存量]
- 页面类型：[看板 / 列表] — 命中编排模式：[模式名]
- 框架：[React / Vue 2 / Vue 3] — MTD 包名：[@ss/mtd-react3 / ...]

- MTD 主题色：[默认蓝 #166FF7 / 美团黄 #FFDD00 / 自定义 #XXXXXX] — [如需自定义：生成 custom-theme.scss]

### 选型依据与假设
- 页面模式：[需求中的数据形态/任务目标 → L1 对应规则]
- 模块与变体：[触发词/数据结构 → 命中的 L2 规范]
- 技术与主题：[package.json / 主题文件 / L3 查询结果]
- 合理假设：[需求未指定的范围与默认值；无则写无]

### 模块清单
| 序号 | 模块编号 | 模块名 | 变体 | 备注 |
|------|---------|--------|------|------|
| 1 | G-1 | 顶导航 | — | 默认包含 |
| 2 | G-3 | 筛选器栏 | 复杂档 | 6 维度筛选 |
| 3 | G-4 | 数据表格 | 带切换tab | 含 tab 切换 + 二级筛选 |
| ... | ... | ... | ... | ... |

### 色相预算（≤3 色，见 §8.7）
- 色相 1：蓝（信息/进行中）
- 色相 2：橙（警告/待处理）
- 色相 3：绿（成功/已完成）
> 若用户明确要求更多颜色，标注"用户指定 N 色"豁免。

### 图表清单
- [D-3 趋势图 / D-4 柱状图 / ...] — 除 D-8 外全部使用 AntV G2 useG2Chart

### MTD 组件清单
- [Layout.Header, Menu, Table, Tag, Button, ...] — 已执行 mtd-rag 查询

### 关键交互
- [时间粒度切换→Radio.Button / 筛选→Select / ...]

### 存量适配说明（仅存量场景）
- Token 映射：[对方 --color-primary → 本 skill --color-brand-primary / 直接沿用]
- 状态管理：[沿用对方 Redux / 用 useState]
- 文件结构：[按对方 pages/ 目录组织]
- 主题色：[沿用对方自定义主题 / 生成 custom-theme.scss 覆盖 $color-primary: #XXXXXX]

### 栅格布局
[ASCII 栅格图，标注每个区块对应的模块编号]

### 自检确认
- [ ] package.json 含 MTD + @antv/g2
- [ ] 未用原生 HTML 控件替代 MTD 交互/表单/表格组件；语义容器与无 MTD 对应物的语义链接除外
- [ ] 无手绘 SVG 图表
- [ ] 除 D-8 外，图表全部走 useG2Chart hook
- [ ] 图标全用 MTD Icon，-o 线性统一

- [ ] G-1 顶导 + G-2 侧导已包含（除非用户明确排除或目标已有）
- [ ] 存量场景：Token 映射已核对
- [ ] 存量场景：默认使用 MTD 组件库（用户明确指定遵循存量组件时除外）
- [ ] **L3 特殊描述复查**：代码中用到的每个 MTD 组件，检查 `references/L3-notes/` 下是否有对应说明文件（当前已有：mtd-tabs、mtd-row）；如果有，逐条对照说明文件中的「准则」和「易错点」确认代码无违反（如 mtd-tabs 的上 padding 归零、mtd-row 的 gutter 规范等）
- [ ] 同行卡片等高：tokens.css 同时覆盖 `.mtd-prime-row` 和 `.mtd-prime-row-flex`
```

**JSON 格式**（紧随 Markdown 之后输出，供程序解析）：

```json
{
  "input_type": "text | image | code",
  "granularity": "page | module",
  "scenario": "increment | existing",
  "page_type": "dashboard | list",
  "l1_assembly": "page-看板页装配逻辑.md :: 筛选+表格",
  "rationale": ["需求以复杂查询和明细操作为主，对应 L1 筛选+表格模式"],
  "assumptions": ["未指定主题，采用工具蓝"],
  "framework": "react | vue2 | vue3",
  "component_library": "@ss/mtd-react3",
  "style": {
    "bg_mode": "A_gray | B_white",
    "card_decoration": "no_border_no_shadow | 1px_border",
    "mtd_theme": "default_blue | yellow | custom",
    "color_budget": ["blue", "orange", "green"]
  },
  "modules": [
    { "order": 1, "id": "G-1", "name": "顶导航", "variant": null, "note": "默认包含" },
    { "order": 2, "id": "G-3", "name": "筛选器栏", "variant": "复杂档", "note": "6 维度筛选" },
    { "order": 3, "id": "G-4", "name": "数据表格", "variant": "带切换tab", "note": "含 tab 切换 + 二级筛选" }
  ],
  "charts": [
    { "module": "D-3", "type": "趋势图", "g2_type": "line" }
  ],
  "mtd_components": ["Layout.Header", "Menu", "Table", "Tag", "Button"],
  "interactions": [
    { "type": "Radio.Group", "purpose": "时间粒度切换" },
    { "type": "Select", "purpose": "筛选" }
  ],
  "existing_adaptation": {
    "token_mapping": { "color_primary": "--color-brand-primary" },
    "state_management": "useState",
    "file_structure": "pages/",
    "custom_theme": { "needed": false, "primary_color": "#166FF7", "scss_file": null }
  }
}
```

> **渐进式精化**：用户在 spec 输出或页面生成后可能要求调整（如"去掉 D-3""G-4 改成带图片列"）。每次调整都更新 Markdown + JSON spec，增量生成代码。不需要每次重新走全流程，只需更新 spec 变更部分。

### 步骤 7：实施前自检（不等待用户确认）

核对 Spec 与用户需求、项目约束、L1/L2 规范及已查询的 L3 API 一致，假设明确、模块不过度叠加，然后直接进入步骤 8。若用户补充需求或调整模块/变体，更新 Markdown + JSON Spec 并增量生成，不重新设置确认关卡。用户明确要求先审方案时，按用户要求等待。

### 步骤 8：代码生成

按 spec 生成代码：
1. 按装配逻辑骨架 → 逐个 L2 模块填充
2. 全程 `var(--token)`（存量场景用对方 Token 变量名）
3. 图表色用 chartTokens
4. React：函数组件 + JSX + 大驼峰标签 + `onClick`/`onChange`
5. Vue：`<script setup>` + `<template>` + kebab-case 标签 + `@click`/`v-model`
6. message/Form/Tabs 等差异点见 `references/framework-guide.md` §3

### 步骤 9：自检

对照 style-profile 自检清单 + §8 铁律 + §9 视觉质量自检逐条核对。

### 7.1 用户调整样式时（持续维护）

收到样式调整需求时按此闭环：
1. 改运行时 Token：`src/styles/tokens.css`。
2. 同步生成指令：`references/style-profile.md`。
3. 追加变更记录：`references/CHANGELOG.md`。
4. 截图确认效果。

### 7.2 触发词 → 模块速查表（全页面类型通用）

> 以下表汇总所有页面类型的触发词→模块映射，装配时直接查此表。表单/详情页的完整触发词映射详见各自 L1 装配文件。

**列表页 / 看板页通用触发词**

| 触发词 | 模块 | 备注 |
|--------|------|------|
| 顶导/导航栏/header | G-1 | 所有落地页默认包含 |
| 侧导/侧边栏/菜单 | G-2 | 所有落地页默认包含 |
| 筛选/过滤/查询条件/时间范围 | G-3 | ≤5维度→简单档；≥6或分组→复杂档 |
| 表格/列表/数据表/明细/管理列表 | G-4 | 3变体：纯文字/带图片列/带切换tab |
| 分页/翻页/页码 | G-4（启用内联 List-3） | 表格下方，不独立选型 |
| 操作栏/批量操作/导出/新增按钮 | G-4（启用内联 List-2） | 表格上方，不独立选型 |
| 概览/大盘/KPI卡片/核心指标 | D-1 | 指标卡片组 |
| 目标/进度/完成率/达成率 | D-2 | 环形进度 or 进度指标 |
| 趋势/走势/折线/面积/时间序列 | D-3 | 折线图 or 面积图 |
| 柱状图/对比/排名条形 | D-4 / D-9 | |
| 双轴/组合图 | D-5 | |
| 漏斗/转化 | D-6 | |
| 饼图/环图/占比 | D-7 | |
| 堆叠进度条 | D-8 | ⚠️非G2，手工实现 |
| 散点/气泡 | D-10 | |
| AI摘要/诊断/智能总结 | D-11 | |
| 雷达图/能力评估 | D-12 | |
| 水波球/占比球 | D-13 | |
| 热力图 | D-14 | |
| 玫瑰图/南丁格尔 | D-15 | |
| 欢迎栏/问候 | W-1 | 工作台专属 |
| 操作引导/快速开始 | W-2 | 工作台专属 |
| 快捷入口/常用功能 | W-3 | 工作台专属 |
| 今日待办/任务清单 | W-4 | 工作台专属 |
| 公告/通知 | W-5 | 工作台专属 |
| 最新动态/更新日志 | W-6 | 工作台专属 |
| 常用工具/工具箱 | W-7 | 工作台专属 |

**表单页 / 详情页触发词与模块映射**

不在主文件重复维护。识别到这两类页面后，读取 `references/INDEX-form-detail.md`，并以对应 L1 装配文件中的「触发词 → 模块映射」为唯一依据。禁止使用旧 F-2/Detail-1 等映射或从看板模块中猜测替代。

### 7.3 Vue3 / React API 差异速查表

> 生码前必须确认技术栈（查 package.json），以下差异点选错会导致组件不渲染或功能失效。

| 差异项 | Vue3（`@ss/mtd-vue3`） | React（`@ss/mtd-react3`） |
|--------|------------------------|---------------------------|
| CSS 类名前缀 | `mtd-` | `mtd-prime-` |
| Modal 显隐控制 | `v-model:visible` | `open={bool}`（⚠️ 默认 `true`，必须显式传 `false`） |
| Drawer 显隐控制 | `v-model:visible` | `visible={bool}`（默认 `false`） |
| Menu 选中 | `v-model` + `name` | `selectedKeys={[key]}` + `onSelectChange` + `key` |
| Tabs 选中 | `v-model` + `name` | `defaultActiveKey` / `activeKey` + `onChange` |
| TabPane 标签 | `tab="标题"` 属性 | `label="标题"` 属性 |
| Anchor 容器指定 | `container=".app-content"` | `getContainer={() => document.querySelector('.app-content') \|\| window}` |
| Anchor 吸顶方式 | 组件自带 `affix` + `offset-top` | `affix={false}` + CSS `position: sticky` |
| Anchor items | 子组件 `<mtd-anchor-link>` | `items` 数组 prop |
| Anchor DOM 位置 | 可放在 page-header 内部 | **必须放在 page-header 外部**（sticky 限制） |
| Form 校验触发 | `@validate` + `ref.validate()` | `onValidate` + `ref.current.validate()` |
| message 调用 | `this.$message` / `Message.success()` | `import { message } from '@ss/mtd-react3'` |
| 事件绑定 | `@click` / `@change` | `onClick` / `onChange` |
| 双向绑定 | `v-model` / `v-model:visible` | `value` + `onChange` 手动控制 |
| 插槽 | `<slot name="xxx">` | `renderXxx` prop 或 children |

> 更详细的框架差异见 `references/framework-guide.md` §3。

### 7.4 页面级补强规则（条件触发自动叠加）

> 以下规则在模块选型完成后自动执行，无需用户在 prompt 中提及。命中条件即自动叠加对应模块/组件。

| 条件 | 自动叠加 | 说明 |
|------|----------|------|
| 列表页表格行数可能 > 20 | List-3 分页器 | G-4 已内联分页器，确保 pageSize 默认 10/20 |
| 看板页图表数 > 6 | 自动分区块 | 用 `<div>` 间距分隔，每行最多 2~3 个图表卡 |
| 落地页内容区高度 > 2 屏 | 回到顶部按钮 | 底部右下角浮动按钮，MTD `BackTop` 组件 |

**色板与 Tag 全局规则（所有页面类型适用）**：

- **图表色板对齐 `style-profile.md` 文首【1】色彩规范文档**：分类色板 7 色（Blue-5 → Green-5 → Orange-5 → Teal `#00A3A3` → Purple `#882EFF` → Pink `#EB2F93` → Brown `#9E7549`）；蓝色单色色阶 6 级（Blue-6 `#0E65E8` → Blue-1 `#F0F6FF`）；涨跌色 Green-5/Red-5。禁止自行插值中间色。详见 `DashboardChartCard.md` §图表色板规范。
- **Tag 颜色策略**：`size="small"` + `type="bordered"`；默认 `theme="blue"`；一张表最多用蓝/绿/橙三种颜色；慎用红色（仅极端异常如已删除/封禁），普通负面状态用橙色替代；fallback 一律 `'blue'`。**Tag 的 `type` 只控制样式（bordered/pure/text/pure-bordered），`theme` 控制颜色（blue/green/orange/red/gray…），禁止把 Button 的 `type` 枚举（warning/danger/success/primary/grey/normal）传给 Tag**；禁止用 `Button ghost` 模拟 Tag。详见 `General4-data-table.md` §约束。

### 7.5 端到端装配示例（prompt → 模块清单）

> 以下示例展示从用户 prompt 到最终模块清单的完整装配过程。

**示例 1 · 列表页（CRUD 管理）**

Prompt：「商品管理列表页，支持按名称和状态筛选，表格展示商品图、名称、价格、状态，可以新增和批量上架」

装配过程：
1. 页面类型：列表页 → CRUD管理（见 `page-列表页装配逻辑.md`）
2. 默认外壳：G-1 顶导 + G-2 侧导
3. 筛选需求 → G-3 筛选器栏（简单档，2 维度）
4. 表格含图片列 → G-4 数据表格（带图片列变体）
5. 新增/批量上架 → List-2 操作栏（内联 G-4）

最终模块清单：G-1 + G-2 + G-3（简单档）+ G-4（带图片列，含操作栏+分页器）

**示例 2 · 看板页（数据通览）**

Prompt：「经营数据大盘，顶部展示 GMV、订单量、客单价三个核心指标，下面是 GMV 趋势图和品类占比饼图，支持时间范围筛选」

装配过程：
1. 页面类型：看板页 → 数据通览（见 `page-看板页装配逻辑.md`）
2. 默认外壳：G-1 顶导 + G-2 侧导
3. 时间范围筛选 → G-3 筛选器栏（简单档，1 维度）
4. 核心指标 → D-1 指标卡片组（纯大数字，3 张）
5. GMV 趋势 → D-3 趋势图（折线图）
6. 品类占比 → D-7 饼图/环图

最终模块清单：G-1 + G-2 + G-3（简单档）+ D-1（纯大数字 ×3）+ D-3（折线图）+ D-7（饼图）

**示例 3 · 表单页 / 详情页**

此处不复制装配细节。遇到完整表单页或详情页，直接按 §7.0 执行表单/详情专用流程。示例与容器选择以以下文件为准：

- 表单：`references/L1-templates/page-表单页装配逻辑.md`
- 详情：`references/L1-templates/page-详情页装配逻辑.md`

---

## 目录结构

```
b-end-page/
├── SKILL.md                    ← 本文件
├── references/
│   ├── L1-templates/
│   │   ├── page-看板页装配逻辑.md   ← 看板页装配逻辑（4种编排模式合一）
│   │   └── page-列表页装配逻辑.md   ← 列表页装配逻辑（6种编排模式合一）
│   ├── L2-modules/             ← General 共用（导航+筛选+表格）+ List 列表 + Dashboard 看板 + Workbench 工作台（双文件架构）
│   │   ├── index.json          ← 轻量选型索引（触发词/L3/变种/双文件路径；文件名≠moduleId，选型以文件内 moduleId 为准）
│   │   ├── General-Layout.tsx            ← G-1 顶导 + G-2 侧导 一体化模板（含踩坑笔记注释）
│   │   ├── General3-filter-bar.md          ← G-3 看板筛选器栏
│   │   ├── General4-data-table.md          ← G-4 数据表格（List-2/List-3 复用同一文件）
│   │   ├── General5-tab-switcher.md        ← G-5 切换tab（仅作为 G-4 内联实现资料）
│   │   ├── Dashboard1-metric-cards.md      ← D-1 指标卡片组
│   │   ├── Dashboard2-progress.md          ← D-2 进度展示
│   │   ├── Dashboard3-trend.md             ← D-3 趋势图
│   │   ├── Dashboard4-bar.md               ← D-4 柱状图
│   │   ├── Dashboard5-combo.md             ← D-5 双轴组合图
│   │   ├── Dashboard6-funnel.md            ← D-6 转化漏斗
│   │   ├── Dashboard7-pie-donut.md         ← D-7 饼图/环图
│   │   ├── Dashboard8-stacked-progress.md  ← D-8 堆叠进度条（⚠️非 G2，手工实现）
│   │   ├── Dashboard9-rank-bar.md          ← D-9 排名条形图
│   │   ├── Dashboard10-scatter.md          ← D-10 气泡散点
│   │   ├── Dashboard11-digest-card.md      ← D-11 AI 诊断摘要卡
│   │   ├── Dashboard12-radar.md            ← D-12 雷达图
│   │   ├── Dashboard13-liquid.md           ← D-13 水波球
│   │   ├── Dashboard14-heatmap.md          ← D-14 热力图
│   │   ├── Dashboard15-rose.md             ← D-15 玫瑰图
│   │   ├── DashboardChartCard.md           ← D-ChartCard 图表外壳（D-1~D-15 除 D-8 外共用）
│   │   ├── Workbench1-welcome-banner.md    ← W-1 欢迎栏
│   │   ├── Workbench2-action-card.md       ← W-2 操作引导卡
│   │   ├── Workbench3-shortcut-grid.md     ← W-3 快捷入口网格
│   │   ├── Workbench4-todo-list.md         ← W-4 今日待办
│   │   ├── Workbench5-announcement.md      ← W-5 最新公告
│   │   ├── Workbench6-latest-updates.md    ← W-6 最新动态
│   │   ├── Workbench7-tool-grid.md         ← W-7 常用工具
│   ├── INDEX-form-detail.md   ← 表单页/详情页索引（L1/L2/L3 入口）
│   ├── L3-notes/               ← L3 组件说明（表单/详情 MTD 清单 + 列表/看板准则）
│   │   ├── README.md
│   │   ├── mtd-row.md
│   │   └── mtd-tabs.md
│   ├── interaction-patterns.md
│   ├── g2-chart-foundation.md  ← G2 图表基座（含 Vue composable + React hook）
│   ├── framework-guide.md      ← 【必读】Vue/React 双框架差异与适配指南
│   ├── style-profile.md        ← 【必读】统一样式指令源
│   └── CHANGELOG.md
└── mtd3/                       ← MTD L3 获取能力
    ├── MTD3-SKILL.md
    ├── references/
    └── scripts/     (mtd-rag.js / HOW_TO_USE.md)

> MTD 组件 API 与注意事项保留在 `mtd3/`；视觉 Token、间距和基础 UI 准则统一收敛到 `references/style-profile.md`，不再维护第二份 `mtd3/styles/base.md`。
```

---

## 8. 铁律 & 常见错误防范（每次生成前必读）

以下规则来自历史错误复盘，**违反任何一条即视为产物不合格、必须重写**：

### ⛔ 8.0 组件库与图表库是不可商量的底线（最高优先级）

> **交互、表单和数据展示组件优先使用正规组件库；数据图表统一使用 AntV G2，D-8 堆叠进度条是唯一明确例外。不存在“demo/快速验证/临时样式”豁免。**

1. **所有可由 MTD 表达的交互、表单、表格和反馈组件必须来自 MTD**（`@ss/mtd-react3` / `@ss/mtd-vue2` / `@ss/mtd-vue3`）。

   允许原生语义标签承担页面结构与无 MTD 对应物的语义，例如 `<header>`、`<nav>`、`<main>`、布局 `<div>`，以及确实执行页面跳转的 `<a href>`。禁止用原生 `<button>`、`<table>`、`<select>`、`<input>` 等替代已有 MTD 组件；仅当 MTD 确无对应控件时才可降级，并在模块规范中明确记录原因、键盘可达性与状态样式。

2. **除 D-8 外，所有数据图表必须来自 AntV G2 v5**（通过 `useG2Chart` hook 挂载），禁止用原生 SVG（`<svg>`/`<polyline>`/`<polygon>`/`<circle>`）手绘图表、禁止用 CSS 模拟其他图表、禁止用任何非 AntV 方案。D-8 仅用于离散流程阶段的堆叠进度表达，按其模块规范使用 flex/div；不得把该例外扩展到柱状图、折线图等常规图表。

**前置强制动作**：
- 生成代码前必须确认 `package.json` 中已声明 MTD 组件库（`@ss/mtd-react3` / `@ss/mtd-vue3` 等）和 `@antv/g2` 依赖。若不存在，**先安装依赖再写代码**。
- 若用户项目环境不支持安装依赖（如纯 HTML demo），**必须主动告知用户此限制并询问是否允许降级**，不可擅自使用原生标签/手绘 SVG 替代。

**违反本条的历史教训**：v3 迭代中 6 个 case 全部使用原生 `<header>` + `<a>` 模拟 G-1 顶导、用原生 `<table>` 替代组件库 Table、用手绘 SVG 替代 AntV G2 图表，导致产物虽然"视觉形似"但完全违反架构约束，等于白做。

### 8.1 MTD 是业务 UI 组件的默认原子

- 交互、表单、表格、反馈等业务组件必须优先使用 MTD；页面语义容器和纯布局容器可使用原生标签。
- 禁止用原生 HTML 控件（`<button>`、`<table>`、`<select>`、`<input>`）代替已有的 MTD 组件，即使是“临时样式”。无对应 MTD 控件的例外必须由具体模块规范显式声明。
- 写任何 MTD 组件前**必须先执行 `mtd-rag.js` 查询**，以 RAG 返回的 API 为准——不得凭记忆/经验猜测 prop 名。
- MTD 典型 API 易错点（已踩坑）：
  - `Tooltip`: 内容用 `message` prop，不是 `content`
  - `Progress`: 显示文字用 `showInfo` prop，不是 `showText`
  - `Popconfirm`: 确认文案用 `message` prop，不是 `title`；确认回调用 `@ok`（Vue）/ `onOk`（React），不是 `@confirm`
- **矩阵/交叉表/配置表**等非传统数据表格也必须用组件库 Table 组件实现（MTD: `columns` + `data` 声明式），绝不可退化为原生 `<table>`。

### 8.2 禁止 Emoji（零容忍）

- 页面代码中**绝对不允许**出现任何 Emoji 字符（包括装饰性/标题前缀/状态标识等场景）。
- 所有图标需求一律通过 MTD 图标系统实现：`<Icon type="xxx-o" />`（须在 `mtd3/references/icon_name.md` 确认存在）
- 若需要的图标不存在，选语义最接近的替代，绝不退化为 Emoji。

### 8.3 图标线性统一

- 全页面图标统一**线性**风格：
  - **MTD**：优先用 `-o` 后缀（如 `bell-o`）。若同时存在 `bell` 和 `bell-o` → 必须用 `-o`；若只有无后缀版 → 直接用。
- 绝对禁止在同一功能区域（顶导/侧导/卡片组）内混用面性和线性图标。

### 8.4 交互组件选型（禁止"伪组件"）

- 选项少且互斥的切换（如 日/周/月、趋势/结构）→ 必须用组件库 Radio 组件：
  - MTD React: `Radio.Group` + `Radio.Button`
  - MTD Vue: `<mtd-radio-group button-style="outline">` + `<mtd-radio-button>`
- 禁止用原生 `<button>` + 自定义 CSS 模拟 tab 切换效果。
- 所有交互必须是"真功能"（状态绑定 + 数据联动），不能只有 UI 外壳。

### 8.5 自检清单补充（§7 第 8 步额外核对）

生成代码后，必须额外检查：
- [ ] 全文搜索 Emoji → 为空
- [ ] **无凭空编造的品牌色值**：若页面使用了品牌色/主题色，确认 hex 值来源于用户指定、组件库主题包或设计稿，而非 AI 自行"回忆"的值；品牌色覆盖通过主题包或 CSS 变量全局生效，无逐组件 inline style 覆盖
- [ ] 图标系统正确：MTD 用 Icon + icon_name.md 验证
- [ ] 同区域图标风格统一（无面性和线性混用）
- [ ] 日/周/月等少选项互斥切换用了组件库 Radio 组件，非原生 button
- [ ] MTD 项目：所有 API 均来自 `mtd-rag.js` 查询结果，无凭空猜测的 prop
- [ ] **tokens.css 严格对齐 §5.1**：全文搜索项目 `tokens.css`（或等价的 CSS 变量文件），逐条核对变量名、色值、间距值、圆角值、阴影值是否与 §5.1 核心 Token 速查表完全一致。禁止自造变量名（如用 `--spacing-sm` 替代 `--gap-elem`、用 `--radius-md` 替代 `--radius-3`、用 `--border-1` 替代 `--divider`）；禁止篡改色值（如把 `--text-2: rgba(17,25,37,.85)` 改成 `--text-2: #3D485E`、把 `--bg-page: #F3F3F4` 改成 `--bg-page: #F5F6F7`）。AI 倾向于发明一套"看起来专业"的 token 命名体系而不从规范表复制，此项专防该问题
- [ ] **无「左侧高亮色条」自造 alert**：全文搜索 `border-left` → 不存在 `border-left: Npx solid <彩色>` + 浅色背景的圆角矩形"竖条 alert"样式。此样式与分组标题 `::before` 竖条视觉冲突，干扰分组边界识别。提示/警示信息统一用 MTD `<Announcement>` / `<mtd-announcement>` 组件
- [ ] **同行卡片视觉平衡**：逐行检查并排卡片，两侧「有内容/有色彩的区域」高度是否接近（差值 ≤ 1:1.5）。若一侧出现大面积留白，需缩小对侧图表容器高度 / 调整 grid 列宽比例 / 移除撑高的外标注
- [ ] **整页彩色 ≤3 色**：扫描所有 Tag/Badge/delta-pill，确认使用的不同色相不超过 3 个（见 §8.7）

### 8.6 谨慎使用红色与彩色（色彩克制铁律）

> **大面积彩色 = 视觉噪音。B 端页面的核心信息（数字、文本）应保持中性色，彩色仅用于小面积的状态标记。**

**核心原则**：
- **大数字/主数值保持深色**：D-1 指标卡片中的大数字（如"47"、"15.3%"、"8"、"23"）**必须使用 `--text-1`（深黑 `#111925`）**，不论该指标是正向还是负向。禁止将大数字本身染成红色/橙色/绿色。
- **彩色仅限小面积标记**：大数字右侧的涨跌标签/胶囊（如"↑12.5%"、"↓3.2%"）可以用彩色——红色表示上升/异常，绿色表示下降/改善，但**仅限这一小块标签区域**（`font-size: 12px` + `padding: 2px 8px` + 浅色背景胶囊）。
- **红色是最需要克制的颜色**：红色在 B 端场景中具有强烈的"告警/危险"语义，大面积使用会导致用户焦虑和视觉疲劳。红色仅可用于：
  - 小面积状态标签（Tag/Badge）
  - 涨跌胶囊（delta pill）的背景/文字
  - 错误/失败状态标识
  - **绝不可用于**：大数字、标题、正文、卡片背景、大面积区块
- **其他饱和色同理**：橙色、紫色、粉色等高饱和度颜色同样不应大面积使用。图表色板（`--chart-1..7`）用于图表数据系列，不用于 UI 文字和容器背景。

**正确示例**：
```
┌──────────────────────────┐
│ 近30天未提交代码人数        │
│                          │
│ 47  ↑12.5%               │
│^^^^^^^^^^^               │
│  深黑色        红色小标签   │
└──────────────────────────┘
```

**错误示例**（❌ 禁止）：
```
┌──────────────────────────┐
│ 近30天未提交代码人数        │
│                          │
│ 47  ↑12.5%               │
│ ^^^                      │
│ 红色大数字 ← 禁止！         │
└──────────────────────────┘
```

**自检**：
- [ ] D-1 所有指标卡片的大数字均使用 `--text-1`，无一例外
- [ ] 红色/橙色/绿色仅出现在小面积标签（Tag/Badge/delta pill）中
- [ ] 无大面积红色/彩色背景区块
- [ ] 图表色板颜色仅用于图表数据系列，不用于 UI 文字或容器

### 8.7 整页彩色上限（≤3 色铁律）

> **除非用户明确要求使用更多颜色，整页所有彩色 Tag / Badge / 状态标记加在一起，使用的不同色相不得超过 3 个。**

**核心原则**：B 端页面追求信息清晰而非视觉丰富。当一页中同时出现蓝、绿、橙、红、紫等多种彩色 Tag 时，页面会显得杂乱、缺乏重点。3 色上限迫使设计者为每种颜色赋予明确语义，用户一眼就能理解颜色含义。

**计色规则**：
- 计入范围：所有 MTD `Tag`（含 theme 色）、`Badge`、delta-pill（涨跌胶囊）、状态指示器等带有色彩的小面积 UI 元素。
- 不计入范围：`--text-1` / `--text-2` / `--text-3` 等灰阶文字、MTD 默认蓝主色按钮（`Button type="primary"`）、图表内数据系列色（走 `--chart-1..7` 色板）。
- "不同色相"指视觉上可区分的颜色，如蓝 vs 绿 vs 橙算 3 个；同色深浅（如深蓝 vs 浅蓝）算 1 个。

**推荐 3 色组合**（按业务场景选一组）：
- **通用场景**：蓝（信息/进行中）+ 橙（警告/待处理）+ 绿（成功/已完成）
- **风险导向**：红（高风险/失败）+ 橙（中风险/待处理）+ 绿（正常/通过）
- **状态导向**：蓝（进行中）+ 绿（已完成）+ 灰（草稿/待定，用 `--text-4`）

**执行方法**：
- 在 Design Spec 阶段就确定本页使用哪 3 种色相，在"模块清单"下方新增"色相预算"一行。
- 表格中不同类型/分类的 Tag，若类目超过 3 种，统一用同一颜色（如全部用蓝色 `theme="blue"`），通过文字内容区分语义，不依赖颜色差异。
- 右侧边栏公告/待办等辅助区域的 Tag 颜色应与主列保持一致，不引入额外色相。

**自检**：
- [ ] 全页扫描所有彩色 Tag/Badge/状态标记，统计使用了几种不同色相
- [ ] 若超过 3 种 → 必须合并（多余类目统一用同色 Tag + 文字区分）
- [ ] 若用户明确要求多色 → 在 Design Spec 中标注"用户指定 N 色"豁免

---

## 9. 视觉质量自检（审美层 —— 结构对了之后看这里）

> §8 保证"结构不出错"，§9 保证"看起来像一个有数据的真实产品"。生成代码后按此逐条核对。

### 9.1 数据密度与 Mock 质量

- **首屏必须饱满**：表格至少填充 5~8 行真实语义的 mock 数据（人名/订单号/金额/状态等拟真内容），禁止留空表格或只有 1~2 行。
- **数值拟真**：金额/百分比/日期/ID 等字段须用合理范围的随机值，禁止出现 `undefined`、`null`、连续重复值。
- **信息密度检查**：首屏可见区域内，空白面积不得超过总面积的 40%（导航/间距不计入空白）。若某区域明显空旷，需增加 mock 数据行数或缩减容器高度。
- **空状态兜底**：若数据为空，必须展示 MTD `<Empty>` 组件（图标+提示文字），禁止出现"空白一片"。
- **加载态覆盖**：数据表格和图表组件需有 `loading` 状态支持（通过 prop 或条件渲染 `<Skeleton>` 骨架屏）。

### 9.2 语义色彩映射（状态 → 颜色 对照表）

状态/等级类的 Tag/Badge 必须带语义色彩，禁止统一灰框无差别展示。映射规则：

| 语义 | 色彩 Token | 典型场景 |
|------|-----------|---------|
| 危险/高风险/P0/失败/停用 | `--color-red` | 风险等级高、任务失败、已停用 |
| 警告/中风险/P1/待处理 | `--color-orange` | 中等风险、需注意、待审批 |
| 正常/成功/已完成/启用 | `--color-green` | 审批通过、任务完成、已上线 |
| 信息/进行中/P2 | `--color-brand-primary` | 进行中、一般信息、默认状态 |
| 低优/P3/草稿/待定 | `--text-4`(灰) | 低优先级、草稿、暂缓 |
| VIP/特权/金牌 | `--color-brown` | 会员等级、VIP 标识 |

> 同一组 Tag 集合（如优先级 P0~P3）**每个等级必须用不同颜色**，形成一眼可辨的色阶梯度。

### 9.3 三态覆盖要求

每个数据展示区域（表格/图表/列表/卡片组）必须考虑 3 种状态：

1. **正常态**：有数据，正常渲染（默认实现）
2. **空态**：无数据时展示 `<Empty description="暂无数据" />`，图表区展示空态占位
3. **加载态**：首次加载或刷新时展示骨架屏/loading spinner

> 最低要求：正常态 + 空态必须实现；加载态至少留 `loading` prop 接口，可暂不接真异步。

### 9.4 视觉节奏与比例（配合 style-profile.md §9 空间节奏章节）

- **同行模块内容高度视觉平衡**（核心原则）：左右并列的两个卡片，**彩色/有内容区域**的视觉高度应当接近。高度差不超过 1:1.5，若一侧明显矮则需调整：
  - **缩图表容器**：若一侧图表（如 donut/pie）撑得很大而另一侧内容较少，优先缩小图表容器高度，使两侧"有料区域"齐平。
  - **调列宽比例**：内容较多的卡片分配更大的 grid 比例（如 2fr:1fr），而非等分。
  - **移除外标注**：饼图/环形图如果外围 labels 导致容器虚高（文字撑高但视觉不饱满），改用右侧图例或 tooltip 展示详情，缩小图表实际占用高度。
  - **禁止大面积留白**：若某卡片用 `height: 100%` 撑满行高后内容只占一半，说明同行另一卡撑得太高，需回头调对侧。
- **大区块分区间距**：页面内"概览区 → 趋势区 → 明细区"等逻辑段落之间，使用 `--gap-section`(24px) 分隔，与模块间距 `--gap-module`(8px) 形成层级差。
- **图表容器高度**（参考值，需根据同行平衡调整）：趋势图/面积图建议 220~320px，饼图/环形 160~240px，条形排名 160~220px。避免过高导致大面积空白、过矮导致数据挤压。当同行另一卡片内容少时，优先往区间下限靠。

### 9.5 卡片底色禁令（反"灰上灰"）

- **禁止在灰底容器内使用灰底子卡片**。当父容器（泳道列、面板、折叠区等）已经是灰底（`--bg-page` / `--bg-card-inner`）时，内部子卡片/子项必须用**白底 `--bg-card` + 1px `--border` 描边**来区分层级，而非用另一层灰底——"灰上灰"层级模糊且视觉上显脏。
- **适用场景**：Kanban 泳道卡片、折叠面板内的子项卡片、主从布局的从面板内嵌卡等所有「容器内嵌子卡片」场景。
- **描边用法**：仅限这种「二级嵌套白卡」场景使用描边（1px `--border`），不违反 §6.8——§6.8 说的是「一级白卡在灰底页面上不需要描边」，二级嵌套需要额外边界标识。
