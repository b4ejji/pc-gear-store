# PC Gear Store Backend

<<<<<<< HEAD
Backend PHP thuan cho do an sinh vien. Khong dung framework, khong router REST, khong JWT. Dang nhap bang `$_SESSION`, thao tac database bang PDO.

## Cau truc

```text
backend/
|- config/
|  `- db.php
|- auth/
|  |- login.php
|  `- logout.php
|- products/
|  |- list.php
|  |- detail.php
|  |- add.php
|  |- edit.php
|  `- delete.php
|- cart/
|  |- add.php
|  |- remove.php
|  `- view.php
|- orders/
|  `- checkout.php
|- setup.php
|- schema.sql
`- seed.json
```

`setup.php`, `schema.sql`, `seed.json` chi dung de tao database va seed du lieu mau khi chay local.

## Cai dat nhanh voi XAMPP

1. Bat Apache va MySQL trong XAMPP.
2. Mo setup database:

```text
http://localhost/pc-gear-store/backend/setup.php
```

Tai khoan admin mac dinh:
=======
Backend local cho đồ án PC Gear Store, viết bằng PHP thuần + PDO + MySQL/MariaDB trong XAMPP. Không dùng framework, Composer hay package ngoài.

## Yêu cầu

- XAMPP bật Apache và MySQL
- PHP 8.0+ có extension `pdo_mysql`
- Database mặc định: `pcgear_store`

## Cài nhanh local

1. Copy cấu hình mẫu nếu cần sửa user/pass:

```bash
cp backend/.env.example backend/.env
```

File `.env` chỉ để tham khảo. Mặc định đã hợp XAMPP: host `127.0.0.1`, user `root`, password rỗng.

2. Chạy setup bằng browser qua Apache/XAMPP:

```text
http://localhost/pc-gear-store/backend/public/setup.php
```

Không nhập `C:\xampp\php\php.exe backend/database/setup.php` vào thanh địa chỉ Chrome. Dòng đó là lệnh Terminal/CMD, không phải URL.

Hoặc chạy setup bằng Terminal/CMD:

```bash
C:\xampp\php\php.exe backend\database\setup.php
```

Script này sẽ tạo database, tạo bảng và seed dữ liệu mẫu.

Tài khoản admin mặc định:
>>>>>>> origin/main

```text
admin@pcgear.vn
admin123
```

<<<<<<< HEAD
3. Kiem tra danh sach san pham:

```text
http://localhost/pc-gear-store/backend/products/list.php
```

## Endpoint chinh

- `POST backend/auth/login.php`
- `POST backend/auth/login.php?action=register`
- `POST backend/auth/logout.php`
- `GET backend/products/list.php`
- `GET backend/products/detail.php?id=1`
- `POST backend/products/add.php` admin
- `POST backend/products/edit.php?id=1` admin
- `POST backend/products/delete.php?id=1` admin
- `GET backend/cart/view.php`
- `POST backend/cart/add.php`
- `POST backend/cart/remove.php?id=1`
- `POST backend/cart/remove.php?all=1`
- `POST backend/orders/checkout.php`

Nhung endpoint can dang nhap se doc user tu session PHP. Frontend chi can goi `fetch` cung domain, khong can gui token.
=======
3. Mở API qua Apache của XAMPP:

```text
http://localhost/pc-gear-store/backend/public/health
```

Nếu bro để folder project ở tên khác trong `htdocs`, đổi `pc-gear-store` theo tên folder đó.

PHP built-in server chỉ là phương án phụ, không bắt buộc dùng trong dự án này.

## API chính

- `POST /auth/register`
- `POST /auth/login`
- `GET /me`
- `GET /categories`
- `GET /brands`
- `GET /products`
- `GET /products/{id}`
- `POST /products` admin
- `PUT /products/{id}` admin
- `DELETE /products/{id}` admin
- `GET /cart`
- `POST /cart/items`
- `DELETE /cart/items/{productId}`
- `DELETE /cart`
- `GET /wishlist`
- `POST /wishlist/{productId}`
- `DELETE /wishlist/{productId}`
- `GET /coupons/{code}?subtotal=5000000`
- `GET /orders`
- `POST /orders`
- `GET /orders/{id}`
- `PATCH /orders/{id}/status` admin
- `GET /blog-posts`

Endpoint cần đăng nhập dùng header:

```text
Authorization: Bearer <token>
```

Token được tạo bằng HMAC native trong PHP, đủ cho demo local.
>>>>>>> origin/main
