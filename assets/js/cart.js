// CART.JS - Cart page logic

const PROVINCES_API_BASE = 'https://provinces.open-api.vn/api/v2';
const CheckoutAddressState = {
  provinces: null,
  wardsByProvince: new Map(),
  provinceCode: '',
  wardCode: ''
};

onAppReady(renderCartPage);

function getCartProducts() {
  const products = getProducts();
  return getCart()
    .map(item => {
      const product = products.find(candidate => candidate.id === item.id);
      if (!product || Number(product.stock) <= 0) return null;
      return { ...item, qty: Math.min(item.qty, Number(product.stock) || 1), product };
    })
    .filter(Boolean);
}

function renderCartPage() {
  const listEl = document.querySelector('[data-cart-list]');
  const summaryEl = document.querySelector('[data-cart-summary]');
  if (!listEl || !summaryEl) return;

  const cartItems = getCartProducts();
  saveCart(cartItems.map(item => ({ id: item.id, qty: item.qty })));

  if (!cartItems.length) {
    listEl.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
      <h2>Gi? h�ng tr?ng</h2>
      <p>B?n chua th�m s?n ph?m n�o v�o gi? h�ng.</p>
      <a class="btn btn-primary btn-lg" href="products.html"><i class="fa-solid fa-arrow-left"></i> Mua s?m ngay</a>
    </div>`;
    summaryEl.innerHTML = '';
    return;
  }

  let subtotal = 0;
  let itemCount = 0;
  const rows = cartItems.map(item => {
    const product = item.product;
    const itemTotal = product.price * item.qty;
    subtotal += itemTotal;
    itemCount += item.qty;

    return `<tr>
      <td>
        <div class="cart-product">
          <img src="${product.image}" alt="${product.name}">
          <div class="cart-product-info">
            <h4><a href="product.html?id=${product.id}">${product.name}</a></h4>
            <p>${product.category} - ${product.brand || ''}</p>
          </div>
        </div>
      </td>
      <td class="text-price">${money(product.price)}</td>
      <td>
        <div class="qty-control">
          <button onclick="updateCartQty(${product.id}, -1)">-</button>
          <input type="number" value="${item.qty}" min="1" max="${product.stock || 99}"
            onchange="setCartQty(${product.id}, this.value)">
          <button onclick="updateCartQty(${product.id}, 1)">+</button>
        </div>
      </td>
      <td class="text-price">${money(itemTotal)}</td>
      <td><button class="remove-btn" onclick="removeFromCart(${product.id})"><i class="fa-solid fa-xmark"></i> X�a</button></td>
    </tr>`;
  }).join('');

  listEl.innerHTML = `<table class="cart-table">
    <thead>
      <tr><th>S?n ph?m</th><th>�on gi�</th><th>S? lu?ng</th><th>Th�nh ti?n</th><th></th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;

  renderCartSummary(summaryEl, subtotal, itemCount);
}

function renderCartSummary(summaryEl, subtotal, itemCount) {
  const shipping = subtotal >= 10000000 ? 0 : 50000;
  const coupon = getActiveCoupon();
  const discount = calculateCouponDiscount(coupon, subtotal);
  const total = Math.max(0, subtotal + shipping - discount);
  const user = getCurrentUser() || {};

  summaryEl.innerHTML = `<div class="cart-summary">
    <h3>T�m t?t don h�ng</h3>
    <div class="summary-row"><span>T?m t�nh (${itemCount} s?n ph?m)</span><strong>${money(subtotal)}</strong></div>
    <div class="summary-row"><span>Ph� v?n chuy?n</span><strong>${shipping === 0 ? '<span class="text-success">Mi?n ph�</span>' : money(shipping)}</strong></div>
    ${coupon ? `<div class="summary-row"><span>M� ${coupon.code}</span><strong class="text-success">-${money(discount)}</strong></div>` : ''}
    ${shipping > 0 ? `<p style="font-size:12px;color:var(--text-muted);margin-top:4px"><i class="fa-solid fa-bolt"></i> Mua th�m <strong>${money(10000000 - subtotal)}</strong> d? du?c mi?n ph� v?n chuy?n.</p>` : ''}

    <div class="coupon-box">
      <input type="text" placeholder="M� gi?m gi�" id="coupon-input" value="${coupon?.code || ''}">
      <button class="btn btn-primary btn-sm" onclick="applyCoupon()">�p d?ng</button>
    </div>

    <form class="checkout-form" data-checkout-form style="display:grid;gap:10px;margin-top:16px">
      <h4 style="margin:0;color:var(--text)">Th�ng tin giao h�ng</h4>
      <input class="form-input" name="receiverName" placeholder="H? v� t�n ngu?i nh?n" value="${escapeAttr(user.fullname || '')}" required>
      <input class="form-input" name="receiverPhone" placeholder="S? di?n tho?i" value="${escapeAttr(user.phone || '')}" required>
      <select name="province" class="form-input" data-province-select required>
        <option value="">�ang t?i t?nh/th�nh...</option>
      </select>
      <select name="ward" class="form-input" data-ward-select required disabled>
        <option value="">Ch?n t?nh/th�nh tru?c</option>
      </select>
      <input class="form-input" name="addressDetail" placeholder="S? nh�, t�n du?ng, t�a nh�..." required>
      <textarea class="form-input" name="note" placeholder="Ghi ch� giao h�ng (kh�ng b?t bu?c)" style="min-height:76px"></textarea>
      <select name="paymentMethod" class="form-input">
        <option value="cod">Thanh to�n khi nh?n h�ng (COD)</option>
        <option value="banking">Chuy?n kho?n ng�n h�ng</option>
        <option value="momo">V� MoMo</option>
      </select>
      <small data-address-status style="color:var(--text-muted)">Ch?n t?nh/th�nh ph? r?i ch?n phu?ng/x� giao h�ng.</small>
    </form>

    <div class="summary-total">
      <span>T?ng c?ng</span>
      <span class="amount">${money(total)}</span>
    </div>
    <button class="btn btn-accent btn-lg btn-full" style="margin-top:14px" onclick="handleCheckout()">�?t h�ng</button>
    <a href="products.html" style="display:block;text-align:center;margin-top:12px;font-size:13px;color:var(--primary);font-weight:600"><i class="fa-solid fa-arrow-left"></i> Ti?p t?c mua s?m</a>
  </div>`;

  initCheckoutAddressForm();
}

function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

async function initCheckoutAddressForm() {
  const provinceSelect = document.querySelector('[data-province-select]');
  const wardSelect = document.querySelector('[data-ward-select]');
  const status = document.querySelector('[data-address-status]');
  if (!provinceSelect || !wardSelect) return;

  try {
    const provinces = await loadProvinces();
    provinceSelect.innerHTML = '<option value="">Ch?n t?nh/th�nh</option>' +
      provinces.map(province => `<option value="${province.code}">${province.name}</option>`).join('');

    if (CheckoutAddressState.provinceCode) {
      provinceSelect.value = CheckoutAddressState.provinceCode;
      await renderWardOptions(CheckoutAddressState.provinceCode);
    }

    provinceSelect.addEventListener('change', async () => {
      CheckoutAddressState.provinceCode = provinceSelect.value;
      CheckoutAddressState.wardCode = '';
      await renderWardOptions(provinceSelect.value);
    });
  } catch (error) {
    provinceSelect.innerHTML = '<option value="">Kh�ng t?i du?c t?nh/th�nh</option>';
    provinceSelect.required = false;
    wardSelect.required = false;
    if (status) status.textContent = 'Kh�ng t?i du?c d? li?u d?a ch?. B?n v?n c� th? nh?p d?a ch? chi ti?t.';
    console.warn('Province API failed.', error);
  }
}

async function loadProvinces() {
  if (CheckoutAddressState.provinces) return CheckoutAddressState.provinces;

  const response = await fetch(`${PROVINCES_API_BASE}/`);
  if (!response.ok) throw new Error('Kh�ng t?i du?c danh s�ch t?nh/th�nh.');

  CheckoutAddressState.provinces = await response.json();
  return CheckoutAddressState.provinces;
}

async function loadWards(provinceCode) {
  if (!provinceCode) return [];
  if (CheckoutAddressState.wardsByProvince.has(provinceCode)) {
    return CheckoutAddressState.wardsByProvince.get(provinceCode);
  }

  const response = await fetch(`${PROVINCES_API_BASE}/p/${provinceCode}?depth=2`);
  if (!response.ok) throw new Error('Kh�ng t?i du?c danh s�ch phu?ng/x�.');

  const province = await response.json();
  const wards = Array.isArray(province.wards) ? province.wards : [];
  CheckoutAddressState.wardsByProvince.set(provinceCode, wards);
  return wards;
}

async function renderWardOptions(provinceCode) {
  const wardSelect = document.querySelector('[data-ward-select]');
  const status = document.querySelector('[data-address-status]');
  if (!wardSelect) return;

  if (!provinceCode) {
    wardSelect.disabled = true;
    wardSelect.innerHTML = '<option value="">Ch?n t?nh/th�nh tru?c</option>';
    return;
  }

  wardSelect.disabled = true;
  wardSelect.innerHTML = '<option value="">�ang t?i phu?ng/x�...</option>';

  try {
    const wards = await loadWards(provinceCode);
    wardSelect.innerHTML = '<option value="">Ch?n phu?ng/x�</option>' +
      wards.map(ward => `<option value="${ward.code}">${ward.name}</option>`).join('');
    wardSelect.disabled = false;
    if (CheckoutAddressState.wardCode) wardSelect.value = CheckoutAddressState.wardCode;
    wardSelect.addEventListener('change', () => {
      CheckoutAddressState.wardCode = wardSelect.value;
    });
    if (status) status.textContent = 'Ch?n t?nh/th�nh ph? r?i ch?n phu?ng/x� giao h�ng.';
  } catch (error) {
    wardSelect.innerHTML = '<option value="">Kh�ng t?i du?c phu?ng/x�</option>';
    wardSelect.required = false;
    if (status) status.textContent = 'Kh�ng t?i du?c phu?ng/x�. B?n v?n c� th? nh?p d?a ch? chi ti?t.';
    console.warn('Ward API failed.', error);
  }
}

function updateCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(candidate => candidate.id === id);
  if (!item) return;

  const product = getProducts().find(candidate => candidate.id === id);
  const max = Number(product?.stock) || 1;
  item.qty = Math.max(1, Math.min(max, item.qty + delta));
  saveCart(cart);
  syncCartItemToApi(id, item.qty);
  renderCartPage();
}

