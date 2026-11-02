import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  RangePicker,
  Switch,
  Radio,
  Checkbox,
  Button,
  Steps,
  message,
} from '@ss/mtd-react3';
import ModuleWrapper from '../../components/ModuleWrapper';

/**
 * 商家入驻申请 — 分步表单
 * 容器：顺序落地页（含分步 + 多字段，重型结构必须用整页）
 * 模块叠加：MTD Steps 步骤条 + 分组分段（F3）+ 单栏布局（F4）+ 操作工具栏
 *
 * 4步：主体信息 / 资质证照 / 经营信息 / 结算与协议
 * 顶部自实现步骤条 + 下方展示当前步表单 + 底部操作按钮
 *
 * 统一使用 labelPosition="right" labelWidth="120px"，
 * 保持所有字段的 label 对齐方式一致。
 */

const STEPS = [
  { key: 0, title: '主体信息' },
  { key: 1, title: '资质证照' },
  { key: 2, title: '经营信息' },
  { key: 3, title: '结算与协议' },
];

export default function MerchantOnboarding() {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));
  const handleNext = () => setCurrent((c) => Math.min(STEPS.length - 1, c + 1));
  const handleSubmit = () => message.success('入驻申请已提交，请等待审核');

  return (
    <div className="page-card">
      {/* ===== F2 页面标题 ===== */}
      <div className="page-header">
        <h1 className="page-header__title">商家入驻申请</h1>
        <p className="page-header__desc">请按步骤完整填写入驻信息，提交后将在 1-3 个工作日内完成审核</p>
      </div>

      {/* ===== F-6 步骤条（MTD Steps）===== */}
      <ModuleWrapper moduleId="F-6 步骤条" style={{ height: 'auto' }}>
      <Steps active={current} labelPlacement="horizontal" className="merchant-steps">
        {STEPS.map((s) => (
          <Steps.Step key={s.key} title={s.title} />
        ))}
      </Steps>
      </ModuleWrapper>

      {/* ===== 步骤内容 ===== */}
      <div className="step-content">
        {current === 0 && <Step0_EntityInfo />}
        {current === 1 && <Step1_Qualification />}
        {current === 2 && <Step2_BusinessInfo />}
        {current === 3 && <Step3_Settlement />}
      </div>

      {/* F-3 操作栏（步骤落地页版：三态按钮） */}
      <ModuleWrapper moduleId="F-3 操作栏（步骤版）" style={{ height: 'auto' }}>
      <div className="action-bar">
        {current > 0 && <Button onClick={handlePrev}>上一步</Button>}
        {current < STEPS.length - 1 && (
          <Button type="primary" onClick={handleNext}>下一步</Button>
        )}
        {current === STEPS.length - 1 && (
          <Button type="primary" onClick={handleSubmit}>提交申请</Button>
        )}
      </div>
      </ModuleWrapper>
    </div>
  );
}

/* ==========================================================================
   第一步：主体信息
   统一 labelPosition="right" labelWidth="120px"
   双列字段使用 span={12}
   ========================================================================== */
function Step0_EntityInfo() {
  return (
    <div className="form-section" id="step-entity">
      <h3 className="form-section__title">主体信息</h3>
      <Form className="section-form" labelPosition="right" labelWidth="120px" useContext>
        <Form.Item label="公司名称" required>
          <Input placeholder="请输入公司全称" />
        </Form.Item>
        <Form.Item label="信用代码" required>
          <Input placeholder="请输入18位统一社会信用代码" />
        </Form.Item>
        <Form.Item label="公司类型" required>
          <Select placeholder="请选择公司类型">
            <Select.Option value="llc">有限责任公司</Select.Option>
            <Select.Option value="joint-stock">股份有限公司</Select.Option>
            <Select.Option value="sole">个体工商户</Select.Option>
            <Select.Option value="partnership">合伙企业</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="注册资本">
          <InputNumber placeholder="请输入" suffix="万元" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="成立日期">
          <DatePicker placeholder="请选择日期" />
        </Form.Item>
        <Form.Item label="注册地址">
          <Input placeholder="请输入公司注册地址" />
        </Form.Item>
        <Form.Item label="经营范围">
          <Input.TextArea placeholder="请输入经营范围" rows={3} />
        </Form.Item>
        <Form.Item label="法人姓名" required>
          <Input placeholder="请输入法人姓名" />
        </Form.Item>
        <Form.Item label="身份证号" required>
          <Input placeholder="请输入身份证号码" />
        </Form.Item>
        <Form.Item label="法人手机号" required>
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item label="法人邮箱">
          <Input placeholder="请输入邮箱地址" />
        </Form.Item>
      </Form>
    </div>
  );
}

/* ==========================================================================
   第二步：资质证照
   全部单列，含条件显示字段
   ========================================================================== */
