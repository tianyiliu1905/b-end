# Form3 · 基础布局（BaseLayout）

> **一句话定位**：表单的最小成立单元，决定「表单区占多宽」与「每行放几个字段」。
> **基础底座**：任何表单页默认包含「基础布局 + 操作栏」。F2（分组分段）、主从布局的内部填充物都是 F3。
> **命名说明**：Base 指它是所有表单内容的承载底座（不预设列数，支持单列/双列/三列/混合），Layout 强调这是一个布局模块。

---

## 一、何时用

- 任何表单页都默认包含（基础底座之一）
- 需要填写/录入一组字段
- 字段不多时，单独使用即可
- 字段较多时，作为 F2（分组分段）每个组的内部承载

**不适用场景：**

- 需要按对象切换表单 → 用主从落地页（左列表 + 右详情）
- 字段需要按业务切块并加标题 → 用 F2 分组分段包裹多个 F3

> **L3 优先级声明**：本文中的颜色、字号、间距等视觉参数属于模式层推荐值；如与 L3 原子规范冲突，应以 L3 为准。

---

## 二、布局 (ASCII)

### 2.1 整体结构（默认组合：半宽留白 + 单列）

```Plain
┌─────────────────────────────────────────────────────────────┐
│ Row                                                          │
│ ┌─── Col span=12（半宽表单区）───────┐ ┌─── Col（留白）────┐ │
│ │ Form                                │ │                    │ │
│ │  ┌ 标签 ─┐  ┌ 控件 ───────────┐    │ │                    │ │
│ │  │活动名称│  │ 输入框           │    │ │  ← 右侧另一半页面  │ │
│ │  └───────┘  └──────────────────┘    │ │    留白，不做拉伸  │ │
│ ├──────────────────────────────────── │ │                    │ │
│ │  ┌ 标签 ─┐  ┌ 控件 ───────────┐    │ │                    │ │
│ │  │活动类型│  │ 下拉框 ▾         │    │ │                    │ │
│ │  └───────┘  └──────────────────┘    │ │                    │ │
│ ├──────────────────────────────────── │ │                    │ │
│ │  ┌ 标签 ─┐  ┌ 控件 ───────────┐    │ │                    │ │
│ │  │生效日期│  │ 日期选择器       │    │ │                    │ │
│ │  └───────┘  └──────────────────┘    │ │                    │ │
│ └──────────────────────────────────────┘ └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
  ← 标签固定宽度右对齐（labelWidth=120px），控件左边缘对齐同一竖线
  ← 字段纵向堆叠，每个字段 span=24 独占半宽表单区整行（单列）
```

### 2.2 标签与间距

| 维度 | 值 | 说明 |
| --- | --- | --- |
| 标签位置 | `labelPosition="right"` | 标签文字在 label 区域内右对齐 |
| 标签宽度 | `labelWidth="120px"` | 约可容纳 7–8 个中文字，超出自动换行 |
| 标签顶部变体 | `labelPosition="top"` | 标签在控件上方，宽度与下方控件同宽（均撑满所在列），避免标签文字串行。适合标签较长、多列密集录入或移动端 |
| 字段行间距 | 由 MTD Form 组件内部控制 | 默认约 20–24px |
| 紧凑模式行间距 | `margin-bottom: 12px` | 弹窗/抽屉等空间受限场景 |

### 2.3 宽度体系

> **⚠️ 有两层 `span`，参照系不同，别搞混**（参数①与参数②的完整定义见 §三「可配参数」）：
>
> | 层次 | 写在哪 | 参照系 | 作用 |
> | --- | --- | --- | --- |
> | **外层栅格 span** | `Row > Col span={N}` | 相对**整个页面/内容区** | 参数①：`span={12}` = 表单占页面一半、右侧留白 |
> | **内层字段 span** | `Form.Item span={N}` | 相对**外层 Col 划定的表单区** | 参数②：`span={24}` = 字段占满表单区整行（单列）；`span={12}` = 占表单区一半（双列） |
>
> 例：半宽单列 = 外层 `Col span={12}`（表单占页面 50%）+ 字段 `span={24}`（在这 50% 里各占整行）。两个 span 数值不同却都正确，因为它们量的不是同一个宽度。

| 项目 | 取值 | 说明 |
| --- | --- | --- |
| Form 容器限宽 | 外层 `Row > Col span={12}` | 表单宽度由栅格分栏控制（约占父容器 50%），不再写死 px 值。内容区较窄时可省略外层 Row/Col |
| 控件宽度 | `width: 100%` | 撑满所在列 |

**多列实现方式（⚠️ 硬约束）**：

