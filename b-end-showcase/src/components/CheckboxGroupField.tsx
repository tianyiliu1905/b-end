/**
 * Form6 · 复选组（CheckboxGroup）
 * ─────────────────────────────────────────────
 * 以横排、分组网格或表格等形式做多选、勾选、适用范围设定。
 * 候选项必须是封闭集合（预定义、有限），不能自由输入集合外的新值。
 *
 * 变体 A · 基础横排：选项数量少（约10项以内）、无分组关系时的最简形态。
 * 变体 B · 分组多选矩阵：选项按业务维度分组展示，是复选组的标准/最常用形态。
 * 变体 C · 大数据量勾选：可选项超过 50-100 个时，改用 Table + rowSelection + 搜索。
 */
import { useMemo, useState } from 'react';
import { Checkbox, Button, Form, Table, Input, Tag, Icon } from '@ss/mtd-react3';
import './CheckboxGroupField.css';

interface GridOption {
  value: string;
  label: string;
  group?: string;
}

/* ══════════════════════════════════════════════
   变体 A · 基础横排（无分组）
   ══════════════════════════════════════════════ */
const NOTIFY_OPTIONS: GridOption[] = [
  { value: 'sms', label: '短信通知' },
  { value: 'email', label: '邮件通知' },
  { value: 'site', label: '站内信' },
  { value: 'app', label: 'APP 推送' },
  { value: 'voice', label: '语音通知' },
  { value: 'im', label: '企业消息' },
];

export function BasicCheckboxRow({
  options = NOTIFY_OPTIONS,
  defaultValue = ['sms', 'app'],
}: {
  options?: GridOption[];
  defaultValue?: string[];
}) {
  const [value, setValue] = useState<string[]>(defaultValue);
  return (
    <div className="grid-selector-basic">
      <Checkbox.Group value={value} onChange={(v: any) => setValue(v as string[])}>
        <div className="checkbox-row">
          {options.map((opt) => (
            <div key={opt.value} className="checkbox-row__item">
              <Checkbox value={opt.value}>{opt.label}</Checkbox>
            </div>
          ))}
        </div>
      </Checkbox.Group>
    </div>
  );
}

/* ══════════════════════════════════════════════
   变体 B · 分组多选矩阵
   ══════════════════════════════════════════════ */
const CAPABILITY_OPTIONS: GridOption[] = [
  { value: 'delivery', label: '配送', group: '履约能力' },
  { value: 'pickup', label: '自提', group: '履约能力' },
  { value: 'instore', label: '到店', group: '履约能力' },
  { value: 'coupon', label: '优惠券', group: '营销能力' },
  { value: 'discount', label: '满减活动', group: '营销能力' },
  { value: 'groupbuy', label: '拼团活动', group: '营销能力' },
  { value: 'membership', label: '会员权益', group: '增值服务' },
  { value: 'stored', label: '储值服务', group: '增值服务' },
  { value: 'invoice', label: '发票服务', group: '增值服务' },
  { value: 'report', label: '数据报表', group: '数据能力' },
  { value: 'subscribe', label: '指标订阅', group: '数据能力' },
  { value: 'export', label: '数据导出', group: '数据能力' },
];

/** 分组勾选区：受控组件，选中状态由外层页面统一管理，
 *  因为操作栏和勾选区分别渲染在 label 行与表单控件区，是两个兄弟节点 */
