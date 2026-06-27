// MAIN.JS - Shared logic for all pages

onAppReady(() => {
  initHeaderAuth();
  initAdminLinks();
  updateCartCount();
  updateWishlistCount();
  buildMegaMenu();
  initScrollEffects();
  initGlobalSearch();
  initHomepageSections();
});

function initAdminLinks() {
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';
  document.querySelectorAll('.admin-only-link').forEach(link => {
    link.classList.toggle('is-visible', isAdmin);
    link.setAttribute('aria-hidden', isAdmin ? 'false' : 'true');
    link.tabIndex = isAdmin ? 0 : -1;
  });
}
function initHeaderAuth() {
  const user = getCurrentUser();
  document.querySelectorAll('.header-actions a[href="login.html"]').forEach(link => {
    if (!user) {
      link.innerHTML = '<span class="icon"><i class="fa-solid fa-user"></i></span><span class="label">Tài khoản</span>';
      return;
    }

    const name = user.fullname || user.email || 'Tài khoản';
    const nameParts = String(name).trim().split(/\s+/).filter(Boolean);
    const displayName = nameParts.length > 2 ? nameParts.slice(-2).join(' ') : name;
    const shortName = displayName.length > 12 ? `${displayName.slice(0, 11)}…` : displayName;
    link.href = '#';
    link.classList.add('is-authenticated');
    link.title = `${name} - Tài khoản`;
    link.innerHTML = `
      <span class="icon"><i class="fa-solid fa-circle-user"></i></span>
      <span class="label">${shortName}</span>
      <span class="auth-menu" role="menu">
        <span class="auth-menu-name">${shortName}</span>
        <button type="button" class="auth-menu-logout" role="menuitem">
          <i class="fa-solid fa-right-from-bracket"></i>
          Đăng xuất
        </button>
      </span>
    `;
    const menu = link.querySelector('.auth-menu');
    const logoutButton = link.querySelector('.auth-menu-logout');
    link.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      menu?.classList.toggle('is-open');
    });
    logoutButton?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      logoutUser('login.html');
    });
    document.addEventListener('click', () => menu?.classList.remove('is-open'));
  });
}
// MEGA MENU (Shared)
function buildMegaMenu() {
  const menu = document.getElementById('mega-menu-pc');
  if (!menu) return;
  const pcCategories = CATEGORIES.filter(c =>
    ['CPU', 'GPU', 'Mainboard', 'RAM', 'SSD', 'PSU', 'Case', 'Cooling'].includes(c.key)
  );
  menu.innerHTML = pcCategories.map(c =>
    `<a href="products.html?category=${c.key}"><i class="fa-solid ${c.icon}"></i> ${c.label}</a>`
  ).join('');
}

// SCROLL EFFECTS
function initScrollEffects() {
  const header = document.getElementById('header');
  let scrollTop = document.getElementById('scroll-top');

  // Dynamically create scroll-top button if it doesn't exist on the page
  if (!scrollTop) {
    scrollTop = document.createElement('button');
    scrollTop.className = 'scroll-top';
    scrollTop.id = 'scroll-top';
    scrollTop.setAttribute('aria-label', 'Scroll to top');
    scrollTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    scrollTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(scrollTop);
  } else if (!scrollTop.innerHTML.trim()) {
    // Inject icon if the element exists but is empty
    scrollTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (scrollTop) scrollTop.classList.toggle('show', y > 400);
  });
}

// MOBILE MENU
function toggleMobileMenu() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('show');
}

// GLOBAL SEARCH
function initGlobalSearch() {
  document.querySelectorAll('[data-global-search]').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleGlobalSearch();
    });
  });
}

function handleGlobalSearch() {
  const input = document.querySelector('[data-global-search]');
  if (input && input.value.trim()) {
    window.location.href = `products.html?q=${encodeURIComponent(input.value.trim())}`;
  }
}

// HOMEPAGE SECTIONS
function initHomepageSections() {
  const products = getProducts();

  renderQuickCategories();
  renderCategoryGrid();
  renderFeaturedProducts(products);
  renderDealProducts(products);
  renderBlogLatest();
  renderBrands();
  initSlider();
  initCountdown();
}

// --- Quick Categories ---
function renderQuickCategories() {
  const el = document.querySelector('[data-category-quick]');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c =>
    `<a class="category-quick-item" href="products.html?category=${c.key}">
      <div class="cq-icon"><i class="fa-solid ${c.icon}"></i></div>
      <span class="cq-label">${c.label}</span>
    </a>`
  ).join('');
}

// --- Category Grid ---
function renderCategoryGrid() {
  const el = document.querySelector('[data-category-grid]');
  if (!el) return;
  const products = getProducts();
  const topCats = ['CPU', 'GPU', 'RAM', 'SSD'];
  el.innerHTML = topCats.map(key => {
    const cat = CATEGORIES.find(c => c.key === key);
    const count = products.filter(p => p.category === key).length;
    return `<a class="category-card" href="products.html?category=${key}">
      <div class="cat-icon"><i class="fa-solid ${cat.icon}"></i></div>
      <span class="cat-key">${key}</span>
      <div class="cat-name">${cat.label}</div>
      <span class="cat-count">${count} sản phẩm</span>
    </a>`;
  }).join('');
}

