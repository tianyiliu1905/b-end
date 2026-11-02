import { useState } from 'react';
import { Button, Input, Select, Row, Col, Radio, Switch } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';

export default function GroupForm() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectCode: '',
    priority: '中',
    owner: '',
    dept: '',
    startDate: '',
    endDate: '',
    budget: '',
    desc: '',
    notifyAll: false,
    autoReport: true,
  });

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--fs-14)',
    color: 'var(--text-2)',
    marginBottom: 8,
    fontWeight: 500,
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 24,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 'var(--fs-16)',
    color: 'var(--text-1)',
    fontWeight: 600,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid var(--line)',
  };

  return (
    <PageLayout title="分组表单">
      {/* F-1 表单分组 - 基础信息 */}
      <div className="dash-card" style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={sectionTitle}>基础信息</div>

        <Row gutter={24}>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>项目名称 *</div>
              <Input
                placeholder="请输入项目名称"
                value={formData.projectName}
                onChange={(e: { target: { value: string } }) => setFormData({ ...formData, projectName: e.target.value })}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>项目编号 *</div>
              <Input
                placeholder="自动生成或手动输入"
                value={formData.projectCode}
                onChange={(e: { target: { value: string } }) => setFormData({ ...formData, projectCode: e.target.value })}
              />
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>负责人 *</div>
              <Input
                placeholder="请输入负责人姓名"
                value={formData.owner}
                onChange={(e: { target: { value: string } }) => setFormData({ ...formData, owner: e.target.value })}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>所属部门</div>
              <Select
                options={[
                  { label: '技术部', value: '技术部' },
                  { label: '产品部', value: '产品部' },
                  { label: '运营部', value: '运营部' },
                ]}
                value={formData.dept}
                onChange={(val: string) => setFormData({ ...formData, dept: val })}
                placeholder="请选择"
                style={{ width: '100%' }}
              />
            </div>
          </Col>
        </Row>

        <div style={fieldStyle}>
          <div style={labelStyle}>优先级</div>
          <Radio.Group
            value={formData.priority}
            onChange={(val: string) => setFormData({ ...formData, priority: val })}
          >
            <Radio value="高">高</Radio>
            <Radio value="中">中</Radio>
            <Radio value="低">低</Radio>
          </Radio.Group>
        </div>
      </div>

      {/* F-1 表单分组 - 周期与预算 */}
      <div className="dash-card" style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={sectionTitle}>周期与预算</div>

        <Row gutter={24}>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>开始日期</div>
              <Input
                placeholder="YYYY-MM-DD"
                value={formData.startDate}
                onChange={(e: { target: { value: string } }) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>结束日期</div>
              <Input
                placeholder="YYYY-MM-DD"
                value={formData.endDate}
                onChange={(e: { target: { value: string } }) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </Col>
        </Row>

        <div style={fieldStyle}>
          <div style={labelStyle}>预算金额（万元）</div>
          <Input
            placeholder="请输入预算"
            value={formData.budget}
            onChange={(e: { target: { value: string } }) => setFormData({ ...formData, budget: e.target.value })}
            style={{ maxWidth: 240 }}
          />
        </div>
      </div>

      {/* F-1 表单分组 - 其他设置 */}
      <div className="dash-card" style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={sectionTitle}>其他设置</div>

        <div style={fieldStyle}>
          <div style={labelStyle}>项目描述</div>
          <Input.TextArea
            placeholder="请输入项目描述"
            value={formData.desc}
            onChange={(e: { target: { value: string } }) => setFormData({ ...formData, desc: e.target.value })}
            rows={4}
          />
        </div>

        <Row gutter={48}>
          <Col>
            <div style={fieldStyle}>
              <Switch
                checked={formData.notifyAll}
                onChange={(val: boolean) => setFormData({ ...formData, notifyAll: val })}
              />
              <span style={{ marginLeft: 8, fontSize: 'var(--fs-14)', color: 'var(--text-2)' }}>通知全员</span>
            </div>
          </Col>
          <Col>
            <div style={fieldStyle}>
              <Switch
                checked={formData.autoReport}
                onChange={(val: boolean) => setFormData({ ...formData, autoReport: val })}
              />
              <span style={{ marginLeft: 8, fontSize: 'var(--fs-14)', color: 'var(--text-2)' }}>自动周报</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* F-2 操作区 */}
      <div className="dash-card" style={{ maxWidth: 760, margin: '0 auto', display: 'flex', justifyContent: 'flex-end', gap: 'var(--gap-elem)' }}>
        <Button>取消</Button>
        <Button>保存草稿</Button>
        <Button type="primary">提交审批</Button>
      </div>
    </PageLayout>
  );
}
