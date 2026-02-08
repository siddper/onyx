const vaultInput = document.getElementById("vaultInput");
const titleInput = document.getElementById("titleInput");
const folderInput = document.getElementById("folderInput");
const markdownInput = document.getElementById("markdownInput");
const markdownPreview = document.getElementById("markdownPreview");
const exportBtn = document.getElementById("exportBtn");
const status = document.getElementById("status");
const settingsBtn = document.getElementById("settingsBtn");
const editorWrap = document.getElementById("editorWrap");
const editorResizer = document.getElementById("editorResizer");
const customFontsEl = document.getElementById("customFonts");
const editorCaretWrap = document.querySelector(".editor-caret-wrap");
const editorCaretMirror = document.getElementById("editorCaretMirror");
const editorFakeCaret = document.getElementById("editorFakeCaret");

const EDITOR_SETTINGS_KEY = "editorSettings";
let caretStyle = "line";
let caretAnimation = "blink";
let caretMovement = "instant";
let editorFont = "inter";
let caretBlinkTimer = null;
let caretVisible = true;

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

async function loadEditorSettings() {
  const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const editorSettings = data[EDITOR_SETTINGS_KEY] || {};
  const previewEnabled = editorSettings.previewEnabled !== false;
  caretStyle = editorSettings.caretStyle || "line";
  caretAnimation = editorSettings.caretAnimation || "blink";
  caretMovement = editorSettings.caretMovement || "instant";
  editorFont = editorSettings.editorFont || "inter";
  if (editorFakeCaret) {
    editorFakeCaret.dataset.style = caretStyle;
    editorFakeCaret.dataset.animation = caretAnimation;
    editorFakeCaret.dataset.movement = caretMovement;
  }
  applyPreviewVisibility(previewEnabled);
  applyFonts(editorSettings);
  applyTheme(editorSettings.theme || "system", editorSettings.customThemes);
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
  const rawCss = typeof editorSettings.customCss === "string" ? editorSettings.customCss : "";
  if (rawCss) {
    document.body.classList.add("custom-css-loaded");
    const wrapped = rawCss.replace(/([^{]+)\{/g, (_, selectors) => {
      const s = selectors.trimStart();
      if (s.startsWith("@")) return selectors + "{";
      const prefixed = s.split(",").map((sel) => "body.custom-css-loaded " + sel.trim()).join(", ");
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
    document.body.classList.remove("custom-css-loaded");
    const customCssEl = document.getElementById("customCss");
    if (customCssEl) customCssEl.textContent = "";
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

  const fontSubmenu = [
    { id: "inter", label: "Inter", getChecked: () => editorFont === "inter", value: "inter" },
    { id: "jetbrains-mono", label: "JetBrains Mono", getChecked: () => editorFont === "jetbrains-mono", value: "jetbrains-mono" },
    { id: "geist-mono", label: "Geist Mono", getChecked: () => editorFont === "geist-mono", value: "geist-mono" },
    { id: "custom", label: "Custom", getChecked: () => editorFont === "custom", value: "custom" }
  ];

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
  ];

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
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes[EDITOR_SETTINGS_KEY]?.newValue) {
    const s = changes[EDITOR_SETTINGS_KEY].newValue;
    applyPreviewVisibility(s.previewEnabled !== false);
    applyFonts(s);
    applyTheme(s.theme || "system", s.customThemes);
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
    const rawCss = typeof s.customCss === "string" ? s.customCss : "";
    if (rawCss) {
      document.body.classList.add("custom-css-loaded");
      const wrapped = rawCss.replace(/([^{]+)\{/g, (_, selectors) => {
        const s = selectors.trimStart();
        if (s.startsWith("@")) return selectors + "{";
        const prefixed = s.split(",").map((sel) => "body.custom-css-loaded " + sel.trim()).join(", ");
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
      document.body.classList.remove("custom-css-loaded");
      const customCssEl = document.getElementById("customCss");
      if (customCssEl) customCssEl.textContent = "";
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

loadSettings()
  .then(() => loadEditorSettings())
  .then(() => {
    updatePreview();
    applyPendingImport();
    scheduleCaretUpdate();
  });
