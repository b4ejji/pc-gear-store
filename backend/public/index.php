<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Http.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../core/ProductMapper.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '', '/');
$path = preg_replace('#^.*?backend/public/?#', '', $path);
$segments = $path === '' ? [] : explode('/', $path);

try {
    $pdo = Database::connection();
    route_request($pdo, $method, $segments);
} catch (Throwable $e) {
    $config = require __DIR__ . '/../config.php';
    $payload = ['message' => 'Loi server.'];
    if ($config['debug']) {
        $payload['debug'] = $e->getMessage();
    }
    send_json($payload, 500);
}

function route_request(PDO $pdo, string $method, array $segments): never
{
    $resource = $segments[0] ?? 'health';
    $id = $segments[1] ?? null;
    $nested = $segments[2] ?? null;

    if ($method === 'GET' && $resource === 'health') {
        send_json(['status' => 'ok', 'service' => 'pc-gear-store-api']);
    }

    if ($resource === 'auth') {
        handle_auth($pdo, $method, $id);
    }

    if ($method === 'GET' && $resource === 'me') {
        send_json(['user' => require_user()]);
    }

    if ($resource === 'categories') {
        if ($method !== 'GET') {
            send_error('Method not allowed.', 405);
        }
        $rows = $pdo->query('SELECT id, key_name AS `key`, label, icon, slug, sort_order FROM categories ORDER BY sort_order, id')->fetchAll();
        send_json(['data' => $rows]);
    }

    if ($resource === 'brands') {
        if ($method !== 'GET') {
            send_error('Method not allowed.', 405);
        }
        $rows = $pdo->query('SELECT id, name, logo, slug FROM brands ORDER BY name')->fetchAll();
        send_json(['data' => $rows]);
    }

    if ($resource === 'products') {
        handle_products($pdo, $method, $id);
    }

    if ($resource === 'cart') {
        handle_cart($pdo, $method, $id, $nested);
    }

    if ($resource === 'wishlist') {
        handle_wishlist($pdo, $method, $id);
    }

    if ($resource === 'coupons') {
        handle_coupons($pdo, $method, $id);
    }

    if ($resource === 'orders') {
        handle_orders($pdo, $method, $id, $nested);
    }

    if ($resource === 'blog-posts') {
        handle_blog_posts($pdo, $method, $id);
    }

    send_error('Endpoint khong ton tai.', 404);
}

function handle_auth(PDO $pdo, string $method, ?string $action): never
{
    if ($method !== 'POST') {
        send_error('Method not allowed.', 405);
    }

    $data = json_input();

    if ($action === 'register') {
        require_fields($data, ['fullname', 'email', 'password']);
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            send_error('Email khong hop le.', 422, ['email' => 'Khong hop le.']);
        }
        if (strlen((string) $data['password']) < 6) {
            send_error('Mat khau toi thieu 6 ky tu.', 422, ['password' => 'Toi thieu 6 ky tu.']);
        }

        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            send_error('Email da duoc dang ky.', 409);
        }

        $stmt = $pdo->prepare(
            'INSERT INTO users (fullname, email, password, phone, address, role)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            trim((string) $data['fullname']),
            strtolower(trim((string) $data['email'])),
            password_hash((string) $data['password'], PASSWORD_BCRYPT),
            $data['phone'] ?? null,
            $data['address'] ?? null,
            'customer',
        ]);

        $user = find_user_by_id($pdo, (int) $pdo->lastInsertId());
        send_json(['user' => $user, 'token' => create_token($user)], 201);
    }

    if ($action === 'login') {
        require_fields($data, ['email', 'password']);
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([strtolower(trim((string) $data['email']))]);
        $user = $stmt->fetch();

        if (!$user || !password_verify((string) $data['password'], $user['password'])) {
            send_error('Email hoac mat khau khong dung.', 401);
        }

        unset($user['password']);
        send_json(['user' => $user, 'token' => create_token($user)]);
    }

    send_error('Auth action khong ton tai.', 404);
}

