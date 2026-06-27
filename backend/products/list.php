<?php
require_once __DIR__ . '/../config/db.php';

try {
    $page = max(1, int_param('page', 1));
    $perPage = min(50, max(1, int_param('per_page', 50)));
    $where = ['p.is_active = 1'];
    $params = [];

    $q = str_param('q');
    if ($q) {
        $where[] = '(p.name LIKE ? OR p.spec_short LIKE ? OR p.description LIKE ? OR b.name LIKE ? OR c.key_name LIKE ?)';
        $term = '%' . $q . '%';
        array_push($params, $term, $term, $term, $term, $term);
    }

    $category = str_param('category');
    if ($category) {
        $where[] = 'c.key_name = ?';
        $params[] = $category;
    }

    $brand = str_param('brand');
    if ($brand) {
        $where[] = 'b.name = ?';
        $params[] = $brand;
    }

    $whereSql = ' WHERE ' . implode(' AND ', $where);

    $stmt = db()->prepare(
        'SELECT COUNT(*) FROM products p
         JOIN categories c ON c.id = p.category_id
         JOIN brands b ON b.id = p.brand_id' . $whereSql
    );
    $stmt->execute($params);
    $total = (int) $stmt->fetchColumn();

    $sorts = [
        'price_asc' => 'p.price ASC',
        'price_desc' => 'p.price DESC',
        'name' => 'p.name ASC',
        'rating' => 'p.rating DESC',
        'newest' => 'p.created_at DESC',
    ];
    $sort = $sorts[str_param('sort', 'newest')] ?? $sorts['newest'];
    $offset = ($page - 1) * $perPage;

    $sql = product_query() . $whereSql . " ORDER BY $sort LIMIT $perPage OFFSET $offset";
    $stmt = db()->prepare($sql);
    $stmt->execute($params);

    $products = [];
    foreach ($stmt->fetchAll() as $row) {
        $products[(int) $row['id']] = map_product($row);
    }
    load_product_extra($products);

    json_response([
        'success' => true,
        'data' => array_values($products),
        'meta' => [
            'page' => $page,
            'perPage' => $perPage,
            'total' => $total,
            'totalPages' => (int) ceil($total / $perPage),
        ],
    ]);
} catch (Throwable $e) {
    json_error('Loi server: ' . $e->getMessage(), 500);
}
