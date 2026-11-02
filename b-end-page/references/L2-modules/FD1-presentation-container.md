# FD1 · 承载容器（PresentationContainer）

> **一句话定位**：表单页/详情页对外用多大的外壳出现。L1 容器语义匹配：默认顺序落地页；表单页提到「左侧点选/按对象配置」时可切主从落地页；任一页面类型提到「抽屉」时切抽屉；表单页提到「弹窗」或命中极少字段的聚焦操作时可切弹窗。详情页不开放弹窗。

---

## 一、何时用

- 任何表单页/详情页装配的第一步：决定用哪种容器承载。
- 默认顺序落地页；表单页提到「左侧点选/按对象配置」时可切主从落地页；任一页面类型提到「抽屉」时切抽屉；表单页提到「弹窗」或命中极少字段的聚焦操作时可切弹窗。
- 详情页不开放弹窗。

## 二、布局（容器总览）

五种承载容器的整体布局总览：

```Plain
顺序落地页（默认）
┌─────────────────────────────────────────────┐
│ 灰底 var(--bg-page)                                 │
│  ┌───────────────────────────────────────┐  │
│  │ 白卡                                    │  │
│  │  页头（固定）                           │  │
│  │  滚动内容区（表单/分组/表格）           │  │
│  │  操作栏（固定底部）                     │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

步骤落地页（顺序落地页 + 步骤条）
┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐  │
│  │ 白卡                                    │  │
│  │  页头 → 步骤条 → 当前步内容 → 操作栏    │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

主从落地页
┌─────────────────────────────────────────────┐
│  ┌──────────┬────────────────────────────┐  │
│  │ 对象列表 │  配置表单                   │  │
│  │ (200px)  │  操作栏                     │  │
│  └──────────┴────────────────────────────┘  │
└─────────────────────────────────────────────┘

抽屉（Drawer）
                    ┌──────────────────┐
▓▓▓▓ 蒙层 ▓▓▓▓▓▓▓▓│  表单内容         │
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  操作栏           │
                    └──────────────────┘

弹窗（Dialog，仅表单页）
              ┌────────────────┐
▓▓ 蒙层 ▓▓▓▓│  少量字段       │
▓▓▓▓▓▓▓▓▓▓▓▓│  确定 / 取消    │
              └────────────────┘
```

| 容器 | 一句话定位 | 适用场景 |
| --- | --- | --- |
| **顺序落地页** | 用户从上到下浏览和填写，支持单列/双列/多列 | 字段多/多分组的长表单，一屏平铺，独立任务 |
| **步骤落地页** | 顺序落地页的分步变体：拆成 N 步、一次只填一步、带上一步/下一步导航 | 强线性、必须分步引导的流程（注册/认证/入驻/向导） |
| **主从落地页** | 左侧列表点选对象，右侧显示该对象的专属配置表单 | 按对象/门店/角色个性化配置 |
| **抽屉（Drawer）** | 从页面侧边滑出的面板 | 少量到中等字段，边看背景边填 |
| **弹窗（Dialog）** | 模态浮层，聚焦完成单一操作 | 表单页约 1–5 个字段，无分组、无分步；详情页不使用 |

> **顺序落地页 vs 步骤落地页的分界**：普通长表单一屏从上到下平铺填完 → 顺序落地页；流程强线性、必须一步步走完（带步骤条与上一步/下一步）→ 步骤落地页。两者共用同一套「灰底 + 白卡」视觉外壳。

---

## 三、顺序落地页（Sequential Page）— 默认

### 3.1 核心视觉

采用「灰底 + 白卡」结构：最外层视口铺浅灰底色衬托，表单内容统一收进一张白色卡片承载，卡片与视口边缘之间留出四周留白。**白卡默认水平铺满内容区**（`width: auto`，即撑满 `.page-container` 减去左右 padding 后的剩余宽度），不设 `max-width`。**白卡内所有表单内容左对齐**，不做水平居中。用户浏览顺序**从上至下**，内容可以单列、双列或混合列排列。

