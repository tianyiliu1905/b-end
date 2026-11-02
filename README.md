# B 端页面生成 Skill 与示范案例

本仓库包含 B 端页面生成 Skill 知识库及配套示范项目。

## 目录

- [`b-end-page/`](b-end-page/)：Skill 完整导出，包含主说明、页面模板、模块规范、主题和 MTD3 资源。入口为 [`SKILL.md`](b-end-page/SKILL.md)。
- [`b-end-showcase/`](b-end-showcase/)：配套示范案例，使用 React、TypeScript 和 Vite。

## 运行示范案例

需要 Node.js 20.19.0 或更新版本，以及能获取项目依赖（包括内部包 `@ss/mtd-react3`）的 npm 环境。

```bash
cd b-end-showcase
npm ci
npm run dev
```

构建：`npm run build`。

## 来源

- Skill：Friday Skill ID `97696` 的下载包，原始文件按导出结构保留。
- 示范案例：`~liutianyi06/b-end-showcase` 仓库 `master` 分支，导入提交 `e81968664aaf9083d566da265d0daf4b667401b2`。

示范案例以普通源文件收录，不依赖 Git 子模块；其原仓库提交历史不包含在本仓库中。
