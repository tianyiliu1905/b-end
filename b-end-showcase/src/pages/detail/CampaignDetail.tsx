import { useState } from 'react';
import {
  Breadcrumb,
  Icon,
  Tag,
  Tabs,
  Table,
  Pagination,
  Timeline,
  Image,
  Row,
  Col,
  Steps,
} from '@ss/mtd-react3';
import ModuleWrapper from '../../components/ModuleWrapper';
import './CampaignDetail.css';

const { TabPane } = Tabs;
const { Item: TimelineItem } = Timeline;

/* ===== 类型定义 ===== */
interface SummaryField {
  label: string;
  value: string;
  link?: boolean;
}

interface DescItem {
  label: string;
  value: string;
  link?: boolean;
}

/* ===== Mock 数据 ===== */
const summaryRow1: SummaryField[] = [
  { label: '活动编号', value: 'MK20260617001' },
  { label: '活动名称', value: '暑期美食狂欢节' },
  { label: '活动类型', value: '满减活动' },
  { label: '优先级', value: '高' },
];

const summaryRow2: SummaryField[] = [
  { label: '负责人', value: 'zhangsan02' },
  { label: '所属团队', value: '到店营销组' },
];

const basicInfoItems: DescItem[] = [
  { label: '活动名称', value: '暑期美食狂欢节' },
  { label: '活动编号', value: 'MK20260617001' },
  { label: '活动类型', value: '满减活动' },
  { label: '活动周期', value: '2026-07-01 至 2026-08-31' },
  { label: '适用城市', value: '北京、上海、广州、深圳、杭州' },
  { label: '适用品类', value: '美食、甜点饮品' },
  { label: '预算上限', value: '¥500,000' },
  { label: '已消耗预算', value: '¥320,800' },
  { label: '负责人', value: 'zhangsan02' },
  { label: '所属团队', value: '到店营销组' },
  { label: '创建时间', value: '2026-06-10 09:00' },
  { label: '最后修改', value: '2026-06-15 11:30' },
];

const ruleInfoItems: DescItem[] = [
  { label: '满减门槛', value: '满50元减10元' },
  { label: '叠加规则', value: '不与其他优惠叠加' },
  { label: '限购规则', value: '每人每日限购3次' },
  { label: '退款规则', value: '核销前可全额退款' },
  { label: '活动说明', value: '活动期间在指定城市美食品类下单，单笔订单满50元可享立减10元优惠，每位用户每天最多享受3次优惠。' },
  { label: '备注', value: '活动预算超出80%时自动暂停发券' },
];

const statusMap: Record<string, { label: string; theme: 'green' | 'orange' | 'red' | 'gray' | 'blue' }> = {
  active: { label: '已生效', theme: 'green' },
  pending: { label: '待审核', theme: 'orange' },
  expired: { label: '已过期', theme: 'gray' },
  rejected: { label: '已驳回', theme: 'red' },
  draft: { label: '草稿', theme: 'gray' },
};

const tableColumns = [
  { label: '商户名称', dataKey: 'merchant', width: 180 },
  { label: '城市', dataKey: 'city', width: 80 },
  { label: '订单数', dataKey: 'orders', width: 100 },
  { label: '核销数', dataKey: 'verified', width: 100 },
  { label: '核销率', dataKey: 'rate', width: 90,
    render: (val: string) => <span style={{ color: val >= '80%' ? '#00A854' : '#FF7700', fontWeight: 500 }}>{val}</span> },
  { label: 'GMV', dataKey: 'gmv', width: 120,
    render: (val: string) => <span style={{ fontWeight: 500 }}>{val}</span> },
  { label: '状态', dataKey: 'status', width: 90,
    render: (val: string) => {
      const info = statusMap[val] || { label: val, theme: 'gray' as const };
      return <Tag theme={info.theme} type="bordered" size="small">{info.label}</Tag>;
    } },
  { label: '操作', dataKey: 'action', width: 80,
    render: (_: unknown, record: any) => <a className="table-link" onClick={() => console.log(record)}>查看</a> },
];

