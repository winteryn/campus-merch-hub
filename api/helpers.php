<?php
header('Content-Type: application/json');

include '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));

if(!isset($request[0])){
    echo json_encode(['error' => 'No endpoint specified']);
    exit;
}

switch($request[0]){
    case 'departments':
        if($method == 'GET') include './service/departments.php';
        else echo json_encode(['error' => 'Method not allowed']);
        break;
    default:
        echo json_encode(['error' => 'Endpoint not found']);
}
