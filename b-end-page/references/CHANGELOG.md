# 样式变更记录 (Style Change Log)

> 每次调整看板样式都在此**追加一条**（最新在上）。一条记录包含：日期、改了什么、
> 为什么、影响范围、是否已同步 tokens.css 与 style-profile.md。
>
> 流程：用户提样式需求 → ①改 `dashboard-app/src/styles/tokens.css`
> → ②同步 `references/style-profile.md` → ③在此追加记录 → ④截图确认。

---

## 2026-11-02（Design Spec 输出后直接实施）

- 用户试用反馈：列表/看板给出有依据的 Design Spec 即可，不应暂停等待确认。
- 主 Skill §7 步骤 6 补充选型依据、合理假设及 JSON 字段；步骤 7 改为实施前自检，随后直接生码。后续调整更新 Spec 并增量实现。
- 同步存量风格快照、主题变更和仓库 README 的等待表述；保留关键信息缺失时的必要澄清及用户明确要求先审方案的例外。
- 本次是工作流修改，未改视觉 Token；原导出元数据、manifest 与签名保留作来源记录，不代表修改后版本已在 Friday 发布。

---

## 2026-08-03（黄色原子层改用真正的 `$Yellow-1~7`，不再借用语义层 `$color-yellow-*` 的值）

**改了什么**

- **发现并修正一处根本性的原子层取值错误**：核对官方 `_base_color.scss` 源文件后确认，`$Yellow-1~7`（原子层，纯色板，`#FFFADB`→`#7A3100`）与 `$color-yellow`/`$color-yellow-1~5`（语义层，`#FFDD00`/`#FFE366`/`#D99100`/`#FFEB94`/`#FFF9DE`/`#A36A00`，独立手写的 UI 角色色值）是**两套完全不同、互不引用**的变量——这一点与 Blue 不同：Blue 的语义层（`$color-primary-*`）直接引用 Blue 原子层（`$Blue-*`），两层天然同步；Yellow 的语义层则是独立维护的一套值，仅在标准色上与 `$Yellow-5` 巧合相同（`#FFDD00`）。此前 `tokens.css` 的 `--yellow`/`--yellow-1~5` 实际存的是语义层 `$color-yellow-*` 的值，命名却长得像原子层，容易误导。
- **`b-end-spec/src/styles/tokens.css` 原子层改为真正的 `$Yellow-1~7`**：`--yellow-1: #FFFADB` → `--yellow-7: #7A3100`，与 `--blue-1~6` 原子层结构对称。
- **`brand-yellow` 主题下 `--color-primary` 系列改为从新原子层手动按取阶规律推导**，不照搬源文件的 `$color-yellow-*`，而是复刻 Blue 主题的取阶模式以保证两套主题逻辑一致：基准 Yellow-5、hover 浅一级 Yellow-4、active 深一级 Yellow-6、disabled 用 Yellow-2、浅色背景用 Yellow-1、备用用 Yellow-3。
- **`--color-accent-text` 由借用 `--orange-5`（`#FF7700`）改为使用官方黄底强调文字专用深棕色 `--yellow-7`（`#7A3100`）**，语义更贴切（该色本就是源文件为黄色场景准备的强调文字色）。`--color-heading-accent` 保持不变（仍为 `--orange-5`），因此这两个 token 现在**不再同值**，属于两个独立维护的深色调。
- **同步修正的文件**：代码项目 `b-end-spec` 的 `tokens.css`、`useTheme.tsx`（注释）、`TokenSheet.tsx`（量表展示，标题改为"Yellow 黄色 Y1~Y7"）；skill 侧 `theme-examples/tokens.css`、`theme-examples/tokens.brand-yellow.overrides.css`、`theme-examples/theme.vue3.ts`（注释）、`theme-system.md`（§0.1 编号对照表、`--color-accent`/`--color-accent-text` 说明、§2.3 标题强调色说明）、`style-profile.md`（原子层取值来源说明）、`SKILL.md`（主题体系速览）。
- 用户明确提供了 `$Yellow-1~7` 的完整取值表并确认包含 7 级（中途曾误判为只有 1~6，后确认 Yellow-7 深棕色确实存在于原子层）。

**为什么**

- 用户提问「是不是有两种 yellow，一个是 yellow-1，一个是 color-yellow-1」，核查后发现此前的黄色 token 体系用原子层命名包装了语义层的值，命名与实际取值来源不一致，容易误导后续维护者以为黄色原子层就是这几个"语义态"色值。用户明确要求切换到真正的 `$Yellow-1~7` 原子层。

**影响范围**

- 代码项目 `b-end-spec`：`tokens.css`、`useTheme.tsx`、`TokenSheet.tsx`。
- Skill：`references/theme-examples/tokens.css`、`references/theme-examples/tokens.brand-yellow.overrides.css`、`references/theme-examples/theme.vue3.ts`、`references/theme-system.md`、`references/style-profile.md`、`SKILL.md`。
- 已通过全局 grep 确认无残留旧黄色语义层色值（`#FFE366`/`#D99100`/`#FFEB94`/`#FFF9DE`/`#A36A00`）或裸 `--yellow`（无编号）引用；历史 CHANGELOG 条目按惯例保留原文不改。
- 已在浏览器中验证：Token 页面黄色原子层 Y1~Y7 色板显示正确；切换到 `brand-yellow` 主题后 `--color-primary` 系列取值与推导规则完全吻合；`--color-accent-text` 显示为深棕色 `#7A3100`，与 `--color-heading-accent`（`#FF7700`）明显区分。

**是否已同步**：✅ tokens.css（代码项目+skill）✅ useTheme.tsx ✅ TokenSheet.tsx ✅ tokens.brand-yellow.overrides.css ✅ theme.vue3.ts ✅ theme-system.md ✅ style-profile.md ✅ SKILL.md ✅ 全局 grep 核对 ✅ 浏览器视觉验证 ✅ CHANGELOG（本条）

---

## 2026-08-03（去除原子层 `atom` 前缀；skill 全量同步至最新两层架构）

**改了什么**

- **去除原子层变量名中的 `atom` 前缀**：`_base_color.scss` 源文件本身没有 `atom` 这个词（用的是裸色阶名如 `$Blue-1~6`、`$Grey-7_2` 等），此前 `tokens.css` 自创了 `--atom-` 前缀，与源文件不一致。全量核对确认代码项目（`b-end-spec`）此前已完成去前缀改造（`tokens.css`、`TokenSheet.tsx` 均无 `--atom-` 残留），本条主要是**排查并同步 skill 文档侧的滞后引用**。
- **发现并修复 skill 目录内一处严重滞后**：`references/theme-examples/` 下的独立主题入口示例文件（`theme.react.tsx`/`theme.vue3.ts`/`tokens.css`/`tokens.brand-yellow.overrides.css`/`chartTokens.react.ts` 等）与 `theme-system.md` 文档描述的旧机制（JS `setProperty()` 注入 + `tokens` 取值表）不一致，同时散落的 L2 模块文档、`style-profile.md`、`SKILL.md`、`mtd3/RiskDetailPage.tsx` 中仍保留大量按**旧语义编号**（`--color-primary-1`=极浅背景、`-4`=hover、`-6`=pressed）书写的引用，与代码项目已切换的**新语义编号**（`-1`=hover、`-2`=active、`-3`=disabled、`-4`=浅色背景、`-5`=备用）相冲突。用户明确选择「full_sync」方案：将 skill 全部参考文件同步为最新架构（原子层+语义层两层结构、`data-theme` CSS 属性选择器驱动主题切换），确保后续用该 skill 生成的项目直接采用最新、正确的标准。
- **按颜色意图（而非变量名/编号）逐文件重新映射**，核对方式：先 grep 代码项目中已修正文件（`WorkbenchDashboard.tsx`、`DigestCard.tsx`）建立 ground-truth，再据此修正 skill 侧对应描述：
  - `references/theme-system.md`：§0 拆分为 §0.1（原子层+语义层结构说明、编号非连续对照表）、§0.2（命名与主题色解耦）、§0.3（`data-theme` 属性驱动机制）；§2/§2.2 覆盖块描述、§3 技术实现、§4/§5 React/Vue3 代码示例（`swatch`/`loadMtdCssUrl`/`applyMtdCss`/`applyThemeAttr` 替代旧的 `tokens`/`loadMtdCss`/`applyTokens`/`setProperty`）、§6 新增主题步骤、§7 自定义 SCSS 主题、§8 迁移说明（新增 §8.2 记录本次"单层中性命名→原子+语义两层"迁移及映射表）全面重写。
  - `references/style-profile.md`：主色色阶表按新编号重写（`-1`=hover/Blue-4、`-2`=active/Blue-6、`-3`=disabled/Blue-2、`-4`=浅色背景/Blue-1、`-5`=备用/Blue-3）；chartMono 章节、`--nav-active-bg`（由 `-1` 改为 `-4`）同步修正。
  - `references/L2-modules/Workbench1-welcome-banner.md`、`Dashboard11-digest-card.md`、`DashboardChartCard.md`：渐变背景/图标色、变体表、设计规范 JSON、JSX 示例、自检清单、踩坑笔记中的 `--color-primary-1/4/6` 引用全部按新语义重新映射并修正配套代码缩进。
  - `references/L2-modules/General-Layout.tsx`：顶导 logo 图标渐变第二色停由错误的 `--color-primary-4`（浅色背景）改为 `--color-primary-1`（hover 色阶），与 `DigestCard.tsx` 图标渐变用法保持一致。
  - `SKILL.md`：主题体系速览三条要点重写（`data-theme` 属性切换、原子层禁止业务代码直接引用+编号非连续提示、覆盖块+`swatch` 字段机制），图表调色板描述同步。
  - `mtd3/RiskDetailPage.tsx`：独立示例文件内联的 `:root` 声明块（不依赖共享 `tokens.css`）按新编号重写为 `-1`=hover、`-2`=active、`-4`=浅色背景（原声明的三个变量在文件内实际未被引用，纯粹为保证示例自洽性而修正）。
- **全局 grep 核对**：确认除 `theme-system.md` §8 历史迁移记录表与本 CHANGELOG 的历史条目外，整个 skill 目录再无遗留的 `--atom-` 前缀引用或旧编号（`--color-primary-6`）引用；`references/theme-examples/` 下的示例文件（`tokens.css`、`theme.react.tsx`、`theme.vue3.ts`、`chartTokens.react.ts`、`tokens.brand-yellow.overrides.css`）本身已是新架构正确实现，作为核对基准。
- **确认代码项目 `useTheme.tsx` 与 skill `theme.react.tsx`/`theme.vue3.ts` 三者机制完全对齐**：均使用 `swatch` 字段 + `loadMtdCssUrl` + `applyThemeAttr`（设置/清除 `data-theme`）+ 唯一 `<link id="mtd-theme-css">` 管理，无需额外改动。

**为什么**

- 用户提出「名字为什么要加 atom，我给你的表上没有吧，删掉；然后检查一下 skill 和代码项目还有没绑定最新变量的」，要求核查全部残留的过时变量名绑定。
- 排查中发现 skill 侧存在两条相互独立的历史遗留：一条是本身命名习惯（`atom` 前缀），另一条是更严重的架构滞后（`theme-examples/` 整套模板停留在更早期的单层中性命名 + JS 注入方案）。呈现三个选项后用户明确选择「full_sync」，即借此机会把 skill 的全部参考资料一次性拉齐到最新标准，避免后续用该 skill 生成新项目时套用过时模式。

**影响范围**

- Skill：`references/theme-system.md`、`references/style-profile.md`、`references/L2-modules/Workbench1-welcome-banner.md`、`references/L2-modules/Dashboard11-digest-card.md`、`references/L2-modules/DashboardChartCard.md`、`references/L2-modules/General-Layout.tsx`、`SKILL.md`、`mtd3/RiskDetailPage.tsx`。
- 代码项目 `b-end-spec`：本次核对确认已在此前会话中完成同步，未做进一步改动。
- 已通过全局 grep（`--atom-`、`--color-primary-1/4/6` 及上下文）确认无残留旧引用（历史记录类文档如本 CHANGELOG、`theme-system.md` §8 除外，属预期保留）。

**是否已同步**：✅ theme-system.md ✅ style-profile.md ✅ 3 个 L2 模块文档 ✅ General-Layout.tsx ✅ SKILL.md ✅ RiskDetailPage.tsx ✅ 全局 grep 核对 ✅ 代码项目 useTheme.tsx 对齐确认 ✅ CHANGELOG（本条）

---

## 2026-08-03（Token 体系严格对齐 `_base_color.scss` 源文件）

**改了什么**

- **`b-end-spec/src/styles/tokens.css` 原子层与语义层全面重写**，严格对齐用户提供的 `_base_color.scss`（源参见 km.sankuai.com/collabpage/1961097729）的变量名、色值与语义编号体系：
  - 原子层补全为 6 级完整色阶：Blue B1~B6、Yellow Y1~Y7、Green G1~G6、Red R1~R6、Orange O1~O6、Grey Grey1~Grey10（透明灰 + `_2`/`-solid` 实体灰），外加 `--atom-white/black/black-mask/blue-grey`。新增 `--atom-theme-yellow-hover/active/disabled/bg/reserve` 对应源文件 `$color-yellow-1~5`。
  - 语义层引入规范命名，与源文件完全一致：`--color-primary` + `--color-primary-1~5`（hover/active/disabled/背景/备用）、`--color-text-1~6`（禁用→次要→辅助→正文→标题→纯黑）、`--color-bgc-1~3` + `--color-disabled-bgc-1~2`、`--color-line-1~2`（+ `_2` 实体变体）、`--color-fill-1~3`（+ `_2` 实体变体）、`--color-link` + `--color-link-1~4` + 命名别名（hover/pressed/active/disabled）、`--color-success-1~6` / `--color-danger-1~6` / `--color-warning-1~6`。
  - 原有历史变量名（`--color-brand-primary`、`--text-1~6`、`--bg-page/card/card-inner`、`--border`、`--divider`、`--color-red/orange/green` 等）全部保留为**兼容别名**，反向引用新的规范语义层（如 `--color-brand-primary: var(--color-primary)`），确保现有组件代码零断联。
  - `html[data-theme='brand-yellow']` 覆盖块重写：`--color-primary` + `--color-primary-1~5` 使用新的 `--atom-theme-yellow-*` 原子，严格对应源文件 `$color-yellow` / `$color-yellow-1~5` 的语义态。
  - **语义重编号风险**：旧方案 `--color-primary-1` = 极浅背景（Blue-1）、`--color-primary-4` = hover（Blue-4）、`--color-primary-6` = pressed（Blue-6）；新方案 `--color-primary-1` = hover（Blue-4）、`--color-primary-2` = active（Blue-6）、`--color-primary-4` = 背景（Blue-1）、`--color-primary-6` 不再存在。编号含义反转，所有消费方文件需同步修正。

- **全量修正消费方文件**（13 个文件），按**颜色意图**而非变量名做映射：
  - `Dashboard.module.css`、`List.module.css`：`.tagBlue` 背景从 `--color-primary-1` → `--color-primary-4`（保持浅蓝背景视觉）；`.actionBtn:hover` / `.filterBtnPrimary:hover` 从 `--color-primary-6` → `--color-primary-2`（保持深蓝 hover）；`.treeNodeActive` 同理。
  - `WorkbenchDashboard.tsx`：3 处行内渐变/背景的 `--color-primary-1` → `--color-primary-4`（浅背景意图），渐变方向调整保持浅→深视觉方向。
  - `DigestCard.tsx`：浅底背景 `--color-primary-1` → `--color-primary-4`；渐变图标 `--color-primary-4` → `--color-primary-1`（保持中色→品牌色渐变效果）。
  - `modulePreviews.tsx`：5 处 `var(--color-primary-1, #F0F6FF)` 全部替换为 `var(--color-primary-4, #F0F6FF)`。
  - `chartTokens.ts`：`medium` getter 从 `--color-primary-4` → `--color-primary-1`（Blue-4 hover 色）；`lightest` 从 `--color-primary-1` → `--color-primary-4`（Blue-1 背景色）。
  - `designSpecs.ts`：3 处文本引用 `var(--color-primary-1, #F0F6FF)` → `var(--color-primary-4, #F0F6FF)`。
  - `MasterDetailPage.css`、`DrawerDetailPage.css`、`ModalDetailPage.css`、`MemberCardForm.css`、`MerchantOnboarding.css`、`ModalFormPage.css`、`StoreSettingsPage.css`：统一修正 `--primary-hover`（`-4`→`-1`）、`--primary-active`（`-6`→`-2`）、`--primary-bg`（`-1`→`-4`）。

- **`TokenSheet.tsx` 量表重写**：tokenGroups 数组从旧的结构（仅展示兼容别名+旧编号）全面替换为：原子层 8 组（Blue/Yellow/Green/Red/Orange/Grey/扩展功能色/Yellow 主题语义态，每项标注源文件色阶编号与十六进制值）→ 规范语义层 9 组（Primary/Text/Background/Line/Fill/Link/Success/Danger/Warning）→ 兼容别名 3 组（主色/功能色/文字背景描边，每个别名标注其引用的规范语义层变量）→ 图表色板 1 组 → 非颜色 Token 5 组（字号/字重/间距/圆角/阴影，不变）。

**为什么**

- 用户提供了 `_base_color.scss`（577 行，美团 MTD 官方基础颜色变量源文件），指出此前 token 重构虽然引入了「原子层 + 语义层」概念，但变量命名、色阶编号、语义角色映射都是自创的，与官方源文件不一致。用户明确要求「对准我给你的文件里的」，即让 `tokens.css` 的变量名与值映射严格匹配 SCSS 源文件。

**影响范围**

- 代码：`tokens.css`（原子层+语义层+主题覆盖重写）、`TokenSheet.tsx`（量表数据重写）、`chartTokens.ts`、`DigestCard.tsx`、`modulePreviews.tsx`、`WorkbenchDashboard.tsx`、`Dashboard.module.css`、`List.module.css`、`designSpecs.ts`、7 个 detail/form CSS 文件（`--primary-hover/active/bg` 变量引用修正）。
- 已过 `tsc --noEmit`（零报错）+ `read_lints`（零 lint 错误）+ grep 确认无残留 `--color-primary-6` 引用。
- 兼容别名层确保现有组件代码零断联，但新代码应优先使用规范语义层变量名。

