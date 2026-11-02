# Form4 · 步骤条（StepBar）

> **一句话定位**：指示分步流程进度的横向导航条，只负责「走到第几步了」这一件事。
> **容器绑定**：本模块随「步骤落地页（Step Page）」容器常驻，不作为普通模块叠加到顺序落地页或主从落地页。命中「分步 / 向导 / 流程 / 注册 / 认证 / 入驻」等强线性流程时，先由 L1 选择步骤落地页容器，再加载本规范。

---

## 一、何时用

- 步骤落地页中，指示当前处于多步流程的第几步。
- 步骤数 2–5 步。少于 2 步不需要步骤条；超过 5 步流程过长，应考虑拆分流程或改用点状变体。

**不适用场景：**

- 一屏平铺填完的长表单 —— 用顺序落地页 + F2 分组分段，不要加步骤条
- 用户可任意跳转的并列内容 —— 用 Tab，不要用步骤条
- 单步操作、弹窗内的短表单

> **职责边界**：本模块只管步骤条本体（形态、状态、样式参数）。页面外壳、内容区滚动、操作栏按钮、每步表单如何渲染，均由承载容器负责，见 `FD1-presentation-container.md` §3附。

> **L3优先级声明**：本文中的颜色、字号、间距等视觉参数属于模式层推荐值；如与 L3 原子规范冲突，应以 L3 为准。

---

## 二、布局 (ASCII)

```Plain
       ┌─────────── max-width: 720px，居中 ───────────┐

         ①ーーーーーーー ② ーーーーーーー ③
       主体信息        资质证照        经营信息
       （已完成）      （进行中）      （未开始）

       └──────────────────────────────────────────────┘
```

序号圆圈 + 标题文字 + 连接线三部分组成一个步骤节点。

---

## 三、变体

| 变体 | 关键属性 | 说明 | 何时用 |
| --- | --- | --- | --- |
| **标准横向** | `labelPlacement="horizontal"` | 序号圆圈 + 标题横向排列 | **默认档**，2–5 步常规分步表单 |
| 带描述 | `description` | 标题下方补一行说明文字 | 标题较短、需要额外解释该步填什么时 |
| 点状 | `dot` | 圆点替代序号，视觉更轻 | 步骤较多（5 步以上）或时间线式进度展示 |

三个变体是同一个线性流程的不同视觉密度，可根据步骤数和是否需要补充说明自由选择。

> **不使用的形态**：`direction="vertical"`（纵向）、`icon`（自定义图标）不在 B 端分步表单场景使用。纵向属于布局变体，横向在窄屏下用横向滚动降级即可；自定义图标偏 C 端引导，B 端后台统一用序号。`type="navigation"`（导航型）不使用，原因见 §七 约束 1。

---

## 四、状态

步骤条共有五种状态，但**常规分步表单只需要用到前三种，且不用手写**。

| 状态 | 圆圈 | 图标 | 颜色 | 语义 |
| --- | --- | --- | --- | --- |
| `wait` | 灰色描边 | 序号 | 灰 | 尚未到达 |
| `process` | 蓝色实心 | 序号（白字） | 蓝 | 当前步 |
| `finish` | 蓝色描边 | ✓ 对勾 | 蓝 | 已完成 |
| `error` | 红色描边 | ✕ 叉 | 红 | 走到了但失败，**需用户回来修** |
| `cancel` | 橙色描边 | ! 感叹号 | 橙 | 走到了但中止，**不再继续** |

**用法规则：**

1. **三个常规态由 `active` 自动推导，不要手动传 `status`。** 传 `active={1}`，组件自动算出第 0 步 finish、第 1 步 process、第 2 步起 wait。手动标状态是画蛇添足，还会覆盖自动推导导致状态错乱。
2. **校验失败时，可对当前步追加 `status="error"`。** 点「下一步」当前步必填项未通过时，把该步标红，配合字段级错误提示使用。这是运行时状态，不是独立变体。
3. **`cancel` 不在 B 端表单场景使用。** 它表达「流程被中止且不再继续」，属于审批流/工单流的流程追踪语义，那类场景通常是详情页而非表单页。

> `error` / `cancel` 无法从 `active` 推导，必须显式指定——组件不知道你的业务出没出错。两者的分界是**用户还需不需要行动**：error 要求行动，cancel 不要求。

---

## 五、可配参数

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `active` | 当前激活步骤索引，从 0 开始 | `0` |
| `labelPlacement` | 标签位置，`"horizontal"` 标题在圆圈右侧 | `"vertical"`（本模块统一用 `horizontal`） |
| `dot` | 点状样式 | `false` |
| `size` | `normal` / `small` | `normal` |
| `space` | 每个横向 step 的宽度，不填则自适应 | 无 |
| 步骤数 | 按业务流程拆分 | 建议 2–5 步 |

---

## 六、样式