必须使用 MTD Form 组件自带的 `span` 栅格属性实现多列，**禁止**用外层 CSS Grid 包装。原因：MTD Form 内部为每个 Form.Item 生成 `span-N` class（如 `.mtd-prime-form .span-24 { width: 100% }`），该规则会覆盖外层 CSS Grid 的列模板，导致多列退化为单列。

| 列数 | Form.Item span 值 | 含义 | 父容器要求 |
| --- | --- | --- | --- |
| 单列 | `span={24}`（默认，可不写） | 24/24 = 100% 整行 | Form 默认 flex-wrap 即可 |
| 双列 | `span={12}` | 12/24 = 50% | 父容器需 `display: flex; flex-wrap: wrap` |
| 三列 | `span={8}` | 8/24 ≈ 33.3% | 同上 |
| 混合列 | 同一 Form 内混用 `span={24}` / `span={12}` | 部分字段整行，部分并排 | 同上 |

> ⚠️ **关键**：Form.Item 的 `span` 生效依赖父容器是 `flex-wrap` 布局。若 Form.Item 在 `.form-section`（默认 display: block）内部，需给 `.form-section` 加 `display: flex; flex-wrap: wrap`，并让分组标题 `.form-section__title` 设 `width: 100%` 独占一行。

### 2.4 复合组件的宽列/整行例外（配合 §五第 9 条）

同一分组内可能同时存在普通键值对字段和复合组件，两者定宽依据不同，**按"字段类别"而非"控件视觉大小"决定**：

| 字段类别 | 典型控件 | 宽度取值 | 对齐要求 |
| --- | --- | --- | --- |
| 普通键值对字段 | 单行 Input、Select、Switch、DatePicker、InputNumber、Radio/Checkbox 组、**多行文本域 Textarea** | 按本组列数（单列 `span={24}` / 双列 `span={12}` / 三列 `span={8}`） | 同组内等宽、左边缘对齐 |
| 横向密集复合组件 | F8 公式编辑器、F5 可编辑表格、G3 只读表格、F6 复选组 | 更宽列宽（如公式编辑器 3/4 宽 `form-item--col-3`）或独占整行 `span={24}` | 独占其所在行，不与普通字段并列 |

- **Textarea 归入普通字段**：多行文本域的"多行"由 `rows` 决定，是高度维度，**不构成加宽的理由**。它与同组单行字段等宽即可，不得单独放大到 3/4 宽或整行（除非该组整体就是单列 `span={24}`）。
- **宽度类有专属边界**：`form-item--col-3`（75%）等宽度类是为复合组件预留的，**不得挪用到普通键值对字段**。误用会破坏该组字段的等宽对齐与视觉节奏。
- 复合组件的具体放置方式（是否需移出 `<Form>` 外部、内部是否用 Form.Item 等）见 §十各混排章节的规则。

### 2.5 紧凑模式（弹窗/抽屉场景）

抽屉/弹窗场景下，Form 宽度与容器拉通（撑满内容区），不设独立 max-width。仅行间距和 labelWidth 做紧凑适配：

| 项目 | 取值 | 说明 |
| --- | --- | --- |
| Form 宽度 | 拉通（撑满容器内容区） | 不设 max-width |
| 行间距 | `margin-bottom: 12px` | 比默认更紧凑 |
| labelWidth（抽屉） | `120px` | 与落地页一致 |
| labelWidth（弹窗） | `80px`–`100px` | 弹窗空间更小 |

---

## 三、可配参数

本模块的排版由两个**正交（互不影响）**的参数决定，定版前必须分别确认，且**先定「表单区宽度」，再定「列数」**：

| 参数 | 决定什么 | 取值 | 由谁控制 |
| --- | --- | --- | --- |
| **① 表单区宽度** | 整个表单在页面里占多宽、右侧是否留白 | **半宽留白（默认）** / 全宽拉通 | 外层 `Row > Col span={12}`（半宽）或省略 Row/Col（全宽） |
| **② 列数** | 表单区内部，每行放几个字段 | **单列（默认）** / 双列 / 三列 / 混合列 | 每个 `Form.Item` 的 `span`（24=单列，12=双列，8=三列） |

**⚠️ 关键区分：`span={12}` 在两个参数里含义完全不同**

| 写在哪 | 含义 | 效果 |
| --- | --- | --- |
| 外层 `Col span={12}` | 参数①=半宽 | 整个表单区限到页面 1/2 宽，**右侧另一半留白**；字段仍是单列 |
| 字段 `Form.Item span={12}` | 参数②=双列 | 字段两两并排，**填满**表单区 |

最常见的错误是想要「半宽留白 + 单列」，却给字段设了 `span={12}`，结果得到「全宽 + 双列」——两者视觉效果完全不同。

