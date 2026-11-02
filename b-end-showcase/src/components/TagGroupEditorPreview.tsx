/**
 * Form9 · 增删标签组（TagGroupEditor）
 * ─────────────────────────────────────────────
 * 四种变体：
 *   变体A · 分组标签行（标准，多组 Form.Item）
 *   变体B · 无分组标签（单行，简单形态）
 *   变体C · 下拉选择标签（候选项固定，不能自由输入）
 *   变体D · 只读标签展示（详情页/回显）
 */
import { useState, useRef, useEffect } from 'react';
import { Form, Tag, Input, Select } from '@ss/mtd-react3';
import './TagGroupEditorPreview.css';

/* ─────────────────────────────────────────────
   内部复用：单行标签 + 新增入口（手动输入）
   ───────────────────────────────────────────── */
interface TagRowProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
}

function TagRow({ tags, onChange }: TagRowProps) {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: string) => {
    onChange(tags.filter((t) => t !== removedTag));
  };

  const handleConfirm = () => {
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
          type="bordered"
          theme="blue"
          closeable
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
          onChange={(e: any) => setInputValue(e.target.value)}
          onBlur={handleConfirm}
          onPressEnter={handleConfirm}
          style={{ width: 120 }}
        />
      ) : (
        <Tag
          theme="gray"
          type="bordered"
          onClick={() => setInputVisible(true)}
          style={{ borderStyle: 'dashed', cursor: 'pointer' }}
        >
          +
        </Tag>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   变体A · 分组标签行（标准形态）
   ───────────────────────────────────────────── */
interface TagGroup {
  key: string;
  label: string;
  tags: string[];
}

const INITIAL_GROUPS: TagGroup[] = [
  { key: 'record', label: '录制入口插件', tags: ['HTTP Server', 'MTthrift Server'] },
  { key: 'http', label: 'HTTP客户端', tags: ['OK HTTP Client', 'Apache HTTP Client'] },
  { key: 'cache', label: '缓存中间件', tags: ['Squirrel', 'Cellar'] },
];

export function GroupedTagEditor() {
  const [groups, setGroups] = useState<TagGroup[]>(INITIAL_GROUPS);

  const handleGroupChange = (groupKey: string, newTags: string[]) => {
    setGroups((prev) =>
      prev.map((g) => (g.key === groupKey ? { ...g, tags: newTags } : g))
    );
  };

  return (
    <div className="tag-groups-block">
      <Form useContext={true} labelPosition="right" labelWidth="7em">
        {groups.map((group) => (
          <Form.Item key={group.key} formItemKey={group.key} label={group.label}>
            <TagRow
              tags={group.tags}
              onChange={(newTags) => handleGroupChange(group.key, newTags)}
            />
          </Form.Item>
        ))}
      </Form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   变体B · 无分组标签（单行）
   ───────────────────────────────────────────── */
export function SingleTagEditor() {
  const [tags, setTags] = useState(['Java', 'Go', 'Python', 'React']);

  return (
    <div className="tag-groups-block">
      <Form useContext={true} labelPosition="right" labelWidth="5em">
        <Form.Item formItemKey="skills" label="技能标签">
          <TagRow tags={tags} onChange={setTags} />
        </Form.Item>
      </Form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   变体C · 下拉选择标签（候选项固定）
   ───────────────────────────────────────────── */
const ALL_OPTIONS = ['/api/health', '/api/ping', '/api/metrics', '/api/ready', '/api/live'];

export function SelectTagEditor() {
  const [tags, setTags] = useState(['/api/health', '/api/ping']);

  // 从候选列表中移除已选中的标签
  const remaining = ALL_OPTIONS.filter((o) => !tags.includes(o));

  const handleClose = (removedTag: string) => {
    setTags((prev) => prev.filter((t) => t !== removedTag));
  };

  const handleSelect = (value: any) => {
    if (value && !tags.includes(value as string)) {
      setTags((prev) => [...prev, value as string]);
    }
  };

  return (
    <div className="tag-groups-block">
      <Form useContext={true} labelPosition="right" labelWidth="5em">
        <Form.Item formItemKey="excludes" label="排除接口">
          <div className="tag-group-row">
            {tags.map((tag) => (
              <Tag
                key={tag}
                type="bordered"
                theme="blue"
                closeable
                onClose={() => handleClose(tag)}
              >
                {tag}
              </Tag>
            ))}
            {remaining.length > 0 && (
              <Select
                size="small"
                placeholder="请选择"
                filterable
                value={undefined}
                onChange={handleSelect}
                style={{ width: 160 }}
              >
                {remaining.map((opt) => (
                  <Select.Option key={opt} value={opt}>
                    {opt}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   变体D · 只读标签展示
   ───────────────────────────────────────────── */
export function ReadonlyTagDisplay() {
  const tags = ['HTTP Server', 'MTthrift Server', 'Crane', 'OK HTTP Client'];

  return (
    <div className="tag-groups-block">
      <Form useContext={true} labelPosition="right" labelWidth="5em">
        <Form.Item formItemKey="selected" label="已选插件">
          <div className="tag-group-row">
            {tags.map((tag) => (
              <Tag key={tag} type="bordered" theme="blue">
                {tag}
              </Tag>
            ))}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
