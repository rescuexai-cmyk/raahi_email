import { useCallback, useEffect, useState } from 'react';
import { getSmtpStatus, previewEmail, sendEmail } from './api/emailApi.js';
import Layout from './components/Layout.jsx';
import EmailForm, { DEFAULT_FORM } from './components/EmailForm.jsx';
import EmailPreview from './components/EmailPreview.jsx';

export default function App() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [previewHtml, setPreviewHtml] = useState('');
  const [smtpStatus, setSmtpStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refreshSmtpStatus = useCallback(async () => {
    try {
      const status = await getSmtpStatus();
      setSmtpStatus(status);
    } catch {
      setSmtpStatus({ connected: false });
    }
  }, []);

  useEffect(() => {
    refreshSmtpStatus();
  }, [refreshSmtpStatus]);

  async function handlePreview() {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { html } = await previewEmail(form);
      setPreviewHtml(html);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const result = await sendEmail(form);
      setPreviewHtml((await previewEmail(form)).html);

      let successMsg = `Email sent to ${form.to} (ID: ${result.messageId})`;
      if (result.previewUrl) {
        successMsg += ` — Preview: ${result.previewUrl}`;
      }
      setMessage(successMsg);
      refreshSmtpStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout smtpStatus={smtpStatus}>
      <div className="studio">
        <EmailForm
          form={form}
          onChange={setForm}
          onPreview={handlePreview}
          onSend={handleSend}
          loading={loading}
          message={message}
          error={error}
        />
        <EmailPreview html={previewHtml} />
      </div>
    </Layout>
  );
}
