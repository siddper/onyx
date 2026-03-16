const vaultInput = document.getElementById("vaultInput");
const vaultDropdownTrigger = document.getElementById("vaultDropdownTrigger");
const vaultDropdownList = document.getElementById("vaultDropdownList");
const titleInput = document.getElementById("titleInput");
const folderInput = document.getElementById("folderInput");
const markdownInput = document.getElementById("markdownInput");
const markdownPreview = document.getElementById("markdownPreview");
const exportBtn = document.getElementById("exportBtn");
const capturePageIconBtn = document.getElementById("capturePageIconBtn");
const status = document.getElementById("status");
const settingsBtn = document.getElementById("settingsBtn");
const editorWrap = document.getElementById("editorWrap");
const editorResizer = document.getElementById("editorResizer");
const customFontsEl = document.getElementById("customFonts");
const editorCaretWrap = document.querySelector(".editor-caret-wrap");
const editorCaretMirror = document.getElementById("editorCaretMirror");
const editorFakeCaret = document.getElementById("editorFakeCaret");
const sourceCount = document.getElementById("sourceCount");

const EDITOR_SETTINGS_KEY = "editorSettings";
const TOOLBAR_HIDDEN_KEY = "toolbarHidden";
const sidepanelUrlParams = new URLSearchParams(window.location.search);
const DISABLE_CUSTOM_CSS = sidepanelUrlParams.get("disableCustomCss") === "1";
const EMBEDDED_EDITOR_MODE = sidepanelUrlParams.get("editorMode") === "1";
let countDisplay = "both";
let syncScrollEnabled = false;
let syncScrollInProgress = false;
const CUSTOM_CSS_SCOPE = "body.custom-css-loaded.custom-css-scope ";
let caretStyle = "line";
let caretAnimation = "blink";
let caretMovement = "instant";
let editorFont = "inter";
let caretBlinkTimer = null;
let caretVisible = true;
let cachedSavedVaults = [];
let saveScrollPositionEnabled = true;
let scrollSaveTimer = null;
let currentThemeId = "system";
let cachedCustomThemes = {};

if (EMBEDDED_EDITOR_MODE) {
  document.body.classList.add("embedded-editor-mode");
}

const FONT_PRESETS = [
  { id: "inter", label: "Inter", fontFamily: '"Inter", sans-serif' },
  { id: "jetbrains-mono", label: "JetBrains Mono", fontFamily: '"JetBrains Mono", monospace' },
  { id: "geist-mono", label: "Geist Mono", fontFamily: '"Geist Mono", monospace' }
];

const THEME_VARS = ["--bg", "--panel", "--panel-strong", "--ink", "--muted", "--accent", "--accent-hover", "--overlay", "--shadow", "--shadow-modal"];

const THEMES = {
  system: null,
  light: {
    colorScheme: "light",
    vars: {
      "--bg": "#f2f3f5",
      "--panel": "#ffffff",
      "--panel-strong": "#eceef1",
      "--ink": "#1a1d21",
      "--muted": "#5f6368",
      "--accent": "#e2e4e8",
      "--accent-hover": "#d6d9de",
      "--overlay": "rgba(0, 0, 0, 0.2)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.1)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.12)"
    }
  },
  dark: {
    colorScheme: "dark",
    vars: {
      "--bg": "#0e0f10",
      "--panel": "#141618",
      "--panel-strong": "#1a1d20",
      "--ink": "#e8e8e8",
      "--muted": "#9aa0a6",
      "--accent": "#2a2f33",
      "--accent-hover": "#262a2e",
      "--overlay": "rgba(0, 0, 0, 0.5)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.4)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.4)"
    }
  },
  oled: {
    colorScheme: "dark",
    vars: {
      "--bg": "#000000",
      "--panel": "#0a0a0a",
      "--panel-strong": "#111111",
      "--ink": "#e8e8e8",
      "--muted": "#6b7280",
      "--accent": "#1c1c1e",
      "--accent-hover": "#2c2c2e",
      "--overlay": "rgba(0, 0, 0, 0.75)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.6)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.7)"
    }
  },
  cyberpunk: {
    colorScheme: "dark",
    vars: {
      "--bg": "#070611",
      "--panel": "#191622",
      "--panel-strong": "#21283d",
      "--ink": "#ffffff",
      "--muted": "#06d4c4",
      "--accent": "#ff43ec",
      "--accent-hover": "#d91ed9",
      "--overlay": "rgba(7, 6, 17, 0.92)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.55)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.7)"
    }
  },
  sepia: {
    colorScheme: "light",
    vars: {
      "--bg": "#f4f1ea",
      "--panel": "#faf8f3",
      "--panel-strong": "#ebe6dc",
      "--ink": "#2c2825",
      "--muted": "#6b5b4f",
      "--accent": "#ddd6c8",
      "--accent-hover": "#cfc7b8",
      "--overlay": "rgba(44, 40, 37, 0.25)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.08)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.12)"
    }
  },
  nord: {
    colorScheme: "dark",
    vars: {
      "--bg": "#2e3440",
      "--panel": "#3b4252",
      "--panel-strong": "#434c5e",
      "--ink": "#eceff4",
      "--muted": "#d8dee9",
      "--accent": "#4c566a",
      "--accent-hover": "#5e6779",
      "--overlay": "rgba(0, 0, 0, 0.45)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.35)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.45)"
    }
  },
  dracula: {
    colorScheme: "dark",
    vars: {
      "--bg": "#282a36",
      "--panel": "#21222c",
      "--panel-strong": "#44475a",
      "--ink": "#f8f8f2",
      "--muted": "#6272a4",
      "--accent": "#44475a",
      "--accent-hover": "#bd93f9",
      "--overlay": "rgba(40, 42, 54, 0.9)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.4)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.5)"
    }
  },
  "tokyo-night": {
    colorScheme: "dark",
    vars: {
      "--bg": "#1a1b26",
      "--panel": "#16161e",
      "--panel-strong": "#24283b",
      "--ink": "#a9b1d6",
      "--muted": "#565f89",
      "--accent": "#24283b",
      "--accent-hover": "#343b58",
      "--overlay": "rgba(26, 27, 38, 0.92)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.45)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.55)"
    }
  },
  blueberry: {
    colorScheme: "dark",
    vars: {
      "--bg": "#1e1d2a",
      "--panel": "#252436",
      "--panel-strong": "#2d2b42",
      "--ink": "#d8d6e8",
      "--muted": "#8b88a8",
      "--accent": "#3d3a5c",
      "--accent-hover": "#4a4669",
      "--overlay": "rgba(30, 29, 42, 0.92)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.4)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.5)"
    }
  },
  monokai: {
    colorScheme: "dark",
    vars: {
      "--bg": "#272822",
      "--panel": "#1e1f1c",
      "--panel-strong": "#3e3d32",
      "--ink": "#f8f8f2",
      "--muted": "#75715e",
      "--accent": "#3e3d32",
      "--accent-hover": "#504945",
      "--overlay": "rgba(39, 40, 34, 0.92)",
      "--shadow": "0 4px 20px rgba(0, 0, 0, 0.45)",
      "--shadow-modal": "0 8px 32px rgba(0, 0, 0, 0.55)"
    }
  }
};

