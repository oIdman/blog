import { posts, categories } from './posts.js';
import { getVersion } from './version.js';

const POSTS_PER_PAGE = 5;
const COMMENT_KEY_PREFIX = 'blog-comments-';

const state = {
  currentPage: 1,
  searchQuery: '',
  activeCategory: null,
};

const homePage = document.getElementById('page-home');
const articlePage = document.getElementById('page-article');
const aboutPage = document.getElementById('page-about');
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatNumber(n) {
  return n.toLocaleString('zh-CN');
}

function getPostCommentCount(slug) {
  const stored = getComments(slug);
  return stored.length;
}

function getTotalCommentCount(post) {
  return (post.commentCount || 0) + getPostCommentCount(post.slug);
}

function getComments(slug) {
  try {
    const raw = localStorage.getItem(`${COMMENT_KEY_PREFIX}${slug}`);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveComment(slug, comment) {
  const comments = getComments(slug);
  comments.push(comment);
  localStorage.setItem(`${COMMENT_KEY_PREFIX}${slug}`, JSON.stringify(comments));
}

function markdownToHTML(md) {
  let text = escapeHtml(md);

  const codeBlocks = [];
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'text';
    const trimmedCode = code.replace(/\n$/, '');
    const highlighted = highlightCode(trimmedCode, language);
    codeBlocks.push({ language, code: trimmedCode, highlighted });
    return `\nCODEBLOCK${codeBlocks.length - 1}\n`;
  });

  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  text = text.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  const lines = text.split('\n');
  let html = '';
  let inList = null;
  let inBlockquote = false;
  let paraBuffer = [];

  function closeList() {
    if (inList) {
      html += `</${inList}>`;
      inList = null;
    }
  }

  function closeBlockquote() {
    if (inBlockquote) {
      html += '</blockquote>';
      inBlockquote = false;
    }
  }

  function flushParagraph() {
    if (paraBuffer.length === 0) return;
    const content = paraBuffer.join(' ').trim();
    if (content) {
      html += `<p>${content}</p>`;
    }
    paraBuffer = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('CODEBLOCK')) {
      closeList();
      flushParagraph();
      closeBlockquote();
      const index = parseInt(trimmed.replace('CODEBLOCK', ''), 10);
      const block = codeBlocks[index];
      if (block) {
        html += `<div class="code-block"><button class="code-copy" type="button" data-code="${escapeHtml(block.code)}">复制</button><pre><code class="language-${block.language}">${block.highlighted}</code></pre></div>`;
      }
      continue;
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      closeList();
      flushParagraph();
      closeBlockquote();
      const level = trimmed.match(/^#+/)[0].length;
      const content = trimmed.replace(/^#{1,6}\s+/, '');
      html += `<h${level}>${content}</h${level}>`;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      closeBlockquote();
      flushParagraph();
      if (inList !== 'ul') {
        closeList();
        html += '<ul>';
        inList = 'ul';
      }
      html += `<li>${trimmed.replace(/^[-*]\s+/, '')}</li>`;
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      closeBlockquote();
      flushParagraph();
      if (inList !== 'ol') {
        closeList();
        html += '<ol>';
        inList = 'ol';
      }
      html += `<li>${trimmed.replace(/^\d+\.\s+/, '')}</li>`;
      continue;
    }

    if (trimmed === '') {
      closeList();
      flushParagraph();
      closeBlockquote();
      continue;
    }

    if (trimmed.startsWith('>')) {
      closeList();
      flushParagraph();
      if (!inBlockquote) {
        html += '<blockquote>';
        inBlockquote = true;
      }
      html += `<p>${trimmed.replace(/^>\s?/, '')}</p>`;
      continue;
    }

    if (inBlockquote) {
      html += `<p>${trimmed}</p>`;
      continue;
    }

    paraBuffer.push(line);
  }

  closeList();
  flushParagraph();
  closeBlockquote();
  return html;
}

function highlightCode(code, language) {
  const lang = language.toLowerCase();
  const jsLike = ['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'];
  const pyLike = ['python', 'py'];
  const goLike = ['go', 'golang'];
  const shLike = ['bash', 'sh', 'shell', 'zsh'];

  const keywords = [];
  if (jsLike.includes(lang)) {
    keywords.push('const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'from', 'export', 'default', 'class', 'extends', 'new', 'try', 'catch', 'async', 'await', 'yield');
  } else if (pyLike.includes(lang)) {
    keywords.push('def', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'class', 'try', 'except', 'with', 'as', 'lambda', 'yield', 'pass', 'None', 'True', 'False');
  } else if (goLike.includes(lang)) {
    keywords.push('package', 'import', 'func', 'return', 'if', 'else', 'for', 'range', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan', 'go', 'defer', 'select', 'switch', 'case', 'default');
  } else if (shLike.includes(lang)) {
    keywords.push('if', 'then', 'else', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'export', 'set', 'echo', 'chmod');
  } else {
    return escapeHtml(code);
  }

  const keywordSet = new Set(keywords);
  const tokens = [];
  let rest = code;

  const patterns = [
    { type: 'comment', regex: jsLike.includes(lang) || goLike.includes(lang) ? /^(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/ : pyLike.includes(lang) ? /^(#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?''')/ : shLike.includes(lang) ? /^#[^\n]*/ : null },
    { type: 'string', regex: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/ },
    { type: 'number', regex: /^\b\d+(\.\d+)?\b/ },
    { type: 'word', regex: /^[A-Za-z_$][A-Za-z0-9_$]*/ },
    { type: 'other', regex: /^[^\s]/ },
  ];

  while (rest.length > 0) {
    const leadingSpace = rest.match(/^\s+/);
    if (leadingSpace) {
      tokens.push({ type: 'text', value: leadingSpace[0] });
      rest = rest.slice(leadingSpace[0].length);
      continue;
    }

    let matched = false;
    for (const pattern of patterns) {
      if (!pattern.regex) continue;
      const m = rest.match(pattern.regex);
      if (m) {
        tokens.push({ type: pattern.type, value: m[0] });
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ type: 'text', value: rest[0] });
      rest = rest.slice(1);
    }
  }

  return tokens.map((token) => {
    const value = escapeHtml(token.value);
    if (token.type === 'comment') return `<span class="token-comment">${value}</span>`;
    if (token.type === 'string') return `<span class="token-string">${value}</span>`;
    if (token.type === 'number') return `<span class="token-number">${value}</span>`;
    if (token.type === 'word' && keywordSet.has(token.value)) return `<span class="token-keyword">${value}</span>`;
    return value;
  }).join('');
}

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '') || '/';
  if (hash === '/' || hash === '' || hash === 'home') return { page: 'home' };
  if (hash === 'articles') return { page: 'home' };
  if (hash === 'about') return { page: 'about' };
  if (hash.startsWith('article/')) return { page: 'article', slug: hash.slice(8) };
  return { page: 'home' };
}

function setActiveNav(page) {
  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.classList.toggle('active', link.dataset.route === page);
  });
}

function showPage(pageName) {
  [homePage, articlePage, aboutPage].forEach((el) => el.classList.add('hidden'));
  const target = pageName === 'home' ? homePage : pageName === 'article' ? articlePage : aboutPage;
  target.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  setActiveNav(pageName === 'home' || pageName === 'articles' ? 'home' : pageName);
}

function getFilteredPosts() {
  let result = [...posts];
  if (state.activeCategory) {
    result = result.filter((p) => p.category === state.activeCategory);
  }
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q)
    );
  }
  return result;
}

