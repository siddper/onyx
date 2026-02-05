const EDITOR_SETTINGS_KEY = "editorSettings";

const FONT_PRESETS = [
  { id: "inter", label: "Inter", fontFamily: '"Inter", sans-serif' },
  { id: "jetbrains-mono", label: "JetBrains Mono", fontFamily: '"JetBrains Mono", monospace' },
  { id: "geist-mono", label: "Geist Mono", fontFamily: '"Geist Mono", monospace' },
  { id: "custom", label: "Custom (paste URL below)", fontFamily: null }
];

const previewToggle = document.getElementById("previewToggle");
const cornersToggle = document.getElementById("cornersToggle");
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

const caretStyleSelect = document.getElementById("caretStyleSelect");
const caretAnimationSelect = document.getElementById("caretAnimationSelect");
const caretMovementSelect = document.getElementById("caretMovementSelect");

function getSettingsFromForm() {
  return {
    previewEnabled: previewToggle.checked,
    cornersRounded: cornersToggle.checked,
    caretStyle: caretStyleSelect.value,
    caretAnimation: caretAnimationSelect.value,
    caretMovement: caretMovementSelect.value,
    interfaceFont: interfaceFontSelect.value,
    editorFont: editorFontSelect.value,
    codeFont: codeFontSelect.value,
    interfaceFontUrl: interfaceFontUrl.value.trim(),
    interfaceFontFamily: interfaceFontFamily.value.trim(),
    editorFontUrl: editorFontUrl.value.trim(),
    editorFontFamily: editorFontFamily.value.trim(),
    codeFontUrl: codeFontUrl.value.trim(),
    codeFontFamily: codeFontFamily.value.trim()
  };
}

function applyFonts(settings) {
  const s = settings || getSettingsFromForm();
  const imports = [];
  if (s.interfaceFont === "custom" && s.interfaceFontUrl) imports.push(normalizeFontUrl(s.interfaceFontUrl));
  if (s.editorFont === "custom" && s.editorFontUrl && s.editorFontUrl !== s.interfaceFontUrl) imports.push(normalizeFontUrl(s.editorFontUrl));
  const codeUrl = s.codeFontUrl?.trim();
  if (s.codeFont === "custom" && codeUrl && codeUrl !== s.interfaceFontUrl?.trim() && codeUrl !== s.editorFontUrl?.trim()) imports.push(normalizeFontUrl(s.codeFontUrl));
  customFontsEl.textContent = imports.join("\n");

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

function showHideCustomFields() {
  interfaceFontCustom.hidden = interfaceFontSelect.value !== "custom";
  editorFontCustom.hidden = editorFontSelect.value !== "custom";
  codeFontCustom.hidden = codeFontSelect.value !== "custom";
}

async function loadSettings() {
  const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const s = data[EDITOR_SETTINGS_KEY] || {};
  previewToggle.checked = s.previewEnabled !== false;
  cornersToggle.checked = s.cornersRounded !== false;
  document.documentElement.classList.toggle("corners-sharp", !cornersToggle.checked);
  caretStyleSelect.value = s.caretStyle || "line";
  caretAnimationSelect.value = s.caretAnimation || "blink";
  caretMovementSelect.value = s.caretMovement || "instant";
  interfaceFontSelect.value = s.interfaceFont || "inter";
  editorFontSelect.value = s.editorFont || "inter";
  codeFontSelect.value = s.codeFont || "jetbrains-mono";
  interfaceFontUrl.value = s.interfaceFontUrl || "";
  interfaceFontFamily.value = s.interfaceFontFamily || "";
  editorFontUrl.value = s.editorFontUrl || "";
  editorFontFamily.value = s.editorFontFamily || "";
  codeFontUrl.value = s.codeFontUrl || "";
  codeFontFamily.value = s.codeFontFamily || "";
  showHideCustomFields();
  applyFonts(s);
}

async function saveSettings(partial) {
  const data = await chrome.storage.sync.get(EDITOR_SETTINGS_KEY);
  const current = data[EDITOR_SETTINGS_KEY] || {};
  await chrome.storage.sync.set({ [EDITOR_SETTINGS_KEY]: { ...current, ...partial } });
}

function syncAndSave() {
  const s = getSettingsFromForm();
  applyFonts(s);
  saveSettings(s);
}

populateFontSelects();

previewToggle.addEventListener("change", () => {
  saveSettings({ previewEnabled: previewToggle.checked });
});

cornersToggle.addEventListener("change", () => {
  document.documentElement.classList.toggle("corners-sharp", !cornersToggle.checked);
  saveSettings({ cornersRounded: cornersToggle.checked });
});

caretStyleSelect.addEventListener("change", () => {
  saveSettings({ caretStyle: caretStyleSelect.value });
});

caretAnimationSelect.addEventListener("change", () => {
  saveSettings({ caretAnimation: caretAnimationSelect.value });
});

caretMovementSelect.addEventListener("change", () => {
  saveSettings({ caretMovement: caretMovementSelect.value });
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

loadSettings();
