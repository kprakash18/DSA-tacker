# Privacy Policy for Problem Tracker Chrome Extension

**Last Updated: August 7, 2026**

## 1. Overview
**Problem Tracker** ("the Extension") is committed to respecting your privacy. This Extension is designed to operate locally on your device to help you track your coding problem-solving progress on supported platforms (such as LeetCode).

## 2. Information Collection and Use
- **No Personal Data Collection**: The Extension does **NOT** collect, store, or transmit any personally identifiable information (PII), login credentials, email addresses, or personal data.
- **Local Data Storage Only**: All problem tracking history, bookmarks, notes, and statistics are stored exclusively in your web browser using standard Chrome Storage APIs (`chrome.storage.local` and `chrome.storage.session`).
- **No Third-Party Analytics or Remote Servers**: The Extension does not connect to any external tracking servers, analytics services, or third-party APIs. Your data never leaves your local browser.

## 3. Permissions
The Extension requests the following browser permissions strictly for core functionality:
- `storage`: Required to save your problem solving history, statistics, and "To Solve" queue locally.
- `sidePanel`: Required to render the extension dashboard and navigation views in Chrome's side panel drawer.
- `tabs`: Required to detect when you navigate to supported problem pages (e.g. `leetcode.com`) to update tab state icons.
- `host_permissions` (`https://leetcode.com/*`): Required to inspect problem details and judge completion on LeetCode pages.

## 4. Third-Party Web Sites
The Extension interacts with supported coding platform websites (such as LeetCode) to read DOM metadata when you view or submit problems. We have no control over and assume no responsibility for the privacy policies or practices of third-party websites.

## 5. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. Any changes will be published in this repository.

## 6. Contact
If you have any questions or feedback regarding this Privacy Policy, please open an issue in the official GitHub repository:
https://github.com/kprakash18/DSA-tacker
