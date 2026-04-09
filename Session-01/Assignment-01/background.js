// background.js

chrome.action.onClicked.addListener(async (tab) => {
  // Check if we can inject to this url
  if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("about:") || tab.url.startsWith("https://chrome.google.com/webstore")) {
    console.log("Cannot run on this page.");
    return;
  }

  // Toggle the extension within the specific tab via messaging
  try {
    const active = await getTabState(tab.id);
    const newState = !active;
    
    // Send message to content script to toggle state
    chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_TOOL", state: newState }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Script not yet loaded on this tab. Injecting now...");
        // If content script is not running yet (or page reloaded before it injected),
        // we manually inject it using chrome.scripting
        chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ["content.css"] }, () => {
          chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] }, () => {
             // Now that it's injected, it will auto request state, but let's send it explicitly
             setTabState(tab.id, newState);
             updateBadge(tab.id, newState);
             // Ensure it toggles after injection
             setTimeout(() => {
               chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_TOOL", state: newState });
             }, 100);
          });
        });
      } else {
        setTabState(tab.id, newState);
        // Change icon badge to show ON/OFF
        updateBadge(tab.id, newState);
      }
    });

  } catch (error) {
    console.error("Error toggling:", error);
  }
});

// Remove state when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`tabState_${tabId}`);
});

// Update state when page reloads so it restarts in OFF state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    setTabState(tabId, false);
    updateBadge(tabId, false);
  }
});

function getTabState(tabId) {
  return new Promise((resolve) => {
    chrome.storage.local.get(`tabState_${tabId}`, (result) => {
      resolve(result[`tabState_${tabId}`] || false);
    });
  });
}

function setTabState(tabId, state) {
  return new Promise((resolve) => {
    let obj = {};
    obj[`tabState_${tabId}`] = state;
    chrome.storage.local.set(obj, resolve);
  });
}

function updateBadge(tabId, state) {
  if (state) {
    chrome.action.setBadgeText({ text: "ON", tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50", tabId: tabId });
  } else {
    chrome.action.setBadgeText({ text: "", tabId: tabId });
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "CAPTURE_SCREEN") {
    // Take visible tab screenshot
    chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Error capturing screen:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }

      // Generate timestamp filename YYYYMMDD_HHMMSS
      const d = new Date();
      const pad = (num) => num.toString().padStart(2, '0');
      const filename = `Drawing_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.png`;

      // Trigger download
      chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        saveAs: true // This satisfies the 'prompt me to save' to a specific folder
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
           sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
           sendResponse({ success: true, downloadId: downloadId });
        }
      });
    });
    // Return true to indicate we will send a response asynchronously
    return true; 
  }

  if (message.action === "TOOL_TURNED_OFF") {
    // User triggered OFF from the in-page toolbar
    if (sender.tab && sender.tab.id) {
       setTabState(sender.tab.id, false);
       updateBadge(sender.tab.id, false);
    }
  }

  if (message.action === "REQUEST_TAB_STATE") {
    // Used by content script when it first loads to sync UI
    if (sender.tab && sender.tab.id) {
      getTabState(sender.tab.id).then((state) => {
        sendResponse({ state: state });
      });
      return true;
    }
  }

  if (message.action === "TOOL_TURNED_OFF_CANCELLED") {
    if (sender.tab && sender.tab.id) {
       setTabState(sender.tab.id, true);
       updateBadge(sender.tab.id, true);
    }
  }
});
