<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';
requireLogin();

$pdo = getDB();

// Handle actions
if (isset($_GET['action']) && isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    $action = $_GET['action'];
    
    if ($action === 'approve') {
        $stmt = $pdo->prepare("UPDATE members SET status = 'approved' WHERE id = :id");
        $stmt->execute([':id' => $id]);
    } elseif ($action === 'reject') {
        $stmt = $pdo->prepare("UPDATE members SET status = 'rejected' WHERE id = :id");
        $stmt->execute([':id' => $id]);
    } elseif ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM members WHERE id = :id");
        $stmt->execute([':id' => $id]);
    }
    
    header('Location: members.php');
    exit();
}

// Filter
$filter = $_GET['filter'] ?? 'all';
$where = '';
if ($filter === 'pending') $where = "WHERE status = 'pending'";
elseif ($filter === 'approved') $where = "WHERE status = 'approved'";
elseif ($filter === 'rejected') $where = "WHERE status = 'rejected'";

// Get members
$stmt = $pdo->query("SELECT * FROM members $where ORDER BY created_at DESC");
$members = $stmt->fetchAll();

$pageTitle = 'Member Management';
include 'includes/header.php';
?>

<div class="container">
    <div class="card">
        <h2><i class="fas fa-users"></i> Member Applications</h2>
        
        <div style="margin-bottom: 1.5rem; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="?filter=all" class="btn <?php echo $filter === 'all' ? 'btn-success' : 'btn-info'; ?>">All</a>
            <a href="?filter=pending" class="btn <?php echo $filter === 'pending' ? 'btn-success' : 'btn-info'; ?>">Pending</a>
            <a href="?filter=approved" class="btn <?php echo $filter === 'approved' ? 'btn-success' : 'btn-info'; ?>">Approved</a>
            <a href="?filter=rejected" class="btn <?php echo $filter === 'rejected' ? 'btn-success' : 'btn-info'; ?>">Rejected</a>
        </div>
        
        <?php if (empty($members)): ?>
            <p style="color: #666; padding: 2rem; text-align: center;">No members found.</p>
        <?php else: ?>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>LGA</th>
                            <th>Membership No</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($members as $member): ?>
                        <tr>
                            <td><?php echo $member['id']; ?></td>
                            <td><strong><?php echo htmlspecialchars($member['full_name']); ?></strong></td>
                            <td><?php echo htmlspecialchars($member['email']); ?></td>
                            <td><?php echo htmlspecialchars($member['phone']); ?></td>
                            <td><?php echo htmlspecialchars($member['lga']); ?></td>
                            <td><code><?php echo htmlspecialchars($member['membership_no']); ?></code></td>
                            <td><span class="badge <?php echo $member['status']; ?>"><?php echo ucfirst($member['status']); ?></span></td>
                            <td><?php echo date('M d, Y', strtotime($member['created_at'])); ?></td>
                            <td>
                                <div class="actions">
                                    <?php if ($member['status'] === 'pending'): ?>
                                        <a href="?action=approve&id=<?php echo $member['id']; ?>" class="btn btn-success" onclick="return confirm('Approve this member?')">
                                            <i class="fas fa-check"></i>
                                        </a>
                                        <a href="?action=reject&id=<?php echo $member['id']; ?>" class="btn btn-danger" onclick="return confirm('Reject this member?')">
                                            <i class="fas fa-times"></i>
                                        </a>
                                    <?php endif; ?>
                                    <a href="?action=delete&id=<?php echo $member['id']; ?>" class="btn btn-danger" onclick="return confirm('Delete this member permanently?')">
                                        <i class="fas fa-trash"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

</body>
</html>
