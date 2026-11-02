import { useState, useEffect, useMemo } from 'react';
import TopNav from '../components/TopNav';
import styles from './TokenSheet.module.css';

/* ────────────────────────────────────────────
   Token 量表展示页
   用户要求：「做完后，在代码项目里，首页顶导加一个按钮，叫组件和Token，
   里面组件的部分先不管，把 token 量表给我展示出来」
   ──────────────────────────────────────────── */

// ---------- 静态 token 定义 ----------
// 直接从 tokens.css 的变量名+注释整理而来，运行时通过 getComputedStyle 读取真实值。

interface TokenItem {
  name: string;       // CSS 变量名, 如 --blue-5
  label?: string;     // 可读标注
}

interface TokenGroup {
  title: string;
  desc?: string;
  tokens: TokenItem[];
  type: 'color' | 'value';  // color 走色板卡片，value 走表格
}

const tokenGroups: TokenGroup[] = [
  // ═══════════════ 原子层（与 _base_color.scss 基础色板逐项对齐） ═══════════════
  {
    title: '原子层 · Blue 蓝色 B1~B6',
    desc: '对齐源文件 $Blue-1~6，私有变量，组件不直接引用',
    type: 'color',
    tokens: [
      { name: '--blue-1', label: 'B1 #F0F6FF 背景色' },
      { name: '--blue-2', label: 'B2 #BFD8FE 备用' },
      { name: '--blue-3', label: 'B3 #8FBCFF 备用' },
      { name: '--blue-4', label: 'B4 #468DFB 备用' },
      { name: '--blue-5', label: 'B5 #166FF7 标准色' },
      { name: '--blue-6', label: 'B6 #0E65E8 备用' },
    ],
  },
  {
    title: '原子层 · Yellow 黄色 Y1~Y7',
    desc: '对齐源文件 $Yellow-1~7',
    type: 'color',
    tokens: [
      { name: '--yellow-1', label: 'Y1 #FFFADB 背景色' },
      { name: '--yellow-2', label: 'Y2 #FFF6B8 备用' },
      { name: '--yellow-3', label: 'Y3 #FFEF8A 备用' },
      { name: '--yellow-4', label: 'Y4 #FFE852 备用' },
      { name: '--yellow-5', label: 'Y5 #FFDD00 主黄色' },
      { name: '--yellow-6', label: 'Y6 #F5C800 备用' },
      { name: '--yellow-7', label: 'Y7 #7A3100 深棕色' },
    ],
  },
  {
    title: '原子层 · Green 绿色 G1~G6',
    desc: '对齐源文件 $Green-1~6',
    type: 'color',
    tokens: [
      { name: '--green-1', label: 'G1 #E6FFF0 背景色' },
      { name: '--green-2', label: 'G2 #B2F9D3 备用' },
      { name: '--green-3', label: 'G3 #7FEBB2 备用' },
      { name: '--green-4', label: 'G4 #08C969 备用' },
      { name: '--green-5', label: 'G5 #00A854 标准色' },
      { name: '--green-6', label: 'G6 #00994D 备用' },
    ],
  },
  {
    title: '原子层 · Red 红色 R1~R6',
    desc: '对齐源文件 $Red-1~6',
    type: 'color',
    tokens: [
      { name: '--red-1', label: 'R1 #FFF2F2 背景色' },
      { name: '--red-2', label: 'R2 #FFC9C9 备用' },
      { name: '--red-3', label: 'R3 #FFA0A0 备用' },
      { name: '--red-4', label: 'R4 #FF4040 备用' },
      { name: '--red-5', label: 'R5 #FF1F1F 标准色' },
      { name: '--red-6', label: 'R6 #F01D1D 备用' },
    ],
  },
  {
    title: '原子层 · Orange 橙色 O1~O6',
    desc: '对齐源文件 $Orange-1~6',
    type: 'color',
    tokens: [
      { name: '--orange-1', label: 'O1 #FFF6F0 背景色' },
      { name: '--orange-2', label: 'O2 #FFD9BF 备用' },
      { name: '--orange-3', label: 'O3 #FFBE8F 备用' },
      { name: '--orange-4', label: 'O4 #FF8827 备用' },
      { name: '--orange-5', label: 'O5 #FF7700 标准色' },
      { name: '--orange-6', label: 'O6 #F56200 备用' },
    ],
  },
  {
    title: '原子层 · Grey 中性灰 Grey1~Grey10',
    desc: '对齐源文件 $Grey-1~10（透明灰）与 $Grey-7_2~10_2（实体灰）',
    type: 'color',
    tokens: [
      { name: '--grey-1', label: 'Grey1 #111925 100% 主要' },
      { name: '--grey-2', label: 'Grey2 85% 次主要' },
      { name: '--grey-3', label: 'Grey3 65% 辅助' },
      { name: '--grey-4', label: 'Grey4 45% 次辅助' },
      { name: '--grey-5', label: 'Grey5 30% 输入提示' },
      { name: '--grey-6', label: 'Grey6 20% 禁用' },
      { name: '--grey-7', label: 'Grey7 15% 描边色' },
      { name: '--grey-8', label: 'Grey8 10% 分割线' },
      { name: '--grey-9', label: 'Grey9 5% 页面背景' },
      { name: '--grey-10', label: 'Grey10 3% 卡片内背景' },
      { name: '--grey-7_2', label: 'Grey7 实体 #DCDDDF 描边' },
      { name: '--grey-8_2', label: 'Grey8 实体 #E7E8E9 分割线' },
      { name: '--grey-9_2', label: 'Grey9 实体 #F3F3F4 页面背景' },
      { name: '--grey-10_2', label: 'Grey10 实体 #F8F8F8 卡片内背景' },
      { name: '--white', label: '白色 #FFFFFF' },
      { name: '--black', label: '黑色 #000000' },
      { name: '--black-transparent', label: '遮罩 rgba(0,0,0,.5)' },
      { name: '--blue-grey', label: '蓝灰 #303640 深色导航' },
    ],
  },
  {
    title: '原子层 · 扩展功能色',
    desc: '不属于源文件标准色板，展示应用历史扩展',
    type: 'color',
    tokens: [
      { name: '--teal-5', label: '蓝绿色 #00A3A3' },
      { name: '--purple-5', label: '紫色 #882EFF' },
      { name: '--pink-5', label: '粉色 #EB2F93' },
      { name: '--brown-5', label: '棕色 #9E7549' },
    ],
  },

  // ═══════════════ 规范语义层（与 _base_color.scss 语义变量完全对齐） ═══════════════
  {
    title: '语义层 · Primary 主色',
    desc: '对齐源文件 $color-primary / $color-primary-1~5，使用场景名称直接取自源文件 @name 注释。取阶规律两套主题完全对称：基准/hover 浅一级/active 深一级/disabled/背景/备用。随主题切换：蓝色→Blue 系，黄色→Yellow 系',
    type: 'color',
    tokens: [
      { name: '--color-primary', label: '@name 标准色（Blue-5 / Yellow-5）' },
      { name: '--color-primary-1', label: '@name 主色 hover（Blue-4 / Yellow-4）' },
      { name: '--color-primary-2', label: '@name 主色激活（Blue-6 / Yellow-6）' },
      { name: '--color-primary-3', label: '@name 主色禁用（Blue-2 / Yellow-2）' },
      { name: '--color-primary-4', label: '@name 背景色（Blue-1 / Yellow-1）' },
      { name: '--color-primary-5', label: '@name 备用 1（Blue-3 / Yellow-3）' },
    ],
  },
  {
    title: '语义层 · Text 文字',
    desc: '对齐源文件 $color-text-1~6',
    type: 'color',
    tokens: [
      { name: '--color-text-1', label: 'Grey5 30% 禁用状态文字' },
      { name: '--color-text-2', label: 'Grey4 45% 次要信息文字' },
      { name: '--color-text-3', label: 'Grey3 65% 辅助文字' },
      { name: '--color-text-4', label: 'Grey2 85% 正文' },
      { name: '--color-text-5', label: 'Grey1 100% 一级标题' },
      { name: '--color-text-6', label: '纯黑 #000000' },
    ],
  },
  {
    title: '语义层 · Background 背景',
    desc: '对齐源文件 $color-bgc-* / $color-disabled-bgc-*',
    type: 'color',
    tokens: [
      { name: '--color-bgc-1', label: 'rgba(0,0,0,.04)' },
      { name: '--color-bgc-2', label: 'rgba(0,0,0,.06)' },
      { name: '--color-bgc-3', label: '主色背景色 = --color-primary-4' },
      { name: '--color-disabled-bgc-1', label: 'rgba(0,0,0,.2) 禁用背景' },
      { name: '--color-disabled-bgc-2', label: 'rgba(0,0,0,.25) 禁用背景' },
    ],
  },
  {
    title: '语义层 · Line 描边',
    desc: '对齐源文件 $color-line-*（透明灰）与 _2 实体灰变体',
    type: 'color',
    tokens: [
      { name: '--color-line-1', label: 'Grey7 15% 描边色' },
      { name: '--color-line-2', label: 'Grey8 10% 分割线' },
      { name: '--color-line-1_2', label: '实体 #DCDDDF 描边色' },
      { name: '--color-line-2_2', label: '实体 #E7E8E9 分割线' },
    ],
  },
  {
    title: '语义层 · Fill 填充',
    desc: '对齐源文件 $color-fill-*（透明灰）与 _2 实体灰变体',
    type: 'color',
    tokens: [
      { name: '--color-fill-1', label: 'Grey10 3% 卡片内背景' },
      { name: '--color-fill-2', label: 'Grey9 5% 页面背景' },
      { name: '--color-fill-3', label: 'Grey8 10% 分割线级填充' },
      { name: '--color-fill-1_2', label: '实体 #F8F8F8 卡片内背景' },
      { name: '--color-fill-2_2', label: '实体 #F3F3F4 页面背景' },
    ],
  },
  {
    title: '语义层 · Success 成功',
    desc: '对齐源文件 $color-success-1~6',
    type: 'color',
    tokens: [
      { name: '--color-success-1', label: '标准色 Green-5' },
      { name: '--color-success-2', label: '背景色 Green-1' },
      { name: '--color-success-3', label: 'hover Green-4' },
      { name: '--color-success-4', label: 'active Green-6' },
      { name: '--color-success-5', label: 'disabled Green-2' },
      { name: '--color-success-6', label: '深色文字 #007038' },
    ],
  },
  {
    title: '语义层 · Danger 危险',
    desc: '对齐源文件 $color-danger-1~6',
    type: 'color',
    tokens: [
      { name: '--color-danger-1', label: '标准色 Red-5' },
      { name: '--color-danger-2', label: '背景色 Red-1' },
      { name: '--color-danger-3', label: 'hover Red-4' },
      { name: '--color-danger-4', label: 'active Red-6' },
      { name: '--color-danger-5', label: 'disabled Red-2' },
      { name: '--color-danger-6', label: '深色文字 #B3090E' },
    ],
  },
  {
    title: '语义层 · Warning 警告',
    desc: '对齐源文件 $color-warning-1~6',
    type: 'color',
    tokens: [
      { name: '--color-warning-1', label: '标准色 Orange-5' },
      { name: '--color-warning-2', label: '背景色 Orange-1' },
      { name: '--color-warning-3', label: 'hover Orange-4' },
      { name: '--color-warning-4', label: 'active Orange-6' },
      { name: '--color-warning-5', label: 'disabled Orange-2' },
      { name: '--color-warning-6', label: '深色文字 #8A4100' },
    ],
  },

  // ═══════════════ 兼容别名（历史变量，反向引用规范语义层） ═══════════════
  {
    title: '兼容别名 · 主色/点缀',
    desc: '展示应用历史变量名，已反向引用上方规范语义层，新代码请直接使用规范语义层变量',
    type: 'color',
    tokens: [
      { name: '--color-brand-primary', label: '= --color-primary' },
      { name: '--color-accent', label: '美团黄点缀（固定 Yellow-5）' },
      { name: '--color-accent-text', label: '美团黄底强调文字（固定 Yellow-7 深棕）' },
      { name: '--color-heading-accent', label: '标题强调色（随主题切换）' },
      { name: '--chart-primary-weak', label: '= --color-primary-5' },
    ],
  },
  {
    title: '兼容别名 · 功能色',
    desc: '历史变量名 → 规范语义层',
    type: 'color',
    tokens: [
      { name: '--color-red', label: '= --color-danger-1' },
      { name: '--color-orange', label: '= --color-warning-1' },
      { name: '--color-green', label: '= --color-success-1' },
      { name: '--color-teal', label: '蓝绿色（固定）' },
      { name: '--color-purple', label: '紫色（固定）' },
      { name: '--color-pink', label: '粉色（固定）' },
      { name: '--color-brown', label: '棕色（固定）' },
    ],
  },
  {
    title: '兼容别名 · 文字/背景/描边',
    desc: '历史变量名 → 规范语义层（注意 --text-N 的编号与 --color-text-N 是反向的）',
    type: 'color',
    tokens: [
      { name: '--text-1', label: '= --color-text-5 标题/强调' },
      { name: '--text-2', label: '= --color-text-4 常规正文' },
      { name: '--text-3', label: '= --color-text-3 次要说明' },
      { name: '--text-4', label: '= --color-text-2 辅助说明' },
      { name: '--text-5', label: '= --color-text-1 禁用态' },
      { name: '--text-6', label: 'Grey6 20% 最弱层级' },
      { name: '--bg-page', label: '= --color-fill-1_2 页面背景' },
      { name: '--bg-card', label: '= --white 卡片背景' },
      { name: '--bg-card-inner', label: '= --color-fill-2_2 卡片内层' },
      { name: '--border', label: '= --color-line-1 描边' },
      { name: '--divider', label: '= --color-line-2 分割线' },
      { name: '--bg-nav-dark', label: '= --blue-grey 深色导航' },
      { name: '--mask', label: '= --black-transparent 遮罩' },
    ],
  },
  {
    title: '语义层 · 图表色板',
    desc: '--chart-1 随主题联动，其余固定',
    type: 'color',
    tokens: [
      { name: '--chart-1', label: '主题色 = --color-brand-primary' },
      { name: '--chart-2', label: '绿色 Green-5' },
      { name: '--chart-3', label: '橙色 Orange-5' },
      { name: '--chart-4', label: '蓝绿色' },
      { name: '--chart-5', label: '紫色' },
      { name: '--chart-6', label: '粉色' },
      { name: '--chart-7', label: '棕色' },
      { name: '--chart-primary-strong', label: '= --color-primary-2 主色深色阶' },
      { name: '--chart-up', label: '涨（红 Red-5）' },
      { name: '--chart-down', label: '跌（绿 Green-5）' },
    ],
  },

  // ═══════════════ 非颜色 Token ═══════════════
  {
    title: '字号/行高',
    type: 'value',
    tokens: [
      { name: '--fs-30', label: '30px' },
      { name: '--lh-30', label: '38px' },
      { name: '--fs-24', label: '24px' },
      { name: '--lh-24', label: '32px' },
      { name: '--fs-20', label: '20px' },
      { name: '--lh-20', label: '28px' },
      { name: '--fs-18', label: '18px' },
      { name: '--lh-18', label: '26px' },
      { name: '--fs-16', label: '16px' },
      { name: '--lh-16', label: '24px' },
      { name: '--fs-14', label: '14px' },
      { name: '--lh-14', label: '22px' },
      { name: '--fs-12', label: '12px' },
      { name: '--lh-12', label: '20px' },
    ],
  },
  {
    title: '字重',
    type: 'value',
    tokens: [
      { name: '--fw-regular', label: '400' },
      { name: '--fw-medium', label: '500' },
      { name: '--fw-semibold', label: '600' },
    ],
  },
  {
    title: '间距',
    desc: 'gap-* 负责元素间外部间距；card-padding 负责卡片内边距',
    type: 'value',
    tokens: [
      { name: '--gap-elem', label: '元素间距 8px' },
      { name: '--gap-module', label: '模块间距 8px' },
      { name: '--gap-section', label: '版块间距 24px' },
      { name: '--gap-page', label: '页面外边距 16px' },
      { name: '--card-padding', label: '卡片内边距 16px' },
    ],
  },
  {
    title: '圆角',
    type: 'value',
    tokens: [
      { name: '--radius-1', label: '16px 最大' },
      { name: '--radius-2', label: '10px 大' },
      { name: '--radius-3', label: '6px 常规' },
      { name: '--radius-4', label: '4px 小' },
      { name: '--radius', label: '默认 = radius-3' },
    ],
  },
  {
    title: '阴影',
    type: 'value',
    tokens: [
      { name: '--shadow-high', label: '高层级' },
      { name: '--shadow-mid', label: '中层级' },
      { name: '--shadow-low', label: '低层级' },
      { name: '--shadow-min', label: '最轻' },
      { name: '--shadow-card', label: '卡片默认' },
    ],
  },
];