const tableData = [
  { id: '1', merchant: '海底捞火锅（朝阳店）', city: '北京', orders: '1,280', verified: '1,050', rate: '82%', gmv: '¥85,200', status: 'active' },
  { id: '2', merchant: '西贝莜面村（徐汇店）', city: '上海', orders: '980', verified: '760', rate: '78%', gmv: '¥62,400', status: 'active' },
  { id: '3', merchant: '星巴克（天河城店）', city: '广州', orders: '1,520', verified: '1,380', rate: '91%', gmv: '¥98,700', status: 'active' },
  { id: '4', merchant: '喜茶（南山店）', city: '深圳', orders: '860', verified: '720', rate: '84%', gmv: '¥45,800', status: 'active' },
  { id: '5', merchant: '外婆家（西湖店）', city: '杭州', orders: '640', verified: '480', rate: '75%', gmv: '¥38,200', status: 'pending' },
  { id: '6', merchant: '奈雪的茶（国贸店）', city: '北京', orders: '1,100', verified: '920', rate: '84%', gmv: '¥72,600', status: 'active' },
  { id: '7', merchant: '必胜客（静安店）', city: '上海', orders: '720', verified: '580', rate: '81%', gmv: '¥52,400', status: 'active' },
  { id: '8', merchant: '蜜雪冰城（番禺店）', city: '广州', orders: '2,340', verified: '2,100', rate: '90%', gmv: '¥68,500', status: 'active' },
];

const timelineData = [
  {
    title: <div>活动创建</div>,
    content: (
      <div>
        <div>zhangsan02 创建了活动「暑期美食狂欢节」</div>
        <div style={{ color: 'rgba(17,25,37,0.45)', fontSize: '12px' }}>2026-06-10 09:00</div>
      </div>
    ),
    icon: 'success-circle',
  },
  {
    title: <div>主管审核通过</div>,
    content: (
      <div>
        <div>lisi04 审核通过，备注：预算合理，同意推进</div>
        <div style={{ color: 'rgba(17,25,37,0.45)', fontSize: '12px' }}>2026-06-10 14:20</div>
      </div>
    ),
    icon: 'success-circle',
  },
  {
    title: <div>财务审批通过</div>,
    content: (
      <div>
        <div>wangwu01 审核通过，预算额度 ¥500,000 已确认</div>
        <div style={{ color: 'rgba(17,25,37,0.45)', fontSize: '12px' }}>2026-06-11 10:15</div>
      </div>
    ),
    icon: 'success-circle',
  },
  {
    title: <div>活动规则调整</div>,
    content: (
      <div>
        <div>zhangsan02 修改了满减门槛：满40元减8元 → 满50元减10元</div>
        <div style={{ color: 'rgba(17,25,37,0.45)', fontSize: '12px' }}>2026-06-15 11:30</div>
      </div>
    ),
    icon: 'edit-o',
  },
  {
    title: <div>等待总监终审</div>,
    content: (
      <div>
        <div>当前等待总监终审，预计2026-06-18前完成</div>
        <div style={{ color: 'rgba(17,25,37,0.45)', fontSize: '12px' }}>进行中</div>
      </div>
    ),
    icon: 'time-o',
  },
];

const attachmentFiles = [
  { name: '活动方案书.pdf' },
  { name: '预算测算明细表.xlsx' },
  { name: '商户签约清单.pdf' },
  { name: '活动规则说明文档.docx' },
];

const attachmentImages = [
  'https://via.placeholder.com/96?text=Banner1',
  'https://via.placeholder.com/96?text=Banner2',
  'https://via.placeholder.com/96?text=Poster',
];

