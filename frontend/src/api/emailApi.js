const API_BASE = '/api/email';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || data.hint || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export async function getSmtpStatus() {
  const response = await fetch(`${API_BASE}/smtp/status`);
  return response.json();
}

export function previewEmail(payload) {
  return request('/preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function sendEmail(payload) {
  return request('/send', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
