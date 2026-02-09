import { DocPage } from "../../contexts/TocContext";

const SECTIONS = [
  { id: "install", label: "Install" },
  { id: "first-note", label: "First note" },
  { id: "saved-vaults", label: "Saved vaults" },
  { id: "context-menu", label: "Context menu" },
];

export default function GetStarted() {
  return (
    <DocPage sections={SECTIONS}>
      <article>
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Get started
        </h1>
        <p className="text-muted mt-2">
          Onyx is a Chrome extension that adds a Markdown editor in the side panel
          and exports notes directly to Obsidian.
        </p>

        <section id="install" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Install
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted">
            <li>Install Onyx from the Chrome Web Store.</li>
            <li>
              Pin the extension (puzzle icon in the toolbar &gt; pin Onyx) or use the
              Onyx icon to open the side panel.
            </li>
            <li>Click the extension icon or use the side panel entry to open the editor.</li>
          </ol>
        </section>

        <section id="first-note" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            First note
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted">
            <li>Open the side panel. Set a <strong className="text-ink">vault name</strong> in the vault manager (required for export).</li>
            <li>Optionally set <strong className="text-ink">folder in vault</strong> and <strong className="text-ink">note title</strong>.</li>
            <li>Write in Markdown. Use the preview pane to see the result.</li>
            <li>Click <strong className="text-ink">Export to Obsidian</strong> to create the note in your vault.</li>
          </ol>
        </section>

        <section id="saved-vaults" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Saved vaults
          </h2>
          <p className="text-sm text-muted">
            Add vault names in <strong className="text-ink">Settings &gt; Saved vaults</strong>. They appear in the side panel vault dropdown so you can switch quickly.
          </p>
        </section>

        <section id="context-menu" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Context menu
          </h2>
          <p className="text-sm text-muted">
            Right‑click selected text on any page: <strong className="text-ink">Import selection to Editor</strong> autofills the editor with the selection; <strong className="text-ink">Import selection to Obsidian</strong> creates a new note in Obsidian with that text (using Settings &gt; Import into Obsidian for default note name and folder).
          </p>
        </section>
      </article>
    </DocPage>
  );
}
