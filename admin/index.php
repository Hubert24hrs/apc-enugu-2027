<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';

// Redirect if already logged in
if (isLoggedIn()) {
    header('Location: dashboard.php');
    exit();
}

$error = '';

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'Please enter both username and password.';
    } else {
        try {
            $pdo = getDB();
            $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username LIMIT 1");
            $stmt->execute([':username' => $username]);
            $admin = $stmt->fetch();
            
            if ($admin && password_verify($password, $admin['password'])) {
                $_SESSION['admin_id'] = $admin['id'];
                $_SESSION['admin_name'] = $admin['full_name'] ?? $admin['username'];
                header('Location: dashboard.php');
                exit();
            } else {
                $error = 'Invalid username or password.';
            }
        } catch (PDOException $e) {
            $error = 'Database error. Please try again.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - APC GAT 2027</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1a5f3c 0%, #004B87 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .login-container {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .login-header img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-bottom: 1rem;
        }
        .login-header h1 {
            color: #1a5f3c;
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        .login-header p {
            color: #666;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            color: #333;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus {
            outline: none;
            border-color: #00A859;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 12px;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        .btn-login {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #00A859, #1a5f3c);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0,168,89,0.4);
        }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 1.5rem;
            color: #00A859;
            text-decoration: none;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <img src="../assets/logo.jpg" alt="APC Logo">
            <h1>Admin Panel</h1>
            <p>APC GAT 2027 Enugu State</p>
        </div>
        
        <?php if ($error): ?>
            <div class="error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label><i class="fas fa-user"></i> Username</label>
                <input type="text" name="username" placeholder="Enter username" required>
            </div>
            <div class="form-group">
                <label><i class="fas fa-lock"></i> Password</label>
                <input type="password" name="password" placeholder="Enter password" required>
            </div>
            <button type="submit" class="btn-login">
                <i class="fas fa-sign-in-alt"></i> Login
            </button>
        </form>
        
        <a href="../index.html" class="back-link">
            <i class="fas fa-arrow-left"></i> Back to Website
        </a>
    </div>
</body>
</html>
