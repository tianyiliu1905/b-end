/**
 * 统一占位数据集
 * ─────────────────────────────────────────────
 * 本文件为所有页面的 Table / 图表提供 mock 数据，
 * 各页面通过 import { xxx } from '../mock/tableData' 引用。
 */
import { getChartCategoricalPalette } from '../lib/chartTokens';

/* ═══════════════════════════════════════════════
   1. 人员管理（CRUD 列表页）
   ═══════════════════════════════════════════════ */

export interface StaffRecord {
  key: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  dept: string;
  role: string;
  level: string;
  location: string;
  manager: string;
  contractType: string;
  status: '在职' | '离职' | '休假';
  joinDate: string;
  lastModified: string;
}

export const staffData: StaffRecord[] = [
  { key: '1', id: 'EMP-001', name: '张三', phone: '138****1234', email: 'zhangsan@company.com', dept: '技术部', role: '前端工程师', level: 'P6', location: '北京-望京', manager: '钱丰', contractType: '正式', status: '在职', joinDate: '2023-03-15', lastModified: '2024-03-01' },
  { key: '2', id: 'EMP-002', name: '李四', phone: '139****5678', email: 'lisi@company.com', dept: '产品部', role: '产品经理', level: 'P7', location: '北京-望京', manager: '郑十', contractType: '正式', status: '在职', joinDate: '2023-05-20', lastModified: '2024-02-18' },
  { key: '3', id: 'EMP-003', name: '王五', phone: '137****9012', email: 'wangwu@company.com', dept: '设计部', role: 'UI设计师', level: 'P5', location: '上海-漕河泾', manager: '林静', contractType: '正式', status: '在职', joinDate: '2024-01-10', lastModified: '2024-03-10' },
  { key: '4', id: 'EMP-004', name: '赵六', phone: '136****3456', email: 'zhaoliu@company.com', dept: '技术部', role: '后端工程师', level: 'P6', location: '北京-望京', manager: '钱丰', contractType: '正式', status: '离职', joinDate: '2022-11-08', lastModified: '2024-01-15' },
  { key: '5', id: 'EMP-005', name: '孙七', phone: '135****7890', email: 'sunqi@company.com', dept: '运营部', role: '运营专员', level: 'P4', location: '成都-天府', manager: '黄磊', contractType: '实习', status: '在职', joinDate: '2023-08-25', lastModified: '2024-03-05' },
  { key: '6', id: 'EMP-006', name: '周八', phone: '133****2345', email: 'zhouba@company.com', dept: '技术部', role: '测试工程师', level: 'P5', location: '北京-望京', manager: '钱丰', contractType: '正式', status: '在职', joinDate: '2022-06-14', lastModified: '2024-02-20' },
  { key: '7', id: 'EMP-007', name: '吴九', phone: '132****6789', email: 'wujiu@company.com', dept: '财务部', role: '财务专员', level: 'P5', location: '北京-望京', manager: '郑十', contractType: '正式', status: '休假', joinDate: '2021-09-01', lastModified: '2024-01-30' },
  { key: '8', id: 'EMP-008', name: '郑十', phone: '131****0123', email: 'zhengshi@company.com', dept: '市场部', role: '市场经理', level: 'P8', location: '北京-望京', manager: '-', contractType: '正式', status: '在职', joinDate: '2020-12-20', lastModified: '2024-03-12' },
  { key: '9', id: 'EMP-009', name: '钱丰', phone: '130****4567', email: 'qianfeng@company.com', dept: '技术部', role: '架构师', level: 'P8', location: '北京-望京', manager: '-', contractType: '正式', status: '在职', joinDate: '2021-04-12', lastModified: '2024-03-08' },
  { key: '10', id: 'EMP-010', name: '陈波', phone: '158****8901', email: 'chenbo@company.com', dept: '产品部', role: '数据分析师', level: 'P6', location: '上海-漕河泾', manager: '李四', contractType: '正式', status: '在职', joinDate: '2023-09-05', lastModified: '2024-02-28' },
  { key: '11', id: 'EMP-011', name: '林静', phone: '159****2345', email: 'linjing@company.com', dept: '设计部', role: '交互设计师', level: 'P7', location: '上海-漕河泾', manager: '郑十', contractType: '正式', status: '在职', joinDate: '2022-07-18', lastModified: '2024-03-06' },
  { key: '12', id: 'EMP-012', name: '黄磊', phone: '152****6789', email: 'huanglei@company.com', dept: '运营部', role: '高级运营', level: 'P7', location: '成都-天府', manager: '郑十', contractType: '正式', status: '离职', joinDate: '2020-05-22', lastModified: '2024-01-10' },
];

