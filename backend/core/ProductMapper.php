<?php

function map_product(array $row): array
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

function product_base_query(): string
{
    return 'SELECT p.*, c.key_name AS category_key, c.label AS category_label, b.name AS brand_name
        FROM products p
        JOIN categories c ON c.id = p.category_id
        JOIN brands b ON b.id = p.brand_id';
}

function load_product_children(PDO $pdo, array &$products): void
{
    if (!$products) {
        return;
    }

    $ids = array_column($products, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    $specStmt = $pdo->prepare(
        "SELECT product_id, spec_key, spec_value FROM product_specs
         WHERE product_id IN ($placeholders)
         ORDER BY product_id, sort_order, id"
    );
    $specStmt->execute($ids);
    foreach ($specStmt->fetchAll() as $spec) {
        $id = (int) $spec['product_id'];
        $products[$id]['specs'][$spec['spec_key']] = $spec['spec_value'];
    }

    $imageStmt = $pdo->prepare(
        "SELECT product_id, image_url FROM product_images
         WHERE product_id IN ($placeholders)
         ORDER BY product_id, sort_order, id"
    );
    $imageStmt->execute($ids);
    foreach ($imageStmt->fetchAll() as $image) {
        $id = (int) $image['product_id'];
        $products[$id]['images'][] = $image['image_url'];
    }

    foreach ($products as &$product) {
        if (!$product['images']) {
            $product['images'] = [$product['image']];
        }
    }
}

function slugify(string $value): string
{
    $value = trim(strtolower($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value);
    $value = trim((string) $value, '-');

    return $value !== '' ? $value : 'item-' . time();
}
