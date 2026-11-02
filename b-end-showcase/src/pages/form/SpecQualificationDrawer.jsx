import React, { useState, useRef } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Button,
  message,
} from '@ss/mtd-react3';
import ModuleWrapper from '../../components/ModuleWrapper';
import './SpecQualificationDrawer.css';

const { Item: FormItem } = Form;
const { TextArea } = Input;

/**
 * 规格合规判断 — 抽屉表单
 *
 * 装配清单（按 L1 装配逻辑）：
 *   容器：抽屉 Drawer（中等字段，边看背景边填）
 *   F2 表头：Drawer 自带 title + .drawer-desc 辅助描述
 *   F3 分组分段：3 组（基本信息 / 检测数据 / 判定结果）
 *   F4 单栏布局：紧凑行间距 12px，Form 宽度与 Drawer 拉通，labelWidth=120px
 *   F14 操作工具栏：Drawer footer 插槽
 */
const SpecQualificationDrawer = ({ visible, setVisible }) => {
  const formRef = useRef(null);
  const [showUnqualifiedReason, setShowUnqualifiedReason] = useState(false);

  // 表单联动：判定结果为"不合格"时显示不合格原因字段
  const handleFieldValueChange = (key, value) => {
    if (key === 'result') {
      setShowUnqualifiedReason(value === 'unqualified');
    }
  };

  const handleSubmit = () => {
    const isValid = formRef.current?.validateFields();
    if (isValid) {
      const formData = formRef.current?.getFieldsValue();
      console.log('规格合规判断数据：', formData);
      message.success('判定提交成功');
      handleClose();
    } else {
      message.error('请完善必填项');
    }
  };

  const handleClose = () => {
    setVisible(false);
    formRef.current?.reset();
    setShowUnqualifiedReason(false);
  };

  return (
    <Drawer
      visible={visible}
      title="规格合规判断"
      width={640}
      maskClosable={false}
      onClose={handleClose}
      footer={
        <ModuleWrapper moduleId="F-3 操作栏（抽屉版）" useFixed disableTooltip style={{ height: 'auto' }}>
        <div className="sq-drawer-action-bar">
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>提交判定</Button>
        </div>
        </ModuleWrapper>
      }
    >
      {/* F2 · 抽屉辅助描述 */}
      <p className="sq-drawer-desc">
        请填写规格检测数据并给出合规判定结果，带 * 为必填项。
      </p>

      <Form
        ref={formRef}
        useContext={true}
        labelWidth="120px"
        labelPosition="right"
        onFieldValueChange={handleFieldValueChange}
        className="sq-spec-form"
      >
        {/* F-4 分组分段 + F-5 单栏布局：基本信息 */}
        <ModuleWrapper moduleId="F-4 分组分段 + F-5 单栏布局" useFixed disableTooltip style={{ height: 'auto' }}>
        <div className="sq-form-section" id="sq-group-basic">
          <h3 className="sq-form-section__title">基本信息</h3>
          <FormItem
            formItemKey="specNo"
            label="检测编号"
            required
            rules={[{ required: true, message: '请输入检测编号' }]}
          >
            <Input placeholder="请输入检测编号" toFormItem />
          </FormItem>
          <FormItem
            formItemKey="productName"
            label="产品名称"
            required
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="如：青椒（螺丝椒）" toFormItem />
          </FormItem>
          <FormItem
            formItemKey="specType"
            label="规格类型"
            required
            rules={[{ required: true, message: '请选择规格类型' }]}
          >
            <Select placeholder="请选择规格类型" toFormItem>
              <Select.Option value="appearance">外观品质</Select.Option>
              <Select.Option value="pesticide">农药残留</Select.Option>
              <Select.Option value="physicochemical">理化指标</Select.Option>
              <Select.Option value="microbial">微生物指标</Select.Option>
            </Select>
          </FormItem>
        </div>
        </ModuleWrapper>

        {/* F-4 分组分段：检测数据 */}
        <ModuleWrapper moduleId="F-4 分组分段 + F-5 单栏布局" useFixed disableTooltip style={{ height: 'auto' }}>
        <div className="sq-form-section" id="sq-group-inspection">
          <h3 className="sq-form-section__title">检测数据</h3>
          <FormItem
            formItemKey="inspectionItem"
            label="检测项目"
            required
            rules={[{ required: true, message: '请选择检测项目' }]}
          >
            <Select placeholder="请选择检测项目" toFormItem>
              <Select.Option value="length">果长</Select.Option>
              <Select.Option value="diameter">果径</Select.Option>
              <Select.Option value="color">色泽</Select.Option>
              <Select.Option value="moisture">水分含量</Select.Option>
              <Select.Option value="pesticide">农残含量</Select.Option>
            </Select>
          </FormItem>
          <FormItem
            formItemKey="standardValue"
            label="标准值"
            required
            rules={[{ required: true, message: '请输入标准值' }]}
          >
            <Input placeholder="如：18-25cm 或 ≤0.1mg/kg" toFormItem />
          </FormItem>
          <FormItem
            formItemKey="measuredValue"
            label="实测值"
            required
            rules={[{ required: true, message: '请输入实测值' }]}
          >
            <Input placeholder="请输入实测值" toFormItem />
          </FormItem>
          <FormItem
            formItemKey="inspectionDate"
            label="检测日期"
            required
            rules={[{ required: true, message: '请选择检测日期' }]}
          >
            <DatePicker placeholder="请选择检测日期" toFormItem />
          </FormItem>
        </div>
        </ModuleWrapper>

        {/* F-4 分组分段：判定结果 */}
        <ModuleWrapper moduleId="F-4 分组分段 + F-5 单栏布局" useFixed disableTooltip style={{ height: 'auto' }}>
        <div className="sq-form-section" id="sq-group-judgment">
          <h3 className="sq-form-section__title">判定结果</h3>
          <FormItem
            formItemKey="result"
            label="判定结果"
            required
            rules={[{ required: true, message: '请选择判定结果' }]}
          >
            <Radio.Group toFormItem>
              <Radio value="qualified">合格</Radio>
              <Radio value="unqualified">不合格</Radio>
              <Radio value="concession">让步接收</Radio>
            </Radio.Group>
          </FormItem>
          {showUnqualifiedReason && (
            <FormItem
              formItemKey="unqualifiedReason"
              label="不合格原因"
              required
              rules={[{ required: true, message: '请输入不合格原因' }]}
            >
              <TextArea
                placeholder="请详细描述不合格原因，如农残超标、外观不达标等"
                toFormItem
                rows={3}
              />
            </FormItem>
          )}
          <FormItem
            formItemKey="remarks"
            label="备注"
          >
            <TextArea
              placeholder="请输入备注信息（选填）"
              toFormItem
              rows={3}
            />
          </FormItem>
        </div>
        </ModuleWrapper>
      </Form>
    </Drawer>
  );
};

export default SpecQualificationDrawer;
