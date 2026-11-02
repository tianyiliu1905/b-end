/**
 * 服务风险平台 —— 风险详情页
 * 技术栈：React + @ss/mtd-react3
 * 设计风格：美团黄 灰底 + 白卡（无边框无阴影）
 *
 * 页面结构：
 * - 顶部黑底导航栏（平台专属，非通用 General-Layout）
 * - 左侧深灰图标导航栏
 * - 主内容区白卡：表头信息区 + 左右分栏（左：问题描述/配置信息/治理建议；右：风险处理日志 Timeline）
 *
 * 模块装配清单（L1 详情页）：
 * - FD2 表头信息区（V9 变体：返回 + 标题 + 状态标签 + 摘要信息行）
 * - Form2 分组分段（问题描述 / 配置信息 / 治理建议）
 * - Detail2 描述列表（配置信息键值对展示）
 * - MTD Timeline（风险处理日志）
 *
 * 图标均经 icon.js validate 验证合法。
 */

import { useState, type ReactNode } from 'react';
import { Icon, Tag, Button, Timeline } from '@ss/mtd-react3';

/* ─────────────────────────────────────────────
 * 类型
 * ───────────────────────────────────────────── */
interface TimelineLog {
  time: string;
  text: string;
  color: 'blue' | 'orange' | 'green' | 'red';
  icon?: string;
}

/* ─────────────────────────────────────────────
 * Mock 数据
 * ───────────────────────────────────────────── */
const topTabs = ['流水线', '构建', '发布', '制品', '服务风险', '设置'];
const activeTopTab = '服务风险';

const sideIcons = [
  { icon: 'menus-o', label: '菜单' },
  { icon: 'home-o', label: '首页' },
  { icon: 'setting', label: '设置' },
  { icon: 'question-circle-o', label: '帮助' },
];

const timelineLogs: TimelineLog[] = [
  { time: '2023-08-20 23:00', text: '风险已修复，状态更新为已解决', color: 'green', icon: 'success-o' },
  { time: '2023-08-20 23:00', text: '发起检测，等待检测结果返回', color: 'blue' },
  { time: '2023-08-20 23:00', text: '检测失败，请检查配置后重试', color: 'red', icon: 'error-o' },
  { time: '2023-08-20 23:00', text: '发起检测，系统自动触发风险扫描', color: 'blue' },
  { time: '2023-08-20 23:00', text: '风险已创建，等待处理', color: 'orange' },
];

/* ─────────────────────────────────────────────
 * 组件
 * ───────────────────────────────────────────── */
