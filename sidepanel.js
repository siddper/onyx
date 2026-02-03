const vaultInput = document.getElementById("vaultInput");
const titleInput = document.getElementById("titleInput");
const folderInput = document.getElementById("folderInput");
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
    folder: folderInput.value.trim(),
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
  const folder = folderInput.value.trim();
  const content = markdownInput.value;

  await saveSettings({ title, folder, content });

  const obsidianUrl = buildObsidianUrl({ vault, title, content, folder });
  chrome.tabs.create({ url: obsidianUrl });
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
  saveSettings();
}

markdownInput.addEventListener("keydown", (e) => {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const hasSelection = start !== end;
  const value = markdownInput.value;
  const openChar = WRAP_OPEN[e.key] ?? e.key;
  const closeChar = WRAP_CLOSE[openChar] ?? WRAP_CLOSE[e.key];

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
