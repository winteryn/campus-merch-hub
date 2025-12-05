<?php
session_start(); // Start PHP session

include '../../config.php';
include '../../auth.service.php';

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

$studentName = $data['student_name'] ?? '';
$course = $data['course'] ?? '';
$course = $data['course'] ?? '';