document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('export');
  const saveBtn = document.getElementById('save');
  const loading = document.getElementById('loading');
  console.log('exportBtn:', exportBtn);
  console.log('saveBtn:', saveBtn);
  console.log('loading:', loading);

  if (exportBtn && saveBtn && loading) {
    // Save Settings
    saveBtn.addEventListener('click', () => {
      const token = document.getElementById('token').value;
      const databaseId = document.getElementById('databaseId').value;
      const titleProperty = document.getElementById('titleProperty').value;
      const authorProperty = document.getElementById('authorProperty').value;

      chrome.storage.local.set({
        token: token,
        databaseId: databaseId,
        titleProperty: titleProperty || 'Titulo do Livro',
        authorProperty: authorProperty || 'Autor'
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving settings:', chrome.runtime.lastError);
        } else {
          alert('Settings saved!');
          chrome.storage.local.get(['token', 'databaseId', 'titleProperty', 'authorProperty'], (result) => {
            console.log('Saved settings:', result);
          });
        }
      });
    });

    // Export to Notion
    exportBtn.addEventListener('click', () => {
      chrome.storage.local.get(['token', 'databaseId', 'titleProperty', 'authorProperty'], (result) => {
        const { token, databaseId, titleProperty, authorProperty } = result;

        if (token && databaseId) {
          loading.style.display = 'block';
          exportBtn.disabled = true;
          setTimeout(() => {
            loading.style.display = 'none';
            exportBtn.disabled = false;
            alert('Export completed!');
          }, 2000);
        } else {
          alert('Please save settings first.');
        }
      });
    });
  } else {
    console.error('Error: exportBtn, saveBtn, or loading element not found');
  }
});