<?php
require_once 'config.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST;
}

// Validate required fields
$required = ['name', 'email', 'message'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit();
    }
}

try {
    $pdo = getDB();
    
    // Prepare and execute insert
    $stmt = $pdo->prepare("
        INSERT INTO contacts (name, email, phone, lga, message, status)
        VALUES (:name, :email, :phone, :lga, :message, 'unread')
    ");
    
    $stmt->execute([
        ':name' => $data['name'],
        ':email' => $data['email'],
        ':phone' => $data['phone'] ?? null,
        ':lga' => $data['lga'] ?? null,
        ':message' => $data['message']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully!'
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
