export const emailReportUser = (
  reporterEmail: string,
  reporterName: string,
  name: string,
  reason: string, // Reason for the report
  photoEvidence: string // Detailed description of the incident
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>User Report: ${name}</title>
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
  .important {
    color: #c02942;
  }
  
</style>
</head>
<body>
  <div class="container">
    <h1>Important User Report</h1>
    <p>Dear Admin,</p>
    <p>This email serves as a report against user<strong> ${name}</strong>.</p>
    <p class="important">Reported by:</p>
    <p>${reporterEmail}</p>
    <p class="important">Reason for Report:</p>
    <p>${reason}</p>
    <p class="important">Evidence of Report:</p>
    <a href="${photoEvidence}" target="_black">${photoEvidence}</a>

    <p>**Please take necessary action to investigate this report and ensure a safe and positive experience for all users on the platform.**</p>

    <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
    <p class="paragraph">If you have any questions regarding this report, please don't hesitate to contact me.</p>
    <p class="paragraph">Thank you for your time and attention to this matter.</p>
    <br />
    <p class="paragraph">Sincerely,<br />${reporterName}</p>
  </div>
</body>
</html>`;
