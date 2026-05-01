import nodemailer from 'nodemailer';

/**
 * Email Configuration
 * Creates and exports email transporter
 */

let transporterInstance = null;
let isInitialized = false;

const createTransporter = () => {
  // Check if SMTP credentials are provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (!isInitialized) {
      console.log(`📧 Email Service: ${isProduction ? 'Production' : 'Development'} mode`);
      console.log('📧 Using configured SMTP:', process.env.SMTP_HOST);
      isInitialized = true;
    }
    
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      logger: !isProduction, // Enable logging in development
      debug: !isProduction,  // Enable debug in development
    });
  }
  
  // Fallback: Use ethereal (fake SMTP for testing)
  if (!isInitialized) {
    console.log('📧 Email Service: Development mode');
    console.log('📧 No SMTP configured - emails will be logged to console only');
    isInitialized = true;
  }
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com',
      pass: 'test',
    },
  });
};

// Lazy-load transporter - create it when first accessed
const getTransporter = () => {
  if (!transporterInstance) {
    transporterInstance = createTransporter();
  }
  return transporterInstance;
};

// Export a proxy that creates transporter on first use
export const transporter = new Proxy({}, {
  get(target, prop) {
    return getTransporter()[prop];
  }
});

export const emailConfig = {
  get from() {
    return process.env.EMAIL_FROM || 'noreply@yourblog.com';
  },
  get fromName() {
    return process.env.EMAIL_FROM_NAME || 'Your Blog Platform';
  }
};
