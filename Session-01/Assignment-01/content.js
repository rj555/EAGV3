// content.js

if (window.__markingToolLoaded) {
  // Script already injected, skip re-execution
} else {
  window.__markingToolLoaded = true;

  (function () {
    "use strict";

    const ICONS = {
      freehand: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg>`,
      text: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
      shapes: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
      line: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5"></line></svg>`,
      rect: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
      circle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`,
      db: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
      lb: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="8" rx="2" ry="2"></rect></svg>`,
      gateway: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>`,
      undo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path></svg>`,
      redo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path></svg>`,
      save: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
      clear: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
      format: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
      cloud: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1325 20.1793 10.2033 17.8631 10.021C17.4373 6.64382 14.5516 4 11 4C7.13401 4 4 7.13401 4 11C4 11.2383 4.0119 11.4735 4.03505 11.7049C2.29875 12.3552 1 14.0256 1 16C1 18.2091 2.79086 20 5 20H17.5V19Z"></path></svg>`,
      diamond: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 3 21 12 12 21 3 12 12 3"></polygon></svg>`,
      triangle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 3 21 21 3 21 12 3"></polygon></svg>`,
      arrowEnd: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
      arrowStart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
      arrowBoth: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="18" y2="12"></line><polyline points="10 8 6 12 10 16"></polyline><polyline points="14 8 18 12 14 16"></polyline></svg>`,
      close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    };

    let canvas, ctx;
    let toolbar;
    let textInput;
    let isActive = false;
    let isSaved = true;

    // Drawing state
    let currentTool = 'freehand'; // pan, freehand, text, line, rect, circle, db, lb, gateway
    let isDrawing = false;
    let startX = 0, startY = 0;
    let currentMouseX = 0, currentMouseY = 0;
    let defaultColor = '#413e3f';
    let currentLineWidth = 4;
    let fontFamily = 'Inter';
    let fontSize = 20;
    let isBold = true;
    let isItalic = false;
    let isVerticalText = false; // Flag to track if the current text drop is vertical
    let editingTextNode = null; // Track if we are editing an existing text block

    // History for Undo/Redo
    let history = [];
    let historyStep = -1;

    function initializeTool() {
      if (document.getElementById('marking-tool-canvas')) return;

      // Create Canvas
      canvas = document.createElement('canvas');
      canvas.id = 'marking-tool-canvas';
      document.body.appendChild(canvas);

      ctx = canvas.getContext('2d', { willReadFrequently: true });
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Create Toolbar
      toolbar = document.createElement('div');
      toolbar.id = 'marking-tool-toolbar';

      // 0. Drag Handle & Icon
      const dragHandle = document.createElement('div');
      dragHandle.className = 'mt-drag-handle';
      dragHandle.title = 'Drag to move';

      const wordmark = document.createElement('span');
      wordmark.className = 'mt-app-wordmark';
      wordmark.textContent = 'ArcSketch';
      dragHandle.appendChild(wordmark);

      toolbar.appendChild(dragHandle);

      const dividerIcon = document.createElement('div');
      dividerIcon.className = 'mt-divider';
      toolbar.appendChild(dividerIcon);

      // 1. Pen, Text
      const primaryTools = [
        { id: 'tool-freehand', title: 'Pen (S/E)', icon: ICONS.freehand, tool: 'freehand' },
        { id: 'tool-text', title: 'Text', icon: ICONS.text, tool: 'text' }
      ];

      primaryTools.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'mt-btn' + (t.tool === currentTool ? ' active-tool' : '');
        btn.id = t.id;
        btn.innerHTML = t.icon;
        btn.title = t.title;
        btn.onclick = () => setTool(t.tool);
        toolbar.appendChild(btn);
      });

      // 2. Shapes Dropdown
      const shapeDiv = document.createElement('div');
      shapeDiv.className = 'mt-dropdown-container';

      const shapeBtn = document.createElement('button');
      shapeBtn.className = 'mt-btn';
      shapeBtn.id = 'tool-shapes-menu';
      shapeBtn.innerHTML = ICONS.shapes;
      shapeBtn.title = 'Shapes';
      shapeDiv.appendChild(shapeBtn);

      const shapeMenu = document.createElement('div');
      shapeMenu.className = 'mt-dropdown-menu';

      const shapeTools = [
        { id: 'tool-db', name: 'Database', icon: ICONS.db, tool: 'db' },
        { id: 'tool-lb', name: 'Load Balancer', icon: ICONS.lb, tool: 'lb' },
        { id: 'tool-gateway', name: 'Gateway', icon: ICONS.gateway, tool: 'gateway' },
        { id: 'tool-cloud', name: 'Cloud', icon: ICONS.cloud, tool: 'cloud' },
        { id: 'tool-diamond', name: 'Decision', icon: ICONS.diamond, tool: 'diamond' },
        { id: 'tool-rect', name: 'Rectangle', icon: ICONS.rect, tool: 'rect' },
        { id: 'tool-circle', name: 'Circle', icon: ICONS.circle, tool: 'circle' },
        { id: 'tool-triangle', name: 'Triangle', icon: ICONS.triangle, tool: 'triangle' },
        { id: 'tool-line', name: 'Line', icon: ICONS.line, tool: 'line' },
        { id: 'tool-arrow-end', name: 'Arrow (→)', icon: ICONS.arrowEnd, tool: 'arrow-end' },
        { id: 'tool-arrow-start', name: 'Arrow (←)', icon: ICONS.arrowStart, tool: 'arrow-start' },
        { id: 'tool-arrow-both', name: 'Arrow (↔)', icon: ICONS.arrowBoth, tool: 'arrow-both' }
      ];

      shapeTools.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'mt-dropdown-item';
        btn.id = t.id;
        btn.innerHTML = t.icon + ' ' + t.name;
        btn.onclick = () => {
          setTool(t.tool);
          // Make parent shapes button look active
          document.querySelectorAll('.mt-btn').forEach(b => b.classList.remove('active-tool'));
          shapeBtn.classList.add('active-tool');
        };
        shapeMenu.appendChild(btn);
      });

      shapeDiv.appendChild(shapeMenu);
      toolbar.appendChild(shapeDiv);

      const divider1 = document.createElement('div');
      divider1.className = 'mt-divider';
      toolbar.appendChild(divider1);

      // 2.5 Formatting Dropdown
      const formatDiv = document.createElement('div');
      formatDiv.className = 'mt-dropdown-container';

      const formatBtn = document.createElement('button');
      formatBtn.className = 'mt-btn';
      formatBtn.id = 'tool-format-menu';
      formatBtn.innerHTML = ICONS.format;
      formatBtn.title = 'Formatting';
      formatDiv.appendChild(formatBtn);

      const formatMenu = document.createElement('div');
      formatMenu.className = 'mt-dropdown-menu mt-format-menu';

      // Thickness slider
      const thicknessRow = document.createElement('div');
      thicknessRow.className = 'mt-format-row';
      thicknessRow.innerHTML = `<label>Stroke</label><input type="range" class="mt-slider" min="1" max="15" value="${currentLineWidth}">`;
      const thicknessSlider = thicknessRow.querySelector('.mt-slider');
      thicknessSlider.oninput = (e) => { currentLineWidth = parseInt(e.target.value); };
      formatMenu.appendChild(thicknessRow);

      // Font Size
      const fontSizeRow = document.createElement('div');
      fontSizeRow.className = 'mt-format-row';
      fontSizeRow.innerHTML = `<label>T Size</label><input type="range" class="mt-slider" min="12" max="60" value="${fontSize}">`;
      const fontSizeSlider = fontSizeRow.querySelector('.mt-slider');
      fontSizeSlider.oninput = (e) => { fontSize = parseInt(e.target.value); };
      formatMenu.appendChild(fontSizeRow);

      // Font Family & Toggles
      const fontRow = document.createElement('div');
      fontRow.className = 'mt-format-row mt-font-row';
      fontRow.innerHTML = `
    <select class="mt-select">
      <option value="Inter">Sans</option>
      <option value="Georgia, serif">Serif</option>
      <option value="monospace">Mono</option>
    </select>
    <div class="mt-toggles">
      <div class="mt-toggle-btn active" data-style="bold"><b>B</b></div>
      <div class="mt-toggle-btn" data-style="italic"><i>I</i></div>
    </div>
  `;
      const fontSelect = fontRow.querySelector('.mt-select');
      fontSelect.onchange = (e) => { fontFamily = e.target.value; };

      const toggleBtns = fontRow.querySelectorAll('.mt-toggle-btn');
      toggleBtns.forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          btn.classList.toggle('active');
          if (btn.dataset.style === 'bold') isBold = btn.classList.contains('active');
          if (btn.dataset.style === 'italic') isItalic = btn.classList.contains('active');
        };
      });

      formatMenu.appendChild(fontRow);
      formatDiv.appendChild(formatMenu);
      toolbar.appendChild(formatDiv);

      const divider2_5 = document.createElement('div');
      divider2_5.className = 'mt-divider';
      toolbar.appendChild(divider2_5);

      // 3. Color Picker
      const colorPicker = document.createElement('input');
      colorPicker.type = 'color';
      colorPicker.className = 'mt-color-picker';
      colorPicker.value = defaultColor;
      colorPicker.title = 'Color';
      colorPicker.onchange = (e) => {
        defaultColor = e.target.value;
        textInput.style.color = defaultColor;
      };
      toolbar.appendChild(colorPicker);

      const dividerColor = document.createElement('div');
      dividerColor.className = 'mt-divider';
      toolbar.appendChild(dividerColor);

      // 4. Undo / Redo
      const btnUndo = document.createElement('button');
      btnUndo.className = 'mt-btn';
      btnUndo.innerHTML = ICONS.undo;
      btnUndo.title = 'Undo';
      btnUndo.onclick = undo;
      toolbar.appendChild(btnUndo);

      const btnRedo = document.createElement('button');
      btnRedo.className = 'mt-btn';
      btnRedo.innerHTML = ICONS.redo;
      btnRedo.title = 'Redo';
      btnRedo.onclick = redo;
      toolbar.appendChild(btnRedo);

      const divider2 = document.createElement('div');
      divider2.className = 'mt-divider';
      toolbar.appendChild(divider2);

      // 4.5. Clear Button
      const btnClear = document.createElement('button');
      btnClear.className = 'mt-btn mt-btn-danger';
      btnClear.innerHTML = ICONS.clear;
      btnClear.title = 'Clear All';
      btnClear.onclick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        markUnsaved();
        saveState();
      };
      toolbar.appendChild(btnClear);

      const divider3 = document.createElement('div');
      divider3.className = 'mt-divider';
      toolbar.appendChild(divider3);

      // 5. Save & Close
      const btnSave = document.createElement('button');
      btnSave.className = 'mt-btn mt-btn-success';
      btnSave.innerHTML = ICONS.save;
      btnSave.title = 'Save';
      btnSave.onclick = saveImage;
      toolbar.appendChild(btnSave);

      const btnClose = document.createElement('button');
      btnClose.className = 'mt-btn mt-btn-danger';
      btnClose.innerHTML = ICONS.close;
      btnClose.title = 'Close';
      btnClose.onclick = requestTurnOff;
      toolbar.appendChild(btnClose);

      document.body.appendChild(toolbar);

      // Text Input Overlay
      textInput = document.createElement('input');
      textInput.id = 'marking-tool-text-input';
      textInput.type = 'text';
      textInput.placeholder = 'Type...';
      document.body.appendChild(textInput);

      // Event Listeners
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', (e) => {
        currentMouseX = e.pageX || e.clientX;
        currentMouseY = e.pageY || e.clientY;
        draw(e);
      });
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);

      canvas.addEventListener('touchstart', (e) => {
        if (currentTool === 'pan') return; // let native scroll happen
        e.preventDefault();
        startDrawing(e.touches[0]);
      }, { passive: false });
      canvas.addEventListener('touchmove', (e) => {
        if (currentTool === 'pan') return;
        e.preventDefault();
        currentMouseX = e.touches[0].pageX || e.touches[0].clientX;
        currentMouseY = e.touches[0].pageY || e.touches[0].clientY;
        draw(e.touches[0]);
      }, { passive: false });
      canvas.addEventListener('touchend', stopDrawing);

      textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          finalizeText();
        }
      });
      textInput.addEventListener('blur', finalizeText);

      // Trackpad / Keyboard Shortcuts
      document.addEventListener('keydown', (e) => {
        if (!isActive || document.activeElement === textInput) return;
        const key = e.key.toLowerCase();
        if (key === 's' && currentTool === 'freehand') {
          if (!isDrawing) {
            isDrawing = true;
            startX = currentMouseX;
            startY = currentMouseY;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = defaultColor;
            ctx.lineWidth = currentLineWidth;
            markUnsaved();
          }
        } else if (key === 'e' && currentTool === 'freehand') {
          if (isDrawing) {
            stopDrawing();
          }
        }
      });

      // Draggable Toolbar Logic
      let isDraggingToolbar = false;
      let toolbarOffsetX = 0;
      let toolbarOffsetY = 0;

      const dragStart = (e) => {
        isDraggingToolbar = true;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        const rect = toolbar.getBoundingClientRect();
        toolbarOffsetX = clientX - rect.left;
        toolbarOffsetY = clientY - rect.top;

        // Switch from centering transform to absolute position
        toolbar.style.transform = 'none';
        toolbar.style.left = rect.left + 'px';
        toolbar.style.top = rect.top + 'px';
      };

      const dragMove = (e) => {
        if (!isDraggingToolbar) return;
        if (e.type.includes('touch')) e.preventDefault(); // prevent scrolling
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        // Bounds checking
        let x = clientX - toolbarOffsetX;
        let y = clientY - toolbarOffsetY;

        const maxX = window.innerWidth - toolbar.offsetWidth;
        const maxY = window.innerHeight - toolbar.offsetHeight;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        toolbar.style.left = x + 'px';
        toolbar.style.top = y + 'px';
      };

      const dragEnd = () => {
        isDraggingToolbar = false;
      };

      dragHandle.addEventListener('mousedown', dragStart);
      window.addEventListener('mousemove', dragMove, { passive: false });
      window.addEventListener('mouseup', dragEnd);

      dragHandle.addEventListener('touchstart', dragStart, { passive: false });
      window.addEventListener('touchmove', dragMove, { passive: false });
      window.addEventListener('touchend', dragEnd);

      // BeforeUnload hook
      window.addEventListener('beforeunload', (e) => {
        if (isActive && !isSaved && historyStep > 0) {
          const msg = 'You have unsaved drawings. Are you sure you want to leave?';
          e.returnValue = msg;
          return msg;
        }
      });

      saveState(); // Initial empty state

      setTool(currentTool); // Init proper canvas mode
    }

    function resizeCanvas() {
      if (canvas) {
        const backup = historyStep >= 0 ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
        canvas.width = Math.max(document.documentElement.scrollWidth, window.innerWidth);
        canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
        if (backup) {
          ctx.putImageData(backup, 0, 0);
        }
      }
    }

    function setTool(tool) {
      currentTool = tool;

      // Handle UI toggles
      document.querySelectorAll('.mt-btn, .mt-dropdown-item').forEach(btn => btn.classList.remove('active-tool'));
      if (document.getElementById(`tool-${tool}`)) {
        document.getElementById(`tool-${tool}`).classList.add('active-tool');
      }

      // Handle Pan vs Draw (pointer-events)
      if (tool === 'pan') {
        canvas.classList.remove('interactive');
      } else {
        canvas.classList.add('interactive');
      }
    }

    function startDrawing(e) {
      if (e.target !== canvas || currentTool === 'pan') return;

      // If the text input is currently open, the blur event already finalized it.
      // Do NOT open a new text box on the same click — just bail out.
      if (textInput.style.display === 'block') return;

      if (currentTool === 'text') {
        if (e.cancelable) e.preventDefault(); // Stop canvas from stealing focus
        openTextInput(e.pageX || e.clientX, e.pageY || e.clientY);
        return;
      }

      isDrawing = true;
      startX = e.pageX || e.clientX;
      startY = e.pageY || e.clientY;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = defaultColor;
      ctx.lineWidth = currentLineWidth;

      markUnsaved();
    }

    function drawArrowhead(ctx, x1, y1, x2, y2, size) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    }

    let tempBackup = null;

    function draw(e) {
      if (!isDrawing || currentTool === 'pan') return;

      const x = e.pageX || e.clientX;
      const y = e.pageY || e.clientY;

      if (currentTool === 'freehand') {
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        if (!tempBackup && historyStep >= 0) {
          tempBackup = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } else if (!tempBackup && historyStep < 0) {
          tempBackup = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        // Restore previous state
        ctx.putImageData(tempBackup, 0, 0);

        ctx.beginPath();
        ctx.strokeStyle = defaultColor;
        ctx.lineWidth = currentLineWidth;

        if (currentTool.startsWith('arrow') || currentTool === 'line') {
          ctx.moveTo(startX, startY);
          ctx.lineTo(x, y);
          ctx.stroke(); // Draw main line first

          const headSize = Math.max(12, currentLineWidth * 2.5);
          if (currentTool === 'arrow-end' || currentTool === 'arrow-both') {
            drawArrowhead(ctx, startX, startY, x, y, headSize);
          }
          if (currentTool === 'arrow-start' || currentTool === 'arrow-both') {
            drawArrowhead(ctx, x, y, startX, startY, headSize);
          }
        } else if (currentTool === 'rect') {
          ctx.rect(startX, startY, x - startX, y - startY);
          ctx.stroke();
        } else if (currentTool === 'diamond') {
          const midX = startX + (x - startX) / 2;
          const midY = startY + (y - startY) / 2;
          ctx.moveTo(midX, startY);
          ctx.lineTo(x, midY);
          ctx.lineTo(midX, y);
          ctx.lineTo(startX, midY);
          ctx.closePath();
          ctx.stroke();
        } else if (currentTool === 'triangle') {
          const midX = startX + (x - startX) / 2;
          ctx.moveTo(midX, startY);
          ctx.lineTo(x, y);
          ctx.lineTo(startX, y);
          ctx.closePath();
          ctx.stroke();
        } else if (currentTool === 'cloud') {
          const w = x - startX;
          const h = y - startY;
          ctx.moveTo(startX + w * 0.2, startY + h * 0.4);
          ctx.bezierCurveTo(startX, startY + h * 0.4, startX, startY + h * 0.8, startX + w * 0.2, startY + h * 0.8);
          ctx.bezierCurveTo(startX + w * 0.3, startY + h * 1.1, startX + w * 0.7, startY + h * 1.1, startX + w * 0.8, startY + h * 0.8);
          ctx.bezierCurveTo(startX + w * 1.0, startY + h * 0.8, startX + w * 1.0, startY + h * 0.4, startX + w * 0.8, startY + h * 0.4);
          ctx.bezierCurveTo(startX + w * 0.7, startY + h * 0.1, startX + w * 0.3, startY + h * 0.1, startX + w * 0.2, startY + h * 0.4);
          ctx.closePath();
          ctx.stroke();
        } else if (currentTool === 'circle') {
          const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
          ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (currentTool === 'db') {
          const w = x - startX;
          const h = y - startY;
          const rx = w / 2;
          const ry = Math.min(10, Math.abs(h) / 4);
          ctx.ellipse(startX + rx, startY + ry, Math.abs(rx), ry, 0, 0, Math.PI * 2);
          ctx.moveTo(startX, startY + ry);
          ctx.lineTo(startX, startY + h - ry);
          ctx.ellipse(startX + rx, startY + h - ry, Math.abs(rx), ry, 0, 0, Math.PI);
          ctx.moveTo(startX + w, startY + h - ry);
          ctx.lineTo(startX + w, startY + ry);
          ctx.stroke();
        } else if (currentTool === 'lb' || currentTool === 'gateway') {
          const w = x - startX;
          const h = y - startY;
          ctx.rect(startX, startY, w, h);
          ctx.stroke();
          // Text generation is now handled by stopDrawing generating a DOM element
        }
      }
    }

    function stopDrawing() {
      if (isDrawing) {
        isDrawing = false;
        ctx.closePath();
        tempBackup = null;
        saveState();

        // Auto-Text placement for closed shapes
        const shapesThatNeedText = ['rect', 'circle', 'db', 'gateway', 'lb', 'cloud', 'diamond', 'triangle'];
        if (shapesThatNeedText.includes(currentTool)) {
          const endX = currentMouseX;
          const endY = currentMouseY;
          const width = Math.abs(endX - startX);
          const height = Math.abs(endY - startY);

          // Only open the text input if the shape was actually drawn with some real area.
          // A plain click (mousedown+mouseup in place) produces width≈0 and height≈0 —
          // we must ignore it, otherwise every subsequent click re-opens a new text box
          // because the shape tool remains selected.
          if (width < 15 && height < 15) return;

          // Calculate center to place text
          const centerX = Math.min(startX, endX) + width / 2;
          const centerY = Math.min(startY, endY) + height / 2;

          // Determine vertical alignment if shape is tall and narrow
          isVerticalText = (width < 60 && height > width * 2);

          // Set default text for specific components
          let initialText = '';
          if (currentTool === 'lb') initialText = 'LB';
          if (currentTool === 'gateway') initialText = 'API Gateway';

          // Offset slightly to center the input element itself
          openTextInput(centerX, centerY, null, initialText);
        }
      }
    }

    function openTextInput(x, y, existingNode = null, defaultText = '') {
      editingTextNode = existingNode;

      if (existingNode) {
        const textSpan = existingNode.querySelector('.mt-text-content');
        textInput.value = textSpan ? textSpan.innerText : existingNode.innerText;
        existingNode.style.display = 'none'; // Hide while editing
      } else {
        textInput.value = defaultText;
      }

      textInput.style.display = 'block';
      textInput.dataset.x = x;
      textInput.dataset.y = y;

      const fontString = existingNode ? existingNode.style.font : `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${fontSize}px "${fontFamily}", Arial`;
      textInput.style.font = fontString;
      textInput.style.color = existingNode ? existingNode.style.color : defaultColor;

      const existingRotation = existingNode ? parseFloat(existingNode.dataset.rotation || 0) : 0;
      textInput.style.transform = `translate(-50%, -50%) rotate(${existingRotation}deg)`;

      textInput.style.left = x + 'px';
      textInput.style.top = y + 'px';

      setTimeout(() => {
        textInput.focus();
      }, 10);
    }

    function finalizeText() {
      if (textInput.style.display === 'none') return;

      const text = textInput.value;
      const x = parseFloat(textInput.dataset.x);
      const y = parseFloat(textInput.dataset.y);

      if (text.trim() === '') {
        if (editingTextNode) {
          editingTextNode.remove();
          markUnsaved(); // Emulate eraser behavior
        }
      } else {
        let node = editingTextNode;
        const currentRotation = editingTextNode ? parseFloat(editingTextNode.dataset.rotation || 0) : 0;
        if (!node) {
          node = document.createElement('div');
          node.className = 'mt-text-element';
          node.dataset.step = historyStep;
          node.dataset.x = x;
          node.dataset.y = y;
          node.dataset.rotation = 0;

          // Text lives in a child span so the rotate handle (sibling) is never clobbered
          const textSpan = document.createElement('span');
          textSpan.className = 'mt-text-content';
          node.appendChild(textSpan);

          // Drag to move OR click to edit — distinguished by movement threshold
          node.addEventListener('mousedown', (e) => {
            if (e.target.closest('.mt-rotate-handle')) return; // let handle handle it
            if (currentTool === 'pan') return;
            e.stopPropagation();

            const dragOrigin = { x: e.clientX, y: e.clientY };
            const startLeft = parseFloat(node.style.left) || parseFloat(node.dataset.x);
            const startTop = parseFloat(node.style.top) || parseFloat(node.dataset.y);
            let moved = false;

            const onMove = (ev) => {
              const dx = ev.clientX - dragOrigin.x;
              const dy = ev.clientY - dragOrigin.y;
              if (!moved && Math.hypot(dx, dy) > 5) moved = true;
              if (moved) {
                node.style.left = (startLeft + dx) + 'px';
                node.style.top = (startTop + dy) + 'px';
                node.dataset.x = startLeft + dx;
                node.dataset.y = startTop + dy;
              }
            };

            const onUp = () => {
              window.removeEventListener('mousemove', onMove);
              window.removeEventListener('mouseup', onUp);
              if (moved) {
                markUnsaved();
              } else {
                // Pure click — open editor
                if (isActive && currentTool !== 'pan') {
                  openTextInput(parseFloat(node.dataset.x), parseFloat(node.dataset.y), node);
                }
              }
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
          });

          document.body.appendChild(node);
          attachRotateHandle(node);
          markUnsaved();
        }

        // Set properties on the span, not the wrapper (preserves the handle)
        const textSpan = node.querySelector('.mt-text-content');
        textSpan.innerText = text;
        node.style.color = textInput.style.color;
        node.style.font = textInput.style.font;
        node.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        node.style.left = x + 'px';
        node.style.top = y + 'px';
        node.style.display = 'block';
      }

      textInput.style.display = 'none';
      textInput.value = '';
      isVerticalText = false;
      editingTextNode = null;
    }

    function attachRotateHandle(node) {
      const handle = document.createElement('div');
      handle.className = 'mt-rotate-handle';
      handle.title = 'Drag to rotate';
      handle.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
      node.appendChild(handle);

      let hideTimer = null;
      let isDraggingHandle = false;

      const showHandle = () => {
        clearTimeout(hideTimer);
        handle.style.display = 'flex';
        node.style.borderColor = 'rgba(0,0,0,0.3)';
        node.style.background = 'rgba(255,255,255,0.5)';
      };
      const scheduleHide = () => {
        // Skip hiding while a rotation drag is active
        if (isDraggingHandle) return;
        hideTimer = setTimeout(() => {
          handle.style.display = 'none';
          node.style.borderColor = 'transparent';
          node.style.background = '';
        }, 200); // 200ms gives enough time to move into handle area
      };
      node.addEventListener('mouseenter', showHandle);
      node.addEventListener('mouseleave', scheduleHide);
      handle.addEventListener('mouseenter', showHandle);
      handle.addEventListener('mouseleave', scheduleHide);

      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        clearTimeout(hideTimer);
        isDraggingHandle = true;

        const SNAP_THRESHOLD = 12;
        const CARDINALS = [0, 90, 180, 270, 360];
        const snapAngle = (a) => {
          const n = ((a % 360) + 360) % 360;
          for (const c of CARDINALS) {
            if (Math.abs(n - c) < SNAP_THRESHOLD) return c % 360;
          }
          return n;
        };

        // Compute center from stored dataset position (fixed, unaffected by rotation).
        // Using getBoundingClientRect() would shift the computed center as the element
        // rotates (bounding box dimensions change), causing inaccurate angle deltas.
        const cx = parseFloat(node.dataset.x);
        const cy = parseFloat(node.dataset.y);

        const getAngle = (ev) =>
          Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI);

        // Track raw (unsnapped) rotation so snapping is purely visual and cannot
        // lock the element in place when the user tries to drag away from a cardinal.
        let rawRotation = parseFloat(node.dataset.rotation || 0);
        let prevAngle = getAngle(e);

        const onMove = (ev) => {
          let delta = getAngle(ev) - prevAngle;

          // Normalize to [-180, 180] to prevent spinning at the atan2 ±180° boundary
          if (delta > 180) delta -= 360;
          if (delta < -180) delta += 360;

          rawRotation += delta;
          prevAngle = getAngle(ev); // advance reference angle each frame

          const displayed = snapAngle(rawRotation);
          node.dataset.rotation = rawRotation; // store raw so snap doesn't lock
          node.style.transform = `translate(-50%, -50%) rotate(${displayed}deg)`;
        };

        const onUp = () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
          isDraggingHandle = false;
          markUnsaved();
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });
    }

    function updateTextNodeVisibility() {
      document.querySelectorAll('.mt-text-element').forEach(node => {
        const step = parseInt(node.dataset.step || "0");
        if (step > historyStep) {
          node.style.display = 'none';
        } else {
          node.style.display = 'block';
        }
      });
    }

    function saveState() {
      if (historyStep < history.length - 1) {
        history = history.slice(0, historyStep + 1);
      }
      history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      historyStep++;
    }

    function undo() {
      if (historyStep > 0) {
        historyStep--;
        ctx.putImageData(history[historyStep], 0, 0);
        markUnsaved();
      } else if (historyStep === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        historyStep--;
        markUnsaved();
      }
      updateTextNodeVisibility();
    }

    function redo() {
      if (historyStep < history.length - 1) {
        historyStep++;
        ctx.putImageData(history[historyStep], 0, 0);
        markUnsaved();
      }
      updateTextNodeVisibility();
    }

    function markUnsaved() {
      isSaved = false;
      const saveBtn = document.querySelector('.mt-btn-success');
      if (saveBtn) {
        // Add star if not present (since innerHTML is svg now)
        if (!saveBtn.innerHTML.includes('*')) {
          saveBtn.innerHTML = ICONS.save + '<span style="color:red;font-size:16px;margin-left:2px">*</span>';
        }
      }
    }

    function clearCanvas() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      history = [];
      historyStep = -1;
      saveState();
      document.querySelectorAll('.mt-text-element').forEach(n => n.remove());
      isSaved = true;
      const saveBtn = document.querySelector('.mt-btn-success');
      if (saveBtn) saveBtn.innerHTML = ICONS.save;
    }

    function showModalPrompt(onSave, onDiscard, onCancel) {
      // Build a custom modal to circumvent Chrome's execution freezing on window.confirm
      const modal = document.createElement('div');
      modal.id = 'marking-tool-modal';

      const content = document.createElement('div');
      content.className = 'mt-modal-content';

      content.innerHTML = `
    <h3>Unsaved Markings</h3>
    <p>You have unsaved drawings on this page. Do you want to save a screenshot before closing?</p>
    <div class="mt-modal-actions">
      <button id="mt-modal-btn-save" class="mt-modal-btn mt-modal-btn-primary">Save Image</button>
      <button id="mt-modal-btn-discard" class="mt-modal-btn mt-modal-btn-danger">Discard</button>
      <button id="mt-modal-btn-cancel" class="mt-modal-btn mt-modal-btn-cancel">Cancel</button>
    </div>
  `;

      modal.appendChild(content);
      document.body.appendChild(modal);

      document.getElementById('mt-modal-btn-save').onclick = () => {
        modal.remove();
        onSave();
      };

      document.getElementById('mt-modal-btn-discard').onclick = () => {
        modal.remove();
        onDiscard();
      };

      document.getElementById('mt-modal-btn-cancel').onclick = () => {
        modal.remove();
        onCancel();
      };
    }

    function requestTurnOff() {
      if (!isSaved && historyStep >= 0) {
        showModalPrompt(
          () => saveImage(() => turnOff()), // On Save
          () => turnOff(), // On Discard
          () => { } // On Cancel
        );
      } else {
        turnOff();
      }
    }

    function saveImage(callback) {
      toolbar.style.display = 'none';
      textInput.style.display = 'none';

      // Wait 300ms for UI to clear and paint reliably before taking snapshot
      setTimeout(() => {
        chrome.runtime.sendMessage({ action: "CAPTURE_SCREEN" }, (response) => {
          // Clear inline style so it respects the .active class
          toolbar.style.display = '';

          if (response && response.success) {
            isSaved = true;
            const saveBtn = document.querySelector('.mt-btn-success');
            if (saveBtn) saveBtn.innerHTML = ICONS.save;

            if (typeof callback === 'function') {
              callback();
            }
          } else {
            alert("Failed to save image. Please verify extensions permissions.");
          }
        });
      }, 300);
    }

    function turnOn() {
      initializeTool();
      isActive = true;
      canvas.classList.add('active');
      toolbar.classList.add('active');
      // Re-sync canvas dimensions if changed while off
      if (canvas.width !== Math.max(document.documentElement.scrollWidth, window.innerWidth) || canvas.height !== Math.max(document.documentElement.scrollHeight, window.innerHeight)) {
        resizeCanvas();
      }
    }

    function turnOff() {
      isActive = false;
      if (canvas) canvas.classList.remove('active');
      if (toolbar) toolbar.classList.remove('active');
      if (textInput) textInput.style.display = 'none';

      clearCanvas();
      chrome.runtime.sendMessage({ action: "TOOL_TURNED_OFF" });
    }

    // Background comms
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "TOGGLE_TOOL") {
        if (message.state) {
          turnOn();
          sendResponse({ success: true });
        } else {
          if (!isSaved && historyStep >= 0) {
            showModalPrompt(
              () => saveImage(() => turnOff()), // Save
              () => turnOff(), // Discard
              () => {
                // Cancel -> reset state to active in BG since we cancelled the turn off
                chrome.runtime.sendMessage({ action: "TOOL_TURNED_OFF_CANCELLED" });
              }
            );
          } else {
            turnOff();
          }
          sendResponse({ success: true });
        }
      }
    });

    chrome.runtime.sendMessage({ action: "REQUEST_TAB_STATE" }, (response) => {
      if (response && response.state) {
        turnOn();
      }
    });

  })(); // end IIFE
} // end guard
