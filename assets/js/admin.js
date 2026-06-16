// ADMIN.JS - Admin dashboard logic

document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderAdminTable();
  initAdminForm();
  initAdminSearch();
});

// STATS
function renderStats() {
  const products = getProducts();
  const statProducts = document.querySelector('[data-stat-products]');
  const statStock = document.querySelector('[data-stat-stock]');
  const statCats = document.querySelector('[data-stat-categories]');

  if (statProducts) statProducts.textContent = products.length;
  if (statStock) statStock.textContent = products.reduce((s, p) => s + (p.stock || 0), 0);
  if (statCats) statCats.textContent = [...new Set(products.map(p => p.category))].length;
}

// ADMIN TABLE
function renderAdminTable(filter = '') {
  const tbody = document.querySelector('[data-admin-products]');
  if (!tbody) return;

  let products = getProducts();
  if (filter) {
    const search = filter.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search) ||
      (p.brand && p.brand.toLowerCase().includes(search))
    );
  }

  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted)">Không tìm thấy sản phẩm nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img class="table-img" src="${p.image}" alt="${p.name}"></td>
      <td>
        <strong style="display:block;margin-bottom:2px">${p.name}</strong>
        <small style="color:var(--text-muted)">${p.brand || ''} · ${p.spec ? p.spec.slice(0, 40) + '...' : ''}</small>
      </td>
      <td><span style="padding:3px 8px;border-radius:4px;background:var(--bg-alt);font-size:12px;font-weight:700">${p.category}</span></td>
      <td class="text-price">${money(p.price)}</td>
      <td>${p.stock || 0}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-ghost" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen"></i> Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i> Xóa</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ADMIN FORM
function initAdminForm() {
  const form = document.querySelector('[data-product-form]');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const products = getProducts();
    const editId = data.get('id');

    const product = {
      id: editId ? Number(editId) : Date.now(),
      name: data.get('name'),
      category: data.get('category'),
      brand: data.get('brand'),
      price: Number(data.get('price')),
      oldPrice: Number(data.get('oldPrice')) || null,
      stock: Number(data.get('stock')),
      badge: data.get('badge'),
      badgeText: { new: 'Mới', hot: 'Hot', sale: 'Giảm giá', bestseller: 'Best Seller' }[data.get('badge')],
      spec: data.get('spec'),
      desc: data.get('desc'),
      image: 'assets/img/' + data.get('image'),
      images: ['assets/img/' + data.get('image')],
      rating: 4.5,
      reviews: 0,
      specs: {}
    };

    if (editId) {
      const idx = products.findIndex(p => p.id === Number(editId));
      if (idx !== -1) {
        // Preserve existing specs, rating, reviews
        product.specs = products[idx].specs || {};
        product.rating = products[idx].rating;
        product.reviews = products[idx].reviews;
        products[idx] = product;
      }
    } else {
      products.push(product);
    }

    saveProducts(products);
    resetForm();
    renderAdminTable();
    renderStats();
    showToast(editId ? '<i class="fa-solid fa-circle-check"></i> Đã cập nhật sản phẩm' : '<i class="fa-solid fa-circle-check"></i> Đã thêm sản phẩm mới');
  });
}

function editProduct(id) {
  const products = getProducts();
  const p = products.find(pr => pr.id === id);
  if (!p) return;

  const form = document.querySelector('[data-product-form]');
  form.querySelector('[name="id"]').value = p.id;
  form.querySelector('[name="name"]').value = p.name;
  form.querySelector('[name="category"]').value = p.category;
  form.querySelector('[name="brand"]').value = p.brand || '';
  form.querySelector('[name="price"]').value = p.price;
  form.querySelector('[name="oldPrice"]').value = p.oldPrice || '';
  form.querySelector('[name="stock"]').value = p.stock || 0;
  form.querySelector('[name="badge"]').value = p.badge || 'new';
  form.querySelector('[name="spec"]').value = p.spec || '';
  form.querySelector('[name="desc"]').value = p.desc || '';
  
  // Extract image filename
  const imgFile = p.image.replace('assets/img/', '');
  const imgSelect = form.querySelector('[name="image"]');
  if (imgSelect) {
    const opt = [...imgSelect.options].find(o => o.value === imgFile);
    if (opt) imgSelect.value = imgFile;
  }

  // Scroll to form
  form.closest('.admin-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`Đang sửa: ${p.name}`);
}

function deleteProduct(id) {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  renderAdminTable();
  renderStats();
  showToast('<i class="fa-solid fa-trash"></i> Đã xóa sản phẩm');
}

function resetForm() {
  const form = document.querySelector('[data-product-form]');
  if (form) {
    form.reset();
    form.querySelector('[name="id"]').value = '';
  }
}

function resetProducts() {
  if (!confirm('Reset lại toàn bộ dữ liệu sản phẩm về mặc định?')) return;
  localStorage.removeItem('pcgear_products');
  renderAdminTable();
  renderStats();
  showToast('<i class="fa-solid fa-rotate-right"></i> Đã reset dữ liệu mẫu');
}

// ADMIN SEARCH
function initAdminSearch() {
  const input = document.querySelector('[data-admin-table-search]');
  if (!input) return;
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => renderAdminTable(input.value), 250);
  });
}
