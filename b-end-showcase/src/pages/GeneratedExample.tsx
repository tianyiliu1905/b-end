import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './GeneratedExample.module.css';

export default function GeneratedExample() {
  return (
    <section className={styles.page} aria-label="生成案例预览">
      <header className={styles.toolbar}>
        <Link to="/templates"><ArrowLeft size={14} />页面模板</Link>
        <span>Skill 实测 · 门店经营管理</span>
        <a href="/examples/store-operations" target="_blank" rel="noopener noreferrer">
          独立打开<ArrowUpRight size={14} />
        </a>
      </header>
      <iframe
        className={styles.frame}
        src="/examples/store-operations?embedded=1"
        title="门店经营管理 · 可交互生成案例"
      />
    </section>
  );
}
