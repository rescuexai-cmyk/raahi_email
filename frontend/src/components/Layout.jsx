export default function Layout({ smtpStatus, children }) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1 className="layout__title">Raahi Email Studio</h1>
        <p className="layout__subtitle">
          Compose, preview, and send branded transactional emails.
        </p>
        {smtpStatus && (
          <div
            className={`status-badge ${smtpStatus.connected ? 'status-badge--ok' : 'status-badge--error'}`}
          >
            <span className="status-dot" />
            {smtpStatus.connected
              ? `SMTP connected (${smtpStatus.smtp?.host}:${smtpStatus.smtp?.port})`
              : window.location.hostname === 'localhost'
                ? 'SMTP offline — start Mailpit for local sending'
                : 'SMTP offline — add SMTP_PASS (GoDaddy password for support@raahionrescue.com) in Vercel and redeploy'}
          </div>
        )}
      </header>
      {children}
    </div>
  );
}
