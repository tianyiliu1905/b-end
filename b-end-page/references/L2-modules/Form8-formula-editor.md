# Form8 · 公式编辑器（FormulaEditor）

> **一句话定位**：输入计算规则/表达式/指标定义的编辑器，或以条件组形式配置筛选/判断规则。
> **信号**：该模块出现基本可反推用户在做配置型表单。

---

## 一、何时用

- 输入计算规则/表达式/指标定义的编辑器，或以条件组形式配置筛选/判断规则。
- prompt 提到公式 / 计算规则 / 表达式 / 指标定义时使用。
- prompt 提到条件组 / 条件配置 / 筛选规则 / 逻辑连接（且/或）时使用。
- prompt 提到计算公式配置 / 预测计算 / 公式模板时使用。
- 该模块出现基本可反推用户在做配置型表单。
- 本模块包含两种变体（条件规则型、计算公式配置型），按用户需求选择。

---

## 二、布局 (ASCII)

本模块包含两种变体，按用户需求选择：

### 变体 A · 条件规则型（统一范式，含 4 种布局形态）

以结构化条件形式配置判断/筛选规则。**条件规则型是一个统一范式家族**，同一套视觉基线（baseline）可衍生出 4 种布局形态：条件组树（A-1）、范围条件（A-2）、分层筛选（A-3）、撑满行（A-4）。所有形态**必须共用同一套基线样式**，仅业务字段布局不同。

#### 共用基线（baseline · 所有条件规则型形态必须对齐）

> 概要：统一灰底块外层容器 + 左侧纵向贯穿逻辑列（连线 + 且/或 badge）+ 内部分组卡片透明描边（只保留一层灰底）+ 标题/操作按钮/链接样式统一。**完整规则以 §四约束 10–16 为准（canonical）**，此处不重复列出细节，新增或调整任一形态时直接对照 §四 逐条核对。

#### A-1 · 条件组树（嵌套树结构）

可递归嵌套的条件组容器。规则行用多个 `Form.Item`（`labelPosition="top"`）组成（判断方式、变量1、变量2、运算符、阈值）。条件组可折叠（三角箭头 + "条件组N" + 删除按钮）。容器间和组内规则间都有逻辑列。新增条件时整行（标签 + 控件）一起出现。

#### A-2 · 范围条件（数值区间）

规则行为 `leftValue [op] 变量 [op] rightValue` 的裸控件行（无顶部标签），多行之间共用**一个**纵向逻辑列 + 单个"且"badge（不是每两行插一个）。头部带开关 + 结果标签（如"审核结果：不通过"）。

#### A-3 · 分层筛选（多分组卡片）

灰底块内含多张分组卡片（如"用户属性""用户行为"），卡片透明 + `#e8e8e8` 描边，卡片间用纵向逻辑列的"且/或"连接。每张卡片内有自己的筛选规则行 + 底部蓝色"添加筛选"链接。

#### A-4 · 撑满行条件（等分列）

规则行的字段/运算符/值用 `flex` 比例（如 3:2:3）撑满整行等分，行内 `align-items: center`，操作按钮居中对齐。多行共用一个纵向逻辑列。

**包裹层级结构**（递归嵌套）：

```
┌─ 灰色容器 ─────────────────────────────────────────────┐
│ ┌逻辑列┐  ┌─ 子节点列 ──────────────────────────────┐  │
│ │  │   │  │ ┌─ 条件组1（白色卡片）────────────────┐ │  │
│ │  线   │  │ │ 组标题 [▶ 条件组1] [🗑]            │ │  │
│ │  │   │  │ │ ┌逻辑列┐ ┌规则行─────────────────┐ │ │  │
│ │  且   │  │ │ │  │   │ │ [判断方式][变量1]... │ │ │  │
│ │  │   │  │ │ │  线   │ │ [删除] [添加]        │ │ │  │
│ │  │   │  │ │ │  │   │ └──────────────────────┘ │ │  │
│ │  线   │  │ └────────────────────────────────────┘ │  │
│ │  │   │  │ ┌─ 条件组2 ────────────────────────────┐ │  │
│ │  │   │  │ │ ...                                  │ │  │
│ │  │   │  │ └──────────────────────────────────────┘ │  │
│ └──┘   │  └──────────────────────────────────────────┘  │
│        │  [+ 添加条件组]                                  │
└────────┴───────────────────────────────────────────────┘
```

### 变体 B · 计算公式配置型

以固定文本 + 变量下拉 + 运算符 + 可选 checkbox 组合的公式模板形式配置计算规则。核心组成：

