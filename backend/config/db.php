<?php
if (PHP_SAPI !== 'cli' && session_status() === PHP_SESSION_NONE) {
    session_start();
}

date_default_timezone_set('Asia/Ho_Chi_Minh');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit;
}

function db_config()
{
    $envFile = __DIR__ . '/../.env';
    if (is_file($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = array_map('trim', explode('=', $line, 2));
            if (getenv($key) === false) {
                putenv($key . '=' . $value);
            }
        }
    }

    return [
        'host' => getenv('DB_HOST') ?: '127.0.0.1',
        'port' => getenv('DB_PORT') ?: '3306',
        'database' => getenv('DB_DATABASE') ?: 'pcgear_store',
        'username' => getenv('DB_USERNAME') ?: 'root',
        'password' => getenv('DB_PASSWORD') ?: '',
        'charset' => 'utf8mb4',
    ];
}

function db()
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $config = db_config();
    $dsn = 'mysql:host=' . $config['host'] .
        ';port=' . $config['port'] .
        ';dbname=' . $config['database'] .
        ';charset=' . $config['charset'];

    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function json_response($data, $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error($message, $status = 400)
{
    json_response(['success' => false, 'message' => $message], $status);
}

function input_data()
{
    if (!empty($_POST)) {
        return $_POST;
    }

    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Du lieu JSON khong hop le.', 422);
    }

    return $data;
}

function require_fields($data, $fields)
{
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
            json_error('Thieu thong tin: ' . $field, 422);
        }
    }
}

function current_user()
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $stmt = db()->prepare(
        'SELECT id, fullname, email, phone, avatar, role, address, created_at FROM users WHERE id = ?'
    );
    $stmt->execute([(int) $_SESSION['user_id']]);
    $user = $stmt->fetch();

    return $user ?: null;
}

function require_login()
{
    $user = current_user();
    if (!$user) {
        json_error('Vui long dang nhap.', 401);
    }

    return $user;
}

function require_admin()
{
    $user = require_login();
    if (($user['role'] ?? '') !== 'admin') {
        json_error('Can quyen admin.', 403);
    }

    return $user;
}

function int_param($key, $default = null)
{
    if (!isset($_GET[$key]) || $_GET[$key] === '') {
        return $default;
    }

    return max(0, (int) $_GET[$key]);
}

function str_param($key, $default = null)
{
    if (!isset($_GET[$key])) {
        return $default;
    }

    $value = trim((string) $_GET[$key]);
    return $value === '' ? $default : $value;
}

function slugify($value)
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value);
    $value = trim((string) $value, '-');

    return $value !== '' ? $value : 'san-pham';
}

function product_query()
{
    return 'SELECT p.*, c.key_name AS category_key, c.label AS category_label, b.name AS brand_name
        FROM products p
        JOIN categories c ON c.id = p.category_id
        JOIN brands b ON b.id = p.brand_id';
}

function map_product($row)
{
    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'category' => $row['category_key'],
        'categoryLabel' => $row['category_label'],
        'brand' => $row['brand_name'],
        'price' => (int) $row['price'],
        'oldPrice' => $row['old_price'] !== null ? (int) $row['old_price'] : null,
        'image' => $row['image'],
        'badge' => $row['badge'],
        'badgeText' => $row['badge_text'],
        'spec' => $row['spec_short'],
        'desc' => $row['description'],
        'stock' => (int) $row['stock'],
        'rating' => (float) $row['rating'],
        'reviews' => (int) $row['review_count'],
        'isActive' => (bool) $row['is_active'],
        'createdAt' => $row['created_at'] ?? null,
        'updatedAt' => $row['updated_at'] ?? null,
        'specs' => [],
        'images' => [],
    ];
}

function load_product_extra(&$products)
{
    if (!$products) {
        return;
    }

    $ids = array_keys($products);
    $marks = implode(',', array_fill(0, count($ids), '?'));

    $stmt = db()->prepare(
        "SELECT product_id, spec_key, spec_value FROM product_specs
         WHERE product_id IN ($marks)
         ORDER BY product_id, sort_order, id"
    );
    $stmt->execute($ids);
    foreach ($stmt->fetchAll() as $row) {
        $id = (int) $row['product_id'];
        $products[$id]['specs'][$row['spec_key']] = $row['spec_value'];
    }

    $stmt = db()->prepare(
        "SELECT product_id, image_url FROM product_images
         WHERE product_id IN ($marks)
         ORDER BY product_id, sort_order, id"
    );
    $stmt->execute($ids);
    foreach ($stmt->fetchAll() as $row) {
        $id = (int) $row['product_id'];
        $products[$id]['images'][] = $row['image_url'];
    }

    foreach ($products as &$product) {
        if (!$product['images']) {
            $product['images'] = [$product['image']];
        }
    }
}

function find_product($id, $activeOnly = true)
{
    $sql = product_query() . ' WHERE p.id = ?';
    if ($activeOnly) {
        $sql .= ' AND p.is_active = 1';
    }

    $stmt = db()->prepare($sql);
    $stmt->execute([(int) $id]);
    $row = $stmt->fetch();
    if (!$row) {
        return null;
    }

    $products = [(int) $row['id'] => map_product($row)];
    load_product_extra($products);

    return $products[(int) $row['id']];
}

