/**
 * Form4 · 步骤条（StepBar）
 * ─────────────────────────────────────────────
 * 用 MTD Steps 组件在分步表单/分步落地页顶部标示当前处于流程的第几步，
 * 帮助用户建立"总共几步、现在第几步"的进度心智。
 * 步骤条本身不可点击跳转（不设 onChange，不使用 type="navigation"），
 * 状态完全由 active（当前步骤下标）自动推导：
 *   之前的步骤 → finish；当前步骤 → process；之后的步骤 → wait。
 * 仅当前步骤校验失败时才需要手动传入 status="error" 覆盖该步。
 *
 * 三个变体：
 *   变体A 标准横向：仅 title，默认形态，适用于绝大多数分步表单
 *   变体B 带描述：title + description，需要在标题下补充说明当前步骤内容
 *   变体C 点状：dot 简洁圆点，步骤数较多（4-5步）或标题过长时使用
 */
import { useState } from 'react';
import { Steps, Button } from '@ss/mtd-react3';
import './StepPageFlowPreview.css';

/* ══════════════════════════════════════════════
   变体 A · 标准横向（仅 title，默认）
   ══════════════════════════════════════════════ */
const STANDARD_STEPS = ['主体信息', '资质证照', '经营信息'];

export function StandardStepBar() {
  const [current, setCurrent] = useState(1);
  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));
  const handleNext = () => setCurrent((c) => Math.min(STANDARD_STEPS.length - 1, c + 1));

  return (
    <div className="step-bar-demo">
      <Steps active={current} labelPlacement="horizontal" className="step-bar-demo__steps">
        {STANDARD_STEPS.map((title) => (
          <Steps.Step key={title} title={title} />
        ))}
      </Steps>
      <div className="step-bar-demo__actions">
        {current > 0 && <Button onClick={handlePrev}>上一步</Button>}
        {current < STANDARD_STEPS.length - 1 && (
          <Button type="primary" onClick={handleNext}>下一步</Button>
        )}
        {current === STANDARD_STEPS.length - 1 && <Button type="primary">提交申请</Button>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   变体 B · 带描述（title + description）
   ══════════════════════════════════════════════ */
const DESC_STEPS = [
  { title: '填写信息', description: '完善基本资料' },
  { title: '上传材料', description: '提交资质证照' },
  { title: '等待审核', description: '1-2 个工作日' },
];

export function DescriptionStepBar() {
  // 当前步骤校验失败示例：第 2 步（index=1）标记为 error
  const [current] = useState(1);
  const [hasError] = useState(true);

  return (
    <div className="step-bar-demo">
      <Steps active={current} labelPlacement="horizontal" className="step-bar-demo__steps">
        {DESC_STEPS.map((s, idx) => (
          <Steps.Step
            key={s.title}
            title={s.title}
            description={s.description}
            status={idx === current && hasError ? 'error' : undefined}
          />
        ))}
      </Steps>
      <div className="step-bar-demo__hint">
        {hasError ? '当前步骤材料校验未通过，请检查后重新提交' : ''}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   变体 C · 点状（dot，步骤较多或标题较长时）
   ══════════════════════════════════════════════ */
const DOT_STEPS = ['提交申请', '资质审核', '合同签署', '账户开通', '正式启用'];

export function DotStepBar() {
  const [current, setCurrent] = useState(2);
  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));
  const handleNext = () => setCurrent((c) => Math.min(DOT_STEPS.length - 1, c + 1));

  return (
    <div className="step-bar-demo">
      <Steps active={current} labelPlacement="horizontal" dot className="step-bar-demo__steps">
        {DOT_STEPS.map((title) => (
          <Steps.Step key={title} title={title} />
        ))}
      </Steps>
      <div className="step-bar-demo__actions">
        {current > 0 && <Button onClick={handlePrev}>上一步</Button>}
        {current < DOT_STEPS.length - 1 && (
          <Button type="primary" onClick={handleNext}>下一步</Button>
        )}
        {current === DOT_STEPS.length - 1 && <Button type="primary">完成</Button>}
      </div>
    </div>
  );
}
