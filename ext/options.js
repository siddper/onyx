const EDITOR_SETTINGS_KEY = "editorSettings";
const STORAGE_KEY = "obsidianSettings";

const CUSTOM_SELECT_CHECK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="custom-select-option__check"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>';

const FONT_PRESETS = [
  { id: "inter", label: "Inter", fontFamily: '"Inter", sans-serif' },
  { id: "jetbrains-mono", label: "JetBrains Mono", fontFamily: '"JetBrains Mono", monospace' },
  { id: "geist-mono", label: "Geist Mono", fontFamily: '"Geist Mono", monospace' },
  { id: "custom", label: "Custom (paste URL below)", fontFamily: null }
];

const THEME_VARS = ["--bg", "--panel", "--panel-strong", "--ink", "--muted", "--accent", "--accent-hover", "--overlay", "--shadow", "--shadow-modal"];

const BUILT_IN_THEME_OPTIONS = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "oled", label: "OLED" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "sepia", label: "Sepia" },
  { value: "nord", label: "Nord" },
  { value: "dracula", label: "Dracula" },
  { value: "tokyo-night", label: "Tokyo Night" },
  { value: "blueberry", label: "Blueberry" },
  { value: "monokai", label: "Monokai" }
];

let customThemesCache = {};

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

function slugify(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "custom-theme";
}

function parseCustomThemeConfig(json) {
  const data = typeof json === "string" ? JSON.parse(json) : json;
  if (!data || typeof data.name !== "string" || !data.name.trim()) {
    throw new Error("Theme config must have a non-empty 'name' string.");
  }
  if (!data.colorScheme || !["light", "dark"].includes(data.colorScheme)) {
    throw new Error("Theme config must have 'colorScheme' set to 'light' or 'dark'.");
  }
  const colors = data.colors;
  if (!colors || typeof colors !== "object") {
    throw new Error("Theme config must have a 'colors' object.");
  }
  const vars = {};
  for (const key of THEME_VARS) {
    if (colors[key] != null && String(colors[key]).trim() !== "") {
      vars[key] = String(colors[key]).trim();
    } else {
      throw new Error(`Theme config 'colors' must include '${key}'.`);
    }
  }
  return {
    name: data.name.trim(),
    colorScheme: data.colorScheme,
    vars
  };
}