```Plain
┌────────────────────────────────────────────────────────────────┐
│ 应用内容区（浅灰底）                                          │ ← 外层视口背景 var(--bg-page)
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 白色内容卡（page-card）                                   │  │ ← 四周 16px 留白，白卡圆角 + 轻投影
│  │ ┌──────────────────────────────────────────────────────┐ │  │
│  │ │ 页头（PageHeader）                                   │ │  │ ← 固定不滚动：标题、说明、摘要
│  │ ├──────────────────────────────────────────────────────┤ │  │
│  │ │ Anchor 锚点导航（可选）                               │ │  │ ← 固定不滚动：跳转内容分组
│  │ ├──────────────────────────────────────────────────────┤ │  │
│  │ │                                                      │ │  │
│  │ │ 滚动内容区（scroll-content）                         │ │  │ ← 唯一纵向滚动区域：表单 / 分组 / 表格
│  │ │ ┌──────────────────────────────────────────────────┐ │ │  │
│  │ │ │ 基本信息 / 业务配置 / 关联数据 ...               │ │ │  │
│  │ │ └──────────────────────────────────────────────────┘ │ │  │
│  │ ├──────────────────────────────────────────────────────┤ │  │
│  │ │                              [取消] [提交]           │ │  │ ← 操作栏固定在白卡底部
│  │ └──────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

| 层级 | 取值 | 说明 |
| --- | --- | --- |
| 视口背景色（最外层） | `var(--bg-page)` | 浅灰底，衬托内容卡片 |
| 内容区卡片底色 | `#fff` | 表单整体承载的白色面板 |
| 卡片圆角 | `8px` | 四角统一圆角 |
| 卡片阴影 | `0 1px 2px rgba(0,0,0,0.04)` | 极轻投影，区分卡片与灰底层次，不用描边 |

**边距**：

| 边距 | 取值 | 说明 |
| --- | --- | --- |
| 页面外边距（卡片距视口四周） | `16px` | 白色内容卡片四周与视口边缘的统一留白 |
| 卡片内边距 | `20px 24px 0` | 上 `20px`、左右 `24px`、底部 `0`（由 ActionBar 自带 padding） |

> 「视口灰底 + 四周 16px 留白 + 白色卡片」三者配套使用。白卡底部 padding 为 0，操作栏通过自身 padding 和 `margin: 0 -24px` 撑满底部。

### 3.2 响应式适配

| 属性 | 宽屏（≥ 768px） | 窄屏（< 768px） | 是否变化 |
| --- | --- | --- | --- |
| 页面外边距 | `16px` | `12px` | ✅ 收窄 |
| 卡片内边距 | `20px 24px 0` | `20px 24px 0` | ❌ 不变 |

> **核心原则：白卡内边距在任何屏幕宽度下始终保持不变。** 响应式只调整页面外边距（卡片与视口之间的灰底留白），卡片内部间距不动，确保表单内容的阅读体验在所有断点下一致。

**DOM 结构参考（⚠️ 硬约束，必须严格一致）**：

顺序落地页的 DOM 层级必须是「外层灰底容器 → 页面外边距容器 → 一整张白卡（flex column）→ 固定头部 + 可滚动内容区 + 操作栏」。**所有分组（F2）、表头（G2）、锚点（Anchor）等模块都在同一张白卡内部**，分组本身不要独立设置白色背景、圆角或投影。操作栏（F1 ActionBar）在白卡内部底部，通过 flex 布局固定不滚动。

```
.app-content（灰底 var(--bg-page)，overflow: hidden）
  └─ .page-container（padding: 16px，height: 100%，flex column）
       └─ .page-card（白卡：flex: 1，flex column，overflow: hidden，padding 20px 24px 0）
            ├─ .page-header（G2 表头信息区 — 固定不滚动）
            ├─ .page-header__anchor（Anchor 锚点导航 — 固定不滚动）
            ├─ .scroll-content（flex: 1，overflow-y: auto — 可滚动内容区）
            │    ├─ .form-section#group-1（F2 分组，无独立背景/圆角/投影）
            │    ├─ .form-section#group-2
            │    └─ ...
            └─ .action-bar（F1 操作栏，flex-shrink: 0，固定底部）
```

React 技术栈示例：

