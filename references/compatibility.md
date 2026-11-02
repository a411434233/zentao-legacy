# 来源与维护

社区原型：`Tytt/zentao-mcp`，参考提交 `1df0abc60eb90e795f6ea3338cd0d7c235cd6ed2`。社区版的现代 REST v1 入口不适用于本实例，技能使用本次实现的旧版查询适配器。

接口参数及登录机制核对依据：`easysoft/zentaopms` 标签 `zentaopms_12.5.2_20201218` 的 user、product、project、story、bug、testcase、api 控制器及相关 model。

2026-10-15 在授权的禅道 12.5.2 实例真实验证：版本识别、PATH_INFO 路由、旧版会话入口、账号登录及会话复核通过；五类对象的列表及单条详情抽样通过；需求历史记录可读取。MCP 进程列出 5 个只读工具并完成真实产品查询。九项本地模拟测试覆盖了来源校验、登录、会话、分页、解包、查询路由和写入拦截。这不表示全部筛选条件、全部账号和其他部署版本均已验证。

技能通过 `scripts/zentao.mjs` 启动内置 `zentao-runtime.cjs`，不依赖原工作目录或全局 npm 包。运行时仅使用 Node.js 内置模块及已打包依赖，不需要额外配置 MCP。

如需维护，更新配套适配工程中的 `src/legacy-cli.ts`、`src/legacy-client.ts`、`src/local-form.ts`，完成 TypeScript 构建及测试，再用 esbuild 对 `src/legacy-cli.ts` 生成 Node CommonJS bundle，替换 `scripts/zentao-runtime.cjs`。本仓库发布可运行的技能包，不包含原始 TypeScript 适配工程；技能日常运行不依赖该工程。bundle 中保留依赖的法律声明。

分享或重新安装只复制技能目录，不复制 `~/.config/zentao-legacy` 和原工程的 `.local`，也不把会话加入 bundle。

2026-10-16 扩展：增加 users/report/write 命令。写操作预览与请求记录、提交后核实均有本地测试；不将模拟通过等同真实写入验收。源文件增加 operations.ts。

同日第二次扩展：增加management.ts及dashboard/period-report，累计35项测试；已授权用户的真实待办和2026-10-12至2026-10-16区间报告只读查询成功。新写动作仅模拟验收。无报表文件导出或需求规范检查。
