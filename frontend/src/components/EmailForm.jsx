const DEFAULT_FORM = {
  to: '',
  subject: 'Welcome to Raahi',
  firstName: 'Alex',
  emailTitle: 'Welcome aboard',
  emailSubtitle: 'We are excited to have you on the journey.',
  contentHtml:
    '<p>Your account is ready. Explore the platform and let us know if you need anything.</p>',
  ctaLabel: 'Get started',
  ctaUrl: 'https://raahi.com/dashboard',
};

export default function EmailForm({
  form,
  onChange,
  onPreview,
  onSend,
  loading,
  message,
  error,
}) {
  function handleChange(field) {
    return (e) => onChange({ ...form, [field]: e.target.value });
  }

  return (
    <div className="panel">
      <h2 className="panel__title">Compose email</h2>

      <div className="form-group">
        <label htmlFor="to">Recipient</label>
        <input
          id="to"
          type="email"
          placeholder="you@example.com"
          value={form.to}
          onChange={handleChange('to')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input id="subject" value={form.subject} onChange={handleChange('subject')} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input id="firstName" value={form.firstName} onChange={handleChange('firstName')} />
        </div>
        <div className="form-group">
          <label htmlFor="emailTitle">Header title</label>
          <input id="emailTitle" value={form.emailTitle} onChange={handleChange('emailTitle')} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="emailSubtitle">Header subtitle</label>
        <input
          id="emailSubtitle"
          value={form.emailSubtitle}
          onChange={handleChange('emailSubtitle')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="contentHtml">Body (HTML)</label>
        <textarea
          id="contentHtml"
          value={form.contentHtml}
          onChange={handleChange('contentHtml')}
          rows={5}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ctaLabel">Button label</label>
          <input id="ctaLabel" value={form.ctaLabel} onChange={handleChange('ctaLabel')} />
        </div>
        <div className="form-group">
          <label htmlFor="ctaUrl">Button URL</label>
          <input id="ctaUrl" value={form.ctaUrl} onChange={handleChange('ctaUrl')} />
        </div>
      </div>

      <div className="actions">
        <button className="btn btn--secondary" onClick={onPreview} disabled={loading}>
          Preview
        </button>
        <button className="btn btn--primary" onClick={onSend} disabled={loading}>
          {loading ? 'Sending…' : 'Send email'}
        </button>
      </div>

      {message && <div className="alert alert--success">{message}</div>}
      {error && <div className="alert alert--error">{error}</div>}
    </div>
  );
}

export { DEFAULT_FORM };
