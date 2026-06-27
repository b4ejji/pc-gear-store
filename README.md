# PC Gear Store

Website bán linh kiện máy tính - Đồ án môn Lập trình Web.

## Công nghệ sử dụng
- HTML5, CSS3, JavaScript (Vanilla)
- LocalStorage (lưu dữ liệu tạm phía client)
- Font Awesome (icon)

## Các trang

| Trang | File | Chức năng |
|-------|------|-----------|
| Trang chủ | `index.html` | Hiển thị banner, sản phẩm nổi bật, danh mục |
| Sản phẩm | `products.html` | Lọc, tìm kiếm, sắp xếp sản phẩm |
| Chi tiết SP | `product.html?id=` | Xem thông số, mô tả, thêm giỏ hàng |
| Giỏ hàng | `cart.html` | Quản lý giỏ hàng, tính tổng tiền |
| Wishlist | `wishlist.html` | Danh sách sản phẩm yêu thích |
| Blog | `blog.html` | Bài viết chia sẻ kiến thức |
| Đăng nhập | `login.html` | Form đăng nhập / đăng ký (demo) |
| Admin | `admin.html` | Thêm/sửa/xóa sản phẩm (lưu localStorage) |

## Cách chạy
Mở file `index.html` bằng trình duyệt hoặc dùng Live Server (VS Code).

## Tài liệu
- [Sơ đồ ERD + Script tạo DB](docs/erd_diagram.md) — thiết kế database MySQL cho backend

## Hướng phát triển tiếp
- Backend bằng PHP + MySQL
- Xác thực đăng nhập (session/JWT)
- Thanh toán, quản lý đơn hàng
- Trang admin quản lý đầy đủ
