# Detail2 · 描述列表（DescriptionList）

> **一句话定位**：以「标签 + 值」键值对形式展示只读信息，是详情页最高频的展示模块，几乎每个详情页都会用到。与表单页字段展示的关键差异：本模块纯只读，不含任何可编辑控件。

---

## 一、何时用

- 以键值对形式纵向或横向展示只读信息（基本信息、字段详情等）。
- 当 prompt 提到基本信息 / 描述列表 / 键值对时使用。
- 详情页最高频的展示模块，几乎每个详情页都会用到。
- 与表单页字段展示的关键差异：本模块纯只读，不含任何可编辑控件。

## 二、布局

描述列表通过 **flex-wrap + 百分比列宽** 实现多列布局（不依赖 Row/Col 栅格），每个字段由 label（标签）和 value（值）组成。根据列数不同，label 与 value 的排列方式分为两种模式：

```Plain
┌────────────────────────────────────────────────────────────────┐
│ ┌─ 名称 ──────── 配送规则 A ────┐ ┌─ 状态 ──── 生效 ──────┐ │ ← 2 列：每列 width 50%
├────────────────────────────────────────────────────────────────┤
│ ┌─ 创建人 ────── 张三 ──────────┐ ┌─ 创建时间 ─ 2024-01-15 ┐ │ ← label 固定宽度，value 占余宽
├────────────────────────────────────────────────────────────────┤
│ ┌─ 所属门店 ──── 北京朝阳店 ────┐ ┌─ 备注 ──── 暂无 ──────┐ │ ← value 可为链接或空值占位
└────────────────────────────────────────────────────────────────┘
  ← 3 列时每列 33.3333%；4 列时 25% 且 label 在上、value 在下以增加可用宽度
```

### 2.1 横向排列（2 列 / 3 列，默认模式）

label 与 value **同行水平排列**：label 固定宽度居左，value 占据剩余空间。

视觉参数：

- **label 颜色**：`var(--text-4)` = `rgba(17, 25, 37, 0.45)` 次要信息色
- **value 颜色**：`var(--text-2)` = `rgba(17, 25, 37, 0.85)` 正文色
- **字号**：label 与 value 均为 14px，行高 22px
- **label 宽度**：2 列模式 96px，3 列模式 80px
- **字段间距**：`padding: 8px 16px 8px 0`（上下 8px，右侧 16px，左侧 0）。配合 22px 行高，单行字段行高 38px
- **长文本处理**：value 区域 `word-break: break-all`，允许在任意字符处换行，保证不溢出列宽

### 2.2 纵向排列（4 列，信息密集模式）

当列数达到 4 列时，每列可用宽度较窄，横向排列会导致 value 文本被频繁截断。因此 4 列模式下 label 与 value **上下纵向排列**：label 在上、value 在下。

视觉参数：

- **label 颜色 / 字号**：`var(--text-4)`，13px
- **value 颜色 / 字号**：`var(--text-2)`，14px
- **label 宽度**：`100%`（纵向排列下独占一行）
- **字段间距**：`padding: 8px 12px 8px 0`（上下与 2/3 列保持一致，仅右侧留白收窄到 12px）
- **label 与 value 间距**：`gap: 2px`（字段内部的紧凑间距，与字段之间的 8px 形成分组对比）
- **长文本处理**：`word-break: normal; overflow-wrap: break-word`（按词断行，不在字符中间截断）

### 2.3 值的类型渲染

描述列表的 value 支持以下几种渲染形式：

- **纯文本**（默认）：普通文本展示，使用 `var(--text-2)` 正文色
- **链接文本**：使用主题色 `var(--primary)` 渲染，带 cursor: pointer，hover 时显示下划线。适用于可跳转的关联字段（如"所属SPU"跳转到 SPU 详情）
- **空值占位**：当 value 为空时显示 `"-"`（由组件层 `{item.value || '-'}` 兜底），使用 `var(--text-4)` 次要信息色

---

## 三、可配参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | `2 \| 3 \| 4` | `2` | 列数。2 列适用于大多数场景（≤12 个字段）；3 列适用于中等密度信息；4 列适用于信息密集展示（≥8 个字段且每个值较短） |
| items | `DescItem[]` | — | 字段列表，每项包含 `label`（标签）、`value`（值）、`link`（可选，是否渲染为链接） |

### 列数选择指引

