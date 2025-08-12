document.addEventListener('DOMContentLoaded', () => {
  const tokenInput = document.getElementById('token');
  const databaseIdInput = document.getElementById('databaseId');
  const titlePropertyInput = document.getElementById('titleProperty');
  const authorPropertyInput = document.getElementById('authorProperty');
  const saveButton = document.getElementById('save');
  const exportButton = document.getElementById('export');
  const status = document.getElementById('status');
  const themeSelect = document.getElementById('themeSelect');
  const spinner = document.getElementById('spinner');

  // Load saved settings
  chrome.storage.local.get(['token', 'databaseId', 'titleProperty', 'authorProperty', 'theme'], (result) => {
    tokenInput.value = result.token || '';
    databaseIdInput.value = result.databaseId || '';
    titlePropertyInput.value = result.titleProperty || 'Título do Livro';
    authorPropertyInput.value = result.authorProperty || 'Autor';
    themeSelect.value = result.theme || 'default';
    applyTheme(themeSelect.value);
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const token = tokenInput.value;
    const databaseId = databaseIdInput.value;
    const titleProperty = titlePropertyInput.value;
    const authorProperty = authorPropertyInput.value;
    if (!databaseId.match(/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i)) {
      status.textContent = 'Error: Invalid Database ID format';
      return;
    }
    if (!titleProperty || !authorProperty) {
      status.textContent = 'Error: Title and Author property names are required';
      return;
    }
    chrome.storage.local.set({ token, databaseId, titleProperty, authorProperty, theme: themeSelect.value }, () => {
      status.textContent = 'Settings saved!';
    });
  });

  // Export to Notion
  exportButton.addEventListener('click', () => {
    status.textContent = 'Exporting...';
    spinner.style.display = 'block';
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url.startsWith('https://ler.amazon.com.br/notebook')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'export' }, (response) => {
          spinner.style.display = 'none';
          if (chrome.runtime.lastError) {
            status.textContent = 'Error: Could not connect to content script';
          } else if (response && response.status) {
            status.textContent = response.status;
          } else {
            status.textContent = 'Error: Invalid response from content script';
          }
        });
      } else {
        spinner.style.display = 'none';
        status.textContent = 'Error: Not on a Kindle notes page';
      }
    });
  });
  // Tema
  themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
    chrome.storage.local.set({ theme: e.target.value });
  });

  function applyTheme(theme) {
    document.body.classList.remove('retro-dark');
    if (theme === 'retro-dark') {
      document.body.classList.add('retro-dark');
    } else {
      document.body.classList.remove('retro-dark');
    }
  }
});