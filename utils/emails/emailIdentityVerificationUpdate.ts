export const emailIdentityVerificationRequestUpdate = (
  name: string,
  email: string,
  sentAt: string,
  identityVerificationStatus: string // Add a parameter for update details
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Identity Verification Update</title>
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
                <h1>Identity Verification Update</h1>
                <p >Hi ${name},</p>
                <p >There's an update regarding your identity verification request.</p>
                ${
                  identityVerificationStatus === "success"
                    ? successMessage
                    : rejectMessage
                }
                <p >Thank you for your patience during the verification process. We're committed to providing a secure and trusted experience for all our users.</p>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                <p class="paragraph">If you have any questions, please don't hesitate to contact us.</p>
                <p class="paragraph">Sincerely,<br />IGotYou Team</p>
                <p class="paragraph">IGotYou, Brgy. Bubukal Sta. Cruz, Laguna</p>
      </div>  
     
</body>

</html>`;

const successMessage = `<p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Great news! You're identity has been verified and you are now 1 step behind in becoming a host!</p>`;
const rejectMessage = `<p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">We're writing to inform you that there's an issue with your identity verification request. Unfortunately, we're unable to verify your identity at this time.</p>
<br/>
<p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">To proceed, please review the following information and take the necessary actions:</p>
<br/>
<ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="font-size:16px;line-height:24px;color:#525f7f;text-align:left">Reason for rejection: [State the specific reason, such as unclear documents, mismatched information, etc.]</li>
                  <li style="font-size:16px;line-height:24px;color:#525f7f;text-align:left">Required actions: [Clearly outline the steps the user needs to take to resolve the issue, such as resubmitting documents, verifying information, contacting support, etc.]</li>
                </ul>`;
