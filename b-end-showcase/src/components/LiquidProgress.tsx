import { useEffect, useState } from 'react';
import { useG2Chart } from '../hooks/useG2Chart';
import { chartPalette } from '../lib/chartTokens';
import { useTheme } from '../theme/useTheme';

/** D-13：仅表达实际值 / 目标值；不是区间评分仪表盘。 */
export default function LiquidProgress({ actual, target }: { actual: number; target: number }) {
  const { theme } = useTheme();
  const [color, setColor] = useState(() => chartPalette.c1);
  // ThemeProvider 在 effect 中更新 html 属性，下一帧读取才是新主题 token。
  useEffect(() => {
    const frame = requestAnimationFrame(() => setColor(chartPalette.c1));
    return () => cancelAnimationFrame(frame);
  }, [theme]);
  const valid = Number.isFinite(actual) && actual >= 0 && Number.isFinite(target) && target > 0;
  const ratio = valid ? actual / target : 0;
  const ref = useG2Chart(() => ({
    type: 'liquid',
    data: Math.min(ratio, 1),
    style: {
      fill: color, stroke: color, outlineBorder: 4, outlineDistance: 6,
      waveLength: 128, textFill: theme === 'brand-yellow' ? '#111925' : '#fff',
      textFontSize: 20, textFontWeight: 700,
      contentText: valid ? `${(ratio * 100).toFixed(2)} %` : '—',
    },
    axis: false, legend: false, tooltip: false,
  }), [actual, target, theme, color]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
      <div ref={ref} role="img" aria-label={valid ? `目标完成率 ${(ratio * 100).toFixed(2)}%` : '目标数据不可用'} style={{ width: 160, height: 160 }} />
      <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-2)' }}>
        {valid ? <>实际 <b>¥{actual}万</b> / 目标 <b>¥{target}万</b></> : '暂无有效目标数据'}
      </div>
    </div>
  );
}
