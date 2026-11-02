# Form2 · 分组分段（GroupSection）

---

## 一、何时用

- prompt 提到分组 / 多个区域 / 分几块填
- 一个表单页字段多、可明确切成多个业务区块（如基本信息 / 明细信息 / 附加信息）
- 落地页中的长表单，需要分组标题帮助用户建立结构认知

**不适用场景：**

- 字段很少、单一分组即可承载（用 BaseLayout 单区即可，不需要分组）
- 弹窗（Modal）内的表单——空间有限，不放分组分段
- 抽屉（Drawer）内的表单——最多 2–3 块
- 内容互斥、一次只看一类（应该用 Tabs 做内容切换，而不是全部展开）

> **L3优先级声明**：本文中的颜色、字号、间距等视觉参数属于模式层推荐值；如与 L3 原子规范冲突，应以 L3 为准。

> **锚点定位 tab 不在本模块判断**：当分组较多、需要在表单标题下方加一排锚点 tab 快速跳转时，「是否加、何时加」由 L1 装配逻辑（`page-表单页装配逻辑.md`）统一判断——这是整页编排层的决策，不是本模块的内部样式细节。本模块只需保证每个分组容器带稳定唯一的 id，供 L1 的锚点导航命中。

---

## 二、布局 (ASCII)

### 2.1 整体结构

```Plain
┌────────────────────────────────────────────────────────┐
│  表单页标题                                              │  ← 页面标题
├────────────────────────────────────────────────────────┤
│  ▌分组一                                    （id=group-1）│  ← 分组标题（加粗）
│     字段A    ………………………                              │
│     字段B    ………………………                              │     该组字段（BaseLayout）
├────────────────────────────────────────────────────────┤
│  ▌分组二                                    （id=group-2）│
│     字段C    ………………………                              │
├────────────────────────────────────────────────────────┤
│  ▌分组三                                    （id=group-3）│
│     字段D    ………………………                              │
└────────────────────────────────────────────────────────┘
```

> 图中"分组一/分组二/字段A"等均为占位文案，实际标题与字段由业务场景或用户需求决定。
> 是否在标题下方加锚点 tab，见 L1 装配逻辑「装配后处理」。

### 2.2 分组标题与间距

| 维度             | 值                       | 说明                                         |
| ---------------- | ------------------------ | -------------------------------------------- |
| 分组标题         | 加粗，约 16px            | 是分组内唯一强调元素，独占一行               |
| 标题与首个字段   | 16px                     | 标题下方到第一个字段的间距                   |
| 分组之间间距     | 24px（或加分割线）       | 区隔不同分组，比组内行间距大                 |
| 外间距（与相邻模块） | 由父容器 gap 产生，模块本身不设 margin | 避免与页面/卡片容器间距叠加出现双倍留白 |

### 2.3 分组标题样式（与 Anchor 联动时的确切规范）

当 L1 装配后处理判断需要加 Anchor 时（分组 > 3 组），每个分组标题同时作为锚点定位目标，必须使用以下 class 和样式：

**HTML**：`<h3 id="group-id" class="form-section__title">分组标题</h3>`

**完整样式（⚠️ 硬约束，与 G2-PageHeader 和 L1 装配逻辑中的定义完全一致）：**

```css
.form-section__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-1);
  line-height: 24px;
  margin: 24px 0 16px;
  /* ⚠ 硬约束（§四第 2 条）：禁止 border-bottom / padding-bottom，标题下方仅靠 margin 间距区隔，蓝色方块已标识边界 */
  display: flex;
  align-items: center;
  gap: 8px;
}
.form-section__title::before {
  content: '';
  display: inline-block;
  width: 2px;
  height: 16px;
  background: var(--primary);  /* 随主题色变化 */
  flex-shrink: 0;
  /* 无圆角 */
}
.form-section:first-child .form-section__title {
  margin-top: 0;
}
```

> ⚠️ 蓝色方块（`::before`，2px × 16px，`var(--primary)`，无圆角）是**所有分组标题的默认样式**，无论是否有 Anchor 都必须加。颜色使用 `var(--primary)` 随主题色变化而变化，不硬编码色值。若有 Anchor，id 值必须与 G2 PageHeader 中 `<mtd-anchor-link href="#xxx">` 的 href 完全对应。
>
> ⚠️ **易错点**：清零 `margin-top` 的选择器必须写在 `.form-section`（分组容器）这一层加 `:first-child`，即 `.form-section:first-child .form-section__title`，判断"这是不是第一个分组"。**不要**写成 `.form-section__title:first-child`——当每个分组是独立的 `<div class="form-section">` 包裹时，`<h3>` 在各自容器内天然都是第一个子元素，写在标题自身上的 `:first-child` 会对每一组都命中，导致所有分组的 24px 间距被清零、分组之间完全贴在一起。

