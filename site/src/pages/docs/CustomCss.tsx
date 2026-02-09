import { DocPage } from "../../contexts/TocContext";

const SECTIONS = [
  { id: "where-to-set-it", label: "Where to set it" },
  { id: "scope", label: "Scope" },
  { id: "example", label: "Example" },
];

export default function CustomCss() {
  return (
    <DocPage sections={SECTIONS}>
      <article>
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Custom CSS
        </h1>
        <p className="text-muted mt-2">
          Add your own CSS that applies only to the side panel. Your selectors are automatically scoped so they override default styles without affecting the Settings page.
        </p>

        <section id="where-to-set-it" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Where to set it
          </h2>
          <p className="text-sm text-muted">
            Settings &gt; Custom CSS. Enter CSS in the textarea and click <strong className="text-ink">Apply CSS</strong>. It is stored in browser sync storage and reapplied when you open the side panel.
          </p>
        </section>

        <section id="scope" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Scope
          </h2>
          <p className="text-sm text-muted">
            Your rules are scoped to the side panel context. You can target classes like <code className="text-ink/80 bg-panel-strong px-1 rounded">.app</code>, <code className="text-ink/80 bg-panel-strong px-1 rounded">.toolbar</code>, <code className="text-ink/80 bg-panel-strong px-1 rounded">.markdown-body</code>, and use theme variables such as <code className="text-ink/80 bg-panel-strong px-1 rounded">var(--ink)</code>, <code className="text-ink/80 bg-panel-strong px-1 rounded">var(--panel)</code>, <code className="text-ink/80 bg-panel-strong px-1 rounded">var(--radius)</code>.
          </p>
        </section>

        <section id="example" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Example
          </h2>
          <pre className="bg-panel-strong rounded-lg p-4 text-sm text-muted overflow-x-auto font-mono">
{`.markdown-body h1 {
  font-size: 1.5rem;
}
.toolbar {
  border-radius: var(--radius);
}`}
          </pre>
        </section>
      </article>
    </DocPage>
  );
}
