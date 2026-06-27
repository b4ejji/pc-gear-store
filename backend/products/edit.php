<?php
require_once __DIR__ . '/../config/db.php';

require_admin();

$id = (int) ($_GET['id'] ?? 0);
if ($id <= 0) {
    json_error('Thieu ma san pham.', 422);
}

if (!find_product($id, false)) {
    json_error('Khong tim thay san pham.', 404);
}

try {
    $product = save_product(input_data(), $id);
    json_response(['success' => true, 'data' => $product]);
} catch (Throwable $e) {
    json_error('Loi server: ' . $e->getMessage(), 500);
}
