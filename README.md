# blog

一个零依赖、纯前端的个人博客。用 Markdown 写文章，浏览器直接打开看。

## v0.2.0 已实现
- Markdown 文章编辑器（左写右预览双栏）
- 写文章 → 实时预览 → 一键发布到 localStorage
- 编辑/删除已发布文章
- 用户文章与默认示例文章合并显示

## v0.1.0 已实现

- 文章列表首页
- 内置 Markdown 解析器（标题、段落、粗体、斜体、链接、代码、列表）
- 示例文章 "Hello, World"
- 响应式布局
- 开发工作流（AGENTS.md + PROJECT_GOAL.md + 自动化脚本）

## 启动

直接用浏览器打开 `src/index.html`。

## 写文章

在 `posts/` 目录创建 .md 文件，然后在 `src/js/posts.js` 中注册（title + slug + date）。

## 项目结构

```
blog/
├── AGENTS.md          # 工作规则
├── PROJECT_GOAL.md    # 产品上下文
├── README.md          # 本文件
├── posts/             # Markdown 文章
├── .omo/              # 自动化脚本
└── src/               # 博客源代码
    ├── index.html
    ├── css/blog.css
    └── js/
        ├── blog.js    # Markdown 解析 + 页面渲染
        ├── posts.js   # 文章数据
        └── version.js # 版本号
```

## 跨环境继续开发

产品上下文、进度和 Issue 状态保存在 PROJECT_GOAL.md，AGENTS.md 要求新环境在修改前读取。
换电脑后克隆仓库即可恢复开发上下文，不依赖聊天记录。

Issue 处理结果同时写入 PROJECT_GOAL.md 和本文件（双写）。

## 小版本路线

- v0.1.0：项目初始化，基础博客 + Markdown 渲染
