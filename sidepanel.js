const vaultInput = document.getElementById("vaultInput");
const titleInput = document.getElementById("titleInput");
const folderInput = document.getElementById("folderInput");
const markdownInput = document.getElementById("markdownInput");
const markdownPreview = document.getElementById("markdownPreview");
const exportBtn = document.getElementById("exportBtn");
const status = document.getElementById("status");
const settingsBtn = document.getElementById("settingsBtn");
const editorWrap = document.getElementById("editorWrap");
const customFontsEl = document.getElementById("customFonts");
const editorCaretWrap = document.querySelector(".editor-caret-wrap");
const editorCaretMirror = document.getElementById("editorCaretMirror");
const editorFakeCaret = document.getElementById("editorFakeCaret");

const EDITOR_SETTINGS_KEY = "editorSettings";
let caretStyle = "line";
let caretAnimation = "blink";
let caretMovement = "instant";
let caretBlinkTimer = null;
let caretVisible = true;

const FONT_PRESETS = [
  { id: "inter", label: "Inter", fontFamily: '"Inter", sans-serif' },
  { id: "jetbrains-mono", label: "JetBrains Mono", fontFamily: '"JetBrains Mono", monospace' },
  { id: "geist-mono", label: "Geist Mono", fontFamily: '"Geist Mono", monospace' }
];

const SAVE_DELAY_MS = 800;
let saveTimeout = null;

function scheduleSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    saveSettings();
  }, SAVE_DELAY_MS);
}

function flushSave() {
  clearTimeout(saveTimeout);
  saveTimeout = null;
  return saveSettings();
}

function updatePreview() {
  if (editorWrap.classList.contains("preview-hidden")) return;
  markdownPreview.innerHTML = typeof renderMarkdown === "function"
    ? renderMarkdown(markdownInput.value)
    : escapeHtml(markdownInput.value);
}
function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

const STORAGE_KEY = "obsidianSettings";

function setStatus(message) {
  status.textContent = message;
  if (!message) return;
  setTimeout(() => {
    status.textContent = "";
  }, 2500);
}

function normalizeTitle(title) {
  return title.trim() || "Untitled";
}

function encodeObsidianParam(value) {
  // Obsidian expects percent-encoding; "+" is treated literally.
  return encodeURIComponent(value);
}

function buildObsidianUrl({ vault, title, content, folder }) {
  // Use "file" for path (folder/note); Obsidian requires / encoded as %2F
  const filePath = folder ? `${folder.replace(/\/$/, "")}/${title}` : title;
  const params = [
    `vault=${encodeObsidianParam(vault)}`,
    `file=${encodeObsidianParam(filePath)}`,
    `content=${encodeObsidianParam(content)}`
  ];
  return `obsidian://new?${params.join("&")}`;
}

async function loadSettings() {
  const data = await chrome.storage.sync.get(STORAGE_KEY);
  const settings = data[STORAGE_KEY] || {};
  vaultInput.value = settings.vault || "";
  titleInput.value = settings.title || "";
  folderInput.value = settings.folder || "";
  markdownInput.value = settings.content || "";
}