```jsx
<main className="app-content">
  <div className="page-container">
    <div className="page-card">
      {/* G2 PageHeader — 固定不滚动 */}
      <div className="page-header">...</div>
      {/* Anchor（可选）— 固定不滚动 */}
      <div className="page-header__anchor">...</div>
      {/* 可滚动内容区 */}
      <div className="scroll-content">
        <Form>
          <div className="form-section" id="group-1">...</div>
          <div className="form-section" id="group-2">...</div>
        </Form>
      </div>
      {/* F1 ActionBar — 白卡内固定底部 */}
      <div className="action-bar">
        <Button>取消</Button>
        <Button type="primary">提交</Button>
      </div>
    </div>
  </div>
</main>
```

Vue3 技术栈示例：

```html
<main class="app-content">
  <div class="page-container">
    <div class="page-card">
      <!-- G2 PageHeader — 固定不滚动 -->
      <div class="page-header">...</div>
      <!-- Anchor（可选）— 固定不滚动 -->
      <div class="page-header__anchor">...</div>
      <!-- 可滚动内容区 -->
      <div class="scroll-content">
        <form>
          <div class="form-section" id="group-1">...</div>
          <div class="form-section" id="group-2">...</div>
        </form>
      </div>
      <!-- F1 ActionBar — 白卡内固定底部 -->
      <div class="action-bar">
        <button>取消</button>
        <button class="primary">提交</button>
      </div>
    </div>
  </div>
</main>
```

**对应 CSS（通用，不区分技术栈）**：

布局联动 CSS：

```css
/* 1. 外层内容区：禁止滚动，高度固定 */
.app-content { overflow: hidden; height: calc(100vh - var(--top-nav-h)); }
/* 2. 页面容器：撑满高度，flex 列布局 */
.page-container { padding: 16px; height: 100%; display: flex; flex-direction: column; }
/* 3. 白卡：flex 列布局，内容溢出隐藏 */
.page-card { background: var(--bg-card); border-radius: 8px; padding: 20px 24px 0; flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
/* 4. 内容滚动区：flex 子项撑满剩余空间，内部滚动 */
.scroll-content, .step-content { flex: 1; min-height: 0; overflow-y: auto; }
/* 5. 操作栏固定底部由 .action-bar 的 flex-shrink: 0 保证 */

/* 分组在白卡内部，不需要独立背景/圆角/投影 */
.form-section { padding: 8px 0; }
```

> ⚠️ 常见错误：① 不要用 `position: fixed/sticky` 定位操作栏，flex 布局方案让操作栏始终在白卡内部，不需要 z-index 和侧导宽度联动；② 不要对外层容器设 `overflow-y: auto`，只有 `.scroll-content` 允许滚动；③ 分组不要做成独立白卡，所有分组均在同一张 `.page-card` 内部。

---

## 三·附、步骤落地页（Step Page）— 顺序落地页的分步变体

### 3附.1 定位与与顺序落地页的关系

步骤落地页是顺序落地页的**分步变体**，不是全新的视觉体系：外壳完全沿用顺序落地页的「灰底 var(--bg-page) + 白卡」结构（同 §3.1）。唯一区别在于：白卡内表头下方**常驻一条步骤导航栏**，内容区一次只展示**当前步**的表单，底部操作栏为「上一步 / 下一步 / 提交」而非单一提交。

与顺序落地页的分界：普通长表单一屏从上到下平铺填完 → 顺序落地页；流程强线性、字段量大到需拆成多步、逐步引导（注册/认证/入驻/向导）→ 步骤落地页。

**触发词**：分步、分几步、向导、流程、注册、认证、入驻。命中这些强线性流程表述时，在 L1 直接选本容器。若 prompt 描述的是弹窗或抽屉但命中分步流程，自动升级为步骤落地页。

> 步骤条本体（变体、状态、样式参数、MTD 属性）由 `Form4-step-bar.md` 定义，本节只负责容器侧的骨架与联动。

### 3附.2 DOM 结构

与顺序落地页一致（见 §3.1），仅在 `.page-header` 与内容区之间插入一个固定的步骤条子项。内容区在本变体中命名为 `.step-content`（与顺序落地页的 `.scroll-content` 等价，共用同一套 flex 滚动规则）：

```
.page-card（白卡：flex column，overflow: hidden）
     ├─ .page-header（G2 表头 — flex-shrink: 0，固定不滚动）
     ├─ <Steps>（F4 步骤条 — flex-shrink: 0，固定不滚动）
     ├─ .step-content（当前步表单 — flex: 1，overflow-y: auto）
     └─ .action-bar（F1 操作栏 — flex-shrink: 0）
```

