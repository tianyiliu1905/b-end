export type StoreStatus = '营业中' | '筹备中' | '休息中';
export interface StoreRecord {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  status: StoreStatus;
  manager: string;
  revenue: number;
  orders: number;
  rating: string;
  openedAt: string;
  followed: boolean;
}
export interface StoreFilters { keyword: string; city: string; status: string }
export const EMPTY_FILTERS: StoreFilters = { keyword: '', city: '', status: '' };
const places = [
  ['上海', '静安', '南京西路', '林悦'], ['上海', '徐汇', '衡山路', '陈予'],
  ['杭州', '西湖', '文三路', '周晴'], ['北京', '朝阳', '望京', '许宁'],
  ['成都', '锦江', '春熙路', '陆川'], ['杭州', '滨江', '江南大道', '沈安'],
  ['上海', '浦东', '世纪大道', '苏禾'], ['北京', '海淀', '中关村', '何越'],
  ['成都', '武侯', '玉林路', '方可'], ['杭州', '上城', '湖滨路', '顾言'],
  ['上海', '黄浦', '淮海中路', '叶青'], ['北京', '东城', '东直门', '程一'],
  ['成都', '高新', '天府大道', '夏知'], ['杭州', '拱墅', '运河', '徐洛'],
  ['上海', '长宁', '愚园路', '唐棠'], ['北京', '西城', '金融街', '宋时'],
  ['成都', '青羊', '宽窄巷子', '秦南'], ['上海', '杨浦', '大学路', '江禾'],
];
export const INITIAL_STORES: StoreRecord[] = places.map(([city, district, street, manager], i) => ({
  id: `MD${String(10001 + i)}`, name: `谷里咖啡 · ${street}店`, city, district,
  address: `${city}市${district}区${street}${28 + i * 7}号`, manager,
  status: i % 7 === 5 ? '筹备中' : i % 9 === 8 ? '休息中' : '营业中',
  revenue: i % 7 === 5 ? 0 : 73850 + ((i * 18371) % 131000),
  orders: i % 7 === 5 ? 0 : 1820 + ((i * 379) % 2600),
  rating: i % 7 === 5 ? '—' : (4.5 + (i % 5) / 10).toFixed(1),
  openedAt: i % 7 === 5 ? '筹备中' : `202${3 + i % 3}-${String(i % 12 + 1).padStart(2, '0')}-18`,
  followed: i === 2 || i === 7,
}));
export function filterStores(stores: StoreRecord[], filters: StoreFilters) {
  const keyword = filters.keyword.trim().toLowerCase();
  return stores.filter(row => (!keyword || `${row.name} ${row.id} ${row.manager}`.toLowerCase().includes(keyword))
    && (!filters.city || row.city === filters.city) && (!filters.status || row.status === filters.status));
}
export function summarizeStores(rows: StoreRecord[]) {
  return { total: rows.length, operating: rows.filter(r => r.status === '营业中').length,
    preparing: rows.filter(r => r.status === '筹备中').length,
    revenue: rows.reduce((sum, row) => sum + row.revenue, 0) };
}
export function storesToCsv(rows: StoreRecord[]) {
  const quote = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return '\uFEFF' + [['门店编号', '门店名称', '城市', '经营状态', '负责人', '月营业额', '月订单量', '关注'],
    ...rows.map(r => [r.id, r.name, r.city, r.status, r.manager, r.revenue, r.orders, r.followed ? '是' : '否'])]
    .map(row => row.map(quote).join(',')).join('\r\n');
}
