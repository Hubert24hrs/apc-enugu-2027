<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

// Enable CORS for the main domain
$allowed_origins = [
    'https://apcgat2027enugu.com.ng',
    'https://www.apcgat2027enugu.com.ng',
    'http://apcgat2027enugu.com.ng',
    'http://www.apcgat2027enugu.com.ng',
    'http://localhost',
    'http://127.0.0.1'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

// Check if admin is logged in via backend
$isAdmin = isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']);

echo json_encode([
    'isAdmin' => $isAdmin,
    'adminName' => $_SESSION['admin_name'] ?? null
]);
?>
