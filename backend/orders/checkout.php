<?php
require_once __DIR__ . '/../config/db.php';

$user = require_login();
$data = input_data();

require_fields($data, ['receiver_name', 'receiver_phone', 'receiver_address']);

try {
    $pdo = null;
    $items = $data['items'] ?? [];
    if (!is_array($items) || count($items) === 0) {
        $stmt = db()->prepare('SELECT product_id, quantity FROM cart_items WHERE user_id = ?');
        $stmt->execute([(int) $user['id']]);
        $items = $stmt->fetchAll();
    }

    if (!$items) {
        json_error('Gio hang dang trong.', 422);
    }

    $pdo = db();
    $pdo->beginTransaction();

    $subtotal = 0;
    $orderItems = [];

    foreach ($items as $item) {
        $productId = (int) ($item['product_id'] ?? $item['id'] ?? 0);
        $quantity = max(1, (int) ($item['quantity'] ?? $item['qty'] ?? 1));
        $product = find_product($productId);

        if (!$product || (int) $product['stock'] < $quantity) {
            throw new RuntimeException('San pham khong du ton kho.');
        }

        $subtotal += (int) $product['price'] * $quantity;
        $orderItems[] = [$product, $quantity];
    }

    $coupon = !empty($data['coupon_code']) ? find_coupon((string) $data['coupon_code']) : null;
    $shipping = $subtotal >= 10000000 ? 0 : 50000;
    $discount = coupon_discount($coupon, $subtotal);
    $total = max(0, $subtotal + $shipping - $discount);
    $orderCode = 'PCG' . date('ymdHis') . random_int(10, 99);

    $stmt = $pdo->prepare(
        'INSERT INTO orders
         (user_id, order_code, subtotal, shipping_fee, discount, total, coupon_id,
          receiver_name, receiver_phone, receiver_address, payment_method, note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        (int) $user['id'],
        $orderCode,
        $subtotal,
        $shipping,
        $discount,
        $total,
        $coupon['id'] ?? null,
        trim((string) $data['receiver_name']),
        trim((string) $data['receiver_phone']),
        trim((string) $data['receiver_address']),
        $data['payment_method'] ?? 'cod',
        $data['note'] ?? null,
    ]);
    $orderId = (int) $pdo->lastInsertId();

    $itemStmt = $pdo->prepare(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stockStmt = $pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    foreach ($orderItems as [$product, $quantity]) {
        $itemStmt->execute([$orderId, $product['id'], $product['name'], $product['price'], $quantity]);
        $stockStmt->execute([$quantity, $product['id']]);
    }

    if ($coupon) {
        $pdo->prepare('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?')->execute([(int) $coupon['id']]);
        $pdo->prepare('INSERT INTO coupon_usages (coupon_id, user_id, order_id) VALUES (?, ?, ?)')
            ->execute([(int) $coupon['id'], (int) $user['id'], $orderId]);
    }

    $pdo->prepare('DELETE FROM cart_items WHERE user_id = ?')->execute([(int) $user['id']]);
    $pdo->commit();

    json_response([
        'success' => true,
        'data' => [
            'id' => $orderId,
            'order_code' => $orderCode,
            'subtotal' => $subtotal,
            'shipping_fee' => $shipping,
            'discount' => $discount,
            'total' => $total,
            'status' => 'pending',
        ],
    ], 201);
} catch (Throwable $e) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_error('Khong the dat hang: ' . $e->getMessage(), 422);
}
