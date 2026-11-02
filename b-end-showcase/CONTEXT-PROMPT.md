# b-end-spec - 项目上下文 Prompt

> 将以下内容粘贴到新对话开头，AI 即可接续工作。

---

## 项目概述

B 端设计规范 showcase 项目，用于演示看板/列表/表单/详情四类页面的标准 UI 模式。基于「L1 页面模板 → L2 组件模块 → L3 原子组件」三层架构，每个模块用 ModuleWrapper 包裹，hover 显示模块名并支持变体切换。

- **本地路径**: `/Users/tianyi/Documents/文档类/b-end-spec`
- **启动**: `npm run dev` (Vite)
- **构建**: `npm run build` (tsc + vite build)
- **路由**: `/dashboard/workbench`

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript + Vite |
| 组件库 | @ss/mtd-react3 (MTD3)，CSS prefix `mtd-prime` |
| 图表 | AntV G2 v5（Spec 模式，useG2Chart hook） |
| 样式 | Tailwind v4 + tokens.css（CSS 变量体系） |
| 路由 | react-router-dom v7 |
| 图标 | lucide-react |

## 核心架构

```
L1 页面模板（整页骨架，如 WorkbenchDashboard）
  └── L2 组件模块（ModuleWrapper 包裹的功能区块）
        ├── G 通用模块: G-1顶导 / G-2侧导 / G-3筛选器栏 / G-4数据表格
        ├── D 数据可视化: D-1指标卡片组 / D-3折线 / D-9排名条形 / ...
        └── W 工作台模块: W-1欢迎栏 / W-2操作引导卡 / W-3快捷入口 / W-4个人信息 / W-5公告通知
              └── L3 原子组件（MTD3 组件 + G2 图表）
```

## 目录结构

```
b-end-spec/
├── src/
│   ├── App.tsx                          # 路由定义 + VersionSwitcher 包裹
│   ├── components/
│   │   ├── ModuleWrapper.tsx            # L2 模块包装器（variants + tooltip）
│   │   ├── MtdLayout.tsx               # 顶导+侧导布局壳（hideSidebar prop）
│   │   ├── PageLayout.tsx              # 内容区容器（flex column + gap）
│   │   ├── ShortcutGrid.tsx            # 宫格快捷入口组件
│   │   └── DigestCard.tsx              # AI 摘要卡组件
│   ├── hooks/
│   │   └── useG2Chart.ts              # G2 v5 Spec 模式封装
│   ├── pages/
│   │   └── dashboard/
│   │       ├── OverviewDashboard.tsx   # 大盘数据通览（G-4 样式源码真相）
│   │       ├── AiSummaryDashboard.tsx  # AI 总结看板
│   │       ├── FilterTableDashboard.tsx # 筛选+表格看板
│   │       └── WorkbenchDashboard.tsx  # 工作台（主-侧分栏）← 本次要改的页面
│   └── styles/
│       └── tokens.css                  # 全局 CSS 变量 + 通用工具类
├── package.json
└── .catpaw/skills/skills-market/data-dashboard/SKILL.md  # data-dashboard skill 文档
```

## 关键约定

