import { Drawer, Row, Col, Button } from '@ss/mtd-react3';
import ModuleWrapper from '../../components/ModuleWrapper';

/* ============================================================
 * 商品详情 — 抽屉详情页
 * 技术栈：React (@ss/mtd-react3)
 * 装配：G1 抽屉容器（标准宽度 640px） + G2 抽屉标题区（Drawer title，无自定义 page-header）
 *       + D5 描述列表（2 列键值对，只读展示）
 * 硬约束：prompt 未出现"编辑/审批/下架/删除/保存/导出"等操作动词，
 *        详情页默认不带操作栏 —— 因此本抽屉不设置 footer。
 * ============================================================ */

export interface ProductRecord {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  originalPrice: string;
  stock: string;
  status: string;
  onlineAt: string;
  creator: string;
  createdAt: string;
}

interface DescItem {
  label: string;
  value: string;
  link?: boolean;
}

function DescriptionList({ items, columns = 2 }: { items: DescItem[]; columns?: 2 | 4 }) {
  const span = 24 / columns;
  const cls =
    columns > 2 ? 'description-list description-list--col4' : 'description-list description-list--col2';

  return (
    <div className={cls}>
      <Row gutter={0}>
        {items.map((item) => (
          <Col span={span} key={item.label}>
            <div className="description-list__item">
              <span className="description-list__label">{item.label}</span>
              <span
                className={
                  item.link ? 'description-list__value description-list__value--link' : 'description-list__value'
                }
              >
                {item.value}
              </span>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

function buildDescItems(record: ProductRecord): DescItem[] {
  return [
    { label: '商品编号', value: record.code },
    { label: '商品名称', value: record.name },
    { label: '所属类目', value: record.category },
    { label: '商品品牌', value: record.brand },
    { label: '销售价格', value: record.price },
    { label: '划线价格', value: record.originalPrice },
    { label: '库存数量', value: record.stock },
    { label: '商品状态', value: record.status },
    { label: '上架时间', value: record.onlineAt },
    { label: '创建人', value: record.creator },
    { label: '创建时间', value: record.createdAt },
    { label: '商品详情链接', value: '查看商品主图与详情页', link: true },
  ];
}

/**
 * 受控抽屉：由外部（如商品列表页表格的"查看"操作）传入 visible / record / onClose 触发。
 */
export function ProductDetailDrawer({
  visible,
  record,
  onClose,
}: {
  visible: boolean;
  record: ProductRecord | null;
  onClose: () => void;
}) {
  return (
    <Drawer
      visible={visible}
      title="商品详情"
      width={640}
      maskClosable={false}
      onClose={onClose}
      footer={
        <div className="drawer-action-bar">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={onClose}>确定</Button>
        </div>
      }
    >
      {record ? (
        <ModuleWrapper moduleId="Detail-1 描述列表（抽屉变体）" useFixed disableTooltip style={{ height: 'auto' }}>
          <DescriptionList items={buildDescItems(record)} columns={2} />
        </ModuleWrapper>
      ) : null}
    </Drawer>
  );
}

export default ProductDetailDrawer;
