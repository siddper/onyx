import { DocPage } from "../../contexts/TocContext";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "open-vault-tab", label: "Open the Vault tab" },
  { id: "select-folder", label: "Select your vault folder" },
  { id: "file-browser", label: "File browser" },
  { id: "editing-and-save", label: "Editing and save" },
  { id: "rename-delete-export", label: "Rename, delete, and Export" },
  { id: "obsidian-sync", label: "Sync with Obsidian" },
  { id: "requirements", label: "Requirements and tips" },
];

export default function Vault() {
  return (
    <DocPage sections={SECTIONS}>
      <article>
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Vault tab
        </h1>
        <p className="text-muted mt-2">
          Browse and edit Markdown files inside your Obsidian vault from Onyx’s Settings page. Changes are written to disk so Obsidian and other tools see the same files.
        </p>

        <section id="overview" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Overview
          </h2>
          <p className="text-sm text-muted">
            The <strong className="text-ink">Vault</strong> tab is part of the extension <strong className="text-ink">Settings</strong> window (not the side panel). It sits next to the <strong className="text-ink">Settings</strong> and <strong className="text-ink">Editor</strong> tabs at the top of that page. Open it when you want a file tree and editor that operate directly on your vault folder on your computer.
          </p>
        </section>

        <section id="open-vault-tab" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Open the Vault tab
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted">
            <li>Open Onyx <strong className="text-ink">Settings</strong> (from the side panel or the extension’s options).</li>
            <li>Click the <strong className="text-ink">Vault</strong> tab, or open the options URL with <code className="text-ink/80 bg-panel-strong px-1 rounded">#vault</code> in the hash.</li>
          </ol>
        </section>

        <section id="select-folder" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Select your vault folder
          </h2>
          <p className="text-sm text-muted mb-3">
            Click <strong className="text-ink">Select folder</strong> and choose the root folder of your Obsidian vault (the same folder you open as a vault in Obsidian). The browser will ask for permission to read and write that directory.
          </p>
          <p className="text-sm text-muted">
            Onyx remembers the folder for next time using the browser’s file handle storage. If access expires, use <strong className="text-ink">Select folder</strong> again or <strong className="text-ink">Refresh</strong> after restoring permission.
          </p>
        </section>

        <section id="file-browser" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            File browser
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted">
            <li>
              <strong className="text-ink">Files</strong> - Lists Markdown files in the vault folder (flat list by path).
            </li>
            <li>
              <strong className="text-ink">Search files</strong> - Filters the list by name.
            </li>
            <li>
              <strong className="text-ink">New file</strong> - Creates a new <code className="bg-panel-strong px-1 rounded">.md</code> file in the vault root and opens it for editing.
            </li>
            <li>
              <strong className="text-ink">Refresh</strong> - Reloads the file list from disk.
            </li>
            <li>
              <strong className="text-ink">Toggle file explorer</strong> - Collapse or expand the file list to give more room to the editor.
            </li>
          </ul>
        </section>

        <section id="editing-and-save" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Editing and save
          </h2>
          <p className="text-sm text-muted mb-3">
            After you open a file, you get a <strong className="text-ink">Source</strong> editor and <strong className="text-ink">Preview</strong> pane (same idea as the side panel). Use <strong className="text-ink">Save</strong> to write changes to disk.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted">
            <li>
              <strong className="text-ink">Vault autosave</strong> - In the <strong className="text-ink">Settings</strong> tab, under Other, you can enable or disable automatic save after you pause typing (on by default).
            </li>
            <li>
              <strong className="text-ink">Keyboard</strong> - With the Vault tab focused, <code className="bg-panel-strong px-1 rounded">Ctrl/Cmd + S</code> saves the active file.
            </li>
            <li>
              Switching to another file with unsaved changes prompts you to discard or cancel first.
            </li>
          </ul>
        </section>

        <section id="rename-delete-export" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Rename, delete, and Export
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted">
            <li>
              <strong className="text-ink">Title field</strong> - Edit the note name (basename) and blur the field or press Enter to rename the file on disk.
            </li>
            <li>
              <strong className="text-ink">Delete</strong> - Removes the current file from the vault folder (use with care).
            </li>
            <li>
              <strong className="text-ink">Export</strong> - Copies the current note into the <strong className="text-ink">Editor</strong> tab on the same Settings page and fills the side panel draft (vault, title, content) so you can continue in the side panel or export to Obsidian from there.
            </li>
          </ul>
        </section>

        <section id="obsidian-sync" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Sync with Obsidian
          </h2>
          <p className="text-sm text-muted">
            Because files are read and written on your machine, Obsidian will show updates when it reloads or watches those files-same as editing with any other app outside Obsidian. There is no separate cloud sync from Onyx; your vault’s usual sync (iCloud, Obsidian Sync, Git, etc.) applies to these files like any other.
          </p>
        </section>

        <section id="requirements" className="mt-10 scroll-mt-24">
          <h2 className="text-muted text-xs font-medium uppercase tracking-wider mb-4">
            Requirements and tips
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted">
            <li>
              <strong className="text-ink">Browser</strong> - Folder pickers and persistent handles need a browser that supports the <strong className="text-ink">File System Access API</strong> (e.g. recent Chrome or Edge). If <strong className="text-ink">Select folder</strong> stays disabled, your environment may not support it.
            </li>
            <li>
              <strong className="text-ink">Permissions</strong> - Saving may prompt again for write access if the browser revoked it.
            </li>
            <li>
              <strong className="text-ink">Side panel vs Settings</strong> - Quick capture and <strong className="text-ink">Export to Obsidian</strong> still live in the <strong className="text-ink">side panel</strong>. The Vault tab is for working directly on vault files in a full-page editor inside Settings.
            </li>
          </ul>
        </section>
      </article>
    </DocPage>
  );
}
