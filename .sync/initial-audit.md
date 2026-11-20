# 展示站 / Skill 初始一致性审计

审计基于 Git `9b884d4` 的业务内容，新增同步工具未改变现有模块设计。
.sync/baseline.json 仅保存观测指纹，不构成语义一致性证明。

范围：41 个目录模块、17 个业务页、图表基础、主题和展示外壳，共 61 个范围。

## 结论

**目前不能认定展示站与 B 端 Skill 处于同一语义版本。** 静态结构核对与人工抽查已发现以下差异；其他范围未逐项完成视觉、交互及复制内容核验。

| 范围 | 已确认问题 |
| --- | --- |
| G-6 | Missing preview registration: G-6 |
| D-13 | D-13: 展示站与复制 Spec 是 gauge 仪表盘；Skill Dashboard13-liquid.md 明确是 liquid 水波球。 |
| W-4 | W-4: 展示站/Spec 为个人信息卡；Skill 为今日待办。 |
| W-6 | W-6: 展示站/Spec 为指标统计区；Skill 为最新动态。 |
| W-7 | W-7: 展示站/Spec 为待办列表；Skill 为常用工具网格。 |

这些问题及依赖它们的候选页面共使 12 个范围处于 blocked；49 个范围为 unreviewed。候选依赖偏保守，blocked 不代表每个业务页一定展示了错误模块；修改时须核对实际装配。

## 版本解释

- Skill 的 V27 是下载包来源版本；当前源码已修改，原始 manifest/签名不能认证修改后的内容。
- L2 索引 version 与 showcase package version 属于各自版本空间，不能比较大小得出同步关系。
- 新工具按范围计算代码 + 知识 + 映射 + 问题清单指纹；只有附带真实语义核验证据且指纹仍匹配才标 verified。

## 后续使用

运行 `python3 skills/b-end-sync/scripts/sync_check.py audit` 获取实时状态；本报告是初始化结果，不随后续修复自动更新。遇到目标模块修改，按 Skill 同步并复核该范围；本次创建维护工具未擅自选择旧差异的设计修复方向。
