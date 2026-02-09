import { NavLink, Outlet } from "react-router";
import { TocProvider, useToc } from "../contexts/TocContext";

const DOC_TABS = [
  { slug: "get-started", label: "Get started" },
  { slug: "editor", label: "Editor" },
  { slug: "themes", label: "Themes" },
  { slug: "fonts", label: "Fonts" },
  { slug: "export-template", label: "Export template" },
  { slug: "custom-css", label: "Custom CSS" },
] as const;

function OnThisPage() {
  const { sections } = useToc();
  if (sections.length === 0) return null;
  return (
    <nav className="sticky top-24">
      <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-3">
        On this page
      </h2>
      <ul className="flex flex-col gap-0.5 text-sm">
        {sections.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block py-1 text-muted hover:text-ink transition-colors"
            >
              {item.label}
            </a>
            {item.children && item.children.length > 0 && (
              <ul className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-panel-strong pl-3">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      className="block py-0.5 text-muted hover:text-ink transition-colors"
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function DocsLayout() {
  return (
    <TocProvider>
      <div className="pt-24 flex h-screen overflow-hidden">
        <aside className="w-56 shrink-0 pl-12 pr-6 py-8 border-r border-panel-strong overflow-hidden">
          <nav className="flex flex-col gap-0.5">
            {DOC_TABS.map(({ slug, label }) => (
              <NavLink
                key={slug}
                to={`/docs/${slug}`}
                className={({ isActive }) =>
                  `text-sm py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-panel-strong text-ink font-medium"
                      : "text-muted hover:text-ink hover:bg-panel-strong/50"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="flex justify-center px-8 lg:px-12 py-8">
            <div className="w-full max-w-2xl">
              <Outlet />
              <div className="h-20 shrink-0" aria-hidden />
            </div>
          </div>
        </div>

        <aside className="hidden xl:block w-52 shrink-0 pl-6 pr-8 py-8 overflow-hidden">
          <OnThisPage />
        </aside>
      </div>
    </TocProvider>
  );
}
