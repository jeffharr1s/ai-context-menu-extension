// Load saved settings
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await chrome.storage.local.get(['apiKey', 'outputMode']);
  
  if (settings.apiKey) {
    document.getElementById('apiKey').value = settings.apiKey;
  }
  
  if (settings.outputMode) {
    document.getElementById('outputMode').value = settings.outputMode;
  }
});

// Save settings
document.getElementById('save').addEventListener('click', async () => {
  const apiKey = document.getElementById('apiKey').value.trim();
  const outputMode = document.getElementById('outputMode').value;
  
  if (!apiKey) {
    showStatus('Please enter an API key', 'error');
    return;
  }
  
  await chrome.storage.local.set({ apiKey, outputMode });
  showStatus('Settings saved successfully!', 'success');
});

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}
