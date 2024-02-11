export const emailServiceCancellationApproval = (
  reservationID: string,
  reservationDates: string[],
  hostName: string,
  serviceTitle: string
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reservation Cancellation Request Update</title>
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
        <h1>Reservation Cancellation Request Approved</h1>
        <p>Your reservation cancellation request has been approved.</p>
        <p>Details of the reservation:</p>
        <ul>
            <li><strong>Reservation ID:</strong> ${reservationID}</li>
            <li><strong>Service Title:</strong> ${serviceTitle}</li>
            <li><strong>Reservation Date:</strong> ${reservationDates[0]} - ${reservationDates[1]}</li>
            <li><strong>Cancelled By:</strong> ${hostName}</li>
        </ul>
        <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
        <p class="paragraph">IGotYou, Brgy. Bubukal Sta. Cruz, Laguna</p>
        <p class="paragraph">If you have any further questions or concerns, feel free to contact us.</p>
        <p class="paragraph">Thank you.</p>
    </div>
</body>
</html>`;
