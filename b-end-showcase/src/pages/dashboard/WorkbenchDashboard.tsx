import { Button, Card, Carousel, Radio, Row, Col, Select, Tag, Table, Tabs } from '@ss/mtd-react3';
import { BarChart3, CheckSquare, ClipboardList, FileSpreadsheet, ShoppingCart, Wallet, TrendingUp, Settings } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import ModuleWrapper from '../../components/ModuleWrapper';
import ShortcutGrid from '../../components/ShortcutGrid';
import { g4Variants } from '../../components/G4DataTable';

/* ─── 数据 ─── */

const shortcutItems = [
  { icon: <BarChart3 size={20} color="#9CA3AF" />, color: '#F3F4F6', label: '实时数据' },
  { icon: <CheckSquare size={20} color="#9CA3AF" />, color: '#F3F4F6', label: '任务中心' },
  { icon: <ClipboardList size={20} color="#9CA3AF" />, color: '#F3F4F6', label: '订单列表' },
  { icon: <FileSpreadsheet size={20} color="#9CA3AF" />, color: '#F3F4F6', label: '报表导出' },
  { icon: <ShoppingCart size={20} color="#9CA3AF" />, color: '#F3F4F6', label: '商品管理' },
  { icon: <Wallet size={20} color="#9CA3AF" />, color: '#F3F4F6', label: '财务看板' },
  { icon: <TrendingUp size={20} color="#9CA3AF" />, color: '#F3F4F6', label: '增长分析' },
  { icon: <Settings size={20} color="#9CA3AF" />, color: '#F3F4F6', label: '系统设置' },
];

const metrics = [
  { label: '待处理任务', value: '12', change: '+3', trend: 'up' },
  { label: '本周完成', value: '28', change: '+5', trend: 'up' },
  { label: '团队在线', value: '18', change: '', trend: 'up' },
  { label: '系统告警', value: '2', change: '-1', trend: 'down' },
];

const actionCards = [
  { title: '高价值用户召回', desc: '30天未下单的高消费用户，发送专属优惠券可提升转化', effect: '预计提升 GMV +¥28万', btn: '创建活动' },
  { title: '新客首单激励', desc: '注册7天内未下单用户，推送限时折扣可加速首单转化', effect: '预计转化 +2,300单', btn: '配置策略' },
  { title: '午间时段补贴', desc: '11:00-13:00时段订单下降明显，定向补贴可拉升峰值', effect: '预计提升 订单 +12%', btn: '开启补贴' },
];

const todoData = [
  { key: '1', task: '审批 618 活动预算', assignee: '张三', deadline: '2024-03-15', priority: '高', status: '待处理' },
  { key: '2', task: '商品上架审核（12件）', assignee: '李四', deadline: '2024-03-14', priority: '中', status: '待处理' },
  { key: '3', task: '客诉工单跟进', assignee: '王五', deadline: '2024-03-14', priority: '高', status: '进行中' },
  { key: '4', task: '周报提交', assignee: '赵六', deadline: '2024-03-15', priority: '低', status: '待处理' },
];

// 带图片变体的商品数据
const productData = [
  { key: '1', img: 'https://picsum.photos/seed/p1/40/40', name: '经典美式咖啡', category: '饮品', price: '¥18.00', sales: '2,368', status: '在售' },
  { key: '2', img: 'https://picsum.photos/seed/p2/40/40', name: '奶油芝士蛋糕', category: '甜品', price: '¥32.00', sales: '1,205', status: '在售' },
  { key: '3', img: 'https://picsum.photos/seed/p3/40/40', name: '抹茶拿铁', category: '饮品', price: '¥22.00', sales: '986', status: '售罄' },
  { key: '4', img: 'https://picsum.photos/seed/p4/40/40', name: '牛油果沙拉', category: '轻食', price: '¥28.00', sales: '756', status: '在售' },
];

