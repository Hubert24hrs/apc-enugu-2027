<?php
// Database Configuration for Admin Panel
define('DB_HOST', 'localhost');
define('DB_NAME', 'apcgaten_members');
define('DB_USER', 'apcgaten_apcgaten');
define('DB_PASS', 'Idokonelson2306');

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
?>
