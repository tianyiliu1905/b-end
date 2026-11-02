import styles from './PageLayout.module.css';

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function PageLayout({ children, style }: PageLayoutProps) {
  return (
    <div className={styles.content} style={style}>
      {children}
    </div>
  );
}
