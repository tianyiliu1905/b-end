# Detail3 · 附件预览（AttachmentPreview）

> **一句话定位**：以缩略图或文件链接列表形式展示详情页关联的图片、文档等附件，支持点击放大预览或下载，纯只读展示。

---

## 一、何时用

- prompt 提到图片 / 附件 / 文件预览
- 详情页需要展示计划书、合同、测算表等关联文档
- 需要展示现场照片、凭证图片等图片类附件

模块内部按附件类型分成两类子区域，**按需二选一或都用**：

- **图片类附件** → 缩略图网格 + 点击放大预览（Lightbox）。
- **文件类附件**（pdf/xlsx/word 等非图片文档）→ 纯文字链接列表，**默认不带图标、不显示文件大小、多个文件横向并排展示**。

通常嵌套在某个分组分段（F2 GroupSection）内部，作为该分组的最后一类内容出现（例如"附件"这个分组标题下面直接挂载本模块）。

**不适用场景：**

- 单张关联图片作为某个字段的取值展示（如"身份证照片"这种单值字段，应直接作为 D2 描述列表某一项的值展示，不需要用整个附件预览模块）
- 附件需要支持上传/删除等编辑操作（本模块定位是详情页纯只读展示，编辑态附件上传控件属于表单域，不在本模块范围）

---

## 二、布局 (ASCII)

### 2.1 整体结构

```Plain
┌────────────────────────────────────────┐
│ [缩略图1] [缩略图2]  ← 图片类附件（可选，96×96px 网格）
│                                          │
│ 文件名一.pdf   文件名二.xlsx   文件名三.docx │  ← 文件类附件（纯文字蓝色链接，横向并排）
└────────────────────────────────────────┘
```

> 图片区与文件链接区是否同时出现取决于业务实际附件构成；只有文件、没有图片时，直接省略图片区，只渲染文件链接列表。

### 2.2 文件链接样式（⚠️ 默认约束，与约束原则 1-4 对应）

```css
.attachment-preview__files {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 24px;   /* 行间距 8px，同行文件间距 24px */
}

.attachment-preview__file-link {
  color: var(--color-brand-primary);
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  text-decoration: none;
}

.attachment-preview__file-link:hover {
  text-decoration: underline;
}
```

结构示意（伪代码）：

```Plain
容器(.attachment-preview__files, flex-wrap)
  文件链接 × N（纯文字，color: var(--primary)，无图标、无文件大小）
```

> **踩坑提醒**：不要在文件链接前后加图标或文件大小文字，也不要给每个文件项包一层带背景色的卡片容器（如 `background: #f7f8fa` 的块状样式）——这是本模块早期草稿的样式，已废弃，当前默认形态是纯文字链接。

### 2.3 图片缩略图样式（可选，仅图片类附件需要）

```css
.attachment-preview__images {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.attachment-preview__image {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--divider);
}
```

> 图片区默认不启用，仅当详情页确实有图片类附件（如现场照片、凭证扫描件）时才加上；纯文档类附件（pdf/xlsx/word）不需要图片区。图片放大预览（Lightbox）建议用 MTD `Image.PreviewGroup` 实现（见下方代码骨架）。

### 2.4 数值汇总

| 项目 | 取值 |
| --- | --- |
| 文件链接文字颜色 | `var(--primary)` |
| 文件链接字号/行高 | `14px / 22px` |
| 文件链接间距（行内/换行） | `24px`（同行）/ `8px`（换行） |
| 文件链接 hover 效果 | 仅加下划线，不变色 |
| 缩略图尺寸 | `96 × 96px` |
| 缩略图间距 | `12px` |
| 缩略图圆角 | `4px` |
| 缩略图边框 | `1px solid #f0f0f0` |

---

## 三、约束

