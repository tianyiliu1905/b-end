# Form9 · 增删标签组（TagGroupEditor）

> **一句话定位**：管理可增删的动态标签集合，支持分组/无分组、手动输入/下拉选择/只读展示三种交互形态。
> **信号**：该模块出现说明用户在做"标签化配置"，标签数量不固定、需要动态增删。
> **适用边界**：集合是开放的——用户可以自由输入新值添加到集合中，也可以从预设列表中选择新增（变体C）。如果候选项是封闭的、用户只能从中勾选不能输入新值，应使用 F6 复选组。

---

## 一、何时用

- 以分组或单组形式管理可增删的动态标签集合。
- prompt 提到增删标签 / 标签组 / 动态标签 / 插件配置 / 技术栈选择 / 分组标签管理时使用。
- 用户需要自己输入新内容添加到集合中，或者集合是动态开放的（不限于预定义列表）。
- 典型场景：插件配置（运维输入新插件名）、排除接口列表（手动输入接口路径）、技术栈标签（自由输入技术名称）、环境变量 Key 管理。
- 支持分组/无分组、手动输入/下拉选择/只读展示三种交互形态。

---

## 二、布局 (ASCII)

增删标签组模块包含四种样式变体，根据是否分组、新增方式和是否可编辑来选择：

### 变体A · 分组标签行（标准形态）

每组一行，行首为分组名称（label），行内为该组已有标签（可关闭删除）和新增入口（"＋"按钮切换为输入框）。

```
┌───────────────────────────────────────────────────────────┐
│  录制入口插件   HTTP Server ×   MTthrift Server ×   ＋    │
│  HTTP客户端    OK HTTP Client ×   Apache HTTP Client ×  ＋│
│  缓存中间件    Squirrel ×    Squirrel-jedis ×    Cellar × ＋│
│  ...                                                       │
└───────────────────────────────────────────────────────────┘
```

- **分组布局**：每组占一个 Form.Item 行，分组名称作为 Form.Item 的 label。
- **标签样式**：`type="bordered"`（线型标签），`theme="blue"`（跟随主题色，详见 §四 约束 11），`closeable` 开启关闭按钮（×）。
- **新增入口**：虚线边框的灰色 Tag（`theme="gray"`），点击后原位切换为 Input 输入框，按回车或失焦确认。

**适用场景**：多维度插件配置、技术栈选择等需要按类别分组管理标签的场景。

### 变体B · 无分组标签（单行）

不分组，只有一个标签集合，适用于简单的标签编辑场景。

```
┌───────────────────────────────────────────────────────────┐
│  技能标签    Java ×    Go ×    Python ×    React ×    ＋    │
└───────────────────────────────────────────────────────────┘
```

- **布局**：标签横向排列 + 自动换行，末尾为"＋"新增入口。
- **标签样式**：与变体A 相同，`type="bordered"` + `theme="blue"`（跟随主题色） + `closeable`。
- **容器**：作为一个普通 Form.Item 的控件区域，label 为字段名称（如"技能标签"）。

**适用场景**：个人标签、技能标签等不需要分组的简单增删场景。

### 变体C · 下拉选择标签（Select 新增）

新增入口不是手动输入，而是从预设的下拉列表中选择添加。适用于候选项固定、不允许自由输入的场景。

```
┌───────────────────────────────────────────────────────────┐
│  排除接口    /api/health ×    /api/ping ×   [请选择 ▼]     │
└───────────────────────────────────────────────────────────┘
```

- **新增入口**：末尾放置一个 Select 下拉框（支持搜索过滤），选中后自动添加为标签、该选项从下拉列表中移除。
- **标签样式**：与变体A/B 相同，`theme="blue"`（跟随主题色） + `closeable`；删除后该选项重新回到下拉列表。
- **Select 样式**：`size="small"`，`filterable`，`placeholder="请选择"`，宽度 `160px`。

**适用场景**：排除接口列表、权限角色分配等候选项已知、不允许自由输入的场景。

### 变体D · 只读标签展示

标签不可删除、不可新增，纯展示用途。常用于详情页或表单中的"已选结果回显"。

