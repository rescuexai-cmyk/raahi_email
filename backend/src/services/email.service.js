import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { renderEmail } from './template.service.js';

let transporter = null;

function createTransporter() {
  const { host, port, secure, user, pass } = env.smtp;
  const auth = user && pass ? { user, pass } : undefined;

  return nodemailer.createTransport({ host, port, secure, auth });
}

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

export async function sendEmail(payload) {
  const { html, text, subject } = await renderEmail(payload);
  const transport = getTransporter();

  const info = await transport.sendMail({
    from: env.mailFrom,
    to: payload.to,
    subject,
    html,
    text,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    previewUrl: previewUrl || null,
  };
}

export async function previewEmail(payload) {
  return renderEmail(payload);
}

export async function verifySmtpConnection() {
  const transport = getTransporter();
  await transport.verify();
  return {
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
  };
}
