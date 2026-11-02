import { type ReactNode } from 'react';
import MtdLayout, { type MtdLayoutProps } from './MtdLayout';

interface VersionSwitcherProps {
  title: string;
  mtdVersion: ReactNode;
  wip?: boolean;
  /** 自定义 MtdLayout 的 props（如 systemName / navGroups） */
  mtdLayoutProps?: Omit<MtdLayoutProps, 'children'>;
}

export default function VersionSwitcher({ title, mtdVersion, wip, mtdLayoutProps }: VersionSwitcherProps) {
  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* MTD version - wrapped with MtdLayout */}
      <div style={{ height: '100%' }}>
        <MtdLayout {...mtdLayoutProps}>
          {mtdVersion}
        </MtdLayout>
      </div>

      {/* 建设中遮罩 */}
      {wip && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 9000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(4px)',
        }}>
          <span style={{ fontSize: 36, fontWeight: 600, color: '#999', letterSpacing: 6 }}>建设中</span>
        </div>
      )}

      {/* 返回首页按钮已移至 App.tsx 全局 HomeFloatingButton */}
    </div>
  );
}