| 属性 | 取值 | 说明 |
| --- | --- | --- |
| 组件 | `<Steps>` + `<Steps.Step>` | 来自 `@ss/mtd-react3` |
| 方向 | 横向 | 本模块固定横向 |
| 最大宽度 | `max-width: 720px` | 居中限宽，避免宽屏拉伸过长 |
| 水平居中 | `margin: 0 auto 24px` | 底部 24px 与内容区隔开 |
| 内边距 | `padding: 20px 0 24px` | 给步骤条呼吸空间 |

```css
/* class 名按业务自定义，如 .merchant-steps / .wizard-steps */
.merchant-steps {
  padding: 20px 0 24px;
  margin: 0 auto 24px;
  max-width: 720px;
}
```

> 三态配色由 MTD Steps 组件内部管理，不需要手写 class 覆盖。

---

## 七、约束

1. **不可跳步** —— 步骤条仅做进度指示，**不要设置 `onChange`，也不要用 `type="navigation"`**。两者会让节点可点击（`cursor: pointer`），用户能跳过未完成步骤，与步骤落地页「强线性、按序填写、逐步校验」的定义直接冲突，也会架空操作栏的「上一步 / 下一步」。
   导航型在视觉上也不是流程条：它用当前项下划线替代节点连接线，实际是「带序号的 Tab」。
   → **若业务确实需要在几段内容间自由切换（如回看已提交信息），说明这不是分步流程，容器选型选错了**：应改用顺序落地页 + 锚点定位 tab，或 Tab 组件。
2. **点「下一步」前校验当前步** —— 校验不通过则不推进 `active`，并对当前步标 `status="error"`。
3. **步骤条不参与滚动** —— 由容器保证（白卡 flex column 中作为 `flex-shrink: 0` 固定子项），本模块不自行处理定位。
4. **窄屏横向滚动降级** —— 横向步骤条在小屏易溢出，由容器给演示/内容区加 `overflow-x: auto`，不改为纵向。
5. **`dot` 不支持 `size="small"`** —— MTD 组件限制。

---

## 八、L3 组件映射

| 语义 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) |
| --- | --- | --- |
| 步骤条容器 | `<Steps>` | `<mtd-steps>` |
| 步骤节点 | `<Steps.Step>` | `<mtd-steps-item>` |

MTD 组件查询：

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Steps --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Steps --target=mtd-vue --quiet
```

---

## 九、代码骨架

React：

```tsx
import { Steps } from '@ss/mtd-react3';

const { Step } = Steps;

const STEPS = ['主体信息', '资质证照', '经营信息'];

// current 由容器维护；步骤条本身不控制导航
<Steps active={current} labelPlacement="horizontal" className="merchant-steps">
  {STEPS.map((title, i) => (
    <Step
      key={i}
      title={title}
      // 仅校验失败时对当前步标红，其余状态由 active 自动推导
      status={i === current && hasError ? 'error' : undefined}
    />
  ))}
</Steps>
```

Vue3：

```vue
<mtd-steps :active="current" label-placement="horizontal" class="merchant-steps">
  <mtd-steps-item
    v-for="(title, i) in steps"
    :key="i"
    :title="title"
    :status="i === current && hasError ? 'error' : undefined"
  />
</mtd-steps>
```

> 完整的「步骤条 + 当前步表单 + 操作栏」联动示例见 `FD1-presentation-container.md` §3附。

---

## 十、踩坑笔记

- **`Steps.Step` 而非独立 `Step`**：MTD React 中步骤节点挂在 Steps 上，不能单独 `import { Step }`。
- **`labelPlacement` 大小写**：React 写 `labelPlacement="horizontal"`（camelCase）；Vue3 写 `label-placement="horizontal"`（kebab-case）。
- **Steps 不控制导航**：组件仅做视觉展示，点击节点默认不切换内容。`current` state 由容器维护，通过操作栏按钮控制步进。
- **`status` 会覆盖 `active` 推导**：只在需要 error 时传，且只传给当前步。给所有步都手写 status 会让 `active` 失效。
- **Vue3 用 `:active` 绑定**：当前索引通过 `:active="current"` 传入。

---

## 十一、与其他模块的关系

| 模块 | 关系 |
| --- | --- |
| FD1 步骤落地页容器 | 承载本模块；负责 DOM 骨架、内容区滚动、`current` state、每步表单渲染 |
| Form1 操作栏 | 提供「上一步 / 下一步 / 提交」按钮，按钮规则见 `Form1-action-bar.md` §三 |
| Form2 分组分段 | 每步内容区可使用分组分段组织字段 |

---

## 十二、自检清单

- [ ] 步骤数在 2–5 步之间？
- [ ] 用 `active` 驱动三态，没有给每一步手写 `status`？
- [ ] 没有设置 `onChange`、没有用 `type="navigation"`（即不可跳步）？
- [ ] 步骤条限宽 720px 且水平居中？
- [ ] React 用 `labelPlacement`、Vue3 用 `label-placement`？
- [ ] 没有使用纵向、自定义图标、`cancel` 状态？
