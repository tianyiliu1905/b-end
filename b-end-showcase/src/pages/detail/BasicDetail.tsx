import { Button, Tag, Row, Col } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';

const infoData = {
  title: '2024 Q3 产品优化项目',
  status: '进行中',
  code: 'PRJ-2024-0078',
  owner: '张三',
  dept: '技术部',
  priority: '高',
  startDate: '2024-07-01',
  endDate: '2024-09-30',
  budget: '50 万',
  progress: '68%',
  desc: '针对核心产品进行用户体验优化，覆盖首页改版、搜索体验升级、性能提升三大方向。目标将用户 NPS 从 42 提升到 55，页面加载时间降低 30%。',
  members: ['张三', '李四', '王五', '赵六', '孙七'],
  tags: ['产品优化', 'Q3', '重点项目'],
};

export default function BasicDetail() {
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
    <PageLayout title="基础详情">
      {/* DT-1 详情头部 */}
      <div className="dash-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontSize: 'var(--fs-20)', color: 'var(--text-1)', margin: 0, fontWeight: 600 }}>
                {infoData.title}
              </h2>
              <Tag theme="green" type="bordered">{infoData.status}</Tag>
            </div>
            <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-3)' }}>
              项目编号：{infoData.code}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--gap-elem)' }}>
            <Button>编辑</Button>
            <Button type="primary">审批通过</Button>
          </div>
        </div>
      </div>

      {/* DT-2 信息分组 */}
      <div className="dash-card">
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          基本信息
        </h3>
        <Row gutter={24}>
          <Col span={8}>
            <div style={labelStyle}>负责人</div>
            <div style={valueStyle}>{infoData.owner}</div>
          </Col>
          <Col span={8}>
            <div style={labelStyle}>所属部门</div>
            <div style={valueStyle}>{infoData.dept}</div>
          </Col>
          <Col span={8}>
            <div style={labelStyle}>优先级</div>
            <div style={valueStyle}>
              <Tag theme="red" type="bordered">{infoData.priority}</Tag>
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <div style={labelStyle}>开始日期</div>
            <div style={valueStyle}>{infoData.startDate}</div>
          </Col>
          <Col span={8}>
            <div style={labelStyle}>结束日期</div>
            <div style={valueStyle}>{infoData.endDate}</div>
          </Col>
          <Col span={8}>
            <div style={labelStyle}>预算</div>
            <div style={valueStyle}>{infoData.budget}</div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <div style={labelStyle}>进度</div>
            <div style={valueStyle}>{infoData.progress}</div>
          </Col>
          <Col span={16}>
            <div style={labelStyle}>标签</div>
            <div style={valueStyle}>
              {infoData.tags.map(t => <Tag key={t} style={{ marginRight: 8 }}>{t}</Tag>)}
            </div>
          </Col>
        </Row>
      </div>

      {/* DT-2 信息分组 - 项目描述 */}
      <div className="dash-card">
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          项目描述
        </h3>
        <p style={{ fontSize: 'var(--fs-14)', color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>
          {infoData.desc}
        </p>
      </div>

      {/* DT-2 信息分组 - 项目成员 */}
      <div className="dash-card">
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          项目成员（{infoData.members.length} 人）
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {infoData.members.map(m => (
            <div key={m} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px',
              background: 'var(--bg-2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-14)',
              color: 'var(--text-1)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--fs-12)',
              }}>
                {m[0]}
              </div>
              {m}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
