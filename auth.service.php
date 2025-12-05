<?php
function generateToken($userId){
    return bin2hex(random_bytes(16)); // Simple token for demonstration
}
?>
