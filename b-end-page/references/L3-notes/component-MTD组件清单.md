---
name: MTD组件库（L3入口）
name_en: MTDComponentLayer
type: component-index
description: L3 层入口。B 端表单页/详情页的所有原子组件直接调用本地 MTD 代码组件库，组件知识库（API/示例/注意事项）通过 mtd3/scripts/mtd-rag.js 实时查询，本文不手写视觉参数
keywords: [MTD, 组件, 组件库, mtd-rag, 知识库, Input, Select, Form, Button, Row, Col, Tabs, Table, Timeline, Steps, Tag, 调用约定]
use_when:
  - 模块排版确定后，需要确认用哪个 MTD 组件、组件的 API/示例/注意事项
  - 需要解决 MTD 组件报错
  - 需要安装/配置 MTD 组件库或查图标
---

# L3：MTD 组件库（入口）

> **本层职责**：B 端表单页/详情页 UI 的所有原子组件直接调用本地 MTD 代码组件库（`@ss/mtd-react3` / `@ss/mtd-vue2` / `@ss/mtd-vue3`）。组件外观（色值/字号/圆角/各种状态）已封装在代码组件内部。表单页与详情页完全共用本层，不做区分。
>
> ⚠️ **本文不手写任何组件的视觉参数或 API**。组件的最新 API、示例、注意事项一律通过随附脚本 `mtd-rag.js` **实时查询官方知识库**，避免参数过时或臆造。

---

## 一、核心动作：查询组件知识库

确定要用哪些组件后，**先执行脚本拉取知识库，再据此生码**。脚本位于 skill 根目录的 `mtd3/scripts/` 下。

```bash
# 进入脚本目录（脚本依赖相对路径，请在 mtd3/ 下执行）
cd mtd3

# 查询单个组件（React，默认最新版）
node scripts/mtd-rag.js query_components_direct --components=Input --target=mtd-react --quiet

# 查询多个组件（逗号分隔，无空格）
node scripts/mtd-rag.js query_components_direct --components=Form,Input,Select,Button --target=mtd-react --quiet

# 指定版本（推荐：从项目 package.json 读取 @ss/mtd-react3 的版本）
node scripts/mtd-rag.js query_components_direct --components=Form,Input --target=mtd-react --mtd-version=0.12.9 --quiet

# Vue 框架（@ss/mtd-vue2 / @ss/mtd-vue3）
node scripts/mtd-rag.js query_components_direct --components=Button --target=mtd-vue --quiet
```

**参数要点**：

| 参数            | 说明                                       | 必填             |
| --------------- | ------------------------------------------ | ---------------- |
| `--components`  | 组件名，首字母大写，多个用逗号分隔且无空格 | 是               |
| `--target`      | `mtd-react` 或 `mtd-vue`，**绝不混用**     | 是               |
| `--mtd-version` | 组件库版本号，从项目 package.json 读取     | 否（默认最新版） |
| `--quiet`       | 静默模式，只输出纯净知识库内容             | 建议             |

> ✅ 脚本通过 `npx @ss/mtd-rag-mcp` 调用美团内网知识库服务（registry `r.npm.sankuai.com`），需要内网环境。已实测可正常返回组件文档。

---

## 二、使用流程（结合 L1/L2）

1. **L1/L2 定好排版后**，列出本模块涉及的 MTD 组件：
   - 表单页常用：`Form`、`Input`、`Textarea`、`InputNumber`、`Select`、`Radio`、`Checkbox`、`Switch`、`DatePicker`、`Cascader`、`Upload`、`Button` 等
   - 详情页常用：`Row` / `Col`（描述列表 D5 自建，MTD 无 `Descriptions` 组件）、`Tabs`（Tab 切换 D3）、`Table`（只读数据表格 G8）、`Timeline`（时间线直接调用，无独立 L2）、`Tag` / `Badge`（状态标签，G2 表头扩展）、`Image`（附件预览 D9）、`Breadcrumb`、`Button` 等
