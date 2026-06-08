import 'dotenv/config';

function parseOrigins(value) {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') !== 'production',
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS || 'http://localhost:5173'),
  company: {
    name: process.env.COMPANY_NAME || 'Raahi',
    logoUrl:
      process.env.COMPANY_LOGO_URL ||
      `http://localhost:${Number(process.env.PORT) || 4000}/assets/logos/raahi_logo.png`,
    address: process.env.COMPANY_ADDRESS || '',
    supportEmail: process.env.SUPPORT_EMAIL || 'hello@raahi.com',
    senderName: process.env.SENDER_NAME || 'Raahi Team',
    senderTitle: process.env.SENDER_TITLE || 'Customer Success',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT) || 1025,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || undefined,
    pass: process.env.SMTP_PASS || undefined,
  },
  mailFrom: process.env.MAIL_FROM || 'Raahi <hello@raahi.com>',
};
