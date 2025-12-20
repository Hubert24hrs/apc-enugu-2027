<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

if ($method === 'GET') {
    // Fetch comments for a post
    $postId = $_GET['post_id'] ?? null;
    
    if (!$postId) {
        echo json_encode(['success' => false, 'message' => 'Missing post ID']);
        exit;
    }
    
    $stmt = $pdo->prepare("SELECT * FROM forum_comments WHERE post_id = ? ORDER BY created_at DESC");
    $stmt->execute([$postId]);
    $comments = $stmt->fetchAll();
    
    foreach ($comments as &$comment) {
        $date = new DateTime($comment['created_at']);
        $comment['date'] = $date->format('M j, g:i A');
    }
    
    echo json_encode(['success' => true, 'comments' => $comments]);
} 
elseif ($method === 'POST') {
    // Add new comment
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['post_id']) || !isset($data['name']) || !isset($data['comment'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO forum_comments (post_id, name, comment) VALUES (?, ?, ?)");
    $result = $stmt->execute([
        $data['post_id'],
        $data['name'],
        $data['comment']
    ]);
    
    if ($result) {
        $id = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM forum_comments WHERE id = ?");
        $stmt->execute([$id]);
        $newComment = $stmt->fetch();
        $date = new DateTime($newComment['created_at']);
        $newComment['date'] = $date->format('M j, g:i A');
        $newComment['text'] = $newComment['comment']; // For frontend compatibility
        
        echo json_encode(['success' => true, 'comment' => $newComment]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add comment']);
    }
}
?>
