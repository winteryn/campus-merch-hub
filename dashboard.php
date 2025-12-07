<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit;
}

$user = $_SESSION['user'];
?>

<!DOCTYPE html>
<html>
<head>
    <title>User Dashboard</title>
</head>
<body>
    <h1>Welcome, <?php echo htmlspecialchars($user['first_name'] ?? $user['name'] ?? 'User'); ?>!</h1>
    <p>Email: <?php echo htmlspecialchars($user['email']); ?></p>
    <p>Role: <?php echo htmlspecialchars($user['role'] ?? 'N/A'); ?></p>
    
    <a href="logout.php">Logout</a>
</body>
</html>
