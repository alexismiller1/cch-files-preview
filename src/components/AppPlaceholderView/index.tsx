import "./AppPlaceholderView.css";

/** Simple placeholder screen for file kinds (or quick actions) that "open" in another Adobe
    app — just a blank white page with the app name. Rendered by AppFrame in place of the
    normal page (hiding the primary nav/header), so there's no in-page back button; the way
    out is the faux browser chrome's real back button, since entering this view is tracked as
    a step in navigation history. */
export function AppPlaceholderView({ appName }: { appName: string }) {
  return (
    <div className="app-placeholder">
      <div className="app-placeholder-body">
        <p className="app-placeholder-name">{appName} module</p>
      </div>
    </div>
  );
}
