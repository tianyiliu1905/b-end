# Form1 · 操作栏（ActionBar）

> **一句话定位**：承载提交/保存/取消等动作的按钮区。
> **基础底座**：任何表单页默认包含「基础布局 + 操作栏」，prompt 即使没提交按钮也要补上。

---

## 一、何时用

- 所有表单页（顺序落地页、分步表单、主从落地页）—— 默认必须包含
- 抽屉（Drawer）内的表单
- 弹窗（Dialog）内的表单
- 需要提交/保存/取消等动作

**不适用场景：**

- 纯展示详情页（无编辑动作）
- 纯列表/看板页（操作在行内或顶部工具栏）

> **L3优先级声明**：本文中的颜色、字号、间距等视觉参数属于模式层推荐值；如与 L3 原子规范冲突，应以 L3 为准。

---

## 二、布局 (ASCII)

### 2.1 整体结构

```Plain
┌──────────────────────────────────────────────────────┐
│                                                      │
│    表单内容区（.scroll-content / .step-content）       │
│    overflow-y: auto — 内容超长时滚动                   │
│                                                      │
├──────────────────────────────────────────────────────┤  ← border-top: 1px solid #f0f0f0
│                                                      │
│                          [取消]  [提交]               │  ← 操作栏（.action-bar）
│                                                      │
└──────────────────────────────────────────────────────┘  ← 继承白卡底部圆角 8px
```

> 操作栏是白卡（`.page-card`）flex column 的末尾子项，通过 `flex-shrink: 0` 始终固定在白卡底部可见区域，内容区通过 `overflow-y: auto` 独立滚动。

### 2.2 核心视觉参数

| 属性 | 取值 | 说明 |
| --- | --- | --- |
| 背景色 | `#fff` | 白色背景，与白卡一致 |
| 顶部分割线 | `1px solid #f0f0f0` | 区隔操作栏与表单内容 |
| 内边距 | `16px 24px` | 上下 16px、左右 24px |
| 按钮间距 | `gap: 12px` | 按钮之间统一 12px |
| 按钮对齐 | `justify-content: flex-end` | 按钮始终右对齐 |
| 底部圆角 | `border-radius: 0 0 8px 8px` | 继承白卡底部圆角 |
| 水平撑满 | `margin: 0 -24px` | 通过负 margin 抵消白卡左右 padding，让分割线撑满白卡宽度 |
| 固定底部 | `flex-shrink: 0` | 不随内容滚动，始终可见 |

### 2.3 按钮顺序与样式

| 位置 | 按钮 | 类型 | 说明 |
| --- | --- | --- | --- |
| 主操作 | 保存 / 提交 / 确定 | `type="primary"` | 蓝色实心按钮，最多 1 个 |
| 辅助操作 | 重置 / 取消 | 默认（无 type） | 白底描边按钮 |
| 危险操作 | 删除 | `type="primary" danger` | 红色实心按钮，放最右或最左视业务 |

### 2.4 数值汇总

| 项目 | 取值 |
| --- | --- |
| 背景色 | `#fff` |
| 分割线 | `1px solid #f0f0f0` |
| 内边距 | `16px 24px` |
| 按钮间距 | `gap: 12px` |
| 底部圆角 | `0 0 8px 8px` |
| 水平撑满 | `margin: 0 -24px` |
| 主操作按钮上限 | 1 个 |
| 按钮总数上限 | 4 个 |

### 2.5 统一放置模式 — 白卡内 flex 固定底部

所有容器类型（顺序落地页、主从落地页、抽屉、弹窗）的操作栏统一采用**白卡内 flex 固定底部**模式。操作栏是白卡（或面板）的 flex column 末尾子项，内容区通过 `overflow-y: auto` 滚动，操作栏通过 `flex-shrink: 0` 始终固定在白卡底部可见区域。

**实现要点**：

1. 白卡（`.page-card`）设为 `display: flex; flex-direction: column; overflow: hidden`
2. 内容滚动区（`.scroll-content` 或 `.step-content`）设为 `flex: 1; min-height: 0; overflow-y: auto`
3. 操作栏（`.action-bar`）设为 `flex-shrink: 0`，不设 `position: sticky/fixed`
4. 外层滚动容器（`.app-content`）设为 `overflow: hidden`，阻止外层滚动

> ⚠️ 常见错误 1：使用 `position: fixed` 定位操作栏。fixed 定位需要联动侧导宽度（`left: var(--side-nav-w)`），侧导折叠时还需切换变量，且操作栏在白卡外部视觉分离。flex 布局方案让操作栏始终在白卡内部，随白卡圆角自然衔接，不需要 z-index 和侧导宽度联动。

