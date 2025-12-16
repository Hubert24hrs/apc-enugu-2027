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
$required = ['fullName', 'email', 'phone', 'lga'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit();
    }
}

try {
    $pdo = getDB();
    
    // Generate membership number
    $membershipNo = 'GAT2027/ENU/' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT);
    
    // Prepare and execute insert
    $stmt = $pdo->prepare("
        INSERT INTO members (full_name, email, phone, lga, ward, occupation, gender, dob, address, interests, membership_no, status)
        VALUES (:full_name, :email, :phone, :lga, :ward, :occupation, :gender, :dob, :address, :interests, :membership_no, 'pending')
    ");
    
    $stmt->execute([
        ':full_name' => $data['fullName'],
        ':email' => $data['email'],
        ':phone' => $data['phone'],
        ':lga' => $data['lga'],
        ':ward' => $data['ward'] ?? null,
        ':occupation' => $data['occupation'] ?? null,
        ':gender' => $data['gender'] ?? null,
        ':dob' => $data['dob'] ?? null,
        ':address' => $data['address'] ?? null,
        ':interests' => is_array($data['interests'] ?? null) ? implode(', ', $data['interests']) : ($data['interests'] ?? null),
        ':membership_no' => $membershipNo
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Membership application submitted successfully!',
        'membershipNo' => $membershipNo
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