**是否已同步**：✅ 代码改动已通过 `tsc --noEmit` 与 lint 验证；Token 量表已同步展示新的规范语义层。

---

## 2026-08-03（颜色 Token 重构为「原子层 + 语义层」两层结构；主题切换改为 CSS `data-theme` 驱动）

**改了什么**

- **`b-end-spec/src/styles/tokens.css` 新增原子层（atom）色板字典**：以 `--atom-<色系>-<色阶>` 命名，参照美团官方 MasterGo 设计系统「MTD-AI 友好-PC」变量面板的组织方式（`Color/blue/B1~B6`、`Color/yellow/Y1~Y6`、`Color/Grey/Grey1~Grey5` 等）。包含工具蓝色阶（`--atom-blue-1/2/4/5/6/weak`）、美团黄色阶（`--atom-yellow-1/2/4/5/6/weak`）、橙色强调色（`--atom-orange-accent`）、中性灰阶（`--atom-grey-1~6` 及 border/divider/bg-page/bg-card/bg-card-inner/nav-dark）、反色中性灰阶（`--atom-grey-dark-*`，深色背景专用）、功能色板（`--atom-red-5`/`orange-5`/`green-5`/`teal-5`/`purple-5`/`pink-5`/`brown-5`）。原子层只表达「这是什么颜色的第几级」，不含任何界面角色语义。
- **原有全部颜色变量改为语义层，值一律引用原子层**：`--color-brand-primary: var(--atom-blue-5)`、`--text-1: var(--atom-grey-1)`、`--bg-page: var(--atom-grey-bg-page)`、`--chart-2: var(--atom-green-5)` 等。**语义层变量名一个都没改**，因此所有组件代码零改动。所有十六进制/rgba 字面量现在只在原子层维护一份，语义层不再出现任何字面量。
- **主题切换机制从「JS 注入变量值」改为「CSS 属性选择器」**：`tokens.css` 新增 `html[data-theme='brand-yellow'] { ... }` 覆盖块，把 6 个主题相关语义变量（`--color-brand-primary`/`--color-primary-1`/`--color-primary-4`/`--color-primary-6`/`--chart-primary-weak`/`--color-heading-accent`）重新指向黄色系原子层。`src/theme/useTheme.tsx` 相应移除 `ThemeTokens` 接口和 `applyTokens()`（原本用 `root.style.setProperty()` 逐个注入内联变量），改为只调用 `document.documentElement.setAttribute('data-theme', key)`。`ThemeConfig` 用 `swatch: string` 字段替代原 `tokens` 对象，仅供主题切换器小圆点这类必须走 JS 内联样式的场景使用。
- 同步修改 `src/components/TopNav.tsx` 和 `src/components/ThemeSwitcher.tsx` 中两处 `config.tokens['--color-brand-primary']` → `config.swatch`。
- **黄色主题的标题强调色单独降级为橙色**：`--color-heading-accent` 在黄色主题下指向 `--atom-orange-accent` 而非 `--atom-yellow-5`，因为美团黄饱和度过高、在浅底上做文字色对比度不达标。

**为什么**

- 用户提出「token 是不是应该设计成两层，一个是原初的数值，比如 Blue1，一个是语义的比如 primary-bg-color 这样？」，并给出美团官方设计系统变量面板截图作为参照。两层结构的核心价值：色值只维护一份（改一个色阶，所有引用它的语义角色自动跟随），且「主题切换」的本质被显式表达为「同一批语义变量在不同主题下引用不同色系的原子层」，而不是「把一堆色值重新算一遍再塞进去」。
- 主题切换改用 CSS 属性选择器而非 JS 注入，是因为 `root.style.setProperty(name, 'var(--atom-yellow-5)')` 这种「注入的值本身又是一个 var() 引用」的写法语义混乱，且把「语义层 → 原子层」的引用关系割裂到了 JS 里。改用 `[data-theme]` 后，所有色彩决策完整留在 CSS 中，JS 只负责切换一个标识符，不参与任何色值计算——这也是 CSS 变量主题方案的标准做法。
- 用户明确限定本次重构范围：「可以，重构下，当然组件里不用管」，即只动 token 定义层，语义层变量名保持不变以确保组件代码零改动。

**踩坑记录（重要，避免重复踩）**

- 重构后出现「切到美团黄主题，UI 状态显示已选中，但页面颜色纹丝不动」的诡异现象。排查路径：先用 `git stash` 二分确认是本次重构引入的真实回归；再逐层验证发现 `data-theme` 属性确实设置成功、`html[data-theme='brand-yellow']` 规则也确实存在于浏览器实际加载的样式表文本中、`--atom-yellow-5: #FFDD00` 也定义正确——但用 `document.styleSheets` 遍历 CSSOM 时发现**整个 `:root` 规则块根本没被解析出来**，`--color-brand-primary` 在全站仅有黄色覆盖块这一处声明，导致 `var(--atom-yellow-5)` 因原子层未定义而解析失败。
- **真正的根因**：文件头部注释里我写了一行 `3) 组件样式只允许使用语义层变量（--color-*/--text-*/--bg-*/--border 等），`，其中 `--color-*/` 里的 `*/` **提前闭合了 CSS 块注释**，后续文本变成非法 CSS，把紧跟其后的 `:root` 选择器一并吞掉，整个原子层+语义层声明被解析器静默丢弃。修复方式是把注释里的通配符写法改为 `--color-xx、--text-xx、--bg-xx、--border 等`。
- 教训一：**CSS 注释里绝对不能出现 `*/` 字符序列**，而用 `-*/` 这种「变量名通配符 + 斜杠」的写法极易无意中构造出它，且编辑器高亮和 `tsc` 都不会报错，只在运行时表现为「一整块样式凭空消失」。
- 教训二：排查 CSS 变量问题时，`getComputedStyle(el).getPropertyValue('--xxx')` 通过自动化工具的 evaluate 上下文调用会不可靠地返回空字符串（对完全未改动的既有变量也一样），不能作为判断依据；应改用遍历 `document.styleSheets` 检查规则**是否真的被解析出来**，以及读取 `backgroundColor` 这类真实计算属性 + 截图来验证。

**影响范围**

- 代码：`b-end-spec/src/styles/tokens.css`（新增原子层、语义层改为引用、新增 `html[data-theme='brand-yellow']` 覆盖块）、`b-end-spec/src/theme/useTheme.tsx`（移除 `ThemeTokens`/`applyTokens`，改为 `applyThemeAttr`，`ThemeConfig` 用 `swatch` 替代 `tokens`）、`b-end-spec/src/components/TopNav.tsx`、`b-end-spec/src/components/ThemeSwitcher.tsx`（各一处 `tokens[...]` → `swatch`）。**未改动任何组件的样式代码**——语义层变量名全部保持原样。
- 已过 `tsc --noEmit`（零报错）；并通过浏览器截图分别验证工具蓝与美团黄两套主题渲染正确（黄色主题下标题渐变呈橙色、图标/徽章/分类标签呈美团黄；蓝色主题恢复原样，与重构前视觉一致）。
- Skill：本记录（`references/CHANGELOG.md`）。`references/style-profile.md` 等生成规范类文档无需同步——本次改动是 token 的**内部组织方式**调整，对外暴露的语义层变量名与取值完全未变，生成代码时该用哪个变量的规则不受影响。

**是否已同步**：✅ 代码改动已通过 `tsc --noEmit` 与双主题浏览器截图验证；语义层契约未变，无需同步修改生成规范类文档。

---

## 2026-08-03（模块聚合页移除变体文字标签；详情页改为真实可切换的变体渲染）

**改了什么**

- **聚合页（`/modules`）撤回变体文字标签**：`b-end-spec/src/pages/ModulesIndex.tsx` 和 `ModulesIndex.module.css` 移除卡片底部展示变体名称（如"纯文字表格 / 带图片列 / 带切换tab"）的标签区块。这是对上一条记录（"模块库变体标签视觉增强"）的方向调整——用户明确要求聚合页不展示变体名称，只在点进详情页后才需要看到变体。
- **详情页（`/modules/:id`）新增 `VariantSwitcher` 组件**：`b-end-spec/src/components/VariantSwitcher.tsx` + `.module.css`，提供一组常驻可点击的 pill 式 tab 按钮，点击后在下方实时渲染对应变体的**真实样式**（不再是纯文字标签）。类型定义 `PreviewVariant = { name: string; render: () => ReactNode }`。
- **`modulePreviews.tsx` 新增两级变体注册表**，供 `ModuleDetail.tsx` 消费：
  - `modulePreviewVariants: Record<string, PreviewVariant[]>` — 一个 L2 模块 id 对应一组变体，覆盖 G-3、G-4、D-1、D-4~D-10、D-12~D-15、W-1、W-5、Form8。
  - `modulePreviewSubGroups: Record<string, { label; variants }[]>` — 一个 L2 模块 id 下实际包含多个独立子模块、各自维护一套变体的场景，覆盖 D-2（环形进度 / 进度指标）、D-3（折线图 / 面积图）、D-11（AI摘要卡）。`ModuleDetail.tsx` 会为每个子分组渲染一个带标题的独立 `VariantSwitcher`，纵向堆叠展示。
  - 消费优先级：`modulePreviewSubGroups` → `modulePreviewVariants` → 旧版单一静态 `modulePreviews`（无 variants 声明的模块，如 G-1+G-2、W-2~W-4/W-6/W-7、FD1-3、Form1-7/9、Detail1-3，保持原样降级展示）。
- **新增通用变体生成器 `buildHeaderVariants(title, body, opts)`**：13 个 D 系列图表卡片模块（D-2/D-3/D-4/D-5/D-6/D-7/D-8/D-9/D-10/D-12/D-13/D-14/D-15）的变体差异集中在卡片头部（操作型/筛选型/筛选（复杂）/描述型/纯净型），图表本体不变，用这个 helper 统一按 `order` 生成 5 类 `Card + header` 组合，避免每个模块重复写 5 份几乎相同代码。`opts` 支持自定义 `filterOptions`/`complexOptions`/`descText`/`order`/`bodyMinHeight`，部分模块按 `l2Modules.ts` 的 `notes` 排除了不适用的类型（如 D-3 面积图排除"描述型"）。
- G-3（简单版/复杂版筛选栏）、D-1（纯大数字/带迷你图/带操作）、D-11（列表型/卡片型，复用真实 `DigestCard` 组件）、W-1（文字欢迎/轮播图）、W-5（日期前缀/标签前缀）、Form8（变体A文本公式/变体B可视化标签编辑器）等模块的变体差异在内容本体而非头部，均改为各自独立的 bespoke 实现，而非套用 `buildHeaderVariants`。
- `ModuleDetail.tsx` 原本的纯文字"变体"标签区块（`Array.isArray(mod.variants)` 分支）已删除，因为上方 `VariantSwitcher` 已展示真实变体样式；保留 `Record<string,string>` 形式的文字说明区块，标题由"变体"改为"变体说明"，用于展示每个变体的额外语义描述（此信息无法从渲染结果直接看出）。
- **修复一处真实渲染崩溃 bug**：D-2「进度指标」子模块的 `D1MiniDonut` 组件此前误用 G2 v4 风格的命令式链式 API（`chart.data(...).coordinate(...).interval()...`）传给 `useG2Chart`，但项目的 `useG2Chart` hook 只接受"返回 spec 对象"的声明式写法（`() => ({ type, data, encode, ... })`），二者不兼容导致 `chart.options(undefined)` 崩溃，且由于 `main.tsx` 未包 ErrorBoundary，整个 `#root` 会被 React 完全卸载、页面白屏。同时修正了 `RingProgressBody` 里 MTD `Progress` 组件的错误 props（`percent`→`percentage`、`strokeColor`→`color`、数值型 `size={120}`→`width={120}`，均以 `node_modules/@ss/mtd-react3` 的 `Progress.d.ts`/`Progress.js` 源码为准核实）。

**为什么**

- 用户明确表达："模块外面的聚合页不用展示变体名称"，与聚合页此前特意加粗高亮变体标签的做法（上一条记录）直接冲突，需要撤回。
- 用户明确要求："在模块的页面中，把不同变体的实际样式都展示出来"——此前详情页的"变体"区块只是纯文字 tag 列表，无法体现变体之间视觉上到底有什么差异，因此需要改为真实渲染 + 可点击切换。
- 两级注册表（`modulePreviewVariants` vs `modulePreviewSubGroups`）是为了正确处理"一个 L2 模块 id 实际对应多个独立子模块"的既有数据建模（如 D-2/D-3/D-11 的 `variants` 字段本身描述的就是不同子模块，而非同一渲染体的不同头部），如果强行塞进单一 key 的 `modulePreviewVariants`（如使用 `"D-2 环形进度"` 复合 key），会与 `ModuleDetail.tsx` 按 `mod.id`（如 `"D-2"`）查找注册表的逻辑对不上，因此改用嵌套结构而不是复合字符串 key。
- `D1MiniDonut` 的崩溃是在批量迁移变体过程中，凭记忆写了旧版/其他项目常见的 G2 命令式 API，但当前项目实际封装的 `useG2Chart` 是声明式 spec 写法；崩溃现象是"点击对应模块详情页整页白屏、`#root` 为空、无错误提示"，通过依次核实 `Progress.d.ts` 源码、`useG2Chart.ts` 源码、以及项目里其余全部正确用法（均为 `useG2Chart(() => ({...}), deps)`）后定位并修复。这类"看似能编译但运行时崩溃"的错误提醒我们：涉及第三方组件库或项目自定义 hook 时，必须以源码/类型声明为准，而不是凭经验假设 API 形状。

**影响范围**

- 代码：`b-end-spec/src/pages/ModulesIndex.tsx` / `.module.css`（移除变体标签）、`b-end-spec/src/pages/ModuleDetail.tsx`（接入 `VariantSwitcher` + 两级注册表消费逻辑）、`b-end-spec/src/components/VariantSwitcher.tsx` + `.module.css`（新增组件）、`b-end-spec/src/components/modulePreviews.tsx`（新增 `buildHeaderVariants` 生成器、约 20 个模块的变体导出、两个注册表、修复 `D1MiniDonut`/`Progress` 崩溃 bug）。已过 `tsc --noEmit`（零报错）和 `read_lints`（无 lint 错误）校验；并通过浏览器截图逐一验证 `/modules` 聚合页与全部 20 个声明了 `variants` 的模块详情页（G-3、G-4、D-1~D-15、W-1、W-5、Form8），确认每个变体 tab 点击后都能正确渲染真实样式、无白屏/崩溃。
- Skill：本记录（`references/CHANGELOG.md`）。核查后确认 `references/L2-modules/index.json` 与 `references/L1-templates/` 无需同步修改——这些文档描述的是"页面装配逻辑与模块选型规范"这一生成代码时的权威依据，而本次改动仅限于 `b-end-spec` 展示应用（showcase app）本身如何呈现已有模块信息，不改变任何模块的选型规则、组件用法或页面装配逻辑。

**是否已同步**：✅ 代码改动已通过 `tsc --noEmit`、`read_lints`、浏览器截图三重验证；已确认无需同步修改 `L2-modules/index.json` 等生成规范类文档。

---

## 2026-08-03（模块库变体标签视觉增强 + 新增 G-6 分类导航模块）

**改了什么**

- `b-end-spec/src/pages/ModulesIndex.module.css`：把卡片底部「变体」标签区从弱化灰色（11px、`rgba(17,25,37,0.6)` 文字 + `rgba(17,25,37,0.045)` 极淡背景）改为品牌蓝高亮样式（12px、加粗标题、`var(--color-brand-primary)` 文字色 + 10% 透明度蓝底 + 18% 透明度蓝色描边），解决用户反馈"模块库页面看不到变体"的可见性问题。经浏览器截图核实，改版前变体标签在 DOM 中确实存在且数据正确，但视觉过于低对比度导致被忽略；改版后在整页缩略图中也能清晰辨认。
- `b-end-spec/src/data/l2Modules.ts`：在 `G-导航` 分类新增 `G-6 分类导航 (Category Tree Nav)` 模块条目，对应 `TreeList.tsx` 左侧的搜索框+树形结构+附加筛选面板（「左树右表」列表页的左侧部分）。`id` 特意选用 `G-6` 而非 `G-5`，因为 skill 索引中 `G-5` 已被保留给「G-4 数据表格」的内联切换 tab 逻辑子模块，二者语义完全不同，避免编号冲突造成误解。
- `references/L2-modules/index.json`：同步新增 `G-6` 条目（name/category/description/triggers/l3Roles/notes），并更新 `_meta.numberingScheme` 说明，注明 `G-6` 是独立可选型模块，不占用 `G-5` 的内联子模块编号。
- `references/L1-templates/page-列表页装配逻辑.md` §7.2：在「树形层级列表」小节标题下方加入一行交叉引用，指出左侧树面板对应 L2 模块 `G-6`，可在「模块库」页面独立浏览。

**为什么**

- 用户反馈"我还是没有在模块页面看到变体们"。经排查，`ModulesIndex.tsx` 的变体渲染逻辑和 `l2Modules.ts` 的 `variants` 数据本身都没有问题（浏览器 DOM 检查确认标签已渲染），根因是 CSS 视觉权重过低——用户在正常浏览节奏下容易一扫而过、误以为没有内容。相比"数据缺失"类 bug，这是一个纯 UI 可读性问题，因此直接提升对比度和字重解决，而不是改动数据结构或渲染逻辑。
- 用户提出"分类导航应该也是个模块"。核查后确认 `l2Modules.ts` 和 skill 的 `index.json` 中都完全没有覆盖这个组件（此前只在 L1 模板文档的"树形层级列表"页面装配说明里以内嵌代码片段形式出现，从未被登记为可独立选型/浏览的 L2 模块）。按照"skill 作为权威数据源"的既定原则，为其新建独立模块条目，而不是继续把它藏在某个页面模板的实现细节里。

**影响范围**

