<?php
require_once __DIR__ . '/../config/db.php';

$user = require_login();
$data = input_data();
$productId = (int) ($_GET['id'] ?? $data['product_id'] ?? $data['id'] ?? 0);
$clearAll = isset($_GET['all']) || !empty($data['all']);

try {
    if ($clearAll || $productId <= 0) {
        $stmt = db()->prepare('DELETE FROM cart_items WHERE user_id = ?');
        $stmt->execute([(int) $user['id']]);
        json_response(['success' => true, 'message' => 'Da xoa gio hang.']);
    }

    $stmt = db()->prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?');
    $stmt->execute([(int) $user['id'], $productId]);

    json_response(['success' => true, 'message' => 'Da xoa san pham khoi gio hang.']);
} catch (Throwable $e) {
    json_error('Loi server: ' . $e->getMessage(), 500);
}
