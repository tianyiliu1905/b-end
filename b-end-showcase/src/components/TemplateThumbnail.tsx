import './TemplateThumbnail.css';
/** Lightweight structural illustrations; these are not screenshots of the demos. */
export default function TemplateThumbnail({ path }: {
    path: string;
}) {
    const kind = path.startsWith('/dashboard') ? 'dashboard' : path.startsWith('/form') ? 'form' : path.startsWith('/detail') ? 'detail' : 'list';
    return <div className={`template-mini template-mini-${kind}`} aria-hidden="true">
    <div className="mini-top"><i /><b /><b /><span>•••</span></div>
    <div className="mini-body"><div className="mini-side">{[1, 2, 3, 4, 5].map(i => <i key={i}/>)}</div>
      <div className="mini-content"><div className="mini-heading"><b /><i /></div>
        {(kind === 'dashboard' || kind === 'list') && <div className="mini-metrics">{[1, 2, 3].map(i => <div key={i}><i /><b /></div>)}</div>}
        {kind === 'dashboard' ? <div className="mini-charts"><div className="mini-bars">{[35, 63, 45, 80, 58, 95, 74].map((h, i) => <i key={i} style={{ height: `${h}%` }}/>)}</div><div className="mini-donut"/></div> : kind === 'form' ? <div className="mini-form">{[1, 2, 3, 4].map(i => <div key={i}><i /><b /></div>)}<span /></div> : <div className="mini-table">{[1, 2, 3, 4].map(i => <div key={i}><i /><b /><b /><span /></div>)}</div>}
      </div>
    </div>
  </div>;
}
