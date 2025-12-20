<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';

$pdo = getDB();
$password = 'Idokonelson2306';
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE username = 'admin'");
if ($stmt->execute([$hash])) {
    echo "Password updated successfully to: " . $password;
} else {
    echo "Failed to update password.";
}
?>