正确写法：外层 `Col span={12}` 限宽，字段用 `span={24}` 独占整行。

**最常见默认**：无特殊要求时 = **半宽留白 + 单列**（外层 `Col span={12}`，字段 `span={24}`）。

---

## 四、变体

变体按两个正交参数分别列出（见 §三）。**无特殊要求时的默认组合 = 参数① 半宽留白 + 参数② 单列。**

**参数①：表单区宽度**

| 变体 | 特征 | 何时用 |
| --- | --- | --- |
| 半宽留白（**默认**） | 外层 `Col span={12}`，表单占页面左半，右半留白 | 顺序落地页等宽内容区的默认选择 |
| 全宽拉通 | 省略外层 Row/Col，表单撑满内容区 | 内容区本身较窄（如多级侧导挤压后），或用户明确要求全宽 |

**参数②：列数**

| 变体 | 特征 | 何时用 |
| --- | --- | --- |
| 单列（**默认**） | 字段 `span={24}`，一行一个字段 | 默认选择；字段不多，或标签长度差异大 |
| 双列 | 字段 `span={12}`，一行两个字段 | **同时满足**：字段较多（≥6）且标签长度接近、控件较窄，才升级 |
| 三列 | 字段 `span={8}`，一行三个字段 | 字段密集且标签短、控件小（如属性录入） |
| 混合列 | 同一表单内混用 `span={24}`/`span={12}` | 部分字段需长输入独占整行，部分短字段可并排 |

**其他维度**

| 变体 | 特征 | 何时用 |
| --- | --- | --- |
| 标签顶部 | `labelPosition="top"`，标签在控件上方 | 标签特别长，或希望控件更宽 |
| 紧凑模式 | 更小的间距 | 弹窗、抽屉等空间受限容器 |

---

## 五、约束

1. **栅格分栏限宽（参数①=半宽）** —— Form 不再写死 `max-width: 640px`，而是用外层 `Row > Col span={12}` 把**整个表单区**限到页面的 1/2 宽度，右侧另一半留白。⚠️ **注意**：限宽靠的是外层 `Col span={12}`，**不是**给字段设 `span={12}`——字段设 `span={12}` 属于参数②的"双列"（两两并排填满表单区），与"半宽留白单列"是两回事，切勿混淆（参见 §三「可配参数」）。内容区本身已较窄时可省略 Row/Col，让表单直接撑满（此时即"全宽拉通"）。

2. **标签默认右对齐（labelPosition="right"）** —— 标签文字在固定宽度区域内靠右对齐，使所有控件左边缘对齐到同一竖线。标签宽度默认 `120px`，可容纳约 7–8 个中文字。

3. **控件撑满所在列** —— 控件宽度 `width: 100%`，在栅格分栏范围内自然撑满，不设额外的控件级 max-width 限制。⚠️ **MTD 的 Select / DatePicker / InputNumber / RangePicker / Cascader 默认宽度不是 100%**，必须在 CSS 中对这些组件的容器类名（`.mtd-prime-select` 等）显式设置 `width: 100%`，否则它们在单列布局中会比 Input 短。详见 §八 CSS 示例。

4. **多列（参数②）一律用 Form.Item 的 `span`，禁止 CSS Grid** —— 双列用 `span={12}`、三列用 `span={8}`，并给分组容器加 `display: flex; flex-wrap: wrap`。⚠️ **禁止**用 `.form-grid--2col` 等外层 CSS Grid 包装（原因与替代方案见 §二 2.3）。

5. **混合列布局中单行字段与多列对齐** —— 混合列模式下，单行字段与多列字段共享同一个 Form 宽度（由外层栅格分栏决定），单行控件不再有独立的 max-width 限制，直接撑满 Form 宽度。

6. **MTD React Form 内部是 `display: flex; flex-wrap: wrap`** —— （React 技术栈专属）MTD React 的 Form 组件渲染为 flex 容器。当 Form 内部使用 `<div>` 包裹分组（如 F2 分组分段场景）时，这些 div 作为 flex 子项不会自动占满整行，**必须显式设置 `width: 100%`**，否则分组内字段宽度会收缩而无法拉通到 Form 全宽。

7. **F2 分组 div 必须撑满 Form 宽度** —— 当 F3 与 F2（分组分段）结合使用时，Form 内每个分组的包裹容器（`<div>`）需要设置 `width: 100%`，确保分组内的 FormItem 和控件能正确继承 Form 宽度并拉通。CSS 写法：`.your-form > div { width: 100%; }`。

