# W-1 · 欢迎栏 (Welcome Banner)

工作台页面最顶部的问候横幅，承载「早上好+姓名」问候语 + 今日概述 + 一个主操作按钮，或轮播运营/公告图。是工作台页面进入视野的第一个模块。

## 何时用
- 工作台首页顶部 / 欢迎语 / 问候栏 / 早上好 / 轮播图。

---

## 布局 (ASCII)

```
变体 A · 文字欢迎
┌─────────────────────────────────────────────────────────────────┐
│  早上好，张经理                                                  │
│  今日有 12 项待办任务，2 条系统告警需处理                        │
│  [去处理]                                                        │
└─────────────────────────────────────────────────────────────────┘
  渐变背景卡片（主题色阶渐变：--color-primary-4（浅色背景） → --color-primary-1（hover 色阶，作为略深的渐变终点），随主题联动）

变体 B · 轮播图
┌─────────────────────────────────────────────────────────────────┐
│  618 大促活动即将开始                              ┌──────────┐  │
│  全品类满减优惠，点击查看活动详情                  │  配图占位 │  │
│                                                     └──────────┘  │
│                          ● ○ ○  （轮播指示点，hover 显示箭头）    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 视觉规格 (JSON)

```json
{
  "banner_card": {
    "padding": "32px 28px 28px 32px",
    "border_radius": "var(--radius-2)",
    "background_text_variant": "linear-gradient(135deg, var(--color-primary-4), var(--color-primary-4) 60%, var(--bg-page))",
    "background_carousel_variant": "linear-gradient(135deg, var(--color-primary-4), var(--color-primary-1))"
  },
  "greeting": {
    "title_font_size": "var(--fs-24)",
    "title_font_weight": "var(--fw-semibold)",
    "title_color": "var(--text-1)",
    "desc_font_size": "var(--fs-14)",
    "desc_color": "var(--text-3)"
  },
  "cta_button": {
    "type": "primary",
    "size": "small",
    "align": "self-start"
  },
  "carousel": {
    "item_height": 160,
    "autoplay": true,
    "arrow": "hover",
    "text_area": {
      "title_font_size": "var(--fs-18)",
      "title_font_weight": "var(--fw-semibold)",
      "desc_font_size": "var(--fs-12)",
      "desc_color": "var(--text-3)"
    },
    "image_placeholder": { "width": 120, "height": 100, "border_radius": 8 }
  }
}
```

---

## 数据结构

```json
{
  "textVariant": {
    "userName": "string",
    "summary": "string (今日待办/告警数概述)",
    "ctaLabel": "string"
  },
  "carouselVariant": {
    "slides": [
      { "title": "string", "desc": "string" }
    ]
  }
}
```

---

## 约束

1. 始终位于工作台页面左侧主内容区最顶部，是进入页面后第一眼看到的模块。
2. 「文字欢迎」变体：渐变背景 + 问候语 + 一句今日概述 + 一个主操作按钮（`type="primary"`），按钮左对齐（`alignSelf: flex-start`），不要撑满宽度。
3. 「轮播图」变体：`autoplay` 开启，箭头仅 hover 时显示（`arrow="hover"`）；每屏文案 + 右侧图片占位（图片留白用色块，不强行找配图）。
4. 两种变体互斥，不同时出现；具体用哪种看业务是否有运营轮播位诉求。
5. 渐变背景色值必须走主题色阶 token（`--color-primary-4`浅色背景 + `--color-primary-1` hover 色阶），随主题切换（工具蓝/美团黄）自动联动，禁止写死浅紫/浅蓝之类与主题无关的固定色值。

---

## 变体

### 文字欢迎
纯问候语场景，无运营位诉求时的默认选择。信息层级：称呼 > 概述 > 一个 CTA。

### 轮播图
有多条运营/公告/活动信息需要滚动展示时使用，用 Carousel 承载，替代静态问候语。

---

## 自检
- [ ] 渐变背景色值来自 `--color-primary-4`/`--color-primary-1` 等主题色阶 token，随主题切换联动
- [ ] 文字欢迎变体的 CTA 按钮左对齐、非撑满宽度
- [ ] 轮播图变体 autoplay 开启、箭头 hover 显示
- [ ] 两变体互斥，不叠加使用

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Workbench1-welcome-banner.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 按钮 | `mtd-button` | `<Button>` |
| 轮播 | `mtd-carousel` | `<Carousel>` |

纯 MTD，无图表。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Button,Carousel --target=mtd-react --quiet
```

## 骨架代码 · React（文字欢迎变体）

```jsx
import { Card, Button } from '@ss/mtd-react3'

<Card
  style={{ marginBottom: 0, background: 'linear-gradient(135deg, var(--color-primary-4), var(--color-primary-4) 60%, var(--bg-page))', padding: '32px 28px 28px 32px' }}
>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <h2 style={{ fontSize: 'var(--fs-24)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-1)', margin: 0 }}>
      早上好，{userName}
    </h2>
    <span style={{ fontSize: 'var(--fs-14)', color: 'var(--text-3)' }}>{summary}</span>
    <Button type="primary" size="small" style={{ alignSelf: 'flex-start' }}>{ctaLabel}</Button>
  </div>
</Card>
```

## 骨架代码 · React（轮播图变体）

```jsx
import { Carousel } from '@ss/mtd-react3'

<div style={{ borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
  <Carousel style={{ width: '100%' }} autoplay arrow="hover">
    {slides.map((item, idx) => (
      <div key={idx} style={{ height: 160, background: 'linear-gradient(135deg, var(--color-primary-4), var(--color-primary-1))', display: 'flex', alignItems: 'center', padding: '0 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-1)' }}>{item.title}</span>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-3)' }}>{item.desc}</span>
        </div>
        <div style={{ marginLeft: 'auto', width: 120, height: 100, borderRadius: 8, background: 'var(--color-primary-4)', flexShrink: 0 }} />
      </div>
    ))}
  </Carousel>
</div>
```

## 骨架代码 · Vue3

```vue
<template>
  <mtd-card class="welcome-banner" v-if="variant === 'text'">
    <div class="welcome-content">
      <h2>早上好，{{ userName }}</h2>
      <span class="summary">{{ summary }}</span>
      <mtd-button type="primary" size="small">{{ ctaLabel }}</mtd-button>
    </div>
  </mtd-card>
  <mtd-carousel v-else autoplay arrow="hover">
    <div v-for="(item, idx) in slides" :key="idx" class="slide">
      <div class="slide-text">
        <span class="slide-title">{{ item.title }}</span>
        <span class="slide-desc">{{ item.desc }}</span>
      </div>
      <div class="slide-image-placeholder" />
    </div>
  </mtd-carousel>
</template>
```

## 踩坑笔记

- 两种变体不要用 CSS 显隐切换，直接按业务场景在组件树里二选一渲染（省去无用 DOM）。
- 渐变背景色值必须走 `--color-primary-1`/`--color-primary-4` 等主题色阶 token，不要为了「好看」现取一个跟主题无关的固定色值（曾经错误地用过 `#EEF2FF`/`#E0E7FF`/`#C7D2FE` 这类薰衣草色，切换到美团黄主题后会显得非常突兀，已修正）。
- `Carousel` 的 `arrow="hover"` 需要容器有明确宽度，否则箭头定位可能错位。