- **灰底配置容器**：整体包裹在浅灰背景容器（`var(--bg-card-inner)`，与 F6 多选组分组卡片背景统一），`border-radius: 8px`，`padding: 16px`
- **键值对左右布局**：每组公式用自定义 `.formula-config-row`（flex 布局）包裹，标签（如「默认计算配置」「例外计算配置」）在左，公式内容在右
- **公式行**：由固定文本（`span.formula-fixed-text`）、运算符（`span.formula-template__op`）、Checkbox、Select 横向排列组成，语意连续的元素保持在同一行
- **子公式行**：紧跟主公式下方，如「其中：安全存量 = [下拉选择] × 安全系数」
- **分隔线**：多组配置之间用细线分隔（`border-top: 1px solid #e8e8e8`）
- **行内删除**：每条规则（`.formula-config-row`）右侧一个轻量删除 icon 按钮（`.formula-config-row__delete`，32×32，`Icon type="delete-o"`），静息灰色、hover 才转红

> 其余细节规则（不用嵌套 Form.Item、所有配置块共用同一卡片规格、公式行不换行等）见 §四约束 8、9、16（canonical）。

**布局结构**：

```
┌─ 灰色容器（formula-config-container）──────────────────┐
│ [默认计算配置]  预测计算量 = 预测需求量 + □ 安全存量 [🗑]│
│                − （在途入库 − 在途出库） − □ 可出库量   │
│                其中：安全存量 = [下拉选择] × 安全系数   │
│ ──────────────────────────────────────────────────────  │
│ [例外计算配置]  预测计算量 = ...（同上结构）        [🗑]│
└────────────────────────────────────────────────────────┘

（删除 icon 位于每条规则行右侧，静息灰、hover 转红；不在容器底部放强调色文字按钮）
```

---

## 三、可配参数

### 变体 A · 条件组规则型

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| groupLogic | 条件组之间的逻辑连接 | `or`（或） |
| ruleLogic | 条件组内部规则之间的逻辑连接 | `and`（且） |
| fields | 可选变量列表 | — |
| methods | 判断方式选项 | `['自定义比值', '平均值', ...]` |
| operators | 运算符选项 | `['>', '>=', '<', '<=', '=', '!=']` |
| collapsible | 条件组是否可折叠 | `true` |

### 变体 B · 计算公式配置型

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| formulaTemplate | 公式模板定义（固定文本 + 变量 + 运算符 + checkbox） | — |
| subFormula | 子公式定义（如安全存量 = 方法 × 系数） | — |
| methods | 预测方法选项列表 | `['预测需求量平均值', '预测需求量最大值', ...]` |
| sections | 配置分组（如默认/例外） | `['默认计算配置', '例外计算配置']` |
| onDelete | 删除某组配置的回调，入参为被删分组标识（如 `'default'` / `'exception'`） | — |

---

## 四、约束

1. **条件组内部的 Form.Item 使用 `labelPosition="top"`**：标签在控件上方左对齐，与外层普通键值对的左右布局区分。由于 `useContext={true}` 会让 label 继承外层 `labelWidth="120px"` 和 `text-align: right`，需用 CSS `width: auto !important; text-align: left` 覆盖
2. **条件组内部控件宽度不写死**：Select / Input 不设固定 `style={{ width: xxx }}`，改用 CSS `flex: 1; min-width: 0` 让所有字段均分可用空间、一行内排列不换行，控件设 `width: 100%` 撑满 Form.Item
3. **逻辑连接列纵向贯穿**：且/或 badge 是一个纵向的列，与右侧条件组列并排，而不是插在每两个条件组之间
4. **新增条件时标签和控件一起出现**：每行规则用 Form.Item 包裹每个字段（判断方式、变量1、变量2、运算符、阈值），新增行时整行带标签一起渲染
5. **操作按钮紧跟条件行末尾**：添加按钮在前，删除按钮在最右侧，不在底部单独放
6. **只保留一层灰色背景**：最外层容器灰底，内部条件组和嵌套容器透明，不叠加多层灰底
7. **且/或 badge 样式统一**：灰底（`#CFD1D3`）白字、无描边、胶囊形、右侧带下拉箭头
8. **计算公式配置型（变体 B）内部不用 Form.Item 包裹**：用自定义 `.formula-config-row`（flex 布局）替代 Form.Item，避免外层 Form.Item label + 内层 Form.Item label 双层叠加浮费空间。label 用 `<span>` 实现，宽度紧凑
9. **公式行默认不换行**：`.formula-template` 使用 `flex-wrap: nowrap`，语意连续的元素保持在同一行，容器通过 `overflow-x: auto` 处理溢出
10. **条件规则型 4 种形态共用同一基线**：条件组树 / 范围条件 / 分层筛选 / 撑满行必须对齐同一套 baseline（统一灰底块、纵向贯穿逻辑列、`#CFD1D3` badge、透明卡片 + `#e8e8e8` 描边、`14px/500` 标题、蓝色 `.add-link`）。任一形态新增或调整时以「条件组树」为基准对齐，不允许各自为政
11. **逻辑列必须纵向贯穿而非短段拼接**：逻辑列用 `flex:1` 的连线自动撑满 + `position:relative;z-index:2` 的 badge 居中；容器需 `align-items: stretch` 让连线能撑满全高。禁止用固定 `padding-top`/`height` 拼多个短线段（会导致断线、错位）
12. **多行规则共用单个逻辑 badge**：一组规则内多行之间用**一条**贯穿连线 + **一个**居中 badge 表示统一逻辑，不要每两行插一个 badge
13. **无顶部标签行的操作按钮 padding-top 归零**：`.rule-row__actions` 基线为 `padding-top: 22px`（对齐带顶部 `Form.Item` label 的行）；对无顶部标签的裸控件行（范围条件、分层筛选等），需按编辑器作用域覆盖为 `padding-top: 0`，使 ＋/🗑 与选择器/输入框顶部齐平
14. **内部卡片不用白底**：分组卡片背景透明，需要视觉区分时用 `1px solid #e8e8e8` 描边 + `6px` 圆角，与外层灰底形成层次，不叠加白色背景
15. **文字+icon 操作链接统一蓝色**：`.add-link` 一律用主色蓝（`var(--primary)`），不使用橙色（`--orange`）或其他强调色
16. **计算公式配置型（变体 B）所有配置块共用同一卡片规格**：默认块、例外块以及任何其它分组块，一律使用同一种卡片样式（同一套灰底 `var(--bg-card-inner)` + `border-radius: 8px` + `padding: 16px` + 公式行布局），**区分不同块只靠块内标题文字**（如「默认计算配置」「例外规则 N」），**不得**用描边、背景色深浅、圆角差异等视觉手段区分不同块。禁止仅给例外块单独加 `border`——那会让例外块看起来像另一种组件，破坏公式编辑器样式的一致性。（注：这与变体 A 条件规则型「透明卡片 + `#e8e8e8` 描边」的层级策略不同——变体 B 是并列的公式块，不存在嵌套层级，故用统一实心灰底卡片而非描边区分）

