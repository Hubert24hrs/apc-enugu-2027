<?php
session_start();
require_once 'includes/config.php';
require_once 'includes/auth.php';

// Check login
requireLogin();

$pageTitle = 'Forum Management';
$pdo = getDB();
$editMode = false;
$editPost = null;

// Handle Post Deletion
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $stmt = $pdo->prepare("DELETE FROM forum_posts WHERE id = ?");
    if ($stmt->execute([$id])) {
        $success = "Post deleted successfully.";
    } else {
        $error = "Failed to delete post.";
    }
}

// Handle Edit Mode - Fetch Post Data
if (isset($_GET['edit'])) {
    $id = $_GET['edit'];
    $stmt = $pdo->prepare("SELECT * FROM forum_posts WHERE id = ?");
    $stmt->execute([$id]);
    $editPost = $stmt->fetch();
    if ($editPost) {
        $editMode = true;
    }
}

// Handle Form Submission (Create or Update)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Create New Post
    if (isset($_POST['create_post'])) {
        $title = trim($_POST['title']);
        $type = $_POST['type'];
        $content = trim($_POST['content']);
        $author = 'Nelson Ndudi Idoko'; 
        $authorRole = 'Publicity Secretary, Enugu State';

        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $uploadDir = '../assets/uploads/forum/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . basename($_FILES['image']['name']);
            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fileName)) {
                $imagePath = 'assets/uploads/forum/' . $fileName;
            }
        }

        if (!empty($title) && !empty($content)) {
            $stmt = $pdo->prepare("INSERT INTO forum_posts (type, title, content, image, author, author_role) VALUES (?, ?, ?, ?, ?, ?)");
            if ($stmt->execute([$type, $title, $content, $imagePath, $author, $authorRole])) {
                $success = "Post created successfully!";
            } else {
                $error = "Failed to create post.";
            }
        } else {
            $error = "Title and Content are required.";
        }
    }

    // Update Existing Post
    if (isset($_POST['update_post'])) {
        $id = $_POST['post_id'];
        $title = trim($_POST['title']);
        $type = $_POST['type'];
        $content = trim($_POST['content']);

        // Handle Image Upload (keep old if no new one)
        $imagePath = $_POST['existing_image'];
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $uploadDir = '../assets/uploads/forum/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . basename($_FILES['image']['name']);
            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fileName)) {
                $imagePath = 'assets/uploads/forum/' . $fileName;
            }
        }

        if (!empty($title) && !empty($content)) {
            $stmt = $pdo->prepare("UPDATE forum_posts SET type=?, title=?, content=?, image=? WHERE id=?");
            if ($stmt->execute([$type, $title, $content, $imagePath, $id])) {
                $success = "Post updated successfully!";
                $editMode = false; // Exit edit mode
                $editPost = null;
            } else {
                $error = "Failed to update post.";
            }
        } else {
            $error = "Title and Content are required.";
        }
    }
}

// Fetch Posts
$stmt = $pdo->query("SELECT * FROM forum_posts ORDER BY created_at DESC");
$posts = $stmt->fetchAll();

include 'includes/header.php';
?>

<div class="container">
    <div class="card">
        <h2><i class="fas fa-comments"></i> Manage Forum</h2>
        
        <?php if (isset($success)): ?>
            <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <?php echo $success; ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <!-- Create/Edit Post Form Button (Only show Create button if not editing) -->
        <?php if (!$editMode): ?>
        <button onclick="document.getElementById('postFormSection').style.display = 'block'" class="btn btn-success" style="margin-bottom: 1.5rem;">
            <i class="fas fa-plus"></i> Create New Post
        </button>
        <?php endif; ?>

        <!-- Post Form Section (Visible by default if Editing) -->
        <div id="postFormSection" style="display: <?php echo $editMode ? 'block' : 'none'; ?>; background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border: 1px solid #ddd;">
            <h3 style="margin-bottom: 1rem; color: #1a5f3c;">
                <?php echo $editMode ? 'Edit Forum Post' : 'New Forum Post'; ?>
            </h3>
            
            <form method="POST" enctype="multipart/form-data">
                <?php if ($editMode): ?>
                    <input type="hidden" name="update_post" value="1">
                    <input type="hidden" name="post_id" value="<?php echo $editPost['id']; ?>">
                    <input type="hidden" name="existing_image" value="<?php echo $editPost['image']; ?>">
                <?php else: ?>
                    <input type="hidden" name="create_post" value="1">
                <?php endif; ?>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Post Type</label>
                        <select name="type" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <?php 
                            $types = ['post'=>'General Post', 'announcement'=>'Announcement', 'article'=>'Article', 'message'=>'Message', 'presentation'=>'Presentation', 'resource'=>'Resource'];
                            foreach($types as $val => $label): 
                            ?>
                                <option value="<?php echo $val; ?>" <?php echo ($editMode && $editPost['type'] == $val) ? 'selected' : ''; ?>>
                                    <?php echo $label; ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div>
                         <label style="display: block; margin-bottom: 5px; font-weight: 600;">Image (Optional)</label>
                         <input type="file" name="image" accept="image/*" style="width: 100%; padding: 10px;">
                         <?php if ($editMode && $editPost['image']): ?>
                            <small style="display: block; color: #666; margin-top: 5px;">Current: <a href="../<?php echo $editPost['image']; ?>" target="_blank">View Image</a></small>
                         <?php endif; ?>
                    </div>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Title</label>
                    <input type="text" name="title" required placeholder="Enter post title" 
                        value="<?php echo $editMode ? htmlspecialchars($editPost['title']) : ''; ?>"
                        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Content</label>
                    <textarea name="content" required rows="8" placeholder="Write your post content here..." 
                        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;"><?php echo $editMode ? htmlspecialchars($editPost['content']) : ''; ?></textarea>
                </div>

                <div style="display: flex; gap: 1rem;">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-paper-plane"></i> <?php echo $editMode ? 'Update Post' : 'Publish Post'; ?>
                    </button>
                    <?php if ($editMode): ?>
                        <a href="forum.php" class="btn btn-danger" style="background: #6c757d;">Cancel Edit</a>
                    <?php else: ?>
                        <button type="button" onclick="document.getElementById('postFormSection').style.display = 'none'" class="btn btn-danger" style="background: #6c757d;">Cancel</button>
                    <?php endif; ?>
                </div>
            </form>
        </div>

        <!-- Posts List -->
        <h3 style="margin-bottom: 1rem; color: #333;">Recent Posts</h3>
        <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Stats</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (count($posts) > 0): ?>
                        <?php foreach ($posts as $post): ?>
                            <tr>
                                <td><?php echo date('M j, Y', strtotime($post['created_at'])); ?></td>
                                <td>
                                    <span class="badge" style="background: #e2e3e5; color: #333;">
                                        <?php echo ucfirst($post['type']); ?>
                                    </span>
                                </td>
                                <td>
                                    <?php echo htmlspecialchars($post['title']); ?>
                                </td>
                                <td>
                                    <small><i class="fas fa-heart"></i> <?php echo $post['likes']; ?></small>
                                </td>
                                <td>
                                    <div class="actions">
                                        <a href="?edit=<?php echo $post['id']; ?>" class="btn btn-info" style="padding: 5px 10px; font-size: 0.8rem;">
                                            <i class="fas fa-edit"></i> Edit
                                        </a>
                                        <a href="?delete=<?php echo $post['id']; ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this post?');" style="padding: 5px 10px; font-size: 0.8rem;">
                                            <i class="fas fa-trash"></i> Delete
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="5" style="text-align: center; color: #666; padding: 2rem;">No posts found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

</body>
</html>
