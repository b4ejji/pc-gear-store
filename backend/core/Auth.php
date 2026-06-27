<?php

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Http.php';

function base64url_encode_string(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function base64url_decode_string(string $value): string|false
{
    $padding = strlen($value) % 4;
    if ($padding) {
        $value .= str_repeat('=', 4 - $padding);
    }

    return base64_decode(strtr($value, '-_', '+/'), true);
}

function create_token(array $user): string
{
    $config = require __DIR__ . '/../config.php';
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $payload = [
        'sub' => (int) $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'iat' => time(),
        'exp' => time() + 60 * 60 * 24 * 7,
    ];

    $body = base64url_encode_string(json_encode($header)) . '.' .
        base64url_encode_string(json_encode($payload));
    $signature = hash_hmac('sha256', $body, $config['jwt_secret'], true);

    return $body . '.' . base64url_encode_string($signature);
}

function verify_token(?string $token): ?array
{
    if (!$token) {
        return null;
    }

    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$header, $payload, $signature] = $parts;
    $config = require __DIR__ . '/../config.php';
    $expected = base64url_encode_string(hash_hmac('sha256', "$header.$payload", $config['jwt_secret'], true));

    if (!hash_equals($expected, $signature)) {
        return null;
    }

    $decoded = base64url_decode_string($payload);
    if ($decoded === false) {
        return null;
    }

    $claims = json_decode($decoded, true);
    if (!is_array($claims) || ($claims['exp'] ?? 0) < time()) {
        return null;
    }

    return $claims;
}

function current_user(): ?array
{
    $header = request_header('Authorization');
    if (!$header || !preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
        return null;
    }

    $claims = verify_token($matches[1]);
    if (!$claims) {
        return null;
    }

    $stmt = Database::connection()->prepare(
        'SELECT id, fullname, email, phone, avatar, role, address, created_at FROM users WHERE id = ?'
    );
    $stmt->execute([(int) $claims['sub']]);
    $user = $stmt->fetch();

    return $user ?: null;
}

function require_user(): array
{
    $user = current_user();
    if (!$user) {
        send_error('Vui long dang nhap.', 401);
    }

    return $user;
}

function require_admin(): array
{
    $user = require_user();
    if (($user['role'] ?? '') !== 'admin') {
        send_error('Can quyen admin.', 403);
    }

    return $user;
}