function category_id($key)
{
    $stmt = db()->prepare('SELECT id FROM categories WHERE key_name = ? OR slug = ? LIMIT 1');
    $stmt->execute([$key, $key]);
    $id = $stmt->fetchColumn();

    return $id ? (int) $id : null;
}

function brand_id($name)
{
    $name = trim((string) $name);
    $stmt = db()->prepare('SELECT id FROM brands WHERE name = ? LIMIT 1');
    $stmt->execute([$name]);
    $id = $stmt->fetchColumn();
    if ($id) {
        return (int) $id;
    }

    $stmt = db()->prepare('INSERT INTO brands (name, slug) VALUES (?, ?)');
    $stmt->execute([$name, slugify($name)]);

    return (int) db()->lastInsertId();
}

function save_product($data, $id = null)
{
    require_fields($data, ['name', 'category', 'brand', 'price']);

    $catId = category_id((string) $data['category']);
    if (!$catId) {
        json_error('Danh muc khong ton tai.', 422);
    }

    $brandId = brand_id((string) $data['brand']);
    $price = max(1, (int) $data['price']);
    $oldPrice = isset($data['oldPrice']) && $data['oldPrice'] !== '' ? (int) $data['oldPrice'] : null;
    if ($oldPrice !== null && $oldPrice < $price) {
        $oldPrice = $price;
    }

    $slug = slugify((string) ($data['slug'] ?? $data['name']));
    if ($id === null) {
        $slug .= '-' . time();
    }

    $values = [
        trim((string) $data['name']),
        $slug,
        $catId,
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

    $pdo = db();
    $pdo->beginTransaction();

    try {
        if ($id === null) {
            $stmt = $pdo->prepare(
                'INSERT INTO products
                 (name, slug, category_id, brand_id, price, old_price, image, badge, badge_text,
                  spec_short, description, stock, rating, review_count)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute($values);
            $id = (int) $pdo->lastInsertId();
        } else {
            $values[] = (int) $id;
            $stmt = $pdo->prepare(
                'UPDATE products SET
                 name = ?, slug = ?, category_id = ?, brand_id = ?, price = ?, old_price = ?,
                 image = ?, badge = ?, badge_text = ?, spec_short = ?, description = ?,
                 stock = ?, rating = ?, review_count = ?, is_active = 1
                 WHERE id = ?'
            );
            $stmt->execute($values);
            $pdo->prepare('DELETE FROM product_specs WHERE product_id = ?')->execute([(int) $id]);
            $pdo->prepare('DELETE FROM product_images WHERE product_id = ?')->execute([(int) $id]);
        }

        save_product_specs((int) $id, $data['specs'] ?? []);
        save_product_images((int) $id, $data['images'] ?? [$data['image'] ?? 'assets/img/default.svg']);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    return find_product((int) $id, false);
}

function save_product_specs($productId, $specs)
{
    if (!is_array($specs)) {
        return;
    }

    $stmt = db()->prepare(
        'INSERT INTO product_specs (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?)'
    );
    $order = 0;
    foreach ($specs as $key => $value) {
        if (trim((string) $key) === '' || trim((string) $value) === '') {
            continue;
        }
        $stmt->execute([(int) $productId, (string) $key, (string) $value, $order++]);
    }
}

function save_product_images($productId, $images)
{
    if (!is_array($images)) {
        return;
    }

    $stmt = db()->prepare(
        'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)'
    );
    $order = 0;
    foreach (array_unique(array_filter($images)) as $image) {
        $stmt->execute([(int) $productId, (string) $image, $order++]);
    }
}

function find_coupon($code)
{
    $stmt = db()->prepare(
        'SELECT id, code, discount_percent AS discountPercent, min_order_value AS minOrderValue,
                max_discount AS maxDiscount, usage_limit AS usageLimit, used_count AS usedCount,
                valid_from AS validFrom, valid_to AS validTo, is_active AS isActive
         FROM coupons
         WHERE code = ? AND is_active = 1 AND valid_from <= CURDATE() AND valid_to >= CURDATE()
         LIMIT 1'
    );
    $stmt->execute([strtoupper(trim((string) $code))]);
    $coupon = $stmt->fetch();

    if (!$coupon) {
        return null;
    }

    if ($coupon['usageLimit'] !== null && (int) $coupon['usedCount'] >= (int) $coupon['usageLimit']) {
        return null;
    }

    return $coupon;
}

function coupon_discount($coupon, $subtotal)
{
    if (!$coupon || $subtotal < (int) $coupon['minOrderValue']) {
        return 0;
    }

    $discount = (int) floor($subtotal * ((int) $coupon['discountPercent']) / 100);
    if ($coupon['maxDiscount'] !== null) {
        $discount = min($discount, (int) $coupon['maxDiscount']);
    }

    return $discount;
}
