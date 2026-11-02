import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@ss/mtd-react3';
import { themes, useTheme, type ThemeKey } from '../theme/useTheme';
import styles from './TopNav.module.css';

/**
 * 首页专属顶部导航栏
 * 左侧：标题「MTD B端知识库预览」
 * 右侧：「页面模板」「模块」入口按钮 + Token 版本切换下拉（蓝色/黄色）
 */
export default function TopNav() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions: ThemeKey[] = ['primary', 'brand-yellow'];

  return (
    <header className={styles.topNav}>
      <div className={styles.left}>
        <Link to="/" className={styles.brand}>
          <span className={styles.title}>MTD B端知识库预览</span>
        </Link>
      </div>

      <div className={styles.right}>
        <button className={styles.navBtn} onClick={() => navigate('/templates')}>
          页面模板
        </button>
        <button className={styles.navBtn} onClick={() => navigate('/modules')}>
          模块
        </button>
        <button className={styles.navBtn} onClick={() => navigate('/tokens')}>
          组件和Token
        </button>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.themeDropdown} ref={dropdownRef}>
          <button
            className={styles.themeTrigger}
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <span
              className={styles.themeDot}
              style={{ background: themes[theme].swatch }}
            />
            {themes[theme].label}
            <Icon type="triangle-down" className={styles.themeArrow} />
          </button>
          {dropdownOpen && (
            <div className={styles.themeMenu}>
              {themeOptions.map((key) => {
                const config = themes[key];
                const active = theme === key;
                return (
                  <button
                    key={key}
                    className={`${styles.themeMenuItem} ${active ? styles.themeMenuItemActive : ''}`}
                    onClick={() => {
                      setTheme(key);
                      setDropdownOpen(false);
                    }}
                  >
                    <span
                      className={styles.themeDot}
                      style={{ background: config.swatch }}
                    />
                    {config.label}
                    {active && <Icon type="check" className={styles.themeCheck} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
