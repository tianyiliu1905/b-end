import './MemberCardForm.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Radio,
  Button,
  Menu,
  Icon,
  Anchor,
  message,
} from '@ss/mtd-react3';

/* ============================================
   常量数据
   ============================================ */
const cardTypeOptions = [
  { label: '折扣卡', value: 'discount' },
  { label: '次卡', value: 'times' },
  { label: '储值卡', value: 'stored_value' },
  { label: '体验卡', value: 'experience' },
];

const applicableScopeOptions = [
  { label: '全部门店', value: 'all_stores' },
  { label: '指定门店', value: 'specific_stores' },
  { label: '指定区域', value: 'specific_area' },
];

const validityTypeOptions = [
  { label: '固定天数', value: 'fixed_days' },
  { label: '固定日期', value: 'fixed_date' },
  { label: '永久有效', value: 'permanent' },
];

const targetUserOptions = [
  { label: '全部用户', value: 'all' },
  { label: '新用户', value: 'new' },
  { label: '老用户', value: 'old' },
  { label: '指定等级', value: 'level' },
];

const salesChannelOptions = [
  { label: '美团APP', value: 'meituan_app' },
  { label: '大众点评APP', value: 'dianping_app' },
  { label: '小程序', value: 'mini_program' },
  { label: '门店POS', value: 'pos' },
];

/* ============================================
   App 主组件
   装配产物：顺序落地页[ 分组分段 + 单栏布局 + 操作工具栏 ]
   分组：基本信息 / 权益设置 / 使用规则 / 销售信息
   ============================================ */
