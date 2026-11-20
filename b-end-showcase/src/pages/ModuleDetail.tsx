import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, Code2, Eye, Monitor, RotateCcw, Tablet } from 'lucide-react';
import { modulePreviews, modulePreviewVariants, modulePreviewSubGroups } from '../components/modulePreviews';
import { L2_MODULES, getModuleById, type L2Module } from '../data/l2Modules';
import { getDesignSpec, hasDesignSpec } from '../data/designSpecs';
import { getModuleTaxonomy } from '../data/moduleTaxonomy';
import CopySpecButton from '../components/CopySpecButton';
import styles from './ModuleDetail.module.css';
function ModuleDocument({ mod }: {
    mod: L2Module;
}) {
    const [tab, setTab] = useState<'preview' | 'spec'>('preview');
    const [groupIndex, setGroupIndex] = useState(0);
    const [variantIndex, setVariantIndex] = useState(0);
    const [revision, setRevision] = useState(0);
    const [compact, setCompact] = useState(false);
    const groups = modulePreviewSubGroups[mod.id];
    const group = groups?.[groupIndex];
    const variants = group?.variants || modulePreviewVariants[mod.id];
    const variant = variants?.[variantIndex];
    const Preview = modulePreviews[mod.id];
    const specId = group ? `${mod.id} ${group.label}` : mod.id;
    const specAvailable = hasDesignSpec(specId);
    const position = L2_MODULES.findIndex(m => m.id === mod.id);
    const previous = L2_MODULES[position - 1], next = L2_MODULES[position + 1];
    return <article className={styles.content}>
    <nav className={styles.breadcrumb} aria-label="面包屑"><Link to="/modules">模块库</Link><ChevronRight size={12}/><span>{getModuleTaxonomy(mod.id).category}</span><ChevronRight size={12}/><span>{mod.id}</span></nav>
    <div className={styles.heading}><h1>{mod.name.replace(/ \(.*\)/, '')}</h1><span className={styles.badge}>L2 MODULE</span></div>
    <p className={styles.description}>{mod.description}</p>
    <div className={styles.tags}>{[...getModuleTaxonomy(mod.id).scenes, ...getModuleTaxonomy(mod.id).topics].map(tag => <span key={tag}>{tag}</span>)}</div>
    <div className={styles.specStrip}><Code2 size={15}/><code>{mod.id} <span>/</span> {mod.name.match(/\(([^)]+)\)/)?.[1] || 'MTD · Design Spec'}</code><CopySpecButton key={specId + (variant?.name || '')} moduleId={specId} variantName={variant?.name} className={styles.copyButton}/></div>
    <section className={styles.playground} aria-label="模块交互演示">
      <div className={styles.previewHeader}>
        <div className={styles.tabs} role="tablist" aria-label="查看方式">{(['preview', 'spec'] as const).map(t => <button key={t} id={`tab-${t}`} role="tab" aria-selected={tab === t} aria-controls="module-panel" tabIndex={tab === t ? 0 : -1} className={tab === t ? styles.selected : ''} onClick={() => setTab(t)} onKeyDown={e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        const target = e.key === 'Home' ? 'preview' : e.key === 'End' ? 'spec' : t === 'preview' ? 'spec' : 'preview';
        setTab(target);
        document.getElementById(`tab-${target}`)?.focus();
    } }}>{t === 'preview' ? <Eye size={14}/> : <Code2 size={14}/>}{t === 'preview' ? '预览' : 'Design Spec'}</button>)}</div>
        <span className={styles.previewLabel}>{tab === 'preview' ? '交互式组件预览' : '规范 · Token · 代码骨架'}</span>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.selects}>
          {groups && <select aria-label="子模块" value={groupIndex} onChange={e => { setGroupIndex(Number(e.target.value)); setVariantIndex(0); }}>{groups.map((g, i) => <option key={g.label} value={i}>{g.label}</option>)}</select>}
          {variants ? <select aria-label="组件变体" value={variantIndex} onChange={e => setVariantIndex(Number(e.target.value))}>{variants.map((v, i) => <option key={v.name} value={i}>{v.name}</option>)}</select> : <span className={styles.defaultVariant}>默认样式</span>}
        </div>
        <div className={styles.tools}>
          <button title="宽屏预览" aria-label="宽屏预览" aria-pressed={!compact} onClick={() => setCompact(false)}><Monitor size={15}/></button>
          <button title="窄屏预览（768px）" aria-label="窄屏预览" aria-pressed={compact} onClick={() => setCompact(true)}><Tablet size={15}/></button>
          <span className={styles.separator}/>
          <button title="重置组件交互" aria-label="重置组件交互" onClick={() => setRevision(r => r + 1)}><RotateCcw size={14}/></button>
        </div>
      </div>
      <div id="module-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
        {tab === 'preview' ? <div className={styles.canvas}><div className={`${styles.stage} ${compact ? styles.compact : ''}`} key={`${specId}-${variantIndex}-${revision}`}>
          {variant ? variant.render() : Preview ? <Preview /> : <p className={styles.empty}>该模块暂未配置交互预览，请参考下方规范。</p>}
        </div><span className={styles.canvasCaption}>{compact ? '768 PX' : 'FLUID'}<span>·</span>{group?.label || mod.id}{variant && ` / ${variant.name}`}</span></div> : <div className={styles.codePanel}><div className={styles.codeHeader}><span>design-spec.md</span><CopySpecButton key={specId + (variant?.name || '')} moduleId={specId} variantName={variant?.name} className={styles.copyButton}/></div><pre>{specAvailable ? getDesignSpec(specId, variant?.name) : '该模块暂未收录 Design Spec。可先参考下方组件角色与使用说明。'}</pre></div>}
      </div>
    </section>
    <div className={styles.docsGrid}>
      <section className={styles.block}><p className={styles.eyebrow}>CONTEXT</p><h2>适用场景</h2><p>在需求包含以下场景或关键词时，优先查看此模块及其变体。</p><div className={styles.tags}>{mod.triggers?.map(t => <span key={t}>{t}</span>)}</div>{mod.notes && <aside className={styles.note}>{mod.notes}</aside>}</section>
      <section className={styles.block}><p className={styles.eyebrow}>COMPOSITION</p><h2>组件构成</h2><p>由以下 L3 组件角色组合，具体配置参见 Design Spec。</p><div className={styles.roles}>{mod.l3Roles?.length ? mod.l3Roles.map((r, i) => <div key={r}><span>{String(i + 1).padStart(2, '0')}</span>{r}</div>) : <p>组合关系见模块预览与规范。</p>}</div></section>
    </div>
    {mod.variants && !Array.isArray(mod.variants) && <section className={styles.variants}><h2>变体说明</h2>{Object.entries(mod.variants).map(([name, desc]) => <div key={name}><strong>{name}</strong><p>{desc}</p></div>)}</section>}
    <div className={styles.usage}><h2>用于页面生成</h2><p>选择合适的变体，复制 Design Spec，将其与业务字段、数据和页面需求一并交给生成工具。Spec 包含此模块的布局、视觉规则和实现参考。</p><CopySpecButton key={specId + (variant?.name || '')} moduleId={specId} variantName={variant?.name} className={styles.copyButton}/></div>
    <nav className={styles.pagination} aria-label="相邻模块">{previous ? <Link to={`/modules/${previous.id}`}><ArrowLeft size={15}/><span><small>上一个模块</small>{previous.name.replace(/ \(.*\)/, '')}</span></Link> : <span />}{next && <Link to={`/modules/${next.id}`}><span><small>下一个模块</small>{next.name.replace(/ \(.*\)/, '')}</span><ArrowRight size={15}/></Link>}</nav>
  </article>;
}
export default function ModuleDetail() {
    const { id } = useParams<{
        id: string;
    }>();
    const mod = getModuleById(id || '');
    return mod ? <ModuleDocument key={mod.id} mod={mod}/> : <div className={styles.content}><h1>未找到该模块</h1><Link to="/modules">返回模块库</Link></div>;
}
