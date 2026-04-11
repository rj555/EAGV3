# 🎨 ArcSketch

<p align="center">
  <img src="icons/icon128.png" width="80" height="80" alt="ArcSketch Logo" />
  <br />
  <i>A professional-grade system design annotation tool for your browser.</i>
</p>

---

## ⚡ Overview

**ArcSketch** transforms any web page into a high-fidelity whiteboard. Specifically built for system design interviews and architectural planning, it allows you to overlay standardized components (Databases, Load Balancers, API Gateways) and freehand sketches directly over live web content.

With its new **interactive text engine**, ArcSketch gives you precise control over your labels, allowing you to move, edit, and rotate text with professional precision.

### 📺 Watch the Demo
<a href="https://youtu.be/uqYmQtMhgFk" target="_blank" rel="noopener noreferrer"><b>Watch ArcSketch in action!</b></a>

## ✨ Key Features

- **✍️ Interactive Text System**: 
  - **Edit Post-Placement**: Click any text block to refine your labels.
  - **🔄 Professional Rotation**: Drag the integrated rotation handle (`↻`) to spin text. Features **Cardinal Snapping** at 0°, 90°, 180°, and 270°.
  - **🖱️ Drag-to-Move**: Click and drag any text element to reposition it perfectly.
- **🖌️ Freehand Sketching**: Ultra-smooth canvas drawing with low latency.
- **🏗️ Architectural library**: 
  - One-click insertion of **Load Balancers**, **API Gateways**, and **Databases**.
  - Specialized shapes for **Clouds**, **Decision Diamonds**, and **Arrows**.
- **🎨 Live Formatting**: 
  - Dynamic font scaling and stroke thickness via the floating menu.
  - Support for Bold and Italic stylings with system-native font stacks.
- **📥 Iterative Save**: Capture snapshots of your work to timestamped PNGs. The tool stays open so you can capture different states of your diagram.
- **🔄 Unlimited Undo/Redo**: Every stroke and text adjustment is tracked in a unified history stack.
- **🗑️ Clear All**: Wipe the entire canvas in one click (fully undoable).
- **🛡️ Unsaved Work Protection**: A smart modal prevents accidental loss of your annotations.

---

## 🚀 Installation 

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the repository folder.
5. Pin **ArcSketch** to your extension bar for quick access.

## 🕹️ How to Use

1. **Activate**: Click the ArcSketch icon in your browser to start.
2. **Move Toolbar**: Drag the **ArcSketch** wordmark to reposition the controls anywhere.
3. **Annotate**:
    - **Pen**: Sketch with freehand strokes (Toggle with `S` to start, `E` to end).
    - **Text**: Click to place, click again to edit, or drag the handle to rotate.
    - **Shapes**: Select a shape from the dropdown to draw boxes, clouds, or components.
4. **Export**: Click the green **Save** (`📥`) button to download a screenshot.
5. **Wipe**: Click the red **Clear** (`🗑️`) button to start over.

---

## 🛠️ Technology Stack

- **Vanilla JS (ES6+)**: Zero-dependency frontend logic.
- **DOM Overlay Engine**: Custom interactive layering for text and UI.
- **HTML5 Canvas**: High-performance raster drawing.
- **Chrome manifest V3**: Secure and modern extension architecture.

---
*Built for architects, by engineers who love diagramming.*
