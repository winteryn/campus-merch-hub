<?php
include '../../config.php';

// Get the department_id from query string (GET)
$department_id = isset($_GET['department_id']) ? $_GET['department_id'] : null;

if (!$department_id) {
    echo json_encode(['status' => 'error', 'message' => 'department_id parameter missing']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM courses WHERE department_id = ?");

// Bind the parameter as an integer ("i")
$stmt->bind_param("i", $department_id);

$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'No courses found for this department']);
    exit;
}

$courses = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    'status' => 'success',
    'message' => 'Courses fetched successfully',
    'data' => $courses
]);
?>
