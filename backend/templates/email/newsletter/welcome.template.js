/**
 * Newsletter Welcome Email Template
 * Sent when a user subscribes to the newsletter
 */

export const getNewsletterWelcomeTemplate = (email, unsubscribeUrl) => {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Newsletter</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome to Our Newsletter! 🎉</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px; color: #333333; font-size: 18px; line-height: 1.6;">
                    Thank you for subscribing!
                  </p>
                  <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                    We're excited to have you join our community. You'll now receive:
                  </p>
                  
                  <!-- Benefits List -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <tr>
                      <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 10px;">
                        <div style="display: flex; align-items: start;">
                          <span style="font-size: 24px; margin-right: 15px;">📚</span>
                          <div>
                            <strong style="color: #333333; font-size: 16px; display: block; margin-bottom: 5px;">Latest Articles</strong>
                            <span style="color: #666666; font-size: 14px;">Get notified when we publish new content</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr><td style="height: 10px;"></td></tr>
                    <tr>
                      <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 10px;">
                        <div style="display: flex; align-items: start;">
                          <span style="font-size: 24px; margin-right: 15px;">💡</span>
                          <div>
                            <strong style="color: #333333; font-size: 16px; display: block; margin-bottom: 5px;">Exclusive Insights</strong>
                            <span style="color: #666666; font-size: 14px;">Tips, tricks, and industry updates</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr><td style="height: 10px;"></td></tr>
                    <tr>
                      <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                        <div style="display: flex; align-items: start;">
                          <span style="font-size: 24px; margin-right: 15px;">🎁</span>
                          <div>
                            <strong style="color: #333333; font-size: 16px; display: block; margin-bottom: 5px;">Special Updates</strong>
                            <span style="color: #666666; font-size: 14px;">Be the first to know about new features</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                    We respect your inbox and promise to only send you valuable content. No spam, ever!
                  </p>
                  
                  <div style="margin: 30px 0; text-align: center;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Visit Our Blog
                    </a>
                  </div>
                  
                  <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.5; text-align: center;">
                      You're receiving this email because you subscribed to our newsletter at <strong>${email}</strong>
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0 0 10px; color: #666666; font-size: 12px;">
                    <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none;">Unsubscribe</a> from this newsletter
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    © ${currentYear} ${process.env.EMAIL_FROM_NAME || 'Your Blog Platform'}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
