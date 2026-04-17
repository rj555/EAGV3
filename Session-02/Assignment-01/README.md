<p align="center">
  <img src="icon128.png" alt="ScripVision Logo" width="128" height="128" />
</p>

<h1 align="center">ScripVision</h1>

<p align="center">
  <strong>Deep Stock Analysis Powered by Gemini AI. Right inside your browser.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome&logoColor=white" alt="Chrome Extension"/>
  <img src="https://img.shields.io/badge/Powered%20by-Gemini%20AI-orange?logo=google&logoColor=white" alt="Gemini AI"/>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License"/>
</p>

---

**ScripVision** is a next-generation Google Chrome extension that leverages the immense power of the Gemini AI to deliver deep, actionable stock analysis right inside your browser. No more switching tabs or digging through endless financial statements — ScripVision brings the market intelligence directly to you, the moment you need it.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Instant Analysis** | Highlight any stock symbol or company name on any webpage, click the branded tooltip, and get a full analysis in seconds. |
| 📈 **Dynamic Price Charts** | 5-year interactive price history with 50-day EMA (purple) and 100-day EMA (orange) overlays. Switch time frames: 1M, 3M, 6M, 1Y, 3Y, 5Y. |
| 🚦 **Intelligent Color Coding** | Every financial metric is automatically color-coded **Green** (healthy), **Amber** (caution), or **Red** (concern) based on AI analysis. |
| 📥 **Export to Excel** | Download a full structured `.xlsx` spreadsheet of the analysis for offline use or reporting. |
| 🎨 **Premium UI** | Branded ScripVision loading screen with the 3D Blue Bull, a sleek white/light-blue modal, and seamless animations. |
| 🔒 **Privacy First** | Your API key is stored locally in a `.env` file and never uploaded to any server. The `.gitignore` is pre-configured to keep it out of version control. |

---

## 🛠️ Installation

1. **Clone or download** this repository to your machine.

2. Open Google Chrome and navigate to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **Load unpacked** and select the project folder.

5. Create a `.env` file in the root directory of the project and add your Gemini API key:
   ```
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```
   > **Note:** The `.env` file is listed in `.gitignore` and will not be committed to version control. Keep it safe.

6. **Reload** the extension on `chrome://extensions/` if needed.

7. Navigate to any financial news or stock-related webpage, **select a stock ticker symbol** (e.g., `RELIANCE`, `AAPL`, `INFY`), and click the **ScripVision** tooltip that appears.

---

## 📁 Project Structure

```
Assignment-01/
├── manifest.json         # Chrome Extension manifest (MV3)
├── background.js         # Service worker — Gemini API integration
├── content.js            # Injected page script — UI rendering & chart logic
├── content.css           # Injected stylesheet — light blue/white theme
├── popup.html            # Extension popup (enable/disable toggle)
├── popup.js              # Popup script
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
├── chart.umd.js          # Bundled Chart.js (local, no CDN)
├── xlsx.full.min.js      # Bundled SheetJS (local, no CDN)
├── .env                  # 🔒 Your API key (NOT committed to git)
├── .gitignore            # Ensures .env is excluded from version control
└── LICENSE               # MIT License
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>© 2026 ScripVision. All rights reserved. All trademarks, copyrights, and logos are the property of their respective owners.</sub>
</p>
