export const renderVerificationEmail = (name: string, verificationCode: string) => {
  const emailTemplate = `
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NextStore Verification</title>
  <style>
    /* Elegant, modern, and responsive email template */
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-image: linear-gradient(to right, #4c51bf, #6b46c1);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
    }
    .content {
      padding: 40px;
    }
    .verification-code {
      background-color: #f5f7fa;
      border-left: 6px solid #4c51bf;
      padding: 30px;
      margin-bottom: 30px;
      border-radius: 8px;
    }
    .verification-code p {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: #4a5568;
    }
    .code {
      font-size: 48px;
      font-weight: bold;
      color: #4c51bf;
      text-align: center;
      margin-top: 15px;
    }
    .footer {
      background-image: linear-gradient(to right, #4c51bf, #6b46c1);
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 14px;
    }

    /* Responsive styles */
    @media (max-width: 767px) {
      .container {
        margin: 20px;
      }
      .header {
        padding: 30px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 30px;
      }
      .verification-code {
        padding: 20px;
        margin-bottom: 20px;
      }
      .verification-code p {
        font-size: 16px;
      }
      .code {
        font-size: 36px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>NextStore Verification</h1>
    </div>
    <div class="content">
      <div class="verification-code">
        <p>Hello, ${name}!</p>
        <p>Your Verification Code:</p>
        <div class="code">${verificationCode}</div>
      </div>
      <p>Use this code to complete your NextStore account registration. The code will expire in 15 minutes.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 NextStore. Secure Authentication System.</p>
    </div>
  </div>
</body>
</html>
  `;

  return emailTemplate;
};