function applyTheme(themeId, customThemes = customThemesCache) {
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

function refreshThemeSelect(customThemes) {
  if (!themeSelect) return;
  const wrap = themeSelect.closest(".custom-select-wrap");
  if (wrap) {
    wrap.parentNode.insertBefore(themeSelect, wrap);
    wrap.remove();
  }
  themeSelect.querySelectorAll('option[value^="custom:"]').forEach((o) => o.remove());
  if (customThemes && typeof customThemes === "object") {
    Object.entries(customThemes).forEach(([id, t]) => {
      themeSelect.appendChild(new Option(t.name, "custom:" + id));
    });
  }
  initCustomSelect(themeSelect);
}

function renderCustomThemesList(customThemes) {
  const list = document.getElementById("customThemesList");
  if (!list) return;
  list.innerHTML = "";
  if (!customThemes || Object.keys(customThemes).length === 0) return;
  Object.entries(customThemes).forEach(([id, t]) => {
    const li = document.createElement("li");
    li.textContent = t.name;
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "custom-themes-list__remove";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", async () => {
      const next = { ...customThemesCache };
      delete next[id];
      customThemesCache = next;
      await saveSettings({ customThemes: next });
      if (themeSelect && themeSelect.value === "custom:" + id) {
        themeSelect.value = "system";
        applyTheme("system");
        saveSettings({ theme: "system" });
      }
      refreshThemeSelect(next);
      renderCustomThemesList(next);
    });
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

const previewToggle = document.getElementById("previewToggle");
const showPaneHeadersToggle = document.getElementById("showPaneHeadersToggle");
const radiusSlider = document.getElementById("radiusSlider");
const radiusValue = document.getElementById("radiusValue");
const interfaceFontSelect = document.getElementById("interfaceFontSelect");
const interfaceFontCustom = document.getElementById("interfaceFontCustom");
const interfaceFontUrl = document.getElementById("interfaceFontUrl");
const interfaceFontFamily = document.getElementById("interfaceFontFamily");
const editorFontSelect = document.getElementById("editorFontSelect");
const editorFontCustom = document.getElementById("editorFontCustom");
const editorFontUrl = document.getElementById("editorFontUrl");
const editorFontFamily = document.getElementById("editorFontFamily");
const codeFontSelect = document.getElementById("codeFontSelect");
const codeFontCustom = document.getElementById("codeFontCustom");
const codeFontUrl = document.getElementById("codeFontUrl");
const codeFontFamily = document.getElementById("codeFontFamily");
const customFontsEl = document.getElementById("customFonts");

function normalizeFontUrl(input) {
  const s = (input || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return `@import url("${s}");`;
  if (s.startsWith("@import")) return s;
  return `@import url("${s}");`;
}

const themeSelect = document.getElementById("themeSelect");
const caretStyleSelect = document.getElementById("caretStyleSelect");
const caretAnimationSelect = document.getElementById("caretAnimationSelect");
const caretMovementSelect = document.getElementById("caretMovementSelect");
const defaultVaultInput = document.getElementById("defaultVault");
const defaultFolderInput = document.getElementById("defaultFolder");
const countDisplaySelect = document.getElementById("countDisplaySelect");
const importObsidianNoteName = document.getElementById("importObsidianNoteName");
const importObsidianFolder = document.getElementById("importObsidianFolder");
const exportTemplateInput = document.getElementById("exportTemplateInput");
const customCssInput = document.getElementById("customCssInput");
const newVaultInput = document.getElementById("newVaultInput");
const addVaultBtn = document.getElementById("addVaultBtn");
const savedVaultsList = document.getElementById("savedVaultsList");
const settingsTabBtn = document.getElementById("settingsTabBtn");
const editorTabBtn = document.getElementById("editorTabBtn");
const settingsTabPanel = document.getElementById("settingsTabPanel");
const editorTabPanel = document.getElementById("editorTabPanel");
const optionsEditorRoot = document.getElementById("optionsEditorRoot");
const optionsEditorWrap = document.getElementById("optionsEditorWrap");
const optionsEditorResizer = document.getElementById("optionsEditorResizer");
const optionsMarkdownInput = document.getElementById("optionsMarkdownInput");
const optionsMarkdownPreview = document.getElementById("optionsMarkdownPreview");
const optionsSourceCount = document.getElementById("optionsSourceCount");
const optionsCaretMirror = document.getElementById("optionsCaretMirror");
const optionsFakeCaret = document.getElementById("optionsFakeCaret");

function setActiveTab(tabId, { updateHash = true } = {}) {
  const showEditor = tabId === "editor";
  if (settingsTabBtn) {
    settingsTabBtn.classList.toggle("is-active", !showEditor);
    settingsTabBtn.setAttribute("aria-selected", String(!showEditor));
  }
  if (editorTabBtn) {
    editorTabBtn.classList.toggle("is-active", showEditor);
    editorTabBtn.setAttribute("aria-selected", String(showEditor));
  }
  if (settingsTabPanel) settingsTabPanel.hidden = showEditor;
  if (editorTabPanel) editorTabPanel.hidden = !showEditor;

  if (updateHash) {
    const hash = showEditor ? "#editor" : "#settings";
    history.replaceState(null, "", hash);
  }
}

function initTabs() {
  const startOnEditor = window.location.hash === "#editor";
  setActiveTab(startOnEditor ? "editor" : "settings", { updateHash: false });
  if (settingsTabBtn) settingsTabBtn.addEventListener("click", () => setActiveTab("settings"));
  if (editorTabBtn) editorTabBtn.addEventListener("click", () => setActiveTab("editor"));
}

let optionsCountDisplay = "both";
let optionsSyncScrollEnabled = false;
let optionsSyncScrollInProgress = false;
let optionsNoteSaveTimeout = null;
let optionsCaretStyle = "line";
let optionsCaretAnimation = "blink";
let optionsCaretMovement = "instant";
let optionsCaretBlinkTimer = null;
let optionsCaretVisible = true;

function optionsNormalizePaneVisibility(sourceEnabled, previewEnabled) {
  const source = sourceEnabled !== false;
  const preview = previewEnabled !== false;
  if (!source && !preview) return { sourceEnabled: true, previewEnabled: false };
  return { sourceEnabled: source, previewEnabled: preview };
}

function optionsApplyPaneVisibility(sourceEnabled, previewEnabled) {
  if (!optionsEditorWrap) return;
  const resolved = optionsNormalizePaneVisibility(sourceEnabled, previewEnabled);
  optionsEditorWrap.classList.toggle("source-hidden", !resolved.sourceEnabled);
  optionsEditorWrap.classList.toggle("preview-hidden", !resolved.previewEnabled);
  if (resolved.previewEnabled) optionsUpdatePreview();
}

function optionsGetPaneVisibility() {
  return {
    sourceEnabled: !optionsEditorWrap?.classList.contains("source-hidden"),
    previewEnabled: !optionsEditorWrap?.classList.contains("preview-hidden")
  };
}

function optionsApplyHeaderVisibility(showPaneHeaders) {
  if (!optionsEditorRoot) return;
  optionsEditorRoot.classList.toggle("pane-headers-hidden", showPaneHeaders === false);
}

function optionsGetWordCharCount(text) {
  const t = (text || "").trim();
  const words = t ? t.split(/\s+/).filter(Boolean).length : 0;
  const chars = (text || "").length;
  return { words, chars };
}

function optionsUpdateCounts() {
  if (!optionsSourceCount || !optionsMarkdownInput) return;
  if (optionsCountDisplay === "none") {
    optionsSourceCount.textContent = "";
    return;
  }
  const { words, chars } = optionsGetWordCharCount(optionsMarkdownInput.value);
  if (optionsCountDisplay === "both") optionsSourceCount.textContent = `${words} words · ${chars} chars`;
  else if (optionsCountDisplay === "words") optionsSourceCount.textContent = `${words} words`;
  else if (optionsCountDisplay === "chars") optionsSourceCount.textContent = `${chars} chars`;
}

function optionsUpdatePreview() {
  if (!optionsMarkdownPreview || !optionsMarkdownInput || !optionsEditorWrap) return;
  if (optionsEditorWrap.classList.contains("preview-hidden")) return;
  optionsMarkdownPreview.innerHTML = typeof renderMarkdown === "function"
    ? renderMarkdown(optionsMarkdownInput.value)
    : optionsMarkdownInput.value.replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
}

function optionsEscapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function optionsGetCaretCoordinates() {
  if (!optionsCaretMirror || !optionsMarkdownInput) return null;
  const text = optionsMarkdownInput.value;
  const pos = optionsMarkdownInput.selectionEnd;
  const before = text.substring(0, pos);
  const after = text.substring(pos);
  const cs = getComputedStyle(optionsMarkdownInput);
  optionsCaretMirror.style.fontFamily = cs.fontFamily;
  optionsCaretMirror.style.fontSize = cs.fontSize;
  optionsCaretMirror.style.lineHeight = cs.lineHeight;
  const padL = parseFloat(cs.paddingLeft) || 0;
  const padT = parseFloat(cs.paddingTop) || 0;
  optionsCaretMirror.style.width = (optionsMarkdownInput.clientWidth - padL - (parseFloat(cs.paddingRight) || 0)) + "px";
  optionsCaretMirror.style.padding = "0";
  optionsCaretMirror.style.boxSizing = "border-box";
  optionsCaretMirror.innerHTML = optionsEscapeHtml(before) + '<span data-caret-pos>\u200b</span><span data-char-width>M</span>' + optionsEscapeHtml(after);
  const span = optionsCaretMirror.querySelector("[data-caret-pos]");
  const charSpan = optionsCaretMirror.querySelector("[data-char-width]");
  if (!span) return null;
  const left = span.offsetLeft - optionsMarkdownInput.scrollLeft + padL;
  const top = span.offsetTop - optionsMarkdownInput.scrollTop + padT;
  const height = span.offsetHeight;
  const raw = charSpan ? charSpan.offsetLeft - span.offsetLeft : 8;
  const charWidth = Math.max(8, Math.round(raw * 1));
  return { left, top, height, bottom: top + height, charWidth };
}

function optionsUpdateFakeCaret() {
  if (!optionsFakeCaret || document.activeElement !== optionsMarkdownInput) {
    if (optionsFakeCaret) optionsFakeCaret.style.opacity = "0";
    return;
  }
  const coords = optionsGetCaretCoordinates();
  if (!coords) {
    optionsFakeCaret.style.opacity = "0";
    return;
  }
  optionsFakeCaret.style.left = coords.left + "px";
  if (optionsCaretStyle === "underline") {
    optionsFakeCaret.style.width = (coords.charWidth ?? 8) + "px";
    optionsFakeCaret.style.height = "2px";
    optionsFakeCaret.style.top = coords.bottom - 2 + "px";
  } else if (optionsCaretStyle === "block") {
    optionsFakeCaret.style.width = (coords.charWidth ?? 8) + "px";
    optionsFakeCaret.style.top = coords.top + "px";
    optionsFakeCaret.style.height = coords.height + "px";
  } else {
    optionsFakeCaret.style.width = "2px";
    optionsFakeCaret.style.top = coords.top + "px";
    optionsFakeCaret.style.height = coords.height + "px";
  }
  if (optionsCaretAnimation === "blink") {
    optionsFakeCaret.style.opacity = optionsCaretVisible ? "1" : "0";
  } else if (optionsCaretAnimation === "solid") {
    optionsFakeCaret.style.opacity = "1";
  }
}

function optionsScheduleCaretUpdate() {
  requestAnimationFrame(() => optionsUpdateFakeCaret());
}

function optionsStartCaretBlink() {
  if (!optionsFakeCaret) return;
  if (optionsCaretAnimation === "blink") {
    if (optionsCaretBlinkTimer) return;
    optionsCaretVisible = true;
    optionsFakeCaret.style.opacity = "1";
    optionsCaretBlinkTimer = setInterval(() => {
      optionsCaretVisible = !optionsCaretVisible;
      if (optionsFakeCaret) optionsFakeCaret.style.opacity = optionsCaretVisible ? "1" : "0";
    }, 530);
  } else {
    optionsCaretVisible = true;
    if (optionsCaretAnimation === "solid") optionsFakeCaret.style.opacity = "1";
    if (optionsCaretAnimation === "phase" || optionsCaretAnimation === "expand") {
      optionsFakeCaret.style.animation = "";
      optionsFakeCaret.style.opacity = "";
    }
  }
}

function optionsStopCaretBlink() {
  if (optionsCaretBlinkTimer) {
    clearInterval(optionsCaretBlinkTimer);
    optionsCaretBlinkTimer = null;
  }
  if (optionsFakeCaret) {
    optionsFakeCaret.style.opacity = "0";
    optionsFakeCaret.style.animation = "none";
  }
}

const OPTIONS_WRAP_CLOSE = { "`": "`", "*": "*", "(": ")", "{": "}", "[": "]", "~": "~" };
const OPTIONS_WRAP_OPEN = { Backquote: "`" };
const OPTIONS_CLOSE_TO_OPEN = { "`": "`", "*": "*", ")": "(", "}": "{", "]": "[", "~": "~" };
const OPTIONS_SOFT_TAB = "    ";

function optionsEditorInsert(replaceStart, replaceEnd, text, cursorStart, cursorEnd) {
  optionsMarkdownInput.focus();
  optionsMarkdownInput.setSelectionRange(replaceStart, replaceEnd);
  document.execCommand("insertText", false, text);
  optionsMarkdownInput.setSelectionRange(cursorStart, cursorEnd ?? cursorStart);
  optionsUpdatePreview();
  optionsUpdateCounts();
  optionsScheduleSave();
  optionsScheduleCaretUpdate();
}

function optionsToggleAsteriskWrap(marker) {
  const start = optionsMarkdownInput.selectionStart;
  const end = optionsMarkdownInput.selectionEnd;
  const value = optionsMarkdownInput.value;
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
      optionsEditorInsert(start, end, unwrapped, start, start + unwrapped.length);
      return;
    }
    const hasOuterWrap =
      start >= markerLen &&
      value.slice(start - markerLen, start) === marker &&
      value.slice(end, end + markerLen) === marker;
    if (hasOuterWrap) {
      optionsEditorInsert(start - markerLen, end + markerLen, selected, start - markerLen, end - markerLen);
      return;
    }
    optionsEditorInsert(start, end, marker + selected + marker, start + markerLen, end + markerLen);
    return;
  }

  const hasOuterWrap =
    start >= markerLen &&
    value.slice(start - markerLen, start) === marker &&
    value.slice(start, start + markerLen) === marker;
  if (hasOuterWrap) {
    optionsEditorInsert(start - markerLen, start + markerLen, "", start - markerLen, start - markerLen);
    return;
  }

  optionsEditorInsert(start, end, marker + marker, start + markerLen, start + markerLen);
}

function optionsHandleEditorKeydown(e) {
  const start = optionsMarkdownInput.selectionStart;
  const end = optionsMarkdownInput.selectionEnd;
  const hasSelection = start !== end;
  const value = optionsMarkdownInput.value;
  const openChar = OPTIONS_WRAP_OPEN[e.key] ?? e.key;
  const closeChar = OPTIONS_WRAP_CLOSE[openChar] ?? OPTIONS_WRAP_CLOSE[e.key];

  if ((e.metaKey || e.ctrlKey) && e.key === "b") {
    e.preventDefault();
    optionsToggleAsteriskWrap("**");
    return;
  }

  if ((e.metaKey || e.ctrlKey) && e.key === "i") {
    e.preventDefault();
    optionsToggleAsteriskWrap("*");
    return;
  }

  if (hasSelection && e.key === "=") {
    e.preventDefault();
    const selected = value.slice(start, end);
    optionsEditorInsert(start, end, "==" + selected + "==", start + 2, start + 2 + selected.length);
    return;
  }

  if (!hasSelection && e.key === "Backspace" && start > 0) {
    if (start >= OPTIONS_SOFT_TAB.length && value.slice(start - OPTIONS_SOFT_TAB.length, start) === OPTIONS_SOFT_TAB) {
      e.preventDefault();
      optionsEditorInsert(start - OPTIONS_SOFT_TAB.length, start, "", start - OPTIONS_SOFT_TAB.length, start - OPTIONS_SOFT_TAB.length);
      return;
    }
    const charBefore = value[start - 1];
    const charAfter = value[start];
    const expectedClose = OPTIONS_WRAP_CLOSE[charBefore];
    if (expectedClose !== undefined && charAfter === expectedClose) {
      e.preventDefault();
      optionsEditorInsert(start - 1, start + 1, "", start - 1, start - 1);
      return;
    }
  }

  if (!hasSelection && e.key === "Delete" && start > 0 && start < value.length) {
    if (value.slice(start, start + OPTIONS_SOFT_TAB.length) === OPTIONS_SOFT_TAB) {
      e.preventDefault();
      optionsEditorInsert(start, start + OPTIONS_SOFT_TAB.length, "", start, start);
      return;
    }
    const charBefore = value[start - 1];
    const charAfter = value[start];
    const expectedOpen = OPTIONS_CLOSE_TO_OPEN[charAfter];
    if (expectedOpen !== undefined && charBefore === expectedOpen) {
      e.preventDefault();
      optionsEditorInsert(start - 1, start + 1, "", start - 1, start - 1);
      return;
    }
  }

  if (hasSelection && closeChar) {
    e.preventDefault();
    const selected = value.slice(start, end);
    optionsEditorInsert(start, end, openChar + selected + closeChar, start + openChar.length, start + openChar.length + selected.length);
    return;
  }

  if (!hasSelection && closeChar) {
    e.preventDefault();
    optionsEditorInsert(start, end, openChar + closeChar, start + openChar.length, start + openChar.length);
    return;
  }

  if (e.key === "Tab") {
    e.preventDefault();
    optionsEditorInsert(start, end, OPTIONS_SOFT_TAB, start + OPTIONS_SOFT_TAB.length, start + OPTIONS_SOFT_TAB.length);
  }
}

async function optionsSaveNoteContent() {
  if (!optionsMarkdownInput) return;
  const data = await chrome.storage.sync.get(STORAGE_KEY);
  const current = data[STORAGE_KEY] || {};
  await chrome.storage.sync.set({ [STORAGE_KEY]: { ...current, content: optionsMarkdownInput.value } });
}

function optionsScheduleSave() {
  clearTimeout(optionsNoteSaveTimeout);
  optionsNoteSaveTimeout = setTimeout(() => {
    optionsNoteSaveTimeout = null;
    optionsSaveNoteContent();
  }, 300);
}

function optionsApplyStoredNoteSettings(settings = {}) {
  if (!optionsMarkdownInput) return;
  const nextContent = settings.content || "";
  if (optionsMarkdownInput.value === nextContent) return;
  const active = document.activeElement === optionsMarkdownInput;
  const start = optionsMarkdownInput.selectionStart;
  const end = optionsMarkdownInput.selectionEnd;
  optionsMarkdownInput.value = nextContent;
  if (active && typeof start === "number" && typeof end === "number") {
    optionsMarkdownInput.setSelectionRange(
      Math.min(start, nextContent.length),
      Math.min(end, nextContent.length)
    );
  }
  optionsUpdatePreview();
  optionsUpdateCounts();
}

function optionsOnSourceScrollSync() {
  if (!optionsSyncScrollEnabled || optionsSyncScrollInProgress || !optionsMarkdownPreview || !optionsMarkdownInput) return;
  optionsSyncScrollInProgress = true;
  const maxSource = optionsMarkdownInput.scrollHeight - optionsMarkdownInput.clientHeight;
  const pct = maxSource > 0 ? optionsMarkdownInput.scrollTop / maxSource : 0;
  const maxPrev = optionsMarkdownPreview.scrollHeight - optionsMarkdownPreview.clientHeight;
  optionsMarkdownPreview.scrollTop = pct * maxPrev;
  requestAnimationFrame(() => { optionsSyncScrollInProgress = false; });
}

function optionsOnPreviewScrollSync() {
  if (!optionsSyncScrollEnabled || optionsSyncScrollInProgress || !optionsMarkdownPreview || !optionsMarkdownInput) return;
  optionsSyncScrollInProgress = true;
  const maxPrev = optionsMarkdownPreview.scrollHeight - optionsMarkdownPreview.clientHeight;
  const pct = maxPrev > 0 ? optionsMarkdownPreview.scrollTop / maxPrev : 0;
  const maxSource = optionsMarkdownInput.scrollHeight - optionsMarkdownInput.clientHeight;
  optionsMarkdownInput.scrollTop = pct * maxSource;
  requestAnimationFrame(() => { optionsSyncScrollInProgress = false; });
}

function optionsIsStackedLayout() {
  return window.matchMedia("(max-width: 860px)").matches;
}

async function optionsSavePaneVisibility({ sourceEnabled, previewEnabled }) {
  const resolved = optionsNormalizePaneVisibility(sourceEnabled, previewEnabled);
  await saveSettings(resolved);
  optionsApplyPaneVisibility(resolved.sourceEnabled, resolved.previewEnabled);
}

const OPTIONS_CONTEXT_MENU_CHECK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="context-menu-option__check"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>';

const OPTIONS_CONTEXT_MENU_ARROW_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="context-menu-option__arrow"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>';

let optionsContextMenuEl = null;
let optionsContextSubmenuEl = null;
let optionsContextSubmenuCloseTimer = null;

function optionsHideSubmenu() {
  if (optionsContextSubmenuCloseTimer) {
    clearTimeout(optionsContextSubmenuCloseTimer);
    optionsContextSubmenuCloseTimer = null;
  }
  if (optionsContextSubmenuEl) {
    optionsContextSubmenuEl.remove();
    optionsContextSubmenuEl = null;
  }
}

function optionsCloseContextMenu() {
  optionsHideSubmenu();
  if (optionsContextMenuEl) {
    optionsContextMenuEl.remove();
    optionsContextMenuEl = null;
  }
  document.removeEventListener("click", optionsCloseContextMenu);
  document.removeEventListener("scroll", optionsCloseContextMenu, true);
}

function showOptionsContextMenu(x, y) {
  optionsCloseContextMenu();
  const paneVisibility = optionsGetPaneVisibility();
  const sourceOnly = paneVisibility.sourceEnabled && !paneVisibility.previewEnabled;
  const previewOnly = !paneVisibility.sourceEnabled && paneVisibility.previewEnabled;

  const caretSubmenu = [
    { id: "line", label: "Line", getChecked: () => optionsCaretStyle === "line", value: "line" },
    { id: "block", label: "Block", getChecked: () => optionsCaretStyle === "block", value: "block" },
    { id: "underline", label: "Underline", getChecked: () => optionsCaretStyle === "underline", value: "underline" }
  ];

  const caretAnimationSubmenu = [
    { id: "solid", label: "Solid", getChecked: () => optionsCaretAnimation === "solid", value: "solid" },
    { id: "blink", label: "Blink", getChecked: () => optionsCaretAnimation === "blink", value: "blink" },
    { id: "phase", label: "Phase", getChecked: () => optionsCaretAnimation === "phase", value: "phase" },
    { id: "expand", label: "Expand", getChecked: () => optionsCaretAnimation === "expand", value: "expand" }
  ];

  const caretMovementSubmenu = [
    { id: "instant", label: "Instant", getChecked: () => optionsCaretMovement === "instant", value: "instant" },
    { id: "smooth", label: "Smooth", getChecked: () => optionsCaretMovement === "smooth", value: "smooth" }
  ];

  const currentEditorFont = editorFontSelect?.value || "inter";
  const fontSubmenu = [
    { id: "inter", label: "Inter", getChecked: () => currentEditorFont === "inter", value: "inter" },
    { id: "jetbrains-mono", label: "JetBrains Mono", getChecked: () => currentEditorFont === "jetbrains-mono", value: "jetbrains-mono" },
    { id: "geist-mono", label: "Geist Mono", getChecked: () => currentEditorFont === "geist-mono", value: "geist-mono" },
    { id: "custom", label: "Custom", getChecked: () => currentEditorFont === "custom", value: "custom" }
  ];

  const options = [];
  if (!sourceOnly) {
    options.push({
      id: "source",
      label: "Show source",
      getChecked: () => !optionsEditorWrap.classList.contains("source-hidden"),
      onToggle: async () => {
        const current = optionsGetPaneVisibility();
        await optionsSavePaneVisibility({ sourceEnabled: !current.sourceEnabled, previewEnabled: current.previewEnabled });
      }
    });
  }
  if (!previewOnly) {
    options.push({
      id: "preview",
      label: "Show preview",
      getChecked: () => !optionsEditorWrap.classList.contains("preview-hidden"),
      onToggle: async () => {
        const current = optionsGetPaneVisibility();
        await optionsSavePaneVisibility({ sourceEnabled: current.sourceEnabled, previewEnabled: !current.previewEnabled });
      }
    });
  }

  options.push({
    id: "pane-headers",
    label: "Show headers",
    getChecked: () => !optionsEditorRoot.classList.contains("pane-headers-hidden"),
    onToggle: async () => {
      const next = optionsEditorRoot.classList.contains("pane-headers-hidden");
      optionsApplyHeaderVisibility(next);
      if (showPaneHeadersToggle) showPaneHeadersToggle.checked = next;
      await saveSettings({ showPaneHeaders: next });
    }
  });

  options.push(
    {
      id: "caret-shape",
      label: "Caret shape",
      submenu: caretSubmenu,
      onSelectItem: async (item) => {
        optionsCaretStyle = item.value;
        if (optionsFakeCaret) optionsFakeCaret.dataset.style = optionsCaretStyle;
        if (caretStyleSelect) caretStyleSelect.value = item.value;
        optionsScheduleCaretUpdate();
        await saveSettings({ caretStyle: item.value });
      }
    },
    {
      id: "caret-animation",
      label: "Caret animation",
      submenu: caretAnimationSubmenu,
      onSelectItem: async (item) => {
        optionsCaretAnimation = item.value;
        if (optionsFakeCaret) optionsFakeCaret.dataset.animation = optionsCaretAnimation;
        if (caretAnimationSelect) caretAnimationSelect.value = item.value;
        optionsScheduleCaretUpdate();
        await saveSettings({ caretAnimation: item.value });
      }
    },
    {
      id: "caret-movement",
      label: "Caret movement",
      submenu: caretMovementSubmenu,
      onSelectItem: async (item) => {
        optionsCaretMovement = item.value;
        if (optionsFakeCaret) optionsFakeCaret.dataset.movement = optionsCaretMovement;
        if (caretMovementSelect) caretMovementSelect.value = item.value;
        optionsScheduleCaretUpdate();
        await saveSettings({ caretMovement: item.value });
      }
    },
    {
      id: "font",
      label: "Font",
      submenu: fontSubmenu,
      onSelectItem: async (item) => {
        if (editorFontSelect) editorFontSelect.value = item.value;
        showHideCustomFields();
        await saveSettings({ editorFont: item.value });
        if (item.value === "custom") {
          setActiveTab("settings");
          document.getElementById("section-fonts")?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  );

  options.push({
    id: "open-settings",
    label: "Open settings",
    getChecked: () => false,
    onToggle: async () => {
      setActiveTab("settings");
    }
  });

  function appendCheckOrSpacer(row, checked) {
    if (checked) {
      const checkWrap = document.createElement("span");
      checkWrap.className = "context-menu-option__check";
      checkWrap.innerHTML = OPTIONS_CONTEXT_MENU_CHECK_SVG;
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
    if (optionsContextSubmenuCloseTimer) {
      clearTimeout(optionsContextSubmenuCloseTimer);
      optionsContextSubmenuCloseTimer = null;
    }
    optionsHideSubmenu();
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
        optionsCloseContextMenu();
      });
      subRow.addEventListener("mouseenter", () => {
        if (optionsContextSubmenuCloseTimer) {
          clearTimeout(optionsContextSubmenuCloseTimer);
          optionsContextSubmenuCloseTimer = null;
        }
      });
      subRow.addEventListener("mouseleave", () => {
        optionsContextSubmenuCloseTimer = setTimeout(optionsHideSubmenu, 150);
      });
      submenu.appendChild(subRow);
    });
    document.body.appendChild(submenu);
    optionsContextSubmenuEl = submenu;
    submenu.addEventListener("mouseenter", () => {
      if (optionsContextSubmenuCloseTimer) {
        clearTimeout(optionsContextSubmenuCloseTimer);
        optionsContextSubmenuCloseTimer = null;
      }
    });
    submenu.addEventListener("mouseleave", () => {
      optionsContextSubmenuCloseTimer = setTimeout(optionsHideSubmenu, 150);
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
      arrowWrap.innerHTML = OPTIONS_CONTEXT_MENU_ARROW_SVG;
      const svg = arrowWrap.querySelector("svg");
      if (svg) {
        svg.style.width = "16px";
        svg.style.height = "16px";
        svg.style.fill = "currentColor";
      }
      row.appendChild(arrowWrap);
      row.addEventListener("mouseenter", () => showSubmenuAt(row, opt));
      row.addEventListener("mouseleave", () => {
        optionsContextSubmenuCloseTimer = setTimeout(optionsHideSubmenu, 150);
      });
    } else {
      appendCheckOrSpacer(row, opt.getChecked());
      row.addEventListener("click", async (e) => {
        e.stopPropagation();
        await opt.onToggle();
        optionsCloseContextMenu();
      });
    }
    container.appendChild(row);
  });
  document.body.appendChild(container);
  optionsContextMenuEl = container;
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
    document.addEventListener("click", optionsCloseContextMenu);
    document.addEventListener("scroll", optionsCloseContextMenu, true);
  }, 0);
}

