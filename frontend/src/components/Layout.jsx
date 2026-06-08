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
              ? smtpStatus.provider === 'resend'
                ? 'Email ready (Resend) — sending as contactus@raahionrescue.com'
                : `SMTP connected (${smtpStatus.smtp?.host}:${smtpStatus.smtp?.port})`
              : smtpStatus.hint || smtpStatus.error || 'Email service offline'}
          </div>
        )}
      </header>
      {children}
    </div>
  );
}