function GroupedCheckboxGrid({
  options,
  selected,
  onChange,
}: {
  options: GridOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, GridOption[]>();
    options.forEach((opt) => {
      const group = opt.group || '默认';
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(opt);
    });
    return map;
  }, [options]);

  return (
    <div className="checkbox-grid-wrapper">
      <Checkbox.Group value={selected} onChange={(v: any) => onChange(v as string[])}>
        <div className="checkbox-grid__groups">
          {[...grouped.entries()].map(([groupName, items]) => (
            <div key={groupName} className="checkbox-grid__group">
              <div className="checkbox-grid__group-title">{groupName}</div>
              <div className="checkbox-grid">
                {items.map((item) => (
                  <div key={item.value} className="checkbox-grid__item">
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Checkbox.Group>
    </div>
  );
}

const NOTIFY_TYPE_OPTIONS: GridOption[] = [
  { value: 'order', label: '订单提醒', group: '交易类' },
  { value: 'refund', label: '退款提醒', group: '交易类' },
  { value: 'settle', label: '结算提醒', group: '交易类' },
  { value: 'comment', label: '评价提醒', group: '互动类' },
  { value: 'consult', label: '咨询提醒', group: '互动类' },
  { value: 'system', label: '系统公告', group: '系统类' },
  { value: 'upgrade', label: '功能升级', group: '系统类' },
];

/** 单个分组多选矩阵的 Form.Item：label 用 labelPosition="top" 让标题行
 *  （标题 + 全选/清空/计数）与勾选区上下排列，而不是与 MTD 默认的左右布局。 */
function CapabilityFormItem({
  title,
  formItemKey,
  options,
  defaultValue = [],
}: {
  title: string;
  formItemKey: string;
  options: GridOption[];
  defaultValue?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(defaultValue);

  const handleSelectAll = () => setSelected(options.map((o) => o.value));
  const handleClearAll = () => setSelected([]);

  const label = (
    <div className="checkbox-grid__label-row">
      <span>{title}</span>
      <div className="checkbox-grid__actions">
        <Button type="primary" shape="text" onClick={handleSelectAll}>全选</Button>
        <Button type="primary" shape="text" onClick={handleClearAll}>清空</Button>
        <span className="checkbox-grid__count">已选 {selected.length} / {options.length}</span>
      </div>
    </div>
  );

  return (
    <Form.Item className="form-item--capability" formItemKey={formItemKey} label={label} labelPosition="top">
      <GroupedCheckboxGrid options={options} selected={selected} onChange={setSelected} />
    </Form.Item>
  );
}

/** 页面装配处：两组分组多选矩阵纵向排列，共用一个 Form 提供 context */
export function CapabilityFormSection() {
  return (
    <Form useContext={true} className="capability-form-section">
      <CapabilityFormItem
        title="开通能力"
        formItemKey="capability"
        options={CAPABILITY_OPTIONS}
        defaultValue={['delivery', 'pickup', 'coupon', 'report']}
      />
      <CapabilityFormItem
        title="消息通知设置"
        formItemKey="notifyType"
        options={NOTIFY_TYPE_OPTIONS}
        defaultValue={['order', 'refund']}
      />
    </Form>
  );
}

/* ══════════════════════════════════════════════
   变体 C · 大数据量勾选（Table + rowSelection）
   ══════════════════════════════════════════════ */
interface StoreRow {
  key: string;
  name: string;
  city: string;
  type: string;
  status: string;
}

const CITY_POOL = ['北京', '上海', '广州', '深圳', '成都', '杭州', '重庆', '武汉'];
const TYPE_POOL = ['直营', '加盟'];
const STATUS_POOL = ['营业中', '营业中', '营业中', '筹备中', '装修中'];

const STORE_ROWS: StoreRow[] = Array.from({ length: 62 }).map((_, i) => ({
  key: `store-${i + 1}`,
  name: `${CITY_POOL[i % CITY_POOL.length]}${['旗舰店', '概念店', '社区店', 'CBD店', '生活广场店'][i % 5]}${i + 1}号`,
  city: CITY_POOL[i % CITY_POOL.length],
  type: TYPE_POOL[i % TYPE_POOL.length],
  status: STATUS_POOL[i % STATUS_POOL.length],
}));

type TagTheme = 'green' | 'blue' | 'orange' | 'red' | 'gray' | 'yellow' | 'brown' | 'purple' | 'lightgray';
const statusTheme: Record<string, TagTheme> = { '营业中': 'green', '筹备中': 'blue', '装修中': 'orange' };

export function TableCheckboxSelector({ rows = STORE_ROWS }: { rows?: StoreRow[] }) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['store-1', 'store-3']);
  const [keyword, setKeyword] = useState('');

  const filteredRows = useMemo(() => {
    if (!keyword.trim()) return rows;
    return rows.filter((row) => row.name.includes(keyword.trim()));
  }, [keyword, rows]);

  const columns = [
    { dataKey: 'name', label: '门店名称', width: 240 },
    { dataKey: 'city', label: '所在城市', width: 100 },
    { dataKey: 'type', label: '门店类型', width: 100 },
    {
      dataKey: 'status',
      label: '经营状态',
      width: 110,
      render: (_: unknown, row: StoreRow) => (
        <Tag theme={statusTheme[row.status] || 'blue'} type="bordered">{row.status}</Tag>
      ),
    },
  ];

  return (
    <div className="grid-selector-table">
      <div className="grid-selector-table__toolbar">
        <Input
          className="grid-selector-table__search"
          placeholder="搜索门店名称"
          value={keyword}
          onChange={(e: any) => setKeyword(e.target?.value ?? e)}
          prefix={<Icon type="search-o" />}
        />
        <span className="grid-selector-table__count">已选 {selectedKeys.length} / {rows.length} 家门店</span>
      </div>
      <Table
        rowKey="key"
        columns={columns}
        data={filteredRows}
        scroll={{ x: true, y: 320 }}
        pagination={{ pageSize: 8 }}
        rowSelection={{ selectedKeys }}
        onSelectChange={(keys: any) => setSelectedKeys(keys as string[])}
      />
    </div>
  );
}