export const deptOptions = [
  { label: '全部部门', value: '' },
  { label: '技术部', value: '技术部' },
  { label: '产品部', value: '产品部' },
  { label: '设计部', value: '设计部' },
  { label: '运营部', value: '运营部' },
  { label: '财务部', value: '财务部' },
  { label: '市场部', value: '市场部' },
];

export const staffStatusOptions = [
  { label: '全部状态', value: '' },
  { label: '在职', value: '在职' },
  { label: '离职', value: '离职' },
  { label: '休假', value: '休假' },
];

/* ═══════════════════════════════════════════════
   2. 区域数据（数据看板 — Overview 明细表）
   ═══════════════════════════════════════════════ */

export interface RegionRecord {
  key: string;
  region: string;
  stores: number;
  preparing: number;
  target: number;
  completion: string;
  newOpen: number;
}

export const regionTableData: RegionRecord[] = [
  { key: '1', region: '华北区', stores: 620, preparing: 180, target: 850, completion: '72.9%', newOpen: 312 },
  { key: '2', region: '华东区', stores: 880, preparing: 320, target: 1200, completion: '73.3%', newOpen: 468 },
  { key: '3', region: '华南区', stores: 520, preparing: 150, target: 720, completion: '72.2%', newOpen: 285 },
  { key: '4', region: '西南区', stores: 380, preparing: 280, target: 680, completion: '55.9%', newOpen: 210 },
  { key: '5', region: '东南区', stores: 168, preparing: 170, target: 350, completion: '48.0%', newOpen: 125 },
  { key: '6', region: '西北区', stores: 100, preparing: 100, target: 200, completion: '50.0%', newOpen: 80 },
];

/* ═══════════════════════════════════════════════
   3. 目标拆解（Filter+Table 看板）
   ═══════════════════════════════════════════════ */

export interface GoalRecord {
  key: string;
  dept: string;
  target: string;
  actual: string;
  rate: string;
  status: '已达成' | '进行中' | '落后' | '严重落后';
}

export const goalTableData: GoalRecord[] = [
  { key: '1', dept: '华北区', target: '¥350万', actual: '¥298万', rate: '85.1%', status: '进行中' },
  { key: '2', dept: '华东区', target: '¥280万', actual: '¥265万', rate: '94.6%', status: '进行中' },
  { key: '3', dept: '华南区', target: '¥200万', actual: '¥201万', rate: '100.5%', status: '已达成' },
  { key: '4', dept: '西南区', target: '¥100万', actual: '¥72万', rate: '72.0%', status: '落后' },
  { key: '5', dept: '西北区', target: '¥70万', actual: '¥20万', rate: '28.6%', status: '严重落后' },
];

/* ═══════════════════════════════════════════════
   4. 交易明细（指标+明细 列表页）
   ═══════════════════════════════════════════════ */

export interface TransactionRecord {
  key: string;
  time: string;
  id: string;
  amount: string;
  type: '消费' | '退款';
  channel: string;
  status: '成功' | '已退款' | '处理中';
}

