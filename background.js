// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'ai-assistant-parent',
    title: 'AI Assistant',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'summarize',
    parentId: 'ai-assistant-parent',
    title: 'Summarize this text',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'analyze',
    parentId: 'ai-assistant-parent',
    title: 'Analyze this text',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'blog-post',
    parentId: 'ai-assistant-parent',
    title: 'Write a blog post',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'suno-gpt',
    parentId: 'ai-assistant-parent',
    title: 'Send to Suno Song GPT',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selectedText = info.selectionText;
  
  if (info.menuItemId === 'suno-gpt') {
    const sunoUrl = 'https://chatgpt.com/g/g-OYOzC7DAv-suno-prompt-maestro';
    chrome.tabs.create({ url: sunoUrl }, (newTab) => {
      chrome.storage.local.set({ 
        pendingText: selectedText,
        targetTabId: newTab.id 
      });
    });
    return;
  }

  const settings = await chrome.storage.local.get(['apiKey', 'outputMode']);
  
  if (!settings.apiKey) {
    chrome.sidePanel.open({ tabId: tab.id });
    chrome.runtime.sendMessage({
      type: 'error',
      message: 'Please set your OpenAI API key in the extension settings.'
    });
    return;
  }

  let systemPrompt = '';
  switch(info.menuItemId) {
    case 'summarize':
      systemPrompt = 'Summarize the following text concisely:';
      break;
    case 'analyze':
      systemPrompt = 'Analyze the following text in detail:';
      break;
    case 'blog-post':
      systemPrompt = 'Write a comprehensive blog post based on the following information:';
      break;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: selectedText }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const aiResponse = data.choices[0].message.content;

    const outputMode = settings.outputMode || 'both';
    
    if (outputMode === 'sidepanel' || outputMode === 'both') {
      chrome.sidePanel.open({ tabId: tab.id });
      chrome.runtime.sendMessage({
        type: 'response',
        content: aiResponse,
        prompt: systemPrompt,
        original: selectedText
      });
    }
    
    if (outputMode === 'clipboard' || outputMode === 'both') {
      await navigator.clipboard.writeText(aiResponse);
    }

  } catch (error) {
    chrome.sidePanel.open({ tabId: tab.id });
    chrome.runtime.sendMessage({
      type: 'error',
      message: error.message
    });
  }
});

// Listen for tab updates to inject text into Suno GPT
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('chatgpt.com/g/g-OYOzC7DAv')) {
    const data = await chrome.storage.local.get(['pendingText', 'targetTabId']);
    
    if (data.pendingText && data.targetTabId === tabId) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (text) => {
          const interval = setInterval(() => {
            const textarea = document.querySelector('textarea[placeholder*="Message"]');
            if (textarea) {
              textarea.value = text;
              textarea.dispatchEvent(new Event('input', { bubbles: true }));
              clearInterval(interval);
            }
          }, 500);
          
          setTimeout(() => clearInterval(interval), 10000);
        },
        args: [data.pendingText]
      });
      
      chrome.storage.local.remove(['pendingText', 'targetTabId']);
    }
  }
});
