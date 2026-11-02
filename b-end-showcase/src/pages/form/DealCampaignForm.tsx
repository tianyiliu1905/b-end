/**
 * 创建到店套餐活动 —— 本地生活商家中心
 * 采用「顺序落地页」布局（F1 Sequential Page）：单张白卡，从上到下平铺填写。
 * 覆盖模块：
 *   F1 承载容器（顺序落地页）      F2 表头（面包屑 + 标题 + 描述）
 *   Anchor 锚点导航（分组 > 3 组）  F4 分组分段（5 组）
 *   F5 单栏/多栏布局              F9 复选组（分组多选矩阵 + 全选/清空）
 *   F10 文件上传（图片/按钮/拖拽）  F12 增删标签组
 *   F7 可编辑表格（套餐商品明细）    F11 公式编辑器（优惠计算公式）
 *   F8 只读数据表格（关联门店，含分页 + 状态 Tag）
 *   F3 操作栏
 */
import { useState, useMemo, useRef, useEffect, useCallback, type ReactNode, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Switch,
  Checkbox,
  Cascader,
  Table,
  Pagination,
  Tag,
  Button,
  Icon,
  Tooltip,
  Anchor,
  Breadcrumb,
  Upload,
  RangePicker,
  Row,
  Col,
  message,
} from '@ss/mtd-react3';
import { getDesignSpec, hasDesignSpec } from '../../data/designSpecs';
import './DealCampaignForm.css';

/* ==================== 辅助组件 ==================== */

function LabelWithTip({ text, tip }: { text: string; tip: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {text}
      <Tooltip message={tip} placement="top" size="small">
        <Icon
          type="info-circle-o"
          style={{ marginLeft: 8, fontSize: 14, color: '#8a8f99', cursor: 'pointer' }}
        />
      </Tooltip>
    </span>
  );
}

/* 全局互斥：同一时间只允许一个 FormModuleHover 显示浮层（对齐 ModuleWrapper 行为） */
let formHoverGlobalHide: (() => void) | null = null;

/**
 * 表单模块 hover 标签 —— 对齐 ModuleWrapper 的视觉样式与"复制 Design Spec"能力
 * （#1F2937 深色浮层 + 小三角 + 复制按钮）
 * 使用 position:fixed + portal 渲染到 body，避免被 overflow:hidden/auto 的祖先容器裁切
 */
function FormModuleHover({ moduleId, children, style }: { moduleId: string; children: ReactNode; style?: CSSProperties }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const specAvailable = hasDesignSpec(moduleId);

  const updatePos = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
  }, []);

  const hide = useCallback(() => {
    setShow(false);
    if (formHoverGlobalHide === hide) {
      formHoverGlobalHide = null;
    }
  }, []);

  const handleEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    showTimerRef.current = setTimeout(() => {
      if (formHoverGlobalHide && formHoverGlobalHide !== hide) {
        formHoverGlobalHide();
      }
      formHoverGlobalHide = hide;
      updatePos();
      setShow(true);
    }, 150);
  }, [updatePos, hide]);

  const handleLeave = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    timerRef.current = setTimeout(() => {
      hide();
    }, 200);
  }, [hide]);

  const handleCopySpec = useCallback(() => {
    if (!specAvailable) return;
    const spec = getDesignSpec(moduleId);
    const fallbackCopy = (text: string) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return Promise.resolve();
    };
    const doCopy = (text: string) => {
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      }
      return fallbackCopy(text);
    };
    doCopy(spec).then(() => {
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [moduleId, specAvailable]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (formHoverGlobalHide === hide) {
        formHoverGlobalHide = null;
      }
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, [hide]);

  const tooltip = show && pos ? createPortal(
    <div
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        transform: 'translate(-50%, -100%)',
        zIndex: 2147483647,
        background: '#1F2937',
        color: '#fff',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minWidth: 120,
        maxWidth: 260,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* 模块名称 */}
      <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
        {moduleId}
      </div>

      {/* 复制按钮 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleCopySpec}
          disabled={!specAvailable}
          title={specAvailable ? '复制该模块的 Design Spec' : '暂无 Design Spec，无法复制'}
          style={{
            padding: '3px 10px',
            borderRadius: 4,
            border: specAvailable ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.12)',
            cursor: specAvailable ? 'pointer' : 'not-allowed',
            fontSize: 11,
            fontWeight: 500,
            background: copied ? '#10B981' : 'transparent',
            color: specAvailable ? '#fff' : 'rgba(255,255,255,0.35)',
            opacity: specAvailable ? 1 : 0.6,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              已复制
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1.5" stroke={specAvailable ? 'white' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5"/>
                <path d="M3 11V3C3 2.44772 3.44772 2 4 2H11" stroke={specAvailable ? 'white' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              复制 Spec
            </>
          )}
        </button>
      </div>

      {/* 小三角 */}
      <div style={{
        position: 'absolute',
        bottom: -6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '6px solid #1F2937',
      }} />
    </div>,
    document.body,
  ) : null;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', ...style }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {tooltip}
    </div>
  );
}

