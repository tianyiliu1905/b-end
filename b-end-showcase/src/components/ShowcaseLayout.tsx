import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Boxes, Layers3, LayoutTemplate, Search, PanelLeftClose, PanelLeftOpen, ArrowUpRight, Palette, X } from 'lucide-react';
import { L2_CATEGORIES, L2_MODULES, getModulesByCategory } from '../data/l2Modules';
import { themes, useTheme } from '../theme/useTheme';
import './ShowcaseLayout.css';
export const categoryLabels: Record<string, string> = {
    'G-导航': '导航与共用', 'D-图表卡片': '数据可视化', 'W-工作台': '工作台',
    '表单+详情': '表单 / 详情共用', '表单专属': '表单模块', '详情专属': '详情模块',
};
export default function ShowcaseLayout() {
    const [collapsed, setCollapsed] = useState(() => window.matchMedia('(max-width: 600px)').matches);
    const [query, setQuery] = useState('');
    const search = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'B-end · 页面生成知识库';
        if (window.matchMedia('(max-width: 600px)').matches)
            setCollapsed(true);
    }, [location.pathname]);
    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCollapsed(false);
                requestAnimationFrame(() => search.current?.focus());
            }
            if (e.key === 'Escape')
                setQuery('');
        };
        window.addEventListener('keydown', keydown);
        return () => window.removeEventListener('keydown', keydown);
    }, []);
    const matches = (m: typeof L2_MODULES[number]) => [m.id, m.name, m.description, ...(m.triggers || [])].join(' ').toLowerCase().includes(query.trim().toLowerCase());
    return <div className={`showcase-shell ${collapsed ? 'is-collapsed' : ''}`}>
    <aside className="showcase-sidebar" aria-label="知识库目录">
      <div className="showcase-brand-row"><Link to="/" className="showcase-brand"><span className="showcase-mark"><Layers3 size={19}/></span>B-end<span className="showcase-beta">UI</span></Link>
        <button className="showcase-icon" aria-label="收起目录" onClick={() => setCollapsed(true)}><PanelLeftClose size={17}/></button></div>
      <div className="showcase-theme" role="group" aria-label="组件主题">
        {Object.values(themes).map(t => <button key={t.key} type="button" aria-pressed={theme === t.key} onClick={() => setTheme(t.key)}><span style={{ background: t.swatch }} />{t.label}</button>)}
      </div>
      <div className="showcase-search"><Search size={15}/><input ref={search} value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索模块…" aria-label="搜索模块"/>{query ? <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={13}/></button> : <kbd>⌘ K</kbd>}</div>
      <nav className="showcase-nav" aria-label="主导航">
        <NavLink to="/templates" className={() => location.pathname === '/' || location.pathname === '/templates' ? 'active' : ''}><LayoutTemplate size={16}/>页面模板<span>L1</span></NavLink>
        <NavLink to="/modules" end><Boxes size={16}/>模块库<span>{L2_MODULES.length}</span></NavLink>
        <NavLink to="/tokens"><Palette size={16}/>组件与 Token<span>L3</span></NavLink>
      </nav>
      <div className="showcase-directory" aria-live="polite">
        {L2_CATEGORIES.map(category => {
            const mods = getModulesByCategory(category).filter(matches);
            return mods.length > 0 && <section key={category}><h2>{categoryLabels[category] || category}<span>{mods.length}</span></h2>
            {mods.map(m => <NavLink key={m.id} to={`/modules/${m.id}`} title={m.name}><span>{m.name.replace(/ \(.*\)/, '')}</span><small>{m.id}</small></NavLink>)}
          </section>;
        })}
        {!L2_MODULES.some(matches) && <p className="showcase-empty">没有匹配的模块，试试名称、编号或场景关键词。</p>}
      </div>
      <div className="showcase-side-footer"><span className="showcase-status"/>基于 MTD · 为页面生成而设计</div>
    </aside>
    <div className="showcase-main">
      <header className="showcase-topbar"><div>{collapsed && <button className="showcase-icon" aria-label="展开目录" onClick={() => setCollapsed(false)}><PanelLeftOpen size={18}/></button>}<span>Design knowledge, made tangible.</span></div>
        <Link to="/showcase/store-operations">查看生成案例<ArrowUpRight size={14}/></Link></header>
      <div className="showcase-paper"><Outlet /></div>
      <footer className="showcase-footer"><span>B-end / 从组件知识到完整页面</span></footer>
    </div>
  </div>;
}