export default function RiskDetailPage() {
  const [currentService] = useState('meituan.ee.ticket.core');

  return (
    <div className="risk-shell">
      {/* ===== 顶部黑底导航栏 ===== */}
      <header className="risk-top-nav">
        <div className="risk-top-nav__left">
          <Icon type="menus-o" className="risk-top-nav__menu-icon" />
          <span className="risk-top-nav__domain">{currentService}</span>
        </div>
        <nav className="risk-top-nav__tabs">
          {topTabs.map((tab) => (
            <a
              key={tab}
              className={`risk-top-nav__tab${tab === activeTopTab ? ' is-active' : ''}`}
            >
              {tab}
            </a>
          ))}
        </nav>
        <div className="risk-top-nav__right">
          <div className="risk-top-nav__service-select">
            <span className="risk-top-nav__service-label">当前服务</span>
            <span className="risk-top-nav__service-name">{currentService}</span>
            <Icon type="down-thick" style={{ fontSize: 12, marginLeft: 4 }} />
          </div>
          <div className="risk-top-nav__search">
            <Icon type="search" style={{ fontSize: 16 }} />
          </div>
        </div>
      </header>

      <div className="risk-body">
        {/* ===== 左侧图标导航 ===== */}
        <aside className="risk-icon-nav">
          {sideIcons.map((item) => (
            <div
              key={item.icon}
              className={`risk-icon-nav__item${item.icon === 'menus-o' ? ' is-active' : ''}`}
              title={item.label}
            >
              <Icon type={item.icon} />
            </div>
          ))}
        </aside>

        {/* ===== 主内容区 ===== */}
        <main className="risk-content">
          <div className="risk-page-container">
            <div className="risk-page-card">
              {/* ── 表头信息区（FD2 V9 变体 + 摘要信息行）── */}
              <div className="page-header">
                <h1 className="page-header__title page-header__title--with-back">
                  <Icon
                    type="arrow-left"
                    className="page-header__back-icon"
                    onClick={() => window.history.back()}
                  />
                  部署模板：Prod并发度设置过大
                  <Tag theme="orange" type="bordered" size="small" className="page-header__status">未处理</Tag>
                </h1>

                {/* 摘要信息行 */}
                <div className="page-header__summary">
                  <div className="page-header__summary-row">
                    <span className="page-header__summary-item">
                      <span className="page-header__summary-label">风险等级</span>
                      <span className="page-header__summary-value">
                        <Tag theme="red" type="bordered" size="small" style={{ verticalAlign: 'middle' }}>高危</Tag>
                      </span>
                    </span>
                    <span className="page-header__summary-item">
                      <span className="page-header__summary-label">风险类型</span>
                      <span className="page-header__summary-value">并发度设置过大</span>
                    </span>
                    <span className="page-header__summary-item">
                      <span className="page-header__summary-label">更新时间</span>
                      <span className="page-header__summary-value">2024-09-25 12:00:00</span>
                    </span>
                  </div>
                </div>

                {/* 右上角操作按钮组 */}
                <div className="page-header__actions">
                  <Button>关闭风险</Button>
                  <Button>重新检测</Button>
                  <Button type="primary">处理风险</Button>
                </div>
              </div>

              {/* ── 内容区：左右分栏 ── */}
              <div className="risk-detail-body">
                {/* 左侧主内容 */}
                <div className="risk-detail-main">
                  {/* ① 问题描述（Form2 分组分段） */}
                  <div className="form-section" id="problem-desc">
                    <h3 className="form-section__title">问题描述</h3>
                    <div className="risk-desc-content">
                      <ul className="risk-desc-list">
                        <li>
                          当前服务 Prod 环境部署模板的并发度设置为 50%，超过推荐阈值（30%），
                          可能导致发布期间大量实例同时重启，影响服务可用性和用户体验。
                        </li>
                        <li>
                          高并发度部署会导致瞬时流量集中到存活实例上，增加单实例负载压力，
                          极端情况下可能触发雪崩效应，建议将并发度调整至 20%~30% 范围内。
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* ② 配置信息（Detail2 描述列表，用分组展示） */}
                  <div className="form-section" id="config-info">
                    <h3 className="form-section__title">配置信息</h3>

                    {/* prod-a 配置 */}
                    <div className="risk-config-block">
                      <div className="risk-config-block__header">prod-a</div>
                      <div className="description-list">
                        <div className="description-list__item">
                          <span className="description-list__label">部署模板</span>
                          <span className="description-list__value">Prod-Standard</span>
                        </div>
                        <div className="description-list__item">
                          <span className="description-list__label">并发度</span>
                          <span className="description-list__value risk-text-danger">50%</span>
                        </div>
                        <div className="description-list__item">
                          <span className="description-list__label">实例总数</span>
                          <span className="description-list__value">120</span>
                        </div>
                        <div className="description-list__item">
                          <span className="description-list__label">健康检查</span>
                          <span className="description-list__value">HTTP / 30s</span>
                        </div>
                      </div>
                    </div>

                    {/* prod-b 配置 */}
                    <div className="risk-config-block">
                      <div className="risk-config-block__header">prod-b</div>
                      <div className="risk-config-table">
                        <table>
                          <thead>
                            <tr>
                              <th>批次</th>
                              <th>并发度</th>
                              <th>全局比例</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>批次 1</td>
                              <td className="risk-text-danger">50%</td>
                              <td>10%</td>
                            </tr>
                            <tr>
                              <td>批次 2</td>
                              <td className="risk-text-danger">50%</td>
                              <td>40%</td>
                            </tr>
                            <tr>
                              <td>批次 3</td>
                              <td className="risk-text-danger">50%</td>
                              <td>50%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* ③ 治理建议（Form2 分组分段） */}
                  <div className="form-section" id="suggestion">
                    <h3 className="form-section__title">治理建议</h3>
                    <div className="risk-desc-content">
                      <ul className="risk-desc-list">
                        <li>
                          建议将 prod-a 和 prod-b 的并发度从当前 50% 降低至 20%~30%，
                          减少同时重启的实例数量，确保发布期间有足够的存活实例承接流量。
                        </li>
                        <li>
                          对于 prod-b 的分批次部署策略，建议批次 1 使用较低并发度（10%~15%）
                          进行小流量验证，确认无异常后再逐步放大后续批次的并发度。
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 右侧风险处理日志（MTD Timeline） */}
                <div className="risk-detail-aside">
                  <div className="risk-log-card">
                    <h3 className="risk-log-card__title">风险处理日志</h3>
                    <div className="risk-log-card__body">
                      <Timeline>
                        {timelineLogs.map((log, idx) => (
                          <Timeline.Item
                            key={idx}
                            icon={
                              log.icon ? (
                                <Icon
                                  type={log.icon}
                                  style={{
                                    color:
                                      log.color === 'green'
                                        ? 'var(--color-green)'
                                        : log.color === 'red'
                                        ? 'var(--color-red)'
                                        : log.color === 'orange'
                                        ? 'var(--color-orange)'
                                        : 'var(--color-brand-primary)',
                                    fontSize: 14,
                                  }}
                                />
                              ) : undefined
                            }
                            title={
                              <span className="risk-log-item__text">{log.text}</span>
                            }
                            content={
                              <span className="risk-log-item__time">{log.time}</span>
                            }
                          />
                        ))}
                      </Timeline>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ===== 内联样式 ===== */}
      <style>{`
        /* ─── CSS Variables (美团黄 UI-B Token) ─── */
        :root {
          --color-brand-primary: #166FF7;
          --color-accent: #FFDD00;
          --color-primary-1: #468DFB; /* hover */
          --color-primary-2: #0E65E8; /* active */
          --color-primary-4: #F0F6FF; /* 浅色背景 */
          --color-red: #FF1F1F;
          --color-orange: #FF7700;
          --color-green: #00A854;
          --text-1: #111925;
          --text-2: rgba(17, 25, 37, 0.85);
          --text-3: rgba(17, 25, 37, 0.65);
          --text-4: rgba(17, 25, 37, 0.45);
          --text-5: rgba(17, 25, 37, 0.30);
          --bg-page: #F3F3F4;
          --bg-card: #FFFFFF;
          --bg-card-inner: #F8F8F8;
          --border: rgba(17, 25, 37, 0.15);
          --divider: rgba(17, 25, 37, 0.10);
          --bg-nav-dark: #303640;
          --primary: #166FF7;
          --radius-3: 6px;
          --radius-4: 4px;
          --gap-elem: 8px;
          --gap-module: 16px;
          --gap-section: 24px;
          --gap-page: 16px;
          --shadow-min: 0 2px 6px rgba(0,0,0,0.08);
          --top-nav-h: 48px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
          font-size: 14px;
          line-height: 22px;
          color: var(--text-1);
          background: var(--bg-page);
        }

        /* ─── 整体骨架 ─── */
        .risk-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          min-width: 1024px;
        }

        /* ─── 顶部黑底导航栏 ─── */
        .risk-top-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--top-nav-h);
          display: flex;
          align-items: center;
          padding: 0 16px;
          background: #1f2329;
          z-index: 100;
        }

        .risk-top-nav__left {
          display: flex;
          align-items: center;
          gap: var(--gap-elem);
          flex-shrink: 0;
        }

        .risk-top-nav__menu-icon {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
        }
        .risk-top-nav__menu-icon:hover {
          color: #fff;
        }

        .risk-top-nav__domain {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          white-space: nowrap;
        }

        .risk-top-nav__tabs {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
          margin-left: 32px;
        }

        .risk-top-nav__tab {
          position: relative;
          height: var(--top-nav-h);
          line-height: var(--top-nav-h);
          padding: 0 16px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.55);
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: color 0.15s;
        }
        .risk-top-nav__tab:hover {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
        }
        .risk-top-nav__tab.is-active {
          color: #fff;
          font-weight: 500;
        }
        .risk-top-nav__tab.is-active::after {
          content: '';
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 0;
          height: 2px;
          background: var(--color-accent);
          border-radius: 1px;
        }

        .risk-top-nav__right {
          display: flex;
          align-items: center;
          gap: var(--gap-module);
          flex-shrink: 0;
          margin-left: auto;
        }

        .risk-top-nav__service-select {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-4);
          color: rgba(255, 255, 255, 0.75);
          font-size: 13px;
          cursor: pointer;
        }
        .risk-top-nav__service-select:hover {
          background: rgba(255, 255, 255, 0.14);
        }
        .risk-top-nav__service-label {
          color: rgba(255, 255, 255, 0.45);
          margin-right: 2px;
        }
        .risk-top-nav__service-name {
          color: rgba(255, 255, 255, 0.85);
        }

        .risk-top-nav__search {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.55);
          cursor: pointer;
          border-radius: var(--radius-4);
        }
        .risk-top-nav__search:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        /* ─── Body（icon-nav + content） ─── */
        .risk-body {
          display: flex;
          flex: 1;
          padding-top: var(--top-nav-h);
          overflow: hidden;
        }

        /* ─── 左侧图标导航 ─── */
        .risk-icon-nav {
          position: fixed;
          top: var(--top-nav-h);
          left: 0;
          bottom: 0;
          width: 48px;
          background: #2b3038;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 8px;
          gap: 4px;
          z-index: 50;
        }

        .risk-icon-nav__item {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.45);
          cursor: pointer;
          border-radius: var(--radius-4);
          transition: all 0.15s;
        }
        .risk-icon-nav__item:hover {
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.08);
        }
        .risk-icon-nav__item.is-active {
          color: #fff;
          background: rgba(255, 255, 255, 0.12);
        }

        /* ─── 主内容区 ─── */
        .risk-content {
          margin-left: 48px;
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          background: var(--bg-page);
        }

        .risk-page-container {
          padding: var(--gap-page);
          min-height: 100%;
        }

        .risk-page-card {
          background: var(--bg-card);
          border-radius: 8px;
          padding: 20px 24px 24px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        /* ─── FD2 表头信息区 ─── */
        .page-header {
          position: relative;
          margin-bottom: var(--gap-section);
          padding-bottom: var(--gap-module);
          border-bottom: 1px solid var(--divider);
        }

        .page-header__title {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-1);
          line-height: 28px;
        }

        .page-header__title--with-back {
          display: flex;
          align-items: center;
          gap: var(--gap-elem);
        }

        .page-header__back-icon {
          font-size: 20px;
          color: var(--text-3);
          cursor: pointer;
          flex-shrink: 0;
        }
        .page-header__back-icon:hover {
          color: var(--color-brand-primary);
        }

        .page-header__status {
          margin-left: var(--gap-elem);
          vertical-align: middle;
        }

        .page-header__summary {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: var(--gap-elem);
        }

        .page-header__summary-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 32px;
        }

        .page-header__summary-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .page-header__summary-label {
          font-size: 14px;
          color: var(--text-4);
          line-height: 22px;
          flex-shrink: 0;
        }

        .page-header__summary-value {
          font-size: 14px;
          color: var(--text-2);
          line-height: 22px;
        }

        /* 操作按钮组 —— 绝对定位到右上角 */
        .page-header__actions {
          position: absolute;
          top: 0;
          right: 0;
          display: flex;
          align-items: center;
          gap: var(--gap-elem);
        }

        /* ─── 内容左右分栏 ─── */
        .risk-detail-body {
          display: flex;
          gap: var(--gap-section);
        }

        .risk-detail-main {
          flex: 1;
          min-width: 0;
        }

        .risk-detail-aside {
          width: 300px;
          flex-shrink: 0;
        }

        /* ─── Form2 分组标题（蓝色竖线） ─── */
        .form-section {
          margin-bottom: var(--gap-section);
        }
        .form-section:last-child {
          margin-bottom: 0;
        }

        .form-section__title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-1);
          line-height: 24px;
          margin: 0 0 var(--gap-module);
          display: flex;
          align-items: center;
          gap: var(--gap-elem);
        }
        .form-section__title::before {
          content: '';
          display: inline-block;
          width: 3px;
          height: 16px;
          background: var(--primary);
          flex-shrink: 0;
          border-radius: 1.5px;
        }

        /* ─── 问题描述 / 治理建议 ─── */
        .risk-desc-content {
          padding-left: 11px;
        }

        .risk-desc-list {
          list-style: disc;
          padding-left: 16px;
          color: var(--text-2);
        }
        .risk-desc-list li {
          margin-bottom: var(--gap-elem);
          line-height: 22px;
        }
        .risk-desc-list li:last-child {
          margin-bottom: 0;
        }

        /* ─── 配置信息区块 ─── */
        .risk-config-block {
          margin-bottom: var(--gap-module);
          border: 1px solid var(--border);
          border-radius: var(--radius-3);
          overflow: hidden;
        }
        .risk-config-block:last-child {
          margin-bottom: 0;
        }

        .risk-config-block__header {
          padding: 8px var(--gap-module);
          background: var(--bg-card-inner);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-1);
          border-bottom: 1px solid var(--border);
        }

        /* Detail2 描述列表（配置信息内嵌） */
        .description-list {
          padding: 4px var(--gap-module);
        }

        .description-list__item {
          display: flex;
          padding: 8px 16px 8px 0;
          font-size: 14px;
          line-height: 22px;
        }

        .description-list__label {
          color: var(--text-4);
          flex-shrink: 0;
          width: 96px;
        }

        .description-list__value {
          color: var(--text-2);
          flex: 1;
          word-break: break-all;
        }

        /* 配置表格 */
        .risk-config-table {
          padding: 0;
        }
        .risk-config-table table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .risk-config-table th {
          padding: 8px var(--gap-module);
          background: var(--bg-card-inner);
          font-weight: 500;
          color: var(--text-3);
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        .risk-config-table td {
          padding: 8px var(--gap-module);
          color: var(--text-2);
          border-bottom: 1px solid var(--divider);
        }
        .risk-config-table tr:last-child td {
          border-bottom: none;
        }

        /* 危险值高亮 */
        .risk-text-danger {
          color: var(--color-red) !important;
          font-weight: 500;
        }

        /* ─── 右侧风险处理日志 ─── */
        .risk-log-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-3);
          background: var(--bg-card);
        }

        .risk-log-card__title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-1);
          line-height: 24px;
          padding: var(--gap-module);
          border-bottom: 1px solid var(--divider);
        }

        .risk-log-card__body {
          padding: var(--gap-module);
        }

        .risk-log-item__text {
          font-size: 14px;
          color: var(--text-2);
          line-height: 22px;
        }

        .risk-log-item__time {
          font-size: 12px;
          color: var(--text-4);
          line-height: 20px;
        }

        /* Timeline 微调 */
        .risk-log-card .mtd-prime-timeline-item {
          padding-bottom: var(--gap-module);
        }
        .risk-log-card .mtd-prime-timeline-item:last-child {
          padding-bottom: 0;
        }
      `}</style>
    </div>
  );
}
