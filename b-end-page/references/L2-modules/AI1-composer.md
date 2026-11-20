# AI-1 · 对话输入 (Conversation Composer)

## 用途与边界

连续会话的输入区，负责草稿、附件暂存、模式与模型选择、发送和停止入口。不是 Form3 字段布局，也不是 Form7 上传区；工作模式不等于执行权限。此轮实现 React，Vue 需查真实 API 后另行映射，不混用 React 示例。

## 输入

`variant: 'panel' | 'compact'`；可选 `context: string`；`running: boolean`；`onSubmit({text, attachments: File[], model, mode}): Promise<void>`；`onStop?: () => void`。模型目录在参考实现中为显式演示选项，生产使用业务提供的目录；实际权限和目录可用性由服务端验证。

## 布局与组合

白底卡片，1px --border、--radius-3 圆角、padding 16。面板式在 context 有值时显示上下文条，输入 3–10 行；紧凑式无上下文条，输入 1–3 行。附件位于输入上方；底部依次为添加附件、工作模式、模型选择和右侧发送/停止。控件 gap 8px，可换行。辅助文案 12px。

上下文条是演示“运营知识库”，生产替换真实上下文，不把示例项目固定成通用规则。模型、模式和附件不是新增一级 L2，可作为输入模块子区块维护。

## 状态

草稿初值空、附件空、mode=assist、model=standard。最大 4000 字；全空白禁用发送。提交期间同步 ref 锁防止重复提交，控件禁用。onSubmit resolve 代表请求已受理才清空；reject 保留草稿和附件并报错。切换页面卸载后不更新旧组件状态。

附件本地最多 3 个、每个 10MB（演示限制，可由业务调整），按 name/size/lastModified 去重，超限拒绝本次追加且保留已有附件。选择和移除均不发网络请求。生成中可编辑下一份草稿，但不发送新一轮；停止事件由父页面取消真实任务。

## 事件

- Enter 发送，Shift+Enter 换行；IME composition 与 keyCode=229 不发送。
- onSubmit 取得去空白文本、File 快照、模型和模式；模式与模型在一轮生成期间锁定。
- onStop 只发取消意图，业务需取消实际请求并隔离迟到 runId。
- 失败可直接再次发送；成功后清空输入/附件。示例通过勾选“模拟发送失败”验证失败保留。

## 约束与验证

不把本地 File 选择宣称成上传完成，不通过模式菜单绕过服务端授权。变体显示名必须是“面板式”“紧凑式”；复制 Spec 每次仅包含所选变体章节。

## 实现映射与代码

MTD Input.TextArea、Select、Button 与原生 file input。当前 React Select 必须 onlyKeyValue；TextArea onChange 的 target 类型含 div，读取值时按实际 textarea 做类型收窄。TextArea autosize 用对象；Button htmlType="submit" 与业务 type="primary" 分开。

完整可移植 React 实现与演示：`../implementations/AiConversationModules.tsx` 中 ConversationComposer / ComposerDemo；样式 `../implementations/AiModules.css`。生成时复制这两个文件到同一目录，只使用核心组件；父页面自行接入实际 API。演示控制器不可充当后端服务。

```tsx
<ConversationComposer variant="panel" context={selectedContext.name} running={run.status === 'running'}
  onSubmit={payload => acceptRun(payload)}
  onStop={() => cancelRun(run.id)} />
```

查询：`node mtd3/scripts/mtd-rag.js query_components_direct --components=Input,Select,Button --target=mtd-react --quiet`。远程知识不可用时核对已安装版本的类型与实现，并记录限制。
