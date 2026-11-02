<?php
/**
 * The Deco House - Direct SMTP & Mail Relay Handler
 * 
 * Configure your SMTP or server email settings below:
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Destination email to receive inquiries
$to_email = 'technomantraindia@gmail.com'; // Change to your preferred email address

// Retrieve POST fields
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$firm = isset($_POST['firm']) ? strip_tags(trim($_POST['firm'])) : 'Not Provided';
$inquiry_scope = isset($_POST['inquiry_scope']) ? strip_tags(trim($_POST['inquiry_scope'])) : 'General';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid name and email address are required.']);
    exit;
}

$subject = "New Architectural Specification Inquiry: " . $name . " (" . $firm . ")";

$body = "=== THE DECO HOUSE • SPECIFICATION INQUIRY ===\n\n";
$body .= "Full Name:      " . $name . "\n";
$body .= "Email Address:  " . $email . "\n";
$body .= "Firm / Studio:  " . $firm . "\n";
$body .= "Inquiry Scope:  " . $inquiry_scope . "\n\n";
$body .= "--- PROJECT BRIEF & SPECIFIC MATERIALS ---\n";
$body .= $message . "\n\n";
$body .= "Timestamp:      " . date('Y-m-d H:i:s') . "\n";
$body .= "IP Address:     " . $_SERVER['REMOTE_ADDR'] . "\n";

$headers = "From: The Deco House <no-reply@" . $_SERVER['SERVER_NAME'] . ">\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (@mail($to_email, $subject, $body, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'Your inquiry has been sent directly to our studio team.']);
} else {
    // If standard mail fails or needs SMTP credentials
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to dispatch mail. Please check server SMTP configuration.']);
}
?>
