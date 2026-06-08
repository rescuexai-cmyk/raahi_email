import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { env } from '../config/env.js';
import { renderEmail } from './template.service.js';

function createSmtpTransporter() {
  const { host, port, secure, user, pass } = env.smtp;

  if (!pass) {
    throw new Error('SMTP_PASS is not set. Add it in Vercel Environment Variables and redeploy.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
}

function usingResend() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(payload) {
  const { html, text, subject } = await renderEmail(payload);

  if (usingResend()) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: env.mailFrom,
      to: payload.to,
      subject,
      html,
      text,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      messageId: data.id,
      accepted: [payload.to],
      rejected: [],
      previewUrl: null,
      provider: 'resend',
    };
  }

  const transport = createSmtpTransporter();
  const info = await transport.sendMail({
    from: env.mailFrom,
    to: payload.to,
    subject,
    html,
    text,
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    previewUrl: nodemailer.getTestMessageUrl(info) || null,
    provider: 'smtp',
  };
}

export async function previewEmail(payload) {
  return renderEmail(payload);
}

export async function verifySmtpConnection() {
  if (usingResend()) {
    return {
      provider: 'resend',
      host: 'api.resend.com',
      port: 443,
      secure: true,
      user: env.mailFrom,
    };
  }

  const transport = createSmtpTransporter();
  await transport.verify();

  return {
    provider: 'smtp',
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    user: env.smtp.user,
  };
}

export function getEmailProviderStatus() {
  return {
    provider: usingResend() ? 'resend' : 'smtp',
    passwordConfigured: Boolean(process.env.SMTP_PASS || process.env.RESEND_API_KEY),
    resendConfigured: usingResend(),
    smtp: {
      host: env.smtp.host,
      port: env.smtp.port,
      user: env.smtp.user,
      secure: env.smtp.secure,
    },
  };
}