```
┌──────────────────────────────────────────────────────┐
│  G2 PageHeader（标题 + 描述）                          │
│──────────────────────────────────────────────────────│
│     ① 主体信息 ———— ② 资质证照 ———— ③ 经营信息       │  ← F4 步骤条
│──────────────────────────────────────────────────────│
│  .step-content（当前步表单，可滚动）                    │
│    ▌分组标题                                          │
│       字段A    ………………………                           │
│──────────────────────────────────────────────────────│
│                          [上一步]  [下一步]            │  ← F1 操作栏
└──────────────────────────────────────────────────────┘
```

> ⚠️ **不要把步骤落地页当成"多个独立页面"**：它仍是**一个页面、一张白卡**，只是内容区按步切换，页面本身不跳转。

### 3附.3 容器职责

- **维护 `current` state**：步骤条不控制导航，当前步索引由容器持有，通过操作栏按钮推进。
- **每步一个独立 `<Form>`，条件渲染**：用 `{current === N && <StepN />}`。不要用 `display: none` 隐藏——会导致多个 Form 并存、校验冲突。
- **切步前校验**：点「下一步」先校验当前步必填项，不通过则不推进，并对当前步标 `status="error"`（见 F4 §四）。
- **操作栏按钮随步变化**：首步 [下一步]；中间步 [上一步][下一步]；末步 [上一步][提交]。规则见 `Form1-action-bar.md` §三。
- **每步内容可叠加任意内容区模块**：分组分段（F2）、基础布局（F3）、文件上传、可编辑表格等。

### 3附.4 CSS

布局联动 CSS 与顺序落地页完全一致（见 §3.1），`.step-content` 已包含在其中。步骤条自身样式见 `Form4-step-bar.md` §六。

### 3附.5 代码骨架

```tsx
const STEPS = ['主体信息', '资质证照', '经营信息'];

export default function StepForm() {
  const [current, setCurrent] = useState(0);

  return (
    <main className="app-content">
      <div className="page-container">
        <div className="page-card">
          <div className="page-header">
            <h1 className="page-header__title">商家入驻</h1>
            <p className="page-header__desc">请按步骤填写入驻信息</p>
          </div>

          {/* F4 步骤条 — 固定不滚动 */}
          <Steps active={current} labelPlacement="horizontal" className="merchant-steps">
            {STEPS.map((t, i) => <Steps.Step key={i} title={t} />)}
          </Steps>

          {/* 当前步内容 — 可滚动；每步一个独立 Form */}
          <div className="step-content">
            {current === 0 && <Step0 />}
            {current === 1 && <Step1 />}
            {current === 2 && <Step2 />}
          </div>

          {/* F1 操作栏 */}
          <div className="action-bar">
            {current > 0 && (
              <Button onClick={() => setCurrent(current - 1)}>上一步</Button>
            )}
            {current < STEPS.length - 1 && (
              <Button type="primary" onClick={() => setCurrent(current + 1)}>下一步</Button>
            )}
            {current === STEPS.length - 1 && (
              <Button type="primary" onClick={handleSubmit}>提交申请</Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
```

Vue3 结构同理：`<mtd-steps :active="current" label-placement="horizontal">`，内容区用 `v-if="current === N"` 条件渲染。

---

## 四、主从落地页（Master-Detail Page）

### 4.1 核心视觉

采用「灰底 + 统一白卡（内含左右分区）」结构：整个内容区是**一张白卡**，内部通过 `border-right` 分割为左侧对象列表（Master）和右侧配置表单（Detail）。用户通过左侧点选切换对象，右侧表单内容随之变化。操作栏（ActionBar）位于右侧内容区底部，与内容区同属一个 div。

与顺序落地页的区别：顺序落地页是一整张白卡从上到下排列；主从落地页是**一张白卡内左右分区**，左栏固定为对象选择列表（使用 MTD `Menu` 组件），右栏是对应的表单配置区 + 底部操作栏。