/** 从 DOM 读取 CSS 变量的计算值 */
function useResolvedTokens(groups: TokenGroup[]): Map<string, string> {
  const [resolved, setResolved] = useState<Map<string, string>>(new Map());

  // 收集所有变量名
  const allNames = useMemo(
    () => groups.flatMap((g) => g.tokens.map((t) => t.name)),
    [groups],
  );

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const map = new Map<string, string>();
    for (const name of allNames) {
      map.set(name, cs.getPropertyValue(name).trim());
    }
    setResolved(map);
  }, [allNames]);

  // 监听 data-theme 变化来重新读取
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // 下一帧再读，确保浏览器已更新计算值
      requestAnimationFrame(() => {
        const cs = getComputedStyle(document.documentElement);
        const map = new Map<string, string>();
        for (const name of allNames) {
          map.set(name, cs.getPropertyValue(name).trim());
        }
        setResolved(map);
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [allNames]);

  return resolved;
}

/** 把 CSS 颜色值转为可显示色块的 background 值 */
function colorBg(resolved: Map<string, string>, name: string): string {
  const v = resolved.get(name);
  // 如果获取到空值（evaluate 上下文局限），直接用 var() 引用让浏览器自行解析
  return v || `var(${name})`;
}

// ---------- 组件 ----------

