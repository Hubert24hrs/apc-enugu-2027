<?php
/**
 * Add Sample Forum Posts
 * Creates test forum posts to verify the system works
 */

require_once 'api/config.php';

echo "<h1>Adding Sample Forum Posts</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .info { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 8px; margin: 10px 0; }
</style>";

try {
    $pdo = getDB();
    
    // Check if table exists first
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'forum_posts'");
    if ($tableCheck->rowCount() === 0) {
        echo "<div class='error'>❌ Table 'forum_posts' does not exist! Please run schema.sql first.</div>";
        exit;
    }
    
    // Check if posts already exist
    $countStmt = $pdo->query("SELECT COUNT(*) as count FROM forum_posts");
    $count = $countStmt->fetch()['count'];
    
    if ($count > 0) {
        echo "<div class='info'>ℹ️ Database already has {$count} post(s). Proceeding to add more sample posts...</div>";
    }
    
    // Sample posts to insert
    $samplePosts = [
        [
            'type' => 'announcement',
            'title' => 'Welcome to APC GAT2027 Enugu Forum',
            'content' => 'We are excited to launch this grassroots forum for all APC members in Enugu State. This platform will help us coordinate our efforts, share updates, and build a stronger party structure ahead of 2027. Stay engaged, stay informed!',
            'author' => 'Nelson Ndudi Idoko',
            'author_role' => 'Publicity Secretary, Enugu State',
            'image' => null
        ],
        [
            'type' => 'article',
            'title' => 'The Importance of Grassroots Mobilization',
            'content' => 'Grassroots mobilization is the foundation of any successful political movement. As we prepare for 2027, every ward, every polling unit matters. Our door-to-door campaigns, community meetings, and voter registration drives are what will bring victory. Let us work together to ensure every voice is heard and every vote counts.',
            'author' => 'Nelson Ndudi Idoko',
            'author_role' => 'Publicity Secretary, Enugu State',
            'image' => null
        ],
        [
            'type' => 'post',
            'title' => 'Upcoming Ward Meetings - All LGAs',
            'content' => 'All ward chairpersons are hereby informed that ward meetings will hold next week across all 17 LGAs. Topics to discuss: Membership registration update, Voter registration drive, 2027 election strategies, Constituency projects tracking. Please ensure maximum attendance. Date: Next Saturday. Time: 10:00 AM. Venue: Your respective ward headquarters.',
            'author' => 'Nelson Ndudi Idoko',
            'author_role' => 'Publicity Secretary, Enugu State',
            'image' => null
        ]
    ];
    
    $insertedCount = 0;
    $stmt = $pdo->prepare("INSERT INTO forum_posts (type, title, content, image, author, author_role, likes) VALUES (?, ?, ?, ?, ?, ?, 0)");
    
    foreach ($samplePosts as $post) {
        if ($stmt->execute([
            $post['type'],
            $post['title'],
            $post['content'],
            $post['image'],
            $post['author'],
            $post['author_role']
        ])) {
            $insertedCount++;
            echo "<div class='success'>✅ Added: {$post['title']}</div>";
        } else {
            echo "<div class='error'>❌ Failed to add: {$post['title']}</div>";
        }
    }
    
    echo "<br><div class='success'><strong>Summary:</strong> Successfully added {$insertedCount} sample post(s)!</div>";
    
    // Display total count
    $countStmt = $pdo->query("SELECT COUNT(*) as count FROM forum_posts");
    $totalCount = $countStmt->fetch()['count'];
    echo "<div class='info'>📊 Total posts in database: {$totalCount}</div>";
    
    echo "<br><hr>";
    echo "<h2>Next Steps</h2>";
    echo "<div class='info'>";
    echo "1. Test the admin panel: <a href='admin/forum.php' target='_blank'>Open Admin Forum</a><br>";
    echo "2. Test the API: <a href='api/forum_posts.php' target='_blank'>View API Response</a><br>";
    echo "3. Test the frontend: <a href='index.html#forum' target='_blank'>View Forum Section</a><br>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Error: " . $e->getMessage() . "</div>";
}
?>