| 层级 | 取值 | 说明 |
| --- | --- | --- |
| 视口背景色 | `var(--bg-page)` | 浅灰底，与顺序落地页一致 |
| 白卡底色 | `#fff` | 整体一张白卡 |
| 白卡圆角 | `8px` | 四角统一圆角 |
| 白卡阴影 | `0 1px 2px rgba(0,0,0,0.04)` | 极轻投影 |
| 左右分割线 | `1px solid #f0f0f0` | 左侧面板 `border-right` |

**布局**：

| 项目 | 取值 | 说明 |
| --- | --- | --- |
| 左侧列表宽度 | `200px`（可配：160px–280px） | 固定宽度，放对象列表 |
| 左侧内边距 | `8px` | 四周统一 8px |
| 右侧内容区内边距 | `20px 24px` | 与顺序落地页白卡一致 |
| 页面外边距 | `16px` | 与顺序落地页一致 |
| 白卡最小高度 | `calc(100vh - var(--top-nav-h) - 32px)` | 撑满可用视口 |

**DOM 结构参考（⚠️ 硬约束）**：

主从落地页的 DOM 层级必须是「灰底容器 → 页面外边距容器 → 一整张白卡（flex 横排）→ 左侧面板 + 右侧面板（flex column：内容区 + 操作栏）」。左侧二级侧导使用 MTD `Menu` 组件（`mode="inline"`），不使用手写 `<ul>/<li>`。操作栏在右侧面板内部贴底，非 fixed 定位。

```
.app-content（灰底 var(--bg-page)）
  └─ .page-container（padding: 16px）
       └─ .content-card（白卡：flex 横排，background #fff / border-radius 8px / box-shadow）
            ├─ .master-panel（左侧列表区：固定宽度 200px，border-right 分割，padding 8px）
            │    └─ Menu（MTD Menu mode="inline"，选中态高亮）
            └─ .detail-panel（右侧：flex: 1，display: flex / flex-direction: column）
                 ├─ .detail-panel__content（flex: 1，padding 20px 24px，overflow-y: auto）
                 │    ├─ .page-header（当前对象标题）
                 │    └─ .form-section（配置表单）
                 └─ .action-bar（操作栏，border-top 分割，padding 12px 24px，按钮右对齐）
```

React 技术栈示例：

```jsx
<main className="app-content">
  <div className="page-container">
    <div className="content-card">
      {/* 左侧：对象列表（MTD Menu） */}
      <aside className="master-panel">
        <Menu
          mode="inline"
          className="master-panel__menu"
          selectedKeys={[activeKey]}
          onSelectChange={(key) => setActiveKey(key)}
        >
          <Menu.Item key="item1">配置项一</Menu.Item>
          <Menu.Item key="item2">配置项二</Menu.Item>
          <Menu.Item key="item3">配置项三</Menu.Item>
        </Menu>
      </aside>
      {/* 右侧：内容 + 操作栏 */}
      <div className="detail-panel">
        <div className="detail-panel__content">
          <div className="page-header">
            <h1 className="page-header__title">配置项一</h1>
          </div>
          <div className="form-section">
            <Form>...</Form>
          </div>
        </div>
        <footer className="action-bar">
          <div className="action-bar__inner">
            <Button type="primary">保存</Button>
            <Button>重置</Button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</main>
```

**对应 CSS**：

```css
/* 统一白卡容器 */
.content-card {
  background: var(--bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow-min);
  display: flex;
  min-height: calc(100vh - var(--top-nav-h) - 32px);
}

/* 左侧列表面板 */
.master-panel {
  width: 200px;
  flex-shrink: 0;
  padding: 8px;
  border-right: 1px solid var(--divider);
  overflow-y: auto;
  border-radius: 8px 0 0 8px;
}

/* 左侧 MTD Menu 去右边框 */
.master-panel__menu {
  border-right: none !important;
}

/* 右侧面板：flex column（内容撑开 + 操作栏贴底） */
.detail-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.detail-panel__content {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
}

/* 操作栏：白卡内底部，按钮右对齐 */
.action-bar {
  border-top: 1px solid var(--divider);
  padding: 12px 24px;
  flex-shrink: 0;
}

.action-bar__inner {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* 窄屏：左右转为上下堆叠 */
@media (max-width: 540px) {
  .content-card {
    flex-direction: column;
  }
  .master-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--divider);
    border-radius: 8px 8px 0 0;
    max-height: 200px;
  }
}
```

