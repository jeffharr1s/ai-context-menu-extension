chrome.runtime.onMessage.addListener((message) => {
  const content = document.getElementById('content');
  
  if (message.type === 'response') {
    content.innerHTML = `
      <div class="response-container">
        <div class="prompt">${message.prompt}</div>
        <div class="original"><strong>Original text:</strong><br>${message.original}</div>
        <div class="ai-response">${message.content}</div>
      </div>
    `;
  } else if (message.type === 'error') {
    content.innerHTML = `
      <div class="error">
        <strong>Error:</strong> ${message.message}
      </div>
    `;
  }
});
