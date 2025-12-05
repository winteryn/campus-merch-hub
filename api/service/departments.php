<?php
include '../../config.php';

// Get JSON input if needed (but not used here)
$data = json_decode(file_get_contents('php://input'), true);

$stmt = $conn->prepare("SELECT * FROM departments");

// No parameters to bind, so skip bind_param
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows === 0){
    echo json_encode(['status' => 'error', 'message' => 'No Departments Found']);
    exit;
}

$departments = $result->fetch_all(MYSQLI_ASSOC);  // fetch all rows, not just one assoc

echo json_encode([
    'status' => 'success',
    'message' => 'Departments fetched successfully',
    'data' => $departments
]);
?>
