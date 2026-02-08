const EDITOR_SETTINGS_KEY = "editorSettings";

const CUSTOM_SELECT_CHECK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="custom-select-option__check"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>';

const FONT_PRESETS = [
  { id: "inter", label: "Inter", fontFamily: '"Inter", sans-serif' },
  { id: "jetbrains-mono", label: "JetBrains Mono", fontFamily: '"JetBrains Mono", monospace' },
  { id: "geist-mono", label: "Geist Mono", fontFamily: '"Geist Mono", monospace' },
  { id: "custom", label: "Custom (paste URL below)", fontFamily: null }
];

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

const caretStyleSelect = document.getElementById("caretStyleSelect");
const caretAnimationSelect = document.getElementById("caretAnimationSelect");
const caretMovementSelect = document.getElementById("caretMovementSelect");
const importObsidianNoteName = document.getElementById("importObsidianNoteName");
const importObsidianFolder = document.getElementById("importObsidianFolder");

function getSettingsFromForm() {
  return {
    previewEnabled: previewToggle.checked,
    radiusPx: radiusSlider ? parseInt(radiusSlider.value, 10) : 8,
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
    codeFontFamily: codeFontFamily.value.trim(),
    importObsidianNoteName: importObsidianNoteName.value.trim(),
    importObsidianFolder: importObsidianFolder.value.trim()
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
    if (e && !wrap.contains(e.target)) return;
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
  previewToggle.checked = s.previewEnabled !== false;
  const radius = typeof s.radiusPx === "number" && s.radiusPx >= 0 && s.radiusPx <= 24 ? s.radiusPx : 8;
  applyRadius(radius);
  caretStyleSelect.value = s.caretStyle || "line";
  caretAnimationSelect.value = s.caretAnimation || "blink";
  caretMovementSelect.value = s.caretMovement || "instant";
  importObsidianNoteName.value = s.importObsidianNoteName ?? "Import From Markdown Editor";
  importObsidianFolder.value = s.importObsidianFolder ?? "";
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

if (radiusSlider) {
  radiusSlider.addEventListener("input", () => {
    const px = parseInt(radiusSlider.value, 10);
    applyRadius(px);
    saveSettings({ radiusPx: px });
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

[importObsidianNoteName, importObsidianFolder].forEach((el) => {
  el.addEventListener("blur", () => {
    saveSettings({
      importObsidianNoteName: importObsidianNoteName.value.trim() || "Import From Markdown Editor",
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
});
