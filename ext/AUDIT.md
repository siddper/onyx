# Codebase audit: Onyx

Audit date: 2025-02-07 (full pass). Focus: bugs, security, and robustness.

---

## Executive summary

The codebase was audited end-to-end: **manifest**, **background.js**, **sidepanel** (HTML/JS/CSS), **options** (HTML/   JS/CSS), and **markdown.js**. Several bugs and robustness issues were fixed. No critical logic errors or race conditions were found in the main flows. Storage keys and async handling are consistent.

---

## Bugs fixed in this audit

### 1. **Preview link XSS (markdown.js)** — security

- **Issue:** Markdown links `[label](url)` were rendered as `<a href="url">` with no URL validation. A user could enter `[click](javascript:alert(1))` or `data:` URLs and execute script in the preview.
- **Fix:** Added `isSafeLinkUrl()` that allows only `http:`, `https:`, `mailto:`, `#`, or scheme-less relative URLs. Any other scheme (e.g. `javascript:`, `data:`, `vbscript:`) is replaced with `href="#"`. The href value is also passed through `escapeHtml()` when building the tag.

### 2. **Null-safety in options form (options.js)** — robustness

- **Issue:** `getSettingsFromForm()` accessed `.value` and `.checked` on elements without optional chaining. If any form element were missing (e.g. after HTML change or conditional section), the script would throw.
- **Fix:** All form field reads now use optional chaining and nullish coalescing with sensible defaults (e.g. `importObsidianNoteName?.value?.trim() ?? ""`, `caretStyleSelect?.value ?? "line"`). `previewToggle.addEventListener` is wrapped in `if (previewToggle)`. `applyFonts()` guards `customFontsEl` before setting `textContent`.

### 3. **setStatus when #status is missing (sidepanel.js)** — robustness

- **Issue:** `setStatus(message)` wrote to `status` (element with id `status`) and cleared it in a timeout. If the element were ever removed from the DOM, this would throw.
- **Fix:** Added `if (!status) return` at the start of `setStatus()` and `if (status)` before clearing in the timeout.

### 4. **Caret blink null-safety (sidepanel.js)** — previously fixed

- Already documented: `startCaretBlink()` / `stopCaretBlink()` guard on `editorFakeCaret` and blink timer callback.

### 5. **Very long Obsidian URLs (sidepanel.js)** — previously fixed

- Already documented: length check and user feedback before opening `obsidian://` URL.

---

## Areas reviewed — no bugs found

- **manifest.json:** MV3, permissions and commands are correct. No host permissions; storage/sidePanel/contextMenus/tabs are appropriate.
- **background.js:** `getActiveTab` returns `true` for async `sendResponse`; error paths and restricted URLs are handled. Context menu and action click handlers are correct. `chrome.runtime.sendMessage` for `toggleToolbar` is caught so no unhandled rejection when no listener is open.
- **Storage keys:** Side panel uses `obsidianSettings` (STORAGE_KEY) for vault/title/folder/content and `editorSettings` (EDITOR_SETTINGS_KEY) for theme, fonts, preview, etc. Options and background use `editorSettings` and `obsidianSettings` consistently.
- **Async flow:** `loadSettings()` → `loadEditorSettings()` → `applyPendingImport()` chain is sequential. Save is debounced; `flushSave()` is used before export. No obvious race conditions.
- **Context menu / vault dropdown:** Submenus and dropdown options are built with correct labels and event handlers. Cleanup (removeEventListener, element removal) is done on close.
- **Resizer:** Mousedown/move/up are added and removed correctly; layout and `saveEditorSettings` are in sync.
- **Custom CSS scope:** Regex for wrapping selectors with `CUSTOM_CSS_SCOPE` is applied consistently in side panel and in the storage listener; `@`-rules are left unchanged.
- **Theme parsing (options):** `parseCustomThemeConfig` validates `name`, `colorScheme`, and all required `THEME_VARS`; invalid config throws and is shown via `alert`. `slugify` and custom theme id generation are safe.
- **Markdown parser:** Aside from the link href fix, inline and block parsing use `escapeHtml` for user content. Wikilinks and code blocks are escaped. No other XSS vectors found.
- **Toolbar toggle:** Command fires from background; side panel listens and toggles `toolbar-hidden`. Layout (flex + `flex: 1` on `.editor-wrap`) correctly expands when toolbar is hidden.

---

## Code quality notes

- **Duplicate theme data:** `THEMES` and `THEME_VARS` exist in both `sidepanel.js` and `options.js`. Consider a shared module (e.g. `themes.js`) to avoid drift.
- **setStatus:** Currently unused after moving feedback onto buttons (Export, capture page). The function and `#status` element remain; safe to remove later if desired.
- **No CSP issues:** No `eval`, no remote script injection. Extension-only pages and side panel.
- **Accessibility:** Context menu and custom selects use roles and ARIA; focus and keyboard flow could be audited separately if needed.

---

## Suggested follow-ups (non-blocking)

1. **Tests:** Unit tests for `markdown.js` (links, wikilinks, escaping), `buildObsidianUrl`, `normalizeTitle`, and theme parsing would help prevent regressions.
2. **Single source for themes:** Extract theme definitions and helpers to a shared file used by side panel and options.
3. **Invalid theme import feedback:** Replace `alert()` for invalid theme config with an inline message near the import control (consistent with “feedback on trigger”).
4. **Draft persistence:** Optional auto-save of current note to storage so reopening the panel can restore the last draft.

---

## Summary

Audit is complete. Fixes were applied for: preview link XSS, options form null-safety, and setStatus robustness. No other bugs were found in the reviewed code paths. The extension is in good shape for continued development.
