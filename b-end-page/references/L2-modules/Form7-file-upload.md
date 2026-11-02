# Form7 · 文件上传（FileUpload）

> **一句话定位**：上传附件/图片/证件/凭证等文件的区域。

---

## 一、何时用

- 上传附件、图片、证件、凭证等文件的区域。
- prompt 提到上传 / 附件 / 证件 / 图片 / 凭证时使用。
- 文件上传模块包含三种样式（按钮上传、拖拽上传、图片上传），根据使用场景选择。

---

## 二、布局 (ASCII)

文件上传模块包含三种样式，根据使用场景选择：

**布局示意（拖拽上传 + 文件列表）**：

```Plain
┌────────────────────────────────────────────────────────────────┐
│ 上传文件                                                       │ ← 顶部 label，格式限制可由 Tooltip 提示
│ ┌──────────────────────────────────────────────┐               │
│ │                       ＋                      │               │
│ │          点击或拖拽文件到此区域上传           │               │ ← 480 × 160 拖拽区，点击或拖拽触发
│ │          支持 .xlsx、.xls、.csv 格式          │               │ ← 区内副文案说明格式
│ └──────────────────────────────────────────────┘               │
├────────────────────────────────────────────────────────────────┤
│ 📄 导入模板.xlsx                              上传成功   ×     │ ← 已上传文件列表，支持删除
├────────────────────────────────────────────────────────────────┤
│ 📄 门店数据.csv                                上传中…   ×     │ ← 每行一个文件及状态
└────────────────────────────────────────────────────────────────┘
```

### 2.1 按钮上传（ButtonUpload）

最常用的上传方式，以按钮形态触发文件选择器。

- **触发器**：白色线形按钮（`type="default"`），左侧带上传图标（`export-o`），文字"点击上传"。
- **按钮尺寸**：高度 36px（默认），宽度由内容撑开。
- **文件列表**：上传完成后在按钮下方显示已上传文件列表，每行一个文件，包含文件名和删除操作。
- **提示信息**：如需补充格式/大小限制信息，在对应 Form.Item 的 label 上通过 `info-circle-o` 图标 + Tooltip 展示，不在按钮下方重复文字说明。

**适用场景**：表单中上传单个或少量附件（如导入模板、上传合同）。

### 2.2 拖拽上传（DraggerUpload）

大面积拖拽区域，支持点击和拖拽两种方式触发。

- **容器尺寸**：宽 480px，高 160px。
- **边框**：1px dashed #e0e0e0，圆角 10px。
- **背景**：白色（#fff）。
- **图标**：`add`（+号），尺寸 24px，颜色 #8a8f99，位于容器垂直居中位置，图标下方间距 12px。
- **主文案**：图标下方，颜色 #1f2329，默认字号 14px，内容"点击或拖拽文件到此区域上传"。
- **副文案**：主文案下方 4px，字号 12px，颜色 #adadad，行高 20px，描述支持的文件格式。
- **交互**：cursor: pointer，整个区域可点击。
- **内容居中**：容器使用 flex 纵向布局，水平和垂直均居中。

**适用场景**：需要突出上传操作的页面区域（如批量导入、模板上传），通常在表单中独占一行。

### 2.3 图片上传（ImageUpload）

以卡片式网格展示已上传图片缩略图。

- **卡片尺寸**：108px × 108px（默认 square 形态），圆角 10px。
- **添加按钮**：虚线边框卡片，内含 `add` 图标（24px），点击触发文件选择。
- **缩略图**：图片以 cover 方式填充卡片区域。
- **悬浮操作**：hover 时显示半透明遮罩，提供预览/删除操作。
- **形态**：支持 `square`（方形）和 `circle`（圆形）两种。

**适用场景**：上传产品图片、证件照片、头像等需要图片预览的场景。

---

## 三、可配参数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| action | 上传接口地址 | string | - |
| accept | 允许的文件类型 | string | - |
| multiple | 是否支持多选 | boolean | false |
| limit | 文件数量上限 | number | - |
| maxSize | 单文件大小上限（MB） | number | 10 |
| draggable | 是否支持拖拽上传 | boolean | false |
| listType | 文件列表展示方式 | 'text' \| 'picture-card' | 'text' |
| autoUpload | 是否选择后自动上传 | boolean | true |
| showFileList | 是否显示文件列表 | boolean | true |

