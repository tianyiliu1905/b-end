# 页面描述契约（Design Spec 扩展）

用于跨模块联动、业务动作、数据驱动的组件选型。在已有 Design Spec JSON 上扩展；它是代码生成的中间描述，不是 DIL、运行时协议或可直接执行的程序。仅补充本次需求涉及的字段，不把所有页面变成配置平台。样式小改和组件 API 问答无需生成完整契约。

## 选型：任务 → 数据 → 模块 → 组合

先说明用户要理解、决定或操作什么，再核对数据前提，最后按 L1/L2 选型。关键词只是候选入口：
- 趋势需要时间字段与可比较指标；缺少时说明数据缺口，不捏造真实趋势。
- 排名需要比较对象、指标和排序口径；明细处理优先表格与行操作。
- 筛选条件来自真实字段及其类型，复杂度按现有 G-3 规范判断。
- 原型允许明确标注模拟数据；不要把假设、模拟数据或未接通的接口说成事实。

读取命中的 L2 文档后，为该次选型明确：模块 ID、有效变体、必需数据、可配置内容、允许的子区域、内置能力、事件及参数。以专用索引和模块文档为准，不把展示站的无参数预览组件当作可配置运行时。规则冲突时结合现有实现选择并记录依据，不凭空创造变体。

G-4 已含操作栏、表格、分页，可内嵌 tab；不得再独立装配 G-5、List-2、List-3。已有页面容器时复用导航；从零整页仍遵循原有导航规则。

## 在现有 JSON 上增加的字段

- `spec_version`: 本扩展使用 `1.0`，区别于 skill 包版本。
- `modules[].instance_id`: 页面内唯一且增量修改时保持稳定；`id` 仍表示已有 L2 模块类型。同类模块可有多个实例。
- `modules[].data_source`: 引用 `data_sources` 中的数据源名。
- `modules[].bindings`: 组件输入到 `state` 中状态名的映射。
- `modules[].events`: 事件名到 `actions` 中动作名的映射。
- `data_sources`: 数据来源模式（mock/local/remote）、字段与类型；remote 只填写已知接口，未知接口记录待接入点。前端筛选/分页与服务端筛选/分页须明确，不能重复执行两套分页。
- `state`: 本次相关状态的初值；服务端已有状态管理时复用它。
- `actions`: 事件参数、执行位置（local/remote/navigation/agent）、代码处理函数名、状态变化、受影响实例，以及必要的 pending/success/error 行为。只有项目确有 Agent 接入时才使用 agent。

引用字符串是命名引用，不是可 eval 的表达式。自然语言 `effects` 是实现与验收要求，需要落实为代码；它本身不会执行。模块事件名是本页语义事件，须映射至查证过的 MTD API，不能当成 MTD 原生属性照抄。

## 筛选区＋表格示例

下面是已有页面内容区的契约扩展片段，不是完整 Design Spec；已有导航复用，变体仍按命中的 L2 文档填写。

```json
{
  "spec_version": "1.0",
  "data_sources": {
    "orders": {
      "mode": "mock",
      "fields": {"id": "string", "status": "string", "amount": "number"},
      "processing": "local: 先按 appliedStatus 筛选，再按 page/pageSize 分页；总数取筛选后数量"
    }
  },
  "state": {"draftStatus": "all", "appliedStatus": "all", "page": 1, "pageSize": 20},
  "modules": [
    {"id": "G-3", "instance_id": "orderFilters", "bindings": {"status": "draftStatus"}, "events": {"change": "editFilter", "submit": "applyFilters"}},
    {"id": "G-4", "instance_id": "orderTable", "data_source": "orders", "bindings": {"status": "appliedStatus", "page": "page", "pageSize": "pageSize"}, "events": {"pageChange": "changePage"}}
  ],
  "actions": {
    "editFilter": {"kind": "local", "payload": {"status": "string"}, "handler": "editOrderFilter", "effects": ["校验枚举值后更新 draftStatus"], "targets": ["orderFilters"]},
    "applyFilters": {"kind": "local", "payload": {}, "handler": "applyOrderFilters", "effects": ["draftStatus 复制给 appliedStatus", "page 重置为 1", "重算可见行与总数；零结果展示空态"], "targets": ["orderTable"]},
    "changePage": {"kind": "local", "payload": {"page": "integer"}, "handler": "changeOrderPage", "effects": ["将有效页码写入 page", "重算可见行"], "targets": ["orderTable"]}
  }
}
```

远程保存等异步动作需补充：提交哪些字段、如何校验、执行中如何防重复、成功更新什么、失败保留什么及如何重试。只有真实成功才显示成功反馈；未接入后端时明确为模拟实现。只在浏览器内修改表单的操作无需交给 Agent。

## 生成前检查与代码落地

1. 核对实例 ID 唯一，模块/变体来自当前索引与 L2 文档，组合符合 L1 且不重复添加内置区域。
2. 核对每个 data_source、binding、event/action、target 引用存在，数据字段满足展示与图表前提。
3. 核对事件参数能满足处理函数需要（如编辑行需要行 ID），数据变更后关联列表、总数、选择项与分页是否一致。
4. 将契约映射为现有框架的组件输入、状态与处理函数；继续查证 L3 API。不要额外引入动态解释器。
5. 用本次涉及的操作检查实际行为，不能只核对按钮或回调是否存在。运行项目已有的适当构建检查，视觉检查仍按原 skill 执行。

此处是明确的检查规则，未提供自动 schema 校验器；不要声称 JSON 已经自动验证或能直接渲染。

## 小范围回归情境

- 修改已有列表筛选：保留导航和状态管理，进入后续页后查询回到第一页，行与总数一起变化。
- 查询零结果：显示空态，分页保持有效；切回全部后恢复数据。
- 请求趋势但无时间字段：标明缺口或使用合适的其他展示，不生成虚假真实数据。
- 仅修改表格字号：直接局部改动，不重新生成整页契约。
- 表单/详情：沿用专用分支；仅在涉及联动或提交动作时内部补充相关状态与事件，不强制展示通用 JSON 或增加确认步骤。