function Step1_Qualification() {
  const [isBrand, setIsBrand] = useState(false);

  return (
    <div className="form-section" id="step-qualification">
      <h3 className="form-section__title">资质证照</h3>
      <Form className="section-form" labelPosition="right" labelWidth="120px" useContext>
        <Form.Item label="营业执照编号" required>
          <Input placeholder="请输入营业执照编号" />
        </Form.Item>
        <Form.Item label="执照有效期" required>
          <RangePicker placeholder={['开始日期', '结束日期']} />
        </Form.Item>
        <Form.Item label="食品许可证号">
          <Input placeholder="请输入许可证号" />
        </Form.Item>
        <Form.Item label="许可证有效期">
          <RangePicker placeholder={['开始日期', '结束日期']} />
        </Form.Item>
        <Form.Item label="卫生许可证号">
          <Input placeholder="请输入卫生许可证号" />
        </Form.Item>
        <Form.Item label="特殊行业资质">
          <Select placeholder="请选择（可多选）" multiple>
            <Select.Option value="tobacco">烟草专卖许可</Select.Option>
            <Select.Option value="alcohol">酒类流通许可</Select.Option>
            <Select.Option value="medicine">药品经营许可</Select.Option>
            <Select.Option value="medical-device">医疗器械经营许可</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="是否连锁品牌">
          <div className="form-switch-row">
            <Switch checked={isBrand} onChange={(val) => setIsBrand(val)} />
            <span className="form-switch-text">{isBrand ? '是' : '否'}</span>
          </div>
        </Form.Item>
        {isBrand && (
          <>
            <Form.Item label="品牌名称" required>
              <Input placeholder="请输入品牌名称" />
            </Form.Item>
            <Form.Item label="授权到期日" required>
              <DatePicker placeholder="请选择日期" />
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
}

/* ==========================================================================
   第三步：经营信息
   双列字段使用 span={12}
   ========================================================================== */
function Step2_BusinessInfo() {
  return (
    <div className="form-section" id="step-business">
      <h3 className="form-section__title">经营信息</h3>
      <Form className="section-form" labelPosition="right" labelWidth="120px" useContext>
        <Form.Item label="经营品类" required>
          <Select placeholder="请选择（可多选）" multiple>
            <Select.Option value="chinese">中餐</Select.Option>
            <Select.Option value="western">西餐</Select.Option>
            <Select.Option value="hotpot">火锅</Select.Option>
            <Select.Option value="bbq">烧烤</Select.Option>
            <Select.Option value="drink">饮品</Select.Option>
            <Select.Option value="dessert">甜点</Select.Option>
            <Select.Option value="fast-food">快餐</Select.Option>
            <Select.Option value="snack">小吃</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="客单价区间">
          <Select placeholder="请选择客单价区间">
            <Select.Option value="0-30">0-30元</Select.Option>
            <Select.Option value="30-60">30-60元</Select.Option>
            <Select.Option value="60-100">60-100元</Select.Option>
            <Select.Option value="100+">100元以上</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="门店面积">
          <InputNumber placeholder="请输入" suffix="㎡" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="座位数">
          <InputNumber placeholder="请输入座位数" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="日均订单">
          <InputNumber placeholder="请输入" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="月营业额">
          <InputNumber placeholder="请输入" suffix="万元" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="配送方式" required>
          <Radio.Group>
            <Radio.Button value="self">自配送</Radio.Button>
            <Radio.Button value="platform">平台配送</Radio.Button>
            <Radio.Button value="hybrid">混合配送</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="期望上线日期">
          <DatePicker placeholder="请选择日期" />
        </Form.Item>
        <Form.Item label="装修支持">
          <div className="form-switch-row">
            <Switch />
            <span className="form-switch-text">开启后平台将提供门店装修指导</span>
          </div>
        </Form.Item>
        <Form.Item label="备注说明">
          <Input.TextArea placeholder="如有特殊说明，请在此填写" rows={4} />
        </Form.Item>
      </Form>
    </div>
  );
}

/* ==========================================================================
   第四步：结算与协议
   双列字段使用 span={12}
   ========================================================================== */
function Step3_Settlement() {
  return (
    <div className="form-section" id="step-settlement">
      <h3 className="form-section__title">结算与协议</h3>
      <Form className="section-form" labelPosition="right" labelWidth="120px" useContext>
        <Form.Item label="账户类型" required>
          <Radio.Group>
            <Radio.Button value="corporate">对公账户</Radio.Button>
            <Radio.Button value="personal">对私账户</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="开户银行" required>
          <Input placeholder="请输入开户银行名称" />
        </Form.Item>
        <Form.Item label="开户支行" required>
          <Input placeholder="请输入开户支行名称" />
        </Form.Item>
        <Form.Item label="账户名称" required>
          <Input placeholder="请输入账户名称" />
        </Form.Item>
        <Form.Item label="银行账号" required>
          <Input placeholder="请输入银行账号" />
        </Form.Item>
        <Form.Item label="佣金比例" required>
          <InputNumber defaultValue={15} suffix="%" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="保证金金额" required>
          <InputNumber defaultValue={5000} suffix="元" style={{ width: '100%' }} />
        </Form.Item>
      </Form>

      {/* 协议区域 */}
      <div className="agreement-section">
        <Checkbox>阅读并同意<a className="agreement-link" href="#" onClick={(e) => e.preventDefault()}>《商家服务协议》</a></Checkbox>
        <Checkbox>阅读并同意<a className="agreement-link" href="#" onClick={(e) => e.preventDefault()}>《隐私政策》</a></Checkbox>
      </div>
    </div>
  );
}
