# 框架适配指南（Vue / React 双框架）

> 本 skill 同时支持 **Vue 2 / Vue 3 / React** 三种前端框架。本文件集中记录两端的关键差异，
> 生成代码时必须根据**用户项目实际框架**做对应适配。

---

## 1. 框架探测规则

**检查 `package.json` 的 dependencies / devDependencies**：

| 检测到的依赖 | 框架 | MTD 包名 | mtd-rag target |
|---|---|---|---|
| `react` / `react-dom` | React | `@ss/mtd-react3` | `mtd-react` |
| `vue` 且版本 `^2.x` | Vue 2 | `@ss/mtd-vue2` | `mtd-vue` |
| `vue` 且版本 `^3.x` | Vue 3 | `@ss/mtd-vue3` | `mtd-vue` |

> 如果无法探测（用户没给项目上下文），**主动询问**框架和版本。

---

## 2. 安装与样式引入

### React (`@ss/mtd-react3`)
```js
// 入口文件
import '@ss/mtd-react3/lib/style/index.css';         // 蓝色主题
// import '@ss/mtd-react3/lib/style/theme-yellow.css'; // 黄色主题

// 组件直接具名导入
import { Button, Form, Input, Table, Select } from '@ss/mtd-react3';
```

### Vue 3 (`@ss/mtd-vue3`)
```js
// main.ts
import { createApp } from 'vue';
import Mtd from '@ss/mtd-vue3';
import '@ss/mtd-vue3/lib/theme-chalk/index.css';      // 蓝色主题
// import '@ss/mtd-vue3/lib/theme-yellow/index.css';   // 黄色主题

const app = createApp(App);
app.use(Mtd); // 全局注册
```

### Vue 2 (`@ss/mtd-vue2`)
```js
// main.js
import Vue from 'vue';
import Mtd from '@ss/mtd-vue2';
import '@ss/mtd-vue2/lib/theme-chalk/index.css';

Vue.use(Mtd);
```
> Vue 2 < 2.7 需额外引入 `@vue/composition-api`。

---

## 3. 组件 API 差异（重点）

### 3.1 Grid 布局
- **两端统一**：都是 `Row` + `Col` 组件（**不存在 `Grid` 组件**）
- React：`import { Row, Col } from '@ss/mtd-react3'`
- Vue：`<mtd-row>` / `<mtd-col>`

### 3.2 message / notification / confirm
| | React | Vue |
|---|---|---|
| 引入 | `import { message, notification } from '@ss/mtd-react3'` （**小写**） | 无需单独引入 |
| 调用 | `message.success('操作成功')` | `this.$mtd.message({ message: '操作成功' })` |
| notification | `notification.open({ title, message })` | `this.$mtd.notify({ message: '消息' })` |
| confirm | `import { Modal } from '@ss/mtd-react3'` → `Modal.confirm(...)` | `this.$mtd.confirm({ message: '确认？' })` |

### 3.3 Form 表单

**React**：
- Form 第一层子节点**仅支持** `Form.Item`。如果需要在第一层放其他元素（如 Row/Col），必须给 Form 加 `useContext` 属性。
- FormItem 中只允许包含**一个**使用 `toFormItem` 的组件；`toFormItem` 与手动 `onChange`/`value` 互斥。

**Vue**：
- 用 `<mtd-form :model="formData">` + `<mtd-form-item prop="fieldName">`，prop 绑定字段名。
- 无 `toFormItem` 概念，直接 v-model 绑定。

### 3.4 Tabs
- **React**：Tabs 子组件 `TabPane` 使用 `label` 属性设置标题：
  ```jsx
  <Tabs style={{ paddingTop: 12, width: '100%' }}>
    <TabPane label="概览" key="1">...</TabPane>
  </Tabs>
  ```
  > ⚠️ React Tabs **必须**加 `style={{ paddingTop: 12, width: '100%' }}`。

- **Vue**：`<mtd-tabs>` + `<mtd-tab-pane label="概览">`。

### 3.5 Radio / Radio.Button
- **两端 API 一致**，都有普通 Radio 和 Radio.Button 两种形态。
- 判断口诀：看到「紧贴排列的矩形选项块」→ 用 `Radio.Button`；看到「前面有圆圈的选项列表」→ 用普通 `Radio`。