function initOptionsEditorResizer() {
  if (!optionsEditorResizer || !optionsEditorWrap) return;
  optionsEditorResizer.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const wrapRect = () => optionsEditorWrap.getBoundingClientRect();
    const stacked = optionsIsStackedLayout();

    if (stacked) {
      const update = (clientY) => {
        const r = wrapRect();
        let pct = Math.round(((clientY - r.top) / r.height) * 100);
        pct = Math.max(10, Math.min(90, pct));
        optionsEditorWrap.style.setProperty("--options-source-height", pct + "%");
      };
      const onMove = (ev) => update(ev.clientY);
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      update(e.clientY);
      return;
    }

    const update = (clientX) => {
      const r = wrapRect();
      let pct = Math.round(((clientX - r.left) / r.width) * 100);
      pct = Math.max(10, Math.min(90, pct));
      optionsEditorWrap.style.setProperty("--options-source-width", pct + "%");
    };
    const onMove = (ev) => update(ev.clientX);
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    update(e.clientX);
  });
}

async function initOptionsEditor() {
  if (!optionsMarkdownInput || !optionsMarkdownPreview) return;
  const [noteData, editorData] = await Promise.all([
    chrome.storage.sync.get(STORAGE_KEY),
    chrome.storage.sync.get(EDITOR_SETTINGS_KEY)
  ]);
  const note = noteData[STORAGE_KEY] || {};
  const editorSettings = editorData[EDITOR_SETTINGS_KEY] || {};

  optionsMarkdownInput.value = note.content || "";
  optionsCountDisplay = editorSettings.countDisplay || "both";
  optionsSyncScrollEnabled = editorSettings.syncScroll === true;
  optionsCaretStyle = editorSettings.caretStyle || "line";
  optionsCaretAnimation = editorSettings.caretAnimation || "blink";
  optionsCaretMovement = editorSettings.caretMovement || "instant";
  if (optionsFakeCaret) {
    optionsFakeCaret.dataset.style = optionsCaretStyle;
    optionsFakeCaret.dataset.animation = optionsCaretAnimation;
    optionsFakeCaret.dataset.movement = optionsCaretMovement;
  }
  optionsApplyPaneVisibility(editorSettings.sourceEnabled, editorSettings.previewEnabled);
  optionsApplyHeaderVisibility(editorSettings.showPaneHeaders !== false);
  optionsUpdatePreview();
  optionsUpdateCounts();

  optionsMarkdownInput.addEventListener("input", () => {
    optionsUpdatePreview();
    optionsUpdateCounts();
    optionsScheduleSave();
    optionsScheduleCaretUpdate();
  });
  optionsMarkdownInput.addEventListener("keydown", optionsHandleEditorKeydown);
  optionsMarkdownInput.addEventListener("click", optionsScheduleCaretUpdate);
  optionsMarkdownInput.addEventListener("keydown", optionsScheduleCaretUpdate);
  optionsMarkdownInput.addEventListener("keyup", optionsScheduleCaretUpdate);
  optionsMarkdownInput.addEventListener("focus", () => {
    optionsStartCaretBlink();
    optionsScheduleCaretUpdate();
  });
  optionsMarkdownInput.addEventListener("blur", () => {
    optionsStopCaretBlink();
    if (optionsFakeCaret) optionsFakeCaret.style.opacity = "0";
  });
  optionsMarkdownInput.addEventListener("scroll", optionsOnSourceScrollSync);
  optionsMarkdownInput.addEventListener("scroll", optionsScheduleCaretUpdate);
  optionsMarkdownPreview.addEventListener("scroll", optionsOnPreviewScrollSync);

  const optionsEditorPane = document.querySelector(".options-editor-pane");
  const optionsPreviewPane = document.querySelector(".options-preview-pane");
  [optionsEditorPane, optionsPreviewPane, optionsEditorWrap].forEach((el) => {
    if (!el) return;
    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showOptionsContextMenu(e.clientX, e.clientY);
    });
  });
  initOptionsEditorResizer();
}

