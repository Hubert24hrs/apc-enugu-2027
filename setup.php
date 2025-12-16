<?php
/**
 * Database Setup Script
 * Upload this to your server and run it ONCE
 * DELETE THIS FILE AFTER RUNNING!
 */

// Database credentials (same as your config)
$host = 'localhost';
$dbname = 'apcgaten_members';
$user = 'apcgaten_apcgaten';
$pass = 'Idokonelson2306';

echo "<h1>APC GAT 2027 - Database Setup</h1>";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "<p style='color: green;'>✅ Database connected successfully!</p>";
    
    // Create members table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `members` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `full_name` VARCHAR(255) NOT NULL,
            `email` VARCHAR(255) NOT NULL,
            `phone` VARCHAR(50) NOT NULL,
            `lga` VARCHAR(100) NOT NULL,
            `ward` VARCHAR(100) DEFAULT NULL,
            `occupation` VARCHAR(255) DEFAULT NULL,
            `gender` VARCHAR(20) DEFAULT NULL,
            `dob` DATE DEFAULT NULL,
            `address` TEXT DEFAULT NULL,
            `interests` TEXT DEFAULT NULL,
            `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            `membership_no` VARCHAR(50) DEFAULT NULL,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    echo "<p style='color: green;'>✅ Members table created!</p>";
    
    // Create contacts table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `contacts` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(255) NOT NULL,
            `email` VARCHAR(255) NOT NULL,
            `phone` VARCHAR(50) DEFAULT NULL,
            `lga` VARCHAR(100) DEFAULT NULL,
            `message` TEXT NOT NULL,
            `status` ENUM('unread', 'read', 'replied') DEFAULT 'unread',
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    echo "<p style='color: green;'>✅ Contacts table created!</p>";
    
    // Create admins table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `admins` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(100) NOT NULL UNIQUE,
            `password` VARCHAR(255) NOT NULL,
            `full_name` VARCHAR(255) DEFAULT NULL,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    echo "<p style='color: green;'>✅ Admins table created!</p>";
    
    // Create admin user with password: admin123
    $password = 'admin123';
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Delete existing admin if exists, then insert new one
    $pdo->exec("DELETE FROM admins WHERE username = 'admin'");
    $stmt = $pdo->prepare("INSERT INTO admins (username, password, full_name) VALUES ('admin', :password, 'Administrator')");
    $stmt->execute([':password' => $hash]);
    
    echo "<p style='color: green;'>✅ Admin user created!</p>";
    echo "<hr>";
    echo "<h2>🎉 Setup Complete!</h2>";
    echo "<p><strong>Login credentials:</strong></p>";
    echo "<p>Username: <code>admin</code></p>";
    echo "<p>Password: <code>admin123</code></p>";
    echo "<p><a href='admin/' style='background: #00A859; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Go to Admin Login →</a></p>";
    echo "<p style='color: red; margin-top: 20px;'><strong>⚠️ DELETE THIS FILE NOW!</strong></p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
