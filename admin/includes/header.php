<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle ?? 'Admin Panel'; ?> - APC GAT 2027</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1a5f3c 0%, #004B87 100%);
            min-height: 100vh;
        }
        .admin-header {
            background: linear-gradient(135deg, #00A859, #1a5f3c);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .admin-header .logo {
            color: white;
            font-size: 1.25rem;
            font-weight: 700;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .admin-header .logo img { height: 40px; border-radius: 5px; }
        .admin-nav { display: flex; gap: 20px; align-items: center; }
        .admin-nav a {
            color: rgba(255,255,255,0.9);
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        .admin-nav a:hover, .admin-nav a.active {
            background: rgba(255,255,255,0.2);
            color: white;
        }
        .admin-nav a.logout {
            background: rgba(220,53,69,0.3);
        }
        .admin-nav a.logout:hover {
            background: #dc3545;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        .card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .card h2 {
            color: #1a5f3c;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: linear-gradient(135deg, #00A859, #1a5f3c);
            color: white;
            padding: 1.5rem;
            border-radius: 15px;
            text-align: center;
        }
        .stat-card.blue { background: linear-gradient(135deg, #004B87, #0066b2); }
        .stat-card.orange { background: linear-gradient(135deg, #ff9800, #f57c00); }
        .stat-card.red { background: linear-gradient(135deg, #dc3545, #c82333); }
        .stat-card .number { font-size: 2.5rem; font-weight: 700; }
        .stat-card .label { opacity: 0.9; margin-top: 5px; }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
        }
        tr:hover { background: #f8f9fa; }
        .badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        .badge.pending { background: #fff3cd; color: #856404; }
        .badge.approved { background: #d4edda; color: #155724; }
        .badge.rejected { background: #f8d7da; color: #721c24; }
        .badge.unread { background: #cce5ff; color: #004085; }
        .badge.read { background: #e2e3e5; color: #383d41; }
        .btn {
            padding: 8px 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            font-size: 0.9rem;
        }
        .btn-success { background: #00A859; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-info { background: #17a2b8; color: white; }
        .btn:hover { transform: translateY(-2px); opacity: 0.9; }
        .actions { display: flex; gap: 8px; }
    </style>
</head>
<body>
<?php if(isLoggedIn()): ?>
<header class="admin-header">
    <a href="dashboard.php" class="logo">
        <img src="../assets/logo.jpg" alt="Logo">
        <span>APC GAT 2027 Admin</span>
    </a>
    <nav class="admin-nav">
        <a href="dashboard.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'active' : ''; ?>">
            <i class="fas fa-home"></i> Dashboard
        </a>
        <a href="members.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'members.php' ? 'active' : ''; ?>">
            <i class="fas fa-users"></i> Members
        </a>
        <a href="contacts.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'contacts.php' ? 'active' : ''; ?>">
            <i class="fas fa-envelope"></i> Messages
        </a>
        <a href="forum.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'forum.php' ? 'active' : ''; ?>">
            <i class="fas fa-comments"></i> Forum
        </a>
        <a href="logout.php" class="logout">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    </nav>
</header>
<?php endif; ?>