function handle_products(PDO $pdo, string $method, ?string $id): never
{
    if ($method === 'GET' && $id === null) {
        list_products($pdo);
    }

    if ($method === 'GET' && $id !== null) {
        $product = find_product($pdo, (int) $id);
        if (!$product) {
            send_error('Khong tim thay san pham.', 404);
        }
        send_json(['data' => $product]);
    }

    if ($method === 'POST') {
        require_admin();
        $product = save_product($pdo, json_input());
        send_json(['data' => $product], 201);
    }

    if (($method === 'PUT' || $method === 'PATCH') && $id !== null) {
        require_admin();
        if (!find_product($pdo, (int) $id)) {
            send_error('Khong tim thay san pham.', 404);
        }
        $product = save_product($pdo, json_input(), (int) $id);
        send_json(['data' => $product]);
    }

    if ($method === 'DELETE' && $id !== null) {
        require_admin();
        $stmt = $pdo->prepare('UPDATE products SET is_active = 0 WHERE id = ?');
        $stmt->execute([(int) $id]);
        send_json(['message' => 'Da an san pham.']);
    }

    send_error('Method not allowed.', 405);
}

function list_products(PDO $pdo): never
{
    $page = max(1, int_param('page', 1));
    $perPage = min(50, max(1, int_param('per_page', 12)));
    $where = ['p.is_active = 1'];
    $params = [];

    if ($q = str_param('q')) {
        $where[] = '(p.name LIKE ? OR p.spec_short LIKE ? OR p.description LIKE ? OR b.name LIKE ? OR c.key_name LIKE ?)';
        $term = '%' . $q . '%';
        array_push($params, $term, $term, $term, $term, $term);
    }
    if ($category = str_param('category')) {
        $where[] = 'c.key_name = ?';
        $params[] = $category;
    }
    if ($brand = str_param('brand')) {
        $where[] = 'b.name = ?';
        $params[] = $brand;
    }
    if (($minPrice = int_param('min_price')) !== null) {
        $where[] = 'p.price >= ?';
        $params[] = $minPrice;
    }
    if (($maxPrice = int_param('max_price')) !== null) {
        $where[] = 'p.price <= ?';
        $params[] = $maxPrice;
    }

    $whereSql = ' WHERE ' . implode(' AND ', $where);
    $countStmt = $pdo->prepare(
        'SELECT COUNT(*) FROM products p
         JOIN categories c ON c.id = p.category_id
         JOIN brands b ON b.id = p.brand_id' . $whereSql
    );
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $sortMap = [
        'price_asc' => 'p.price ASC',
        'price_desc' => 'p.price DESC',
        'name' => 'p.name ASC',
        'rating' => 'p.rating DESC',
        'newest' => 'p.created_at DESC',
    ];
    $sort = $sortMap[str_param('sort', 'newest')] ?? $sortMap['newest'];
    $offset = ($page - 1) * $perPage;

    $stmt = $pdo->prepare(product_base_query() . $whereSql . " ORDER BY $sort LIMIT ? OFFSET ?");
    $executeParams = array_merge($params, [$perPage, $offset]);
    $stmt->execute($executeParams);

    $products = [];
    foreach ($stmt->fetchAll() as $row) {
        $products[(int) $row['id']] = map_product($row);
    }
    load_product_children($pdo, $products);

    send_json([
        'data' => array_values($products),
        'meta' => [
            'page' => $page,
            'perPage' => $perPage,
            'total' => $total,
            'totalPages' => (int) ceil($total / $perPage),
        ],
    ]);
}

function find_product(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare(product_base_query() . ' WHERE p.id = ? AND p.is_active = 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        return null;
    }

    $products = [$id => map_product($row)];
    load_product_children($pdo, $products);

    return $products[$id];
}

