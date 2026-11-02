/**
 * FD3 · 只读数据表格（ReadonlyTable）
 * ─────────────────────────────────────────────
 * 在表单页/详情页中展示关联的只读数据列表，不可编辑。
 * 无新增/删除行按钮，无行内编辑控件。
 *
 * 变体（按数据类型分）：
 * 变体A 基础信息表 — 文字 + 状态 Tag + 查看链接 + 分页
 * 变体B 图文信息表 — 缩略图 + 主副文字 + 状态 Tag
 * 变体C 明细数据表 — 数值 + 涨跌色 + 固定列（useSticky）
 */
import { useState } from 'react';
import { Table, Tag, Pagination } from '@ss/mtd-react3';
import './ReadonlyTablePreview.css';

/* ─────────────────────────────────────
   变体A · 基础信息表
   文字 + 状态 Tag + 查看链接 + 分页
   ───────────────────────────────────── */
const statusMapA: Record<string, { label: string; theme: 'green' | 'red' | 'gray' | 'orange' }> = {
  active:   { label: '生效',   theme: 'green' },
  inactive: { label: '失效',   theme: 'red' },
  draft:    { label: '草稿',   theme: 'gray' },
  pending:  { label: '待审核', theme: 'orange' },
};

const DATA_A = [
  { id: '1', name: '门店经营合同', type: '租赁',  createdAt: '2024-01-15', status: 'active' },
  { id: '2', name: '设备采购合同', type: '采购',  createdAt: '2024-01-16', status: 'inactive' },
  { id: '3', name: '品牌授权协议', type: '授权',  createdAt: '2024-01-17', status: 'draft' },
  { id: '4', name: '物流配送合同', type: '服务',  createdAt: '2024-02-01', status: 'pending' },
];

export function BasicInfoTable() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { label: '名称',     dataKey: 'name' },   // 弹性列，不设 width
    { label: '类型',     dataKey: 'type',      width: 80 },
    { label: '创建时间', dataKey: 'createdAt', width: 130 },
    {
      label: '状态', dataKey: 'status', width: 100,
      render: (val: string) => {
        const info = statusMapA[val] || { label: val, theme: 'gray' as const };
        return <Tag theme={info.theme} type="bordered" size="small">{info.label}</Tag>;
      },
    },
    {
      label: '操作', dataKey: 'action', width: 72,
      render: (_: unknown, row: any) => (
        <a className="readonly-table__link" onClick={() => console.log('查看', row)}>查看</a>
      ),
    },
  ];

  return (
    <div className="readonly-table">
      <Table
        columns={columns}
        data={DATA_A}
        rowKey="id"
        bordered="row"
        emptyText="暂无关联合同"
      />
      <div className="readonly-table__pagination">
        <Pagination
          current={current}
          pageSize={pageSize}
          total={50}
          onChange={(page: number, size: number) => {
            setCurrent(page);
            setPageSize(size);
          }}
          showSizeChanger
          showTotal
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   变体B · 图文信息表
   缩略图 + 主副文字 + 状态 Tag
   ───────────────────────────────────── */
const DATA_B = [
  { id: '1', img: 'https://nocode.meituan.com/photo/search?keyword=food&width=36&height=36',   name: '招牌烤鸭套餐', sku: 'SKU-20240101', qty: 120, status: '正常' },
  { id: '2', img: 'https://nocode.meituan.com/photo/search?keyword=drink&width=36&height=36',  name: '手工柠檬茶',   sku: 'SKU-20240102', qty: 80,  status: '下架' },
  { id: '3', img: 'https://nocode.meituan.com/photo/search?keyword=dessert&width=36&height=36',name: '招牌抹茶蛋糕', sku: 'SKU-20240103', qty: 55,  status: '正常' },
];

export function ImageInfoTable() {
  const columns = [
    {
      label: '商品', dataKey: 'name',
      render: (_: string, row: any) => (
        <div className="readonly-table__img-cell">
          <img src={row.img} alt="" className="mx-auto object-cover readonly-table__thumb" />
          <div>
            <div className="readonly-table__img-name">{row.name}</div>
            <div className="readonly-table__img-sku">{row.sku}</div>
          </div>
        </div>
      ),
    },
    { label: '数量', dataKey: 'qty', width: 80 },
    {
      label: '状态', dataKey: 'status', width: 90,
      render: (val: string) => (
        <Tag theme={val === '正常' ? 'green' : 'orange'} type="bordered" size="small">{val}</Tag>
      ),
    },
    {
      label: '操作', dataKey: 'action', width: 72,
      render: (_: unknown, row: any) => (
        <a className="readonly-table__link" onClick={() => console.log('查看', row)}>查看</a>
      ),
    },
  ];

  return (
    <div className="readonly-table">
      <Table
        columns={columns}
        data={DATA_B}
        rowKey="id"
        bordered="row"
        emptyText="暂无关联商品"
      />
    </div>
  );
}

/* ─────────────────────────────────────
   变体C · 明细数据表
   数值 + 涨跌色 + 固定列（useSticky）
   固定列三件套：fixed + useSticky + scroll.x
   ───────────────────────────────────── */
const DATA_C = [
  { id: '1', date: '2024-01-01', item: '外卖配送费',   amount:  3820.5,  delta:  12.3 },
  { id: '2', date: '2024-01-02', item: '平台服务费',   amount: -1200.0,  delta:  -5.8 },
  { id: '3', date: '2024-01-03', item: '活动补贴收入', amount:  5600.0,  delta:  28.6 },
  { id: '4', date: '2024-01-04', item: '退款扣除',     amount: -380.0,   delta: -18.2 },
  { id: '5', date: '2024-01-05', item: '广告投放费用', amount: -2100.0,  delta:   6.1 },
];

export function DetailDataTable() {
  const columns = [
    { label: '日期', dataKey: 'date', width: 110, fixed: 'left' as const },
    { label: '项目', dataKey: 'item' }, // 弹性列
    {
      label: '金额（元）', dataKey: 'amount', width: 130,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 500 }}>
          {val >= 0 ? '+' : ''}{val.toFixed(2)}
        </span>
      ),
    },
    {
      label: '环比变动', dataKey: 'delta', width: 110,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
          {val >= 0 ? '↑' : '↓'} {Math.abs(val)}%
        </span>
      ),
    },
    {
      label: '操作', dataKey: 'action', width: 72, fixed: 'right' as const,
      render: (_: unknown, row: any) => (
        <a className="readonly-table__link" onClick={() => console.log('查看', row)}>查看</a>
      ),
    },
  ];

  return (
    <div className="readonly-table">
      <Table
        columns={columns}
        data={DATA_C}
        rowKey="id"
        bordered="row"
        useSticky
        scroll={{ x: 600 }}
        emptyText="暂无明细数据"
      />
    </div>
  );
}
