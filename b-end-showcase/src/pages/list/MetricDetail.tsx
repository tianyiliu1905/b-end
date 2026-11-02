import { Row, Col, Card } from '@ss/mtd-react3';
import PageLayout from '../../components/PageLayout';
import ModuleWrapper from '../../components/ModuleWrapper';
import { g4Variants } from '../../components/G4DataTable';
import { useG2Chart } from '../../hooks/useG2Chart';
import { chartPalette } from '../../lib/chartTokens';

const metrics = [
  { label: '总金额', value: '¥523,306', change: '+12.3%', trend: 'up' },
  { label: '交易笔数', value: '2,338', change: '+8.7%', trend: 'up' },
  { label: '平均客单价', value: '¥223.9', change: '-2.1%', trend: 'down' },
  { label: '退款率', value: '1.2%', change: '-0.3%', trend: 'down' },
];

const trendData = [
  { date: '03-09', value: 68200 }, { date: '03-10', value: 72500 },
  { date: '03-11', value: 65800 }, { date: '03-12', value: 78900 },
  { date: '03-13', value: 82100 }, { date: '03-14', value: 76400 },
  { date: '03-15', value: 79300 },
];


function TrendChart() {
  const containerRef = useG2Chart(() => ({
    type: 'area',
    data: trendData,
    encode: { x: 'date', y: 'value' },
    style: { fill: `${chartPalette.c1}1f`, stroke: chartPalette.c1 },
    axis: {
      x: { labelFontSize: 12, line: true, lineStroke: 'rgba(17,25,37,.10)' },
      y: { labelFontSize: 12, gridStroke: 'rgba(17,25,37,.06)', labelFormatter: (v: number) => `¥${(v / 10000).toFixed(1)}万` },
    },
  }), []);
  return <div ref={containerRef} style={{ width: '100%', height: 200 }} />;
}

export default function MetricDetail() {
  return (
    <PageLayout title="指标+明细列表">
      {/* D-1 指标卡片组 */}
      <Row gutter={8}>
        {metrics.map((m) => (
          <Col span={6} key={m.label}>
            <Card style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-elem)' }}>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{m.label}</span>
                <span style={{ fontSize: 'var(--fs-24)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-1)' }}>{m.value}</span>
                <span style={{ fontSize: 'var(--fs-12)', color: m.trend === 'up' ? 'var(--color-green)' : 'var(--color-red)' }}>
                  ↗ {m.change}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* D-3 趋势图 */}
      <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-module)' }}>
        <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)', color: 'var(--text-1)' }}>近7日交易趋势</span>
        <TrendChart />
      </div>

{/* G-4 数据表格（分页器已内置在模块内） */}
<ModuleWrapper moduleId="G-4 数据表格" variants={g4Variants} defaultVariant={1} />
    </PageLayout>
  );
}
