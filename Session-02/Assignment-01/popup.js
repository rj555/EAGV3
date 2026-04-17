document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleExtension');

  // Load saved state
  chrome.storage.local.get(['extensionEnabled'], (result) => {
    // Default to true if not set
    toggle.checked = result.extensionEnabled !== false;
  });

  // Save state on change
  toggle.addEventListener('change', () => {
    chrome.storage.local.set({ extensionEnabled: toggle.checked });
  });
});
