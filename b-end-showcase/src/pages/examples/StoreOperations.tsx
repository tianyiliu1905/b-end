/// <reference types="vite/client" />
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Drawer, Empty, Icon, Input, Menu, Pagination, Select, Table, Tabs, Tag } from '@ss/mtd-react3';
import { EMPTY_FILTERS, INITIAL_STORES, filterStores, storesToCsv, summarizeStores, type StoreFilters, type StoreRecord } from './storeData';
import styles from './StoreOperations.module.css';
import { useTheme, type ThemeKey } from '../../theme/useTheme';

const cities = ['上海', '杭州', '北京', '成都'];
const statuses = ['营业中', '筹备中', '休息中'];
const money = (n: number) => n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const statusTheme = (status: string) => status === '营业中' ? 'green' : status === '筹备中' ? 'orange' : 'gray';
const pageSize = 8;

export default function StoreOperations() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const title = document.title; document.title = '门店经营管理 | Skill 实测';
    return () => { document.title = title; };
  }, []);
  const [stores, setStores] = useState(INITIAL_STORES);
  const [draft, setDraft] = useState<StoreFilters>({ ...EMPTY_FILTERS });
  const [applied, setApplied] = useState<StoreFilters>({ ...EMPTY_FILTERS });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1000);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const filtered = useMemo(() => filterStores(stores, applied), [stores, applied]);
  const summary = useMemo(() => summarizeStores(filtered), [filtered]);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const detail = stores.find(row => row.id === detailId);
  const filteredView = Boolean(applied.keyword || applied.city || applied.status);

  function applyFilters(next: StoreFilters) {
    clearTimeout(timer.current);
    setLoading(true);
    setSelected([]);
    setNotice('');
    timer.current = setTimeout(() => { setApplied({ ...next }); setPage(1); setLoading(false); }, 350);
  }
  function toggleFollow(id: string) {
    setStores(rows => rows.map(row => row.id === id ? { ...row, followed: !row.followed } : row));
  }
  function bulkFollow() {
    setStores(rows => rows.map(row => selected.includes(row.id) ? { ...row, followed: true } : row));
    setNotice(`已将 ${selected.length} 家门店加入关注`);
    setSelected([]);
  }
  function exportCsv() {
    const rows = selected.length ? filtered.filter(r => selected.includes(r.id)) : filtered;
    const url = URL.createObjectURL(new Blob([storesToCsv(rows)], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url; link.download = '门店经营数据.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`已导出 ${rows.length} 家门店的经营数据`);
  }
  const columns = [
    { label: '门店信息', dataKey: 'name', render: (_: unknown, row: StoreRecord) => (
      <div className={styles.storeCell}><span className={styles.thumbnail}><Icon type="location-o" /></span>
        <div><span className={styles.storeName}>{row.name}</span><span className={styles.secondary}>{row.id} · {row.district}区</span></div></div>) },
    { label: '城市', dataKey: 'city', width: 80 },
    { label: '经营状态', dataKey: 'status', width: 112, render: (value: string) => <Tag theme={statusTheme(value)} type="pure" size="small">{value}</Tag> },
    { label: '月营业额（元）', dataKey: 'revenue', width: 146, render: (value: number) => <span className={styles.numeric}>{money(value)}</span> },
    { label: '月订单量', dataKey: 'orders', width: 100, render: (value: number) => <span className={styles.numeric}>{value.toLocaleString('zh-CN')}</span> },
    { label: '负责人', dataKey: 'manager', width: 88 },
    { label: '操作', dataKey: 'id', width: 132, render: (_: string, row: StoreRecord) => <div className={styles.rowActions}>
      <Button shape="text" size="small" onClick={() => setDetailId(row.id)}>查看</Button>
      <Button shape="text" size="small" onClick={() => toggleFollow(row.id)} aria-label={`${row.followed ? '取消关注' : '关注'}${row.name}`}>{row.followed ? '已关注' : '关注'}</Button>
    </div> },
  ];
  return <div className={`${styles.shell} ${collapsed ? styles.collapsed : ''}`}>
    <header className={styles.topbar}>
      <div className={styles.brand}><span className={styles.brandMark}><Icon type="location-o" /></span>谷里经营台</div>
      <div className={styles.topTabs}><Tabs activeKey="stores" onChange={key => navigate(key === 'templates' ? '/' : '/examples/store-operations')}>
        <Tabs.TabPane key="stores" label="门店经营" /><Tabs.TabPane key="templates" label="设计知识库" />
      </Tabs></div>
      <span className={styles.workspace}>谷里咖啡 <span className={styles.divider}>/</span> 华东运营组</span>
      <Select aria-label="页面主题" size="small" value={theme} onlyKeyValue clearable={false} filterable={false} style={{ width: 100 }}
        options={[{ label: '工具蓝', value: 'primary' }, { label: '美团黄', value: 'brand-yellow' }]} onChange={value => setTheme(value as ThemeKey)} />
      <span className={styles.avatar}>林</span>
    </header>
    <aside className={styles.sidebar}>
      <span className={styles.navCaption}>{collapsed ? '运营' : '运营工作空间'}</span>
      <Menu selectedKeys={['stores']} inlineCollapsed={collapsed} onSelectChange={key => {
        if (key === 'overview') navigate('/dashboard/overview');
        if (key === 'library') navigate('/modules');
      }}>
        <Menu.Item key="overview" icon="areachart-o">经营总览</Menu.Item>
        <Menu.Item key="stores" icon="location-o">门店管理</Menu.Item>
        <Menu.Item key="library" icon="areachart-o">模块知识库</Menu.Item>
      </Menu>
      <div className={styles.sideFooter}><Button shape="text" icon={collapsed ? 'expand' : 'collapse'} onClick={() => setCollapsed(v => !v)} aria-label={collapsed ? '展开侧栏' : '收起侧栏'}>{collapsed ? '' : '收起侧栏'}</Button></div>
    </aside>
    <main className={styles.main}>
      <div className={styles.breadcrumb}>门店经营 <span>/</span> 门店管理</div>
      <section className={styles.pageHeading}>
        <div><h1>门店管理</h1><p>掌握门店经营状态，让每一次运营都有据可依。</p></div>
        <Tag theme="gray" type="pure">2026 年 10 月 · 模拟数据</Tag>
      </section>
      <section className={styles.metrics} aria-label="门店经营概览">
        {[
          ['门店总数', summary.total.toLocaleString(), '家', filteredView ? '当前筛选范围内的门店' : '当前管理的全部门店'],
          ['营业门店', summary.operating.toLocaleString(), '家', '正在营业，持续创造价值'],
          ['筹备门店', summary.preparing.toLocaleString(), '家', '开业筹备，关注落地进度'],
          ['月营业额', (summary.revenue / 10000).toFixed(2), '万元', '2026 年 10 月营业额合计'],
        ].map(([title, value, unit, subtitle]) => <Card key={title} className={styles.metric}>
          <div className={styles.metricTitle}>{title}<span>{filteredView ? '筛选结果' : '全量门店'}</span></div>
          <div className={styles.metricValue}>{value}<span>{unit}</span></div>
          <div className={styles.metricNote}>{subtitle}</div>
        </Card>)}
      </section>
      <section className={styles.filterPanel} aria-label="门店筛选">
        <div className={styles.filterField}><label htmlFor="store-search">门店搜索</label><Input id="store-search" prefix="search" placeholder="门店名称 / 编号 / 负责人" value={draft.keyword}
          onChange={event => setDraft(f => ({ ...f, keyword: event.target.value }))} onPressEnter={() => applyFilters(draft)} /></div>
        <div className={styles.filterField}><span>所在城市</span><Select aria-label="所在城市" value={draft.city} onlyKeyValue clearable={false} filterable={false}
          options={[{ label: '全部城市', value: '' }, ...cities.map(city => ({ label: city, value: city }))]} onChange={value => setDraft(f => ({ ...f, city: String(value) }))} /></div>
        <div className={styles.filterField}><span>经营状态</span><Select aria-label="经营状态" value={draft.status} onlyKeyValue clearable={false} filterable={false}
          options={[{ label: '全部状态', value: '' }, ...statuses.map(status => ({ label: status, value: status }))]} onChange={value => setDraft(f => ({ ...f, status: String(value) }))} /></div>
        <div className={styles.filterActions}><Button onClick={() => { setDraft({ ...EMPTY_FILTERS }); applyFilters(EMPTY_FILTERS); }}>重置</Button><Button type="primary" loading={loading} onClick={() => applyFilters(draft)}>查询</Button></div>
      </section>
      <section className={styles.tablePanel} aria-label="门店列表">
        <div className={styles.tableHeading}><div><h2>门店列表 <span>{filtered.length}</span></h2><p>经营数据随查询条件同步更新</p></div>
          <Button disabled={!filtered.length || loading} onClick={exportCsv}>{selected.length ? '导出选中' : '导出结果'}</Button></div>
        <div className={styles.selectionBar}><span>{selected.length ? `已选择 ${selected.length} 家门店` : '选择门店，可批量加入关注'}</span>
          <Button size="small" disabled={!selected.length || loading} onClick={bulkFollow}>批量关注</Button>
          {selected.length > 0 && <Button size="small" shape="text" onClick={() => setSelected([])}>取消选择</Button>}
          <span className={styles.feedback} role="status">{notice}</span></div>
        <div className={styles.tableViewport}><Table rowKey="id" data={visible} columns={columns} loading={loading} pagination={false}
          rowSelection={{ selectedKeys: selected, multiple: true }} onSelectChange={keys => setSelected(keys as string[])}
          emptyText={() => <Empty title="暂无匹配门店" description="试试调整关键词、城市或经营状态" />} /></div>
        <div className={styles.pagination}><span>共 {filtered.length} 家门店 · 每页 {pageSize} 条</span><Pagination total={filtered.length} pageSize={pageSize} current={page} onChange={next => { setPage(next); setSelected([]); }} /></div>
      </section>
      <p className={styles.footnote}>本页使用模拟经营数据；关注状态仅在当前页面会话内保留。</p>
    </main>
    <Drawer title="门店详情" width="min(640px, 100vw)" visible={Boolean(detail)} onClose={() => setDetailId(null)}>
      {detail && <div className={styles.detail}><div className={styles.detailHeading}><span className={styles.thumbnail}><Icon type="location-o" /></span><div><h2>{detail.name}</h2><span className={styles.secondary}>{detail.id}</span></div></div>
        <Tag theme={statusTheme(detail.status)} type="pure">{detail.status}</Tag>
        <h3>基本信息</h3><dl className={styles.description}>{[
          ['门店编号', detail.id], ['所在城市', detail.city], ['负责人', detail.manager], ['开业日期', detail.openedAt],
          ['门店评分', detail.rating], ['关注状态', detail.followed ? '已关注' : '未关注'],
        ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <div className={styles.address}><span>详细地址</span><p>{detail.address}</p></div>
        <h3>2026 年 10 月经营数据</h3><dl className={styles.description}><div><dt>月营业额</dt><dd>¥ {money(detail.revenue)}</dd></div><div><dt>月订单量</dt><dd>{detail.orders.toLocaleString()} 单</dd></div></dl>
      </div>}
    </Drawer>
  </div>;
}