8. **控件区垂直居中对齐（注意别写错层级）** —— `.mtd-prime-form-item-body` 下有两个**兄弟**子节点：控件容器 `.mtd-prime-form-item-wrapper` 与校验错误提示 `.mtd-prime-form-item-explain`（explain 不在 wrapper 内部）。

   - **垂直居中属于 wrapper 层**：MTD 原生已给 wrapper 设了 `min-height: 32px; display: flex; align-items: center`，控件与 label 对齐通常开箱即用。如需显式声明（防御性写法或被其它样式覆盖时），也应作用于 `> .mtd-prime-form-item-wrapper`。
   - **body 层只能纵向堆叠**：若要给 body 设 flex，必须是 `flex-direction: column`，让 wrapper 与 explain 上下排列。
   - ⚠️ **严禁给 body 设横向 flex + `align-items: center`** —— 会把 explain 拉到控件右侧并排显示。MTD 源码中 body 的 `display:flex; align-items:center` 两行正是因此被注释掉的，不要"补"回去。

   CSS 实现见 §八 规则 4。**适用范围不限于主表单 `.section-form`**：`.section-form .mtd-prime-form-item-body { ... }` 这类作用域选择器不会覆盖到其它 Form 容器，页面内其它承载矮控件的 Form（如增删标签组、独立配置块）需各自补一条。

9. **字段先归类，再定宽（禁止按控件"看起来大小"定宽）** —— 设定任何字段的列宽（`span` 或宽度类）前，必须先判断字段类别，再决定宽度：
   - **普通键值对录入字段**（单行 Input、Select、Switch、DatePicker、InputNumber、Radio/Checkbox 组、以及多行文本域 Textarea 等）→ 属于常规表单字段，按本组统一的列数取宽（单列 `span={24}` / 双列 `span={12}` / 三列 `span={8}`），**同组内保持一致列宽、左边缘对齐**。
   - **横向信息密集的复合组件**（F8 公式编辑器、F5 可编辑表格、G3 只读表格、F6 复选组等）→ 需要更大横向空间，使用更宽的列宽（如公式编辑器 3/4 宽 `form-item--col-3`）或独占整行（`span={24}`），并按各自模块的混排规则放置（详见 §二 2.4 与 §十各混排章节）。
   - ⚠️ **高频误区（必须规避）**：Textarea 是普通字段，高度由 `rows` 控制，**与宽度无关**，不得单独加宽（完整说明见 §二 2.4）。**专供复合组件的宽度类（如 `form-item--col-3` = 75%）严禁用在普通字段上**。判断依据永远是"字段类别"，不是"控件视觉大小"。

### ⚠️ 生码前强制决策步骤（按顺序执行，不得跳步）

写任何 F3 代码前，必须依次走完以下判断，**尤其是第 0 步**：

0. **用户是否明确指定了布局？** —— 若用户已说明"占一列 / 半宽 / 两列 / 右侧留白"等任何宽度或列数要求，**无条件照抄执行，直接跳到实现**，不得用"这样看起来更紧凑/更好看"等主观理由去覆盖用户的明确指令。用户指令的优先级高于本规范的默认值与你的审美判断。
1. **确定参数①（表单区宽度）** —— 无特殊要求时取默认「半宽留白」（外层 `Col span={12}`）；仅当用户要求或内容区本身很窄时才用「全宽拉通」。
2. **确定参数②（列数）** —— 无特殊要求时取默认「单列」（字段 `span={24}`）。仅在**同时满足**"字段较多（≥6）"且"标签长度接近、控件较窄"时，才考虑升级到双列 `span={12}`；三列仅用于标签短、控件小的密集属性录入。
3. **偏离默认前先写理由** —— 若打算不用「半宽留白 + 单列」这个默认组合，必须能说出具体依据（对照 §二 2.4 的字段类别规则），不能凭"看起来"。
4. **字段归类核对** —— 普通键值对字段（含 Textarea）在同组内等宽对齐；复合组件（F8/F5/G3/F6）才可用宽列/整行（见 §二 2.4）。

---

## 六、L3 组件映射与 MTD 查询

