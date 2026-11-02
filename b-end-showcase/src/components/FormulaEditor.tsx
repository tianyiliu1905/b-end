/**
 * Form8 · 公式编辑器（FormulaEditor）
 * ─────────────────────────────────────────────
 * 变体 A · 条件规则型（条件组树 A-1）：结构化条件形式配置判断/筛选规则，
 *   可递归嵌套的条件组容器，左侧纵向贯穿逻辑列（且/或 badge），条件组可折叠增删。
 * 变体 B · 计算公式配置型：固定文本 + 变量下拉 + 运算符 + 可选 checkbox 组合的公式模板。
 *
 * MTD 没有专用的 FormulaEditor 组件：
 *  - 变体 A 用 Form.Item + Select + Input + Icon 组合构建；
 *  - 变体 B 用自定义 .formula-config-row + Select + Checkbox + span 固定文本组合构建。
 * 可用变量/字段通常由父组件通过 props 传入，此处为预览提供内置默认数据。
 */
import { useState, useCallback } from 'react';
import { Select, Input, Icon, Form, Checkbox } from '@ss/mtd-react3';
import './FormulaEditor.css';

/* ══════════════════════════════════════════════
   变体 A · 条件组树（条件规则型 A-1）
   ══════════════════════════════════════════════ */
interface ConditionRule {
  id: string;
  method: string;
  field1: string;
  field2: string;
  operator: string;
  value: string;
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
const FIELDS = ['字段1', '字段2', '字段3'];
const OPS = ['>', '>=', '<', '<=', '=', '!='];

const defaultRule = (): ConditionRule => ({
  id: uid(), method: '自定义比值', field1: '', field2: '', operator: '>', value: '',
});

const makeGroup = (withRules = true): GroupNode => ({
  type: 'group', id: uid(), expanded: withRules, logic: 'and',
  rules: withRules ? [defaultRule()] : [],
});

function LogicBadge({ value, onChange }: { value: 'and' | 'or'; onChange?: (v: 'and' | 'or') => void }) {
  const [open, setOpen] = useState(false);
  const select = (v: 'and' | 'or') => { onChange?.(v); setOpen(false); };
  return (
    <div style={{ position: 'relative' }}>
      <div
        className="logic-connector"
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

export function ConditionGroupEditor() {
  const [root, setRoot] = useState<ContainerNode>(() => ({
    type: 'container', id: uid(), logic: 'or',
    children: [makeGroup(), makeGroup(false)],
  }));

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
    updateTree(r => updateGroupInTree(r, gid, g => ({ ...g, rules: g.rules.filter(x => x.id !== rid) })) as ContainerNode);

  const updateGroupLogic = (gid: string, logic: 'and' | 'or') =>
    updateTree(r => updateGroupInTree(r, gid, g => ({ ...g, logic })) as ContainerNode);

  const addGroup = () =>
    updateTree(r => ({ ...r, children: [...r.children, makeGroup(false)] }));

  const groupIndexMap = new Map<string, number>();
  let _idx = 1;
  const walkIndex = (n: TreeNode) => {
    if (n.type === 'group') { groupIndexMap.set(n.id, _idx++); }
    else { n.children.forEach(walkIndex); }
  };
  walkIndex(root);

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
    <Form className="condition-groups" useContext={true}>
      {renderNode(root)}
      <button className="add-link" onClick={addGroup}>
        <Icon type="add" style={{ fontSize: 12, marginRight: 4 }} />添加条件组
      </button>
    </Form>
  );
}

/* ══════════════════════════════════════════════
   变体 B · 计算公式配置型
   ══════════════════════════════════════════════ */
const FORECAST_METHODS = ['预测需求量平均值', '预测需求量最大值', '预测需求量中位数', '预测需求量加权平均'];

type FormulaGroupKey = 'default' | 'exception';

export function FormulaTemplateEditor() {
  const [methods, setMethods] = useState<Record<FormulaGroupKey, string>>({
    default: '预测需求量平均值', exception: '预测需求量平均值',
  });
  const [checks, setChecks] = useState<Record<FormulaGroupKey, Record<string, boolean>>>({
    default: { safeStock: false, outStock: false },
    exception: { safeStock: false, outStock: false },
  });
  const [groups, setGroups] = useState<FormulaGroupKey[]>(['default', 'exception']);

  const setMethod = (group: FormulaGroupKey, v: string) =>
    setMethods(prev => ({ ...prev, [group]: v }));

  const toggleCheck = (group: FormulaGroupKey, key: string) =>
    setChecks(prev => ({ ...prev, [group]: { ...prev[group], [key]: !prev[group][key] } }));

  const handleDelete = (group: FormulaGroupKey) =>
    setGroups(prev => prev.filter(g => g !== group));

  const groupLabel: Record<FormulaGroupKey, string> = { default: '默认计算配置', exception: '例外计算配置' };

  const renderFormulaRow = (group: FormulaGroupKey) => {
    const method = methods[group];
    const check = checks[group];
    return (
      <div className="formula-config-row" key={group}>
        <span className="formula-config-row__label">{groupLabel[group]}</span>
        <div className="formula-config-row__body">
          {/* 主公式行 */}
          <div className="formula-template">
            <span className="formula-fixed-text">预测计算量</span>
            <span className="formula-template__op">=</span>
            <span className="formula-fixed-text">预测需求量</span>
            <span className="formula-template__op">+</span>
            <Checkbox checked={check.safeStock} onChange={() => toggleCheck(group, 'safeStock')} />
            <span className="formula-fixed-text">安全存量</span>
            <span className="formula-template__op">−</span>
            <span className="formula-fixed-text">（</span>
            <span className="formula-fixed-text">在途入库</span>
            <span className="formula-template__op">−</span>
            <span className="formula-fixed-text">在途出库</span>
            <span className="formula-fixed-text">）</span>
            <span className="formula-template__op">−</span>
            <Checkbox checked={check.outStock} onChange={() => toggleCheck(group, 'outStock')} />
            <span className="formula-fixed-text">可出库量</span>
          </div>
          {/* 子公式行 */}
          <div className="formula-sub-formula">
            <div className="formula-template">
              <span className="formula-fixed-text">其中：安全存量</span>
              <span className="formula-template__op">=</span>
              <Select value={method} onChange={(v: any) => setMethod(group, v)}>
                {FORECAST_METHODS.map(m => (
                  <Select.Option key={m} value={m}>{m}</Select.Option>
                ))}
              </Select>
              <span className="formula-template__op">×</span>
              <span className="formula-fixed-text">安全系数</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="formula-config-row__delete"
          aria-label="删除该规则"
          onClick={() => handleDelete(group)}
        >
          <Icon type="delete-o" />
        </button>
      </div>
    );
  };

  return (
    <div className="formula-config-container">
      {groups.map((g, i) => (
        <div key={g}>
          {renderFormulaRow(g)}
          {i < groups.length - 1 && <div className="formula-config-divider" />}
        </div>
      ))}
    </div>
  );
}
