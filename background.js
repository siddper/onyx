chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  // Editor first (above), then Obsidian
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
    const { obsidianSettings } = await chrome.storage.sync.get("obsidianSettings");
    const vault = obsidianSettings?.vault?.trim() || "";
    const params = [
      `vault=${encodeURIComponent(vault)}`,
      `name=${encodeURIComponent("Import from Markdown Editor")}`,
      `content=${encodeURIComponent(text)}`
    ];
    chrome.tabs.create({ url: `obsidian://new?${params.join("&")}` });
  }
});