const productColumns = [
  {
    label: '商品',
    dataKey: 'name',
    width: 180,
    render: (_val: string, row: typeof productData[0]) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={row.img} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: '#f5f5f5' }} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 'var(--fs-14)' }}>{row.name}</div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{row.category}</div>
        </div>
      </div>
    ),
  },
  { label: '单价', dataKey: 'price', width: 100 },
  { label: '销量', dataKey: 'sales', width: 100 },
  { label: '状态', dataKey: 'status', width: 100, render: (val: string) => <Tag theme={val === '在售' ? 'blue' : 'orange'} size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 100, render: () => <Button.Link type="primary" shape="text">编辑</Button.Link> },
];

/* Tag 颜色策略：默认蓝色，仅用蓝/橙两种，不使用红色 */
const priorityThemeMap: Record<string, string> = {
'高': 'orange',
'中': 'blue',
'低': 'blue',
};

const statusThemeMap: Record<string, string> = {
  '待处理': 'orange',
  '进行中': 'blue',
};

const todoColumns = [
  { label: '任务', dataKey: 'task', width: 200 },
  { label: '负责人', dataKey: 'assignee', width: 100 },
  { label: '截止日期', dataKey: 'deadline', width: 120 },
  { label: '优先级', dataKey: 'priority', width: 100, render: (val: string) => <Tag theme={priorityThemeMap[val] || 'blue'} size="small">{val}</Tag> },
  { label: '状态', dataKey: 'status', width: 100, render: (val: string) => <Tag theme={statusThemeMap[val] || 'blue'} size="small">{val}</Tag> },
  { label: '操作', dataKey: 'action', width: 100, render: () => <Button.Link type="primary" shape="text">处理</Button.Link> },
];

/* ─── 主页面（主-侧分栏布局示意） ─── */

