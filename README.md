# zentao-legacy

面向旧版禅道的 Codex 技能与命令行工具。查询需求、任务、Bug 和工时，整理待办与周月报，并执行用户明确授权的维护操作。

已验证禅道 **12.5.2 / PATH_INFO / `-` 分隔路由**。其他版本和部署方式需要另行验证。

## 能做什么

- 查询产品、项目、需求、Bug、测试用例及详情历史。
- 按账号查看待办、逾期任务、长期未更新记录和状态不一致线索。
- 汇总人员月报、区间工时及关联需求，输出 JSON 证据。
- 维护任务、Bug 和需求；写入默认预览，显式加 `--apply` 才执行。
- 通过本机临时登录页建立会话，密码不落盘，会话按站点隔离。

## 安装为 Codex 技能

需要 Node.js 18.17 或更新版本，无需 `npm install`，无需配置全局 MCP。

将整个仓库放到 Codex 的技能目录，并保持文件夹名称为 `zentao-legacy`：

```bash
git clone https://github.com/a411434233/zentao-legacy.git ~/.codex/skills/zentao-legacy
```

如果目标目录已存在，先检查已有内容，避免覆盖本地修改。安装后在下一轮对话中使用 `$zentao-legacy`。

## 配置与使用

公开版不内置业务站点。先设置自己的禅道根地址：

```bash
export ZENTAO_URL='https://zentao.example.com'
node ~/.codex/skills/zentao-legacy/scripts/zentao.mjs help
node ~/.codex/skills/zentao-legacy/scripts/zentao.mjs login
node ~/.codex/skills/zentao-legacy/scripts/zentao.mjs query products --limit 20
```

`login` 会打印只监听 `127.0.0.1` 的临时页面地址，在浏览器中自行输入账号密码。页面有效期为 15 分钟。不要将密码、Cookie 或 Token 发给 AI。

会话默认保存在 `~/.config/zentao-legacy/<站点哈希>/session.json`，可通过 `ZENTAO_SESSION_FILE` 指定其他路径。不要将该文件、请求记录或业务查询结果提交到仓库。

登录后可以向 Codex 提问，例如：

> 使用 $zentao-legacy 查看我当前指派的需求和未完成任务，标出逾期记录。先核对当前账号。

> 使用 $zentao-legacy 汇总指定成员本周登记工时，说明查询范围和缺失信息。

## 写操作

先读取实际对象，生成含唯一 `requestId` 的单项请求文件，再预览：

```bash
node ~/.codex/skills/zentao-legacy/scripts/zentao.mjs write --file /绝对路径/请求.json
```

用户已明确授权后，在同一请求上添加 `--apply`。执行后回读核对；超时或结果不明确时停止并查询远端，不更换 `requestId` 盲目重发。

## 文档

- [技能入口](SKILL.md)
- [查询参数与筛选](references/queries.md)
- [报表与基础写入](references/operations.md)
- [任务、Bug 和需求维护](references/management.md)
- [来源、兼容性与验证边界](references/compatibility.md)
- [第三方来源说明](THIRD_PARTY_NOTICES.md)

## 限制

列表默认最多返回 100 条，可设置为 1–1000；达到上限不代表已经覆盖全部数据。报告受登录账号权限和采集范围限制。部分写操作只有本地模拟验证，不能视为已在真实站点完成验收。具体边界以技能及参考文档为准。

仓库包含入口脚本、打包运行时、技能说明及参考文档，不包含账号会话、业务数据或原始 TypeScript 适配工程。
