<?php
require_once __DIR__ . '/../config/db.php';

$user = require_login();

try {
    $stmt = db()->prepare(
        'SELECT ci.product_id AS id, ci.quantity AS qty
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id AND p.is_active = 1
         WHERE ci.user_id = ?
         ORDER BY ci.created_at DESC'
    );
    $stmt->execute([(int) $user['id']]);

    json_response(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (Throwable $e) {
    json_error('Loi server: ' . $e->getMessage(), 500);
}