export const transactionData: TransactionRecord[] = [
  { key: '1', time: '2024-03-15 14:32', id: 'TXN-88901', amount: '¥256.00', type: '消费', channel: '线上支付', status: '成功' },
  { key: '2', time: '2024-03-15 14:28', id: 'TXN-88900', amount: '¥89.50', type: '消费', channel: '扫码支付', status: '成功' },
  { key: '3', time: '2024-03-15 14:15', id: 'TXN-88899', amount: '-¥128.00', type: '退款', channel: '线上支付', status: '已退款' },
  { key: '4', time: '2024-03-15 13:50', id: 'TXN-88898', amount: '¥456.00', type: '消费', channel: '线上支付', status: '成功' },
  { key: '5', time: '2024-03-15 13:22', id: 'TXN-88897', amount: '¥67.80', type: '消费', channel: '扫码支付', status: '成功' },
  { key: '6', time: '2024-03-15 12:45', id: 'TXN-88896', amount: '¥312.50', type: '消费', channel: '线上支付', status: '成功' },
  { key: '7', time: '2024-03-15 11:30', id: 'TXN-88895', amount: '-¥45.00', type: '退款', channel: '线上支付', status: '处理中' },
  { key: '8', time: '2024-03-15 10:18', id: 'TXN-88894', amount: '¥198.00', type: '消费', channel: '小程序', status: '成功' },
  { key: '9', time: '2024-03-15 09:55', id: 'TXN-88893', amount: '¥533.20', type: '消费', channel: '线上支付', status: '成功' },
  { key: '10', time: '2024-03-15 09:12', id: 'TXN-88892', amount: '-¥99.00', type: '退款', channel: '小程序', status: '已退款' },
  { key: '11', time: '2024-03-14 18:45', id: 'TXN-88891', amount: '¥178.00', type: '消费', channel: '扫码支付', status: '成功' },
  { key: '12', time: '2024-03-14 17:30', id: 'TXN-88890', amount: '¥620.00', type: '消费', channel: '线上支付', status: '成功' },
];

/* ═══════════════════════════════════════════════
   5. 树形分类（树形层级列表）
   ═══════════════════════════════════════════════ */

export interface CategoryItem {
  key: string;
  name: string;
  status: '已上线' | '待审核' | '已下线';
  updateTime: string;
  operator: string;
}

export const categoryDataMap: Record<string, CategoryItem[]> = {
  clean: [
    { key: 'c1', name: '日常保洁', status: '已上线', updateTime: '2024-03-15', operator: '张三' },
    { key: 'c2', name: '深度清洁', status: '已上线', updateTime: '2024-03-12', operator: '李四' },
    { key: 'c3', name: '开荒保洁', status: '待审核', updateTime: '2024-03-10', operator: '王五' },
    { key: 'c4', name: '玻璃清洗', status: '已下线', updateTime: '2024-02-28', operator: '赵六' },
    { key: 'c5', name: '地毯清洗', status: '已上线', updateTime: '2024-03-14', operator: '孙七' },
  ],
  repair: [
    { key: 'r1', name: '家电维修', status: '已上线', updateTime: '2024-03-14', operator: '周八' },
    { key: 'r2', name: '管道疏通', status: '已上线', updateTime: '2024-03-13', operator: '吴九' },
    { key: 'r3', name: '门窗维修', status: '待审核', updateTime: '2024-03-11', operator: '郑十' },
  ],
  move: [
    { key: 'm1', name: '同城搬家', status: '已上线', updateTime: '2024-03-10', operator: '张三' },
    { key: 'm2', name: '跨城搬家', status: '待审核', updateTime: '2024-03-08', operator: '李四' },
  ],
  takeout: [
    { key: 't1', name: '快餐简餐', status: '已上线', updateTime: '2024-03-15', operator: '钱丰' },
    { key: 't2', name: '地方小吃', status: '已上线', updateTime: '2024-03-14', operator: '陈波' },
    { key: 't3', name: '甜品饮品', status: '待审核', updateTime: '2024-03-13', operator: '林静' },
  ],
  dine: [
    { key: 'd1', name: '火锅', status: '已上线', updateTime: '2024-03-12', operator: '黄磊' },
    { key: 'd2', name: '自助餐', status: '已上线', updateTime: '2024-03-11', operator: '张三' },
  ],
};

