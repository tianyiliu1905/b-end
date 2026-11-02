import { Tag, Row, Col, Button, Table } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';

const orderInfo = {
  orderId: 'ORD-20240815-0032',
  status: '已完成',
  createTime: '2024-08-15 14:32:00',
  payTime: '2024-08-15 14:33:12',
  completeTime: '2024-08-16 10:05:00',
  payMethod: '微信支付',
  totalAmount: '¥ 2,680.00',
  discountAmount: '¥ 200.00',
  actualAmount: '¥ 2,480.00',
};

const customerInfo = {
  name: '李四',
  phone: '139****5678',
  address: '北京市朝阳区建国路 88 号 SOHO 现代城 A 座 1205',
  remark: '请在工作日送达，放前台即可',
};

const goodsList = [
  { id: '1', name: '智能降噪耳机 Pro Max', spec: '星空灰 / 头戴式', price: '¥ 1,299.00', qty: 1, subtotal: '¥ 1,299.00' },
  { id: '2', name: '无线充电底座', spec: '黑色 / 15W', price: '¥ 199.00', qty: 2, subtotal: '¥ 398.00' },
  { id: '3', name: '蓝牙音箱 Mini', spec: '白色 / 便携款', price: '¥ 499.00', qty: 1, subtotal: '¥ 499.00' },
  { id: '4', name: '数据线套装', spec: 'Type-C / 1.5m × 3', price: '¥ 128.00', qty: 3, subtotal: '¥ 384.00' },
];

const goodsColumns = [
  { title: '商品名称', dataIndex: 'name', key: 'name' },
  { title: '规格', dataIndex: 'spec', key: 'spec', width: 160 },
  { title: '单价', dataIndex: 'price', key: 'price', width: 120 },
  { title: '数量', dataIndex: 'qty', key: 'qty', width: 80 },
  { title: '小计', dataIndex: 'subtotal', key: 'subtotal', width: 120 },
];

export default function CardDetail() {
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
    <PageLayout title="卡片详情">
      {/* DT-1 详情头部 */}
      <div className="dash-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ fontSize: 'var(--fs-20)', color: 'var(--text-1)', margin: 0, fontWeight: 600 }}>
              订单详情
            </h2>
            <Tag theme="green" type="bordered">{orderInfo.status}</Tag>
            <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-3)' }}>
              {orderInfo.orderId}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--gap-elem)' }}>
            <Button icon="download">导出</Button>
            <Button>退款</Button>
          </div>
        </div>
      </div>

      {/* DT-3 指标摘要 */}
      <Row gutter={8}>
        <Col span={8}>
          <div className="dash-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-3)', marginBottom: 8 }}>订单总额</div>
            <div style={{ fontSize: 'var(--fs-24)', color: 'var(--text-1)', fontWeight: 700 }}>{orderInfo.totalAmount}</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="dash-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-3)', marginBottom: 8 }}>优惠减免</div>
            <div style={{ fontSize: 'var(--fs-24)', color: '#F5222D', fontWeight: 700 }}>{orderInfo.discountAmount}</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="dash-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-3)', marginBottom: 8 }}>实付金额</div>
            <div style={{ fontSize: 'var(--fs-24)', color: 'var(--primary)', fontWeight: 700 }}>{orderInfo.actualAmount}</div>
          </div>
        </Col>
      </Row>

      {/* DT-2 信息分组 - 订单信息 */}
      <div className="dash-card">
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          订单信息
        </h3>
        <Row gutter={24}>
          <Col span={8}>
            <div style={labelStyle}>创建时间</div>
            <div style={valueStyle}>{orderInfo.createTime}</div>
          </Col>
          <Col span={8}>
            <div style={labelStyle}>付款时间</div>
            <div style={valueStyle}>{orderInfo.payTime}</div>
          </Col>
          <Col span={8}>
            <div style={labelStyle}>完成时间</div>
            <div style={valueStyle}>{orderInfo.completeTime}</div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <div style={labelStyle}>支付方式</div>
            <div style={valueStyle}>{orderInfo.payMethod}</div>
          </Col>
        </Row>
      </div>

      {/* DT-2 信息分组 - 收货信息 */}
      <div className="dash-card">
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          收货信息
        </h3>
        <Row gutter={24}>
          <Col span={8}>
            <div style={labelStyle}>收货人</div>
            <div style={valueStyle}>{customerInfo.name}</div>
          </Col>
          <Col span={8}>
            <div style={labelStyle}>联系电话</div>
            <div style={valueStyle}>{customerInfo.phone}</div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <div style={labelStyle}>收货地址</div>
            <div style={valueStyle}>{customerInfo.address}</div>
          </Col>
          <Col span={8}>
            <div style={labelStyle}>备注</div>
            <div style={valueStyle}>{customerInfo.remark}</div>
          </Col>
        </Row>
      </div>

      {/* DT-4 明细表格 */}
      <div className="dash-card">
        <h3 style={{ fontSize: 'var(--fs-16)', color: 'var(--text-1)', fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          商品明细
        </h3>
        <Table
          columns={goodsColumns}
          dataSource={goodsList}
          rowKey="id"
          pagination={false}
        />
      </div>
    </PageLayout>
  );
}