### 2.4 数值汇总

| 项目              | 取值                       |
| ----------------- | -------------------------- |
| 分组标题字号/字重 | `16px` / `600`             |
| 分组标题颜色      | `#1f2329`                  |
| 标题前蓝色方块    | `2px × 16px`，`var(--primary)`，无圆角 |
| 标题底部分割线    | 无（不加 border-bottom）   |
| 标题与首字段间距  | `16px`（由标题 `margin-bottom` 控制）|
| 分组间距（margin-top）| `24px`                 |
| 分组容器 id       | 稳定唯一 key（如 `group-1`）|

---

## 三、变体

| 变体           | 特征                                       | 何时用                              |
| -------------- | ------------------------------------------ | ----------------------------------- |
| 基础分组       | 多组纵向铺开，每组带标题                   | 字段中等到多、可切块                |
| 折叠分组       | 分组可展开/收起（默认展开重点组）          | 分组很多、部分组非必填或低频        |
| 分步分组       | 分组拆到多步中，**每步一个独立表单**，一次只填一步 | 流程性强、需引导按序填；由 L1 选择步骤落地页容器后，容器按步条件渲染各步表单（每步内部可再用分组分段组织字段） |

> 分组较多时是否叠加锚点定位 tab，由 L1 装配逻辑判断，不在本模块的变体里展开。

---

## 四、约束

1. **每组必须有分组标题** —— 分组标题是分组的语义锚，加粗、独占一行，是该组内唯一的强调元素。标题文案由业务场景或用户需求决定（如"基本信息""明细信息"），规范不写死。

2. **分组标题下方不加分割线**（⚠ 硬约束） —— 分组标题与首个字段之间仅用间距区隔，不加 `border-bottom` / `padding-bottom`，蓝色方块 `::before` 已标识边界。完整 CSS 及易错点见 §二 2.3。

3. **每个分组容器必须有稳定唯一的 id** —— 用稳定 key（如 `group-1`），不要用会变的下标/随机值。这样 L1 装配逻辑判断需要加锚点导航时，锚点的 `href` 才能命中对应分组。

4. **分组之间的区隔大于组内行间距** —— 分组之间用更大的间距（或分割线）区隔，组内字段行间距更紧，形成"组与组松、组内字段紧"的视觉层级。

5. **禁止使用「左侧高亮色条」样式的圆角矩形**（⚠ 硬约束） —— 不得在分组内部使用 `border-left: Npx solid <color>` + 浅色背景的"竖条 alert"样式（如 `border-left: 3px solid orange` + `background: #FFF4E6` 的警示卡片）。这种样式与分组标题的 `::before` 竖条（2px × 16px）在视觉上产生冲突，会干扰分组边界的识别。需要提示/警示信息时，统一使用 MTD 的 `<Announcement>` / `<mtd-announcement>` 组件（`type="warning"` / `type="info"`），不自造 alert 样式。

---

## 五、L3 组件映射与 MTD 查询

### 5.1 L3 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) |
|------|--------------------------|----------------------|
| 表单容器 | `<Form>` | `<mtd-form>` |
| 表单项 | `<Form.Item>` | `<mtd-form-item>` |
| 输入框 | `<Input>` | `<mtd-input>` |
| 下拉选择 | `<Select>` + `<Select.Option>` | `<mtd-select>` + `<mtd-option>` |
| 日期选择 | `<DatePicker>` | `<mtd-date-picker>` |
| 数字输入 | `<InputNumber>` | `<mtd-input-number>` |
| 锚点导航 | `<Anchor>` + `<Anchor.Link>` | `<mtd-anchor>` + `<mtd-anchor-link>` |

### 5.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Form,Input,Select,DatePicker,InputNumber,Anchor --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Form,Input,Select,DatePicker,InputNumber,Anchor --target=mtd-vue --quiet
```

---

## 六、代码骨架

### 6.1 基础分组骨架 · React

```tsx
import { Form, Input, Select, DatePicker, InputNumber, Button } from '@ss/mtd-react3';

