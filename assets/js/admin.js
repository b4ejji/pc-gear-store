// ADMIN.JS - Admin dashboard logic

onAppReady(() => {
  warnIfMissingAdminSession();
  renderStats();
  renderAdminTable();
  initAdminForm();
  initAdminSearch();
});

function warnIfMissingAdminSession() {
  if (!ApiClient.enabled()) return;

  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    showToast('Đăng nhập admin để thêm, sửa, xóa sản phẩm');
  }
}

function renderStats() {
  const products = getProducts();
  const statProducts = document.querySelector('[data-stat-products]');
  const statStock = document.querySelector('[data-stat-stock]');
  const statCats = document.querySelector('[data-stat-categories]');

  if (statProducts) statProducts.textContent = products.length;
  if (statStock) statStock.textContent = products.reduce((sum, product) => sum + (Number(product.stock) || 0), 0);
  if (statCats) statCats.textContent = new Set(products.map(product => product.category)).size;
}

function renderAdminTable(filter = '') {
  const tbody = document.querySelector('[data-admin-products]');
  if (!tbody) return;

  const search = filter.trim().toLowerCase();
  const products = getProducts().filter(product => {
    if (!search) return true;
    return product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      String(product.brand || '').toLowerCase().includes(search);
  });

  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted)">Không tìm thấy sản phẩm nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(product => `
    <tr>
      <td><img class="table-img" src="${product.image}" alt="${product.name}"></td>
      <td>
        <strong style="display:block;margin-bottom:2px">${product.name}</strong>
        <small style="color:var(--text-muted)">${product.brand || ''} - ${product.spec ? product.spec.slice(0, 44) : ''}</small>
      </td>
      <td><span style="padding:3px 8px;border-radius:4px;background:var(--bg-alt);font-size:12px;font-weight:700">${product.category}</span></td>
      <td class="text-price">${money(product.price)}</td>
      <td>${product.stock || 0}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-ghost" onclick="editProduct(${product.id})"><i class="fa-solid fa-pen"></i> Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})"><i class="fa-solid fa-trash"></i> Xóa</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function initAdminForm() {
  const form = document.querySelector('[data-product-form]');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(form);
    const editId = Number(data.get('id')) || null;
    const product = buildProductFromForm(data, editId);

    try {
      if (ApiClient.enabled()) {
        await saveProductToApi(product, editId);
      } else {
        saveProductLocally(product, editId);
      }

      resetForm();
      renderAdminTable();
      renderStats();
      showToast(editId ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm mới');
    } catch (error) {
      showToast(`<i class="fa-solid fa-circle-xmark"></i> ${error.message || 'Không thể lưu sản phẩm'}`);
    }
  });
}

function buildProductFromForm(data, editId = null) {
  const image = 'assets/img/' + data.get('image');
  const current = editId ? getProducts().find(product => product.id === editId) : null;
  const badge = data.get('badge') || null;

  return {
    id: editId || Date.now(),
    name: data.get('name'),
    category: data.get('category'),
    brand: data.get('brand'),
    price: Number(data.get('price')),
    oldPrice: Number(data.get('oldPrice')) || null,
    stock: Number(data.get('stock')),
    badge,
    badgeText: { new: 'Mới', hot: 'Hot', sale: 'Giảm giá', bestseller: 'Best Seller' }[badge],
    spec: data.get('spec'),
    desc: data.get('desc'),
    image,
    images: [image],
    rating: current?.rating || 4.5,
    reviews: current?.reviews || 0,
    specs: current?.specs || {}
  };
}

function saveProductLocally(product, editId = null) {
  const products = getProducts();
  if (editId) {
    const index = products.findIndex(item => item.id === editId);
    if (index !== -1) products[index] = product;
  } else {
    products.push(product);
  }
  saveProducts(products);
}

function editProduct(id) {
  const product = getProducts().find(item => item.id === id);
  const form = document.querySelector('[data-product-form]');
  if (!product || !form) return;

  form.querySelector('[name="id"]').value = product.id;
  form.querySelector('[name="name"]').value = product.name;
  form.querySelector('[name="category"]').value = product.category;
  form.querySelector('[name="brand"]').value = product.brand || '';
  form.querySelector('[name="price"]').value = product.price;
  form.querySelector('[name="oldPrice"]').value = product.oldPrice || '';
  form.querySelector('[name="stock"]').value = product.stock || 0;
  form.querySelector('[name="badge"]').value = product.badge || 'new';
  form.querySelector('[name="spec"]').value = product.spec || '';
  form.querySelector('[name="desc"]').value = product.desc || '';

  const imageSelect = form.querySelector('[name="image"]');
  const imageFile = String(product.image || '').replace('assets/img/', '');
  if (imageSelect && [...imageSelect.options].some(option => option.value === imageFile)) {
    imageSelect.value = imageFile;
  }

  form.closest('.admin-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`Đang sửa: ${product.name}`);
}

async function deleteProduct(id) {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

  try {
    if (ApiClient.enabled()) {
      await deleteProductFromApi(id);
    } else {
      saveProducts(getProducts().filter(product => product.id !== id));
    }

    renderAdminTable();
    renderStats();
    showToast('Đã xóa sản phẩm');
  } catch (error) {
    showToast(`<i class="fa-solid fa-circle-xmark"></i> ${error.message || 'Không thể xóa sản phẩm'}`);
  }
}

function resetForm() {
  const form = document.querySelector('[data-product-form]');
  if (!form) return;
  form.reset();
  form.querySelector('[name="id"]').value = '';
}

function resetProducts() {
  if (!confirm('Reset lại dữ liệu local về mặc định?')) return;
  localStorage.removeItem(STORAGE_KEYS.products);
  ApiState.products = null;
  renderAdminTable();
  renderStats();
  showToast('Đã reset dữ liệu local');
}

function initAdminSearch() {
  const input = document.querySelector('[data-admin-table-search]');
  if (!input) return;

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => renderAdminTable(input.value), 250);
  });
}