function save_product(PDO $pdo, array $data, ?int $id = null): array
{
    require_fields($data, ['name', 'category', 'brand', 'price']);

    $categoryId = find_category_id($pdo, (string) $data['category']);
    if (!$categoryId) {
        send_error('Danh muc khong ton tai.', 422, ['category' => 'Khong ton tai.']);
    }
    $brandId = find_or_create_brand_id($pdo, (string) $data['brand']);
    $price = max(1, (int) $data['price']);
    $oldPrice = isset($data['oldPrice']) && $data['oldPrice'] !== '' ? (int) $data['oldPrice'] : null;

    if ($oldPrice !== null && $oldPrice < $price) {
        $oldPrice = $price;
    }

    $payload = [
        trim((string) $data['name']),
        slugify((string) ($data['slug'] ?? $data['name'])) . ($id ? '' : '-' . time()),
        $categoryId,
        $brandId,
        $price,
        $oldPrice,
        $data['image'] ?? 'assets/img/default.svg',
        $data['badge'] ?? null,
        $data['badgeText'] ?? $data['badge_text'] ?? null,
        $data['spec'] ?? $data['spec_short'] ?? null,
        $data['desc'] ?? $data['description'] ?? null,
        max(0, (int) ($data['stock'] ?? 0)),
        min(5, max(0, (float) ($data['rating'] ?? 0))),
        max(0, (int) ($data['reviews'] ?? $data['review_count'] ?? 0)),
    ];

    $pdo->beginTransaction();
    try {
        if ($id === null) {
            $stmt = $pdo->prepare(
                'INSERT INTO products
                 (name, slug, category_id, brand_id, price, old_price, image, badge, badge_text,
                  spec_short, description, stock, rating, review_count)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute($payload);
            $id = (int) $pdo->lastInsertId();
        } else {
            $payload[] = $id;
            $stmt = $pdo->prepare(
                'UPDATE products SET
                 name = ?, slug = ?, category_id = ?, brand_id = ?, price = ?, old_price = ?,
                 image = ?, badge = ?, badge_text = ?, spec_short = ?, description = ?,
                 stock = ?, rating = ?, review_count = ?, is_active = 1
                 WHERE id = ?'
            );
            $stmt->execute($payload);
            $pdo->prepare('DELETE FROM product_specs WHERE product_id = ?')->execute([$id]);
            $pdo->prepare('DELETE FROM product_images WHERE product_id = ?')->execute([$id]);
        }

        save_product_specs($pdo, $id, $data['specs'] ?? []);
        save_product_images($pdo, $id, $data['images'] ?? [$data['image'] ?? 'assets/img/default.svg']);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    return find_product($pdo, $id);
}

function save_product_specs(PDO $pdo, int $productId, array $specs): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO product_specs (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?)'
    );
    $order = 0;
    foreach ($specs as $key => $value) {
        if (trim((string) $key) === '' || trim((string) $value) === '') {
            continue;
        }
        $stmt->execute([$productId, (string) $key, (string) $value, $order++]);
    }
}

function save_product_images(PDO $pdo, int $productId, array $images): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)'
    );
    $order = 0;
    foreach (array_unique(array_filter($images)) as $image) {
        $stmt->execute([$productId, (string) $image, $order++]);
    }
}

function find_category_id(PDO $pdo, string $key): ?int
{
    $stmt = $pdo->prepare('SELECT id FROM categories WHERE key_name = ? OR slug = ? LIMIT 1');
    $stmt->execute([$key, $key]);
    $id = $stmt->fetchColumn();

    return $id ? (int) $id : null;
}

function find_or_create_brand_id(PDO $pdo, string $name): int
{
    $name = trim($name);
    $stmt = $pdo->prepare('SELECT id FROM brands WHERE name = ? LIMIT 1');
    $stmt->execute([$name]);
    $id = $stmt->fetchColumn();
    if ($id) {
        return (int) $id;
    }

    $stmt = $pdo->prepare('INSERT INTO brands (name, slug) VALUES (?, ?)');
    $stmt->execute([$name, slugify($name)]);

    return (int) $pdo->lastInsertId();
}

function handle_cart(PDO $pdo, string $method, ?string $id, ?string $nested): never
{
    $user = require_user();

    if ($method === 'GET') {
        $stmt = $pdo->prepare(
            'SELECT ci.product_id AS id, ci.quantity AS qty
             FROM cart_items ci
             JOIN products p ON p.id = ci.product_id AND p.is_active = 1
             WHERE ci.user_id = ?
             ORDER BY ci.created_at DESC'
        );
        $stmt->execute([(int) $user['id']]);
        send_json(['data' => $stmt->fetchAll()]);
    }

    if (($method === 'POST' || $method === 'PUT') && $id === 'items') {
        $data = json_input();
        require_fields($data, ['product_id', 'quantity']);
        $productId = (int) $data['product_id'];
        $qty = max(1, (int) $data['quantity']);
        $product = find_product($pdo, $productId);
        if (!$product || $product['stock'] < 1) {
            send_error('San pham khong kha dung.', 422);
        }
        $qty = min($qty, $product['stock']);
        $stmt = $pdo->prepare(
            'INSERT INTO cart_items (user_id, product_id, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)'
        );
        $stmt->execute([(int) $user['id'], $productId, $qty]);
        send_json(['message' => 'Da cap nhat gio hang.']);
    }

    if ($method === 'DELETE' && $id === 'items' && $nested !== null) {
        $stmt = $pdo->prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?');
        $stmt->execute([(int) $user['id'], (int) $nested]);
        send_json(['message' => 'Da xoa khoi gio hang.']);
    }

    if ($method === 'DELETE' && $id === null) {
        $stmt = $pdo->prepare('DELETE FROM cart_items WHERE user_id = ?');
        $stmt->execute([(int) $user['id']]);
        send_json(['message' => 'Da xoa gio hang.']);
    }

    send_error('Method not allowed.', 405);
}

