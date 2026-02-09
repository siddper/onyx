import { DocPage } from "../../contexts/TocContext";

const SECTIONS = [
  { id: "presets", label: "Presets" },
  { id: "custom-font", label: "Custom font" },
  { id: "where-each-font-is-used", label: "Where each font is used" },
];

export default function Fonts() {
  return (
    <DocPage sections={SECTIONS}>
      <article>
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Fonts
        </h1>
        <p className="text-muted mt-2">
          Set the interface, editor, and monospace (code) fonts in Settings &gt; Fonts. You can use a preset or add a custom font via a Google Fonts (or other) @import URL and font family name.
        </p>

        <section id="presets" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Presets
          </h2>
          <p className="text-sm text-muted">
            The dropdowns include built-in presets. Choose one and it applies immediately to the side panel.
          </p>
        </section>

        <section id="custom-font" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Custom font
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted">
            <li>
              Select <strong className="text-ink">Custom</strong> from the dropdown for the font you want to change (Interface, Editor, or Monospace / code).
            </li>
            <li>
              If you want to use a <a href="https://fonts.google.com/" target="_blank" className="text-ink">Google Font</a> (or another web font), paste an <code className="text-ink/80 bg-panel-strong px-1 rounded">@import url(...)</code> or Google Fonts link in the first field.
              If you prefer to use a system font (like Arial, Georgia, etc.), you can leave this field blank.
            </li>
            <li>
              Enter the font family name (e.g. Inter, JetBrains Mono, or a system font like Arial) in the second field.
            </li>
          </ol>
          <p className="text-sm text-muted mt-3">
            Custom fonts are stored in your browser and apply to the side panel and the Settings page.
          </p>
        </section>

        <section id="where-each-font-is-used" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Where each font is used
          </h2>
          <ul className="space-y-2 text-sm text-muted">
            <li><strong className="text-ink">Interface font</strong> - Toolbar labels, buttons, inputs, pane labels.</li>
            <li><strong className="text-ink">Editor font</strong> - The Markdown source textarea.</li>
            <li><strong className="text-ink">Monospace / code font</strong> - Inline code and code blocks in the preview and editor.</li>
          </ul>
        </section>
      </article>
    </DocPage>
  );
}