### 6.1 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) | 关键 Props |
|------|--------------------------|----------------------|------------|
| 表单容器 | `<Form>` | `<mtd-form>` | `labelPosition`, `labelWidth`, `useContext` |
| 表单项 | `<Form.Item>` | `<mtd-form-item>` | `label`, `required`, `span`, `formItemKey`(React) / `prop`(Vue) |
| 输入框 | `<Input>` | `<mtd-input>` | `placeholder`, `toFormItem`(React) |
| 多行输入 | `<Input.TextArea>` | `<mtd-textarea>` | `rows`, `placeholder` |
| 下拉选择 | `<Select>` + `<Select.Option>` | `<mtd-select>` + `<mtd-option>` | `multiple`, `clearable` |
| 日期选择 | `<DatePicker>` | `<mtd-date-picker>` | `type`, `placeholder` |
| 数字输入 | `<InputNumber>` | `<mtd-input-number>` | `min`, `max`, `precision` |
| 单选 | `<Radio.Group>` + `<Radio>` | `<mtd-radio-group>` + `<mtd-radio>` | `value` |
| 多选 | `<Checkbox.Group>` + `<Checkbox>` | `<mtd-checkbox-group>` + `<mtd-checkbox>` | `value` |
| 开关 | `<Switch>` | `<mtd-switch>` | — |
| 级联选择 | `<Cascader>` | `<mtd-cascader>` | `options`, `placeholder` |

### 6.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Form,Input,Select,DatePicker,InputNumber,Radio,Checkbox,Switch,Cascader \
  --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Form,Input,Select,DatePicker,InputNumber,Radio,Checkbox,Switch,Cascader \
  --target=mtd-vue --quiet
```

---

## 七、代码骨架

### 7.1 单列布局 · React

```tsx
import { Form, Input, Select, DatePicker, InputNumber, Radio } from '@ss/mtd-react3';

export default function SingleColumnForm() {
  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="120px"
      useContext={true}
    >
      <Form.Item formItemKey="name" label="规则名称" required>
        <Input placeholder="请输入规则名称" toFormItem />
      </Form.Item>
      <Form.Item formItemKey="type" label="规则类型" required>
        <Select placeholder="请选择" toFormItem>
          <Select.Option value="a">类型A</Select.Option>
          <Select.Option value="b">类型B</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item formItemKey="date" label="生效日期">
        <DatePicker placeholder="请选择日期" toFormItem style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item formItemKey="amount" label="金额">
        <InputNumber placeholder="请输入" toFormItem style={{ width: '100%' }} min={0} precision={2} />
      </Form.Item>
      <Form.Item formItemKey="mode" label="模式">
        <Radio.Group toFormItem>
          <Radio value="a">模式A</Radio>
          <Radio value="b">模式B</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item formItemKey="remark" label="备注">
        <Input.TextArea placeholder="请输入备注" rows={3} toFormItem />
      </Form.Item>
    </Form>
  );
}
```

### 7.2 双列布局 · React（使用 span 栅格）

```tsx
import { Form, Input, Select, DatePicker } from '@ss/mtd-react3';

export default function TwoColumnForm() {
  return (
    <Form
      className="section-form"
      labelPosition="right"
      labelWidth="120px"
      useContext={true}
    >
      <div className="form-section form-section--multicol">
        <h3 className="form-section__title">基本信息</h3>

        <Form.Item formItemKey="name" label="名称" required span={12}>
          <Input placeholder="请输入" toFormItem />
        </Form.Item>
        <Form.Item formItemKey="code" label="编码" required span={12}>
          <Input placeholder="请输入" toFormItem />
        </Form.Item>
        <Form.Item formItemKey="type" label="类型" span={12}>
          <Select placeholder="请选择" toFormItem>
            <Select.Option value="a">类型A</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item formItemKey="date" label="日期" span={12}>
          <DatePicker placeholder="请选择" toFormItem style={{ width: '100%' }} />
        </Form.Item>
        {/* 混合：某些字段需要整行 */}
        <Form.Item formItemKey="desc" label="描述" span={24}>
          <Input.TextArea placeholder="请输入" rows={3} toFormItem />
        </Form.Item>
      </div>
    </Form>
  );
}
```

### 7.3 单列布局 · Vue3

```vue
<template>
  <mtd-form
    ref="formRef"
    :model="formData"
    label-position="right"
    label-width="120px"
    class="section-form"
  >
    <mtd-form-item prop="name" label="规则名称" required>
      <mtd-input v-model="formData.name" placeholder="请输入规则名称" />
    </mtd-form-item>
    <mtd-form-item prop="type" label="规则类型" required>
      <mtd-select v-model="formData.type" placeholder="请选择">
        <mtd-option value="a" label="类型A" />
        <mtd-option value="b" label="类型B" />
      </mtd-select>
    </mtd-form-item>
    <mtd-form-item prop="date" label="生效日期">
      <mtd-date-picker v-model="formData.date" placeholder="请选择日期" style="width: 100%" />
    </mtd-form-item>
    <mtd-form-item prop="amount" label="金额">
      <mtd-input-number v-model="formData.amount" placeholder="请输入" :min="0" :precision="2" style="width: 100%" />
    </mtd-form-item>
    <mtd-form-item prop="remark" label="备注">
      <mtd-textarea v-model="formData.remark" placeholder="请输入备注" :rows="3" />
    </mtd-form-item>
  </mtd-form>