> ⚠️ 常见错误 2：使用 `position: sticky` 定位操作栏。sticky 在 `overflow: hidden/auto` 的容器内不生效，且在不同步骤/分组内容高度不一致时，操作栏位置会跳动。flex 布局方案让操作栏位置始终一致。

### 2.6 各容器类型对照

| 容器类型 | 操作栏位置 | 滚动区域 | 按钮对齐 |
| --- | --- | --- | --- |
| 顺序落地页 | `.page-card` 内底部 | `.scroll-content` | 右对齐 |
| 分步表单 | `.page-card` 内底部 | `.step-content` | 右对齐 |
| 主从落地页 | `.detail-panel` 内底部 | `.detail-panel__content` | 右对齐 |
| 抽屉（Drawer） | 抽屉面板内底部 | 内容区 | 右对齐 |
| 弹窗（Dialog） | 弹窗内底部 | 内容区 | 右对齐 |

### 2.7 DOM 结构

```
.app-content（overflow: hidden）
  └─ .page-container（height: 100%, flex column）
       └─ .page-card（flex: 1, flex column, overflow: hidden）
            ├─ .page-header（固定不滚动）
            ├─ .merchant-steps 或 .page-header__anchor（固定不滚动）
            ├─ .scroll-content 或 .step-content（flex: 1, overflow-y: auto — 内容滚动区）
            │    ├─ .form-section#group-1
            │    ├─ .form-section#group-2
            │    └─ ...
            └─ .action-bar（flex-shrink: 0 — 固定底部）
```

---

## 三、变体

| 变体 | 特征 | 何时用 |
| --- | --- | --- |
| 顺序表单操作栏 | [取消] [提交]，固定按钮 | 一次提交的普通表单 |
| 分步表单操作栏 | [上一步] [下一步/提交]，按钮随步骤动态变化 | 步骤落地页中的分步向导表单 |
| 抽屉/弹窗操作栏 | [取消] [确定]，面板内底部固定 | Drawer / Dialog 内的编辑表单 |
| 带危险操作 | [删除] [取消] [保存]，含红色危险按钮 | 需要删除等破坏性操作的编辑表单 |

### 分步表单操作栏按钮规则

步骤落地页中，操作栏按钮随当前步骤动态变化：

| 当前步骤 | 显示按钮 | 说明 |
| --- | --- | --- |
| 第一步 | [下一步] | 无"上一步"按钮 |
| 中间步骤 | [上一步] [下一步] | 辅助操作在前，主操作在后 |
| 最后一步 | [上一步] [提交] | "下一步"替换为最终提交按钮 |

---

## 四、约束

1. **主操作按钮最多 1 个** —— 不允许出现两个 `type="primary"` 按钮，避免视觉竞争。

2. **按钮总数不超过 4 个** —— 超过 4 个操作建议收入"更多"下拉。

3. **不使用 `position: fixed/sticky`** —— 统一使用 flex 布局固定底部，不需要 z-index 和侧导宽度联动。⚠️ 硬约束

4. **白卡底部 padding 为 0** —— 操作栏通过 `margin: 0 -24px` 撑满白卡宽度并通过自身 padding 控制内边距，白卡的 `padding-bottom` 设为 `0`。⚠️ 硬约束

5. **按钮间距使用 `gap: 12px`** —— 不使用 `marginLeft` 等 inline 样式控制间距。

6. **辅助操作在前、主操作在后** —— 右对齐时，视觉上辅助操作在左、主操作在最右（最终操作靠近视觉终点）。

---

## 五、L3 组件映射与 MTD 查询

### 5.1 L3 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) | 关键 Props |
|------|--------------------------|----------------------|------------|
| 主操作按钮 | `<Button type="primary">` | `<mtd-button type="primary">` | `type="primary"` 蓝色实心 |
| 辅助操作按钮 | `<Button>` | `<mtd-button>` | 无 type，白底描边 |
| 危险操作按钮 | `<Button type="primary" danger>` | `<mtd-button type="primary" danger>` | `danger` 为独立 prop，红色实心 |

### 5.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Button --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Button --target=mtd-vue --quiet
```

---

## 六、代码骨架

### 6.1 顺序落地页操作栏 · React

```jsx
<main className="app-content">
  <div className="page-container">
    <div className="page-card">
      {/* G2 PageHeader — 固定不滚动 */}
      <div className="page-header">...</div>
      {/* Anchor（可选）— 固定不滚动 */}
      <div className="page-header__anchor">...</div>
      {/* 可滚动内容区 */}
      <div className="scroll-content">
        <Form>
          <div className="form-section" id="group-1">...</div>
          <div className="form-section" id="group-2">...</div>
        </Form>
      </div>
      {/* F1 ActionBar — 固定底部 */}
      <div className="action-bar">
        <Button>取消</Button>
        <Button type="primary">提交</Button>
      </div>
    </div>
  </div>
