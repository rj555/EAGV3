let currentTooltip = null;
let currentSymbol = '';
let currentAnalysisData = null;
let currentLoadingOverlay = null;
let currentChart = null;

// Listen for selection changes
document.addEventListener('mouseup', (e) => {
  // Don't show tooltip if we click inside the modal or tooltip itself
  if (e.target.closest('#gemini-stock-modal') || e.target.closest('#gemini-stock-tooltip') || e.target.closest('#gemini-stock-loading-overlay')) {
    return;
  }

  // Check if extension is enabled
  try {
    chrome.storage.local.get(['extensionEnabled'], (result) => {
      if (chrome.runtime.lastError) return;
      if (result && result.extensionEnabled === false) return;

      const selection = window.getSelection();
      const text = selection.toString().trim();

      // Remove existing tooltip
      if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
      }

      // Basic validation: max 200 characters, non-empty
      if (text && text.length > 0 && text.length <= 200) {
        showTooltip(e.pageX, e.pageY, text);
      }
    });
  } catch (error) {
    console.log('Gemini Stock Analyzer: Extension context invalidated. Please refresh the page.');
  }
});

// Remove tooltip on mousedown if clicking elsewhere
document.addEventListener('mousedown', (e) => {
  if (currentTooltip && !e.target.closest('#gemini-stock-tooltip') && !e.target.closest('#gemini-stock-modal') && !e.target.closest('#gemini-stock-loading-overlay')) {
    currentTooltip.remove();
    currentTooltip = null;
  }
});

function showTooltip(x, y, symbol) {
  currentTooltip = document.createElement('div');
  currentTooltip.id = 'gemini-stock-tooltip';
  const iconUrl = chrome.runtime.getURL('icon48.png');
  currentTooltip.innerHTML = `<img src="${iconUrl}" class="gemini-tooltip-logo"/><span>Get Scrip Details</span><span style="font-size: 16px;">✨</span>`;
  
  // Position above the selection
  currentTooltip.style.left = `${x + 10}px`;
  currentTooltip.style.top = `${y - 40}px`;

  currentTooltip.addEventListener('click', () => {
    currentSymbol = symbol;
    currentTooltip.remove();
    currentTooltip = null;
    
    // Show full screen loading overlay
    showLoadingOverlay();

    // Send message to background script
    chrome.runtime.sendMessage({ action: 'analyzeStock', symbol: symbol }, (response) => {
      if (chrome.runtime.lastError || !response) {
        showLoadingError('❌ Error connecting to extension');
        return;
      }

      if (response.error) {
        console.error("Gemini API Error:", response.error);
        showLoadingError('❌ API Error. See Console.');
        return;
      }

      if (response.data && response.data.error === "INVALID_SYMBOL") {
        showLoadingError('❌ Not a valid stock scrip');
        return;
      }

      // Valid data received
      removeLoadingOverlay();
      openModal(symbol, response.data);
    });
  });

  document.body.appendChild(currentTooltip);
}

function showLoadingOverlay() {
  if (currentLoadingOverlay) currentLoadingOverlay.remove();
  
  const iconUrl = chrome.runtime.getURL('icon128.png');
  
  currentLoadingOverlay = document.createElement('div');
  currentLoadingOverlay.id = 'gemini-stock-loading-overlay';
  currentLoadingOverlay.innerHTML = `
    <div class="gemini-loading-box">
      <h2 class="gemini-loading-brand">ScripVision</h2>
      <img src="${iconUrl}" alt="ScripVision Logo" class="gemini-loading-logo" />
      <h3 class="gemini-loading-text">analyzing scrip...</h3>
      <div class="gemini-copyright" style="text-align: center; padding: 0 20px;">© 2026 ScripVision. All rights reserved. All trademarks, copyrights, and logos are the property of their respective owners.</div>
    </div>
  `;
  
  // Prevent scrolling while analyzing
  document.body.style.overflow = 'hidden';
  document.body.appendChild(currentLoadingOverlay);
}

