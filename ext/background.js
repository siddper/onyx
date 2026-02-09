chrome.commands.onCommand.addListener((command) => {
  if (command === "toggleToolbar") {
    chrome.runtime.sendMessage({ action: "toggleToolbar" }).catch(() => {});
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getActiveTab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
        return;
      }
      const tab = tabs[0];
      if (!tab || !tab.url) {
        sendResponse({ error: "No tab or URL" });
        return;
      }
      if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("about:")) {
        sendResponse({ error: "Can't access this page" });
        return;
      }
      sendResponse({ title: tab.title || tab.url, url: tab.url });
    });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  chrome.contextMenus.create({
    id: "importToEditor",
    title: "Import selection to Editor",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "importToObsidian",
    title: "Import selection to Obsidian",
    contexts: ["selection"]
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id) return;
  await chrome.sidePanel.open({ tabId: tab.id });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const text = info.selectionText?.trim() || "";
  if (!text || !tab?.id) return;

  if (info.menuItemId === "importToEditor") {
    await chrome.storage.local.set({ pendingImportToEditor: text });
    await chrome.sidePanel.open({ tabId: tab.id });
  } else if (info.menuItemId === "importToObsidian") {
    const [obsidian, editor] = await Promise.all([
      chrome.storage.sync.get("obsidianSettings"),
      chrome.storage.sync.get("editorSettings")
    ]);
    const vault = obsidian.obsidianSettings?.vault?.trim() || "";
    const noteName = (editor.editorSettings?.importObsidianNoteName ?? "").trim() || "Import From Onyx";
    const folder = (editor.editorSettings?.importObsidianFolder || "").trim();
    const filePath = folder ? `${folder.replace(/\/$/, "")}/${noteName}` : noteName;
    const params = [
      `vault=${encodeURIComponent(vault)}`,
      `file=${encodeURIComponent(filePath)}`,
      `content=${encodeURIComponent(text)}`
    ];
    chrome.tabs.create({ url: `obsidian://new?${params.join("&")}` });
  }
});
