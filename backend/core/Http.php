<?php

function send_json(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function send_error(string $message, int $status = 400, array $details = []): never
{
    send_json(['message' => $message, 'errors' => $details], $status);
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        send_error('JSON body khong hop le.', 422);
    }

    return $decoded;
}

function request_header(string $name): ?string
{
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    if (isset($_SERVER[$key])) {
        return $_SERVER[$key];
    }

    $redirectKey = 'REDIRECT_' . $key;
    if (isset($_SERVER[$redirectKey])) {
        return $_SERVER[$redirectKey];
    }

    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $header => $value) {
            if (strtolower($header) === strtolower($name)) {
                return $value;
            }
        }
    }

    return null;
}

function require_fields(array $data, array $fields): void
{
    $missing = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
            $missing[$field] = 'Bat buoc.';
        }
    }

    if ($missing) {
        send_error('Du lieu chua day du.', 422, $missing);
    }
}

function int_param(string $key, ?int $default = null): ?int
{
    if (!isset($_GET[$key]) || $_GET[$key] === '') {
        return $default;
    }

    return max(0, (int) $_GET[$key]);
}

function str_param(string $key, ?string $default = null): ?string
{
    if (!isset($_GET[$key])) {
        return $default;
    }

    $value = trim((string) $_GET[$key]);
    return $value === '' ? $default : $value;
}
