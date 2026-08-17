import { logger } from "../shared/utils";

const ACTIVE_ICONS = { 16: "icons/active/icon16.png", 32: "icons/active/icon32.png", 48: "icons/active/icon48.png", 128: "icons/active/icon128.png" };
const INACTIVE_ICONS = { 16: "icons/inactive/icon16.png", 32: "icons/inactive/icon32.png", 48: "icons/inactive/icon48.png", 128: "icons/inactive/icon128.png" };

export function isSupportedPlatformUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "leetcode.com" || host.endsWith(".leetcode.com");
  } catch {
    return false;
  }
}

export async function updateTabIcon(tabId: number, url?: string): Promise<void> {
  let targetUrl = url;
  if (!targetUrl) {
    try {
      const tab = await chrome.tabs.get(tabId);
      targetUrl = tab.url;
    } catch {
      return;
    }
  }
  const path = isSupportedPlatformUrl(targetUrl) ? ACTIVE_ICONS : INACTIVE_ICONS;
  chrome.action.setIcon({ tabId, path }).catch(() => {});
}

const openSidePanelTabs = new Set<number>();

export function initTabIconManager(): void {
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name.startsWith("SIDEPANEL_")) {
      const tabId = parseInt(port.name.replace("SIDEPANEL_", ""), 10);
      if (!isNaN(tabId)) {
        openSidePanelTabs.add(tabId);
        port.onDisconnect.addListener(() => openSidePanelTabs.delete(tabId));
      }
    }
  });

  chrome.sidePanel.setPanelBehavior?.({ openPanelOnActionClick: false }).catch(() => {});

  chrome.tabs.onActivated.addListener((info) => updateTabIcon(info.tabId));
  chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (change.url || change.status === "complete") updateTabIcon(tabId, tab.url || change.url);
  });

  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) return;
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs[0]?.id) updateTabIcon(tabs[0].id, tabs[0].url);
    });
  });

  chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;
    let url = tab.url;
    if (!url) {
      try {
        url = (await chrome.tabs.get(tab.id)).url;
      } catch (err) {
        logger.debug("Failed to get tab url:", err);
      }
    }
    if (!isSupportedPlatformUrl(url)) return;

    if (openSidePanelTabs.has(tab.id)) {
      if (typeof chrome.sidePanel.close === "function") {
        try {
          await chrome.sidePanel.close({ tabId: tab.id });
          openSidePanelTabs.delete(tab.id);
        } catch {
          if (tab.windowId) {
            await chrome.sidePanel.close({ windowId: tab.windowId }).catch((err) => logger.debug("Close panel error:", err));
          }
        }
      }
    } else {
      chrome.sidePanel.open({ tabId: tab.id }).catch((err) => logger.error("Failed to open side panel:", err));
    }
  });

  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) if (tab.id) updateTabIcon(tab.id, tab.url);
  });
}


