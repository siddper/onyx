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
  setStatus("Saved settings.");
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

markdownInput.addEventListener("input", () => {
  updatePreview();
  saveSettings();
});

loadSettings();
updatePreview();