</template>
```

---

## 八、CSS

```css
/* 1. 表单宽度由外层 Row > Col 栅格控制，此处不设 max-width */
/* .section-form 不再写死 max-width，默认 Col span={12} */

/* 2. React Form 内分组 div 撑满整行 */
.section-form > div {
  width: 100%;
}

/* 3. 控件撑满所在列
 * MTD 的 DatePicker / InputNumber / RangePicker / Cascader
 * 默认宽度不是 100%，必须强制撑满
 * （Select 的 width:100% MTD 原生已有，此处一并列出保持完整） */
.section-form .mtd-prime-form-item-wrapper {
  width: 100%;
}
.section-form .mtd-prime-select,
.section-form .mtd-prime-picker,
.section-form .mtd-prime-date-picker,
.section-form .mtd-prime-input-number,
.section-form .mtd-prime-range-picker,
.section-form .mtd-prime-cascader {
  width: 100%;
}

/* 4. 控件区垂直居中 + 校验提示换行到下方
 * .mtd-prime-form-item-body 是控件容器(.mtd-prime-form-item-wrapper)与
 * 校验错误提示(.mtd-prime-form-item-explain)的共同父容器，二者是同级兄弟节点
 * （explain 不在 wrapper 内部）。
 * ⚠️ 严禁给 body 设横向 flex + align-items: center —— 会让 explain 与 wrapper
 * 并排显示，错误提示被挤到控件右侧。
 * 正确做法：body 只负责纵向堆叠，垂直居中单独作用于 wrapper。*/
.section-form .mtd-prime-form-item-body {
  display: flex;
  flex-direction: column;
  min-height: 32px;
}
.section-form .mtd-prime-form-item-body > .mtd-prime-form-item-wrapper {
  min-height: 32px;
  display: flex;
  align-items: center;
}

/* 5. 多列模式：分组容器需要 flex-wrap */
.section-form .form-section--multicol {
  display: flex;
  flex-wrap: wrap;
}

/* 6. 分组标题在 flex-wrap 容器中独占一行 */
.section-form .form-section--multicol .form-section__title {
  width: 100%;
  flex-shrink: 0;
}

/* 7. 紧凑模式（抽屉/弹窗） */
.section-form--compact {
  max-width: none; /* 撑满容器 */
}
.section-form--compact .mtd-prime-form-item {
  margin-bottom: 12px;
}
```

---

## 九、踩坑笔记

- **toFormItem**（React 专属）：所有放在 `Form.Item` 内部的受控控件必须加 `toFormItem` prop，否则 Form 无法收集表单值与校验。Vue3 用 `v-model` + `prop` 即可。
- **Select/DatePicker/InputNumber 默认不是 100% 宽**：必须在 CSS 中对这些组件容器类名设 `width: 100%`，否则单列布局中它们会比 Input 短。
- **React Form 是 flex-wrap**：Form.Item 外层的 `<div>`（用于分组）默认不撑满整行，必须加 `width: 100%`。
- **labelWidth="120px"**：默认值，可容纳约 7-8 个中文字；主从落地页建议缩减为 `100px`，弹窗建议 `80px-100px`。
- **DatePicker 必须加 `style={{ width: '100%' }}`**（React）或 `style="width: 100%"`（Vue3）：除了 CSS class 覆盖外，DatePicker 还需行内样式双保险。
- **formItemKey vs prop**：React 用 `formItemKey="xxx"`，Vue3 用 `prop="xxx"`，用于表单校验和数据收集的字段标识。
- **别给 `.mtd-prime-form-item-body` 设横向 flex（高频错误）**：body 下的 `wrapper`（控件）与 `explain`（校验提示）是**兄弟节点**。给 body 设 `display: flex; align-items: center` 会让二者并排，错误提示被挤到控件右侧。正确写法是 body 用 `flex-direction: column`，垂直居中单独作用于 `> .mtd-prime-form-item-wrapper`（见 §八 规则 4）。MTD 源码里 body 的这两行本就是注释掉的状态。
- **垂直居中通常不用自己写**：MTD 原生已给 `.mtd-prime-form-item-wrapper` 设了 `min-height: 32px; display: flex; align-items: center`，Radio.Group / Switch / Tag 等矮控件默认就与 label 对齐。§八 规则 4 中的 wrapper 声明属于防御性写法（值与原生一致），用于避免被其它样式覆盖。
- **Textarea 别误用宽列类**：Textarea 是普通字段，高度靠 `rows` 控制，与宽度无关。不得套 `form-item--col-3` 或单独放大（完整说明见 §二 2.4）。

---

## 十、与其他模块的混排 / 关系

### 10.1 模块关系总览

| 模块 | 与 F3 的关系 |
| --- | --- |
| F2 分组分段 | F2 是 F3 的上层组织模块——把多个 F3 按业务分组并加标题 |
| 主从落地页 | 主从落地页右侧的详情表单就是一个 F3，左侧是对象列表 |
| G1 承载容器 | F3 放在 G1 的白色卡片内，卡片的 padding/圆角/投影由 G1 规范定义 |

### 10.2 与可编辑表格（F5）混排规则

当同一页面中 F3（表单区）和 F5（可编辑表格）需要上下混排时，两者的宽度策略不同：表单区宽度由外层 Row/Col 栅格分栏控制，而可编辑表格通常列数多、需要更大的水平空间，应**拉通整个内容区宽度**。

#### ⚠️ 硬约束

1. **可编辑表格必须放在 `<Form className="section-form">` 外部**，不受栅格分栏限宽约束
2. 表格区域的 `.form-section`（含标题）直接放在 `.scroll-content` 内，与 `<Form>` 平级
3. 表格数据通过独立 state 管理，提交时与 Form 数据合并

#### 结构示意（React）

```tsx
<div className="scroll-content">
  {/* F3 表单区 — 宽度由外层 Row/Col 栅格控制 */}
  <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
    <div className="form-section form-section--multicol">
      <h3 className="form-section__title">基本信息</h3>
      <Form.Item formItemKey="name" label="名称" required span={12}>
        <Input placeholder="请输入" toFormItem />
      </Form.Item>
      {/* ...更多 Form.Item... */}
    </div>
  </Form>

  {/* F5 可编辑表格 — 宽度拉通内容区，不受 section-form 限宽 */}
  <div className="form-section">
    <h3 className="form-section__title">明细表</h3>
    <div className="editable-table">
      <Table columns={columns} data={dataSource} rowKey="key" pagination={false} />
      <Button className="editable-table__add-row" shape="text" type="primary" onClick={handleAdd} icon="add">
        添加一行
      </Button>
    </div>
  </div>
