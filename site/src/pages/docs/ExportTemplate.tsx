import { DocPage } from "../../contexts/TocContext";

const SECTIONS = [
  { id: "where-to-set-it", label: "Where to set it" },
  { id: "placeholders", label: "Placeholders" },
  { id: "example", label: "Example" },
];

export default function ExportTemplate() {
  return (
    <DocPage sections={SECTIONS}>
      <article>
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Export template
        </h1>
        <p className="text-muted mt-2">
          Text prepended to the note when you click “Export to Obsidian”. Use placeholders for date, time, and title; they are replaced at export time.
        </p>

        <section id="where-to-set-it" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Where to set it
          </h2>
          <p className="text-sm text-muted">
            Settings &gt; Export template. Leave the textarea blank for no template (only your note content is sent).
          </p>
        </section>

        <section id="placeholders" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Placeholders
          </h2>
          <ul className="space-y-2 text-sm text-muted">
            <li><code className="text-ink/80 bg-panel-strong px-1 rounded">{`{{date}}`}</code> - Export date (e.g. 2025-02-08).</li>
            <li><code className="text-ink/80 bg-panel-strong px-1 rounded">{`{{time}}`}</code> - Export time.</li>
            <li><code className="text-ink/80 bg-panel-strong px-1 rounded">{`{{title}}`}</code> - Note title (from the toolbar).</li>
          </ul>
        </section>

        <section id="example" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Example
          </h2>
          <pre className="bg-panel-strong rounded-lg p-4 text-sm text-muted overflow-x-auto whitespace-pre-wrap font-mono">
{`---
tags: [web-clip]
date: {{date}}
---

`}
          </pre>
          <p className="text-sm text-muted mt-2">
            This adds a YAML frontmatter block with a tag and the export date before your note content.
          </p>
        </section>
      </article>
    </DocPage>
  );
}