function getSettingsFromForm() {
  return {
    theme: themeSelect ? themeSelect.value : "system",
    previewEnabled: previewToggle?.checked ?? true,
    showPaneHeaders: showPaneHeadersToggle?.checked ?? true,
    syncScroll: document.getElementById("syncScrollToggle")?.checked ?? false,
    minimalMode: document.getElementById("minimalModeToggle")?.checked ?? false,
    radiusPx: radiusSlider ? parseInt(radiusSlider.value, 10) : 8,
    caretStyle: caretStyleSelect?.value ?? "line",
    caretAnimation: caretAnimationSelect?.value ?? "blink",
    caretMovement: caretMovementSelect?.value ?? "instant",
    interfaceFont: interfaceFontSelect?.value ?? "inter",
    editorFont: editorFontSelect?.value ?? "inter",
    codeFont: codeFontSelect?.value ?? "jetbrains-mono",
    interfaceFontUrl: interfaceFontUrl?.value?.trim() ?? "",
    interfaceFontFamily: interfaceFontFamily?.value?.trim() ?? "",
    editorFontUrl: editorFontUrl?.value?.trim() ?? "",
    editorFontFamily: editorFontFamily?.value?.trim() ?? "",
    codeFontUrl: codeFontUrl?.value?.trim() ?? "",
    codeFontFamily: codeFontFamily?.value?.trim() ?? "",
    defaultVault: defaultVaultInput?.value?.trim() ?? "",
    defaultFolder: defaultFolderInput?.value?.trim() ?? "",
    countDisplay: countDisplaySelect?.value ?? "both",
    importObsidianNoteName: importObsidianNoteName?.value?.trim() ?? "",
    importObsidianFolder: importObsidianFolder?.value?.trim() ?? "",
    exportTemplate: exportTemplateInput?.value?.trim() ?? "",
    customCss: customCssInput?.value?.trim() ?? ""
  };
}