export const treeData = [
  {
    label: '全部分类',
    key: 'all',
    children: [
      {
        label: '生活服务',
        key: 'life',
        children: [
          { label: '保洁', key: 'clean' },
          { label: '维修', key: 'repair' },
          { label: '搬运', key: 'move' },
        ],
      },
      {
        label: '餐饮美食',
        key: 'food',
        children: [
          { label: '外卖', key: 'takeout' },
          { label: '堂食', key: 'dine' },
        ],
      },
      {
        label: '购物零售',
        key: 'retail',
        children: [
          { label: '超市', key: 'supermarket' },
          { label: '生鲜', key: 'fresh' },
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════
   6. 指标卡片组 (Dashboard / MetricDetail)
   ═══════════════════════════════════════════════ */

export interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  vs?: string;
  icon?: string;
}

/** 数据通览看板 — D-3 指标卡 */
export const overviewMetrics: MetricCard[] = [
  { label: '营业门店数', value: '2,668', change: '+15.5%', trend: 'up', vs: '2,310', icon: 'home-o' },
  { label: '筹备门店数', value: '1,200', change: '+8.4%', trend: 'up', vs: '1,107', icon: 'group-o' },
  { label: '候选点位数', value: '1,008', change: '-10.5%', trend: 'down', vs: '1,127', icon: 'location-o' },
  { label: '新开门店数', value: '1,480', change: '+4.4%', trend: 'up', vs: '1,418', icon: 'barschart-o' },
];

/** 指标+明细列表 — 顶部汇总卡 */
export const tradeMetrics: MetricCard[] = [
  { label: '总金额', value: '¥523,306', change: '+12.3%', trend: 'up' },
  { label: '交易笔数', value: '2,338', change: '+8.7%', trend: 'up' },
  { label: '平均客单价', value: '¥223.9', change: '-2.1%', trend: 'down' },
  { label: '退款率', value: '1.2%', change: '-0.3%', trend: 'down' },
];

/* ═══════════════════════════════════════════════
   7. 图表数据（趋势 / 漏斗 / 分布）
   ═══════════════════════════════════════════════ */

/** 跟随品牌新开趋势 */
export const brandTrendData = [
  { month: '1月', value: 820, brand: '富王茶泰' },
  { month: '1月', value: 450, brand: '奈雪的茶' },
  { month: '1月', value: 280, brand: '茶沐青' },
  { month: '3月', value: 1200, brand: '富王茶泰' },
  { month: '3月', value: 680, brand: '奈雪的茶' },
  { month: '3月', value: 420, brand: '茶沐青' },
  { month: '5月', value: 1560, brand: '富王茶泰' },
  { month: '5月', value: 780, brand: '奈雪的茶' },
  { month: '5月', value: 510, brand: '茶沐青' },
  { month: '7月', value: 1380, brand: '富王茶泰' },
  { month: '7月', value: 620, brand: '奈雪的茶' },
  { month: '7月', value: 380, brand: '茶沐青' },
  { month: '9月', value: 1720, brand: '富王茶泰' },
  { month: '9月', value: 850, brand: '奈雪的茶' },
  { month: '9月', value: 560, brand: '茶沐青' },
  { month: '11月', value: 1900, brand: '富王茶泰' },
  { month: '11月', value: 920, brand: '奈雪的茶' },
  { month: '11月', value: 640, brand: '茶沐青' },
];

/** 全国开店趋势（柱+线） */
export const storeTrendData = [
  { month: '1月', value: 180, type: '营业门店数' },
  { month: '1月', value: 35, type: '新开门店数' },
  { month: '3月', value: 260, type: '营业门店数' },
  { month: '3月', value: 52, type: '新开门店数' },
  { month: '5月', value: 320, type: '营业门店数' },
  { month: '5月', value: 68, type: '新开门店数' },
  { month: '7月', value: 380, type: '营业门店数' },
  { month: '7月', value: 75, type: '新开门店数' },
  { month: '9月', value: 350, type: '营业门店数' },
  { month: '9月', value: 62, type: '新开门店数' },
  { month: '11月', value: 410, type: '营业门店数' },
  { month: '11月', value: 88, type: '新开门店数' },
];

/** 铺位漏斗 */
export const funnelData = [
  { stage: '规划点位', value: 476 },
  { stage: '勘查点位', value: 676 },
  { stage: '提报点位', value: 480 },
  { stage: '过审点位', value: 236 },
];

/** 区域分布柱状图 */
export const regionDistData = [
  { region: '华北', value: 420 },
  { region: '华东', value: 680 },
  { region: '华南', value: 350 },
  { region: '西南', value: 280 },
  { region: '西北', value: 120 },
  { region: '东北', value: 180 },
  { region: '华中', value: 320 },
];

/** 城市等级占比 */
export const cityLevelData = [
  { level: '一线城市', value: 30.03 },
  { level: '新一线城市', value: 20.03 },
  { level: '二线城市', value: 16.03 },
  { level: '三线城市', value: 14.03 },
  { level: '四线城市', value: 12.03 },
  { level: '五线城市', value: 8.03 },
];

/** 近7日交易趋势 */
export const tradeTrendData = [
  { date: '03-09', value: 68200 },
  { date: '03-10', value: 72500 },
  { date: '03-11', value: 65800 },
  { date: '03-12', value: 78900 },
  { date: '03-13', value: 82100 },
  { date: '03-14', value: 76400 },
  { date: '03-15', value: 79300 },
];

/* ═══════════════════════════════════════════════
   8. 进度数据（目标管理看板 / 子目标进度）
   ═══════════════════════════════════════════════ */

export interface GoalProgress {
  name: string;
  actual: number;
  target: number;
  unit: string;
}

export const goalProgressData: GoalProgress[] = [
  { name: '销售额目标', actual: 856, target: 1000, unit: '万' },
  { name: '新客获取', actual: 12800, target: 15000, unit: '人' },
  { name: '复购率', actual: 38, target: 45, unit: '%' },
  { name: '客户满意度', actual: 92, target: 95, unit: '%' },
  { name: '成本控制', actual: 280, target: 300, unit: '万' },
];

/** 年度开店目标 */
export const annualTarget = { actual: 2280, target: 3000 };

/** 开店进度（分公司堆叠） */
export const expandProgress = [
  { branch: '华北分公司', phases: [12, 20, 28, 14, 6] },
  { branch: '华南分公司', phases: [29, 16, 11, 18, 12] },
  { branch: '西南分公司', phases: [24, 17, 11, 20, 8] },
  { branch: '东南分公司', phases: [42, 18, 9, 5, 6] },
];
export const phaseLabels = ['待勘查', '勘查中', '审批中', '已通过', '已开门店'];
export const phaseColors = getChartCategoricalPalette(5);  /* --chart-1 ~ --chart-5：主题色/绿/橙/蓝绿/紫 */

/* ═══════════════════════════════════════════════
   9. 筛选器选项（通用复用）
   ═══════════════════════════════════════════════ */

export const timeOptions = [
  { label: '今年', value: 'year' },
  { label: '上年', value: 'last' },
  { label: '近3个月', value: '3m' },
  { label: '近6个月', value: '6m' },
];

export const regionOptions = [
  { label: '全国', value: '' },
  { label: '华北区', value: 'huabei' },
  { label: '华东区', value: 'huadong' },
  { label: '华南区', value: 'huanan' },
  { label: '西南区', value: 'xinan' },
  { label: '东南区', value: 'dongnan' },
];

/* ═══════════════════════════════════════════════
   10. 状态颜色映射 (Tag type)
   ═══════════════════════════════════════════════ */

export const staffStatusColorMap: Record<string, string> = {
  '在职': 'success',
  '离职': 'danger',
  '休假': 'warning',
};

export const goalStatusColorMap: Record<string, string> = {
  '已达成': 'success',
  '进行中': 'info',
  '落后': 'warning',
  '严重落后': 'danger',
};

export const categoryStatusColorMap: Record<string, string> = {
  '已上线': 'success',
  '已下线': 'danger',
  '待审核': 'warning',
};

export const transactionStatusColorMap: Record<string, string> = {
  '成功': 'success',
  '已退款': 'warning',
  '处理中': 'info',
};
