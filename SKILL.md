---
name: zentao-legacy
description: 查询禅道旧版的产品、项目、需求、Bug、测试用例及详情历史记录，处理本机登录和会话失效。已验证禅道 12.5.2 的 PATH_INFO 路由。适用于旧版禅道查询、待办筛选及历史参与核对；支持创建关联任务、添加备注、修改指派、登记任务工时和关闭需求，以及待办、进度异常、工时分析和周月报。
---

# 禅道旧版查询与操作

使用技能自带的 `scripts/zentao.mjs`，需要 Node.js 18.17 或更新版本，无需安装 npm 依赖或配置全局 MCP。下文 `<skill-root>` 为本 SKILL.md 所在目录，执行时换成实际绝对路径，不依赖当前工作目录。

使用前设置环境变量 `ZENTAO_URL`，指定你有权访问的禅道根地址（例如 `https://zentao.example.com`）；公开版不内置业务站点。仅 12.5.2 / PATH_INFO / `-` 路由完成过真实验证，不将探测成功当成所有版本兼容。

## 选择查询

```bash
node "<skill-root>/scripts/zentao.mjs" help
node "<skill-root>/scripts/zentao.mjs" query products --limit 20
node "<skill-root>/scripts/zentao.mjs" query projects --limit 20
node "<skill-root>/scripts/zentao.mjs" query stories <产品ID> --browse-type assignedtome --limit 100
node "<skill-root>/scripts/zentao.mjs" query bugs <产品ID> --browse-type assigntome --limit 100
node "<skill-root>/scripts/zentao.mjs" query testcases <产品ID> --limit 20
node "<skill-root>/scripts/zentao.mjs" query story <需求ID>
```

- 未知产品或记录 ID 时先查询确定，不能使用示例 ID。上下文已明确对象范围时直接复用。
- 详情命令还支持 `product`、`project`、`bug`、`testcase`。筛选值和列表边界见 [references/queries.md](references/queries.md)。
- 列表默认最多 100 条，`--limit` 允许 1–1000，程序按页读取。到达上限不能声称覆盖全部数据；完整统计需要额外分页能力或缩小明确的范围。
- “我”类筛选使用当前登录账号。核对用户或账号有歧义时先澄清，不能将任意姓名等同于当前会话账号。
- 需求详情的 `actions` 为服务器返回的历史操作，可含历史字段变更。判断“参与过”时根据用户口径检查操作人、时间和动作；当前指派人不等于历史参与人。只有抽样或受限列表时明确覆盖范围。

## 登录与连接

已有会话时直接执行用户范围内的查询，不要求重复登录。诊断网络、版本和路由时执行 `probe`；它无需登录，但不能证明业务查询成功。

缺少会话或会话失效时：

```bash
node "<skill-root>/scripts/zentao.mjs" login
```

此命令启动监听 `127.0.0.1` 的临时页面并打印地址。保持进程运行，通过可用浏览器能力或系统打开命令打开该地址，让用户自行输入账号密码。不要在对话中索要密码、Token，也不要直接读取或打印会话文件。用户完成后，在原目标范围内做一次只读查询确认。

登录程序使用实际登录页的 `verifyRand`，复核服务器返回的账号，再保存 Cookie 会话。密码不落盘。默认会话位于 `~/.config/zentao-legacy/<站点哈希>/session.json`，与技能及项目目录分开；可通过 `ZENTAO_SESSION_FILE` 指定其他路径。新安装不会附带会话文件。

本机登录页 15 分钟后关闭；服务已退出时重新启动并打开新地址。遇到 `Forbidden` / 来源校验错误时先检查是否为旧页面及本机服务，不先断言禅道账号无效。验证码、风控或第三方登录交给用户处理，登录失败不自动循环重试。

## 结果与限制

- 输出是 JSON；按用户问题提炼必要字段，不将全部业务数据无差别贴回。
- 页面 HTML、业务拒绝、列表字段缺失、会话站点不匹配、分页重复都会报错。不能把异常解释为零条结果。
- `verify` 会读取产品和项目各最多 5 条，仅用于用户授权范围包含这些对象时的连接验证；它不代表所有模块均已验收。
- 写入仅限用户明确授权的目标与字段；先预览再执行，已有明确授权不重复索取确认。用户只要求生成草稿或查看时不执行。写入命令、必填项和验证边界见 [references/operations.md](references/operations.md)。
- 人员月报与多用户对比使用 `report --users 姓名,姓名 --month YYYY-MM`；用户识别用 `users --users 姓名,账号`。报表口径及权限边界见 [references/operations.md](references/operations.md)。

来源、打包方式与已验证范围见 [references/compatibility.md](references/compatibility.md)。

## 待办、异常与周报

- `dashboard --users 姓名,姓名 --today YYYY-MM-DD [--days 14]`：当前需求、未完成任务、Bug、剩余工时、逾期任务与长期未更新/状态不一致线索。
- `period-report --users 姓名,姓名 --start YYYY-MM-DD --end YYYY-MM-DD`：按日工时、期间动作、关联需求及任务预计/累计消耗差异。周报指定周起止日期；月报也可用 report。输出是 JSON 证据，按用户需要整理成文字；不新增报表文件导出功能。
- 操作维护新增任务编辑/开始/完成/关闭/激活，Bug创建/指派/确认/解决/关闭/激活，以及需求创建/编辑/变更/评审/关联项目/拆子需求，见 [references/management.md](references/management.md)。
- 不执行需求规范检查或需求卡完整性评分。已有报表中的需求卡历史信息保留用于用户明确查询。
