/**
 * Form2 · 分组分段（GroupSection）
 * ─────────────────────────────────────────────
 * 长表单按业务含义分块展示，帮助用户建立结构认知。
 * 每组带蓝色方块前置的分组标题（::before），组间 24px 间距，组内字段 16px 间距。
 *
 * 变体 A · 基础分组：多组纵向铺开，每组带标题，最常用形态。
 * 变体 B · 折叠分组：分组可展开/收起，适合分组多、部分低频的场景。
 * 变体 C · 分步分组：分组拆成多步（步骤落地页），一次只填一步。
 */
import { useState } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Collapse, Steps, Button } from '@ss/mtd-react3';
import './GroupSectionPreview.css';

/* ══════════════════════════════════════════════
   变体 A · 基础分组
   多组纵向铺开，每组带标题，字段多/可明确切块的长表单
   ══════════════════════════════════════════════ */
export function BasicGroupSection() {
  return (
    <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
      <div className="form-section" id="group-1">
        <h3 className="form-section__title">基本信息</h3>
        <Form.Item formItemKey="name" label="活动名称" required>
          <Input placeholder="请输入活动名称" toFormItem />
        </Form.Item>
        <Form.Item formItemKey="type" label="活动类型" required>
          <Select placeholder="请选择活动类型" toFormItem style={{ width: '100%' }}>
            <Select.Option value="manjian">满减</Select.Option>
            <Select.Option value="zhekou">折扣</Select.Option>
            <Select.Option value="manzeng">满赠</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item formItemKey="date" label="生效日期" required>
          <DatePicker placeholder="请选择日期" toFormItem style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <div className="form-section" id="group-2">
        <h3 className="form-section__title">规则配置</h3>
        <Form.Item formItemKey="threshold" label="满减门槛" required>
          <InputNumber placeholder="请输入金额" toFormItem style={{ width: '100%' }} min={0} precision={2} />
        </Form.Item>
        <Form.Item formItemKey="amount" label="优惠金额" required>
          <InputNumber placeholder="请输入金额" toFormItem style={{ width: '100%' }} min={0} precision={2} />
        </Form.Item>
      </div>

      <div className="form-section" id="group-3">
        <h3 className="form-section__title">投放范围</h3>
        <Form.Item formItemKey="city" label="适用城市" required>
          <Select placeholder="请选择城市" toFormItem style={{ width: '100%' }} multiple>
            <Select.Option value="beijing">北京</Select.Option>
            <Select.Option value="shanghai">上海</Select.Option>
            <Select.Option value="chengdu">成都</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item formItemKey="remark" label="备注">
          <Input.TextArea placeholder="请输入备注信息" rows={3} toFormItem />
        </Form.Item>
      </div>
    </Form>
  );
}

/* ══════════════════════════════════════════════
   变体 B · 折叠分组
   分组可展开/收起，默认展开必填组，适合分组多/部分低频场景
   ══════════════════════════════════════════════ */
export function CollapsibleGroupSection() {
  return (
    <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
      <Collapse
        defaultValue={['group-1', 'group-2']}
        className="group-collapse"
      >
        <Collapse.Item
          code="group-1"
          title={<span className="collapse-section__title">基本信息</span>}
        >
          <div className="collapse-section__body">
            <Form.Item formItemKey="name2" label="活动名称" required>
              <Input placeholder="请输入活动名称" toFormItem />
            </Form.Item>
            <Form.Item formItemKey="type2" label="活动类型" required>
              <Select placeholder="请选择活动类型" toFormItem style={{ width: '100%' }}>
                <Select.Option value="manjian">满减</Select.Option>
                <Select.Option value="zhekou">折扣</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Collapse.Item>

        <Collapse.Item
          code="group-2"
          title={<span className="collapse-section__title">规则配置</span>}
        >
          <div className="collapse-section__body">
            <Form.Item formItemKey="threshold2" label="满减门槛" required>
              <InputNumber placeholder="请输入" toFormItem style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
            <Form.Item formItemKey="amount2" label="优惠金额" required>
              <InputNumber placeholder="请输入" toFormItem style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
          </div>
        </Collapse.Item>

        <Collapse.Item
          code="group-3"
          title={<span className="collapse-section__title">高级设置</span>}
        >
          <div className="collapse-section__body">
            <Form.Item formItemKey="remark2" label="备注">
              <Input.TextArea placeholder="非必填，可跳过" rows={2} toFormItem />
            </Form.Item>
          </div>
        </Collapse.Item>
      </Collapse>
    </Form>
  );
}