function applyFonts(settings) {
  const s = settings || getSettingsFromForm();
  const imports = [];
  if (s.interfaceFont === "custom" && s.interfaceFontUrl) imports.push(normalizeFontUrl(s.interfaceFontUrl));
  if (s.editorFont === "custom" && s.editorFontUrl && s.editorFontUrl !== s.interfaceFontUrl) imports.push(normalizeFontUrl(s.editorFontUrl));
  const codeUrl = s.codeFontUrl?.trim();
  if (s.codeFont === "custom" && codeUrl && codeUrl !== s.interfaceFontUrl?.trim() && codeUrl !== s.editorFontUrl?.trim()) imports.push(normalizeFontUrl(s.codeFontUrl));
  if (customFontsEl) customFontsEl.textContent = imports.join("\n");

  const ifPreset = FONT_PRESETS.find((p) => p.id === (s.interfaceFont || "inter"));
  const edPreset = FONT_PRESETS.find((p) => p.id === (s.editorFont || "inter"));
  const codePreset = FONT_PRESETS.find((p) => p.id === (s.codeFont || "jetbrains-mono"));

  const ifFamily = ifPreset?.id === "custom" && s.interfaceFontFamily ? s.interfaceFontFamily : (ifPreset?.fontFamily ?? FONT_PRESETS[0].fontFamily);
  const edFamily = edPreset?.id === "custom" && s.editorFontFamily ? s.editorFontFamily : (edPreset?.fontFamily ?? FONT_PRESETS[0].fontFamily);
  const codeFamily = codePreset?.id === "custom" && s.codeFontFamily ? s.codeFontFamily : (codePreset?.fontFamily ?? FONT_PRESETS[1].fontFamily);

  document.documentElement.style.setProperty("--font-interface", ifFamily);
  document.documentElement.style.setProperty("--font-editor", edFamily);
  document.documentElement.style.setProperty("--font-code", codeFamily);
}

