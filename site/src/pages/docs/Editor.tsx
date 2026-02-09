import { DocPage } from "../../contexts/TocContext";

const SECTIONS = [
  { id: "toolbar", label: "Toolbar" },
  { id: "source-and-preview", label: "Source and preview" },
  { id: "keyboard-shortcuts", label: "Keyboard shortcuts" },
  { id: "compact-mode", label: "Compact mode" },
];

export default function Editor() {
  return (
    <DocPage sections={SECTIONS}>
      <article>
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Editor (side panel)
        </h1>
        <p className="text-muted mt-2">
          The side panel is a Markdown editor with a live preview and toolbar for vault, folder, title, and export.
        </p>

        <section id="toolbar" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Toolbar
          </h2>
          <ul className="space-y-3 text-sm text-muted">
            <li>
              <strong className="text-ink">Vault name</strong> - Dropdown of saved vaults. Required for Export to Obsidian.
            </li>
            <li>
              <strong className="text-ink">Folder in vault</strong> - the folder (NOT the path) inside the vault (blank = root).
            </li>
            <li>
              <strong className="text-ink">Note title</strong> - Filename for the note. The button next to it captures the current page title and URL into the note.
            </li>
            <li>
              <strong className="text-ink">Export to Obsidian</strong> - Sends the note to Obsidian via <code className="text-ink/80 bg-panel-strong px-1 rounded">obsidian://</code>.
            </li>
            <li>
              <strong className="text-ink">Settings</strong> - Opens the options page (themes, fonts, export template, custom CSS, etc.).
            </li>
          </ul>
        </section>

        <section id="source-and-preview" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Source and preview
          </h2>
          <p className="text-sm text-muted">
            The editor is split into <strong className="text-ink">Source</strong> (Markdown) and <strong className="text-ink">Preview</strong>. You can resize the panes by dragging the divider. Toggle the preview in Settings. The source pane can show word/character count (Settings &gt; Source pane count).
          </p>
        </section>

        <section id="keyboard-shortcuts" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Keyboard shortcuts
          </h2>
          <p className="text-sm text-muted mb-3">
            In the editor:
          </p>
          <ul className="space-y-1 text-sm text-muted">
            <li><code className="text-ink/80 bg-panel-strong px-1 rounded">Ctrl/Cmd + B</code> - Bold</li>
            <li><code className="text-ink/80 bg-panel-strong px-1 rounded">Ctrl/Cmd + I</code> - Italic</li>
            <li><code className="text-ink/80 bg-panel-strong px-1 rounded">Tab</code> - Insert 4 spaces</li>
            <li><code className="text-ink bg-panel-strong px-1 rounded">CUSTOM</code> - Toggle toolbar visibility (go to chrome://extensions/shortcuts).</li>
          </ul>
        </section>

        <section id="compact-mode" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Compact mode
          </h2>
          <p className="text-sm text-muted">
            In Settings &gt; Other, enable <strong className="text-ink">Compact mode</strong> to reduce toolbar size and give more space to the editor and preview.
          </p>
        </section>
      </article>
    </DocPage>
  );
}