</main>
```

### 6.2 分步表单操作栏 · React

```jsx
<main className="app-content">
  <div className="page-container">
    <div className="page-card">
      <div className="page-header">...</div>
      <Steps active={current} labelPlacement="horizontal">...</Steps>
      {/* 步骤内容滚动区 */}
      <div className="step-content">
        {current === 0 && <Step0 />}
        {current === 1 && <Step1 />}
      </div>
      {/* F1 ActionBar — 固定底部 */}
      <div className="action-bar">
        {current > 0 && <Button>上一步</Button>}
        {current < STEPS.length - 1 ? (
          <Button type="primary">下一步</Button>
        ) : (
          <Button type="primary">提交</Button>
        )}
      </div>
    </div>
  </div>
</main>
```

### 6.3 主从落地页操作栏 · React

```tsx
import { useState } from 'react';
import { Form, Button, Menu } from '@ss/mtd-react3';

export default function MasterDetailPage() {
  const [activeKey, setActiveKey] = useState('item1');

  const handleSave = () => {
    // 保存当前配置项
  };

  const handleReset = () => {
    // 重置当前配置项
  };

  return (
    <main className="app-content">
      <div className="page-container">
        <div className="content-card">
          {/* 左侧：对象列表 */}
          <aside className="master-panel">
            <Menu
              mode="inline"
              className="master-panel__menu"
              selectedKeys={[activeKey]}
              onSelectChange={(key) => setActiveKey(key)}
            >
              <Menu.Item key="item1">基础配置</Menu.Item>
              <Menu.Item key="item2">高级配置</Menu.Item>
              <Menu.Item key="item3">通知设置</Menu.Item>
            </Menu>
          </aside>

          {/* 右侧：内容 + 操作栏 — 操作栏在 detail-panel 内部 */}
          <div className="detail-panel">
            <div className="detail-panel__content">
              <div className="page-header">
                <h1 className="page-header__title">基础配置</h1>
              </div>
              <Form
                className="section-form"
                labelPosition="right"
                labelWidth="100px"
                useContext={true}
              >
                <Form.Item formItemKey="siteName" label="站点名称" required>
                  {/* 控件 */}
                </Form.Item>
                <Form.Item formItemKey="domain" label="域名" required>
                  {/* 控件 */}
                </Form.Item>
              </Form>
            </div>

            {/* F1 ActionBar — 在 detail-panel 内底部，不是 page-card 内 */}
            <footer className="action-bar">
              <div className="action-bar__inner">
                <Button onClick={handleReset}>重置</Button>
                <Button type="primary" onClick={handleSave}>保存</Button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
```

### 6.4 抽屉操作栏 · React

```tsx
import { Drawer, Form, Button, Input } from '@ss/mtd-react3';

function DrawerWithActionBar({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const handleSubmit = () => {
    // 提交逻辑
    onClose();
  };

  return (
    <Drawer
      visible={visible}
      title="编辑配置"
      width={640}
      maskClosable={false}
      onClose={onClose}
      footer={
        <div className="drawer-action-bar">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>确定</Button>
        </div>
      }
    >
      <Form
        className="drawer-form"
        labelPosition="right"
        labelWidth="100px"
        useContext={true}
      >
        <div className="form-section">
          <Form.Item formItemKey="configName" label="配置名称" required>
            <Input placeholder="请输入配置名称" toFormItem />
          </Form.Item>
          <Form.Item formItemKey="configValue" label="配置值" required>
            <Input placeholder="请输入配置值" toFormItem />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
}
```

### 6.5 顺序落地页操作栏 · Vue3

```vue
<template>
  <main class="app-content">
    <div class="page-container">
      <div class="page-card">
        <!-- G2 PageHeader -->
        <div class="page-header">
          <h1 class="page-header__title">创建活动</h1>
        </div>

        <!-- 可滚动内容区 -->
        <div class="scroll-content">
          <mtd-form
            ref="formRef"
            :model="formData"
            label-position="right"
            label-width="120px"
            class="section-form"
          >
            <div class="form-section" id="group-1">
              <h3 class="form-section__title">基本信息</h3>
              <mtd-form-item prop="name" label="活动名称" required>
                <mtd-input v-model="formData.name" placeholder="请输入活动名称" />
              </mtd-form-item>
            </div>
          </mtd-form>
        </div>

        <!-- F1 ActionBar -->
        <div class="action-bar">
          <mtd-button @click="handleCancel">取消</mtd-button>
          <mtd-button type="primary" @click="handleSubmit">提交</mtd-button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const formRef = ref();
const formData = reactive({
  name: '',
});

const handleCancel = () => {
  window.history.back();
};

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 提交逻辑
    }
  });
};
</script>
```

---

## 七、CSS

### 7.1 操作栏 CSS

```css
/* F1 操作栏 — 白卡内 flex 固定底部 */
.action-bar {
  background: var(--bg-card);
  padding: 16px 24px;
  border-top: 1px solid var(--divider);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin: 0 -24px;
  border-radius: 0 0 8px 8px;
  flex-shrink: 0;
}
```

### 7.2 完整布局联动 CSS

操作栏的正确工作依赖于整体布局的配合，以下是完整的联动 CSS：

```css
/* 1. 外层内容区：禁止滚动，高度固定 */
.app-content {
  overflow: hidden;
  height: calc(100vh - var(--top-nav-h));
}