function normalizeFontUrl(input) {
  const s = (input || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return `@import url("${s}");`;
  if (s.startsWith("@import")) return s;
  return `@import url("${s}");`;
}

function applyFonts(settings = {}) {
  const imports = [];
  if (settings.interfaceFont === "custom" && settings.interfaceFontUrl) imports.push(normalizeFontUrl(settings.interfaceFontUrl));
  if (settings.editorFont === "custom" && settings.editorFontUrl && settings.editorFontUrl !== settings.interfaceFontUrl) imports.push(normalizeFontUrl(settings.editorFontUrl));
  const codeUrl = settings.codeFontUrl?.trim();
  if (settings.codeFont === "custom" && codeUrl && codeUrl !== settings.interfaceFontUrl?.trim() && codeUrl !== settings.editorFontUrl?.trim()) imports.push(normalizeFontUrl(settings.codeFontUrl));
  if (customFontsEl) customFontsEl.textContent = imports.join("\n");

  const ifPreset = FONT_PRESETS.find((p) => p.id === (settings.interfaceFont || "inter"));
  const edPreset = FONT_PRESETS.find((p) => p.id === (settings.editorFont || "inter"));
  const codePreset = FONT_PRESETS.find((p) => p.id === (settings.codeFont || "jetbrains-mono"));
  const ifFamily = settings.interfaceFont === "custom" && settings.interfaceFontFamily ? settings.interfaceFontFamily : (ifPreset?.fontFamily ?? FONT_PRESETS[0].fontFamily);
  const edFamily = settings.editorFont === "custom" && settings.editorFontFamily ? settings.editorFontFamily : (edPreset?.fontFamily ?? FONT_PRESETS[0].fontFamily);
  const codeFamily = settings.codeFont === "custom" && settings.codeFontFamily ? settings.codeFontFamily : (codePreset?.fontFamily ?? FONT_PRESETS[1].fontFamily);
  document.documentElement.style.setProperty("--font-interface", ifFamily);
  document.documentElement.style.setProperty("--font-editor", edFamily);
  document.documentElement.style.setProperty("--font-code", codeFamily);
}

function applyCorners(settings) {
  const rounded = settings?.cornersRounded !== false;
  document.documentElement.classList.toggle("corners-sharp", !rounded);
}

async function loadEditorSettings() {
  const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const editorSettings = data[EDITOR_SETTINGS_KEY] || {};
  const previewEnabled = editorSettings.previewEnabled !== false;
  caretStyle = editorSettings.caretStyle || "line";
  caretAnimation = editorSettings.caretAnimation || "blink";
  caretMovement = editorSettings.caretMovement || "instant";
  if (editorFakeCaret) {
    editorFakeCaret.dataset.style = caretStyle;
    editorFakeCaret.dataset.animation = caretAnimation;
    editorFakeCaret.dataset.movement = caretMovement;
  }
  applyPreviewVisibility(previewEnabled);
  applyFonts(editorSettings);
  applyCorners(editorSettings);
}

function getCaretCoordinates() {
  if (!editorCaretMirror || !markdownInput) return null;
  const text = markdownInput.value;
  const pos = markdownInput.selectionEnd;
  const before = text.substring(0, pos);
  const after = text.substring(pos);
  const cs = getComputedStyle(markdownInput);
  editorCaretMirror.style.fontFamily = cs.fontFamily;
  editorCaretMirror.style.fontSize = cs.fontSize;
  editorCaretMirror.style.lineHeight = cs.lineHeight;
  const padL = parseFloat(cs.paddingLeft) || 0;
  const padT = parseFloat(cs.paddingTop) || 0;
  editorCaretMirror.style.width = (markdownInput.clientWidth - padL - (parseFloat(cs.paddingRight) || 0)) + "px";
  editorCaretMirror.style.padding = "0";
  editorCaretMirror.style.boxSizing = "border-box";
  editorCaretMirror.innerHTML = escapeHtml(before) + '<span data-caret-pos>\u200b</span><span data-char-width>M</span>' + escapeHtml(after);
  const span = editorCaretMirror.querySelector("[data-caret-pos]");
  const charSpan = editorCaretMirror.querySelector("[data-char-width]");
  if (!span) return null;
  const left = span.offsetLeft - markdownInput.scrollLeft + padL;
  const top = span.offsetTop - markdownInput.scrollTop + padT;
  const height = span.offsetHeight;
  const raw = charSpan ? charSpan.offsetLeft - span.offsetLeft : 8;
  const charWidth = Math.max(8, Math.round(raw * 1));
  return { left, top, height, bottom: top + height, charWidth };
}

function updateFakeCaret() {
  if (!editorFakeCaret || !editorCaretWrap) return;
  if (document.activeElement !== markdownInput) {
    editorFakeCaret.style.opacity = "0";
    return;
  }
  const coords = getCaretCoordinates();
  if (!coords) {
    editorFakeCaret.style.opacity = "0";
    return;
  }
  editorFakeCaret.style.left = coords.left + "px";
  if (caretStyle === "underline") {
    editorFakeCaret.style.width = (coords.charWidth ?? 8) + "px";
    editorFakeCaret.style.height = "2px";
    editorFakeCaret.style.top = coords.bottom - 2 + "px";
  } else if (caretStyle === "block") {
    editorFakeCaret.style.width = (coords.charWidth ?? 8) + "px";
    editorFakeCaret.style.top = coords.top + "px";
    editorFakeCaret.style.height = coords.height + "px";
  } else {
    editorFakeCaret.style.width = "2px";
    editorFakeCaret.style.top = coords.top + "px";
    editorFakeCaret.style.height = coords.height + "px";
  }
  if (caretAnimation === "blink") {
    editorFakeCaret.style.opacity = caretVisible ? "1" : "0";
  } else if (caretAnimation === "solid") {
    editorFakeCaret.style.opacity = "1";
  }
  /* phase / expand: opacity and animation from CSS */
}

function scheduleCaretUpdate() {
  requestAnimationFrame(() => {
    updateFakeCaret();
  });
}

function startCaretBlink() {
  if (caretAnimation === "blink") {
    if (caretBlinkTimer) return;
    caretVisible = true;
    editorFakeCaret.style.opacity = "1";
    caretBlinkTimer = setInterval(() => {
      caretVisible = !caretVisible;
      editorFakeCaret.style.opacity = caretVisible ? "1" : "0";
    }, 530);
  } else {
    caretVisible = true;
    if (caretAnimation === "solid") editorFakeCaret.style.opacity = "1";
    if (caretAnimation === "phase" || caretAnimation === "expand") {
      editorFakeCaret.style.animation = "";
      editorFakeCaret.style.opacity = "";
    }
  }
}

function stopCaretBlink() {
  if (caretBlinkTimer) {
    clearInterval(caretBlinkTimer);
    caretBlinkTimer = null;
  }
  editorFakeCaret.style.opacity = "0";
  editorFakeCaret.style.animation = "none";
}

function applyPreviewVisibility(enabled) {
  editorWrap.classList.toggle("preview-hidden", !enabled);
  if (enabled) updatePreview();
}

async function saveEditorSettings(partial) {
  const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const current = data[EDITOR_SETTINGS_KEY] || {};
  await chrome.storage.sync.set({ [EDITOR_SETTINGS_KEY]: { ...current, ...partial } });
}

const CONTEXT_MENU_CHECK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="context-menu-option__check"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>';

let contextMenuEl = null;

function closeContextMenu() {
  if (contextMenuEl) {
    contextMenuEl.remove();
    contextMenuEl = null;
  }
  document.removeEventListener("click", closeContextMenu);
  document.removeEventListener("scroll", closeContextMenu, true);
}

function showContextMenu(x, y) {
  closeContextMenu();

  const options = [
    {
      id: "preview",
      label: "Show preview",
      getChecked: () => !editorWrap.classList.contains("preview-hidden"),
      onToggle: async () => {
        const next = editorWrap.classList.contains("preview-hidden");
        await saveEditorSettings({ previewEnabled: next });
        applyPreviewVisibility(next);
      }
    }
  ];

  const container = document.createElement("div");
  container.className = "context-menu";
  container.setAttribute("role", "menu");

  options.forEach((opt) => {
    const row = document.createElement("div");
    row.className = "context-menu-option";
    row.setAttribute("role", "menuitemcheckbox");
    row.setAttribute("aria-checked", opt.getChecked());
    row.textContent = opt.label;

    if (opt.getChecked()) {
      const checkWrap = document.createElement("span");
      checkWrap.className = "context-menu-option__check";
      checkWrap.innerHTML = CONTEXT_MENU_CHECK_SVG;
      const svg = checkWrap.querySelector("svg");
      if (svg) {
        svg.style.width = "16px";
        svg.style.height = "16px";
        svg.style.fill = "currentColor";
      }
      row.appendChild(checkWrap);
    } else {
      const spacer = document.createElement("span");
      spacer.className = "context-menu-option__check";
      spacer.setAttribute("aria-hidden", "true");
      row.appendChild(spacer);
    }

    row.addEventListener("click", async (e) => {
      e.stopPropagation();
      await opt.onToggle();
      closeContextMenu();
    });

    container.appendChild(row);
  });

  document.body.appendChild(container);
  contextMenuEl = container;

  const rect = container.getBoundingClientRect();
  const pad = 8;
  let left = x;
  let top = y;
  if (left + rect.width > window.innerWidth - pad) left = window.innerWidth - rect.width - pad;
  if (top + rect.height > window.innerHeight - pad) top = window.innerHeight - rect.height - pad;
  if (left < pad) left = pad;
  if (top < pad) top = pad;
  container.style.left = left + "px";
  container.style.top = top + "px";

  setTimeout(() => {
    document.addEventListener("click", closeContextMenu);
    document.addEventListener("scroll", closeContextMenu, true);
  }, 0);
}

async function applyPendingImport() {
  const { pendingImportToEditor } = await chrome.storage.local.get("pendingImportToEditor");
  if (pendingImportToEditor != null && pendingImportToEditor !== "") {
    markdownInput.value = pendingImportToEditor;
    await chrome.storage.local.remove("pendingImportToEditor");
    updatePreview();
    scheduleSave();
  }
}

async function saveSettings(extra = {}) {
  const payload = {
    vault: vaultInput.value.trim(),
    title: titleInput.value.trim(),
    folder: folderInput.value.trim(),
    content: markdownInput.value,
    ...extra
  };
  await chrome.storage.sync.set({ [STORAGE_KEY]: payload });
}

[vaultInput, titleInput, folderInput].forEach((el) => {
  el.addEventListener("input", scheduleSave);
  el.addEventListener("change", scheduleSave);
});

exportBtn.addEventListener("click", async () => {
  const vault = vaultInput.value.trim();
  if (!vault) {
    setStatus("Enter a vault name first.");
    vaultInput.focus();
    return;
  }

  await flushSave();

  const title = normalizeTitle(titleInput.value);
  const folder = folderInput.value.trim();
  const content = markdownInput.value;
  const obsidianUrl = buildObsidianUrl({ vault, title, content, folder });
  chrome.tabs.create({ url: obsidianUrl });
});

settingsBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage?.() || chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes[EDITOR_SETTINGS_KEY]?.newValue) {
    const s = changes[EDITOR_SETTINGS_KEY].newValue;
    applyPreviewVisibility(s.previewEnabled !== false);
    applyFonts(s);
    applyCorners(s);
    if (editorFakeCaret) {
      if (s.caretStyle) {
        caretStyle = s.caretStyle;
        editorFakeCaret.dataset.style = caretStyle;
      }
      if (s.caretAnimation) {
        caretAnimation = s.caretAnimation;
        editorFakeCaret.dataset.animation = caretAnimation;
      }
      if (s.caretMovement) {
        caretMovement = s.caretMovement;
        editorFakeCaret.dataset.movement = caretMovement;
      }
      scheduleCaretUpdate();
    }
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) flushSave();
});

