# Detail4 · 审批状态流程 (Approval Flow)

## 用途与边界

详情页回显真实业务审批节点、处理人和意见；区别于 Form4 线性填写步骤条、FD2 当前状态标签和 MTD Timeline 操作日志。自身只读，不包含审批提交；动作交由 Form1 或父页面。

## 输入

`state: pending | approved | rejected`；`nodes: {id,title,owner,state: pending | current | approved | rejected,comment?}[]`。可选 title 指定流程名。稳定id；一个进行中流程至多一个current；通过时全部已通过；驳回时保留前序结果和后续未执行节点。由服务端当前状态驱动，不根据数组下标猜测审批权限。

## 布局与组合

白底1px --border、--radius-3圆角、padding16。标题16px配整体状态Tag，节点列表纵向gap20；24px序号圆点、14px标题、12px处理人与意见。当前节点用语义强调色并有文字，驳回文字红色；颜色不能替代状态文字。长意见换行，空节点显示暂无审批流程。

落地页或抽屉均可承载，通常置于FD2/Detail2之后；详情字段多时可放入Detail1的审批面板。表单填写顺序仍用Form4，不能将审批节点做成可点击跳转。

## 状态

审批中、已通过、已驳回为三个真实状态和展示变体；停止/挂起/撤回不在此轮状态集中，有需求时显式扩展，不能硬映射成驳回。

## 事件

ApprovalFlow 无提交事件。父页面操作区按权限与当前节点开放通过/驳回，驳回原因必填；请求pending禁用重复提交；失败保留意见和旧流程；成功后按服务端新版本更新FD2、Detail4及审批记录。无权限只读。

演示控制器只有本地状态：通过将current标为approved并使下一节点current，最后节点后整体approved；驳回无原因显示错误，有原因记录并结束；终态隐藏审批按钮。重置仅重置演示，不是生产“撤销审批”。

## 约束与验证

预览的“通过/驳回（演示）”明确标注未接审批服务。业务授权、并发版本、重复请求与审计结果须由服务端校验。不得把前端点击视为真正审批成功。

## 实现映射与代码

MTD Tag + 原生有序列表；动作示例用Button/Input.TextArea。完整代码 `../implementations/ApprovalFlow.tsx`，共用 `../implementations/AiModules.css`；生成时只读使用ApprovalFlow，Demo仅作本地交互验证。

```tsx
<ApprovalFlow state={approval.state} nodes={approval.nodes} />
// Form1 / 父页面承接 onApprove/onReject 并在请求成功后替换 approval。
```

React Button合法业务type为normal/primary/danger等；TextArea需按真实textarea读取值。Vue需独立查询组件API。
