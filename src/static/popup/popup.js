document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const providerSelect = document.getElementById('provider');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  chrome.storage.sync.get(['apiKey', 'selectedProvider'], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
    if (result.selectedProvider) {
      providerSelect.value = result.selectedProvider.name.toLowerCase();
    }
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const provider = providerSelect.value;

    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    // Map provider values to the full provider objects
    const providers = {
      chatgpt: {
        name: 'ChatGPT',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4'
      },
      googleai: {
        name: 'Google AI',
        baseUrl: 'https://generativelanguage.googleapis.com',
        model: 'gemini-1.0-pro'
      },
      groq: {
        name: 'Groq',
        baseUrl: 'https://api.groq.com/v1',
        model: 'mixtral-8x7b-32768'
      }
    };

    chrome.storage.sync.set({
      apiKey: apiKey,
      selectedProvider: providers[provider]
    }, () => {
      showStatus('Settings saved successfully!', 'success');
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
    }, 3000);
  }
}); 