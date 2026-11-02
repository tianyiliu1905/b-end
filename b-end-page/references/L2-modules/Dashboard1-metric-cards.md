# D-1 · 指标卡片组 (Metric Cards)

横向排列的多张指标卡，每卡一个核心数字 + 同环比涨跌（色标）。看板最常用的顶部模块。

## 何时用
- 概览 / 大盘 / 总览 的第一屏核心指标。
- 监控页顶部的「关键状态值」（变体：带状态色块）。

---

## 布局 (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │ [指标名]    │  │ [指标名]    │  │ [指标名]    │  │ [指标名]    ││
│  │             │  │             │  │             │  │             ││
│  │  ██ 大数字  │  │  ██ 大数字  │  │  ██ 大数字  │  │  ██ 大数字  ││
│  │             │  │             │  │             │  │             ││
│  │ ↑12% 较上期 │  │ ↓3% 较上期  │  │ ↑8% 较上期  │  │ — 持平     ││
│  │ [?口径说明] │  │             │  │             │  │             ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

可选：卡片右上角 sparkline 迷你折线（高度 40px）。

---

## 视觉规格 (JSON)

```json
{
  "grid": {
    "columns": "3~6 张卡等分",
    "gutter": 16,
    "span_4cards": 6,
    "span_6cards": 4
  },
  "card": {
    "padding": 24,
    "background": "var(--bg-card)",
    "border_radius": "var(--radius-3)",
    "border": "none",
    "shadow": "none"
  },
  "metric_name": {
    "font_size": "var(--fs-14)",
    "color": "var(--text-3)",
    "font_weight": "normal"
  },
  "metric_value": {
    "font_size": "28~32px",
    "font_weight": "var(--fw-semibold)",
    "color": "var(--text-1)",
    "color_emphasis": "var(--color-brand-primary)"
  },
  "delta": {
    "font_size": "var(--fs-12)~var(--fs-14)",
    "positive": {
      "color": "var(--color-green)",
      "background": "rgba(0,135,90,0.08)",
      "icon": "↑"
    },
    "negative": {
      "color": "var(--color-red)",
      "background": "rgba(216,57,49,0.08)",
      "icon": "↓"
    },
    "neutral": {
      "color": "var(--text-3)"
    },
    "style": "pill(胶囊)"
  },
  "tooltip_icon": {
    "icon": "question-circle-o",
    "position": "指标名右侧",
    "trigger": "hover",
    "condition": "仅当 tip 字段存在时显示"
  },
  "sparkline": {
    "height": 40,
    "position": "卡片右上角",
    "axes": "hidden",
    "legend": "hidden"
  }
}
```

---

## 数据结构

```json
{
  "metrics": [
    {
      "key": "string",
      "title": "string",
      "value": "number",
      "precision": "number (小数位)",
      "delta": "number (正负百分比)",
      "deltaLabel": "string (如'较上周期')",
      "tip": "string? (口径说明，可选)",
      "sparkline": "number[]? (迷你趋势数据，可选)"
    }
  ]
}
```

---

## 约束

1. 一行 3~6 张卡，24 栅格等分（4 张 span=6，6 张 span=4）。
2. 涨跌做成胶囊(pill)样式——涨绿底/跌红底，比纯文字更醒目。
3. 口径说明用 info 图标 + tooltip(hover)，仅当 `tip` 存在时显示，不占布局。
4. 主数字若需强调可用主蓝 `var(--color-brand-primary)`。
5. 所有色值/字号/间距引用 token，禁止硬编码。
6. sparkline 可选，用折线图（隐藏轴与图例），高度固定 40px。

---

## 变体

### 同环比对比卡 (CompareCards)
一个指标同时给「同比 + 环比」双胶囊并排，用于活动复盘/大盘对比。

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐│
│  │ [指标名]          │  │ [指标名]          │  │ [指标名]          ││
│  │  ██ 大数字 [单位] │  │  ██ 大数字 [单位] │  │  ██ 大数字 [单位] ││
│  │ [同比↑5%|环比↓2%] │  │ [同比↑3%|环比↑1%] │  │ [同比↓1%|环比↑4%] ││
│  └───────────────────┘  └───────────────────┘  └───────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

