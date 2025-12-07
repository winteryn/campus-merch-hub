<?php
require '../../config.php';

// Read JSON
$raw = file_get_contents("php://input"); // ictrl z 
$data = json_decode($raw, true);

// DEBUG: return raw JSON if empty or invalid
if (!$data) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid JSON received',
        'raw' => $raw
    ]);
    exit;
}

// Extract fields (correct keys)
$firstname   = trim($data['firstname'] ?? '');
$lastname    = trim($data['lastname'] ?? '');
$email       = trim($data['email'] ?? '');
$password    = trim($data['password'] ?? '');
$userType    = trim($data['userType'] ?? '');
$studentId   = trim($data['studentId'] ?? '');
$department  = trim($data['department'] ?? '');
$course      = trim($data['course'] ?? '');
$yearLevel   = trim($data['yearLevel'] ?? '');
$graduationYear = trim($data['graduationYear'] ?? '');

// DEBUG return what the mobile sends
if (true) {
    file_put_contents("debug_signup_log.txt", print_r($data, true));
}

// Required fields
if (!$firstname || !$lastname || !$email || !$password) {
    echo json_encode(['status' => 'error', 'message' => 'Required fields missing']);
    exit;
}

// Validate student ID
if ($userType !== 'alumni') {
    if (empty($studentId)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Student/Faculty ID is EMPTY — Mobile is not sending data.',
            'received' => $data
        ]);
        exit;
    }
} else {
    if (empty($studentId)) {
        $studentId = 'A' . uniqid();
    }
}

// Check email
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email already registered']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert
$stmt = $conn->prepare("
    INSERT INTO users 
    (first_name, last_name, email, password_hash, role, student_id, department, course, year_level, graduation_year) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssssssss",
    $firstname,
    $lastname,
    $email,
    $hashedPassword,
    $userType,
    $studentId,
    $department,
    $course,
    $yearLevel,
    $graduationYear
);

if ($stmt->execute()) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Account created successfully',
        'received' => $data
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'SQL ERROR: ' . $stmt->error,
        'received' => $data
    ]);
}
?>
