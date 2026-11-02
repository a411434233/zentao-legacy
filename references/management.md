# 任务、Bug和需求维护

沿用 `write --file 请求.json` 预览、`--apply` 执行和唯一 requestId，先读取实际对象，再写入核验。以下为在旧版源码基础上新增的能力，写入模拟验证通过，尚未逐项生产验收。不要使用真实业务作为无授权测试数据。删除、批量维护、多人任务维护未开放。

## 动作与字段

每个请求包含 action、requestId，已有对象包含数字 id。

| action | 字段与含义 |
|---|---|
| edit-task | fields: name/description/estimate/left/deadline/estStarted/pri；仅提交明确要调整的字段，程序保留必要旧值 |
| start-task | left 大于0；可选 date 和 comment；保留累计消耗 |
| finish-task | currentConsumed 本次消耗，可为0，不能编造；可能新增工时日志、将任务转回创建人 |
| close-task | 仅已完成或已取消任务；可选 comment |
| activate-task | left 大于0、assignedTo；可选 comment |
| create-bug | product/title/steps/type/severity/pri/openedBuild数组/assignedTo；可选 module/project/story |
| assign-bug | assignedTo；可选 comment |
| confirm-bug | 可选 comment |
| resolve-bug | resolution/resolvedBuild/assignedTo；duplicate方案还需duplicateBug；可选comment |
| close-bug | 仅已解决Bug；可选comment |
| activate-bug | assignedTo；可选openedBuild数组/comment |
| create-story | product/title/spec/estimate/assignedTo；可选verify/pri/module/reviewers数组/skipReview布尔值；默认不跳过评审 |
| edit-story | fields: title/pri/estimate/assignedTo/module/plan；正文调整使用change-story |
| change-story | spec/title/verify至少明确要改的内容，未提供部分保留；comment必填；可能提升版本并触发重新评审 |
| review-story | result: pass/reject/revert/clarify；comment必填；reject需reason，revert需preVersion；可选reviewers数组 |
| link-story | project；将该id需求关联到项目 |
| split-story | 与create-story相同，另需parent；每次创建一条子需求，父子产品需一致 |

日期格式YYYY-MM-DD，小时必须是数值；id均为正整数。指派账号先通过 users 命令核对；版本、严重度、解决原因、工时和日期按真实业务输入，不使用随意默认值冒充用户选择。预计/剩余工时调整可能改变任务状态，执行前查看预览。

编辑会补齐旧版接口可能清空的字段，并传lastEditedDate防止覆盖期间修改；不将全部详情原样写回。创建前检查同名和列表上限；超过1000条时停止，避免误判无重复。提交后按新ID/关键字段/关联关系回读，未知结果停止且不重试。

## 报告解释

待办只列当前指派对象；进度异常检查包括任务全部完成但需求未关闭、需求已关闭但任务仍未完成、长期未更新。异常是核对线索，不能自动关闭需求。

区间报告含每日登记工时、期间动作、关联需求和任务累计消耗与原预计差异。累计差异不是本期超支；任务可能跨月。期间任务动作即使没有登记工时，也保留其关联需求。本期没有记录不表示没有工作。报告工时依旧受当前账号权限和任务采集范围限制。

不包含文件报表导出或需求规范检查。MCP旧版服务保持只读，新增写操作由技能CLI执行。
