# PC Gear Store Backend

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

```text
admin@pcgear.vn
admin123
```

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
