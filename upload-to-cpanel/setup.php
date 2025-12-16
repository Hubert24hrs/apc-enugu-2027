<?php
// Quick password update - visit this URL once then DELETE IT
$host = 'localhost';
$dbname = 'apcgaten_members';
$user = 'apcgaten_apcgaten';
$pass = 'Idokonelson2306';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    $new_password = 'Idokonelson2306';
    $hash = password_hash($new_password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("UPDATE admins SET password = :password WHERE username = 'admin'");
    $stmt->execute([':password' => $hash]);
    
    echo "<h1 style='color: green;'>✅ Password Updated!</h1>";
    echo "<p><strong>Username:</strong> admin</p>";
    echo "<p><strong>New Password:</strong> Idokonelson2306</p>";
    echo "<p><a href='admin/'>Login Now →</a></p>";
    echo "<p style='color: red;'><strong>DELETE THIS FILE NOW!</strong></p>";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
