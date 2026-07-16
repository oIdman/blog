import { posts } from './posts.js';
import { getVersion } from './version.js';

const articleList = document.getElementById('article-list');
const articleView = document.getElementById('article-view');
const articleContent = document.getElementById('article-content');
const siteTitle = document.querySelector('.site-title');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function markdownToHTML(md) {
  // Escape HTML entities so raw Markdown is safe.
  let text = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Extract fenced code blocks first.
  const codeBlocks = [];
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const classAttr = lang ? ` class="language-${lang}"` : '';
    codeBlocks.push(`<pre><code${classAttr}>${code.replace(/\n$/, '')}</code></pre>`);
    return `\nCODEBLOCK${codeBlocks.length - 1}\n`;
  });

  // Inline code.
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Inline emphasis and links.
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  text = text.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const lines = text.split('\n');
  let html = '';
  let inList = null;
  let paraBuffer = [];

  function closeList() {
    if (inList) {
      html += `</${inList}>`;
      inList = null;
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
      const index = parseInt(trimmed.replace('CODEBLOCK', ''), 10);
      html += codeBlocks[index] || '';
      continue;
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      closeList();
      flushParagraph();
      const level = trimmed.match(/^#+/)[0].length;
      const content = trimmed.replace(/^#{1,6}\s+/, '');
      html += `<h${level}>${content}</h${level}>`;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (inList !== 'ul') {
        closeList();
        html += '<ul>';
        inList = 'ul';
      }
      html += `<li>${trimmed.replace(/^[-*]\s+/, '')}</li>`;
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
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
      continue;
    }

    paraBuffer.push(line);
  }

  closeList();
  flushParagraph();
  return html;
}

function getPostSlug() {
  const url = new URL(window.location.href);
  const querySlug = url.searchParams.get('post');
  if (querySlug) return querySlug;
  return window.location.hash.replace(/^#/, '');
}

function renderArticleList() {
  articleView.classList.add('hidden');
  articleList.classList.remove('hidden');
  document.title = 'Tinylogue';

  articleList.innerHTML = '<h1 class="page-heading">Latest Articles</h1>';

  const grid = document.createElement('div');
  grid.className = 'article-grid';

  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.innerHTML = `
      <time class="article-date" datetime="${post.date}">${post.date}</time>
      <h2 class="article-card-title"><a href="#${post.slug}">${escapeHtml(post.title)}</a></h2>
      <p class="article-excerpt">${escapeHtml(post.excerpt)}</p>
      <a class="read-more" href="#${post.slug}">Read article →</a>
    `;
    card.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = post.slug;
      });
    });
    grid.appendChild(card);
  });

  articleList.appendChild(grid);
}

function renderArticle(slug) {
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return renderArticleList();
  }

  articleList.classList.add('hidden');
  articleView.classList.remove('hidden');
  document.title = `${post.title} · Tinylogue`;

  articleContent.innerHTML = `
    <header class="article-header">
      <button class="back-button" type="button" aria-label="Back to article list">← Back</button>
      <time class="article-date" datetime="${post.date}">${post.date}</time>
      <h1 class="article-title">${escapeHtml(post.title)}</h1>
    </header>
    <div class="article-body">
      ${markdownToHTML(post.content)}
    </div>
    <footer class="article-footer">
      <button class="back-button" type="button" aria-label="Back to article list">← Back to articles</button>
    </footer>
  `;

  articleContent.querySelectorAll('.back-button').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.hash = '';
    });
  });
}

function route() {
  const slug = getPostSlug();
  if (slug) {
    renderArticle(slug);
  } else {
    renderArticleList();
  }
}

siteTitle.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.hash = '';
});

window.addEventListener('hashchange', route);

window.addEventListener('DOMContentLoaded', () => {
  const version = document.getElementById('version');
  if (version) {
    version.textContent = getVersion();
  }
  route();
});
