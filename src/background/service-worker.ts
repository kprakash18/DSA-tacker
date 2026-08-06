console.log("Problem Tracker Background Started");

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
});