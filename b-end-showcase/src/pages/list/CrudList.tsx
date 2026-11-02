import { useState } from 'react';
import { Button, Input, Select, DatePicker, Radio, Card } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';
import ModuleWrapper from '../../components/ModuleWrapper';
import { g4Variants } from '../../components/G4DataTable';
import {
  staffData,
  deptOptions,
  staffStatusOptions,
  type StaffRecord,
} from '../../mock/tableData';

const roleOptions = [
  { label: '全部角色', value: '' },
  { label: '前端工程师', value: '前端工程师' },
  { label: '后端工程师', value: '后端工程师' },
  { label: '产品经理', value: '产品经理' },
  { label: 'UI设计师', value: 'UI设计师' },
  { label: '交互设计师', value: '交互设计师' },
  { label: '测试工程师', value: '测试工程师' },
  { label: '运营专员', value: '运营专员' },
  { label: '架构师', value: '架构师' },
  { label: '数据分析师', value: '数据分析师' },
];

export default function CrudList() {
  const [searchValue, setSearchValue] = useState('');
  const [deptValue, setDeptValue] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [roleValue, setRoleValue] = useState('');

  const filteredData: StaffRecord[] = staffData.filter((item) => {
    const matchSearch = !searchValue || item.name.includes(searchValue) || item.id.includes(searchValue);
    const matchDept = !deptValue || item.dept === deptValue;
    const matchStatus = !statusValue || item.status === statusValue;
    const matchRole = !roleValue || item.role === roleValue;
    return matchSearch && matchDept && matchStatus && matchRole;
  });

  const handleReset = () => {
    setSearchValue('');
    setDeptValue('');
    setStatusValue('');
    setRoleValue('');
  };

  return (
    <PageLayout title="CRUD 管理列表">
      {/* G-3 看板筛选器栏 — 简单版/复杂版切换，默认复杂版 */}
      <ModuleWrapper
        moduleId="G-3 看板筛选器栏"
        tooltipPlacement="bottom"
        defaultVariant={1}
        variants={[
          {
            name: '简单版',
            render: () => (
              <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-module)', flexWrap: 'wrap' }}>
                <Input
                  placeholder="姓名/工号"
                  value={searchValue}
                  onChange={(e: { target: { value: string } }) => setSearchValue(e.target.value)}
                  style={{ width: 160 }}
                />
                <Select options={deptOptions} value={deptValue} onChange={(val: string) => setDeptValue(val)} onlyKeyValue placeholder="全部部门" style={{ width: 140 }} />
                <Select options={staffStatusOptions} value={statusValue} onChange={(val: string) => setStatusValue(val)} onlyKeyValue placeholder="全部状态" style={{ width: 140 }} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--gap-elem)' }}>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary">查询</Button>
                </div>
              </div>
            ),
          },
          {
            name: '复杂版',
            render: () => (
              <Card style={{ marginBottom: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap-module)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>姓名/工号</span>
                    <Input placeholder="请输入" value={searchValue} onChange={(e: { target: { value: string } }) => setSearchValue(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>部门</span>
                    <Select options={deptOptions} value={deptValue} onChange={(val: string) => setDeptValue(val)} onlyKeyValue placeholder="全部" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>角色</span>
                    <Select options={roleOptions} value={roleValue} onChange={(val: string) => setRoleValue(val)} onlyKeyValue placeholder="全部" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>状态</span>
                    <Select options={staffStatusOptions} value={statusValue} onChange={(val: string) => setStatusValue(val)} onlyKeyValue placeholder="全部" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>入职日期</span>
                    <DatePicker placeholder="请选择日期" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>手机号</span>
                    <Input placeholder="请输入" />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--gap-elem)', marginTop: 'var(--gap-module)' }}>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary">查询</Button>
                </div>
              </Card>
            ),
          },
        ]}
      />

      {/* 操作栏 */}
      <div className="dash-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--fs-14)', color: 'var(--text-3)' }}>
          共 <strong>{filteredData.length}</strong> 条结果
        </span>
        <div style={{ display: 'flex', gap: 'var(--gap-elem)' }}>
          <Button icon="download">导出</Button>
          <Button type="primary" icon="plus">新增人员</Button>
        </div>
      </div>

      {/* G-4 数据表格（分页器已内置在模块内）
          flex:1 让表格模块撑满页面剩余高度，内容不足一屏时分页器也贴在底部 */}
      <ModuleWrapper
        moduleId="G-4 数据表格"
        variants={g4Variants}
        defaultVariant={2}
        style={{ flex: 1, minHeight: 0 }}
      />
    </PageLayout>
  );
}