/* ==================== 数据类型 ==================== */

interface GridOption {
  value: string;
  label: string;
  group?: string;
}

interface TagGroup {
  key: string;
  label: string;
  tags: string[];
}

interface SkuRow {
  key: string;
  name: string;
  spec: string;
  originalPrice: number | null;
  count: number | null;
}

interface StoreRow {
  id: string;
  name: string;
  city: string;
  type: string;
  status: string;
}

/* ==================== 静态数据 ==================== */

// 适用范围（F9 分组多选矩阵）
const SERVICE_OPTIONS: GridOption[] = [
  { value: 'dine-in', label: '到店堂食', group: '到店场景' },
  { value: 'self-pickup', label: '到店自提', group: '到店场景' },
  { value: 'reserve', label: '在线预订', group: '到店场景' },
  { value: 'queue', label: '排队取号', group: '到店场景' },
  { value: 'weekday', label: '工作日可用', group: '核销时段' },
  { value: 'weekend', label: '周末可用', group: '核销时段' },
  { value: 'holiday', label: '法定节假日可用', group: '核销时段' },
  { value: 'all-day', label: '全天可用', group: '核销时段' },
  { value: 'new-user', label: '新客专享', group: '人群限制' },
  { value: 'member', label: '会员专享', group: '人群限制' },
  { value: 'no-limit', label: '不限人群', group: '人群限制' },
];

// 门店品类（Cascader）
const CATEGORY_OPTIONS = [
  {
    value: 'food',
    label: '美食',
    children: [
      { value: 'hotpot', label: '火锅' },
      { value: 'bbq', label: '烧烤' },
      { value: 'cafe', label: '咖啡厅' },
      { value: 'fastfood', label: '快餐简餐' },
    ],
  },
  {
    value: 'leisure',
    label: '休闲娱乐',
    children: [
      { value: 'ktv', label: 'KTV' },
      { value: 'cinema', label: '电影院' },
    ],
  },
  {
    value: 'beauty',
    label: '丽人美容',
    children: [
      { value: 'hair', label: '美发' },
      { value: 'spa', label: 'SPA 养生' },
    ],
  },
];

// 关联门店（F8）
const STORE_ROWS: StoreRow[] = [
  { id: 's1', name: '川小馆·火锅（万象城店）', city: '杭州', type: '火锅', status: 'active' },
  { id: 's2', name: '川小馆·火锅（西溪银泰店）', city: '杭州', type: '火锅', status: 'active' },
  { id: 's3', name: '川小馆·火锅（滨江宝龙店）', city: '杭州', type: '火锅', status: 'pending' },
  { id: 's4', name: '川小馆·火锅（陆家嘴店）', city: '上海', type: '火锅', status: 'active' },
  { id: 's5', name: '川小馆·火锅（南京西路店）', city: '上海', type: '火锅', status: 'inactive' },
  { id: 's6', name: '川小馆·火锅（天河城店）', city: '广州', type: '火锅', status: 'active' },
  { id: 's7', name: '川小馆·火锅（春熙路店）', city: '成都', type: '火锅', status: 'active' },
  { id: 's8', name: '川小馆·火锅（太古里店）', city: '成都', type: '火锅', status: 'pending' },
];

