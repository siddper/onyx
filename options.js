const EDITOR_SETTINGS_KEY = "editorSettings";

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

function getSettingsFromForm() {
  return {
    theme: themeSelect ? themeSelect.value : "system",
    previewEnabled: previewToggle?.checked ?? true,
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
  });
}

const syncScrollToggle = document.getElementById("syncScrollToggle");
if (syncScrollToggle) {
  syncScrollToggle.addEventListener("change", () => {
    saveSettings({ syncScroll: syncScrollToggle.checked });
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
});

caretAnimationSelect.addEventListener("change", () => {
  saveSettings({ caretAnimation: caretAnimationSelect.value });
});

caretMovementSelect.addEventListener("change", () => {
  saveSettings({ caretMovement: caretMovementSelect.value });
});

if (countDisplaySelect) {
  countDisplaySelect.addEventListener("change", () => {
    saveSettings({ countDisplay: countDisplaySelect.value });
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

loadSettings().then(() => {
  initCustomSelects();
  if (window.location.hash === "#section-fonts") {
    document.getElementById("section-fonts")?.scrollIntoView({ behavior: "smooth" });
    showHideCustomFields();
  }
  if (window.location.hash === "#section-saved-vaults") {
    document.getElementById("section-saved-vaults")?.scrollIntoView({ behavior: "smooth" });
  }
});
