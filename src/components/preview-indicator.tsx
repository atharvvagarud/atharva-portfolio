export function PreviewIndicator() {
  return (
    <aside className="preview-indicator" aria-label="Preview mode enabled">
      <span className="preview-indicator__dot" aria-hidden="true" />
      <span className="preview-indicator__copy">
        <strong>Preview mode</strong>
        <span>Viewing unpublished content</span>
      </span>
      <form action="/api/draft-mode/disable" method="post">
        <input type="hidden" name="redirect" value="/" />
        <button type="submit">Exit preview</button>
      </form>
    </aside>
  );
}