window.addEventListener("pagehide", () => {
  flushSave();
});

// Wrap selection with char (open before, close after). Same char both sides except () [] {}
const WRAP_CLOSE = { "`": "`", "*": "*", "(": ")", "{": "}", "[": "]", "~": "~" };
const WRAP_OPEN = { Backquote: "`" }; // some keyboards report ` as "Backquote"
const CLOSE_TO_OPEN = { "`": "`", "*": "*", ")": "(", "}": "{", "]": "[", "~": "~" };

// Use execCommand so edits participate in browser undo/redo (Cmd+Z / Ctrl+Z)
function editorInsert(replaceStart, replaceEnd, text, cursorStart, cursorEnd) {
  markdownInput.focus();
  markdownInput.setSelectionRange(replaceStart, replaceEnd);
  document.execCommand("insertText", false, text);
  markdownInput.setSelectionRange(cursorStart, cursorEnd ?? cursorStart);
  updatePreview();
  scheduleSave();
  scheduleCaretUpdate();
}

markdownInput.addEventListener("keydown", (e) => {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const hasSelection = start !== end;
  const value = markdownInput.value;
  const openChar = WRAP_OPEN[e.key] ?? e.key;
  const closeChar = WRAP_CLOSE[openChar] ?? WRAP_CLOSE[e.key];

  // Cmd+B / Ctrl+B: bold (**)
  if ((e.metaKey || e.ctrlKey) && e.key === "b") {
    e.preventDefault();
    const selected = value.slice(start, end);
    editorInsert(start, end, "**" + selected + "**", start + 2, start + 2 + selected.length);
    return;
  }

  // Cmd+I / Ctrl+I: italic (*)
  if ((e.metaKey || e.ctrlKey) && e.key === "i") {
    e.preventDefault();
    const selected = value.slice(start, end);
    editorInsert(start, end, "*" + selected + "*", start + 1, start + 1 + selected.length);
    return;
  }

  // Backspace: empty pair (open|close) -> delete both
  if (!hasSelection && e.key === "Backspace" && start > 0) {
    const charBefore = value[start - 1];
    const charAfter = value[start];
    const expectedClose = WRAP_CLOSE[charBefore];
    if (expectedClose !== undefined && charAfter === expectedClose) {
      e.preventDefault();
      editorInsert(start - 1, start + 1, "", start - 1, start - 1);
      return;
    }
  }

  // Delete: empty pair (open|close) -> delete both
  if (!hasSelection && e.key === "Delete" && start > 0 && start < value.length) {
    const charBefore = value[start - 1];
    const charAfter = value[start];
    const expectedOpen = CLOSE_TO_OPEN[charAfter];
    if (expectedOpen !== undefined && charBefore === expectedOpen) {
      e.preventDefault();
      editorInsert(start - 1, start + 1, "", start - 1, start - 1);
      return;
    }
  }

  if (hasSelection && closeChar) {
    e.preventDefault();
    const selected = value.slice(start, end);
    editorInsert(
      start,
      end,
      openChar + selected + closeChar,
      start + openChar.length,
      start + openChar.length + selected.length
    );
    return;
  }

  // No selection: insert pair and put cursor in between (* -> *|*, [ -> [|])
  if (!hasSelection && closeChar) {
    e.preventDefault();
    editorInsert(start, end, openChar + closeChar, start + openChar.length, start + openChar.length);
    return;
  }

  if (e.key === "Tab") {
    e.preventDefault();
    editorInsert(start, end, "    ", start + 4, start + 4);
  }
});

