let GEMINI_API_KEY = null;

// Function to fetch and parse .env file
async function loadApiKey() {
  try {
    const response = await fetch(chrome.runtime.getURL('.env'));
    if (!response.ok) {
      console.error('Failed to fetch .env file');
      return;
    }
    const text = await response.text();
    // Parse simple .env format (KEY="VALUE" or KEY=VALUE)
    const match = text.match(/GEMINI_API_KEY\s*=\s*(?:"([^"]+)"|'([^']+)'|([^"\s]+))/);
    if (match) {
      GEMINI_API_KEY = match[1] || match[2] || match[3];
      console.log('API Key loaded successfully.');
    } else {
      console.error('GEMINI_API_KEY not found in .env file');
    }
  } catch (error) {
    console.error('Error loading .env:', error);
  }
}

// Load on startup
loadApiKey();

const systemInstruction = `You are a professional financial analyst. Your task is to do a deep analysis of the company mentioned in the provided text.
First, extract the primary company name or stock symbol from the provided text.
If the text does NOT contain any valid company name or stock symbol, you MUST return EXACTLY this JSON: {"error": "INVALID_SYMBOL"} and absolutely no other text.

If a valid company or stock symbol is found, perform a deep financial analysis on it. You MUST output ONLY valid JSON using the following schema, and absolutely no other text, markdown, or code blocks.
For each financial metric, provide the "value" as a String, and a "color" rating ("green" for good/healthy, "amber" for average/caution, "red" for poor/warning).
For the "price_trend_data", provide a weekly time series of the stock's price over the past 5 years (approx 260 weeks). Estimate the data if exact historicals are not memorized, but ensure the trend is realistic and includes 50-day and 100-day EMA values for each week.

{
  "company_name": "String",
  "symbol": "String",
  "market_cap": { "value": "String", "color": "green|amber|red" },
  "current_price": { "value": "String", "color": "green|amber|red" },
  "high_low": { "value": "String", "color": "green|amber|red" },
  "stock_pe": { "value": "String", "color": "green|amber|red" },
  "book_value": { "value": "String", "color": "green|amber|red" },
  "dividend_yield": { "value": "String", "color": "green|amber|red" },
  "roce": { "value": "String", "color": "green|amber|red" },
  "roe": { "value": "String", "color": "green|amber|red" },
  "face_value": { "value": "String", "color": "green|amber|red" },
  "change_in_promoter_holdings": { "value": "String", "color": "green|amber|red" },
  "promoter_holding_percentage": { "value": "String", "color": "green|amber|red" },
  "peg_ratio": { "value": "String", "color": "green|amber|red" },
  "debt_to_equity": { "value": "String", "color": "green|amber|red" },
  "operating_margin": { "value": "String", "color": "green|amber|red" },
  "price_trend_data": [
    {
      "date": "YYYY-MM-DD",
      "price": 150.50,
      "ema50": 145.20,
      "ema100": 130.00
    }
  ],
  "profit_and_loss_statement": "String (Brief summary)",
  "balance_sheet": "String (Brief summary)",
  "quarterly_results": "String (Brief summary)",
  "cash_flows_data": "String (Brief summary)",
  "important_ratios": "String (Brief summary of key ratios)",
  "pros": ["List", "of", "Pros"],
  "cons": ["List", "of", "Cons"],
  "buy_and_sell_verdict": "String (e.g. 'Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell' along with a brief 1 sentence reason)"
}`;

async function analyzeStock(symbol) {
  if (!GEMINI_API_KEY) {
    await loadApiKey(); // Try loading again if it failed initially
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API Key is not configured. Please ensure .env exists with GEMINI_API_KEY.");
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1alpha/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    system_instruction: {
      parts: { text: systemInstruction }
    },
    contents: [
      {
        parts: [
          { text: `Extract the company from this text and analyze it: ${symbol}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      response_mime_type: "application/json"
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  try {
    let textOutput = data.candidates[0].content.parts[0].text;
    textOutput = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(textOutput);
  } catch (e) {
    throw new Error("Failed to parse Gemini response as JSON. Response was: " + data.candidates[0].content.parts[0].text);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeStock') {
    analyzeStock(request.symbol)
      .then(data => sendResponse({ data: data }))
      .catch(error => sendResponse({ error: error.message }));

    return true; // Indicates we will send a response asynchronously
  }
});
