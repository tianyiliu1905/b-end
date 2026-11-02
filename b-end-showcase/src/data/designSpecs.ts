/**
 * Design Spec 数据映射
 *
 * 结构：moduleId → { summary, baseSpec, variants: { variantName → variant spec } }
 * 每个 spec 是一段 Markdown 文本，包含：布局、视觉规格（含具体像素值，不是只写 token 名）、
 * 数据结构、颜色 token 对照表（两套主题的具体色值）、代码骨架。
 *
 * 设计目标：Spec 必须能被直接复制粘贴给任意 Agent/团队并复刻出与本站点一致的样式，
 * 因此每条视觉规格都同时给出「CSS 变量写法」与「两套主题下的具体色值」，
 * 不能只写「用主色」这种模糊描述，避免使用方因缺少 token 定义而复刻失败。
 *
 * 供 ModuleWrapper（模块 Tooltip）与 VariantSwitcher（模块详情页）的
 * 「复制 Design Spec」按钮共用。
 */

export interface DesignSpec {
  /** 模块简介（一行文字） */
  summary: string;
  /** 完整 Design Spec Markdown（通用部分，不含变体差异） */
  baseSpec: string;
  /** 各变体的差异 spec（若无变体则为空对象） */
  variants: Record<string, string>;
}

/* ═══════════════════════════════════════════════════════════════
   通用片段：Design Token 对照表
   ─────────────────────────────────────────────────────────────
   附加在每条 spec 末尾，保证拿到 spec 的一方即使不访问本站点，
   也能知道每个 CSS 变量在「工具蓝」「美团黄」两套主题下分别是什么颜色，
   从而照抄样式不会因为变量未定义而失败。
   ═══════════════════════════════════════════════════════════════ */
const TOKEN_APPENDIX = `
### Design Token 对照表（两套主题，直接复制到项目 :root 使用）

\`\`\`css
:root {
  /* 主色语义层（工具蓝主题，默认） */
  --color-primary: #166FF7;        /* 标准色 */
  --color-primary-1: #468DFB;      /* 主色 hover */
  --color-primary-2: #0E65E8;      /* 主色 active */
  --color-primary-3: #BFD8FE;      /* 主色 disabled */
  --color-primary-4: #F0F6FF;      /* 主色浅底背景 */
  --color-primary-5: #8FBCFF;      /* 备用 1 */
  --color-brand-primary: var(--color-primary);   /* 品牌色别名，用于 border/background/icon（非文字） */
  --color-heading-accent: var(--color-primary);  /* 主色「文字」专用入口：标题/链接/激活态文字必须引用这个，而不是上面的 --color-primary，见下方约束 */

  /* 中性文字色 */
  --text-1: #111925;                    /* 一级标题/强调数字 */
  --text-2: rgba(17,25,37,0.85);        /* 正文 */
  --text-3: rgba(17,25,37,0.65);        /* 次要说明 */
  --text-4: rgba(17,25,37,0.45);        /* 弱化辅助文字 */

  /* 功能色 */
  --color-success-1: #00A854;   /* 绿色，正向 */
  --color-warning-1: #FF7700;   /* 橙色，警示/次强调 */
  --color-danger-1: #FF1F1F;    /* 红色，仅极端异常场景使用，慎用 */

  /* 背景/边框 */
  --bg-page: #F3F3F4;
  --bg-card: #FFFFFF;
  --bg-card-inner: #F8F8F8;
  --border: rgba(17,25,37,0.15);
  --divider: rgba(17,25,37,0.10);

  /* 字号行高 */
  --fs-12: 12px; --lh-12: 20px;
  --fs-14: 14px; --lh-14: 22px;
  --fs-16: 16px; --lh-16: 24px;
  --fs-18: 18px; --lh-18: 26px;
  --fs-20: 20px; --lh-20: 28px;
  --fs-24: 24px; --lh-24: 32px;
  --fs-30: 30px; --lh-30: 38px;
  --fw-regular: 400; --fw-medium: 500; --fw-semibold: 600;

  /* 间距 */
  --gap-elem: 8px;      /* 元素间距 */
  --gap-module: 8px;    /* 模块间距 */
  --gap-section: 24px;  /* 区块间距 */
  --gap-page: 16px;     /* 页面级间距 */
  --card-padding: 16px; /* 卡片内边距，dash-card 统一用这个，不要各处硬编码不同数值 */

  /* 圆角 */
  --radius-1: 16px; --radius-2: 10px; --radius-3: 6px; --radius-4: 4px;
  --radius: var(--radius-3);   /* 卡片默认圆角 */

  /* 阴影（卡片默认极轻阴影，不用重阴影） */
  --shadow-card: 0 2px 6px rgba(0, 0, 0, .08);

  /* 图表 7 色分类色板：主题色 → 绿 → 橙 → 蓝绿 → 紫 → 粉 → 棕 */
  --chart-1: var(--color-brand-primary);
  --chart-2: #00A854;
  --chart-3: #FF7700;
  --chart-4: #00A3A3;
  --chart-5: #882EFF;
  --chart-6: #EB2F93;
  --chart-7: #9E7549;
  --chart-primary-weak: var(--color-primary-5);   /* 单色色阶 Blue-3，随主题联动 */
  --chart-primary-strong: var(--color-primary-2); /* 单色色阶 Blue-6，随主题联动 */
  --chart-up: #FF1F1F;    /* 涨跌色固定，不随主题变化 */
  --chart-down: #00A854;
}

/* 美团黄主题覆盖（<html data-theme="brand-yellow">时生效，只切语义层→原子层引用，不改变量名） */
html[data-theme='brand-yellow'] {
  --color-primary: #FFDD00;        /* Yellow-5 */
  --color-primary-1: #FFE852;      /* Yellow-4 hover */
  --color-primary-2: #F5C800;      /* Yellow-6 active */
  --color-primary-3: #FFF6B8;      /* Yellow-2 disabled */
  --color-primary-4: #FFFADB;      /* Yellow-1 浅底背景 */
  --color-primary-5: #FFEF8A;      /* Yellow-3 备用 */
  /* ⚠️ 黄色饱和度高不适合直接做文字色，--color-heading-accent 改指向 Orange-5，
     而不是 Yellow-5，这是本项目色彩策略的核心约束，见下方"约束"章节 */
  --color-heading-accent: #FF7700;
}
\`\`\`

### ⚠️ 颜色使用约束（必须遵守，否则黄色主题下文字不可读）
1. **文字颜色**（CSS \`color\` 属性，包括标题、链接、Tab 激活态文字、导航激活态文字、数据高亮文字等一切"字"）**必须引用 \`var(--color-heading-accent)\`**，禁止直接引用 \`var(--color-primary)\` 或 \`var(--color-brand-primary)\`。原因：黄色主题下 \`--color-primary\` = \`#FFDD00\`（高饱和纯黄），直接做文字色可读性极差；而 \`--color-heading-accent\` 在黄色主题下被专门覆盖为 \`#FF7700\`（橙色），可读性良好。
2. **非文字场景**（\`border-color\`、\`background\`、图标 \`<Icon>\` 颜色、Tag/Button 底色等）继续使用 \`var(--color-brand-primary)\` 或 \`var(--color-primary)\`，可以正常呈现主题色（蓝或黄），不受上述约束限制。
3. Tag/Table 状态色策略：颜色不超过 3 种（蓝 + 绿 + 橙），慎用红色，仅极端异常状态使用 danger 色，普通负面状态用 orange 替代。`;

/* ═══════════════════════════════════════════════════════════════
   通用片段：D-2~D-15 图表卡片类模块共享的「5 型头部」变体规格
   ─────────────────────────────────────────────────────────────
   这批模块的差异只在 Card header 右侧控件，body（图表本身）不变，
   用统一函数生成，保证 5 个变体的 spec 措辞、像素值完全一致，不会因手写产生偏差。
   ═══════════════════════════════════════════════════════════════ */
type HeaderVariantName = '操作型' | '筛选型' | '筛选（复杂）' | '描述型' | '纯净型';

function headerVariantSpec(name: HeaderVariantName, title: string, opts?: { filterOptions?: string[]; complexOptions?: string[]; descText?: string }): string {
  const filterOptions = opts?.filterOptions || ['本期', '上期'];
  const complexOptions = opts?.complexOptions || ['全部', '选项 A', '选项 B', '选项 C'];
  const descText = opts?.descText || '统计周期：本月';

  const headerRightMap: Record<HeaderVariantName, string> = {
    操作型: `<Button.Link type="primary" shape="text">查看</Button.Link>`,
    筛选型: `<Radio.Group defaultValue="${filterOptions[0]}" size="small">\n  ${filterOptions.map((o) => `<Radio.Button value="${o}">${o}</Radio.Button>`).join('\n  ')}\n</Radio.Group>`,
    '筛选（复杂）': `<Select defaultValue="${complexOptions[0]}" size="small" style={{ width: 110 }}>\n  ${complexOptions.map((o) => `<Select.Option value="${o}">${o}</Select.Option>`).join('\n  ')}\n</Select>`,
    描述型: `<span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>${descText}</span>`,
    纯净型: `{/* 无右侧控件 */}`,
  };

  const desc: Record<HeaderVariantName, string> = {
    操作型: '头部右侧放一个 text 按钮，跳转到该数据的详情/明细页。',
    筛选型: '头部右侧放 Radio.Group（单选按钮组），做简单维度/口径切换，选项数量建议 ≤3 个。',
    '筛选（复杂）': '头部右侧放 Select 下拉选择器，用于选项较多（>3 个）或需要节省横向空间的筛选场景。',
    描述型: '头部右侧放一段辅助说明文字（灰色小字），用于展示统计口径/更新时间等静态描述，不可交互。',
    纯净型: '头部仅有标题，不放任何右侧控件，用于极简/嵌套在别的容器里的场景。',
  };

  return `### 变体头部：${name}

${desc[name]}

#### 视觉规格
| 属性 | CSS 变量写法 | 工具蓝主题实际值 | 美团黄主题实际值 |
|------|------|------|------|
| Card 外边距 | \`marginBottom: 0\` | 0 | 0 |
| Header 高度 | 固定 32px（\`.card-title-bar { height: 32px }\`） | 32px | 32px |
| Header 布局 | \`display: flex; justify-content: space-between; align-items: center\` | — | — |
| 标题字号 | \`fontSize: var(--fs-14)\` 默认继承 Card header 字号 | 14px | 14px |
| 标题左侧竖条装饰 | \`.card-title-bar > span:first-child::before\`：width 3px, height 14px, border-radius 2px | \`background: var(--color-brand-primary)\` → #166FF7 | → #FFDD00 |
| Header 与 Body 间距 | \`.mtd-prime-card-header { padding-bottom: 8px }\`，Body 紧贴 Header 无额外 padding-top | 8px | 8px |
| Card 内边距 | MTD Card 组件默认 \`padding: 16px\` | 16px | 16px |
| Card 圆角 | \`border-radius: var(--radius-3)\` | 6px | 6px |
| Card 阴影 | \`box-shadow: var(--shadow-card)\` | 0 2px 6px rgba(0,0,0,.08) | 同左（阴影不随主题变化） |
| Body 区域高度 | \`.card-body-area { height: 200px }\`（同行卡片保证图表等高） | 200px | 200px |

#### 代码骨架 (React + MTD)
\`\`\`tsx
<Card
  className="chart-card"
  style={{ marginBottom: 0 }}
  header={
    <div className="card-title-bar">
      <span>${title}</span>
      ${headerRightMap[name]}
    </div>
  }
>
  <div className="card-body-area">
    {/* 图表/正文内容，见下方模块专属规格 */}
  </div>
</Card>
\`\`\`

\`\`\`css
/* 依赖的全局工具类（需在项目全局 CSS 中声明一次，所有 5 型头部变体共用） */
.card-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
}
.card-title-bar > span:first-child {
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-title-bar > span:first-child::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--color-brand-primary);
  flex-shrink: 0;
}
.card-body-area {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
}
\`\`\`
${TOKEN_APPENDIX}`;
}

function buildHeaderVariantSpecs(title: string, opts?: { filterOptions?: string[]; complexOptions?: string[]; descText?: string; order?: HeaderVariantName[] }): Record<string, string> {
  const order = opts?.order || ['操作型', '筛选型', '筛选（复杂）', '描述型', '纯净型'];
  const result: Record<string, string> = {};
  for (const name of order) {
    result[name] = headerVariantSpec(name, title, opts);
  }
  return result;
}

/* ═══════════════════════════════════════════════════════════════
   模块 Spec 数据
   ═══════════════════════════════════════════════════════════════ */
