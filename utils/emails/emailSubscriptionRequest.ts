export const emailSubscriptionRequest = (
  name: string,
  email: string,
  sentAt: string
) => `<!DOCTYPE html html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>User Subscription Request</title>
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
  <h1>Subscription Payment Verification Request</h1>
                <p>A new user has requested to subscribe to your hosting plan.</p>
                <p><strong>Time:</strong> ${sentAt}</p>
                <p><strong>User details:</strong></p>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li><strong>Username:</strong> ${name}</li>
                  <li><strong>Email:</strong> ${email}</li>
                </ul>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                <p class="paragraph">If you have any questions, please don't hesitate to contact us.</p>
                <p class="paragraph">Sincerely,<br />IGotYou Team</p>
                <p class="paragraph">IGotYou, Brgy. Bubukal Sta. Cruz, Laguna</p>
  </div>
                
             
</body>

</html>`;
