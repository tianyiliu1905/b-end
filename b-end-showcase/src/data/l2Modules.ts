/**
 * L2 模块索引数据（用于「模块」入口页 / 模块详情页展示）
 *
 * 数据来源：b-end-page skill 的
 *   - references/L2-modules/index.json（G-导航 / D-图表卡片 / W-工作台）
 *   - references/INDEX-form-detail.md（FD / Form / Detail 表单详情共用模块）
 *
 * 这里只保留展示所需的摘要字段（name/category/description/triggers/l3Roles/variants），
 * 不包含实现细节，供纯前端文档式浏览使用。
 */

export interface L2Module {
  id: string;
  name: string;
  category: string;
  description: string;
  triggers?: string[];
  l3Roles?: string[];
  variants?: string[] | Record<string, string>;
  notes?: string;
}

export const L2_MODULES: L2Module[] = [
  // ===== G-导航 =====
  {
    id: 'G-1+G-2',
    name: '顶导+侧导 Layout',
    category: 'G-导航',
    description: '顶导(G-1)+侧导(G-2)一体化模板。顶导三段式布局(Logo+Tabs+操作区)，侧导多级 Menu 可折叠。直接复制使用，只替换 navGroups 数据。',
    triggers: ['所有页面默认带', '顶导', '顶部导航', '导航栏', 'header', 'TopNav', '侧导', '侧边栏', '左侧导航', '菜单', 'SideNav', 'Layout'],
    l3Roles: ['Tabs', 'Tabs.TabPane', 'Menu', 'Menu.SubMenu', 'Menu.Item', 'Icon', 'Button'],
    notes: '一级菜单必带 icon(-o 线性)，折叠用 MTD Button 驱动 inlineCollapsed',
  },
  {
    id: 'G-3',
    name: '看板筛选器栏 (Dashboard Filter Bar)',
    category: 'G-导航',
    description: '页面顶部的全局筛选条，控制整页数据维度，简单档/复杂档两种档位。看板页和列表页统一使用此编号。',
    triggers: ['看板筛选', '看板顶部筛选', '时间范围', '维度筛选', '看板 filter', '筛选', '过滤', '查询条件', '时间选择', 'filter', '搜索条件'],
    l3Roles: ['日期选择器', '下拉选择', '输入框', '开关', '按钮'],
    variants: { 简单版: '单行筛选栏（≤5个维度）', 复杂版: '多行分组筛选器（>5维度/需分组/需保存方案）' },
  },
  {
    id: 'G-4',
    name: '数据表格 (Data Table)',
    category: 'G-导航',
    description: '通用数据表格（含操作栏+分页器一体），所有表格类需求一律收敛到此，差异用 columns/props 配置实现。',
    triggers: ['表格', '列表', 'table', '管理列表', '数据表', '明细', '排名', '操作栏', '分页'],
    l3Roles: ['表格', '标签', '按钮', '空态', '加载态', '分页器'],
    variants: ['纯文字表格', '带图片列', '带切换tab'],
  },
  {
    id: 'G-6',
    name: '分类导航 (Category Tree Nav)',
    category: 'G-导航',
    description: '左侧固定宽度面板：搜索框 + 树形分类结构 + 附加筛选项，点击树节点联动右侧表格/内容区数据，常见于「左树右表」类列表页。',
    triggers: ['分类导航', '树形导航', '分类树', '左树', '左树右表', '组织架构树', '树形层级', '目录树'],
    l3Roles: ['Input（树搜索）', 'Tree / mtd-tree', 'Select（附加筛选）', 'Button（新增节点）'],
    notes: '固定宽度 240px 左右，白底 dash-card；与右侧内容区之间用 --gap-module 做外部间距；树节点选中态联动右侧数据刷新，详见 L1-templates/page-列表页装配逻辑.md §7.2',
  },

  // ===== D-图表卡片 =====
  { id: 'D-1', name: '指标卡片组 (Metric Cards)', category: 'D-图表卡片', description: '横向排列的多张指标卡，每卡一个核心数字 + 同环比涨跌色标，可选迷你环图。', triggers: ['概览', '大盘', '总览', '核心指标', 'KPI卡片', '指标卡'], l3Roles: ['栅格', '卡片', '数值展示', '标签', '图标', 'AntV G2 mini donut'], variants: ['纯大数字', '带迷你图', '带操作'] },
  { id: 'D-2', name: '进度展示 (Progress)', category: 'D-图表卡片', description: '「D-2 环形进度」(单一环形/gauge+数字) 与「D-2 进度指标」(多指标迷你环卡片组)两个子模块。', triggers: ['目标', '进度', '完成率', '预算', '达成率', '年度目标', '进度指标'], l3Roles: ['卡片', '数值展示', 'AntV G2 interval+theta'], variants: ['操作型', '筛选型', '筛选（复杂）', '描述型', '纯净型'], notes: '两个子模块各自独立维护同一套 5 型头部变体，render 逻辑互不共享' },
  { id: 'D-3', name: '折线图/面积图（趋势）', category: 'D-图表卡片', description: '「D-3 折线图」与「D-3 面积图」两个独立实现，各自维护一套头部变体。', triggers: ['趋势', '走势', '同比环比', '时间序列', '折线图', '面积图'], l3Roles: ['卡片', '单选按钮组', '标签页', '下拉选择', 'AntV G2 line/area'], variants: ['操作型', '筛选型', '筛选（复杂）', '描述型', '纯净型'], notes: '折线图 5 型齐全；面积图无「描述型」' },
  { id: 'D-4', name: '柱状图 (Bar Chart)', category: 'D-图表卡片', description: '竖向柱状图，表达分类维度上的数值分布/对比；分组柱/横向分组柱为其变体。', triggers: ['分类对比', '区域分布', '达成率', '数量分布', '柱状图', '分组柱'], l3Roles: ['卡片', '单选按钮组', '下拉选择', 'AntV G2 interval(+dodgeX/transpose)'], variants: ['筛选型', '筛选（复杂）', '操作型', '纯净型'] },
  { id: 'D-5', name: '双轴组合图 (Combo Chart)', category: 'D-图表卡片', description: '柱+线双轴组合，表达两个量纲不同但相关的指标（如存量+增量）。', triggers: ['双指标关联', '存量增量对比', '双轴', '组合图'], l3Roles: ['卡片', '单选按钮组', '下拉选择', 'AntV G2 view(interval+line)'], variants: ['筛选型', '筛选（复杂）', '操作型', '描述型', '纯净型'] },
  { id: 'D-6', name: '漏斗图 (Funnel)', category: 'D-图表卡片', description: '逐层递减的转化/流失链路：曝光→点击→加购→下单→支付。', triggers: ['漏斗', '转化', '流失', '链路', '转化率'], variants: ['描述型', '筛选型', '筛选（复杂）', '操作型', '纯净型'] },
  { id: 'D-7', name: '饼/环图 (Pie/Donut)', category: 'D-图表卡片', description: '占比构成展示，适合类目/渠道等维度的构成分析。', triggers: ['占比', '构成', '分布占比', '饼图', '环图'], variants: ['操作型', '筛选型', '筛选（复杂）', '描述型', '纯净型'] },
  { id: 'D-8', name: '堆叠进度条 (Stacked Progress)', category: 'D-图表卡片', description: '横向堆叠条，表达多分段构成的整体进度或占比。', triggers: ['堆叠', '分段进度', '构成占比条'], variants: ['筛选型', '筛选（复杂）', '操作型', '描述型', '纯净型'], notes: '⚠️ 非 G2 图表，纯手工 flex/div 实现，不接入 useG2Chart/ChartCard；但头部仍复用 5 型变体命名' },
  { id: 'D-9', name: '排名条形图 (Ranking Bar)', category: 'D-图表卡片', description: '横向条形排名，用于 Top N 列表类展示。', triggers: ['排名', 'TopN', '排行榜', '条形图'], variants: ['筛选型', '筛选（复杂）', '操作型', '纯净型'] },
  { id: 'D-10', name: '散点图 (Scatter)', category: 'D-图表卡片', description: '双维度数值分布，用于相关性/象限分析。', triggers: ['散点', '相关性', '象限分析'], variants: ['操作型', '筛选型', '筛选（复杂）', '描述型', '纯净型'] },
  { id: 'D-11', name: 'AI摘要卡 (AI Summary)', category: 'D-图表卡片', description: '顶部 AI 诊断摘要卡，先给结论再看数据细节。', triggers: ['AI总结', 'AI诊断', '摘要卡', '智能总结'], variants: { 列表型: 'DigestCard variant="list"，多条摘要纵向列表展示', 卡片型: 'DigestCard variant="cards"，多条摘要拆成独立小卡片横排' }, notes: '与 D-2~D-15 的 5 型头部变体是不同的独立变体体系，专属 DigestCard 组件' },
  { id: 'D-12', name: '雷达图 (Radar)', category: 'D-图表卡片', description: '多维度能力/指标对比。', triggers: ['雷达图', '多维对比', '能力模型'], variants: ['纯净型', '操作型', '筛选型', '筛选（复杂）'] },
  { id: 'D-13', name: '仪表盘 (Gauge)', category: 'D-图表卡片', description: '单一指标的区间型进度展示（如健康度、达成度）。', triggers: ['仪表盘', 'gauge', '健康度'], variants: ['纯净型', '筛选型', '筛选（复杂）', '操作型', '描述型'] },
  { id: 'D-14', name: '热力图 (Heatmap)', category: 'D-图表卡片', description: '双维度矩阵密度展示，如时段×星期活跃度。', triggers: ['热力图', '活跃度矩阵'], variants: ['操作型', '筛选型', '筛选（复杂）', '描述型', '纯净型'] },
  { id: 'D-15', name: '玫瑰图 (Rose Chart)', category: 'D-图表卡片', description: '环形分类占比展示，饼图变体。', triggers: ['玫瑰图', '南丁格尔图'], variants: ['纯净型', '筛选型', '筛选（复杂）', '操作型'] },

  // ===== W-工作台 =====
  { id: 'W-1', name: '欢迎栏 (Welcome Banner)', category: 'W-工作台', description: '工作台顶部欢迎信息+关键提示条。', triggers: ['欢迎栏', '问候语', '工作台头部'], variants: { 文字欢迎: '渐变背景卡片，问候语+今日概述+一个主操作按钮', 轮播图: 'Carousel 轮播多张运营/公告卡片，自动播放+hover箭头' } },
  { id: 'W-2', name: '操作引导卡 (Guide Card)', category: 'W-工作台', description: '待办/引导类卡片，提示用户下一步操作。', triggers: ['引导卡', '待办提醒', '操作指引'] },
  { id: 'W-3', name: '快捷入口 (Shortcut Grid)', category: 'W-工作台', description: '宫格式功能快捷入口，偏门户/导航型工作台常用。', triggers: ['快捷入口', '功能宫格', '常用功能'] },
  { id: 'W-4', name: '个人信息 (Profile Card)', category: 'W-工作台', description: '工作台内个人信息小卡片。', triggers: ['个人信息', '我的', '账号卡片'] },
  { id: 'W-5', name: '公告通知 (Announcement)', category: 'W-工作台', description: '公告/通知列表卡片。', triggers: ['公告', '通知', '消息列表'], variants: { 日期前缀: '每行以「MM-DD」日期作为前缀标签，纯文字弱化时间感', 标签前缀: '每行以彩色 Tag（活动/系统/会议等分类）作为前缀，强调类型区分' } },
  { id: 'W-6', name: '工作台指标区', category: 'W-工作台', description: '工作台内轻量指标展示，通常与快捷入口组合。', triggers: ['工作台指标', '轻量指标'] },
  { id: 'W-7', name: '工作台待办列表', category: 'W-工作台', description: '任务/待办类明细列表，工作台专属。', triggers: ['待办列表', '任务列表'] },

  // ===== 表单+详情 共用/专属（来自 INDEX-form-detail.md） =====
  { id: 'FD1', name: '承载容器 (Presentation Container)', category: '表单+详情', description: '页面对外用多大外壳：表单页（顺序/步骤/主从/抽屉/弹窗）、详情页（落地页/抽屉），含容器尺寸、标题区、蒙层层级和操作栏。', triggers: ['落地页', '步骤落地页', '分步', '向导', '主从', '抽屉', '弹窗', 'Drawer', 'Dialog', 'Modal'], notes: '表单+详情共用；弹窗仅开放给表单页，详情页不用主从和弹窗分支' },
  { id: 'FD2', name: '表头信息区 (Page Header)', category: '表单+详情', description: '页面标题+描述+面包屑/返回/anchor/状态标签/摘要信息行，由多个可选原子自由组合。', triggers: ['标题', '页面描述', '面包屑', '返回上一级', '状态标签', '审核中', '已通过', '已驳回', '空间切换', '多空间', '摘要信息', '锚点', '锚点导航', 'anchor'], notes: '状态标签、摘要信息行原子主要服务详情页；锚点导航用于分组数 > 3 的长表单/详情页，紧贴表头底部（MTD Anchor，direction="horizontal"）', variants: { '面包屑+标题+公告': '有路径层级且需全局通知的页面（Announcement 提醒条）', '返回+标题+状态': '详情页最常见形态，返回图标+标题+状态标签', '详情+摘要信息行': '详情页信息密度较高时的最常见形态，含摘要信息行 Grid 对齐布局', '面包屑+标题+锚点导航': '分组数较多（>3）的长表单，需要快速跳转到指定分组，Anchor 吸顶紧贴表头', '空间切换器+标题': '多业务空间切换场景，空间切换器位于 page-header 之上' } },
  { id: 'FD3', name: '只读数据表格 (Readonly Table)', category: '表单+详情', description: '在表单页/详情页中展示关联的只读数据列表，不可编辑。无新增/删除行按钮，无行内编辑控件，列内容全部为纯文本或 Tag/链接等只读元素。所有只读表格类需求一律收敛到 FD3，差异用 columns 配置实现。', triggers: ['关联数据', '只读列表', '合同列表', '明细表', '记录表', '日志表', '排名列表', '操作记录', '变更记录', '图文列表', '商品关联', '门店关联', '明细', '明细数据', '费用明细', '运力明细'], notes: '至少保留一列不设 width（弹性列撑满余宽）；状态列用 Tag + theme 映射；操作列最多一个"查看"纯文字链接；固定列需三件套：fixed + useSticky + scroll.x；MTD Table bordered 接受 "row"/"cell"/"none"，不接受 false；分页通过 Table 的 pagination prop 传入 PaginationProps 对象', variants: { '基础信息表': '文字 + 状态 Tag + 查看链接 + 分页，适用于关联记录、合同列表等', '图文信息表': '缩略图 + 主副文字 + 状态 Tag，适用于商品关联、门店关联等带图场景', '明细数据表（固定列）': '数值 + 涨跌色 + 左右固定列（useSticky + scroll.x），适用于费用明细、运力明细等数值对比场景' } },
  { id: 'Form1', name: '操作栏 (Action Bar)', category: '表单专属', description: '承载提交/保存/取消等动作的按钮区，是白卡内 flex column 的末尾固定子项（flex-shrink: 0），不随内容滚动。任何表单页默认包含「基础布局+操作栏」。', triggers: ['提交', '保存', '取消', '操作', '编辑', '审批按钮', '删除', '危险操作', '上一步', '下一步'], notes: '主操作按钮最多1个；按钮总数不超过4个；不使用 position: fixed/sticky，统一 flex 布局固定底部', variants: { '顺序表单操作栏': '[取消][提交]，一次提交的普通表单', '分步表单操作栏': '按钮随步骤动态变化：第一步仅"下一步"，中间步骤"上一步+下一步"，最后一步"上一步+提交"', '抽屉/弹窗操作栏': '[取消][确定]，面板内底部固定，用于 Drawer/Dialog 内的编辑表单', '带危险操作': '[删除][取消][保存]，含红色危险按钮，用于需要删除等破坏性操作的编辑表单' } },
  { id: 'Form2', name: '分组分段 (Group Section)', category: '表单专属', description: '内容按业务含义分块展示，支持基础分组、折叠分组、分步分组三种呈现方式。', triggers: ['分组', '多个区域', '分几块填/展示', '折叠', '展开收起', '分步填写'], variants: { '基础分组': '多组纵向铺开展示，字段数中等到较多、无需收起', '折叠分组': '可展开/收起，分组较多或部分分组低频使用', '分步分组': '拆成多步依次填写，流程性强、需要分步引导' } },
  { id: 'Form3', name: '基础布局 (Base Layout)', category: '表单专属', description: '表单最小成立单元，所有字段在基础布局内纵向排列，是任何表单页默认包含的承载底座（不预设列数，支持单列/双列/三列/混合）。由两个正交参数决定：①表单区宽度（半宽留白/全宽拉通）× ②栏内列数（单列/双列/三列/混合列）。另支持标签顶部和紧凑模式。', triggers: ['基础布局', '单栏布局', '表单', '字段', '录入', '填写', '单列', '双列', '三列', '混合列', '半宽', '全宽', '标签顶部', '紧凑模式', '弹窗表单', '抽屉表单'], variants: { '①半宽留白+②单列（默认）': '外层 Col span=12 限宽，字段 span=24 单列，右侧留白 —— 顺序落地页标准形态', '①全宽拉通+②单列': '省略外层 Row/Col，表单撑满内容区 —— 内容区较窄或明确要全宽时', '②双列（span=12）': '一行两个字段并排，字段较多（≥6）且标签长度接近、控件较窄时', '②三列（span=8）': '一行三个字段，标签短、控件小的密集属性录入场景', '标签顶部（labelPosition=top）': '标签在控件上方，标签较长或移动端场景', '紧凑模式（弹窗/抽屉）': '行间距 12px、labelWidth 缩减，弹窗或抽屉等空间受限容器' } },
  { id: 'Form4', name: '步骤条 (Step Bar)', category: '表单专属', description: '分步表单/分步落地页顶部的步骤导航条（MTD Steps），标示当前处于流程第几步，状态由 active 自动推导为已完成/进行中/未开始，仅在选择步骤落地页后加载。', triggers: ['分步', '分几步', '向导', '流程', '注册', '认证', '入驻', '步骤条', '步骤导航'], notes: '步骤条不可点击跳转（不设 onChange，不用 navigation 类型）；仅当前步骤校验失败时才手动传 status="error"；步骤数建议 2-5 步；点状变体不与 size="small" 同时使用', variants: { '标准横向': '仅 title，默认形态，适用于绝大多数分步表单', '带描述': 'title + description，需要在标题下补充说明当前步骤内容', '点状': 'dot 简洁圆点，步骤数较多（4-5步）或标题过长时使用' } },
  { id: 'Form5', name: '行内编辑明细表格 (Editable Table)', category: '表单专属', description: '多条明细的增删行、列表录入。', triggers: ['多条明细', '增删行', '列表录入'] },
  { id: 'Form6', name: '复选组 (Checkbox Group)', category: '表单专属', description: '以横排、分组网格或表格等形式做多选、勾选、适用范围设定，候选项为封闭集合。', triggers: ['多选', '勾选', '能力选择', '适用范围', '矩阵'], variants: { '基础横排': '无分组，选项约10项以内', '分组多选矩阵': '按业务维度分组，标准形态', '大数据量勾选': 'Table + rowSelection + 搜索，选项超过50-100个' } },
  { id: 'Form7', name: '文件/图片上传 (File Upload)', category: '表单专属', description: '上传附件/图片/证件/凭证等文件的区域，按钮上传、拖拽上传、图片上传三种样式。', triggers: ['上传', '附件', '证件', '图片', '凭证', '拖拽上传'], variants: { '按钮上传': '默认，表单中上传单个或少量附件', '拖拽上传': '480×160 大面积拖拽区域，突出上传操作', '图片上传': '108×108 卡片式网格，展示缩略图预览' } },
  { id: 'Form8', name: '公式编辑器 (Formula Editor)', category: '表单专属', description: '条件组规则编辑器 + 计算公式配置器。', triggers: ['公式', '计算规则', '表达式', '指标定义', '条件组', '条件配置', '筛选规则', '逻辑连接', '且或', '计算公式配置', '预测计算', '公式模板'], variants: { '条件规则型（条件组树/且或逻辑）': '条件组树/范围条件/分层筛选/撑满行，且或逻辑连接', '计算公式配置型（固定文本+变量+运算符）': '固定文本+变量下拉+运算符+checkbox 组合的公式模板' } },
  { id: 'Form9', name: '增删标签组 (Tag Group Editor)', category: '表单专属', description: '管理可增删的动态标签集合，支持分组/无分组、手动输入/下拉选择/只读展示三种交互形态。集合是开放的（可自由输入新值），候选项封闭只能勾选时用 F6 复选组。', triggers: ['增删标签', '标签组', '动态标签', '插件配置', '技术栈选择', '分组标签管理', '排除接口', '环境变量', '标签化配置'], variants: { '分组标签行（标准）': '多分组按类别管理，每组一行 Form.Item，标准形态', '无分组标签（单行）': '只有一组标签、不需要分组的最简形态', '下拉选择标签': '候选项已知且固定、不允许自由输入时，从下拉列表中选择添加', '只读标签展示': '标签仅展示不可编辑，用于详情页或表单的"已选结果回显"' } },
  { id: 'Detail1', name: 'Tab 切换 (Tab Panel)', category: '详情专属', description: '详情页内部用横向 Tab 标签切换查看不同维度的信息面板（如"基本信息/运力明细/审批记录"）。管详情页内部的信息切换，与承载容器（FD1）互不冲突、可叠加。内容互斥用 Tab，内容并列用 Form2 分组分段。', triggers: ['Tab', 'tab', '多维度', '切换查看', '不同面板', '信息面板', '维度切换', '面板切换'], notes: 'Tab 数量建议 2~5 个；TabPane 标题属性是 label（非 title）；推荐受控用法 activeKey+onChange；不要手动覆写 Tab 样式；不要在 Tab 内再嵌套 Tab；弹窗慎用 Tab' },
  { id: 'Detail2', name: '描述列表 (Description List)', category: '详情专属', description: '以「标签 + 值」键值对形式展示只读信息，是详情页最高频的展示模块。基于 Row/Col 24 栅格自建（MTD 无原生 Descriptions 组件）。2/3 列：label 与 value 横向同行排列；4 列：label 在上 value 在下纵向排列，提升密集信息展示空间利用率。同一详情页可混用不同列数。纯只读，不含可编辑控件。', triggers: ['描述列表', '基本信息', '键值对', '字段展示', '只读信息', '详情展示', '信息面板', '属性列表'], variants: { '2列横向（默认）': 'columns=2，span=12，label 宽 96px。字段数 ≤12 个，或值普遍较长（地址/描述/时间戳等）。最常见选择。', '3列横向': 'columns=3，span=8，label 宽 80px。字段数 9~15 个，值长度适中（状态/编码/人名等中短文本）。', '4列纵向（信息密集）': 'columns=4，span=6，label 在上（13px）/ value 在下（14px），flex-direction: column。字段数 ≥8 个且值普遍为短文本（状态/数值/百分比）。', '混用列数': '同一页面内基本信息区用 2 列（值较长），运营指标区用 4 列纵向（值较短）。每个 DescriptionList 实例独立配置 columns。' } },
  { id: 'Detail3', name: '附件预览 (Attachment Preview)', category: '详情专属', description: '以缩略图或文件链接列表形式展示详情页关联的图片、文档等附件，纯只读展示。图片类附件→缩略图网格+点击放大（MTD Image.PreviewGroup）；文件类附件→纯文字蓝色链接横向并排（原生 <a>，无图标，无文件大小）。两类可按需二选一或混用，通常嵌套在 GroupSection 分组内作为最后一类内容。', triggers: ['图片', '附件', '文件预览', '证照附件', '合同附件', '现场照片', '凭证图片', '计划书', '测算表', '文档列表', '上传附件展示'], variants: { '文件链接列表': '纯文字蓝色链接，无图标，无文件大小，横向 flex-wrap 并排。适用于 pdf/xlsx/docx 等文档类附件。', '图片缩略图': '96×96px 缩略图网格，边框 1px，圆角 4px，点击放大（Image.PreviewGroup）。适用于现场照片、凭证图片等。', '图片+文件混合': '图片区在上（缩略图网格）+ 文件链接区在下（纯文字链接），两类附件都有时使用。', '嵌入分组（实际场景）': '附件作为 GroupSection 分组内最后一类字段出现，label="证照附件"，value 区域为横向文件链接列表；演示真实详情页嵌套场景。' } },
];

export const L2_CATEGORIES: string[] = Array.from(new Set(L2_MODULES.map((m) => m.category)));

export function getModulesByCategory(category: string): L2Module[] {
  return L2_MODULES.filter((m) => m.category === category);
}

export function getModuleById(id: string): L2Module | undefined {
  return L2_MODULES.find((m) => m.id === id);
}