### 3.6 RangePicker
- React：`import { RangePicker } from '@ss/mtd-react3'`（独立导入）
- Vue：`<mtd-range-picker />`

---

## 4. 代码模式差异

### 组件定义
| | React | Vue 3 (Composition API) |
|---|---|---|
| 模板 | JSX（函数组件） | `<template>` + `<script setup>` |
| 状态 | `useState` / `useReducer` | `ref` / `reactive` |
| 生命周期 | `useEffect` | `onMounted` / `onBeforeUnmount` |
| 引用 DOM | `useRef` | `ref<HTMLElement>` |
| Props | 函数参数 / `interface` | `defineProps<{}>()` |
| 组件名 | 大驼峰 `<Button>` | kebab-case `<mtd-button>` 或大驼峰均可 |

### 事件绑定
| | React | Vue |
|---|---|---|
| 点击 | `onClick` | `@click` |
| 变更 | `onChange` | `@change` / `v-model` |
| 输入 | `onInput` / `onChange` | `@input` / `v-model` |

---

## 5. useG2Chart 双框架范式

### Vue 版（Composition API）
详见 `g2-chart-foundation.md` 主范式。

### React 版
```tsx
import { useRef, useEffect } from 'react';
import { Chart } from '@antv/g2';

export function useG2Chart(buildSpec: () => Record<string, any>, deps: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = new Chart({ container: containerRef.current, autoFit: true });
    }
    chartRef.current.options(buildSpec());
    chartRef.current.render();

    // ResizeObserver 兜底（侧栏折叠/Tab 切换）
    let fitTimer: ReturnType<typeof setTimeout> | null = null;
    let lastW = 0, lastH = 0;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect || (Math.abs(rect.width - lastW) < 1 && Math.abs(rect.height - lastH) < 1)) return;
      lastW = rect.width; lastH = rect.height;
      if (fitTimer) clearTimeout(fitTimer);
      fitTimer = setTimeout(() => chartRef.current?.forceFit(), 120);
    });
    ro.observe(containerRef.current);

    return () => {
      if (fitTimer) clearTimeout(fitTimer);
      ro.disconnect();
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return containerRef;
}
```

使用：
```tsx
const TrendChart: React.FC<{ data: TrendPoint[] }> = ({ data }) => {
  const containerRef = useG2Chart(
    () => ({ type: 'line', data, encode: { x: 'date', y: 'value', color: 'type' } }),
    [data]
  );
  return <div ref={containerRef} style={{ width: '100%', height: 280 }} />;
};
```

---

## 6. mtd-rag.js 查询命令

根据框架使用不同 `--target`：

```bash
# React 项目
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Table,Button,Select \
  --target=mtd-react --quiet

# Vue 项目（Vue 2 和 Vue 3 共用同一 target）
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Table,Button,Select \
  --target=mtd-vue --quiet
```

---

## 7. 通用禁令（两端适用）

1. **禁止手动覆盖组件状态样式**：disabled/loading/checked 等状态一律用组件 prop，不用 CSS 模拟。
2. **Grid = Row + Col**：不存在名为 `Grid` 的组件。
3. **色值/间距/字号一律用 Token**（`var(--xxx)`），禁止硬编码。
4. **禁止 Emoji**：一律用 MTD `Icon` 组件。
5. **图表统一 G2 v5 Spec 写法**，挂载用 `useG2Chart`（Vue 用 composable / React 用 hook）。

---

## 8. 自检清单

生成代码后逐条核对：

- [ ] 框架判断正确（React / Vue 2 / Vue 3）
- [ ] MTD 包名与 target 一致
- [ ] message/notification 用法匹配目标框架
- [ ] Form 第一层节点约束（React 特有）
- [ ] Tabs style 约束（React 必须加 paddingTop+width）
- [ ] 事件绑定语法正确（onClick vs @click）
- [ ] 图表 hook 用对应框架版本（useG2Chart composable vs hook）
- [ ] 组件标签大小写正确（React 大驼峰 / Vue kebab-case）