</div>
```

#### 反模式（禁止）

```tsx
{/* ❌ 表格不应放在受栅格限宽的 Form 内部 */}
<Form className="section-form">
  <div className="form-section">...</div>
  <div className="form-section">
    <div className="editable-table">
      <Table ... />  {/* 列数多时宽度不够，横向溢出 */}
    </div>
  </div>
</Form>
```

### 10.3 与公式编辑器（F8）混排规则

当同一页面中 F3（普通键值对表单区）和 F8（公式编辑器）需要上下混排时，两者的栅格占比不同：普通键值对表单区占页面 1/2 宽（半宽留白），内部字段单列纵向排列；公式编辑器占 3/4 宽（75%），比普通键值对更宽，不要挤在半列中。

#### ⚠️ 硬约束

1. **普通键值对占 1/2 页宽、单列排列**：用外层 `Row > Col span={12}` 把表单区限到页面 1/2 宽（右侧 1/2 留白），字段本身用 `span={24}`（默认，独占该半宽表单区整行）逐行纵向排列。⚠️ **切勿**用"给字段设 `span={12}`"来实现——那是参数②的"双列"，与"半宽留白单列"是两回事（详见 §三「可配参数」）。
2. **公式编辑器占 3/4 宽**：占内容区的 75%（`form-item--col-3`），或使用 `span={24}` 占满整行；比普通键值对更宽
   - ⚠️ **`form-item--col-3`（75%）是复合组件专属宽度类，严禁挪用到普通字段**：Textarea 是普通字段，不得单独放大到 3/4 宽（完整说明见 §二 2.4）。
3. **计算公式配置型（变体 C）内部不用 Form.Item**：用自定义 `.formula-config-row`（flex 布局）替代，label 用 `<span>` 实现，避免外层 Form.Item label + 内层 Form.Item label 双层叠加浮费空间
4. **普通键值对保持默认左右布局**：`labelPosition="right"`，`labelWidth="120px"`，不受公式编辑器布局影响
5. **公式编辑器放在 `<Form className="section-form">` 外部**：与 F5 混排同理，公式编辑器宽度策略与普通字段不同，放在 Form 外部避免栅格限宽约束

#### 结构示意（React）

```tsx
<div className="scroll-content">
  {/* F3 普通键值对 — 外层 Col span={12} 限到半宽，字段 span={24} 单列，右侧留白 */}
  <Row>
    <Col span={12}>
      <Form className="section-form" labelPosition="right" labelWidth="120px" useContext={true}>
        <div className="form-section">
          <h3 className="form-section__title">基本信息</h3>
          <Form.Item formItemKey="name" label="名称" required>
            <Input placeholder="请输入" toFormItem />
          </Form.Item>
          <Form.Item formItemKey="type" label="类型" required>
            <Select placeholder="请选择" toFormItem>
              <Select.Option value="a">类型A</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Col>
  </Row>

  {/* F8 公式编辑器 — 占 3/4 宽，放在 Form 外部 */}
  <div className="form-section">
    <h3 className="form-section__title">定价公式</h3>
    <div className="formula-config-container">
      {/* 变体 C：自定义 .formula-config-row，不用 Form.Item */}
    </div>
  </div>
