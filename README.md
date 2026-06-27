# PC Gear Store

Website bán linh kiện PC & gaming chạy local bằng XAMPP.

Dự án dùng frontend thuần HTML/CSS/JavaScript và backend PHP thuần với PDO + MySQL/MariaDB. Không dùng framework, Composer, JWT hay REST router phức tạp. Đăng nhập dùng PHP session.

## Công nghệ sử dụng

- HTML5, CSS3, JavaScript vanilla
- PHP thuần, PDO, MySQL/MariaDB trên XAMPP
- Session PHP cho đăng nhập
- LocalStorage cho trạng thái giao diện như giỏ hàng, wishlist, coupon
- Font Awesome cho icon
- Provinces Open API v2 cho form địa chỉ giao hàng

## Cấu trúc chính

```text
pc-gear-store/
|- assets/
|  |- css/style.css
|  |- img/
|  `- js/
|- backend/
|  |- config/db.php
|  |- auth/
|  |- products/
|  |- cart/
|  |- orders/
|  |- setup.php
|  |- schema.sql
|  `- seed.json
|- docs/
|- index.html
|- products.html
|- product.html
|- cart.html
|- wishlist.html
|- blog.html
|- login.html
`- admin.html
```

## Cách chạy local bằng XAMPP

1. Đặt project trong `C:\xampp\htdocs\pc-gear-store`.
2. Bật Apache và MySQL trong XAMPP Control Panel.
3. Chạy setup database:

```text
http://localhost/pc-gear-store/backend/setup.php
```

4. Mở website:

```text
http://localhost/pc-gear-store/
```

Tài khoản admin mặc định:

```text
admin@pcgear.vn
admin123
```

Nếu XAMPP của máy khác dùng user/password MySQL khác, copy `backend/.env.example` thành `backend/.env` rồi sửa thông tin DB. File `.env` không cần push lên git.

## Backend endpoint chính

- `POST backend/auth/login.php`
- `POST backend/auth/login.php?action=register`
- `POST backend/auth/logout.php`
- `GET backend/products/list.php`
- `GET backend/products/detail.php?id=1`
- `POST backend/products/add.php`
- `POST backend/products/edit.php?id=1`
- `POST backend/products/delete.php?id=1`
- `GET backend/cart/view.php`
- `POST backend/cart/add.php`
- `POST backend/cart/remove.php?id=1`
- `POST backend/orders/checkout.php`

## Các trang

| Trang | File | Chức năng |
| --- | --- | --- |
| Trang chủ | `index.html` | Banner, danh mục, sản phẩm nổi bật |
| Sản phẩm | `products.html` | Lọc, tìm kiếm, sắp xếp sản phẩm |
| Chi tiết sản phẩm | `product.html?id=` | Xem thông tin, thêm giỏ hàng, yêu thích |
| Giỏ hàng | `cart.html` | Quản lý giỏ hàng, mã giảm giá, đặt hàng |
| Wishlist | `wishlist.html` | Danh sách sản phẩm yêu thích |
| Blog | `blog.html` | Bài viết hướng dẫn và kiến thức PC |
| Đăng nhập | `login.html` | Đăng nhập, đăng ký, đăng xuất |
| Admin | `admin.html` | Quản lý sản phẩm |

## Tài liệu

- `docs/erd_diagram.md`: mô tả ERD và thiết kế database
- `docs/database.sql`: script database dùng cho báo cáo
- `docs/pcgear_store.dbml`: DBML để dựng sơ đồ
- `docs/erd.png`: ảnh ERD phục vụ thuyết trình