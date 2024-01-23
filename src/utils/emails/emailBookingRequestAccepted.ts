export const emailBookingRequestAccepted = (name: string) => `<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style>
        body {
            background-color: #efeef1;
            font-family: 'HelveticaNeue', 'Helvetica', 'Arial', sans-serif;
        }

        #__react-email-preview {
            display: none;
            overflow: hidden;
            line-height: 1px;
            opacity: 0;
            max-height: 0;
            max-width: 0;
        }

        .email-container {
            max-width: 37.5em;
            width: 720px;
            margin: 30px auto;
            background-color: #ffffff;
        }

        .logo-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 30px;
        }

        .logo {
            display: block;
            outline: none;
            border: none;
            text-decoration: none;
        }

        .divider {
            border-bottom: 1px solid rgb(238, 238, 238);
        }

        .subscription-table {
            width: 100%;
            display: flex;
        }

        .subscription-details {
            padding: 5px 30px 10px 30px;
        }

        .greeting {
            font-size: 15px;
            line-height: 1.5;
            margin: 18px 0;
            font-weight: 500;
        }

        .message {
            font-size: 14px;
            line-height: 1.5;
            margin: 16px 0;
            font-weight: 400;
        }

        .closing {
            font-size: 14px;
            line-height: 1.5;
            margin: 16px 0;
            font-weight: 400;
        }

        .footer {
            width: max-content;
            margin: 0 auto;
        }

        .copyright {
            font-weight: 500;
            font-size: 14px;
            line-height: 24px;
            margin: 16px 0;
            text-align: center;
            color: #706a7b;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="logo-container">
            <img src="https://uploads.turbologo.com/uploads/icon/preview_image/2880304/draw_svg20200612-15006-1ioouzj.svg.png" width="65" height="65" class="logo" />
        </div>
        <div class="divider"></div>
        <div class="subscription-table">
            <table width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td class="divider" style="width: 249px"></td>
                    <td class="divider" style="width: 102px"></td>
                    <td class="divider" style="width: 249px"></td>
                </tr>
            </table>
        </div>
        <div class="subscription-details">
            <p class="greeting">Hi ${name},</p>
            <p class="message">I hope this email finds you well. We wanted to provide you an important update regarding the status of your booking request.</p>
            <p class="message">Great news! Your booking request for the listing Hosting has been accepted. You can now proceed to payment and keep in touch with the host for further details.</p>
            <p class="closing">Thanks,<br />IGotYou Team</p>
        </div>
    </div>
    <div class="footer" align="center">
        <p class="copyright">© ${new Date().getFullYear()} IGotYou, All Rights Reserved <br />Brgy. Bubukal, Sta. Cruz, Laguna - Philippines</p>
    </div>
</body>

</html>`;