export default function WorkbenchDashboard() {
  return (
    <PageLayout title="工作台（主-侧分栏）">
      {/* 整体左右分栏布局 */}
      <div style={{ display: 'flex', gap: 'var(--gap-module)', alignItems: 'flex-start' }}>

        {/* ═══ 左侧主内容区 ═══ */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--gap-module)' }}>

          {/* W-1 欢迎栏 */}
          <ModuleWrapper
            moduleId="W-1 欢迎栏"
            tooltipPlacement="bottom"
            variants={[
              {
                name: '文字欢迎',
                render: () => (
                  <Card style={{ marginBottom: 0, background: 'linear-gradient(135deg, var(--color-primary-4), var(--color-primary-4) 60%, var(--bg-page, #F5F6F7))', padding: '32px 28px 28px 32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <h2 style={{ fontSize: 'var(--fs-24)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-1)', margin: 0 }}>
                        早上好，张经理
                      </h2>
                      <span style={{ fontSize: 'var(--fs-14)', color: 'var(--text-3)' }}>
                        今日有 12 项待办任务，2 条系统告警需处理
                      </span>
                      <Button type="primary" size="small" style={{ alignSelf: 'flex-start' }}>去处理</Button>
                    </div>
                  </Card>
                ),
              },
              {
                name: '轮播图',
                render: () => (
                  <div style={{ borderRadius: 'var(--radius-container, 12px)', overflow: 'hidden' }}>
                    <Carousel style={{ width: '100%' }} autoplay={true} arrow="hover">
                      {[
                        { title: '618 大促活动即将开始', desc: '全品类满减优惠，点击查看活动详情' },
                        { title: '新版商品管理已上线', desc: '支持批量编辑、智能分类等新功能' },
                        { title: 'Q2 运营目标已更新', desc: '点击查看各区域目标分解详情' },
                      ].map((item, idx) => (
                        <div key={idx} style={{ height: 160, background: 'linear-gradient(135deg, var(--color-primary-4), var(--color-primary-1))', display: 'flex', alignItems: 'center', padding: '0 32px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <span style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-1)' }}>{item.title}</span>
                            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{item.desc}</span>
                          </div>
                          <div style={{ marginLeft: 'auto', width: 120, height: 100, borderRadius: 8, background: 'var(--color-primary-4)', flexShrink: 0 }} />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                ),
              },
            ]}
          />

          {/* W-2 操作引导卡 — Row type="flex" 等高 */}
          <ModuleWrapper moduleId="W-2 操作引导卡">
            <Row gutter={8} type="flex">
              {actionCards.map((card) => (
                <Col span={8} key={card.title}>
                  <Card style={{ marginBottom: 0, height: '100%' }} header={<span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{card.title}</span>}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
                      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', flex: 1, lineHeight: 1.5 }}>{card.desc}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--color-heading-accent)' }}>{card.effect}</span>
                        <Button type="primary" size="small">{card.btn}</Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </ModuleWrapper>

          {/* W-3 常用功能 */}
          <ModuleWrapper moduleId="W-3 常用功能/快捷入口网格">
            <ShortcutGrid items={shortcutItems} />
          </ModuleWrapper>

          {/* W-7 常用工具 */}
          <ModuleWrapper moduleId="W-7 常用工具">
            <div className="dash-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 'var(--fs-16, 16px)', fontWeight: 'var(--fw-medium, 500)', color: 'var(--text-1, #111929)' }}>常用工具</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { title: '折扣活动', desc: '指定商品折扣价' },
                  { title: '超值单品', desc: '任选1件享低价' },
                  { title: 'X件优惠', desc: '多件折扣或立减' },
                  { title: '商家券', desc: '满额立减优惠券' },
                  { title: '新客立减', desc: '新客首单立减' },
                  { title: '店铺满减', desc: '全店满额减' },
                ].map((tool) => (
                  <div
                    key={tool.title}
                    style={{
                      border: '1px solid var(--border-color, #E5E7EB)',
                      borderRadius: 'var(--radius-elem, 8px)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F3F4F6', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', color: 'var(--text-1)' }}>{tool.title}</div>
                          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', marginTop: 2 }}>{tool.desc}</div>
                        </div>
                      </div>
                      <Button size="small">立即创建</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ModuleWrapper>

          {/* Dashboard-1 指标卡片组 — 支持 3 种变体切换（工作台默认带迷你图） */}
          <ModuleWrapper
            moduleId="D-1 指标卡片组"
            defaultVariant={1}
            variants={[
              {
                name: '纯大数字',
                render: () => (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                    {metrics.map((m) => (
                      <Card key={m.label} style={{ marginBottom: 0 }}>
                        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{m.label}</span>
                        <div style={{ margin: '8px 0 4px' }}>
                          <span style={{ fontSize: 'var(--fs-30)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
                        </div>
                        {m.change && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 'var(--fs-12)', fontWeight: 500, color: m.trend === 'up' ? '#00A854' : '#FF1F1F' }}>
                              {m.trend === 'up' ? '↑' : '↓'} {m.change}
                            </span>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ),
              },
              {
                name: '带迷你图',
                render: () => (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                    {metrics.map((m) => (
                      <Card key={m.label} style={{ marginBottom: 0 }}>
                        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{m.label}</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '8px 0 4px' }}>
                          <span style={{ fontSize: 'var(--fs-30)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
                          {m.change && (
                            <span style={{ fontSize: 'var(--fs-12)', fontWeight: 500, color: m.trend === 'up' ? '#00A854' : '#FF1F1F' }}>
                              {m.trend === 'up' ? '↑' : '↓'} {m.change}
                            </span>
                          )}
                        </div>
                        <svg width="100%" height="24" viewBox="0 0 120 24" preserveAspectRatio="none" style={{ display: 'block', marginTop: 4 }}>
                          <polygon
                            points={m.trend === 'up' ? '0,20 24,16 48,12 72,8 96,5 120,2 120,24 0,24' : '0,2 24,6 48,12 72,16 96,19 120,22 120,24 0,24'}
                            fill={m.trend === 'up' ? 'rgba(0,168,84,0.12)' : 'rgba(245,72,59,0.12)'}
                            stroke="none"
                          />
                          <polyline
                            points={m.trend === 'up' ? '0,20 24,16 48,12 72,8 96,5 120,2' : '0,2 24,6 48,12 72,16 96,19 120,22'}
                            fill="none"
                            stroke={m.trend === 'up' ? '#00A854' : '#FF1F1F'}
                            strokeWidth="1.5"
                          />
                        </svg>
                      </Card>
                    ))}
                  </div>
                ),
              },
              {
                name: '带操作',
                render: () => (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                    {metrics.map((m) => (
                      <Card key={m.label} style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{m.label}</span>
                          <Button.Link type="primary" shape="text" style={{ padding: 0, height: 'auto', fontSize: 'var(--fs-12)' }}>查看</Button.Link>
                        </div>
                        <div style={{ margin: '8px 0 4px' }}>
                          <span style={{ fontSize: 'var(--fs-30)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
                        </div>
                        {m.change && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 'var(--fs-12)', fontWeight: 500, color: m.trend === 'up' ? '#00A854' : '#FF1F1F' }}>
                              {m.trend === 'up' ? '↑' : '↓'} {m.change}
                            </span>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ),
              },
            ]}
          />

          {/* G-4 数据表格 — 支持变体切换 */}
          <ModuleWrapper moduleId="G-4 数据表格" variants={g4Variants} />
        </div>

        {/* ═══ 右侧边栏（固定宽度，sticky 跟随） ═══ */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--gap-module)', position: 'sticky', top: 16 }}>
          {/* W-4 个人信息 */}
          <ModuleWrapper moduleId="W-4 今日待办">
            <Card style={{ marginBottom: 0 }} header={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}><span>今日待办</span><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)', cursor: 'pointer' }}>更多</span></div>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '待审批工单', count: '3 项', color: '#FF7700', btn: '去审批' },  /* Orange-5 */
                  { label: '待处理工单', count: '5 项', color: 'var(--text-1)', btn: '去处理' },
                  { label: '待回复咨询', count: '2 项', color: 'var(--text-1)', btn: '去回复' },
                  { label: '本周目标', count: '85.6%', color: 'var(--color-green)', btn: '查看' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-3)' }}>{item.label}<span style={{ fontSize: 'var(--fs-13)', fontWeight: 600, color: item.color, marginLeft: 6 }}>{item.count}</span></span>
                    <Button type="outline" size="small" style={{ minWidth: 64 }}>{item.btn}</Button>
                  </div>
                ))}
              </div>
            </Card>
          </ModuleWrapper>

          {/* W-5 公告通知 */}
          <ModuleWrapper
            moduleId="W-5 公告通知"
            variants={[
              {
                name: '日期前缀',
                render: () => (
                  <Card style={{ marginBottom: 0 }} header="最新公告">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { date: '03-15', text: '618 大促方案已发布，请各区域确认' },
                        { date: '03-14', text: '新版商品审核流程上线通知' },
                        { date: '03-13', text: 'Q1 复盘会议安排：周五下午 2:00' },
                      ].map((item) => (
                        <div key={item.date} style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span style={{ color: 'var(--text-3)', marginRight: 8 }}>{item.date}</span>
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </Card>
                ),
              },
              {
                name: '标签前缀',
                render: () => (
                  <Card style={{ marginBottom: 0 }} header="最新公告">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { tag: '活动', tagColor: 'blue', text: '618 大促方案已发布，请各区域确认' },
                        { tag: '系统', tagColor: 'green', text: '新版商品审核流程上线通知' },
                        { tag: '会议', tagColor: 'orange', text: 'Q1 复盘会议安排：周五下午 2:00' },
                      ].map((item) => (
                        <div key={item.text} style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Tag theme={item.tagColor} size="small">{item.tag}</Tag>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ),
              },
            ]}
          />

          {/* W-6 最新动态 */}
          <ModuleWrapper moduleId="W-6 最新动态">
            <Card style={{ marginBottom: 0 }} header="最新动态">
              <div style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Carousel style={{ width: '100%' }} autoplay={true} arrow="never">
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ height: 120, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'var(--fs-12)', color: '#9CA3AF' }}>动态 {i}</span>
                    </div>
                  ))}
                </Carousel>
              </div>
            </Card>
          </ModuleWrapper>
        </div>
      </div>
    </PageLayout>
  );
}