function setCartQty(id, value) {
  const cart = getCart();
  const item = cart.find(candidate => candidate.id === id);
  if (!item) return;

  const product = getProducts().find(candidate => candidate.id === id);
  const max = Number(product?.stock) || 1;
  item.qty = Math.max(1, Math.min(max, Number(value) || 1));
  saveCart(cart);
  syncCartItemToApi(id, item.qty);
  renderCartPage();
}

function removeFromCart(id) {
  saveCart(getCart().filter(item => item.id !== id));
  removeCartItemFromApi(id);
  renderCartPage();
  showToast('�� x�a s?n ph?m kh?i gi? h�ng');
}

async function applyCoupon() {
  const input = document.getElementById('coupon-input');
  const code = input?.value.trim().toUpperCase();
  const subtotal = getCartProducts().reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const coupon = await fetchCouponByCode(code, subtotal);

  if (coupon && subtotal >= coupon.minOrderValue) {
    saveActiveCoupon(coupon.code);
    renderCartPage();
    showToast(`<i class="fa-solid fa-gift"></i> �� �p d?ng m� ${coupon.code}`);
  } else if (coupon) {
    saveActiveCoupon('');
    renderCartPage();
    showToast(`<i class="fa-solid fa-circle-xmark"></i> �on t?i thi?u ${money(coupon.minOrderValue)}`);
  } else if (code) {
    saveActiveCoupon('');
    renderCartPage();
    showToast('<i class="fa-solid fa-circle-xmark"></i> M� gi?m gi� kh�ng h?p l?.');
  }
}

