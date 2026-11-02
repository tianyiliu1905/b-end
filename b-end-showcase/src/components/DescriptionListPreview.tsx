import './DescriptionListPreview.css';

/* ─────────────────────────────────────────────────────────
 * 公用数据类型与 DescriptionList 组件
 * 规范说明：MTD 没有原生 Descriptions 组件，基于 flex-wrap 自建（不依赖 Row/Col 栅格）。
 *
 * 注意：类名统一加 dlp- 前缀（DescriptionListPreview 缩写）。
 * 项目里其他详情页（MasterDetailPage / ModalDetailPage / DrawerDetailDrawer）
 * 各自维护了同名的 .description-list 系列类名，普通 .css 是全局作用域，
 * 一旦这些样式表被同时打包加载，会互相覆盖导致本组件的多列布局失效。
 * 加前缀彻底隔离，避免样式串扰。
 * ───────────────────────────────────────────────────────── */
interface DescItem {
  label: string;
  value: string;
  link?: boolean;
}

function DescriptionList({
  items,
  columns = 2,
}: {
  items: DescItem[];
  columns?: 2 | 3 | 4;
}) {
  const cls = `dlp-list dlp-list--col${columns}`;

  return (
    <div className={cls}>
      {items.map((item) => (
        <div className="dlp-item" key={item.label}>
          <div className="dlp-label">{item.label}</div>
          <div className={item.link ? 'dlp-value dlp-value--link' : 'dlp-value'}>
            {item.value || '-'}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 变体 A · 2 列横向排列（默认，字段值较长）
 * ───────────────────────────────────────────────────────── */
const BASIC_INFO_2COL: DescItem[] = [
  { label: '门店名称', value: '春熙路旗舰店' },
  { label: '门店编号', value: 'ST-2024-001' },
  { label: '所在城市', value: '成都' },
  { label: '所属区域', value: '西南大区' },
  { label: '店铺地址', value: '成都市锦江区春熙路 128 号 B1 层' },
  { label: '开业日期', value: '2023-01-15' },
  { label: '合同类型', value: '直营' },
  { label: '店长姓名', value: '张三' },
  { label: '联系电话', value: '028-88888888' },
  { label: '所属 SPU', value: '查看 SPU 详情', link: true },
  { label: '备注说明', value: '-' },
  { label: '店铺面积', value: '120㎡' },
];

export function TwoColumnDescription() {
  return (
    <div className="dl-preview-wrap">
      <div className="dl-section-title">基本信息</div>
      <DescriptionList items={BASIC_INFO_2COL} columns={2} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 变体 B · 3 列横向排列（中等密度，label 收窄至 80px）
 * ───────────────────────────────────────────────────────── */
const SKU_INFO_3COL: DescItem[] = [
  { label: '商品编码', value: 'SKU-20240115' },
  { label: '商品名称', value: '招牌拿铁（大杯）' },
  { label: '所属类目', value: '热饮' },
  { label: '上架状态', value: '已上架' },
  { label: '销售价格', value: '¥38.00' },
  { label: '成本价格', value: '¥12.50' },
  { label: '库存数量', value: '500 件' },
  { label: '规格型号', value: '500ml / 大杯' },
  { label: '创建人', value: '李四' },
  { label: '创建时间', value: '2024-01-15 10:30' },
  { label: '更新时间', value: '2024-03-20 14:22' },
  { label: '关联套餐', value: '查看套餐', link: true },
];

export function ThreeColumnDescription() {
  return (
    <div className="dl-preview-wrap">
      <div className="dl-section-title">商品信息</div>
      <DescriptionList items={SKU_INFO_3COL} columns={3} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 变体 C · 4 列纵向排列（信息密集，label 在上 / value 在下）
 * ───────────────────────────────────────────────────────── */
const METRICS_4COL: DescItem[] = [
  { label: '昨日订单量', value: '1,280' },
  { label: '昨日营业额', value: '¥48,620' },
  { label: '本月订单量', value: '28,450' },
  { label: '本月营业额', value: '¥1,082,300' },
  { label: '好评率', value: '98.2%' },
  { label: '配送及时率', value: '96.5%' },
  { label: '客单价', value: '¥38.0' },
  { label: '退款率', value: '0.8%' },
  { label: '复购率', value: '41.3%' },
  { label: '曝光量', value: '12.6 万' },
  { label: '点击率', value: '5.2%' },
  { label: '转化率', value: '3.8%' },
];

export function FourColumnDescription() {
  return (
    <div className="dl-preview-wrap">
      <div className="dl-section-title">运营指标</div>
      <DescriptionList items={METRICS_4COL} columns={4} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 变体 D · 混用不同列数（同一页面 2 列 + 4 列）
 * ───────────────────────────────────────────────────────── */
const STORE_BASIC: DescItem[] = [
  { label: '门店名称', value: '春熙路旗舰店' },
  { label: '门店编号', value: 'ST-2024-001' },
  { label: '店铺地址', value: '成都市锦江区春熙路 128 号 B1 层' },
  { label: '合同类型', value: '直营' },
];

const STORE_METRICS: DescItem[] = [
  { label: '昨日订单', value: '1,280' },
  { label: '本月营业额', value: '¥108 万' },
  { label: '好评率', value: '98.2%' },
  { label: '复购率', value: '41.3%' },
  { label: '客单价', value: '¥38.0' },
  { label: '退款率', value: '0.8%' },
  { label: '转化率', value: '3.8%' },
  { label: '曝光量', value: '12.6 万' },
];

export function MixedColumnsDescription() {
  return (
    <div className="dl-preview-wrap">
      <div className="dl-section-title">
        基本信息 <span className="dl-section-badge">2 列</span>
      </div>
      <DescriptionList items={STORE_BASIC} columns={2} />
      <div className="dl-section-title" style={{ marginTop: 24 }}>
        运营指标 <span className="dl-section-badge">4 列纵向</span>
      </div>
      <DescriptionList items={STORE_METRICS} columns={4} />
    </div>
  );
}
