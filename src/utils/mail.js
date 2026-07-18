import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: parseInt(process.env.SMTP_PORT || "587") === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || `"MadhuTube" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
  console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
  return info;
};

export const sendPasswordResetMail = async (to, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color:#ff0000;padding:30px 40px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:28px;">MadhuTube</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  <h2 style="color:#333;margin:0 0 20px 0;font-size:22px;">Password Reset Request</h2>
                  <p style="color:#555;line-height:1.6;margin:0 0 20px 0;">We received a request to reset your password. Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:20px 0;">
                        <a href="${resetUrl}" style="background-color:#ff0000;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;">Reset My Password</a>
                      </td>
                    </tr>
                  </table>
                  <p style="color:#999;line-height:1.6;margin:20px 0 0 0;font-size:13px;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
                  <p style="color:#999;margin:0;font-size:12px;">© ${new Date().getFullYear()} MadhuTube. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject: "Reset Your MadhuTube Password",
    html,
  });
};