> ⚠️ **与旧规范的区别**：旧版主从落地页是「左右两张独立白卡 + 16px gap + 操作栏 fixed 吸底」。新版改为**一张统一白卡**，左右通过 border 分割，操作栏在右侧面板内部贴底（非 fixed），视觉更整体、层次更清晰。

### 4.2 触发词

当 prompt 中出现以下表述时，选择主从落地页而非顺序落地页：

- 「按对象配置」「按门店设置」「按角色配置」
- 「左侧选择 / 左侧列表」「选中后右侧显示」
- 「个性化配置」「差异化配置」「分别给不同 XX 配置」
- 「主从」「Master-Detail」

### 4.3 与顺序落地页的判断口诀

> 看到「左边点选，右边配置」→ **主从落地页**
> 看到「从上到下填表/分组」→ **顺序落地页**

---

## 五、抽屉（Drawer）

### 5.1 核心视觉

抽屉是从页面右侧滑出的浮层面板，通过半透明蒙层隔离背景内容，让用户在不离开当前页面的情况下完成表单填写。抽屉打开时，蒙层必须覆盖页面全部内容（包括顶导和侧导），用户只能与抽屉内容交互。

| 层级 | 取值 | 说明 |
| --- | --- | --- |
| 蒙层背景色 | `rgba(17, 25, 37, 0.65)` | 65% 不透明深色遮罩 |
| 蒙层层级 | MTD Drawer 内置（z-index: 900） | 必须高于顶导和侧导的 z-index |
| 面板底色 | `#fff` | 与白卡一致 |
| 滑出方向 | 从右侧滑入（`placement="right"`，默认） | 不建议从左/上/下滑出 |
| 关闭按钮 | Drawer 自带右上角 × 按钮 | 无需自定义 |

### 5.2 宽度档位

抽屉宽度通过 MTD Drawer 组件的 `width` prop 控制。Form 宽度与 Drawer 宽度拉通（Form 撑满 Drawer 内容区），不再单独限制 Form max-width。

| 档位 | Drawer `width` | Form 宽度 | labelWidth | 适用场景 |
| --- | --- | --- | --- | --- |
| 标准（默认） | `640px` | 拉通 640px | `120px` | 单列布局，大多数抽屉表单 |
| 宽型 | `800px` | 拉通 800px | `120px` | 双列/三列布局，或包含可编辑表格、文件上传、公式编辑器等重型组件 |

**决策树**：

```
默认 → 标准档（Drawer 640px + Form 拉通 + labelWidth 120px）

升级条件（满足任一即升级）：
  ① 需要双列/三列布局     → 升宽型档（Drawer 800px + Form 拉通 + labelWidth 120px）
  ② 包含重型组件          → 升宽型档
     （可编辑表格 / 文件上传 / 公式编辑器 / 富文本等）
```

> **判断原则**：宽度由布局模式和内容复杂度决定，不由字段数量决定。大多数抽屉表单用标准档（640px）即可。

### 5.3 标题区

抽屉标题通过 Drawer 组件的 `title` prop 设置，由组件内部渲染为固定在面板顶部的标题栏。标题栏下方可添加辅助描述文案（`.drawer-desc`），用于补充说明表单用途或填写提示。

`.drawer-desc` 样式规则：`font-size: 14px; color: #646a73; line-height: 22px; margin-bottom: 16px;`。

### 5.4 内边距与布局

抽屉内容区的内边距由 Drawer 组件内部控制（通常为 `20px 24px`）。表单宽度与 Drawer 拉通（Form 撑满内容区），不设独立 max-width。行间距比落地页更紧凑：

| 项目 | 取值 | 说明 |
| --- | --- | --- |
| 内容区内边距 | Drawer 组件内置 | 由 MTD 组件控制 |
| Form 宽度 | 拉通（撑满 Drawer 内容区） | 不设 max-width，见 §5.2 宽度档位 |
| 标签位置 | `labelPosition="right"` | 与落地页一致 |
| 标签宽度 | `labelWidth="120px"` | 与落地页一致 |
| 行间距 | `margin-bottom: 12px` | 比落地页默认值更紧凑 |
| 控件宽度 | `width: 100%` | 撑满所在列（⚠️ 硬约束） |

### 5.5 操作栏

抽屉的操作按钮通过 Drawer 组件的 `footer` prop（React）或 `footer` slot（Vue）插入，位于面板底部固定不滚动。

