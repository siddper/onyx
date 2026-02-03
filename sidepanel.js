const vaultInput = document.getElementById("vaultInput");
const titleInput = document.getElementById("titleInput");
const markdownInput = document.getElementById("markdownInput");
const markdownPreview = document.getElementById("markdownPreview");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const exportBtn = document.getElementById("exportBtn");
const status = document.getElementById("status");

function updatePreview() {
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

function buildObsidianUrl({ vault, title, content }) {
  const params = [
    `vault=${encodeObsidianParam(vault)}`,
    `name=${encodeObsidianParam(title)}`,
    `content=${encodeObsidianParam(content)}`
  ];
  return `obsidian://new?${params.join("&")}`;
}

async function loadSettings() {
  const data = await chrome.storage.sync.get(STORAGE_KEY);
  const settings = data[STORAGE_KEY] || {};
  vaultInput.value = settings.vault || "";
  titleInput.value = settings.title || "";
  markdownInput.value = settings.content || "";
}

async function applyPendingImport() {
  const { pendingImportToEditor } = await chrome.storage.local.get("pendingImportToEditor");
  if (pendingImportToEditor != null && pendingImportToEditor !== "") {
    markdownInput.value = pendingImportToEditor;
    await chrome.storage.local.remove("pendingImportToEditor");
    updatePreview();
    await saveSettings();
  }
}

async function saveSettings(extra = {}) {
  const payload = {
    vault: vaultInput.value.trim(),
    title: titleInput.value.trim(),
    content: markdownInput.value,
    ...extra
  };
  await chrome.storage.sync.set({ [STORAGE_KEY]: payload });
}

saveSettingsBtn.addEventListener("click", async () => {
  await saveSettings();
  const label = saveSettingsBtn.textContent;
  saveSettingsBtn.textContent = "Saved!";
  setTimeout(() => {
    saveSettingsBtn.textContent = label;
  }, 2000);
});

exportBtn.addEventListener("click", async () => {
  const vault = vaultInput.value.trim();
  if (!vault) {
    setStatus("Enter a vault name first.");
    vaultInput.focus();
    return;
  }

  const title = normalizeTitle(titleInput.value);
  const content = markdownInput.value;

  await saveSettings({ title, content });

  const obsidianUrl = buildObsidianUrl({ vault, title, content });
  chrome.tabs.create({ url: obsidianUrl });
});

markdownInput.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const spaces = "    ";
    const before = markdownInput.value.slice(0, start);
    const after = markdownInput.value.slice(end);
    markdownInput.value = before + spaces + after;
    markdownInput.selectionStart = markdownInput.selectionEnd = start + spaces.length;
    updatePreview();
    saveSettings();
  }
});

markdownInput.addEventListener("input", () => {
  updatePreview();
  saveSettings();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.pendingImportToEditor?.newValue != null) {
    markdownInput.value = changes.pendingImportToEditor.newValue;
    updatePreview();
    saveSettings();
    chrome.storage.local.remove("pendingImportToEditor");
  }
});

loadSettings().then(() => {
  updatePreview();
  applyPendingImport();
});
