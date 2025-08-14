console.log("Content script loaded");

chrome.runtime.onMessage.addEventListener((message, sender, sendResponse) => {
  if (message.action === 'export') {
    console.log("Export message received");
    const title = document.querySelector('h3.kp-notebook-metadata')?.textContent.trim() || 'Unknown Title';
    const author = document.querySelector('p.kp-notebook-metadata')?.textContent.trim() || 'Unknown Author';
    const coverUrl = document.querySelector('img.kp-notebook-cover-image-border')?.src || '';

    const highlights = [];
    const highlightElements = document.querySelectorAll('.kp-notebook-highlight');
    highlightElements.forEach(highlight => {
      const text = highlight.querySelector('#highlight')?.textContent.trim() || '';
      const colorClass = Array.from(highlight.classList).find(cls => cls.startsWith('kp-notebook-highlight-'));
      const color = colorClass ? colorClass.split('-').pop() : 'default';
      let note = '';
      const nextSibling = highlight.nextElementSibling;
      if (nextSibling && nextSibling.classList.contains('kp-notebook-note')) {
        note = nextSibling.querySelector('#note')?.textContent.trim() || '';
      }
      highlights.push({ text, color, note });
    });

    const data = { title, author, coverUrl, highlights };
    chrome.runtime.sendMessage({ action: 'sendToNotion', data }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending to background:', chrome.runtime.lastError);
        sendResponse({ status: 'Error: Failed to send data to background' });
      } else {
        sendResponse(response);
      }
    });
    return true; // Keep the channel open for async response
  }
});