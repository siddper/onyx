# Markdown Editor (Obsidian Side Panel)

A Chrome/browser extension that adds a **side panel** markdown editor and exports notes directly to **Obsidian** via the `obsidian://` URI scheme. Built for the best Obsidian-integrated note-taking experience in the browser.

## Features

- **Side panel editor** – Write markdown next to any tab without leaving the page.
- **Live preview** – Renders headers, bold, italic, strikethrough, code, lists, blockquotes, tables, and **Obsidian-style wikilinks** `[[Page]]` / `[[Page|Label]]`.
- **Export to Obsidian** – One click sends the note to Obsidian with vault, folder, and title.
- **Context menu** – Right-click selected text: “Import selection to Editor” or “Import selection to Obsidian”.
- **Themes** – System, Light, Dark, OLED, and several built-in themes (Nord, Dracula, Tokyo Night, etc.) plus custom theme import (JSON).
- **Customization** – Fonts (interface, editor, code), caret shape/animation, corner radius, custom CSS for the side panel.
- **Keyboard shortcuts** – **Ctrl/Cmd+B** bold, **Ctrl/Cmd+I** italic, **Tab** for 4 spaces.

## Installation

1. Clone or download this repo.
2. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the `text-editor` folder.
3. Pin the extension and click the icon (or use the side panel) to open the editor.

## Usage

1. **Set vault name** in the toolbar (required for “Export to Obsidian”).
2. Optionally set **Folder in vault** and **Note title** (defaults to “Untitled” if empty).
3. Write markdown; preview updates as you type.
4. Click **Export to Obsidian** to create the note in Obsidian.  
   Very long notes may hit URL length limits; the extension shows a short warning if the link is very long.

**Context menu (right-click selection):**

- **Import selection to Editor** – Opens the side panel and fills it with the selection.
- **Import selection to Obsidian** – Creates a new note in Obsidian with the selection (uses Settings → Import into Obsidian for default note name and folder).

**Settings** (gear) – Themes, fonts, caret, preview toggle, custom CSS, **default vault/folder** (pre-fill in side panel when empty), and “Import into Obsidian” defaults. Word and character count appear in the Source and Preview pane headers.

## Obsidian compatibility

- Export uses `obsidian://new?vault=...&file=...&content=...` (with proper encoding).
- Preview supports **strikethrough** (`~~text~~`) and **wikilinks** (`[[Note]]`, `[[Note|Label]]`).
- Folder path uses forward slashes; trailing slash is normalized.

## Custom themes

See **CUSTOM-THEMES.md** and **example-theme-config.json** for the JSON format. Import via Settings → Themes → Import theme.

## License

Use and modify as you like.