- 代码：`b-end-spec/src/pages/ModulesIndex.module.css`（变体标签样式）、`b-end-spec/src/data/l2Modules.ts`（新增 G-6 数据条目）。已过 `tsc --noEmit` 类型检查和 `vite build` 构建验证，均无报错。
- Skill：`references/L2-modules/index.json`（新增 G-6 条目 + numberingScheme 说明更新）、`references/L1-templates/page-列表页装配逻辑.md`（§7.2 交叉引用）。
- 模块库页面（`/modules`）新增一张 G-6 卡片，「导航与共用」分类模块数由 3 个变为 4 个；G-6 详情页（`/modules/G-6`）已确认可正常访问，因暂无实现代码/截图，预览区显示"暂无预览"属正常降级展示。

**是否已同步**：✅ 已通过浏览器截图分别验证变体标签视觉效果（D-1/G-3/G-4 等多个模块）与 G-6 卡片、G-6 详情页渲染正确；`index.json` JSON 语法已用 `python3 -m json.tool` 校验通过。

---

## 2026-08-03（新增 `--card-padding` 拆分卡片内边距；同步表格撑高/分页贴底方案；模块库展示变体）

**改了什么**

- **间距 token 由 4 个拆分为 5 个**：新增 `--card-padding`(16px) 专门承担"卡片/容器内部留白"（`.dash-card` padding、表格单元格、tab、分页器等组件内部排版），`--gap-module`(8px) 收窄为只负责"模块之间的外部间距 + 栅格 gutter"。此前把两者都写成 `--gap-module`，为了收紧模块间距把它从 16px 调到 8px 时，卡片内部和表格单元格的留白跟着缩水，页面变得异常拥挤；拆开后互不影响。项目代码 `b-end-spec/src/styles/tokens.css` 已新增该 token 并应用到 `.dash-card`。
- 同步 `references/style-profile.md`：§0.1 两种排版模式的 `.dash-card` 示例、"两种模式的共性"、§3 间距 token 表、"只准用 4 个"改为"只准用 5 个"、盒模型边距一致规则（明确表格单元格/tab 允许 `--gap-elem`+`--card-padding` 两值写法作为唯一例外）、§7 通用工具类、§8 自检清单、§9 空间节奏 4 级体系改 5 级体系，新增"外间距与内边距必须用不同 token"踩坑小节。
- 同步 `SKILL.md` 顶部压缩版间距速查（此前仍停留在 `--gap-module:16px` 的更早期数值，一并修正为当前的 5 token 模型）及 §9.4 大区块分区间距说明。
- 同步 `references/theme-examples/tokens.css` 新增 `--card-padding: 16px`。
- 修正 `references/L2-modules/General3-filter-bar.md`、`references/L2-modules/Workbench3-shortcut-grid.md`、`references/L1-templates/page-看板页装配逻辑.md` 中把"卡片/容器内边距"错误标注为 `--gap-module` 的地方，改为 `--card-padding`；表格单元格、Tab、分页器等内部排版同理。栅格 `gutter`、flex 元素间 `gap` 等**外部**间距用法保持 `--gap-module` 不变。
- **新增：表格与相邻模块等高 + 分页器贴底的 flex 布局方案**，写入 `references/L1-templates/page-列表页装配逻辑.md` §7.2（树形层级列表）与 `references/L2-modules/General4-data-table.md` 约束 0.1：`ModuleWrapper` 传 `style={{ flex: 1, minHeight: 0 }}`，并逐层传递到 `.dash-card`、`Table-wrapper`，让表格撑满剩余高度、分页器贴底；同时记录一条实测踩坑——`flex:1` 必须搭配外层容器的 `minHeight` 兜底（如 `calc(100vh - 顶导高度 - 页面留白)`），因为祖先链若没有确定高度，单靠 `flex:1` 会让整块布局塌缩成内容自身高度、下方留出大片空白。项目代码 `TreeList.tsx`/`CrudList.tsx` 已应用该方案。
- **模块库展示页新增变体信息**：`b-end-spec/src/pages/ModulesIndex.tsx`（卡片网格）新增变体标签展示，此前变体列表只在 `ModuleDetail.tsx` 详情页可见；同时补齐 `src/data/l2Modules.ts` 中此前缺失的多个模块（D-2~D-15、W-1、W-5、Form8 等）的 `variants` 字段，与 skill 的 `references/L2-modules/index.json` 对齐。

**为什么**

- 用户要求把最近的处理信息、新代码、构建方式同步进 skill，避免 skill 和实际项目代码出现"文档说的和代码做的不一样"的漂移；同时要求在模块库首页也能看到每个模块有哪些变体，不必点进详情页才知道。
- 间距 token 的拆分是对此前一次性把外间距和内边距合并成同一个 token 的回退修正：合并后任何"调紧模块间距"的诉求都会连带压缩卡片内部呼吸感，这是一个真实暴露出来的架构问题，必须在 skill 层面同步修正规则，否则以后生成的页面会重蹈覆辙。
- flex 撑高方案里的 `minHeight` 兜底不是可选项：已通过真实实验验证——去掉它、只留 `flex:1` 会导致布局塌缩，这个踩坑必须写进 skill，否则下次会有人"优化掉看似多余的 minHeight"而重新引入 bug。

**影响范围**

- 代码：`b-end-spec/src/styles/tokens.css`（新增 token）、`src/pages/list/TreeList.tsx`、`src/pages/list/CrudList.tsx`（flex 撑高方案 + G-3 默认复杂版）、`src/pages/ModulesIndex.tsx` + `ModulesIndex.module.css`（变体展示）、`src/data/l2Modules.ts`（补齐 variants 字段）。
- Skill：`references/style-profile.md`、`SKILL.md`、`references/theme-examples/tokens.css`、`references/L2-modules/General3-filter-bar.md`、`references/L2-modules/General4-data-table.md`、`references/L2-modules/Workbench3-shortcut-grid.md`、`references/L1-templates/page-看板页装配逻辑.md`、`references/L1-templates/page-列表页装配逻辑.md`。

**是否已同步**：✅ 项目代码与 skill 文档已核对一致；已对 `references/` 目录下所有 `--gap-module` 引用做全量排查，区分"外部间距"（保留 `--gap-module`）与"内部内边距"（改为 `--card-padding`）两类用法，逐一修正。`mtd3/RiskDetailPage.tsx` 是独立的历史示例文件（内部自带 `--gap-module: 16px` 的旧值定义），不接入主 token 体系，本次未改动。

---

## 2026-07-31（模块间距 Token 收紧为 8px，并同步 L2/L3 规范）

**改了什么**

- 将项目 `b-end-spec/src/styles/tokens.css` 的 `--gap-module` 从 16px 调整为 8px。该 token 同时驱动 `PageLayout` 中模块的纵向间距、栅格 gutter，以及 `.dash-card` 的卡片内边距，因此三处会同步收紧。
- 同步 `references/style-profile.md` 两处间距表、紧凑密度说明、gutter 示例、空间节奏和自检项；统一明确 `--gap-module` 为 8px，`--gap-page` 保持 16px，`--gap-section` 保持 24px。
- 同步 `references/theme-examples/tokens.css` 的示例 token 值为 8px。L2 模块文档（数据表格、进度、筛选器栏、快捷入口）和 L1 页面模板均只引用 `var(--gap-module)`，无需修改裸数值，继承新 token 后自动生效。
- 重写 `references/L3-notes/mtd-tabs.md` 的 Tab 上/左视觉间距补偿规则：旧规则依赖 `--gap-module`(16) 与 `--gap-elem`(8) 的 8px 差值；两者现在都为 8px，旧公式会失去补偿效果。新规则将 Tab 容器上内边距设为 0，利用 Tab 文字自身约 9px 的行高居中空隙，近似对齐左侧 8px 内边距；同时继续清除 `.mtd-tabs-content` 的上内边距。

**为什么**

- 用户要求将模块级间距收紧为 8px，并要求把数据看板 L2 模块相关的规范同步更新。只改项目 token 而不改 Skill，会让后续生成的看板页面重新使用旧的 16px 规则。
- Tab 补偿方案不能机械替换数值：原先的 16px→8px 差值正好用于抵消 Tab 的约 9px 文字居中空隙；数值相等后必须重新推导，避免保留失效的 CSS 指引。

**影响范围**

- 代码：`b-end-spec/src/styles/tokens.css`，所有使用 `--gap-module` 的页面、网格和 `.dash-card` 同步生效。
- Skill：`references/style-profile.md`、`references/theme-examples/tokens.css`、`references/L3-notes/mtd-tabs.md`。L1/L2 文档已核查为 token 引用，无硬编码旧值。

**是否已同步**：✅ 项目 token、L2/L3 规范和主题示例已同步；已完成全量检索，不存在将 `--gap-module` 标为当前 16px 的遗留说明（历史变更说明除外）。

---

## 2026-07-31（筛选 Tag 改回矩形 + 新增真实点击选中交互）

**改了什么**

- 修正 `b-end-spec/src/components/G4DataTable.tsx` 的 `TabTableVariant`：
  1. 移除筛选标签选中态与未选中态的 `shape="circle"`，两种状态都改回默认矩形，与页面其它矩形圆角元素（按钮、输入框等）保持视觉一致。
  2. 新增真实点击选中交互：引入 `useState` 变量 `activeFilter` 记录当前选中的标签文案（默认 `'全部业务线'`），每个 `Tag` 都绑定 `onClick={() => setActiveFilter(label)}`；渲染时用 `label === activeFilter` 判断该标签是否为选中态。彻底移除此前写死的 `.map((label, idx) => idx === 0 ? ... : ...)` 逻辑——旧逻辑下无论怎么点击，永远只有数组第一项显示为选中态，是无效交互。
  3. 选中态 `type="pure-bordered"` + 随主题联动的 `theme`（工具蓝=`blue`，美团黄=`yellow`）、未选中态 `theme="gray"`（默认 `type="bordered"`）均保持不变。
- 同步修正 `references/L2-modules/General4-data-table.md`：变体三说明文字、示例代码、陷阱提示框（新增「形状」「必须是真交互，不能是假选中」两条 ⚠️）、约束清单第 12 条、自检清单（新增一条「筛选 Tag 是真实点击交互」）均已更新为最新方案。

**为什么**

- 用户明确要求「两种tag都用矩形版」，即撤销此前引入的 `shape="circle"` 胶囊形写法，回归默认矩形。
- 用户明确要求补上真实交互：「加个交互：选中就是最左那种有颜色的，取消选中就变成这种线性的」。此前的实现只是纯展示性的静态样式（`idx === 0` 硬编码 + `style={{cursor:'pointer'}}` 视觉提示鼠标可点），并没有真正的 `onClick` 处理与状态切换，点击任何标签都不会有任何反馈，属于假交互，不符合筛选器的基本可用性预期。

**影响范围**

- 代码：`b-end-spec/src/components/G4DataTable.tsx`（`g4Variants` 被 `CrudList.tsx` 等页面共用，凡引用「带切换tab」变体的页面全部同步生效）。
- Skill：`references/L2-modules/General4-data-table.md`。
- 已用浏览器截图验证：蓝色主题下点击"到店"标签后其变为选中态（浅蓝面型）、"全部业务线"回落为未选中态（灰色线型）；切换到美团黄主题后点击选中的标签正确渲染为浅黄面型。两套主题下点击交互均验证通过。

**是否已同步**：✅ 代码 + Skill 文档均已同步，已截图验证点击交互在蓝色/黄色两套主题下均生效。

---

## 2026-07-30（筛选 Tag 改为胶囊形：新增 shape="circle" + 未选中态改回 gray）

**改了什么**

- 修正 `b-end-spec/src/components/G4DataTable.tsx` 的 `TabTableVariant`：筛选标签选中态与未选中态都新增 `shape="circle"`（胶囊形），保持两种状态形状统一；未选中态由 `theme="lightgray"` 改回 `theme="gray"`（仍为默认 `type="bordered"`）。选中态 `type="pure-bordered"` + 随主题联动的 `theme`（工具蓝=`blue`，美团黄=`yellow`）保持不变。
- 同步修正 `references/L2-modules/General4-data-table.md`：变体三说明文字、示例代码、陷阱提示框、约束清单第 12 条、自检清单均已更新为最新方案。

**为什么**

- 用户明确要求未选中态使用 `<Tag shape="circle" theme="gray">线型标签</Tag>`（源自 MTD Tag 组件官方 Demo `otherDemo/type.md` 的胶囊形写法），选中态同步加上 `shape="circle"` 以保持两种状态形状一致，避免出现"选中态方形圆角、未选中态胶囊形"的形状不统一问题。
- 经查源码，`theme="gray"` 在默认 `type="bordered"` 下背景色为 `rgba(17,25,37,.30)`（30% 透明度深灰），视觉上是中等灰度的面型效果；`shape="circle"` 仅影响圆角半径（变为胶囊形状），不改变颜色填充方式。已用浏览器截图在工具蓝、美团黄两套主题下验证：未选中态呈现灰色胶囊描边标签，选中态呈现随主题联动的浅色胶囊面型标签（蓝色主题浅蓝、黄色主题浅黄），两者形状统一、层次分明。

**影响范围**

- 代码：`b-end-spec/src/components/G4DataTable.tsx`（`g4Variants` 被 `CrudList.tsx` 等页面共用，凡引用「带切换tab」变体的页面全部同步生效）。
- Skill：`references/L2-modules/General4-data-table.md`。
- 已用浏览器截图验证蓝色/黄色两套主题下的实际渲染效果。

**是否已同步**：✅ 代码 + Skill 文档均已同步，已截图验证。

---

## 2026-07-30（筛选 Tag 选中态强调色随主题联动：新增 yellow 主题色 + 未选中态改用 lightgray）

**改了什么**

- 修正 `b-end-spec/src/components/G4DataTable.tsx` 的 `TabTableVariant`：
  1. 引入 `useTheme()` 读取当前全局主题，筛选标签选中态的 `theme` 不再写死 `blue`，改为按主题联动：工具蓝主题（`primary`）用 `theme="blue"`，美团黄主题（`brand-yellow`）用 `theme="yellow"`；`type` 保持 `"pure-bordered"`（浅色面型）不变。
  2. 未选中态由 `theme="gray" type="pure-bordered"` 改为 `theme="lightgray"`（不再指定 `type`，使用默认 `type="bordered"`）。
- 同步修正 `references/L2-modules/General4-data-table.md`：变体三说明文字、示例代码、新增「选中态强调色随主题联动」提示框；约束清单第 12 条、自检清单对应勾选项均已更新为新方案。

**为什么**

- 用户明确要求：数据表格「带切换tab」变体的筛选标签，黄色主题下选中态应使用 `<Tag type="pure-bordered" theme="yellow">`，未选中态统一使用 `<Tag theme="lightgray">标签</Tag>`。
- 经查 MTD Tag 组件源码确认：`theme="yellow"` 与 `theme="lightgray"` 均为 MTD 原生预设色，非自定义值。`yellow` 在 `pure-bordered` 下为浅黄底 + 黄字 + 浅黄边框（`$tag-preset-yellow-background: rgba(255,209,0,.06)`），与美团黄品牌色呼应；`lightgray` 做了独立取色处理（`bordered` 默认背景为 `rgba(17,25,37,.45)`，比 `gray` 的取色更柔和），适合表达弱化的未选中状态。
- 之所以选中态强调色需要按主题联动而非固定用 `blue`：这组筛选 Tag 承担的是"页面主强调色/品牌色"的语义（类似选中态高亮），而非固定的功能色（如成功/失败/警告等状态色），因此应当跟随全局主题变化，在黄色主题下呈现黄色高亮，视觉上与整体品牌基调一致。

**影响范围**

- 代码：`b-end-spec/src/components/G4DataTable.tsx`（`g4Variants` 被 `CrudList.tsx` 等页面共用，凡引用「带切换tab」变体的页面全部同步生效）。新增对 `useTheme` 的依赖，要求该组件必须在 `<ThemeProvider>` 内部渲染（项目内已满足）。
- Skill：`references/L2-modules/General4-data-table.md`。
- 已用浏览器截图在工具蓝、美团黄两套主题下分别验证：蓝色主题选中态为浅蓝色面型，黄色主题选中态为浅黄色面型，未选中态在两套主题下均为浅灰色面型（`lightgray`），视觉统一、层次清晰。

**是否已同步**：✅ 代码 + Skill 文档均已同步，已截图验证。

---

## 2026-07-30（修正筛选 Tag 选中态颜色用法：`type="pure"` → `type="pure-bordered"`）

**改了什么**

- 修正 `b-end-spec/src/components/G4DataTable.tsx` 的 `TabTableVariant`（G-4「带切换tab」变体，被 `CrudList` 等"有筛选器的数据列表"页面引用）：筛选标签选中态由 `theme="blue" type="pure"` 改为 `theme="blue" type="pure-bordered"`，未选中态保持 `theme="gray" type="pure-bordered"` 不变，二者统一用 `type="pure-bordered"`、仅靠 `theme` 区分。
- 排查详情页系列模板（`src/pages/detail/` 下 BasicDetail、TimelineDetail、DrawerDetailPage、CampaignDetail、CardDetail、ModalDetailPage 六个模板）发现：其余五个模板的状态类 Tag 均正确使用 `type="bordered"`，仅 `ModalDetailPage.tsx` 里描述列表中的"券状态"字段误用了 `type="pure"`，与同页表格列的状态标签风格不一致（深色实底 vs 浅底描边），已一并订正为 `type="bordered"`，保持同页视觉统一。
- 同步修正 `references/L2-modules/General4-data-table.md`：变体三示例代码、变体三说明文字均改为选中态用 `type="pure-bordered"`；新增「`type="pure"` 陷阱」提示框，说明 MTD Tag 的 `type="pure"` 实际渲染为**深色纯色实底**（`background-color` 取 `theme` 实色），并非"浅色面型"，真正的浅色面型（6% 透明度底色 + 10% 透明度边框）对应 `type="pure-bordered"`；约束清单新增第 12 条、自检清单新增对应勾选项。

**为什么**