markdownInput.addEventListener("input", () => {
  updatePreview();
  scheduleSave();
  scheduleCaretUpdate();
});
markdownInput.addEventListener("click", scheduleCaretUpdate);
markdownInput.addEventListener("keydown", scheduleCaretUpdate);
markdownInput.addEventListener("keyup", scheduleCaretUpdate);
markdownInput.addEventListener("scroll", scheduleCaretUpdate);
markdownInput.addEventListener("focus", () => {
  startCaretBlink();
  scheduleCaretUpdate();
});
markdownInput.addEventListener("blur", () => {
  stopCaretBlink();
  if (editorFakeCaret) editorFakeCaret.style.opacity = "0";
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.pendingImportToEditor?.newValue != null) {
    markdownInput.value = changes.pendingImportToEditor.newValue;
    updatePreview();
    scheduleSave();
    chrome.storage.local.remove("pendingImportToEditor");
  }
});

const editorPane = document.querySelector(".editor-pane");
const previewPane = document.querySelector(".preview-pane");
[editorPane, previewPane].forEach((el) => {
  if (!el) return;
  el.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY);
  });
});

loadSettings()
  .then(() => loadEditorSettings())
  .then(() => {
    updatePreview();
    applyPendingImport();
    scheduleCaretUpdate();
  });
