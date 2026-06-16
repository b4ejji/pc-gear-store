// SHOP.JS - Product listing page logic

(function () {
  const PER_PAGE = 10;
  let currentPage = 1;
  let filteredProducts = [];

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initFilters();
    initSort();
    initPriceRange();
    applyFilters();
  }

  // ============================================
  // FILTERS
  // ============================================
  function initFilters() {
    const catContainer = document.querySelector('[data-filter-categories]');
    const brandContainer = document.querySelector('[data-filter-brands]');
    const products = getProducts();

    if (catContainer) {
      catContainer.innerHTML = CATEGORIES.map(c => {
        const count = products.filter(p => p.category === c.key).length;
        return `<label><input type="checkbox" value="${c.key}" data-filter="category"> <i class="fa-solid ${c.icon}"></i> ${c.label} (${count})</label>`;
      }).join('');
    }

    if (brandContainer) {
      const activeBrands = [...new Set(products.map(p => p.brand))].sort();
      brandContainer.innerHTML = activeBrands.map(b =>
        `<label><input type="checkbox" value="${b}" data-filter="brand"> ${b}</label>`
      ).join('');
    }

    // Apply URL params
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const brand = params.get('brand');
    const q = params.get('q');

    if (cat) {
      document.querySelectorAll('[data-filter="category"]').forEach(cb => {
        if (cb.value === cat) cb.checked = true;
      });
      const breadcrumb = document.querySelector('[data-breadcrumb-current]');
      const catObj = CATEGORIES.find(c => c.key === cat);
      if (breadcrumb && catObj) breadcrumb.textContent = catObj.label;
    }
    if (brand) {
      document.querySelectorAll('[data-filter="brand"]').forEach(cb => {
        if (cb.value === brand) cb.checked = true;
      });
    }
    if (q) {
      const searchInput = document.querySelector('[data-global-search]');
      if (searchInput) searchInput.value = q;
    }

    // Listen for filter changes
    document.querySelectorAll('[data-filter]').forEach(cb =>
      cb.addEventListener('change', () => { currentPage = 1; applyFilters(); })
    );
  }

  function initSort() {
    const sortEl = document.querySelector('[data-sort]');
    if (sortEl) sortEl.addEventListener('change', () => applyFilters());
  }

  function initPriceRange() {
    const rangeEl = document.querySelector('[data-price-range]');
    const display = document.querySelector('[data-price-max]');
    if (!rangeEl) return;
    rangeEl.addEventListener('input', () => {
      if (display) display.textContent = money(Number(rangeEl.value));
      currentPage = 1;
      applyFilters();
    });
  }

  // ============================================
  // APPLY FILTERS & RENDER
  // ============================================
  function applyFilters() {
    let products = getProducts();
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');

    // Search query
    if (q) {
      const search = q.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        (p.brand && p.brand.toLowerCase().includes(search)) ||
        (p.spec && p.spec.toLowerCase().includes(search))
      );
    }

    // Category filter
    const checkedCats = [...document.querySelectorAll('[data-filter="category"]:checked')].map(cb => cb.value);
    if (checkedCats.length) products = products.filter(p => checkedCats.includes(p.category));

    // Brand filter
    const checkedBrands = [...document.querySelectorAll('[data-filter="brand"]:checked')].map(cb => cb.value);
    if (checkedBrands.length) products = products.filter(p => checkedBrands.includes(p.brand));

    // Price range
    const rangeEl = document.querySelector('[data-price-range]');
    if (rangeEl) {
      const maxPrice = Number(rangeEl.value);
      products = products.filter(p => p.price <= maxPrice);
    }

    // Sort
    const sortEl = document.querySelector('[data-sort]');
    const sortVal = sortEl ? sortEl.value : 'default';
    switch (sortVal) {
      case 'price-asc': products.sort((a, b) => a.price - b.price); break;
      case 'price-desc': products.sort((a, b) => b.price - a.price); break;
      case 'name': products.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'rating': products.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }

    filteredProducts = products;

    // Update count
    const countEl = document.querySelector('[data-result-count]');
    if (countEl) countEl.textContent = products.length;

    renderProducts();
    renderPagination();
  }

  function renderProducts() {
    const container = document.querySelector('[data-products]');
    if (!container) return;

    const start = (currentPage - 1) * PER_PAGE;
    const pageItems = filteredProducts.slice(start, start + PER_PAGE);

    if (!pageItems.length) {
      container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon"></div>
        <h2>Không tìm thấy sản phẩm</h2>
        <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        <button class="btn btn-primary" onclick="resetFilters()">Xóa bộ lọc</button>
      </div>`;
      return;
    }

    container.innerHTML = pageItems.map(renderProductCard).join('');
  }

  function renderPagination() {
    const container = document.querySelector('[data-pagination]');
    if (!container) return;

    const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    let html = '';
    html += `<button ${currentPage <= 1 ? 'disabled' : ''} onclick="shopGoPage(${currentPage - 1})"></button>`;
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 7 && i > 3 && i < totalPages - 1 && Math.abs(i - currentPage) > 1) {
        if (i === 4 || i === totalPages - 2) html += `<button disabled>…</button>`;
        continue;
      }
      html += `<button class="${i === currentPage ? 'active' : ''}" onclick="shopGoPage(${i})">${i}</button>`;
    }
    html += `<button ${currentPage >= totalPages ? 'disabled' : ''} onclick="shopGoPage(${currentPage + 1})"></button>`;
    container.innerHTML = html;
  }

  // View mode toggle
  window.setViewMode = function (mode) {
    const grid = document.querySelector('[data-products]');
    if (!grid) return;
    document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-view="${mode}"]`)?.classList.add('active');
    if (mode === 'list') {
      grid.style.gridTemplateColumns = '1fr';
    } else {
      grid.style.gridTemplateColumns = '';
    }
  };

  // Global functions
  window.shopGoPage = function (page) {
    currentPage = page;
    renderProducts();
    renderPagination();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  window.resetFilters = function () {
    document.querySelectorAll('[data-filter]').forEach(cb => cb.checked = false);
    const rangeEl = document.querySelector('[data-price-range]');
    if (rangeEl) rangeEl.value = rangeEl.max;
    const display = document.querySelector('[data-price-max]');
    if (display && rangeEl) display.textContent = money(Number(rangeEl.max));
    const sortEl = document.querySelector('[data-sort]');
    if (sortEl) sortEl.value = 'default';
    // Clear URL params
    if (window.location.search) window.history.replaceState({}, '', window.location.pathname);
    currentPage = 1;
    applyFilters();
  };
})();
