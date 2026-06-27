<?php
require_once __DIR__ . '/../config/db.php';

$data = input_data();
$action = $_GET['action'] ?? ($data['action'] ?? 'login');

try {
    if ($action === 'register') {
        require_fields($data, ['fullname', 'email', 'password']);

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            json_error('Email khong hop le.', 422);
        }

        if (strlen((string) $data['password']) < 6) {
            json_error('Mat khau toi thieu 6 ky tu.', 422);
        }

        $email = strtolower(trim((string) $data['email']));
        $stmt = db()->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            json_error('Email da duoc dang ky.', 409);
        }

        $stmt = db()->prepare(
            'INSERT INTO users (fullname, email, password, phone, address, role)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            trim((string) $data['fullname']),
            $email,
            password_hash((string) $data['password'], PASSWORD_DEFAULT),
            $data['phone'] ?? null,
            $data['address'] ?? null,
            'customer',
        ]);

        $_SESSION['user_id'] = (int) db()->lastInsertId();
        json_response(['success' => true, 'user' => current_user()], 201);
    }

    require_fields($data, ['email', 'password']);

    $email = strtolower(trim((string) $data['email']));
    $stmt = db()->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify((string) $data['password'], $user['password'])) {
        json_error('Email hoac mat khau khong dung.', 401);
    }

    $_SESSION['user_id'] = (int) $user['id'];
    unset($user['password']);

    json_response(['success' => true, 'user' => $user]);
} catch (Throwable $e) {
    json_error('Loi server: ' . $e->getMessage(), 500);
}
