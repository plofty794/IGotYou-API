export const emailBookingRequestAccepted = (
  name: string,
  serviceTitle: string
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Booking Request Accepted</title>
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
    <h1>Booking Request for ${serviceTitle} Approved</h1>
        
        
        
            <p >Hi ${name},</p>
            <p >I hope this email finds you well. We wanted to provide you an important update regarding the status of your booking request.</p>
            <p >Great news! Your booking request for the listing Hosting has been accepted. You can now proceed to payment and keep in touch with the host for further details.</p>
            <p >Thanks,<br />IGotYou Team</p>
       
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                        <p class="paragraph">If you have any questions, please don't hesitate to contact us.</p>
                        <p class="paragraph">Sincerely,<br />IGotYou Team</p>
                        <p class="paragraph">IGotYou, Brgy. Bubukal Sta. Cruz, Laguna</p>
    </div>
</body>

</html>`;
