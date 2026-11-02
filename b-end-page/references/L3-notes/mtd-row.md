# L3 · mtd-row（Row / Col 栅格）

> **属于**：MTD 结构组件。**被谁用**：所有需要多列等宽/响应式排布的模块——指标卡片组（D-1）、详情页摘要信息（DT-3）、工作台快捷入口、看板多列布局等，凡是用 `<Row gutter> + <Col span/xs/sm/md>` 做栅格的地方都会用到。
> **怎么进来**：在 L2 说明或 SKILL.md L2 总表的「L3 实现」列看到 `mtd-row` 带链接 → 点进本文 → 先读「准则」再排查「易错点」。
> **铁律**：所有写法必须仍是 MTD 合法用法 + 本项目 Token，不自造样式、不硬编码裸数值。

---

## 准则（写之前先立规矩）

- **结构**：`<Row gutter={n} type="flex">` + 若干 `<Col span={x} xs={..} sm={..} md={..}>`；`gutter` 控制列间距，`Row` 通过负 margin 抵消、`Col` 通过左右 padding 补偿，二者配合才能保证首尾列不产生多余的外侧留白。
- **列间距取值**：`gutter` 用与 `--gap-module`（当前 8px）同值的数字，**不要**随手写 `16`/`24` 等旧值或臆造数值，需与 CSS token 的当前取值保持一致。
- **⚠️ `gutter` 必须是纯 JS number，禁止传 CSS 变量字符串**：这是本文最核心的易错点，详见下方「易错点」一节。

---

## 易错点

### `gutter` 传 `"var(--gap-module)"` 会导致布局炸裂（`NaN`）

**症状**：为了让栅格间距跟着设计 token 走，把 `<Row gutter={16}>` 改成 `<Row gutter="var(--gap-module)">`，页面渲染后列间距完全错乱，甚至整行栅格挤在一起或溢出，DevTools 里能看到 `margin-left: NaNpx`。

**根因（已读 `@ss/mtd-react3` 源码 `lib/row/Row.js` 实测确认，勿凭直觉猜）**：`Row` 组件内部会对 `gutter` 做真实的数值运算来计算负 margin：

```js
getStyle = () => {
  const { gutter } = this.props;
  const style = {};
  if (gutter) {
    style.marginLeft = `-${gutter / 2}px`;
    style.marginRight = style.marginLeft;
  }
  return style;
};

Row.propTypes = {
  gutter: PropTypes.number,   // 明确声明为 number
  // ...
};
```

`gutter / 2` 是纯 JS 除法运算。一旦传入字符串 `"var(--gap-module)"`，`"var(--gap-module)" / 2` 在 JS 里直接得到 `NaN`，最终渲染出 `margin-left: NaNpx`（无效 CSS，浏览器会忽略该声明，等价于**完全丢失了负 margin 补偿**），导致整行栅格的首尾对齐、列间距全部错位。

这与「CSS 属性能不能吃 `var()`」无关——`Row`/`Col` 的 `gutter`、`span` 等是**组件内部会做数值运算或类型校验的 JS props**，不是浏览器原生解析的 CSS 属性值，不能和 `style={{ gap: 'var(--gap-module)' }}` 这种直接写进 `style` 对象、原样交给浏览器解析的写法一概而论。

**修正原则**：`gutter` 永远传纯数字（字面量或数字型 JS 常量），不要传任何字符串，更不能直接引用 CSS 变量。若要让 `gutter` 跟随 `--gap-module` 等 token 联动、避免以后 token 改了却漏改各处 `gutter`，用一个和 CSS token 数值保持同步的 JS 常量做中转，而不是散落的裸数字 `8`/`16`：

**落地写法**：

```ts
// src/styles/tokenValues.ts —— 与 tokens.css 中的间距 token 数值保持一致，手动同步
export const GAP_ELEM = 8;
export const GAP_MODULE = 8;
export const GAP_SECTION = 24;
export const GAP_PAGE = 16;
```

```tsx
import { GAP_MODULE } from '@/styles/tokenValues';

<Row gutter={GAP_MODULE} type="flex">
  <Col span={8}>...</Col>
  <Col span={8}>...</Col>
  <Col span={8}>...</Col>
</Row>
```

- `tokenValues.ts` 里的数值必须和 `tokens.css` 里对应的 `--gap-*` 声明**手动保持一致**——这是唯一的同步点，改 token 时两处都要改，但至少把「裸数字散落在几十个文件里」收敛成「只有一个文件需要改」。
- 纯 CSS Grid/Flex 布局（用普通 `<div style={{ display:'flex', gap: 'var(--gap-module)' }}>` 或 `.css` 文件里写 `gap: var(--gap-module)`）不受此限制，可以直接引用 CSS 变量，因为 `gap` 是浏览器原生解析的 CSS 属性，不经过组件内部的 JS 数值运算。**只有 MTD `Row`/`Col` 这类会在组件内部对间距 prop 做算术或做 `PropTypes.number` 校验的场景才需要走 JS 常量桥接**。
- 如果某个布局对 `Row`/`Col` 的响应式列宽（`span`/`xs`/`sm`/`md`）没有强需求，也可以考虑直接换成 CSS Grid/Flex + `gap: var(--gap-module)`，彻底绕开这个限制，但会失去 MTD 栅格自带的响应式断点能力，按场景取舍。

**核对步骤**：① 全局搜索 `gutter={` / `gutter={[`，确认取值均为数字字面量或数字型常量，没有字符串；② 若改了 `--gap-module` 等 token 数值，同步检查 `tokenValues.ts`（或等效常量文件）是否也已更新；③ DevTools 检查 `.mtd-row` 元素的 `margin-left`/`margin-right` 计算值，确认不是 `NaNpx`。

---

> 新坑/新准则按本文分区追加：准则进「准则」区，现象进「易错点」区（格式：`### 症状关键词` → 症状 / 根因 / 修正原则 / 落地写法 / 核对步骤）。
