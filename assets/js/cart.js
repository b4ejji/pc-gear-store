// CART.JS - Cart page logic

document.addEventListener('DOMContentLoaded', renderCartPage);

function renderCartPage() {
  const cart = getCart();
  const products = getProducts();
  const listEl = document.querySelector('[data-cart-list]');
  const summaryEl = document.querySelector('[data-cart-summary]');

  if (!listEl || !summaryEl) return;

  if (!cart.length) {
    listEl.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
      <h2>Giỏ hàng trống</h2>
      <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
      <a class="btn btn-primary btn-lg" href="products.html"><i class="fa-solid fa-arrow-left"></i> Mua sắm ngay</a>
    </div>`;
    summaryEl.innerHTML = '';
    return;
  }

  // Cart items table
  let subtotal = 0;
  const rows = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return '';
    const itemTotal = p.price * item.qty;
    subtotal += itemTotal;

    return `<tr>
      <td>
        <div class="cart-product">
          <img src="${p.image}" alt="${p.name}">
          <div class="cart-product-info">
            <h4><a href="product.html?id=${p.id}">${p.name}</a></h4>
            <p>${p.category} · ${p.brand || ''}</p>
          </div>
        </div>
      </td>
      <td class="text-price">${money(p.price)}</td>
      <td>
        <div class="qty-control">
          <button onclick="updateCartQty(${p.id}, -1)">−</button>
          <input type="number" value="${item.qty}" min="1" max="${p.stock || 99}"
            onchange="setCartQty(${p.id}, this.value)">
          <button onclick="updateCartQty(${p.id}, 1)">+</button>
        </div>
      </td>
      <td class="text-price">${money(itemTotal)}</td>
      <td><button class="remove-btn" onclick="removeFromCart(${p.id})"><i class="fa-solid fa-xmark"></i> Xóa</button></td>
    </tr>`;
  }).join('');

  listEl.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;

  // Summary
  const shipping = subtotal >= 10000000 ? 0 : 50000;
  const total = subtotal + shipping;

  summaryEl.innerHTML = `
    <div class="cart-summary">
      <h3>Tóm tắt đơn hàng</h3>
      <div class="summary-row"><span>Tạm tính (${cart.reduce((s, i) => s + i.qty, 0)} sản phẩm)</span><strong>${money(subtotal)}</strong></div>
      <div class="summary-row"><span>Phí vận chuyển</span><strong>${shipping === 0 ? '<span class="text-success">Miễn phí</span>' : money(shipping)}</strong></div>
      ${shipping > 0 ? `<p style="font-size:12px;color:var(--text-muted);margin-top:4px"><i class="fa-solid fa-bolt"></i> Mua thêm <strong>${money(10000000 - subtotal)}</strong> để được miễn ship!</p>` : ''}
      
      <div class="coupon-box">
        <input type="text" placeholder="Mã giảm giá" id="coupon-input">
        <button class="btn btn-primary btn-sm" onclick="applyCoupon()">Áp dụng</button>
      </div>

      <div class="summary-total">
        <span>Tổng cộng</span>
        <span class="amount">${money(total)}</span>
      </div>
      <button class="btn btn-accent btn-lg btn-full" style="margin-top:14px" onclick="handleCheckout()">Đặt hàng</button>
      <a href="products.html" style="display:block;text-align:center;margin-top:12px;font-size:13px;color:var(--primary);font-weight:600"><i class="fa-solid fa-arrow-left"></i> Tiếp tục mua sắm</a>
    </div>`;
}

function updateCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    renderCartPage();
  }
}

function setCartQty(id, val) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, Number(val));
    saveCart(cart);
    renderCartPage();
  }
}

function removeFromCart(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCartPage();
  showToast('Đã xóa sản phẩm khỏi giỏ hàng');
}

function applyCoupon() {
  const input = document.getElementById('coupon-input');
  const code = input?.value.trim().toUpperCase();
  if (code === 'PCGEAR10') {
    showToast('<i class="fa-solid fa-gift"></i> Mã giảm giá hợp lệ! Giảm 10%.');
  } else if (code) {
    showToast('<i class="fa-solid fa-circle-xmark"></i> Mã giảm giá không hợp lệ.');
  }
}

function handleCheckout() {
  showToast('<i class="fa-solid fa-circle-check"></i> Đặt hàng thành công! (Demo frontend)');
  saveCart([]);
  setTimeout(() => renderCartPage(), 1500);
}
