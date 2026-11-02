# 通用规范（所有组件适用）
- **禁止手动覆盖组件状态样式**：MTD 组件的各种状态（禁用、加载、选中、错误等）必须通过组件提供的属性（如 `disabled`、`loading`、`checked`、`status` 等）来控制，**严禁**通过 `style` 或 `className` 手写 CSS 来模拟这些状态的视觉效果。例如：看到灰色的按钮 → 用 `<Button disabled>`，而不是 `<Button style={{ color: 'gray', cursor: 'not-allowed' }}>`。

# React组件库（@ss/mtd-react3）部分组件注意事项
- Grid组件其实是Row组件和Col组件的组件叫法。Grid组件的引入方式为 `import { Row, Col } from '@ss/mtd-react3'`并不是引入Grid对象，这一点必须注意！
- message、notification这两个组件比较特殊，它们的引入和使用都是小写：`import { message, notification } from '@ss/mtd-react3'`，这一点必须注意！
- RangePicker(日期范围选择)组件的引入方式为：`import { RangePicker } from '@ss/mtd-react3'`。
- Form第一层节点仅支持表单项Form.Item组件，如果第一层节点使用了其他组件，那么需要给Form组件设置useContext属性。
- FormItem中只允许包含一个使用toFormItem的组件，toFormItem与onChange和value是互斥的，必须使用toFormItem而非其他方式。
- Tabs组件的子组件 TabPan在设置标题的时候使用的是label属性！如：`<TabPane label="基础型" key="1" />`。 
- **Radio 组件的两种形态必须严格区分**：
  - **普通 Radio**（默认圆形单选框）：适用于表单中垂直/水平排列的选项列表，每个选项前有圆形选择指示器，视觉上是"选项列表"形态。
  - **Radio.Button**（按钮组形态）：当选项呈现为**一排相邻的矩形按钮/标签**，选中项高亮显示（如填充背景色或加边框），整体看起来像"分段控制器"或"Tab 切换条"时，**必须**使用 `Radio.Button` 而不是普通 `Radio`。
  - **判断口诀**：看到「紧贴排列的矩形选项块」→ 用 `Radio.Button`；看到「前面有圆圈的选项列表」→ 用普通 `Radio`。
  - 用法示例：`<Radio.Group><Radio.Button value="a">选项A</Radio.Button><Radio.Button value="b">选项B</Radio.Button></Radio.Group>`

# Vue组件库（@ss/mtd-vue2、@ss/mtd-vue3）部分组件注意事项
- message、notification、confirm这三个组件比较特殊，它们的使用方式为：this.$mtd.message({ message: '消息',..... })、this.$mtd.notify({ message: '消息',......})、this.$mtd.confirm({message: '消息', ......})。