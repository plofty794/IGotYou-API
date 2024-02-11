export const emailPendingServicePayment = (
  name: string,
  serviceTitle: string
) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Service Payment Update</title>
<style>
    body {
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

    .paragraph {
        text-align: center;
    }
</style>
</head>
<body>
<div class="container">
               
                <h1>Action Required: Complete Your Service Payment</h1>
                <p >Hi ${name},</p>
                <p >This is a friendly reminder that your payment for ${serviceTitle} is still pending. To ensure your service is booked and ready to go, please complete your payment as soon as possible.</p>
                <p >Here are the details of your booking:</p>
                <ul style="padding: 0; margin: 0;">
                  <li ><strong>Service:</strong> [Service Title]</li>
                  <li ><strong>Booking Date:</strong> [Booking Date]</li>
                  <li ><strong>Total Amount Due:</strong> [Total Amount]</li>
                </ul>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                <p class="paragraph">If you have any questions, please don't hesitate to contact us.</p>
                <p class="paragraph">Sincerely,<br />IGotYou Team</p>
                <p class="paragraph">IGotYou, Brgy. Bubukal Sta. Cruz, Laguna</p>
          </div>
</body>

</html>`;
