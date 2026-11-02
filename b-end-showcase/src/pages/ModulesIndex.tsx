import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { L2_CATEGORIES, getModulesByCategory } from '../data/l2Modules';
import CopySpecButton from '../components/CopySpecButton';
import styles from './ModulesIndex.module.css';

const CATEGORY_LABEL: Record<string, string> = {
  'G-导航': '导航与共用',
  'D-图表卡片': '看板图表卡片',
  'W-工作台': '工作台专属',
  '表单+详情': '表单 / 详情共用',
  '表单专属': '表单页专属',
  '详情专属': '详情页专属',
};

export default function ModulesIndex() {
  return (
    <div className={styles.page}>
      <TopNav />

      <div className={styles.header}>
        <p className={styles.label}>L2 Modules</p>
        <h1 className={styles.title}>模块库</h1>
        <p className={styles.sub}>按场景分组展示所有 L2 模块，点击卡片查看模块详情与使用说明</p>
      </div>

      <main className={styles.main}>
        {L2_CATEGORIES.map((category) => {
          const mods = getModulesByCategory(category);
          return (
            <section key={category} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{CATEGORY_LABEL[category] || category}</h2>
                <span className={styles.sectionCount}>{mods.length} 个模块</span>
              </div>
              <div className={styles.grid}>
                {mods.map((m) => (
                  <Link key={m.id} to={`/modules/${m.id}`} className={styles.card}>
                    <div className={styles.cardTop}>
                      <span className={styles.cardCode}>{m.id}</span>
                      <span className={styles.cardArrow}>&#8599;</span>
                    </div>
                    <h3 className={styles.cardTitle}>{m.name}</h3>
                    <p className={styles.cardDesc}>{m.description}</p>
                    <div className={styles.cardFooter}>
                      <CopySpecButton
                        moduleId={m.id}
                        className={styles.cardCopyBtn}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
