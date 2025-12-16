<?php
/**
 * Password Change Tool for Admin
 * Run this ONCE after deployment to change the admin password
 * 
 * Usage:
 * 1. Upload to your server
 * 2. Visit: https://yourdomain.com/admin/change_password.php
 * 3. DELETE this file after using!
 */

require_once 'includes/config.php';

// CHANGE THIS TO YOUR DESIRED PASSWORD
$new_password = 'Idokonelson2306';

// Generate hash
$hash = password_hash($new_password, PASSWORD_DEFAULT);

try {
    $pdo = getDB();
    
    // Update admin password
    $stmt = $pdo->prepare("UPDATE admins SET password = :password WHERE username = 'admin'");
    $stmt->execute([':password' => $hash]);
    
    echo "<h2 style='color: green;'>✅ Admin password updated successfully!</h2>";
    echo "<p><strong>New Password:</strong> " . htmlspecialchars($new_password) . "</p>";
    echo "<p style='color: red;'><strong>⚠️ IMPORTANT:</strong> Delete this file immediately after use!</p>";
    echo "<p><a href='index.php'>Go to Login</a></p>";
    
} catch (PDOException $e) {
    echo "<h2 style='color: red;'>❌ Error updating password</h2>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
