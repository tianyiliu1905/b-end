import { Image } from '@ss/mtd-react3';
import './AttachmentPreview.css';

/* ─────────────────────────────────────────────────────────
 * 变体 A · 仅文件链接列表（纯文字，无图标，无文件大小，横向并排）
 * ───────────────────────────────────────────────────────── */
const FILE_ONLY_LIST = [
  { name: '运力保障计划书.pdf' },
  { name: '预算测算表.xlsx' },
  { name: '合同附件模板.docx' },
  { name: '门店经营规范说明.pdf' },
];

export function FilesOnlyPreview() {
  return (
    <div className="ap-wrap">
      <div className="ap-section-title">附件资料</div>
      <div className="ap-files">
        {FILE_ONLY_LIST.map((file) => (
          <a key={file.name} className="ap-file-link">
            {file.name}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 变体 B · 仅图片缩略图（支持点击放大预览，使用 MTD Image.PreviewGroup）
 * ───────────────────────────────────────────────────────── */
const IMAGE_SRCS = [
  'https://nocode.meituan.com/photo/search?keyword=store,interior&width=96&height=96',
  'https://nocode.meituan.com/photo/search?keyword=restaurant,food&width=96&height=96',
  'https://nocode.meituan.com/photo/search?keyword=kitchen,chef&width=96&height=96',
  'https://nocode.meituan.com/photo/search?keyword=cafe,coffee&width=96&height=96',
];

export function ImagesOnlyPreview() {
  return (
    <div className="ap-wrap">
      <div className="ap-section-title">现场照片</div>
      <div className="ap-images">
        <Image.PreviewGroup>
          {IMAGE_SRCS.map((src) => (
            <div key={src} className="ap-image-thumb">
              <Image
                src={src}
                width={96}
                height={96}
                objectFit="cover"
              />
            </div>
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 变体 C · 图片 + 文件混合（图片区在上、文件链接区在下）
 * ───────────────────────────────────────────────────────── */
const MIXED_IMAGES = [
  'https://nocode.meituan.com/photo/search?keyword=document,sign&width=96&height=96',
  'https://nocode.meituan.com/photo/search?keyword=store,shop&width=96&height=96',
];

const MIXED_FILES = [
  { name: '租赁合同.pdf' },
  { name: '验收报告.xlsx' },
  { name: '装修方案.docx' },
];

export function MixedAttachmentPreview() {
  return (
    <div className="ap-wrap">
      <div className="ap-section-title">附件资料</div>
      {/* 图片区在上 */}
      <div className="ap-images">
        <Image.PreviewGroup>
          {MIXED_IMAGES.map((src) => (
            <div key={src} className="ap-image-thumb">
              <Image
                src={src}
                width={96}
                height={96}
                objectFit="cover"
              />
            </div>
          ))}
        </Image.PreviewGroup>
      </div>
      {/* 文件链接区在下 */}
      <div className="ap-files">
        {MIXED_FILES.map((file) => (
          <a key={file.name} className="ap-file-link">
            {file.name}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 变体 D · 嵌入 GroupSection 内（模拟实际详情页场景）
 * ───────────────────────────────────────────────────────── */
const GROUP_FILES = [
  { name: '营业执照副本.pdf' },
  { name: '食品经营许可证.pdf' },
  { name: '消防验收报告.pdf' },
  { name: '环保验收意见书.pdf' },
  { name: '卫生许可证.pdf' },
];

export function GroupSectionAttachmentPreview() {
  return (
    <div className="ap-group-demo">
      {/* 模拟 GroupSection 卡片头部 */}
      <div className="ap-group-header">资质证照</div>
      <div className="ap-group-body">
        {/* 模拟描述列表字段 */}
        <div className="ap-desc-row">
          <span className="ap-desc-label">证照状态</span>
          <span className="ap-desc-value">有效期内</span>
        </div>
        <div className="ap-desc-row">
          <span className="ap-desc-label">最近更新</span>
          <span className="ap-desc-value">2024-03-15</span>
        </div>
        {/* 附件区域作为分组最后一类内容 */}
        <div className="ap-desc-row ap-desc-row--attachment">
          <span className="ap-desc-label">证照附件</span>
          <div className="ap-files ap-files--inline">
            {GROUP_FILES.map((file) => (
              <a key={file.name} className="ap-file-link">
                {file.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
