import { DocPage } from "../../contexts/TocContext";

const SECTIONS = [
  { id: "built-in-themes", label: "Built-in themes" },
  { id: "custom-themes", label: "Custom themes" },
  { id: "config-format", label: "Config format" },
  { id: "example-config", label: "Example config" },
  { id: "removing-a-custom-theme", label: "Removing a custom theme" },
];

const EXAMPLE_JSON = `{
  "name": "Midnight",
  "colorScheme": "dark",
  "colors": {
    "--bg": "#0a0b0c",
    "--panel": "#12141a",
    "--panel-strong": "#1a1d24",
    "--ink": "#e6e8eb",
    "--muted": "#8b9099",
    "--accent": "#2d3238",
    "--accent-hover": "#383e46",
    "--overlay": "rgba(0, 0, 0, 0.5)",
    "--shadow": "0 4px 20px rgba(0, 0, 0, 0.4)",
    "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.45)"
  }
}`;

export default function Themes() {
  return (
    <DocPage sections={SECTIONS}>
      <article>
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Themes
        </h1>
        <p className="text-muted mt-2">
          Choose a built-in theme or import a custom theme from a JSON file. Themes apply to the side panel and settings page.
        </p>

        <section id="built-in-themes" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Built-in themes
          </h2>
          <p className="text-sm text-muted mb-3">
            In Settings &gt; Themes, select one of: System, Light, Dark, OLED, Cyberpunk, Sepia, Nord, Dracula, Tokyo Night (my favorite), Blueberry, Monokai.
          </p>
        </section>

        <section id="custom-themes" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Custom themes
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted">
            <li>Open Settings &gt; Themes.</li>
            <li>Click <strong className="text-ink">Import theme</strong> and choose a JSON file that follows the config format below.</li>
            <li>The theme is validated and added to the Theme dropdown. Custom themes are stored in browser sync storage.</li>
          </ol>
        </section>

        <section id="config-format" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Config format
          </h2>
          <p className="text-sm text-muted mb-3">
            The JSON file must be an object with:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted mb-4">
            <li><strong className="text-ink">name</strong> (string) - Display name of the theme.</li>
            <li><strong className="text-ink">colorScheme</strong> (string) - <code className="bg-panel-strong px-1 rounded">"light"</code> or <code className="bg-panel-strong px-1 rounded">"dark"</code>.</li>
            <li><strong className="text-ink">colors</strong> (object) - CSS variable values (see below).</li>
          </ul>
          <p className="text-sm text-muted mb-2">Required keys in <code className="bg-panel-strong px-1 rounded">colors</code>:</p>
          <div className="bg-panel-strong rounded-lg p-4 text-sm font-mono text-muted overflow-x-auto">
            <div>--bg, --panel, --panel-strong</div>
            <div>--ink, --muted, --accent, --accent-hover</div>
            <div>--overlay, --shadow, --shadow-modal</div>
          </div>
          <p className="text-sm text-muted mt-3">
            Values can be any valid CSS (e.g. hex, <code className="bg-panel-strong px-1 rounded">rgba()</code>). Use the same key names as in the built-in themes.
          </p>
        </section>

        <section id="example-config" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Example config
          </h2>
          <p className="text-sm text-muted mb-3">
            Save this as a <code className="bg-panel-strong px-1 rounded">.json</code> file and import it in Settings &gt; Themes &gt; Import theme.
          </p>
          <pre className="bg-panel-strong rounded-lg p-4 text-sm text-muted overflow-x-auto overflow-y-auto font-mono whitespace-pre">
            {EXAMPLE_JSON}
          </pre>
        </section>

        <section id="removing-a-custom-theme" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Removing a custom theme
          </h2>
          <p className="text-sm text-muted">
            In Settings &gt; Themes, use the <strong className="text-ink">Remove</strong> control next to the theme in the Custom themes list. This only removes it from Onyx; your JSON file is unchanged.
          </p>
        </section>
      </article>
    </DocPage>
  );
}
