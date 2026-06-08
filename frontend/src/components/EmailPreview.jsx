export default function EmailPreview({ html }) {
  return (
    <div className="panel">
      <h2 className="panel__title">Live preview</h2>
      {html ? (
        <iframe
          className="preview-frame"
          title="Email preview"
          srcDoc={html}
          sandbox="allow-same-origin"
        />
      ) : (
        <div className="preview-empty">Click Preview to render the email template</div>
      )}
    </div>
  );
}
