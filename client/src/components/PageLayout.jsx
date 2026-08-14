import AppShell from "./AppShell";
import "./PageLayout.css";

export function createDashboardNav(onNavigate, current) {
  const norm = (current || "").toString().replace(/^\//, "");
  return [
    { label: "Dashboard", onClick: () => onNavigate("dashboard"), active: norm === "dashboard" },
    { label: "AI Query", onClick: () => onNavigate("ai-query"), active: norm === "ai-query" },
    { label: "Recommendations", onClick: () => onNavigate("recommendations"), active: norm === "recommendations" },
    { label: "Export", onClick: () => onNavigate("export"), active: norm === "export" },
  ];
}

function PageLayout({
  title,
  subtitle,
  onBack,
  backLabel = "← Back",
  nav = [],
  children,
  className = "",
  size = "lg",
  layout = "default",
}) {
  const isDashboard = layout === "dashboard";
  const shellSize = isDashboard ? "lg" : size;

  return (
    <AppShell size={shellSize} className={`page-layout ${isDashboard ? "page-layout--dashboard" : ""} ${className}`.trim()}>
      <div className="page-top">
        <div className="page-top__row">
          {onBack && (
            <button type="button" onClick={onBack} className="btn btn-secondary btn-sm page-top__back">
              {backLabel}
            </button>
          )}
          <div className="page-top__titles">
            <h1>{title}</h1>
            {subtitle && <p className="page-top__subtitle">{subtitle}</p>}
          </div>

          {isDashboard && nav.length > 0 && (
            <nav className="page-nav page-nav--tabs" aria-label="Dashboard sections">
              {nav.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className={`page-tab ${item.active ? "page-tab--active" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {!isDashboard && nav.length > 0 && (
            <nav className="page-nav page-nav--inline" aria-label="Page navigation">
              {nav.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className={`btn btn-sm ${item.active ? "btn-primary" : "btn-secondary"}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>

      <main className="page-body">{children}</main>
    </AppShell>
  );
}

export default PageLayout;