```
┌───────────────────────────────────────────────────────────┐
│  已选插件    HTTP Server    MTthrift Server    Crane       │
└───────────────────────────────────────────────────────────┘
```

- **标签样式**：不设 `closeable`，无关闭按钮；`theme="blue"`（跟随主题色），与其他变体保持一致。
- **无新增入口**：不渲染"＋"按钮或 Input/Select。

**适用场景**：表单中的"已选配置回显"、详情页的标签展示。

---

## 三、可配参数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| groups | 分组配置列表，每组包含 key、label、tags | TagGroup[] | - |
| onChange | 任一分组的标签列表变化时的回调 | (groups: TagGroup[]) => void | - |
| tagType | 标签样式类型 | 'bordered' \| 'pure' \| 'pure-bordered' | 'bordered' |
| tagTheme | 标签主题色，跟随页面主题色（蓝主题→blue，非蓝主题→gray） | string | 'blue' |
| maxTagsPerGroup | 每组最大标签数量，达到后隐藏新增入口 | number | 无限制 |
| addButtonText | 新增入口的文案（变体A/B） | string | '+' |
| mode | 新增方式 | 'input' \| 'select' | 'input' |
| selectOptions | 下拉候选列表（变体C） | string[] | [] |
| readonly | 只读模式（变体D） | boolean | false |

```typescript
interface TagGroup {
  key: string;       // 分组唯一标识
  label: string;     // 分组名称
  tags: string[];    // 该组已有标签列表
}
```

---

## 四、约束

### 交互约束

1. **手动输入新增（变体A/B）**：点击"＋"按钮后，原位替换为 Input 输入框（`autoFocus`），按回车或失焦后确认新增；输入为空时不新增、输入框消失恢复为"＋"按钮。
2. **下拉选择新增（变体C）**：Select 下拉框选中后自动添加标签，该选项从候选列表中移除；标签删除后选项恢复到候选列表。
3. **去重校验**：同一分组/集合内不允许添加重复标签。
4. **删除标签**：点击标签的关闭按钮（×）直接删除，无二次确认。
5. **分组独立**（变体A）：各分组的增删互不影响。
6. **只读模式（变体D）**：不渲染关闭按钮和新增入口。

### 布局约束

7. **标签横向排列 + 自动换行**：同一分组/集合内的标签用 `flex-wrap: wrap` 横向排列，超出容器宽度时自动换行。
8. **新增入口始终在末尾**：新增按钮或 Select 始终位于该行所有标签之后。
9. **与 Form 集成**：增删标签组数据通过独立 state 管理，不嵌套在 Form.Item 内部做 toFormItem 数据收集，提交时将标签数据与主表单数据合并。
10. **控件区与 label 垂直居中对齐**：标签（Tag，高度 ~24px）比 label 行（~32px）矮，需确保与左侧 label 对齐。⚠️ **不要给 `.mtd-prime-form-item-body` 设横向 flex + `align-items: center`** —— body 下的 `wrapper`（控件）与 `explain`（校验提示）是兄弟节点，横向 flex 会把校验提示挤到控件右侧。正确写法：body 用 `flex-direction: column`，垂直居中单独作用于 `> .mtd-prime-form-item-wrapper`（见下方 CSS）。注意主表单的 `.section-form` 作用域选择器**不会**覆盖到标签组这类独立 Form 容器，需为其单独补规则。

### 主题色约束

11. **标签颜色跟随页面主题色**：标签默认使用 `theme="blue"`，与蓝色主题色（`--primary: #166FF7`）保持一致。当页面主题色为非蓝色时（如黄色主题），标签改用 `theme="gray"`（灰色），避免与主题色冲突产生不协调的视觉效果。判断依据：读取 CSS 变量 `--primary` 的值，蓝色系（色相在 200°–240° 范围）用 `blue`，其余用 `gray`。

### 变体选择规则

- **变体A 分组标签行**：标签需要按类别分组管理时使用，是标准形态。
- **变体B 无分组标签**：只有一组标签、不需要分组时使用，是最简形态。
- **变体C 下拉选择标签**：候选项已知且固定、不允许自由输入时使用。
- **变体D 只读标签展示**：标签仅展示、不可编辑时使用。

