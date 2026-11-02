import { Tag } from '@ss/mtd-react3';

interface DigestItem {
  label: string;
  text: string;
}

/** 富文本片段：普通文字 or 加粗文字 */
interface RichTextSegment {
  text: string;
  bold?: boolean;
}

interface DigestCardProps {
  title?: string;
  items?: DigestItem[];
  /** 四种变体：list / cards / summary（标的结论） / insight（智能洞察） */
  variant?: 'list' | 'cards' | 'summary' | 'insight';
  highlightColor?: string;
  /** summary 变体：结论标签文字 */
  tagText?: string;
  /** summary 变体：标签类型（success / warning / danger） */
  tagType?: 'success' | 'warning' | 'danger';
  /** summary / insight 变体：富文本段落 */
  richContent?: RichTextSegment[];
  /** insight 变体：右侧提示文字 */
  hint?: string;
}

/**
 * 将文本中的关键数据（数字、百分比、带单位的数值）用指定颜色高亮
 */
function highlightData(text: string, color: string) {
  // 匹配：数字(含逗号/小数) + 可选单位/百分号，以及 "±数字%" 形式
  const pattern = /([+-]?\d[\d,]*\.?\d*\s*[%万亿元单条项家次人天周月季年笔个件份]?)/g;
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <span key={i} style={{ color, fontWeight: 600 }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/** 渲染富文本片段列表 */
function renderRichContent(segments: RichTextSegment[]) {
  return segments.map((seg, i) => (
    <span
      key={i}
      style={{
        color: '#111925',
        fontSize: 14,
        fontFamily: 'PingFang SC, -apple-system, sans-serif',
        lineHeight: '22px',
        ...(seg.bold ? { fontWeight: 600 } : {}),
      }}
    >
      {seg.text}
    </span>
  ));
}

/** Tag 配色映射 */
const tagColorMap = {
  success: { bg: '#E6FFF0', color: '#00A854' },
  warning: { bg: '#FFF6F0', color: '#FF7700' },  /* Orange-1, Orange-5 */
  danger:  { bg: '#FFF2F2', color: '#FF1F1F' },  /* Red-1, Red-5 */
};

/**
 * D-11 AI 摘要卡（核心结论）
 * 四种变体：
 *   - list: 一行行列表展示（label: text）— 旧版经营诊断
 *   - cards: 三张子卡片，每张有小标题 + 详细内容 — 旧版卡片
 *   - summary: 标的结论（白底 + 标题 + Tag + 富文本段落）— 设计稿"总结"
 *   - insight: 智能洞察（浅绿背景 + 渐变边框 + AI 图标 + 富文本）— 设计稿"智能洞察"
 */
export default function DigestCard({
  title,
  items = [],
  variant = 'list',
  highlightColor = 'var(--text-1, #111925)',
  tagText,
  tagType = 'success',
  richContent,
  hint,
}: DigestCardProps) {

  /* ── summary 变体：标的结论 ── */
  if (variant === 'summary') {
    const tColor = tagColorMap[tagType];
    return (
      <div
        className="dash-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: 20,
          background: '#FFFFFF',
          borderRadius: 6,
        }}
      >
        {/* 标题行：标题 + Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#111925', fontSize: 18, fontWeight: 500, lineHeight: '26px' }}>
            {title || '标的结论'}
          </span>
          {tagText && (
            <Tag
              style={{
                background: tColor.bg,
                color: tColor.color,
                border: 'none',
                borderRadius: 4,
                padding: '1px 4px',
                fontSize: 14,
                lineHeight: '22px',
              }}
            >
              {tagText}
            </Tag>
          )}
        </div>

        {/* 内容区：富文本段落 */}
        {richContent && richContent.length > 0 && (
          <div style={{ lineHeight: '22px' }}>
            {renderRichContent(richContent)}
          </div>
        )}
      </div>
    );
  }

  /* ── insight 变体：智能洞察 ── */
  if (variant === 'insight') {
    return (
      <div
        className="dash-card"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: 16,
          background: 'var(--color-primary-4, #F0F6FF)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* 渐变边框：用伪元素实现，避免 borderImage 导致 borderRadius 失效 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            padding: 1,
            background: 'linear-gradient(95deg, #04D0C7 0%, #1E85F9 49%, #C164FE 99%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          }}
        />
        {/* 标题行：AI 图标 + 标题 / 右侧提示 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {/* AI 渐变图标 */}
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #04D0C7 0%, #1E85F9 50%, #C164FE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="white" />
              </svg>
            </div>
            <span style={{ color: '#111925', fontSize: 14, fontWeight: 500, lineHeight: '22px' }}>
              {title || '智能洞察'}
            </span>
          </div>
          {hint && (
            <span style={{ color: 'rgba(17,25,37,0.45)', fontSize: 14, lineHeight: '22px', flexShrink: 0 }}>
              {hint}
            </span>
          )}
        </div>

        {/* 内容区：富文本段落 */}
        {richContent && richContent.length > 0 && (
          <div style={{ lineHeight: '22px' }}>
            {renderRichContent(richContent)}
          </div>
        )}
      </div>
    );
  }

  /* ── list 变体（原有） ── */
  if (variant === 'list') {
    return (
      <div
        className="dash-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* 头部：图标 + 标题 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary-1) 0%, var(--color-brand-primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 'var(--fs-16, 16px)', fontWeight: 600, color: 'var(--text-1, #111927)', flex: 1 }}>
            {title || '核心结论'}
          </span>
        </div>

        {/* 内容区 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item) => (
            <div key={item.label} style={{ display: 'flex', gap: 8, lineHeight: 1.6 }}>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 'var(--fs-13, 13px)',
                  fontWeight: 600,
                  color: 'var(--color-heading-accent)',
                }}
              >
                {item.label}：
              </span>
              <span style={{ fontSize: 'var(--fs-13, 13px)', color: 'var(--text-2, #4B5563)' }}>
                {highlightData(item.text, highlightColor)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── cards 变体（原有） ── */
  return (
    <div
      className="dash-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* 头部：图标 + 标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary-1) 0%, var(--color-brand-primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 'var(--fs-16, 16px)', fontWeight: 600, color: 'var(--text-1, #111927)', flex: 1 }}>
            {title || '核心结论'}
          </span>
        </div>

      {/* 内容区 */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)`, gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              background: 'rgba(17,25,37,0.03)',
              borderRadius: 8,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 'var(--fs-14, 14px)', fontWeight: 600, color: 'var(--color-heading-accent)' }}>
              {item.label}
            </span>
            <span style={{ fontSize: 'var(--fs-13, 13px)', color: 'var(--text-2, #4B5563)', lineHeight: 1.6 }}>
              {highlightData(item.text, highlightColor)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
