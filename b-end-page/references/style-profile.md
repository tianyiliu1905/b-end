# 数据看板样式规范 (Style Profile) —— 生成时必读

> 本文件是**生成看板代码时的样式唯一指令源**。所有色值、字阶、间距、圆角、阴影、
> 图表配色都必须严格按此执行，**禁止 AI 自行发明数值**。
>
> 数值全部来自美团 UI-B 端原子级设计规范（km 1352056450 子文档）：
> - 【1】色彩 https://km.sankuai.com/collabpage/1803947407
> - 【2】文字 https://km.sankuai.com/collabpage/1804100700
> - 【3】栅格 https://km.sankuai.com/collabpage/1804100730
> - 【4】圆角 https://km.sankuai.com/collabpage/1803957221
> - 【5】阴影 https://km.sankuai.com/collabpage/1803957290
> - 【7】数据可视化 https://km.sankuai.com/collabpage/1827995409
>
> **运行时落地**：项目里维护一份 `src/styles/tokens.css`（设计 Token 中心）。
> 页面/模块**只引用 CSS 变量**，禁止硬编码色值与魔法数字。本文件与 tokens.css
> 必须保持一致；任何样式调整都要：①改 tokens.css ②同步本文件 ③追加 CHANGELOG.md。

---

## 0. 美学基调（用户偏好）