---

## 五、L3 组件映射与 MTD 查询

### 5.1 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) | 关键 Props |
|------|--------------------------|----------------------|------------|
| 标签 | `<Tag>` | `<mtd-tag>` | `closeable`, `onClose`, `theme`, `type` |
| 新增入口（虚线按钮态） | `<Tag>` | `<mtd-tag>` | `theme="gray"`, `onClick`, `style={{ borderStyle: 'dashed', cursor: 'pointer' }}` |
| 新增输入框 | `<Input>` | `<mtd-input>` | `size="small"`, `onPressEnter`, `onBlur`, `autoFocus` |
| 表单容器 | `<Form>` | `<mtd-form>` | `useContext`, `labelPosition`, `labelWidth` |
| 表单项（每组一行） | `<Form.Item>` | `<mtd-form-item>` | `label`, `formItemKey` |

### 5.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Tag,Input,Form,Button --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Tag,Input,Form,Button --target=mtd-vue --quiet
```

---

## 六、代码骨架（React / Vue3）

### 6.1 单行标签组骨架 · React

每个分组渲染为一行：标签列表 + 新增入口（点击切换为 Input）。

```tsx
import { useState, useRef, useEffect } from 'react';
import { Tag, Input } from '@ss/mtd-react3';

function TagGroupRow({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (newTags: string[]) => void;
}) {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: string) => {
    onChange(tags.filter((t) => t !== removedTag));
  };

  const handleInputConfirm = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className="tag-group-row">
      {tags.map((tag) => (
        <Tag
          key={tag}
          closeable
          theme="blue"
          onClose={() => handleClose(tag)}
        >
          {tag}
        </Tag>
      ))}
      {inputVisible ? (
        <Input
          ref={inputRef}
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          style={{ width: 120 }}
        />
      ) : (
        <Tag
          theme="gray"
          onClick={() => setInputVisible(true)}
          style={{ borderStyle: 'dashed', cursor: 'pointer' }}
        >
          +
        </Tag>
      )}
    </div>
  );
}
```

### 6.2 完整增删标签组骨架 · React

将多个 TagGroupRow 组装到 Form 中，每组占一个 Form.Item。

```tsx
import { useState } from 'react';
import { Form } from '@ss/mtd-react3';

function TagGroupEditor({
  initialGroups,
  onChange,
}: {
  initialGroups: TagGroup[];
  onChange?: (groups: TagGroup[]) => void;
}) {
  const [groups, setGroups] = useState<TagGroup[]>(initialGroups);

  const handleGroupChange = (groupKey: string, newTags: string[]) => {
    const updated = groups.map((g) =>
      g.key === groupKey ? { ...g, tags: newTags } : g
    );
    setGroups(updated);
    onChange?.(updated);
  };

  return (
    // 外层 .tag-groups-block 作为作用域锚点，供控件区垂直居中修正选择器使用
    <div className="tag-groups-block">
      <Form useContext labelPosition="left" labelWidth="7em">
        {groups.map((group) => (
          <Form.Item key={group.key} label={group.label}>
            <TagGroupRow
              tags={group.tags}
              onChange={(newTags) => handleGroupChange(group.key, newTags)}
            />
          </Form.Item>
        ))}
      </Form>
    </div>
  );
}
```

### 6.3 完整增删标签组骨架 · Vue3

```vue
<template>
  <!-- 外层 .tag-groups-block 作为作用域锚点，供控件区垂直居中修正选择器使用 -->
  <div class="tag-groups-block">
  <mtd-form use-context label-position="left" label-width="7em">
    <mtd-form-item
      v-for="group in groups"
      :key="group.key"
      :label="group.label"
    >
      <div class="tag-group-row">
        <mtd-tag
          v-for="tag in group.tags"
          :key="tag"
          closeable
          theme="blue"
          @close="handleClose(group.key, tag)"
        >
          {{ tag }}
        </mtd-tag>
        <mtd-input
          v-if="editingGroup === group.key"
          ref="inputRef"
          size="small"
          v-model="inputValue"
          style="width: 120px"
          @blur="handleInputConfirm(group.key)"
          @keyup.enter="handleInputConfirm(group.key)"
        />
        <mtd-tag
          v-else
          theme="gray"
          style="border-style: dashed; cursor: pointer"
          @click="showInput(group.key)"
        >
          +
        </mtd-tag>
      </div>
    </mtd-form-item>
  </mtd-form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