function applyTheme(themeId, customThemes) {
  const root = document.documentElement;
  if (!themeId || themeId === "system") {
    THEME_VARS.forEach((v) => root.style.removeProperty(v));
    root.style.removeProperty("color-scheme");
    return;
  }
  if (themeId.startsWith("custom:")) {
    const id = themeId.slice(7);
    const theme = customThemes && customThemes[id];
    if (!theme) return;
    root.style.setProperty("color-scheme", theme.colorScheme);
    Object.entries(theme.vars).forEach(([key, value]) => root.style.setProperty(key, value));
    return;
  }
  const theme = THEMES[themeId];
  if (!theme) return;
  root.style.setProperty("color-scheme", theme.colorScheme);
  Object.entries(theme.vars).forEach(([key, value]) => root.style.setProperty(key, value));
}

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

function getWordCharCount(text) {
  const t = (text || "").trim();
  const words = t ? t.split(/\s+/).filter(Boolean).length : 0;
  const chars = (text || "").length;
  return { words, chars };
}

function updatePaneCounts() {
  if (!sourceCount) return;
  if (countDisplay === "none") {
    sourceCount.textContent = "";
    return;
  }
  const { words, chars } = getWordCharCount(markdownInput.value);
  let str = "";
  if (countDisplay === "both") str = words + " words · " + chars + " chars";
  else if (countDisplay === "words") str = words + " words";
  else if (countDisplay === "chars") str = chars + " chars";
  sourceCount.textContent = str;
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
  if (!status) return;
  status.textContent = message;
  if (!message) return;
  setTimeout(() => {
    if (status) status.textContent = "";
  }, 2500);
}

function normalizeTitle(title) {
  return title.trim() || "Untitled";
}

function encodeObsidianParam(value) {
  return encodeURIComponent(value);
}