2. **校验组件名**：去 `mtd3/references/component_name.md` 确认组件名存在于全集（避免臆造）
3. **拉知识库**：用上面的命令一次性查询所有涉及组件
4. **查注意事项**：读 `mtd3/references/precautions.md`，重点关注 Form / InputNumber / message / Grid(实为 Row+Col) 等特殊规则
5. **守统一样式规范**：读 `references/style-profile.md`，逐条对照生码；所有视觉 Token、间距和基础 UI 准则均以此为唯一来源。
6. **生码**：按知识库的 API 与示例编写，外观不手动覆盖（状态用组件 props 控制，不手写 CSS 模拟）
7. **报错修复**：组件报错时重新拉该组件知识库对比修复，最多重试 3 次

---

## 三、随附资源索引（均在 skill 根目录 `mtd3/` 下）

| 资源                                  | 用途                                                       |
| ------------------------------------- | ---------------------------------------------------------- |
| `mtd3/scripts/mtd-rag.js`             | ⭐ 核心脚本：查询 MTD 组件知识库（API/示例/注意事项）        |
| `mtd3/scripts/icon.js`                | ⭐ 图标脚本：query 语义搜索 / validate 验证图标名合法性    |
| `mtd3/scripts/HOW_TO_USE.md`          | 脚本命令行详细用法与 FAQ                                    |
| `mtd3/references/component_name.md`   | 组件名全集（React / Vue），校验组件名是否存在               |
| `mtd3/references/precautions.md`      | 特殊组件使用规则与常见陷阱（必读）                         |
| `mtd3/references/icon_name.md`        | Icon 图标使用规范（配合 `scripts/icon.js` 查询验证）        |
| `mtd3/references/INSTALLATION.md`     | MTD 组件库安装、样式引入、主题配置（React/Vue）            |
| `mtd3/references/EXAMPLE.md`          | 完整使用示例（含表单页生成的端到端流程）                   |
| `references/style-profile.md`          | 统一样式规范唯一来源（视觉 Token、间距和基础 UI 准则，生码必须逐条遵循） |

---

## 四、铁律

- 表单控件一律用 MTD 组件，**不自造组件、不引第三方组件库**
- **非表单类 UI 元素同理**：公告/提示（`Announcement`）、面包屑（`Breadcrumb`）、标签（`Tag`）、徽标（`Badge`）等 MTD 已提供的组件，**一律直接用 MTD 组件，禁止手写 div 模拟**。判断标准：如果 `component_name.md` 中存在对应组件名，就必须使用 MTD 组件
- React 与 Vue 组件库**绝不混用**，按项目 package.json 判定 `--target`
- 组件状态（禁用/加载/选中/错误等）用组件 props 控制，**严禁**手写 CSS 模拟
- 组件参数以脚本实时查到的知识库为准，**不臆造、不沿用记忆中的旧 API**
- **使用 Icon 组件时，必须先用 `node scripts/icon.js query <中文关键词>` 搜索候选，再用 `node scripts/icon.js validate <图标名>` 确认图标名合法**（详见 `mtd3/references/icon_name.md`）。不存在的图标名不会报错，而是静默渲染为宽高 0 的空元素（页面上完全不可见），这是最常见的"图标丢失"原因。严禁凭记忆臆造图标名
- **样式引入必须包含 icon 组件级 CSS**：仅引入全局 `@ss/mtd-react3/lib/style/index.css` 不够，还需引入 `@ss/mtd-react3/lib/icon/style/index.css`（含字体字符映射），否则所有图标均不渲染
- **`Row`/`Col` 的 `gutter` 必须传纯 JS number，禁止传 `var(--gap-module)` 这类 CSS 变量字符串**：`Row` 组件内部会对 `gutter` 做 `gutter / 2` 的除法运算来生成负 margin（且 `propTypes` 明确声明为 `number`），传字符串会得到 `NaN`，导致整行栅格间距错乱。若要让 `gutter` 跟随间距 token 联动，用一个和 CSS token 数值保持同步的 JS 常量（如 `GAP_MODULE = 8`）做中转，不要裸写数字也不要直接引用 CSS 变量。纯 CSS Grid/Flex 的 `gap` 属性不受此限制，可以直接写 `var(--gap-module)`。详见 [mtd-row.md](./mtd-row.md)