function handle_wishlist(PDO $pdo, string $method, ?string $id): never
{
    $user = require_user();

    if ($method === 'GET') {
        $stmt = $pdo->prepare('SELECT product_id AS id FROM wishlists WHERE user_id = ? ORDER BY created_at DESC');
        $stmt->execute([(int) $user['id']]);
        send_json(['data' => array_map('intval', array_column($stmt->fetchAll(), 'id'))]);
    }

    if ($id === null) {
        send_error('Thieu product id.', 422);
    }

    if ($method === 'POST') {
        $stmt = $pdo->prepare('INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)');
        $stmt->execute([(int) $user['id'], (int) $id]);
        send_json(['message' => 'Da them vao yeu thich.'], 201);
    }

    if ($method === 'DELETE') {
        $stmt = $pdo->prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?');
        $stmt->execute([(int) $user['id'], (int) $id]);
        send_json(['message' => 'Da bo khoi yeu thich.']);
    }

    send_error('Method not allowed.', 405);
}

function handle_coupons(PDO $pdo, string $method, ?string $code): never
{
    if ($method !== 'GET' || $code === null) {
        send_error('Method not allowed.', 405);
    }

    $coupon = find_coupon($pdo, $code);
    if (!$coupon) {
        send_error('Ma giam gia khong hop le.', 404);
    }

    $subtotal = int_param('subtotal', 0);
    $discount = calculate_discount($coupon, $subtotal);
    send_json(['data' => $coupon + ['discount' => $discount]]);
}

function find_coupon(PDO $pdo, string $code): ?array
{
    $stmt = $pdo->prepare(
        'SELECT id, code, discount_percent AS discountPercent, min_order_value AS minOrderValue,
                max_discount AS maxDiscount, usage_limit AS usageLimit, used_count AS usedCount,
                valid_from AS validFrom, valid_to AS validTo, is_active AS isActive
         FROM coupons
         WHERE code = ? AND is_active = 1 AND valid_from <= CURDATE() AND valid_to >= CURDATE()
         LIMIT 1'
    );
    $stmt->execute([strtoupper(trim($code))]);
    $coupon = $stmt->fetch();
    if (!$coupon) {
        return null;
    }
    if ($coupon['usageLimit'] !== null && (int) $coupon['usedCount'] >= (int) $coupon['usageLimit']) {
        return null;
    }

    return $coupon;
}

function calculate_discount(?array $coupon, int $subtotal): int
{
    if (!$coupon || $subtotal < (int) $coupon['minOrderValue']) {
        return 0;
    }

    $discount = (int) floor($subtotal * ((int) $coupon['discountPercent']) / 100);
    return $coupon['maxDiscount'] !== null ? min($discount, (int) $coupon['maxDiscount']) : $discount;
}

function handle_orders(PDO $pdo, string $method, ?string $id, ?string $nested): never
{
    $user = require_user();

    if ($method === 'GET' && $id === null) {
        $stmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
        $stmt->execute([(int) $user['id']]);
        send_json(['data' => $stmt->fetchAll()]);
    }

    if ($method === 'GET' && $id !== null) {
        $order = find_order($pdo, (int) $id, $user);
        if (!$order) {
            send_error('Khong tim thay don hang.', 404);
        }
        send_json(['data' => $order]);
    }

    if ($method === 'POST') {
        create_order($pdo, $user, json_input());
    }

    if (($method === 'PATCH' || $method === 'PUT') && $id !== null && $nested === 'status') {
        require_admin();
        $data = json_input();
        require_fields($data, ['status']);
        $allowed = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
        if (!in_array($data['status'], $allowed, true)) {
            send_error('Trang thai khong hop le.', 422);
        }
        $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $stmt->execute([$data['status'], (int) $id]);
        send_json(['message' => 'Da cap nhat trang thai.']);
    }

    send_error('Method not allowed.', 405);
}

