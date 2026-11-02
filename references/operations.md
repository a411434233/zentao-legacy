# 人员统计与写操作

## 人员月报

```bash
node <skill-root>/scripts/zentao.mjs users --users 用户甲,用户乙
node <skill-root>/scripts/zentao.mjs report --users 用户甲,用户乙 --month 2026-10
```

返回 JSON，包括本月新建、参与需求、当前指派需求、需求卡历史备注、状态/阶段、任务完成数及本月登记工时。历史月份也按指定月份查询。当前月份只有截至查询时的数据。

动态按日期边界翻页，用户需求/任务列表展开子需求后按 ID 去重。父子需求分别计数，多人共同参与不等于团队去重需求数。需求卡只是历史备注中存在“需求思考卡”，并非完整性评分；完整性需阅读 cards 内容再判断。

工时按 account/date/consumed 累计，并按工时记录 ID 去重。范围包括个人本月动态关联任务、需求关联任务、个人指派/创建/完成/关闭任务中本月更新的记录；不宣称覆盖权限外、独立日志系统或不在这些集合中的工时。缺卡、无任务的父需求要结合子需求判断，未查到登记不等于没有工作。

## 写入

将具体请求写成 JSON 文件，先预览；实际执行时加 --apply：

```bash
node <skill-root>/scripts/zentao.mjs write --file /绝对路径/请求.json
node <skill-root>/scripts/zentao.mjs write --file /绝对路径/请求.json --apply
```

所有实际请求必须有唯一 requestId；同一次操作始终使用同一个编号。每个文件只包含一项操作，不批量重试。请求记录保存在会话目录的 requests 中，不复制到技能包。默认预览不发送 POST。

| action | 必填字段 | 说明 |
|---|---|---|
| create-task | story, project, name, assignedTo, estimate | 新建研发任务并关联需求；estimate 为数字小时，可为0但需说明待估算；可选 description、pri |
| comment | entity, id, comment | entity 为 story 或 task；追加历史备注，可提交需求思考卡；不改正文 |
| assign | entity, id, assignedTo | 需求或任务指派；可选 comment |
| log-hours | entity:"task", id, date, consumed, left, work | date 为 YYYY-MM-DD；consumed 为本次正数小时；left 为登记后剩余小时；登记人只能是当前登录账号 |
| close-story | id, reason | reason: done/cancel/willnotdo/postponed/duplicate/bydesign；duplicate 还需 duplicateStory；可选 comment |

示例：

```json
{"action":"create-task","requestId":"task-example-unique","story":101,"project":10,"name":"示例任务","assignedTo":"example-user","estimate":4,"description":"用户明确要求的工作范围"}
```

不要直接执行示例。缺少目标、指派人、工时、关闭原因等决定性信息时按上下文确定或询问；不要为完成操作编造实际工时。剩余工时为0可能使任务自动完成，必须符合用户意图。关闭需求会改变状态、阶段和指派，需明确授权。

写入前查询对象/候选成员，写入后回读核对关联、指派、备注、日志或关闭状态。服务端可能返回跳转脚本，HTTP成功不能作为业务成功。请求超时或回读不明确时保留 pending 请求记录，停止并查询远端；禁止换 requestId 盲目重发。创建同名任务时停止，先核对是否已存在。

## 验证边界

人员月报已在目标站点真实只读验证；创建任务曾真实执行成功。新增备注、指派、工时登记及关闭能力依据12.5.2官方源码实现，并通过本地模拟验证；尚未在真实站点执行写验收。首次真实执行必须回读核实。技能命令独立于 MCP，旧版 MCP 工具仍保持只读。
