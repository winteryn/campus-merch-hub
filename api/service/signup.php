<?php
include '../../config.php';

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

$firstname   = $data['firstname'] ?? '';
$lastname    = $data['lastname'] ?? '';
$email       = $data['email'] ?? '';
$password    = $data['password'] ?? '';
$userType    = $data['userType'] ?? '';
$studentId   = $data['studentId'] ?? '';
$department  = $data['department'] ?? '';
$course      = $data['course'] ?? '';
$yearLevel   = $data['yearLevel'] ?? '';

// Basic validation
if (!$firstname || !$lastname || !$email || !$password) {
    echo json_encode(['status' => 'error', 'message' => 'Required fields missing']);
    exit;
}

// Check if email exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email already registered']);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert user into correct columns
$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password_hash, role, student_id, department, course, year_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Bind all params as strings
$stmt->bind_param(
    "sssssssss",
    $firstname,
    $lastname,
    $email,
    $hashedPassword,
    $userType,
    $studentId,
    $department,
    $course,
    $yearLevel
);

// Execute and return response
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Account created successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to create account']);
}
?>