function create_order(PDO $pdo, array $user, array $data): never
{
    require_fields($data, ['receiver_name', 'receiver_phone', 'receiver_address']);

    $items = $data['items'] ?? null;
    if (!is_array($items) || !$items) {
        $stmt = $pdo->prepare('SELECT product_id, quantity FROM cart_items WHERE user_id = ?');
        $stmt->execute([(int) $user['id']]);
        $items = array_map(fn ($row) => [
            'product_id' => (int) $row['product_id'],
            'quantity' => (int) $row['quantity'],
        ], $stmt->fetchAll());
    }

    if (!$items) {
        send_error('Gio hang dang trong.', 422);
    }

    $pdo->beginTransaction();
    try {
        $subtotal = 0;
        $orderItems = [];
        foreach ($items as $item) {
            $product = find_product($pdo, (int) ($item['product_id'] ?? $item['id'] ?? 0));
            $qty = max(1, (int) ($item['quantity'] ?? $item['qty'] ?? 1));
            if (!$product || $product['stock'] < $qty) {
                throw new RuntimeException('San pham khong du ton kho: ' . ($product['name'] ?? 'unknown'));
            }
            $lineTotal = $product['price'] * $qty;
            $subtotal += $lineTotal;
            $orderItems[] = [$product, $qty];
        }

        $coupon = !empty($data['coupon_code']) ? find_coupon($pdo, (string) $data['coupon_code']) : null;
        $shipping = $subtotal >= 10000000 ? 0 : 50000;
        $discount = calculate_discount($coupon, $subtotal);
        $total = max(0, $subtotal + $shipping - $discount);
        $orderCode = 'PCG' . date('ymdHis') . random_int(10, 99);

        $stmt = $pdo->prepare(
            'INSERT INTO orders
             (user_id, order_code, subtotal, shipping_fee, discount, total, coupon_id,
              receiver_name, receiver_phone, receiver_address, payment_method, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            (int) $user['id'],
            $orderCode,
            $subtotal,
            $shipping,
            $discount,
            $total,
            $coupon['id'] ?? null,
            trim((string) $data['receiver_name']),
            trim((string) $data['receiver_phone']),
            trim((string) $data['receiver_address']),
            $data['payment_method'] ?? 'cod',
            $data['note'] ?? null,
        ]);
        $orderId = (int) $pdo->lastInsertId();

        $itemStmt = $pdo->prepare(
            'INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stockStmt = $pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
        foreach ($orderItems as [$product, $qty]) {
            $itemStmt->execute([$orderId, $product['id'], $product['name'], $product['price'], $qty]);
            $stockStmt->execute([$qty, $product['id']]);
        }

        if ($coupon) {
            $pdo->prepare('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?')->execute([(int) $coupon['id']]);
            $pdo->prepare('INSERT INTO coupon_usages (coupon_id, user_id, order_id) VALUES (?, ?, ?)')
                ->execute([(int) $coupon['id'], (int) $user['id'], $orderId]);
        }

        $pdo->prepare('DELETE FROM cart_items WHERE user_id = ?')->execute([(int) $user['id']]);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        send_error($e->getMessage(), 422);
    }

    send_json(['data' => find_order($pdo, $orderId, $user)], 201);
}

function find_order(PDO $pdo, int $id, array $user): ?array
{
    $sql = 'SELECT * FROM orders WHERE id = ?';
    $params = [$id];
    if (($user['role'] ?? '') !== 'admin') {
        $sql .= ' AND user_id = ?';
        $params[] = (int) $user['id'];
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $order = $stmt->fetch();
    if (!$order) {
        return null;
    }

    $stmt = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id');
    $stmt->execute([$id]);
    $order['items'] = $stmt->fetchAll();

    return $order;
}

function handle_blog_posts(PDO $pdo, string $method, ?string $id): never
{
    if ($method !== 'GET') {
        send_error('Method not allowed.', 405);
    }

    if ($id !== null) {
        $stmt = $pdo->prepare('SELECT * FROM blog_posts WHERE id = ? AND is_published = 1');
        $stmt->execute([(int) $id]);
        $post = $stmt->fetch();
        if (!$post) {
            send_error('Khong tim thay bai viet.', 404);
        }
        send_json(['data' => $post]);
    }

    $stmt = $pdo->query('SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC, id DESC');
    send_json(['data' => $stmt->fetchAll()]);
}

function find_user_by_id(PDO $pdo, int $id): array
{
    $stmt = $pdo->prepare(
        'SELECT id, fullname, email, phone, avatar, role, address, created_at FROM users WHERE id = ?'
    );
    $stmt->execute([$id]);
    $user = $stmt->fetch();
    if (!$user) {
        send_error('Khong tim thay user.', 404);
    }

    return $user;
}
