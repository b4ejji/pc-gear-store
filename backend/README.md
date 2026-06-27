# PC Gear Store Backend

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

```text
admin@pcgear.vn
admin123
```

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
