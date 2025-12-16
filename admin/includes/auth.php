<?php
session_start();

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']);
}

// Require login
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: index.php');
        exit();
    }
}

// Verify password (using bcrypt)
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Hash password
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}
?>