- 之前的写法（选中态 `type="pure"`）在实际渲染中会出现一个突兀的深色纯蓝实底色块，而不是预期的"浅色面型代表选中"，与未选中态的浅灰线性风格视觉断层过大，被误认为"颜色用错了"。经查 MTD Tag 组件源码（`_var.scss`）确认：`pure` 类型背景色沿用 `&-#{theme}` 规则里的 `background-color: $color-v`（该 `theme` 的实色，如蓝色 `#166FF7`），与 `bordered`（默认类型）背景视觉几乎一致，都是深色实底；只有 `pure-bordered` 才通过独立的 `-border`/`-background` 变量组（如 `$tag-preset-blue-border: rgba(22,111,247,0.1)`、`$tag-preset-blue-background: rgba(22,111,247,0.06)`）实现真正的浅色面型。蓝色主题与黄色主题（`brand-yellow`）下均已用浏览器截图验证：Tag 的 `theme` 是固定功能色，不随品牌主题切换，选中态在两套主题下都正确显示为浅蓝色面型，未选中态显示为浅灰色线性。

**影响范围**

- 代码：`b-end-spec/src/components/G4DataTable.tsx`（`g4Variants` 被 `CrudList.tsx`、`OverviewDashboard.tsx` 等多个列表页/看板页共用，凡引用「带切换tab」变体的页面全部同步生效）。
- Skill：`references/L2-modules/General4-data-table.md`。
- 未涉及 `tokens.css`（本次问题是组件 `type` 枚举用法错误，非 token 取值问题）。

**是否已同步**：✅ 代码 + Skill 文档均已同步，已用浏览器截图验证蓝色/黄色两套主题下的实际渲染效果。

---

## 2026-07-30（图表色板 Token 体系纠偏 + 主题化半透明色写法 + 遗留硬编码色值清理）— 双色值体系全面对齐 b-end-spec

**改了什么**

- **`style-profile.md` §6 数据可视化色板 Token 全面重写**：
  1. 分类色板由「8 色含黄（`--chart-1..8`，含 `#FFBE25`）」修正为「7 色无黄（`--chart-1..7`）」，并说明排除黄色的原因（饱和度/对比度问题，且会与美团黄主题下的 `--chart-1` 撞色）。
  2. `chartTokens.ts` API 文档由过期的函数调用式（`chartPalette()`/`chartPrimaryRamp()`/`chartPrimary()`/`chartSemantic`/`chartAxisDefaults()`）改为实际验证过的 getter 对象式（`chartPalette.c1..c7`、`chartMono.strong/base/medium/weak/lightest`、`chartTrend.up/down`、`getChartCategoricalPalette()`、`getChartMonoScale()`），并修正工具文件路径为 `src/lib/chartTokens.ts`（React）/`src/composables/chartTokens.ts`（Vue）。
  3. 修正 `--chart-primary-strong` 的错误定义：原文档写「= `--color-brand-primary`」，实际 tokens.css 中为「= `--color-primary-6`」（更深的强调色，随主题联动但数值不同于 `--chart-1`）。
  4. 如实说明 `--chart-axis-*` 系列 token 与 `chartAxisDefaults()` 助手函数**并不存在**——实际坐标轴/网格样式是在各图表 spec 里直接写 `rgba(17,25,37,.06)` 等内联字面量，不走 token 封装。
- **`SKILL.md` 主文件**：3 处引用 `--chart-1..8` 的表述统一修正为 `--chart-1..7`（图表色板段落、整页彩色上限计色规则、图表色板不计入 3 色上限的说明）。
- **`theme-system.md`**：
  1. §2.2 token 表新增 `--chart-up`（`#FF1F1F`，固定不随主题变化）、`--chart-down`（`#00A854`，固定不随主题变化）两行；修正 `--chart-primary-strong` 的两个主题取值为 `--color-primary-6`（工具蓝 `#0E65E8` / 美团黄 `#E0BF00`）。
  2. 新增 §4.5「主题化半透明色（CSS 文件场景 · `color-mix()` 写法）」，记录本次在 `b-end-spec` 的 `Landing.module.css` 中新采用的 `color-mix(in srgb, var(--token) N%, transparent)` 写法（区别于 JS 内联样式场景的十六进制字符串拼接技巧），含排查隐藏 RGB 字面量硬编码的正则建议与浏览器兼容性说明。
- **`references/theme-examples/chartTokens.react.ts`（新增文件）**：与 `b-end-spec` 实际验证过的 `src/lib/chartTokens.ts` 完全对齐的可直接复制参考实现，含 `chartPalette`/`chartMono`/`chartTrend` getter 对象与 `getChartCategoricalPalette()`/`getChartMonoScale()` 两个便捷函数。
- **`g2-chart-foundation.md`**：新增「图表配色接入 chartTokens.ts」章节，补充分类色/单系列语义色/同色系热力图三种典型场景下 `buildSpec()` 内如何调用 `chartTokens.ts` getter 的完整代码示例，并说明主题切换后色值自动刷新的机制。
- **`references/L2-modules/Workbench1-welcome-banner.md`**：欢迎栏渐变背景由硬编码的薰衣草色（`#EEF2FF`/`#E0E7FF`/`#C7D2FE`）修正为实际项目验证过的主题色阶 token（`linear-gradient(135deg, var(--color-primary-1), var(--color-primary-1) 60%, var(--bg-page, #F5F6F7))` 文字变体 / `linear-gradient(135deg, var(--color-primary-1), var(--color-primary-4))` 轮播变体），ASCII 布局注释、JSON 视觉规格、React 骨架代码、约束、自检、踩坑笔记同步更新。
- **`references/L2-modules/DashboardChartCard.md`**：移除不存在的「蓝色单色色阶」`--chart-blue-1..6` 幻影 token 表（含臆想中的 `--chart-blue-2: #BFD8FE`），改为文档真实的 `chartMono` getter 对象（5 档：strong/base/medium/weak/lightest），涨跌色表同步改为 `chartTrend.up/.down` 获取方式，使用约束条目相应更新。
- **`references/L2-modules/Dashboard11-digest-card.md`**：list/cards 变体的 AI 图标渐变与 label 色值说明由硬编码 `#468DFB → #166FF7`/`#166FF7` 修正为 `linear-gradient(135deg, var(--color-primary-4) 0%, var(--color-brand-primary) 100%)`/`var(--color-brand-primary)`（约束、踩坑笔记两处）；insight 变体固定三色渐变（青→蓝→紫，AI 装饰性配色，不随主题变化）与 summary 变体 Tag 色确认为有意保留的固定语义色，未做改动。

**为什么**

- 用户在 `b-end-spec` 实际项目中要求排查并修复所有硬编码蓝色（含图表相关色值），修复后要求把变更信息同步回本 skill 的模块知识库，并对全量模块做一次「代码写法与预览项目一致 + 双色值体系完整」的复核。复核过程中发现 skill 文档中存在多处与 `b-end-spec` 真实代码/tokens.css 不一致的地方（部分是本次修复带来的新增内容未同步，部分是文档本身早先就存在的过期或错误记录），逐一核对源码后修正，确保后续基于本 skill 生成新模块时，不会再产出与实际双主题体系脱节的硬编码色值或不存在的幻影 token。

**影响范围**

- `references/style-profile.md`（§6 数据可视化色板 Token 全面重写）
- `SKILL.md`（3 处图表色板色数描述）
- `references/theme-system.md`（§2.2 token 表新增/修正、新增 §4.5）
- `references/theme-examples/chartTokens.react.ts`（新增文件）
- `references/g2-chart-foundation.md`（新增图表配色接入章节）
- `references/L2-modules/Workbench1-welcome-banner.md`（渐变背景色值修正）
- `references/L2-modules/DashboardChartCard.md`（移除幻影 blue token 表，改为 chartMono 说明）
- `references/L2-modules/Dashboard11-digest-card.md`（AI 图标渐变/label 色值修正）
- 不影响 L1 页面模板结构与选型逻辑；不影响 MTD 组件层（第 1 层主题）的实现方式；仅涉及业务 Token 层（第 2 层）色值定义与图表配色工具文档的准确性修正。

---

## 2026-07-29（Button.Link + Tag 规范修正）— 操作列按钮语义化 + Tag 颜色用法纠偏 + 筛选用 Tag 替代 ghost Button

> ⚠️ **勘误（2026-07-30）**：本条目第 3 点里"选中态 `theme="blue" type="pure"`"的写法是**错误**的，`type="pure"` 实际渲染为深色纯色实底而非浅色面型，已在 [2026-07-30（修正筛选 Tag 选中态颜色用法）] 条目中订正为 `type="pure-bordered"`。请勿参照本条目的 `type="pure"` 写法。

**改了什么**

- **`General4-data-table.md` 全面更新**：
  1. 操作列文字按钮从 `<Button type="text">` / `<Button type="text" danger>` 统一改为 `<Button.Link type="primary" shape="text">`（React 渲染原生 `<a>`，语义更准；不支持 `size` prop）。Vue 示例同步去掉 `size="small"` 与 `danger`。
  2. 明确 **Tag `type` 与 `theme` 严格分离**：`type` 只控制样式（bordered/pure/text/pure-bordered），`theme` 控制颜色（blue/green/orange/red/gray…）。禁止把 Button 的 `type` 枚举（warning/danger/success/primary/grey/normal）传给 Tag。修复所有示例中误写 `<Tag type="danger">` 为 `<Tag theme="red" type="bordered">`。
  3. 第三变体「带切换tab」的二级筛选项从 `Button size="small" ghost type="primary"` 改为 `Tag` 组件：选中态 `theme="blue" type="pure"`，未选中态 `theme="gray" type="pure-bordered"`。解决黄色主题下 ghost 按钮全变黄框、无法区分选中状态的问题。
  4. 约束/自检/踩坑笔记新增对应条目：「操作用 Button.Link」「Tag type vs theme」「禁止 ghost Button 模拟 Tag」。
- **`SKILL.md` 主文件**：G-4 模块表描述同步「ghost 按钮」→「Tag 筛选」；Tag 颜色策略全局规则追加 `type`/`theme` 分离说明与 ghost Button 禁令。
- **`interaction-patterns.md`**：Popconfirm 示例中去掉 `danger`（常规操作按钮不应红色）。
- **`page-列表页装配逻辑.md`**：操作人链接描述改为 `Button.Link`；Vue 示例去掉 `size="small"`。
- **`Dashboard5-combo.md` / `Dashboard8-stacked-progress.md`**：操作按钮映射表同步改为 `Button.Link`。
- **`mtd3/RiskDetailPage.tsx`**：修复 `<Tag type="danger">` 为 `<Tag theme="red" type="bordered" size="small">`，并修复 `<Tag type="warning">` 为 `<Tag theme="orange" type="bordered" size="small">`。
- **`references/L2-modules/FD2-page-header.md`**：修复 `<Tag type={status}>` 为 `<Tag theme={status} type="bordered" size="small">`。

**为什么**

- 用户在实际项目 `b-end-spec` 中测试时发现：(1) 操作列用 `Button shape="text"` 语义不对，应为导航链接；(2) 将 Button 的 `type` 枚举（danger/success/warning 等）误传给 Tag 导致颜色渲染异常（Tag 组件不校验非法 type，生成无匹配 CSS 的类名）；(3) 用 `Button ghost` 冒充筛选 Tag 在黄色主题下产生全黄框、无选中态区分的视觉 bug。这些问题在 b-end-spec 中已修复并通过蓝/黄双主题截图验证，现同步回 skill 文档防止后续生成重复犯错。

**影响范围**

- `references/L2-modules/General4-data-table.md`（约束、自检、踩坑、3 个变体示例、骨架代码、固定列示例、L3 组件映射表）
- `references/L2-modules/FD2-page-header.md`（Tag 用法修正）
- `SKILL.md`（G-4 描述、Tag 全局规则）
- `references/interaction-patterns.md`（Popconfirm 示例）
- `references/L1-templates/page-列表页装配逻辑.md`（操作人链接描述 + Vue 示例）
- `references/L2-modules/Dashboard5-combo.md` / `Dashboard8-stacked-progress.md`（操作按钮映射）
- `mtd3/RiskDetailPage.tsx`（Tag 用法修正）
- 不影响任何已有的 L1 页面模板结构与选型逻辑；仅修正组件级 API 使用规范。

---

## 2026-07-29（再再续）— 色值对齐学城最终裁定 + 引用方式简化 + b-end-spec 项目同步修复 + 四个 L1 页面新增黄色主题切换栏

**改了什么**

- **色值最终裁定：以学城《【1】色彩》文档为唯一权威来源**：此前一条记录（"对照学城官方《【1】色彩》文档补充色彩注意事项"）中暂缓处理的蓝绿/紫/粉三色版本差异，本次明确裁定——`style-profile.md` §1 功能色表格三色统一改为学城最新规范值：`#009E9E`→`#00A3A3`（蓝绿）、`#7D1AFF`→`#882EFF`（紫）、`#FF2994`→`#EB2F93`（粉），不再维持 MTD 组件库 `_base_color.scss` 的旧值。同步修正 `references/L2-modules/DashboardChartCard.md` 图表色板表格与 `references/L2-modules/Dashboard7-pie-donut.md` 的 `palette` 示例数组。
- **引用方式简化**：`style-profile.md`、`SKILL.md`、`DashboardChartCard.md` 中原本反复出现的学城文档完整 URL（`km.sankuai.com/collabpage/1803947407`）与维护人姓名，除文首统一的【1】-【7】编号引用列表保留完整信息外，正文其余提及处一律简化为「文首【1】色彩规范文档」或「`style-profile.md` 文首【1】色彩规范文档」的指代方式，避免同一 URL 在文档中重复出现、后续维护时多处不同步。
- **b-end-spec 项目（`/Users/tianyi/Documents/文档类/b-end-spec`）同步修复**：
  1. `src/styles/tokens.css` 按 `theme-system.md`/`style-profile.md` 规范重写：token 命名去主题化（`--color-brand-blue`→`--color-brand-primary`、`--color-blue-1/4/6`→`--color-primary-1/4/6`）；功能色三色改为学城最新值；补齐缺失 token（`--mask`、深色背景专用中性色阶 `--text-dark-1..6`/`--border-dark`/`--divider-dark`/`--bg-dark-inner`）；图表 token 新增 `--chart-primary-strong`/`--chart-primary-weak` 并让 `--chart-1` 随主题联动；CSS 内联硬编码色值（`#166FF7`/`#468DFB`）改为 `var()` 引用。
  2. 全项目搜索并替换旧 token 名引用：`DigestCard.tsx`、`data/designSpecs.ts`、`Dashboard.module.css`、`DrawerDetailDrawer.css`、`List.module.css` 共 5 个文件同步改名。
  3. `mock/tableData.ts`、`pages/dashboard/OverviewDashboard.tsx` 中硬编码的图表色值字面量（`#009E9E`/`#7D1AFF`/`#FF2994`）同步替换为学城最新值。
  4. 新增 `src/theme/useTheme.tsx`（ThemeProvider + useTheme，双主题：`primary` 工具蓝 / `brand-yellow` 美团黄）与 `src/components/ThemeSwitcher.tsx`（右下角悬浮分段切换栏），作为 skill 主题机制在真实项目中的落地参考实现；`src/App.tsx` 用 `ThemeProvider` 包裹路由树并挂载 `<ThemeSwitcher />`。已通过 `tsc --noEmit` 与 `vite build` 验证，构建产物确认包含独立代码分割的 `theme-yellow-*.css` chunk。
- **b-end-page skill 四个 L1 页面模板新增「黄色主题 + 底部悬浮切换栏（可选装配项）」章节**：`page-看板页装配逻辑.md`、`page-列表页装配逻辑.md`、`page-表单页装配逻辑.md`、`page-详情页装配逻辑.md` 均在各自「装配产物」章节之前插入新章节并将原「装配产物」章节顺延编号，内容统一包含：触发条件（仅用户明确要求时才装配）、装配方式（`ThemeProvider`/`useTheme()` 挂载位置、悬浮胶囊样式规格、分段按钮+色标点规则、`setTheme()` 双层联动）、全局悬浮控件的定位说明（不计入任何承载容器的模块清单）、按页面类型定制的避让规则（表单页需避开 Form1-action-bar 固定操作栏；抽屉/弹窗承载容器时切换栏须挂载在触发浮层的宿主页面而非浮层内部）、自检清单。各页面「装配产物」章节末尾新增一条指向 `theme-system.md` 的规则引用。

**为什么**

- 上一条记录中色值差异暂缓处理是为了避免在未确认影响范围时贸然改动；本次用户明确要求「全部以学城文档为主」，因此将学城《【1】色彩》文档裁定为唯一权威来源，结束版本并存状态，同时把散落在正文中的重复 URL/人名引用收敛到文首引用列表，降低后续维护成本。
- 之前的色值修正只停留在 skill 文档层面，用户进一步要求「对照 skill 修复 b-end-spec 这个项目」，即把 skill 规范作为验收标准，反向核查并修复真实项目中所有残留的旧命名 token 与旧色值（含 CSS 变量、CSS Modules、TSX 内联样式、图表配置里的硬编码十六进制字面量），确保 skill 文档与实际项目代码不脱节。
- 用户要求「在 b-end-page 各个 L1 页面增加黄色版本，在底部的漂浮栏里切换」，因此设计了一套不改动模块系统本身、仅通过 token 双层联动即可扩展新主题的机制（已有 `theme-system.md` 作为理论基础），并把「何时装配、装配在哪、长什么样」的落地规则补充进全部四类页面的装配逻辑文档，同时在 b-end-spec 项目中做了一遍可运行的参考实现用于验证方案可行性。

**影响范围**：`references/style-profile.md`（§1 功能色表格与引用措辞）、`SKILL.md`（图表色板引用措辞）、`references/L2-modules/DashboardChartCard.md`（色板表格与标题引用措辞）、`references/L2-modules/Dashboard7-pie-donut.md`（palette 示例）、四个 `references/L1-templates/page-*.md` 文件（新增主题装配章节 + 章节重编号）；外部项目 `b-end-spec` 的 `src/styles/tokens.css`、5 个消费旧 token 名的文件、2 个含硬编码色值的图表配置文件、新增 `src/theme/useTheme.tsx`、新增 `src/components/ThemeSwitcher.tsx`、`src/App.tsx`。不影响默认主题（`primary`）下页面的既有视觉呈现；黄色主题为新增可选能力，未被显式要求时不会出现在生成产物中。

---

## 2026-07-29（续）— 明确边界：业务 Token 不覆盖 MTD 组件内部默认样式

**改了什么**