---

## 五、L3 组件映射与 MTD 查询

### 5.1 组件映射

#### 变体 A · 条件组规则型

| 功能 | React (`@ss/mtd-react3`) | 关键 Props |
|------|--------------------------|------------|
| 规则行字段 | `<Form.Item>` | `label`, `labelPosition="top"` |
| 判断方式/变量选择 | `<Select>` + `<Select.Option>` | `value`, `placeholder`, `onChange` |
| 阈值输入 | `<Input>` | `value`, `placeholder`, `onChange` |
| 折叠箭头 | `<Icon>` | `type="triangle-right"` / `type="triangle-down"` |
| 删除/添加按钮 | `<Icon>` | `type="delete-o"` / `type="add"` |

#### 变体 B · 计算公式配置型

| 功能 | React (`@ss/mtd-react3`) | 关键 Props |
|------|--------------------------|------------|
| 配置分组标签 | `<span>` | `className="formula-config-row__label"` |
| 公式固定文本 | `<span>` | `className="formula-fixed-text"` |
| 运算符 | `<span>` | `className="formula-template__op"` |
| 可选项 | `<Checkbox>` | `checked`, `onChange` |
| 方法选择 | `<Select>` + `<Select.Option>` | `value`, `onChange` |
| 行内删除 | `<button>` + `<Icon>` | `type="delete-o"`（轻量 icon，静息灰色、hover 转红，不用强调色文字按钮） |

### 5.2 MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Form,Select,Input,Icon --target=mtd-react --quiet

# 验证图标名
node "<skill>/mtd3/scripts/icon.js" validate --names=delete-o,add,triangle-right,triangle-down
```

---

## 六、代码骨架（React / Vue3）

### 6.1 变体 A · 条件组规则编辑器 · React

> 变体 A 是以结构化条件组形式配置判断/筛选规则的编辑器，支持递归嵌套的条件组容器、且/或逻辑连接、动态增删规则行。

```tsx
import { useState, useCallback } from 'react';
import { Select, Input, Icon, Form } from '@ss/mtd-react3';

/* -------- 数据类型 -------- */
interface ConditionRule {
  id: string;
  method: string;    // 判断方式
  field1: string;    // 变量1
  field2: string;    // 变量2
  operator: string;  // 运算符
  value: string;     // 阈值
}

interface GroupNode {
  type: 'group';
  id: string;
  expanded: boolean;
  logic: 'and' | 'or';
  rules: ConditionRule[];
}
interface ContainerNode {
  type: 'container';
  id: string;
  logic: 'and' | 'or';
  children: TreeNode[];
}
type TreeNode = GroupNode | ContainerNode;

let _id = 0;
const uid = () => `cg_${++_id}`;