export default function App() {
  const formRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  /* --- 窄屏自动收起侧导（断点 480px，避免预览窗口误折叠） --- */
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 480px)');
    const apply = (matches) => setCollapsed(matches);
    apply(mql.matches);
    const onChange = (e) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  /* --- 事件处理 --- */
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleSubmit = useCallback(() => {
    const isValid = formRef.current?.validateFields();
    if (isValid) {
      const formData = formRef.current?.getFieldsValue();
      console.log('提交表单:', formData);
      message.success('会员卡创建成功');
    } else {
      message.error('请完善必填项');
    }
  }, []);

  const handleSaveDraft = useCallback(() => {
    const formData = formRef.current?.getFieldsValue();
    console.log('保存草稿:', formData);
    message.info('草稿已保存');
  }, []);

  const handleCancel = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className="app-shell member-card">
      {/* ============================
          G · 顶导航栏 TopNavBar
          ============================ */}
      <header className="top-nav-bar">
        <div className="top-nav-logo">
          <div className="logo-icon" />
          <span className="logo-name">团购管理</span>
        </div>
        <nav className="top-nav-menus">
          <a className="top-nav-tab">工作台</a>
          <a className="top-nav-tab active">会员卡管理</a>
          <a className="top-nav-tab">数据统计</a>
          <a className="top-nav-tab">营销活动</a>
        </nav>
        <div className="top-nav-actions">
          <Icon type="bell-o" style={{ fontSize: 20, cursor: 'pointer' }} />
          <Icon type="comment-o" style={{ fontSize: 20, cursor: 'pointer' }} />
          <div className="avatar" />
        </div>
      </header>

      <div className="app-body">
        {/* ============================
            G · 侧导航栏 SideNavBar
            ============================ */}
        <aside
          className="side-nav"
          style={{ width: collapsed ? 60 : 200 }}
        >
          <Menu
            inlineCollapsed={collapsed}
            defaultSelectedKeys={['card-create']}
            defaultExpandedKeys={['card-manage']}
            className="side-nav-menu"
          >
            <Menu.Item key="dashboard" icon={<Icon type="home-o" />}>
              工作台
            </Menu.Item>
            <Menu.SubMenu
              key="card-manage"
              icon={<Icon type="bank-card" />}
              label="会员卡管理"
            >
              <Menu.Item key="card-list">会员卡列表</Menu.Item>
              <Menu.Item key="card-create">创建会员卡</Menu.Item>
              <Menu.Item key="card-record">核销记录</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              key="marketing"
              icon={<Icon type="coupon" />}
              label="营销活动"
            >
              <Menu.Item key="coupon">优惠券</Menu.Item>
              <Menu.Item key="promotion">促销活动</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="statistics" icon={<Icon type="barschart-o" />}>
              数据统计
            </Menu.Item>
            <Menu.Item key="settings" icon={<Icon type="setting" />}>
              系统设置
            </Menu.Item>
          </Menu>

          <div className={`side-nav-collapse ${collapsed ? 'side-nav-collapse--collapsed' : ''}`}>
            <button
              className="side-nav-collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? '展开' : '收起'}
            >
              <Icon type={collapsed ? 'expand' : 'collapse'} />
            </button>
          </div>
        </aside>

        {/* ============================
            内容区
            ============================ */}
        <main
          className="app-content"
          style={{ marginLeft: collapsed ? 60 : 200 }}
        >
          {/* F1 · 承载容器：顺序落地页（灰底 + 白卡 + 16px 四周留白） */}
          <div className="page-container">
            <div className="page-card">

              {/* 可滚动内容区 */}
              <div className="scroll-content">
              {/* F2 · 表头信息区 PageHeader（分组>3，加 --no-border） */}
              <div className="page-header page-header--no-border">
                <h1 className="page-header__title page-header__title--with-back">
                  <Icon
                    type="arrow-left"
                    className="page-header__back-icon"
                    onClick={handleBack}
                  />
                  创建团购会员卡
                </h1>
                <p className="page-header__desc">
                  创建新的团购会员卡，设置权益、使用规则和销售信息
                </p>
              </div>
              {/* §6.1/6.2 Anchor 锚点导航（分组>3 自动叠加，sticky 吸顶） */}
              <div className="page-header__anchor">
                <Anchor
                  direction="horizontal"
                  type="card"
                  affix={false}
                  getContainer={() => document.querySelector('.scroll-content') || window}
                  items={[
                    { href: '#group-basic', title: '基本信息' },
                    { href: '#group-benefit', title: '权益设置' },
                    { href: '#group-rules', title: '使用规则' },
                    { href: '#group-sales', title: '销售信息' },
                  ]}
                />
              </div>
              {/* F3 · 分组分段 + F4 · 单栏布局 */}
              <Form
                useContext={true}
                ref={formRef}
                labelPosition="right"
                labelWidth="120px"
                className="section-form"
                defaultFieldsValue={{
                  cardType: 'discount',
                  validityType: 'fixed_days',
                  applicableScope: 'all_stores',
                  targetUser: 'all',
                  transferable: false,
                  stackable: false,
                  autoRenew: false,
                }}
              >
                {/* ========== 分组一：基本信息 ========== */}
                <div className="form-section" id="group-basic">
                  <h3 className="form-section__title">基本信息</h3>

                  <Form.Item
                    formItemKey="cardName"
                    label="会员卡名称"
                    required
                    rules={{
                      message: '请输入会员卡名称',
                      validator: (rule, value) => !!value && value.trim().length > 0,
                    }}
                  >
                    <Input placeholder="请输入会员卡名称，如：超值折扣卡" maxLength={30} toFormItem />
                  </Form.Item>

                  <Form.Item formItemKey="cardType" label="会员卡类型" required>
                    <Select placeholder="请选择会员卡类型" toFormItem>
                      {cardTypeOptions.map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    formItemKey="cardSubtitle"
                    label="副标题"
                    helper="会展示在会员卡名称下方，限20字以内"
                  >
                    <Input placeholder="请输入副标题" maxLength={20} toFormItem />
                  </Form.Item>

                  <Form.Item formItemKey="cardDesc" label="会员卡说明">
                    <Input.TextArea
                      placeholder="请输入会员卡详细说明，会展示在卡片详情页"
                      rows={4}
                      maxLength={500}
                      toFormItem
                    />
                  </Form.Item>
                </div>

                {/* ========== 分组二：权益设置 ========== */}
                <div className="form-section" id="group-benefit">
                  <h3 className="form-section__title">权益设置</h3>

                  <Form.Item
                    formItemKey="discountRate"
                    label="折扣比例"
                    required
                    helper="输入1~99之间的整数，如输入85表示8.5折"
                  >
                    <InputNumber
                      placeholder="请输入折扣比例"
                      min={1}
                      max={99}
                      step={1}
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item
                    formItemKey="dailyLimit"
                    label="每日使用次数"
                    helper="0表示不限次数"
                  >
                    <InputNumber
                      placeholder="请输入每日使用次数上限"
                      min={0}
                      max={99}
                      step={1}
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item
                    formItemKey="minConsume"
                    label="最低消费金额"
                    helper="单次消费达到该金额后方可使用会员卡权益"
                  >
                    <InputNumber
                      placeholder="请输入最低消费金额"
                      min={0}
                      step={1}
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item formItemKey="stackable" label="叠加优惠">
                    <Switch toFormItem />
                  </Form.Item>

                  <Form.Item formItemKey="benefitDesc" label="权益说明">
                    <Input.TextArea
                      placeholder="请详细描述会员卡可享受的具体权益"
                      rows={3}
                      maxLength={300}
                      toFormItem
                    />
                  </Form.Item>
                </div>

                {/* ========== 分组三：使用规则 ========== */}
                <div className="form-section" id="group-rules">
                  <h3 className="form-section__title">使用规则</h3>

                  <Form.Item formItemKey="validityType" label="有效期类型" required>
                    <Radio.Group toFormItem>
                      <Radio.Button value="fixed_days">固定天数</Radio.Button>
                      <Radio.Button value="fixed_date">固定日期</Radio.Button>
                      <Radio.Button value="permanent">永久有效</Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    formItemKey="validDays"
                    label="有效天数"
                    helper="购买后从激活日起计算"
                  >
                    <InputNumber
                      placeholder="请输入有效天数"
                      min={1}
                      max={3650}
                      step={1}
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item formItemKey="applicableScope" label="适用范围" required>
                    <Select placeholder="请选择适用范围" toFormItem>
                      {applicableScopeOptions.map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item formItemKey="excludeDates" label="不可用日期">
                    <Input placeholder="请输入不可使用的日期，如：法定节假日、周末" toFormItem />
                  </Form.Item>

                  <Form.Item formItemKey="transferable" label="允许转赠">
                    <Switch toFormItem />
                  </Form.Item>

                  <Form.Item formItemKey="autoRenew" label="自动续费">
                    <Switch toFormItem />
                  </Form.Item>

                  <Form.Item formItemKey="useRuleDesc" label="使用须知">
                    <Input.TextArea
                      placeholder="请输入使用须知，如退款规则、限制条件等"
                      rows={3}
                      maxLength={500}
                      toFormItem
                    />
                  </Form.Item>
                </div>

                {/* ========== 分组四：销售信息 ========== */}
                <div className="form-section" id="group-sales">
                  <h3 className="form-section__title">销售信息</h3>

                  <Form.Item
                    formItemKey="originalPrice"
                    label="原价"
                    required
                    rules={{
                      message: '请输入原价',
                      validator: (rule, value) => value !== undefined && value > 0,
                    }}
                  >
                    <InputNumber
                      placeholder="请输入原价"
                      min={0.01}
                      step={0.01}
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item
                    formItemKey="sellingPrice"
                    label="售卖价"
                    required
                    rules={{
                      message: '请输入售卖价',
                      validator: (rule, value) => value !== undefined && value > 0,
                    }}
                  >
                    <InputNumber
                      placeholder="请输入售卖价"
                      min={0.01}
                      step={0.01}
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item formItemKey="totalStock" label="发行总量" required>
                    <InputNumber
                      placeholder="请输入发行总量，0表示不限量"
                      min={0}
                      step={1}
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item formItemKey="perUserLimit" label="每人限购">
                    <InputNumber
                      placeholder="请输入每人限购数量，0表示不限"
                      min={0}
                      max={99}
                      step={1}
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item formItemKey="saleStartDate" label="开售时间" required>
                    <DatePicker
                      placeholder="请选择开售时间"
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item formItemKey="saleEndDate" label="停售时间">
                    <DatePicker
                      placeholder="请选择停售时间"
                      toFormItem
                    />
                  </Form.Item>

                  <Form.Item formItemKey="targetUser" label="目标用户" required>
                    <Select placeholder="请选择目标用户" toFormItem>
                      {targetUserOptions.map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item formItemKey="salesChannel" label="销售渠道" required>
                    <Select placeholder="请选择销售渠道" multiple toFormItem>
                      {salesChannelOptions.map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Form>
              </div>

              {/* F14 · 操作工具栏 ActionBar */}
              <div className="action-bar">
                <Button onClick={handleCancel}>取消</Button>
                <Button onClick={handleSaveDraft}>保存草稿</Button>
                <Button type="primary" onClick={handleSubmit}>提交创建</Button>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Floating home navigation */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        borderRadius: 12,
        padding: 4,
        gap: 2,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '7px 14px',
            borderRadius: 9,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.01em',
            background: '#ffffff',
            color: '#0f172a',
            transition: 'all 0.2s ease',
          }}
        >
          ← 首页
        </button>
      </div>
    </div>
  );
}
