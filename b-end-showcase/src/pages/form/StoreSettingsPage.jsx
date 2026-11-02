import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Switch,
  Cascader,
  Menu,
  Button,
  Icon,
} from '@ss/mtd-react3';
import ModuleWrapper from '../../components/ModuleWrapper';
import './StoreSettingsPage.css';

/* ========== 左侧配置分类 ========== */
const MENU_ITEMS = [
  { key: 'basic', label: '基础信息', icon: 'home-o' },
  { key: 'business', label: '营业规则', icon: 'setting' },
  { key: 'queue', label: '排队叫号', icon: 'page-o' },
  { key: 'delivery', label: '外卖配送', icon: 'cart-o' },
  { key: 'member', label: '会员体系', icon: 'customer-o' },
  { key: 'marketing', label: '营销活动', icon: 'bell-o' },
  { key: 'finance', label: '财务结算', icon: 'money-circle' },
  { key: 'system', label: '系统与安全', icon: 'lock-o' },
];

/* ========== 省市区数据（示例） ========== */
const regionOptions = [
  {
    value: 'beijing',
    label: '北京市',
    children: [
      {
        value: 'beijing-city',
        label: '北京市',
        children: [
          { value: 'chaoyang', label: '朝阳区' },
          { value: 'haidian', label: '海淀区' },
          { value: 'dongcheng', label: '东城区' },
        ],
      },
    ],
  },
  {
    value: 'shanghai',
    label: '上海市',
    children: [
      {
        value: 'shanghai-city',
        label: '上海市',
        children: [
          { value: 'pudong', label: '浦东新区' },
          { value: 'huangpu', label: '黄浦区' },
          { value: 'jing-an', label: '静安区' },
        ],
      },
    ],
  },
  {
    value: 'guangdong',
    label: '广东省',
    children: [
      {
        value: 'guangzhou',
        label: '广州市',
        children: [
          { value: 'tianhe', label: '天河区' },
          { value: 'yuexiu', label: '越秀区' },
        ],
      },
      {
        value: 'shenzhen',
        label: '深圳市',
        children: [
          { value: 'nanshan', label: '南山区' },
          { value: 'futian', label: '福田区' },
        ],
      },
    ],
  },
];

/* ========== 基础信息表单 ========== */
function BasicInfoForm() {
  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="100px"
      useContext
    >
      <div className="form-section" style={{ width: '100%' }}>
        {/* 门店名称 - 单列整行 */}
        <Form.Item label="门店名称" span={24}>
          <Input placeholder="请输入门店名称" />
        </Form.Item>

        {/* 门店编码 + 门店类型 - 双列并排 */}
        <Form.Item label="门店编码" span={12}>
          <Input placeholder="请输入门店编码" />
        </Form.Item>
        <Form.Item label="门店类型" span={12}>
          <Select placeholder="请选择门店类型">
            <Select.Option value="direct">直营店</Select.Option>
            <Select.Option value="franchise">加盟店</Select.Option>
            <Select.Option value="joint">联营店</Select.Option>
            <Select.Option value="trust">托管店</Select.Option>
          </Select>
        </Form.Item>

        {/* 所属区域 - 单列整行 */}
        <Form.Item label="所属区域" span={24}>
          <Cascader
            data={regionOptions}
            placeholder="请选择省/市/区"
          />
        </Form.Item>

        {/* 详细地址 - 单列整行 */}
        <Form.Item label="详细地址" span={24}>
          <Input placeholder="请输入详细地址" />
        </Form.Item>

        {/* 联系电话 + 备用电话 - 双列并排 */}
        <Form.Item label="联系电话" span={12}>
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item label="备用电话" span={12}>
          <Input placeholder="请输入备用电话" />
        </Form.Item>

        {/* 门店面积 + 座位数量 - 双列并排 */}
        <Form.Item label="门店面积" span={12}>
          <InputNumber placeholder="请输入" suffix="㎡" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="座位数量" span={12}>
          <InputNumber placeholder="请输入座位数量" style={{ width: '100%' }} />
        </Form.Item>

        {/* 门店标签 - 单列整行 */}
        <Form.Item label="门店标签" span={24}>
          <Select placeholder="请选择门店标签" multiple>
            <Select.Option value="wanghong">网红店</Select.Option>
            <Select.Option value="laozihao">老字号</Select.Option>
            <Select.Option value="liansuo">连锁品牌</Select.Option>
            <Select.Option value="shequ">社区店</Select.Option>
          </Select>
        </Form.Item>

        {/* 门店简介 - 单列整行 */}
        <Form.Item label="门店简介" span={24}>
          <Input.TextArea rows={4} placeholder="请输入门店简介" />
        </Form.Item>
      </div>
    </Form>
  );
}

