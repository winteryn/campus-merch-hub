<?php
session_start(); // Start PHP session

include '../../config.php';
include '../../auth.service.php';

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if(!$email || !$password){
    echo json_encode(['status' => 'error', 'message' => 'Email and password required']);
    exit;
}

// Check user
$stmt = $conn->prepare("SELECT * FROM admins WHERE email=? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows === 0){
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password_hash'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    exit;
}

// Store user info in session
$_SESSION['user'] = [
    'id' => $user['id'],
    'first_name' => $user['first_name'],
    'last_name' => $user['last_name'],
    'email' => $user['email'],
];

// Optionally: generate a token
$token = generateToken($user['id']);
$_SESSION['token'] = $token;

echo json_encode([
    'status' => 'success',
    'message' => 'Login successful',
    'user' => [
        'id' => $user['id'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'email' => $user['email'],
        'token' => $token
    ]
]);
?>
