export const emailIdentityVerificationRequestUpdate = (
  name: string,
  email: string,
  sentAt: string,
  identityVerificationStatus: string // Add a parameter for update details
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
<html lang="en">

<head></head>

<body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
  <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:45em;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
    <tr style="width:100%">
      <td>
        <table style="padding:0 48px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
          <tbody>
            <tr>
              <td>
                <img alt="IGotYou" src="https://uploads.turbologo.com/uploads/icon/preview_image/2880304/draw_svg20200612-15006-1ioouzj.svg.png" width="60" height="60" style="display:block;outline:none;border:none;text-decoration:none" />
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                <h2 style="font-size:18px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Identity Verification Update</h2>
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Hi ${name},</p>
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">There's an update regarding your identity verification request.</p>
                ${
                  identityVerificationStatus === "success"
                    ? successMessage
                    : rejectMessage
                }
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Thank you for your patience during the verification process. We're committed to providing a secure and trusted experience for all our users.</p>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                <p style="font-size:14px;line-height:18px;margin:16px 0;color:#8898aa">If you have any questions, please don't hesitate to contact us.</p>
                <p style="font-size:14px;line-height:18px;margin:16px 0;color:#8898aa">Sincerely,<br />IGotYou Team</p>
                <p style="font-size:14px;line-height:18px;margin:16px 0;color:#8898aa">IGotYou, Brgy. Bubukal Sta. Cruz, Laguna</p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>
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
