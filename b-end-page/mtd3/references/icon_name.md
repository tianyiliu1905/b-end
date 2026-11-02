# Icon 图标使用规范

## ⚠️ 强制要求：使用图标前必须执行以下步骤

**图标名称有严格的合法列表，静态文档中的名称可能已过时或有误。**
**禁止凭记忆或猜测使用图标名，必须通过脚本确认。**

---

## Step 1：语义搜索 —— 找到候选图标名

根据你要表达的**中文语义**，执行搜索命令：

```bash
node scripts/icon.js query <中文关键词>
```

**示例：**
```bash
node scripts/icon.js query 搜索
# 输出：推荐图标: search / 备选图标: find-o / category-search

node scripts/icon.js query 删除
# 输出：推荐图标: delete / 备选图标: delete-o

node scripts/icon.js query 通知
# 输出：推荐图标: bell / 备选图标: bell-o / unbell

node scripts/icon.js query 用户
# 输出：推荐图标: avatar-fill / avatar-o / ...
```

脚本会返回：
- **推荐图标**：语义最匹配的图标（优先使用）
- **备选图标**：相关的其他选项

---

## Step 2：验证 —— 确认图标名合法

从搜索结果中选定图标名后，必须验证：

```bash
node scripts/icon.js validate <图标名>
```

**示例：**
```bash
node scripts/icon.js validate search
# ✅ "search" 是合法的图标名

node scripts/icon.js validate search-o
# ❌ "search-o" 不是合法的图标名
#    你是否想用: category-search / research ...
```

验证通过后才可以写入代码。

---

## Step 3：写入代码

```tsx
import { Icon } from '@ss/mtd-react3'

// 基础用法
<Icon type="search" />
<Icon type="bell" style={{ fontSize: 18, color: '#ff6900' }} />
<Icon type="setting-fill" style={{ fontSize: 16 }} />
```

```tsx
// Button 内嵌图标（icon prop 与 Icon type 相同）
<Button icon="add">新建</Button>
<Button icon="search" type="primary">搜索</Button>
<Button shape="circle" icon="more" size="small" type="text" />
<Button shape="circle" icon="delete" size="small" type="text" />
<Button shape="circle" icon="edit" size="small" type="text" />
<Button shape="circle" icon="setting" size="small" type="text" />
```

---

## 使用规则

- **`Icon type` 和 `Button icon`** 必须填写脚本验证通过的名称（不含 `icon-` 前缀）
- **带 `-fill` 后缀**为实心版，**带 `-o` 后缀**为线框版，无后缀通常为默认版
- **同一页面/同一功能区域内必须统一风格**，禁止实心与线框混用
- 若需要的图标搜索不到，选择语义最接近的替代图标，**绝对不能用 emoji 代替**
- 图标大小通过 `style={{ fontSize: N }}` 控制，颜色通过 `style={{ color: '...' }}` 控制
- **带 `_4px` / `_5px` / `_3px` 后缀的变体**为特殊尺寸优化版，普通场景无需使用，直接用基础名称即可

---

## 常见错误示例（禁止这样写）

```tsx
// ❌ 错误：search-o 不存在于合法列表
<Icon type="search-o" />

// ❌ 错误：cart-o 不存在于合法列表
<Icon type="cart-o" />

// ❌ 错误：undo 不存在于合法列表（正确是 undo-o）
<Icon type="undo" />

// ❌ 错误：bank-card 不存在（正确是 bank-card-fill）
<Icon type="bank-card" />

// ❌ 错误：用 emoji 代替图标
<span>🔍</span>
```

```tsx
// ✅ 正确：先查询再验证再使用
// node scripts/icon.js query 搜索  →  推荐: search
// node scripts/icon.js validate search  →  ✅
<Icon type="search" />
```

---

## 快速参考：常用场景速查

> 以下为参考用途，实际使用前仍需通过脚本验证。

| 场景 | 执行命令 |
|------|---------|
| 搜索/查询 | `node scripts/icon.js query 搜索` |
| 新增/添加 | `node scripts/icon.js query 添加` |
| 删除/移除 | `node scripts/icon.js query 删除` |
| 编辑/修改 | `node scripts/icon.js query 编辑` |
| 设置/配置 | `node scripts/icon.js query 设置` |
| 用户/头像 | `node scripts/icon.js query 用户` |
| 通知/铃铛 | `node scripts/icon.js query 通知` |
| 上传/下载 | `node scripts/icon.js query 上传` |
| 日历/日期 | `node scripts/icon.js query 日历` |
| 文件/文档 | `node scripts/icon.js query 文件` |
| 关闭/取消 | `node scripts/icon.js query 关闭` |
| 确认/完成 | `node scripts/icon.js query 确认` |
| 更多操作  | `node scripts/icon.js query 更多` |
| 刷新      | `node scripts/icon.js query 刷新` |
| 复制      | `node scripts/icon.js query 复制` |