const designSpecs: Record<string, DesignSpec> = {

  /* ═══════════════════════════ G-1+G-2 顶导+侧导 ═══════════════════════════ */
  'G-1+G-2': {
    summary: '顶导(G-1)+侧导(G-2)一体化布局模板，Logo+Tabs+操作区，多级 Menu 可折叠。',
    baseSpec: `## G-1+G-2 顶导+侧导 Layout

页面整体外壳：顶部导航（Logo + 一级 Tabs + 右侧操作区）+ 左侧多级折叠菜单 + 右侧内容区。

### 布局结构
\`\`\`
┌──────────────────────────────────────────────────────────┐
│ [Logo] 概览  门店管理  数据分析              [头像]         │  ← 顶导 48px
├───────────┬──────────────────────────────────────────────┤
│ 门店列表   │                                              │
│ 区域管理   │              页面内容区域                     │
│ 品牌管理   │                                              │
│ 合同管理   │                                              │
└───────────┴──────────────────────────────────────────────┘
   侧导 140~168px         内容区 flex:1
\`\`\`

### 视觉规格
| 属性 | CSS 变量写法 | 工具蓝实际值 | 美团黄实际值 |
|------|------|------|------|
| 顶导高度 | \`--nav-header-height: 52px\`（本预览用 48px 简化演示） | 48~52px | 48~52px |
| 顶导背景 | \`background: #fff\` | #FFFFFF | #FFFFFF |
| 顶导底部分割线 | \`border-bottom: 1px solid rgba(17,25,37,0.07)\` | — | — |
| Logo 方块 | 28×28px, \`border-radius: 6px\`, \`background: var(--color-brand-primary)\` | #166FF7 | #FFDD00 |
| Tabs 激活态文字 | \`color: var(--color-heading-accent)\`（注意用 heading-accent 不用 brand-primary） | #166FF7 | #FF7700（橙，非纯黄） |
| Tabs 激活态下划线 | \`border-bottom: 2px solid var(--color-brand-primary)\` | #166FF7 | #FFDD00 |
| Tabs 未激活文字 | \`color: var(--text-2)\` | rgba(17,25,37,.85) | 同左 |
| 侧导宽度 | \`--nav-width: 168px\`（本预览用 140px） | 140~168px | 同左 |
| 侧导折叠宽度 | \`--nav-collapsed-width: 60px\` | 60px | 60px |
| 侧导背景 | \`background: #fafafb\` | #FAFAFB | #FAFAFB |
| 侧导内边距 | \`padding: 12px 8px\` | 12px 8px | 同左 |
| 菜单项高度/圆角 | \`padding: 8px 12px; border-radius: 6px\` | — | — |
| 菜单项激活态背景 | \`background: color-mix(in srgb, var(--color-brand-primary) 10%, transparent)\` | 10% 透明蓝 | 10% 透明黄 |
| 菜单项激活态文字 | \`color: var(--nav-active-color)\`（= \`--color-heading-accent\`） | #166FF7 | #FF7700 |
| 菜单 icon | 16px，线性(-o)风格，一级菜单必带图标 | — | — |
| 内容区背景 | \`background: var(--bg-page)\` | #F3F3F4 | 同左 |
| 内容区内边距 | \`padding: 16px\`（= \`--gap-page\`） | 16px | 16px |

### 约束
1. 一级菜单必带 icon（\`-o\` 线性风格），折叠态由 MTD \`Menu\` 组件的 \`inlineCollapsed\` 属性驱动
2. 菜单激活态文字颜色使用 \`--nav-active-color\`（已在 tokens.css 中定义为 \`var(--color-heading-accent)\`），黄色主题下自动呈现橙色而非纯黄

### 代码骨架 (React + MTD)
\`\`\`tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
  {/* 顶导 */}
  <header style={{ height: 52, background: '#fff', borderBottom: '1px solid rgba(17,25,37,0.07)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-brand-primary)' }} />
    <Tabs defaultActiveKey="overview" type="line">
      <Tabs.TabPane key="overview" label="概览" />
      <Tabs.TabPane key="store" label="门店管理" />
      <Tabs.TabPane key="data" label="数据分析" />
    </Tabs>
    <div style={{ flex: 1 }} />
    <Avatar size={28} />
  </header>
  {/* 侧导 + 内容 */}
  <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
    <Menu style={{ width: 168 }} defaultSelectedKeys={['store-list']}>
      <Menu.Item key="store-list" icon={<Icon type="shop-o" />}>门店列表</Menu.Item>
      <Menu.Item key="region" icon={<Icon type="global-o" />}>区域管理</Menu.Item>
      <Menu.SubMenu key="brand" title="品牌管理" icon={<Icon type="tag-o" />}>
        <Menu.Item key="brand-list">品牌列表</Menu.Item>
      </Menu.SubMenu>
    </Menu>
    <div style={{ flex: 1, background: 'var(--bg-page)', padding: 16, overflow: 'auto' }}>
      {/* 页面内容 */}
    </div>
  </div>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ G-3 看板筛选器栏 ═══════════════════════════ */
  'G-3': {
    summary: '页面顶部全局筛选条，简单版单行 / 复杂版多行分组两种档位。',
    baseSpec: `## G-3 看板筛选器栏 (Dashboard Filter Bar)

页面顶部的全局筛选条，控制整页数据维度。

### 通用视觉规格
| 属性 | CSS 变量写法 | 实际值 |
|------|------|------|
| 容器 | \`.dash-card\`：\`background: var(--bg-card); border-radius: var(--radius-3); padding: var(--card-padding)\` | 背景 #fff，圆角 6px，内边距 16px |
| 内部元素间距 | \`gap: var(--gap-elem)\` = 12px（本组件用 12px 略大于默认 8px，因筛选控件密度较低） | 12px |
| 控件排列 | \`display: flex; align-items: center; flex-wrap: wrap\` | — |
| 日期选择器宽度 | \`width: 240px\` | 240px |
| 下拉选择宽度 | \`width: 140px\` | 140px |
| 搜索框宽度 | \`width: 160px\`，带 \`prefix={<Icon type="search-o" />}\` | 160px |
| 主操作按钮 | \`<Button type="primary">查询</Button>\` | 蓝底白字（跟随主题） |
| 次操作按钮 | \`<Button>重置</Button>\` | 白底黑字线框 |

### 约束
- 右侧固定放"查询/重置"按钮组，用 \`<div style={{ flex: 1 }} />\` 撑开左右两端`,
    variants: {
      简单版: `### 变体：简单版

单行筛选栏，适用于 ≤5 个筛选维度的场景。

\`\`\`
┌────────────────────────────────────────────────────────────────┐
│ [日期范围▾]  [全部区域▾]  [🔍搜索门店名称]        [查询] [重置]  │
└────────────────────────────────────────────────────────────────┘
\`\`\`

#### 代码骨架
\`\`\`tsx
<div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 16px' }}>
  <RangePicker style={{ width: 240 }} />
  <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部区域' }]} />
  <Input style={{ width: 160 }} placeholder="搜索门店名称" prefix={<Icon type="search-o" />} />
  <div style={{ flex: 1 }} />
  <Button type="primary">查询</Button>
  <Button>重置</Button>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
      复杂版: `### 变体：复杂版

多行分组筛选器，适用于 >5 个维度、需要分组或需要"保存为方案"能力的场景。

\`\`\`
┌────────────────────────────────────────────────────────────────┐
│ [日期范围▾] [全部区域▾] [全部品牌▾] [全部渠道▾]                  │
│ [🔍搜索门店名称] [全部状态▾]           [保存为方案] [查询] [重置] │
└────────────────────────────────────────────────────────────────┘
\`\`\`

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 行间距 | \`gap: 10px\`（\`flex-direction: column\`外层容器） |
| 每行内部间距 | \`gap: 12px\`，\`flex-wrap: wrap\` |
| "保存为方案" | \`<Button.Link type="primary" shape="text">\`，放在按钮组最左侧 |

#### 代码骨架
\`\`\`tsx
<div className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
    <RangePicker style={{ width: 240 }} />
    <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部区域' }]} />
    <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部品牌' }]} />
    <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部渠道' }]} />
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
    <Input style={{ width: 160 }} placeholder="搜索门店名称" prefix={<Icon type="search-o" />} />
    <Select style={{ width: 140 }} defaultValue="all" options={[{ value: 'all', label: '全部状态' }]} />
    <div style={{ flex: 1 }} />
    <Button.Link type="primary" shape="text">保存为方案</Button.Link>
    <Button type="primary">查询</Button>
    <Button>重置</Button>
  </div>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    },
  },

  /* ═══════════════════════════ G-4 数据表格 ═══════════════════════════ */
  'G-4': {
    summary: '数据表格，支持纯文字表格、带图片列、带切换tab三种变体。',
    baseSpec: `## G-4 数据表格 (DataTable)

MTD Table 组件，支持排序/分页/固定列/操作列，分页器与表格同属一个 dash-card。

### Tag 颜色策略
- 尺寸 \`size="small"\` + \`type="bordered"\`
- 默认蓝色，\`theme\` 默认值 \`'blue'\`
- 颜色不超过 3 种：蓝(blue) + 绿(green) + 橙(orange)，**慎用红色**
- fallback：\`statusThemeMap[val] || 'blue'\`

### 通用视觉规格
| 属性 | CSS 变量写法 | 实际值 |
|------|------|------|
| 容器 | \`.dash-card\`，\`flex: 1; minHeight: 0; display: flex; flex-direction: column\` | 背景#fff，圆角6px，内边距16px |
| 头部区（标题+操作） | \`display: flex; justify-content: space-between; marginBottom: var(--gap-module)\` | 间距 8px |
| 头部操作区内部间距 | \`gap: var(--gap-elem)\` | 8px |
| 标题字号 | \`fontSize: var(--fs-14); fontWeight: 500; color: var(--text-1)\` | 14px |
| 表格区域 | \`flex: 1; minHeight: 0; overflow: auto\`（保证分页器贴底） | — |
| 表头背景 | \`[class*="mtd-prime-table-head-data"] { background: var(--bg-card-inner) }\` | #F8F8F8 |
| 固定列背景 | \`[class*="mtd-prime-table-cell-sticky"] { background: var(--bg-card) !important }\` | #FFFFFF |
| 固定右侧列阴影 | \`box-shadow: -4px 0 8px rgba(0,0,0,.06)\` | — |
| 分页器 | \`display: flex; justify-content: flex-end; marginTop: var(--gap-module)\` | 8px |
| 操作列按钮 | \`<Button.Link type="primary" shape="text">\`，多于 3 个收进 Dropdown | — |
| 危险操作 | \`<Popconfirm>\` 二次确认 | — |

\`\`\`ts
const statusThemeMap: Record<string, string> = {
  '营业中': 'blue', '装修中': 'orange', '筹备中': 'blue', '已关店': 'orange',
};
// render: (val) => <Tag theme={statusThemeMap[val] || 'blue'} type="bordered" size="small">{val}</Tag>
\`\`\`
${TOKEN_APPENDIX}`,

    variants: {
      纯文字表格: `### 变体：纯文字表格

基础表格 + 排序单选组 + 操作列，字段全部为文字/标签，无图片列。适用于门店明细/合同列表等纯数据场景。

#### 代码骨架
\`\`\`tsx
<div className="dash-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--gap-module)' }}>
    <span style={{ fontSize: 'var(--fs-14)', fontWeight: 500, color: 'var(--text-1)' }}>门店明细</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-elem)' }}>
      <Radio.Group defaultValue="revenue" size="small">
        <Radio.Button value="revenue">按月营收</Radio.Button>
        <Radio.Button value="openDate">按开业日期</Radio.Button>
      </Radio.Group>
      <Button size="small" icon="export-o">导出</Button>
      <Button size="small" type="primary" icon="add">新增门店</Button>
    </div>
  </div>
  <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
    <Table columns={columns} data={data} rowKey="key" pagination={false} useSticky scroll={{ x: 1400 }} />
  </div>
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--gap-module)' }}>
    <Pagination current={current} total={data.length} pageSize={10} onChange={setCurrent} showTotal showJumper />
  </div>
</div>
\`\`\`
${TOKEN_APPENDIX}`,

      带图片列: `### 变体：带图片列

第一列以「缩略图 + 名称 + 副标题」组合展示，用于门店/商品等有视觉素材的列表。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 缩略图尺寸 | 36×36px，\`border-radius: 6px; object-fit: cover\` |
| 图文间距 | \`gap: 10px\` |
| 主名称 | \`fontWeight: 500; fontSize: var(--fs-14)\` |
| 副标题 | \`fontSize: var(--fs-12); color: var(--text-3)\` |

#### 代码骨架
\`\`\`tsx
{
  label: '门店', dataKey: 'name', width: 180,
  render: (_val, row) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src={row.img} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: '#f5f5f5' }} />
      <div>
        <div style={{ fontWeight: 500, fontSize: 'var(--fs-14)' }}>{row.name}</div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{row.city}</div>
      </div>
    </div>
  ),
}
\`\`\`
${TOKEN_APPENDIX}`,

      带切换tab: `### 变体：带切换Tab

表格头部内联 MTD Tabs（line 风格）+ 一行 Tag 快捷筛选，不同 tab/tag 切换不同数据集，共用列结构。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| Tabs 类型 | \`type\` 默认 line 风格 |
| Tag 行间距 | \`gap: 8px; marginTop: 12px; paddingBottom: 12px; flexWrap: wrap\` |
| Tag 选中态 | \`type="pure-bordered"\`，\`theme\` 随全局主题联动：工具蓝主题用 \`theme="blue"\`，美团黄主题用 \`theme="yellow"\` |
| Tag 未选中态 | \`theme="gray"\`（默认 \`type="bordered"\`，灰色线型） |
| ⚠️ 禁止用法 | 选中态禁止使用 \`type="pure"\`（会渲染成深色纯底），必须用 \`type="pure-bordered"\`（浅色面型） |

#### 代码骨架
\`\`\`tsx
const { theme } = useTheme();
const activeTagTheme = theme === 'brand-yellow' ? 'yellow' : 'blue';

<Tabs defaultActiveKey="all">
  <Tabs.TabPane key="all" label="全部" />
  <Tabs.TabPane key="achieved" label="已达成" />
</Tabs>
<div style={{ display: 'flex', gap: 8, marginTop: 12, paddingBottom: 12, flexWrap: 'wrap' }}>
  {labels.map((label) =>
    label === activeFilter ? (
      <Tag key={label} type="pure-bordered" theme={activeTagTheme} style={{ cursor: 'pointer' }} onClick={() => setActiveFilter(label)}>{label}</Tag>
    ) : (
      <Tag key={label} theme="gray" style={{ cursor: 'pointer' }} onClick={() => setActiveFilter(label)}>{label}</Tag>
    )
  )}
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    },
  },

  /* ═══════════════════════════ G-6 分类导航 ═══════════════════════════ */
  'G-6': {
    summary: '左侧固定宽度面板：搜索框+树形分类结构+附加筛选项，联动右侧内容区，常见于"左树右表"类列表页。',
    baseSpec: `## G-6 分类导航 (Category Tree Nav)

左侧固定宽度树形导航面板，用于"左树右表"类列表页。

### 视觉规格
| 属性 | CSS 变量写法 | 实际值 |
|------|------|------|
| 面板宽度 | 固定 240px 左右 | 240px |
| 面板背景 | \`.dash-card\` 白底 | #FFFFFF |
| 与右侧内容间距 | \`gap: var(--gap-module)\` | 8px |
| 树节点选中态背景 | \`background: var(--color-primary-4)\` | #F0F6FF（黄主题下 #FFFADB） |
| 树节点选中态文字 | \`color: var(--color-heading-accent)\` | #166FF7（黄主题下 #FF7700） |
| 搜索框 | 面板顶部，\`<Input prefix={<Icon type="search-o" />} />\` | — |

### 约束
- 树节点选中态联动右侧表格/内容区数据刷新
- 附加筛选项（如状态/类型）放在树形结构下方，与树节点视觉上明确分隔（分割线或间距）

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', gap: 'var(--gap-module)' }}>
  <div className="dash-card" style={{ width: 240, flexShrink: 0 }}>
    <Input placeholder="搜索分类" prefix={<Icon type="search-o" />} style={{ marginBottom: 12 }} />
    <Tree
      data={treeData}
      selectedKeys={[selectedKey]}
      onSelect={(keys) => setSelectedKey(keys[0])}
    />
  </div>
  <div style={{ flex: 1, minWidth: 0 }}>
    {/* 右侧表格/内容区，随左侧选中节点联动刷新 */}
  </div>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ D-1 指标卡片组 ═══════════════════════════ */
  'D-1 指标卡片组': {
    summary: '核心业务指标大数字展示，支持纯大数字、带迷你图、带操作三种变体。',
    baseSpec: `## D-1 指标卡片组 (MetricCards)

核心业务指标大数字展示，通常位于看板顶部，一行 3~6 张卡片，等宽栅格排列。

### 数据结构
\`\`\`ts
interface MetricItem {
  label: string;       // 指标名称
  value: string;       // 大数字（已格式化，如 "¥1,286万"）
  delta: string;       // 环比变化（如 "+12.5%"）
  up: boolean;         // 涨跌方向
}
\`\`\`

### 通用视觉规格
| 属性 | CSS 变量写法 | 实际值 |
|------|------|------|
| 栅格 | MTD \`<Row gutter={[8, 8]}>\` + \`<Col span={6}>\`（4 卡一行） | 间距 8px |
| 卡片 | MTD \`<Card>\`，默认内边距 16px，圆角 6px | — |
| 标签字号 | \`fontSize: 13px; color: var(--text-3)\` | rgba(17,25,37,.5)（注：本组件用 --text-3 的近似值） |
| 标签与大数字间距 | \`marginBottom: 8px\` | 8px |
| 大数字 | \`fontSize: 24px; fontWeight: 600; color: var(--text-1)\` | #111925 |
| 大数字下方间距 | \`marginBottom: 6px\` | 6px |
| 涨跌行 | \`fontSize: 12px; display: flex; align-items: center; gap: 2px\` | — |
| 涨色（up=true） | \`color: var(--chart-down)\`（注意：语义是"涨"用绿色，变量名沿用 chart-down 表示"跌用红涨用绿"的映射） | #00A854 |
| 跌色（up=false） | \`color: var(--chart-up)\` | #FF1F1F |
| 涨跌箭头 | \`<Icon type="arrow-up-o" />\` / \`<Icon type="arrow-down-o" />\`，12px | — |

⚠️ 注意本项目 chartTrend 命名容易误解：\`chartTrend.up\` 实际值是红色（#FF1F1F，用于"跌"场景色），\`chartTrend.down\` 实际值是绿色（#00A854，用于"涨"场景色），使用时以“涨绿跌红”的业务语义为准，不要以变量名字面意思为准。`,

    variants: {
      纯大数字: `### 变体：纯大数字

最简形态，仅展示标签 + 大数字 + 涨跌箭头，无任何图表/操作。

#### 代码骨架
\`\`\`tsx
<Row gutter={[8, 8]}>
  {metrics.map((m) => (
    <Col key={m.label} span={6}>
      <Card>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 8 }}>{m.label}</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>{m.value}</div>
        <div style={{ fontSize: 12, color: m.up ? chartTrend.down : chartTrend.up, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon type={m.up ? 'arrow-up-o' : 'arrow-down-o'} style={{ fontSize: 12 }} />
          {m.delta}
        </div>
      </Card>
    </Col>
  ))}
</Row>
\`\`\`
${TOKEN_APPENDIX}`,

      带迷你图: `### 变体：带迷你图

大数字左侧追加 44×44px 迷你环图（G2 interval + theta 坐标），环图颜色取 7 色分类色板按序分配。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 迷你环尺寸 | 44×44px |
| 环形内半径 | \`innerRadius: 0.75\` |
| 环形配色 | \`range: [color, 'rgba(17,25,37,0.06)']\`，color 取 \`getChartCategoricalPalette(4)[i]\` |
| 图文间距 | \`gap: 10px\` |
| 标签字号 | 12px，\`marginBottom: 4px\` |
| 数字字号 | 18px（比纯大数字变体的 24px 更小，因为多了图形占位） |

#### 代码骨架
\`\`\`tsx
<Card>
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <MiniDonut percent={p} color={palette[i]} />  {/* G2 interval type: 'interval', coordinate theta innerRadius 0.75 */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>{m.label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>{m.value}</div>
    </div>
  </div>
</Card>
\`\`\`
${TOKEN_APPENDIX}`,

      带操作: `### 变体：带操作

标签行右侧追加 text 按钮（"详情"），用于跳转明细页，其余同纯大数字变体。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 顶部行 | \`display: flex; justify-content: space-between; marginBottom: 8px\` |
| 操作按钮 | \`<Button.Link type="primary" shape="text" style={{ fontSize: 12, padding: 0 }}>详情</Button.Link>\` |

#### 代码骨架
\`\`\`tsx
<Card>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
    <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{m.label}</span>
    <Button.Link type="primary" shape="text" style={{ fontSize: 12, padding: 0 }}>详情</Button.Link>
  </div>
  <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>{m.value}</div>
  <div style={{ fontSize: 12, color: m.up ? chartTrend.down : chartTrend.up, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Icon type={m.up ? 'arrow-up-o' : 'arrow-down-o'} style={{ fontSize: 12 }} />
    {m.delta}
  </div>
</Card>
\`\`\`
${TOKEN_APPENDIX}`,
    },
  },

  /* ═══════════════════════════ D-2 环形进度 ═══════════════════════════ */
  'D-2 环形进度': {
    summary: '单一环形/gauge进度 + 大数字，展示年度目标达成率一类的单指标进度。',
    baseSpec: `## D-2 环形进度 (Ring Progress)

单一大号环形进度条（MTD \`Progress type="circle"\`）+ 右侧大数字说明，5 型头部变体。

### 视觉规格
| 属性 | CSS 变量写法 | 实际值 |
|------|------|------|
| 环形直径 | \`width={120}\` | 120px |
| 环形色 | \`color={chartPalette.c1}\`（= \`var(--chart-1)\`，随主题联动） | #166FF7（黄主题 #FFDD00） |
| 图文间距 | \`gap: 20px\` | 20px |
| 说明标签字号 | \`fontSize: 13px; color: var(--text-3); marginBottom: 4px\` | — |
| 大数字字号 | \`fontSize: 28px; fontWeight: 600; color: var(--text-1)\` | — |
| 补充说明字号 | \`fontSize: 12px; color: var(--text-3); marginTop: 4px\` | — |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
  <Progress type="circle" percentage={78} color={chartPalette.c1} width={120} />
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>年度目标达成率</div>
    <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-1)' }}>78%</div>
    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>目标 ¥5,000万 / 已完成 ¥3,900万</div>
  </div>
</div>
\`\`\`

以下为该 body 外层 Card 的 5 型头部变体规格（与其它图表卡片共用同一套头部体系）：`,
    variants: buildHeaderVariantSpecs('年度目标达成率', { filterOptions: ['本年', '本季'], descText: '统计周期：2024 年' }),
  },

  /* ═══════════════════════════ D-2 进度指标 ═══════════════════════════ */
  'D-2 进度指标': {
    summary: '多指标迷你环卡片组，一行展示多个指标各自的完成度。',
    baseSpec: `## D-2 进度指标 (Metrics Progress)

多个迷你环形图并列展示各自完成度，5 型头部变体。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 栅格 | \`<Row gutter={[8, 8]}>\` + \`<Col span={6}>\`（4 项一行） |
| 每项布局 | \`flex-direction: column; align-items: center; gap: 8px\` |
| 迷你环尺寸 | 44×44px |
| 配色 | \`getChartCategoricalPalette(count)\` 按序分配，与 D-1 带迷你图变体共用同一配色策略 |
| 标签字号 | 12px，\`color: var(--text-3)\` |
| 百分比字号 | 16px，\`fontWeight: 600; color: var(--text-1)\` |

### 代码骨架
\`\`\`tsx
<Row gutter={[8, 8]}>
  {metrics.map((m, i) => (
    <Col key={m.label} span={6}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <MiniDonut percent={m.percent} color={palette[i]} />
        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{m.label}</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>{m.percent}%</div>
      </div>
    </Col>
  ))}
</Row>
\`\`\`

以下为该 body 外层 Card 的 5 型头部变体规格：`,
    variants: buildHeaderVariantSpecs('进度指标', { filterOptions: ['本月', '本季'] }),
  },

  /* ═══════════════════════════ D-3 折线图 ═══════════════════════════ */
  'D-3 折线图': {
    summary: '趋势折线图，用于展示时序数据（GMV、订单、流量等）。',
    baseSpec: `## D-3 折线图 (TrendChart)

趋势折线图，ChartCard 外壳 + AntV G2 Line，5 型头部变体。

### 数据结构
\`\`\`ts
{ month: string; value: number; type: string; }[]  // type 区分多系列（如"本期"/"上期"）
\`\`\`

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'line'\` |
| 双系列配色 | \`range: [chartPalette.c1, chartMono.weak]\` = [#166FF7, #8FBCFF]（随主题联动） |
| 线宽 | \`style: { lineWidth: 2 }\` |
| 坐标轴标题 | \`axis: { x: { title: false }, y: { title: false } }\`（不显示轴标题） |
| 图例位置 | \`legend: { color: { position: 'top-right' } }\` |
| 图表高度 | 220px（预览用，实际用 \`.card-body-area\` 200px 容器时会等比缩放） |

### 约束
- 双系列色固定用 Blue-5 + Blue-3（联动主题色 + 其浅色阶），多系列按 7 色分类色板顺序取色

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  scale: { color: { range: [chartPalette.c1, chartMono.weak] } },
  axis: { x: { title: false }, y: { title: false } },
  legend: { color: { position: 'top-right' } },
  style: { lineWidth: 2 },
}), []);
<div ref={ref} style={{ height: 220 }} />
\`\`\`

以下为外层 Card 的 5 型头部变体规格：`,
    variants: buildHeaderVariantSpecs('月度营收趋势', { filterOptions: ['本期', '同比'], descText: '统计周期：近6个月' }),
  },

  /* ═══════════════════════════ D-3 面积图 ═══════════════════════════ */
  'D-3 面积图': {
    summary: '趋势面积图，渐变填充，5型头部变体（无"描述型"）。',
    baseSpec: `## D-3 面积图 (AreaChart)

单系列渐变面积图，用于强调数据量级/累计趋势。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'area'\` |
| 填充色 | \`fill: 'linear-gradient(-90deg, white 0%, ' + chartPalette.c1 + ' 100%)'\`，从右侧主题色渐变到左侧透明 |
| 填充透明度 | \`fillOpacity: 0.6\` |
| 描边色 | \`stroke: chartPalette.c1\` |
| 线宽 | \`lineWidth: 2\` |
| 图例 | \`legend: false\`（单系列不显示图例） |

### 约束
⚠️ 面积图变体无「描述型」，只有操作型/筛选型/筛选（复杂）/纯净型 4 种头部

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'area',
  data: data.filter((d) => d.type === '本期'),
  encode: { x: 'month', y: 'value' },
  style: { fill: \`linear-gradient(-90deg, white 0%, \${chartPalette.c1} 100%)\`, fillOpacity: 0.6, stroke: chartPalette.c1, lineWidth: 2 },
  axis: { x: { title: false }, y: { title: false } },
  legend: false,
}), []);
\`\`\`

以下为外层 Card 的头部变体规格（4 型，无描述型）：`,
    variants: buildHeaderVariantSpecs('月度营收趋势（面积图）', { filterOptions: ['本期', '同比'], order: ['操作型', '筛选型', '筛选（复杂）', '纯净型'] }),
  },

  /* ═══════════════════════════ D-4 柱状图 ═══════════════════════════ */
  'D-4': {
    summary: '竖向柱状图，表达分类维度上的数值分布/对比，4型头部变体。',
    baseSpec: `## D-4 柱状图 (Bar Chart)

竖向柱状图，AntV G2 interval，分类色板着色。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'interval'\` |
| 分类配色 | \`getChartCategoricalPalette(count)\`（7 色分类色板按序取值） |
| 柱形圆角 | \`style: { radius: 4 }\` |
| 图例 | \`legend: false\`（分类已通过 X 轴文字区分，无需额外图例） |
| 坐标轴 | \`axis: { x: { title: false }, y: { title: false } }\` |

### 约束
- 分组柱/横向分组柱为本模块变体，通过 G2 \`dodgeX\` transform 或 \`coordinate.transpose\` 实现，不单独定义新模块编号

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'interval',
  data,
  encode: { x: 'region', y: 'value', color: 'region' },
  scale: { color: { range: getChartCategoricalPalette(6) } },
  axis: { x: { title: false }, y: { title: false } },
  legend: false,
  style: { radius: 4 },
}), []);
\`\`\`

以下为外层 Card 的头部变体规格：`,
    variants: buildHeaderVariantSpecs('各区域营收对比', { order: ['筛选型', '筛选（复杂）', '操作型', '纯净型'] }),
  },

  /* ═══════════════════════════ D-5 双轴组合图 ═══════════════════════════ */
  'D-5': {
    summary: '柱+线双轴组合，表达两个量纲不同但相关的指标，5型头部变体（如上方截图所示）。',
    baseSpec: `## D-5 双轴组合图 (Combo Chart)

柱状图（左轴）+ 折线图（右轴）叠加，AntV G2 \`type: 'view'\` 复合视图。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表结构 | \`type: 'view'\`，\`children\`: [interval 子视图, line 子视图] |
| 柱形颜色 | \`fill: chartPalette.c1\`（= \`var(--chart-1)\`，随主题联动） |
| 柱形圆角 | \`radius: 4\` |
| 左轴 | \`position: 'left'\`，标题如"营收(万)" |
| 折线颜色 | \`stroke: chartPalette.c3\`（= \`var(--chart-3)\` 橙色，固定不随主题变化） |
| 折线宽度 | \`lineWidth: 2\` |
| 右轴 | \`position: 'right'\`，\`scale: { y: { independent: true } }\`，标题如"增速(%)" |

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'view',
  children: [
    { type: 'interval', data, encode: { x: 'month', y: 'revenue' }, style: { fill: chartPalette.c1, radius: 4 }, axis: { y: { position: 'left', title: '营收(万)' } } },
    { type: 'line', data, encode: { x: 'month', y: 'growth' }, style: { stroke: chartPalette.c3, lineWidth: 2 }, axis: { y: { position: 'right', title: '增速(%)' } }, scale: { y: { independent: true } } },
  ],
}), []);
\`\`\`

以下为外层 Card 的 5 型头部变体规格：`,
    variants: buildHeaderVariantSpecs('营收与增速双轴'),
  },

  /* ═══════════════════════════ D-6 漏斗图 ═══════════════════════════ */
  'D-6': {
    summary: '逐层递减的转化/流失链路图，5型头部变体（描述型优先）。',
    baseSpec: `## D-6 漏斗图 (Funnel)

横向漏斗图，AntV G2 interval + symmetryY transform + transpose 坐标变换。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'interval'\` |
| 对称变换 | \`transform: [{ type: 'symmetryY' }]\` |
| 坐标变换 | \`coordinate: { transform: [{ type: 'transpose' }] }\` |
| 分类配色 | \`getChartCategoricalPalette(5)\`（每层一种色） |
| Y 轴格式化 | \`labelFormatter: (d) => (d/100).toFixed(0) + '%'\` |
| 柱形圆角 | \`radius: 4\` |
| 图例 | \`legend: false\` |

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'interval',
  data,
  transform: [{ type: 'symmetryY' }],
  encode: { x: 'stage', y: 'value', color: 'stage' },
  scale: { color: { range: getChartCategoricalPalette(5) } },
  axis: { x: { title: false }, y: { title: false, labelFormatter: (d) => \`\${(d/100).toFixed(0)}%\` } },
  legend: false,
  coordinate: { transform: [{ type: 'transpose' }] },
  style: { radius: 4 },
}), []);
\`\`\`

以下为外层 Card 的 5 型头部变体规格（描述型排最前）：`,
    variants: buildHeaderVariantSpecs('转化漏斗', { order: ['描述型', '筛选型', '筛选（复杂）', '操作型', '纯净型'], descText: '总曝光量 10,000 次' }),
  },

  /* ═══════════════════════════ D-7 饼/环图 ═══════════════════════════ */
  'D-7': {
    summary: '占比构成展示，适合类目/渠道等维度的构成分析，5型头部变体。',
    baseSpec: `## D-7 饼/环图 (Pie/Donut)

AntV G2 interval + theta 坐标 + stackY transform，占比构成图。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'interval'\`，\`coordinate: { type: 'theta' }\` |
| 堆叠变换 | \`transform: [{ type: 'stackY' }]\` |
| 分类配色 | \`getChartCategoricalPalette(4)\` |
| 图例位置 | \`legend: { color: { position: 'right' } }\` |
| 扇形圆角 | \`style: { radius: 4 }\` |
| 外部标签 | \`labels: [{ text: 'channel', position: 'outside', fontSize: 12 }]\` |

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'interval',
  data,
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  encode: { y: 'value', color: 'channel' },
  scale: { color: { range: getChartCategoricalPalette(4) } },
  legend: { color: { position: 'right' } },
  style: { radius: 4 },
  labels: [{ text: 'channel', position: 'outside', fontSize: 12 }],
}), []);
\`\`\`

以下为外层 Card 的 5 型头部变体规格：`,
    variants: buildHeaderVariantSpecs('渠道占比', { descText: '共 4 个渠道' }),
  },

  /* ═══════════════════════════ D-8 堆叠进度条 ═══════════════════════════ */
  'D-8': {
    summary: '横向堆叠条，表达多分段构成的整体进度或占比，纯手工 flex/div 实现，5型头部变体。',
    baseSpec: `## D-8 堆叠进度条 (Stacked Progress)

⚠️ 非 G2 图表，纯手工 flex/div 实现，不接入 useG2Chart/ChartCard；但头部仍复用 5 型变体命名。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 条形高度 | 32px |
| 条形圆角 | \`border-radius: 6px\`，外层 \`overflow: hidden\` |
| 分段配色 | 依次取 \`chartPalette.c1/c2/c3/c4\`（蓝/绿/橙/蓝绿） |
| 分段内文字 | \`color: #fff; fontSize: 12px; fontWeight: 500\`，居中显示百分比 |
| 图例行 | \`display: flex; gap: 8px; marginTop: 12px; flexWrap: wrap\` |
| 图例色块 | 10×10px，\`border-radius: 2px\` |
| 图例文字 | \`fontSize: 12px; color: var(--text-2)\` |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', height: 32, borderRadius: 6, overflow: 'hidden' }}>
  {segments.map((s) => (
    <div key={s.label} style={{ width: \`\${s.value}%\`, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 500 }}>
      {s.value}%
    </div>
  ))}
</div>
<div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
  {segments.map((s) => (
    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-2)' }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
      {s.label}
    </div>
  ))}
</div>
\`\`\`

以下为外层 Card 的 5 型头部变体规格：`,
    variants: buildHeaderVariantSpecs('合同类型占比', { order: ['筛选型', '筛选（复杂）', '操作型', '描述型', '纯净型'], descText: '统计截止：2024-06-30' }),
  },

  /* ═══════════════════════════ D-9 排名条形图 ═══════════════════════════ */
  'D-9 排名条形图': {
    summary: '横向排名条形图，蓝色单色色阶从深到浅，4型头部变体。',
    baseSpec: `## D-9 排名条形图 (RankChart)

横向条形图，按 Y 值降序排列，用蓝色单色色阶（非分类色板）。

### 数据结构
\`\`\`ts
{ name: string; value: number; }[]
\`\`\`

### 视觉规格
| 属性 | 值 |
|------|-----|
| G2 类型 | \`type: 'interval'\`，\`coordinate.transform: [{ type: 'transpose' }]\` |
| 排序 | \`transform: [{ type: 'sortX', by: 'y', reverse: true }]\` |
| 色阶 | \`getChartMonoScale().slice(0, 5).reverse()\`：Blue-6→Blue-1 单色渐变，随主题联动 |
| 图例 | \`legend: false\` |
| 柱形圆角 | \`style: { radius: 4 }\` |

### 约束
- 蓝色色阶必须用主题联动的单色色阶 token（\`getChartMonoScale()\`），禁止自行插值中间色或硬编码十六进制

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'interval',
  data,
  encode: { x: 'value', y: 'name', color: 'name' },
  transform: [{ type: 'sortX', by: 'y', reverse: true }],
  scale: { color: { range: getChartMonoScale().slice(0, 5).reverse() } },
  axis: { x: { title: false }, y: { title: false } },
  legend: false,
  coordinate: { transform: [{ type: 'transpose' }] },
  style: { radius: 4 },
}), []);
\`\`\`

以下为外层 Card 的头部变体规格：`,
    variants: buildHeaderVariantSpecs('门店营收 Top 5', { order: ['筛选型', '筛选（复杂）', '操作型', '纯净型'] }),
  },

  /* ═══════════════════════════ D-10 散点图 ═══════════════════════════ */
  'D-10': {
    summary: '双维度数值分布，用于相关性/象限分析，5型头部变体。',
    baseSpec: `## D-10 散点图 (Scatter)

AntV G2 point 图，双维度 + 气泡大小三维展示。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'point'\` |
| 气泡大小映射 | \`scale: { size: { range: [4, 16] } }\` |
| 坐标轴标题 | 显示（与其它图表不同，散点图通常需要标注 X/Y 轴含义），如"客单价"/"订单量" |
| 填充色 | \`fill: chartPalette.c1\`（主题联动） |
| 填充透明度 | \`fillOpacity: 0.6\` |
| 图例 | \`legend: false\` |

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', size: 'size' },
  scale: { size: { range: [4, 16] } },
  axis: { x: { title: '客单价' }, y: { title: '订单量' } },
  style: { fill: chartPalette.c1, fillOpacity: 0.6 },
  legend: false,
}), []);
\`\`\`

以下为外层 Card 的 5 型头部变体规格：`,
    variants: buildHeaderVariantSpecs('客单价 vs 订单量', { descText: '样本量：40 家门店' }),
  },

  /* ═══════════════════════════ D-11 AI 摘要卡 ═══════════════════════════ */
  'D-11 AI诊断摘要卡': {
    summary: 'AI 生成的诊断/洞察总结卡片，用于看板顶部，提供核心结论或智能分析。',
    baseSpec: `## D-11 AI 摘要卡 (DigestCard)

AI 生成的诊断/洞察总结卡片，用于看板顶部，提供核心结论或智能分析。与 D-2~D-15 的 5 型头部变体是完全不同的独立变体体系，专属 DigestCard 组件，共 4 种变体：标的结论(summary)/智能洞察(insight)/列表型(list)/卡片型(cards)。

### 数据结构
\`\`\`ts
interface DigestCardProps {
  title?: string;
  variant?: 'list' | 'cards' | 'summary' | 'insight';  // 默认 'list'
  items?: DigestItem[];                  // list/cards 变体用
  richContent?: RichTextSegment[];       // summary/insight 变体用
  tagText?: string;                      // summary 变体：结论标签文字
  tagType?: 'success' | 'warning' | 'danger';
  hint?: string;                         // insight 变体：右侧灰色提示
  highlightColor?: string;               // list/cards：关键数据高亮色
}
interface DigestItem { label: string; text: string; }
interface RichTextSegment { text: string; bold?: boolean; }
\`\`\`

### 通用视觉规格
| 属性 | 值 |
|------|-----|
| 卡片圆角 | 6px |
| 富文本加粗 | \`fontWeight: 600\`，不用颜色区分 |
| label 文字颜色 | 引用 \`var(--color-heading-accent)\`（不是 \`--color-brand-primary\`），保证黄色主题下也是橙色可读文字 |

### 约束
1. insight 变体背景用 \`var(--color-primary-4, #F0F6FF)\` 浅蓝色，不用绿色
2. summary 变体 Tag 颜色遵循全局策略（默认蓝/绿，慎用红色）
3. 富文本加粗用 \`fontWeight: 600\`，不用颜色区分`,

    variants: {
      标的结论: `### 变体：标的结论 (summary)

白底卡片 + 标题(18px) + Tag 标签 + 富文本段落，适用于分析报告结论、开店建议。

\`\`\`
┌──────────────────────────────────────────────────────────┐
│  标的结论  [Tag: 强烈建议推进开店]                          │
│                                                          │
│  项目位在朝阳区……综上**建议推进开店**，但需注意……           │
└──────────────────────────────────────────────────────────┘
\`\`\`

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 背景 | #FFFFFF |
| 圆角 | 6px |
| 内边距 | 20px |
| 标题字号 | 18px, font-weight: 500, color: #111925 |
| Tag | size="small", 自定义颜色(success: 绿底绿字 / warning: 橙底橙字) |
| 正文字号 | 14px, line-height: 22px, 加粗 fontWeight: 600 |

#### 代码骨架 (React)
\`\`\`tsx
<DigestCard
  variant="summary"
  title="标的结论"
  tagText="强烈建议推进开店"
  tagType="success"
  richContent={[
    { text: '项目位在朝阳区朝青板块……综上' },
    { text: '建议推进开店', bold: true },
    { text: '，但需要注意如下风险：……' },
  ]}
/>
\`\`\`
${TOKEN_APPENDIX}`,

      智能洞察: `### 变体：智能洞察 (insight)

浅蓝背景 + 渐变边框(青→蓝→紫) + AI 图标 + 富文本段落，适用于 AI 经营分析。

\`\`\`
┌─ 渐变边框(#04D0C7 → #1E85F9 → #C164FE) ────────────────┐
│ bg: var(--color-primary-4, #F0F6FF)                         │
│  [AI图标]  智能洞察        由大模型基于公开信息生成，仅供参考 │
│                                                          │
│  上周整体经营状况表现平稳，但暴露了"**高流量、低转化**"……    │
└──────────────────────────────────────────────────────────┘
\`\`\`

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 背景 | var(--color-primary-4, #F0F6FF) — Blue-1 |
| 边框 | 1px gradient(95deg, #04D0C7 → #1E85F9 → #C164FE) |
| 圆角 | 6px (需 overflow: hidden 补偿 borderImage) |
| 内边距 | 16px |
| AI 图标 | 24×24 圆形, gradient(135deg, #04D0C7→#1E85F9→#C164FE) |
| 标题 | 14px, font-weight: 500, color: #111925 |
| 提示文字 | 14px, color: rgba(17,25,37,0.45) |
| 正文 | 14px, line-height: 22px, 加粗 fontWeight: 600 |

#### 代码骨架 (React)
\`\`\`tsx
<DigestCard
  variant="insight"
  title="智能洞察"
  hint="由大模型基于公开信息生成，仅供参考"
  richContent={[
    { text: '上周整体经营状况表现平稳，但暴露了"' },
    { text: '高流量、低转化', bold: true },
    { text: '"的核心问题。建议针对……' },
  ]}
/>
\`\`\`
${TOKEN_APPENDIX}`,

      列表型: `### 变体：列表型 (list)

紫色 AI 图标 + 分行 label:text 列表，关键数据自动高亮，label 使用 \`--color-heading-accent\`。

\`\`\`
┌──────────────────────────────────────────────────────────┐
│  [紫色AI图标]  核心结论                                    │
│                                                          │
│  经营诊断：营业收入 1,258.6 万元，完成月度目标 85.4%……      │
│  风险提醒：当前全品类共有 58 条预警……                       │
│  任务提醒：当前共下发 76 项任务……                           │
└──────────────────────────────────────────────────────────┘
\`\`\`

#### 视觉规格
| 属性 | 值 |
|------|-----|
| AI 图标 | 20×20 圆形, gradient(135deg, #A78BFA→#818CF8) |
| 标题 | var(--fs-16), fontWeight: 600 |
| label 颜色 | \`var(--color-heading-accent)\`，fontWeight: 600（工具蓝主题下 #166FF7，美团黄主题下 #FF7700，不用纯黄） |
| text 颜色 | var(--text-2)，关键数据自动高亮(fontWeight: 600) |
| 行间距 | \`gap: 8px\`（外层 flex column） |
| label:text 行内 | \`display: flex; gap: 8px; line-height: 1.6\` |

#### 代码骨架 (React)
\`\`\`tsx
<DigestCard
  variant="list"
  items={[
    { label: '经营诊断', text: '营业收入 1,258.6 万元……' },
    { label: '风险提醒', text: '当前全品类共有 58 条预警……' },
    { label: '任务提醒', text: '当前共下发 76 项任务……' },
  ]}
/>
\`\`\`

\`\`\`tsx
{/* label 渲染实现，注意用 heading-accent 而非 brand-primary */}
<span style={{ flexShrink: 0, fontSize: 'var(--fs-13, 13px)', fontWeight: 600, color: 'var(--color-heading-accent)' }}>
  {item.label}：
</span>
<span style={{ fontSize: 'var(--fs-13, 13px)', color: 'var(--text-2)' }}>{item.text}</span>
\`\`\`
${TOKEN_APPENDIX}`,

      卡片型: `### 变体：卡片型 (cards)

紫色 AI 图标 + 子卡片网格，多维度结论并列展示，label 使用 \`--color-heading-accent\`。

\`\`\`
┌──────────────────────────────────────────────────────────┐
│  [紫色AI图标]  核心结论                                    │
│  ┌── 经营诊断 ──┐  ┌── 风险提醒 ──┐  ┌── 任务提醒 ──┐    │
│  │ 营业收入…    │  │ 全品类共有…  │  │ 共下发76项…  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└──────────────────────────────────────────────────────────┘
\`\`\`

#### 视觉规格
| 属性 | 值 |
|------|-----|
| AI 图标 | 同列表型，20×20 圆形渐变 |
| 子卡片背景 | rgba(17,25,37,0.03) |
| 子卡片圆角 | 8px |
| 子卡片内边距 | 14px 16px |
| 网格 | \`repeat(min(items.length, 3), 1fr)\`, gap: 12px |
| 子卡片内部间距 | \`gap: 6px\`（flex column） |
| 标签颜色 | \`var(--color-heading-accent)\`，fontWeight: 600, fontSize: 14px |
| 正文颜色 | var(--text-2)，fontSize: 13px, line-height: 1.6 |

#### 代码骨架 (React)
\`\`\`tsx
<DigestCard
  variant="cards"
  items={[
    { label: '经营诊断', text: '营业收入 1,258.6 万元……' },
    { label: '风险提醒', text: '当前全品类共有 58 条预警……' },
    { label: '任务提醒', text: '当前共下发 76 项任务……' },
  ]}
/>
\`\`\`
${TOKEN_APPENDIX}`,
    },
  },

  /* ═══════════════════════════ D-12 雷达图 ═══════════════════════════ */
  'D-12': {
    summary: '多维度能力/指标对比雷达图，4型头部变体（纯净型优先）。',
    baseSpec: `## D-12 雷达图 (Radar)

AntV G2 line + polar 坐标，多维度能力对比。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'line'\`，\`coordinate: { type: 'polar' }\` |
| 描边色 | \`stroke: chartPalette.c1\`（主题联动） |
| 线宽 | 2px |
| 网格线 | \`axis: { x: { grid: true }, y: { grid: true } }\` |
| 图例 | \`legend: false\` |

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'line',
  data,
  coordinate: { type: 'polar' },
  encode: { x: 'dim', y: 'score' },
  style: { lineWidth: 2, stroke: chartPalette.c1 },
  axis: { x: { grid: true }, y: { grid: true } },
  legend: false,
}), []);
\`\`\`

以下为外层 Card 的头部变体规格（纯净型排最前）：`,
    variants: buildHeaderVariantSpecs('门店综合能力', { order: ['纯净型', '操作型', '筛选型', '筛选（复杂）'] }),
  },

  /* ═══════════════════════════ D-13 仪表盘 ═══════════════════════════ */
  'D-13': {
    summary: '单一指标的区间型进度展示（如健康度、达成度），5型头部变体（纯净型优先）。',
    baseSpec: `## D-13 仪表盘 (Gauge)

AntV G2 gauge 图，红-黄-绿三色区间指示健康度。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'gauge'\` |
| 区间配色 | \`range: [chartTrend.down, '#FFD700', chartTrend.up]\`（绿→黄→红三段，注意此处颜色语义与业务"涨绿跌红"相反，是"健康度低=红，高=绿"的区间色，字面变量名与语义方向需要按场景判断） |
| 弧线端点 | \`arcLineCap: 'round'\`（圆头） |

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'gauge',
  data: [{ target: 82, total: 100 }],
  scale: { color: { range: [chartTrend.down, '#FFD700', chartTrend.up] } },
  style: { arcLineCap: 'round' },
}), []);
\`\`\`

以下为外层 Card 的头部变体规格（纯净型排最前）：`,
    variants: buildHeaderVariantSpecs('健康度评分', { order: ['纯净型', '筛选型', '筛选（复杂）', '操作型', '描述型'], descText: '评分周期：本月' }),
  },

  /* ═══════════════════════════ D-14 热力图 ═══════════════════════════ */
  'D-14': {
    summary: '双维度矩阵密度展示，如时段×星期活跃度，5型头部变体。',
    baseSpec: `## D-14 热力图 (Heatmap)

AntV G2 cell 图，双维度矩阵 + 单色色阶映射密度。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'cell'\` |
| 色阶 | \`getChartMonoScale().reverse()\`（单色色阶，随主题联动） |
| 值域 | \`domainMin: 0, domainMax: 100\` |
| 单元格圆角 | \`style: { radius: 3 }\` |
| 图例 | \`legend: false\` |

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'cell',
  data,
  encode: { x: 'hour', y: 'day', color: 'value' },
  scale: { color: { range: getChartMonoScale().reverse(), domainMin: 0, domainMax: 100 } },
  axis: { x: { title: false }, y: { title: false } },
  legend: false,
  style: { radius: 3 },
}), []);
\`\`\`

以下为外层 Card 的 5 型头部变体规格：`,
    variants: buildHeaderVariantSpecs('时段活跃度热力图', { descText: '统计周期：本周' }),
  },

  /* ═══════════════════════════ D-15 玫瑰图 ═══════════════════════════ */
  'D-15': {
    summary: '环形分类占比展示，饼图变体，4型头部变体（纯净型优先）。',
    baseSpec: `## D-15 玫瑰图 (Rose Chart)

AntV G2 interval + polar 坐标 + innerRadius，南丁格尔玫瑰图。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 图表类型 | \`type: 'interval'\`，\`coordinate: { type: 'polar', innerRadius: 0.3 }\` |
| 分类配色 | \`getChartCategoricalPalette(5)\` |
| 图例位置 | \`legend: { color: { position: 'right' } }\` |
| 扇形圆角 | \`style: { radius: 4 }\` |

### 代码骨架
\`\`\`tsx
const ref = useG2Chart(() => ({
  type: 'interval',
  data,
  coordinate: { type: 'polar', innerRadius: 0.3 },
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: { color: { range: getChartCategoricalPalette(5) } },
  axis: { x: { title: false }, y: { title: false } },
  legend: { color: { position: 'right' } },
  style: { radius: 4 },
}), []);
\`\`\`

以下为外层 Card 的头部变体规格（纯净型排最前，无描述型）：`,
    variants: buildHeaderVariantSpecs('品类分布玫瑰图', { order: ['纯净型', '筛选型', '筛选（复杂）', '操作型'] }),
  },

  /* ═══════════════════════════ W-1 欢迎栏 ═══════════════════════════ */
  'W-1': {
    summary: '工作台顶部欢迎信息+关键提示条，文字欢迎/轮播图两种变体。',
    baseSpec: `## W-1 欢迎栏 (Welcome Banner)

工作台顶部欢迎信息卡片，两种变体：文字欢迎 / 轮播图。

### 通用视觉规格
| 属性 | 值 |
|------|-----|
| 卡片圆角 | 6px（MTD Card 默认） |
| 卡片内边距 | 16px |`,

    variants: {
      文字欢迎: `### 变体：文字欢迎

渐变背景卡片 + 头像 + 问候语 + 今日概述 + 一个主操作按钮。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 背景 | \`linear-gradient(135deg, var(--color-primary-4) 0%, #ffffff 100%)\` |
| 头像尺寸 | 48×48px，圆形，\`background: var(--color-primary-4)\` |
| 头像文字颜色 | \`var(--color-heading-accent)\`（工具蓝主题 #FF7700 橙色；美团黄主题同样是 #FF7700，不用纯黄） |
| 头像文字字号 | 20px, fontWeight: 600 |
| 问候语字号 | 18px, fontWeight: 500, color: var(--text-1) |
| 副标题字号 | 13px, color: var(--text-3), marginTop: 2px |
| 主操作按钮 | \`<Button type="primary">\`，靠右对齐 |
| 整体布局 | \`display: flex; align-items: center; gap: 8px\` |

#### 代码骨架
\`\`\`tsx
<Card style={{ background: 'linear-gradient(135deg, var(--color-primary-4) 0%, #ffffff 100%)' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600, color: 'var(--color-heading-accent)' }}>张</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-1)' }}>早上好，张三 👋</div>
      <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>今天是 7月30日，你有 3 项待处理任务</div>
    </div>
    <Button type="primary">去处理</Button>
  </div>
</Card>
\`\`\`
${TOKEN_APPENDIX}`,

      轮播图: `### 变体：轮播图

Carousel 轮播多张运营/公告卡片，自动播放，深色渐变背景 + 分页圆点。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 圆角 | 12px，\`overflow: hidden\` |
| 背景 | \`linear-gradient(120deg, {slideColor} 0%, color-mix(in srgb, {slideColor} 60%, #6C3CE9) 100%)\` |
| 内边距 | 24px |
| 最小高度 | 100px |
| 文字颜色 | #fff（渐变深色背景上使用白字） |
| 标题字号 | 18px, fontWeight: 600, marginBottom: 6px |
| 描述字号 | 13px, opacity: 0.85 |
| 右侧箭头按钮 | 28×28px 圆形，\`background: rgba(255,255,255,0.2)\`，绝对定位垂直居中 |
| 分页圆点 | 当前页 14×5px 胶囊形，其余 5×5px 圆形，\`background: rgba(255,255,255,0.4)\` |

#### 代码骨架
\`\`\`tsx
<div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: \`linear-gradient(120deg, \${color} 0%, color-mix(in srgb, \${color} 60%, #6C3CE9) 100%)\`, padding: 24, color: '#fff', minHeight: 100 }}>
  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{title}</div>
  <div style={{ fontSize: 13, opacity: 0.85 }}>{desc}</div>
  <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</div>
  <div style={{ position: 'absolute', left: 24, bottom: 12, display: 'flex', gap: 4 }}>
    {slides.map((_, i) => <span key={i} style={{ width: i === active ? 14 : 5, height: 5, borderRadius: 3, background: i === active ? '#fff' : 'rgba(255,255,255,0.4)' }} />)}
  </div>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    },
  },

  /* ═══════════════════════════ W-2 操作引导卡 ═══════════════════════════ */
  'W-2': {
    summary: '待办/引导类卡片，提示用户下一步操作，含进度条+主操作按钮。',
    baseSpec: `## W-2 操作引导卡 (Guide Card)

提示卡片，图标 + 标题 + 描述 + 进度条 + 操作按钮。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 整体布局 | \`display: flex; align-items: flex-start; gap: 12px\` |
| 图标容器 | 36×36px，\`border-radius: 8px; background: var(--color-primary-4)\` |
| 图标 | \`<Icon type="info-o" />\`，18px，\`color: var(--color-brand-primary)\`（图标非文字，直接用 brand-primary 即可） |
| 标题字号 | 14px, fontWeight: 500, color: var(--text-1), marginBottom: 4px |
| 描述字号 | 13px, color: var(--text-3), marginBottom: 10px |
| 进度条容器 | height: 4px, background: rgba(17,25,37,0.06), border-radius: 2px, marginBottom: 12px |
| 进度条填充 | height: 100%, border-radius: 2px, background: var(--color-brand-primary) |
| 操作按钮 | \`<Button type="primary" size="small">\` |

### 代码骨架
\`\`\`tsx
<Card>
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-primary-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon type="info-o" style={{ fontSize: 18, color: 'var(--color-brand-primary)' }} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', marginBottom: 4 }}>完成店铺信息认证</div>
      <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 10 }}>完善店铺信息可提升曝光排名，已完成 2/4 步</div>
      <div style={{ height: 4, background: 'rgba(17,25,37,0.06)', borderRadius: 2, marginBottom: 12 }}>
        <div style={{ width: '50%', height: '100%', borderRadius: 2, background: 'var(--color-brand-primary)' }} />
      </div>
      <Button type="primary" size="small">继续完善</Button>
    </div>
  </div>
</Card>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ W-3 常用功能网格 ═══════════════════════════ */
  'W-3': {
    summary: '横向图标网格，每个入口彩色图标+文字标签，右上角"自定义"按钮。',
    baseSpec: `## W-3 常用功能网格 (Shortcut Grid)

横向图标网格快捷入口，右上角"自定义"操作。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 容器 | \`.dash-card\`（白底，圆角 6px，内边距 16px） |
| 头部行 | \`display: flex; justify-content: space-between; marginBottom: 16px\` |
| 标题 | \`fontSize: var(--fs-16); fontWeight: var(--fw-medium); color: var(--text-1)\` |
| "自定义"按钮 | \`<Button.Link type="primary" shape="text">\` |
| 网格布局 | \`display: flex; flexWrap: wrap; gap: 12px\` |
| 单项容器 | \`flex: 1 1 0; minWidth: 72px; padding: 16px 8px; borderRadius: 8px\`（⚠️ 8px 为硬编码 fallback，项目未定义 \`--radius-elem\` token，若要 token 化建议改用 \`--radius-2\`(10px) 或自定义新增 \`--radius-elem\`） |
| 单项默认背景 | \`#F9FAFB\` |
| 单项 hover 背景 | \`#F3F4F6\`（\`transition: background 0.15s\`） |
| 图标容器 | 44×44px，\`borderRadius: 12px\`，背景为每项自定义颜色，flex 居中 |
| 图标字号 | 20px |
| 标签字号 | \`fontSize: var(--fs-12); color: var(--text-2); textAlign: center; lineHeight: 1.3\` |
| 单项内部间距 | \`gap: 8px\`（图标与文字之间，flex-direction: column） |

### 代码骨架
\`\`\`tsx
<div className="dash-card">
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)', color: 'var(--text-1)' }}>常用功能</span>
    <Button.Link type="primary" shape="text">自定义</Button.Link>
  </div>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    {items.map((item) => (
      <div
        key={item.label}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 8px', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', transition: 'background 0.15s', flex: '1 1 0', minWidth: 72 }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{item.icon}</div>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.3 }}>{item.label}</span>
      </div>
    ))}
  </div>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ W-4 个人信息/统计卡 ═══════════════════════════ */
  'W-4': {
    summary: '工作台个人信息卡，头像+姓名+职位+三栏统计数据网格。',
    baseSpec: `## W-4 个人信息/统计卡 (Profile Card)

个人信息 + 统计数据网格卡片。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 头像尺寸 | 56×56px，圆形 |
| 头像文字颜色 | \`var(--color-heading-accent)\`（不用 brand-primary，保证黄主题下可读） |
| 头像背景 | \`var(--color-primary-4)\` |
| 姓名字号 | 16px, fontWeight: 600, color: var(--text-1) |
| 职位字号 | 13px, color: var(--text-3) |
| 统计网格 | \`display: grid; gridTemplateColumns: repeat(3, 1fr); gap: 8px\`，marginTop: 16px |
| 统计单元格背景 | \`rgba(17,25,37,0.03)\` |
| 统计单元格圆角/内边距 | \`borderRadius: 8px; padding: 12px\` |
| 统计数字 | 18px, fontWeight: 600, color: var(--text-1) |
| 统计标签 | 12px, color: var(--text-3), marginTop: 2px |

### 代码骨架
\`\`\`tsx
<Card>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600, color: 'var(--color-heading-accent)' }}>张</div>
    <div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>张三</div>
      <div style={{ fontSize: 13, color: 'var(--text-3)' }}>区域运营经理</div>
    </div>
  </div>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
    {stats.map((s) => (
      <div key={s.label} style={{ background: 'rgba(17,25,37,0.03)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>{s.value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
      </div>
    ))}
  </div>
</Card>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ W-5 公告/通知列表 ═══════════════════════════ */
  'W-5': {
    summary: '公告/通知列表，日期前缀/标签前缀两种变体。',
    baseSpec: `## W-5 公告/通知列表 (Notice List)

公告通知列表，共用 NoticeListShell 外壳，两种前缀样式变体。

### 通用视觉规格
| 属性 | 值 |
|------|-----|
| 容器 | \`.dash-card\` |
| 列表项高度 | \`padding: 10px 0\` |
| 列表项分隔线 | \`borderBottom: 1px solid var(--divider)\`（最后一项无） |
| 标题字号 | 13px, color: var(--text-2) |
| 标题超出省略 | \`overflow: hidden; textOverflow: ellipsis; whiteSpace: nowrap\` |`,
    variants: {
      日期前缀: `### 变体：日期前缀

每条通知左侧固定宽度日期文字，灰色小字。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 日期宽度 | 固定 \`width: 76px\`，\`flexShrink: 0\` |
| 日期字号/颜色 | 12px, color: var(--text-4) |
| 行布局 | \`display: flex; alignItems: center; gap: 12px\` |

#### 代码骨架
\`\`\`tsx
<div className="dash-card">
  {notices.map((n) => (
    <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--divider)' }}>
      <span style={{ width: 76, flexShrink: 0, fontSize: 12, color: 'var(--text-4)' }}>{n.date}</span>
      <span style={{ fontSize: 13, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
    </div>
  ))}
</div>
\`\`\`
${TOKEN_APPENDIX}`,
      标签前缀: `### 变体：标签前缀

每条通知左侧彩色分类 Tag，替代日期前缀。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| Tag 尺寸 | \`size="small"\` |
| Tag 颜色 | 按分类映射蓝/绿/橙（同全局 Tag 策略，慎用红色） |
| 行布局 | \`display: flex; alignItems: center; gap: 10px\` |

#### 代码骨架
\`\`\`tsx
<div className="dash-card">
  {notices.map((n) => (
    <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--divider)' }}>
      <Tag size="small" theme={categoryTheme[n.category] || 'blue'}>{n.category}</Tag>
      <span style={{ fontSize: 13, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
    </div>
  ))}
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    },
  },

  /* ═══════════════════════════ W-6 数据动态统计 ═══════════════════════════ */
  'W-6': {
    summary: '三列统计卡，彩色图标+数字+标签。',
    baseSpec: `## W-6 数据动态统计 (Stat Cards)

三列统计卡片组，图标底色用 15% 透明度叠加技巧。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 栅格 | 3 列，\`display: grid; gridTemplateColumns: repeat(3, 1fr); gap: 8px\` |
| 图标容器 | 40×40px, \`borderRadius: 10px\` |
| 图标底色技巧 | \`background: \${it.color}15\`（十六进制颜色值 + "15" 后缀 = 约 8% 不透明度叠加写法，需保证 it.color 是 6 位 hex） |
| 图标颜色 | \`it.color\`（不透明实色） |
| 数字字号 | 20px, fontWeight: 600, color: var(--text-1) |
| 标签字号 | 12px, color: var(--text-3) |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
  {stats.map((it) => (
    <Card key={it.label}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: \`\${it.color}15\`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Icon type={it.icon} style={{ fontSize: 20, color: it.color }} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-1)' }}>{it.value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{it.label}</div>
    </Card>
  ))}
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ W-7 待办任务列表 ═══════════════════════════ */
  'W-7': {
    summary: '待办列表，含勾选框+优先级 Tag，优先级颜色映射固定。',
    baseSpec: `## W-7 待办任务列表 (Todo List)

带勾选框和优先级标签的任务列表。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 行布局 | \`display: flex; alignItems: center; gap: 10px; padding: 10px 0; borderBottom: 1px solid var(--divider)\` |
| 勾选框 | MTD \`<Checkbox>\` |
| 任务文字 | 13px, color: var(--text-2)，勾选后 \`textDecoration: line-through; color: var(--text-4)\` |
| 优先级 Tag 背景 | \`\${color}10\`（约 6% 透明度叠加） |
| 优先级颜色映射 | \`紧急: #FF1F1F\`（红，例外允许，因为"紧急"语义确实需要强警示色）, \`高: #FF7700\`（橙）, \`中: #166FF7\`（蓝，主题联动） |

\`\`\`ts
const priColor: Record<string, string> = { 紧急: '#FF1F1F', 高: '#FF7700', 中: '#166FF7' };
\`\`\`

### 代码骨架
\`\`\`tsx
{todos.map((t) => (
  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--divider)' }}>
    <Checkbox checked={t.done} onChange={() => toggle(t.id)} />
    <span style={{ flex: 1, fontSize: 13, color: t.done ? 'var(--text-4)' : 'var(--text-2)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
    <Tag size="small" style={{ background: \`\${priColor[t.priority]}10\`, color: priColor[t.priority], border: 'none' }}>{t.priority}</Tag>
  </div>
))}
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ FD1 容器类型选择 ═══════════════════════════ */
  'FD1': {
    summary: '4卡容器类型选择网格，用于表单/详情页开头的类型选型。',
    baseSpec: `## FD1 容器类型选择 (Container Type Selector)

4 卡片网格，用于表单/详情起始的类型选择步骤。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 栅格 | \`display: grid; gridTemplateColumns: repeat(4, 1fr); gap: 12px\` |
| 卡片选中态边框 | \`border: 1.5px solid var(--color-brand-primary)\` |
| 卡片选中态背景 | \`color-mix(in srgb, var(--color-brand-primary) 6%, transparent)\` |
| 卡片未选中态边框 | \`1px solid rgba(17,25,37,0.1)\` |
| 图标颜色 | \`var(--color-brand-primary)\`（图标非文字，可直接用 brand-primary） |
| 图标尺寸 | 24px |
| 标题字号 | 14px, fontWeight: 500 |
| 内边距 | \`padding: 16px\` |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
  {types.map((t) => (
    <div key={t.key} onClick={() => setSelected(t.key)} style={{
      padding: 16, borderRadius: 8, cursor: 'pointer',
      border: selected === t.key ? '1.5px solid var(--color-brand-primary)' : '1px solid rgba(17,25,37,0.1)',
      background: selected === t.key ? 'color-mix(in srgb, var(--color-brand-primary) 6%, transparent)' : '#fff',
    }}>
      <Icon type={t.icon} style={{ fontSize: 24, color: 'var(--color-brand-primary)', marginBottom: 8 }} />
      <div style={{ fontSize: 14, fontWeight: 500 }}>{t.label}</div>
    </div>
  ))}
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ FD2 页头信息区 ═══════════════════════════ */
  'FD2': {
    summary: '页面头部：面包屑+大标题+状态Tag，表单/详情页共用。',
    baseSpec: `## FD2 页头信息区 (Page Header)

面包屑 + 标题 + 状态标签的页头区块。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 面包屑字号 | 12px, color: var(--text-3), marginBottom: 8px |
| 标题字号 | \`h2\`，20px, fontWeight: 600, color: var(--text-1) |
| 标题行布局 | \`display: flex; alignItems: center; gap: 10px\` |
| 状态 Tag | \`<Tag type="bordered" size="small">\`，颜色遵循全局蓝/绿/橙策略 |

### 代码骨架
\`\`\`tsx
<div>
  <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>门店管理 / 门店详情</div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-1)', margin: 0 }}>春熙路旗舰店</h2>
    <Tag type="bordered" theme="blue" size="small">营业中</Tag>
  </div>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ FD3 只读数据表格 ═══════════════════════════ */
  'FD3': {
    summary: '只读表格，用于表单/详情页内嵌的明细数据展示，不带分页/编辑。',
    baseSpec: `## FD3 只读数据表格 (Readonly Table)

嵌入表单/详情页内的只读表格，Tag 区分类型。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 容器 | \`.dash-card\` |
| Tag 类型映射 | 蓝色=直营，橙色=加盟 |
| 表格 | MTD \`<Table>\`，\`pagination={false}\`（只读表格默认不分页，若数据量大可另加） |

### 代码骨架
\`\`\`tsx
<div className="dash-card">
  <Table
    columns={[
      { label: '门店', dataKey: 'name' },
      { label: '类型', dataKey: 'type', render: (v) => <Tag theme={v === '直营' ? 'blue' : 'orange'} type="bordered" size="small">{v}</Tag> },
    ]}
    data={data}
    rowKey="id"
    pagination={false}
  />
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Form1 底部操作栏 ═══════════════════════════ */
  'Form1': {
    summary: '表单底部固定操作栏，右对齐提交/取消按钮。',
    baseSpec: `## Form1 底部操作栏 (Form Action Bar)

表单页/抽屉/弹窗底部的操作按钮区。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 布局 | \`display: flex; justifyContent: flex-end; gap: 8px\` |
| 顶部分割线 | \`borderTop: 1px solid rgba(17,25,37,0.07)\` |
| 内边距 | \`padding: 12px 16px\` |
| 主按钮 | \`<Button type="primary">提交</Button>\` |
| 次按钮 | \`<Button>取消</Button>\` |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 16px', borderTop: '1px solid rgba(17,25,37,0.07)' }}>
  <Button>取消</Button>
  <Button type="primary">提交</Button>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Form2 分组分段表单 ═══════════════════════════ */
  'Form2': {
    summary: '表单分组分段，每组一个Card，左侧彩色竖条装饰标题。',
    baseSpec: `## Form2 分组分段表单 (Grouped Form Sections)

多个分组 Card，每组标题左侧手工彩色竖条（区别于 \`.card-title-bar\` CSS 类的自动生成方式，本模块是手动内联复现该视觉效果）。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 分组间距 | \`gap: var(--gap-section)\`（24px），\`display: flex; flexDirection: column\` |
| 每组 Card | 默认 MTD Card 样式，内边距 16px，圆角 6px |
| 标题行 | \`display: flex; alignItems: center; gap: 8px; marginBottom: 16px\` |
| 竖条装饰 | 3×14px, \`borderRadius: 2px; background: var(--color-brand-primary)\`（手工内联，与 \`.card-title-bar::before\` 效果一致） |
| 标题字号 | 14px, fontWeight: 500, color: var(--text-1) |
| 表单项间距 | \`gap: 16px\`（组内多个 FormItem 纵向排列） |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-section)' }}>
  {groups.map((g) => (
    <Card key={g.title}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--color-brand-primary)' }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>{g.title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {g.fields}
      </div>
    </Card>
  ))}
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Form3 单栏布局 ═══════════════════════════ */
  'Form3': {
    summary: '单列表单布局，label右对齐固定宽度，必填红色星号。',
    baseSpec: `## Form3 单栏布局 (Single Column Form)

单列表单，label 固定宽度右对齐。

### 视觉规格
| 属性 | 值 |
|------|-----|
| label 宽度 | 固定 80px，\`textAlign: right\` |
| label 与输入框间距 | \`gap: 12px\` |
| 必填星号 | \`color: #FF1F1F\`（红色，必填标记的例外场景，允许使用红色） |
| 行间距 | \`gap: 16px\`（表单项纵向排列） |
| 输入框宽度 | \`width: 320px\`（典型值，可按需调整） |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 80, textAlign: 'right', fontSize: 13, color: 'var(--text-2)' }}>
      <span style={{ color: '#FF1F1F' }}>*</span> 门店名称
    </span>
    <Input style={{ width: 320 }} placeholder="请输入门店名称" />
  </div>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Form4 步骤条表单 ═══════════════════════════ */
  'Form4': {
    summary: '多步骤流程表单，顶部编号圆点步骤条，激活/完成/未激活三态。',
    baseSpec: `## Form4 步骤条表单 (Step Form)

编号圆点步骤条 + 分步内容区。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 圆点尺寸 | 28×28px，圆形 |
| 激活态圆点 | \`background: var(--color-brand-primary); color: #fff\` |
| 完成态圆点 | \`background: var(--color-brand-primary); color: #fff\`（同激活态背景，用 ✓ 图标区分，或 \`opacity: 0.85\`） |
| 未激活态圆点 | \`background: rgba(17,25,37,0.06); color: var(--text-4)\` |
| 步骤间连接线 | \`flex: 1; height: 1px; background: rgba(17,25,37,0.1)\`，完成的连接线可用主题色高亮 |
| 步骤文字 | 13px，激活态 \`color: var(--color-heading-accent); fontWeight: 500\`（文字用 heading-accent，不用 brand-primary） |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', alignItems: 'center' }}>
  {steps.map((s, i) => (
    <React.Fragment key={s.title}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
          background: i <= current ? 'var(--color-brand-primary)' : 'rgba(17,25,37,0.06)',
          color: i <= current ? '#fff' : 'var(--text-4)',
        }}>{i < current ? '✓' : i + 1}</div>
        <span style={{ fontSize: 13, color: i === current ? 'var(--color-heading-accent)' : 'var(--text-3)', fontWeight: i === current ? 500 : 400 }}>{s.title}</span>
      </div>
      {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: 'rgba(17,25,37,0.1)', margin: '0 8px' }} />}
    </React.Fragment>
  ))}
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Form5 可编辑表格 ═══════════════════════════ */
  'Form5': {
    summary: '表单内嵌可编辑表格，每行带删除操作，底部"添加一行"。',
    baseSpec: `## Form5 可编辑表格 (Editable Table)

表单内可增删行的表格，常用于批量录入场景。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 表格单元格内控件 | \`<Input size="small">\`/\`<Select size="small">\`，撑满单元格宽度 |
| 删除操作列 | \`<Button.Link type="primary" shape="text">删除</Button.Link>\`，红色可选（谨慎，默认仍用主题色文字） |
| 底部"添加一行" | \`<Button icon="add" style={{ marginTop: 8, width: '100%' }}>添加一行</Button>\`，虚线边框风格可选 |

### 代码骨架
\`\`\`tsx
<Table columns={editableColumns} data={rows} rowKey="id" pagination={false} />
<Button icon="add" style={{ marginTop: 8, width: '100%' }} onClick={addRow}>添加一行</Button>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Form6 复选组 ═══════════════════════════ */
  'Form6': {
    summary: '复选组：横排/分组矩阵/大数据量表格三种勾选形态，候选项为封闭集合。',
    baseSpec: `## Form6 复选组 (Checkbox Group)

以横排、分组网格或表格等形式做多选、勾选、适用范围设定。候选项必须是**封闭集合**（预定义、有限），不能自由输入集合外的新值——如需自由输入新标签，应使用 Form9 动态标签组，而非本模块。

三种形态按候选项规模与是否分组选用：无分组且选项少（约 10 项以内）用**变体A 基础横排**；按业务维度分组、选项在中等规模的标准形态用**变体B 分组多选矩阵**（可纵向堆叠多组）；候选项超过 50-100 个时改用**变体C 大数据量勾选**（Table + rowSelection + 搜索）。

### 组件依赖
\`import { Checkbox, Button, Form, Table, Input, Tag, Icon } from '@ss/mtd-react3';\`

### 通用视觉规格
| 属性 | 值 |
|------|-----|
| 选项文字字号 | 14px（MTD Checkbox 默认） |
| Checkbox 与文字间距 | MTD Checkbox 内置，无需额外设置 |`,
    variants: {
      变体A: `### 变体A：基础横排（无分组）

选项按自身内容自然宽度排列，一行最多 4 个，超出自动换行，不做等宽 Grid 拉伸；不带底色容器，直接铺在表单区域内。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 容器 | \`<Checkbox.Group>\` 包一层 \`.checkbox-row\`，\`display: flex; flexWrap: wrap; gap: 12px 32px; width: 100%\` |
| 单项宽度 | \`flex: 0 0 calc((100% - 96px) / 4)\`（4 项一行，3 条 32px 横向 gap，即 3×32=96px，从容器总宽扣除后均分 4 份，避免等宽拉伸误差导致换行错位） |
| 小屏（≤767.98px）单项宽度 | \`flex: 1 1 100%\`（退化为单列） |

#### 代码骨架
\`\`\`tsx
const [value, setValue] = useState<string[]>(['sms', 'app']);

<Checkbox.Group value={value} onChange={(v) => setValue(v as string[])}>
  <div className="checkbox-row">
    {options.map((opt) => (
      <div key={opt.value} className="checkbox-row__item">
        <Checkbox value={opt.value}>{opt.label}</Checkbox>
      </div>
    ))}
  </div>
</Checkbox.Group>
\`\`\`

\`\`\`css
.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  /* Checkbox.Group 渲染的父节点自身 display 为 flex，子元素默认收缩到内容宽度，
     不会自动撑满父容器，必须显式撑满，flex-basis 的百分比换行计算才准确 */
  width: 100%;
}
.checkbox-row__item {
  flex: 0 0 calc((100% - 96px) / 4);
}
@media (max-width: 767.98px) {
  .checkbox-row__item { flex: 1 1 100%; }
}
\`\`\`
${TOKEN_APPENDIX}`,
      变体B: `### 变体B：分组多选矩阵

选项按业务维度分组展示，每组标题+组内选项纵向堆叠一列，多个分组以四栏等宽 Grid 横排；标题行（标题 + 全选/清空/计数操作）用 \`Form.Item\` 的自定义 label 承载，\`labelPosition="top"\` 使标题行与勾选区上下排列。支持在同一个 \`<Form useContext>\` 内纵向堆叠多组（如"开通能力" + "消息通知设置"），组间间距 24px。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 分组容器（每组卡片） | \`padding: 16px; background: var(--bg-card-inner); borderRadius: 6px\` |
| 分组横排 Grid | \`display: grid; gridTemplateColumns: repeat(4, 1fr); gridAutoRows: 1fr; gap: 16px; width: 100%\` |
| 小屏（≤767.98px）分组 Grid | \`gridTemplateColumns: 1fr\`（退化为单栏） |
| 分组标题 | 14px, fontWeight: 500, color: var(--text-1), marginBottom: 12px |
| 组内选项排列 | \`display: flex; flexDirection: column; gap: 10px\`（纵向单列，不可改为横向多列 Grid，会与"分组横排/组内纵排"的整体规则相悖） |
| 标题行（label） | \`display: flex; alignItems: center; width: 100%; marginBottom: 12px\` |
| 标题行操作区 | \`display: flex; alignItems: center; gap: 8px; marginLeft: auto; fontSize: 14px\`（全选/清空为文字按钮 + 计数文案） |
| 计数文案 | 14px, color: var(--text-4) |
| 多组间距 | \`margin-top: 24px\`（第二组起，通过相邻兄弟选择器施加） |
| Form.Item label 覆盖 | 需将 MTD \`.mtd-prime-form-item-label\`/\`.mtd-prime-form-item-label-ctx\` 强制撑满 100% 宽度、左对齐，且取消默认的两行截断（\`-webkit-line-clamp: unset\`），否则自定义 label 节点会被限宽/截断 |

#### 代码骨架
\`\`\`tsx
function CapabilityFormItem({ title, formItemKey, options, defaultValue = [] }) {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const grouped = groupBy(options, 'group');

  const label = (
    <div className="checkbox-grid__label-row">
      <span>{title}</span>
      <div className="checkbox-grid__actions">
        <Button type="primary" shape="text" onClick={() => setSelected(options.map(o => o.value))}>全选</Button>
        <Button type="primary" shape="text" onClick={() => setSelected([])}>清空</Button>
        <span className="checkbox-grid__count">已选 {selected.length} / {options.length}</span>
      </div>
    </div>
  );

  return (
    <Form.Item className="form-item--capability" formItemKey={formItemKey} label={label} labelPosition="top">
      <Checkbox.Group value={selected} onChange={(v) => setSelected(v as string[])}>
        <div className="checkbox-grid__groups">
          {[...grouped.entries()].map(([groupName, items]) => (
            <div key={groupName} className="checkbox-grid__group">
              <div className="checkbox-grid__group-title">{groupName}</div>
              <div className="checkbox-grid">
                {items.map((item) => (
                  <div key={item.value} className="checkbox-grid__item">
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Checkbox.Group>
    </Form.Item>
  );
}

// 页面装配处：多组纵向堆叠，共用一个 Form 提供 context
<Form useContext={true} className="capability-form-section">
  <CapabilityFormItem title="开通能力" formItemKey="capability" options={CAPABILITY_OPTIONS} defaultValue={['delivery', 'pickup']} />
  <CapabilityFormItem title="消息通知设置" formItemKey="notifyType" options={NOTIFY_TYPE_OPTIONS} defaultValue={['order', 'refund']} />
</Form>
\`\`\`

\`\`\`css
.capability-form-section .form-item--capability + .form-item--capability {
  margin-top: 24px;
}
.form-item--capability .mtd-prime-form-item-label {
  height: auto;
  width: 100%;
}
.form-item--capability .mtd-prime-form-item-label-ctx {
  width: 100% !important;
  -webkit-line-clamp: unset;
  text-align: left;
}
.checkbox-grid__label-row {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}
.checkbox-grid__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 14px;
}
.checkbox-grid__count {
  font-size: 14px;
  color: var(--text-4);
  margin-left: auto;
}
.checkbox-grid__groups {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;
  gap: 16px;
  width: 100%;
}
.checkbox-grid__group {
  padding: 16px;
  background: var(--bg-card-inner);
  border-radius: 6px;
}
.checkbox-grid__group-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-1);
  margin-bottom: 12px;
}
.checkbox-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
@media (max-width: 767.98px) {
  .checkbox-grid__groups { grid-template-columns: 1fr; }
}
\`\`\`
${TOKEN_APPENDIX}`,
      变体C: `### 变体C：大数据量勾选（Table + rowSelection）

候选项超过 50-100 个时，网格勾选不再适用，改用可搜索、可分页的 Table，勾选态通过 \`rowSelection\` 承载。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 外层容器 | \`border: 1px solid var(--divider); borderRadius: 6px; overflow: hidden\` |
| 顶部工具栏 | \`display: flex; alignItems: center; gap: 12px; padding: 12px 16px; background: var(--bg-card-inner); borderBottom: 1px solid var(--divider)\` |
| 搜索框宽度 | 240px，\`prefix={<Icon type="search-o" />}\` |
| 已选计数文案 | 12px, color: var(--text-4), marginLeft: auto |
| 表格 | \`<Table>\` + \`rowSelection={{ selectedKeys }}\`，\`scroll={{ x: true, y: 320 }}\`，\`pagination={{ pageSize: 8 }}\` |
| 状态列 Tag | \`<Tag theme="green/blue/orange" type="bordered">\`（营业中=green，筹备中=blue，装修中=orange） |

#### 代码骨架
\`\`\`tsx
const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [keyword, setKeyword] = useState('');
const filteredRows = keyword ? rows.filter(r => r.name.includes(keyword)) : rows;

<div className="grid-selector-table">
  <div className="grid-selector-table__toolbar">
    <Input className="grid-selector-table__search" placeholder="搜索门店名称" value={keyword} onChange={(e) => setKeyword(e.target.value)} prefix={<Icon type="search-o" />} />
    <span className="grid-selector-table__count">已选 {selectedKeys.length} / {rows.length} 家门店</span>
  </div>
  <Table
    rowKey="key"
    columns={columns}
    data={filteredRows}
    scroll={{ x: true, y: 320 }}
    pagination={{ pageSize: 8 }}
    rowSelection={{ selectedKeys }}
    onSelectChange={(keys) => setSelectedKeys(keys as string[])}
  />
</div>
\`\`\`

\`\`\`css
.grid-selector-table {
  border: 1px solid var(--divider);
  border-radius: 6px;
  overflow: hidden;
}
.grid-selector-table__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-card-inner);
  border-bottom: 1px solid var(--divider);
}
.grid-selector-table__search { width: 240px; }
.grid-selector-table__count {
  font-size: 12px;
  color: var(--text-4);
  margin-left: auto;
}
\`\`\`
${TOKEN_APPENDIX}`,
    },
  },

  /* ═══════════════════════════ Form7 文件上传 ═══════════════════════════ */
  'Form7': {
    summary: '文件/图片上传网格，虚线边框占位框+已上传缩略图。',
    baseSpec: `## Form7 文件/图片上传 (Upload Grid)

方形上传占位框网格，已上传显示缩略图，未上传显示虚线框+提示。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 单项尺寸 | 100×100px |
| 圆角 | 8px |
| 未上传态边框 | \`1px dashed rgba(17,25,37,0.15)\` |
| 未上传态背景 | \`rgba(17,25,37,0.02)\` |
| 已上传态背景 | \`url({imgUrl}) center/cover\` |
| 加号图标 | \`<Icon type="plus-o" />\`，20px, color: var(--text-4) |
| 提示文字 | 11px, color: var(--text-3) |
| 补充说明文字 | 12px, color: var(--text-4), marginTop: 8px |
| 网格间距 | \`gap: 8px; flexWrap: wrap\` |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  {slots.map((s, i) => (
    <div key={i} style={{
      width: 100, height: 100, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer',
      border: s.uploaded ? 'none' : '1px dashed rgba(17,25,37,0.15)',
      background: s.uploaded ? \`url(\${s.url}) center/cover\` : 'rgba(17,25,37,0.02)',
    }}>
      {!s.uploaded && <><Icon type="plus-o" style={{ fontSize: 20, color: 'var(--text-4)' }} /><span style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.label}</span></>}
    </div>
  ))}
</div>
<div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 8 }}>支持 JPG/PNG 格式，单张不超过 5MB</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Form8 公式编辑器 ═══════════════════════════ */
  'Form8': {
    summary: '公式编辑器：变体A为可递归条件组树，变体B为固定文本+变量拼装的计算公式配置。',
    baseSpec: `## Form8 公式编辑器 (Formula Editor)

**变体A · 条件规则型**：结构化条件形式配置判断/筛选规则，可递归嵌套的条件组容器，左侧纵向贯穿逻辑列（且/或 badge），条件组可折叠增删。
**变体B · 计算公式配置型**：固定文本 + 变量下拉 + 运算符 + 可选 checkbox 组合的公式模板，用于展示"预测计算量 = ..."一类带条件项的计算规则。

MTD 没有专用的 FormulaEditor 组件：变体A 用 \`Form.Item + Select + Input + Icon\` 组合构建；变体B 用自定义 \`.formula-config-row\` + \`Select + Checkbox + span\` 固定文本组合构建。

### 组件依赖
\`import { Select, Input, Icon, Form, Checkbox } from '@ss/mtd-react3';\`

### 通用视觉规格
| 属性 | 值 |
|------|-----|
| 外层容器（页面装配处） | MTD Card 包裹，内边距由 Card 默认样式提供 |
| "且/或" 逻辑连接文案 | \`且\` = AND，\`或\` = OR，中文展示 |`,
    variants: {
      变体A: `### 变体A：条件组树（条件规则型）

递归的容器/条件组两类节点：容器节点负责逻辑连接（且/或），条件组节点是可折叠的叶子节点，内部是一行行"判断方式+变量1+变量2+运算符+阈值"字段组合。根容器默认渲染 2 个条件组（or 逻辑）。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 且/或 badge | \`height: 24px; padding: 0 8px; borderRadius: 12px; fontSize: 12px; fontWeight: 500; background: var(--text-6); color: #fff\`，胶囊形，可点击切换 |
| 且/或下拉菜单 | \`background: var(--bg-card); borderRadius: 4px; boxShadow: var(--shadow-mid); padding: 4px 0; minWidth: 100px\`，菜单项 \`padding: 6px 12px; fontSize: 12px\` |
| 容器节点（tree-container） | \`display: flex; alignItems: stretch; background: var(--bg-card-inner); borderRadius: 8px; padding: 16px; gap: 12px\`；嵌套容器透明背景不叠加灰底 |
| 逻辑列（纵向贯穿的且/或） | \`display: flex; flexDirection: column; alignItems: center; minWidth: 28px\`，上下各一条 1px 竖线（\`background: var(--text-6)\`）夹住中间的 badge |
| 子节点列间距 | \`gap: 12px\`（\`flex-direction: column\`） |
| 条件组头部 | \`display: flex; alignItems: center; gap: 4px; cursor: pointer; padding: 4px 0\`，标题 \`条件组{序号}\` 14px/500，右侧删除 icon 按钮 \`color: var(--text-4)\` |
| 规则行（rule-row） | \`display: flex; alignItems: flex-start; gap: 8px\`，多行间 \`margin-top: 8px\` |
| 规则行字段区 | \`display: flex; alignItems: flex-start; gap: 8px; flex: 1\`，每个字段为 \`Form.Item label="xxx" labelPosition="top"\`（判断方式/变量1/变量2/运算符/阈值），Select/Input 均 \`width: 100%\` |
| 规则行操作按钮 | \`width: 32px; height: 32px; borderRadius: 4px; background: var(--bg-card-inner); color: var(--text-3)\`，\`padding-top: 22px\` 对齐带顶部 label 的字段行；hover 态 \`background: var(--divider); color: var(--color-brand-primary)\`，删除按钮 hover 态 \`background: #fff1f0; color: var(--color-red)\` |
| "添加条件组" 文字链接 | \`display: inline-flex; alignItems: center; gap: 4px; fontSize: 13px; color: var(--color-brand-primary)\`，hover 加下划线 |

#### 代码骨架
\`\`\`tsx
function LogicBadge({ value, onChange }) {
  return (
    <div className="logic-connector" onClick={() => onChange && setOpen(true)}>
      {value === 'and' ? '且' : '或'}
      <Icon type="triangle-down" style={{ fontSize: 10, marginLeft: 2 }} />
    </div>
  );
}

// 容器节点：逻辑列 + 子节点列
<div className="tree-container">
  <div className="tree-logic-col">
    <div className="tree-logic-col__line" />
    <div className="tree-logic-col__badge"><LogicBadge value={node.logic} /></div>
    <div className="tree-logic-col__line" />
  </div>
  <div className="tree-container__children">
    {node.children.map(child => <div key={child.id} className="tree-container__child">{renderNode(child)}</div>)}
  </div>
</div>

// 条件组（叶子节点）
<div className="condition-group">
  <div className="condition-group__header" onClick={toggleExpand}>
    <Icon type={expanded ? 'triangle-down' : 'triangle-right'} style={{ fontSize: 12 }} />
    <span className="condition-group__header-title">条件组{index}</span>
    <button className="condition-group__header-delete"><Icon type="delete-o" style={{ fontSize: 14 }} /></button>
  </div>
  {expanded && (
    <div className="condition-group__body">
      <div className="condition-group__rows">
        <div className="tree-logic-col">…</div>
        <div className="condition-group__rules-col">
          {rules.map(rule => (
            <div className="rule-row" key={rule.id}>
              <div className="rule-row__fields">
                <Form.Item label="判断方式" labelPosition="top"><Select>...</Select></Form.Item>
                <Form.Item label="变量1" labelPosition="top"><Select>...</Select></Form.Item>
                <Form.Item label="变量2" labelPosition="top"><Select>...</Select></Form.Item>
                <Form.Item label="运算符" labelPosition="top"><Select>...</Select></Form.Item>
                <Form.Item label="阈值" labelPosition="top"><Input /></Form.Item>
              </div>
              <div className="rule-row__actions">
                <button className="rule-row__action-btn"><Icon type="add" /></button>
                <button className="rule-row__action-btn rule-row__action-btn--danger"><Icon type="delete-o" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</div>

<button className="add-link"><Icon type="add" style={{ fontSize: 12, marginRight: 4 }} />添加条件组</button>
\`\`\`

\`\`\`css
.logic-connector {
  display: inline-flex; align-items: center; justify-content: center; gap: 2px;
  height: 24px; padding: 0 8px; border-radius: 12px;
  font-size: 12px; font-weight: 500; cursor: pointer;
  background: var(--text-6); color: #fff; border: none;
}
.tree-container {
  display: flex; align-items: stretch;
  background: var(--bg-card-inner); border-radius: 8px; padding: 16px; gap: 12px;
}
.tree-container .tree-container { background: transparent; border-radius: 0; padding: 0; }
.tree-logic-col { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; min-width: 28px; }
.tree-logic-col__line { flex: 1; width: 1px; background: var(--text-6); min-height: 12px; }
.tree-container__children { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.condition-group__header { display: flex; align-items: center; gap: 4px; cursor: pointer; padding: 4px 0; }
.condition-group__header-title { font-size: 14px; font-weight: 500; flex: 1; }
.rule-row { display: flex; align-items: flex-start; gap: 8px; }
.rule-row + .rule-row { margin-top: 8px; }
.rule-row__fields { display: flex; align-items: flex-start; gap: 8px; flex: 1; }
.rule-row__actions { display: flex; align-items: flex-start; gap: 4px; flex-shrink: 0; padding-top: 22px; }
.rule-row__action-btn {
  width: 32px; height: 32px; border-radius: 4px; border: none;
  background: var(--bg-card-inner); color: var(--text-3);
}
.rule-row__action-btn:hover { background: var(--divider); color: var(--color-brand-primary); }
.rule-row__action-btn--danger:hover { background: #fff1f0; color: var(--color-red); }
.add-link {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; color: var(--color-brand-primary); border: none; background: none;
}
\`\`\`
${TOKEN_APPENDIX}`,
      变体B: `### 变体B：计算公式配置型

固定文本 + 下拉变量 + 运算符 + 可选 checkbox 拼成的只读公式模板，支持多组规则（如"默认计算配置" + "例外计算配置"）纵向堆叠，组间分隔线。

#### 视觉规格
| 属性 | 值 |
|------|-----|
| 外层容器 | \`background: var(--bg-card-inner); borderRadius: 8px; padding: 16px\` |
| 单条规则行（formula-config-row） | \`display: flex; alignItems: flex-start; gap: 12px\`，左侧 label 右侧公式内容，不用 Form.Item（避免双层 label） |
| 规则行 label | 固定宽 98px，\`fontSize: 14px; color: var(--text-3); lineHeight: 32px\` |
| 规则行删除按钮 | 32×32px icon 按钮，静息 \`color: var(--text-4)\`，hover \`color: var(--color-red); background: rgba(245,72,59,.08)\` |
| 主公式行 | \`display: flex; flexWrap: nowrap; alignItems: center; gap: 6px; minHeight: 32px\`（不换行，横向滚动） |
| 固定文本 | \`fontSize: 14px; color: var(--text-1)\` |
| 运算符文字 | \`fontSize: 14px; color: var(--text-3); padding: 0 2px\` |
| 子公式行 | \`margin-top: 4px\`，格式如"其中：安全存量 = {Select} × 安全系数" |
| 多组间分隔线 | \`border-top: 1px solid var(--divider); margin: 16px 0\` |

#### 代码骨架
\`\`\`tsx
<div className="formula-config-container">
  <div className="formula-config-row">
    <span className="formula-config-row__label">默认计算配置</span>
    <div className="formula-config-row__body">
      <div className="formula-template">
        <span className="formula-fixed-text">预测计算量</span>
        <span className="formula-template__op">=</span>
        <span className="formula-fixed-text">预测需求量</span>
        <span className="formula-template__op">+</span>
        <Checkbox checked={check.safeStock} onChange={...} />
        <span className="formula-fixed-text">安全存量</span>
        <span className="formula-template__op">−</span>
        <span className="formula-fixed-text">（在途入库</span>
        <span className="formula-template__op">−</span>
        <span className="formula-fixed-text">在途出库）</span>
        <span className="formula-template__op">−</span>
        <Checkbox checked={check.outStock} onChange={...} />
        <span className="formula-fixed-text">可出库量</span>
      </div>
      <div className="formula-sub-formula">
        <div className="formula-template">
          <span className="formula-fixed-text">其中：安全存量</span>
          <span className="formula-template__op">=</span>
          <Select value={method} onChange={setMethod}>{FORECAST_METHODS.map(m => <Select.Option key={m} value={m}>{m}</Select.Option>)}</Select>
          <span className="formula-template__op">×</span>
          <span className="formula-fixed-text">安全系数</span>
        </div>
      </div>
    </div>
    <button className="formula-config-row__delete"><Icon type="delete-o" /></button>
  </div>
  <div className="formula-config-divider" />
  {/* 第二组：例外计算配置，结构相同 */}
</div>
\`\`\`

\`\`\`css
.formula-config-container { background: var(--bg-card-inner); border-radius: 8px; padding: 16px; }
.formula-config-row { display: flex; align-items: flex-start; gap: 12px; }
.formula-config-row__label {
  flex-shrink: 0; width: 98px;
  font-size: 14px; color: var(--text-3); line-height: 32px; white-space: nowrap;
}
.formula-config-row__body { flex: 1; min-width: 0; overflow-x: auto; }
.formula-config-divider { border-top: 1px solid var(--divider); margin: 16px 0; }
.formula-template { display: flex; flex-wrap: nowrap; align-items: center; gap: 6px; min-height: 32px; }
.formula-fixed-text { font-size: 14px; color: var(--text-1); white-space: nowrap; }
.formula-template__op { font-size: 14px; color: var(--text-3); padding: 0 2px; white-space: nowrap; }
.formula-sub-formula { margin-top: 4px; }
.formula-config-row__delete {
  flex-shrink: 0; width: 32px; height: 32px; border-radius: 4px; border: none;
  background: transparent; color: var(--text-4); font-size: 16px;
}
.formula-config-row__delete:hover { color: var(--color-red); background: rgba(245,72,59,.08); }
\`\`\`
${TOKEN_APPENDIX}`,
    },
  },

  /* ═══════════════════════════ Form9 动态标签组 ═══════════════════════════ */
  'Form9': {
    summary: '可关闭标签组+添加标签入口。',
    baseSpec: `## Form9 动态标签组 (Dynamic Tag Group)

可增删的标签组。

### 视觉规格
| 属性 | 值 |
|------|-----|
| Tag | \`type="bordered" theme="blue" closable\` |
| 间距 | \`gap: 8px; flexWrap: wrap\` |
| "添加标签"占位 Tag | \`theme="gray"; borderStyle: dashed; cursor: pointer\` |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  {tags.map((t) => <Tag key={t} type="bordered" theme="blue" closable onClose={() => removeTag(t)}>{t}</Tag>)}
  <Tag theme="gray" type="bordered" style={{ cursor: 'pointer', borderStyle: 'dashed' }} onClick={addTag}>+ 添加标签</Tag>
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Detail1 Tab面板 ═══════════════════════════ */
  'Detail1': {
    summary: '详情页Tab面板，多Tab切换不同信息分组。',
    baseSpec: `## Detail1 Tab 面板 (Tab Panel)

详情页内多 Tab 切换。

### 视觉规格
| 属性 | 值 |
|------|-----|
| Tabs 组件 | MTD \`<Tabs>\` + \`<Tabs.TabPane>\`，默认 line 风格 |
| Tab 内容内边距 | \`padding: 12px 0\` |
| Tab 内容文字 | 13px, color: var(--text-3) |

### 代码骨架
\`\`\`tsx
<Card>
  <Tabs defaultActiveKey="basic">
    <Tabs.TabPane key="basic" label="基本信息">
      <div style={{ padding: '12px 0', fontSize: 13, color: 'var(--text-3)' }}>门店名称、地址、面积等基本信息展示</div>
    </Tabs.TabPane>
    <Tabs.TabPane key="contract" label="合同信息">
      <div style={{ padding: '12px 0', fontSize: 13, color: 'var(--text-3)' }}>关联合同与租约信息展示</div>
    </Tabs.TabPane>
  </Tabs>
</Card>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Detail2 描述列表 ═══════════════════════════ */
  'Detail2': {
    summary: '两列描述列表，label:value 结构展示详情字段。',
    baseSpec: `## Detail2 描述列表 (Description List)

两列 label:value 结构，展示详情页基础字段。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 栅格 | \`display: grid; gridTemplateColumns: 1fr 1fr; gap: 16px 24px\` |
| 单项布局 | \`display: flex; gap: 8px\` |
| label 宽度 | 固定 70px，\`flexShrink: 0\` |
| label 颜色/字号 | 13px, color: var(--text-3) |
| value 颜色/字号 | 13px, color: var(--text-1), fontWeight: 500 |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
  {items.map((it) => (
    <div key={it.label} style={{ display: 'flex', gap: 8 }}>
      <span style={{ fontSize: 13, color: 'var(--text-3)', flexShrink: 0, width: 70 }}>{it.label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{it.value}</span>
    </div>
  ))}
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

  /* ═══════════════════════════ Detail3 附件预览 ═══════════════════════════ */
  'Detail3': {
    summary: '附件缩略图网格，区分图片/PDF等文件类型图标。',
    baseSpec: `## Detail3 附件预览 (Attachment Preview)

附件缩略图网格，图片直接展示缩略图，其他文件类型用图标+文件名+大小。

### 视觉规格
| 属性 | 值 |
|------|-----|
| 单项尺寸 | 80×80px |
| 圆角 | 8px |
| 图片项 | \`background: url({url}) center/cover\` |
| 文件项边框 | \`1px solid rgba(17,25,37,0.1)\` |
| 文件图标 | \`<Icon type="file-pdf-o" / "picture-o">\`，24px, color: var(--color-brand-primary) |
| 文件名 | 10px, color: var(--text-3)，超出省略 |
| 文件大小 | 10px, color: var(--text-4) |
| 网格间距 | \`gap: 12px; flexWrap: wrap\` |

### 代码骨架
\`\`\`tsx
<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
  <div style={{ width: 80, height: 80, borderRadius: 8, background: 'url(...) center/cover', cursor: 'pointer' }} />
  {files.map((f) => (
    <div key={f.name} style={{ width: 80, height: 80, borderRadius: 8, border: '1px solid rgba(17,25,37,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
      <Icon type={f.type === 'pdf' ? 'file-pdf-o' : 'picture-o'} style={{ fontSize: 24, color: 'var(--color-brand-primary)' }} />
      <span style={{ fontSize: 10, color: 'var(--text-3)', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
      <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{f.size}</span>
    </div>
  ))}
</div>
\`\`\`
${TOKEN_APPENDIX}`,
    variants: {},
  },

};

/* ═══════════════════════════════════════════════════════════════
   Key 解析：网站中大量页面模板对 ModuleWrapper 传入的 moduleId 是
   自由描述性的中文短语（如「F2 表头信息区」「Detail-1 描述列表（基本信息）」），
   并非都严格等于 designSpecs 里登记的规范 key（如 'G-4'、'D-1 指标卡片组'）。
   这里做两级解析，保证同一类模块无论调用方怎么写 moduleId，都能命中同一份 spec：
   1) 精确匹配 designSpecs 的 key；
   2) 提取 moduleId 开头的模块编号前缀（如 D-1 / G-4 / F-3 / Detail-1 / W-5），
      再去匹配 designSpecs 里 key 前缀相同的条目（大小写/连字符风格做归一化）。
   ═══════════════════════════════════════════════════════════════ */

/** 归一化编号前缀：去空格，统一大写，F/Detail 前缀不加连字符时也能识别（如 "F2" → "F-2"） */
function normalizeCode(raw: string): string {
  return raw.toUpperCase().replace(/\s+/g, '');
}

/** 从 moduleId 描述性文本中提取形如 D-1 / G-4 / F-3 / Detail-1 / W-5 / FD1 的模块编号前缀 */
function extractCode(moduleId: string): string | null {
  const m = moduleId.match(/^(G|D|W|F|FD|Form|Detail)-?(\d+)/i);
  if (!m) return null;
  return normalizeCode(`${m[1]}-${m[2]}`);
}

/** 别名表：把网站里实际出现、但与 designSpecs key 编号体系不同的 moduleId 前缀映射到规范 key */
const ALIAS_CODE_MAP: Record<string, string> = {
  'F-2': 'FD2',     // 表头信息区 → FD2 页头信息区
  'F-3': 'FD2',     // 操作栏，页头/操作栏场景暂归入 FD2（无独立操作栏编号）
  'F-4': 'FORM2',   // 分组分段 → Form2
  'F-5': 'FORM3',   // 单栏布局 → Form3
  'F-6': 'FORM4',   // 步骤条 → Form4
  'F-7': 'FORM5',   // 可编辑表格 → Form5
  'F-8': 'FD3',     // 只读表格 → FD3
  'F-9': 'FORM6',   // 复选组 → Form6
  'F-10': 'FORM7',  // 文件上传 → Form7
  'F-11': 'FORM8',  // 公式编辑器 → Form8
  'F-12': 'FORM9',  // 增删标签组 → Form9
  'D-8': 'FD3',      // MasterDetailPage 里 "D8 数据统计卡片"/"D9 附件预览" 系列泛指详情页数据展示，就近映射
  'D-9': 'DETAIL3',
  'D-5': 'DETAIL2',
  'DETAIL-1': 'DETAIL2',
  'DETAIL-2': 'DETAIL2',
};

function resolveSpecKey(moduleId: string): string | null {
  // 1) 精确匹配
  if (designSpecs[moduleId]) return moduleId;

  // 2) 编号前缀匹配（先查别名表，再直接查 designSpecs 各 key 的前缀）
  const code = extractCode(moduleId);
  if (code) {
    if (ALIAS_CODE_MAP[code]) {
      const aliasTarget = ALIAS_CODE_MAP[code];
      const hit = Object.keys(designSpecs).find((k) => normalizeCode(k) === aliasTarget || normalizeCode(extractCode(k) || '') === aliasTarget);
      if (hit) return hit;
    }
    const directHit = Object.keys(designSpecs).find((k) => {
      const kCode = extractCode(k) || normalizeCode(k);
      return kCode === code;
    });
    if (directHit) return directHit;
  }

  return null;
}

export function hasDesignSpec(moduleId: string): boolean {
  return resolveSpecKey(moduleId) !== null;
}

/** 各变体文本可能各自内嵌了一份 TOKEN_APPENDIX（保证单独摘录该变体时仍自包含），
    这里拼接"全部变体"时先去重，避免同一份 Token 对照表在最终文本里重复出现多次。 */
function stripTokenAppendix(text: string): string {
  return text.split(TOKEN_APPENDIX).join('');
}

export function getDesignSpec(moduleId: string, variantName?: string): string {
  const key = resolveSpecKey(moduleId);
  if (!key) return `// 暂无 ${moduleId} 的 Design Spec`;
  const spec = designSpecs[key];
  if (variantName && spec.variants[variantName]) {
    const body = [spec.baseSpec, spec.variants[variantName]].map(stripTokenAppendix).join('\n\n---\n\n');
    return `${body}\n${TOKEN_APPENDIX}`;
  }
  const allVariantSpecs = Object.values(spec.variants).map(stripTokenAppendix).join('\n\n---\n\n');
  const body = [spec.baseSpec, allVariantSpecs].filter(Boolean).map(stripTokenAppendix).join('\n\n---\n\n');
  return `${body}\n${TOKEN_APPENDIX}`;
}

export default designSpecs;