- **2 列**（默认）：字段数 ≤ 12 个，或字段值普遍较长（如地址、描述、时间戳等），需要充足的 value 展示宽度。这是最常见的选择。
- **3 列**：字段数在 9~15 个之间，且值长度适中（如状态、编码、人名等中短文本）。需要确认页面宽度足够（有侧导时慎用）。
- **4 列**：字段数 ≥ 8 个，且值普遍为短文本（如状态、数值、百分比、人名等），强调信息密度优先。4 列模式自动切换为纵向排列（label 在上、value 在下）。

### 列宽换算

| 列数 | `width` | 排列方式 |
|------|---------|----------|
| 2 | `50%` | 横向（label 与 value 同行） |
| 3 | `33.3333%` | 横向 |
| 4 | `25%` | 纵向（label 在上、value 在下） |

---

## 四、约束

### 4.1 与只读数据表格（G3）的选择边界

- **单条记录的字段展示**用描述列表（D2）：如"SKU 基本信息"展示一条 SKU 的各个属性
- **多条记录的列表展示**用只读数据表格（G3）：如"DMX 维度数据"展示多行城市×时段的数据

判断原则：如果展示的是"一个实体的多个属性"，用 D2；如果展示的是"多个实体的同类属性"，用 G3。

### 4.2 MTD 组件库无 Descriptions 组件

MTD 组件库无原生 `Descriptions` 组件，需自行构建（详见下方 L3 组件映射）。

### 4.3 同一页面可混用不同列数

同一个详情页内的多个描述列表区域可以使用不同的列数。例如"基本信息"用 2 列（字段值较长），"运营指标"用 4 列（字段值较短）。每个描述列表实例独立配置 columns 参数。

### 4.4 奇数字段的末行留空

当字段总数不是列数的整数倍时，最后一行末尾的列自然留空，不需要用空白占位符填充。例如 11 个字段用 4 列排列，分 3 行展示为 4+4+3，最后一行第 4 列留空。

### 4.5 类名必须加唯一前缀（易踩）

普通 `.css` 是**全局作用域**。同一项目里往往有多个详情页（主从详情、弹窗详情、抽屉详情等）各自维护一份描述列表样式，如果都叫 `.description-list__item`，一旦这些样式表被同时打包加载就会互相覆盖，典型症状是**多列布局失效退化成单列**，且只在特定路由组合下复现，极难排查。

因此每个实例必须做样式隔离，二选一：

- **CSS Modules**（推荐）：文件名改为 `xxx.module.css`，类名自动哈希
- **唯一前缀**：如 `.dlp-list` / `.dlp-item` / `.dlp-label` / `.dlp-value`（`dlp` = 该页面组件名缩写）

### 4.6 窄屏回退

3 列 / 4 列在容器宽度不足时会挤压变形（尤其是同时存在一级 + 二级侧导时）。约定在 `max-width: 540px` 下统一退化为单列：

```css
@media (max-width: 540px) {
  .dlp-list--col3 .dlp-item,
  .dlp-list--col4 .dlp-item { width: 100%; }
}
```

---

## 五、L3 组件映射与 MTD 查询

本模块**不使用任何 MTD 组件**，纯 `<div>` + CSS 实现。

> ⚠️ **MTD 没有 Descriptions 组件**，不要尝试导入 `Descriptions`。
>
> ⚠️ **也不要用 Row/Col 栅格**。描述列表的列间距由字段项自身的 padding 控制，Row 的 gutter 必须为 0——此时栅格只剩「按 span 算宽度」一个作用，用 `flex-wrap` + 百分比宽度更直接，且少两层 DOM 与一个组件依赖。

---

## 六、代码骨架

> 类名前缀 `dlp-` 需按实际组件名替换（见 §4.5），下同。

### React

```tsx
interface DescItem {
  label: string;
  value: string;
  link?: boolean;
}

/**
 * 描述列表组件（D2）
 * @param items   - 字段列表
 * @param columns - 列数（2 | 3 | 4），默认 2
 *   - 2 列 / 3 列：label 与 value 横向排列（同行）
 *   - 4 列：label 与 value 纵向排列（上下）
 */
function DescriptionList({ items, columns = 2 }: { items: DescItem[]; columns?: 2 | 3 | 4 }) {
  return (
    <div className={`dlp-list dlp-list--col${columns}`}>
      {items.map((item) => (
        <div className="dlp-item" key={item.label}>
          <div className="dlp-label">{item.label}</div>
          <div className={item.link ? 'dlp-value dlp-value--link' : 'dlp-value'}>
            {item.value || '-'}
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### 使用示例

```tsx
{/* 2 列（默认）：字段值较长的场景 */}
<DescriptionList items={basicInfoItems} />