</div>
```

---

## 十一、生码前决策 / 生码后自查清单

### ⚠️ 生码后必须自查清单（React 技术栈）

生成 F3 相关代码后，**逐条核对**以下项，缺一不可：

- [ ] 若用户明确指定了宽度/列数，已**无条件照抄**，未用主观审美覆盖（见 §五「生码前强制决策步骤」第 0 步）
- [ ] **参数①（表单区宽度）已确认**：默认半宽留白用外层 `Row > Col span={12}`；全宽拉通才省略 Row/Col。切勿用"给字段设 span={12}"冒充半宽
- [ ] **参数②（列数）已确认**：默认单列 = 字段 `span={24}`；只有满足升级条件才用 `span={12}`/`span={8}`
- [ ] 外层 `Row > Col span={12}` 包裹 Form（内容区较窄或需全宽时可省略）
- [ ] `.section-form > div { width: 100%; }` — Form 内分组 div 撑满（React Form 是 flex wrap，子 div 默认不撑满）
- [ ] `.section-form .mtd-prime-select, .section-form .mtd-prime-picker, .section-form .mtd-prime-date-picker, .section-form .mtd-prime-input-number, .section-form .mtd-prime-range-picker, .section-form .mtd-prime-cascader { width: 100%; }` — 非 Input 控件强制撑满
- [ ] `.mtd-prime-form-item-body` 用 `flex-direction: column`（**不是**横向 flex + `align-items: center`，那会把校验提示挤到控件右侧）；垂直居中单独作用于 `> .mtd-prime-form-item-wrapper`；**页面内其它 Form 容器（如增删标签组）需各自补一条对应选择器**
- [ ] 多列时：含多列的 `.form-section` 加 `form-section--multicol`（flex-wrap）+ `.form-section__title { width: 100% }`
- [ ] 多列时：`Form.Item` 用 `span={12}`（双列）或 `span={8}`（三列），**禁止**用外层 CSS Grid
- [ ] 字段定宽前已归类：普通键值对字段（含 **Textarea**）与同组字段等宽对齐；`form-item--col-3` 等宽度类**仅**用于复合组件（F8/F5/G3/F6），未挪用到普通字段（见 §二 2.4）

> **根因解释**：这些规则之所以容易遗漏，是因为 MTD 的 Input 组件默认 `width: 100%` 没问题，但 Select / DatePicker / InputNumber 等组件默认宽度由内容决定；同时 React Form 的 flex 容器使 div 子项默认收缩。两个隐性行为叠加导致"看起来没写错但视觉不撑满"。

---

## 十二、在主从落地页中的适配

当 F3 用在主从落地页的右侧面板（`.detail-panel__content`）内时，需要注意以下适配要点：

### 12.1 栅格限宽的适配

主从落地页中，右侧面板宽度 = 白卡总宽 - 左侧面板宽度（200px）- border（1px）- 右侧 padding（48px）。在标准桌面宽度下，右侧面板通常够宽，可继续使用 `Row > Col span={12}` 栅格分栏限宽。如果右侧面板已经较窄（如一级侧导 + 二级侧导同时存在），可省略外层 Row/Col，让 Form 直接撑满面板宽度。

### 12.2 左对齐，不居中

主从落地页中的表单始终**左对齐**（默认 flex 行为），不做 `margin: 0 auto` 居中。原因：左侧已有导航面板作为视觉锚点，表单紧邻导航栏更自然。

### 12.3 labelWidth 建议适配

在主从落地页场景下，右侧面板可用宽度可能受限（尤其是在一级侧导 + 二级侧导同时存在时），建议将 `labelWidth` 从默认的 `120px` 适当缩减为 `100px`，让控件区域有更多空间。

| 场景 | labelWidth 建议值 |
| --- | --- |
| 顺序落地页（宽内容区） | `120px`（默认） |
| 主从落地页（右侧面板） | `100px`（推荐） |
| 弹窗/抽屉（空间紧凑） | `80px`–`100px` |