const METHODS = ['自定义比值', '平均值', '最大值', '最小值', '固定值'];
const FIELDS  = ['字段1', '字段2', '字段3'];
const OPS     = ['>', '>=', '<', '<=', '=', '!='];

const defaultRule = (): ConditionRule => ({
  id: uid(), method: '自定义比值', field1: '', field2: '', operator: '>', value: '',
});

const makeGroup = (withRules = true): GroupNode => ({
  type: 'group', id: uid(), expanded: withRules, logic: 'and',
  rules: withRules ? [defaultRule()] : [],
});

/* -------- 逻辑切换 badge -------- */
function LogicBadge({ value, onChange }: { value: 'and' | 'or'; onChange?: (v: 'and' | 'or') => void }) {
  const [open, setOpen] = useState(false);
  const select = (v: 'and' | 'or') => { onChange?.(v); setOpen(false); };
  return (
    <div style={{ position: 'relative' }}>
      <div
        className={`logic-connector ${value === 'and' ? 'logic-connector--and' : 'logic-connector--or'}`}
        onClick={() => onChange && setOpen(!open)}
      >
        {value === 'and' ? '且' : '或'}
        <Icon type="triangle-down" style={{ fontSize: 10, marginLeft: 2 }} />
      </div>
      {open && (
        <div className="logic-connector__menu">
          <div className="logic-connector__menu-item" onClick={() => select('and')}>且（AND）</div>
          <div className="logic-connector__menu-item" onClick={() => select('or')}>或（OR）</div>
        </div>
      )}
    </div>
  );
}