{/* 4 列：信息密集、值较短的场景 */}
<DescriptionList items={salesInfoItems} columns={4} />
```

### Vue3

```vue
<template>
  <div :class="`dlp-list dlp-list--col${columns}`">
    <div v-for="item in items" :key="item.label" class="dlp-item">
      <div class="dlp-label">{{ item.label }}</div>
      <div :class="['dlp-value', item.link && 'dlp-value--link']">
        {{ item.value || '-' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DescItem {
  label: string;
  value: string;
  link?: boolean;
}

withDefaults(defineProps<{
  items: DescItem[];
  columns?: 2 | 3 | 4;
}>(), { columns: 2 });
</script>
```

---

## 七、CSS

```css
/* ============================================================
 * D2 描述列表 —— flex-wrap 多列容器
 * ============================================================ */
.dlp-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

/* ============================================================
 * 字段项 —— 基础样式（2 列 / 3 列：label 与 value 横向同行）
 * ============================================================ */
.dlp-item {
  display: flex;
  box-sizing: border-box;
  padding: 8px 16px 8px 0;
  font-size: 14px;
  line-height: 22px;
  min-width: 0;
}

.dlp-list--col2 .dlp-item { width: 50%; }
.dlp-list--col3 .dlp-item { width: 33.3333%; }

.dlp-label {
  color: var(--text-4);          /* rgba(17,25,37,.45) 次要信息色 */
  flex-shrink: 0;
  width: 96px;                   /* 2 列默认 label 宽度 */
}

.dlp-value {
  color: var(--text-2);          /* rgba(17,25,37,.85) 正文色 */
  flex: 1;
  min-width: 0;
  word-break: break-all;
}

.dlp-value--link {
  color: var(--primary);
  cursor: pointer;
}

.dlp-value--link:hover {
  text-decoration: underline;
}

/* ============================================================
 * 3 列模式：label 收窄至 80px
 * ============================================================ */
.dlp-list--col3 .dlp-label { width: 80px; }

/* ============================================================
 * 4 列模式：label 与 value 纵向排列（label 在上、value 在下）
 * ============================================================ */
.dlp-list--col4 .dlp-item {
  width: 25%;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px 12px 8px 0;
}

.dlp-list--col4 .dlp-label {
  width: 100%;
  flex-shrink: 0;
  font-size: 13px;
}

.dlp-list--col4 .dlp-value {
  width: 100%;
  flex: none;
  font-size: 14px;
  word-break: normal;
  overflow-wrap: break-word;
}

/* ============================================================
 * 窄屏回退：3/4 列退化为单列
 * ============================================================ */
@media (max-width: 540px) {
  .dlp-list--col3 .dlp-item,
  .dlp-list--col4 .dlp-item { width: 100%; }
}
```

---

## 八、踩坑笔记

- **颜色 token 别用错档位（最易错）**：label 是 `--text-4`（.45）、value 是 `--text-2`（.85）。不要写成 `--text-3`（.65）和 `--text-1`（纯黑 #111925），会让两个颜色都深一档。⚠️ 尤其注意 `var(--text-3, rgba(17,25,37,0.45))` 这种写法——fallback 值看着是对的，但 `--text-3` 已定义，fallback 根本不生效，实际渲染成 .65，肉眼极难发现。
- **不要用 Row/Col 栅格**：列宽用百分比（50% / 33.3333% / 25%）配合 `flex-wrap`，不需要 24 栅格。栅格的 gutter 还必须设 0，反而更绕。
- **`.dlp-item` 必须设 `box-sizing: border-box`**：列宽用百分比 + 自带 padding，不设会导致宽度溢出、每行挤不下预期列数。
- **`.dlp-value` 要设 `min-width: 0`**：flex 子项默认 `min-width: auto`，长文本不会收缩，会把列撑破。
- **4 列模式必须纵向排列**：当有侧导时（侧导占 168px），4 列横向排列的每列可用宽度仅约 150px，label 占 72px 后 value 不到 80px，中文 2-3 个字就会换行，排版严重错乱。因此 4 列统一使用纵向排列（`flex-direction: column`），label 在上用小号字（13px），value 在下用正常字号（14px），列宽利用率大幅提高。
- **link 类型的值**：需要给 DescItem 添加 `link: true` 标记，组件会自动应用主题色 + pointer + hover 下划线。适用于可跳转的关联字段（如"所属SPU"）。
- **空值兜底在组件层做**：用 `{item.value || '-'}`，不要指望调用方每次都传 `'-'`。
- **label 宽度不要用百分比**：label 用固定像素值（96px / 80px / auto），不要用百分比。百分比会随容器宽度变化，导致不同描述列表实例的 label 宽度不一致。
