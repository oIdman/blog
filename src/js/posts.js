export const posts = [
  {
    slug: 'hello-world',
    title: 'Hello, World',
    date: '2026-07-16',
    excerpt: 'My first post on this tiny blog. A short introduction and a few things to expect.',
    content: `# Hello, World

This is the first post on my **personal blog**. I built this site from scratch with **pure HTML, CSS, and JavaScript** — no frameworks, no build steps, no external dependencies.

Why go zero-dependency? Because it is:

- **Fast**: no toolchain to wait on.
- **Simple**: the whole site fits in a few files.
- **Portable**: it works anywhere, even opened directly from a file.

I will write about front-end tricks, minimal tools, and the craft of keeping things small. If you want to say hi, drop a line at [email@example.com](mailto:email@example.com).

Thanks for stopping by.
`
  },
  {
    slug: 'markdown-guide',
    title: 'Markdown 写作指南',
    date: '2026-07-15',
    excerpt: 'A quick guide to writing posts in Markdown, covering headings, lists, links, and code.',
    content: `# Markdown 写作指南

Markdown 是一种轻量级的标记语言。它让你用纯文本写出结构清晰的文档。

## 基本语法

**粗体** 用两个星号，*斜体* 用一个星号。

### 列表

无序列表：

- 第一项
- 第二项
- 第三项，带一个 \`inline code\`

有序列表：

1. 先打开编辑器
2. 写下标题
3. 保存为 \`.md\`

### 链接与代码

在文中插入 [链接](https://example.com) 或 \`inline code\`。

代码块：

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## 结语

保持简洁，开始写作吧。
`
  },
  {
    slug: 'zero-dependency-blog',
    title: '零依赖博客的诞生',
    date: '2026-07-14',
    excerpt: '记录如何从零开始，用纯 HTML/CSS/JS 搭建一个可直接在浏览器打开的个人博客。',
    content: `# 零依赖博客的诞生

我一直想拥有一个**足够简单**的博客：没有构建工具，没有 npm 依赖，打开 \`index.html\` 就能看到文章。

## 设计思路

- 用 \`posts.js\` 存放文章数据，每篇都是 \`{ slug, title, date, excerpt, content }\`。
- 自己写一个 \`markdownToHTML\` 函数，把原始 Markdown 转成页面。
- 通过 \`URL hash\` 实现单页路由：\`/#hello-world\`。

## 核心代码

\`blog.js\` 中的解析器支持这些语法：

\`\`\`javascript
function markdownToHTML(md) {
  // 转义 HTML 实体
  let text = md.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');

  // 处理代码块
  text = text.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, ...);

  return text;
}
\`\`\`

## 为什么这样？

1. **可维护**：源文件就这么多，想看哪里点哪里。
2. **可迁移**：所有文章都是纯 Markdown，随时可以导出。
3. **零成本**：GitHub Pages 直接托管，无需构建。

欢迎来到这个最小博客。
`
  }
];
