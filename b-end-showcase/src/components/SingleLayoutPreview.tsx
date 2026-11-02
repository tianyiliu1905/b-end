/**
 * Form3 · 单栏布局（SingleLayout）
 * ─────────────────────────────────────────────
 * 表单最小成立单元：所有字段在单栏内纵向排列。
 * 两个正交参数：
 *   参数① 表单区宽度：半宽留白（默认，外层 Row > Col span={12}） / 全宽拉通
 *   参数② 栏内列数：单列（默认，字段 span={24}） / 双列（span={12}） / 三列（span={8}） / 混合列
 * 另有：标签顶部（labelPosition="top"）、紧凑模式（弹窗/抽屉）
 */
import { Form, Input, Select, DatePicker, InputNumber, Radio, Row, Col } from '@ss/mtd-react3';
import './SingleLayoutPreview.css';

/* 变体 1 · 半宽留白 + 单列（默认组合） */
export function SingleColumnHalfWidth() {
  return (
    <Row>
      <Col span={12}>
        <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
          <Form.Item formItemKey="name" label="规则名称" required>
            <Input placeholder="请输入规则名称" toFormItem />
          </Form.Item>
          <Form.Item formItemKey="type" label="规则类型" required>
            <Select placeholder="请选择" toFormItem>
              <Select.Option value="a">类型A</Select.Option>
              <Select.Option value="b">类型B</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item formItemKey="date" label="生效日期">
            <DatePicker placeholder="请选择日期" toFormItem style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item formItemKey="amount" label="金额">
            <InputNumber placeholder="请输入" toFormItem style={{ width: '100%' }} min={0} precision={2} />
          </Form.Item>
          <Form.Item formItemKey="mode" label="模式">
            <Radio.Group toFormItem>
              <Radio value="a">模式A</Radio>
              <Radio value="b">模式B</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item formItemKey="remark" label="备注">
            <Input.TextArea placeholder="请输入备注" rows={3} toFormItem />
          </Form.Item>
        </Form>
      </Col>
      <Col span={12}>
        <div className="single-layout__blank-hint">右侧留白</div>
      </Col>
    </Row>
  );
}

/* 变体 2 · 全宽拉通 + 单列 */
export function SingleColumnFullWidth() {
  return (
    <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
      <Form.Item formItemKey="name2" label="规则名称" required>
        <Input placeholder="请输入规则名称" toFormItem />
      </Form.Item>
      <Form.Item formItemKey="type2" label="规则类型" required>
        <Select placeholder="请选择" toFormItem>
          <Select.Option value="a">类型A</Select.Option>
          <Select.Option value="b">类型B</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item formItemKey="date2" label="生效日期">
        <DatePicker placeholder="请选择日期" toFormItem style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item formItemKey="remark2" label="备注">
        <Input.TextArea placeholder="请输入备注" rows={3} toFormItem />
      </Form.Item>
    </Form>
  );
}

/* 变体 3 · 双列（span=12，标准列数升级形态） */
export function TwoColumnForm() {
  return (
    <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
      <div className="form-section form-section--multicol">
        <h3 className="form-section__title">基本信息</h3>
        <Form.Item formItemKey="name3" label="名称" required span={12}>
          <Input placeholder="请输入" toFormItem />
        </Form.Item>
        <Form.Item formItemKey="code3" label="编码" required span={12}>
          <Input placeholder="请输入" toFormItem />
        </Form.Item>
        <Form.Item formItemKey="type3" label="类型" span={12}>
          <Select placeholder="请选择" toFormItem>
            <Select.Option value="a">类型A</Select.Option>
            <Select.Option value="b">类型B</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item formItemKey="date3" label="日期" span={12}>
          <DatePicker placeholder="请选择" toFormItem style={{ width: '100%' }} />
        </Form.Item>
        {/* 混合：描述字段需要整行 */}
        <Form.Item formItemKey="desc3" label="描述" span={24}>
          <Input.TextArea placeholder="请输入" rows={2} toFormItem />
        </Form.Item>
      </div>
    </Form>
  );
}

/* 变体 4 · 三列（span=8，字段密集属性录入） */
export function ThreeColumnForm() {
  return (
    <Form className="section-form" labelPosition="right" labelWidth="80px" useContext={true}>
      <div className="form-section form-section--multicol">
        <h3 className="form-section__title">属性录入</h3>
        <Form.Item formItemKey="attr1" label="长" span={8}>
          <InputNumber placeholder="cm" toFormItem style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item formItemKey="attr2" label="宽" span={8}>
          <InputNumber placeholder="cm" toFormItem style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item formItemKey="attr3" label="高" span={8}>
          <InputNumber placeholder="cm" toFormItem style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item formItemKey="attr4" label="重量" span={8}>
          <InputNumber placeholder="kg" toFormItem style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item formItemKey="attr5" label="颜色" span={8}>
          <Select placeholder="请选择" toFormItem>
            <Select.Option value="red">红色</Select.Option>
            <Select.Option value="blue">蓝色</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item formItemKey="attr6" label="材质" span={8}>
          <Select placeholder="请选择" toFormItem>
            <Select.Option value="cotton">棉</Select.Option>
            <Select.Option value="poly">聚酯纤维</Select.Option>
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
}

/* 变体 5 · 标签顶部（labelPosition="top"） */
export function LabelTopForm() {
  return (
    <Form className="section-form" labelPosition="top" useContext={true}>
      <Form.Item formItemKey="name4" label="规则名称（此处标签较长示例）" required>
        <Input placeholder="请输入规则名称" toFormItem />
      </Form.Item>
      <Form.Item formItemKey="type4" label="规则类型" required>
        <Select placeholder="请选择" toFormItem style={{ width: '100%' }}>
          <Select.Option value="a">类型A</Select.Option>
          <Select.Option value="b">类型B</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item formItemKey="remark4" label="备注">
        <Input.TextArea placeholder="请输入备注" rows={3} toFormItem />
      </Form.Item>
    </Form>
  );
}

/* 变体 6 · 紧凑模式（弹窗/抽屉，labelWidth 缩减 + 行间距更紧） */
export function CompactForm() {
  return (
    <Form className="section-form section-form--compact" labelPosition="right" labelWidth="80px" useContext={true}>
      <Form.Item formItemKey="name5" label="名称" required>
        <Input placeholder="请输入" toFormItem />
      </Form.Item>
      <Form.Item formItemKey="type5" label="类型" required>
        <Select placeholder="请选择" toFormItem style={{ width: '100%' }}>
          <Select.Option value="a">类型A</Select.Option>
          <Select.Option value="b">类型B</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item formItemKey="date5" label="日期">
        <DatePicker placeholder="请选择日期" toFormItem style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
}
