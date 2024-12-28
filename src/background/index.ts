// Listen for install and update events
chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Summary Extension installed");
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_SETTINGS") {
    chrome.storage.sync.get(["apiKey", "selectedProvider"], (result) => {
      sendResponse(result);
    });
    return true; // Will respond asynchronously
  }
});