interface TagGroup {
  key: string;
  label: string;
  tags: string[];
}

const props = defineProps<{
  initialGroups: TagGroup[];
}>();

const emit = defineEmits<{
  (e: 'change', groups: TagGroup[]): void;
}>();

const groups = ref<TagGroup[]>([...props.initialGroups]);
const editingGroup = ref<string | null>(null);
const inputValue = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const handleClose = (groupKey: string, removedTag: string) => {
  const group = groups.value.find((g) => g.key === groupKey);
  if (group) {
    group.tags = group.tags.filter((t) => t !== removedTag);
    emit('change', groups.value);
  }
};

const showInput = async (groupKey: string) => {
  editingGroup.value = groupKey;
  await nextTick();
  inputRef.value?.focus();
};

const handleInputConfirm = (groupKey: string) => {
  const trimmed = inputValue.value.trim();
  const group = groups.value.find((g) => g.key === groupKey);
  if (group && trimmed && !group.tags.includes(trimmed)) {
    group.tags.push(trimmed);
    emit('change', groups.value);
  }
  editingGroup.value = null;
  inputValue.value = '';
};
</script>
```

---

## 七、CSS

```css
/* --- 控件区垂直居中 ---
 * .mtd-prime-form-item-body 下的 wrapper(控件) 与 explain(校验提示) 是兄弟节点。
 * ⚠️ 严禁给 body 设横向 flex + align-items: center —— 会让校验提示被挤到控件右侧。
 * body 只负责纵向堆叠，垂直居中单独作用于 wrapper。
 * 注意：主表单的 .section-form 作用域选择器不会覆盖到标签组这个独立 Form，必须单独补一条。 */
.tag-groups-block .mtd-prime-form-item-body {
  display: flex;
  flex-direction: column;
  min-height: 32px;
}
.tag-groups-block .mtd-prime-form-item-body > .mtd-prime-form-item-wrapper {
  min-height: 32px;
  display: flex;
  align-items: center;
}

/* --- 标签组行容器 --- */
.tag-group-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* --- 标签间距微调 ---
 * MTD Tag 本身不带外边距，靠容器 gap 控制。
 * 若使用旧版 MTD 不支持 gap，可退回到 margin 方案：
 * .tag-group-row .mtd-prime-tag { margin: 0 8px 8px 0; }
 */
```

---

## 八、踩坑笔记

- **Tag 的 `closeable` 与 `onClose` 配合**：设置 `closeable` 后 Tag 会渲染关闭按钮（×），但必须同时传 `onClose` 回调来执行真正的删除逻辑——MTD Tag 不会自动从 DOM 中移除自身，只是触发事件通知。
- **Input 的 `onChange` 触发时机**：MTD React Input 在 Form 环境下默认 `dispatchChange` 为 `['onBlur', 'onPressEnter']`，但这里不在 Form.Item 内部做 toFormItem 绑定，所以 `onChange` 按默认行为 `['onInput']` 逐字触发。若要减少触发频率，可手动设置 `dispatchChange={['onInput']}`。
- **新增入口的切换时机**：点击"＋"Tag 后需要 `autoFocus` 到 Input；React 中因为异步渲染，建议用 `useRef` + `useEffect` 保证 focus 时 DOM 已挂载。Vue3 中用 `nextTick()` + `ref.focus()` 达到同样效果。
- **`useContext` 必须开启**：因为 TagGroupRow 组件包裹在 Form.Item 内部但不是 Form 直接支持的表单控件，Form 必须设置 `useContext={true}`，否则会因为子节点类型校验报错。
