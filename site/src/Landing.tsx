import { Link } from "react-router";

export default function Landing() {
  return (
    <main className="pt-40 px-6 pb-24 max-w-3/4 mx-auto">
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Secure the Web With Onyx
          </h1>
          <p className="text-muted mt-4 text-lg">
            A powerful Markdown editor for Chrome. Seamlessly customize your notes and export directly to Obsidian. No account, no friction.
          </p>
        </section>

        {/* Actions */}
        <section className="mt-8">
          <div className="flex items-center justify-center gap-4">
            <a
              href="#features"
              className="inline-block px-6 py-3 rounded-lg bg-panel-strong hover:bg-accent text-ink text-sm font-medium transition-colors"
            >
              Learn More
            </a>
            <a
              href="https://chromewebstore.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg bg-panel-strong hover:bg-accent text-ink text-sm font-medium transition-colors"
            >
              Download for Chrome
            </a>
          </div>
        </section>

        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full mx-auto object-cover rounded-xl mt-24 bg-panel-strong p-1.5"
        >
          <source src="/onyx-demo.mp4" type="video/mp4" />
          <source src="/onyx-demo.mov" type="video/quicktime" />
        </video>

        {/* Features */}
        <section id="features" className="mt-48">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-8">
            Features
          </h2>
          <ul className="space-y-10">
            <li>
              <h3 className="font-semibold text-ink">Side panel editor</h3>
              <p className="text-muted text-sm mt-1">
                Write in Markdown next to any tab. See a preview of your note as
                you type.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-ink">Export to Obsidian</h3>
              <p className="text-muted text-sm mt-1">
                One click sends the note to Obsidian via{" "}
                <code className="text-ink/80 bg-panel-strong px-1 rounded">
                  obsidian://
                </code>
                . Set vault and folder in the toolbar.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-ink">Capture current page</h3>
              <p className="text-muted text-sm mt-1">
                Use the title button to pull the current page title and URL into
                the note.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-ink">Selection imports</h3>
              <p className="text-muted text-sm mt-1">
                Right-click selected text: “Import selection to Editor” or
                “Import selection to Obsidian”.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-ink">Themes</h3>
              <p className="text-muted text-sm mt-1">
                Built‑in themes (dark, light, OLED, Nord, Dracula, etc.) and
                custom themes.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-ink">Keyboard shortcuts</h3>
              <p className="text-muted text-sm mt-1">
                <code className="text-ink/80 bg-panel-strong px-1 rounded">
                  Ctrl/Cmd+B
                </code>{" "}
                bold,{" "}
                <code className="text-ink/80 bg-panel-strong px-1 rounded">
                  Ctrl/Cmd+I
                </code>{" "}
                italic,{" "}
                <code className="text-ink/80 bg-panel-strong px-1 rounded">
                  Tab
                </code>{" "}
                for 4 spaces.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-ink">Maximum customization</h3>
              <p className="text-muted text-sm mt-1">
                Fonts (interface, editor, code), caret shape/animation, corner
                radius, and custom CSS for the side panel.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-ink">Sync scroll</h3>
              <p className="text-muted text-sm mt-1">
                Sync scroll between the editor and the current page.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-ink">Compact mode</h3>
              <p className="text-muted text-sm mt-1">
                Compact mode for more editor space.
              </p>
            </li>
            <p className="text-muted text-sm mt-1">And so much more...</p>
          </ul>
        </section>

        {/* Download */}
        <section
          id="download"
          className="mt-24 pt-24 border-t border-panel-strong"
        >
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Download
          </h2>
          <p className="text-muted text-sm mb-6">
            Open the extension from the puzzle icon and start writing.
          </p>
          <a
            href="https://chromewebstore.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-lg bg-panel-strong hover:bg-accent text-ink text-sm font-medium transition-colors"
          >
            Get Onyx (Chrome)
          </a>
        </section>

        <footer className="mt-48 pt-8 text-muted text-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Onyx" className="w-4 h-4" />
            <span>
              Onyx - Markdown notes for Obsidian. No account, no friction.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/siddper/onyx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-muted font-medium transition-colors ml-2"
            >
              GitHub
            </a>
            <Link
              to="/docs"
              className="text-ink hover:text-muted font-medium transition-colors ml-2"
            >
              Documentation
            </Link>
            <a
              href="https://chromewebstore.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-muted font-medium transition-colors ml-2"
            >
              Download
            </a>
          </div>
        </footer>
    </main>
  );
}
