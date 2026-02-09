export default function Privacy() {
  return (
    <main className="pt-32 px-6 pb-24 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        Privacy
      </h1>
      <p className="text-muted mt-2">
        Last updated: February 2025
      </p>

      <section className="mt-10">
        <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
          Overview
        </h2>
        <p className="text-sm text-muted">
          Onyx does not collect, store, or transmit your personal data to any external server. Your notes and settings stay on your device.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
          Data storage
        </h2>
        <p className="text-sm text-muted">
          The Onyx extension uses Chrome’s local and sync storage to save your settings (theme, fonts, vault list, export template, custom CSS, etc.) and the current note content. This data is stored by your browser only. If you use Chrome sync, your stored data may sync across your signed-in Chrome devices; that is governed by Google’s privacy policy, not by us.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
          Export to Obsidian
        </h2>
        <p className="text-sm text-muted">
          When you click “Export to Obsidian,” the note is sent from your browser to Obsidian on your machine via the <code className="text-ink/80 bg-panel-strong px-1 rounded">obsidian://</code> protocol. No copy of the note is sent to our servers or any third party.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
          This website
        </h2>
        <p className="text-sm text-muted">
          This marketing site (where you’re reading this) is static. We do not use cookies or analytics to track you.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
          Contact
        </h2>
        <p className="text-sm text-muted">
          For privacy-related questions, contact me at <a href="mailto:sp.projects.dev@gmail.com" className="text-ink underline hover:text-muted">sp.projects.dev@gmail.com</a>.
        </p>
      </section>
    </main>
  );
}
