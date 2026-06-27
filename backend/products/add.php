<?php
require_once __DIR__ . '/../config/db.php';

require_admin();

try {
    $product = save_product(input_data());
    json_response(['success' => true, 'data' => $product], 201);
} catch (Throwable $e) {
    json_error('Loi server: ' . $e->getMessage(), 500);
}
