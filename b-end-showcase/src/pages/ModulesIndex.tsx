import { useState } from 'react';
import { Link } from 'react-router-dom';
import { L2_CATEGORIES, getModulesByCategory } from '../data/l2Modules';
import { PAGE_SCENES, getModuleTaxonomy, type PageScene } from '../data/moduleTaxonomy';
import CopySpecButton from '../components/CopySpecButton';
import styles from './ModulesIndex.module.css';

export default function ModulesIndex() {
  const [scene, setScene] = useState<PageScene | '全部'>('全部');
  return (
    <div className={styles.page}>


      <div className={styles.header}>
        <p className={styles.label}>L2 Modules</p>
        <h1 className={styles.title}>模块库</h1>
        <p className={styles.sub}>按功能查找模块，再按使用场景筛选；模块编号与复制规范保持一致。</p>
        <div className={styles.filters} role="group" aria-label="按使用场景筛选">
          {(['全部', ...PAGE_SCENES] as const).map(item => <button key={item} type="button" aria-pressed={scene === item} onClick={() => setScene(item)}>{item}</button>)}
        </div>
      </div>

      <main className={styles.main}>
        {L2_CATEGORIES.map((category) => {
          const mods = getModulesByCategory(category).filter(mod => scene === '全部' || getModuleTaxonomy(mod.id).scenes.includes(scene));
          if (!mods.length) return null;
          return (
            <section key={category} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{category}</h2>
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
                    <div className={styles.sceneTags}>{[...getModuleTaxonomy(m.id).scenes, ...getModuleTaxonomy(m.id).topics].map(tag => <span key={tag}>{tag}</span>)}</div>
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
