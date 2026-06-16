// BLOG.JS - Blog page logic

document.addEventListener('DOMContentLoaded', () => {
  renderBlog();
  initBlogFilter();
});

function renderBlog(filter = 'all') {
  const grid = document.querySelector('[data-blog-grid]');
  const countEl = document.querySelector('[data-blog-count]');
  if (!grid) return;

  let posts = typeof BLOG_POSTS !== 'undefined' ? BLOG_POSTS : [];
  if (filter !== 'all') {
    posts = posts.filter(p => p.category === filter);
  }

  if (countEl) countEl.textContent = posts.length;

  if (!posts.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon"><i class="fa-solid fa-file-lines"></i></div>
      <h2>Chưa có bài viết</h2>
      <p>Danh mục này chưa có bài viết nào.</p>
    </div>`;
    return;
  }

  grid.innerHTML = posts.map(renderBlogCard).join('');
}

function initBlogFilter() {
  const select = document.querySelector('[data-blog-filter]');
  if (!select) return;
  select.addEventListener('change', () => renderBlog(select.value));
}