function populateFontSelects() {
  FONT_PRESETS.forEach((p) => {
    interfaceFontSelect.appendChild(new Option(p.label, p.id));
    editorFontSelect.appendChild(new Option(p.label, p.id));
    codeFontSelect.appendChild(new Option(p.label, p.id));
  });
}

function initCustomSelect(selectEl) {
  const wrap = document.createElement("div");
  wrap.className = "custom-select-wrap";
  selectEl.parentNode.insertBefore(wrap, selectEl);
  wrap.appendChild(selectEl);

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select-trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  updateTriggerText();
  wrap.appendChild(trigger);

  const dropdown = document.createElement("div");
  dropdown.className = "custom-select-dropdown";
  dropdown.setAttribute("role", "listbox");
  dropdown.setAttribute("aria-label", selectEl.id ? document.querySelector(`label[for="${selectEl.id}"]`)?.textContent?.trim() || "Options" : "Options");

  function setOptionCheck(optionEl, selected) {
    const checkSlot = optionEl.querySelector(".custom-select-option__check-slot");
    if (!checkSlot) return;
    if (selected) {
      checkSlot.innerHTML = CUSTOM_SELECT_CHECK_SVG;
      const svg = checkSlot.querySelector("svg");
      if (svg) {
        svg.style.width = "16px";
        svg.style.height = "16px";
        svg.style.fill = "currentColor";
      }
    } else {
      checkSlot.innerHTML = "";
    }
  }

  for (let i = 0; i < selectEl.options.length; i++) {
    const opt = selectEl.options[i];
    const item = document.createElement("div");
    item.className = "custom-select-option";
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", opt.value === selectEl.value);
    item.dataset.value = opt.value;

    const label = document.createElement("span");
    label.textContent = opt.textContent;
    item.appendChild(label);

    const checkSlot = document.createElement("span");
    checkSlot.className = "custom-select-option__check-slot";
    checkSlot.setAttribute("aria-hidden", "true");
    item.appendChild(checkSlot);

    if (opt.value === selectEl.value) setOptionCheck(item, true);

    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selectEl.value = opt.value;
      dropdown.querySelectorAll(".custom-select-option").forEach((o) => {
        const isSelected = o.dataset.value === opt.value;
        o.setAttribute("aria-selected", isSelected);
        setOptionCheck(o, isSelected);
      });
      closeDropdown();
      updateTriggerText();
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    });
    dropdown.appendChild(item);
  }
  wrap.appendChild(dropdown);

  function updateTriggerText() {
    const selected = selectEl.options[selectEl.selectedIndex];
    trigger.textContent = selected ? selected.textContent : "";
  }

  function closeDropdown(e) {
    if (e && wrap.contains(e.target)) return;
    dropdown.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", closeDropdown);
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = dropdown.classList.toggle("open");
    trigger.setAttribute("aria-expanded", open);
    if (open) setTimeout(() => document.addEventListener("click", closeDropdown), 0);
    else document.removeEventListener("click", closeDropdown);
  });
}

