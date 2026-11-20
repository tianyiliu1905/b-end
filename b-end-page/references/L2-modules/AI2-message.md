# AI-2 · 消息与回答 (AI Answer)

## 用途与边界

展示用户消息和助手文本回答，覆盖逐段生成、完成、停止与失败，带引用来源、复制和重新生成。不同于 D-11 静态诊断摘要。本轮纯文本默认转义，不支持把任意模型 HTML 直接插入 DOM。

## 输入

AiAnswer 接收 `text: string`、`state: streaming | completed | stopped | failed`、可选 `sources: {id,title,href}[]`、onRetry/onStop。父页面持有消息和 runId。来源必须有真实依据；没有来源就隐藏，不编造业务知识库。演示来源明确标为“组件参考：BoardUI（非业务依据）”。

## 布局与组合

白底、1px --border、--radius-3、padding16。头部助手名称和状态，名称16px；正文14px、1.8行高、pre-wrap换行、长文本折行。来源与操作各在下方间距16px，12px辅助字号。用户消息灰底、最大85%宽、右对齐。颜色用语义 token。

## 状态

streaming 时 aria-busy=true，空文本显示准备提示；completed 正常完成；stopped 保留已有文本；failed 无文本时显示可重试提示，有文本时保留。状态仅代表父页面传入结果，不推导真实后端成功。

## 事件

复制仅复制正文，空文本禁用；clipboard 失败显示手动复制提示。流式状态显示停止，终态显示重试/重新生成；未传处理函数时按钮禁用。父页面负责真正取消流、隔离旧 runId 和替换新回答，而非无条件追加重复消息。

## 约束与验证

sources 链接仅允许 http/https，其余显示为不可用文本；默认 React 转义，不解析原始 HTML。完整回答与失败重试是演示初态，不是两个不同消息结构。演示重新生成每100ms追加6个字符，停止清除 interval，卸载清除定时器；真实业务用实际数据流替换，不继承此节奏为视觉规范。

## 实现映射与代码

MTD Button + 原生安全文本/链接，回答不是 MTD TextArea。完整实现 `../implementations/AiConversationModules.tsx` 的 AiAnswer / AnswerDemo，样式 AiModules.css。

```tsx
<AiAnswer text={message.text} state={message.state} sources={message.sources}
  onRetry={() => retryMessage(message.id)} onStop={() => cancelRun(message.runId)} />
```

查询 Button 的已安装 API；复制浏览器依赖 navigator.clipboard，失败处理必须保留。