function renderBanner() {
  const chars = ['{}', '</>', '=>', '==', '!=', '&&', '||', ';', '//', '**', '[]', '()'];
  let spans = '';
  for (let i = 0; i < 18; i++) {
    const char = chars[i % chars.length];
    const left = 3 + (i * 5.3) % 94;
    const top = 8 + (i * 7.7) % 70;
    const rotate = (i * 13) % 40 - 20;
    spans += `<span style="left:${left}%;top:${top}%;transform:rotate(${rotate}deg)">${escapeHtml(char)}</span>`;
  }

  return `
    <section class="banner" aria-label="站点横幅">
      <div class="banner-deco" aria-hidden="true">${spans}</div>
      <h1 class="banner-title">Code, Write, Record</h1>
      <p class="banner-subtitle">一个程序员的写作记录</p>
    </section>
  `;
}

function renderSearch() {
  return `
    <div class="search-bar" role="search">
      <div class="search-input-wrap">
        <input type="search" class="search-input" id="search-input" placeholder="搜索文章标题 / 摘要 / 内容" value="${escapeHtml(state.searchQuery)}" autocomplete="off">
        <button type="button" class="search-clear ${state.searchQuery ? 'visible' : ''}" id="search-clear" aria-label="清空搜索">×</button>
      </div>
      <button type="button" class="btn" id="search-btn">搜索</button>
    </div>
  `;
}

