<?php
/**
 * Forum Database Diagnostic Script
 * Tests database connection and forum_posts table status
 */

require_once 'api/config.php';

echo "<h1>Forum Database Diagnostics</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .info { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 8px; margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    table th, table td { padding: 12px; border: 1px solid #ddd; text-align: left; }
    table th { background: #00A859; color: white; }
    .code { background: #f4f4f4; padding: 10px; border-radius: 5px; font-family: monospace; }
</style>";

// Test 1: Database Connection
echo "<h2>1. Database Connection Test</h2>";
try {
    $pdo = getDB();
    echo "<div class='success'>✅ Database connection successful!</div>";
    echo "<div class='info'><strong>Database:</strong> " . DB_NAME . "<br><strong>Host:</strong> " . DB_HOST . "</div>";
} catch (Exception $e) {
    echo "<div class='error'>❌ Database connection failed: " . $e->getMessage() . "</div>";
    exit;
}

// Test 2: Check if forum_posts table exists
echo "<h2>2. Forum Posts Table Check</h2>";
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'forum_posts'");
    $tableExists = $stmt->rowCount() > 0;
    
    if ($tableExists) {
        echo "<div class='success'>✅ Table 'forum_posts' exists!</div>";
        
        // Get table structure
        $stmt = $pdo->query("DESCRIBE forum_posts");
        $columns = $stmt->fetchAll();
        
        echo "<h3>Table Structure:</h3>";
        echo "<table>";
        echo "<tr><th>Column</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
        foreach ($columns as $col) {
            echo "<tr>";
            echo "<td>{$col['Field']}</td>";
            echo "<td>{$col['Type']}</td>";
            echo "<td>{$col['Null']}</td>";
            echo "<td>{$col['Key']}</td>";
            echo "<td>{$col['Default']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
    } else {
        echo "<div class='error'>❌ Table 'forum_posts' does NOT exist!</div>";
        echo "<div class='info'><strong>Action Required:</strong> You need to run the schema.sql file to create the table.<br>";
        echo "Go to phpMyAdmin → Import → Select 'api/schema.sql' → Click 'Go'</div>";
        exit;
    }
} catch (Exception $e) {
    echo "<div class='error'>❌ Error checking table: " . $e->getMessage() . "</div>";
    exit;
}

// Test 3: Count posts
echo "<h2>3. Forum Posts Count</h2>";
try {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM forum_posts");
    $result = $stmt->fetch();
    $postCount = $result['count'];
    
    if ($postCount > 0) {
        echo "<div class='success'>✅ Found {$postCount} forum post(s) in database!</div>";
    } else {
        echo "<div class='error'>❌ No forum posts found in database!</div>";
        echo "<div class='info'><strong>Action Required:</strong> You need to add some posts.<br>";
        echo "You can:<br>1. Use the admin panel at admin/forum.php to create posts<br>";
        echo "2. Or run <a href='add_sample_posts.php'>add_sample_posts.php</a> to add test posts</div>";
    }
} catch (Exception $e) {
    echo "<div class='error'>❌ Error counting posts: " . $e->getMessage() . "</div>";
}

// Test 4: Display existing posts
if ($postCount > 0) {
    echo "<h2>4. Existing Forum Posts</h2>";
    try {
        $stmt = $pdo->query("SELECT id, type, title, author, created_at, likes FROM forum_posts ORDER BY created_at DESC");
        $posts = $stmt->fetchAll();
        
        echo "<table>";
        echo "<tr><th>ID</th><th>Type</th><th>Title</th><th>Author</th><th>Date</th><th>Likes</th></tr>";
        foreach ($posts as $post) {
            echo "<tr>";
            echo "<td>{$post['id']}</td>";
            echo "<td>{$post['type']}</td>";
            echo "<td>{$post['title']}</td>";
            echo "<td>{$post['author']}</td>";
            echo "<td>{$post['created_at']}</td>";
            echo "<td>{$post['likes']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } catch (Exception $e) {
        echo "<div class='error'>❌ Error displaying posts: " . $e->getMessage() . "</div>";
    }
}

// Test 5: Test API endpoint
echo "<h2>5. API Endpoint Test</h2>";
echo "<div class='info'>";
echo "<strong>Test API manually:</strong><br>";
echo "<a href='api/forum_posts.php' target='_blank'>Click here to test API endpoint</a><br>";
echo "Expected result: JSON with 'success: true' and 'posts' array";
echo "</div>";

// Test 6: Test Admin Panel
echo "<h2>6. Admin Panel Test</h2>";
echo "<div class='info'>";
echo "<strong>Test admin panel:</strong><br>";
echo "<a href='admin/forum.php' target='_blank'>Click here to open admin forum management</a><br>";
echo "(You need to be logged in as admin)";
echo "</div>";

echo "<br><hr><p><em>Diagnostic complete. Review the results above to identify any issues.</em></p>";
?>