/* -------- 主组件 -------- */
export default function ConditionGroupEditor() {
  // 初始数据：所有条件组平铺在同一个"或"下
  const [root, setRoot] = useState<ContainerNode>({
    type: 'container', id: uid(), logic: 'or',
    children: [makeGroup(), makeGroup(false), makeGroup(false)],
  });

  const updateTree = useCallback((updater: (node: ContainerNode) => ContainerNode) => {
    setRoot(prev => updater({ ...prev }));
  }, []);

  const updateGroupInTree = (node: TreeNode, gid: string, fn: (g: GroupNode) => GroupNode): TreeNode => {
    if (node.type === 'group') return node.id === gid ? fn(node) : node;
    return { ...node, children: node.children.map(c => updateGroupInTree(c, gid, fn)) };
  };

  const removeFromTree = (node: TreeNode, targetId: string): TreeNode | null => {
    if (node.type === 'group') return node.id === targetId ? null : node;
    const newChildren = node.children.map(c => removeFromTree(c, targetId)).filter(Boolean) as TreeNode[];
    return newChildren.length === 0 ? null : { ...node, children: newChildren };
  };

  const toggleExpand = (gid: string) =>
    updateTree(r => updateGroupInTree(r, gid, g => ({ ...g, expanded: !g.expanded })) as ContainerNode);

  const deleteNode = (targetId: string) =>
    updateTree(r => (removeFromTree(r, targetId) || r) as ContainerNode);

  const updateRule = (gid: string, rid: string, patch: Partial<ConditionRule>) =>
    updateTree(r => updateGroupInTree(r, gid, g => ({
      ...g, rules: g.rules.map(rule => rule.id === rid ? { ...rule, ...patch } : rule),
    })) as ContainerNode);

  const addRule = (gid: string) =>
    updateTree(r => updateGroupInTree(r, gid, g => ({ ...g, rules: [...g.rules, defaultRule()] })) as ContainerNode);

  const deleteRule = (gid: string, rid: string) =>
    updateTree(r => updateGroupInTree(r, gid, g => ({ ...g, rules: g.rules.filter(r => r.id !== rid) })) as ContainerNode);

  const updateGroupLogic = (gid: string, logic: 'and' | 'or') =>
    updateTree(r => updateGroupInTree(r, gid, g => ({ ...g, logic })) as ContainerNode);

  const addGroup = () =>
    updateTree(r => ({ ...r, children: [...r.children, makeGroup(false)] }));

  // 统计叶子组序号
  const groupIndexMap = new Map<string, number>();
  let _idx = 1;
  const walkIndex = (n: TreeNode) => {
    if (n.type === 'group') { groupIndexMap.set(n.id, _idx++); }
    else { n.children.forEach(walkIndex); }
  };
  walkIndex(root);

  /* -------- 渲染条件组（叶子） -------- */
  const renderGroup = (group: GroupNode) => {
    const gi = groupIndexMap.get(group.id) ?? 0;
    return (
      <div className="condition-group" key={group.id}>
        <div className="condition-group__header" onClick={() => toggleExpand(group.id)}>
          <Icon type={group.expanded ? 'triangle-down' : 'triangle-right'} style={{ fontSize: 12 }} />
          <span className="condition-group__header-title">条件组{gi}</span>
          <button className="condition-group__header-delete" onClick={(e) => { e.stopPropagation(); deleteNode(group.id); }}>
            <Icon type="delete-o" style={{ fontSize: 14 }} />
          </button>
        </div>

        {group.expanded && (
          <div className="condition-group__body">
            <div className="condition-group__rows">
              {/* 逻辑列：纵向贯穿，跟外层结构一致 */}
              {group.rules.length > 1 && (
                <div className="tree-logic-col">
                  <div className="tree-logic-col__line" />
                  <div className="tree-logic-col__badge">
                    <LogicBadge value={group.logic} onChange={(v) => updateGroupLogic(group.id, v)} />
                  </div>
                  <div className="tree-logic-col__line" />
                </div>
              )}

              <div className="condition-group__rules-col">
                {group.rules.map(rule => (
                  <div className="rule-row" key={rule.id}>
                    <div className="rule-row__fields">
                      {/* 每个字段用 Form.Item 包裹，labelPosition="top"，不写固定 width，用 CSS flex:1 均分 */}
                      <Form.Item label="判断方式" labelPosition="top">
                        <Select
                          value={rule.method || undefined}
                          placeholder="请选择"
                          onChange={(v: any) => updateRule(group.id, rule.id, { method: v })}
                        >
                          {METHODS.map(m => <Select.Option key={m} value={m}>{m}</Select.Option>)}
                        </Select>
                      </Form.Item>

                      <Form.Item label="变量1" labelPosition="top">
                        <Select
                          value={rule.field1 || undefined}
                          placeholder="选择变量"
                          onChange={(v: any) => updateRule(group.id, rule.id, { field1: v })}
                        >
                          {FIELDS.map(f => <Select.Option key={f} value={f}>{f}</Select.Option>)}
                        </Select>
                      </Form.Item>

                      <Form.Item label="变量2" labelPosition="top">
                        <Select
                          value={rule.field2 || undefined}
                          placeholder="选择变量"
                          onChange={(v: any) => updateRule(group.id, rule.id, { field2: v })}
                        >
                          {FIELDS.map(f => <Select.Option key={f} value={f}>{f}</Select.Option>)}
                        </Select>
                      </Form.Item>

                      <Form.Item label="运算符" labelPosition="top">
                        <Select
                          value={rule.operator || undefined}
                          placeholder="运算符"
                          onChange={(v: any) => updateRule(group.id, rule.id, { operator: v })}
                        >
                          {OPS.map(o => <Select.Option key={o} value={o}>{o}</Select.Option>)}
                        </Select>
                      </Form.Item>

                      <Form.Item label="阈值" labelPosition="top">
                        <Input
                          value={rule.value}
                          onChange={(e: any) => updateRule(group.id, rule.id, { value: e.target?.value ?? e })}
                          placeholder="阈值"
                        />
                      </Form.Item>
                    </div>

                    {/* 操作按钮紧跟行末尾：添加在前，删除在最右侧 */}
                    <div className="rule-row__actions">
                      <button className="rule-row__action-btn" onClick={() => addRule(group.id)}>
                        <Icon type="add" style={{ fontSize: 14 }} />
                      </button>
                      <button className="rule-row__action-btn rule-row__action-btn--danger" onClick={() => deleteRule(group.id, rule.id)}>
                        <Icon type="delete-o" style={{ fontSize: 14 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* -------- 渲染树节点（递归） -------- */
  const renderNode = (node: TreeNode): React.ReactNode => {
    if (node.type === 'group') return renderGroup(node);

    return (
      <div className="tree-container" key={node.id}>
        {node.children.length > 1 && (
          <div className="tree-logic-col">
            <div className="tree-logic-col__line" />
            <div className="tree-logic-col__badge">
              <LogicBadge value={node.logic} />
            </div>
            <div className="tree-logic-col__line" />
          </div>
        )}
        <div className="tree-container__children">
          {node.children.map(child => (
            <div key={child.id} className="tree-container__child">{renderNode(child)}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="condition-groups">
      {renderNode(root)}
      <button className="add-link" onClick={addGroup}>
        <Icon type="add" style={{ fontSize: 12, marginRight: 4 }} />添加条件组
      </button>
    </div>
  );
}
```

### 6.2 变体 B · 计算公式配置器 · React

> 变体 B 是以固定文本 + 变量下拉 + 运算符 + 可选 checkbox 组合的公式模板形式配置计算规则的编辑器。

```tsx
import { useState } from 'react';
import { Select, Checkbox, Icon } from '@ss/mtd-react3';

const FORECAST_METHODS = ['预测需求量平均值', '预测需求量最大值', '预测需求量中位数', '预测需求量加权平均'];

export default function FormulaTemplateEditor({
  onDelete,
}: {
  onDelete: (group: 'default' | 'exception') => void;
}) {
  const [defaultMethod, setDefaultMethod] = useState('预测需求量平均值');
  const [exceptionMethod, setExceptionMethod] = useState('预测需求量平均值');
  const [defaultChecks, setDefaultChecks] = useState<Record<string, boolean>>({
    safeStock: false, outStock: false,
  });
  const [exceptionChecks, setExceptionChecks] = useState<Record<string, boolean>>({
    safeStock: false, outStock: false,
  });

  const toggleCheck = (group: 'default' | 'exception', key: string) => {
    const setter = group === 'default' ? setDefaultChecks : setExceptionChecks;
    const current = group === 'default' ? defaultChecks : exceptionChecks;
    setter({ ...current, [key]: !current[key] });
  };

  const renderFormulaRow = (
    label: string,
    method: string,
    setMethod: (v: string) => void,
    checks: Record<string, boolean>,
    group: 'default' | 'exception',
    onDelete: (group: 'default' | 'exception') => void,
  ) => (
    <div className="formula-config-row">
      <span className="formula-config-row__label">{label}</span>
      <div className="formula-config-row__body">
        {/* 主公式行 */}
        <div className="formula-template">
        <span className="formula-fixed-text">预测计算量</span>
        <span className="formula-template__op">=</span>
        <span className="formula-fixed-text">预测需求量</span>
        <span className="formula-template__op">+</span>
        <Checkbox checked={checks.safeStock} onChange={() => toggleCheck(group, 'safeStock')} />
        <span className="formula-fixed-text">安全存量</span>
        <span className="formula-template__op">−</span>
        <span className="formula-fixed-text">（</span>
        <span className="formula-fixed-text">在途入库</span>
        <span className="formula-template__op">−</span>
        <span className="formula-fixed-text">在途出库</span>
        <span className="formula-fixed-text">）</span>
        <span className="formula-template__op">−</span>
        <Checkbox checked={checks.outStock} onChange={() => toggleCheck(group, 'outStock')} />
        <span className="formula-fixed-text">可出库量</span>
      </div>
      {/* 子公式行 */}
      <div className="formula-sub-formula">
        <div className="formula-template">
          <span className="formula-fixed-text">其中：安全存量</span>
          <span className="formula-template__op">=</span>
          <Select value={method} onChange={(v: any) => setMethod(v)}>
            {FORECAST_METHODS.map(m => (
              <Select.Option key={m} value={m}>{m}</Select.Option>
            ))}
          </Select>
          <span className="formula-template__op">×</span>
          <span className="formula-fixed-text">安全系数</span>
        </div>
      </div>
      </div>
      {/* 删除该规则：行右侧轻量 icon 按钮 */}
      <button
        type="button"
        className="formula-config-row__delete"
        aria-label="删除该规则"
        onClick={() => onDelete(group)}
      >
        <Icon type="delete-o" />
      </button>
    </div>
  );

  return (
    <div className="formula-config-container">
      {renderFormulaRow('默认计算配置', defaultMethod, setDefaultMethod, defaultChecks, 'default', onDelete)}
      <div className="formula-config-divider" />
      {renderFormulaRow('例外计算配置', exceptionMethod, setExceptionMethod, exceptionChecks, 'exception', onDelete)}
    </div>
  );
}
```

---

## 七、CSS

### 条件规则型基线复用件（所有形态共享，勿重复定义）

> 条件规则型是统一范式家族：条件组树（A-1，见上）、范围条件（A-2）、分层筛选（A-3）、撑满行（A-4）**共用同一套基线**。以下沉淀经调优确定的基线复用件与各形态差异 CSS。任一形态调整时以 A-1 为基准对齐。

```css
/* ① 且/或 badge —— 灰底白字胶囊，可切换的带下拉箭头 */
.logic-connector {
  display: inline-flex; align-items: center; justify-content: center; gap: 2px;
  height: 24px; padding: 0 8px; border-radius: 12px;
  font-size: 12px; font-weight: 500; cursor: pointer;
  user-select: none; flex-shrink: 0; line-height: 1;
  transition: all .15s; border: none;
}
.logic-connector--and,
.logic-connector--or { background: var(--text-6); color: #fff; }
.logic-connector:hover { opacity: .85; }
.logic-connector__menu {
  position: absolute; top: 100%; left: 0; z-index: 10;
  background: var(--bg-card); border-radius: 4px; box-shadow: var(--shadow-mid);
  padding: 4px 0; min-width: 100px;
}
.logic-connector__menu-item {
  padding: 6px 12px; font-size: 12px; cursor: pointer;
}
.logic-connector__menu-item:hover { background: var(--bg-card-inner); }

/* ② 规则行 + 行内操作按钮（基线 padding-top:22px 对齐带顶部 label 的行） */
.rule-row { display: flex; align-items: flex-start; gap: 8px; }
.rule-row + .rule-row { margin-top: 8px; }
.rule-row__fields { display: flex; align-items: flex-start; gap: 8px; flex: 1; }
.rule-row__actions {
  display: flex; align-items: flex-start; gap: 4px; flex-shrink: 0; padding-top: 22px;
}
.rule-row__action-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 4px;
  border: none; background: var(--bg-card-inner); cursor: pointer;
  font-size: 14px; color: var(--text-3); transition: all .15s;
}
.rule-row__action-btn:hover { background: var(--divider); color: var(--color-brand-primary); }
.rule-row__action-btn--danger:hover { background: #fff1f0; color: var(--color-red); }

/* ③ 文字+icon 操作链接 —— 统一主色蓝，不用橙色 */
.add-link {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; color: var(--color-brand-primary); cursor: pointer;
  background: none; border: none; padding: 4px 0; margin-top: 8px;
}
.add-link:hover { text-decoration: underline; }
```

> **纵向贯穿逻辑列模板**：所有形态的逻辑列都是「`__line`(flex:1) + `__badge` + `__line`(flex:1)`；容器必须 `display:flex; align-items:stretch` 让连线撑满全高。各形态仅类名前缀不同（`tree-logic-col` / `range-rules__logic-*` / `layered-filter__logic-*` / `fw-condition__logic-*`），样式值完全一致：
>
> ```css
> [prefix]-col   { display:flex; flex-direction:column; align-items:center; flex-shrink:0; min-width:28px; }
> [prefix]-line  { flex:1; width:1px; background:var(--text-6); min-height:12px; }
> [prefix]-badge { position:relative; z-index:2; flex-shrink:0; padding:4px 0; }
> ```

### A-1 · 条件组树 CSS

```css
.condition-groups { display: flex; flex-direction: column; gap: 12px; }

/* 容器节点：灰底，水平排列 = 逻辑列 + 子节点列（统一灰底 var(--bg-card-inner)） */
.tree-container {
  display: flex; align-items: stretch;
  background: var(--bg-card-inner); border-radius: 8px; padding: 16px;
  gap: 12px;
}
/* 嵌套容器：透明背景，不额外加灰底 */
.tree-container .tree-container {
  background: transparent; border-radius: 0; padding: 0;
}

/* 逻辑列：纵向贯穿，上线 + badge + 下线 */
.tree-logic-col {
  display: flex; flex-direction: column; align-items: center;
  flex-shrink: 0; min-width: 28px;
}
.tree-logic-col__line {
  flex: 1; width: 1px; background: var(--text-6); min-height: 12px;
}
.tree-logic-col__badge {
  position: relative; z-index: 2; flex-shrink: 0; padding: 4px 0;
}

/* 子节点列 */
.tree-container__children {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: 12px;
}

/* 条件组卡片（叶子节点）：透明背景，融入外层灰底 */
.condition-group {
  background: transparent; border-radius: 0; overflow: hidden;
}

/* 条件组头部 */
.condition-group__header {
  display: flex; align-items: center; gap: 4px;
  cursor: pointer; padding: 4px 0;
}
.condition-group__header-title { font-size: 14px; font-weight: 500; flex: 1; }
.condition-group__header-delete {
  border: none; background: transparent; cursor: pointer; padding: 4px;
  color: var(--text-4);
}

/* 条件组内部布局 */
.condition-group__body { padding: 4px 0; }
.condition-group__rows {
  display: flex; gap: 12px; align-items: stretch;
}
.condition-group__rules-col {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: 8px;
}

/* 公式编辑器内部嵌套的 Form.Item：均分可用空间，不写固定宽度 */
.rule-row__fields .mtd-prime-form-item {
  flex: 1; min-width: 0; width: auto;
}
/* label 上下布局时：左对齐、宽度自适应（覆盖 useContext 继承的 120px 右对齐） */
.rule-row__fields .mtd-prime-form-item .mtd-prime-form-item-label {
  width: auto;
}
.rule-row__fields .mtd-prime-form-item .mtd-prime-form-item-label-ctx {
  width: auto !important;  /* !important 覆盖 MTD 内联 style="width:120px" */
  text-align: left;
}
/* 内部控件撑满 Form.Item */
.rule-row__fields .mtd-prime-form-item .mtd-prime-form-item-body {
  flex: 1; min-width: 0;
}
.rule-row__fields .mtd-prime-form-item .mtd-prime-select,
.rule-row__fields .mtd-prime-form-item .mtd-prime-input {
  width: 100%;
}
```

### A-2 · 范围条件（数值区间）CSS

```css
.range-rules { display: flex; flex-direction: column; gap: 0; }
.range-rules__header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.range-rules__header-label { font-size: 14px; font-weight: 500; }
/* 灰底块 —— align-items:stretch 让逻辑列贯穿（统一灰底 var(--bg-card-inner)） */
.range-rules__body {
  display: flex; align-items: stretch; gap: 12px;
  background: var(--bg-card-inner); border-radius: 8px; padding: 16px;
}
/* 逻辑列（套用贯穿模板） */
.range-rules__logic-col { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; min-width: 28px; }
.range-rules__logic-line { flex: 1; width: 1px; background: var(--text-6); min-height: 12px; }
.range-rules__logic-badge { position: relative; z-index: 2; flex-shrink: 0; padding: 4px 0; }
/* 规则列：内容过宽时横向滚动，保持灰底块边界完整 */
.range-rules__rows-col { flex: 1; min-width: 0; overflow-x: auto; }
/* 裸控件行无顶部 label —— 操作按钮 padding-top 归零，与控件顶部齐平 */
.range-rules .rule-row__actions { padding-top: 0; }
```

> 关键点：多行规则共用**一个**居中 badge + 一条贯穿连线（不是每两行插一个）。

### A-3 · 分层筛选（多分组卡片）CSS

```css
.layered-filter {
  display: flex; align-items: stretch; gap: 12px;
  background: var(--bg-card-inner); border-radius: 8px; padding: 16px;
}
.layered-filter__logic-col { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; min-width: 28px; }
.layered-filter__logic-line { flex: 1; width: 1px; background: var(--text-6); min-height: 12px; }
.layered-filter__logic-badge { position: relative; z-index: 2; flex-shrink: 0; padding: 4px 0; }
.layered-filter__groups-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
/* 分组卡片：透明背景 + 描边（不用白底） */
.filter-group-card {
  background: transparent;
  border: 1px solid var(--divider); border-radius: 6px;
  padding: 16px;
}
.filter-group-card__title { font-size: 14px; font-weight: 500; margin-bottom: 12px; color: var(--text-1); }
/* 卡片内裸控件行 —— 操作按钮 padding-top 归零 */
.layered-filter .rule-row__actions { padding-top: 0; }
```

### A-4 · 撑满行条件（等分列）CSS

```css
.fw-condition__container {
  display: flex; align-items: stretch; gap: 12px;
  background: var(--bg-card-inner); border-radius: 8px; padding: 16px;
}
.fw-condition__logic-col { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; min-width: 28px; }
.fw-condition__logic-line { flex: 1; width: 1px; background: var(--text-6); min-height: 12px; }
.fw-condition__logic-badge { position: relative; z-index: 2; flex-shrink: 0; padding: 4px 0; }
.fw-condition__rules { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
/* 行内居中，字段按 flex 比例等分撑满 */
.fw-condition__row { display: flex; align-items: center; gap: 8px; }
.fw-condition__field { flex: 3; min-width: 0; }
.fw-condition__operator { flex: 2; min-width: 0; }
.fw-condition__value { flex: 3; min-width: 0; }
.fw-condition__actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
```

> 关键点：行 `align-items: center`，操作按钮天然居中，无需 padding-top 补偿。

### 变体 B · 计算公式配置器 CSS

```css
/* ===== 变体 B · 计算公式配置器（统一灰底 var(--bg-card-inner)，与 F6 多选组卡片对齐） ===== */
.formula-config-container {
  background: var(--bg-card-inner); border-radius: 8px; padding: 16px;
}
/* 自定义键值行：label 在左，公式内容在右（不用 Form.Item，避免双层 label） */
.formula-config-row {
  display: flex; align-items: flex-start; gap: 12px;
}
.formula-config-row__label {
  flex-shrink: 0; width: 98px;
  font-size: 14px; color: var(--text-3); line-height: 32px;
  white-space: nowrap;
}
.formula-config-row__body {
  flex: 1; min-width: 0; overflow-x: auto;
}
.formula-config-divider {
  border-top: 1px solid var(--divider); margin: 16px 0;
}
/* 行右侧删除：轻量 icon 按钮，静息灰色、hover 才转红，避免强调色文字按钮抢视觉 */
.formula-config-row__delete {
  flex-shrink: 0; width: 32px; height: 32px;
  display: inline-flex; align-items: center; justify-content: center;
  border: none; background: transparent; border-radius: 4px; cursor: pointer;
  color: var(--text-4); font-size: 16px;
  transition: color .15s, background .15s;
}
.formula-config-row__delete:hover {
  color: var(--color-red); background: rgba(245, 72, 59, .08);
}
.formula-sub-formula {
  margin-top: 4px;
}
```

---

## 八、踩坑笔记

- **MTD 没有专用的 FormulaEditor 组件** —— 变体 A（条件规则型）用 `Form.Item` + `Select` + `Input` + `Icon` 组合构建；变体 B（计算公式配置型）用自定义 `.formula-config-row` + `Select` + `Checkbox` + `span` 固定文本组合构建。
- **可用变量/字段通常由父组件通过 props 传入**：变量列表来自表单其他字段定义或后端接口，不要在组件内硬编码。
