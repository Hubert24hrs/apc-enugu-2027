<?php
require_once 'config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDB();
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['post_id'])) {
        echo json_encode(['success' =>  false, 'message' => 'Post ID required']);
        exit;
    }
    
    $postId = (int)$data['post_id'];
    
    // Increment like count
    $stmt = $pdo->prepare("UPDATE forum_posts SET likes = likes + 1 WHERE id = ?");
    $stmt->execute([$postId]);
    
    // Get updated like count
    $stmt = $pdo->prepare("SELECT likes FROM forum_posts WHERE id = ?");
    $stmt->execute([$postId]);
    $result = $stmt->fetch();
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'likes' => $result['likes']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Post not found']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
