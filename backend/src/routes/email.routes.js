import { Router } from 'express';
import { previewEmail, sendEmail, verifySmtpConnection } from '../services/email.service.js';
import { validateEmailPayload, validatePreviewPayload } from '../validators/email.validator.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'raahi-email-api' });
});

router.get('/smtp/status', async (_req, res, next) => {
  try {
    const smtp = await verifySmtpConnection();
    res.json({ connected: true, smtp });
  } catch (err) {
    res.status(503).json({
      connected: false,
      error: err.message,
      hint: process.env.VERCEL
        ? 'Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in Vercel environment variables, then redeploy.'
        : 'For local dev, run Mailpit (SMTP on port 1025) or update SMTP_* in .env',
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
      err.message = process.env.VERCEL
        ? 'Could not connect to SMTP server. Check SMTP_* environment variables in Vercel.'
        : 'Could not connect to SMTP server. Start Mailpit locally or configure SMTP in .env';
    }
    next(err);
  }
});

export default router;
