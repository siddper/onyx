# Codebase audit: Markdown Editor (Obsidian)

Audit date: 2025-02-07. Focus: make this the best Obsidian-integrated note-taking browser extension.

---

## Bugs fixed in this audit

### 1. Null-safety in caret blink (sidepanel.js)

- **Issue:** `startCaretBlink()` and `stopCaretBlink()` used `editorFakeCaret` without checks. If the DOM wasn’t ready or the element was missing, these could throw.
- **Fix:** Added `if (!editorFakeCaret) return` at the start of `startCaretBlink()`, and `if (editorFakeCaret)` before using it in `stopCaretBlink()`. The blink timer callback also checks `editorFakeCaret` before updating opacity.

### 2. Very long Obsidian URLs

- **Issue:** `obsidian://new?content=...` puts the full note in the URL. Browsers and handlers often limit URL length (~2k–8k). Very long notes could fail to open with no feedback.
- **Fix:** Before opening the URL, the extension checks its length (e.g. > 1800 chars) and shows a short status message: “Note is very long; Obsidian may not open. Consider splitting.”

---

## Improvements made

### 1. Obsidian-style markdown in preview

- **Strikethrough:** `~~text~~` → `<del>`, with CSS in the preview. Matches common Markdown and Obsidian usage.
- **Wikilinks:** `[[Page]]` and `[[Page|Label]]` are rendered as styled spans (no external link); preview shows the label or page name. Keeps compatibility with Obsidian vaults.

### 2. Strikethrough shortcut

- **Ctrl/Cmd+Shift+S** wraps the selection (or inserts `~~|~~`) in the editor, consistent with bold/italic shortcuts.

### 3. Documentation

- **README.md** added: install, usage, features, Obsidian compatibility, custom themes pointer.
- **AUDIT.md** (this file): findings, fixes, and suggested features.

---

## Suggested new features (prioritized)

### High value (Obsidian-first)

1. **Default vault / folder from Settings**  
   Persist “last used” or “default” vault and folder in Options so the side panel can start with them pre-filled (and optionally hide or collapse the toolbar for a cleaner editor).

2. **Multiple vaults / quick switch**  
   Allow saving several vault names and picking one from a dropdown in the toolbar (still using one “default” for context-menu “Import to Obsidian”).

3. **“Append to existing note”**  
   Obsidian URI: support `obsidian://open?...` or append API if available, so users can send content to an existing note (e.g. “Reading” or “Inbox”) instead of only creating new ones.

4. **Frontmatter / YAML**  
   Optional template in Settings (e.g. `tags: [web-clip]\ndate: {{date}}`) prepended on export so Obsidian notes get consistent metadata.

5. **Copy as Markdown / Copy link to note**  
   Buttons to copy the current content (or an `obsidian://open?file=...` link) to the clipboard for pasting into Obsidian or other apps.

### Medium value (UX and polish)

6. **Word / character count**  
   Small live count in the toolbar or status area (useful for limits and readability).

7. **Scroll sync (source ↔ preview)**  
   Optional “scroll preview to match cursor” so long notes are easier to read while editing.

8. **Optional “minimal toolbar” mode**  
   Collapse vault/title/folder to one row or a single “Export” bar to maximize editor space; full settings in Options.

9. **Shortcuts for headings**  
   e.g. Ctrl/Cmd+Alt+1..6 to insert or wrap with `# `..`###### `.

10. **Highlights**  
    `==highlight==` in preview (and optionally in editor) for Obsidian-style highlights.

### Lower priority / technical

11. **Single source of truth for themes**  
    `THEMES` and theme logic are duplicated in `sidepanel.js` and `options.js`. Extract to a shared script (e.g. `themes.js`) loaded by both to avoid drift and simplify adding themes.

12. **Accessibility**  
    - Ensure “Export to Obsidian” and “Settings” have clear focus order and screen reader labels.  
    - Ensure context menu and custom selects are keyboard-navigable (arrow keys, Enter, Escape).

13. **Optional sync of “current note”**  
    Store the current buffer in `chrome.storage.local` with a short debounce so that reopening the panel restores the last note (with a “New” button to clear). Reduces accidental loss on close.

14. **Tests**  
    Add a small test suite (e.g. Jest or similar) for `markdown.js` (blocks, inlines, wikilinks, strikethrough) and for `buildObsidianUrl` / `normalizeTitle` so refactors don’t break Obsidian behavior.

---

## Code quality notes

- **Duplicate theme data:** `THEMES` and `THEME_VARS` in both sidepanel and options. Consider a shared module.
- **Storage keys:** `obsidianSettings` (vault/title/folder/content) vs `editorSettings` (theme, fonts, etc.). Naming is clear; document in README or a short ARCHITECTURE.md if the project grows.
- **Markdown parser:** Custom, small, and sufficient for the current feature set. For more Obsidian parity (e.g. callouts, highlights), either extend `markdown.js` or consider a small markdown library and keep the bundle size in check.
- **No Content Security Policy issues observed** in manifest or scripts; extension uses no `eval` or remote script injection.

---

## Summary

The extension is in good shape for an Obsidian-focused side-panel editor. This audit fixed two concrete bugs (caret null-safety, long-URL feedback), added Obsidian-friendly markdown (strikethrough, wikilinks) and a strikethrough shortcut, and documented suggested features and small tech-debt items. Implementing “Default vault/folder”, “Append to existing note”, and “Frontmatter template” would strengthen the “best Obsidian-integrated” experience the most.
