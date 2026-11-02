/**
 * Form1 · 操作栏（ActionBar）
 * ─────────────────────────────────────────────
 * 承载提交/保存/取消等动作的按钮区，是白卡（.page-card）flex column 的
 * 末尾固定子项，通过 flex-shrink: 0 始终固定在白卡底部，内容区独立滚动。
 *
 * 变体：
 *   变体A 顺序表单操作栏：[取消] [提交]
 *   变体B 分步表单操作栏：按钮随步骤动态变化（第一步/中间步骤/最后一步）
 *   变体C 抽屉/弹窗操作栏：面板内底部固定 [取消] [确定]
 *   变体D 带危险操作：[删除] [取消] [保存]
 */
import { useState } from 'react';
import { Button, Input } from '@ss/mtd-react3';
import './ActionBarPreview.css';

/* 变体A · 顺序表单操作栏（默认，白卡内 flex 固定底部结构） */
export function SequentialActionBarDemo() {
  return (
    <div className="ab-page-card">
      <div className="ab-scroll-content">
        <div className="ab-fake-field">
          <span className="ab-fake-field__label">活动名称</span>
          <Input placeholder="请输入活动名称" style={{ flex: 1 }} />
        </div>
        <div className="ab-fake-field">
          <span className="ab-fake-field__label">活动说明</span>
          <Input placeholder="请输入活动说明" style={{ flex: 1 }} />
        </div>
        <div className="ab-scroll-hint">↕ 内容超长时此区域独立滚动</div>
      </div>
      <div className="action-bar">
        <Button>取消</Button>
        <Button type="primary">提交</Button>
      </div>
    </div>
  );
}

/* 变体B · 分步表单操作栏（按钮随步骤动态变化） */
const STEP_TITLES = ['基本信息', '资质证照', '经营信息'];

export function StepActionBarDemo() {
  const [current, setCurrent] = useState(0);
  const isFirst = current === 0;
  const isLast = current === STEP_TITLES.length - 1;

  return (
    <div className="ab-page-card">
      <div className="ab-step-indicator">
        步骤 {current + 1}/{STEP_TITLES.length}：{STEP_TITLES[current]}
      </div>
      <div className="ab-step-content">
        <div className="ab-fake-field">
          <span className="ab-fake-field__label">{STEP_TITLES[current]}字段</span>
          <Input placeholder="请输入" style={{ flex: 1 }} />
        </div>
      </div>
      <div className="action-bar">
        {!isFirst && <Button onClick={() => setCurrent((c) => c - 1)}>上一步</Button>}
        {!isLast ? (
          <Button type="primary" onClick={() => setCurrent((c) => c + 1)}>下一步</Button>
        ) : (
          <Button type="primary">提交</Button>
        )}
      </div>
    </div>
  );
}

/* 变体C · 抽屉/弹窗操作栏（面板内底部固定） */
export function PanelActionBarDemo() {
  return (
    <div className="ab-panel">
      <div className="ab-panel__header">编辑配置</div>
      <div className="ab-panel__content">
        <div className="ab-fake-field">
          <span className="ab-fake-field__label">配置名称</span>
          <Input placeholder="请输入配置名称" style={{ flex: 1 }} />
        </div>
        <div className="ab-fake-field">
          <span className="ab-fake-field__label">配置值</span>
          <Input placeholder="请输入配置值" style={{ flex: 1 }} />
        </div>
      </div>
      <div className="drawer-action-bar">
        <Button>取消</Button>
        <Button type="primary">确定</Button>
      </div>
    </div>
  );
}

/* 变体D · 带危险操作（删除靠左，取消+保存靠右） */
export function DangerActionBarDemo() {
  return (
    <div className="ab-page-card">
      <div className="ab-scroll-content">
        <div className="ab-fake-field">
          <span className="ab-fake-field__label">配置名称</span>
          <Input placeholder="请输入配置名称" style={{ flex: 1 }} />
        </div>
      </div>
      <div className="action-bar action-bar--with-danger">
        <Button type="danger">删除</Button>
        <div className="action-bar__spacer" />
        <Button>取消</Button>
        <Button type="primary">保存</Button>
      </div>
    </div>
  );
}
