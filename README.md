# Raahi Email

Professional transactional email system with a separate **backend API** and **frontend studio** for previewing and sending branded emails.

## Project structure

```
raahi_email/
├── backend/          # Node.js API — templates, rendering, SMTP
│   ├── templates/    # Handlebars email layouts
│   └── src/
│       ├── routes/   # HTTP endpoints
│       ├── services/ # Template + email logic
│       └── validators/
└── frontend/         # React UI — compose, preview, send
    └── src/
        ├── api/      # Backend client
        └── components/
```

## Quick start (local)

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your company details. Defaults work with [Mailpit](https://github.com/axllent/mailpit) for local SMTP.

### 3. Start Mailpit (recommended for local sending)

```bash
# macOS
brew install mailpit
mailpit
```

Mailpit UI: http://localhost:8025 — SMTP: `localhost:1025`

### 4. Run backend and frontend

**Terminal 1 — API (port 4000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — UI (port 5173):**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 — compose an email, preview it, and send to Mailpit.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/email/health` | Health check |
| GET | `/api/email/smtp/status` | SMTP connection status |
| POST | `/api/email/preview` | Render HTML without sending |
| POST | `/api/email/send` | Render and send email |

### Send payload example

```json
{
  "to": "test@example.com",
  "subject": "Welcome to Raahi",
  "firstName": "Alex",
  "emailTitle": "Welcome aboard",
  "emailSubtitle": "We are glad you are here.",
  "contentHtml": "<p>Your account is ready.</p>",
  "ctaLabel": "Get started",
  "ctaUrl": "https://raahi.com/dashboard"
}
```

## Deploy on Vercel

This repo uses [Vercel Services](https://vercel.com/docs/services) to deploy frontend and backend together.

1. Import [rescuexai-cmyk/raahi_email](https://github.com/rescuexai-cmyk/raahi_email) on Vercel
2. Set **Application Preset** to **Services**
3. Click **Refresh** (after `vercel.json` is in the repo)
4. Add environment variables in Vercel → Settings → Environment Variables:

| Variable | Required | Example |
|----------|----------|---------|
| `SMTP_HOST` | Yes | `smtp.resend.com` |
| `SMTP_PORT` | Yes | `587` |
| `SMTP_USER` | Yes | `resend` |
| `SMTP_PASS` | Yes | your API key |
| `MAIL_FROM` | Yes | `Raahi <hello@raahi.com>` |
| `COMPANY_LOGO_URL` | No | auto-uses `https://<your-domain>/logos/raahi_logo.png` |
| `CORS_ORIGINS` | No | auto-uses your Vercel URL |

5. Click **Deploy**

Routes on production:
- Frontend: `https://<your-domain>/`
- API: `https://<your-domain>/api/email/*`
- Logo: `https://<your-domain>/logos/raahi_logo.png`

## Production notes

- Set `SMTP_*` to your provider (SendGrid, AWS SES, Resend SMTP, etc.)
- Mailpit does not work on Vercel — use a real SMTP provider
- Configure SPF, DKIM, and DMARC on your sending domain

## Scalability

- **Backend** owns all email logic — other services call `/api/email/send`
- **Frontend** is optional tooling; production apps can call the API directly
- Add new templates under `backend/templates/` without touching the UI
- Swap SMTP for a provider SDK in `email.service.js` when needed