function removeLoadingOverlay() {
  if (currentLoadingOverlay) {
    currentLoadingOverlay.style.opacity = '0';
    setTimeout(() => {
      if (currentLoadingOverlay) currentLoadingOverlay.remove();
      currentLoadingOverlay = null;
      document.body.style.overflow = '';
    }, 300);
  }
}

function showLoadingError(message) {
  if (currentLoadingOverlay) {
    const box = currentLoadingOverlay.querySelector('.gemini-loading-box');
    box.innerHTML = `<h3 style="color: #e57373; margin: 0; font-size: 20px;">${message}</h3>`;
    
    // Fade out after a delay
    setTimeout(() => {
      removeLoadingOverlay();
    }, 2000);
  }
}

function createModalDOM() {
  // If exists, remove
  const existingOverlay = document.getElementById('gemini-stock-overlay');
  if (existingOverlay) existingOverlay.remove();

  const iconUrl = chrome.runtime.getURL('icon48.png');

  const overlay = document.createElement('div');
  overlay.id = 'gemini-stock-overlay';

  overlay.innerHTML = `
    <div id="gemini-stock-modal">
      <div id="gemini-stock-header">
        <div class="gemini-header-left">
          <img src="${iconUrl}" alt="ScripVision Logo" class="gemini-header-logo" />
          <h2 id="gemini-modal-title">Analysis</h2>
        </div>
        <button class="gemini-modal-close">&times;</button>
      </div>
      <div id="gemini-stock-content">
      </div>
      <div id="gemini-stock-footer">
        <div class="gemini-footer-row-top">
          <div class="gemini-footer-left">
            <img src="${iconUrl}" alt="ScripVision Logo" class="gemini-footer-logo" />
            <span class="gemini-footer-brand">ScripVision</span>
            <span class="gemini-copyright" style="margin-left: 10px; border-left: 1px solid #ddd; padding-left: 10px;">© 2026 ScripVision. All rights reserved.</span>
          </div>
          <button id="gemini-download-btn" class="gemini-download-btn">Download .xlsx</button>
        </div>
        <div class="gemini-footer-row-bottom">
          <span class="gemini-copyright">All trademarks, copyrights, and logos are the property of their respective owners.</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close handlers
  overlay.querySelector('.gemini-modal-close').addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.remove();
      if (currentChart) {
        currentChart.destroy();
        currentChart = null;
      }
    }, 300);
  });
  
  // Removed overlay mousedown listener so it doesn't close on outside click

  // Download handler
  overlay.querySelector('#gemini-download-btn').addEventListener('click', () => {
    if (currentAnalysisData) {
      downloadExcel(currentAnalysisData, currentSymbol);
    }
  });

  // Trigger reflow for animation
  overlay.offsetHeight;
  overlay.classList.add('visible');

  return overlay;
}

function openModal(symbol, data) {
  const overlay = createModalDOM();
  const title = overlay.querySelector('#gemini-modal-title');
  const companyName = data.company_name || 'Unknown Company';
  const scripSymbol = data.symbol || symbol;
  title.textContent = `ScripVision Analysis: ${companyName} (${scripSymbol})`;
  
  currentAnalysisData = data;
  const content = overlay.querySelector('#gemini-stock-content');
  renderAnalysis(data, content);
}

function renderAnalysis(data, container) {
  // Determine verdict class
  let verdictClass = 'hold';
  const verdictText = (data.buy_and_sell_verdict || '').toLowerCase();
  if (verdictText.includes('buy')) verdictClass = 'buy';
  if (verdictText.includes('sell')) verdictClass = 'sell';

  // Helper for generating cards
  const generateCard = (label, dataObj) => {
    let value = 'N/A';
    let colorClass = '';
    
    if (dataObj) {
      if (typeof dataObj === 'object') {
        value = dataObj.value || 'N/A';
        if (dataObj.color) {
          colorClass = `color-${dataObj.color.toLowerCase()}`;
        }
      } else {
        value = dataObj;
      }
    }
    
    return `
      <div class="gemini-data-card">
        <div class="gemini-data-label">${label}</div>
        <div class="gemini-data-value ${colorClass}">${value}</div>
      </div>
    `;
  };

  // Helper for lists
  const generateList = (items) => {
    if (!items || !items.length) return '<p>No data available</p>';
    return `<ul class="gemini-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
  };

  const html = `
    <div class="gemini-data-grid">
      ${generateCard('Current Price', data.current_price)}
      ${generateCard('Market Cap', data.market_cap)}
      ${generateCard('High / Low', data.high_low)}
      ${generateCard('Stock P/E', data.stock_pe)}
      ${generateCard('Book Value', data.book_value)}
      ${generateCard('Dividend Yield', data.dividend_yield)}
      ${generateCard('ROCE', data.roce)}
      ${generateCard('ROE', data.roe)}
      ${generateCard('Face Value', data.face_value)}
      ${generateCard('Change in Promoter Holdings', data.change_in_promoter_holdings)}
      ${generateCard('Promoter holding %', data.promoter_holding_percentage)}
      ${generateCard('PEG Ratio', data.peg_ratio)}
      ${generateCard('Debt to Equity', data.debt_to_equity)}
      ${generateCard('Operating Margin', data.operating_margin)}
    </div>

    <div class="gemini-verdict ${verdictClass}">
      Verdict: ${data.buy_and_sell_verdict || 'Hold'}
    </div>

    <div class="gemini-section-title">Price Trend</div>
    <div class="gemini-chart-container">
      <div class="gemini-chart-header">
        <h3 class="gemini-chart-title">Price History & EMA</h3>
        <div class="gemini-time-ranges">
          <button class="gemini-time-btn" data-range="1">1M</button>
          <button class="gemini-time-btn" data-range="3">3M</button>
          <button class="gemini-time-btn" data-range="6">6M</button>
          <button class="gemini-time-btn" data-range="12">1Y</button>
          <button class="gemini-time-btn" data-range="36">3Y</button>
          <button class="gemini-time-btn active" data-range="60">5Y</button>
        </div>
      </div>
      <div class="gemini-canvas-wrapper">
        <canvas id="geminiPriceChart"></canvas>
      </div>
    </div>

    <div class="gemini-section-title">Pros & Cons</div>
    <div style="display: flex; gap: 24px;">
      <div style="flex: 1;">
        <h4 style="color: #81c784; margin-top: 0;">Pros</h4>
        ${generateList(data.pros)}
      </div>
      <div style="flex: 1;">
        <h4 style="color: #e57373; margin-top: 0;">Cons</h4>
        ${generateList(data.cons)}
      </div>
    </div>

    <div class="gemini-section-title">Financial Summaries</div>
    <p><strong>Profit & Loss:</strong> ${data.profit_and_loss_statement || 'N/A'}</p>
    <p><strong>Balance Sheet:</strong> ${data.balance_sheet || 'N/A'}</p>
    <p><strong>Quarterly Results:</strong> ${data.quarterly_results || 'N/A'}</p>
    <p><strong>Cash Flows:</strong> ${data.cash_flows_data || 'N/A'}</p>
    <p><strong>Important Ratios:</strong> ${data.important_ratios || 'N/A'}</p>
  `;

  container.innerHTML = html;

  if (data.price_trend_data && data.price_trend_data.length > 0) {
    initChart(data.price_trend_data);
  }
}

