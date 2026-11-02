/**
 * FD1 · 承载容器（PresentationContainer）
 * ─────────────────────────────────────────────
 * 表单页/详情页对外用多大的外壳出现，共 5 种容器：
 * 变体 A · 顺序落地页（默认）：灰底 + 白卡，页头/滚动内容区/操作栏纵向排列。
 * 变体 B · 步骤落地页：顺序落地页的分步变体，白卡内插入步骤条，内容区按步切换。
 * 变体 C · 主从落地页：一张白卡内左右分区，左侧对象列表，右侧配置表单。
 * 变体 D · 抽屉（Drawer）：从右侧滑出的面板，蒙层覆盖背景。
 * 变体 E · 弹窗（Dialog）：模态浮层，聚焦极少字段的单一操作。
 */
import { useState } from 'react';
import { Button, Drawer, Modal, Menu, Steps, Input, Form } from '@ss/mtd-react3';
import './PresentationContainerPreview.css';

/* ══════════════════════════════════════════════
   变体 A · 顺序落地页（默认）
   灰底 + 白卡：页头（固定）→ 滚动内容区 → 操作栏（固定底部）
   ══════════════════════════════════════════════ */
export function SequentialPagePreview() {
  return (
    <div className="fd1-viewport">
      <div className="fd1-page-container">
        <div className="fd1-page-card">
          <div className="fd1-page-header">
            <div className="fd1-page-header__title">门店基础信息</div>
            <div className="fd1-page-header__desc">用于维护门店的基础档案信息</div>
          </div>
          <div className="fd1-scroll-content">
            <div className="fd1-form-section">
              <div className="fd1-form-section__title">基本信息</div>
              <div className="fd1-mock-field" />
              <div className="fd1-mock-field" />
            </div>
            <div className="fd1-form-section">
              <div className="fd1-form-section__title">经营信息</div>
              <div className="fd1-mock-field" />
              <div className="fd1-mock-field" />
            </div>
          </div>
          <div className="fd1-action-bar">
            <Button>取消</Button>
            <Button type="primary">提交</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   变体 B · 步骤落地页
   顺序落地页外壳 + 白卡内常驻步骤条，内容区按步切换
   ══════════════════════════════════════════════ */
export function StepPagePreview() {
  const [current, setCurrent] = useState(1);
  const stepTitles = ['主体信息', '资质证照', '经营信息'];
  return (
    <div className="fd1-viewport">
      <div className="fd1-page-container">
        <div className="fd1-page-card">
          <div className="fd1-page-header">
            <div className="fd1-page-header__title">商家入驻</div>
          </div>
          <Steps active={current} labelPlacement="horizontal" className="fd1-step-bar">
            {stepTitles.map((t) => (
              <Steps.Step key={t} title={t} />
            ))}
          </Steps>
          <div className="fd1-scroll-content">
            <div className="fd1-form-section">
              <div className="fd1-form-section__title">{stepTitles[current]}</div>
              <div className="fd1-mock-field" />
              <div className="fd1-mock-field" />
            </div>
          </div>
          <div className="fd1-action-bar">
            {current > 0 && <Button onClick={() => setCurrent((c) => c - 1)}>上一步</Button>}
            {current < stepTitles.length - 1 && (
              <Button type="primary" onClick={() => setCurrent((c) => c + 1)}>下一步</Button>
            )}
            {current === stepTitles.length - 1 && <Button type="primary">提交</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   变体 C · 主从落地页
   一张白卡内左右分区：左侧对象列表（Menu），右侧配置表单 + 操作栏
   ══════════════════════════════════════════════ */
export function MasterDetailPagePreview() {
  const [activeKey, setActiveKey] = useState('item1');
  const items = [
    { key: 'item1', label: '标准店三区' },
    { key: 'item2', label: '标准店四区' },
    { key: 'item3', label: '加盟商专区' },
  ];
  return (
    <div className="fd1-viewport">
      <div className="fd1-page-container">
        <div className="fd1-content-card">
          <aside className="fd1-master-panel">
            <Menu
              mode="inline"
              className="fd1-master-panel__menu"
              selectedKeys={[activeKey]}
              onSelectChange={(keys: any) => setActiveKey(Array.isArray(keys) ? keys[0] : keys)}
            >
              {items.map((it) => (
                <Menu.Item key={it.key}>{it.label}</Menu.Item>
              ))}
            </Menu>
          </aside>
          <div className="fd1-detail-panel">
            <div className="fd1-detail-panel__content">
              <div className="fd1-page-header">
                <div className="fd1-page-header__title">{items.find((i) => i.key === activeKey)?.label}</div>
              </div>
              <div className="fd1-form-section">
                <div className="fd1-mock-field" />
                <div className="fd1-mock-field" />
              </div>
            </div>
            <div className="fd1-action-bar">
              <Button>重置</Button>
              <Button type="primary">保存</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   变体 D · 抽屉（Drawer）
   从右侧滑出的面板，蒙层覆盖背景；标准档 640px / 宽型档 800px
   ══════════════════════════════════════════════ */
export function DrawerContainerPreview() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="fd1-trigger-demo">
      <Button type="primary" onClick={() => setVisible(true)}>打开抽屉</Button>
      <Drawer
        visible={visible}
        title="新建配置"
        width={640}
        maskClosable={false}
        onClose={() => setVisible(false)}
        footer={
          <div className="fd1-drawer-action-bar">
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => setVisible(false)}>提交</Button>
          </div>
        }
      >
        <p className="fd1-drawer-desc">请填写表单信息，带 * 为必填项。</p>
        <Form useContext={true} labelWidth="100px" labelPosition="right" className="fd1-drawer-form">
          <Form.Item formItemKey="name" label="名称" required>
            <Input placeholder="请输入名称" toFormItem style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item formItemKey="desc" label="说明">
            <Input placeholder="请输入说明" toFormItem style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

/* ══════════════════════════════════════════════
   变体 E · 弹窗（Dialog / Modal）
   模态浮层，仅表单页使用；约 1–5 个字段，无分组、无分步
   ══════════════════════════════════════════════ */
export function ModalContainerPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fd1-trigger-demo">
      <Button type="primary" onClick={() => setOpen(true)}>打开弹窗</Button>
      <Modal
        open={open}
        title="快速新建标签"
        onClose={() => setOpen(false)}
        footer={
          <div className="fd1-modal-action-bar">
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button type="primary" onClick={() => setOpen(false)}>确定</Button>
          </div>
        }
      >
        <p className="fd1-modal-desc">请填写标签信息，带 * 为必填项。</p>
        <Form useContext={true} labelWidth="80px" labelPosition="right">
          <Form.Item formItemKey="tagName" label="标签名称" required>
            <Input placeholder="请输入标签名称" toFormItem style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
