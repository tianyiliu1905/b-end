/**
 * Form7 · 文件/图片上传（FileUpload）
 * ─────────────────────────────────────────────
 * 上传附件/图片/证件/凭证等文件的区域，包含三种样式：
 * 变体 A · 按钮上传（ButtonUpload）：最常用，表单中上传单个或少量附件。
 * 变体 B · 拖拽上传（DraggerUpload）：大面积拖拽区域，突出上传操作。
 * 变体 C · 图片上传（ImageUpload）：卡片式网格展示已上传图片缩略图。
 */
import { Upload, Button, Icon, Tooltip, Form } from '@ss/mtd-react3';
import './FileUploadPreview.css';

/* label 带提示图标的辅助组件（用于按钮上传的格式/大小限制提示） */
function LabelWithTip({ text, tip }: { text: string; tip: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {text}
      <Tooltip message={tip} placement="top" size="small">
        <Icon
          type="info-circle-o"
          style={{ marginLeft: 6, fontSize: 14, color: 'var(--text-4)', cursor: 'pointer' }}
        />
      </Tooltip>
    </span>
  );
}

/* ══════════════════════════════════════════════
   变体 A · 按钮上传（ButtonUpload）
   ══════════════════════════════════════════════ */
export function ButtonUploadField() {
  return (
    <Form className="section-form" labelPosition="top" useContext={true}>
      <Form.Item
        formItemKey="uploadFile"
        className="upload-item"
        label={
          <LabelWithTip
            text="上传文件"
            tip="支持 .xlsx、.xls、.csv 格式，单文件不超过 10MB"
          />
        }
      >
        <Upload.ButtonUpload
          action="/api/upload"
          accept=".xlsx,.xls,.csv"
          multiple={false}
          limit={1}
          showFileList={true}
          listType="text"
        >
          <Button icon="export-o">点击上传</Button>
        </Upload.ButtonUpload>
      </Form.Item>
    </Form>
  );
}

/* ══════════════════════════════════════════════
   变体 B · 拖拽上传（DraggerUpload）
   ══════════════════════════════════════════════ */
export function DraggerUploadField() {
  return (
    <Form className="section-form" labelPosition="top" useContext={true}>
      <Form.Item
        formItemKey="draggerUpload"
        className="upload-item"
        label="拖拽上传"
      >
        <Upload.DraggerUpload
          action="/api/upload"
          accept=".xlsx,.xls,.csv"
          multiple={false}
          draggable
        >
          <div className="dragger-upload-area">
            <Icon type="add" style={{ fontSize: 24, marginBottom: 12, color: 'var(--text-4)' }} />
            <div className="dragger-upload-area__main">点击或拖拽文件到此区域上传</div>
            <div className="dragger-upload-area__sub">支持 .xlsx、.xls、.csv 格式</div>
          </div>
        </Upload.DraggerUpload>
      </Form.Item>
    </Form>
  );
}

/* ══════════════════════════════════════════════
   变体 C · 图片上传（ImageUpload）
   ══════════════════════════════════════════════ */
export function ImageUploadField() {
  return (
    <Form className="section-form" labelPosition="top" useContext={true}>
      <Form.Item
        formItemKey="imageUpload"
        className="upload-item"
        label="图片上传"
      >
        <Upload.ImageUpload
          action="/api/upload"
          accept="image/*"
          listType="picture-card"
          shape="square"
          limit={3}
          fileList={[
            { uid: 1, name: '门头照.jpg', status: 'success', thumbUrl: 'https://nocode.meituan.com/photo/search?keyword=storefront&width=108&height=108' },
          ]}
        />
      </Form.Item>
    </Form>
  );
}
