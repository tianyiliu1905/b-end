import { Tag, Row, Col, Button } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';

const ticketInfo = {
  id: 'TK-20240820-0156',
  title: '生产环境 API 响应超时告警',
  status: '处理中',
  priority: '紧急',
  creator: '监控系统',
  assignee: '王五',
  createTime: '2024-08-20 09:15:00',
  category: '性能问题',
  service: 'order-service',
};

const timelineData = [
  { time: '2024-08-20 09:15:00', action: '工单创建', user: '监控系统', desc: 'API /api/order/list P99 响应时间超过 3s，触发告警阈值' },
  { time: '2024-08-20 09:18:32', action: '自动派单', user: '系统', desc: '根据服务归属自动派发给 order-service 值班人王五' },
  { time: '2024-08-20 09:25:00', action: '开始处理', user: '王五', desc: '确认问题，开始排查。初步判断与数据库慢查询有关' },
  { time: '2024-08-20 09:42:00', action: '升级协助', user: '王五', desc: '邀请 DBA 赵六协助排查数据库层面问题' },
  { time: '2024-08-20 10:05:00', action: '定位根因', user: '赵六', desc: '确认是 orders 表缺失索引导致全表扫描，已添加联合索引' },
  { time: '2024-08-20 10:15:00', action: '验证修复', user: '王五', desc: '索引生效后 P99 降至 200ms，持续观察中' },
];

export default function TimelineDetail() {
  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--fs-13)',
    color: 'var(--text-3)',
    marginBottom: 4,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 'var(--fs-14)',
    color: 'var(--text-1)',
    marginBottom: 20,
  };

  return (
    <PageLayout title="流程详情">
      {/* DT-1 详情头部 */}
      <div className="dash-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontSize: 'var(--fs-20)', color: 'var(--text-1)', margin: 0, fontWeight: 600 }}>
                {ticketInfo.title}
              </h2>
              <Tag theme="orange" type="bordered">{ticketInfo.status}</Tag>
              <Tag theme="red" type="bordered">{ticketInfo.priority}</Tag>
            </div>
            <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-3)' }}>
              工单编号：{ticketInfo.id} · 创建于 {ticketInfo.createTime}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--gap-elem)' }}>
            <Button>转派</Button>
            <Button type="primary">关闭工单</Button>
          </div>
        </div>
      </div>

      {/* DT-2 信息分组 */}
      <div className="dash-card">
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          工单信息
        </h3>
        <Row gutter={24}>
          <Col span={6}>
            <div style={labelStyle}>创建人</div>
            <div style={valueStyle}>{ticketInfo.creator}</div>
          </Col>
          <Col span={6}>
            <div style={labelStyle}>当前处理人</div>
            <div style={valueStyle}>{ticketInfo.assignee}</div>
          </Col>
          <Col span={6}>
            <div style={labelStyle}>问题分类</div>
            <div style={valueStyle}>{ticketInfo.category}</div>
          </Col>
          <Col span={6}>
            <div style={labelStyle}>关联服务</div>
            <div style={valueStyle}><Tag>{ticketInfo.service}</Tag></div>
          </Col>
        </Row>
      </div>

      {/* DT-5 时间线 */}
      <div className="dash-card">
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', fontWeight: 600, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          处理流程
        </h3>
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          {/* 竖线 */}
          <div style={{
            position: 'absolute', left: 7, top: 8, bottom: 8,
            width: 2, background: 'var(--line)',
          }} />

          {timelineData.map((item, idx) => (
            <div key={idx} style={{ position: 'relative', marginBottom: idx < timelineData.length - 1 ? 28 : 0 }}>
              {/* 圆点 */}
              <div style={{
                position: 'absolute', left: -20, top: 6,
                width: 12, height: 12, borderRadius: '50%',
                background: idx === timelineData.length - 1 ? 'var(--primary)' : 'var(--bg-3)',
                border: `2px solid ${idx === timelineData.length - 1 ? 'var(--primary)' : 'var(--line)'}`,
              }} />

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: 'var(--fs-14)', color: 'var(--text-1)', fontWeight: 500 }}>
                  {item.action}
                </span>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>
                  {item.user} · {item.time}
                </span>
              </div>
              <p style={{ fontSize: 'var(--fs-13)', color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