- **密度：紧凑高效（compact）**。模块间距 8px（外），卡片内边距 16px（内），信息密度优先但卡片内部保留舒适留白。
- 克制用色：B 端主色为**工具蓝 #166FF7**，品牌黄仅小面积点缀，避免大面积/多触点用黄。
- 层级靠**字阶 + 灰阶 + 间距**拉开，不靠重色块。
- **排版底色是基础审美的第一维度**（见 §0.1）：统一使用灰底 + 白模块，无需选择。
- **图片占位统一灰色**：列表/卡片中的商品图、缩略图、头像等图片占位一律使用 `--bg-card-inner`(#F8F8F8) 灰色方块，**禁止用彩色色块**（彩色方块会分散注意力、破坏中性基调）。Logo 占位例外（用主色方块，见 §6.5 G-1）。
- **禁止 Emoji 充当 UI 图标**：不使用 🎉、✅、❌、📋 等 Emoji 作为页面图标或状态标识；需使用图标时一律使用 MTD `<Icon>`，并先按 `mtd3/references/icon_name.md` 的检索与校验流程确认合法图标名。
- **同一区域 Icon 风格统一**：优先使用 `-o` 线性图标；一个区域内不得混用线型（如 `check-circle-o`）与面型（如 `close-circle`）。若某图标不存在 `-o` 变体，才使用无后缀版本。
- 目标：每次生成的 UI 风格**稳定一致**，像同一套设计系统产出。

---

## 0.1 基础审美 · 排版底色（灰底 + 白模块）

> **统一使用灰底 + 白模块方案。页面背景 `--bg-page: #F3F3F4`，卡片 `--bg-card: #FFFFFF`。灰白对比本身已足以区分模块边界，不需要 border 或 shadow。**

**审美要点：**

- 页面背景 `--bg-page: #F3F3F4`，卡片 `--bg-card: #FFFFFF`
- 灰白对比本身已足以区分模块边界，**禁止**再加 border 或 shadow（会显脏）
- `.dash-card { background: var(--bg-card); border-radius: var(--radius-3); padding: var(--card-padding); }`
- 阴影仅用于浮层/弹窗/下拉等真正悬浮元素

**通用规则（不随页面类型变化）：**

- 圆角统一 `--radius-3`(6px)
- 卡片内边距统一 `--card-padding`(16px)
- 模块间距统一 `--gap-module`(8px)
- 字阶/色彩/图表色板/间距体系完全一致
- 同层级模块装饰方案必须统一（§6.8）

> **例外：看板列表（L-6）泳道列内的小卡片**属于「白底容器嵌套在灰底泳道列内」的二级嵌套场景，需要 `1px solid var(--border)` 描边来明确边界。这是唯一的描边例外，不扩散到其他场景。

---

## 0.5 主题体系（多主题 · Token 与主题解耦）

> **架构原则：Token 命名与具体主题颜色解耦。** 本节只声明"存在哪些主题、默认用哪个、如何选型"；每套主题的具体取值、MTD 组件层的切换机制、业务层 tokens 的联动方案，统一收敛到独立文档 **`references/theme-system.md`**，生成代码前必须先读该文档。
>
> 历史遗留说明：本文件 §1 色彩 Token 表中的变量名（如 `--color-brand-primary`）均为**中性语义命名**，不包含任何具体颜色字面量（禁止 `-blue`/`-yellow` 等后缀）。旧版本曾用 `--color-brand-blue` 这类命名，已统一重构，详见 `references/theme-system.md` 的迁移说明。

- **当前支持的主题**：`primary`（默认，工具蓝 `#166FF7`）、`brand-yellow`（美团黄 `#FFDD00`）。选型规则：除非用户**明确指定**要黄色主题，一律用默认主题。
- **主题的两层实现，互相独立、缺一不可**：
  1. **MTD 组件层**：整份 CSS 文件替换（`theme-chalk` ↔ `theme-yellow`），由 MTD 组件库官方提供，控制组件自身的视觉表现。
  2. **业务 Token 层**：本 skill 维护的 `tokens.css` 中性变量（`--color-brand-primary` 等），控制自定义卡片/图表/布局的视觉表现。
  这两层必须通过**同一个主题配置对象**联动切换，禁止只改一层导致组件与自定义模块色彩割裂。具体实现方式（含 React / Vue3 主题入口参考代码）见 `references/theme-system.md`。
- 新增主题时，**只需新增一份 `references/theme-examples/tokens.<主题key>.overrides.css` 差异表文件 + 在 `theme.react.tsx`/`theme.vue3.ts` 的 `themes` 配置对象中新增一条记录**（见 `references/theme-system.md` §6），不需要改动任何业务代码或本文件的 token 表结构。

---

## 1. 色彩 Token（浅色背景 · 常规色彩 · sRGB）

> ⚠️ **本节所有主题相关 Token 均为中性命名，不包含具体颜色字面量。** 下表「值」列展示的是**默认主题（primary，工具蓝）**下的取值；**完整可复制的取值文件**见 `references/theme-examples/tokens.css`（`primary` 全量）与 `references/theme-examples/tokens.brand-yellow.overrides.css`（`brand-yellow` 差异表），机制说明见 `references/theme-system.md`。业务代码统一只写 `var(--token名)`，禁止在组件/样式里直接写死色值或按主题名分支判断。
>
> 📖 **权威来源**：本节色值体系对齐文首【1】色彩规范文档。该文档同时定义了「常规色彩」（日常光线场景，本节采用）与「室外色彩」（强光场景专用色阶，见下方 §1.1）两套体系，以及配套的**使用原则**（见 §1.2），生成页面时应一并遵守。

### 主色 / 品牌色阶（随主题切换，中性命名）
| Token | 默认主题(primary)取值 | 用途 |
|-------|-----|------|
| `--color-brand-primary` | `#166FF7` | B 端主色：重要操作/控件/链接，随主题切换 |
| `--color-accent` | `#FFDD00` | 强调/点缀色（固定不随主题变化，小面积点缀，浅底文字/线性控件改用 `--color-accent-text`(#FF7700)） |
| `--color-heading-accent` | `= --color-brand-primary`（`#166FF7`） | 页面标题/重要标题强调色（渐变字、标题装饰 `<span>`）。黄色主题下取 `#FF7700`，不跟随主色变成 `#FFDD00`，避免标题文字可读性下降，详细规则见 `theme-system.md` §2.3 |
| `--color-primary-1` | `#468DFB`（Blue-4） | 主色 **hover** 态 |
| `--color-primary-2` | `#0E65E8`（Blue-6） | 主色 **active** 态 |
| `--color-primary-3` | `#BFD8FE`（Blue-2） | 主色 **disabled** 态 |
| `--color-primary-4` | `#F0F6FF`（Blue-1） | 主色**浅色背景**：选中/提示底色 |
| `--color-primary-5` | `#8FBCFF`（Blue-3） | 主色备用色阶 |

> ⚠️ **编号不是按深浅递增排列的，取用时必须按语义而非数字大小**：`-1`=hover、`-2`=active、`-3`=disabled、`-4`=浅色背景、`-5`=备用。这是直接对齐美团官方 `_base_color.scss` 源文件的编号（`$color-primary-1~5`），不是本 skill 自创的顺序。完整规则见 `theme-system.md` §0.1。
>
> 命名说明：`--color-brand-primary`（= `--color-primary`）与 `--color-primary-{1~5}` 是**同一色阶体系**，随主题整体切换；`--color-accent` 是独立于主题的固定辅助色（美团品牌黄），不随主题变化，因此不纳入 primary 色阶。
>
> 色值来源于 Token 原子层（`--blue-1~6`、`--yellow-1~7` 等，定义在 `references/theme-examples/tokens.css`），语义层变量通过 `var()` 引用原子层，不直接硬编码色值。如业务场景需要更细粒度色阶，直接在原子层补充对应变量（如 `--blue-7`），语义层按需新增引用，不要在语义层发明脱离原子层的新色值。

### 1.1 室外色彩（强光场景专用，按需启用）

官方文档针对户外强光场景（阳光直射屏幕等）提供了一套独立色阶，识别度高于常规色彩，**默认不启用**，仅当用户明确要求"户外场景"/"强光场景"/"室外看板"时才切换使用：

| 分类 | 常规色彩 | 室外色彩 |
|------|---------|---------|
| 主色黄 | `#FFDD00` | `#FFBE25` |
| 工具蓝 | `#166FF7` | `#0E61E6` |
| 红色 | `#FF1F1F` | `#DB3037` |
| 橙色 | `#FF7700` | `#E86C13` |
| 绿色 | `#00A854` | `#02A171` |
| 蓝绿色 | `#00A3A3` | `#0E90A1` |
| 紫色 | `#882EFF` | `#8E44C7` |
| 粉色 | `#EB2F93` | `#E52277` |
| 棕色 | `#9E7549` | `#AD6F37` |

> 室外色彩启用方式：整体替换本节主色/功能色 token 取值（不新增变量名），与主题切换机制类似，但属于「场景」而非「主题」，不与 §0.5 的 primary/brand-yellow 主题体系混用。

### 1.2 主色黄使用原则（官方强制规则，生成含品牌黄场景时必须遵守）

1. **浅色背景禁止直接用品牌黄**：`--color-accent`(#FFDD00) 饱和度高但在浅底上对比度不足，浅色背景上的文字、小图标、线性控件（如描边按钮、线性 icon）**禁止**直接使用 `#FFDD00`，必须换成 `--color-accent-text`(#FF7700)，保证清晰可识别。本 skill 已在 token 命名中体现这一区分（`--color-accent` vs `--color-accent-text`），生成代码时不可混用。
2. **黄色背景上禁止叠加浅色/其他彩色元素**：黄底容器（如强调卡片、Banner）内的文字/图标应使用深色（`--color-accent-text` 或 `--text-1`），避免叠加其他饱和度高的彩色元素，防止对比度冲突。
3. **控制品牌黄的使用面积和触点数量**：品牌黄视觉吸引力强，仅用于强化品牌感知、核心行动点（如主 CTA 按钮）、重要信息强调等场景；除此之外应避免页面中多处、大面积使用，以免视觉强点过多导致信息层级不清晰。B 端管理后台场景下，`--color-accent` 的典型用法是导航强调、Tab 选中、单选/开关等**小面积**点缀，不建议用作大面积背景色。
4. **页面标题/重要标题强调色不得直接用 `--color-brand-primary`**：黄色主题（`brand-yellow`）下 `--color-brand-primary` 取值为 `#FFDD00`，直接用作大号标题文字色（尤其渐变字/`background-clip: text`）会导致可读性显著下降。标题类强调文字统一改用 `--color-heading-accent`（蓝色主题=`#166FF7`，黄色主题=`#FF7700`），按钮/图标/边框等非文字类强调不受此限制，仍用 `--color-brand-primary`。完整说明见 `theme-system.md` §2.3。

### 功能 / 辅助色（标准色，以文首【1】色彩规范为准）
| Token | 值 | 语义 |
|-------|-----|------|
| `--color-red` | `#FF1F1F` | 错误/负向/**上升数据**/警示 |
| `--color-orange` | `#FF7700` | 强调提醒 |
| `--color-green` | `#00A854` | 成功/正向/**下降数据** |
| `--color-teal` | `#00A3A3` | 业务标签 |
| `--color-purple` | `#882EFF` | 业务标签 |
| `--color-pink` | `#EB2F93` | 业务标签 |
| `--color-brown` | `#9E7549` | VIP 标签 |

> ⚠️ 规范特例：数据**上升用红、下降用绿**（与股市相反），见 tokens 的 `--chart-up/--chart-down`。
>
> ⚠️ **已按文首【1】色彩规范修正色值**：蓝绿/紫/粉三色已从旧值（`#009E9E`/`#7D1AFF`/`#FF2994`，对齐 MTD 组件库 `_base_color.scss` 旧版本）统一改为文档最新规范值（`#00A3A3`/`#882EFF`/`#EB2F93`）。**本 skill 以文首【1】色彩规范文档为唯一权威来源**，若 MTD 组件库实际渲染颜色（如 Tag 预置色、图标默认色）仍使用旧值，属于 MTD 组件库本身待升级的问题，不影响本 skill 产出的业务自定义元素（图表、标签等）统一使用新值。
>
> 官方功能色使用场景补充：红色除错误/警示外，也用于**失败及错误状态**、**上升数据**、业务标签、场景图标；绿色除成功/正向外，也用于**下降数据**、业务标签、场景图标；橙色一般用于强调提醒、业务标签、场景图标；蓝绿/紫/粉三色主要用于业务标签、场景图标（无强语义绑定，可按业务自由分配）；棕色专用于 **VIP 标签**场景，不建议挪作他用。

### 中性色 - 文字（基色 #111925 + 透明度）
| Token | 值 | 纯色等价 | 用途 |
|-------|-----|---------|------|
| `--text-1` | `#111925` | — | 一级：标题/按钮文字 |
| `--text-2` | `rgba(17,25,37,.85)` | #343B45 | 二级：正文 |
| `--text-3` | `rgba(17,25,37,.65)` | #646971 | 三级：辅助/说明 |
| `--text-4` | `rgba(17,25,37,.45)` | #94979D | 四级：次辅助 |
| `--text-5` | `rgba(17,25,37,.30)` | #B7BABD | 五级：输入提示 |
| `--text-6` | `rgba(17,25,37,.20)` | #CFD1D3 | 六级：禁用 |

> 字色组合**跨级使用**（如 text-1 配 text-3），保证层级差异。

### 中性色 - 背景/描边/分割线
| Token | 值 | 纯色等价 | 用途 |
|-------|-----|---------|------|
| `--bg-page` | `#F3F3F4` | — | 页面背景（灰底，见 §0.1） |
| `--bg-card` | `#FFFFFF` | — | 卡片背景 |
| `--bg-card-inner` | `#F8F8F8` | — | 卡片内背景（#111925 3%） |
| `--border` | `rgba(17,25,37,.15)` | #DCDDDF | 描边 |
| `--divider` | `rgba(17,25,37,.10)` | #E7E8E9 | 分割线 |
| `--bg-nav-dark` | `#303640` | — | 深色导航（官方文档明确此为产品界面深色导航的标准色值） |
| `--mask` | `rgba(0,0,0,.5)` | — | 遮罩色：弹窗/半页弹窗背景遮罩（官方新增，本 skill 之前缺失，浮层类组件需要遮罩时统一用此 token，禁止另写 `rgba(0,0,0,.5)` 字面量） |

> **深色背景专用中性色阶**（官方文档定义，用于深色导航/深色卡片内的文字与描边，与上方浅色背景中性色阶是两套独立体系，不可混用）：一级文字 `#FFFFFF`(不透明度100%，特殊场景用纯黑 `#000000`) / 二级文字 `rgba(255,255,255,.9)` / 三级文字 `rgba(255,255,255,.75)` / 四级文字 `rgba(255,255,255,.55)` / 五级文字 `rgba(255,255,255,.4)` / 六级（禁用）文字 `rgba(255,255,255,.3)` / 描边 `rgba(255,255,255,.2)` / 分割线 `rgba(255,255,255,.1)` / 内容背景 `rgba(255,255,255,.05)`。本 skill 当前只有 `--bg-nav-dark` 一个深色底色 token，尚未定义上述深色背景文字/描边 token；如业务场景出现深色侧边栏/深色卡片等需要在深色底上分层文字的场景，应按此表新增 `--text-dark-1..6` 等对应 token，不要直接在深色背景上复用浅色背景的 `--text-1..6`（对比度会不足）。

---

## 2. 文字 Token（Web 端字阶 · 行高 = 字号 + 8）

字体族：
```
system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif
```

| Token | 字号/行高 | 用途 |
|-------|----------|------|
| `--fs-30 / --lh-30` | 30 / 38 | 重要数字/强调（指标卡大数字） |
| `--fs-24 / --lh-24` | 24 / 32 | 模块大标题 |
| `--fs-20 / --lh-20` | 20 / 28 | 长文本/正文 |
| `--fs-18 / --lh-18` | 18 / 26 | 辅助 |
| `--fs-16 / --lh-16` | 16 / 24 | 卡片标题（dash-title 默认） |
| `--fs-14 / --lh-14` | 14 / 22 | 正文/次要（body 默认） |
| `--fs-12 / --lh-12` | 12 / 20 | 辅助/说明（subtitle、坐标轴标签） |

字重：`--fw-regular 400`（正文）/ `--fw-medium 500`（标题/强调）/ `--fw-semibold 600`（着重）。
> 字号组合对比梯度 ≥4px；少即是多，不滥用字阶。

---

## 3. 栅格与间距 Token（基础网格 4px · Web 24 栅格）

- 网格单元 `--grid-unit: 4px`，所有间距取 **4 的倍数**。
- Web **24 栅格**体系，响应式断点 `--breakpoint: 768px`（左右布局；<768 侧栏自动收起）。
- **内容区全宽**：内容区（`.content` / `PageLayout`）**不设 max-width**，撑满侧栏右侧全部可用宽度。禁止使用 `max-width: 1200px/1400px` + `margin: 0 auto` 居中布局（会导致大屏两侧灰色留白过多、信息密度低）。模块内部通过栅格 `<Row>` + `<Col span>` 自然分配宽度即可。
- 原子阶梯 `--space-1..8`（= 4/8/12/16/20/24/—/32）仅作为底层调色板，**业务代码不直接引用**，一律走下面 3 个语义边距 token。

### 全局边距 token（4 个语义层级）

| 语义 Token | 值 | 用途（compact） |
|-----------|-----|------|
| `--gap-elem` | 8px | 组内元素间距（图标-文字、标签间隙等最小间距） |
| `--gap-module` | 8px | **模块之间的外部间距 + 栅格 gutter**（中层唯一外间距） |
| `--card-padding` | 16px | **卡片容器内部留白**（`.dash-card` padding、表格单元格、tab、分页器等组件内部排版） |
| `--gap-section` | 24px | **逻辑大段分区间距**（概览区→趋势区→明细区之间） |
| `--gap-page` | 16px | **内容区外缘留白 + 侧栏高亮块内缩**（最外层间距） |

> ✅ **只准用这 5 个**：`--gap-elem` / `--gap-module` / `--card-padding` / `--gap-section` / `--gap-page`。gutter、原 `--pad-page`/`--pad-card`/`--pad-card-y` 全部并入这几个，不再新增语义边距 token。`--gap-section` 仅用于页面内有明确信息递进关系时的大段分隔。
> 指标卡 D-1：`<mtd-row :gutter="8">`（= `--gap-module`），每卡 `:span="6"`（4 列）或 `:span="4"`（6 列）。

### ⚠️ 外间距与内边距必须用不同 token（踩坑沉淀）

`gap-*` 系列只负责「元素/模块之间的外部间距」，`--card-padding` 单独负责「卡片容器内部的内边距」，**两者语义不同，禁止混用**。

曾经把两者都写成 `--gap-module`，结果为了收紧模块间距把它从 16px 调到 8px 时，卡片内部和表格单元格的留白跟着缩水，页面变得异常拥挤。拆开后，调模块间距不会再误伤卡片内部。

```css
/* ✅ 正确：外间距走 gap-module，内边距走 card-padding */
.content     { display: flex; flex-direction: column; gap: var(--gap-module); }
.dash-card   { padding: var(--card-padding); }
.table th,
.table td    { padding: var(--gap-elem) var(--card-padding); }

/* ❌ 错误：用同一个 token 同时管外间距和内边距 */
.dash-card   { padding: var(--gap-module); }
```

### 间距一致性原则

- **最外层统一 16**：内容区外缘留白 `--gap-page`(16) **等于** 侧栏选中高亮块到内容区的内缩(16)。二者是「侧栏高亮块→内容」与「内容→筛选栏」两道视觉间距，**必须相等**（老版本 13px vs 24px 不一致是错误示范）。
- **中层统一**：模块纵向间距 = 栅格横向 gutter，均为 `--gap-module`(8)；卡片/容器内边距统一为 `--card-padding`(16)，保证卡片阵列“横=纵”外间距均匀、卡内留白舒适。
- **字号一致**：同层级元素（如顶导业务域菜单与侧导菜单项）字号必须一致，都用 `--fs-14`。
- **盒模型边距一致（硬性规则）**：同一个盒模型（卡片、筛选栏、面板等容器）的 `padding` 上下左右必须**四向一致**，写成单值 `padding: var(--card-padding)`，**禁止**写成 `padding: var(--gap-elem) var(--card-padding)` 这类上下/左右不等的两值写法，**除非目标是表格单元格/tab 这类明确需要「行高由 --gap-elem 控制、左右呼吸感由 --card-padding 控制」的组件内部排版**——这种情况允许两值写法，但两个值必须分别是 `--gap-elem` 和 `--card-padding`，不能引入其他 token。普通容器（`.dash-card` / `.filter-bar` 等 `.dash-block`）一律四向相等，用单值 `--card-padding`。

### ⚠️ MTD Row gutter 对齐修正（必做）

MTD 的 `mtd-row` 只给 `col` 加了左右 padding（gutter/2），**却不在 row 上加负 margin 抵消** → 栅格内容（卡片/图表）会比筛选栏等「非栅格模块」两侧各内缩 gutter/2(8px)，造成两侧不对齐。

**修法**（已内置 tokens.css）：给内容区所有 `mtd-row` 补负 margin：
```css
.content .mtd-row { margin-left: calc(var(--gutter) / -2); margin-right: calc(var(--gutter) / -2); }
```
这样 col 的 8px padding 被抵消，卡片外缘与筛选栏等非栅格模块**两侧对齐**。注意：`mtd-row` 的 `:gutter` 须传 16，与 `--gutter` 一致。

---

## 4. 圆角 Token（Web 端）

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-1` | 16px | 最大容器 |
| `--radius-2` | 10px | 弹窗 |
| `--radius-3` | 6px | **卡片容器（默认）** |
| `--radius-4` | 4px | 小组件/标签/柱条圆角 |

> 嵌套规则：外圆半径 > 内圆半径。`--radius` 别名 = `--radius-3`。

---

## 5. 阴影 Token（PC 端 · 光源垂直向下 X=0）

| Token | 值 | 用途 |
|-------|-----|------|
| `--shadow-high` | `0 13px 39px rgba(0,0,0,.15)` | 悬浮栏/气泡 |
| `--shadow-mid` | `0 8px 24px rgba(0,0,0,.12)` | 悬浮按钮/卡片 |
| `--shadow-low` | `0 4px 12px rgba(0,0,0,.10)` | 一般卡片 |
| `--shadow-min` | `0 2px 6px rgba(0,0,0,.08)` | 分段器/开关 |
| `--shadow-card` | = `--shadow-min` | **仅浮层/弹窗/下拉/临时切换组件**（看板卡片不用） |

> 阴影只用于**真正悬浮于内容之上**的元素（弹窗 / 浮层 / 下拉 / 气泡）。看板平面内的卡片/筛选栏/图表容器统一**不用阴影也不用描边**；灰底 + 白卡 + 圆角三者已足以划分边界（见 §6.8）。

---

## 6. 数据可视化色板 Token（图表）

> 图表色值不跟随主题实时变化（`--chart-1`/`--chart-primary-strong`/`--chart-primary-weak` 除外，见下），但颜色取值必须来自 token 体系，禁止在图表配置里重复硬编码与 token 相同的十六进制值。因为 AntV G2 的图表配置是纯 JS 对象字面量，无法直接写 `var(--chart-1)`，落地方式是运行时读取一次 `:root` 上的 CSS 变量值（取不到时 fallback 到与 tokens.css 完全一致的默认值），而不是把色值再抄一遍写死在业务代码里。

图表配色**只从 tokens.css 读取**，工具：`src/lib/chartTokens.ts`（React 项目路径；Vue 项目对应 `src/composables/chartTokens.ts`，实现逻辑一致）。**API 为 getter 对象，不是函数调用**：

```ts
chartPalette.c1 / .c2 / .c3 / .c4 / .c5 / .c6 / .c7   // 7 色分类色板（getter，每次访问实时读取 CSS 变量）
chartMono.strong / .base / .medium / .weak / .lightest // 单色色阶（5 级，用于渐变/热力图）
chartTrend.up / .down                                   // 涨跌色（固定，不随主题变化）
getChartCategoricalPalette(count?: number): string[]    // 取分类色板数组，可截取前 N 色
getChartMonoScale(): string[]                            // 取单色色阶数组（strong→lightest，共 5 级）
```

完整可直接复制的参考实现见 `references/theme-examples/chartTokens.react.ts`（Vue 项目按同样的 getter 结构改写为 `.ts`，路径放 `src/composables/chartTokens.ts` 即可，无需 Vue 响应式包装——这些值只在图表重渲染时读取一次，不需要响应式追踪）。

### 分类色序列（多系列，共 7 色，不含黄）
`--chart-1..7` = `#166FF7`(工具蓝/主题色，随主题联动) / `#00A854`(绿) / `#FF7700`(橙) / `#00A3A3`(蓝绿) / `#882EFF`(紫) / `#EB2F93`(粉) / `#9E7549`(棕)
> 序列以主题色（`--chart-1` = `--color-brand-primary`）起，循功能/辅助色相延展，对齐【1】色彩功能色序列。切主题时 `--chart-1` 随 `--color-brand-primary` 联动，`--chart-2..7` 保持不变。**注意：不含黄色**——`--color-accent`(#FFDD00) 饱和度高、图表场景对比度不足，且与美团黄主题下的 `--chart-1` 可能撞色，故分类色板固定跳过黄色，按 7 色截止于棕色。

### 同色系深浅（强弱对比，如"本周 vs 上周"）
`--chart-primary-strong` (= `--color-primary-2`，active 色阶，默认 `#0E65E8`，随主题联动) → `--chart-primary-weak` (= `--color-primary-5`，备用色阶，默认 `#8FBCFF`，随主题联动)。`chartMono` 额外提供 `.medium`(= `--color-primary-1`，hover 色阶) 与 `.lightest`(= `--color-primary-4`，浅色背景色阶) 两级，共 5 级色阶（strong→base→medium→weak→lightest），用于排名条形图/热力图等需要同色渐变的场景；**注意这里的编号不是按深浅排列的**，取用时以注释中的语义（strong/medium/weak/lightest）为准，不要按数字大小自行推断；需要更细粒度色阶时在 `weak`/`lightest` 之间插值即可，不要发明新 token 名。
> 命名已去除颜色字面量，`-strong`/`-weak` 表达的是同一主题色的深浅对比关系，随主题切换联动。

### 语义涨跌
`--chart-up #FF1F1F`（上升红）/ `--chart-down #00A854`（下降绿），固定不随主题变化。

### 坐标轴 / 网格 / 标签
当前项目没有落地专门的 `--chart-axis-*` token 或 `chartAxisDefaults()` 注入函数，坐标轴网格线直接在各图表 spec 里内联写 `gridStroke: 'rgba(17,25,37,.06)'`（= `--divider` 中性灰阶的等价字面量，非品牌色，不受主题切换约束，因此允许直接写字面量）。若后续需要统一提取，可在 `chartTokens.ts` 里补充一个 `chartAxis` 常量对象，暴露 `line`/`label`/`grid` 三个字段，但目前不强制。

---

## 6.5 全局通用模块 G（顶导 G-1 + 侧导 G-2）

> **模块编号体系**：导航骨架走 **G 通用模块**（G-1 顶导 / G-2 侧导 / G-3 筛选器栏 / G-4 数据表格 / G-5 切换tab，列表页和看板页共用）；列表页专属内容走 **List-n**（List-2 操作栏、List-3 分页器已并入 G-4；原 List-1 筛选器已合并入 G-3）；看板页图表类内容走 **D-n**（D-1 指标卡片 ~ D-15 玫瑰图，外壳统一为 D-ChartCard，D-8 堆叠进度条例外，非 G2）；工作台专属内容走 **W-n**（W-2 操作引导卡 / W-3 快捷入口网格）。选型请以各模块参考文件内声明的 moduleId 为准，文件名采用 `DashboardN`/`GeneralN`/`Workbench` 词缀风格，与 moduleId 编号不完全一一对应。

整个看板平台外壳由 `src/layout/DashboardLayout.vue` 提供：上为 G-1 顶部导航，下为「G-2 侧边栏 + 内容区（含 G-3 筛选器栏 + D-n 数据模块）」左右布局。

> 规范来源：MTD3.0《① 全局导航 Global Navigation》（km 1107111043）。该规范定义了三种导航形态：顶部导航、侧边/内嵌导航、聚合式菜单。

### 导航形态选型规则（生成页面前先判断）

**核心原则：顶导承载「全局/跨业务域」维度，侧导承载「当前业务域内部的功能子模块」。** 二者职责不同，不要把不同的看板页面平铺进侧导。

| 形态 | 适用场景 | 结构 |
|------|----------|------|
| **仅顶导** | 页面/模块少（≤5~7 个一级），域内层级浅，偏门户/展示型 | 横向一级菜单承载全部模块，无侧栏 |
| **仅侧导** | 单一应用、模块多需常驻切换，但无跨域概念 | 垂直侧栏承载所有功能模块 |
| **顶导 + 侧导**（默认推荐，本项目采用） | 大型系统：既有多个业务域，每个域内又有多个功能子模块 | 顶导=产品名 + 业务域一级菜单 + 全局功能区；侧导=当前业务域内部子模块 tab |

> ⚠️ 反例：把「经营概览 / 营销运营 / 异常监控」这种**不同业务域/不同看板**直接塞进同一个侧导是错误的——它们应作为**顶导一级菜单**；侧导只放「当前域内部」的子模块（如经营概览域 → 经营总览 / 交易分析 / 用户分析 / 商品分析 / 渠道分析 / 门店分析 / 留存分析）。

### G-1 顶部导航

- **左侧 logo 方块占位（必做）**：最左侧预留一个**正方形**占位（边长 ≈ 顶导高减上下内边距，本项目 28px），用于放 logo。**暂无 logo 图时，用 `--color-brand-primary` 主题色实心方块先占着**（`--radius-4` 圆角），与右侧产品名间距 `--gap-elem`。这样后续接入真 logo 不会导致布局抽动。
- **产品名**：`--color-brand-primary`，紧跟 logo 方块右侧。
- **业务域一级菜单**：横向 `router-link`。
- **业务域菜单选中态**（白底蓝字版）：蓝字 + 底部 2px 蓝色下划线（`::after`），对应文档顶导规范。
- **右侧全局功能区**：搜索 / 通知（MTD Icon：`search` / `bell-o`）+ 用户标识，图标用 `--text-2`，hover 转 `--nav-active-color`。
- **数据结构**：`domains: { key, title, entry, children[] }[]`。`entry` 为该域入口路由（点顶导后落到首个子模块）；`children` 为该域侧导子模块，**为空数组表示该域是纯顶导页（不渲染侧栏）**。
- **当前域识别**：`currentDomain = route.path.split('/')[1]`；侧导菜单 = 当前域的 `children`（`computed`），实现「切顶导 → 侧导内容随之切换/隐藏」。

### G-3 筛选器栏

- 画面顶部的全局筛选/时间粒度区，详见 `references/L2-modules/General3-filter-bar.md`。与下方首个数据模块间距 `--gap-module`。

### 导航专用 Token（tokens.css §1.7）

> ⚠️ **适用边界**：以下 token 仅用于本文件里**非 MTD 组件**的自定义元素（如 G-1 顶导手写的 `router-link` 一级菜单、右侧全局功能区图标 hover）。**不用于覆盖 MTD Sidebar/Menu 组件内部的选中/hover 态**——那部分完全交给 MTD 组件自身的 `theme` 属性和 MTD 官方主题 CSS 决定，业务 token 不做 `:deep()` 颜色穿透，避免组件内部渲染同时受两套样式源头驱动。

| Token | 值 | 用途 |
|-------|-----|------|
| `--nav-header-height` | 52px | 顶部导航高度（对齐附件 §3.5 --top-nav-h 52px）|
| `--nav-width` | 168px | 侧边栏展开宽度 |
| `--nav-active-color` | = `--color-brand-primary` | 顶导手写菜单选中文字/图标主色（非 MTD 组件） |
| `--nav-active-bg` | = `--color-primary-4` | 顶导手写菜单选中底色（浅色背景色阶，非 MTD 组件） |
| `--nav-item-color` | = `--text-2` | 顶导手写菜单项默认文字（非 MTD 组件） |
| `--nav-hover-bg` | = `--bg-card-inner` | 顶导手写菜单项 hover 底色（非 MTD 组件） |

### G-2 侧边栏 = MTD Sidebar（当前业务域内部子模块）

- **职责**：只渲染「当前业务域内部」的功能子模块 tab，由 `domains[current].children` 提供（`computed`）；切换顶导业务域时侧导内容随之变化，纯顶导域则不渲染侧栏（`v-if="sideMenus.length"`）。
- **组件**：`<mtd-sidebar>`，由 `:data` 数组驱动多个 menu 项组合而成，**不再手写 router-link**。
- **数据结构**：扁平一级菜单，每项 `{ id, route, title, icon }`；`item-key="route"`、`v-model="activeKey"`。
- **路由联动**：数据项含 `route` 字段时组件自动用 router-link 渲染（href 即 route）；`activeKey` 绑定 `route.path` 并 `watch` 同步，保证刷新/直达 URL/前进后退时高亮正确。
- **配置**：`theme="light"`、`expand-type="none"`（一级菜单无展开）。`@menu-item-click` 仅作兜底跳转。
- **横排样式**（标准后台侧边导，避免竖排文字截断）：通过 `:deep()` 把 `.mtd-menu-item-title` 改 `flex-direction: row`（图标左、文字右）、`.mtd-menu-item-text` 设 `width:auto; flex:1; overflow:visible; white-space:nowrap`，并让 `.mtd-menu` / `.mtd-menu-item` 宽度 100% 撑满。
- **选中/hover 态 = 内缩悬浮高亮块（结构必做，颜色不覆盖）**：背景**不要加在 `.mtd-menu-item`（<li>）上**，否则底块会从 x=0 顶满到侧栏右边、贴死边缘显得生硬。正确做法：
  - `.mtd-menu-item`（<li>）设 `background: transparent !important; padding: 2px var(--space-3) !important`，用左右 padding 形成「内缩区」——这一步只调整布局位置，不涉及颜色。
  - `.mtd-menu-item-title`（<a>）设 `width:100%; box-sizing:border-box; margin:0 !important; border-radius: var(--radius-3)`，让内缩区内的高亮块左右各内缩约 12px、带 6px 圆角——同样只是结构/形状覆盖。
  - ⚠️ **选中态/hover 态的背景色与文字色不再用业务 token 覆盖 `.mtd-menu-item-title` 等组件内部 class**，完全交给 MTD 组件自身的 `theme` 属性和 MTD 官方主题 CSS（`index.css` / `theme-yellow.css`）决定，随 MTD CSS 包切换自动联动。业务 `tokens.css` 中的 `--nav-active-color`/`--nav-active-bg`/`--nav-hover-bg` 系列 token **不用于 MTD Sidebar/Menu 组件内部**，只用于本文件里非 MTD 的自定义元素（如 G-1 顶导的 logo 占位块、手写 `router-link` 一级菜单）。
- **顶部空白修正（必做）**：MTD Sidebar 默认有一个 `.mtd-sidebar-header`（约 56px，供 logo/折叠按钮用）。本项目这些已由顶导承载，侧栏用不到 → `:deep(.mtd-sidebar-header){ display:none }`，否则首个菜单项上方会留一大段空白。`.mtd-sidebar-menus` 设 `margin-top:0; padding-top: var(--space-2)`，让首项与右侧内容区顶部基本对齐。
- **左内边距（图标不贴边）**：图标的左留白由上面 <li> 的左 padding（`--space-3`=12px）+ <a> 的左 padding（`--space-3`=12px）叠加得到，图标离侧栏边缘约 24px。`.mtd-menu-item-title` 不要再设 `width:100%` 与左右 margin 叠加（会溢出侧栏右边）。

> ⚠️ MTD Sidebar 默认是「图标在上文字在下」的竖排窄列，`.mtd-menu-item-text` 仅 40px 会截断中文 → 必须按上面横排覆写。
> 图标用 MTD Icon，须在 `mtd3/references/icon_name.md` 确认存在后再使用，统一用 `-o` 线性风格。经营概览域已用：home-o（经营总览）/ barschart-o（交易分析）/ avatar-o（用户分析）/ cart-o（商品分析）/ share-o（渠道分析）/ location-o（门店分析）/ areachart-o（留存分析）。
> ⚠️ 易错图标：`user-o` / `shopping-o` / `line-chart` 在 MTD 中不存在，应分别用 `avatar-o` / `cart-o` / `areachart-o`。

- **滚动条隐藏（强约束）**：侧栏菜单区域允许滚动（`overflow-y: auto`），但**必须隐藏滚动条**，保持视觉干净。三端兼容写法：`scrollbar-width: none`（Firefox）+ `-ms-overflow-style: none`（IE/Edge）+ `::-webkit-scrollbar { display: none }`（Chrome/Safari）。
- **分组展开模式（Menu.SubMenu）**：当侧栏菜单项较多需要分组时，使用 `Menu` + `Menu.SubMenu` 实现可展开/折叠的分组结构，所有分组始终全部显示在侧栏中（**不使用顶部 Tab 过滤侧栏内容**），用户通过点击 SubMenu 标题来展开/折叠。
- **二级菜单项左缩进（必做）**：SubMenu 下的 `Menu.Item`（二级菜单项）必须在左侧增加 `margin-left: 4px`，与一级 SubMenu 标题形成层级区分。CSS：`.sideMenu :global(.mtd-prime-menu-sub-wrap .mtd-prime-menu-item) { margin-left: 4px; }`（选择器精确到 sub-wrap 内子项，不影响一级标题）。

---

## 6.9 同一行卡片对齐 / 等高原则（硬性规则）

> **核心：同一行（同一个 `mtd-row` 内）的多张卡片，必须顶边对齐 + 等高，底边齐平。** 严禁出现「左卡内容少、右卡内容多，两卡顶边齐但底边参差不齐」的高低脚——这是栅格内最常见的对齐错误（典型反例：进度展示模块「环形目标」卡 252px 而「子目标进度条」卡 224px，底部差 28px）。

**两条对齐都要满足：**

| 维度 | 要求 | 实现 |
|------|------|------|
| **顶边对齐** | 同行卡片顶部基线一致 | 同一 `mtd-row` 内各 `mtd-col` 顶部天然对齐；卡内**标题区高度一致**（都用 `.dash-title`，勿一处有副标题一处没有造成首行错位） |
| **等高（底边齐平）** | 同行卡片高度相等，矮卡自动留白撑高 | 见下方机制，**已内置 tokens.css，模块层不用各自处理** |

**等高机制（已内置 `tokens.css`，写模块时无需重复）：**

```css
/* ⚠️ MTD Row class 名踩坑（铁律）：
   MTD Row 组件**不传** type="flex" 时，渲染的 class 是 `.mtd-prime-row`（不带 -flex 后缀）；
   **传了** type="flex" 时才渲染 `.mtd-prime-row-flex`。
   两者都必须覆盖！否则等高规则静默失效——左右卡片底部错位却无报错。
   tokens.css 中必须同时写两个选择器，缺一不可。 */
.mtd-prime-row,
.mtd-prime-row-flex { display: flex; align-items: stretch; }

.mtd-prime-row > [class*='mtd-prime-col'],
.mtd-prime-row-flex > [class*='mtd-prime-col'] { display: flex; flex-direction: column; }

.mtd-prime-row > [class*='mtd-prime-col'] > .mtd-prime-card,
.mtd-prime-row-flex > [class*='mtd-prime-col'] > .mtd-prime-card {
  flex: 1; display: flex; flex-direction: column;
}

/* ⚠️ 关键：MTD Card 有 .mtd-prime-card-body 内部 wrapper，
   flex 布局必须穿透到 body 层，否则内容中的 flex:1 不生效 */
.mtd-prime-row > [class*='mtd-prime-col'] > .mtd-prime-card > .mtd-prime-card-body,
.mtd-prime-row-flex > [class*='mtd-prime-col'] > .mtd-prime-card > .mtd-prime-card-body {
  flex: 1; display: flex; flex-direction: column; min-height: 0;
}
```

> **⚠️ 经验教训**：曾因 tokens.css 只写 `.mtd-prime-row-flex` 而遗漏 `.mtd-prime-row`，导致「品牌年度开店目标达成」卡片与「核心指标」卡片底边错位 28px+，且无任何编译/运行时报错，只有目视截图才能发现。**自检时必须在浏览器中验证同行卡片底边是否齐平。**

**硬性约束（写 L2 模块时遵守）：**

- ❌ **禁止**用 `min-height: XXXpx` 去「硬凑」让两张卡看起来一样高——内容一变就又错位。高度交给上面的 stretch 机制，由**行内最高卡片**决定。
- ✅ 卡内若有需要垂直居中的内容（如图表、环形图、进度条列表），用 Card `display:flex; flex-direction:column` + 内容区 `flex:1; display:flex; align-items:center; justify-content:center; width:100%` 让其在撑高后的卡内自然垂直+水平居中，而不是固定高度。
- ✅ 对于纵向排列的内容（如进度条列表+图例），内容区改用 `flex:1; display:flex; flex-direction:column; justify-content:center` 实现垂直居中。
- ✅ 这条只作用于**栅格内（`mtd-row > mtd-col` 里）的卡片**；整宽独立卡片（不在 row 里）不受影响。

**图表居中范式（React，所有走 D-ChartCard 外壳的图表卡片统一使用，如 D-3/D-4/D-7/D-12 等）：**

> ⚠️ MTD Card 内部有 `.mtd-prime-card-body` wrapper，Card 上的 flex 不会直接传递给 children。
> 必须通过 tokens.css 中的全局规则让 `.mtd-prime-card-body` 也变为 `flex:1; display:flex; flex-direction:column; min-height:0`，
> 这样 Card 内部 children 的 `flex:1` 才能生效。

**卡片内部嵌套规范**：Card 内只有两个同级区域 —— `.card-title-bar`（标题）和 `.card-body-area`（图表/数据区）。二者都在 `.mtd-prime-card-body` 内部，由 tokens.css 全局规则驱动 flex 布局。

```jsx
<Card style={{ marginBottom: 0, height: '100%' }}>
  {/* 标题区：固定高度，不参与 flex 拉伸 */}
  <div className="card-title-bar">
    <span>标题</span>
    {/* 右侧筛选/按钮 */}
  </div>
  {/* 图表区：flex:1 撑满剩余高度，canvas 在内垂直+水平居中 */}
  <div className="card-body-area">
    <ChartComponent />
  </div>
</Card>
```

**工具类（tokens.css 已内置）**：
```css
.card-title-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-shrink:0; }
.card-body-area { flex:1; min-height:0; display:flex; align-items:center; justify-content:center; width:100%; }
```

**自检：** 写完一行多卡布局后，目测同行所有卡片**底边是否在同一水平线**；不齐就是违规（通常是某卡写了 `min-height` 或 row 没走 flex）。图表/内容在撑高卡片中**是否垂直居中**；底部出现大片空白就是违规（通常是缺少 flex column + flex:1 居中容器）。

---

## 6.8 装饰一致性原则（硬性规则）

> **核心：同一层级的模块，装饰风格必须完全一致。** 严禁出现「一处用阴影、一处用描边、一处什么都不加」的混搭——这是最常见、最破坏一致性的错误（典型反例：指标卡片用阴影投影，但同一页的筛选栏用描边边框）。

**装饰方案统一：灰底页 + 白模块，无边框无阴影。**

| 元素类型 | 装饰 | 卡片边界方式 | 阴影使用 |
|---------|------|-------------|---------|
| 平面模块 | 白底 + 圆角，**无边框无阴影** | 灰白对比自然分隔 | 不用 |
| 悬浮元素 | `--shadow-card` 或更高阶阴影 | — | 弹窗/浮层/下拉/气泡 |
| 看板列表泳道内小卡片（唯一例外） | 白底 + `1px solid var(--border)` + 圆角 | 边框线条界定 | 不用 |

**关键约束：**

- 白底卡片/筛选栏/图表容器**只用白底+圆角**，灰底+白底+圆角三者足以划分模块边界，再叠描边或阴影会显脏。
- **禁止**对平面模块使用 `box-shadow`，阴影只用于真正悬浮的元素。

**自检：** 写完一页后，检查所有同层级模块——应全部无 border 无 shadow。任何不一致都是违规。

---

## 7. 通用工具类（tokens.css 已内置）

| 类名 | 作用 |
|------|------|
| `.dash-card` | 卡片：白底 + radius-3 + 内边距 `--card-padding`(16)，无描边无阴影 |
| `.dash-block` | 模块间距（margin-bottom: `--gap-module`(8)） |
| `.dash-title` | 卡片标题：16px / 500 / text-1 |
| `.dash-subtitle` | 副标题：12px / text-3 |
| `.card-title-bar` | 数据卡片内标题区：flex row、两端对齐、固定高度不拉伸（flex-shrink:0）、底部 12px margin |
| `.card-body-area` | 数据卡片内图表/数据区：flex:1 撑满剩余高度、内容水平+垂直居中、min-height:0 防溢出 |
| `.up` / `.down` | 涨跌色（上升红 / 下降绿） |

> 生成 L2 模块时**优先复用这些工具类**，新样式也只用 var(--token)。

---

## 8. 生成自检清单（写完代码逐条核对）

- [ ] **基础审美 · 灰底白模块**（§0.1）：`--bg-page: #F3F3F4` + 白卡，无描边无阴影，全页统一。
- [ ] **装饰一致**：同层级模块全部无 border 无 shadow。仅看板列表泳道内小卡片可用描边（§6.8 例外）。
- [ ] **内容区全宽**：PageLayout / .content 不设 max-width，撑满侧栏右侧全部可用宽度（§3）。
- [ ] 无硬编码色值/字号/间距，全部 `var(--token)`；图表色来自 `chartTokens.ts`。
- [ ] 密度为 compact；**边距只用 5 个 token**：`--gap-elem`(8) / `--gap-module`(8) / `--card-padding`(16) / `--gap-section`(24) / `--gap-page`(16)，不出现其它语义边距变量。
- [ ] **间距一致**：侧栏高亮块→内容 与 内容→筛选栏 两道视觉间距相等（16）；同层元素字号一致。
- [ ] **G-1 顶导左侧有 logo 方块占位**（无图时用主题色实心方块）。
- [ ] 字阶/行高来自 §2，字重仅 400/500/600。
- [ ] 圆角默认 radius-3(6px)；阴影仅用于浮层。
- [ ] **同一行多卡片顶边对齐 + 等高底边齐平**（见 §6.9）；不靠 `min-height` 硬凑，由 tokens.css 的 `Row type="flex"` stretch 机制自动等高。图表/内容在撑高卡片内**垂直居中**（tokens.css 穿透 `.mtd-prime-card-body` + 内容区 `flex:1; minHeight:0` 居中）。
- [ ] 数据涨跌：上升红、下降绿。
- [ ] **图片占位为灰色**：商品图/缩略图/头像等占位使用 `--bg-card-inner`(#F8F8F8) 灰块，禁止彩色色块。
- [ ] 无 Emoji（零容忍）；所有图标用 MTD `<Icon type="xxx" />`（图标名需在 `icon_name.md` 确认存在）。
- [ ] 图标统一 `-o` 线性风格：有 `-o` 变体的图标必须用 `-o`（如 `bell-o` 而非 `bell`）；无 `-o` 变体的直接用无后缀版（如 `search`）。同区域禁止线性/面性混用。
- [ ] 少选项互斥切换（日/周/月等）用 Radio.Group + Radio.Button，禁止原生 button 模拟。
- [ ] 全局框架：侧边栏用 `<mtd-sidebar>`（§6.5），导航尺寸/选中态走 `--nav-*` token，菜单横排且文字不截断。
- [ ] 若本次调整了样式 → 已同步 tokens.css + 本文件 + CHANGELOG.md。
- [ ] §9 视觉质量：表格 ≥5 行 mock 数据、首屏无大面积空白、Tag 有语义色彩、空态有 Empty 组件。
- [ ] §9 空间节奏：逻辑大段之间用 `--gap-section`(24px)，同段内模块间距用 `--gap-module`(8px)，卡片内边距用 `--card-padding`(16px)。

---

## 9. 空间节奏与视觉比例（审美补充）

> 本章节补充间距层级和模块比例规则，解决"结构对了但视觉平淡"的问题。

### 9.1 间距层级（5 级体系）

| 语义 Token | 值 | 用途 | 场景 |
|-----------|-----|------|------|
| `--gap-elem` | 8px | 最小粒度 | 图标-文字、标签间隙、组内元素 |
| `--gap-module` | 8px | 中层标准（外间距） | 模块之间的外部间距、栅格 gutter |
| `--card-padding` | 16px | 中层标准（内边距） | 卡片/容器内部留白、表格单元格、tab、分页器 |
| `--gap-section` | 24px | 大段分区 | "概览区→趋势区→明细区"等逻辑段之间 |
| `--gap-page` | 16px | 外缘留白 | 内容区四周、侧栏内缩 |

> `--gap-section` 用于解决"所有模块等距排列导致读不出层级"的问题。当页面内有明确的信息递进关系（概览→分析→明细），段与段之间用 24px 拉开，段内模块间距仍用 8px（`--gap-module`），卡片内部留白用 16px（`--card-padding`）。

### 9.2 模块高度建议

| 模块类型 | 推荐高度范围 | 说明 |
|---------|-------------|------|
| 指标卡片组 D-1 | 80~120px（卡片内容高） | 紧凑为主，数字+标签+涨跌即可 |
| 趋势图 D-3 / 面积图 | 240~320px | 足够读取趋势但不空旷 |
| 排名条形 D-9 | 180~240px | 展示 5~8 项为佳 |
| 饼图/环形 D-7 | 200~280px | 含图例区域 |
| 雷达图 D-12 | 240~280px | 需四周留白放轴标签 |
| 数据表格 G-4 | 按行数自然撑高 | 首屏至少可见 5 行 |

### 9.3 同行比例平衡

- 左右 5:5 或 6:4 均可；避免 8:2 或 3:7 这种一侧极窄的比例。
- 若一侧是图表、一侧是文字列表，图表侧需有足够画布高度（≥200px），文字侧靠 stretch 等高。
- 同行卡片的"视觉重量"应大致对等：一侧是密集数据表，另一侧不宜只放 1 个环形图（留白太多）。

### 9.4 区域内一致性

- 同一功能区域内，同类元素必须使用同一尺寸和视觉风格；主次差异通过整组层级或组件状态表达，不能让同组元素无语义地各自变化。
- 同一筛选区、表单区或信息展示区只能选择一种排列方向：筛选区优先水平排列，编辑表单优先垂直排列；禁止同一区域混用“标签在上、内容在下”和“标签内容同行”两种布局。

### 9.5 首屏视觉密度检查

生成完毕后，心理模拟一个 1440×900 的浏览器窗口：
- 首屏（不滚动）应能看到：顶导 + 筛选栏 + 至少一个完整数据模块（指标卡或图表）的全貌。
- 若首屏只能看到顶导+筛选栏+大片灰底 → 说明模块间距过大或首个模块高度过高，需压缩。
