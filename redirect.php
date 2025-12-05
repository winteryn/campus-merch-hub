<?php
session_start();

// Auth Guard: redirect if not logged in
if (!isset($_SESSION['user'])) {
    header("Location: logout.php"); 
    exit;
}

// If logged in, you can access $_SESSION['user']
$user = $_SESSION['user'];

// Check User's Roles
if($user['role'] === 'admin'){
    header("Location: admin/dashboard.php");
    exit;
} elseif($user['role'] === 'student'){
    header("Location: user/dashboard.php");
    exit;
} else {
    // Unknown role, log out for safety
    header("Location: logout.php");
    exit;
}

?>
<small>Welcome, <?= htmlspecialchars($user['first_name']) ?>!<br>Please wait while we redirect you to your dashboard...</small>

