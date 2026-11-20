# 仓库地图与修改边界

机器可读完整映射见 `file-map.json`：45 个 L2 目录模块、D-ChartCard 共用基础、17 个业务页路由、theme 与 shell。脚本解析当前 TS AST 核对目录、预览注册、Spec key 与路由入口；引用文件不存在会报错。

## 文件各管什么

| 位置 | 职责与同步注意点 |
| --- | --- |
| `b-end-page/SKILL.md` | 生成流程与分支入口；不是展示站 UI。只有生成策略改变才改这里 |
| `references/L2-modules/index.json` | G/D/W 索引；G-6 的 files 是 L1 列表 §7.2 章节引用，不是 L2 目录下真实文件 |
| `references/INDEX-ai.md` | AI-1/AI-2/AI-3 的模块级选型与嵌入，不冒充第五类 L1 模板 |
| `references/implementations/` | 可移植 React 参考实现，需与展示真实实现及独立复制 Spec 同步 |
| `references/INDEX-form-detail.md` | FD/Form/Detail 专用索引，不让表单/详情走 G/D/W 选型 |
| `references/L1-templates/` | 列表、看板、表单、详情四类装配规则；页面修改需区分业务特例与通用组合 |
| `references/L2-modules/` | 各模块布局/变体/参数/约束/代码；General-Layout.tsx 是可复制导航实现，D-ChartCard 为图表共用头部 |
| `references/module-contract.md` / `page-contract.md` | 模块的七类描述字段、页面数据状态与动作联动，不是已实现的运行时协议 |
| `references/style-profile.md` / `theme-system.md` / `theme-examples/` | 跨模块视觉和主题规范、React/Vue 示例与图表映射 |
| `mtd3/` | L3 组件查询脚本和说明；API 知识不等于模块组合/视觉规范 |
| `b-end-showcase/src/App.tsx` | 当前路由事实来源。页面文件存在不意味着仍在使用 |
| `src/data/l2Modules.ts` | 目录摘要、触发词、角色、变体标签，不能代替知识正文 |
| `src/components/modulePreviews.tsx` | 真实预览入口：modulePreviews / modulePreviewVariants / modulePreviewSubGroups 三张注册表。FD3/Form4 仅在变体表也合法 |
| `src/components/*Preview.tsx`、同名 CSS | 复用预览具体实现；G4DataTable、DigestCard、ShortcutGrid 等也需沿 import 读 |
| `src/data/designSpecs.ts` | 网站复制的独立规范副本，包含代码骨架和 TOKEN_APPENDIX；不会从 Skill 自动更新 |
| `CopySpecButton.tsx` / `ModuleWrapper.tsx` | 复制入口；调用可能传 legacy 描述字符串，需核对 resolver，不能只看 hasDesignSpec=true |
| `src/pages/ModuleDetail.tsx` | 预览/Spec 面板和变体选择；这里变了不代表实际组件变了 |
| `src/pages/dashboard|list|form|detail/` | 业务案例与页面装配。只有实际路由/import 可确认活跃代码 |
| `src/pages/examples/StoreOperations*` / `storeData.ts` / `store-operations.design-spec.json` | Skill 实测案例、模拟数据、页面设计决策；只把可复用结论提炼到知识库 |
| `src/styles/tokens.css` / `theme/useTheme.tsx` / `lib/chartTokens.ts` / `hooks/useG2Chart.ts` | 运行时主题实现，与 Skill 的示例/规则联动 |
| `ShowcaseLayout*` / `Landing*` / `ModulesIndex*` / `GeneratedExample*` | 知识库外壳与嵌入浏览。`/showcase/store-operations` 包含 iframe；真实业务路由是 `/examples/store-operations?embedded=1` |
| `docs/portfolio/` | 项目作品集，不是规范权威来源，也不自动同步成模块规则 |
| `skill.manifest` / `skill.sig` | 下载包来源凭证。内容已经修改时旧签名不能证明当前本地版本有效 |

## 页面入口陷阱

- `/form/basic` → DealFormPage → DealAppShell → 实际表单；不是 BasicForm.tsx。
- `/form/step` → StoreSettingsPage.jsx（主从）；`/form/stepper` → MerchantOnboardingPage.jsx（步骤）；名字不能代替路由事实。
- `/form/group` → SpecQualificationPage.jsx；`/form/modal` → ModalFormPage。
- `/detail/basic` → detail/AppShell → CampaignDetail；`/detail/card` → MasterDetailPage；`/detail/timeline` → DrawerDetailPage；`/detail/modal` → ModalDetailPage。
- 页面涉及的候选模块映射刻意偏保守；检查实际 imports、ModuleWrapper 的 moduleId、业务动作和状态归属后，仅编辑本次受影响知识。
- D-2（环形进度/进度指标）、D-3（折线/面积）和 D-11 使用子组注册。不要只检查默认预览，复制时也必须带正确子组 ID。
- G-1/G-2 在案例 JSON 可拆写，但规范合并入口是 G-1+G-2；G-5/List-2/List-3 不作为独立选型模块。

## 已知基线差异

初始化审计发现的 D-13、W-4、W-6、W-7 身份冲突已于 2026-11-13 按活跃业务实现与 Skill 定义修复，G-6 已补真实树筛选预览；历史发现与修复依据保存在 `.sync/known-issues.json` 和逐范围 evidence 中。当前状态仍须运行 audit，不能由本段历史说明推导。不要为了通过核验把它们简单改成名字相同：应核对任务意图、数据结构、预览、Spec、索引和所有调用者。

这些差异是诊断结果，不是本 Skill 要强行规定的设计方向。后续修复相应范围后，将 known-issues 对应项改成 resolved，并补充 resolution/evidence；重新审计和记录。
