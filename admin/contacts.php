<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';
requireLogin();

$pdo = getDB();

// Handle actions
if (isset($_GET['action']) && isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    $action = $_GET['action'];
    
    if ($action === 'read') {
        $stmt = $pdo->prepare("UPDATE contacts SET status = 'read' WHERE id = :id");
        $stmt->execute([':id' => $id]);
    } elseif ($action === 'replied') {
        $stmt = $pdo->prepare("UPDATE contacts SET status = 'replied' WHERE id = :id");
        $stmt->execute([':id' => $id]);
    } elseif ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM contacts WHERE id = :id");
        $stmt->execute([':id' => $id]);
    }
    
    header('Location: contacts.php');
    exit();
}

// Filter
$filter = $_GET['filter'] ?? 'all';
$where = '';
if ($filter === 'unread') $where = "WHERE status = 'unread'";
elseif ($filter === 'read') $where = "WHERE status = 'read'";
elseif ($filter === 'replied') $where = "WHERE status = 'replied'";

// Get contacts
$stmt = $pdo->query("SELECT * FROM contacts $where ORDER BY created_at DESC");
$contacts = $stmt->fetchAll();

$pageTitle = 'Contact Messages';
include 'includes/header.php';
?>

<div class="container">
    <div class="card">
        <h2><i class="fas fa-envelope"></i> Contact Messages</h2>
        
        <div style="margin-bottom: 1.5rem; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="?filter=all" class="btn <?php echo $filter === 'all' ? 'btn-success' : 'btn-info'; ?>">All</a>
            <a href="?filter=unread" class="btn <?php echo $filter === 'unread' ? 'btn-success' : 'btn-info'; ?>">Unread</a>
            <a href="?filter=read" class="btn <?php echo $filter === 'read' ? 'btn-success' : 'btn-info'; ?>">Read</a>
            <a href="?filter=replied" class="btn <?php echo $filter === 'replied' ? 'btn-success' : 'btn-info'; ?>">Replied</a>
        </div>
        
        <?php if (empty($contacts)): ?>
            <p style="color: #666; padding: 2rem; text-align: center;">No messages found.</p>
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
                            <th>Message</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($contacts as $contact): ?>
                        <tr>
                            <td><?php echo $contact['id']; ?></td>
                            <td><strong><?php echo htmlspecialchars($contact['name']); ?></strong></td>
                            <td><a href="mailto:<?php echo htmlspecialchars($contact['email']); ?>"><?php echo htmlspecialchars($contact['email']); ?></a></td>
                            <td><?php echo htmlspecialchars($contact['phone'] ?? '-'); ?></td>
                            <td><?php echo htmlspecialchars($contact['lga'] ?? '-'); ?></td>
                            <td style="max-width: 300px;">
                                <details>
                                    <summary style="cursor: pointer; color: #00A859;"><?php echo htmlspecialchars(substr($contact['message'], 0, 50)); ?>...</summary>
                                    <p style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                                        <?php echo nl2br(htmlspecialchars($contact['message'])); ?>
                                    </p>
                                </details>
                            </td>
                            <td><span class="badge <?php echo $contact['status']; ?>"><?php echo ucfirst($contact['status']); ?></span></td>
                            <td><?php echo date('M d, Y', strtotime($contact['created_at'])); ?></td>
                            <td>
                                <div class="actions">
                                    <?php if ($contact['status'] === 'unread'): ?>
                                        <a href="?action=read&id=<?php echo $contact['id']; ?>" class="btn btn-info" title="Mark as Read">
                                            <i class="fas fa-check"></i>
                                        </a>
                                    <?php endif; ?>
                                    <?php if ($contact['status'] !== 'replied'): ?>
                                        <a href="?action=replied&id=<?php echo $contact['id']; ?>" class="btn btn-success" title="Mark as Replied">
                                            <i class="fas fa-reply"></i>
                                        </a>
                                    <?php endif; ?>
                                    <a href="?action=delete&id=<?php echo $contact['id']; ?>" class="btn btn-danger" onclick="return confirm('Delete this message permanently?')" title="Delete">
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