/* ══════════════════════════════════════════════
   变体 C · 分步分组
   分组拆成多步展示（步骤落地页），一次只填一步
   ══════════════════════════════════════════════ */
const STEP_GROUPS = [
  { key: 0, title: '基本信息', stepTitle: '基本信息' },
  { key: 1, title: '规则配置', stepTitle: '规则配置' },
  { key: 2, title: '投放范围', stepTitle: '投放范围' },
];

function StepGroup0() {
  return (
    <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
      <div className="form-section" id="step-group-1">
        <h3 className="form-section__title">基本信息</h3>
        <Form.Item formItemKey="sname" label="活动名称" required>
          <Input placeholder="请输入活动名称" toFormItem />
        </Form.Item>
        <Form.Item formItemKey="stype" label="活动类型" required>
          <Select placeholder="请选择活动类型" toFormItem style={{ width: '100%' }}>
            <Select.Option value="manjian">满减</Select.Option>
            <Select.Option value="zhekou">折扣</Select.Option>
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
}

function StepGroup1() {
  return (
    <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
      <div className="form-section" id="step-group-2">
        <h3 className="form-section__title">规则配置</h3>
        <Form.Item formItemKey="sthreshold" label="满减门槛" required>
          <InputNumber placeholder="请输入金额" toFormItem style={{ width: '100%' }} min={0} precision={2} />
        </Form.Item>
        <Form.Item formItemKey="samount" label="优惠金额" required>
          <InputNumber placeholder="请输入金额" toFormItem style={{ width: '100%' }} min={0} precision={2} />
        </Form.Item>
      </div>
    </Form>
  );
}

function StepGroup2() {
  return (
    <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
      <div className="form-section" id="step-group-3">
        <h3 className="form-section__title">投放范围</h3>
        <Form.Item formItemKey="scity" label="适用城市" required>
          <Select placeholder="请选择城市" toFormItem style={{ width: '100%' }} multiple>
            <Select.Option value="beijing">北京</Select.Option>
            <Select.Option value="shanghai">上海</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item formItemKey="sremark" label="备注">
          <Input.TextArea placeholder="请输入备注" rows={2} toFormItem />
        </Form.Item>
      </div>
    </Form>
  );
}

export function SteppedGroupSection() {
  const [current, setCurrent] = useState(0);
  return (
    <div className="stepped-group">
      <Steps active={current} labelPlacement="horizontal" className="stepped-group__steps">
        {STEP_GROUPS.map((s) => (
          <Steps.Step key={s.key} title={s.stepTitle} />
        ))}
      </Steps>
      <div className="stepped-group__content">
        {current === 0 && <StepGroup0 />}
        {current === 1 && <StepGroup1 />}
        {current === 2 && <StepGroup2 />}
      </div>
      <div className="stepped-group__actions">
        {current > 0 && <Button onClick={() => setCurrent((c) => c - 1)}>上一步</Button>}
        {current < STEP_GROUPS.length - 1 && (
          <Button type="primary" onClick={() => setCurrent((c) => c + 1)}>下一步</Button>
        )}
        {current === STEP_GROUPS.length - 1 && (
          <Button type="primary">提交</Button>
        )}
      </div>
    </div>
  );
}