// --- Featured Products ---
function renderFeaturedProducts(products) {
  const el = document.querySelector('[data-featured-products]');
  if (!el) return;
  const featured = products.filter(p => p.badge === 'bestseller' || p.rating >= 4.7).slice(0, 5);
  el.innerHTML = featured.map(renderProductCard).join('');
}

// --- Deal Products ---
function renderDealProducts(products) {
  const el = document.querySelector('[data-deal-products]');
  if (!el) return;
  const deals = products.filter(p => p.oldPrice && getDiscount(p.price, p.oldPrice) >= 8).slice(0, 4);
  el.innerHTML = deals.map(renderProductCard).join('');
}

// --- Blog Latest ---
function renderBlogLatest() {
  const el = document.querySelector('[data-blog-latest]');
  if (!el || typeof BLOG_POSTS === 'undefined') return;
  el.innerHTML = BLOG_POSTS.slice(0, 3).map(renderBlogCard).join('');
}

// --- Brands ---
function renderBrands() {
  const el = document.querySelector('[data-brands]');
  if (!el) return;
  const topBrands = ['Intel', 'AMD', 'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'G.Skill', 'Samsung', 'Logitech', 'Razer'];
  el.innerHTML = topBrands.map(b =>
    `<a class="brand-item" href="products.html?brand=${encodeURIComponent(b)}">${b}</a>`
  ).join('');
}

// PRODUCT CARD RENDERER (Shared)
function renderProductCard(p) {
  const disc = getDiscount(p.price, p.oldPrice);
  const wl = isInWishlist(p.id);
  const badgeClass = p.badge || 'new';
  const badgeText = getBadgeText(p);

  return `<article class="product-card">
    <div class="product-card-image">
      ${(p.badge && p.badge !== 'sale') ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : ''}
      ${disc > 0 ? `<span class="product-discount">-${disc}%</span>` : ''}
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-actions-overlay">
        <button class="btn-icon" title="Xem nhanh" onclick="window.location='product.html?id=${p.id}'" title="Xem nhanh"><i class="fa-regular fa-eye"></i></button>
      </div>
    </div>
    <div class="product-card-body">
      <span class="product-card-category">${p.category}</span>
      <h3 class="product-card-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="product-card-spec">${p.spec || ''}</p>
      <div class="product-card-price">
        <span class="current">${money(p.price)}</span>
        ${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ''}
      </div>
      <div class="product-card-footer">
        <button class="btn-cart" onclick="addToCart(${p.id})">Thêm vào giỏ</button>
        <button class="btn-wishlist ${wl ? 'active' : ''}" data-wishlist="${p.id}" onclick="toggleWishlist(${p.id})">${wl ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}</button>
      </div>
    </div>
  </article>`;
}

// BLOG CARD RENDERER (Shared)
function renderBlogCard(post) {
  const date = new Date(post.date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  return `<article class="blog-card">
    <div class="blog-card-image">
      <img src="${post.image}" alt="${post.title}" loading="lazy">
    </div>
    <div class="blog-card-body">
      <div class="blog-card-meta">
        <span class="tag">${post.category}</span>
        <span>${date}</span>
        <span>${post.readTime}</span>
      </div>
      <h3 class="blog-card-title"><a href="#">${post.title}</a></h3>
      <p class="blog-card-excerpt">${post.excerpt}</p>
    </div>
    <div class="blog-card-footer">
      <span class="text-muted">${post.author}</span>
      <a class="read-more" href="#">Đọc tiếp </a>
    </div>
  </article>`;
}

// HERO SLIDER
let currentSlide = 0;
let sliderInterval = null;

function initSlider() {
  const track = document.getElementById('slider-track');
  if (!track) return;

  const slides = track.querySelectorAll('.slider-slide');
  const dotsContainer = document.getElementById('slider-dots');

  if (dotsContainer) {
    dotsContainer.innerHTML = Array.from(slides).map((_, i) =>
      `<div class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>`
    ).join('');
  }

  autoSlide();
}

function slideHero(dir) {
  const track = document.getElementById('slider-track');
  if (!track) return;
  const total = track.querySelectorAll('.slider-slide').length;
  currentSlide = (currentSlide + dir + total) % total;
  updateSlider();
  autoSlide();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
  autoSlide();
}

function updateSlider() {
  const track = document.getElementById('slider-track');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function autoSlide() {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(() => slideHero(1), 5000);
}

// COUNTDOWN TIMER
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  // Set end time to midnight tonight
  const now = new Date();
  const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  function tick() {
    const remaining = Math.max(0, endTime - Date.now());
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);

    const hEl = el.querySelector('[data-hours]');
    const mEl = el.querySelector('[data-minutes]');
    const sEl = el.querySelector('[data-seconds]');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}
