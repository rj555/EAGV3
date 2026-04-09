// content.js

if (window.__markingToolLoaded) {
  // Script already injected, skip re-execution
} else {
window.__markingToolLoaded = true;

(function() {
"use strict";

const ICONS = {
  pan: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20"/></svg>`,
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
let defaultLineWidth = 4;
let isVerticalText = false; // Flag to track if the current text drop is vertical

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
  
  const iconImg = document.createElement('img');
  iconImg.src = chrome.runtime.getURL('icons/icon48.png');
  iconImg.className = 'mt-app-icon';
  iconImg.ondragstart = () => false; // Prevent default image dragging
  dragHandle.appendChild(iconImg);
  
  toolbar.appendChild(dragHandle);

  const dividerIcon = document.createElement('div');
  dividerIcon.className = 'mt-divider';
  toolbar.appendChild(dividerIcon);
  
  // 1. Pan, Pen, Text
  const primaryTools = [
    { id: 'tool-pan', title: 'Pan & Zoom', icon: ICONS.pan, tool: 'pan' },
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
    { id: 'tool-rect', name: 'Box', icon: ICONS.rect, tool: 'rect' },
    { id: 'tool-circle', name: 'Circle', icon: ICONS.circle, tool: 'circle' },
    { id: 'tool-line', name: 'Line', icon: ICONS.line, tool: 'line' }
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
         ctx.lineWidth = defaultLineWidth;
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
  
  if (currentTool === 'text') {
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
  ctx.lineWidth = defaultLineWidth;
  
  markUnsaved();
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
    ctx.lineWidth = defaultLineWidth;
    
    if (currentTool === 'line') {
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
    } else if (currentTool === 'rect') {
      ctx.rect(startX, startY, x - startX, y - startY);
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    } else if (currentTool === 'db') {
      const w = x - startX;
      const h = y - startY;
      const rx = w / 2;
      const ry = Math.min(10, Math.abs(h)/4);
      ctx.ellipse(startX + rx, startY + ry, Math.abs(rx), ry, 0, 0, Math.PI * 2);
      ctx.moveTo(startX, startY + ry);
      ctx.lineTo(startX, startY + h - ry);
      ctx.ellipse(startX + rx, startY + h - ry, Math.abs(rx), ry, 0, 0, Math.PI);
      ctx.moveTo(startX + w, startY + h - ry);
      ctx.lineTo(startX + w, startY + ry);
    } else if (currentTool === 'lb') {
      const w = x - startX;
      const h = y - startY;
      ctx.rect(startX, startY, w, h);
      ctx.fillStyle = defaultColor;
      ctx.font = 'bold 16px "Inter", Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("LB", startX + w/2, startY + h/2);
    } else if (currentTool === 'gateway') {
      const w = x - startX;
      const h = y - startY;
      ctx.rect(startX, startY, w, h);
      ctx.fillStyle = defaultColor;
      ctx.font = 'bold 16px "Inter", Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("API Gateway", startX + w/2, startY + h/2);
    }
    ctx.stroke();
  }
}

function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    ctx.closePath();
    tempBackup = null;
    saveState();
    
    // Auto-Text placement for closed shapes
    const shapesThatNeedText = ['rect', 'circle', 'db', 'gateway', 'lb'];
    if (shapesThatNeedText.includes(currentTool)) {
      const endX = currentMouseX;
      const endY = currentMouseY;
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      
      // Calculate center to place text
      const centerX = Math.min(startX, endX) + width / 2;
      const centerY = Math.min(startY, endY) + height / 2;
      
      // Determine vertical alignment if shape is tall and narrow
      isVerticalText = (width < 60 && height > width * 2);
      
      // Offset slightly to center the input element itself
      openTextInput(centerX, centerY);
    }
  }
}

function openTextInput(x, y) {
  textInput.style.display = 'block';
  textInput.value = '';
  textInput.dataset.x = x;
  textInput.dataset.y = y;
  
  if (isVerticalText) {
    textInput.style.transform = 'translate(-50%, -50%) rotate(90deg)';
  } else {
    textInput.style.transform = 'translate(-50%, -50%)';
  }
  
  textInput.style.left = x + 'px';
  textInput.style.top = y + 'px';
  
  textInput.focus();
}

function finalizeText() {
  if (textInput.style.display === 'none') return;
  
  const text = textInput.value;
  if (text.trim() !== '') {
    ctx.font = 'bold 20px "Inter", Arial';
    ctx.fillStyle = defaultColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const x = parseFloat(textInput.dataset.x);
    const y = parseFloat(textInput.dataset.y);
    
    ctx.save();
    if (isVerticalText) {
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(text, 0, 0);
    } else {
      ctx.fillText(text, x, y);
    }
    ctx.restore();
    
    markUnsaved();
    saveState();
  }
  
  textInput.style.display = 'none';
  textInput.value = '';
  isVerticalText = false; // reset
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
    ctx.clearRect(0,0, canvas.width, canvas.height);
    historyStep--;
    markUnsaved();
  }
}

function redo() {
  if (historyStep < history.length - 1) {
    historyStep++;
    ctx.putImageData(history[historyStep], 0, 0);
    markUnsaved();
  }
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
  isSaved = true;
  const saveBtn = document.querySelector('.mt-btn-success');
  if(saveBtn) saveBtn.innerHTML = ICONS.save;
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
      () => {} // On Cancel
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
        if(saveBtn) saveBtn.innerHTML = ICONS.save;
        
        if (typeof callback === 'function') {
          callback();
        } else {
          // If no specific callback is provided, default to turning off after a successful save
          turnOff();
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
