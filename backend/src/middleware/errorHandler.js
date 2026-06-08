export function errorHandler(err, _req, res, _next) {
  console.error('[error]', err.message);

  const status = err.status || 500;
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(status).json({ error: message });
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}