- 数据结构：`{ title, value, suffix?, yoy, mom }`，`yoy`/`mom` 为带正负百分比。
- 同比/环比两胶囊并排，中间 1px 分隔线。
- 涨跌色复用主变体胶囊（涨绿跌红）。
- 等分栅格 `span = floor(24 / 卡片数)`。
- 数值字号 fs-30。

### 状态变体
- 卡片左侧带 4px 色条（成功绿/警告橙/危险红）表示状态。
- 或右上角状态 Tag。

### 图标摘要卡 (Icon Summary Card)

每卡独立 `<Card>`，一行 4 张（`span=6`）。结构从上到下：
1. **标题行**：左侧指标名（fs-13, text-2）+ 右上角 badge
2. **数值行**：大数字（28px, fw-700, text-1）+ 涨跌标记（fs-12, fw-500, 涨绿跌红，带↑↓箭头）
3. **对比行**：`vs. X,XXX 上期`（fs-11, text-3）

**右上角 badge 说明**：该位置不限于 Icon，可以是以下任意内容：
- **Icon**：MTD 图标（18px, brand-blue），如 `home-o`、`group-o`
- **文字标签**：短文本如"本月"、"实时"、"累计"（fs-11, text-3, 带浅灰背景 pill）
- **状态标记**：如 Tag、小徽标等

无论是 icon 还是文字，位置固定在卡片第一行右侧（`justify-content: space-between; align-items: center`），与左侧标题垂直居中对齐。

```
┌────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│ │ 营业门店 🏠  │  │ 筹备门店 👥  │  │ 候选点位 📍  │  │ 新开门店[本月]││
│ │              │  │              │  │              │  │              ││
│ │ 2,668 ↑15.5%│  │ 1,200 ↑8.4% │  │ 1,008 ↓10.5%│  │ 1,480 ↑4.4% ││
│ │ vs. 2,310   │  │ vs. 1,107    │  │ vs. 1,127    │  │ vs. 1,418    ││
│ └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘│
└────────────────────────────────────────────────────────────────────────┘
```

骨架代码（React）：

```jsx
import { Row, Col, Card, Icon } from '@ss/mtd-react3'

// badge 字段：icon name（含"-"的字符串）渲染为 Icon，否则渲染为文字标签
<Row gutter={16}>
  {metrics.map(m => {
    const isIcon = m.badge.includes('-');
    return (
      <Col span={6} key={m.label}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{m.label}</span>
            {isIcon
              ? <Icon type={m.badge} style={{ fontSize: 18, color: 'var(--color-brand-primary)' }} />
              : <span style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--bg-page)', borderRadius: 4, padding: '2px 6px' }}>{m.badge}</span>
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '8px 0 4px' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: m.trend === 'up' ? chartSemantic.down : chartSemantic.up }}>
              {m.trend === 'up' ? '↑' : '↓'} {m.change}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>vs. {m.vs} 上期</span>
        </Card>
      </Col>
    );
  })}
</Row>
```

数据结构：

```json
{
  "metrics": [
    {
      "label": "string (指标名)",
      "value": "string (带千分位格式化的数字)",
      "change": "string (如'+15.5%')",
      "trend": "'up' | 'down'",
      "vs": "string (上期数值，如'2,310')",
      "badge": "string (右上角内容：icon name 如'home-o'，或文字如'本月'、'实时')"
    }
  ]
}
```

视觉约束：
- 右上角 badge 位置固定：`flex` 行尾，`align-items: center`（与标题垂直居中）
- 当 badge 为 Icon：使用 `-o` 线性风格，18px，color `--color-brand-primary`
- 当 badge 为文字：fs-11, color `--text-3`, background `--bg-page`, borderRadius 4px, padding 2px 6px
- 数字行大数字与涨跌标记 baseline 对齐（`align-items: baseline`）
- 涨跌色：涨 `#00A854`、跌 `#FF1F1F`
- vs 行仅作辅助信息，不加背景/pill

---

