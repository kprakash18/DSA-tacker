import { logger } from "../shared/utils/logger";

const ACTIVE_ICONS = {
  16: "icons/active/icon16.png",
  32: "icons/active/icon32.png",
  48: "icons/active/icon48.png",
  128: "icons/active/icon128.png",
};

const INACTIVE_ICONS = {
  16: "icons/inactive/icon16.png",
  32: "icons/inactive/icon32.png",
  48: "icons/inactive/icon48.png",
  128: "icons/inactive/icon128.png",
};

export function isSupportedPlatformUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      host === "leetcode.com" ||
      host.endsWith(".leetcode.com") ||
      host === "geeksforgeeks.org" ||
      host.endsWith(".geeksforgeeks.org")
    );
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
    } catch (err) {
      logger.debug("Failed to get tab info for icon update:", err);
      return;
    }
  }

  const isActive = isSupportedPlatformUrl(targetUrl);
  const path = isActive ? ACTIVE_ICONS : INACTIVE_ICONS;

  try {
    await chrome.action.setIcon({
      tabId,
      path,
    });
  } catch (err) {
    logger.debug("Failed to set tab icon:", err);
  }
}

const openSidePanelTabs = new Set<number>();

export function initTabIconManager(): void {
  // Track open side panel ports to know which tabs currently have the side panel open
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name.startsWith("SIDEPANEL_")) {
      const tabId = parseInt(port.name.replace("SIDEPANEL_", ""), 10);
      if (!isNaN(tabId)) {
        openSidePanelTabs.add(tabId);
        logger.info(`Side panel opened for tab ${tabId}`);

        port.onDisconnect.addListener(() => {
          openSidePanelTabs.delete(tabId);
          logger.info(`Side panel closed for tab ${tabId}`);
        });
      }
    }
  });

  // Disable automatic open on action click so onClicked listener can filter by site support
  try {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
  } catch (err) {
    logger.debug("Failed to set panel behavior:", err);
  }

  // Update icon on tab activation (user switching tabs)
  chrome.tabs.onActivated.addListener((activeInfo) => {
    updateTabIcon(activeInfo.tabId);
  });

  // Update icon on tab URL changes or page loads
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.status === "complete") {
      updateTabIcon(tabId, tab.url || changeInfo.url);
    }
  });

  // Update icon on window focus changes
  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) return;
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs[0]?.id) {
        updateTabIcon(tabs[0].id, tabs[0].url);
      }
    });
  });

  // Toggle side panel on extension icon click ONLY for supported platforms (LeetCode / GFG)
  chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;
    let targetUrl = tab.url;

    if (!targetUrl) {
      try {
        const fullTab = await chrome.tabs.get(tab.id);
        targetUrl = fullTab.url;
      } catch (err) {
        logger.debug("Failed to retrieve tab URL on action click:", err);
      }
    }

    if (isSupportedPlatformUrl(targetUrl)) {
      const isOpen = openSidePanelTabs.has(tab.id);

      if (isOpen) {
        if (typeof chrome.sidePanel.close === "function") {
          try {
            await chrome.sidePanel.close({ tabId: tab.id });
            openSidePanelTabs.delete(tab.id);
            logger.info(`Closed side panel for tab ${tab.id}`);
          } catch (err) {
            logger.debug("Failed to close side panel by tabId, trying windowId:", err);
            if (tab.windowId) {
              try {
                await chrome.sidePanel.close({ windowId: tab.windowId });
              } catch (windowErr) {
                logger.error("Failed to close side panel:", windowErr);
              }
            }
          }
        } else {
          logger.warn("chrome.sidePanel.close is not supported in this Chrome version");
        }
      } else {
        try {
          await chrome.sidePanel.open({ tabId: tab.id });
          logger.info(`Opened side panel for tab ${tab.id} (${targetUrl})`);
        } catch (err) {
          logger.error("Failed to open side panel:", err);
        }
      }
    } else {
      logger.info(`Extension icon clicked on unsupported site (${targetUrl}), action ignored`);
    }
  });

  // Initial sync of icons for all open tabs on background script startup
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        updateTabIcon(tab.id, tab.url);
      }
    }
  });

  logger.info("Tab Icon Manager initialized");
}