function renderArticleCard(post) {
  const totalComments = getTotalCommentCount(post);
  return `
    <article class="article-card">
      <h2 class="article-card-title"><a href="#/article/${post.slug}">${escapeHtml(post.title)}</a></h2>
      <div class="article-meta">
        <span class="tag" data-category="${escapeHtml(post.category)}" tabindex="0" role="button">${escapeHtml(post.category)}</span>
        <span>${post.date}</span>
        <span>👁 ${formatNumber(post.readCount)}</span>
        <span>💬 ${formatNumber(totalComments)}</span>
      </div>
      <p class="article-excerpt">${escapeHtml(post.excerpt)}</p>
      <a class="read-more" href="#/article/${post.slug}">阅读全文 →</a>
    </article>
  `;
}

function renderPagination(currentPage, totalPages) {
  if (totalPages <= 1) return '';

  let pages = '';
  for (let i = 1; i <= totalPages; i++) {
    pages += `<button type="button" class="page-number ${i === currentPage ? 'current' : ''}" data-page="${i}" aria-label="第 ${i} 页" aria-current="${i === currentPage ? 'page' : 'false'}">${i}</button>`;
  }

  return `
    <nav class="pagination" aria-label="分页">
      <button type="button" class="page-prev" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
      ${pages}
      <button type="button" class="page-next" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    </nav>
  `;
}

function renderSidebar() {
  const categoryRows = categories.map((cat) => {
    const count = posts.filter((p) => p.category === cat).length;
    const active = state.activeCategory === cat ? 'active' : '';
    return `<li class="${active}" data-category="${escapeHtml(cat)}" tabindex="0" role="button"><span>${escapeHtml(cat)}</span><span class="count">${count}</span></li>`;
  }).join('');

  const topPosts = [...posts]
    .sort((a, b) => b.readCount - a.readCount)
    .slice(0, 10);

  const topRows = topPosts.map((post, index) => `
    <li>
      <span class="top-rank">${index + 1}</span>
      <div class="top-info">
        <a class="top-title" href="#/article/${post.slug}">${escapeHtml(post.title)}</a>
        <span class="top-count">👁 ${formatNumber(post.readCount)}</span>
      </div>
    </li>
  `).join('');

  return `
    <aside class="column-side" aria-label="侧边栏">
      <section class="card">
        <div class="card-body">
          <h3 class="card-title">分类</h3>
          <ul class="category-list">${categoryRows}</ul>
        </div>
      </section>
      <section class="card">
        <div class="card-body">
          <h3 class="card-title">热门 TOP 10</h3>
          <ol class="top-list">${topRows}</ol>
        </div>
      </section>
    </aside>
  `;
}

function bindHomeEvents() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const searchClear = document.getElementById('search-clear');

  function doSearch() {
    const query = searchInput.value.trim();
    state.searchQuery = query;
    state.currentPage = 1;
    renderHome();
  }

  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
  searchClear.addEventListener('click', () => {
    state.searchQuery = '';
    state.currentPage = 1;
    renderHome();
  });

  document.querySelectorAll('.category-list li').forEach((item) => {
    item.addEventListener('click', () => {
      const cat = item.dataset.category;
      if (state.activeCategory === cat) {
        state.activeCategory = null;
      } else {
        state.activeCategory = cat;
      }
      state.currentPage = 1;
      renderHome();
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  document.querySelectorAll('.tag[data-category]').forEach((tag) => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cat = tag.dataset.category;
      state.activeCategory = state.activeCategory === cat ? null : cat;
      state.currentPage = 1;
      renderHome();
    });
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tag.click();
      }
    });
  });

  document.querySelectorAll('.pagination button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      state.currentPage = parseInt(btn.dataset.page, 10);
      renderHome();
    });
  });
}

