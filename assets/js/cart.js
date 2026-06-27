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
      <h2>Giỏ hàng trống</h2>
      <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
      <a class="btn btn-primary btn-lg" href="products.html"><i class="fa-solid fa-arrow-left"></i> Mua sắm ngay</a>
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
      <td><button class="remove-btn" onclick="removeFromCart(${product.id})"><i class="fa-solid fa-xmark"></i> Xóa</button></td>
    </tr>`;
  }).join('');

  listEl.innerHTML = `<table class="cart-table">
    <thead>
      <tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr>
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
    <h3>Tóm tắt đơn hàng</h3>
    <div class="summary-row"><span>Tạm tính (${itemCount} sản phẩm)</span><strong>${money(subtotal)}</strong></div>
    <div class="summary-row"><span>Phí vận chuyển</span><strong>${shipping === 0 ? '<span class="text-success">Miễn phí</span>' : money(shipping)}</strong></div>
    ${coupon ? `<div class="summary-row"><span>Mã ${coupon.code}</span><strong class="text-success">-${money(discount)}</strong></div>` : ''}
    ${shipping > 0 ? `<p style="font-size:12px;color:var(--text-muted);margin-top:4px"><i class="fa-solid fa-bolt"></i> Mua thêm <strong>${money(10000000 - subtotal)}</strong> để được miễn phí vận chuyển.</p>` : ''}

    <div class="coupon-box">
      <input type="text" placeholder="Mã giảm giá" id="coupon-input" value="${coupon?.code || ''}">
      <button class="btn btn-primary btn-sm" onclick="applyCoupon()">Áp dụng</button>
    </div>

    <form class="checkout-form" data-checkout-form style="display:grid;gap:10px;margin-top:16px">
      <h4 style="margin:0;color:var(--text)">Thông tin giao hàng</h4>
      <input class="form-input" name="receiverName" placeholder="Họ và tên người nhận" value="${escapeAttr(user.fullname || '')}" required>
      <input class="form-input" name="receiverPhone" placeholder="Số điện thoại" value="${escapeAttr(user.phone || '')}" required>
      <select name="province" class="form-input" data-province-select required>
        <option value="">Đang tải tỉnh/thành...</option>
      </select>
      <select name="ward" class="form-input" data-ward-select required disabled>
        <option value="">Chọn tỉnh/thành trước</option>
      </select>
      <input class="form-input" name="addressDetail" placeholder="Số nhà, tên đường, tòa nhà..." required>
      <textarea class="form-input" name="note" placeholder="Ghi chú giao hàng (không bắt buộc)" style="min-height:76px"></textarea>
      <select name="paymentMethod" class="form-input">
        <option value="cod">Thanh toán khi nhận hàng (COD)</option>
        <option value="banking">Chuyển khoản ngân hàng</option>
        <option value="momo">Ví MoMo</option>
      </select>
      <small data-address-status style="color:var(--text-muted)">Chọn tỉnh/thành phố rồi chọn phường/xã giao hàng.</small>
    </form>

    <div class="summary-total">
      <span>Tổng cộng</span>
      <span class="amount">${money(total)}</span>
    </div>
    <button class="btn btn-accent btn-lg btn-full" style="margin-top:14px" onclick="handleCheckout()">Đặt hàng</button>
    <a href="products.html" style="display:block;text-align:center;margin-top:12px;font-size:13px;color:var(--primary);font-weight:600"><i class="fa-solid fa-arrow-left"></i> Tiếp tục mua sắm</a>
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
    provinceSelect.innerHTML = '<option value="">Chọn tỉnh/thành</option>' +
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
    provinceSelect.innerHTML = '<option value="">Không tải được tỉnh/thành</option>';
    provinceSelect.required = false;
    wardSelect.required = false;
    if (status) status.textContent = 'Không tải được dữ liệu địa chỉ. Bạn vẫn có thể nhập địa chỉ chi tiết.';
    console.warn('Province API failed.', error);
  }
}

async function loadProvinces() {
  if (CheckoutAddressState.provinces) return CheckoutAddressState.provinces;

  const response = await fetch(`${PROVINCES_API_BASE}/`);
  if (!response.ok) throw new Error('Không tải được danh sách tỉnh/thành.');

  CheckoutAddressState.provinces = await response.json();
  return CheckoutAddressState.provinces;
}

async function loadWards(provinceCode) {
  if (!provinceCode) return [];
  if (CheckoutAddressState.wardsByProvince.has(provinceCode)) {
    return CheckoutAddressState.wardsByProvince.get(provinceCode);
  }

  const response = await fetch(`${PROVINCES_API_BASE}/p/${provinceCode}?depth=2`);
  if (!response.ok) throw new Error('Không tải được danh sách phường/xã.');

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
    wardSelect.innerHTML = '<option value="">Chọn tỉnh/thành trước</option>';
    return;
  }

  wardSelect.disabled = true;
  wardSelect.innerHTML = '<option value="">Đang tải phường/xã...</option>';

  try {
    const wards = await loadWards(provinceCode);
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>' +
      wards.map(ward => `<option value="${ward.code}">${ward.name}</option>`).join('');
    wardSelect.disabled = false;
    if (CheckoutAddressState.wardCode) wardSelect.value = CheckoutAddressState.wardCode;
    wardSelect.addEventListener('change', () => {
      CheckoutAddressState.wardCode = wardSelect.value;
    });
    if (status) status.textContent = 'Chọn tỉnh/thành phố rồi chọn phường/xã giao hàng.';
  } catch (error) {
    wardSelect.innerHTML = '<option value="">Không tải được phường/xã</option>';
    wardSelect.required = false;
    if (status) status.textContent = 'Không tải được phường/xã. Bạn vẫn có thể nhập địa chỉ chi tiết.';
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
  showToast('Đã xóa sản phẩm khỏi giỏ hàng');
}

async function applyCoupon() {
  const input = document.getElementById('coupon-input');
  const code = input?.value.trim().toUpperCase();
  const subtotal = getCartProducts().reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const coupon = await fetchCouponByCode(code, subtotal);

  if (coupon && subtotal >= coupon.minOrderValue) {
    saveActiveCoupon(coupon.code);
    renderCartPage();
    showToast(`<i class="fa-solid fa-gift"></i> Đã áp dụng mã ${coupon.code}`);
  } else if (coupon) {
    saveActiveCoupon('');
    renderCartPage();
    showToast(`<i class="fa-solid fa-circle-xmark"></i> Đơn tối thiểu ${money(coupon.minOrderValue)}`);
  } else if (code) {
    saveActiveCoupon('');
    renderCartPage();
    showToast('<i class="fa-solid fa-circle-xmark"></i> Mã giảm giá không hợp lệ.');
  }
}

async function handleCheckout() {
  if (!getAuthSession()) {
    showToast('<i class="fa-solid fa-circle-xmark"></i> Vui lòng đăng nhập để đặt hàng');
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
    showToast(`<i class="fa-solid fa-circle-check"></i> Đặt hàng thành công: ${order.order_code}`);
  } catch (error) {
    showToast(`<i class="fa-solid fa-circle-xmark"></i> ${error.message || 'Không thể đặt hàng'}`);
  }
}

function getSelectedText(select) {
  if (!select || !select.value) return '';
  return select.options[select.selectedIndex]?.textContent.trim() || '';
}

