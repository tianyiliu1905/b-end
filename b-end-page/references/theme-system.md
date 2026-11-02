# 主题体系（Theme System）— 双层联动机制与配置总表

> **本文档是主题相关内容的唯一权威来源。** `SKILL.md` 与 `references/style-profile.md` 中涉及主题的表述均只做速记并指向本文件；生成任何涉及主题切换的代码前，必须先读完本文档。

## 0. 核心架构原则

### 0.1 颜色 Token 采用「原子层 + 语义层」两层结构

变量命名与美团官方 `_base_color.scss` 源文件（[km.sankuai.com/collabpage/1961097729](https://km.sankuai.com/collabpage/1961097729)）逐项对齐：

| 层次 | 命名示例 | 对应源文件 | 职责 | 业务代码能否引用 |
|------|----------|------------|------|------------------|
| **原子层** | `--blue-1`、`--grey-7_2`、`--yellow-1` | `$Blue-1`、`$Grey-7_2`、`$Yellow-1` | 纯色板字典，只表达「这是什么颜色的第几级」 | ❌ **禁止直接引用** |
| **语义层** | `--color-primary-1`、`--color-text-4` | `$color-primary-1`、`$color-text-4` | 表达「这个颜色在界面里扮演什么角色」，值引用原子层 | ✅ 只能用这层 |

两层结构的核心价值：色值只维护一份（改一个色阶，所有引用它的语义角色自动跟随），且「主题切换」的本质被显式表达为「同一批语义变量在不同主题下引用不同色系的原子层」，而不是「把一堆色值重新算一遍再塞进去」。

> ⚠️ **最容易踩坑的点：`--color-primary-N` 的编号不是按深浅递增排列的。** 蓝色主题的语义直接来自官方源文件（`$color-primary-1~5` 引用 `$Blue-*`）；黄色主题按同样的取阶规律从 `$Yellow-1~7` 原子层推导（详见下方说明）：
>
> | 变量 | 语义 | 蓝色主题取值 | 黄色主题取值 |
> |------|------|--------------|--------------|
> | `--color-primary` | 标准色 | Blue-5 `#166FF7` | Yellow-5 `#FFDD00` |
> | `--color-primary-1` | **hover 态** | Blue-4 `#468DFB` | Yellow-4 `#FFE852` |
> | `--color-primary-2` | **active 态** | Blue-6 `#0E65E8` | Yellow-6 `#F5C800` |
> | `--color-primary-3` | **disabled** | Blue-2 `#BFD8FE` | Yellow-2 `#FFF6B8` |
> | `--color-primary-4` | **浅色背景** | Blue-1 `#F0F6FF` | Yellow-1 `#FFFADB` |
> | `--color-primary-5` | 备用 | Blue-3 `#8FBCFF` | Yellow-3 `#FFEF8A` |
>
> 需要「浅色背景」时用 `--color-primary-4`（**不是** `-1`），需要「hover 态」时用 `--color-primary-1`（**不是** `-4`）。写代码时务必按语义而非编号大小取用。
>
> ⚠️ 黄色主题的取阶规律与蓝色主题完全对称（基准 Y5、hover 浅一级 Y4、active 深一级 Y6、disabled 用 Y2、浅色背景用 Y1、备用用 Y3），但**不是**直接照抄源文件的 `$color-yellow-1~5`（那是一套独立手写的语义态色值，不是 `$Yellow-1~7` 原子层的引用）。本 skill 为保证两套主题取阶逻辑一致，选择从 `$Yellow-1~7` 原子层按同样规律手动推导，而非照搬源文件的 `$color-yellow-*`。

### 0.2 Token 命名与具体主题颜色解耦

语义层中所有随主题变化的变量一律使用中性语义命名（如 `--color-primary`、`--color-brand-primary`），命名本身不包含任何颜色字面量。主题只负责“让这些中性变量指向哪个色系的原子层”，模块系统（L1/L2/L3 各层组件与页面代码）永远只写 `var(--color-brand-primary)`，不关心当前是哪套主题、也不允许按主题名做条件分支。

（原子层变量名包含颜色字面量是合理的——它们本来就是“色板字典”，不表达界面角色，也不被业务代码直接引用。）

### 0.3 主题切换涉及两层，必须联动

| 层级 | 承载物 | 切换方式 | 由谁提供 |
|------|--------|----------|----------|
| **MTD 组件层** | MTD 组件库自身样式（Button/Table/Menu/Sidebar 等所有官方组件的视觉，含选中/hover 态） | 整份 CSS 文件替换（`<link>` 或动态 `import`） | MTD 组件库官方预置 |
| **业务 Token 层** | 本 skill 维护的 `tokens.css`，驱动**非 MTD 原生**的自定义卡片/图表/布局/logo 占位块等元素 | 给 `<html>` 设置 `data-theme` 属性，激活 CSS 中对应的覆盖块 | 本 skill 的 tokens.css（见 §2） |

两层必须由**同一个主题配置对象**驱动，禁止只切一层：只换 MTD CSS 不同步 `tokens.css`，会导致官方组件变色而自定义卡片/图表还是旧主题色，视觉割裂；反之同理。

> ⚠️ **边界铁律：业务 Token 层不覆盖 MTD 组件内部默认样式。** 禁止用 `:deep()` / `::v-deep` 等穿透选择器把 `--color-brand-primary` 等业务 token 写进 MTD 组件内部的 class（如 `.mtd-prime-menu-item-selected`、`.mtd-menu-item-title` 等），这类元素的颜色必须完全交给 MTD 官方主题 CSS 决定。业务 token 只允许作用于**本 skill 自己产出的、非 MTD 组件渲染的元素**（自定义卡片、图表、logo 占位块、手写 `router-link` 菜单等）。这样组件内部渲染永远只有 MTD CSS 一个样式源头，避免"业务 token 联动 + MTD CSS 联动"两条链路互相打架或不同步。

---

## 1. 当前支持的主题清单

| 主题 key | 名称 | 主色 | MTD 预置 CSS 包 | 选型规则 |
|----------|------|------|-----------------|----------|
| `primary` | 工具蓝（默认） | `#166FF7` | `index.css` | **默认主题**，除非用户明确指定，一律用这套 |
| `brand-yellow` | 美团黄 | `#FFDD00` | `theme-yellow.css` | 仅当用户**明确要求**黄色/美团黄主题时切换 |

> MTD 组件库实际还提供 `leez-yellow.css`（品牌黄）、`leez-blue.css`（LEEZ 蓝）、`leez-huixiao-blue.css`（慧销蓝）等预置包，可按同样模式扩展进下面的主题配置表，本 skill 当前默认只落地 `primary` / `brand-yellow` 两套，其余按需追加（见 §5 新增主题）。
>
> 上表「主色」列仅供速览识别主题，**每套主题下全部 Token 的完整取值**见 `references/theme-examples/tokens.css`（含原子层 + 语义层全量）+ `references/theme-examples/tokens.brand-yellow.overrides.css`（`brand-yellow` 的 `data-theme` 覆盖块），详见 §2。

---

## 2. 主题配置表（MTD 层 + Token 层取值）

> 📄 **Token 具体取值不在本文件内维护，统一收敛到两份可直接复制的 CSS 文件**，本节只描述"去哪查、怎么用"：
>
> - `references/theme-examples/tokens.css` —— **完整** Token 文件，含原子层（`--blue-1~6`、`--grey-1~10` 等色板字典）+ 语义层（`--color-primary-*`、`--color-text-*` 等）+ 不随主题变化的间距/圆角/阴影等，可直接复制为项目的 `src/styles/tokens.css`（React）或 `src/assets/tokens.css`（Vue3），CSS 自定义属性语法两端完全一致，不需要区分框架版本。
> - `references/theme-examples/tokens.brand-yellow.overrides.css` —— 黄色主题的 **`html[data-theme='brand-yellow']` 覆盖块**，直接追加到项目 `tokens.css` 末尾即可。它只重新指定 6 行「语义层 → 原子层」的引用关系（`--color-primary` 及 `-1~5` 改指 Yellow 系）+ `--color-heading-accent` 降级为橙色，**不引入任何新色值**。其余变量（图表色阶、导航底色、链接色等）因为都是引用 `--color-primary-*` 的，会自动跟随联动，不需要逐个枚举。
>
> 生成或修改涉及具体色值的代码时，直接在这两份 CSS 文件里搜索变量名取值，不需要再去 markdown 表格里找，也不需要在本文档里重复维护一份取值表（避免多处维护导致数值漂移）。

### 2.1 MTD 组件层：CSS 包路径

React（`@ss/mtd-react3`）：

```js
// primary（默认）
import '@ss/mtd-react3/lib/style/index.css';        // 默认色 #166FF7

// brand-yellow
import '@ss/mtd-react3/lib/style/theme-yellow.css'; // 美团黄 #FFDD00
```

Vue3（`@ss/mtd-vue3` / 项目内对应包名以实际依赖为准）：

```js
// primary（默认）
import '@ss/mtd-vue3/lib/style/index.css';

// brand-yellow
import '@ss/mtd-vue3/lib/style/theme-yellow.css';
```

> 两端包名前缀不同（`mtd-react3` / `mtd-vue3`），文件名（`index.css` / `theme-yellow.css`）一致，接入时以项目实际安装的包为准。

### 2.2 业务 Token 层：取值来源

Token 变量的具体取值统一维护在 `references/theme-examples/tokens.css`（原子层 + 语义层全量取值）+ `references/theme-examples/tokens.brand-yellow.overrides.css`（黄色主题 `data-theme` 覆盖块），见本节开头的路由说明，此处不再重复列出取值表。

几条容易被忽略的联动关系，仍在此提示（具体数值以上述 CSS 文件为准）：

- `--nav-active-color` / `--nav-active-bg` 仅用于非 MTD 自定义导航元素（如顶导手写菜单），引用 `--color-brand-primary` / `--color-primary-4`（浅色选中底色），**不覆盖 MTD Sidebar/Menu 组件内部**，联动无需单独维护；
- `--chart-1` 引用 `--color-brand-primary`，随主题联动；`--chart-2..7` 共 6 色固定不变，不随主题变化，完整 7 色分类色板取值见 `style-profile.md` §6；
- `--chart-primary-strong` 引用 `--color-primary-2`（active 色阶，最深），`--chart-primary-weak` 引用 `--color-primary-5`（备用色阶），两者都随主题自动联动，不需要在 overrides 里单独声明；
- `--chart-up` / `--chart-down` 固定不随主题变化；
- `--color-heading-accent` 见下方 §2.3 专门说明；
- `--color-accent`（`#FFDD00` 美团黄点缀色，取 `--yellow-5`）**固定不随主题变化**，与主色阶体系是两套独立变量，任何主题下都保持 `#FFDD00`，浅底文字/线性控件用途改用 `--color-accent-text`（`--yellow-7` = `#7A3100`，官方黄底强调文字专用深棕色）。这是刻意设计：即使整体主题切到黄色（`brand-yellow`，主色也变成 `#FFDD00`），点缀色语义仍然独立存在，不产生耦合。

### 2.3 标题类文本强调色规则（`--color-heading-accent`）——重要

**页面标题、重要标题等大号文字元素做「强调色」处理时（如渐变字、强调 `<span>`、标题装饰色），一律使用 `--color-heading-accent`，禁止直接使用 `--color-brand-primary` 做文字颜色。**

原因：`--color-brand-primary` 在 `brand-yellow` 主题下取值是 `#FFDD00`（美团黄），这是一个高亮度、低对比度的颜色，直接作为大号文字颜色（尤其是配合白色/浅色背景，或用于 `background-clip: text` 渐变字）会导致文字可读性显著下降，属于色彩误用。因此标题强调场景需要一层独立于 `--color-brand-primary` 的语义 token：

- **蓝色主题（`primary`）**：`--color-heading-accent` = `--color-brand-primary`（`#166FF7`），与主色保持一致，视觉不变；
- **黄色主题（`brand-yellow`）**：`--color-heading-accent` 显式覆盖为 `#FF7700`（橙色，功能色 Orange-5），不跟随主色变成 `#FFDD00`，保证标题文字在黄色主题下依然清晰可读。注意这个值现在**不再**等于 `--color-accent-text`（后者已改为 `--yellow-7` = `#7A3100`），二者是两个独立维护的深色调，恰好都用于解决黄色背景/主色下的可读性问题，但取值不同、用途也不同（前者是标题强调色，后者是点缀色配套文字色）。

适用范围：页面 H1/H2 级别标题的强调片段、Hero 区域大标题渐变色、卡片/分区标题里需要"点题"的强调文字。**不适用**于：按钮、图标、边框、Tag 底色等非文字类强调（这些场景仍然使用 `--color-brand-primary`，因为 MTD 组件层与业务 Token 层的按钮/控件配色已经由主题 CSS 统一处理，不存在可读性问题）。

CSS 用法示例：

```css
.heroTitleAccent {
  background: linear-gradient(135deg, var(--color-heading-accent), color-mix(in srgb, var(--color-heading-accent) 60%, white));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 3. 两层联动的技术实现

**本 skill 采用 `data-theme` CSS 属性选择器方案，不采用 JS 运行时 `setProperty()` 逐条覆写变量的方案。** 原因：

- 所有颜色决策都留在 CSS 里，不需要在 JS 代码里维护一份与 CSS 重复的值表，根绝两处取值漂移的风险；
- 新增主题只需要新增一个 `[data-theme]` CSS 块，不需要同步改 JS 配置对象里的值表；
- 浏览器原生支持 CSS 属性选择器的级联与优先级计算，不需要手写代码去保证覆盖顺序。

切换主题时依次做两件事（具体实现见下方 §4/§5 中的 `applyMtdCss()` / `applyThemeAttr()`）：

1. **动态加载 MTD 主题 CSS**：通过一个固定 id 的 `<link id="mtd-theme-css">` 元素，将其 `href` 换成新主题对应的 CSS 产物 URL（通过 `import('xxx.css?url')` 拿到打包后的真实路径，避免直接静态 `import` CSS 模块导致所有主题 CSS 都被打进首屏包）；
2. **切换 `data-theme` 属性**：默认主题直接 `document.documentElement.removeAttribute('data-theme')`（回归 `tokens.css` 里的默认声明），其他主题调用 `setAttribute('data-theme', key)`，CSS 中 `html[data-theme='brand-yellow'] { ... }` 选择器自动生效，重新指定语义层变量引用的原子层。

这样只需要维护一份 `tokens.css`（写默认主题 `primary` 的取值）+ 一份 `[data-theme]` 覆盖块（只重写少量语义层引用），而不需要为每套主题各写一份完整的 tokens css 文件，也不需要在 JS 里维护任何颜色值，新增主题的成本被压缩到"CSS 里加一个 `[data-theme]` 块 + 配置表里加一条 `swatch` 记录"。

具体的 React / Vue3 独立主题入口文件见 `references/theme-examples/theme.react.tsx` 与 `references/theme-examples/theme.vue3.ts`，速览版见下方 §4/§5。

---

## 4. React 主题入口参考实现（ThemeProvider 模式）

**完整可直接复制的独立文件**：`references/theme-examples/theme.react.tsx`。核心结构：

```tsx
// 1. 主题配置表（新增主题只改这里）：key + label + swatch（仅供主题切换器 UI 的色点显示，不参与页面样式） + loadMtdCssUrl（动态 import CSS 并返回产物 URL）
export const themes: Record<ThemeKey, ThemeConfig> = { primary: {...}, 'brand-yellow': {...} };

// 2. ThemeProvider：应用启动时挂载一次，useEffect 监听 theme 变化，依次做两件事：
//    ① applyMtdCss(config)   —— 第 1 层：更新 <link id="mtd-theme-css"> 的 href 为新主题 CSS 产物 URL
//    ② applyThemeAttr(theme) —— 第 2 层：给 <html> 设置/移除 data-theme 属性，激活 tokens.css 中对应的 [data-theme] 覆盖块

// 3. useTheme()：业务组件内通过 useContext 读取/切换当前主题
```

接入步骤：把 `theme.react.tsx` 拷入项目 `theme/` 目录 → 应用根组件外包一层 `<ThemeProvider>` → 业务组件内用 `useTheme()` 读取 `theme` / 调用 `setTheme(key)` 切换。

> ⚠️ 注意：示例中用动态 `import('xxx.css?url')` 加载 CSS 依赖打包器支持（Vite/Webpack 均可，`?url` 后缀让导入返回字符串 URL 而非 CSS 模块本身，避免所有主题 CSS 都被打进首屏包）。若项目要求首屏即确定主题、避免闪烁（FOUC），可在 `index.html` 中内联一段同步脚本，在 React 挂载前根据 `localStorage` 提前给 `<html>` 打上 `data-theme` 属性（不含 MTD CSS 切换，因为 MTD CSS 体积大不适合内联），细节按项目实际约束调整。

---

## 4.5 主题化半透明色（CSS 文件场景 · `color-mix()` 写法）

业务代码里经常需要「主题色 + 透明度」的半透明色块（如 hover 高亮背景、Tag 底色、卡片强调边框），有两种场景，处理方式不同：

1. **JS/TS 内联样式（`style={{...}}`）**：可以先用 `getComputedStyle` 读到主题色的十六进制字符串，再自己拼接十六进制透明度后缀（如 `#166FF7` + `26` = 15% 透明度），本质是字符串拼接技巧，不依赖新 CSS 特性。
2. **纯 `.css` / CSS Modules 文件**：无法在样式表里执行 JS 读取变量再拼接字符串，必须用 CSS 原生的 `color-mix()` 函数，直接对 CSS 自定义属性做透明度混合，语法如下：

```css
/* 语法：color-mix(in srgb, var(--token) N%, transparent) */
.heroTag {
  background: color-mix(in srgb, var(--color-brand-primary, #166FF7) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-brand-primary, #166FF7) 12%, transparent);
}
.cardTag {
  color: var(--color-brand-primary, #166FF7);
  background: color-mix(in srgb, var(--color-brand-primary, #166FF7) 8%, transparent);
}
```

**要点**：

- `color-mix(in srgb, var(--token) N%, transparent)` 中的 `N%` 就是最终透明度百分比，`var(--token)` 会随主题切换实时联动，因此混合出的半透明色也会随主题正确变化——这是 `color-mix()` 相比"字符串拼接十六进制透明度后缀"的关键优势：后者只能在 JS 里做一次性计算，前者是 CSS 原生表达式，主题切换时浏览器自动重新计算，不需要额外的 JS 逻辑或事件监听。
- 禁止在 `.css`/`.module.css` 文件里直接写 `rgba(22, 111, 247, 0.06)` 这类与主题色数值重复的十六进制/RGB 字面量——这是最容易被漏查的硬编码点（十进制 RGB 不像 `#166FF7` 那样一眼能认出是主题色），排查时按 `rgba(22,\s?111,\s?247` 等主题色的 RGB 分量做正则搜索。
- 兼容性：`color-mix()` 是现代浏览器（Chrome 111+/Safari 16.2+/Firefox 113+）原生支持的 CSS 函数，B 端管理后台场景通常不需要兼容旧浏览器，可放心使用；如项目明确要求兼容旧浏览器，退回到"每个主题各写一份完整透明度色值"的笨办法，或改造为 JS 内联样式方案。
- 多色（非主题色）的半透明装饰色（如 §7 SCSS 方案之外的绿色/橙色/紫色强调卡片背景）不受此约束——只要那个颜色本身不是"重复某个主题 token 的数值"，直接写 `rgba(0,168,84,0.03)` 这类字面量是允许的，因为它不需要跟随主题变化。

---

## 5. Vue3 主题入口参考实现（组合式函数模式）

**完整可直接复制的独立文件**：`references/theme-examples/theme.vue3.ts`。核心结构：

```ts
// 1. 主题配置表（与 React 版共享同一份数据结构思路）：key + label + swatch + loadMtdCssUrl
export const themes: Record<ThemeKey, ThemeConfig> = { primary: {...}, 'brand-yellow': {...} };

// 2. 全局单例 ref(theme) + applyTheme()：模块加载时立即应用一次，watch(theme) 监听切换，依次做两件事：
//    ① applyMtdCss(config)   —— 第 1 层：更新 <link id="mtd-theme-css"> 的 href
//    ② applyThemeAttr(key)   —— 第 2 层：给 <html> 设置/移除 data-theme 属性

// 3. useTheme()：组合式函数，业务组件内 const { theme, setTheme } = useTheme() 读取/切换
```

接入步骤：把 `theme.vue3.ts` 拷入项目 `theme/` 目录 → `main.ts` 中 `import './theme/useTheme'` 触发初始主题应用 → 业务组件内用 `useTheme()` 读取 `theme` / 调用 `setTheme(key)` 切换。

---

## 6. 新增主题（扩展指南）

新增一套主题时，**只需要**：

1. 在 §1 主题清单表新增一行（key、名称、主色、MTD CSS 包路径、选型规则）；
2. 如果新主题需要引用一套新的原子色板，先在 `tokens.css` 原子层补充对应色阶变量（参照已有的 `--blue-*`/`--yellow-*` 命名风格）；
3. 新增一份 `references/theme-examples/tokens.<主题key>.overrides.css` 文件（参照 `tokens.brand-yellow.overrides.css` 的格式，用 `html[data-theme='<主题key>'] { ... }` 包裹，只重新指定语义层变量引用哪套原子色阶，不写新色值字面量）；
4. 在 `references/theme-examples/theme.react.tsx` 与 `theme.vue3.ts` 的 `themes` 配置对象里新增一条对应记录（`key`/`label`/`swatch`/`loadMtdCssUrl`），`swatch` 取该主题的标准色。

**不需要**改动任何业务组件代码、L1/L2 模块文档、`tokens.css` 的变量结构——因为业务代码只认变量名，不认具体主题。

---

## 7. 自定义非预置主题色（SCSS 覆盖方案）

当用户口述了非预置主题色（如"我们系统是绿色的""主题色改成 #FFC300"），或存量扫描检测到项目已有自定义主题时，MTD 组件层无法通过简单换 CSS 文件解决（因为该颜色没有对应的官方预置包），需要走 SCSS 变量覆盖编译：

```scss
/* custom-theme.scss */
/* 必须修改图标字体路径 */
$icon-font-path: '~@ss/mtd-react3/lib/style/fonts';
/* 主题色及其衍生色阶 */
$color-primary: #FFC300;
$color-primary-1: #FFE17A;  /* 浅色衍生 */
$color-primary-2: #D59500;  /* 深色衍生 */
/* 引入 MTD 完整样式（用 scss 而非 css，才能应用上面的变量覆盖） */
@import '~@ss/mtd-react3/lib/style/index.scss';
```

然后在入口文件中用 `import './custom-theme.scss'` 替换默认的 `import '@ss/mtd-react3/lib/style/index.css'`。完整变量列表见 [MTD _var.scss](https://dev.sankuai.com/code/repo-detail/ss/mtd-react-next/file/detail?path=components%2Fstyle%2Fcommon%2F_var.scss)。

**同步业务 Token 层**：自定义主题色确定后，先在 `tokens.css` 原子层补充对应色阶，再新增一份 `tokens.<custom>.overrides.css`（见上方 §6 步骤），并在 `themes` 配置对象里新增对应记录（`swatch` 取自定义主色），`loadMtdCssUrl` 改为加载自定义 SCSS 编译产物而非预置 CSS 包，架构上与预置主题完全一致，不需要额外分支逻辑。

> ⚠️ **主题色变更必须在 Design Spec 中明确标注**（见 `SKILL.md` §7 步骤 6），说明主题色来源与适配依据后直接生成代码，无需等待确认。SCSS 自定义主题需要项目支持 SCSS 编译（Vite 开箱即用，Webpack 需配置 `sass-loader`）。

---

## 8. 迁移说明（历史命名 → 现行命名）

Token 体系经历过两次改造，存量项目迁移时需要分清自己处于哪个阶段。

### 8.1 第一次改造：颜色语义命名 → 中性命名（早期版本）

| 旧命名（已废弃） | 新命名（中性） |
|-----------------|----------------|
| `--color-brand-blue` | `--color-brand-primary` |
| `--color-brand-yellow` | `--color-accent`（注意：语义不完全等价，`--color-accent` 是固定不随主题变化的点缀色，而不是"黄色主题的主色"） |
| `--color-blue-1` | `--color-primary-1` |
| `--color-blue-4` | `--color-primary-4` |
| `--color-blue-6` | `--color-primary-6` |
| `--chart-blue-strong` | `--chart-primary-strong` |
| `--chart-blue-weak` | `--chart-primary-weak` |
| `chartBlueRamp()` | `chartPrimaryRamp()` |

### 8.2 第二次改造：单层中性命名 → 原子层 + 语义层，并对齐官方 `_base_color.scss`（当前版本）

这次改造解决的问题：第一次改造后的 `--color-primary-1/4/6` 虽然名字中性了，但**取值本身仍是团队自定的一套数字**，与美团官方设计规范源文件的编号、语义都不一致（例如官方 `-1` 是 hover 态，而旧方案 `-1` 是浅色背景）。本次改造把所有色值改为直接对齐官方源文件，并拆出原子层承载纯色板。

| 旧命名/语义（已废弃） | 新命名/语义（当前） | 说明 |
|-----------------------|----------------------|------|
| `--color-primary-1`（浅色背景，自定义值 `#F0F6FF`） | `--color-primary-4`（浅色背景，官方 Blue-1 `#F0F6FF`） | 编号变了，取值恰好相同，但语义来源变成官方 |
| `--color-primary-4`（hover，自定义值 `#468DFB`） | `--color-primary-1`（hover，官方 Blue-4 `#468DFB`） | 编号变了，取值相同 |
| `--color-primary-6`（active，自定义值 `#0E65E8`） | `--color-primary-2`（active，官方 Blue-6 `#0E65E8`） | 编号变了，取值相同 |
| （无对应，此前没有 disabled 专用 token） | `--color-primary-3`（disabled，官方 Blue-2 `#BFD8FE`） | 新增 |
| （无对应） | `--color-primary-5`（备用，官方 Blue-3 `#8FBCFF`） | 新增 |
| `--chart-primary-strong`（引用 `--color-primary-6`） | `--chart-primary-strong`（引用 `--color-primary-2`） | 变量名不变，内部引用的编号变了 |
| （无原子层概念，色值直接写在语义变量里） | `--blue-1~6`、`--yellow`/`--yellow-1~5`、`--grey-1~10` 等原子层 | 新增一层纯色板字典，语义层改为 `var()` 引用原子层，不再是硬编码色值 |
| 主题切换：JS `document.documentElement.style.setProperty()` 逐条覆写 | 主题切换：`<html data-theme="brand-yellow">` + CSS `[data-theme]` 选择器覆盖块 | 见 §3 |
| `ThemeConfig.tokens: ThemeTokens`（JS 值表） | `ThemeConfig.swatch: string`（仅 UI 色点用） | `theme.react.tsx` / `theme.vue3.ts` |
| `loadMtdCss: () => Promise<unknown>`（直接 import CSS 模块） | `loadMtdCssUrl: () => Promise<string>`（import 返回产物 URL，配合 `<link>` 切换） | 同上 |

**迁移要点**：存量项目里所有 `--color-primary-1` 用于"浅色背景"语义的地方，必须改成 `--color-primary-4`；所有 `--color-primary-4` 用于"hover"语义的地方，必须改成 `--color-primary-1`；所有 `--color-primary-6` 用于"active"语义的地方，必须改成 `--color-primary-2`。**禁止只做字符串替换，必须逐处确认原来的视觉意图（hover/active/浅色背景/disabled）再按 §0.1 的映射表选择新编号**，因为编号顺序发生了变化，机械替换会导致颜色语义错位（例如把 hover 态误改成浅色背景态）。
