const IS_DEV = Boolean(import.meta.env.DEV);

export const logger = {
  debug(...args: unknown[]) {
    if (IS_DEV) console.debug("[DEBUG]", ...args);
  },

  info(...args: unknown[]) {
    if (IS_DEV) console.log("[INFO]", ...args);
  },

  warn(...args: unknown[]) {
    if (IS_DEV) console.warn("[WARN]", ...args);
  },

  error(...args: unknown[]) {
    console.error("[ERROR]", ...args);
  },
};