function buildObsidianUrl({ vault, title, content, folder }) {
  const safeTitle = (title || "").replace(/[/\\:*?"<>|]/g, "-").trim() || "Untitled";
  const safeFolder = (folder || "").replace(/\/$/, "").replace(/\\/g, "/").trim();
  const filePath = safeFolder ? `${safeFolder}/${safeTitle}` : safeTitle;
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
  applyStoredNoteSettings(settings);
  const ed = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const s = ed[EDITOR_SETTINGS_KEY] || {};
  if (!vaultInput.value.trim() && s.defaultVault) vaultInput.value = (s.defaultVault || "").trim();
  if (!folderInput.value.trim() && s.defaultFolder != null) folderInput.value = (s.defaultFolder || "").trim();
  const savedVaults = Array.isArray(s.savedVaults) ? s.savedVaults : [];
  cachedSavedVaults = savedVaults;
  renderVaultDropdownList(savedVaults);
  updateVaultTriggerText();
}

function applyStoredNoteSettings(settings = {}) {
  const nextVault = settings.vault || "";
  const nextTitle = settings.title || "";
  const nextFolder = settings.folder || "";
  const nextContent = settings.content || "";

  if (vaultInput.value !== nextVault) vaultInput.value = nextVault;
  if (titleInput.value !== nextTitle) titleInput.value = nextTitle;
  if (folderInput.value !== nextFolder) folderInput.value = nextFolder;

  if (markdownInput.value !== nextContent) {
    const active = document.activeElement === markdownInput;
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    markdownInput.value = nextContent;
    if (active && typeof start === "number" && typeof end === "number") {
      markdownInput.setSelectionRange(
        Math.min(start, nextContent.length),
        Math.min(end, nextContent.length)
      );
    }
    scheduleCaretUpdate();
  }

  updateVaultTriggerText();
  updatePreview();
  updatePaneCounts();
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

async function loadEditorSettings() {
  const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const editorSettings = data[EDITOR_SETTINGS_KEY] || {};
  const sourceEnabled = editorSettings.sourceEnabled !== false;
  const previewEnabled = editorSettings.previewEnabled !== false;
  caretStyle = editorSettings.caretStyle || "line";
  caretAnimation = editorSettings.caretAnimation || "blink";
  caretMovement = editorSettings.caretMovement || "instant";
  editorFont = editorSettings.editorFont || "inter";
  countDisplay = editorSettings.countDisplay || "both";
  syncScrollEnabled = editorSettings.syncScroll === true;
  saveScrollPositionEnabled = editorSettings.saveScrollPosition !== false;
  document.body.classList.toggle("minimal-mode", editorSettings.minimalMode === true);
  document.body.classList.toggle("pane-headers-hidden", editorSettings.showPaneHeaders === false);
  if (editorFakeCaret) {
    editorFakeCaret.dataset.style = caretStyle;
    editorFakeCaret.dataset.animation = caretAnimation;
    editorFakeCaret.dataset.movement = caretMovement;
  }
  applyPaneVisibility({ sourceEnabled, previewEnabled });
  applyFonts(editorSettings);
  currentThemeId = editorSettings.theme || "system";
  cachedCustomThemes = editorSettings.customThemes || {};
  applyTheme(currentThemeId, cachedCustomThemes);
  const pct = editorSettings.sourceWidthPercent;
  if (typeof pct === "number" && pct >= 10 && pct <= 90 && editorWrap) {
    editorWrap.style.setProperty("--source-width", pct + "%");
  } else if (editorWrap) {
    editorWrap.style.removeProperty("--source-width");
  }
  const heightPct = editorSettings.sourceHeightPercent;
  if (typeof heightPct === "number" && heightPct >= 10 && heightPct <= 90 && editorWrap) {
    editorWrap.style.setProperty("--source-height", heightPct + "%");
  } else if (editorWrap) {
    editorWrap.style.removeProperty("--source-height");
  }
  const radiusPx = editorSettings.radiusPx;
  if (typeof radiusPx === "number" && radiusPx >= 0 && radiusPx <= 24) {
    document.documentElement.style.setProperty("--radius", radiusPx + "px");
  } else {
    document.documentElement.style.setProperty("--radius", "8px");
  }
  const lineHeight = typeof editorSettings.lineHeight === "number" ? editorSettings.lineHeight : 1.6;
  if (lineHeight >= 1.1 && lineHeight <= 2.2) {
    document.documentElement.style.setProperty("--line-height", String(lineHeight));
  } else {
    document.documentElement.style.setProperty("--line-height", "1.6");
  }
  const fontSize = typeof editorSettings.fontSize === "number" ? editorSettings.fontSize : 13;
  if (fontSize >= 10 && fontSize <= 22) {
    document.documentElement.style.setProperty("--font-size", fontSize + "px");
  } else {
    document.documentElement.style.setProperty("--font-size", "13px");
  }
  const rawCss = !DISABLE_CUSTOM_CSS && typeof editorSettings.customCss === "string" ? editorSettings.customCss : "";
  if (rawCss) {
    document.body.classList.add("custom-css-loaded", "custom-css-scope");
    const wrapped = rawCss.replace(/([^{]+)\{/g, (_, selectors) => {
      const s = selectors.trimStart();
      if (s.startsWith("@")) return selectors + "{";
      const prefixed = s.split(",").map((sel) => CUSTOM_CSS_SCOPE + sel.trim()).join(", ");
      return prefixed + " {";
    });
    let customCssEl = document.getElementById("customCss");
    if (!customCssEl) {
      customCssEl = document.createElement("style");
      customCssEl.id = "customCss";
      document.body.appendChild(customCssEl);
    }
    customCssEl.textContent = wrapped;
  } else {
    document.body.classList.remove("custom-css-loaded", "custom-css-scope");
    const customCssEl = document.getElementById("customCss");
    if (customCssEl) customCssEl.textContent = "";
  }

  if (saveScrollPositionEnabled) {
    const sourceTop = typeof editorSettings.sourceScrollTop === "number" ? editorSettings.sourceScrollTop : 0;
    const previewTop = typeof editorSettings.previewScrollTop === "number" ? editorSettings.previewScrollTop : 0;
    requestAnimationFrame(() => {
      if (markdownInput) markdownInput.scrollTop = sourceTop;
      if (markdownPreview) markdownPreview.scrollTop = previewTop;
    });
  }
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
}

function scheduleCaretUpdate() {
  requestAnimationFrame(() => {
    updateFakeCaret();
  });
}

function scheduleScrollPositionSave() {
  if (!saveScrollPositionEnabled) return;
  clearTimeout(scrollSaveTimer);
  scrollSaveTimer = setTimeout(() => {
    scrollSaveTimer = null;
    saveEditorSettings({
      sourceScrollTop: markdownInput ? markdownInput.scrollTop : 0,
      previewScrollTop: markdownPreview ? markdownPreview.scrollTop : 0
    });
  }, 200);
}

function startCaretBlink() {
  if (!editorFakeCaret) return;
  if (caretAnimation === "blink") {
    if (caretBlinkTimer) return;
    caretVisible = true;
    editorFakeCaret.style.opacity = "1";
    caretBlinkTimer = setInterval(() => {
      caretVisible = !caretVisible;
      if (editorFakeCaret) editorFakeCaret.style.opacity = caretVisible ? "1" : "0";
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
  if (editorFakeCaret) {
    editorFakeCaret.style.opacity = "0";
    editorFakeCaret.style.animation = "none";
  }
}

function normalizePaneVisibility(sourceEnabled, previewEnabled) {
  const source = sourceEnabled !== false;
  const preview = previewEnabled !== false;
  if (!source && !preview) return { sourceEnabled: true, previewEnabled: false };
  return { sourceEnabled: source, previewEnabled: preview };
}

function getPaneVisibility() {
  return {
    sourceEnabled: !editorWrap.classList.contains("source-hidden"),
    previewEnabled: !editorWrap.classList.contains("preview-hidden")
  };
}

function applyPaneVisibility({ sourceEnabled, previewEnabled }) {
  const resolved = normalizePaneVisibility(sourceEnabled, previewEnabled);
  editorWrap.classList.toggle("source-hidden", !resolved.sourceEnabled);
  editorWrap.classList.toggle("preview-hidden", !resolved.previewEnabled);
  if (resolved.previewEnabled) updatePreview();
}

async function savePaneVisibility({ sourceEnabled, previewEnabled }) {
  const resolved = normalizePaneVisibility(sourceEnabled, previewEnabled);
  await saveEditorSettings(resolved);
  applyPaneVisibility(resolved);
}

async function saveEditorSettings(partial) {
  const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const current = data[EDITOR_SETTINGS_KEY] || {};
  await chrome.storage.sync.set({ [EDITOR_SETTINGS_KEY]: { ...current, ...partial } });
}

const CONTEXT_MENU_CHECK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="context-menu-option__check"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>';

const CONTEXT_MENU_ARROW_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="context-menu-option__arrow"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>';

let contextMenuEl = null;
let contextSubmenuEl = null;
let contextSubmenuCloseTimer = null;

function hideSubmenu() {
  if (contextSubmenuCloseTimer) {
    clearTimeout(contextSubmenuCloseTimer);
    contextSubmenuCloseTimer = null;
  }
  if (contextSubmenuEl) {
    contextSubmenuEl.remove();
    contextSubmenuEl = null;
  }
}

function closeContextMenu() {
  hideSubmenu();
  if (contextMenuEl) {
    contextMenuEl.remove();
    contextMenuEl = null;
  }
  document.removeEventListener("click", closeContextMenu);
  document.removeEventListener("scroll", closeContextMenu, true);
}

function showContextMenu(x, y) {
  closeContextMenu();
  const paneVisibility = getPaneVisibility();
  const sourceOnly = paneVisibility.sourceEnabled && !paneVisibility.previewEnabled;
  const previewOnly = !paneVisibility.sourceEnabled && paneVisibility.previewEnabled;

  const caretSubmenu = [
    { id: "line", label: "Line", getChecked: () => caretStyle === "line", value: "line" },
    { id: "block", label: "Block", getChecked: () => caretStyle === "block", value: "block" },
    { id: "underline", label: "Underline", getChecked: () => caretStyle === "underline", value: "underline" }
  ];

  const caretAnimationSubmenu = [
    { id: "solid", label: "Solid", getChecked: () => caretAnimation === "solid", value: "solid" },
    { id: "blink", label: "Blink", getChecked: () => caretAnimation === "blink", value: "blink" },
    { id: "phase", label: "Phase", getChecked: () => caretAnimation === "phase", value: "phase" },
    { id: "expand", label: "Expand", getChecked: () => caretAnimation === "expand", value: "expand" }
  ];

  const caretMovementSubmenu = [
    { id: "instant", label: "Instant", getChecked: () => caretMovement === "instant", value: "instant" },
    { id: "smooth", label: "Smooth", getChecked: () => caretMovement === "smooth", value: "smooth" }
  ];

  const themeSubmenu = [
    { id: "system", label: "System", getChecked: () => currentThemeId === "system", value: "system" },
    { id: "light", label: "Light", getChecked: () => currentThemeId === "light", value: "light" },
    { id: "dark", label: "Dark", getChecked: () => currentThemeId === "dark", value: "dark" },
    { id: "oled", label: "OLED", getChecked: () => currentThemeId === "oled", value: "oled" },
    { id: "cyberpunk", label: "Cyberpunk", getChecked: () => currentThemeId === "cyberpunk", value: "cyberpunk" },
    { id: "sepia", label: "Sepia", getChecked: () => currentThemeId === "sepia", value: "sepia" },
    { id: "nord", label: "Nord", getChecked: () => currentThemeId === "nord", value: "nord" },
    { id: "dracula", label: "Dracula", getChecked: () => currentThemeId === "dracula", value: "dracula" },
    { id: "tokyo-night", label: "Tokyo Night", getChecked: () => currentThemeId === "tokyo-night", value: "tokyo-night" },
    { id: "blueberry", label: "Blueberry", getChecked: () => currentThemeId === "blueberry", value: "blueberry" },
    { id: "monokai", label: "Monokai", getChecked: () => currentThemeId === "monokai", value: "monokai" }
  ];
  if (cachedCustomThemes && typeof cachedCustomThemes === "object") {
    Object.entries(cachedCustomThemes).forEach(([id, t]) => {
      themeSubmenu.push({
        id: `custom:${id}`,
        label: t.name || id,
        getChecked: () => currentThemeId === `custom:${id}`,
        value: `custom:${id}`
      });
    });
  }

  const fontSubmenu = [
    { id: "inter", label: "Inter", getChecked: () => editorFont === "inter", value: "inter" },
    { id: "jetbrains-mono", label: "JetBrains Mono", getChecked: () => editorFont === "jetbrains-mono", value: "jetbrains-mono" },
    { id: "geist-mono", label: "Geist Mono", getChecked: () => editorFont === "geist-mono", value: "geist-mono" },
    { id: "custom", label: "Custom", getChecked: () => editorFont === "custom", value: "custom" }
  ];

  const options = [];

  if (!sourceOnly) {
    options.push({
      id: "source",
      label: "Show source",
      getChecked: () => !editorWrap.classList.contains("source-hidden"),
      onToggle: async () => {
        const current = getPaneVisibility();
        await savePaneVisibility({
          sourceEnabled: !current.sourceEnabled,
          previewEnabled: current.previewEnabled
        });
      }
    });
  }

  if (!previewOnly) {
    options.push({
      id: "preview",
      label: "Show preview",
      getChecked: () => !editorWrap.classList.contains("preview-hidden"),
      onToggle: async () => {
        const current = getPaneVisibility();
        await savePaneVisibility({
          sourceEnabled: current.sourceEnabled,
          previewEnabled: !current.previewEnabled
        });
      }
    });
  }

  options.push({
    id: "pane-headers",
    label: "Show headers",
    getChecked: () => !document.body.classList.contains("pane-headers-hidden"),
    onToggle: async () => {
      const next = document.body.classList.contains("pane-headers-hidden");
      document.body.classList.toggle("pane-headers-hidden", !next);
      await saveEditorSettings({ showPaneHeaders: next });
    }
  });
  options.push({
    id: "toolbar",
    label: "Show toolbar",
    getChecked: () => !document.body.classList.contains("toolbar-hidden"),
    onToggle: async () => {
      const nextHidden = document.body.classList.contains("toolbar-hidden");
      setToolbarVisibility(!nextHidden);
      saveToolbarVisibilityPreference(!nextHidden);
    }
  });

  options.push(
    {
      id: "theme",
      label: "Theme",
      submenu: themeSubmenu,
      onSelectItem: async (item) => {
        currentThemeId = item.value;
        await saveEditorSettings({ theme: item.value });
        applyTheme(item.value, cachedCustomThemes);
      }
    },
    {
      id: "caret-shape",
      label: "Caret shape",
      submenu: caretSubmenu,
      onSelectItem: async (item) => {
        await saveEditorSettings({ caretStyle: item.value });
        caretStyle = item.value;
        if (editorFakeCaret) editorFakeCaret.dataset.style = caretStyle;
        scheduleCaretUpdate();
      }
    },
    {
      id: "caret-animation",
      label: "Caret animation",
      submenu: caretAnimationSubmenu,
      onSelectItem: async (item) => {
        await saveEditorSettings({ caretAnimation: item.value });
        caretAnimation = item.value;
        if (editorFakeCaret) editorFakeCaret.dataset.animation = caretAnimation;
      }
    },
    {
      id: "caret-movement",
      label: "Caret movement",
      submenu: caretMovementSubmenu,
      onSelectItem: async (item) => {
        await saveEditorSettings({ caretMovement: item.value });
        caretMovement = item.value;
        if (editorFakeCaret) editorFakeCaret.dataset.movement = caretMovement;
      }
    },
    {
      id: "font",
      label: "Font",
      submenu: fontSubmenu,
      onSelectItem: async (item) => {
        if (item.value === "custom") {
          await saveEditorSettings({ editorFont: "custom" });
          closeContextMenu();
          chrome.tabs.create({ url: chrome.runtime.getURL("options.html#section-fonts") });
        } else {
          await saveEditorSettings({ editorFont: item.value });
          editorFont = item.value;
          closeContextMenu();
        }
      }
    }
  );

  options.push({
    id: "open-settings",
    label: "Open settings",
    getChecked: () => false,
    onToggle: async () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    }
  });

  function appendCheckOrSpacer(row, checked) {
    if (checked) {
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
  }

  function showSubmenuAt(rowEl, opt) {
    if (contextSubmenuCloseTimer) {
      clearTimeout(contextSubmenuCloseTimer);
      contextSubmenuCloseTimer = null;
    }
    hideSubmenu();
    const submenu = document.createElement("div");
    submenu.className = "context-menu-submenu";
    submenu.setAttribute("role", "menu");

    opt.submenu.forEach((item) => {
      const subRow = document.createElement("div");
      subRow.className = "context-menu-option";
      subRow.setAttribute("role", "menuitemradio");
      subRow.setAttribute("aria-checked", item.getChecked());
      subRow.textContent = item.label;
      appendCheckOrSpacer(subRow, item.getChecked());

      subRow.addEventListener("click", async (e) => {
        e.stopPropagation();
        await opt.onSelectItem(item);
        closeContextMenu();
      });

      subRow.addEventListener("mouseenter", () => {
        if (contextSubmenuCloseTimer) {
          clearTimeout(contextSubmenuCloseTimer);
          contextSubmenuCloseTimer = null;
        }
      });
      subRow.addEventListener("mouseleave", () => {
        contextSubmenuCloseTimer = setTimeout(hideSubmenu, 150);
      });

      submenu.appendChild(subRow);
    });

    document.body.appendChild(submenu);
    contextSubmenuEl = submenu;

    submenu.addEventListener("mouseenter", () => {
      if (contextSubmenuCloseTimer) {
        clearTimeout(contextSubmenuCloseTimer);
        contextSubmenuCloseTimer = null;
      }
    });
    submenu.addEventListener("mouseleave", () => {
      contextSubmenuCloseTimer = setTimeout(hideSubmenu, 150);
    });

    const rowRect = rowEl.getBoundingClientRect();
    const subRect = submenu.getBoundingClientRect();
    const pad = 8;
    let left = rowRect.right + 4;
    let top = rowRect.top;
    if (left + subRect.width > window.innerWidth - pad) left = Math.max(pad, window.innerWidth - subRect.width - pad);
    if (top + subRect.height > window.innerHeight - pad) top = window.innerHeight - subRect.height - pad;
    if (top < pad) top = pad;
    submenu.style.left = left + "px";
    submenu.style.top = top + "px";
  }

  const container = document.createElement("div");
  container.className = "context-menu";
  container.setAttribute("role", "menu");

  options.forEach((opt) => {
    const row = document.createElement("div");
    row.className = "context-menu-option";
    if (opt.submenu) row.classList.add("context-menu-option--submenu-trigger");
    row.setAttribute("role", opt.submenu ? "menuitem" : "menuitemcheckbox");
    if (!opt.submenu) row.setAttribute("aria-checked", opt.getChecked());
    row.textContent = opt.label;

    if (opt.submenu) {
      const arrowWrap = document.createElement("span");
      arrowWrap.className = "context-menu-option__arrow";
      arrowWrap.innerHTML = CONTEXT_MENU_ARROW_SVG;
      const svg = arrowWrap.querySelector("svg");
      if (svg) {
        svg.style.width = "16px";
        svg.style.height = "16px";
        svg.style.fill = "currentColor";
      }
      row.appendChild(arrowWrap);

      row.addEventListener("mouseenter", () => showSubmenuAt(row, opt));
      row.addEventListener("mouseleave", () => {
        contextSubmenuCloseTimer = setTimeout(hideSubmenu, 150);
      });
    } else {
      appendCheckOrSpacer(row, opt.getChecked());
      row.addEventListener("click", async (e) => {
        e.stopPropagation();
        await opt.onToggle();
        closeContextMenu();
      });
    }

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

function updateVaultTriggerText() {
  if (vaultDropdownTrigger) {
    const v = (vaultInput && vaultInput.value || "").trim();
    vaultDropdownTrigger.textContent = v || "MyVault";
  }
}

function renderVaultDropdownList(savedVaults) {
  if (!vaultDropdownList) return;
  vaultDropdownList.innerHTML = "";
  const currentVault = (vaultInput && vaultInput.value || "").trim();
  (savedVaults || []).forEach((name) => {
    const opt = document.createElement("button");
    opt.type = "button";
    opt.className = "vault-dropdown-option";
    opt.role = "option";
    opt.setAttribute("aria-selected", currentVault === name);
    const label = document.createElement("span");
    label.textContent = name;
    label.style.flex = "1";
    label.style.minWidth = "0";
    label.style.textAlign = "left";
    opt.appendChild(label);
    const checkSlot = document.createElement("span");
    checkSlot.className = "vault-dropdown-option__check";
    checkSlot.setAttribute("aria-hidden", "true");
    if (currentVault === name) {
      checkSlot.innerHTML = CONTEXT_MENU_CHECK_SVG;
      const svg = checkSlot.querySelector("svg");
      if (svg) {
        svg.style.width = "16px";
        svg.style.height = "16px";
        svg.style.fill = "currentColor";
      }
    }
    opt.appendChild(checkSlot);
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      if (vaultInput) vaultInput.value = name;
      updateVaultTriggerText();
      closeVaultDropdown();
      scheduleSave();
    });
    vaultDropdownList.appendChild(opt);
  });
  const addOpt = document.createElement("button");
  addOpt.type = "button";
  addOpt.className = "vault-dropdown-option vault-dropdown-option--add";
  addOpt.role = "option";
  addOpt.textContent = "Manage vaults";
  addOpt.addEventListener("click", (e) => {
    e.stopPropagation();
    closeVaultDropdown();
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html#section-saved-vaults") });
  });
  vaultDropdownList.appendChild(addOpt);
}

function closeVaultDropdown() {
  if (vaultDropdownList) vaultDropdownList.hidden = true;
  if (vaultDropdownTrigger) vaultDropdownTrigger.setAttribute("aria-expanded", "false");
  document.removeEventListener("click", closeVaultDropdown);
}

function openVaultDropdown() {
  if (!vaultDropdownList) return;
  renderVaultDropdownList(cachedSavedVaults);
  vaultDropdownList.hidden = false;
  if (vaultDropdownTrigger) vaultDropdownTrigger.setAttribute("aria-expanded", "true");
  setTimeout(() => document.addEventListener("click", closeVaultDropdown), 0);
}

if (vaultDropdownTrigger && vaultDropdownList) {
  vaultDropdownTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = vaultDropdownList.hidden === false;
    if (isOpen) closeVaultDropdown();
    else openVaultDropdown();
  });
  vaultDropdownList.addEventListener("click", (e) => e.stopPropagation());
}

function setToolbarVisibility(hidden) {
  document.body.classList.toggle("toolbar-hidden", hidden === true);
}

function saveToolbarVisibilityPreference(hidden) {
  try {
    localStorage.setItem(TOOLBAR_HIDDEN_KEY, hidden ? "true" : "false");
  } catch (_) {}
}

function loadToolbarVisibilityPreference() {
  try {
    setToolbarVisibility(localStorage.getItem(TOOLBAR_HIDDEN_KEY) === "true");
  } catch (_) {}
}

function toggleToolbarVisibility() {
  const nextHidden = !document.body.classList.contains("toolbar-hidden");
  setToolbarVisibility(nextHidden);
  saveToolbarVisibilityPreference(nextHidden);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.action === "toggleToolbar") toggleToolbarVisibility();
});

[vaultInput, titleInput, folderInput].forEach((el) => {
  if (!el) return;
  el.addEventListener("input", scheduleSave);
  el.addEventListener("change", scheduleSave);
});

const OBSIDIAN_URL_LENGTH_WARN = 1800;

function applyExportTemplate(template, { title, date, time }) {
  if (!template || typeof template !== "string") return "";
  return template
    .replace(/\{\{title\}\}/g, title)
    .replace(/\{\{date\}\}/g, date)
    .replace(/\{\{time\}\}/g, time);
}

const EXPORT_BTN_LABEL = "Export to Obsidian";
const CAPTURE_PAGE_BTN_LABEL = "Use current page title and add link";
const FEEDBACK_RESET_MS = 2500;
const CAPTURE_PAGE_ERROR_FLASH_MS = 1800;

function showFeedbackOnButton(btn, message, restoreLabel) {
  if (!btn) return;
  if (btn === capturePageIconBtn) {
    btn.setAttribute("aria-label", message);
    btn.setAttribute("title", message);
    btn.classList.add("toolbar-title-icon--error");
    setTimeout(() => btn.classList.remove("toolbar-title-icon--error"), CAPTURE_PAGE_ERROR_FLASH_MS);
  } else {
    btn.textContent = message;
  }
  setTimeout(() => {
    if (btn === capturePageIconBtn) {
      btn.setAttribute("aria-label", restoreLabel);
      btn.setAttribute("title", restoreLabel);
    } else {
      btn.textContent = restoreLabel;
    }
  }, FEEDBACK_RESET_MS);
}

exportBtn.addEventListener("click", async () => {
  const vault = vaultInput.value.trim();
  if (!vault) {
    showFeedbackOnButton(exportBtn, "Enter vault first", EXPORT_BTN_LABEL);
    if (vaultDropdownTrigger) vaultDropdownTrigger.focus();
    return;
  }

  await flushSave();

  const title = normalizeTitle(titleInput.value);
  const folder = folderInput.value.trim();
  const body = markdownInput.value;

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5);

  const ed = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const exportTemplate = (ed[EDITOR_SETTINGS_KEY] || {}).exportTemplate || "";
  const templateBlock = exportTemplate
    ? applyExportTemplate(exportTemplate, { title, date: dateStr, time: timeStr }) + "\n\n"
    : "";
  const content = templateBlock + body;

  const obsidianUrl = buildObsidianUrl({ vault, title, content, folder });
  if (obsidianUrl.length > OBSIDIAN_URL_LENGTH_WARN) {
    showFeedbackOnButton(exportBtn, "Note very long – check Obsidian", EXPORT_BTN_LABEL);
  }
  chrome.tabs.create({ url: obsidianUrl });
});

function escapeMarkdownLinkText(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/\]/g, "\\]");
}

if (capturePageIconBtn) {
  capturePageIconBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "getActiveTab" }, (response) => {
      if (chrome.runtime.lastError) {
        showFeedbackOnButton(capturePageIconBtn, "Can't access this page", CAPTURE_PAGE_BTN_LABEL);
        return;
      }
      if (response?.error || !response?.url) {
        showFeedbackOnButton(capturePageIconBtn, response?.error === "Can't access this page" ? response.error : "Can't access this page", CAPTURE_PAGE_BTN_LABEL);
        return;
      }
      const { title, url } = response;
      const pageTitle = (title || url).trim() || url;
      titleInput.value = pageTitle;
      scheduleSave();
      const safeTitle = escapeMarkdownLinkText(pageTitle);
      const link = "[" + safeTitle + "](" + url + ")";
      const start = markdownInput.selectionStart;
      const end = markdownInput.selectionEnd;
      const prefix = start > 0 && !markdownInput.value[start - 1].match(/\s/) ? "\n" : start > 0 ? "" : "";
      const insertText = prefix + link + "\n\n";
      const newCursor = start + insertText.length;
      editorInsert(start, end, insertText, newCursor, newCursor);
    });
  });
}

settingsBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes[STORAGE_KEY]?.newValue) {
    applyStoredNoteSettings(changes[STORAGE_KEY].newValue || {});
  }
  if (area === "sync" && changes[EDITOR_SETTINGS_KEY]?.newValue) {
    const s = changes[EDITOR_SETTINGS_KEY].newValue;
    if (s.sourceEnabled !== undefined || s.previewEnabled !== undefined) {
      const current = getPaneVisibility();
      applyPaneVisibility({
        sourceEnabled: s.sourceEnabled !== undefined ? s.sourceEnabled : current.sourceEnabled,
        previewEnabled: s.previewEnabled !== undefined ? s.previewEnabled : current.previewEnabled
      });
    }
    applyFonts(s);
    currentThemeId = s.theme || "system";
    cachedCustomThemes = s.customThemes || {};
    applyTheme(currentThemeId, cachedCustomThemes);
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
      if (s.editorFont) editorFont = s.editorFont;
      scheduleCaretUpdate();
    }
    if (s.countDisplay) {
      countDisplay = s.countDisplay;
      updatePaneCounts();
    }
    if (s.syncScroll !== undefined) syncScrollEnabled = s.syncScroll === true;
    if (s.saveScrollPosition !== undefined) saveScrollPositionEnabled = s.saveScrollPosition !== false;
    if (s.minimalMode !== undefined) document.body.classList.toggle("minimal-mode", s.minimalMode === true);
    if (s.showPaneHeaders !== undefined) document.body.classList.toggle("pane-headers-hidden", s.showPaneHeaders === false);
    if (saveScrollPositionEnabled && (s.sourceScrollTop !== undefined || s.previewScrollTop !== undefined)) {
      if (typeof s.sourceScrollTop === "number" && markdownInput) markdownInput.scrollTop = s.sourceScrollTop;
      if (typeof s.previewScrollTop === "number" && markdownPreview) markdownPreview.scrollTop = s.previewScrollTop;
    }
    if (s.savedVaults !== undefined) {
      cachedSavedVaults = Array.isArray(s.savedVaults) ? s.savedVaults : [];
      renderVaultDropdownList(cachedSavedVaults);
    }
    if (editorWrap && !editorWrap.classList.contains("preview-hidden")) {
      if (typeof s.sourceWidthPercent === "number" && !isStackedLayout()) {
        const pct = Math.max(SOURCE_WIDTH_MIN, Math.min(SOURCE_WIDTH_MAX, s.sourceWidthPercent));
        editorWrap.style.setProperty("--source-width", pct + "%");
      }
      if (typeof s.sourceHeightPercent === "number" && isStackedLayout()) {
        const pct = Math.max(SOURCE_HEIGHT_MIN, Math.min(SOURCE_HEIGHT_MAX, s.sourceHeightPercent));
        editorWrap.style.setProperty("--source-height", pct + "%");
      }
    }
    if (typeof s.radiusPx === "number" && s.radiusPx >= 0 && s.radiusPx <= 24) {
      document.documentElement.style.setProperty("--radius", s.radiusPx + "px");
    } else {
      document.documentElement.style.setProperty("--radius", "8px");
    }
    if (typeof s.lineHeight === "number" && s.lineHeight >= 1.1 && s.lineHeight <= 2.2) {
      document.documentElement.style.setProperty("--line-height", String(s.lineHeight));
    } else if (s.lineHeight !== undefined) {
      document.documentElement.style.setProperty("--line-height", "1.6");
    }
    if (typeof s.fontSize === "number" && s.fontSize >= 10 && s.fontSize <= 22) {
      document.documentElement.style.setProperty("--font-size", s.fontSize + "px");
    } else if (s.fontSize !== undefined) {
      document.documentElement.style.setProperty("--font-size", "13px");
    }
    const rawCss = !DISABLE_CUSTOM_CSS && typeof s.customCss === "string" ? s.customCss : "";
    if (rawCss) {
      document.body.classList.add("custom-css-loaded", "custom-css-scope");
      const wrapped = rawCss.replace(/([^{]+)\{/g, (_, selectors) => {
        const s = selectors.trimStart();
        if (s.startsWith("@")) return selectors + "{";
        const prefixed = s.split(",").map((sel) => CUSTOM_CSS_SCOPE + sel.trim()).join(", ");
        return prefixed + " {";
      });
      let customCssEl = document.getElementById("customCss");
      if (!customCssEl) {
        customCssEl = document.createElement("style");
        customCssEl.id = "customCss";
        document.body.appendChild(customCssEl);
      }
      customCssEl.textContent = wrapped;
    } else {
      document.body.classList.remove("custom-css-loaded", "custom-css-scope");
      const customCssEl = document.getElementById("customCss");
      if (customCssEl) customCssEl.textContent = "";
    }
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    flushSave();
    scheduleScrollPositionSave();
  }
});