1. **文件类附件默认纯文字链接** —— 文件名本身就是蓝色可点击文字（`color: var(--primary)`），点击即代表下载/查看，不需要额外的"下载"文字或按钮。⚠️ 默认约束
2. **文件类附件不带图标** —— 保持纯文字列表的轻量感（原因见下方踩坑笔记）。
3. **文件类附件不显示文件大小** —— 只展示文件名，不展示 KB/MB 等大小信息。
4. **多个文件横向并排展示** —— 使用 `flex-wrap: wrap` 让文件链接在同一行并排排列，超出宽度自动换行，而非纵向堆叠一行一个。
5. **图片类附件用缩略图网格** —— 若附件包含图片，图片区域与文件链接区域上下分层展示，图片区在上、文件链接区在下；缩略图尺寸 96×96px，`object-fit: cover`，支持点击放大。
6. **无附件时的兜底** —— 若某详情页该分组下确实没有任何附件，直接不渲染本模块（不展示"暂无附件"这类空态文案，除非业务明确要求）。

> 通用纪律：所有像素/颜色结论以浏览器实测为准（`getComputedStyle`），**CLI 截图不可信**。

---

## 四、L3 组件映射与 MTD 查询

### 4.1 L3 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) |
|------|--------------------------|----------------------|
| 文件链接 | 原生 `<a>`（无需组件库） | 原生 `<a>`（无需组件库） |
| 图片缩略图 | `<Image>` | `<mtd-image>` |
| 图片放大预览 | `<Image.PreviewGroup>` | `<mtd-image-preview-group>` |

### 4.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Image --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Image --target=mtd-vue --quiet
```

---

## 五、代码骨架

### 5.1 文件链接列表 · React

```tsx
const attachmentFiles = [
  { name: '运力保障计划书.pdf' },
  { name: '预算测算表.xlsx' },
];

<div className="attachment-preview__files">
  {attachmentFiles.map((file) => (
    <a className="attachment-preview__file-link" key={file.name}>
      {file.name}
    </a>
  ))}
</div>
```

### 5.2 文件链接列表 · Vue3

```vue
<template>
  <div class="attachment-preview__files">
    <a
      v-for="file in attachmentFiles"
      :key="file.name"
      class="attachment-preview__file-link"
    >
      {{ file.name }}
    </a>
  </div>
</template>

<script setup>
const attachmentFiles = [
  { name: '运力保障计划书.pdf' },
  { name: '预算测算表.xlsx' },
];
</script>
```

### 5.3 图片缩略图（可选）· React

```tsx
import { Image } from '@ss/mtd-react3';

const attachmentImages = ['/path/to/img1.jpg', '/path/to/img2.jpg'];

<Image.PreviewGroup>
  {attachmentImages.map((src) => (
    <Image
      key={src}
      src={src}
      width={96}
      height={96}
      objectFit="cover"
      className="attachment-preview__image"
    />
  ))}
</Image.PreviewGroup>
```

### 5.4 图片缩略图（可选）· Vue3

```vue
<template>
  <mtd-image-preview-group>
    <mtd-image
      v-for="src in attachmentImages"
      :key="src"
      :src="src"
      width="96"
      height="96"
      object-fit="cover"
      class="attachment-preview__image"
    />
  </mtd-image-preview-group>
</template>

<script setup>
const attachmentImages = ['/path/to/img1.jpg', '/path/to/img2.jpg'];
</script>
```

---

## 六、踩坑笔记

- **文件链接不要加图标**：不使用 `<Icon>`（如 `file-fill`/`file-o`）区分文件类型，这是本模块早期草稿的样式，已废弃；当前 MTD 组件库中也没有语义完全匹配的"曲别针/附件"图标（已排查 `@ss/mtd-react3` 内置 icon 集，无 `clip`/`attach`/`pin` 前缀的图标）。
- **文件链接用原生 `<a>` 即可，不需要引入组件库的 Link/Button 组件**：本模块的文件链接语义就是"点击文字=下载/查看"，用原生 `<a>` 加 CSS 着色最简单，无需额外组件依赖。
