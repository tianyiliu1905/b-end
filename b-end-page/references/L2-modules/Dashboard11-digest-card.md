# D-11 · AI 摘要卡 (DigestCard)

AI 生成的诊断/洞察总结卡片，用于看板顶部，提供核心结论或智能分析。

## 何时用
- AI 总结看板顶部核心诊断区
- 需要将 AI 生成的文字洞察 + 量化指标组合展示
- 开店建议、经营洞察、风险提醒等 AI 驱动的总结场景

---

## 四种变体

D-11 的变体系统由 `DigestCard` 组件的 `variant` prop 独立控制，**不属于**其它 D-N 通用的 5 型头部形态变体系统（见 `DashboardChartCard.md`），二者命名体系完全无关：

| 变体 name | variant 值 | 视觉特征 | 典型场景 |
|---|---|---|---|
| 智能洞察 | `insight` | 浅蓝背景(`--color-primary-4`) + 渐变边框 + AI 图标 + 富文本 | AI 经营分析、周报洞察 |
| 列表型 | `list` | 蓝色 AI 图标 + 分行 label:text 列表 | 经营诊断、风险提醒、任务提醒 |
| 卡片型 | `cards` | 蓝色 AI 图标 + 子卡片网格 | 多维度结论并列展示 |
| 标的结论 | `summary` | 白底卡片 + 标题(18px) + Tag 标签 + 富文本段落 | 分析报告总结、开店建议结论 |

---

## 布局 (ASCII)

