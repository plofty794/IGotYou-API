export const emailRequestPayout = (
  serviceName: string,
  serviceDate: string[],
  guestName: string,
  amount: number,
  hostName: string
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Host Payout Request</title>
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
    <h1>Request for Payout</h1>
    <p>Dear Admin,</p>
    <p>I am requesting a payout for the following service:</p>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li><strong>Service Name:</strong> ${serviceName}</li>
      <li><strong>Service Date:</strong> ${serviceDate[0]} - ${serviceDate[1]}</li>
      <li><strong>Guest Name:</strong> ${guestName}</li>
      <li><strong>Total Amount:</strong> ${amount}</li>
    </ul>
    <p>I have attached any necessary documentation to support this request. Please process the payout at your earliest convenience.</p>
    <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
    <p class="paragraph">Thank you for your prompt attention to this matter.</p>
    <p class="paragraph">Sincerely,<br />${hostName}</p>
    <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
    <p class="paragraph">If you have any questions, please don't hesitate to contact us.</p>
    <p class="paragraph">Sincerely,<br />IGotYou Team</p>
    <p class="paragraph">IGotYou, Brgy. Bubukal Sta. Cruz, Laguna</p>
  </div>
</body>
</html>`;
