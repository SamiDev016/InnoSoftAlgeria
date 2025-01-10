<?php
header('Content-Type: application/json');

// Enable CORS for your domain only
header("Access-Control-Allow-Origin: *"); // Change * to your actual domain in production
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate input data
    $name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = filter_var($_POST['phone'] ?? '', FILTER_SANITIZE_STRING);
    $subject = filter_var($_POST['subject'] ?? '', FILTER_SANITIZE_STRING);
    $message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid email address"
        ]);
        exit;
    }

    // Recipient email
    $to = "adelim0555@gmail.com"; // Your email address

    // Email headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Email content with better HTML formatting
    $emailContent = "
        <!DOCTYPE html>
        <html>
        <head>
            <title>New Contact Form Submission</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #04925C; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .field { margin-bottom: 10px; }
                .label { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>New Contact Form Submission</h2>
                </div>
                <div class='content'>
                    <div class='field'>
                        <p class='label'>Name:</p>
                        <p>" . htmlspecialchars($name) . "</p>
                    </div>
                    <div class='field'>
                        <p class='label'>Email:</p>
                        <p>" . htmlspecialchars($email) . "</p>
                    </div>
                    <div class='field'>
                        <p class='label'>Phone:</p>
                        <p>" . htmlspecialchars($phone) . "</p>
                    </div>
                    <div class='field'>
                        <p class='label'>Subject:</p>
                        <p>" . htmlspecialchars($subject) . "</p>
                    </div>
                    <div class='field'>
                        <p class='label'>Message:</p>
                        <p>" . nl2br(htmlspecialchars($message)) . "</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    ";

    // Try to send email
    try {
        if(mail($to, "New Contact Form: $subject", $emailContent, $headers)) {
            echo json_encode([
                "success" => true,
                "message" => "Thank you for your message! We will get back to you soon."
            ]);
        } else {
            throw new Exception("Failed to send email");
        }
    } catch (Exception $e) {
        error_log("Email sending failed: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Sorry, there was an error sending your message. Please try again later."
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);
}