| 项目 | 取值 | 说明 |
| --- | --- | --- |
| 按钮对齐 | `justify-content: flex-end` | 按钮右对齐 |
| 按钮间距 | `gap: 12px` | 与 F1 ActionBar 一致 |
| 主操作 | 最多 1 个 `type="primary"` | 如「提交」「保存」 |
| 次操作 | 默认按钮 | 如「取消」 |
| 按钮顺序 | 左次右主（先「取消」后「提交」） | 主操作按钮靠最右 |

### 5.6 层级约束（⚠️ 硬约束）

抽屉蒙层（z-index: 900）必须覆盖页面所有内容，包括顶导航栏和侧导航栏。因此：

- **顶导 z-index 必须 < 900**（建议 100）
- **侧导 z-index 必须 < 900**（建议 50）
- 不要将顶导 z-index 设为 1000+ 导致蒙层无法遮盖

`maskClosable={false}` 为推荐默认值，防止用户误点蒙层丢失表单数据。

### 5.7 DOM 结构参考

React 技术栈示例：

```jsx
<Drawer
  visible={visible}
  title="表单标题"
  width={640}
  maskClosable={false}
  onClose={handleClose}
  footer={
    <div className="drawer-action-bar">
      <Button onClick={handleClose}>取消</Button>
      <Button type="primary" onClick={handleSubmit}>提交</Button>
    </div>
  }
>
  {/* G2 · 辅助描述 */}
  <p className="drawer-desc">
    请填写表单信息，带 * 为必填项。
  </p>

  <Form
    ref={formRef}
    useContext={true}
    labelWidth="100px"
    labelPosition="right"
    className="your-form"
  >
    {/* F2 · 分组 */}
    <div className="form-section">
      <h3 className="form-section__title">分组标题</h3>
      <Form.Item formItemKey="field1" label="字段" required>
        <Input placeholder="请输入" toFormItem />
      </Form.Item>
    </div>
  </Form>
</Drawer>
```

Vue3 技术栈示例：

```html
<mtd-drawer
  :visible.sync="visible"
  title="表单标题"
  :width="640"
  :mask-closable="false"
  @close="handleClose"
>
  <!-- G2 · 辅助描述 -->
  <p class="drawer-desc">
    请填写表单信息，带 * 为必填项。
  </p>

  <mtd-form
    ref="formRef"
    :model="formData"
    label-width="100px"
    label-position="right"
    class="your-form"
  >
    <!-- F2 · 分组 -->
    <div class="form-section">
      <h3 class="form-section__title">分组标题</h3>
      <mtd-form-item prop="field1" label="字段" required>
        <mtd-input v-model="formData.field1" placeholder="请输入" />
      </mtd-form-item>
    </div>
  </mtd-form>

  <!-- 操作栏 -->
  <template #footer>
    <div class="drawer-action-bar">
      <mtd-button @click="handleClose">取消</mtd-button>
      <mtd-button type="primary" @click="handleSubmit">提交</mtd-button>
    </div>
  </template>
</mtd-drawer>
```

**对应 CSS（通用）**：