window.addEventListener("pagehide", () => {
  flushSave();
  scheduleScrollPositionSave();
});

const WRAP_CLOSE = { "`": "`", "*": "*", "(": ")", "{": "}", "[": "]", "~": "~" };
const WRAP_OPEN = { Backquote: "`" };
const CLOSE_TO_OPEN = { "`": "`", "*": "*", ")": "(", "}": "{", "]": "[", "~": "~" };
const SOFT_TAB = "    ";

function editorInsert(replaceStart, replaceEnd, text, cursorStart, cursorEnd) {
  markdownInput.focus();
  markdownInput.setSelectionRange(replaceStart, replaceEnd);
  document.execCommand("insertText", false, text);
  markdownInput.setSelectionRange(cursorStart, cursorEnd ?? cursorStart);
  updatePreview();
  scheduleSave();
  scheduleCaretUpdate();
}

function toggleAsteriskWrap(marker) {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const value = markdownInput.value;
  const markerLen = marker.length;
  const hasSelection = start !== end;

  if (hasSelection) {
    const selected = value.slice(start, end);
    if (
      selected.length >= markerLen * 2 &&
      selected.startsWith(marker) &&
      selected.endsWith(marker)
    ) {
      const unwrapped = selected.slice(markerLen, selected.length - markerLen);
      editorInsert(start, end, unwrapped, start, start + unwrapped.length);
      return;
    }
    const hasOuterWrap =
      start >= markerLen &&
      value.slice(start - markerLen, start) === marker &&
      value.slice(end, end + markerLen) === marker;
    if (hasOuterWrap) {
      editorInsert(start - markerLen, end + markerLen, selected, start - markerLen, end - markerLen);
      return;
    }
    editorInsert(start, end, marker + selected + marker, start + markerLen, end + markerLen);
    return;
  }

  const hasOuterWrap =
    start >= markerLen &&
    value.slice(start - markerLen, start) === marker &&
    value.slice(start, start + markerLen) === marker;
  if (hasOuterWrap) {
    editorInsert(start - markerLen, start + markerLen, "", start - markerLen, start - markerLen);
    return;
  }

  editorInsert(start, end, marker + marker, start + markerLen, start + markerLen);
}

