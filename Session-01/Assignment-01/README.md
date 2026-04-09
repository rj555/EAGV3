# 🎨 ArcSketch

<p align="center">
  <i>A powerful, lightweight Chrome Extension to draw and annotate directly on any browser tab for system design and architecture.</i>
</p>

---

## ⚡ Overview

**ArcSketch** transforms any web page into your personal whiteboard. Designed specifically for system design interviews, architectural diagrams, and rapid prototyping, ArcSketch allows you to inject standardized system components (Databases, Load Balancers, API Gateways) and freehand sketches right over web content. 

Whether you're presenting, planning, or just brainstorming—ArcSketch gets out of your way and lets your ideas flow.

## ✨ Key Features

- **🖌️ Freehand Drawing**: Smooth, low-latency pen tool to sketch freely over any webpage. Quick keyboard toggles (`S` to start, `E` to end drawing).
- **🏗️ Architecture Shapes**: Built-in, perfectly rendered shapes for core system components:
  - Databases
  - Load Balancers
  - API Gateways
  - Standard geometric primitives (Boxes, Circles, Lines)
- **📝 Text Annotations**: Instantly drop typed text precisely centered inside shapes or anywhere else on the screen.
- **🖼️ One-Click Screenshots**: Capture your active viewport alongside all your annotations directly to a timestamped PNG file.
- **🔄 Robust History**: Full Undo/Redo capability so mistakes are never permanent.
- **🛡️ Unsaved Work Protection**: Warns you (and offers a save prompt) if you attempt to close the tool or leave the page with uncaptured drawings.
- **🖱️ Draggable Floating Toolbar**: Move the tool palette anywhere on the screen so it's never obstructing your work.

---

## 🚀 Installation 

Since ArcSketch is currently in local development, you can load it directly into Chrome using Developer Mode:

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable the **Developer Mode** toggle in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the folder containing this repository (the folder with `manifest.json`).
6. ArcSketch will appear in your extensions list, ready to use!

## 🕹️ How to Use

1. **Activate**: Click the ArcSketch icon in your Chrome extensions toolbar to activate it on your current tab.
2. **Move**: Click and drag the extension's icon on the left of the floating menu to reposition the toolbar.
3. **Draw**: Select a tool from the menu (Pen, Text, Shapes) and interact directly with the page.
    - **Keyboard Shortcuts**: Quickly tap `S` to start drawing with the pen tool, and `E` to stop drawing.
4. **Export**: Click the green **Save** (`📥`) button to immediately take a screenshot of your masterpiece and close the tool.

---

## 🛠️ Technology Stack

- purely Vanilla JavaScript (ES6+)
- HTML5 Canvas API
- Standard CSS / Flexbox / Keyframe Animations
- Chrome Extensions API V3 Framework

## 🔒 Permissions Breakdown

- `activeTab`: Used to access the current window to inject the drawing canvas and take screenshots.
- `scripting`: Required to inject `content.js` and `content.css` seamlessly.
- `downloads`: Allows the extension to seamlessly save your screenshots directly to your file system.
- `storage`: Preserves the active state of the tool per-tab so your tool reappears safely if a page undergoes partial navigation mapping.

---
*Built with ❤️ for architects and engineers.*