/* ========== 营业规则表单 ========== */
function BusinessRulesForm() {
  const [allDay, setAllDay] = useState(false);

  const timeStartOptions = [];
  for (let h = 6; h <= 12; h++) {
    timeStartOptions.push(`${String(h).padStart(2, '0')}:00`);
  }
  const timeEndOptions = [];
  for (let h = 18; h <= 24; h++) {
    timeEndOptions.push(`${String(h).padStart(2, '0')}:00`);
  }

  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="100px"
      useContext
    >
      <div className="form-section" style={{ width: '100%' }}>
        <Form.Item label="营业状态" span={24}>
          <Radio.Group>
            <Radio.Button value="normal">正常营业</Radio.Button>
            <Radio.Button value="paused">暂停营业</Radio.Button>
            <Radio.Button value="trial">试营业</Radio.Button>
            <Radio.Button value="renovation">装修中</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="工作日开始" span={12}>
          <Select placeholder="开始时间">
            {timeStartOptions.map((t) => (
              <Select.Option key={t} value={t}>{t}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="工作日结束" span={12}>
          <Select placeholder="结束时间">
            {timeEndOptions.map((t) => (
              <Select.Option key={t} value={t}>{t}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="周末开始" span={12}>
          <Select placeholder="开始时间">
            {timeStartOptions.map((t) => (
              <Select.Option key={t} value={t}>{t}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="周末结束" span={12}>
          <Select placeholder="结束时间">
            {timeEndOptions.map((t) => (
              <Select.Option key={t} value={t}>{t}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="全天营业" span={24}>
          <Switch checked={allDay} onChange={setAllDay} />
        </Form.Item>

        <Form.Item label="每周休息日" span={24}>
          <Select placeholder="请选择休息日" multiple>
            <Select.Option value="mon">周一</Select.Option>
            <Select.Option value="tue">周二</Select.Option>
            <Select.Option value="wed">周三</Select.Option>
            <Select.Option value="thu">周四</Select.Option>
            <Select.Option value="fri">周五</Select.Option>
            <Select.Option value="sat">周六</Select.Option>
            <Select.Option value="sun">周日</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="节假日休息" span={12}>
          <Switch />
        </Form.Item>
        <Form.Item label="翻台时间" span={12}>
          <InputNumber defaultValue={90} suffix="分钟" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="最大接待桌数" span={24}>
          <InputNumber placeholder="请输入最大同时接待桌数" style={{ width: '100%' }} />
        </Form.Item>
      </div>
    </Form>
  );
}

/* ========== 排队叫号表单 ========== */
function QueueForm() {
  const [notifyTemplate, setNotifyTemplate] = useState('');

  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="100px"
      useContext
    >
      <div className="form-section" style={{ width: '100%' }}>
        <Form.Item label="排队模式" span={24}>
          <Radio.Group>
            <Radio.Button value="auto">自动叫号</Radio.Button>
            <Radio.Button value="manual">手动叫号</Radio.Button>
            <Radio.Button value="mix">混合模式</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="最大排队组数" span={12}>
          <InputNumber defaultValue={50} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="过号保留时间" span={12}>
          <InputNumber defaultValue={15} suffix="分钟" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="提前叫号桌数" span={12}>
          <InputNumber defaultValue={3} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="超时自动取消" span={12}>
          <Switch />
        </Form.Item>

        <Form.Item label="短信通知" span={24}>
          <Switch />
        </Form.Item>

        <Form.Item label="通知模板" span={24}>
          <Select
            placeholder="请选择通知模板"
            value={notifyTemplate}
            onChange={setNotifyTemplate}
          >
            <Select.Option value="templateA">模板A</Select.Option>
            <Select.Option value="templateB">模板B</Select.Option>
            <Select.Option value="custom">自定义</Select.Option>
          </Select>
        </Form.Item>

        {notifyTemplate === 'custom' && (
          <Form.Item label="自定义内容" span={24}>
            <Input.TextArea rows={2} placeholder="请输入自定义通知内容" />
          </Form.Item>
        )}
      </div>
    </Form>
  );
}

/* ========== 外卖配送表单 ========== */
function DeliveryForm() {
  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="100px"
      useContext
    >
      <div className="form-section" style={{ width: '100%' }}>
        <Form.Item label="配送方式" span={24}>
          <Radio.Group>
            <Radio.Button value="self">自配送</Radio.Button>
            <Radio.Button value="meituan">美团配送</Radio.Button>
            <Radio.Button value="dada">达达配送</Radio.Button>
            <Radio.Button value="mix">混合配送</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="配送范围" span={12}>
          <InputNumber defaultValue={5} suffix="km" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="起送金额" span={12}>
          <InputNumber defaultValue={20} suffix="元" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="配送费规则" span={24}>
          <Select placeholder="请选择配送费规则">
            <Select.Option value="fixed">固定费用</Select.Option>
            <Select.Option value="tiered">阶梯计费</Select.Option>
            <Select.Option value="free">满减免配送</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="固定配送费" span={12}>
          <InputNumber suffix="元" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="预计送达时间" span={12}>
          <InputNumber defaultValue={30} suffix="分钟" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="高峰时段加时" span={12}>
          <InputNumber defaultValue={15} suffix="分钟" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="恶劣天气暂停" span={12}>
          <Switch />
        </Form.Item>

        <Form.Item label="绩效系数" span={24}>
          <InputNumber
            min={0.5}
            max={2.0}
            step={0.1}
            placeholder="0.5~2.0"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </div>
    </Form>
  );
}

/* ========== 会员体系表单 ========== */
function MemberForm() {
  const [memberEnabled, setMemberEnabled] = useState(false);
  const [birthdayEnabled, setBirthdayEnabled] = useState(false);
  const [storedCardEnabled, setStoredCardEnabled] = useState(false);

  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="100px"
      useContext
    >
      <div className="form-section" style={{ width: '100%' }}>
        <Form.Item label="会员等级启用" span={24}>
          <Switch checked={memberEnabled} onChange={setMemberEnabled} />
        </Form.Item>

        {memberEnabled && (
          <>
            <Form.Item label="等级划分" span={12}>
              <Select placeholder="请选择等级划分">
                <Select.Option value="3">3级</Select.Option>
                <Select.Option value="5">5级</Select.Option>
                <Select.Option value="7">7级</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="积分兑换比例" span={12}>
              <InputNumber placeholder="每消费X元=1积分" suffix="元/积分" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="积分有效期" span={24}>
              <Select placeholder="请选择积分有效期">
                <Select.Option value="forever">永久</Select.Option>
                <Select.Option value="1year">1年</Select.Option>
                <Select.Option value="2year">2年</Select.Option>
                <Select.Option value="3year">3年</Select.Option>
              </Select>
            </Form.Item>
          </>
        )}

        <Form.Item label="生日特权" span={24}>
          <Switch checked={birthdayEnabled} onChange={setBirthdayEnabled} />
        </Form.Item>

        {birthdayEnabled && (
          <Form.Item label="生日优惠类型" span={24}>
            <Select placeholder="请选择优惠类型">
              <Select.Option value="discount">折扣</Select.Option>
              <Select.Option value="gift">赠品</Select.Option>
              <Select.Option value="voucher">代金券</Select.Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item label="储值卡功能" span={24}>
          <Switch checked={storedCardEnabled} onChange={setStoredCardEnabled} />
        </Form.Item>

        {storedCardEnabled && (
          <>
            <Form.Item label="最低储值金额" span={12}>
              <InputNumber suffix="元" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="储值赠送比例" span={12}>
              <InputNumber suffix="%" style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}
      </div>
    </Form>
  );
}

/* ========== 营销活动表单 ========== */
function MarketingForm() {
  const [autoCoupon, setAutoCoupon] = useState(false);
  const [fullReduction, setFullReduction] = useState(false);

  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="100px"
      useContext
    >
      <div className="form-section" style={{ width: '100%' }}>
        <Form.Item label="自动发券" span={24}>
          <Switch checked={autoCoupon} onChange={setAutoCoupon} />
        </Form.Item>

        {autoCoupon && (
          <>
            <Form.Item label="发券触发条件" span={24}>
              <Select placeholder="请选择触发条件">
                <Select.Option value="new">新客注册</Select.Option>
                <Select.Option value="amount">消费满额</Select.Option>
                <Select.Option value="wakeup">沉睡唤醒</Select.Option>
                <Select.Option value="birthday">生日当天</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="优惠券面额" span={12}>
              <InputNumber suffix="元" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="有效天数" span={12}>
              <InputNumber placeholder="请输入天数" style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}

        <Form.Item label="满减活动" span={24}>
          <Switch checked={fullReduction} onChange={setFullReduction} />
        </Form.Item>

        {fullReduction && (
          <>
            <Form.Item label="满减门槛" span={12}>
              <InputNumber suffix="元" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="满减金额" span={12}>
              <InputNumber suffix="元" style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}

        <Form.Item label="活动叠加规则" span={24}>
          <Radio.Group>
            <Radio.Button value="none">不可叠加</Radio.Button>
            <Radio.Button value="member">仅与会员折扣叠加</Radio.Button>
            <Radio.Button value="all">全部可叠加</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="每日优惠上限" span={24}>
          <InputNumber suffix="次" style={{ width: '100%' }} />
        </Form.Item>
      </div>
    </Form>
  );
}

/* ========== 财务结算表单 ========== */
function FinanceForm() {
  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="100px"
      useContext
    >
      <div className="form-section" style={{ width: '100%' }}>
        <Form.Item label="结算周期" span={24}>
          <Select placeholder="请选择结算周期">
            <Select.Option value="t1">T+1日结</Select.Option>
            <Select.Option value="week">周结</Select.Option>
            <Select.Option value="month">月结</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="账户类型" span={24}>
          <Radio.Group>
            <Radio.Button value="public">对公账户</Radio.Button>
            <Radio.Button value="private">对私账户</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="开户银行" span={24}>
          <Input placeholder="请输入开户银行" />
        </Form.Item>

        <Form.Item label="账户名称" span={12}>
          <Input placeholder="请输入账户名称" />
        </Form.Item>
        <Form.Item label="银行账号" span={12}>
          <Input placeholder="请输入银行账号" />
        </Form.Item>

        <Form.Item label="税率" span={12}>
          <InputNumber suffix="%" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="自动开票" span={12}>
          <Switch />
        </Form.Item>

        <Form.Item label="发票类型" span={24}>
          <Select placeholder="请选择发票类型">
            <Select.Option value="normal">增值税普通发票</Select.Option>
            <Select.Option value="special">增值税专用发票</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="财务审批人" span={24}>
          <Input placeholder="请输入财务审批人" />
        </Form.Item>
      </div>
    </Form>
  );
}

/* ========== 系统与安全表单 ========== */
function SystemForm() {
  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="100px"
      useContext
    >
      <div className="form-section" style={{ width: '100%' }}>
        <Form.Item label="日志保留天数" span={12}>
          <InputNumber defaultValue={90} suffix="天" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="数据备份频率" span={12}>
          <Select placeholder="请选择备份频率">
            <Select.Option value="daily">每日</Select.Option>
            <Select.Option value="weekly">每周</Select.Option>
            <Select.Option value="monthly">每月</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="自动备份时间" span={12}>
          <Select placeholder="请选择备份时间">
            <Select.Option value="00:00">00:00</Select.Option>
            <Select.Option value="01:00">01:00</Select.Option>
            <Select.Option value="02:00">02:00</Select.Option>
            <Select.Option value="03:00">03:00</Select.Option>
            <Select.Option value="04:00">04:00</Select.Option>
            <Select.Option value="05:00">05:00</Select.Option>
            <Select.Option value="06:00">06:00</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="登录超时时间" span={12}>
          <InputNumber defaultValue={30} suffix="分钟" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="强制改密周期" span={12}>
          <Select placeholder="请选择">
            <Select.Option value="never">不强制</Select.Option>
            <Select.Option value="30">30天</Select.Option>
            <Select.Option value="60">60天</Select.Option>
            <Select.Option value="90">90天</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="失败锁定次数" span={12}>
          <InputNumber defaultValue={5} suffix="次" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="IP白名单启用" span={12}>
          <Switch />
        </Form.Item>
        <Form.Item label="二次验证" span={12}>
          <Switch />
        </Form.Item>

        <Form.Item label="API限流" span={24}>
          <InputNumber defaultValue={100} suffix="次/分钟" style={{ width: '100%' }} />
        </Form.Item>
      </div>
    </Form>
  );
}

/* ========== 表单内容映射 ========== */
const FORM_MAP = {
  basic: { title: '基础信息', component: BasicInfoForm },
  business: { title: '营业规则', component: BusinessRulesForm },
  queue: { title: '排队叫号', component: QueueForm },
  delivery: { title: '外卖配送', component: DeliveryForm },
  member: { title: '会员体系', component: MemberForm },
  marketing: { title: '营销活动', component: MarketingForm },
  finance: { title: '财务结算', component: FinanceForm },
  system: { title: '系统与安全', component: SystemForm },
};

/* ========== 主页面组件 ========== */
export default function StoreSettingsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('basic');
  const navigate = useNavigate();

  // 响应式：窄屏自动收起侧导
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767.98px)');
    const apply = (matches) => setCollapsed(matches);
    apply(mql.matches);
    const onChange = (e) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const currentForm = FORM_MAP[activeKey];
  const CurrentFormComponent = currentForm.component;

  return (
    <div className="app-shell store-settings">
      {/* ===== 顶导航栏 ===== */}
      <header className="top-nav-bar">
        <div className="top-nav-logo">
          <div className="logo-icon" />
          <div className="logo-name" />
        </div>
        <nav className="top-nav-menus">
          <a className="top-nav-tab active" href="#" onClick={(e) => e.preventDefault()}>
            运营中心
          </a>
          <a className="top-nav-tab" href="#" onClick={(e) => e.preventDefault()}>
            数据分析
          </a>
          <a className="top-nav-tab" href="#" onClick={(e) => e.preventDefault()}>
            商品管理
          </a>
        </nav>
        <div className="top-nav-actions">
          <Icon type="bell-o" style={{ fontSize: 20 }} />
          <Icon type="comment-o" style={{ fontSize: 20 }} />
          <div className="avatar" />
        </div>
      </header>

      {/* ===== 侧导航栏 ===== */}
      <aside className={`side-nav ${collapsed ? 'side-nav--collapsed' : ''}`}>
        <Menu
          mode="inline"
          className="side-nav-menu"
          inlineCollapsed={collapsed}
          defaultSelectedKeys={['settings']}
          defaultExpandedKeys={['ops']}
        >
          <Menu.Item key="dashboard" icon={<Icon type="home-o" />}>
            工作台
          </Menu.Item>
          <Menu.SubMenu key="ops" label="运营管理" icon={<Icon type="setting" />}>
            <Menu.Item key="settings">配置中心</Menu.Item>
            <Menu.Item key="stores">门店列表</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="data" label="数据报表" icon={<Icon type="bar-chart" />}>
            <Menu.Item key="overview">数据概览</Menu.Item>
            <Menu.Item key="reports">经营报表</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="sys" icon={<Icon type="lock-o" />}>
            系统设置
          </Menu.Item>
        </Menu>
        <div className="side-nav-collapse">
          <button
            className="side-nav-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? '展开' : '收起'}
          >
            <Icon type={collapsed ? 'expand' : 'collapse'} />
          </button>
        </div>
      </aside>

      {/* ===== 内容区 ===== */}
      <main className={`app-content ${collapsed ? 'app-content--collapsed' : ''}`}>
        <div className="page-container">
          <div className="content-card">
            {/* 左侧：二级侧导（配置分类） */}
            <aside className="master-panel">
              <Menu
                mode="inline"
                className="master-panel__menu"
                selectedKeys={[activeKey]}
                onSelectChange={(key) => setActiveKey(key)}
              >
                {MENU_ITEMS.map((item) => (
                  <Menu.Item key={item.key}>
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu>
            </aside>

            {/* 右侧：配置表单 + 操作栏 */}
            <div className="detail-panel">
              <div className="detail-panel__content">
                <div className="page-header">
                  <h1 className="page-header__title">{currentForm.title}</h1>
                </div>
                <CurrentFormComponent />
              </div>
              <ModuleWrapper moduleId="F-3 操作栏（顺序落地页版）" style={{ height: 'auto' }}>
              <footer className="action-bar">
                <div className="action-bar__inner">
                  <Button type="primary">保存配置</Button>
                  <Button>重置</Button>
                </div>
              </footer>
              </ModuleWrapper>
            </div>
          </div>
        </div>
      </main>

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
