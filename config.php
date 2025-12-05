<?php
// Database settings
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'campus_merch_hub';
$DB_PORT = 3306;

// Create connection
$conn = mysqli_connect(hostname: $DB_HOST, username:$DB_USER, password: $DB_PASS, database: $DB_NAME, port: $DB_PORT);

// Check connection
if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>