/* 2. 页面容器：撑满高度，flex 列布局 */
.page-container {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 3. 白卡：flex 列布局，内容溢出隐藏 */
.page-card {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 20px 24px 0;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 4. 内容滚动区：flex 子项撑满剩余空间，内部滚动 */
.scroll-content,
.step-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* 5. 操作栏：flex 子项固定底部 — CSS 见 §7.1 */
```

### 7.3 主从 / 抽屉操作栏专属 CSS

以下 CSS 承接 §7.1 / §7.2 的通用布局联动，仅补充主从落地页与抽屉场景的操作栏差异部分：

```css
/* === 主从落地页操作栏 === */
.detail-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.detail-panel__content {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
}

.detail-panel .action-bar {
  border-top: 1px solid var(--divider);
  padding: 12px 24px;
  margin: 0; /* 主从落地页不需要负 margin */
  border-radius: 0;
  flex-shrink: 0;
}

.action-bar__inner {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* === 抽屉操作栏 === */
.drawer-action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

---

## 八、踩坑笔记

- **React `danger` 是独立 prop，不是 `type` 的值**：正确写法是 `<Button type="primary" danger>删除</Button>`，不要写 `type="danger"`。`danger` prop 控制红色样式，`type` prop 控制按钮形态（primary/default）。
- **白卡 `padding-bottom` 为 `0` 的排查**（见§四约束4）：如果白卡有 `padding-bottom`，操作栏下方会出现多余白色间隙。
- **`margin: 0 -24px` 的排查**（见§四约束4）：负 margin 抵消白卡 `padding: 20px 24px 0` 的左右 24px，使 `border-top` 从白卡左边缘拉通到右边缘。
- **主从落地页：操作栏在 `.detail-panel` 内部**：不要把操作栏放在 `.page-card` 或 `.content-card` 层级。主从落地页的操作栏属于右侧详情面板，作为 `.detail-panel` 的 flex column 末尾子项。左侧 master-panel 切换时，右侧操作栏跟随详情面板独立存在。
- **分步表单：按钮随步骤动态变化**：第一步只显示「下一步」（无「上一步」），中间步骤显示「上一步 + 下一步」，最后一步显示「上一步 + 提交」。按钮用条件渲染，不要一次全部渲染再隐藏。
- **外层 `.app-content` 必须 `overflow: hidden`**：阻止整页滚动，滚动只发生在白卡内部的 `.scroll-content` / `.step-content` 中。如果漏了这条，长表单会出现双滚动条。

---

## 九、与其他模块的混排 / 关系

| 模块 | 与本模块的关系 |
| --- | --- |
| 承载容器（白卡） | 操作栏的父容器；白卡 flex column 布局定义了操作栏的固定底部位置 |
| 表头信息区（PageHeader） | 同属白卡 flex column 的固定子项，位于操作栏上方 |
| 分组分段（GroupSection） | 表单内容区的分组结构，在 `.scroll-content` 内滚动 |
| 基础布局（BaseLayout） | 与操作栏共同构成表单最小成立单元（输入区 + 操作栏） |
| 步骤条（StepBar） | 步骤落地页中操作栏按钮随步骤动态变化（见本文§三「分步表单操作栏按钮规则」） |

---

## 十、生码后自查清单

- [ ] 操作栏是否在 `.page-card` 的 flex column 内、作为最后一个子项？
- [ ] 未使用 `position: fixed/sticky`？（见§四约束3）
- [ ] 白卡 `padding-bottom` 为 `0` 且操作栏 `margin: 0 -24px` 让分割线撑满白卡宽度？（见§四约束4）
- [ ] 主操作按钮（`type="primary"`）只有 1 个？（见§四约束1）
- [ ] 按钮顺序为辅助操作在前、主操作在后？（见§四约束6）
- [ ] 分步表单中，操作栏按钮随步骤动态变化？
