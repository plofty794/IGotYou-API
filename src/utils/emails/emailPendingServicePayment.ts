export const emailPendingServicePayment = (
  name: string,
  serviceTitle: string
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
                <h2 style="font-size:18px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Action Required: Complete Your Service Payment</h2>
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Hi ${name},</p>
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Thank you for choosing IGotYou! We're excited to get you started with your service.</p>
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">This is a friendly reminder that your payment for ${serviceTitle} is still pending. To ensure your service is booked and ready to go, please complete your payment as soon as possible.</p>
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Here are the details of your booking:</p>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="font-size:16px;line-height:24px;color:#525f7f;text-align:left">Service: [Service Title]</li>
                  <li style="font-size:16px;line-height:24px;color:#525f7f;text-align:left">Booking Date: [Booking Date]</li>
                  <li style="font-size:16px;line-height:24px;color:#525f7f;text-align:left">Total Amount Due: [Total Amount]</li>
                </ul>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">To complete your payment, please follow these simple steps:</p>
                <ul style="list-style: numeric; padding: 0; margin: 0;">
                  <li style="font-size:16px;line-height:24px;color:#525f7f;text-align:left">Click on the following link: [Payment Link]</li>
                  <li style="font-size:16px;line-height:24px;color:#525f7f;text-align:left">Select your preferred payment method.</li>
                  <li style="font-size:16px;line-height:24px;color:#525f7f;text-align:left">Enter your payment information and confirm the payment.</li>
                </ul>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">If you have any questions or need assistance, please don't hesitate to contact us. We're here to help!</p>
                <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Looking forward to serving you soon!</p>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
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