1. **MTD3 Table**: columns 用 `label` / `dataKey`（不是 Ant Design 的 `title` / `dataIndex`）
2. **MTD3 Tabs**: TabPane 用 `label` prop（不是 `tab`）
3. **CSS Token 体系**: `--fs-30/24/20/18/16/14/12`, `--gap-module`(16px), `--gap-elem`(8px), `--text-1~6`
4. **dash-card**: 白色圆角卡片外壳类名（`background: #fff; border-radius: 6px; padding: 16px`），G-4 表格统一用它代替 MTD Card
5. **card-title-bar**: Card header 内的标题栏容器（左标题+蓝色竖条装饰，右操作区）
6. **card-body-area**: 图表区容器（`height: 200px; overflow: hidden`）
7. **ModuleWrapper**: `variants` prop 实现变体切换，`tooltipPlacement="bottom"` 用于靠近顶部的模块避免被 header 遮挡
8. **Tabs content padding**: 全局 CSS 覆盖 `.dash-card .mtd-prime-tabs-content { padding: 12px 0 0 }`
9. **文字按钮颜色**: `.mtd-prime-button-text { color: #166FF7 !important }`
10. **G-4 三变体**: 纯文字表格 / 带图片列 / Tab 切换，全用 dash-card 外壳
11. **Tab 切换变体**: 筛选行=左侧 outline Button 组(选中蓝色borderColor+color) + 右侧 Select 下拉框（和 Button 同尺寸，不加 size="small"）
12. **D-1 三变体**: 纯大数字 / 带迷你面积图(SVG polygon+polyline) / 带操作(右上角查看按钮)
13. **G-3 两变体**: 简单版(Radio+1~2Select) / 复杂版(Radio+DatePicker+多Select+Input)，通过 ModuleWrapper variants + defaultVariant 切换

## WorkbenchDashboard 当前模块结构

```
PageLayout("工作台（主-侧分栏）")
├── 左侧主内容区 (flex: 1)
│   ├── W-1 欢迎栏（tooltipPlacement="bottom"）
│   │     渐变背景 Card + 问候语 + 摘要 + "开始工作" Button
│   ├── W-2 操作引导卡
│   │     Row(gutter=16, type="flex") × 3 个 Card（标题+描述+效果Tag+操作Button）
│   ├── D-1 指标卡片组（3 变体：纯大数字/带迷你图/带操作）
│   │     grid(repeat(auto-fit, minmax(160px, 1fr)))
│   └── G-4 数据表格（3 变体：纯文字表格/带图片列/Tab切换）
│         全部 dash-card 外壳
└── 右侧边栏 (width: 280, sticky)
    ├── W-3 快捷入口（ShortcutGrid 8宫格）
    ├── W-4 个人信息（键值对列表 + Tag）
    └── W-5 公告通知（时间+标题列表）
```

## data-dashboard Skill 位置

- **SKILL.md 主文件**: `/Users/tianyi/Documents/文档类/.catpaw/skills/skills-market/data-dashboard/SKILL.md`
- **L1 模板目录**: `/Users/tianyi/Documents/文档类/.catpaw/skills/skills-market/data-dashboard/references/L1-templates/`（有 L1-cockpit/goal/marketing/monitor/overview，**缺少 L1-workbench**）
- **L2 模块目录**: `/Users/tianyi/Documents/文档类/.catpaw/skills/skills-market/data-dashboard/references/L2-modules/`
- **W 模块**: 在 SKILL.md 主文件 §2 有表格描述（W-1~W-5），但**没有独立的 L2 reference 文件**

## 待做事项（新对话需完成）

1. **改造 WorkbenchDashboard 页面** — 用户说"要改工作台页面"，具体改动待新对话确认
2. **新建 L1-workbench.md** — 在 `references/L1-templates/` 下新增工作台 L1 模板文档，描述主-侧分栏布局骨架、模块排布规则
3. **完善 W-n L2 模块文档** — 当前 W-1~W-5 仅在 SKILL.md 表格中有一行描述，需要补充独立的 reference 文件（类似 G1/G2/G3 已有的 `.md` 文件），包含每个 W 模块的：
   - 适用场景
   - 完整布局结构描述
   - 代码示范片段
   - 变体说明（如有）
4. **同步 SKILL.md 中的 W-n 表格** — 确保和新建的 L2 文件一致

## 已知注意事项

- OverviewDashboard 是所有样式的"源码真相"，其他页面必须与之保持一致
- MTD3 的 Tabs content 有默认 `padding: 16px 0`，已通过全局 CSS 覆盖
- Table sticky 列需要不透明背景（tokens.css 已处理）
- 首个 ModuleWrapper 需要 `tooltipPlacement="bottom"` 避免被 header 遮挡
