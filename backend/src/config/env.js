import 'dotenv/config';

function parseOrigins(value) {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getAppOrigin() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${Number(process.env.PORT) || 4000}`;
}

function getDefaultLogoUrl() {
  if (process.env.COMPANY_LOGO_URL) {
    return process.env.COMPANY_LOGO_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/logos/raahi_logo.png`;
  }
  return `http://localhost:${Number(process.env.PORT) || 4000}/assets/logos/raahi_logo.png`;
}

function getDefaultCorsOrigins() {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:5173';
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') !== 'production',
  appOrigin: getAppOrigin(),
  corsOrigins: parseOrigins(getDefaultCorsOrigins()),
  company: {
    name: process.env.COMPANY_NAME || 'Raahi',
    logoUrl: getDefaultLogoUrl(),
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
