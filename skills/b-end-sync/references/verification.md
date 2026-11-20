# 同版本与语义一致性的判定

## 三层证据

1. **结构**：目录 ID、预览注册、规范 key、路由真实入口、映射文件均存在。缺少其中之一是阻塞。D-ChartCard 不要求独立目录入口。
2. **内容漂移**：对映射文件及本地 import 依赖计算 SHA-256；映射内容与 known-issues 也进入指纹。任何变化让旧核验失效。`.sync/baseline.json` 是初始化时的观测快照，只用于显示变化文件，绝不是“已同步证明”。
3. **语义复核**：比较设计意图、变体、视觉值、输入、状态与事件、代码骨架和复制结果，并执行必要的浏览器检查。脚本不会从字符串相等推出视觉一致，也不会从同一 Git 提交推出规范一致。

只有命中范围具有有效复核证据、当前指纹相同、没有结构或已知语义阻塞时返回 verified。未复核的范围始终 unreviewed。完整 audit 全部 verified 才能声称全仓库已核验一致；实际工作通常只核验本次范围。

## 使用

在仓库根目录执行（安装在用户目录时也可替换为该 Skill 的绝对路径）：

```sh
python3 skills/b-end-sync/scripts/sync_check.py audit --scope Form9
python3 skills/b-end-sync/scripts/sync_check.py audit --scope page:/form/basic --json
python3 skills/b-end-sync/scripts/sync_check.py audit --json
```

依赖：Python 3.9+、Node、展示项目本地 TypeScript。`inventory.cjs` 只解析 AST，不执行应用代码。若项目尚无依赖，使用其现有 lockfile 安装依赖；解析不支持新结构时返回错误，应更新解析器，禁止将错误视为一致。

读取审计 JSON 的 fingerprint，完成检查后写入 `.sync/evidence/<scope>-<date>.json`。示例结构（值必须换成真实结果）：

```json
{
  "scope": "Form9",
  "fingerprint": "从当前 audit 输出复制完整 SHA-256",
  "reviewer": "实际执行复核的代理或维护者",
  "summary": "描述此次实现与知识同步结果",
  "checks": {
    "identity": "预览源文件、L2 文件、索引与规范 key 的核对证据",
    "variants": "实际逐项核对的变体及未覆盖范围",
    "visual_tokens": "关键布局值、间距、两套主题与 CSS/知识的一致性",
    "behavior": "输入、删除、重置、只读等适用行为的实际结果",
    "copy_spec": "复制文本的模块/变体/代码骨架与当前实现的比对结果",
    "validation": "构建命令与结果、浏览器检查页面与操作；不可用项说明限制"
  }
}
```

证据内容由维护者负责；脚本只检查结构、指纹和证据完整性，不能鉴别虚构的“通过”。非适用项写明原因，不能凭未运行测试的构建成功代替行为检查。若验证能力不足，不进行 record，保持 unreviewed/stale 并说明原因。

```sh
python3 skills/b-end-sync/scripts/sync_check.py record --scope Form9 --evidence .sync/evidence/Form9-2026-11-09.json
python3 skills/b-end-sync/scripts/sync_check.py audit --scope Form9
```

record 不修代码、不修 Skill、不发布、不推送、不重置其他范围。已知阻塞存在时拒绝记录。`.sync/reviews.json` 保存按范围复核记录和证据摘要；证据被改写或删除也会使核验过期。

## 六项比较中的常见漏项

- PreviewVariant 的显示名与 designSpecs.variants key 不同：getDesignSpec 可能返回全部变体，复制按钮仍会“成功”。要验证复制内容，而非只看提示。
- G-4/Form5/FD3 都渲染表格，但选择/编辑/只读边界不同。
- 页面业务数据、模拟 API 和临时文案是场景参数；不要把它们写成全局默认。
- CSS 原始 token、主题映射、复制文本内嵌的硬编码值可能分别过期；蓝/黄来回切换验证最终计算样式。
- 生成案例 iframe 的独立 document 也必须接收主题变化；抽屉、弹窗应留在案例范围内。
- 精确 canonical key 的结构检查不能验证 legacy resolver 的具体选择；实际调用的 moduleId 与 variantName 必须人工/运行时验证。

## 变更覆盖的保守性

整文件哈希会让 `modulePreviews.tsx`、`designSpecs.ts` 或共享依赖的任何编辑影响多个范围。这是“需要重新核对”，不是断言所有模块都坏了。页面映射含候选模块，避免漏掉组合依赖；需要更细粒度时可以改进映射/检测器，但不可跳过未核验内容后仍声称全仓库同版本。

新增未接入目录/路由的实验文件可能不在范围内。每次还需看 `git diff --name-status` 与未跟踪文件，决定加入映射或明确不参与生成知识；静态 import 分析不覆盖任意运行时拼接路径。