## 自检
- [ ] 一行 3~6 张卡，24 栅格等分
- [ ] 涨跌用胶囊(pill)样式，涨绿跌红（标准变体）；或箭头+色标（图标摘要变体）
- [ ] 口径说明 info 图标 + tooltip，仅 tip 存在时显示
- [ ] 所有色值/字号/间距引用 token，无硬编码
- [ ] 卡片无边框无阴影
- [ ] 图标摘要变体：标题+Icon 顶行对齐、大数字28px+涨跌baseline对齐、vs行fs-11

---

## MTD 实现

> 本文件为 MTD 组件库（`@ss/mtd-vue3` / `@ss/mtd-react3`）的实现细节。通用设计规格见 `Dashboard1-metric-cards.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 栅格行 | `mtd-row` | `<Row>` |
| 栅格列 | `mtd-col` | `<Col>` |
| 卡片容器 | `mtd-card` | `<Card>` |
| 数值展示 | `mtd-statistic` | `<Statistic>` |
| 状态标签 | `mtd-tag` | `<Tag>` |
| 图标 | `mtd-icon` / `<i class="mtdicon">` | `<Icon>` |
| 口径提示 | `mtd-tooltip` | `<Tooltip>` |

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Row,Col,Card,Statistic,Tag,Icon,Tooltip --target=mtd-react --quiet

node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Row,Col,Card,Statistic,Tag,Icon,Tooltip --target=mtd-vue --quiet
```

## 骨架代码 · React

```jsx
import { Row, Col, Card, Statistic, Icon, Tooltip } from '@ss/mtd-react3'

<Row gutter={16}>
  {metrics.map(m => (
    <Col span={6} key={m.key}>
      <Card>
        <div className="metric-title">
          {m.title}
          {m.tip && (
            <Tooltip content={m.tip}>
              <Icon type="question-circle-o" className="tip-icon" />
            </Tooltip>
          )}
        </div>
        <Statistic value={m.value} precision={m.precision} />
        <div className={`delta-pill ${m.delta >= 0 ? 'up' : 'down'}`}>
          <Icon type={m.delta >= 0 ? 'arrow-up' : 'arrow-down'} />
          {Math.abs(m.delta)}% {m.deltaLabel}
        </div>
      </Card>
    </Col>
  ))}
</Row>
```

## 骨架代码 · Vue3

```vue
<template>
  <mtd-row :gutter="16">
    <mtd-col v-for="m in metrics" :key="m.key" :span="spanPerCard">
      <mtd-card class="metric-card">
        <div class="metric-title">
          {{ m.title }}
          <mtd-tooltip v-if="m.tip" :content="m.tip">
            <i class="mtdicon mtdicon-question-circle-o tip-icon" />
          </mtd-tooltip>
        </div>
        <mtd-statistic :value="m.value" :precision="m.precision" />
        <div :class="['delta-pill', m.delta >= 0 ? 'up' : 'down']">
          <i :class="['mtdicon', m.delta >= 0 ? 'mtdicon-arrow-up' : 'mtdicon-arrow-down']" />
          {{ Math.abs(m.delta) }}% {{ m.deltaLabel }}
        </div>
      </mtd-card>
    </mtd-col>
  </mtd-row>
</template>
```

## 样式要点

```css
.metric-card { padding: var(--gap-section); }
.metric-title {
  font-size: var(--fs-14); color: var(--text-3);
  display: flex; align-items: center; gap: 4px;
}
.tip-icon { font-size: var(--fs-14); color: var(--text-3); cursor: help; }
.delta-pill {
  display: inline-flex; align-items: center; gap: 2px;
  padding: 2px 8px; border-radius: 10px;
  font-size: var(--fs-12);
}
.delta-pill.up { color: var(--color-green); background: rgba(0,135,90,0.08); }
.delta-pill.down { color: var(--color-red); background: rgba(216,57,49,0.08); }
```

## 踩坑笔记

- `Statistic` 组件的 `value` 必须传 number 类型，字符串会导致千分位格式化失效。
- `Row` 的 `gutter` 是两侧各半（gutter=16 → 每列左右各 padding 8px），不要再给 Col 加额外 margin。
- 涨跌 Icon 用 `arrow-up` / `arrow-down`（非 `caret-up`，caret 是实心三角太小）。
