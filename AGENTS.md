# blog — 个人博客开发说明

在修改本仓库前，必须完整阅读 PROJECT_GOAL.md。该文件是产品目标、版本进度、
Issue 状态和持续开发规则的唯一长期来源。不要把目标缩减为当前已完成的功能。

## 工作规则

- 纯前端 HTML/CSS/JS，零第三方依赖，Markdown 文章由内置解析器渲染。
- 所有文章数据和元信息以 JS 对象形式存储，无需后端数据库。
- 每次只完成一个可独立使用的最小版本，同时保证响应式布局。
- 每次修改必须验证 HTML/CSS/JS 无语法错误。
- 每次完成后同步更新 PROJECT_GOAL.md 的"当前进度"表和 README.md（双写）。
- 每轮开始时检查 GitHub Issues：可执行的回复并纳入版本，需澄清的回复问题并保持开放；
  发布后在 Issue 回复版本号、提交和验证结果并关闭。
- Issue 处理结果同时写入 PROJECT_GOAL.md 和 README.md，确保换环境后仍可追踪。
- 提交信息使用语义化风格（feat/fix/chore）。创建版本标签并推送。不改写已推送的历史。

## 开始新一轮开发

1. `git status -sb`、`git log -5 --oneline --decorate`。
2. 检查 GitHub Issues：回复→纳入→实现→发布→关闭→双写。
3. 完整阅读 PROJECT_GOAL.md，关注"当前进度"表和"下一版本分析"。
4. 自主决策 → 实现 → 验证 → 双写 → 推送。

## 跨环境继续开发

产品上下文、进度和 Issue 状态全部保存在 PROJECT_GOAL.md。换电脑后克隆仓库并阅读
AGENTS.md → PROJECT_GOAL.md 即可恢复完整上下文，不依赖聊天记录。
