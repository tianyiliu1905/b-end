import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

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

/** 营销类页面模板占位：暂无实际页面，先建分区，后续补充具体模板 */
const marketingEntries: { path: string; title: string; desc: string; modules: string[]; comingSoon?: boolean }[] = [
  { path: '', title: '营销活动页', desc: '营销活动配置、优惠券管理等场景的页面模板正在规划中', modules: [], comingSoon: true },
];

export default function Landing() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <span className={styles.heroTagDot} />
            L1 - L2 - L3 三层架构
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleAccent}>MTD B端</span>知识库预览
          </h1>
          <p className={styles.heroSub}>
            17 套生产级页面模板，覆盖数据看板、列表管理、表单录入、详情展示、营销活动五大场景
          </p>
        </div>
      </section>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Dashboard</p>
            <h2 className={styles.sectionTitle}>数据看板</h2>
            <span className={styles.sectionCount}>4 套模板</span>
          </div>
          <div className={styles.grid}>
            {dashboardEntries.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={styles.card}
              >
                <div className={styles.cardPreview}>
                  <span className={styles.cardPreviewLabel}>页面截图占位</span>
                  <div className={styles.cardTop}>
                    <div className={styles.cardArrow}>&#8599;</div>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.cardIcon} style={{ background: 'color-mix(in srgb, var(--color-brand-primary, #166FF7) 15%, transparent)' }}>
                      <span className={styles.cardIconInner} style={{ background: 'var(--color-brand-primary, #166FF7)' }} />
                    </span>
                    {item.title}
                    {'tag' in item && <span className={styles.cardTag}>{(item as any).tag}</span>}
                  </h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  <div className={styles.cardModules}>
                    {item.modules.map(m => (
                      <span key={m} className={styles.cardModule}>
                        <span className={styles.moduleCode}>{m}</span>
                        <span className={styles.moduleName}>{MODULE_NAMES[m]}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>List Pages</p>
            <h2 className={styles.sectionTitle}>列表页</h2>
            <span className={styles.sectionCount}>3 套模板</span>
          </div>
          <div className={styles.grid}>
            {listEntries.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={styles.card}
              >
                <div className={styles.cardPreview}>
                  <span className={styles.cardPreviewLabel}>页面截图占位</span>
                  <div className={styles.cardTop}>
                    <div className={styles.cardArrow}>&#8599;</div>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.cardIcon} style={{ background: 'rgba(0, 168, 84, 0.15)' }}>
                      <span className={styles.cardIconInner} style={{ background: '#00A854' }} />
                    </span>
                    {item.title}
                  </h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  <div className={styles.cardModules}>
                    {item.modules.map(m => (
                      <span key={m} className={styles.cardModule}>
                        <span className={styles.moduleCode}>{m}</span>
                        <span className={styles.moduleName}>{MODULE_NAMES[m]}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Form Pages</p>
            <h2 className={styles.sectionTitle}>表单页</h2>
            <span className={styles.sectionCount}>5 套模板</span>
          </div>
          <div className={styles.grid}>
            {formEntries.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={styles.card}
              >
                <div className={styles.cardPreview}>
                  <span className={styles.cardPreviewLabel}>页面截图占位</span>
                  <div className={styles.cardTop}>
                    <div className={styles.cardArrow}>&#8599;</div>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.cardIcon} style={{ background: 'rgba(250, 140, 22, 0.15)' }}>
                      <span className={styles.cardIconInner} style={{ background: '#FF7700' }} /* Orange-5 */ />
                    </span>
                    {item.title}
                  </h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  <div className={styles.cardModules}>
                    {item.modules.map(m => (
                      <span key={m} className={styles.cardModule}>
                        <span className={styles.moduleCode}>{m}</span>
                        <span className={styles.moduleName}>{MODULE_NAMES[m]}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Detail Pages</p>
            <h2 className={styles.sectionTitle}>详情页</h2>
            <span className={styles.sectionCount}>4 套模板</span>
          </div>
          <div className={styles.grid}>
            {detailEntries.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={styles.card}
              >
                <div className={styles.cardPreview}>
                  <span className={styles.cardPreviewLabel}>页面截图占位</span>
                  <div className={styles.cardTop}>
                    <div className={styles.cardArrow}>&#8599;</div>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.cardIcon} style={{ background: 'rgba(114, 46, 209, 0.15)' }}>
                      <span className={styles.cardIconInner} style={{ background: '#722ED1' }} />
                    </span>
                    {item.title}
                  </h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  <div className={styles.cardModules}>
                    {item.modules.map(m => (
                      <span key={m} className={styles.cardModule}>
                        <span className={styles.moduleCode}>{m}</span>
                        <span className={styles.moduleName}>{MODULE_NAMES[m]}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Marketing Pages</p>
            <h2 className={styles.sectionTitle}>营销类</h2>
            <span className={styles.sectionCount}>规划中</span>
          </div>
          <div className={styles.grid}>
            {marketingEntries.map((item) => (
              <div
                key={item.title}
                className={`${styles.card} ${item.comingSoon ? styles.cardDisabled : ''}`}
              >
                <div className={styles.cardPreview}>
                  <span className={styles.cardPreviewLabel}>
                    {item.comingSoon ? '页面模板规划中' : '页面截图占位'}
                  </span>
                  <div className={styles.cardTop}>
                    <div className={styles.cardArrow}>&#8599;</div>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.cardIcon} style={{ background: 'rgba(235, 47, 150, 0.15)' }}>
                      <span className={styles.cardIconInner} style={{ background: '#EB2F96' }} />
                    </span>
                    {item.title}
                    {item.comingSoon && <span className={styles.cardTag}>待补充</span>}
                  </h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  {item.modules.length > 0 && (
                    <div className={styles.cardModules}>
                      {item.modules.map(m => (
                        <span key={m} className={styles.cardModule}>
                          <span className={styles.moduleCode}>{m}</span>
                          <span className={styles.moduleName}>{MODULE_NAMES[m]}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerText}>B端通用设计规范 v1.0</span>
        <div className={styles.footerStats}>
          <span className={styles.footerStat}>
            <span className={styles.footerStatValue}>16</span> 页面模板
          </span>
          <span className={styles.footerStat}>
            <span className={styles.footerStatValue}>5</span> 页面类型
          </span>
        </div>
      </footer>
    </div>
  );
}
