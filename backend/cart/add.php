<?php
require_once __DIR__ . '/../config/db.php';

$user = require_login();
$data = input_data();
$productId = (int) ($data['product_id'] ?? $data['id'] ?? 0);
$quantity = max(1, (int) ($data['quantity'] ?? $data['qty'] ?? 1));

if ($productId <= 0) {
    json_error('Thieu ma san pham.', 422);
}

try {
    $product = find_product($productId);
    if (!$product || (int) $product['stock'] < 1) {
        json_error('San pham khong kha dung.', 422);
    }

    $quantity = min($quantity, (int) $product['stock']);
    $stmt = db()->prepare(
        'INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)'
    );
    $stmt->execute([(int) $user['id'], $productId, $quantity]);

    json_response(['success' => true, 'message' => 'Da cap nhat gio hang.']);
} catch (Throwable $e) {
    json_error('Loi server: ' . $e->getMessage(), 500);
}
