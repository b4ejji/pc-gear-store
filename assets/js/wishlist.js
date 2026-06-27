onAppReady(async () => {
  await loadWishlistFromApi();
  renderWishlistPage();
});

function renderWishlistPage() {
  const container = document.querySelector('[data-wishlist-grid]');
  if (!container) return;

  const wishlistIds = getWishlist();
  const allProducts = getProducts();
  const wishlistedProducts = allProducts.filter(product => wishlistIds.includes(product.id));

  if (!wishlistedProducts.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <h2>Chưa có sản phẩm yêu thích</h2>
      <p>Bạn chưa lưu sản phẩm nào vào danh sách yêu thích.</p>
      <a class="btn btn-primary" href="products.html">Khám phá sản phẩm</a>
    </div>`;
    return;
  }

  container.innerHTML = wishlistedProducts.map(renderProductCard).join('');
}