const colorMap = {
  'blue': 'blue_background',
  'yellow': 'yellow_background',
  'green': 'green_background',
  'red': 'red_background',
  'default': 'gray_background'
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendToNotion') {
    (async () => {
      try {
        const { token, databaseId, titleProperty, authorProperty } = await chrome.storage.local.get(['token', 'databaseId', 'titleProperty', 'authorProperty']);
        if (!token || !databaseId) {
          sendResponse({ status: 'Error: Missing Notion token or database ID' });
          return;
        }
        if (!titleProperty || !authorProperty) {
          sendResponse({ status: 'Error: Missing title or author property names' });
          return;
        }

        const { title, author, coverUrl, highlights, highlightCount, noteCount } = message.data;

        // Convert highlights to Notion blocks
        const allChildren = highlights.map(({ text, color, note }) => {
          const notionColor = colorMap[color] || 'gray_background';
          const blocks = [{
            type: 'quote',
            quote: {
              rich_text: [{ text: { content: text } }],
              color: notionColor
            }
          }];
          if (note) {
            blocks.push({
              type: 'paragraph',
              paragraph: {
                rich_text: [{ text: { content: note } }]
              }
            });
          }
          return blocks;
        }).flat();

        // Add count block at the top
        const countBlock = {
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: { content: `${highlightCount} Destaque(s) | ${noteCount} Nota(s)` },
                annotations: { bold: true }
              }
            ]
          }
        };

        // Split into batches of 100, including count block in the first batch
        const batches = [];
        const firstBatch = [countBlock, ...allChildren.slice(0, 99)];
        batches.push(firstBatch);
        for (let i = 99; i < allChildren.length; i += 100) {
          batches.push(allChildren.slice(i, i + 100));
        }

        // Create the page with the first batch
        const createPayload = {
          parent: { database_id: databaseId },
          properties: {
            [titleProperty]: { title: [{ text: { content: title } }] },
            [authorProperty]: { rich_text: [{ text: { content: author } }] }
          },
          cover: coverUrl ? { type: 'external', external: { url: coverUrl } } : null,
          children: firstBatch
        };

        const createResponse = await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          },
          body: JSON.stringify(createPayload)
        });

        const createData = await createResponse.json();
        if (createData.object !== 'page') {
          throw new Error('Failed to create page: ' + JSON.stringify(createData));
        }

        const pageId = createData.id;

        // Append remaining batches
        for (let i = 1; i < batches.length; i++) {
          const appendResponse = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({ children: batches[i] })
          });
          if (!appendResponse.ok) {
            throw new Error('Failed to append blocks: ' + await appendResponse.text());
          }
        }

        sendResponse({ status: `Export successful! ${highlightCount} Destaque(s) | ${noteCount} Nota(s)` });
      } catch (error) {
        sendResponse({ status: 'Error: ' + error.message });
      }
    })();
    return true; // Keep the channel open for async response
  }
});