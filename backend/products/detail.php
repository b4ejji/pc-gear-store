<?php
require_once __DIR__ . '/../config/db.php';

$id = (int) ($_GET['id'] ?? 0);
if ($id <= 0) {
    json_error('Thieu ma san pham.', 422);
}

try {
    $product = find_product($id);
    if (!$product) {
        json_error('Khong tim thay san pham.', 404);
    }

    json_response(['success' => true, 'data' => $product]);
} catch (Throwable $e) {
    json_error('Loi server: ' . $e->getMessage(), 500);
}