- **`General-Layout.tsx` 删除颜色覆盖**：移除 `.side-nav-menu .mtd-prime-menu-item-selected` / `.mtd-prime-menu-item-active` 上用 `!important` 覆盖 `--nav-active-bg`/`--nav-active-color` 的规则，改为注释说明选中态颜色完全交给 MTD 官方主题 CSS 决定；结构性覆盖（圆角、margin）保留。
- **`style-profile.md` G-2 侧边栏说明改写**：选中/hover 态的「内缩悬浮高亮块」做法拆分为「结构覆盖（保留：内缩 padding、圆角、内容排版）」与「颜色覆盖（去掉：不再用 `--nav-hover-bg`/`--nav-active-color`/`--nav-active-bg` 通过 `:deep()` 穿透改写 `.mtd-menu-item-title` 等组件内部 class）」。
- **「导航专用 Token」表标注适用边界**：`--nav-active-color`/`--nav-active-bg`/`--nav-item-color`/`--nav-hover-bg` 明确标注为「仅用于非 MTD 自定义元素（如 G-1 顶导手写 `router-link` 菜单）」，不用于 MTD Sidebar/Menu 组件内部。
- **`theme-system.md` 新增边界铁律**：§0 核心架构原则新增"业务 Token 层不覆盖 MTD 组件内部默认样式"的明确声明，禁止用 `:deep()`/`::v-deep` 把业务 token 写进 MTD 组件内部 class；§2.2 取值表对应两行token 备注同步更新。

**为什么**

- 用户明确要求："不要改写组件内部默认样式"。此前 G-2 侧边栏为了实现选中态高亮，用 `:deep()` 穿透把业务 `--nav-active-color`/`--nav-active-bg` 写进了 MTD Menu 组件内部的 `.mtd-prime-menu-item-selected` 等 class，这意味着 MTD 组件内部渲染同时受「MTD 官方 CSS 主题」和「业务 tokens.css」两条链路驱动，违背了"组件层交给 MTD 官方主题、业务 Token 层只管非组件自定义元素"的职责边界，也让主题切换机制变得不纯粹。修正后 MTD 组件内部样式完全且唯一由 MTD 官方主题 CSS 决定，业务 token 只作用于本 skill 自己产出的非 MTD 元素。

**影响范围**：`references/L2-modules/General-Layout.tsx`、`references/style-profile.md`（§6.5 导航专用 Token + G-2 侧边栏说明）、`references/theme-system.md`（§0 核心架构原则 + §2.2 取值表）。不影响任何非导航模块；侧边栏选中态视觉效果将改为 MTD 组件默认渲染效果（后续如需要自定义视觉，应通过 MTD 组件官方支持的 props/slot 方式实现，而非样式穿透）。

---

## 2026-07-29 — Token 中性化重构 + 主题体系与模块系统解耦

**改了什么**

- **色彩 Token 命名去主题化（style-profile.md §1 + 全部 L2 模块文档 + SKILL.md + mtd3/RiskDetailPage.tsx）**：`--color-brand-blue` → `--color-brand-primary`、`--color-blue-1/4/6` → `--color-primary-1/4/6`、`--chart-blue-strong/weak` → `--chart-primary-strong/weak`、`chartBlueRamp()` → `chartPrimaryRamp()`。`--color-brand-yellow` 拆分语义：黄色主题下的主色统一并入 `--color-brand-primary`（取值随主题变化），固定不随主题变化的美团黄点缀色改用独立的 `--color-accent`。涉及 17 个文件的批量替换 + SKILL.md 两处手工精修，替换后全量 grep 核查确认无遗漏（历史记录性质的旧 CHANGELOG 条目和 style-profile.md 的迁移说明注释除外，二者刻意保留旧命名字面量作为文档记载）。
- **新增独立文档 `references/theme-system.md`**：作为主题体系唯一权威来源，包含主题清单（`primary` 工具蓝默认 / `brand-yellow` 美团黄）、MTD 组件层与业务 Token 层的双层联动机制说明、主题配置表（MTD CSS 包路径 + tokens 双主题取值表）、新增主题扩展指南、自定义非预置主题色的 SCSS 覆盖方案（原 SKILL.md 中对应内容迁移至此，避免信息丢失）、旧命名 → 新命名迁移对照表。
- **新增独立主题入口示例文件 `references/theme-examples/theme.react.tsx` 与 `theme.vue3.ts`**：分别为 React（ThemeProvider + useTheme）与 Vue3（组合式函数 useTheme）的可直接复制主题入口实现，核心逻辑一致——用同一个主题配置对象驱动「动态加载 MTD 主题 CSS」与「覆写 tokens.css 中性变量」两层联动，新增主题只需在配置表中新增一条记录，不需要改动任何业务代码。
- **style-profile.md §0.5 与 SKILL.md「MTD 主题」章节改写**：均从"列举具体主题实现细节"改为"速记核心原则 + 指向 theme-system.md"，避免同一份信息在多处维护导致后续不同步。

**为什么**

- 用户提出：当前 token 命名直接包含颜色语义（如 `primary-blue`），未来要支持蓝色版/黄色版两套 token 体系并可切换，这种命名方式会导致模块系统与具体主题颜色绑死，不利于后续扩展更多主题。需要让 token 命名保持中性、主题与模块系统解耦，并评估"单独封装主题入口文件、动态加载"的实现方式是否合理。
- 采用 primary + 数字色阶命名风格（`--color-brand-primary`、`--color-primary-1/4/6` 分别对应浅色/默认/hover/active），并确认结论：单独封装主题入口文件、由同一个配置对象联动切换 MTD CSS 与 tokens.css 变量的方案是合理的，已按此实现。

**影响范围**：`style-profile.md`（§0.5 主题体系、§1 色彩 Token、§6 图表色板、§6.5 导航 Token）、`SKILL.md`（§5.1 色彩速查、图表色板速查、MTD 主题→主题体系）、17 个 `L1-templates`/`L2-modules` 文档、`mtd3/RiskDetailPage.tsx`、新增 `references/theme-system.md`、新增 `references/theme-examples/theme.react.tsx` 与 `theme.vue3.ts`。不改变任何色值的视觉呈现（默认主题下所有 token 取值与重构前一致），纯命名与架构层面的重构。

---

## 2026-07-29（再续）— 对照学城官方《【1】色彩》文档补充色彩注意事项

**改了什么**

- **`style-profile.md` §1 色彩 Token 章节**新增以下内容：
  1. 标注色彩体系的权威来源为学城官方规范文档《【1】色彩》（`km.sankuai.com/collabpage/1803947407`，维护人倪新皓）。
  2. 补充完整的 Y1-Y7 黄色阶、B1-B6 蓝色阶官方色值（本 skill 此前只落地了 B1/B4/B6 三档），并说明后续如需更细粒度色阶应如何按中性命名扩展。
  3. 新增「§1.1 室外色彩」：官方文档针对户外强光场景提供的独立色阶全表，默认不启用，仅当用户明确要求户外/强光场景时才切换。
  4. 新增「§1.2 主色黄使用原则」：浅色背景禁止直接用品牌黄（需换成 `--color-accent-text`）、黄色背景禁止叠加浅色/彩色元素、控制品牌黄使用面积和触点数量三条官方强制规则。
  5. 功能色表格新增**色板版本差异说明**：本 skill 蓝绿/紫/粉三色（`#009E9E`/`#7D1AFF`/`#FF2994`）对齐 MTD 组件库官方 `_base_color.scss`，但与学城最新色彩规范文档给出的色值（`#00A3A3`/`#882EFF`/`#EB2F93`）不一致，两个官方来源存在版本差异；决定暂时维持 MTD 组件库色值不变（保证与实际渲染组件视觉一致），标注差异供后续核实，不擅自变更。
  6. 中性色表格新增 `--mask`（遮罩色 `rgba(0,0,0,.5)`，官方文档定义、本 skill 此前缺失）；新增「深色背景专用中性色阶」说明（一级到六级文字、描边、分割线、内容背景的完整官方取值），并提示如业务场景出现深色侧边栏/卡片等需要在深色底上分层文字时，应新增 `--text-dark-1..6` 等对应 token，不要直接复用浅色背景的 `--text-1..6`。

**为什么**

- 用户提供学城文档链接 `https://km.sankuai.com/collabpage/1803947407`，要求对照该文档检查本地资料并补充文档中的注意事项。核对后发现本地 `style-profile.md` 缺少官方文档中的多项重要使用规则（主色黄使用原则、室外色彩体系、遮罩色 token、深色背景专用中性色阶），以及功能色部分存在与官方最新规范不一致但未被记录的色值差异。补充这些内容可以让后续生成含品牌黄/深色场景/浮层遮罩的页面时有据可依，避免重复踩坑；色值差异先如实记录、暂不擅自变更，避免在未充分确认影响范围（是否会导致与实际渲染的 MTD 组件视觉不一致）的情况下贸然改动既有色板。

**影响范围**：仅 `references/style-profile.md` §1 色彩 Token 章节新增说明性内容，未删除或修改任何已有 token 的变量名/取值；不涉及代码逻辑变更，无需重新生成或回归验证已有页面。

---

## 2026-07-20 — MTD Row class 名双选择器修复 + 存量项目默认用 MTD 规则

**改了什么**

- **等高选择器修复（三处）**：tokens.css / style-profile.md §6.9 / DashboardChartCard.md 的等高 CSS 选择器从只覆盖 `.mtd-prime-row-flex` 改为同时覆盖 `.mtd-prime-row` 和 `.mtd-prime-row-flex`。MTD Row 组件不传 `type="flex"` 时渲染的 class 是 `.mtd-prime-row`（无 `-flex` 后缀），之前的选择器静默失效导致同行左右卡片底边不对齐。
- **存量项目组件库规则（SKILL.md §3.3 步骤 3 + §7 步骤 2）**：新增规则——存量项目（包括 nocode 提前搭建的脚手架）也默认使用 MTD 组件库，在 Design Spec 阶段必须向用户确认。Design Spec 自检清单新增两项：① 存量场景确认 MTD ② 等高双选择器覆盖。

**为什么**

- 用户在连锁品牌拓店管理看板中发现「品牌年度开店目标达成」与「核心指标」两张卡片底边错位。根因：tokens.css 只写了 `.mtd-prime-row-flex`，而 MTD Row 实际渲染的 class 是 `.mtd-prime-row`。修复后两卡等高齐平。
- nocode 等工具会提前生成项目脚手架，导致 skill 误判为存量项目、可能跳过 MTD 而使用原生组件，需明确规则避免此类问题。

**影响范围**：SKILL.md（§3.3 步骤 3 + §5.1 + §7 步骤 2 + Design Spec 自检清单）、style-profile.md（§6.9）、DashboardChartCard.md（等高穿透代码块）、CHANGELOG.md。

---

## 2026-06-15 — 修复 AdvancedFilterBar（G-3 复杂档）筛选行标签与控件未垂直居中对齐

**背景**：用户截图反馈「目标管理页面的筛选项没有居中对齐」——「计划周期」行（含一个 select + 一个 daterange）的标签明显偏上、与控件错位。

**根因**：`.adv-row` 用 `align-items:flex-start`（顶对齐），靠 `.adv-row-label { padding-top:5px }` 这个脉冲值 hack 去「凑」视觉居中。该 hack 只对单行 small 控件成立，一旦同行控件高度不一（daterange 比 select 高、或不同 size），标签就偏上错位。

**改了什么**：
- `dashboard-app/src/modules/AdvancedFilterBar.vue`：`.adv-row` 改 `align-items:center`（标签与控件真正垂直居中）；`.adv-row-label` 去掉 `padding-top:5px`，改 `line-height:var(--lh-14)`，居中交给 flex center。
- 同步 skill 知识：`L2-modules/G3-filter-bar.md` 设计要点 ③ + 自检清单、`interaction-patterns.md` 范式 D ② 均改为 `align-items:center` 正确写法，并加「别用 padding-top hack 凑居中」避坑提醒。

**为什么**：用 `align-items:center` 是治本——无论同行控件高度如何变化都自动垂直居中，不再依赖脆弱的固定 padding。

**影响范围**：`AdvancedFilterBar.vue`（复杂档筛选器，跨页复用）+ 3 个 skill reference 文档；不涉及 tokens.css。已浏览器截图验证目标管理页三行筛选项均垂直居中、无错位。

---

## 2026-06-15 — L3 易错点速查重构为 `L3-notes/` 目录（按组件拆分 + 从 L2 可达），建立「L2→L3 组件说明」检索动线

**背景**：用户对单文件 `L3-pitfalls.md` 提出改进——「这个 L3 后面可能会很多，我会说明一些组件的常见易错点和需要遵守的准则，希望能读到某个 L2 用了某个 L3，再进这个 L3 组件的说明文档里查看」。即要求精准检索链路：读 L2 → 知道它用了哪些 L3 → 跳进对应 L3 组件的独立说明文档。经 AskQuestion 确认：组织粒度 = per-component-file（一个 L3 组件一个 md），范围 = both（易错点 + 需遵守的准则，文档名从 pitfalls 改中性的 L3-notes）。

**改了什么**：
- **新增 `references/L3-notes/` 目录**，取代 `L2-modules/L3-pitfalls.md`（已删除）：
  - `L3-notes/mtd-tabs.md`：从旧文件迁移并扩充。结构 = 「准则（写之前先立规矩）」+「易错点」两区，收录 display:none 切换机制、含图表 pane 配合 useG2Chart、自动化点 `.mtd-tabs-item`、间距用 `--gap-module`，以及 mtd-tabs-nav top 上左间距叠加（修正原则 + 写法 A/B + 核对步骤）。
  - `L3-notes/README.md`：L3 说明总索引。含检索动线说明、「已有说明的 L3 组件」表、新增 L3 说明三步流程、命名约定（MTD 用标签名 `mtd-xxx.md`、G2 用 `g2-` 前缀）。
- **建立 L2/L1 → L3 的链接动线**：在「L3 实现」列对**有专属说明文件**的组件挂 markdown 链接（带链接 = 有坑/有准则）。已挂点：`SKILL.md` D-3 行、`D3-trend.md`、`L1-cockpit.md` Tabs 用法区，均指向 `L3-notes/mtd-tabs.md`。
- **更新 `SKILL.md`**：§2 L2 模块库加「L3 实现列带链接 = 有专属说明」引用块；§4.1 引导改为「写某个 L3 前先看 `L3-notes/<组件名>.md` 是否存在，更常见入口从 L2 走」；目录树去掉旧 L3-pitfalls、登记 `L3-notes/` 目录。

**为什么**：单文件随组件增多会膨胀且难定位；按组件拆分 + 从 L2「L3 实现」列挂链接，形成「读 L2 → 看它用了哪些 L3 → 带链接的点进去看准则与坑」的闭环，直接匹配用户检索诉求，且符合「一个组件一个事实源」的可维护性原则。

**影响范围**：仅文档（skill references + SKILL.md），不涉及 dashboard-app 代码与 tokens.css。

---

## 2026-06-15 — 新增「L3 易错点速查」reference（L3-pitfalls.md），首条收录 mtd-tabs-nav top padding 叠加

> ⚠️ 本条已被上方「L3 易错点速查重构为 `L3-notes/` 目录」取代：L3-pitfalls.md 已删除，内容迁移到 `references/L3-notes/mtd-tabs.md`。

**背景**：用户在做综合驾驶舱时发现 `mtd-tabs` 的 nav（`.mtd-tabs-nav`，top 位）自带上 padding，会叠加在外层 `.tabs-wrap` 的上 padding 之上，导致「视觉上间距 = 容器上 padding + nav 自带上 padding」> 「视觉左间距 = 仅容器左 padding」，破坏卡片上左等距。用户希望把这类「L3 组件用法对、但容易踩坑」的经验单独沉淀，并明确如何被自动读取。

**改了什么**：
- **新增 `references/L2-modules/L3-pitfalls.md`**：L3 原子组件避坑速查。定位说明（mtd-rag 查 API、查不出陷阱）+ 检索约定（按「组件名 + 症状关键词」便于 grep）+ 首条 pitfall：`mtd-tabs-nav top` 上左间距不一致（症状 / 根因 / 修正原则「容器上 padding + nav 上 padding = 左 padding」/ 写法 A（calc 抵扣）+ 写法 B（nav 归零、容器统一控）/ 核对步骤 / 通用心智「双层 padding 反推」）+ 末尾追加格式模板。
- **更新 `SKILL.md`**：§4.1 加「写 MTD/G2 组件前除 mtd-rag 外先 grep `L3-pitfalls.md` 核对易错点」强引导；目录树登记 `L3-pitfalls.md`。

**为什么**：mtd-rag 能给出组件 API，但给不出「这么写会踩坑」的经验。把易错点单列一个 reference（与 interaction-patterns「交互范式」、style-profile「视觉规范」定位区分），按组件名+症状关键词组织，既能被 SKILL.md 被动引导命中，也能被 grep 主动锚定，符合「一类知识一个 reference 文件」的组织原则。

**影响范围**：仅文档（skill reference + SKILL.md），不涉及 dashboard-app 代码与 tokens.css。

---

## 2026-06-15 — 综合驾驶舱升级为「数据丰富型大盘」：新增 D-9 多维图表合集（10+ AntV G2 图表）

**背景**：用户诉求「综合驾驶舱要尽量使用全部的 antv 可用图表，match 用户有很多数据并且需要可视化展示的场景」。原驾驶舱仅 D-7 气泡 + 环图，覆盖图表类型少。用户经 AskQuestion 确认：图表范围=按推荐清单全做（10+ 类）、布局=分组 Tab（趋势/构成/分布/关系）、沉淀=全部沉淀（skill + 学城）。

