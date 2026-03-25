import type { ReactNode } from "react";

function VersionBlock({
  version,
  date,
  title,
  children,
  isFirst = false,
}: {
  version: string;
  date: string;
  title: string;
  children: ReactNode;
  isFirst?: boolean;
}) {
  return (
    <section
      className={
        isFirst
          ? "mt-10"
          : "mt-12 border-t border-panel-strong pt-10"
      }
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-ink">{version}</h2>
        <span className="text-muted text-sm">{date}</span>
      </div>
      <p className="text-ink font-medium mt-2">{title}</p>
      <div className="mt-4 text-sm text-muted space-y-2">{children}</div>
    </section>
  );
}

export default function Changelog() {
  return (
    <main className="pt-32 px-6 pb-24 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        Changelog
      </h1>
      <p className="text-muted mt-2">
        Release history for Onyx.
      </p>

      <VersionBlock
        isFirst
        version="v1.1"
        date="March 24, 2026"
        title="Editor, vault, and quality-of-life improvements."
      >
        <ul className="list-disc list-inside space-y-3">
          <li className="leading-relaxed">
            <span className="text-ink">Improved context menu</span> - new actions such as hiding the source, theme selection, and opening settings. 
          </li>
          <li className="leading-relaxed">
            <span className="text-ink">More settings</span> - font size and line height controls for a more comfortable writing experience.
          </li>
          <li className="leading-relaxed">
            <span className="text-ink">Hide headers</span> - option to hide toolbar / pane headers for a cleaner, distraction-free layout.
          </li>
          <li className="leading-relaxed">
            <span className="text-ink">Editor tab</span> - expanded side panel focused on writing with more room for the Markdown editor.
          </li>
          <li className="leading-relaxed">
            <span className="text-ink">Vault tab</span> - full vault browser with live file editing and sync between the web and your vault.
          </li>
          <li className="leading-relaxed">
            <span className="text-ink">Bug fixes</span> - various stability and polish fixes across the extension.
          </li>
        </ul>
      </VersionBlock>

      <VersionBlock
        version="v1.0"
        date="February 9, 2026"
        title="Onyx released!"
      >
        <p className="leading-relaxed">
          Initial release: Markdown side panel editor with live preview, one-click export to Obsidian, saved vaults, themes and fonts, export templates, custom CSS, compact mode, and capture from the current page.
        </p>
      </VersionBlock>
    </main>
  );
}