### summary（标的结论）
```
┌──────────────────────────────────────────────────────────────────┐
│  标的结论  [Tag: 强烈建议推进开店]                                   │  ← 标题行
│                                                                  │
│  项目位在朝阳区朝青板块的高密社区型商圈，人口密度24,000……          │
│  综上**建议推进开店**，但需要注意如下风险：                          │  ← 富文本（关键词加粗）
│  1、商铺位于物业深处……                                            │
│  2、新交付商业……                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### insight（智能洞察）
```
┌─ 渐变边框(青→蓝→紫) ────────────────────────────────────────────┐
│ bg: var(--color-primary-4, #F0F6FF)                                │
│  [AI图标]  智能洞察           由大模型基于公开信息生成，仅供参考     │  ← 标题行
│                                                                  │
│  您好！上周整体经营状况表现平稳，但暴露了"**高流量、低转化**"的      │
│  核心问题。建议针对购买超过30天未复购的老客，发起一次……             │  ← 富文本（关键词加粗）
└──────────────────────────────────────────────────────────────────┘
```

### list（列表型）
```
┌──────────────────────────────────────────────────────────────────┐
│  [蓝色AI图标]  核心结论                                            │
│                                                                  │
│  经营诊断：营业收入 1,258.6 万元，完成月度目标 85.4%……              │
│  风险提醒：当前全品类共有 58 条预警……                               │
│  任务提醒：当前共下发 76 项任务……                                   │
└──────────────────────────────────────────────────────────────────┘
```

### cards（卡片型）
```
┌──────────────────────────────────────────────────────────────────┐
│  [蓝色AI图标]  核心结论                                            │
│  ┌── 经营诊断 ──┐  ┌── 风险提醒 ──┐  ┌── 任务提醒 ──┐            │
│  │ 营业收入…    │  │ 全品类共有…  │  │ 共下发76项…  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "summary_variant": {
    "background": "var(--bg-card)",
    "border_radius": 6,
    "padding": 20,
    "title": { "font_size": 18, "font_weight": 500, "color": "var(--text-1)" },
    "tag": {
      "strategy": "success(蓝底蓝字) / warning(橙底橙字) / danger(慎用)",
      "success": { "bg": "#E6FFF0", "color": "var(--color-green)" },
      "warning": { "bg": "#FFF6F0", "color": "var(--color-orange)" },
      "danger":  { "bg": "#FFF2F2", "color": "var(--color-red)" },
      "size": "small"
    },
    "rich_text": { "font_size": 14, "line_height": "22px", "bold_weight": 600 }
  },
  "insight_variant": {
    "background": "var(--color-primary-4)",
    "border": "1px gradient(95deg, #04D0C7 → #1E85F9 → #C164FE)",
    "border_radius": 8,
    "border_implementation": "mask-based pseudo element (not borderImage, which breaks borderRadius)",
    "padding": 16,
    "ai_icon": {
      "size": 24,
      "shape": "circle",
      "gradient": "linear-gradient(135deg, #04D0C7 0%, #1E85F9 50%, #C164FE 100%)"
    },
    "title": { "font_size": 14, "font_weight": 500, "color": "var(--text-1)" },
    "hint": { "font_size": 14, "color": "var(--text-4)" },
    "rich_text": { "font_size": 14, "line_height": "22px", "bold_weight": 600 }
  },
  "list_variant": {
    "icon": { "gradient": "linear-gradient(135deg, var(--color-primary-1) → var(--color-brand-primary))", "size": 20 },
    "title": { "font_size": "var(--fs-16)", "font_weight": 600 },
    "label": { "color": "var(--color-brand-primary)", "font_weight": 600 },
    "text": { "color": "var(--text-2)", "highlight_weight": 600 }
  },
  "cards_variant": {
    "icon": "同 list_variant",
    "card_bg": "var(--bg-card-inner)",
    "card_radius": 8,
    "card_padding": "14px 16px"
  }
}
```

---

## 数据结构

```json
{
  "DigestCardProps": {
    "title": "string? (标题，各变体有默认值)",
    "variant": "'list' | 'cards' | 'summary' | 'insight' (默认 'list')",
    "items": "DigestItem[]? (list/cards 变体用)",
    "richContent": "RichTextSegment[]? (summary/insight 变体用)",
    "tagText": "string? (summary 变体：结论标签文字)",
    "tagType": "'success' | 'warning' | 'danger' (summary 变体：标签类型，默认 success)",
    "hint": "string? (insight 变体：右侧灰色提示文字)",
    "highlightColor": "string? (list/cards 变体：关键数据高亮色)"
  },
  "DigestItem": {
    "label": "string",
    "text": "string"
  },
  "RichTextSegment": {
    "text": "string",
    "bold": "boolean? (是否加粗)"
  }
}
```

---

## 约束

1. summary 变体：白底卡片，Tag 颜色遵循全局 Tag 策略（默认蓝/绿，慎用红色）。
2. insight 变体：背景用 `var(--color-primary-4, #F0F6FF)` 浅蓝色（官方 Blue-1），不用绿色。
3. list/cards 变体：主题色 AI 图标（`linear-gradient(135deg, var(--color-primary-1) 0%, var(--color-brand-primary) 100%)` 渐变，随主题联动）+ 关键数据自动高亮（数字/百分比/带单位数值）。
4. 富文本段落 `richContent` 中加粗片段用 `fontWeight: 600`，不用颜色区分。
5. D-11 变体与其它 D-N 的 5 型头部变体命名体系完全无关。

---

## 自检
- [ ] 使用正确的 variant 值
- [ ] summary 变体有 Tag 标签
- [ ] insight 变体用浅蓝背景（不是绿色）
- [ ] insight 变体有渐变边框和 AI 图标
- [ ] list/cards 变体有蓝色 AI 图标
- [ ] 关键数据自动高亮

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见上方。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 标签 | `mtd-tag` | `<Tag>` |
| 栅格 | `mtd-row` + `mtd-col` | `<Row>` + `<Col>` |

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Tag,Row,Col --target=mtd-vue --quiet
```

## 骨架代码 · React（summary 变体）

```tsx
import { Tag } from '@ss/mtd-react3';

function DigestCard({ title = '标的结论', tagText, tagType = 'success', richContent }) {
  const tagColorMap = {
    success: { bg: '#E6FFF0', color: 'var(--color-green)' },   /* Green-1, Green-5 */
    warning: { bg: '#FFF6F0', color: 'var(--color-orange)' },   /* Orange-1, Orange-5 */
    danger:  { bg: '#FFF2F2', color: 'var(--color-red)' },   /* Red-1, Red-5 */
  };
  const tColor = tagColorMap[tagType];
  return (
    <div className="dash-card" style={{ padding: 20, background: 'var(--bg-card)', borderRadius: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-1)' }}>{title}</span>
        {tagText && (
          <Tag style={{ background: tColor.bg, color: tColor.color, border: 'none', borderRadius: 4, fontSize: 14 }}>
            {tagText}
          </Tag>
        )}
      </div>
      {richContent && (
        <div style={{ marginTop: 12, lineHeight: '22px' }}>
          {richContent.map((seg, i) => (
            <span key={i} style={{ fontSize: 14, color: 'var(--text-1)', ...(seg.bold ? { fontWeight: 600 } : {}) }}>
              {seg.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 骨架代码 · React（insight 变体）

```tsx
function DigestCard({ title = '智能洞察', hint, richContent }) {
  return (
    <div className="dash-card" style={{
      padding: 16,
      background: 'var(--color-primary-4)',   /* 官方 Blue-1 */
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* 渐变边框：mask 方案，避免 borderImage 导致 borderRadius 失效 */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 8, padding: 1,
        background: 'linear-gradient(95deg, #04D0C7 0%, #1E85F9 49%, #C164FE 99%)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor', maskComposite: 'exclude', pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* AI 渐变图标 */}
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'linear-gradient(135deg, #04D0C7 0%, #1E85F9 50%, #C164FE 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>{title}</span>
        </div>
        {hint && <span style={{ color: 'var(--text-4)', fontSize: 14 }}>{hint}</span>}
      </div>
      {richContent && (
        <div style={{ marginTop: 12, lineHeight: '22px' }}>
          {richContent.map((seg, i) => (
            <span key={i} style={{ fontSize: 14, color: 'var(--text-1)', ...(seg.bold ? { fontWeight: 600 } : {}) }}>
              {seg.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 踩坑笔记

- insight 变体：`borderImage` 会让 `borderRadius` 失效。已改用 mask-based 伪元素方案实现渐变边框 + 圆角（`borderRadius: 8`）。
- summary 变体的 Tag 不使用 MTD 的内置 theme，而是通过 style 自定义颜色，确保与设计稿完全一致。
- list/cards 变体使用主题色 AI 图标（`linear-gradient(135deg, var(--color-primary-1) 0%, var(--color-brand-primary) 100%)` 渐变），label 色值同步改为 `var(--color-brand-primary)`，两者都随主题（工具蓝/美团黄）实时联动，与 insight 的固定三色渐变图标（不随主题变化）有明确视觉区分。曾错误地硬编码为 `#468DFB → #166FF7`/`#166FF7`，切换到美团黄主题时不会跟着变色，已修正为 token 引用。