function ColorSwatchSection({ group, resolved }: { group: TokenGroup; resolved: Map<string, string> }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{group.title}</h3>
      {group.desc && <p className={styles.sectionDesc}>{group.desc}</p>}
      <div className={styles.swatchGrid}>
        {group.tokens.map((token) => (
          <div key={token.name} className={styles.swatchCard}>
            <div
              className={styles.swatchColor}
              style={{ background: colorBg(resolved, token.name) }}
            />
            <div className={styles.swatchInfo}>
              <div className={styles.swatchName}>{token.name}</div>
              {token.label && <div className={styles.swatchValue}>{token.label}</div>}
              {resolved.get(token.name) && (
                <div className={styles.swatchValue}>{resolved.get(token.name)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueTokenSection({ group, resolved }: { group: TokenGroup; resolved: Map<string, string> }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{group.title}</h3>
      {group.desc && <p className={styles.sectionDesc}>{group.desc}</p>}
      <table className={styles.tokenTable}>
        <thead>
          <tr>
            <th>变量名</th>
            <th>说明</th>
            <th>值</th>
          </tr>
        </thead>
        <tbody>
          {group.tokens.map((token) => (
            <tr key={token.name}>
              <td><span className={styles.tokenTableName}>{token.name}</span></td>
              <td>{token.label || '—'}</td>
              <td><span className={styles.tokenTableValue}>{resolved.get(token.name) || '—'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TokenSheet() {
  const [activeTab, setActiveTab] = useState<'token' | 'component'>('token');
  const resolved = useResolvedTokens(tokenGroups);

  return (
    <div className={styles.page}>
      <TopNav />

      <div className={styles.header}>
        <div className={styles.headerLabel}>
          <span className={styles.headerLabelDot} />
          Design System
        </div>
        <h1 className={styles.headerTitle}>组件和 Token</h1>
        <p className={styles.headerDesc}>
          设计规范中定义的全部 Design Token 量表，包括原子层色板字典和语义层界面角色变量。切换主题时，语义层颜色会实时联动。
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tab} ${activeTab === 'token' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('token')}
          >
            Token
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'component' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('component')}
          >
            组件
          </button>
        </div>

        {activeTab === 'token' && (
          <>
            {tokenGroups.map((group) =>
              group.type === 'color' ? (
                <ColorSwatchSection key={group.title} group={group} resolved={resolved} />
              ) : (
                <ValueTokenSection key={group.title} group={group} resolved={resolved} />
              ),
            )}
          </>
        )}

        {activeTab === 'component' && (
          <div className={styles.section}>
            <p style={{ color: 'var(--text-4)', fontSize: 14 }}>
              组件库基于 MTD React UI3，完整组件文档见官方站点：
              <a
                href="https://mtdui.sankuai.com/mtd/react-ui3/components/button"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--color-heading-accent)', marginLeft: 4 }}
              >
                https://mtdui.sankuai.com/mtd/react-ui3/components/button
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
