/** 展示站检索维度；不改变模块规范 ID、生成索引或适用边界。 */
export const FUNCTIONAL_GROUPS = [
  { name: '导航与页面结构', ids: ['G-1+G-2', 'G-6', 'FD1', 'FD2', 'Form2', 'Detail1'] },
  { name: '搜索与筛选', ids: ['G-3'] },
  { name: '数据展示与分析', ids: ['G-4', 'FD3', 'Detail2', 'Detail3', ...Array.from({ length: 15 }, (_, i) => `D-${i + 1}`)] },
  { name: '输入与编辑', ids: ['Form3', 'Form5', 'Form6', 'Form7', 'Form8', 'Form9'] },
  { name: '操作与流程', ids: ['Form1', 'Form4', 'W-4', 'Detail4'] },
  { name: '消息与动态', ids: ['W-5', 'W-6'] },
  { name: 'AI 与对话', ids: ['AI-1', 'AI-2', 'AI-3'] },
  { name: '工作台入口与引导', ids: ['W-1', 'W-2', 'W-3', 'W-7'] },
] as const;

export const PAGE_SCENES = ['列表页', '数据看板', '表单页', '详情页', '工作台', 'AI 场景'] as const;
export type PageScene = typeof PAGE_SCENES[number];
const scenes: Record<string, readonly PageScene[]> = {
  'G-1+G-2': ['列表页', '数据看板', '表单页', '详情页', '工作台'],
  'AI-1': ['AI 场景'], 'AI-2': ['AI 场景'], 'AI-3': ['AI 场景'], Detail4: ['详情页'],
  'G-3': ['列表页', '数据看板'],
  'G-4': ['列表页', '数据看板', '工作台'],
  'D-1': ['数据看板', '列表页', '工作台'],
  'G-6': ['列表页'],
  FD1: ['表单页', '详情页'], FD2: ['表单页', '详情页'], FD3: ['表单页', '详情页'],
  Form1: ['表单页', '详情页'], Form2: ['表单页', '详情页'],
  Form3: ['表单页'], Form4: ['表单页'], Form5: ['表单页'], Form6: ['表单页'],
  Form7: ['表单页'], Form8: ['表单页'], Form9: ['表单页', '详情页'],
  Detail1: ['详情页'], Detail2: ['详情页'], Detail3: ['详情页'],
};

export function getModuleTaxonomy(id: string): { category: string; scenes: readonly PageScene[]; topics: string[] } {
  const group = FUNCTIONAL_GROUPS.find(group => (group.ids as readonly string[]).includes(id));
  if (!group) throw new Error(`模块 ${id} 缺少功能归类`);
  return {
    category: group.name,
    scenes: scenes[id] || (id.startsWith('D-') ? ['数据看板', '列表页'] : ['工作台']),
    topics: id === 'D-11' ? ['AI', '智能摘要'] : id.startsWith('AI-') ? ['AI'] : [],
  };
}
