# 查询参数

调用方式：`node <skill-root>/scripts/zentao.mjs query <模块> [ID] [选项]`。

| 模块 | ID 的含义 | 返回 |
|---|---|---|
| products / projects | 不传 ID | 列表数组 |
| bugs / stories | 产品 ID | 列表数组 |
| testcases | 产品 ID | `{cases, returned, limit}` |
| product / project / bug / story / testcase | 对应记录 ID | 详情对象，含服务端可用的 actions |

列表 `--limit N` 为最大返回条数，默认 100，允许 1–1000。用户只查某个对象时优先详情查询。列表为空可以是当前产品下没有该类数据，不代表其他产品也为空。

`--browse-type` 只对 `bugs` 和 `stories` 有意义，使用该模块自己的筛选值：

| Bug 筛选值 | 含义 |
|---|---|
| all | 全部，默认 |
| unclosed | 未关闭 |
| unresolved | 未解决 |
| toclosed | 待关闭 |
| openedbyme | 我创建 |
| assigntome | 指派给我 |
| resolvedbyme | 我解决 |
| assigntonull | 未指派 |

| 需求筛选值 | 含义 |
|---|---|
| allstory | 全部，默认 |
| unclosed | 未关闭 |
| closedstory | 已关闭 |
| draftstory | 草稿 |
| activestory | 激活 |
| changedstory | 已变更 |
| openedbyme | 我创建 |
| assignedtome | 指派给我 |
| reviewedbyme | 我评审 |
| closedbyme | 我关闭 |

筛选值来自 12.5.2 官方源码，不沿用社区 README 中的 `reviewbyme`、`changingstory` 等不匹配值。所有筛选组合尚未在目标专业版逐项验证，发现拒绝或异常应保留具体查询条件进行排查。

日期筛选与参与核对：当前程序没有日期服务端过滤选项。可以对已返回的数据在本地按用户口径处理，但必须标明列表上限与覆盖范围。历史参与优先读取详情 `actions`，保留 actor/date/action/history 等实际返回字段，不能把无历史权限当作从未参与。