async function handleCheckout() {
  if (!getAuthSession()) {
    showToast('<i class="fa-solid fa-circle-xmark"></i> Vui l�ng dang nh?p d? d?t h�ng');
    setTimeout(() => window.location.href = 'login.html', 900);
    return;
  }

  const cartItems = getCartProducts();
  const form = document.querySelector('[data-checkout-form]');
  if (!cartItems.length || !form) return;

  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const provinceText = getSelectedText(form.querySelector('[name="province"]'));
  const wardText = getSelectedText(form.querySelector('[name="ward"]'));
  const addressDetail = String(formData.get('addressDetail') || '').trim();
  const receiverAddress = [addressDetail, wardText, provinceText].filter(Boolean).join(', ');

  try {
    const order = await createOrderFromCart({
      items: cartItems.map(item => ({ product_id: item.id, quantity: item.qty })),
      coupon_code: getActiveCoupon()?.code || null,
      receiver_name: String(formData.get('receiverName') || '').trim(),
      receiver_phone: String(formData.get('receiverPhone') || '').trim(),
      receiver_address: receiverAddress,
      payment_method: String(formData.get('paymentMethod') || 'cod'),
      note: String(formData.get('note') || '').trim() || null
    });

    saveCart([]);
    saveActiveCoupon('');
    clearCartFromApi();
    renderCartPage();
    showToast(`<i class="fa-solid fa-circle-check"></i> �?t h�ng th�nh c�ng: ${order.order_code}`);
  } catch (error) {
    showToast(`<i class="fa-solid fa-circle-xmark"></i> ${error.message || 'Kh�ng th? d?t h�ng'}`);
  }
}

function getSelectedText(select) {
  if (!select || !select.value) return '';
  return select.options[select.selectedIndex]?.textContent.trim() || '';
}