const STORE_STATUS_MAP: Record<string, { label: string; theme: 'green' | 'orange' | 'red' | 'gray' }> = {
  active: { label: '营业中', theme: 'green' },
  pending: { label: '待开业', theme: 'orange' },
  inactive: { label: '已停业', theme: 'red' },
};

// 锚点分组（F4 分组 id 与 Anchor href 一一对应）
const ANCHOR_ITEMS = [
  { key: 'group-basic', href: '#group-basic', title: '基本信息' },
  { key: 'group-scope', href: '#group-scope', title: '适用范围' },
  { key: 'group-rule', href: '#group-rule', title: '优惠与佣金规则' },
  { key: 'group-material', href: '#group-material', title: '活动素材与标签' },
  { key: 'group-sku', href: '#group-sku', title: '套餐商品明细' },
  { key: 'group-store', href: '#group-store', title: '关联门店' },
];

let skuSeq = 0;
const createSkuRow = (): SkuRow => ({
  key: `sku_${++skuSeq}`,
  name: '',
  spec: '',
  originalPrice: null,
  count: 1,
});

/* ==================== F12 单行标签组 ==================== */

function TagGroupRow({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (inputVisible && inputRef.current) inputRef.current.focus?.();
  }, [inputVisible]);

  const handleClose = (removed: string) => onChange(tags.filter((t) => t !== removed));

  const handleConfirm = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className="deal-tag-group-row">
      {tags.map((tag) => (
        <Tag key={tag} closeable theme="blue" onClose={() => handleClose(tag)}>
          {tag}
        </Tag>
      ))}
      {inputVisible ? (
        <Input
          ref={inputRef}
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleConfirm}
          onPressEnter={handleConfirm}
          style={{ width: 120 }}
        />
      ) : (
        <Tag
          theme="gray"
          onClick={() => setInputVisible(true)}
          style={{ borderStyle: 'dashed', cursor: 'pointer' }}
        >
          + 添加标签
        </Tag>
      )}
    </div>
  );
}

/* ==================== F11 公式编辑器（变体 B · 计算公式配置型）==================== */

// 佣金计算基数的可选口径
const COMMISSION_BASE_METHODS = ['套餐售价', '套餐原价合计', '售价与原价孰高', '售价与原价孰低'];

interface FormulaConfig {
  base: string; // 佣金计算基数口径
  deductPromo: boolean; // 是否扣减活动补贴
  deductServiceFee: boolean; // 是否扣减技术服务费
}

function FormulaTemplateEditor({
  value,
  onChange,
  onDelete,
}: {
  value: { default: FormulaConfig; exception: FormulaConfig };
  onChange: (next: { default: FormulaConfig; exception: FormulaConfig }) => void;
  onDelete: (group: 'default' | 'exception') => void;
}) {
  const patch = (group: 'default' | 'exception', delta: Partial<FormulaConfig>) =>
    onChange({ ...value, [group]: { ...value[group], ...delta } });

  const renderFormulaRow = (label: string, group: 'default' | 'exception') => {
    const cfg = value[group];
    return (
      <div className="deal-formula-config-row">
        <span className="deal-formula-config-row__label">{label}</span>
        <div className="deal-formula-config-row__body">
          {/* 主公式行 */}
          <div className="deal-formula-template">
            <span className="deal-formula-fixed-text">商家实收</span>
            <span className="deal-formula-template__op">=</span>
            <span className="deal-formula-fixed-text">套餐售价</span>
            <span className="deal-formula-template__op">×</span>
            <span className="deal-formula-fixed-text">（1 − 平台佣金费率）</span>
            <span className="deal-formula-template__op">−</span>
            <Checkbox
              checked={cfg.deductPromo}
              onChange={() => patch(group, { deductPromo: !cfg.deductPromo })}
            />
            <span className="deal-formula-fixed-text">套餐原价合计 × 活动补贴比例</span>
            <span className="deal-formula-template__op">−</span>
            <Checkbox
              checked={cfg.deductServiceFee}
              onChange={() => patch(group, { deductServiceFee: !cfg.deductServiceFee })}
            />
            <span className="deal-formula-fixed-text">技术服务费</span>
          </div>
          {/* 子公式行 */}
          <div className="deal-formula-sub-formula">
            <div className="deal-formula-template">
              <span className="deal-formula-fixed-text">其中：佣金计算基数</span>
              <span className="deal-formula-template__op">=</span>
              <Select
                value={cfg.base}
                onChange={(v) => patch(group, { base: v as string })}
                style={{ width: 180 }}
              >
                {COMMISSION_BASE_METHODS.map((m) => (
                  <Select.Option key={m} value={m}>
                    {m}
                  </Select.Option>
                ))}
              </Select>
              <span className="deal-formula-template__op">×</span>
              <span className="deal-formula-fixed-text">平台佣金费率</span>
            </div>
          </div>
        </div>
        {/* 删除该规则：右侧轻量 icon 按钮（不用强调色文字按钮） */}
        <button
          type="button"
          className="deal-formula-config-row__delete"
          aria-label="删除该规则"
          onClick={() => onDelete(group)}
        >
          <Icon type="delete-o" />
        </button>
      </div>
    );
  };

  return (
    <div className="deal-formula-config-container">
      {renderFormulaRow('默认计算配置', 'default')}
      <div className="deal-formula-config-divider" />
      {renderFormulaRow('例外计算配置', 'exception')}
    </div>
  );
}