function initCustomSelects() {
  document.querySelectorAll("select.settings-select").forEach(initCustomSelect);
}

function showHideCustomFields() {
  interfaceFontCustom.hidden = interfaceFontSelect.value !== "custom";
  editorFontCustom.hidden = editorFontSelect.value !== "custom";
  codeFontCustom.hidden = codeFontSelect.value !== "custom";
}

function applyRadius(pixels) {
  const px = Math.max(0, Math.min(24, typeof pixels === "number" ? pixels : 8));
  document.documentElement.style.setProperty("--radius", px + "px");
  if (radiusSlider) radiusSlider.value = String(px);
  if (radiusSlider) radiusSlider.setAttribute("aria-valuenow", px);
  if (radiusValue) radiusValue.textContent = px + "px";
}

async function loadSettings() {
  const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const s = data[EDITOR_SETTINGS_KEY] || {};
  customThemesCache = s.customThemes && typeof s.customThemes === "object" ? s.customThemes : {};
  if (themeSelect) {
    themeSelect.querySelectorAll('option[value^="custom:"]').forEach((o) => o.remove());
    Object.entries(customThemesCache).forEach(([id, t]) => {
      themeSelect.appendChild(new Option(t.name, "custom:" + id));
    });
    themeSelect.value = s.theme || "system";
    applyTheme(s.theme || "system", customThemesCache);
    renderCustomThemesList(customThemesCache);
  }
  previewToggle.checked = s.previewEnabled !== false;
  if (showPaneHeadersToggle) showPaneHeadersToggle.checked = s.showPaneHeaders !== false;
  const syncScrollToggle = document.getElementById("syncScrollToggle");
  if (syncScrollToggle) syncScrollToggle.checked = s.syncScroll === true;
  const minimalModeToggle = document.getElementById("minimalModeToggle");
  if (minimalModeToggle) minimalModeToggle.checked = s.minimalMode === true;
  const radius = typeof s.radiusPx === "number" && s.radiusPx >= 0 && s.radiusPx <= 24 ? s.radiusPx : 8;
  applyRadius(radius);
  caretStyleSelect.value = s.caretStyle || "line";
  caretAnimationSelect.value = s.caretAnimation || "blink";
  caretMovementSelect.value = s.caretMovement || "instant";
  if (defaultVaultInput) defaultVaultInput.value = s.defaultVault ?? "";
  if (defaultFolderInput) defaultFolderInput.value = s.defaultFolder ?? "";
  if (countDisplaySelect) countDisplaySelect.value = s.countDisplay || "both";
  importObsidianNoteName.value = s.importObsidianNoteName ?? "Import From Onyx";
  importObsidianFolder.value = s.importObsidianFolder ?? "";
  if (exportTemplateInput) exportTemplateInput.value = s.exportTemplate ?? "";
  renderSavedVaultsList(Array.isArray(s.savedVaults) ? s.savedVaults : []);
  interfaceFontSelect.value = s.interfaceFont || "inter";
  editorFontSelect.value = s.editorFont || "inter";
  codeFontSelect.value = s.codeFont || "jetbrains-mono";
  interfaceFontUrl.value = s.interfaceFontUrl || "";
  interfaceFontFamily.value = s.interfaceFontFamily || "";
  editorFontUrl.value = s.editorFontUrl || "";
  editorFontFamily.value = s.editorFontFamily || "";
  codeFontUrl.value = s.codeFontUrl || "";
  codeFontFamily.value = s.codeFontFamily || "";
  if (customCssInput) customCssInput.value = s.customCss ?? "";
  showHideCustomFields();
  applyFonts(s);
}

async function saveSettings(partial) {
  const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const current = data[EDITOR_SETTINGS_KEY] || {};
  await chrome.storage.sync.set({ [EDITOR_SETTINGS_KEY]: { ...current, ...partial } });
}

function renderSavedVaultsList(vaults) {
  if (!savedVaultsList) return;
  savedVaultsList.innerHTML = "";
  (vaults || []).forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "saved-vaults-list__remove";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", async () => {
      const next = vaults.filter((v) => v !== name);
      await saveSettings({ savedVaults: next });
      renderSavedVaultsList(next);
    });
    li.appendChild(removeBtn);
    savedVaultsList.appendChild(li);
  });
}

function syncAndSave() {
  const s = getSettingsFromForm();
  applyFonts(s);
  saveSettings(s);
}

populateFontSelects();

if (previewToggle) {
  previewToggle.addEventListener("change", () => {
    saveSettings({ previewEnabled: previewToggle.checked });
    const current = optionsGetPaneVisibility();
    optionsApplyPaneVisibility(current.sourceEnabled, previewToggle.checked);
  });
}

if (showPaneHeadersToggle) {
  showPaneHeadersToggle.addEventListener("change", () => {
    saveSettings({ showPaneHeaders: showPaneHeadersToggle.checked });
    optionsApplyHeaderVisibility(showPaneHeadersToggle.checked);
  });
}

const syncScrollToggle = document.getElementById("syncScrollToggle");
if (syncScrollToggle) {
  syncScrollToggle.addEventListener("change", () => {
    saveSettings({ syncScroll: syncScrollToggle.checked });
    optionsSyncScrollEnabled = syncScrollToggle.checked;
  });
}

const minimalModeToggle = document.getElementById("minimalModeToggle");
if (minimalModeToggle) {
  minimalModeToggle.addEventListener("change", () => {
    saveSettings({ minimalMode: minimalModeToggle.checked });
  });
}

if (themeSelect) {
  themeSelect.addEventListener("change", () => {
    applyTheme(themeSelect.value, customThemesCache);
    saveSettings({ theme: themeSelect.value });
  });
}

