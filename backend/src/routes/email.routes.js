import { Router } from 'express';
import { env } from '../config/env.js';
import {
  getEmailProviderStatus,
  previewEmail,
  sendEmail,
  verifySmtpConnection,
} from '../services/email.service.js';
import { validateEmailPayload, validatePreviewPayload } from '../validators/email.validator.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'raahi-email-api' });
});

router.get('/smtp/status', async (_req, res) => {
  const config = getEmailProviderStatus();

  try {
    const smtp = await verifySmtpConnection();
    res.json({ connected: true, ...config, smtp });
  } catch (err) {
    res.status(503).json({
      connected: false,
      ...config,
      error: err.message,
      hint: env.isDev
        ? 'For local dev, run Mailpit (SMTP on port 1025) or update SMTP_* in .env'
        : config.resendConfigured
          ? 'Resend API key is set but connection failed. Check RESEND_API_KEY in Vercel.'
          : !config.passwordConfigured
            ? 'SMTP_PASS is missing in Vercel. Add it under Settings → Environment Variables, then redeploy.'
            : err.message.includes('Greeting never received') ||
                err.message.includes('ECONNREFUSED') ||
                err.message.includes('ETIMEDOUT')
              ? 'GoDaddy blocks Vercel on port 465. Switch to RESEND_API_KEY (recommended), or try SMTP_PORT=587 and SMTP_SECURE=false in Vercel.'
              : 'GoDaddy SMTP often blocks Vercel. Use RESEND_API_KEY instead (free at resend.com) — still sends from contactus@raahionrescue.com.',
    });
  }
});

router.post('/preview', async (req, res, next) => {
  const result = validatePreviewPayload(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
  }

  try {
    const { html, text, subject } = await previewEmail(result.data);
    res.json({ subject, html, text });
  } catch (err) {
    next(err);
  }
});

router.post('/send', async (req, res, next) => {
  const result = validateEmailPayload(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
  }

  try {
    const sendResult = await sendEmail(result.data);
    res.json({ success: true, ...sendResult });
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      err.status = 503;
      err.message = env.isDev
        ? 'Could not connect to SMTP server. Start Mailpit locally or configure SMTP in .env'
        : `Could not connect to GoDaddy SMTP (${env.smtp.host}:${env.smtp.port}). Check SMTP_PASS in Vercel.`;
    }
    next(err);
  }
});

export default router;