function renderHome() {
  const filtered = getFilteredPosts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const page = Math.min(state.currentPage, totalPages);
  const start = (page - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);

  let filterBar = '';
  if (state.activeCategory) {
    filterBar = `
      <div class="filter-bar">
        <span>分类过滤：</span>
        <strong>${escapeHtml(state.activeCategory)}</strong>
        <button type="button" id="clear-filter">清除</button>
      </div>
    `;
  }

  const articlesHtml = pagePosts.length
    ? pagePosts.map(renderArticleCard).join('')
    : '<div class="empty-state">没有找到匹配的文章</div>';

  const paginationHtml = state.searchQuery ? '' : renderPagination(page, totalPages);
  const sidebarHtml = state.searchQuery ? '' : renderSidebar();

  homePage.innerHTML = `
    ${renderBanner()}
    ${renderSearch()}
    ${filterBar}
    <div class="two-column">
      <section class="column-main" aria-label="文章列表">
        <div class="article-list">${articlesHtml}</div>
        ${paginationHtml}
      </section>
      ${sidebarHtml}
    </div>
  `;

  showPage('home');

  document.title = state.searchQuery
    ? `搜索：${state.searchQuery} · DevLog`
    : state.activeCategory
      ? `${state.activeCategory} · DevLog`
      : 'DevLog';

  bindHomeEvents();

  const clearFilter = document.getElementById('clear-filter');
  if (clearFilter) {
    clearFilter.addEventListener('click', () => {
      state.activeCategory = null;
      state.currentPage = 1;
      renderHome();
    });
  }
}

function bindCodeCopy() {
  document.querySelectorAll('.code-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = btn.dataset.code;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = '已复制';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '复制';
          btn.classList.remove('copied');
        }, 1800);
      } catch (_) {
        btn.textContent = '复制失败';
        setTimeout(() => {
          btn.textContent = '复制';
        }, 1800);
      }
    });
  });
}

function renderCommentForm(post) {
  const totalComments = getTotalCommentCount(post);
  const storedComments = getComments(post.slug);

  let commentsHtml = '';
  if (storedComments.length === 0) {
    commentsHtml = '<div class="comment-empty">还没有评论，来抢沙发吧</div>';
  } else {
    commentsHtml = storedComments.slice().reverse().map((c) => `
      <article class="comment-item">
        <div class="comment-header">
          <span class="comment-author">${escapeHtml(c.nickname)}</span>
          <time class="comment-time">${escapeHtml(c.time)}</time>
        </div>
        <div class="comment-body">${escapeHtml(c.content)}</div>
      </article>
    `).join('');
  }

  articlePage.querySelector('.comments-section').innerHTML = `
    <h3 class="comments-title">评论 (${formatNumber(totalComments)})</h3>
    <form class="comment-form" id="comment-form">
      <div class="comment-form-row">
        <label for="comment-nickname">昵称</label>
        <input type="text" id="comment-nickname" maxlength="20" placeholder="你的昵称" required>
      </div>
      <div class="comment-form-row">
        <label for="comment-content">评论内容</label>
        <textarea id="comment-content" placeholder="写下你的评论..." required></textarea>
      </div>
      <button type="submit" class="btn">提交评论</button>
    </form>
    <div class="comment-list">${commentsHtml}</div>
  `;

  document.getElementById('comment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = document.getElementById('comment-nickname').value.trim();
    const content = document.getElementById('comment-content').value.trim();
    if (!nickname || !content) return;

    const now = new Date();
    const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    saveComment(post.slug, { nickname, content, time });
    renderCommentForm(post);
  });
}

