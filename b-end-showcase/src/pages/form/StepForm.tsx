import { useState } from 'react';
import { Button, Input, Select, Row, Col, Steps } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';

const steps = [
  { title: '基础信息' },
  { title: '权限配置' },
  { title: '确认提交' },
];

const deptOptions = [
  { label: '技术部', value: '技术部' },
  { label: '产品部', value: '产品部' },
  { label: '设计部', value: '设计部' },
  { label: '运营部', value: '运营部' },
];

const permOptions = [
  { label: '查看', value: 'view' },
  { label: '编辑', value: 'edit' },
  { label: '管理', value: 'admin' },
];

export default function StepForm() {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    dept: '',
    email: '',
    permission: '',
    scope: '',
    remark: '',
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

  const renderStep0 = () => (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <div style={fieldStyle}>
            <div style={labelStyle}>姓名 *</div>
            <Input
              placeholder="请输入姓名"
              value={formData.name}
              onChange={(e: { target: { value: string } }) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={fieldStyle}>
            <div style={labelStyle}>部门 *</div>
            <Select
              options={deptOptions}
              value={formData.dept}
              onChange={(val: string) => setFormData({ ...formData, dept: val })}
              placeholder="请选择部门"
              style={{ width: '100%' }}
            />
          </div>
        </Col>
      </Row>
      <div style={fieldStyle}>
        <div style={labelStyle}>邮箱</div>
        <Input
          placeholder="请输入邮箱"
          value={formData.email}
          onChange={(e: { target: { value: string } }) => setFormData({ ...formData, email: e.target.value })}
          style={{ maxWidth: 360 }}
        />
      </div>
    </>
  );

  const renderStep1 = () => (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <div style={fieldStyle}>
            <div style={labelStyle}>权限等级 *</div>
            <Select
              options={permOptions}
              value={formData.permission}
              onChange={(val: string) => setFormData({ ...formData, permission: val })}
              placeholder="请选择权限"
              style={{ width: '100%' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={fieldStyle}>
            <div style={labelStyle}>数据范围</div>
            <Select
              options={[
                { label: '本部门', value: '本部门' },
                { label: '全公司', value: '全公司' },
                { label: '自定义', value: '自定义' },
              ]}
              value={formData.scope}
              onChange={(val: string) => setFormData({ ...formData, scope: val })}
              placeholder="请选择范围"
              style={{ width: '100%' }}
            />
          </div>
        </Col>
      </Row>
      <div style={fieldStyle}>
        <div style={labelStyle}>备注</div>
        <Input.TextArea
          placeholder="请输入权限说明"
          value={formData.remark}
          onChange={(e: { target: { value: string } }) => setFormData({ ...formData, remark: e.target.value })}
          rows={3}
        />
      </div>
    </>
  );

  const renderStep2 = () => {
    const infoStyle: React.CSSProperties = {
      display: 'flex',
      marginBottom: 12,
      fontSize: 'var(--fs-14)',
    };
    const infoLabel: React.CSSProperties = {
      color: 'var(--text-3)',
      width: 80,
      flexShrink: 0,
    };
    const infoValue: React.CSSProperties = {
      color: 'var(--text-1)',
    };

    return (
      <div style={{ padding: '8px 0' }}>
        <div style={infoStyle}><span style={infoLabel}>姓名</span><span style={infoValue}>{formData.name || '-'}</span></div>
        <div style={infoStyle}><span style={infoLabel}>部门</span><span style={infoValue}>{formData.dept || '-'}</span></div>
        <div style={infoStyle}><span style={infoLabel}>邮箱</span><span style={infoValue}>{formData.email || '-'}</span></div>
        <div style={infoStyle}><span style={infoLabel}>权限等级</span><span style={infoValue}>{formData.permission || '-'}</span></div>
        <div style={infoStyle}><span style={infoLabel}>数据范围</span><span style={infoValue}>{formData.scope || '-'}</span></div>
        <div style={infoStyle}><span style={infoLabel}>备注</span><span style={infoValue}>{formData.remark || '-'}</span></div>
      </div>
    );
  };

  return (
    <PageLayout title="分步表单">
      {/* F-3 步骤条 */}
      <div className="dash-card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <Steps current={current}>
          {steps.map((s) => (
            <Steps.Step key={s.title} title={s.title} />
          ))}
        </Steps>
      </div>

      {/* F-1 表单主体 */}
      <div className="dash-card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', marginBottom: 24, fontWeight: 600 }}>
          {steps[current].title}
        </h3>
        {current === 0 && renderStep0()}
        {current === 1 && renderStep1()}
        {current === 2 && renderStep2()}
      </div>

      {/* F-2 操作区 */}
      <div className="dash-card" style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'flex-end', gap: 'var(--gap-elem)' }}>
        {current > 0 && (
          <Button onClick={() => setCurrent(current - 1)}>上一步</Button>
        )}
        {current < 2 && (
          <Button type="primary" onClick={() => setCurrent(current + 1)}>下一步</Button>
        )}
        {current === 2 && (
          <Button type="primary">确认提交</Button>
        )}
      </div>
    </PageLayout>
  );
}