const themeFileInput = document.getElementById("themeFileInput");
const importThemeBtn = document.getElementById("importThemeBtn");
if (importThemeBtn && themeFileInput) {
  importThemeBtn.addEventListener("click", () => themeFileInput.click());
  themeFileInput.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseCustomThemeConfig(text);
      const id = slugify(parsed.name);
      const customThemes = { ...customThemesCache, [id]: { id, name: parsed.name, colorScheme: parsed.colorScheme, vars: parsed.vars } };
      customThemesCache = customThemes;
      await saveSettings({ customThemes });
      refreshThemeSelect(customThemes);
      renderCustomThemesList(customThemes);
      themeSelect.value = "custom:" + id;
      const wrap = themeSelect.closest(".custom-select-wrap");
      if (wrap) {
        const trigger = wrap.querySelector(".custom-select-trigger");
        if (trigger) trigger.textContent = themeSelect.options[themeSelect.selectedIndex]?.textContent || "";
      }
      applyTheme(themeSelect.value, customThemes);
      await saveSettings({ theme: themeSelect.value });
    } catch (err) {
      alert("Invalid theme config: " + (err.message || String(err)));
    }
  });
}

if (radiusSlider) {
  radiusSlider.addEventListener("input", () => {
    const px = parseInt(radiusSlider.value, 10);
    applyRadius(px);
    saveSettings({ radiusPx: px });
  });
}

const customCssApplyBtn = document.getElementById("customCssApplyBtn");
if (customCssInput) {
  customCssInput.addEventListener("blur", () => {
    saveSettings({ customCss: customCssInput.value.trim() });
  });
}
if (exportTemplateInput) {
  exportTemplateInput.addEventListener("blur", () => {
    saveSettings({ exportTemplate: exportTemplateInput.value.trim() });
  });
}

if (addVaultBtn && newVaultInput && savedVaultsList) {
  addVaultBtn.addEventListener("click", async () => {
    const name = newVaultInput.value.trim();
    if (!name) return;
    const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
    const current = data[EDITOR_SETTINGS_KEY] || {};
    const list = Array.isArray(current.savedVaults) ? current.savedVaults : [];
    if (list.includes(name)) return;
    const next = [...list, name];
    await saveSettings({ savedVaults: next });
    renderSavedVaultsList(next);
    newVaultInput.value = "";
  });
  newVaultInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addVaultBtn.click();
  });
}

if (customCssApplyBtn && customCssInput) {
  customCssApplyBtn.addEventListener("click", async () => {
    const css = customCssInput.value.trim();
    await saveSettings({ customCss: css });
    const label = customCssApplyBtn.textContent;
    customCssApplyBtn.textContent = "Applied!";
    setTimeout(() => {
      customCssApplyBtn.textContent = label;
    }, 2000);
  });
}

caretStyleSelect.addEventListener("change", () => {
  saveSettings({ caretStyle: caretStyleSelect.value });
  optionsCaretStyle = caretStyleSelect.value;
  if (optionsFakeCaret) optionsFakeCaret.dataset.style = optionsCaretStyle;
  optionsScheduleCaretUpdate();
});

caretAnimationSelect.addEventListener("change", () => {
  saveSettings({ caretAnimation: caretAnimationSelect.value });
  optionsCaretAnimation = caretAnimationSelect.value;
  if (optionsFakeCaret) optionsFakeCaret.dataset.animation = optionsCaretAnimation;
  optionsScheduleCaretUpdate();
});

caretMovementSelect.addEventListener("change", () => {
  saveSettings({ caretMovement: caretMovementSelect.value });
  optionsCaretMovement = caretMovementSelect.value;
  if (optionsFakeCaret) optionsFakeCaret.dataset.movement = optionsCaretMovement;
  optionsScheduleCaretUpdate();
});

if (countDisplaySelect) {
  countDisplaySelect.addEventListener("change", () => {
    saveSettings({ countDisplay: countDisplaySelect.value });
    optionsCountDisplay = countDisplaySelect.value;
    optionsUpdateCounts();
  });
}

[defaultVaultInput, defaultFolderInput, importObsidianNoteName, importObsidianFolder].forEach((el) => {
  if (!el) return;
  el.addEventListener("blur", () => {
    saveSettings({
      defaultVault: defaultVaultInput ? defaultVaultInput.value.trim() : "",
      defaultFolder: defaultFolderInput ? defaultFolderInput.value.trim() : "",
      importObsidianNoteName: importObsidianNoteName.value.trim() || "Import From Onyx",
      importObsidianFolder: importObsidianFolder.value.trim()
    });
  });
});

[interfaceFontSelect, editorFontSelect, codeFontSelect].forEach((sel) => {
  sel.addEventListener("change", () => {
    showHideCustomFields();
    syncAndSave();
  });
});

[interfaceFontUrl, interfaceFontFamily, editorFontUrl, editorFontFamily, codeFontUrl, codeFontFamily].forEach((el) => {
  el.addEventListener("input", () => applyFonts(getSettingsFromForm()));
  el.addEventListener("blur", syncAndSave);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;

  if (changes[STORAGE_KEY]?.newValue) {
    optionsApplyStoredNoteSettings(changes[STORAGE_KEY].newValue || {});
  }

  if (changes[EDITOR_SETTINGS_KEY]?.newValue) {
    const s = changes[EDITOR_SETTINGS_KEY].newValue || {};
    if (s.sourceEnabled !== undefined || s.previewEnabled !== undefined) {
      const current = optionsGetPaneVisibility();
      optionsApplyPaneVisibility(
        s.sourceEnabled !== undefined ? s.sourceEnabled : current.sourceEnabled,
        s.previewEnabled !== undefined ? s.previewEnabled : current.previewEnabled
      );
    }
    if (s.showPaneHeaders !== undefined) optionsApplyHeaderVisibility(s.showPaneHeaders !== false);
    if (s.countDisplay !== undefined) {
      optionsCountDisplay = s.countDisplay || "both";
      optionsUpdateCounts();
    }
    if (s.syncScroll !== undefined) optionsSyncScrollEnabled = s.syncScroll === true;
    if (s.caretStyle) {
      optionsCaretStyle = s.caretStyle;
      if (optionsFakeCaret) optionsFakeCaret.dataset.style = optionsCaretStyle;
    }
    if (s.caretAnimation) {
      optionsCaretAnimation = s.caretAnimation;
      if (optionsFakeCaret) optionsFakeCaret.dataset.animation = optionsCaretAnimation;
    }
    if (s.caretMovement) {
      optionsCaretMovement = s.caretMovement;
      if (optionsFakeCaret) optionsFakeCaret.dataset.movement = optionsCaretMovement;
    }
    optionsScheduleCaretUpdate();
  }
});

loadSettings().then(() => {
  initOptionsEditor();
  initTabs();
  initCustomSelects();
  if (window.location.hash === "#section-fonts") {
    setActiveTab("settings", { updateHash: false });
    document.getElementById("section-fonts")?.scrollIntoView({ behavior: "smooth" });
    showHideCustomFields();
  }
  if (window.location.hash === "#section-saved-vaults") {
    setActiveTab("settings", { updateHash: false });
    document.getElementById("section-saved-vaults")?.scrollIntoView({ behavior: "smooth" });
  }
});
