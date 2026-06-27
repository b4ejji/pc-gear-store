// PRODUCT.JS - Product detail page logic

onAppReady(() => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const products = getProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    document.querySelector('[data-detail]').innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon"></div>
        <h2>Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
        <a class="btn btn-primary" href="products.html">Quay lại cửa hàng</a>
      </div>`;
    return;
  }

  // Update page title & breadcrumb
  document.title = `${product.name} | PC Gear Store`;
  const breadcrumbName = document.querySelector('[data-breadcrumb-name]');
  if (breadcrumbName) breadcrumbName.textContent = product.name;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = `${product.name} - ${product.spec || ''}. Giá ${money(product.price)}. Mua linh kiện PC chính hãng tại PC Gear Store.`;

  renderDetail(product);
  renderTabs(product);
  renderRelated(product, products);
  initDetailInteractions(product);
});

function renderDetail(p) {
  const container = document.querySelector('[data-detail]');
  const disc = getDiscount(p.price, p.oldPrice);
  const wl = isInWishlist(p.id);

  container.innerHTML = `
    <!-- Gallery -->
    <div class="detail-gallery">
      <div class="detail-main-image">
        ${p.badge ? `<span class="product-badge ${p.badge}">${p.badgeText || p.badge}</span>` : ''}
        <img src="${p.image}" alt="${p.name}" id="detail-main-img">
      </div>
      <div class="detail-thumbnails">
        <div class="detail-thumb active" onclick="changeMainImage('${p.image}', this)">
          <img src="${p.image}" alt="Thumbnail 1">
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="detail-info">
      <span class="product-card-category">${p.category} · ${p.brand || ''}</span>
      <h1>${p.name}</h1>
      <div class="detail-rating">
        <span class="stars">${renderStars(p.rating || 0)}</span>
        <span>${p.rating || 0}/5</span>
        <span>·</span>
        <span>${p.reviews || 0} đánh giá</span>
      </div>

      <div class="detail-price-box">
        <span class="price-current">${money(p.price)}</span>
        ${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ''}
        ${disc > 0 ? `<span class="discount-pct">-${disc}%</span>` : ''}
        <div class="detail-stock">
          Tình trạng: ${p.stock > 0
      ? `<span class="in-stock">Còn hàng (${p.stock})</span>`
      : `<span class="out-stock">Hết hàng</span>`}
        </div>
      </div>

      ${p.specs ? `<ul class="detail-specs-quick">
        ${Object.entries(p.specs).slice(0, 5).map(([k, v]) =>
        `<li><span class="spec-icon"></span><span class="spec-label">${k}</span><span class="spec-value">${v}</span></li>`
      ).join('')}
      </ul>` : ''}

      <div class="detail-qty">
        <label>Số lượng:</label>
        <div class="qty-control">
          <button onclick="changeQty(-1)">−</button>
          <input type="number" value="1" min="1" max="${p.stock || 99}" id="detail-qty">
          <button onclick="changeQty(1)">+</button>
        </div>
      </div>

      <div class="detail-actions">
        <button class="btn btn-primary" onclick="addDetailToCart(${p.id})" ${p.stock <= 0 ? 'disabled' : ''}>Thêm vào giỏ</button>
        <button class="btn btn-outline ${wl ? 'active' : ''}" id="detail-wishlist" data-wishlist="${p.id}" onclick="toggleWishlist(${p.id})" style="height:52px;padding:0 20px;font-size:16px;font-weight:600">${wl ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}</button>
      </div>

      <div class="detail-meta">
        <span><strong>Danh mục:</strong> <a href="products.html?category=${p.category}" style="color:var(--primary)">${p.category}</a></span>
        ${p.brand ? `<span><strong>Thương hiệu:</strong> <a href="products.html?brand=${encodeURIComponent(p.brand)}" style="color:var(--primary)">${p.brand}</a></span>` : ''}
        <span><strong>Mã SP:</strong> PCG-${String(p.id).padStart(4, '0')}</span>
      </div>
    </div>`;
}

function renderTabs(p) {
  // Specs Tab
  const specsPanel = document.querySelector('[data-tab-panel="specs"]');
  if (specsPanel && p.specs) {
    specsPanel.innerHTML = `<table class="specs-table">
      ${Object.entries(p.specs).map(([k, v]) =>
      `<tr><td>${k}</td><td>${v}</td></tr>`
    ).join('')}
    </table>`;
  }

  // Description Tab
  const descPanel = document.querySelector('[data-tab-panel="desc"]');
  if (descPanel) {
    descPanel.innerHTML = `
      <div style="max-width:720px;line-height:1.8;color:var(--text-secondary)">
        <h3 style="margin-bottom:12px;color:var(--text)">${p.name}</h3>
        <p>${p.desc || 'Chưa có mô tả chi tiết cho sản phẩm này.'}</p>
        <p style="margin-top:16px"><strong>Chế độ bảo hành:</strong> 12-36 tháng chính hãng tùy sản phẩm.</p>
        <p><strong>Giao hàng:</strong> Giao nhanh nội thành 2h, toàn quốc 1-3 ngày.</p>
      </div>`;
  }

  // Tab switching
  document.querySelectorAll('[data-tab-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tabBtn;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`[data-tab-panel="${tab}"]`)?.classList.add('active');
    });
  });
}

function renderRelated(product, allProducts) {
  const container = document.querySelector('[data-related]');
  if (!container) return;
  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 5);
  container.innerHTML = related.map(renderProductCard).join('');
}

// INTERACTIONS
function initDetailInteractions(product) { }

function changeQty(delta) {
  const input = document.getElementById('detail-qty');
  if (!input) return;
  const newVal = Math.max(1, Math.min(Number(input.max), Number(input.value) + delta));
  input.value = newVal;
}

function handleBuyNow(id) {
  const qty = Number(document.getElementById('detail-qty')?.value || 1);
  addToCart(id, qty);
}

function addDetailToCart(id) {
  const input = document.getElementById('detail-qty');
  const max = Number(input?.max || 1);
  const qty = Math.max(1, Math.min(max, Number(input?.value) || 1));
  if (input) input.value = qty;
  addToCart(id, qty);
}

function changeMainImage(src, thumb) {
  const img = document.getElementById('detail-main-img');
  if (img) img.src = src;
  document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
  if (thumb) thumb.classList.add('active');
}
