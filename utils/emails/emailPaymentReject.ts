export const emailPaymentReject = (
  name: string,
  subscriptionExpiresAt: string
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
<html lang="en">

  <head></head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">You updated the password for your Twitch account</div>

  <body style="background-color:#efeef1;font-family:HelveticaNeue,Helvetica,Arial,sans-serif">
    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;width:580px;margin:30px auto;background-color:#ffffff">
      <tr style="width:100%">
        <td>
          <table style="display:flex;justify-content:center;aling-items:center;padding:30px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td><img src="https://uploads.turbologo.com/uploads/icon/preview_image/2880304/draw_svg20200612-15006-1ioouzj.svg.png" width="100" height="100" style="display:block;outline:none;border:none;text-decoration:none" /></td>
              </tr>
            </tbody>
          </table>
          <table style="width:100%;display:flex" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td>
                  <table width="100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                    <tbody style="width:100%">
                      <tr style="width:100%">
                        <td style="border-bottom:1px solid rgb(238,238,238);width:249px"></td>
                        <td style="border-bottom:1px solid rgb(145,71,255);width:102px"></td>
                        <td style="border-bottom:1px solid rgb(238,238,238);width:249px"></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table style="padding:5px 50px 10px 60px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td>
                  <p style="font-size:14px;line-height:1.5;margin:16px 0">Hi ${name},</p>
                  <p style="font-size:14px;line-height:1.5;margin:16px 0">I hope this email finds you well. We wanted to provide you with an important update regarding the status of your subscription payment.</p>
                  <p style="font-size:14px;line-height:1.5;margin:16px 0">Great news! Your payment for IGotYou Hosting has been successfully processed. You can now continue enjoying all the benefits of your subscription, including creating, managing your own listing. Your next payment is due on ${subscriptionExpiresAt}.</p>     
                  <p style="font-size:14px;line-height:1.5;margin:16px 0">Thanks,<br />IGotYou Team</p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
    <table style="width:580px;margin:0 auto" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
      <tbody>
        <tr>
          <td>
            
            <p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center;color:#706a7b">© ${new Date().getFullYear()} IGotYou, All Rights Reserved <br />Brgy. Bubukal, Sta. Cruz, Laguna - Philippines</p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
