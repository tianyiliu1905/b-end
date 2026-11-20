# AI-3 · 智能体执行 (Agent Task)

## 用途与边界

展示公开任务步骤、工具执行状态和确认门槛。不是 Form4 填写向导，也不是模型内部思考面板；不是因选择“规划/辅助模式”就授予工具权限。

## 输入

`state: idle | running | awaiting_confirmation | completed | failed | cancelled`；`steps: {id,title,state: pending | running | completed | failed}[]`；onConfirm/onCancel/onRetry 可选。父页面持有 runId 和服务端结果。可选 title 指定真实任务名，confirmation: {title, description} 说明确认的工具、目标与影响；演示题材通过这些参数传入，不固化为业务规范。

## 布局与组合

白底1px边框、--radius-3、padding16。头部16px标题+状态Tag；步骤纵向gap16，左8px状态点、正文14px、右12px文字状态。颜色不是唯一状态提示。确认区灰底padding12、间距16，描述工具、对象和影响；错误文案12px红色。记录默认折叠。

## 状态

未开始无执行结果；running显示当前步骤；awaiting_confirmation必须停在确认前，不自动继续；completed只在全部已确认完成时展示；failed保留此前完成步骤；cancelled保留结果但不能继续推进旧任务。

## 事件

onConfirm 只允许当前待确认任务，真实确认需服务端验证工具/对象/权限并返回新状态。onCancel 取消真实请求，隔离迟到结果；onRetry 从失败步骤恢复，不能把已完成步骤重复执行当作默认。缺处理函数按钮禁用。展开记录只改变显示，不触发业务操作。

## 约束与验证

预览使用“推进一步”模拟事件，无网络请求。第一步读取→第二步分析→等待确认→完成；失败可重试当前步骤，取消后只能重新演示。核心 AgentTask 是受控显示组件，Demo 不是生产调度器。公开记录不能输出隐藏思考。

有效显示变体：任务执行、等待确认、失败重试；三者共享同一受控组件。

## 实现映射与代码

MTD Tag、Button + 有序公开步骤。完整实现 `../implementations/AiConversationModules.tsx` 中 AgentTask / AgentTaskDemo，样式 AiModules.css。

```tsx
<AgentTask state={run.state} steps={run.steps}
  onConfirm={() => confirmRun(run.id)} onCancel={() => cancelRun(run.id)}
  onRetry={() => retryFailedStep(run.id)} />
```

真实状态转移、权限、幂等与取消结果需在跨模块契约声明，不能把语义事件直接当 MTD 原生属性。