/* ===== 组件 ===== */
function SummaryRow({ fields, columnCount }: { fields: SummaryField[]; columnCount: number }) {
  const visible = fields.filter((f) => f.value != null && f.value !== '');
  return (
    <div className="page-header__summary-row" style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
      {visible.map((f) => (
        <span className="page-header__summary-item" key={f.label}>
          <span className="page-header__summary-label">{f.label}</span>
          <span className={f.link ? 'page-header__summary-value page-header__summary-value--link' : 'page-header__summary-value'}>
            {f.value}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function CampaignDetail() {
  const [activeTab, setActiveTab] = useState('records');
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const total = 50;

  const columnCount = Math.max(summaryRow1.length, summaryRow2.length);

  const handleBack = () => {
    window.history.back();
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  return (
    <div className="page-container">
      <div className="page-card">
        {/* ===== F2 表头信息区 ===== */}
        <ModuleWrapper moduleId="F-2 表头信息区" tooltipPlacement="bottom" style={{ height: 'auto' }} useFixed>
        <div className="page-header">
          <div className="page-header__breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item>活动管理</Breadcrumb.Item>
              <Breadcrumb.Item>活动详情</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="page-header__title page-header__title--with-back">
            <Icon type="arrow-left" className="page-header__back-icon" onClick={handleBack} />
            暑期美食狂欢节
            <Tag theme="orange" type="bordered" className="page-header__status">审核中</Tag>
          </h1>
          <div className="page-header__summary page-header__summary--aligned">
            <SummaryRow fields={summaryRow1} columnCount={columnCount} />
            <SummaryRow fields={summaryRow2} columnCount={columnCount} />
          </div>
        </div>
        </ModuleWrapper>

        {/* ===== 可滚动内容区 ===== */}
        <div className="scroll-content">
          {/* ===== Detail-1 描述列表（基本信息）===== */}
          <ModuleWrapper
            moduleId="Detail-1 描述列表（基本信息）"
            style={{ height: 'auto' }}
            useFixed
            variants={[
              {
                name: '标准三列网格',
                render: () => (
                  <div className="form-section" id="basic-info">
                    <h3 className="form-section__title">基本信息</h3>
                    <Row className="desc-list desc-list--3col">
                      {basicInfoItems.map((item) => (
                        <Col span={8} key={item.label} className="desc-list__item">
                          <span className="desc-list__label">{item.label}</span>
                          <span className={item.link ? 'desc-list__value desc-list__value--link' : 'desc-list__value'}>
                            {item.value || '-'}
                          </span>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              },
              {
                name: '双列网格（当前）',
                render: () => (
                  <div className="form-section" id="basic-info">
                    <h3 className="form-section__title">基本信息</h3>
                    <Row className="desc-list desc-list--2col">
                      {basicInfoItems.map((item) => (
                        <Col span={12} key={item.label} className="desc-list__item">
                          <span className="desc-list__label">{item.label}</span>
                          <span className={item.link ? 'desc-list__value desc-list__value--link' : 'desc-list__value'}>
                            {item.value || '-'}
                          </span>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              },
              {
                name: '长文本单列',
                render: () => (
                  <div className="form-section" id="basic-info">
                    <h3 className="form-section__title">基本信息</h3>
                    <Row className="desc-list desc-list--1col">
                      {basicInfoItems.map((item) => (
                        <Col span={24} key={item.label} className="desc-list__item">
                          <span className="desc-list__label">{item.label}</span>
                          <span className={item.link ? 'desc-list__value desc-list__value--link' : 'desc-list__value'}>
                            {item.value || '-'}
                          </span>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              },
            ]}
            defaultVariant={1}
          />

          {/* ===== Detail-1 描述列表（活动规则）===== */}
          <ModuleWrapper
            moduleId="Detail-1 描述列表（活动规则）"
            style={{ height: 'auto' }}
            useFixed
            variants={[
              {
                name: '标准三列网格',
                render: () => (
                  <div className="form-section" id="rule-info">
                    <h3 className="form-section__title">活动规则</h3>
                    <Row className="desc-list desc-list--3col">
                      {ruleInfoItems.map((item) => (
                        <Col span={8} key={item.label} className="desc-list__item">
                          <span className="desc-list__label">{item.label}</span>
                          <span className="desc-list__value">{item.value || '-'}</span>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              },
              {
                name: '双列网格（当前）',
                render: () => (
                  <div className="form-section" id="rule-info">
                    <h3 className="form-section__title">活动规则</h3>
                    <Row className="desc-list desc-list--2col">
                      {ruleInfoItems.map((item) => (
                        <Col span={12} key={item.label} className="desc-list__item">
                          <span className="desc-list__label">{item.label}</span>
                          <span className="desc-list__value">{item.value || '-'}</span>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              },
              {
                name: '长文本单列',
                render: () => (
                  <div className="form-section" id="rule-info">
                    <h3 className="form-section__title">活动规则</h3>
                    <Row className="desc-list desc-list--1col">
                      {ruleInfoItems.map((item) => (
                        <Col span={24} key={item.label} className="desc-list__item">
                          <span className="desc-list__label">{item.label}</span>
                          <span className="desc-list__value">{item.value || '-'}</span>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              },
            ]}
            defaultVariant={1}
          />

          {/* ===== D3 Tab 切换 ===== */}
          <div className="form-section" id="tab-section">
            <h3 className="form-section__title">详细数据</h3>
            <ModuleWrapper moduleId="Tabs 切换" style={{ height: 'auto' }} useFixed>
            <Tabs
              activeKey={activeTab}
              onChange={(key: string) => setActiveTab(key)}
              style={{ paddingTop: 12, width: '100%' }}
              className="detail-tabs"
            >
              {/* Tab1: 参与商户表格 */}
              <TabPane label="参与商户" key="records">
                <ModuleWrapper moduleId="G-4 只读数据表格" style={{ height: 'auto' }} useFixed>
                <div className="readonly-table">
                  <Table
                    columns={tableColumns}
                    data={tableData}
                    rowKey="id"
                    bordered="row"
                    emptyText="暂无关联数据"
                  />
                  <div className="readonly-table__pagination">
                    <Pagination
                      current={current}
                      pageSize={pageSize}
                      total={total}
                      onChange={handlePageChange}
                      showSizeChanger
                      showTotal
                    />
                  </div>
                </div>
                </ModuleWrapper>
              </TabPane>

              {/* Tab2: 附件预览 */}
              <TabPane label="相关附件" key="attachments">
                <ModuleWrapper moduleId="D9 附件预览" style={{ height: 'auto' }} useFixed>
                <div className="attachment-section">
                  <div className="attachment-section__title">文件附件</div>
                  <div className="attachment-preview__files">
                    {attachmentFiles.map((file) => (
                      <a className="attachment-preview__file-link" key={file.name}>
                        {file.name}
                      </a>
                    ))}
                  </div>

                  <div className="attachment-section__title" style={{ marginTop: 24 }}>活动素材图片</div>
                  <div className="attachment-preview__images">
                    <Image.PreviewGroup>
                      {attachmentImages.map((src) => (
                        <Image
                          key={src}
                          src={src}
                          width={96}
                          height={96}
                          className="attachment-preview__image"
                        />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                </div>
                </ModuleWrapper>
              </TabPane>
            </Tabs>
            </ModuleWrapper>
          </div>

          {/* ===== Detail-2 状态流程 / 操作记录 ===== */}
          <ModuleWrapper
            moduleId="Detail-2 状态流程"
            style={{ height: 'auto' }}
            useFixed
            variants={[
              {
                name: '变体B·竖向时间线',
                render: () => (
                  <div className="form-section" id="operation-records">
                    <h3 className="form-section__title">操作记录</h3>
                    <div className="timeline-wrapper">
                      <Timeline>
                        {timelineData.map((item, index) => (
                          <TimelineItem
                            key={index}
                            title={item.title}
                            content={item.content}
                            icon={item.icon}
                          />
                        ))}
                      </Timeline>
                    </div>
                  </div>
                ),
              },
              {
                name: '变体A·横向流程节点',
                render: () => (
                  <div className="form-section" id="operation-records">
                    <h3 className="form-section__title">审批流程</h3>
                    <div className="steps-flow-wrapper">
                      <Steps current={3} labelPlacement="vertical">
                        <Steps.Step title="活动创建" description="zhangsan02 · 06-10" />
                        <Steps.Step title="主管审核" description="lisi04 · 06-10" />
                        <Steps.Step title="财务审批" description="wangwu01 · 06-11" />
                        <Steps.Step title="规则调整" description="zhangsan02 · 06-15" />
                        <Steps.Step title="总监终审" description="待审批" />
                      </Steps>
                    </div>
                  </div>
                ),
              },
            ]}
            defaultVariant={0}
          />
        </div>
      </div>
    </div>
  );
}
