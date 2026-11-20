import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import { useEffect, useRef, useState } from 'react';

/** L2 模块编号 → 中文名（新编号体系 v4：D 系列以图表类型为单位） */
const MODULE_NAMES: Record<string, string> = {
  'G-1': '顶部导航',
  'G-2': '侧边栏',
  'G-3': '筛选器栏',
  'G-4': '数据表格',
  'D-1': '指标卡片组',
  'D-2': '环形进度',
  'D-3': '折线图',
  'D-4': '柱状图',
  'D-5': '双轴组合图',
  'D-6': '漏斗图',
  'D-7': '饼/环图',
  'D-8': '堆叠进度条',
  'D-9': '排名条形图',
  'D-10': '散点图',
  'D-11': 'AI摘要卡',
  'D-12': '雷达图',
  'D-13': '仪表盘',
  'D-14': '热力图',
  'D-15': '玫瑰图',
  'W-1': '欢迎栏',
  'W-2': '操作引导卡',
  'W-3': '快捷入口',
  'W-4': '个人信息',
  'W-5': '公告通知',
  'L-3': '筛选器栏',
  'L-4': '操作栏',
  'L-5': '数据表格',
  'F-1': '表单主体',
  'F-2': '操作区',
  'F-3': '步骤条',
  'DT-1': '详情头部',
  'DT-2': '信息分组',
  'DT-3': '指标摘要',
  'DT-4': '明细表格',
  'DT-5': '时间线',
};

const dashboardEntries = [
  { path: '/dashboard/overview', title: '大盘数据通览', tag: '浏览', desc: '图表多、筛选弱、纯展示/只读概览，涵盖全部 data visualization 类型', modules: ['G-3', 'D-1', 'D-2', 'D-3', 'D-4', 'D-5', 'D-6', 'D-7', 'D-8', 'D-9', 'D-10', 'D-12', 'D-13', 'D-14', 'D-15', 'G-4'], featured: true },
  { path: '/dashboard/ai-summary', title: 'AI 总结', tag: '浏览', desc: '顶部 AI 诊断摘要卡 + 指标卡 + 趋势图，先看结论再看数据', modules: ['G-3', 'D-11', 'D-1', 'D-3', 'D-9'] },
  { path: '/dashboard/filter-table', title: '筛选+表格', tag: '操作', desc: '复杂筛选 + 底部大表格 + 操作列，以查询/操作为主', modules: ['G-3', 'D-1', 'G-4'] },
  { path: '/dashboard/workbench', title: '工作台', tag: '操作', desc: '快捷入口网格 + 操作引导卡 + 轻量指标，偏门户/导航', modules: ['W-1', 'W-2', 'D-1', 'G-4', 'W-3', 'W-4', 'W-5'] },
];

const listEntries = [
  { path: '/showcase/store-operations', title: 'Skill 实测 · 门店经营管理', desc: '有依据的 Spec → 指标 + 筛选 + 图文表格，支持批量关注、CSV 导出和详情抽屉', modules: ['G-1', 'G-2', 'D-1', 'G-3', 'G-4'], featured: true },
  { path: '/list/crud', title: 'CRUD 管理列表', desc: '筛选栏 + 操作工具条 + 数据表格（带切换tab）+ 分页', modules: ['G-1', 'G-2', 'G-3', 'G-4'], featured: true },
  { path: '/list/tree', title: '树形层级', desc: '左侧树导航 + 右侧纯文字表格，层级分类管理', modules: ['G-1', 'G-2', 'G-3', 'G-4'] },
  { path: '/list/metric-detail', title: '指标 + 明细', desc: '顶部指标概览 + 趋势图 + 底部带图片列表格', modules: ['G-1', 'G-2', 'G-3', 'D-1', 'D-3', 'G-4'] },
];

const formEntries = [
  { path: '/form/basic', title: '顺序落地表单页', desc: '分组分段 + 单栏布局 + 锚点导航 + 操作工具栏', modules: ['G-1', 'G-2', 'F-1', 'F-2'], featured: true },
  { path: '/form/step', title: '主从落地表单页', desc: '步骤条引导，分阶段填写 + 最终确认提交', modules: ['G-1', 'G-2', 'F-3', 'F-1', 'F-2'] },
  { path: '/form/stepper', title: '步骤落地表单页', desc: '步骤条引导，分阶段填写 + 最终确认提交', modules: ['G-1', 'G-2', 'F-3', 'F-1', 'F-2'] },
  { path: '/form/group', title: '抽屉表单页', desc: '侧边抽屉承载表单，适合轻量编辑场景', modules: ['G-1', 'G-2', 'F-1', 'F-2'] },
  { path: '/form/modal', title: '弹窗表单页', desc: '弹窗承载表单，适合简单信息录入确认', modules: ['G-1', 'G-2', 'F-1', 'F-2'] },
];

