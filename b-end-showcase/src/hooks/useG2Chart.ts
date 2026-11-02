import { useRef, useEffect } from 'react';
import { Chart } from '@antv/g2';

/**
 * G2 v5 图表封装（Spec 模式）— React Hook 版。
 * 用法：const containerRef = useG2Chart(() => spec, [dep1, dep2])
 */
export function useG2Chart(buildSpec: () => Record<string, any>, deps: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = new Chart({ container: containerRef.current, autoFit: true });
    }
    chartRef.current.options(buildSpec());
    chartRef.current.render();

    // ResizeObserver 兜底（侧栏折叠/Tab 切换）
    let fitTimer: ReturnType<typeof setTimeout> | null = null;
    let lastW = 0, lastH = 0;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      if (Math.abs(rect.width - lastW) < 1 && Math.abs(rect.height - lastH) < 1) return;
      lastW = rect.width; lastH = rect.height;
      if (fitTimer) clearTimeout(fitTimer);
      fitTimer = setTimeout(() => chartRef.current?.forceFit(), 120);
    });
    ro.observe(containerRef.current);

    return () => {
      if (fitTimer) clearTimeout(fitTimer);
      ro.disconnect();
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return containerRef;
}
