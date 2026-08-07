import { logger } from "./logger";

/**
 * Safely dispatches a message via chrome.runtime.sendMessage,
 * silently ignoring extension context invalidation errors during development or tab reloads.
 */
export async function safeSendMessage<T = unknown>(message: unknown): Promise<T | null> {
  try {
    if (!chrome.runtime?.id) {
      return null;
    }
    return (await chrome.runtime.sendMessage(message)) as T;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Extension context invalidated") ||
        error.message.includes("Could not establish connection") ||
        error.message.includes("Receiving end does not exist"))
    ) {
      // Extension was reloaded or context invalidated; ignore silently
      return null;
    }
    logger.error("Failed to send runtime message:", error);
    return null;
  }
}
