import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.resolve(__dirname, '../../templates/base.hbs');

let compiledTemplate = null;

async function getTemplate() {
  if (!compiledTemplate) {
    const source = await fs.readFile(TEMPLATE_PATH, 'utf8');
    compiledTemplate = Handlebars.compile(source);
  }
  return compiledTemplate;
}

function buildTemplateData(payload) {
  const ctaUrl = payload.ctaUrl?.trim() || '';
  const ctaLabel = payload.ctaLabel?.trim() || 'Get started';

  return {
    subject: payload.subject,
    firstName: payload.firstName,
    emailTitle: payload.emailTitle,
    emailSubtitle: payload.emailSubtitle || '',
    contentHtml: payload.contentHtml,
    ctaUrl: ctaUrl || null,
    ctaLabel,
    logoUrl: env.company.logoUrl,
    companyName: env.company.name,
    companyAddress: env.company.address,
    supportEmail: env.company.supportEmail,
    senderName: env.company.senderName,
    senderTitle: env.company.senderTitle,
  };
}

function htmlToPlainText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function renderEmail(payload) {
  const template = await getTemplate();
  const data = buildTemplateData(payload);
  const html = template(data);
  const text = [
    `Hi ${data.firstName},`,
    '',
    htmlToPlainText(payload.contentHtml),
    data.ctaUrl ? `\n${data.ctaLabel}: ${data.ctaUrl}` : '',
    '',
    `Best regards,`,
    data.senderName,
    data.senderTitle,
    data.companyName,
  ]
    .filter(Boolean)
    .join('\n');

  return { html, text, subject: payload.subject };
}
