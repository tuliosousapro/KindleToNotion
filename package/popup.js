document.addEventListener('DOMContentLoaded', () => {
  const tokenInput = document.getElementById('token');
  const databaseIdInput = document.getElementById('databaseId');
  const titlePropertyInput = document.getElementById('titleProperty');
  const authorPropertyInput = document.getElementById('authorProperty');
  const saveButton = document.getElementById('save');
  const exportButton = document.getElementById('export');
  const toggleTokenIcon = document.getElementById('toggleToken');
  const spinner = document.getElementById('spinner');
  const spinnerText = document.querySelector('.spinner-text');
  const spinnerIcon = document.querySelector('.spinner');
  const eyeIcon = toggleTokenIcon.querySelector('.eye-icon:not(.hidden)');
  const slashedEyeIcon = toggleTokenIcon.querySelector('.eye-icon.hidden');

  // Load saved settings
  chrome.storage.local.get(['token', 'databaseId', 'titleProperty', 'authorProperty'], (result) => {
    tokenInput.value = result.token || '';
    databaseIdInput.value = result.databaseId || '';
    titlePropertyInput.value = result.titleProperty || 'Título do Livro';
    authorPropertyInput.value = result.authorProperty || 'Autor';
    if (result.token) {
      tokenInput.type = 'password';
      eyeIcon.classList.add('hidden');
      slashedEyeIcon.classList.remove('hidden');
      console.log('Token loaded, set to password with slashed-eye icon');
    } else {
      console.log('No token, set to text with eye icon');
    }
  });

  // Toggle token visibility
  toggleTokenIcon.addEventListener('click', () => {
    if (tokenInput.type === 'password') {
      tokenInput.type = 'text';
      eyeIcon.classList.remove('hidden');
      slashedEyeIcon.classList.add('hidden');
      console.log('Toggled to visible: text, eye icon');
    } else {
      tokenInput.type = 'password';
      eyeIcon.classList.add('hidden');
      slashedEyeIcon.classList.remove('hidden');
      console.log('Toggled to hidden: password, slashed-eye icon');
    }
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const token = tokenInput.value;
    const databaseId = databaseIdInput.value;
    const titleProperty = titlePropertyInput.value;
    const authorProperty = authorPropertyInput.value;
    if (!databaseId.match(/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i)) {
      spinner.classList.remove('hidden');
      spinnerIcon.classList.add('hidden');
      spinnerText.textContent = 'Error: Invalid Database ID format';
      setTimeout(() => {
        spinner.classList.add('hidden');
        spinnerText.textContent = '';
      }, 2000);
      return;
    }
    if (!titleProperty || !authorProperty) {
      spinner.classList.remove('hidden');
      spinnerIcon.classList.add('hidden');
      spinnerText.textContent = 'Error: Title and Author property names are required';
      setTimeout(() => {
        spinner.classList.add('hidden');
        spinnerText.textContent = '';
      }, 2000);
      return;
    }
    chrome.storage.local.set({ token, databaseId, titleProperty, authorProperty }, () => {
      spinner.classList.remove('hidden');
      spinnerIcon.classList.add('hidden');
      spinnerText.textContent = 'Settings saved!';
      tokenInput.type = 'password';
      eyeIcon.classList.add('hidden');
      slashedEyeIcon.classList.remove('hidden');
      console.log('Settings saved, token masked with slashed-eye icon');
      setTimeout(() => {
        spinner.classList.add('hidden');
        spinnerText.textContent = '';
      }, 2000);
    });
  });

  // Export to Notion
  exportButton.addEventListener('click', () => {
    spinner.classList.remove('hidden');
    spinnerIcon.classList.remove('hidden');
    spinnerText.textContent = 'Exporting...';
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url.startsWith('https://ler.amazon.com.br/notebook') || tabs[0].url.startsWith('https://read.amazon.com/notebook')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'export' }, (response) => {
          spinner.classList.remove('hidden');
          spinnerIcon.classList.add('hidden');
          if (chrome.runtime.lastError) {
            spinnerText.textContent = 'Error: Could not connect to content script';
          } else if (response && response.status) {
            spinnerText.textContent = response.status;
          } else {
            spinnerText.textContent = 'Error: Invalid response from content script';
          }
          setTimeout(() => {
            spinner.classList.add('hidden');
            spinnerText.textContent = '';
          }, 2000);
        });
      } else {
        spinner.classList.remove('hidden');
        spinnerIcon.classList.add('hidden');
        spinnerText.textContent = 'Error: Not on a Kindle notes page';
        setTimeout(() => {
          spinner.classList.add('hidden');
          spinnerText.textContent = '';
        }, 2000);
      }
    });
  });
});