function renderArticle(slug) {
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    window.location.hash = '#/';
    return;
  }

  const totalComments = getTotalCommentCount(post);

  articlePage.innerHTML = `
    <article class="article-container">
      <button type="button" class="article-back" id="article-back">← 返回列表</button>
      <header>
        <h1 class="article-detail-title">${escapeHtml(post.title)}</h1>
        <div class="article-meta article-detail-meta">
          <span class="tag">${escapeHtml(post.category)}</span>
          <span>${post.date}</span>
          <span>👁 ${formatNumber(post.readCount)}</span>
          <span>💬 ${formatNumber(totalComments)}</span>
        </div>
      </header>
      <div class="article-body">
        ${markdownToHTML(post.content)}
      </div>
    </article>
    <hr class="section-divider">
    <section class="comments-section" aria-label="评论区"></section>
  `;

  showPage('article');
  document.title = `${post.title} · DevLog`;

  document.getElementById('article-back').addEventListener('click', () => {
    window.location.hash = '#/';
  });

  bindCodeCopy();
  renderCommentForm(post);
}

function renderAbout() {
  aboutPage.innerHTML = `
    <div class="about-container">
      <h1 class="about-title">关于我</h1>

      <section class="profile-card">
        <div class="avatar" aria-hidden="true">👨‍💻</div>
        <div class="profile-info">
          <h2>DevLogger</h2>
          <p>后端开发 / 开源爱好者 / 效率工具控</p>
        </div>
      </section>

      <section class="about-section">
        <h3>技术栈</h3>
        <div class="chips">
          <span class="chip">Go</span>
          <span class="chip">Python</span>
          <span class="chip">Vue</span>
          <span class="chip">MySQL</span>
          <span class="chip">Docker</span>
          <span class="chip">Git</span>
          <span class="chip">Redis</span>
          <span class="chip">Linux</span>
        </div>
      </section>

      <section class="about-section">
        <h3>个人介绍</h3>
        <p>你好，我是一名热爱技术的后端开发者，日常工作主要围绕高可用服务、数据库优化和开发工具链建设展开。我相信好的代码应该像好文章一样清晰易读，因此一直坚持写技术博客来整理思路。</p>
        <p>这个博客完全由纯 HTML、CSS 和 JavaScript 构建，没有使用任何前端框架或第三方依赖。之所以选择这种方式，是因为我希望它能像一本打开的笔记本一样，简单、快速、随时随地可读。</p>
        <p>平时除了写代码，我也喜欢折腾终端工具、阅读技术书籍和参与开源社区。如果你对我的文章有任何想法，欢迎在评论区留言交流。</p>
      </section>

      <section class="about-section">
        <h3>开源项目</h3>
        <div class="project-grid">
          <article class="project-card">
            <h4>tiny-cache</h4>
            <p>一个基于 Go 实现的高性能本地缓存库，支持 TTL、LRU 淘汰和并发安全。</p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">查看仓库 →</a>
          </article>
          <article class="project-card">
            <h4>md-reader</h4>
            <p>轻量级 Markdown 渲染器，零依赖，可直接在浏览器中运行。</p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">查看仓库 →</a>
          </article>
          <article class="project-card">
            <h4>cli-helper</h4>
            <p>收集日常开发中常用的 Shell 脚本和命令行小技巧。</p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">查看仓库 →</a>
          </article>
        </div>
      </section>

      <section class="about-section">
        <h3>联系方式</h3>
        <ul class="contact-list">
          <li><span>🐙</span> <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><span>🐴</span> <a href="https://gitee.com" target="_blank" rel="noopener noreferrer">Gitee</a></li>
          <li><span>✉️</span> <a href="mailto:devlog@example.com">devlog@example.com</a></li>
          <li><span>📙</span> <a href="https://juejin.cn" target="_blank" rel="noopener noreferrer">掘金</a></li>
        </ul>
      </section>
    </div>
  `;

  showPage('about');
  document.title = '关于我 · DevLog';
}

function render() {
  const route = parseRoute();
  if (route.page === 'article') {
    renderArticle(route.slug);
  } else if (route.page === 'about') {
    renderAbout();
  } else {
    renderHome();
  }

  if (siteNav.classList.contains('open')) {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
}

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav.classList.toggle('open', !expanded);
});

window.addEventListener('hashchange', render);

window.addEventListener('DOMContentLoaded', () => {
  const version = document.getElementById('version');
  if (version) {
    version.textContent = getVersion();
  }
  render();
});