/* ==================== 主组件 ==================== */

export default function DealCampaignForm() {
  // F5 基本信息
  const [form, setForm] = useState({
    name: '',
    channel: undefined as string | undefined,
    category: [] as string[],
    period: undefined as [Date, Date] | undefined,
    dealPrice: null as number | string | null,
    stock: null as number | string | null,
    priority: 'normal',
    autoRenew: true,
  });

  // F9 适用范围（分组多选矩阵）
  const [services, setServices] = useState<string[]>(['dine-in', 'all-day', 'no-limit']);

  // F12 标签组
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([
    { key: 'feature', label: '套餐特色', tags: ['免预约', '不限使用人数'] },
    { key: 'crowd', label: '适用人群', tags: ['家庭聚餐'] },
    { key: 'promote', label: '推广渠道', tags: [] },
  ]);

  // F7 套餐商品明细
  const [skuRows, setSkuRows] = useState<SkuRow[]>([
    { key: 'sku_init_1', name: '招牌毛肚', spec: '半份', originalPrice: 38, count: 1 },
    { key: 'sku_init_2', name: '鲜切牛肉', spec: '一份', originalPrice: 48, count: 1 },
  ]);

  // F11 公式（变体 B · 计算公式配置型）
  const [formulaConfig, setFormulaConfig] = useState<{
    default: FormulaConfig;
    exception: FormulaConfig;
  }>({
    default: { base: '套餐售价', deductPromo: true, deductServiceFee: false },
    exception: { base: '售价与原价孰高', deductPromo: false, deductServiceFee: true },
  });

  // F8 分页
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  /* ---------- F9 分组 + 全选/清空 ---------- */
  const groupedServices = useMemo(() => {
    const map = new Map<string, GridOption[]>();
    SERVICE_OPTIONS.forEach((opt) => {
      const g = opt.group || '默认';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(opt);
    });
    return map;
  }, []);

  const handleSelectAllServices = () => setServices(SERVICE_OPTIONS.map((o) => o.value));
  const handleClearServices = () => setServices([]);

  /* ---------- F7 表格操作 ---------- */
  const handleSkuChange = (key: string, field: keyof SkuRow, value: any) => {
    setSkuRows((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  };
  const handleAddSku = () => setSkuRows((prev) => [...prev, createSkuRow()]);
  const handleDeleteSku = (key: string) => setSkuRows((prev) => prev.filter((row) => row.key !== key));

  const skuTotal = useMemo(
    () => skuRows.reduce((sum, r) => sum + (r.originalPrice || 0) * (r.count || 0), 0),
    [skuRows]
  );

  const skuColumns = [
    {
      label: '商品名称',
      dataKey: 'name',
      render: (_v: string, row: SkuRow) => (
        <Input
          value={row.name}
          placeholder="请输入商品名称"
          onChange={(val) => handleSkuChange(row.key, 'name', val)}
        />
      ),
    },
    {
      label: '规格',
      dataKey: 'spec',
      width: 160,
      render: (_v: string, row: SkuRow) => (
        <Input
          value={row.spec}
          placeholder="如 半份 / 一份"
          onChange={(val) => handleSkuChange(row.key, 'spec', val)}
        />
      ),
    },
    {
      label: '原价（元）',
      dataKey: 'originalPrice',
      width: 140,
      render: (_v: number | null, row: SkuRow) => (
        <InputNumber
          value={row.originalPrice}
          placeholder="请输入"
          min={0}
          precision={2}
          style={{ width: '100%' }}
          onChange={(val) => handleSkuChange(row.key, 'originalPrice', val)}
        />
      ),
    },
    {
      label: '数量',
      dataKey: 'count',
      width: 120,
      render: (_v: number | null, row: SkuRow) => (
        <InputNumber
          value={row.count}
          placeholder="请输入"
          min={1}
          precision={0}
          style={{ width: '100%' }}
          onChange={(val) => handleSkuChange(row.key, 'count', val)}
        />
      ),
    },
    {
      label: '操作',
      dataKey: 'actions',
      width: 60,
      render: (_v: any, row: SkuRow) => (
        <Button
          shape="text"
          type="primary"
          onClick={() => handleDeleteSku(row.key)}
          disabled={skuRows.length <= 1}
        >
          删除
        </Button>
      ),
    },
  ];

  /* ---------- F8 只读表格 ---------- */
  const pagedStores = useMemo(() => {
    const start = (current - 1) * pageSize;
    return STORE_ROWS.slice(start, start + pageSize);
  }, [current, pageSize]);

  const storeColumns = [
    { label: '门店名称', dataKey: 'name' },
    { label: '所在城市', dataKey: 'city', width: 100 },
    { label: '门店类型', dataKey: 'type', width: 100 },
    {
      label: '经营状态',
      dataKey: 'status',
      width: 110,
      render: (val: string) => {
        const info = STORE_STATUS_MAP[val] || { label: val, theme: 'gray' as const };
        return (
          <Tag theme={info.theme} type="bordered" size="small">
            {info.label}
          </Tag>
        );
      },
    },
    {
      label: '操作',
      dataKey: 'action',
      width: 80,
      render: (_v: unknown, row: StoreRow) => <a onClick={() => message.info({ message: `查看门店：${row.name}` })}>查看</a>,
    },
  ];

  /* ---------- 操作栏 ---------- */
  const handleCancel = () => window.history.back();
  const handleSaveDraft = () => message.success({ message: '活动已保存为草稿' });
  const handlePublish = () => message.success({ message: '到店套餐活动已提交发布审核' });

  return (
    <div className="deal-page-container">
      <div className="deal-page-card">
        {/* ===== F2 表头（面包屑 + 标题 + 描述），有 Anchor 去掉底线 ===== */}
        <FormModuleHover moduleId="F2 表头信息区">
        <div className="deal-page-header deal-page-header--no-border">
          <div className="deal-page-header__breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item>营销中心</Breadcrumb.Item>
              <Breadcrumb.Item>到店营销</Breadcrumb.Item>
              <Breadcrumb.Item>创建到店套餐活动</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="deal-page-header__title">创建到店套餐活动</h1>
          <p className="deal-page-header__desc">
            配置一款到店核销的团购套餐活动，完善基本信息、活动素材、商品明细与优惠规则后即可提交审核。
          </p>
        </div>
        </FormModuleHover>

        {/* ===== Anchor 锚点导航（分组 5 组 > 3）— 放在 page-header 外部、scroll-content 外部，
             作为 page-card 直接子节点，sticky 才能生效（F1/F2 §6.2 硬约束）===== */}
        <div className="deal-page-header__anchor">
          <Anchor
            direction="horizontal"
            type="card"
            affix={false}
            getContainer={() => (document.querySelector('.deal-scroll-content') as HTMLElement) || window}
            items={ANCHOR_ITEMS}
          />
        </div>

        {/* ===== 可滚动内容区 ===== */}
        <div className="deal-scroll-content">
          {/* ---------- F5 基本信息（单栏：表单占左 2/4，右 2/4 留白）+ F9 适用范围 ---------- */}
          <FormModuleHover moduleId="F4 分组分段 + F5 单栏布局">
          <Row>
            <Col span={12}>
              <Form className="deal-section-form" labelPosition="right" labelWidth="120px" useContext={true}>
                <div className="deal-form-section" id="group-basic">
                  <h3 className="deal-form-section__title">基本信息</h3>

                  <Form.Item formItemKey="name" label="活动名称" required>
                    <Input placeholder="请输入活动名称，如 双人畅吃火锅套餐" toFormItem />
                  </Form.Item>
                  <Form.Item formItemKey="channel" label="投放渠道" required>
                    <Select placeholder="请选择投放渠道" toFormItem>
                      <Select.Option value="meituan">美团 App</Select.Option>
                      <Select.Option value="dianping">大众点评</Select.Option>
                      <Select.Option value="both">美团 + 点评双端</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item formItemKey="category" label="门店品类" required>
                    <Cascader
                      value={form.category}
                      data={CATEGORY_OPTIONS}
                      placeholder="请选择门店品类"
                      onChange={(val) => setForm((f) => ({ ...f, category: val as string[] }))}
                      toFormItem
                    />
                  </Form.Item>
                  <Form.Item formItemKey="period" label="活动周期" required>
                    <RangePicker
                      picker="date"
                      single
                      separator="至"
                      placeholder={['开始日期', '结束日期']}
                      toFormItem
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item formItemKey="dealPrice" label="套餐售价（元）" required>
                    <InputNumber
                      value={form.dealPrice}
                      placeholder="请输入售价"
                      min={0}
                      precision={2}
                      style={{ width: '100%' }}
                      onChange={(val) => setForm((f) => ({ ...f, dealPrice: val }))}
                      toFormItem
                    />
                  </Form.Item>
                  <Form.Item formItemKey="stock" label="限量库存（份）">
                    <InputNumber
                      value={form.stock}
                      placeholder="不填表示不限量"
                      min={0}
                      precision={0}
                      style={{ width: '100%' }}
                      onChange={(val) => setForm((f) => ({ ...f, stock: val }))}
                      toFormItem
                    />
                  </Form.Item>
                  <Form.Item formItemKey="priority" label="展示优先级">
                    <Radio.Group
                      value={form.priority}
                      onChange={(val) => setForm((f) => ({ ...f, priority: val as string }))}
                      toFormItem
                    >
                      <Radio value="high">优先推荐</Radio>
                      <Radio value="normal">普通</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item formItemKey="autoRenew" label="到期自动续期">
                    <Switch
                      checked={form.autoRenew}
                      onChange={(e) => setForm((f) => ({ ...f, autoRenew: e.target.checked }))}
                    />
                  </Form.Item>
                </div>
              </Form>
            </Col>
          </Row>
          </FormModuleHover>

          {/* F9 适用范围：分组多选矩阵 + 全选/清空（按规范上移至 Form.Item label 行）*/}
          <FormModuleHover moduleId="F9 复选组（分组多选矩阵）">
          <div className="deal-form-section" id="group-scope">
            <h3 className="deal-form-section__title">适用范围</h3>
            <Form className="deal-section-form" labelPosition="top" useContext={true}>
              <Form.Item
                className="deal-form-item--capability"
                formItemKey="services"
                label={
                  <div className="deal-checkbox-grid__label-row">
                    <span>适用场景与人群</span>
                    <div className="deal-checkbox-grid__actions">
                      <Button type="primary" shape="text" onClick={handleSelectAllServices}>
                        全选
                      </Button>
                      <Button type="primary" shape="text" onClick={handleClearServices}>
                        清空
                      </Button>
                      <span className="deal-checkbox-grid__count">
                        已选 {services.length} / {SERVICE_OPTIONS.length}
                      </span>
                    </div>
                  </div>
                }
              >
                <div className="deal-checkbox-grid-wrapper">
                  <Checkbox.Group value={services} onChange={(v) => setServices(v as string[])}>
                    <div className="deal-checkbox-grid__groups">
                      {[...groupedServices.entries()].map(([groupName, items]) => (
                        <div key={groupName} className="deal-checkbox-grid__group">
                          <div className="deal-checkbox-grid__group-title">{groupName}</div>
                          <div className="deal-checkbox-grid">
                            {items.map((item) => (
                              <div key={item.value} className="deal-checkbox-grid__item">
                                <Checkbox value={item.value}>{item.label}</Checkbox>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Checkbox.Group>
                </div>
              </Form.Item>
            </Form>
          </div>
          </FormModuleHover>

          {/* ---------- F11 优惠与佣金规则（公式编辑器 · 计算公式配置型）---------- */}
          <FormModuleHover moduleId="F11 公式编辑器">
          <div className="deal-form-section" id="group-rule">
            <h3 className="deal-form-section__title">优惠与佣金规则</h3>
            <p className="deal-form-section__hint">
              配置商家实收金额的计算方式，勾选参与扣减的项、选择佣金计算基数口径。
            </p>
            <FormulaTemplateEditor
              value={formulaConfig}
              onChange={setFormulaConfig}
              onDelete={(group) =>
              message.warning({ message: `示例：删除${group === 'default' ? '默认' : '例外'}计算配置` })
            }
            />
          </div>
          </FormModuleHover>

          {/* ---------- F10 活动素材 + F12 标签组 ---------- */}
          <FormModuleHover moduleId="F10 文件上传 + F12 增删标签组">
          <div className="deal-form-section" id="group-material">
            <h3 className="deal-form-section__title">活动素材与标签</h3>

            <Form className="deal-section-form" labelPosition="top" useContext={true}>
              <Form.Item
                formItemKey="cover"
                className="deal-upload-item"
                label={<LabelWithTip text="活动主图" tip="建议尺寸 750×750，支持 JPG/PNG，单张不超过 5MB，最多 3 张" />}
                span={24}
              >
                <Upload.ImageUpload action="/api/upload" accept="image/*" listType="picture-card" shape="square" limit={3} />
              </Form.Item>
            </Form>

            {/* F12 增删标签组 */}
            <div className="deal-tag-groups-block">
              <Form useContext labelPosition="left" labelWidth="7em">
                {tagGroups.map((group) => (
                  <Form.Item key={group.key} label={group.label}>
                    <TagGroupRow
                      tags={group.tags}
                      onChange={(newTags) =>
                        setTagGroups((prev) => prev.map((g) => (g.key === group.key ? { ...g, tags: newTags } : g)))
                      }
                    />
                  </Form.Item>
                ))}
              </Form>
            </div>
          </div>
          </FormModuleHover>

          {/* ---------- F7 套餐商品明细 ---------- */}
          <FormModuleHover moduleId="F7 可编辑表格">
          <div className="deal-form-section" id="group-sku">
            <h3 className="deal-form-section__title">套餐商品明细</h3>
            <div className="deal-editable-table">
              <Table columns={skuColumns} data={skuRows} rowKey="key" pagination={false} />
              <Button
                className="deal-editable-table__add-row"
                shape="text"
                type="primary"
                onClick={handleAddSku}
                icon="add"
              >
                添加商品
              </Button>
              <div className="deal-editable-table__summary">
                套餐原价合计：<strong>¥{skuTotal.toFixed(2)}</strong>
              </div>
            </div>
          </div>
          </FormModuleHover>

          {/* ---------- F8 关联门店（只读表格 + 分页）---------- */}
          <FormModuleHover moduleId="F8 只读数据表格">
          <div className="deal-form-section" id="group-store">
            <h3 className="deal-form-section__title">关联门店</h3>
            <div className="deal-readonly-table">
              <Table
                columns={storeColumns}
                data={pagedStores}
                rowKey="id"
                bordered="row"
                emptyText="暂无关联门店"
              />
              <div className="deal-readonly-table__pagination">
                <Pagination
                  current={current}
                  pageSize={pageSize}
                  total={STORE_ROWS.length}
                  onChange={(page, size) => {
                    setCurrent(page);
                    setPageSize(size);
                  }}
                  showSizeChanger
                  showTotal
                />
              </div>
            </div>
          </div>
          </FormModuleHover>
        </div>

        {/* ===== F3 操作栏 ===== */}
        <FormModuleHover moduleId="F3 操作栏">
        <div className="deal-action-bar">
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={handleSaveDraft}>存草稿</Button>
          <Button type="primary" onClick={handlePublish}>
            提交发布
          </Button>
        </div>
        </FormModuleHover>
      </div>
    </div>
  );
}
