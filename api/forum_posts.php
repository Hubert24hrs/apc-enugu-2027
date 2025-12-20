<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

if ($method === 'GET') {
    // Fetch all posts
    $stmt = $pdo->query("SELECT * FROM forum_posts ORDER BY created_at DESC");
    $posts = $stmt->fetchAll();
    
    // Format date for frontend
    foreach ($posts as &$post) {
        $date = new DateTime($post['created_at']);
        $post['date'] = $date->format('F j, Y');
    }
    
    echo json_encode(['success' => true, 'posts' => $posts]);
} 
elseif ($method === 'POST') {
    // Create new post
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['title']) || !isset($data['content'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO forum_posts (type, title, content, image, author, author_role) VALUES (?, ?, ?, ?, ?, ?)");
    
    $result = $stmt->execute([
        $data['type'] ?? 'post',
        $data['title'],
        $data['content'],
        $data['image'] ?? null,
        $data['author'] ?? 'Admin',
        $data['authorRole'] ?? 'Admin'
    ]);
    
    if ($result) {
        // Return the created post
        $id = $pdo->lastInsertId();
        // Fetch it back to get the correct structure
        $stmt = $pdo->prepare("SELECT * FROM forum_posts WHERE id = ?");
        $stmt->execute([$id]);
        $newPost = $stmt->fetch();
        $date = new DateTime($newPost['created_at']);
        $newPost['date'] = $date->format('F j, Y');
        
        echo json_encode(['success' => true, 'post' => $newPost]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create post']);
    }
}
elseif ($method === 'DELETE') {
    // Delete post - Get ID from query string
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Missing post ID']);
        exit;
    }
    
    $stmt = $pdo->prepare("DELETE FROM forum_posts WHERE id = ?");
    if ($stmt->execute([$id])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete post']);
    }
}
?>