```css
/* 抽屉辅助描述 */
.drawer-desc { font-size: 14px; color: var(--text-3); line-height: 22px; margin-bottom: 16px; }

/* F3 · Form 宽度与 Drawer 拉通，不设 max-width */
.your-form {
  width: 100%;
}

/* React: Form 内部 flex-wrap，分组 div 撑满整行 */
.your-form > div {
  width: 100%;
}

/* 控件撑满所在列（⚠️ 硬约束） */
.your-form .mtd-prime-select,
.your-form .mtd-prime-picker,
.your-form .mtd-prime-date-picker,
.your-form .mtd-prime-input-number,
.your-form .mtd-prime-range-picker,
.your-form .mtd-prime-cascader {
  width: 100%;
}

/* 紧凑模式行间距 */
.your-form .mtd-prime-form-item {
  margin-bottom: 12px;
}

/* F1 · 抽屉操作栏 */
.drawer-action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

### 5.8 触发词

当 prompt 中出现以下表述时，选择抽屉而非落地页：

- 「抽屉」「侧边弹出」「侧滑」「Drawer」
- 「边看边填」「不离开当前页」「辅助录入」
- 中等字段量（5–20 个），需要参照背景页内容填写

### 5.9 与其他容器的判断口诀

> 看到「少量到中等字段 + 边看背景边填」→ **抽屉**
> 看到「从上到下填表/分组」→ **顺序落地页**
> 表单页看到「极少字段 + 聚焦单一操作」→ **弹窗**

---

## 六、弹窗（Dialog / Modal）

- **适用范围**：仅表单页使用；约 1–5 个字段，无分组、无分步，完成后立即返回原页面。
- **允许模块**：基础布局、操作栏、文件上传、精简公式编辑器。
- **禁止模块**：分组分段、步骤条、可编辑表格、主从结构及其他重型内容。
- **自动升级**：字段超过 5 个、出现分组/分步/可编辑表格时，升级为抽屉或顺序落地页。
- **标题与操作**：使用 Modal 自带标题栏；表单类弹窗必须提供取消和确定/提交操作。
- **尺寸与 API**：不得凭记忆固化宽度、关闭方式等组件 API；生成前通过 `mtd-rag.js` 查询当前框架的 Modal 规范。

## 七、约束

- 落地页按顺序、步骤、主从三种布局选择；抽屉按字段量选择标准或宽型尺寸。
- 抽屉只承载少量到中等内容；多分组、分步或主从结构应升级为落地页。
- 弹窗仅承载极少字段的聚焦表单；详情页不使用弹窗。

---

## 八、L3 组件映射与 MTD 查询

基于 MTD 组件库（`@ss/mtd-react3` / `@ss/mtd-vue3`）落地时的组件映射与要点。

### 8.1 L3 组件映射

| 功能 | React (`@ss/mtd-react3`) | Vue3 (`@ss/mtd-vue3`) |
|------|--------------------------|----------------------|
| 抽屉容器 | `<Drawer>` | `<mtd-drawer>` |
| 弹窗容器 | `<Modal>` | `<mtd-modal>` |
| 按钮 | `<Button>` | `<mtd-button>` |
| 表单 | `<Form>` | `<mtd-form>` |
| 二级侧导菜单 | `<Menu>` + `<Menu.Item>` | `<mtd-menu>` + `<mtd-menu-item>` |
| 步骤条（步骤落地页） | `<Steps>` + `<Steps.Step>` | `<mtd-steps>` + `<mtd-steps-item>` |

### 8.2 MTD 查询命令

```bash
# React
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Drawer,Modal,Button,Form,Menu,Steps --target=mtd-react --quiet

# Vue3
node "<skill>/mtd3/scripts/mtd-rag.js" query_components_direct \
  --components=Drawer,Modal,Button,Form,Menu,Steps --target=mtd-vue --quiet
```

---

## 九、踩坑笔记

- **顺序落地页只有一张白卡**：分组（`.form-section`）在白卡内部，不要给每个分组设独立白色背景/圆角/投影。
- **操作栏不用 `position: fixed/sticky`**：统一使用 flex column 布局固定底部——白卡 `display: flex; flex-direction: column; overflow: hidden`，内容区 `flex: 1; overflow-y: auto`，操作栏 `flex-shrink: 0`。
- **外层 `.app-content` 用 `overflow: hidden`**：禁止整页滚动，滚动只发生在白卡内部 `.scroll-content` 中。
- **抽屉宽度档位**：标准 640px（单列），宽型 800px（双列/三列或含重型组件）。
- **抽屉层级**：蒙层 z-index 900，顶导和侧导的 z-index 必须 < 900。
- **主从落地页左侧 Menu**：必须加 `border-right: none !important` 覆盖 MTD Menu 的默认右边框。
- **React Form 是 flex-wrap**：Form 内部的 `<div>` 包裹分组时需 `width: 100%`，否则分组宽度收缩。
- **主从落地页可与 G-topnav + G-sidebar 嵌套**：外层是全局导航骨架（G-sidebar，fixed 定位，跨页面复用），内容区 `app-content` 内部再放主从落地页白卡（`content-card`）。master-panel 是页面内部的配置项导航，与 G-sidebar 是两个独立导航，各管各的选中状态，不是替代关系。常见于「配置中心」「系统设置」等场景——用户描述「两级导航」「两层导航」时按此嵌套处理。