---

## 四、约束

### 样式类型选择规则

- **按钮上传（ButtonUpload）**：默认选择，适用于大多数表单场景中的文件上传。
- **拖拽上传（DraggerUpload）**：当 prompt 提到"拖拽上传"或需要大面积上传区域时使用。
- **图片上传（ImageUpload）**：当上传对象为图片且需要缩略图预览时使用。

### 布局约束

- 在 F3 BaseLayout 中使用时，包含上传组件的 Form.Item 必须使用 `labelPosition="top"`（上下排列），其他字段保持 `"right"`（左右排列）。
- 上传 Form.Item 需加 `className="upload-item"`，通过 CSS 单独控制 label 与控件间距（`margin-bottom: 8px`），不影响其他 Form.Item。
- 拖拽上传（DraggerUpload）的容器宽度为固定 480px，不随 Form.Item 的 span 拉伸。

### 提示信息约束

- 按钮上传的格式/大小限制信息通过 label 上的 `info-circle-o` 图标 + Tooltip 展示，不在按钮下方添加额外文字。
- 拖拽上传的格式信息在拖拽区域内的副文案中展示。
- 图片上传一般不需要额外提示文案。

---

## 五、L3 组件映射与 MTD 查询

### 5.1 组件映射

| 功能 | React (`@ss/mtd-react3`) | 关键 Props |
|------|--------------------------|------------|
| 按钮上传 | `<Upload.ButtonUpload>` | `action`, `accept`, `limit`, `showFileList`, `listType` |
| 拖拽上传 | `<Upload.DraggerUpload>` | `action`, `accept`, `multiple`, `draggable` |
| 图片上传 | `<Upload.ImageUpload>` | `action`, `accept`, `listType="picture-card"`, `shape`, `limit` |
| 图标 | `<Icon>` | `type="export-o"` / `type="add"` / `type="info-circle-o"` |
| 提示气泡 | `<Tooltip>` | `message`, `placement`, `size` |

### 5.2 MTD 查询命令

```bash
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Upload,Icon,Tooltip --target=mtd-react --quiet
```

---

## 六、代码骨架（React / Vue3）

### 6.1 按钮上传（ButtonUpload）骨架 · React

> 最常用的上传方式。使用 `Upload.ButtonUpload`，children 传 `<Button>` 渲染触发按钮。
> **注意**：`buttonProps` 单独使用不会渲染 Button，必须用 `<Button>` 作为 children。

```tsx
import { Upload, Button, Icon, Tooltip, message } from '@ss/mtd-react3';

/* label 带提示图标的辅助组件 */
function LabelWithTip({ text, tip }: { text: string; tip: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {text}
      <Tooltip message={tip} placement="top" size="small">
        <Icon
          type="info-circle-o"
          style={{ marginLeft: 8, fontSize: 14, color: 'var(--text-4)', cursor: 'pointer' }}
        />
      </Tooltip>
    </span>
  );
}

/* Form.Item 中使用 */
<Form.Item
  formItemKey="uploadFile"
  className="upload-item"
  label={
    <LabelWithTip
      text="上传文件"
      tip="支持 .xlsx、.xls、.csv 格式，单文件不超过 10MB"
    />
  }
  span={12}
>
  <Upload.ButtonUpload
    action="/api/upload"
    accept=".xlsx,.xls,.csv"
    multiple={false}
    limit={1}
    showFileList={true}
    listType="text"
    onSuccess={(res, file) => {
      message.success(`${file.name} 上传成功`);
    }}
    onError={(err, file) => {
      message.error(`${file.name} 上传失败`);
    }}
    onBeforeUpload={(files) => {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        message.error('文件大小不能超过 10MB');
        return false;
      }
      return true;
    }}
  >
    <Button icon="export-o">点击上传</Button>
  </Upload.ButtonUpload>
</Form.Item>
```

#### 按钮上传要点

