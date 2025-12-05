import { Resend } from 'resend'

export async function sendOTPEmail(
  apiKey: string,
  to: string,
  otp: string
): Promise<void> {
  const resend = new Resend(apiKey)
  
  const result = await resend.emails.send({
    from: 'Bchewy Dropbox <noreply@notifications.bchewy.com>',
    to,
    subject: `${otp} is your login code`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 400px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #111827;">Bchewy.com Dropbox</h1>
              <p style="margin: 0 0 32px 0; font-size: 14px; color: #6b7280;">Your login code</p>
              
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <span style="font-size: 36px; font-weight: 700; letter-spacing: 6px; color: #111827; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace;">${otp}</span>
              </div>
              
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">Copy and paste this code to sign in.</p>
              <p style="margin: 0; font-size: 13px; color: #9ca3af;">Expires in 5 minutes.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">If you didn't request this code, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  })
  
  if (result.error) {
    throw new Error(`Resend error: ${result.error.message}`)
  }
}

