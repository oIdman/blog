const posts = [
  {
    slug: 'go-1-22-new-features',
    title: 'Go 1.22 新特性解读',
    date: '2026-07-10',
    category: 'Go',
    readCount: 3420,
    commentCount: 28,
    excerpt: 'Go 1.22 带来了一系列值得关注的改进，包括 for 循环变量语义调整、标准库增强以及性能优化。本文结合实际代码片段，带你快速上手这些新变化。',
    content: `# Go 1.22 新特性解读

Go 1.22 是一次备受期待的版本更新，它不仅修复了长期存在的 for 循环变量共享问题，还为标准库引入了更多实用工具。对于日常写后端服务的开发者来说，这些改动能显著减少隐式 Bug。

## for 循环变量语义变化

在 1.22 之前，下面这段代码可能会让很多人踩坑：

\`\`\`go
for i := 0; i < 3; i++ {
    go func() {
        fmt.Println(i)
    }()
}
\`\`\`

过去会输出三个相同的数字，而现在每个 goroutine 都会得到自己的副本，输出更加符合直觉。

## 新增的 math/rand/v2

标准库引入了 \`math/rand/v2\`，API 更现代，性能也有所提升：

\`\`\`go
package main

import (
    "fmt"
    "math/rand/v2"
)

func main() {
    n := rand.IntN(100)
    fmt.Println("random number:", n)
}
\`\`\`

## 为什么值得关注

- 更少的闭包陷阱
- 更快的随机数生成
- 更清晰的错误处理模式

> 升级前建议先在测试环境跑一遍，确认没有依赖旧语义的代码。

更多细节可以查看 [Go 官方发布说明](https://go.dev/doc/go1.22)。
`
  },
  {
    slug: 'python-type-hints-best-practice',
    title: 'Python 类型提示最佳实践',
    date: '2026-07-08',
    category: 'Python',
    readCount: 2180,
    commentCount: 19,
    excerpt: '从 typing 模块到现代 Python 的类型语法，类型提示已经成为大型项目不可或缺的一部分。本文分享一些实用技巧和常见误区。',
    content: `# Python 类型提示最佳实践

Python 是动态类型语言，但在中大型项目里，类型提示能显著降低维护成本。配合 \`mypy\` 或 \`pyright\`，我们可以在运行前发现大量潜在问题。

## 基础用法

使用 \`typing\` 模块为函数参数和返回值标注类型：

\`\`\`python
from typing import Optional, List, Dict

def fetch_users(ids: List[int]) -> Dict[int, str]:
    result: Dict[int, str] = {}
    for user_id in ids:
        result[user_id] = f"user_{user_id}"
    return result
\`\`\`

## 推荐使用新语法

Python 3.10+ 支持更简洁的写法：

\`\`\`python
def find_user(name: str) -> str | None:
    # 模拟查询逻辑
    if name == "admin":
        return "root"
    return None
\`\`\`

## 几点建议

1. **渐进式引入**：不要一次性给整个项目加类型，从核心模块开始。
2. **避免过度使用 Any**：\`Any\` 会绕过类型检查，只在必要时使用。
3. **配合 CI**：把 \`mypy --strict\` 放到持续集成里。

> 类型提示不是银弹，但它能让代码更易读、更易重构。

养成良好的类型习惯，团队协作会顺畅很多。
`
  },
  {
    slug: 'vue-3-composition-api-guide',
    title: 'Vue 3 Composition API 上手指南',
    date: '2026-07-05',
    category: 'Web',
    readCount: 1890,
    commentCount: 14,
    excerpt: 'Composition API 让 Vue 组件的逻辑复用和组织方式更加灵活。本文通过一个计数器示例，带你理解 setup、ref 和 computed 的核心用法。',
    content: `# Vue 3 Composition API 上手指南

Vue 3 的 Composition API 改变了我们组织组件逻辑的方式。相比 Options API，它更适合复杂组件和逻辑复用。

## 基础示例

下面是一个使用 \`setup\` 语法的简单计数器：

\`\`\`javascript
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} × 2 = {{ double }}
  </button>
</template>
\`\`\`

## 为什么使用 Composition API

- 逻辑可以按功能组合，而不是按选项拆分
- 更容易提取可复用的 composable
- TypeScript 支持更友好

## 注意事项

1. \`ref\` 需要通过 \`.value\` 访问
2. \`reactive\` 适合对象，但不适合解构
3. 生命周期钩子命名有所变化，如 \`onMounted\`

> 推荐新项目直接使用 \`<script setup>\` 风格，代码更简洁。

对于中小型组件，Options API 依然可用，选择最适合团队的风格即可。
`
  },
  {
    slug: 'docker-compose-small-web-service',
    title: 'Docker Compose 部署小型 Web 服务',
    date: '2026-07-02',
    category: '运维',
    readCount: 1540,
    commentCount: 11,
    excerpt: '使用 Docker Compose 可以快速在本地或服务器上搭建 Web 服务。本文以 Go 服务 + Redis 为例，给出一个可直接运行的编排配置。',
    content: `# Docker Compose 部署小型 Web 服务

对于个人项目或小型服务，Docker Compose 是最便捷的部署方式之一。下面是一个典型的 Go Web 服务 + Redis 的编排示例。

## docker-compose.yml

\`\`\`yaml
version: "3.9"

services:
  web:
    build: .
    ports:
      - "8080:8080"
    environment:
      - REDIS_ADDR=redis:6379
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  redis-data:
\`\`\`

## 常用命令

启动服务：

\`\`\`bash
docker compose up -d
\`\`\`

查看日志：

\`\`\`bash
docker compose logs -f web
\`\`\`

停止并清理：

\`\`\`bash
docker compose down
\`\`\`

## 几点经验

- 生产环境建议加上 restart 策略
- 敏感配置使用 \`.env\` 文件管理
- 数据卷要做好备份

> Compose 虽然简单，但也要注意资源限制和健康检查。
`
  },
  {
    slug: 'mysql-index-optimization',
    title: 'MySQL 索引优化避坑指南',
    date: '2026-06-28',
    category: '数据库',
    readCount: 2760,
    commentCount: 23,
    excerpt: '索引是数据库性能优化的核心手段，但不合理的索引设计反而会成为负担。本文从 EXPLAIN 出发，讲解常见索引问题和优化思路。',
    content: `# MySQL 索引优化避坑指南

索引设计是 MySQL 性能优化的第一课。一个好的索引能让查询从秒级降到毫秒级，而一个不合理的索引则可能拖慢写入并占用大量空间。

## 用 EXPLAIN 分析查询

\`\`\`sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
\`\`\`

典型输出关键字段：

\`\`\`
+----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref   | rows | filtered | Extra |
+----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | users | NULL       | ref  | idx_email     | ...  | ...     | const |    1 |   100.00 | NULL  |
+----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-------+
\`\`\`

关注 \`type\`、\`key\` 和 \`rows\` 这三个字段，它们直接反映了索引是否生效。

## 常见误区

1. **在离散度低的字段上建索引**：比如性别字段，索引效果很差。
2. **违背最左前缀原则**：联合索引 \`(a, b, c)\` 查询时如果没有 \`a\`，索引无法使用。
3. **索引过多影响写入**：每次 INSERT/UPDATE 都要维护索引树。

## 优化建议

- 优先给 WHERE、JOIN、ORDER BY 涉及的字段加索引
- 使用覆盖索引减少回表
- 定期用 \`OPTIMIZE TABLE\` 整理碎片

> 索引不是越多越好，够用就好。
`
  },
  {
    slug: 'why-i-use-plain-text-notes',
    title: '我为什么又开始用纯文本笔记',
    date: '2026-06-25',
    category: '工具随笔',
    readCount: 980,
    commentCount: 7,
    excerpt: '在经历了各种笔记软件之后，我重新回到了纯文本笔记。没有格式负担、没有平台锁定，只有最原始也最可靠的内容。',
    content: `# 我为什么又开始用纯文本笔记

过去几年，我尝试过不少笔记工具：Notion、Obsidian、语雀、飞书文档……它们都很强大，但渐渐地，我发现自己花在排版和整理结构上的时间越来越多。

## 回到纯文本的原因

纯文本最大的优点是**简单**。一个 \`.md\` 文件，任何编辑器都能打开，任何版本控制工具都能追踪。它不会因为某个平台关闭而丢失，也不会因为格式兼容性问题而乱码。

我现在的笔记工作流是这样的：

- 用 Vim 或 VS Code 写 Markdown
- 用 Git 做版本管理
- 用 ripgrep 快速搜索
- 用目录结构做分类

## 它的不足

当然，纯文本也不是万能的。对于需要复杂表格、图片标注或团队协作的场景，专业工具依然有优势。但对于日常记录、技术笔记和灵感捕捉，纯文本已经足够了。

> 工具最终是为内容服务的，不要让工具反过来消耗你。

选择适合自己的方式，然后坚持写下去。
`
  },
  {
    slug: 'clean-code-reading-notes',
    title: '《代码整洁之道》读书笔记',
    date: '2026-06-20',
    category: '读书笔记',
    readCount: 1650,
    commentCount: 16,
    excerpt: '重读《代码整洁之道》，记录一些值得反复咀嚼的观点：命名、函数、注释和错误处理。整洁代码不是洁癖，而是对读者的尊重。',
    content: `# 《代码整洁之道》读书笔记

最近重读了 Robert C. Martin 的《代码整洁之道》，这本书虽然出版多年，但里面的原则依然适用。以下是几点让我印象深刻的思考。

## 关于命名

> 代码应该清晰地表达意图，而不是依赖注释来解释。

好的命名能省去大量注释。变量名、函数名、类名都应该直白地说明它们的用途和责任。避免使用 \`tmp\`、\`data\`、\`info\` 这种没有信息量的名字。

## 函数要小而专注

一个函数只做一件事，而且要做好。参数越少越好，理想情况下是零个或一个。函数名应该描述它做了什么，而不是怎么做。

## 注释不是遮羞布

注释应该解释为什么，而不是解释做什么。如果代码本身需要大量注释才能看懂，那往往是代码需要重构的信号。

## 错误处理也是主要逻辑

不要忽视错误路径。使用异常而不是返回错误码，可以让正常流程更清晰。

> 整洁的代码是简单、直接、可读性强的代码。

读完这本书最大的收获是：写代码的时候，多站在阅读者的角度想一想。
`
  },
  {
    slug: 'redis-distributed-lock-pitfalls',
    title: 'Redis 分布式锁实现的陷阱',
    date: '2026-06-18',
    category: '后端',
    readCount: 2310,
    commentCount: 21,
    excerpt: '分布式锁是 Redis 的典型应用场景，但实现过程中有很多细节容易忽略。本文讨论 SET NX EX、看门狗和 Lua 脚本释放锁的关键点。',
    content: `# Redis 分布式锁实现的陷阱

分布式锁是 Redis 最常见的应用场景之一。虽然 \`SET key value NX EX 30\` 看起来很简单，但要实现一个可靠的分布式锁，还有不少坑要避开。

## 基础实现

\`\`\`bash
SET resource:lock my_random_value NX EX 30
\`\`\`

这条命令同时完成了设置值、互斥和过期时间三件事。

## 释放锁必须用 Lua

释放锁时，必须确保删除的是自己加的锁，否则可能误删别人的锁。推荐使用 Lua 脚本：

\`\`\`lua
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
\`\`\`

## 常见问题

1. **锁续期**：业务执行时间超过锁过期时间，需要看门狗机制续期。
2. **主从切换**：Redis 主从异步复制可能导致锁丢失。
3. **时钟跳跃**：依赖系统时钟的过期计算可能出现异常。

> 如果场景要求极高一致性，Redlock 方案值得研究，但实现复杂度也更高。

分布式锁没有银弹，理解 trade-off 才能做出合适的选择。
`
  },
  {
    slug: 'git-automation-workflow',
    title: 'Git 自动化工作流',
    date: '2026-06-15',
    category: '工具随笔',
    readCount: 1320,
    commentCount: 9,
    excerpt: '通过简单的 Git 钩子和 Shell 脚本，可以大幅提升日常开发效率。本文分享几个我常用的自动化小技巧。',
    content: `# Git 自动化工作流

Git 不仅是版本控制工具，配合钩子和脚本，还能帮我们自动化很多重复工作。

## 提交前自动格式化

在项目根目录创建 \`.git/hooks/pre-commit\`：

\`\`\`bash
#!/bin/bash
set -e

files=$(git diff --cached --name-only --diff-filter=ACM | grep '\.go$' || true)

if [ -n "$files" ]; then
    echo "Formatting Go files..."
    echo "$files" | xargs gofmt -w
    echo "$files" | xargs git add
fi
\`\`\`

记得给钩子文件添加执行权限：

\`\`\`bash
chmod +x .git/hooks/pre-commit
\`\`\`

## 一键推送脚本

\`\`\`bash
#!/bin/bash
branch=$(git branch --show-current)
default_message="chore: update"
message="$1"
if [ -z "$message" ]; then
    message="$default_message"
fi
git add .
git commit -m "$message"
git push origin "$branch"
\`\`\`

## 常用别名

\`\`\`bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --decorate"
\`\`\`

> 自动化不是为了偷懒，而是把精力放在更有价值的事情上。

根据自己的项目特点定制脚本，效率提升会很明显。
`
  },
  {
    slug: 'my-terminal-config-2026',
    title: '我的终端配置 2026',
    date: '2026-06-10',
    category: '工具随笔',
    readCount: 1890,
    commentCount: 13,
    excerpt: '终端是程序员每天打交道最多的工具之一。分享一下我当前的 Shell、提示符和常用快捷键配置，希望能给你一些灵感。',
    content: `# 我的终端配置 2026

一个好的终端环境能让人心情愉悦，也能提高效率。2026 年，我的终端配置基本稳定下来了，记录一下供参考。

## Shell 选择

主力使用 Zsh，配合 Oh My Zsh 管理插件。不过近年来也开始关注 [Fish](https://fishshell.com/)，它的自动补全非常智能。

## .bashrc 片段

如果你用 Bash，下面这段配置可以提升体验：

\`\`\`bash
# 更友好的提示符
export PS1="\\[\\e[34m\\]\\w\\[\\e[0m\\] \\[\\e[32m\\]\\$\\[\\e[0m\\] "

# 常用别名
alias ll='ls -alF'
alias ..='cd ..'
alias grep='grep --color=auto'

# 历史记录优化
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTCONTROL=ignoredups
\`\`\`

## 常用工具

- \`fzf\`：模糊查找神器
- \`ripgrep\`：超快的文本搜索
- \`eza\`：更现代的 ls 替代品
- \`zoxide\`：智能目录跳转

## 配色方案

我偏爱低对比度的浅色主题，长时间盯着屏幕不容易疲劳。字体用 JetBrains Mono，等宽和连字符都做得很好。

> 终端配置没有标准答案，适合自己最重要。

花一个下午好好打磨一下终端，回报会超出预期。
`
  }
];

const categories = [...new Set(posts.map(p => p.category))];
