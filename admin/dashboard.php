<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';
requireLogin();

echo '<div style="background:red;color:white;padding:20px;text-align:center;font-size:24px;font-weight:bold;position:fixed;top:0;left:0;width:100%;z-index:9999;">TESTING 123 - IF YOU SEE THIS, YOU ARE IN THE RIGHT FOLDER</div>';
echo '<div style="margin-top:80px;"></div>'; // Spacer

$pdo = getDB();

// Get statistics
$stats = [];

// Total members
$stmt = $pdo->query("SELECT COUNT(*) as count FROM members");
$stats['total_members'] = $stmt->fetch()['count'];

// Pending members
$stmt = $pdo->query("SELECT COUNT(*) as count FROM members WHERE status = 'pending'");
$stats['pending_members'] = $stmt->fetch()['count'];

// Approved members
$stmt = $pdo->query("SELECT COUNT(*) as count FROM members WHERE status = 'approved'");
$stats['approved_members'] = $stmt->fetch()['count'];

// Unread messages
$stmt = $pdo->query("SELECT COUNT(*) as count FROM contacts WHERE status = 'unread'");
$stats['unread_messages'] = $stmt->fetch()['count'];

// Recent members
$stmt = $pdo->query("SELECT * FROM members ORDER BY created_at DESC LIMIT 5");
$recentMembers = $stmt->fetchAll();

// Recent contacts
$stmt = $pdo->query("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5");
$recentContacts = $stmt->fetchAll();

$pageTitle = 'Dashboard';
include 'includes/header.php';
?>

<div class="container">
    <h1 style="color: white; margin-bottom: 2rem;">
        <i class="fas fa-tachometer-alt"></i> Welcome, <?php echo htmlspecialchars($_SESSION['admin_name']); ?>!
    </h1>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="number"><?php echo $stats['total_members']; ?></div>
            <div class="label"><i class="fas fa-users"></i> Total Members</div>
        </div>
        <div class="stat-card orange">
            <div class="number"><?php echo $stats['pending_members']; ?></div>
            <div class="label"><i class="fas fa-clock"></i> Pending Approval</div>
        </div>
        <div class="stat-card blue">
            <div class="number"><?php echo $stats['approved_members']; ?></div>
            <div class="label"><i class="fas fa-check-circle"></i> Approved Members</div>
        </div>
        <div class="stat-card red">
            <div class="number"><?php echo $stats['unread_messages']; ?></div>
            <div class="label"><i class="fas fa-envelope"></i> Unread Messages</div>
        </div>
    </div>
    
    <div class="card">
        <h2><i class="fas fa-user-plus"></i> Recent Member Applications</h2>
        <?php if (empty($recentMembers)): ?>
            <p style="color: #666;">No member applications yet.</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>LGA</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recentMembers as $member): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($member['full_name']); ?></td>
                        <td><?php echo htmlspecialchars($member['email']); ?></td>
                        <td><?php echo htmlspecialchars($member['lga']); ?></td>
                        <td><span class="badge <?php echo $member['status']; ?>"><?php echo ucfirst($member['status']); ?></span></td>
                        <td><?php echo date('M d, Y', strtotime($member['created_at'])); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <a href="members.php" class="btn btn-info" style="margin-top: 1rem;">View All Members</a>
        <?php endif; ?>
    </div>
    
    <div class="card">
        <h2><i class="fas fa-envelope"></i> Recent Messages</h2>
        <?php if (empty($recentContacts)): ?>
            <p style="color: #666;">No messages yet.</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recentContacts as $contact): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($contact['name']); ?></td>
                        <td><?php echo htmlspecialchars($contact['email']); ?></td>
                        <td><?php echo htmlspecialchars(substr($contact['message'], 0, 50)) . '...'; ?></td>
                        <td><span class="badge <?php echo $contact['status']; ?>"><?php echo ucfirst($contact['status']); ?></span></td>
                        <td><?php echo date('M d, Y', strtotime($contact['created_at'])); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <a href="contacts.php" class="btn btn-info" style="margin-top: 1rem;">View All Messages</a>
        <?php endif; ?>
    </div>
</div>

</body>
</html>