function initChart(trendData) {
  const ctx = document.getElementById('geminiPriceChart');
  if (!ctx || typeof Chart === 'undefined') {
    console.error("Chart.js not loaded or canvas not found.");
    return;
  }

  if (currentChart) {
    currentChart.destroy();
  }

  // Ensure data is sorted by date ascending
  trendData.sort((a, b) => new Date(a.date) - new Date(b.date));

  const renderData = (months) => {
    // Assuming data is weekly, roughly 4.33 weeks per month
    const numPoints = Math.ceil(months * 4.33);
    const slicedData = trendData.slice(-numPoints);

    const labels = slicedData.map(d => d.date);
    const priceData = slicedData.map(d => d.price);
    const ema50Data = slicedData.map(d => d.ema50);
    const ema100Data = slicedData.map(d => d.ema100);

    return { labels, priceData, ema50Data, ema100Data };
  };

  const createChart = (months) => {
    const { labels, priceData, ema50Data, ema100Data } = renderData(months);

    currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Price',
            data: priceData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 0
          },
          {
            label: '50-Day EMA',
            data: ema50Data,
            borderColor: '#9c27b0',
            borderWidth: 1.5,
            borderDash: [5, 5],
            tension: 0.1,
            pointRadius: 0
          },
          {
            label: '100-Day EMA',
            data: ema100Data,
            borderColor: '#ff9800',
            borderWidth: 1.5,
            borderDash: [5, 5],
            tension: 0.1,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            labels: { color: '#333333', font: { size: 14 } }
          }
        },
        scales: {
          x: {
            ticks: { color: '#555555', maxTicksLimit: 10 },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          y: {
            ticks: { color: '#555555' },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          }
        }
      }
    });
  };

  createChart(60); // Default to 5 years

  // Setup button listeners
  const buttons = document.querySelectorAll('.gemini-time-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const months = parseInt(e.target.getAttribute('data-range'));
      if (currentChart) currentChart.destroy();
      createChart(months);
    });
  });
}