**改了什么**：
- **代码（事实源）**：`CockpitDashboard.vue` 重构为 G-3 筛选栏 + D-1 指标 + `mtd-tabs` 4 组（趋势/构成/分布/关系）+ D-4 明细表；新增 `mock/cockpit.ts` 10 套图表数据；新增 9 个图表组件（MultiLineChart/StackBarChart/GroupBarChart/TreemapChart/RoseChart/RadarChart/HeatmapChart/SankeyChart/WordCloudChart），全部基于 `ChartCard` + `useG2Chart`，颜色取自 chartTokens。
- **新增 `D9-multidim-charts.md`**：成体系收录 9 类 G2 高价值图表的「何时用 / G2 v5 关键写法 / 特殊数据结构踩坑」+ 选型速查表 + 自检。
- **重写 `L1-cockpit.md`**：从旧的「地图+环图」简版改为分组 Tab 富图表大盘版，含编排思路、12 图表类型表、MTD Tabs 用法与踩坑、生成要点。
- **更新 `g2-chart-foundation.md`**：补「G2 v5 图表类型清单 + 特殊数据结构速查」表（标注 treemap/sankey/雷达/词云 4 处⚠️数据结构与普通扁平数组不同）。
- **更新 `SKILL.md`**：D-n 模块表 + 单意图速查 + 整页组装表 + 内置模板清单 + §4.5 迁移数（6→15）+ 目录树，全部加入 D-9。
- **更新 `D-chart-card.md`**：迁移清单 6→15，新增 D-9 的 9 个组件表。

**为什么**：图表多时单屏堆砌会让信息过载，按数据语义分到 Tab（趋势/构成/分布/关系）才能让「用户数据多、需丰富可视化」的场景既全面又聚焦。把图表类型成体系沉淀（含 v5 特殊数据结构踩坑），后续复刻驾驶舱/大屏时可直接按 D-9 取用，避免在 treemap/sankey/雷达 的非常规 data 结构上反复踩坑。

**关键技术点（G2 v5 特殊数据结构，高频踩坑）**：
- **treemap**：`data:{value:{name:'root',children:items}}`，color/label 回调取 `d.data.name`（非 `d.name`）。
- **sankey**：`data:{value:{links:[{source,target,value}]}}`，节点自动从 links 推导，不传 nodes。
- **雷达**：无 `type:'radar'`；用 `type:'view'`+`coordinate:{type:'polar'}`+children[line,area,point]，`scale.x` 设 `padding:0.5,align:0`。
- **词云**：`encode.fontSize:{field:'value',range:[12,44]}` 做字号映射 + `layout.spiral:'archimedean'`。
- **MTD Tabs**：pane 用 display:none 切换（非 v-if），所有图表同时挂载；浏览器自动化切 Tab 须点 `.mtd-tabs-item`（本体）而非内层 `.mtd-tabs-item-label`，激活态 class `mtd-tab-active`。

**验证方式**：dev server（5188）浏览器实测，4 个 Tab × 10+ 图表逐一截图确认渲染正常，含数据结构特殊的 treemap（品类名+面积）/sankey（三层流向）/wordCloud（24 词螺旋）/radar（6 维 2 区域）/heatmap（6×7 单元格+数值+图例）。lint 全通过。验证完清理临时截图与 dev 日志。

**影响范围**：新增 `dashboard-app/src/modules/{MultiLineChart,StackBarChart,GroupBarChart,TreemapChart,RoseChart,RadarChart,HeatmapChart,SankeyChart,WordCloudChart}.vue`、`src/mock/cockpit.ts`（扩 10 套数据）、改 `src/pages/CockpitDashboard.vue`；skill 新增 `D9-multidim-charts.md`，改 `L1-cockpit.md`(重写) + `g2-chart-foundation.md` + `D-chart-card.md` + `SKILL.md` + 本 CHANGELOG。纯图表/数据扩展，不动样式 Token（tokens.css 与 style-profile.md 不变）。

---

## 2026-06-15 — 代码↔skill 一致性校准：D-1~D-7→D-1~D-8、导航 token 对齐代码、补 TemplateSwitcher 说明

**背景**：用户要求「看下代码里有什么没有同步到 skill 里的」。逐项 diff 后，本轮新功能（ChartCard 统一外壳、6 组件迁移、侧导 168px、D-8 漏斗、双轴/同环比变体、TemplateSwitcher）绝大部分已同步，仅剩三处「描述未跟上代码」的遗漏，本次校准。

**改了什么**：
- **编号范围 D-1~D-7 → D-1~D-8**：D-8 漏斗模块早已存在并有 `D8-funnel.md`，但范围描述仍停在 D-1~D-7。统一修正 `SKILL.md`（§开头模块编号体系 + §1 架构图）与 `style-profile.md`（§6.5）。
- **导航 token 数值对齐代码**：以 `tokens.css` 为准。`style-profile.md` 的 `--nav-header-height` 56px → 52px；`G-global.md` 的 `--nav-width` 200px → 168px（token 清单 + G-2 数值表 + 验收清单共 3 处）。
- **补 TemplateSwitcher 文档**：`G-global.md` 末尾新增「开发期辅助：TemplateSwitcher（dev-only，非业务模块）」段，说明它是开发期 5 套 L1 跳转浮层、不归入 G/D 编号、上线应隔离。

**为什么**：保持 skill 文档与代码事实源单向一致（以代码为准），避免后续按 skill 复刻时用到过期数值/范围。

**影响范围**：仅改 skill 文档 `SKILL.md` / `style-profile.md` / `G-global.md` / 本 CHANGELOG，**不动任何代码**。

---

## 2026-06-15 — 图表类 L2 统一为 ChartCard 单一外壳 + 侧导收窄 168px + 排序文案降序/升序 + 修进度条标签列写死字数 bug

**改了什么**

- **新建通用 `ChartCard.vue` 并迁移全部 6 个图表组件（核心交付）**：把原本各自独立的 6 个图表 .vue（TrendChart/AreaTrend/DonutChart/BubbleScatter/FunnelChart/DualAxisChart，结构同构 = `.dash-card` + 头部 + `useG2Chart`，仅图表 type 不同）统一到**一个外壳 `ChartCard`**。外壳负责卡片容器 + 头部（默认 `ChartHeader` 或 `#header` slot）+ 图表挂载点 + 内部 `useG2Chart(props.spec, props.deps)` 接线；调用方薄封装只写「筛选 ref + 筛选→数据 computed 联动 + `spec()`（返回 G2 spec，换 type 即换图表类型）」。简单头走默认 ChartHeader props(dimensions/granularities/filters + v-model)，复杂头（双轴双色图例、漏斗口径 Radio）走 `#header` slot。各组件的联动逻辑（维度缩放/周聚合/范围切片/阈值合并/TopN）全部保留。
- **侧导展开宽度 200px → 168px**：`tokens.css` 的 `--nav-width` 改 168px（早期 200 偏宽，子模块名多 2~4 字），宽度走 var 自动生效。
- **「子目标完成进度」排序文案 高→低/低→高 → 降序/升序**：`ProgressPanel.vue` 两个 `mtd-radio-button` 文案改直白表述，排序逻辑 `order==='desc'?b.rate-a.rate:a.rate-b.rate` 不变。
- **修进度条压住标签、无百分比的 bug**：`ProgressPanel.vue` 的 `.sub-name`（标签列）原写死 `width:2.2em`（注释假设子目标名均 2 字），目标管理页是 4 字名（闪购业务等）→ 溢出压住进度条、挤掉百分比；经营概览页因恰好 2 字名而正常（同一组件、不同数据）。修复为固定 `width:4.5em` + `overflow:hidden` + `text-overflow:ellipsis`，各行等宽保证进度条起点对齐。
- **沉淀 skill 文档**：新建 `L2-modules/D-chart-card.md`（图表模块统一范式：原则 + ChartCard API + 用法 A 默认头/B 自定义头 + 6 组件迁移表 + 自检）；`D3-trend.md`/`D7-distribution.md`/`D8-funnel.md` 顶部加 ChartCard 外壳引用；`D2-progress.md` 加「标签列宽禁按字数写死」踩坑 + 排序文案约定；`style-profile.md` 的 `--nav-width` 改 168px；`SKILL.md` 新增 §4.5 ChartCard 统一外壳 + 目录树加 D-chart-card.md。

**为什么**

- 用户三条诉求：①侧导展开太宽 → 收窄（经 AskQuestion 选 168px）；②「子目标完成进度」排序文案用降序/升序（经 AskQuestion 选「升序/降序」）；③异常监控「异常量趋势」与其他页图表模块复用排查，并主张「所有数据图表类模块都应是同一个 L2：标题+小筛选+图表，按用户意图判断图表类型」——经 AskQuestion 选「合并成 1 个通用 ChartCard，传 type 切换」+「ChartCard 管外壳+useG2Chart 接线，调用方传 spec(图表配置函数)+header」(spec_prop)；④目标管理进度条 bug，要求「小心地改」。

**关键技术点**

- ChartCard 范式 = 外壳/业务分离：外壳唯一（卡片+头部+图表接线），业务薄封装（筛选+联动+spec）。换图表类型 = 换 spec 里的 `type`，不另造外壳。
- 进度条/跨页复用列表的固定宽列要按**业务最长内容**预留 + `overflow:hidden/ellipsis` 兜底，**禁按当前页恰好字数写死**（这类 bug 只在另一页数据上暴露，正常页看不出，难排查）。

