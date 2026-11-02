import { useState } from 'react';
import { Button, Input, Select, Row, Col, Radio, DatePicker, Switch } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';

const deptOptions = [
  { label: '技术部', value: '技术部' },
  { label: '产品部', value: '产品部' },
  { label: '设计部', value: '设计部' },
  { label: '运营部', value: '运营部' },
  { label: '财务部', value: '财务部' },
  { label: '市场部', value: '市场部' },
];

const roleOptions = [
  { label: '前端工程师', value: '前端工程师' },
  { label: '后端工程师', value: '后端工程师' },
  { label: '产品经理', value: '产品经理' },
  { label: 'UI设计师', value: 'UI设计师' },
  { label: '测试工程师', value: '测试工程师' },
];

export default function BasicForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dept: '',
    role: '',
    gender: '男',
    joinDate: '',
    notify: true,
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

  return (
    <PageLayout title="基础表单">
      {/* F-1 表单主体 */}
      <div className="dash-card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', marginBottom: 24, fontWeight: 600 }}>
          新增人员信息
        </h3>

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
              <div style={labelStyle}>手机号 *</div>
              <Input
                placeholder="请输入手机号"
                value={formData.phone}
                onChange={(e: { target: { value: string } }) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>邮箱</div>
              <Input
                placeholder="请输入邮箱"
                value={formData.email}
                onChange={(e: { target: { value: string } }) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>性别</div>
              <Radio.Group
                value={formData.gender}
                onChange={(val: string) => setFormData({ ...formData, gender: val })}
              >
                <Radio value="男">男</Radio>
                <Radio value="女">女</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
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
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>角色 *</div>
              <Select
                options={roleOptions}
                value={formData.role}
                onChange={(val: string) => setFormData({ ...formData, role: val })}
                placeholder="请选择角色"
                style={{ width: '100%' }}
              />
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>入职日期</div>
              <DatePicker
                placeholder="请选择日期"
                value={formData.joinDate}
                onChange={(val: string) => setFormData({ ...formData, joinDate: val })}
                style={{ width: '100%' }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={fieldStyle}>
              <div style={labelStyle}>入职通知</div>
              <Switch
                checked={formData.notify}
                onChange={(val: boolean) => setFormData({ ...formData, notify: val })}
              />
              <span style={{ marginLeft: 8, fontSize: 'var(--fs-13)', color: 'var(--text-3)' }}>
                发送入职通知邮件
              </span>
            </div>
          </Col>
        </Row>

        <div style={fieldStyle}>
          <div style={labelStyle}>备注</div>
          <Input.TextArea
            placeholder="请输入备注信息"
            value={formData.remark}
            onChange={(e: { target: { value: string } }) => setFormData({ ...formData, remark: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      {/* F-2 操作区 */}
      <div className="dash-card" style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'flex-end', gap: 'var(--gap-elem)' }}>
        <Button>取消</Button>
        <Button type="primary">提交</Button>
      </div>
    </PageLayout>
  );
}
