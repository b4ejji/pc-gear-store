<?php
require_once __DIR__ . '/../config/db.php';

require_admin();

$id = (int) ($_GET['id'] ?? 0);
if ($id <= 0) {
    json_error('Thieu ma san pham.', 422);
}

try {
    $stmt = db()->prepare('UPDATE products SET is_active = 0 WHERE id = ?');
    $stmt->execute([$id]);

    json_response(['success' => true, 'message' => 'Da xoa san pham.']);
} catch (Throwable $e) {
    json_error('Loi server: ' . $e->getMessage(), 500);
}
