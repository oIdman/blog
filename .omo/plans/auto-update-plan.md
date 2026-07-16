# Auto-Update Workflow Plan

自主目标驱动开发工作流。AI 每轮自主评估→决策→实现→双写→发布。

## Phases

### Phase 0: 自我评估
- [ ] 读取 AGENTS.md 了解工作规则和硬约束
- [ ] `git status -sb` + `git log -5 --oneline --decorate`
- [ ] 检查 GitHub Issues（gh issue list）
- [ ] 完整读取 PROJECT_GOAL.md，关注"当前进度"表和"下一版本分析"
- [ ] 完整读取 README.md 确认已发布功能
- [ ] 自主决策优先级：开放 Issues → 下一版本方向 → 代码自检优化
- [ ] 决定版本号（issue修复=patch，新功能=minor，重大重构=major）

### Phase 1: 实现
- [ ] 实现决策的功能/修复
- Acceptance: 代码完成

### Phase 2: 验证 + 双写
- [ ] 验证 HTML/CSS/JS 无语法错误
- [ ] 更新 PROJECT_GOAL.md "当前进度"表和"版本详细记录"
- [ ] 更新 PROJECT_GOAL.md "Issue处理记录"（如有）
- [ ] 更新 PROJECT_GOAL.md "下一版本分析"
- [ ] 更新 README.md 发布说明
- Acceptance: 双写完成

### Phase 3: 发布
- [ ] Commit（语义化风格）
- [ ] 创建版本标签
- [ ] Push main + tags

### Phase 4: 关闭 Issue
- [ ] 回复 Issue：版本号、提交hash、验证结果
- [ ] 关闭 Issue
- [ ] 更新 PROJECT_GOAL.md "Issue处理记录"表