**验证方式**：`vue-tsc --noEmit` Exit 0；catdesk browser 逐页截图实测——/monitor(AreaTrend)、/marketing(漏斗 #header 口径 Radio + 双轴 #header 双色图例)、/cockpit(气泡+环图)、/overview/summary(line 趋势) 全部正常渲染无回归；/overview/summary 同时确认侧导 168px、排序文案降序/升序、进度条标签完整不压字+百分比 105/92/78/64% 正常。

**影响范围**：新增 `dashboard-app/src/modules/ChartCard.vue`，改 TrendChart/AreaTrend/DonutChart/BubbleScatter/FunnelChart/DualAxisChart.vue（迁移到 ChartCard）、ProgressPanel.vue（排序文案 + 进度条修复）、tokens.css（--nav-width 168）；skill 的 D-chart-card.md(新建) + D2/D3/D7/D8-*.md + style-profile.md + SKILL.md(§4.5+目录树) + 本 CHANGELOG。

---

## 2026-06-15 — G-3 筛选器升级为「简单/复杂」两档 + 造可复用复杂筛选器 AdvancedFilterBar + 沉淀 ResizeObserver/弹性列/marginRight 三条经验

**改了什么**

- **新建复杂筛选器组件 `AdvancedFilterBar.vue`（核心交付，真功能）**：对标真实业务后台「高级筛选」——多行、按业务域分组、每行 label + 多控件，右侧 查询/重置/快捷筛选(方案保存应用删除)/收起展开。**配置驱动**（接 `groups: FilterGroup[]`，field 支持 select/input/daterange/switch 四种 type）、**关注点分离**（组件只 v-model 吐扁平值对象，真过滤在父组件 computed）、**快捷方案真生效**（保存当前条件快照→应用回填+查询→删除）。
- **接入 `GoalDashboard.vue` 作真实范例**：三组配置（计划周期/目标信息/任务属性），`filteredRows = computed` 真过滤；扩 `mock/goal.ts`（GoalRow 加 dept/taskType/owner/reached，8 行，新增 goalFilterDicts）。浏览器实测：多行分组渲染✅、点「仅看已达标」8→3 行✅、保存方案→重置回 8 行→应用方案回 3 行闭环✅。
- **修 RankBar 横向条形右侧 label 裁切（⑨）**：加 `marginRight: 36`（数字）让出绘图右边距。曾误用 `inset:{right:36}`（对象形式，G2 v5 顶层不支持）把整个绘图区画没，已撤回并截图复验恢复正常。
- **沉淀 skill 文档（让生成结果≈手调结果）**：
  - `G3-filter-bar.md` 重写为**简单/复杂两档** + 意图判断口诀（维度≤5 简单、≥6 或出现「分组/方案/收起」升复杂）+ 复杂筛选器完整范式（FilterGroup/FilterField 配置 + 真过滤 + 快捷方案 + 收起，基于已跑通代码）。
  - `interaction-patterns.md` 加**范式 D**（复杂筛选器六要点 + 真实代码）+ Select/Input/DatePicker(daterange) 受控写法 API + 自检项。
  - 新建 `g2-chart-foundation.md`：**useG2Chart 封装 + ResizeObserver 自适应兜底**完整范式（解决侧栏折叠后图表歪掉），D-3/D-5 顶部引用它。
  - `D5-rank-bar.md` 加 **marginRight 踩坑**（数字 vs `inset` 对象 vs `overflow:hidden`）；`D4-table.md` 加 **table 弹性列撑满**（至少一列不设 width / minWidth 之和 < 容器宽）。
  - `SKILL.md` 同步：G-3 行改两档、§3.0 加两档选用说明、§4.3 范式列到 4 个、新增 §4.4 图表基座、目录树加 g2-chart-foundation.md。

**为什么**

- 用户诉求三条：①L2 通用筛选器要兼容复杂情况（附复杂业务筛选器截图），按用户意图在简单/复杂两档间切换并写进 md；②把本轮经验沉淀进 skill；③最终目标——别人用这个 skill 生成的页面「几乎和我手调的一样，比直接生成更美观更合规」。经 AskQuestion 明确选「项目里真造可复用组件并接入范例 + 沉淀进 skill」「三条经验全沉淀」。

**关键技术点**

- 复杂筛选器配置驱动：`groups[].fields[]` 按 `type` 分支渲染 mtd-select/mtd-input/mtd-date-picker/mtd-switch，统一 `:model-value` + `@update:model-value`；`onChange(key,value)` 集中 emit 成 `{[key]:value}`。
- 快捷方案：`schemes ref<Scheme[]>`，保存=push modelValue 快照，应用=emit update:modelValue + query，删除=filter。
- ResizeObserver 兜底：`autoFit` 仅响应 window resize；容器尺寸变化用 ResizeObserver + 防抖 `forceFit()`；卸载清理 ro/chart/timer。
- G2 横向条形右侧留白用 `marginRight`（数字），**禁用** `inset` 对象 / `overflow:hidden`。
- MTD table 撑满需保留弹性列（不设 width），minWidth 之和须 < 容器宽。

**验证方式**：vue-tsc --noEmit Exit 0；catdesk browser 截图实测复杂筛选器真过滤/快捷方案闭环/收起、RankBar marginRight 恢复正常；evaluate 定量核对行数。

**影响范围**：新增 `dashboard-app/src/modules/AdvancedFilterBar.vue`、重写 `src/pages/GoalDashboard.vue`、扩 `src/mock/goal.ts`、修 `src/modules/RankBar.vue`；skill 的 `G3-filter-bar.md`(重写) / `interaction-patterns.md` / 新增 `g2-chart-foundation.md` / `D5-rank-bar.md` / `D4-table.md` / `D3-trend.md` / `SKILL.md` / 本 CHANGELOG。

---

## 2026-06-15 — 顶导/侧导按附件规范逐像素重做 + 折叠态间距对齐 + 沉淀「100% 可复刻」G-global 文档

**改了什么**

- **顶导（DashboardLayout.vue）严格对齐设计附件**：顶栏 52px、tab 间距 24、tab 区距 Logo 32、操作图标 20px；选中态改为「**深灰字（非蓝）+ 2px 主色底线**」（之前误做成整字变蓝已纠正），hover 仅文字加深、去掉 `<a>` 默认下划线。
- **侧导菜单间距收窄+对称**：定位到 MTD `.mtd-menu / .mtd-menu-item / .mtd-menu-item-title` **三层 padding 叠加**导致图标距边缘深达 32px，且 icon `margin-right` 与 title `gap` 重复。修法：`.mtd-menu` padding 归零、item 只控一道 8px 内缩、icon `margin:0`。高亮块最终距左右边缘各 8px。
- **折叠态与展开态间距完全一致**：折叠态 item 内缩同样改为 8px（之前折叠态铺满整条），title 改为居中、隐藏文字让 icon 在内缩后的高亮块里居中；并修复折叠态 icon 太淡/被裁切（加深为 text-2、`margin:0`、`font-size:20`）。底部折叠按钮 icon 改深色 text-1 提升辨识度。
- **tokens.css 导航 token 区重写**：新增/校正 `--nav-header-height:52px`、`--nav-collapsed-width:60px`（MTD 原生折叠宽，非附件 React demo 的 56）、`--nav-tab-gap:24`、`--nav-tab-offset:32`、`--nav-icon-size:20`，并把附件色值映射到项目灰阶 token（常态→text-2、选中字→text-1、底线/侧导高亮→color-brand-blue）。
- **沉淀 skill 文档（核心交付）**：重写 `L2-modules/G-global.md` 为「**别人照抄能 100% 复刻**」的 Vue 规范——含复刻须知+避坑、导航 token 清单（确切值）、顶导/侧导确切数值表、完整 `DashboardLayout.vue`（template+script collapsed/matchMedia+全部 scoped `:deep()` 样式）可直接复制、两态间距一致强约束、逐项验收清单 + catdesk evaluate 实测基线（item height=44、首三项 top=60/104/148、项间距=0）。

**为什么**

- 用户反馈链：「样式没和新 md 一致」→「折叠态咋又被改没了」→「menu 间距太大且上下不一样」→「折叠态和展开态间距应一样 + 把样式同步进 skill 要求 100% 复刻」。附件是 React 规范文档、本项目是 Vue3，故合并 = 把附件实测数值与视觉意图落到 Vue 实现 + 用项目 token 映射色值。

**关键技术点**

- MTD Vue3 `mtd-sidebar` 原生折叠：`v-model:collapse` + `expand-type="partial"` + `collapse-button-position="bottom"` + `hidden-header`，原生折叠宽 **60px**。
- flex 容器内侧栏控宽用 `flex:0 0 var(--nav-width)` + `min-width:0`（单写 width 会被 min-width:auto 撑回内容宽，折叠压不下去）。
- 选中底线用 `::after` 2px 主色条（非 text-decoration）。

**数值/方式来源**：附件数值 + 浏览器逐像素截图实测；间距用 catdesk evaluate 取真值核对（展开/折叠两态一致）；DashboardLayout.vue / tokens.css lint 0 错误。

**影响范围**：`dashboard-app/src/layout/DashboardLayout.vue` + `src/styles/tokens.css`；skill 的 `references/L2-modules/G-global.md`(重写) + 本 CHANGELOG。

---

## 2026-06-15 — 补齐 3 个高性价比模块（漏斗/双轴/同环比对比）+ 接入营销运营页 + 沉淀 D8 文档

**改了什么**

- **新增 3 个 L2 模块（真功能）**：① `FunnelChart.vue`（D-8 转化漏斗，G2 `shape:'funnel'` + `symmetryY` + `transpose`，头部 Radio 切口径「绝对值/整体转化/单步转化」真换标签计算）、② `DualAxisChart.vue`（D-3 双轴变体，G2 `type:'view'` 柱+线组合、左右双 Y 轴、自绘双色图例）、③ `CompareCards.vue`（D-1 同环比变体，纯 MTD 卡片，同比+环比双胶囊并排、涨跌色复用 D-1）。
- **接入营销运营页**：重写 `MarketingDashboard.vue` 编排为 筛选(G-3) → 指标卡(D-1) → 同环比对比(CompareCards) → 漏斗 + 双轴并排(各 span12) → 经营建议(ActionCards) → 排名(RankBar)。语义贴切：漏斗=转化链路、双轴=投放 ROI。`mock/marketing.ts` 追加 `conversionFunnel / costRoiTrend / compareMetrics` 三组数据 + 类型。
- **沉淀 skill 文档**：新建 `L2-modules/D8-funnel.md`（漏斗六段式 + 含 D-3 双轴变体、D-1 同环比变体的完整 G2 Spec）；`D3-trend.md` / `D1-metric-cards.md` 各加变体段指向 D8；`SKILL.md` 模块表加 D-8 行 + 「同模块变体」说明 + §3.1 速查 + §3.2 营销编排 + §6 营销模板 + 目录树（7类→8类）。

**为什么**

- 用户「补上吧，然后根据用户意图你找个最适合的 l1 页面补上」，承接上一轮覆盖度评估出的 3 个高性价比缺口。延续偏好：全做 / 严格用 MTD 原生（mtd-rag 核验）/ 真功能 / 沉淀进 skill。

**关键技术点**

- **漏斗量级悬殊**：曝光千万 vs 支付几万直接映射面积会令尾段不可见，解法是绘图值开方 `draw:Math.sqrt(value)` 压缩，标签/tooltip 仍显真实值。
- **双轴串色修复**：多 child 用 `encode.color` 单色 range 会串色，改用 `style.fill`/`style.stroke` 固定单色（柱蓝 palette[0] / 线橙 palette[2]）；双 Y 轴靠折线 child `scale.y.independent:true`。

**数值/方式来源**：MTD 用法经 mtd-rag 核验；G2 写法经浏览器实测 3 canvas 渲染正常；`vue-tsc --noEmit` 0 错误。

**影响范围**：`dashboard-app` 的 FunnelChart/DualAxisChart/CompareCards.vue + MarketingDashboard.vue + mock/marketing.ts；skill 的 D8-funnel.md(新建) + D3-trend.md + D1-metric-cards.md + SKILL.md。

**浏览器实测（2026-06-15，/marketing）**：3 图表 canvas 渲染、文本正确；漏斗切口径真换标签；双轴柱蓝线橙、左右双轴；漏斗五层清晰可见（开方修复后）；vue-tsc 0 错误。

---

## 2026-06-15 — 经营概览复用三模块 + 同一行卡片等高对齐（治本）+ 沉淀两条设计规范

**改了什么**

- **OverviewDashboard.vue 新增三个跨页复用 L2 模块（真功能）**：在原「趋势 + 排名」行下方追加 ① `ProgressPanel`（本月 GMV 目标达成环形 + 子目标完成进度条，复用自目标页）、② `ActionCards`（三张经营建议卡，复用自营销页）、③ `DataTable`「分业务线经营明细」（GMV/订单量可排序 + 行操作 查看明细/下钻分析/移除 + Popconfirm 二次确认 + loading，复用自目标/监控页）。行操作走可变 `ref([...lineRows])` + `splice` 真删除、重置 `[...lineRows]` 真恢复；`mock/overview.ts` 追加 `monthTarget / subTargets / overviewActions / lineRows` 四块数据。
- **同一行卡片等高对齐机制（tokens.css，治本修复）**：原「本月 GMV 目标达成」环形卡与「子目标完成进度」进度条卡顶边对齐但底边差 28px。根因——MTD `mtd-row` 默认是 `block + float` 栅格，`align-items` 不生效。修复：`.content .mtd-row` 显式改 `display:flex; flex-wrap:wrap; align-items:stretch`，并 `.content .mtd-row > [class*='mtd-col'] > .dash-card { height:100% }` 让矮卡自动撑高等高。`ProgressPanel.vue` 移除 `min-height:220px` 硬凑，环形改 `flex:1` 居中。修复后两卡均 252px、4 宫格指标卡仍等宽、其余 4 页 overflowRows:0 无副作用。
- **沉淀两条设计规范**：① `style-profile.md` 新增 §6.9「同一行卡片对齐/等高原则」(顶边对齐 + 等高、MTD row block 踩坑、内置 flex 机制、禁用 min-height、自检) 并在自检清单加一条；② `L2-modules/D4-table.md` 新增「同一模块·不同表达(preset)」段落，用对照表讲清「分业务线经营明细」与「异常明细」是**同一个 D-4 DataTable 模块**，差异（序号列 / sortable / rowActions / status Tag 列 vs rate 进度条列 / selectable）全由 props 配置，不拆成两个模块。

**为什么**

- 用户先要求「在经营概览下面多加几个模块，可以是其他页面也用过的」→ 复用跨页 L2 模块。再指出「有几个模块没有对齐…你的基础设计规范里面应该规定这些」+「分业务线经营明细应该和异常明细是一个模块但有细微表达差异」→ 修对齐 + 把对齐规则和「同模块差异」原则写进规范。延续偏好：全做 / 严格用 MTD 原生 / 真功能 / 沉淀进 skill。

**数值/方式来源**：复用模块 props 沿用各页已核验用法；等高机制经浏览器 evaluate 实测（progressEqual:true、两卡 252px、4 页 overflowRows:0）；`vue-tsc --noEmit` 0 错误。

**影响范围**：`dashboard-app` 的 OverviewDashboard.vue + ProgressPanel.vue + tokens.css + overview.ts；skill 的 style-profile.md(§6.9 + 自检) + D4-table.md(同模块差异段)。

**浏览器实测（2026-06-15，/overview/summary）**：三模块渲染正常；行操作「更多 → 移除 → Popconfirm『确认移除「到店」业务线？』→ 确定」真删 4→3 行、重置恢复 4 行；两卡等高底边齐平；vue-tsc 0 错误。

---

## 2026-06-12 — 组件丰富度升级：模块内引入交互组件（真功能 + 用户习惯选型）+ 沉淀交互范式文档

**改了什么**

- **DataTable.vue 可交互升级（D-4 真功能）**：新增列排序(`sortable` + computed `sortedRows` 真排序，数字按 number 比、字符串 `localeCompare('zh')`)、分页(`mtd-pagination` 真翻页，computed `pagedRows` 切片，`watch rows` 回第一页)、行选择(`type="selection"` + 头部「已选 N 条/取消选择」+ emit `selection-change`)、行操作列(单操作出按钮、多操作收进「更多」Dropdown、危险操作用 Popconfirm 二次确认)、空态(`mtd-empty`)、加载态(`mtd-loading` 包裹)。全部走**可选 props**（pageSize/selectable/rowActions/loading/emptyText），仅传 title/columns/rows 仍可用（向后兼容）。新增 `Column.sortable/align`、`RowAction` 接口。
- **ChartHeader.vue 新建 + TrendChart.vue 头部联动（D-3）**：抽出可复用图表头部 L3——标题 + 口径 Tooltip(`question-circle-o` hover) + 维度 Dropdown(选项多) + 时间粒度 RadioButton(line，选项少平铺)，emit `update:dimension/granularity` 支持 v-model。TrendChart 接入后**真换数据**：维度(GMV/订单量/客单价)按系数缩放、时间粒度(日/周)按每 3 天聚合求和，靠 `useG2Chart(deps)` 重渲染。
- **CockpitDashboard.vue 筛选栏真过滤（G-3）**：快捷时间段 RadioButton(近7天/近30天/自定义，自定义才出 DatePicker) + 区域/维度 Select(clearable) + 「仅看正增长」Switch + 查询/重置；`filteredRows = computed(rows.filter(命中所有条件))` 真过滤，表格绑 `:rows="filteredRows"`；查询 loading + `Message.success`、重置 + `Message.info`。同时给该页表格接上 rowActions(查看/下钻/移除-移除带 confirm) + selectable + tableLoading。
- **MetricCards.vue 指标卡升级（D-1）**：标题旁加口径说明 Tooltip(`question-circle-o`，仅 `m.tip` 存在才显示，不占布局)；趋势标识改胶囊(pill)——涨 `#00875a`/淡绿底、跌 `#d83931`/淡红底。`mock/overview.ts` 的 Metric 接口加可选 `tip?: string` 并补 4 个指标口径文案。
- **新增 skill 文档 `references/interaction-patterns.md`**：沉淀经 mtd-rag(`--target=mtd-vue --mtd-version=1.3.5`)核验的交互组件真实 API（Switch/Radio/Dropdown/Tooltip/Pagination/Table 排序筛选选择展开/Popconfirm/Empty/Loading/Message）+ **习惯选型决策**（少选项平铺 Radio、多选项下拉、说明 Tooltip、危险操作才 Popconfirm、布尔筛选 Switch）+ 3 个可套用范式(ChartHeader/DataTable/真过滤筛选栏)。`SKILL.md` 新增 §4.3 注册并入目录结构图；`D1/D3/D4/G3` 各加「交互升级」段落指向该文档。

**为什么**

- 用户要求「加大难度，模块内需要用到更多的组件，但使用需要符合用户使用习惯」。经 AskQuestion 明确：范围=全做(表格+图表+筛选栏+指标卡)、习惯=严格用 MTD 原生组件 + 推荐用法(经 mtd-rag 核验，不自造)、深度=真功能(分页真翻页/排序真排序/筛选真过滤/选择真联动)、文档=沉淀进 skill。

**数值/方式来源**：全部交互组件 API 经 `mtd-rag query_components_direct --target=mtd-vue --mtd-version=1.3.5` 核验（Switch/Tabs/Radio/Empty/Loading/Table sortable+filters+selection+expand/Pagination/Dropdown/Tooltip/Popconfirm）；`Message` 经 `node -e` 验证为 `@ss/mtd-vue3` 具名导出。`vue-tsc --noEmit` 全程 0 错误。

**影响范围**：`dashboard-app` 的 DataTable/ChartHeader/TrendChart/MetricCards 模块 + CockpitDashboard 页 + overview.ts/cockpit.ts mock；skill 新增 interaction-patterns.md + SKILL.md §4.3/目录图 + D1/D3/D4/G3 交互升级段。

**浏览器实测（2026-06-12，/cockpit + /overview/summary）**：

- ✅ 列排序真功能：GMV 从 bug 字符串序「1.5/12.4/3.6…」修复为数值序「1.5/3.6/4.8/7.2/9.1/12.4」（升降序均正确）；门店数「960→3860」千分位数值序正确。
- ✅ 行选择联动：全选出「已选 6 项」提示条，点「取消选择」清空。
- ✅ 行操作 Popconfirm：「更多」下拉→「移除」弹「确认移除「华东」的明细？」（`{name}` 占位正确替换）→点确定行数 6→5、华东消失（真删除）。
- ✅ 重置恢复：被移除的行随重置回到 6 行。
- ✅ Switch「仅看正增长」真过滤：6 行→4 行，负增长（西南-2.2%/东北-4.1%）被滤除。
- ✅ 查询：loading 态出现 + `Message`「查询完成」。
- ✅ 指标卡：4 张 Tooltip 图标渲染、hover 出口径文案、趋势胶囊涨绿跌红。
- ✅ 趋势图：维度 Dropdown + 粒度 RadioButton(日/周)切换选中态、双线图重绘。

**本轮验证暴露并修复的 3 个真功能 bug**：

1. **GMV 字符串排序**：值是 "12.4 亿" 被按字符串排（"1.5"<"12.4"）。修：`DataTable.vue` 加 `toNumber()` 提取数字 + MTD 原生 `:sort-method` 数值比较（弃用臆造的 `sortable="custom"`，mtd-rag 证实 MTD 排序为 `sortable` 布尔 + `:sort-method` 比较函数）。
2. **Popconfirm 点确定无反应**：误用 `:title` + `@confirm`，MTD 1.3.5 实际是 **`message` + `@ok`**（mtd-rag 核验），事件没监听导致弹窗能弹但确认无效。修：两处 Popconfirm 改 `message` + `placement="top"` + `@ok`。
3. **移除是假功能**：`onRowAction` 的 remove 只 `Message.success` 不删数据。修：`CockpitDashboard.vue` 改用可变 `tableRows = ref([...regionRows])`，remove 真 `splice`，重置 `[...regionRows]` 恢复；并给 `cockpit.ts` 4 个指标补 `tip` 让 Tooltip 渲染。

> 这 3 个 bug 的正确用法 + 防踩坑要点已同步进 `interaction-patterns.md`（Popconfirm 踩坑警示 + 自检清单新增 4 条）。

**同步状态**：✅ DataTable/ChartHeader/TrendChart/MetricCards.vue ✅ CockpitDashboard.vue ✅ overview.ts/cockpit.ts ✅ interaction-patterns.md(新建+踩坑警示+自检4条) ✅ SKILL.md(§4.3 + 目录图) ✅ D1/D3/D4/G3-*.md(交互升级段) ✅ CHANGELOG（本条） ✅ 浏览器逐项实测通过（含 3 个 bug 修复复测） ✅ vue-tsc 0 错误

---

## 2026-06-12 — 日历回填修复 + 表格状态 Tag 改用 MTD + 盒模型边距四向一致

**改了什么**

- **C1 日期选择器回填修复（5 页）**：`OverviewDashboard.vue` / `MarketingDashboard.vue` / `MonitorDashboard.vue` / `CockpitDashboard.vue` 的 `<mtd-date-picker>` 此前**缺 `v-model`**，选完日期无处回填 → 输入框只显示占位符（截图 bug）。统一补 `v-model="dateRange"`（daterange/datetimerange 绑数组 `ref<Date[]>([])`）+ 双段 `:placeholder`（开始/结束）+ 固定宽度。已用浏览器实测：选日期后输入框正确显示 `2026-06-20 00:00:00`。
- **C2 表格状态列改用 MTD Tag**：`DataTable.vue` 状态列由自定义 `<span class="tag" :style>` 改为 `<mtd-tag :theme :type size="small" rounded>`。受限于 mtd-tag `theme` 仅 `gray/blue/green/red/purple` 5 预设色（无橙/黄），告警态原橙色用「红色 + 线型(ghost)」表达弱一级警示，异常态用「红色 + 面型(pure)」表达最强警示，以 **type 维度（面型/线型）区分严重程度梯度**，正常=green、待处理=gray。`mock/monitor.ts` 的 `statusMeta` 同时保留 `color`（供 D-1 StatusCards 强调条/数值色，非 Tag 场景）与新增 `theme/type`（供 Tag）。
- **C3 盒模型边距四向一致（5 页 + 原则入库）**：所有页面 `.filter-bar` 的 `padding: var(--gap-elem) var(--gap-module)`（上下8/左右16，不一致）改为单值 `padding: var(--gap-module)`（四向 16）。新增 **style-profile §3「盒模型边距一致（硬性规则）」**：同一容器 padding 上下左右必须四向一致，写单值，禁止两值写法（除非刻意的横向工具条呼吸感），与「卡片内边距 16」配套。

**为什么**

- 用户反馈：①日历选完不显示值（提供了 bug 截图）；②表格里的 tag 应该用 MTD 组件而非自定义 span；③提出设计原则——一个盒模型内上下左右边距不出意外应一致，当前筛选 L2 模块违反。

**数值/方式来源**：MTD 真实 API 经 `mtd-rag --target=mtd-vue --mtd-version=1.3.5` 核验（DatePicker daterange 需 v-model 绑数组；Tag theme 仅 5 预设色）。浏览器实测 /monitor：日历回填 `2026-06-20 00:00:00`、状态列为 mtd-tag（异常红面型/告警红线型/待处理灰）、筛选栏四向边距一致。

**影响范围**：5 套看板页面的 filter-bar（C1+C3）+ `DataTable.vue`、`mock/monitor.ts`（C2）；skill `style-profile.md §3`（盒模型边距原则）。已浏览器验证（monitor 页全图 + 筛选栏回填图）。

---

## 2026-06-12 — 装饰一致性禁令 + 临时漂浮模板切换组件 + 补齐 4 套页面模板/7 个 D-n 模块 + skill 按需选模块决策升级

**改了什么**

- **B1 装饰一致性禁令（去 border/box-shadow，灰底白卡）**：`tokens.css` 的 `.dash-card` 去掉 `border` 与 `box-shadow`，仅保留 `--bg-card` 白底 + `--radius-3` 圆角；`--shadow-card` 用途注释改为「仅浮层/弹窗/下拉/临时切换组件」。`OverviewDashboard.vue` 及 4 套新页面的 `.filter-bar` 去掉 `border: 1px solid var(--divider)`，统一为白底+圆角无描边无阴影。新增 **style-profile §6.8 装饰一致性原则**（硬性规则 + 三选一装饰表 + 自检），同步 §0/§5/§7/§8。
- **B2 临时漂浮模板切换组件**：新增 `components/TemplateSwitcher.vue`（dev-only 右下角固定浮层）——折叠态圆形 FAB（`menus-o` 图标），展开态列出 5 个 L1 模板入口（overview/marketing/monitor/goal/cockpit），用 `useRoute/useRouter` 跳转、按业务域前缀高亮当前页；浮层用 `--shadow-card/--shadow-mid`（符合 §6.8 浮层例外）。挂载到 `App.vue` 全局。
- **B3 补齐 4 套页面模板 + 7 个 D-n 模块 + mock + 路由/domains**：
  - 新页面：`MarketingDashboard.vue`（G-3+D-1漏斗+D-6+D-5）、`MonitorDashboard.vue`（G-3+D-1状态变体+D-3 area+D-4 status）、`GoalDashboard.vue`（G-3+D-2+D-4 rate）、`CockpitDashboard.vue`（G-3+D-1+D-7气泡+D-7环图+D-4 delta）。
  - 新模块：`StatusCards.vue`(D-1状态变体)、`AreaTrend.vue`(D-3面积)、`DataTable.vue`(D-4通用表格，Column 支持 status/rate/delta 三类渲染)、`ActionCards.vue`(D-6)、`ProgressPanel.vue`(D-2)、`BubbleScatter.vue`(D-7气泡)、`DonutChart.vue`(D-7环图)；`RankBar.vue` 新增可选 `title` prop。
  - 新 mock：`marketing.ts`/`monitor.ts`/`goal.ts`/`cockpit.ts`。`router/index.ts` 接入 4 页，`DashboardLayout.vue` domains 新增 goal/cockpit 两个纯顶导业务域。
- **B4 skill 按需选模块决策升级**：`SKILL.md §3` 由扁平「关键词→D-n」表升级为**两类场景决策框架**——§3.1 单意图速查（强调按数据形态而非字面词，D-5 vs D-7 区分）、§3.2「场景 A 生成整页」（先命中 §6 内置模板，否则按「概览→趋势→结构→明细/行动」信息递进组装 3~5 个 D-n）、§3.3「场景 B 在已有页加模块」（读懂现状→查重互补→按递进层级插入单个模块）。同步 §6 五套模板编排描述与实现对齐、§7 工作流加「判场景」步骤。

**为什么**

- 用户反馈：①禁止同层级模块装饰不一致（GMV/门店卡用阴影、筛选栏用描边）——灰底下阴影和描边都不该用，无边框无描边即可；②需要一个临时漂浮组件用于切换到其他页面模板；③按之前分析的用户需求把其他页面模板都生成出来、对照 skill 把各模板的 L2 编排重新整理好，UI 保持一致性；④用户可能生成整页、也可能要求加模块，需在 skill 里针对这两类场景帮用户分析什么 L2 模块符合需求。

**数值/方式来源**：浏览器实测 5 个页面（http://localhost:5188 的 /overview /marketing /monitor /goal /cockpit）逐页截图确认——所有同层级白底模块均无 border 无 box-shadow（仅白底+圆角）；浮层折叠/展开+跨页切换正常；G2 图表（折线/条形/面积/环形/气泡）与 MTD 表格（status/rate/delta 列）均正确渲染；`window` 无 Vite error overlay。

**影响范围**：全部 5 套看板页面 + 7 个新 L2 模块组件 + 全局浮层 + 路由/导航；skill 的 §3 选模块决策层 + §6/§7。已浏览器验证（5 页截图）。

**同步状态**：✅ tokens.css(.dash-card 去边框阴影 + shadow 注释) ✅ 4 新页面 + 7 新模块 + RankBar/DataTable 增强 + 4 mock + router + DashboardLayout(domains) + TemplateSwitcher + App.vue ✅ style-profile.md(§6.8 装饰一致性 + §0/§5/§7/§8) ✅ SKILL.md(§3 两类场景决策 + §6/§7) ✅ CHANGELOG（本条）

---

## 2026-06-12 — 模块编号体系 G/D-n 重构 + logo 方块占位 + 边距 token 收敛到 3 个 + 两块间距统一 16

**改了什么**
- **模块编号体系（skill 文档全量重构）**：顶导/侧导/筛选栏归为 **G 通用模块**（G-1 顶导 / G-2 侧导 / G-3 筛选栏）；看板独有数据模块由 T1-T7 改为 **D-1~D-7**。涉及 `SKILL.md`、5 套 `L1-templates/*.md`、`L2-modules/` 全部文件（`T1~T7→D1~D7`、`N-filter-bar→G3-filter-bar` 重命名 + 标题/描述同步）、`G-global.md`、`style-profile.md §6.5`。
- **logo 方块占位**：`DashboardLayout.vue` G-1 顶导左侧新增 `.logo-mark`——28×28 正方形、`--color-brand-blue` 主题色实心块、`--radius-4` 圆角，暂代 logo（后续接入真图不抽动），与产品名间距 `--gap-elem`。
- **边距 token 收敛到 3 个**：`tokens.css` 原 6 个语义边距（gap-elem/gap-module/gutter/pad-page/pad-card/pad-card-y）收敛为 **3 个**——`--gap-elem`(8) / `--gap-module`(16，模块间距+gutter+卡片内边距) / `--gap-page`(16，外缘留白+侧栏内缩)。`--space-*` 降级为底层调色板（业务代码不直接引用）。同步改 `.dash-card`/`.dash-title`/`.content .mtd-row` 及 `OverviewDashboard.vue` 筛选栏、`DashboardLayout.vue` 各处间距引用。
- **两块间距统一 16**：内容区 padding 由 `--pad-page`(24) → `--gap-page`(16)；侧栏菜单项内缩由 `--space-3`(12) → `--gap-page`(16)，右侧 `calc(--gap-page - 1px)` 扣掉侧栏 1px border。

**为什么**
- 用户反馈：①顶导/侧导/筛选栏应归为 G 通用模块、看板独有模块用 D-n 而非 T；②顶导左侧应留方形 logo 占位（无图用主题色方块）；③全局边距 token 应 ≤3；④截图箭头指的两块间距（侧栏高亮块→内容、内容→筛选栏）应一致、字号也一致。
- 实测定位：改前两块间距 13px(12 内缩+1 border) vs 24px(pad-page) 不一致 → 统一到 16。

**数值/方式来源**：浏览器实读 getBoundingClientRect——修后 gap_active_to_content=16 / gap_content_to_filter=16（精确相等），domainFs=sideFs=14px，logoMark=28×28；截图确认 logo 主题色方块已渲染。

**影响范围**：全局框架（顶导/侧导/内容区）+ 全部看板页面的边距体系；skill 模块编号文档全量。已浏览器验证 + 截图确认。

**同步状态**：✅ tokens.css(3 边距 token + dash-card/dash-title/mtd-row) ✅ DashboardLayout.vue(logo 方块 + 间距统一) ✅ OverviewDashboard.vue(筛选栏边距) ✅ style-profile.md(§3 边距 3-token+一致性 / §6.5 G编号体系+logo占位+G-3 / §7-8) ✅ SKILL.md + L1×5 + L2 全量(G/D-n) ✅ CHANGELOG（本条）

---

## 2026-06-12 — 面板对齐与间距层次修正（Row gutter 抵消 + 外缘留白）

**改了什么**
- `tokens.css`：新增 `--gutter`(16，= 模块间距，横纵一致) 与 `--pad-page`(24，页面外缘留白) 两个语义 token；新增通用规则 `.content .mtd-row { margin: 0 calc(var(--gutter)/-2) }` 抵消 MTD col 的 gutter padding。
- `dashboard-app/src/layout/DashboardLayout.vue`：内容区 `.content` padding 由 `--space-4`(16) 改为 `--pad-page`(24)。

**为什么**
- 用户反馈：①筛选栏与下方卡片两侧不对齐；②间距相差过大。
- 实测定位：①MTD `mtd-row` 只给 col 加 8px 左右 padding 却不在 row 上加负 margin → 卡片/图表比筛选栏两侧各内缩 8px（filterLeft=216 vs cardLeft=224）；②外缘留白(16)与模块间距(16)同值、无层次。

**数值/方式来源**：浏览器实读 getBoundingClientRect 对齐校验（修后 alignLeftDiff=0 / alignRightDiff=0，卡片与筛选栏 left=224/right=942 完全对齐）。

**影响范围**：所有用 `mtd-row` 的看板内容区（指标卡组、图表分栏等）。已浏览器验证（1440×900）+ 截图确认。

**同步状态**：✅ tokens.css(--gutter/--pad-page/.content .mtd-row) ✅ DashboardLayout.vue ✅ style-profile.md(§3 间距层次 + Row gutter 对齐修正) ✅ CHANGELOG（本条）

---

## 2026-06-12 — 侧导选中态改为「内缩悬浮高亮块」（去掉贴边生硬留白）

**改了什么**
- `dashboard-app/src/layout/DashboardLayout.vue` 侧导 `:deep()` 样式：
  - 高亮背景从 `.mtd-menu-item`（<li>）移到 `.mtd-menu-item-title`（<a>）：`<li>` 设 `background:transparent !important; padding: 2px var(--space-3) !important`（形成内缩区），`<a>` 设 `width:100%; box-sizing:border-box; margin:0 !important; border-radius: var(--radius-3)`。
  - hover/选中底块改挂在 `.mtd-menu-item-title`（及其 `:hover`/`.is-active`/`.router-link-active`），用 `--nav-hover-bg`/`--nav-active-bg`。
  - 结果：选中浅蓝块左右各内缩约 12px、带 6px 圆角，成为独立悬浮色块，不再顶死侧栏左边缘。

**为什么**
- 用户截图标注：选中项浅蓝高亮块贴死侧栏左边缘（红框处），显得生硬。实测发现底块原本从 x=0 顶满到 x=199，并非真有边距 → 改为内缩悬浮块。

**数值/方式来源**：浏览器实读 computed style + 左右 gap 校验（leftGap≈12px / rightGap≈13px，圆角 6px，无溢出）。

**影响范围**：全局框架侧栏（所有有侧导的业务域页）。已浏览器验证（1440×900）+ 截图确认。

**同步状态**：✅ DashboardLayout.vue ✅ style-profile.md(§6.5 G-2「内缩悬浮高亮块」必做条) ✅ CHANGELOG（本条）

---

## 2026-06-12 — 侧导间距修正（去顶部空白 + 加大左内边距）

**改了什么**
- `dashboard-app/src/layout/DashboardLayout.vue` 侧导 `:deep()` 样式：
  - `:deep(.mtd-sidebar-header){ display:none }`：隐藏 MTD Sidebar 默认的顶部 header（约 56px，供 logo/折叠按钮用），消除首个菜单项上方的大段空白；`.mtd-sidebar-menus` 设 `margin-top:0; padding-top: var(--space-2)`。
  - `.mtd-menu-item-title` 用 `padding-left: var(--space-5) !important`（20px）覆写组件内联的 4px padding，图标不再贴左边。

**为什么**
- 用户反馈：左侧导「离上面有很大间距、离左侧间距有点小」。浏览器实测定位到 = `.mtd-sidebar-header` 撑出 56px 空白 + title 内联 padding 仅 4px。

**数值/方式来源**：浏览器实读 DOM 结构与 computed style（`.mtd-sidebar` 子结构 = header + menus；title 内联 padding-left=4px）。

**影响范围**：全局框架侧栏（所有有侧导的业务域页）。已浏览器验证（1440×900）：首项 gapTop 60px→12px、图标 left 4px→20px、截图视觉协调。

**同步状态**：✅ DashboardLayout.vue ✅ style-profile.md(§6.5 G-2 两条必做修正) ✅ CHANGELOG（本条）

---

## 2026-06-12 — 顶导+侧导双层导航改造（业务域顶导 + 域内子模块侧导）

**改了什么**
- `dashboard-app/src/router/index.ts`：路由重构为「业务域 → 域内子模块」两层。`overview` 域拆出 7 个子路由（summary/trade/user/product/channel/store/retention），`marketing`、`monitor` 作为独立纯顶导域；根路径 `redirect → /overview/summary`。
- `dashboard-app/src/layout/DashboardLayout.vue`：
  - **顶导**＝全局业务域切换（经营概览 / 营销运营 / 异常监控），`router-link` + `.is-active` + 2px 蓝色下划线（`::after`）；右侧功能区 search / bell-o 图标 + 用户头像。
  - **侧导**＝当前业务域内部子模块 tab，由 `domains[current].children` 经 `computed` 得出；`currentDomain = route.path.split('/')[1]`；纯顶导域（children 为空）不渲染侧栏（`v-if="sideMenus.length"`）。
  - 数据模型：`domains: { key, title, entry, children[] }[]`。
- **侧导内容修正**（按用户 Q4）：左侧导不再放「页面模板」（经营概览/异常监控/目标管理/营销运营/综合驾驶舱），而是模拟「经营概览」业务场景下应有的左 tab：经营总览/交易分析/用户分析/商品分析/渠道分析/门店分析/留存分析。
- 图标统一 `-o` 线性风格并核验存在：home-o / barschart-o / avatar-o / cart-o / share-o / location-o / areachart-o（`user-o`/`shopping-o`/`line-chart` 不存在，已分别换为 avatar-o/cart-o/areachart-o）。

**为什么**
- 用户 Q4：左侧导应是「经营面板场景下的左 tab」而非页面模板切换。
- 用户 Q5：顶导是重要全局 L2 组件，需按场景判断 顶+侧 / 仅侧 / 仅顶；本项目为多业务域、每域含子模块的大型后台 → 选「顶导+侧导」。

**数值/方式来源**：MTD3.0《全局导航 Global Navigation》文档 https://km.sankuai.com/page/1107111043 （经 citadel `fetchImage` 下载并实读 4 张排布图：顶部导航 48px、侧边/内嵌分组折叠导航、聚合式菜单、入口）。

**影响范围**：全局框架外壳（所有路由页共用）。已浏览器验证（1440×900）：顶导 3 域渲染正常；点「营销运营」→ `/marketing` 且侧栏隐藏、顶导高亮切换；点「经营概览→用户分析」→ `/overview/user` 且侧栏高亮同步。

**同步状态**：✅ router/index.ts ✅ DashboardLayout.vue ✅ style-profile.md(§6.5 选型规则+G-1 顶导+G-2 侧导职责/图标) ✅ CHANGELOG（本条）

---

## 2026-06-12 — 左侧导改造为 MTD Sidebar（通用组件 + 导航 token）

**改了什么**
- `dashboard-app/src/layout/DashboardLayout.vue`：左侧导由手写 `router-link` 列表改为官方 `<mtd-sidebar>`，`:data` 数组驱动 5 个一级菜单（经营概览/异常监控/目标管理/营销运营/综合驾驶舱），`item-key="route"`、`v-model="activeKey"`、`expand-type="none"`；`activeKey` 绑定并 `watch` `route.path` 实现路由高亮联动。
- `tokens.css` 新增 §1.7 导航专用 token：`--nav-header-height(56px)` / `--nav-width(200px)` / `--nav-active-color` / `--nav-active-bg` / `--nav-item-color` / `--nav-hover-bg`；顶部导 header 高度改用 token。
- 通过 `:deep()` 把 Sidebar 默认竖排（图标上文字下，文字仅 40px 截断）改为横排（图标左文字右、文字撑满 nowrap），选中/hover 态接入上述 token。
- 图标全部在 `mtd3/references/icon_name.md` 核验存在后使用：home-o / warning-circle-o / bar-chart / coupon / monitor。

**为什么**
- 用户指出"左侧导是很重要的通用组件，应参考 MTD Sidebar 由多个 menu 组合"，需从手写实现升级为官方组件并 token 化。

**数值/方式来源**：MTD Vue3 Sidebar 官方文档（浏览器实读 API + 示例）。

**影响范围**：全局框架外壳（所有路由页共用）。已浏览器验证：5 项渲染正常、文字完整、点击「营销运营」→ URL `/marketing` 且高亮随之切换。

**同步状态**：✅ DashboardLayout.vue ✅ tokens.css(§1.7) ✅ style-profile.md(§6.5+自检清单) ✅ CHANGELOG（本条）

---

## 2026-06-12 — 记录 MTD 黄色版主题切换规则（暂不切换，仅沉淀规则）

**改了什么**
- `references/style-profile.md` 新增 §0.5「MTD 组件主题（蓝色版 / 黄色版）」：默认蓝色版 theme-chalk；仅当用户明确提「黄色版/theme-yellow」时切换，方式＝引入路径 `theme-chalk` → `theme-yellow`（本项目 `main.ts` 一行生效），SCSS 定制需配 `$icon-font-path` 指向 theme-yellow/fonts。
- `SKILL.md` §5 视觉规范新增「MTD 主题」约束条目。
- **未改动** `main.ts` / `tokens.css`：当前仍为蓝色版，按用户要求只记规则、不立即切换。

**为什么**
- 用户提出"MTD 有黄色版，如果提到了就照这个方式使用"，需把启用方式沉淀为可复用的生成规则。
- 用户明确选择：暂不切换，仅写入 style-profile，等真正说"用黄色版"时再切。

**数值/方式来源**：MTD Vue3 官方文档「切换主题」（浏览器实读）。

**影响范围**：仅文档/规则层；运行时外观无变化。后续若切黄色版，需同步 main.ts + tokens.css 主色/图表色并再记一条。

**同步状态**：✅ style-profile.md（§0.5） ✅ SKILL.md（§5） ⛔ tokens.css/main.ts（按需暂不动） ✅ CHANGELOG（本条）

---

## 2026-06-12 — 建立设计 Token 体系（对齐官方原子级规范）

**改了什么**
- 重构 `dashboard-app/src/styles/tokens.css` 为完整的设计 Token 中心：色彩（主色/工具蓝色阶/功能色/六级文字色/背景描边分割线）、文字（Web 字阶 30~12 + 行高=字号+8 + 字重 400/500/600 + font-family）、栅格间距（4px 网格 / 24 栅格 / compact 间距阶梯）、圆角（R1-R4）、阴影（高/中/低/最低）、数据可视化色板（chart-1..8 + 蓝色系深浅 + 涨跌语义 + 坐标轴）。
- 新增 `src/composables/chartTokens.ts`：G2 图表配色统一从 CSS 变量读取。
- 改造 3 个模块（MetricCards/TrendChart/RankBar）+ DashboardLayout + OverviewDashboard：消除全部硬编码色值，统一引用 token / chartTokens。
- 新增 skill `references/style-profile.md`（生成时样式唯一指令源）与本 CHANGELOG。

**为什么**
- 用户要求"生成的 UI 风格总是比较稳定、符合要求"，需要建立样式单一来源（SSOT）。
- 用户指定色彩/文字/栅格等必须对齐 km 1352056450 子文档的原子级规范，不可由 AI 发明。
- 用户选择紧凑高效（compact）密度。

**数值来源**：km 1352056450 → 【1】色彩 / 【2】文字 / 【3】栅格 / 【4】圆角 / 【5】阴影 / 【7】数据可视化。

**影响范围**：dashboard-app 全量页面与模块；后续新生成的看板均按此 token 体系产出。

**同步状态**：✅ tokens.css ✅ style-profile.md ✅ CHANGELOG（本条）
