import 'dotenv/config';

const PRODUCTION_DOMAIN = 'https://www.raahionrescue.com';
const SUPPORT_EMAIL = 'contactus@raahionrescue.com';

function parseOrigins(value) {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isLocalDev() {
  return (
    !process.env.VERCEL &&
    !process.env.VERCEL_ENV &&
    process.env.NODE_ENV !== 'production'
  );
}

function isProduction() {
  return !isLocalDev();
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
  if (isProduction()) {
    return `${PRODUCTION_DOMAIN}/raahi-logo.png`;
  }
  return `http://localhost:${Number(process.env.PORT) || 4000}/assets/logos/raahi_logo.png`;
}

function getDefaultCorsOrigins() {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS;
  }
  if (isProduction()) {
    const origins = [
      PRODUCTION_DOMAIN,
      'https://raahionrescue.com',
    ];
    if (process.env.VERCEL_URL) {
      origins.push(`https://${process.env.VERCEL_URL}`);
    }
    return origins.join(',');
  }
  return 'http://localhost:5173';
}

function getSmtpConfig() {
  // Only use Mailpit when running locally without explicit SMTP_HOST
  if (isLocalDev() && !process.env.SMTP_HOST) {
    return {
      host: 'localhost',
      port: Number(process.env.SMTP_PORT) || 1025,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || undefined,
      pass: process.env.SMTP_PASS || undefined,
    };
  }

  return {
    host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || SUPPORT_EMAIL,
    pass: process.env.SMTP_PASS,
  };
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: !isProduction(),
  appOrigin: getAppOrigin(),
  corsOrigins: parseOrigins(getDefaultCorsOrigins()),
  company: {
    name: process.env.COMPANY_NAME || 'Raahi',
    logoUrl: getDefaultLogoUrl(),
    address: process.env.COMPANY_ADDRESS || '',
    supportEmail: process.env.SUPPORT_EMAIL || SUPPORT_EMAIL,
    senderName: process.env.SENDER_NAME || 'Raahi Team',
    senderTitle: process.env.SENDER_TITLE || 'Customer Success',
  },
  smtp: getSmtpConfig(),
  mailFrom: process.env.MAIL_FROM || `Raahi <${SUPPORT_EMAIL}>`,
};