markdownInput.addEventListener("keydown", (e) => {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const hasSelection = start !== end;
  const value = markdownInput.value;
  const openChar = WRAP_OPEN[e.key] ?? e.key;
  const closeChar = WRAP_CLOSE[openChar] ?? WRAP_CLOSE[e.key];
  const isClosingChar = CLOSE_TO_OPEN[e.key] !== undefined || WRAP_CLOSE[e.key] === e.key;

  if (!hasSelection && isClosingChar && value[start] === e.key) {
    e.preventDefault();
    markdownInput.setSelectionRange(start + 1, start + 1);
    scheduleCaretUpdate();
    return;
  }

  if ((e.metaKey || e.ctrlKey) && e.key === "b") {
    e.preventDefault();
    toggleAsteriskWrap("**");
    return;
  }

  if ((e.metaKey || e.ctrlKey) && e.key === "i") {
    e.preventDefault();
    toggleAsteriskWrap("*");
    return;
  }

  if (hasSelection && e.key === "=") {
    e.preventDefault();
    const selected = value.slice(start, end);
    editorInsert(start, end, "==" + selected + "==", start + 2, start + 2 + selected.length);
    return;
  }

  if (!hasSelection && e.key === "Backspace" && start > 0) {
    if (
      start >= SOFT_TAB.length &&
      value.slice(start - SOFT_TAB.length, start) === SOFT_TAB
    ) {
      e.preventDefault();
      editorInsert(start - SOFT_TAB.length, start, "", start - SOFT_TAB.length, start - SOFT_TAB.length);
      return;
    }
    const charBefore = value[start - 1];
    const charAfter = value[start];
    const expectedClose = WRAP_CLOSE[charBefore];
    if (expectedClose !== undefined && charAfter === expectedClose) {
      e.preventDefault();
      editorInsert(start - 1, start + 1, "", start - 1, start - 1);
      return;
    }
  }

  if (!hasSelection && e.key === "Delete" && start > 0 && start < value.length) {
    if (value.slice(start, start + SOFT_TAB.length) === SOFT_TAB) {
      e.preventDefault();
      editorInsert(start, start + SOFT_TAB.length, "", start, start);
      return;
    }
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

  if (!hasSelection && closeChar) {
    e.preventDefault();
    editorInsert(start, end, openChar + closeChar, start + openChar.length, start + openChar.length);
    return;
  }

  if (e.key === "Tab") {
    e.preventDefault();
    editorInsert(start, end, SOFT_TAB, start + SOFT_TAB.length, start + SOFT_TAB.length);
  }
});

markdownInput.addEventListener("input", () => {
  updatePreview();
  scheduleSave();
  scheduleCaretUpdate();
  updatePaneCounts();
});
markdownInput.addEventListener("click", scheduleCaretUpdate);
markdownInput.addEventListener("keydown", scheduleCaretUpdate);
markdownInput.addEventListener("keyup", scheduleCaretUpdate);
markdownInput.addEventListener("scroll", scheduleCaretUpdate);
markdownInput.addEventListener("scroll", scheduleScrollPositionSave);
markdownInput.addEventListener("focus", () => {
  startCaretBlink();
  scheduleCaretUpdate();
});
markdownInput.addEventListener("blur", () => {
  stopCaretBlink();
  if (editorFakeCaret) editorFakeCaret.style.opacity = "0";
});

function onSourceScrollSync() {
  if (!syncScrollEnabled || syncScrollInProgress || !markdownPreview) return;
  syncScrollInProgress = true;
  const maxSource = markdownInput.scrollHeight - markdownInput.clientHeight;
  const pct = maxSource > 0 ? markdownInput.scrollTop / maxSource : 0;
  const maxPrev = markdownPreview.scrollHeight - markdownPreview.clientHeight;
  markdownPreview.scrollTop = pct * maxPrev;
  requestAnimationFrame(() => { syncScrollInProgress = false; });
}

function onPreviewScrollSync() {
  if (!syncScrollEnabled || syncScrollInProgress || !markdownInput) return;
  syncScrollInProgress = true;
  const maxPrev = markdownPreview.scrollHeight - markdownPreview.clientHeight;
  const pct = maxPrev > 0 ? markdownPreview.scrollTop / maxPrev : 0;
  const maxSource = markdownInput.scrollHeight - markdownInput.clientHeight;
  markdownInput.scrollTop = pct * maxSource;
  requestAnimationFrame(() => { syncScrollInProgress = false; });
}

markdownInput.addEventListener("scroll", onSourceScrollSync);
markdownPreview.addEventListener("scroll", onPreviewScrollSync);
markdownPreview.addEventListener("scroll", scheduleScrollPositionSave);

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

const SOURCE_WIDTH_MIN = 10;
const SOURCE_WIDTH_MAX = 90;
const SOURCE_HEIGHT_MIN = 10;
const SOURCE_HEIGHT_MAX = 90;

function isStackedLayout() {
  return window.matchMedia("(max-width: 720px)").matches;
}

if (editorResizer && editorWrap) {
  editorResizer.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const wrapRect = () => editorWrap.getBoundingClientRect();
    const stacked = isStackedLayout();

    if (stacked) {
      const update = (clientY) => {
        const r = wrapRect();
        const y = clientY - r.top;
        let pct = Math.round((y / r.height) * 100);
        pct = Math.max(SOURCE_HEIGHT_MIN, Math.min(SOURCE_HEIGHT_MAX, pct));
        editorWrap.style.setProperty("--source-height", pct + "%");
        return pct;
      };
      let lastPct = 50;
      const onMove = (e) => { lastPct = update(e.clientY); };
      const onUp = async () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        await saveEditorSettings({ sourceHeightPercent: lastPct });
      };
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      update(e.clientY);
    } else {
      const update = (clientX) => {
        const r = wrapRect();
        const x = clientX - r.left;
        let pct = Math.round((x / r.width) * 100);
        pct = Math.max(SOURCE_WIDTH_MIN, Math.min(SOURCE_WIDTH_MAX, pct));
        editorWrap.style.setProperty("--source-width", pct + "%");
        return pct;
      };
      let lastPct = 50;
      const onMove = (e) => { lastPct = update(e.clientX); };
      const onUp = async () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        await saveEditorSettings({ sourceWidthPercent: lastPct });
      };
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      update(e.clientX);
    }
  });
}

loadToolbarVisibilityPreference();

loadSettings()
  .then(() => loadEditorSettings())
  .then(async () => {
    updatePreview();
    updatePaneCounts();
    await applyPendingImport();
    updatePaneCounts();
    scheduleCaretUpdate();
  });
