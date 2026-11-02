# W-6 · 最新动态 (Latest Updates)

工作台右侧边栏卡片：图片/资讯轮播，用于展示运营动态或图文资讯流。比 W-1「轮播图」变体更轻量——纯色块占位，无文案排版，仅作动态感知用途。

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
3. 每屏内容用纯色块占位（`#F3F4F6` 灰底）+ 居中弱化文字（`#9CA3AF`），不强行塞入真实图片/复杂排版——这是与 W-1「轮播图」变体的核心区别。
4. 无变体，保持单一形态。
5. `borderRadius: 8` 与卡片圆角protocol统一，轮播容器需 `overflow: hidden` 裁切圆角。

---

## 自检
- [ ] Carousel 箭头关闭（arrow="never"）
- [ ] 内容为纯色块占位，非真实复杂排版
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
  <Carousel autoplay arrow="never">
    {updates.map((u, i) => (
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
    <mtd-carousel autoplay arrow="never">
      <div
        v-for="u in updates"
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
