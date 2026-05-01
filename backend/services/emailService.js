import { transporter, emailConfig } from '../config/email.config.js';
import { AppError } from '../utils/AppError.js';
import nodemailer from 'nodemailer';

/**
 * Email Service - Handles all email sending operations
 * Reusable service for sending various types of emails
 */
class EmailService {
  /**
   * Send email with retry logic
   * @param {Object} options - Email options
   * @private
   */
  async sendEmail({ to, subject, html, text }) {
    try {
      const mailOptions = {
        from: `${emailConfig.fromName} <${emailConfig.from}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      console.log(`📧 Attempting to send email to: ${to}`);
      console.log(`📧 Subject: ${subject}`);

      const info = await transporter.sendMail(mailOptions);

      // Log email in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Email sent successfully:', {
          to,
          subject,
          messageId: info.messageId,
        });
        console.log('📧 Email preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return info;
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      console.error('❌ Full error:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  /**
   * Send OTP verification email
   * @param {string} email - Recipient email
   * @param {string} name - Recipient name
   * @param {string} otp - OTP code
   */
  async sendOTPEmail(email, name, otp) {
    const subject = 'Verify Your Email - OTP Code';
    const html = this.getOTPEmailTemplate(name, otp);

    return this.sendEmail({ to: email, subject, html });
  }

  /**
   * Send welcome email after verification
   * @param {string} email - Recipient email
   * @param {string} name - Recipient name
   */
  async sendWelcomeEmail(email, name) {
    const subject = 'Welcome to Our Platform!';
    const html = this.getWelcomeEmailTemplate(name);

    return this.sendEmail({ to: email, subject, html });
  }

  /**
   * Send password reset email
   * @param {string} email - Recipient email
   * @param {string} name - Recipient name
   * @param {string} resetUrl - Password reset URL
   */
  async sendPasswordResetEmail(email, name, resetUrl) {
    const subject = 'Password Reset Request';
    const html = this.getPasswordResetTemplate(name, resetUrl);

    return this.sendEmail({ to: email, subject, html });
  }

  /**
   * OTP Email Template
   * @private
   */
  getOTPEmailTemplate(name, otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Email Verification</h1>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                      Hi <strong>${name}</strong>,
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Thank you for signing up! Please use the following One-Time Password (OTP) to verify your email address:
                    </p>
                    
                    <!-- OTP Box -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 2px dashed #667eea;">
                          <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 20px; color: #666666; font-size: 14px; line-height: 1.5;">
                      This OTP will expire in <strong>10 minutes</strong>. If you didn't request this verification, please ignore this email.
                    </p>
                    
                    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                        For security reasons, never share this OTP with anyone. Our team will never ask for your OTP.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © ${new Date().getFullYear()} ${emailConfig.fromName}. All rights reserved.
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
  }

  /**
   * Welcome Email Template
   * @private
   */
  getWelcomeEmailTemplate(name) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px; text-align: center;">
                    <h1 style="margin: 0 0 20px; color: #333333; font-size: 28px;">Welcome to ${emailConfig.fromName}! 🎉</h1>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Hi <strong>${name}</strong>,
                    </p>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Your email has been successfully verified! You're all set to explore our platform and start your journey with us.
                    </p>
                    <div style="margin: 30px 0;">
                      <a href="${process.env.CLIENT_URL}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        Get Started
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © ${new Date().getFullYear()} ${emailConfig.fromName}. All rights reserved.
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
  }

  /**
   * Password Reset Email Template
   * @private
   */
  getPasswordResetTemplate(name, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px;">
                    <h1 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Password Reset Request</h1>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Hi <strong>${name}</strong>,
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    <div style="margin: 30px 0; text-align: center;">
                      <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        Reset Password
                      </a>
                    </div>
                    <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © ${new Date().getFullYear()} ${emailConfig.fromName}. All rights reserved.
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
  }

  /**
   * Strip HTML tags for plain text version
   * @private
   */
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

export default new EmailService();
