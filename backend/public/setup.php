<?php

declare(strict_types=1);

require_once __DIR__ . '/../database/setup.php';

$ok = false;
$lines = [];
$error = null;

try {
    $lines = setup_database();
    $ok = true;
} catch (Throwable $e) {
    http_response_code(500);
    $error = $e->getMessage();
}
?>
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Setup Backend | PC Gear Store</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f7fb; color: #172033; margin: 0; padding: 48px 18px; }
    main { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #dfe5f2; border-radius: 8px; padding: 28px; }
    h1 { margin: 0 0 12px; font-size: 28px; }
    .status { padding: 14px 16px; border-radius: 6px; margin: 18px 0; line-height: 1.6; }
    .ok { background: #eaf8ef; color: #176b37; border: 1px solid #bfe8cc; }
    .error { background: #fff0f0; color: #9a2020; border: 1px solid #f2bcbc; }
    code { background: #eef2f7; padding: 2px 6px; border-radius: 4px; }
    a { color: #1458d4; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <h1>PC Gear Store Backend Setup</h1>
    <p>Trang này chạy setup database local qua Apache/XAMPP.</p>

    <?php if ($ok): ?>
      <div class="status ok">
        <?php foreach ($lines as $line): ?>
          <div><?= htmlspecialchars($line, ENT_QUOTES, 'UTF-8') ?></div>
        <?php endforeach; ?>
      </div>
      <p>Mở health check: <a href="health">backend/public/health</a></p>
      <p>Admin mặc định: <code>admin@pcgear.vn</code> / <code>admin123</code></p>
    <?php else: ?>
      <div class="status error">
        <?= htmlspecialchars((string) $error, ENT_QUOTES, 'UTF-8') ?>
      </div>
      <p>Kiểm tra XAMPP Control Panel đã bật <strong>Apache</strong> và <strong>MySQL</strong>.</p>
    <?php endif; ?>
  </main>
</body>
</html>
