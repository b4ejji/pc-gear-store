<?php

declare(strict_types=1);

function setup_database(): array
{
    $config = require __DIR__ . '/../config.php';
    $db = $config['db'];

    $serverDsn = sprintf('mysql:host=%s;port=%s;charset=%s', $db['host'], $db['port'], $db['charset']);
    try {
        $pdo = new PDO($serverDsn, $db['username'], $db['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        throw new RuntimeException(
            "Cannot connect to MySQL at {$db['host']}:{$db['port']}. Start MySQL in XAMPP first. " .
            "Original error: {$e->getMessage()}"
        );
    }

    $database = str_replace('`', '``', $db['database']);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$database`");

    run_sql_file($pdo, __DIR__ . '/schema.sql');
    seed_database($pdo, __DIR__ . '/../data/seed.json');

    return [
        'PC Gear Store backend ready.',
        "Database: {$db['database']}",
        'Admin: admin@pcgear.vn / admin123',
    ];
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    try {
        foreach (setup_database() as $line) {
            echo $line . PHP_EOL;
        }
    } catch (Throwable $e) {
        fwrite(STDERR, $e->getMessage() . PHP_EOL);
        exit(1);
    }
}

function run_sql_file(PDO $pdo, string $path): void
{
    $sql = file_get_contents($path);
    if ($sql === false) {
        throw new RuntimeException("Cannot read SQL file: $path");
    }

    foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
        $pdo->exec($statement);
    }
}

function seed_database(PDO $pdo, string $jsonPath): void
{
    $raw = file_get_contents($jsonPath);
    if ($raw === false) {
        throw new RuntimeException("Cannot read seed file: $jsonPath");
    }

    $seed = json_decode($raw, true);
    if (!is_array($seed)) {
        throw new RuntimeException('Seed JSON is invalid.');
    }

    seed_users($pdo);
    seed_categories($pdo, $seed['categories'] ?? []);
    seed_brands($pdo, $seed['brands'] ?? []);
    seed_coupons($pdo, $seed['coupons'] ?? []);
    seed_products($pdo, $seed['products'] ?? []);
    seed_blog_posts($pdo, $seed['blogPosts'] ?? []);
}

function seed_users(PDO $pdo): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO users (fullname, email, password, role)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE fullname = VALUES(fullname), password = VALUES(password), role = VALUES(role)'
    );
    $stmt->execute([
        'Admin',
        'admin@pcgear.vn',
        password_hash('admin123', PASSWORD_BCRYPT),
        'admin',
    ]);
}

function seed_categories(PDO $pdo, array $categories): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO categories (key_name, label, icon, slug, sort_order)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE label = VALUES(label), icon = VALUES(icon), sort_order = VALUES(sort_order)'
    );

    foreach ($categories as $index => $category) {
        $key = (string) $category['key'];
        $stmt->execute([
            $key,
            (string) $category['label'],
            (string) ($category['icon'] ?? 'fa-tag'),
            slugify_local($key),
            $index + 1,
        ]);
    }
}

function seed_brands(PDO $pdo, array $brands): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO brands (name, slug)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)'
    );

    foreach ($brands as $brand) {
        $name = (string) $brand;
        $stmt->execute([$name, slugify_local($name)]);
    }
}

function seed_coupons(PDO $pdo, array $coupons): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO coupons
         (code, discount_percent, min_order_value, max_discount, usage_limit, valid_from, valid_to, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           discount_percent = VALUES(discount_percent),
           min_order_value = VALUES(min_order_value),
           max_discount = VALUES(max_discount),
           usage_limit = VALUES(usage_limit),
           valid_from = VALUES(valid_from),
           valid_to = VALUES(valid_to),
           is_active = VALUES(is_active)'
    );

    foreach ($coupons as $coupon) {
        $stmt->execute([
            (string) $coupon['code'],
            (int) $coupon['discountPercent'],
            (int) $coupon['minOrderValue'],
            $coupon['maxDiscount'] ?? null,
            100,
            '2026-01-01',
            '2026-12-31',
            !empty($coupon['isActive']) ? 1 : 0,
        ]);
    }
}

function seed_products(PDO $pdo, array $products): void
{
    $categoryIds = fetch_key_ids($pdo, 'categories', 'key_name');
    $brandIds = fetch_key_ids($pdo, 'brands', 'name');

    $productStmt = $pdo->prepare(
        'INSERT INTO products
         (id, name, slug, category_id, brand_id, price, old_price, image, badge, badge_text,
          spec_short, description, stock, rating, review_count, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           slug = VALUES(slug),
           category_id = VALUES(category_id),
           brand_id = VALUES(brand_id),
           price = VALUES(price),
           old_price = VALUES(old_price),
           image = VALUES(image),
           badge = VALUES(badge),
           badge_text = VALUES(badge_text),
           spec_short = VALUES(spec_short),
           description = VALUES(description),
           stock = VALUES(stock),
           rating = VALUES(rating),
           review_count = VALUES(review_count),
           is_active = 1'
    );
    $specStmt = $pdo->prepare(
        'INSERT INTO product_specs (product_id, spec_key, spec_value, sort_order)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE spec_value = VALUES(spec_value), sort_order = VALUES(sort_order)'
    );
    $imageStmt = $pdo->prepare(
        'INSERT INTO product_images (product_id, image_url, sort_order)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order)'
    );

    foreach ($products as $product) {
        $categoryKey = (string) $product['category'];
        $brandName = (string) $product['brand'];
        if (!isset($categoryIds[$categoryKey], $brandIds[$brandName])) {
            continue;
        }

        $id = (int) $product['id'];
        $productStmt->execute([
            $id,
            (string) $product['name'],
            slugify_local((string) $product['name']) . '-' . $id,
            $categoryIds[$categoryKey],
            $brandIds[$brandName],
            (int) $product['price'],
            $product['oldPrice'] ?? null,
            (string) $product['image'],
            $product['badge'] ?? null,
            $product['badgeText'] ?? null,
            $product['spec'] ?? null,
            $product['desc'] ?? null,
            (int) ($product['stock'] ?? 0),
            (float) ($product['rating'] ?? 0),
            (int) ($product['reviews'] ?? 0),
        ]);

        $order = 0;
        foreach (($product['specs'] ?? []) as $key => $value) {
            $specStmt->execute([$id, (string) $key, (string) $value, $order++]);
        }

        $order = 0;
        foreach (array_unique($product['images'] ?? [$product['image']]) as $image) {
            $imageStmt->execute([$id, (string) $image, $order++]);
        }
    }
}

function seed_blog_posts(PDO $pdo, array $posts): void
{
    $adminId = (int) $pdo->query("SELECT id FROM users WHERE email = 'admin@pcgear.vn'")->fetchColumn();
    $stmt = $pdo->prepare(
        'INSERT INTO blog_posts
         (id, title, slug, excerpt, content, category, author_id, image, read_time, is_published, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           excerpt = VALUES(excerpt),
           category = VALUES(category),
           image = VALUES(image),
           read_time = VALUES(read_time),
           is_published = 1,
           published_at = VALUES(published_at)'
    );

    foreach ($posts as $post) {
        $stmt->execute([
            (int) $post['id'],
            (string) $post['title'],
            slugify_local((string) $post['title']) . '-' . (int) $post['id'],
            $post['excerpt'] ?? null,
            $post['excerpt'] ?? null,
            (string) $post['category'],
            $adminId,
            $post['image'] ?? null,
            (int) filter_var((string) ($post['readTime'] ?? '5'), FILTER_SANITIZE_NUMBER_INT),
            ($post['date'] ?? date('Y-m-d')) . ' 08:00:00',
        ]);
    }
}

function fetch_key_ids(PDO $pdo, string $table, string $column): array
{
    $rows = $pdo->query("SELECT id, `$column` AS lookup_key FROM `$table`")->fetchAll();
    $map = [];
    foreach ($rows as $row) {
        $map[(string) $row['lookup_key']] = (int) $row['id'];
    }
    return $map;
}

function slugify_local(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value);
    $value = trim((string) $value, '-');

    return $value !== '' ? $value : 'item';
}