const detailEntries = [
  { path: '/detail/basic', title: '顺序落地详情页', desc: '头部摘要 + 分组信息展示 + Tab 切换（表格/附件）+ 操作时间线', modules: ['G-1', 'G-2', 'DT-1', 'DT-2', 'DT-4', 'DT-5'], featured: true },
  { path: '/detail/card', title: '主从落地详情页', desc: '指标摘要卡 + 分组信息 + 商品明细表格', modules: ['G-1', 'G-2', 'DT-1', 'DT-3', 'DT-2', 'DT-4'] },
  { path: '/detail/timeline', title: '抽屉详情页', desc: '侧边抽屉承载详情，适合快速预览场景', modules: ['G-1', 'G-2', 'DT-1', 'DT-2'] },
  { path: '/detail/modal', title: '弹窗详情页', desc: '弹窗承载详情，适合轻量信息查看确认', modules: ['G-1', 'G-2', 'DT-1', 'DT-2'] },
];

const groups = [
  { id: 'dashboard', name: '数据看板', label: 'Dashboard', entries: dashboardEntries },
  { id: 'list', name: '列表页', label: 'List pages', entries: listEntries },
  { id: 'form', name: '表单页', label: 'Form pages', entries: formEntries },
  { id: 'detail', name: '详情页', label: 'Detail pages', entries: detailEntries },
];

/** Render the actual route at desktop size, loading previews near the viewport only. */
function PagePreview({ path, title }: { path: string; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const resize = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    resize.observe(node);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    observer.observe(node);
    return () => { resize.disconnect(); observer.disconnect(); };
  }, []);
  const route = path === '/showcase/store-operations' ? '/examples/store-operations' : path;
  return <div ref={host} className={styles.livePreview}>
    {visible && width > 0 && <iframe title={`${title}实际页面预览`} src={`${route}?embedded=1`}
      tabIndex={-1} aria-hidden="true" loading="lazy"
      style={{ width: 1440, height: 900, transform: `scale(${width / 1440})` }} />}
  </div>;
}

export default function Landing() {
  return <div className={styles.page}>
    <header className={styles.hero}>
      <span className={styles.eyebrow}>B-END / PAGE TEMPLATES</span>
      <h1>从完整页面开始。</h1>
      <p>浏览真实业务场景中的页面结构，找到适合你的模板，再探索其中的模块组合。</p>
      <nav className={styles.categories} aria-label="页面模板分类">
        {groups.map(group => <a key={group.id} href={`#templates-${group.id}`}>
          {group.name}<span>{group.entries.length}</span>
        </a>)}
      </nav>
    </header>
    <main className={styles.main}>
      {groups.map(group => <section key={group.id} id={`templates-${group.id}`} className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2>{group.name}</h2><span>{group.label} · {group.entries.length} 套模板</span>
        </header>
        <div className={styles.grid}>
          {group.entries.map(item => <article key={item.path} className={styles.card}>
            <div className={styles.cardHeader}>
              <div><span className={styles.eyebrow}>PAGE TEMPLATE</span><h3>{item.title}</h3><p>{item.desc}</p></div>
              <Link to={item.path} className={styles.previewButton} aria-label={`预览${item.title}`}>查看页面 <span aria-hidden="true">↗</span></Link>
            <details className={styles.composition}>
              <summary>模块组合 <span>{item.modules.length} 个模块</span></summary>
              <div className={styles.cardModules}>{item.modules.map(m => <span key={m}>{m} · {MODULE_NAMES[m] || m}</span>)}</div>
            </details>
            </div>
            <Link to={item.path} className={styles.cardPreview} aria-label={`打开${item.title}`}>
              <PagePreview path={item.path} title={item.title} />
            </Link>
          </article>)}
        </div>
      </section>)}
      <aside className={styles.planned}><span>营销类模板</span><span>规划中</span></aside>
    </main>
    <footer className={styles.footer}>17 套页面模板 · 4 类业务场景<span>基于 MTD · 为页面生成而设计</span></footer>
  </div>;
}
