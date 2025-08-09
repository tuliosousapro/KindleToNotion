<p align="center">
  <img src="https://github.com/tuliosousapro/Kindle-To-Notion-Extension/blob/main/docs/Leonardo_Phoenix_10_Create_a_banner_image_for_the_GitHub_repos_2.jpg?raw=true" alt="Kindle2Notion Banner" width="100%" />
</p>

<h1 align="center">Kindle To Notion Extension</h1>
<p align="center"><em>Export your Kindle highlights to Notion with a touch of retro fantasy magic.</em></p>
<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg">  <img src="https://img.shields.io/badge/Made%20with-JavaScript-blue">  <img src="https://img.shields.io/badge/Notion-API-blue">  <img src="https://img.shields.io/badge/Platform-Chrome%20Extension-green">  <img src="https://img.shields.io/github/issues/tuliosousapro/Kindle-To-Notion-Extension">  <img src="https://img.shields.io/github/stars/tuliosousapro/Kindle-To-Notion-Extension?style=social">
</p>



A Chrome extension to export highlights and notes from Amazon Kindle's notebook page (`https://read.amazon.com/notebook`), or if you are from Brazil (`https://ler.amazon.com.br/notebook`), to a Notion database.

## 🧙‍♂️Features
- Extracts book title, author, cover image, and highlights from Kindle.
- Supports highlight colors and associated notes.
- Exports data to a Notion database as a page with quotes and notes.
- Handles Notion API's 100-block limit by splitting requests into batches.
- Configurable database property names for flexibility.

## 🛠️Installation
1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select the folder containing the extension files.
5. The extension will appear in your Chrome toolbar.

## ⚙️Setup
1. Create a Notion integration:
   - Go to [Notion's Integrations page](https://www.notion.so/my-integrations).
   - Create a new integration and copy the "Internal Integration Token."
   - Share your target database with the integration (via the database's "Share" menu).
2. Open the extension's popup (click the extension icon in Chrome).
3. Enter:
   - **Notion API Token**: Your integration token.
   - **Notion Database ID**: Found in the database URL (e.g., `https://www.notion.so/f7979b5axerequinha2f8fa?v=796edexemplokabal79a096` → `f7979b5axerequinha2f8fa`).
   - **Title Property Name**: The exact name of your database's title property (e.g., `Título do Livro`).
   - **Author Property Name**: The exact name of your database's author property (e.g., `Autor`).
4. Click "Save Settings."

## 🚀Usage
1. Navigate to [ler.amazon.com.br/notebook](https://ler.amazon.com.br/notebook) in Chrome.
2. Open the extension popup and click "Export to Notion."
3. Check the status message in the popup for success or errors.
4. Verify the new page in your Notion database.

## 🧪Development
- **Files**:
  - `manifest.json`: Extension configuration.
  - `popup.html`/`popup.js`: User interface for settings and export.
  - `contentScript.js`: Extracts data from Kindle's notebook page.
  - `background.js`: Handles Notion API requests.
- **Dependencies**: None (pure JavaScript, no external libraries).
- **Debugging**:
  - Open Chrome's developer tools (F12) on the Kindle page for content script logs.
  - Inspect the background page (Right-click extension icon > "Manage Extensions" > "Inspect views: background page") for API logs.

## 🤝Contributing <img src="https://img.shields.io/github/contributors/tuliosousapro/Kindle-To-Notion-Extension">
We welcome contributions to improve this extension! To contribute:
1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request with a clear description of your changes.

Please ensure your code follows:
- JavaScript ES6+ standards.
- Chrome's Content Security Policy (no inline scripts).
- Clear commit messages and documentation.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Issues
Report bugs or suggest features by opening an issue in this repository.

## FAQ
> 💡 Curious how it works or have questions?
> <p> Browse the [📘 FAQ - Calabreso Edition](FAQ.MD) for answers, tips, and more.</p>
