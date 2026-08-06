import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "Problem Tracker",

  description: "Automatically track LeetCode and GeeksforGeeks problems.",

  version: "1.0.0",

  permissions: ["storage", "sidePanel"],

  host_permissions: [
    "https://leetcode.com/*",
    "https://www.geeksforgeeks.org/*",
  ],

  action: {
    default_title: "Problem Tracker",
  },

  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },

  side_panel: {
    default_path: "sidepanel.html",
  },
  content_scripts: [
    {
      matches: ["https://leetcode.com/problems/*"],
      js: ["src/platforms/leetcode/index.ts"],
      run_at: "document_idle",
    },
  ],
});