export default function GroupSectionForm() {
  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="120px"
      useContext={true}
    >
      {/* ===== 分组1 ===== */}
      <div className="form-section" id="group-1">
        <h3 className="form-section__title">基本信息</h3>

        <Form.Item formItemKey="name" label="活动名称" required>
          <Input placeholder="请输入活动名称" toFormItem />
        </Form.Item>
        <Form.Item formItemKey="type" label="活动类型" required>
          <Select placeholder="请选择活动类型" toFormItem>
            <Select.Option value="manjian">满减</Select.Option>
            <Select.Option value="zhekou">折扣</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item formItemKey="date" label="生效日期" required>
          <DatePicker placeholder="请选择日期" toFormItem style={{ width: '100%' }} />
        </Form.Item>
      </div>

      {/* ===== 分组2 ===== */}
      <div className="form-section" id="group-2">
        <h3 className="form-section__title">规则配置</h3>

        <Form.Item formItemKey="threshold" label="满减门槛" required>
          <InputNumber placeholder="请输入" toFormItem style={{ width: '100%' }} min={0} precision={2} />
        </Form.Item>
        <Form.Item formItemKey="amount" label="优惠金额" required>
          <InputNumber placeholder="请输入" toFormItem style={{ width: '100%' }} min={0} precision={2} />
        </Form.Item>
      </div>

      {/* ===== 分组3 ===== */}
      <div className="form-section" id="group-3">
        <h3 className="form-section__title">投放范围</h3>

        <Form.Item formItemKey="city" label="适用城市" required>
          <Select placeholder="请选择" toFormItem multiple>
            <Select.Option value="beijing">北京</Select.Option>
            <Select.Option value="shanghai">上海</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item formItemKey="remark" label="备注">
          <Input.TextArea placeholder="请输入备注信息" rows={3} toFormItem />
        </Form.Item>
      </div>
    </Form>
  );
}
```

### 6.2 基础分组骨架 · Vue3

```vue
<template>
  <mtd-form
    ref="formRef"
    :model="formData"
    label-position="right"
    label-width="120px"
    class="section-form"
  >
    <!-- 分组1 -->
    <div class="form-section" id="group-1">
      <h3 class="form-section__title">基本信息</h3>
      <mtd-form-item prop="name" label="活动名称" required>
        <mtd-input v-model="formData.name" placeholder="请输入活动名称" />
      </mtd-form-item>
      <mtd-form-item prop="type" label="活动类型" required>
        <mtd-select v-model="formData.type" placeholder="请选择活动类型">
          <mtd-option value="manjian" label="满减" />
          <mtd-option value="zhekou" label="折扣" />
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item prop="date" label="生效日期" required>
        <mtd-date-picker v-model="formData.date" placeholder="请选择日期" style="width: 100%" />
      </mtd-form-item>
    </div>

    <!-- 分组2 -->
    <div class="form-section" id="group-2">
      <h3 class="form-section__title">规则配置</h3>
      <mtd-form-item prop="threshold" label="满减门槛" required>
        <mtd-input-number v-model="formData.threshold" placeholder="请输入" :min="0" :precision="2" style="width: 100%" />
      </mtd-form-item>
    </div>

    <!-- 分组3 -->
    <div class="form-section" id="group-3">
      <h3 class="form-section__title">投放范围</h3>
      <mtd-form-item prop="city" label="适用城市" required>
        <mtd-select v-model="formData.city" placeholder="请选择" multiple>
          <mtd-option value="beijing" label="北京" />
          <mtd-option value="shanghai" label="上海" />
        </mtd-select>
      </mtd-form-item>
    </div>
  </mtd-form>
</template>
```

---

## 七、CSS

### 7.1 分组标题 CSS

分组标题的完整 CSS（含蓝色方块 `::before` 与首组清零）见 §二 2.3，此处不重复。

### 7.2 Form 容器 CSS

```css
/* 表单宽度由外层 Row/Col 栅格控制，此处不设 max-width */

/* React: Form 内部 flex-wrap，分组 div 必须撑满整行 */
.section-form > div {
  width: 100%;
}

/* 控件撑满所在列 */
.section-form .mtd-prime-select,
.section-form .mtd-prime-picker,
.section-form .mtd-prime-date-picker,
.section-form .mtd-prime-input-number,
.section-form .mtd-prime-range-picker,
.section-form .mtd-prime-cascader {
  width: 100%;
}
```

---

## 八、踩坑笔记

- **React Form 是 flex-wrap**：`<div className="form-section">` 在 Form 内部默认不撑满，必须给 `.section-form > div { width: 100%; }` 否则分组内字段宽度收缩。
- **Select / DatePicker / InputNumber 默认不是 100% 宽**：必须用 CSS 强制 `width: 100%`，否则与 Input 宽度不一致。
- **toFormItem**（React 专属）：所有放在 `Form.Item` 内部的受控控件必须加 `toFormItem` prop，否则 Form 无法收集表单值。Vue3 用 `v-model` 即可，无需额外 prop。