function downloadExcel(data, symbol) {
  if (typeof XLSX === 'undefined') {
    alert("Excel library not loaded properly.");
    return;
  }

  const getValue = (obj) => {
    if (obj && typeof obj === 'object') return obj.value || '';
    return obj || '';
  };

  // Flatten the data for Excel export
  const flatData = [
    { Metric: 'Stock Symbol', Value: symbol },
    { Metric: 'Market Cap', Value: getValue(data.market_cap) },
    { Metric: 'Current Price', Value: getValue(data.current_price) },
    { Metric: 'High / Low', Value: getValue(data.high_low) },
    { Metric: 'Stock P/E', Value: getValue(data.stock_pe) },
    { Metric: 'Book Value', Value: getValue(data.book_value) },
    { Metric: 'Dividend Yield', Value: getValue(data.dividend_yield) },
    { Metric: 'ROCE', Value: getValue(data.roce) },
    { Metric: 'ROE', Value: getValue(data.roe) },
    { Metric: 'Face Value', Value: getValue(data.face_value) },
    { Metric: 'Change in Promoter Holdings', Value: getValue(data.change_in_promoter_holdings) },
    { Metric: 'Promoter holding percentage', Value: getValue(data.promoter_holding_percentage) },
    { Metric: 'PEG Ratio', Value: getValue(data.peg_ratio) },
    { Metric: 'Debt to Equity', Value: getValue(data.debt_to_equity) },
    { Metric: 'Operating Margin', Value: getValue(data.operating_margin) },
    { Metric: 'Profit & Loss Statement', Value: data.profit_and_loss_statement },
    { Metric: 'Balance Sheet', Value: data.balance_sheet },
    { Metric: 'Quarterly Results', Value: data.quarterly_results },
    { Metric: 'Cash Flows Data', Value: data.cash_flows_data },
    { Metric: 'Important Ratios', Value: data.important_ratios },
    { Metric: 'Pros', Value: (data.pros || []).join('; ') },
    { Metric: 'Cons', Value: (data.cons || []).join('; ') },
    { Metric: 'Buy/Sell Verdict', Value: data.buy_and_sell_verdict }
  ];

  const ws = XLSX.utils.json_to_sheet(flatData);
  
  // Auto-size columns
  const wscols = [
    { wch: 30 },
    { wch: 60 }
  ];
  ws['!cols'] = wscols;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Analysis");
  
  XLSX.writeFile(wb, `${symbol}_Analysis.xlsx`);
}
