export const emailServiceCancellationApproval = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reservation Cancellation Request Approval</title>
<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
    }
    h1, p {
        margin: 0;
        padding: 0;
    }
</style>
</head>
<body>
    <div class="container">
        <h1>Reservation Cancellation Request Approved</h1>
        <p>Your reservation cancellation request has been approved.</p>
        <p>Details of the reservation:</p>
        <ul>
            <li><strong>Reservation ID:</strong> [Reservation ID]</li>
            <li><strong>Reservation Date:</strong> [Reservation Date]</li>
            <li><strong>Cancelled By:</strong> [Name of Person]</li>
        </ul>
        <p>If you have any further questions or concerns, feel free to contact us.</p>
        <p>Thank you.</p>
    </div>
</body>
</html>`;
