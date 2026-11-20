# W-6 · 最新动态 (Latest Updates)

> **统一描述字段**：用途与边界 → 输入 → 布局与组合 → 状态 → 事件 → 约束与验证 → 实现映射。按 [模块描述规范](../module-contract.md) 解读本文；原章节保留具体规格与代码，静态模块无交互时标注不适用。

工作台右侧边栏卡片：图片/资讯轮播，用于展示运营动态或图文资讯流。比 W-1「轮播图」变体更轻量——演示采用纯色块和简短占位文案，侧栏保持轻量。

## 何时用
- 最新动态 / 资讯轮播 / 动态展示 / 运营动态（侧边栏轻量位）。

---

## 布局 (ASCII)

```
┌───────────────────────────┐
│ 最新动态                  │
├───────────────────────────┤
│                           │
│        动态 1             │
│                           │
└───────────────────────────┘
  自动轮播，无箭头，无指示点强调
```

---

## 视觉规格 (JSON)

```json
{
  "card": {
    "width": 240,
    "background": "var(--bg-card)",
    "border_radius": "var(--radius-3)"
  },
  "carousel": {
    "item_height": 120,
    "item_background": "var(--bg-page)",
    "autoplay": true,
    "arrow": "never",
    "border_radius": 8,
    "text_font_size": "var(--fs-12)",
    "text_color": "var(--text-4)"
  }
}
```

---

## 数据结构

```json
{
  "slides": [
    { "id": "string | number", "label": "string (占位文案，如 '动态 1')" }
  ]
}
```

---

## 约束

1. 固定出现在工作台右侧边栏，通常位于 W-4/W-5 下方（今日待办、公告通知之后）。
2. `Carousel` 关闭箭头（`arrow="never"`），保持视觉轻量，不与主内容区的轮播抢注意力。
3. 演示用 `--bg-page` 背景 + `--text-4` 居中文字。占位素材不泛化为业务限制；真实资讯可按需求替换图片或文案，但仍需保持 120px 轻量侧栏结构。
4. 无变体，保持单一形态。
5. `borderRadius: 8` 用于内部轮播容器，轮播容器需 `overflow: hidden` 裁切圆角。

---

## 自检
- [ ] Carousel 箭头关闭（arrow="never"）
- [ ] 示例占位与真实业务素材边界清楚，内容保持轻量
- [ ] 容器 overflow:hidden 裁切圆角
- [ ] 位于右侧边栏 W-4/W-5 之后

---

## MTD 实现

> 本文件为 MTD 组件库的实现细节。通用设计规格见 `Workbench6-latest-updates.md`。

## L3 组件映射

| 功能 | Vue3 (`@ss/mtd-vue3`) | React (`@ss/mtd-react3`) |
|------|----------------------|--------------------------|
| 卡片容器 | `mtd-card` | `<Card>` |
| 轮播 | `mtd-carousel` | `<Carousel>` |

纯 MTD，无图表，无变体。

## MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct --components=Card,Carousel --target=mtd-react --quiet
```

## 骨架代码 · React

```jsx
import { Card, Carousel } from '@ss/mtd-react3'

<Card header="最新动态" style={{ width: 240 }}>
  <Carousel autoplay={slides.length > 1} arrow="never" height={120}>
    {slides.map((u) => (
      <div
        key={u.id}
        style={{
          height: 120,
          background: 'var(--bg-page)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-4)',
          fontSize: 12,
        }}
      >
        {u.label}
      </div>
    ))}
  </Carousel>
</Card>
```

## 骨架代码 · Vue3

```vue
<template>
  <mtd-card header="最新动态" style="width: 240px">
    <mtd-carousel :autoplay="slides.length > 1" arrow="never" :height="120">
      <div
        v-for="u in slides"
        :key="u.id"
        class="update-slide"
      >
        {{ u.label }}
      </div>
    </mtd-carousel>
  </mtd-card>
</template>

<style scoped>
.update-slide {
  height: 120px;
  background: var(--bg-page);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-4);
  font-size: 12px;
}
</style>
```

## 踩坑笔记

- `Carousel` 容器需 `overflow: hidden`（组件默认自带，若自定义外层包裹要保留）以裁切圆角。
- 不要给 `arrow="never"` 的轮播额外加指示点强调样式，保持视觉轻量、不抢主内容区注意力。

## 状态与事件

空 slides 显示“暂无动态”并不挂载 Carousel；单条关闭自动播放，多条自动轮播。索引由 Carousel 内部持有，无额外业务提交事件。预览与工作台共用 LatestUpdates，演示不代表资讯接口已经接入。组件是轻量资讯轮播，不是指标统计卡。