- 使用 `Upload.ButtonUpload` 子组件，而非原始 `<Upload>` 包裹 `<Button>`。
- `<Button icon="export-o">点击上传</Button>` 作为 children 传入，白色线形按钮样式。
- 图标验证：通过 `node scripts/icon.js validate "export-o"` 确认图标名合法。

### 6.2 拖拽上传（DraggerUpload）骨架 · React

> 大面积拖拽区域，支持点击和拖拽触发。使用 `Upload.DraggerUpload`，children 自定义拖拽区内容。

```tsx
import { Upload, Icon } from '@ss/mtd-react3';

<Form.Item
  formItemKey="draggerUpload"
  className="upload-item"
  label="拖拽上传"
  span={12}
>
  <Upload.DraggerUpload
    action="/api/upload"
    accept=".xlsx,.xls,.csv"
    multiple={false}
    draggable
  >
    <div className="dragger-upload-area">
      <Icon type="add" style={{ fontSize: 24, marginBottom: 12, color: 'var(--text-4)' }} />
      <div style={{ color: 'var(--text-1)' }}>点击或拖拽文件到此区域上传</div>
      <div style={{ fontSize: 12, color: 'var(--text-5)', lineHeight: '20px', marginTop: 4 }}>
        支持 .xlsx、.xls、.csv 格式
      </div>
    </div>
  </Upload.DraggerUpload>
</Form.Item>
```

#### 拖拽上传要点

- 使用 `Upload.DraggerUpload` 子组件。
- MTD 的 DraggerUpload 不提供默认内容样式，需要通过 children 传入自定义的拖拽区域 UI。

### 6.3 图片上传（ImageUpload）骨架 · React

> 以卡片式网格展示已上传图片缩略图。使用 `Upload.ImageUpload` 子组件。

```tsx
import { Upload } from '@ss/mtd-react3';

<Form.Item
  formItemKey="imageUpload"
  className="upload-item"
  label="图片上传"
  span={12}
>
  <Upload.ImageUpload
    action="/api/upload"
    accept="image/*"
    listType="picture-card"
    shape="square"
    limit={3}
  />
</Form.Item>
```

#### 图片上传要点

- 使用 `Upload.ImageUpload` 子组件，内置了添加按钮和缩略图网格布局。
- `listType="picture-card"` 启用卡片式缩略图展示。
- 默认卡片尺寸 108×108，由 MTD 内部样式控制，无需自定义 CSS。

### 6.4 上传 Form.Item 布局实现

> 以下为 §四布局约束的代码实现细节。

```tsx
<Form className="section-form" labelPosition="top" useContext={true}>
  {/* 上传相关的 Form.Item */}
</Form>
```

---

## 七、CSS

```css
/* 拖拽上传区域 */
.dragger-upload-area {
  text-align: center;
  width: 480px;
  height: 160px;
  background-color: var(--bg-card);
  border: 1px dashed var(--border);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 仅对上传 Form.Item 生效，不影响其他表单项 */
.section-form .upload-item.mtd-prime-form-item .mtd-prime-form-item-label {
  margin-bottom: 8px;
}
```

> **关键点**：使用 `margin-bottom` 而非 `padding-bottom`。因为 MTD 的 form-item-label 使用 `box-sizing: border-box`，padding 会被包含在固定的 22px 高度内（压缩文字空间），而 margin 在外部额外增加间距，保持 label 行高 22px 不变。

---

## 八、踩坑笔记

- **`Upload.ButtonUpload` 必须用 `<Button>` 作为 children**：单独使用 `buttonProps` 不会渲染 Button 元素，DOM 中只会输出裸文本 `<div>点击上传</div>`。
- **图标名称验证**：使用 `node scripts/icon.js validate "图标名"` 验证，常见错误如 `upload`（不存在，应为 `upload-cloud-o` 或 `export-o`）。
- **`export-o` 是上传按钮的推荐图标**：白色线形按钮 + `export-o` 图标是 B 端表单中文件上传的标准样式。
- **DraggerUpload 的 children 完全自定义**：MTD 的 DraggerUpload 不提供默认内容样式，需要通过 children 传入自定义的拖拽区域 UI。
- **React CSS 类前缀为 `mtd-prime-`**：如 `.mtd-prime-form-item`、`.mtd-prime-form-item-label`。
