<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'apcgaten_members');
define('DB_USER', 'apcgaten_apcgaten');
define('DB_PASS', 'Idokonelson2306');

// Create database connection
function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        die("Database connection failed: " . $e->getMessage());
    }
}

// Enable CORS for AJAX requests (restricted to your domain)
$allowed_origins = [
    'https://apcgat2027enugu.com.ng',
    'https://www.apcgat2027enugu.com.ng',
    'http://apcgat2027enugu.com.ng',
    'http://www.apcgat2027enugu.com.ng'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Allow same-origin requests (when no Origin header)
    header("Access-Control-Allow-Origin: https://apcgat2027enugu.com.ng");
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
?>
