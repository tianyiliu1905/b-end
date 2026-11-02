import { useNavigate, useParams } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { modulePreviews, modulePreviewVariants, modulePreviewSubGroups } from '../components/modulePreviews';
import VariantSwitcher from '../components/VariantSwitcher';
import { L2_CATEGORIES, L2_MODULES, getModuleById, getModulesByCategory } from '../data/l2Modules';
import CopySpecButton from '../components/CopySpecButton';
import styles from './ModuleDetail.module.css';

const CATEGORY_LABEL: Record<string, string> = {
  'G-导航': '导航与共用',
  'D-图表卡片': '看板图表卡片',
  'W-工作台': '工作台专属',
  '表单+详情': '表单 / 详情共用',
  '表单专属': '表单页专属',
  '详情专属': '详情页专属',
};

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activeId = id || L2_MODULES[0]?.id;
  const mod = getModuleById(activeId || '');

  return (
    <div className={styles.page}>
      <TopNav />

      <div className={styles.body}>
        {/* 左侧目录：按场景分组，支持切换模块 */}
        <aside className={styles.sidebar}>
          {L2_CATEGORIES.map((category) => (
            <div key={category} className={styles.sidebarGroup}>
              <div className={styles.sidebarGroupTitle}>{CATEGORY_LABEL[category] || category}</div>
              {getModulesByCategory(category).map((m) => (
                <button
                  key={m.id}
                  className={`${styles.sidebarItem} ${m.id === activeId ? styles.sidebarItemActive : ''}`}
                  onClick={() => navigate(`/modules/${m.id}`)}
                >
                  <span className={styles.sidebarItemCode}>{m.id}</span>
                  <span className={styles.sidebarItemName}>{m.name}</span>
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* 右侧内容区 */}
        <main className={styles.content}>
          {mod ? (
            <>
              <div className={styles.breadcrumb}>
                <button className={styles.breadcrumbLink} onClick={() => navigate('/modules')}>模块库</button>
                <span className={styles.breadcrumbSep}>/</span>
                <span>{CATEGORY_LABEL[mod.category] || mod.category}</span>
              </div>

              <div className={styles.contentHeader}>
                <span className={styles.contentCode}>{mod.id}</span>
                <h1 className={styles.contentTitle}>{mod.name}</h1>
              </div>

              <p className={styles.contentDesc}>{mod.description}</p>

              {/* 实际渲染预览：优先展示可切换的真实变体样式，
                  子模块（如 D-2 环形进度/进度指标）依次展示多组 VariantSwitcher；
                  仅单一变体或无变体的模块回退到静态 Preview 组件。 */}
              {(() => {
                const subGroups = modulePreviewSubGroups[mod.id];
                if (subGroups) {
                  return (
                    <div className={styles.previewArea}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
                        {subGroups.map((g) => (
                          <div key={g.label}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12, textAlign: 'center' }}>{g.label}</div>
                            <VariantSwitcher key={`${mod.id}-${g.label}`} variants={g.variants} moduleId={`${mod.id} ${g.label}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                const variants = modulePreviewVariants[mod.id];
                if (variants) {
                  return (
                    <div className={styles.previewArea}>
                      <VariantSwitcher key={mod.id} variants={variants} moduleId={mod.id} />
                    </div>
                  );
                }
                const Preview = modulePreviews[mod.id];
                return (
                  <>
                    <div className={styles.previewToolbar}>
                      <CopySpecButton moduleId={mod.id} className={styles.copyBtn} />
                    </div>
                    <div className={styles.previewArea}>
                      {Preview ? <Preview /> : <p className={styles.previewPlaceholder}>暂无预览</p>}
                    </div>
                  </>
                );
              })()}

              {mod.triggers && mod.triggers.length > 0 && (
                <div className={styles.block}>
                  <h2 className={styles.blockTitle}>触发关键词</h2>
                  <div className={styles.tagList}>
                    {mod.triggers.map((t) => (
                      <span key={t} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {mod.l3Roles && mod.l3Roles.length > 0 && (
                <div className={styles.block}>
                  <h2 className={styles.blockTitle}>L3 组件角色</h2>
                  <div className={styles.tagList}>
                    {mod.l3Roles.map((r) => (
                      <span key={r} className={`${styles.tag} ${styles.tagNeutral}`}>{r}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* 变体说明：当变体是 Record（有文字描述）时才展示这块文字说明，
                  因为上方 VariantSwitcher 已经展示了每个变体的真实样式，
                  仅当描述本身携带额外信息（而不只是变体名）时才需要在此重复展示。 */}
              {mod.variants && !Array.isArray(mod.variants) && (
                <div className={styles.block}>
                  <h2 className={styles.blockTitle}>变体说明</h2>
                  <ul className={styles.variantList}>
                    {Object.entries(mod.variants).map(([key, desc]) => (
                      <li key={key}><strong>{key}</strong>：{desc}</li>
                    ))}
                  </ul>
                </div>
              )}

            </>
          ) : (
            <p>未找到该模块</p>
          )}
        </main>
      </div>
    </div>
  );
}
