# PC Gear Store

Website bán linh kiện PC & gaming chạy local bằng XAMPP.

Dự án dùng frontend thuần HTML/CSS/JavaScript và backend PHP thuần với PDO + MySQL/MariaDB. Không dùng framework, Composer hay package ngoài.

## Công nghệ sử dụng

- HTML5, CSS3, JavaScript vanilla
- PHP thuần, PDO, MySQL/MariaDB trên XAMPP
- REST API trả JSON UTF-8
- LocalStorage dùng cho trạng thái giao diện và token đăng nhập
- Font Awesome cho icon
- Provinces Open API v2 cho form địa chỉ giao hàng

## Cấu trúc chính

```text
pc-gear-store/
├── assets/
│   ├── css/style.css
│   ├── img/
│   └── js/
├── backend/
│   ├── core/
│   ├── data/seed.json
│   ├── database/schema.sql
│   └── public/index.php
├── docs/
├── index.html
├── products.html
├── product.html
├── cart.html
├── wishlist.html
├── blog.html
├── login.html
└── admin.html
```

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
| Admin | `admin.html` | Quản lý sản phẩm và đơn hàng |

## Cách chạy local bằng XAMPP

1. Đặt project trong `C:\xampp\htdocs\pc-gear-store`.
2. Bật Apache và MySQL trong XAMPP Control Panel.
3. Chạy setup database:

```text
http://localhost/pc-gear-store/backend/public/setup.php
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

## API local

API chính chạy qua router PHP:

```text
http://localhost/pc-gear-store/backend/public/index.php/health
http://localhost/pc-gear-store/backend/public/index.php/products
http://localhost/pc-gear-store/backend/public/index.php/auth/login
```

Nếu Apache rewrite hoạt động tốt, URL ngắn trong `backend/public/...` cũng có thể dùng được.

## Tài liệu

- `docs/erd_diagram.md`: mô tả ERD và thiết kế database
- `docs/database.sql`: script database dùng cho báo cáo
- `docs/pcgear_store.dbml`: DBML để dựng sơ đồ
- `docs/erd.png`: ảnh ERD phục vụ thuyết trình