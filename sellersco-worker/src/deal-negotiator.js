// Deal Negotiator - Sales ROI Calculator & Discount Optimizer
// Real-time deal value calculator with discount recommendations

const DISCOUNT_TIERS = [
  { minSeats: 1, maxSeats: 50, baseDiscount: 0, label: "1-50 Seats" },
  { minSeats: 51, maxSeats: 250, baseDiscount: 10, label: "51-250 Seats" },
  { minSeats: 251, maxSeats: 1000, baseDiscount: 20, label: "251-1K Seats" },
  { minSeats: 1001, maxSeats: 5000, baseDiscount: 30, label: "1K-5K Seats" },
  { minSeats: 5001, maxSeats: Infinity, baseDiscount: 40, label: "5K+ Seats" }
];

const CONTRACT_TERMS = [
  { months: 12, label: "1 Year", discount: 5 },
  { months: 24, label: "2 Years", discount: 15 },
  { months: 36, label: "3 Years", discount: 25 }
];

const PRICING_MODULES = [
  { name: "Platform Essentials", basePrice: 50, description: "Core security platform" },
  { name: "Advanced Threat Detection", basePrice: 30, description: "AI-powered threat detection" },
  { name: "Compliance & Audit", basePrice: 25, description: "Regulatory compliance suite" },
  { name: "SASE Integration", basePrice: 40, description: "Secure access service edge" },
  { name: "Incident Response", basePrice: 35, description: "24/7 incident response" }
];

const DEAL_HISTORY = [
  { companyName: "Tech Corp", seats: 500, modules: 3, contractTerm: 24, dealValue: 187500, discount: 25, closureDate: "Dec 1, 2025", status: "CLOSED" },
  { companyName: "Finance Inc", seats: 250, modules: 4, contractTerm: 12, dealValue: 112500, discount: 15, closureDate: "Dec 10, 2025", status: "CLOSED" },
  { companyName: "Healthcare Sys", seats: 1200, modules: 5, contractTerm: 36, dealValue: 720000, discount: 35, closureDate: "Dec 8, 2025", status: "CLOSED" },
  { companyName: "Retail Chains", seats: 100, modules: 2, contractTerm: 12, dealValue: 36000, discount: 5, closureDate: "Nov 28, 2025", status: "CLOSED" }
];

const ROI_BENCHMARKS = {
  securityBreach: 4300000,
  complianceFine: 500000,
  downtimePerHour: 50000,
  fraudDetectionValue: 250000,
  automationSavings: 150000
};

export async function handleDealNegotiator(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  // API endpoints
  if (pathname.startsWith('/deal-negotiator/api/')) {
    const apiPath = pathname.slice('/deal-negotiator/api/'.length);
    
    if (apiPath === 'calculate' && request.method === 'POST') {
      try {
        const data = await request.json();
        const calculation = calculateDealValue(data);
        return jsonResponse(calculation);
      } catch (e) {
        return jsonResponse({ error: 'Invalid request' }, 400);
      }
    }
    
    if (apiPath === 'history' && request.method === 'GET') {
      return jsonResponse(DEAL_HISTORY);
    }
    
    if (apiPath === 'benchmarks' && request.method === 'GET') {
      return jsonResponse(ROI_BENCHMARKS);
    }
  }
  
  // Main UI
  return new Response(renderDealNegotiatorUI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function calculateDealValue(params) {
  const { seats, modules, contractMonths } = params;
  
  // Find applicable discount tier
  const tier = DISCOUNT_TIERS.find(t => seats >= t.minSeats && seats <= t.maxSeats) || DISCOUNT_TIERS[0];
  const contractDiscount = CONTRACT_TERMS.find(t => t.months === contractMonths)?.discount || 0;
  
  // Calculate base value
  let baseValue = 0;
  modules.forEach(moduleIdx => {
    if (moduleIdx >= 0 && moduleIdx < PRICING_MODULES.length) {
      baseValue += PRICING_MODULES[moduleIdx].basePrice * seats;
    }
  });
  
  // Calculate total discount
  const totalDiscount = tier.baseDiscount + contractDiscount;
  const discountedValue = baseValue * (1 - totalDiscount / 100);
  const annualValue = (discountedValue / contractMonths) * 12;
  
  return {
    baseValue: Math.round(baseValue),
    seatCount: seats,
    moduleCount: modules.length,
    contractTerm: contractMonths,
    tierDiscount: tier.baseDiscount,
    contractDiscount: contractDiscount,
    totalDiscount: totalDiscount,
    discountedValue: Math.round(discountedValue),
    annualizedValue: Math.round(annualValue),
    pricePerSeat: Math.round((discountedValue / seats) / (contractMonths / 12))
  };
}

function renderDealNegotiatorUI() {
  const historyHtml = DEAL_HISTORY.map(deal => `
    <div class="deal-row">
      <div class="deal-col">${deal.companyName}</div>
      <div class="deal-col">${deal.seats.toLocaleString()} seats</div>
      <div class="deal-col">${deal.modules} modules</div>
      <div class="deal-col">${deal.contractTerm} months</div>
      <div class="deal-col deal-value">$${deal.dealValue.toLocaleString()}</div>
      <div class="deal-col deal-discount">${deal.discount}%</div>
      <div class="deal-col deal-status">CLOSED</div>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deal Negotiator - ROI Calculator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #0a0a2e 0%, #16213e 100%);
      color: #e0e0e0;
      min-height: 100vh;
    }
    
    .header {
      background: linear-gradient(90deg, #00d4ff 0%, #0099cc 100%);
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
    }
    
    .header h1 {
      font-size: 32px;
      color: white;
      font-weight: 700;
    }
    
    .header p {
      color: rgba(255, 255, 255, 0.9);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }
    
    .calculator-section {
      background: rgba(0, 212, 255, 0.05);
      border: 2px solid #00d4ff;
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 30px;
    }
    
    .input-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .input-group {
      display: flex;
      flex-direction: column;
    }
    
    .input-group label {
      color: #00d4ff;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .input-group input, .input-group select {
      padding: 12px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #00d4ff;
      color: #00d4ff;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .input-group input::placeholder {
      color: #0088aa;
    }
    
    .modules-select {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
      margin: 10px 0;
    }
    
    .module-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid #00d4ff;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .module-checkbox input {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin: 0;
    }
    
    .module-checkbox:hover {
      background: rgba(0, 212, 255, 0.15);
    }
    
    .calculate-btn {
      padding: 12px 30px;
      background: #00d4ff;
      color: #0a0a2e;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .calculate-btn:hover {
      background: #00ffff;
      transform: translateY(-2px);
    }
    
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    
    .result-card {
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid #00d4ff;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
    }
    
    .result-label {
      color: #0088aa;
      font-size: 12px;
      margin-bottom: 8px;
    }
    
    .result-value {
      color: #00ffff;
      font-size: 24px;
      font-weight: 700;
    }
    
    .tabs {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .tab-btn {
      padding: 12px 24px;
      background: rgba(0, 212, 255, 0.1);
      color: #00d4ff;
      border: 2px solid #00d4ff;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .tab-btn.active {
      background: #00d4ff;
      color: #0a0a2e;
    }
    
    .tab-btn:hover {
      background: #00d4ff;
      color: #0a0a2e;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .deal-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .deal-header {
      background: rgba(0, 212, 255, 0.1);
      border-bottom: 2px solid #00d4ff;
    }
    
    .deal-header .deal-col {
      padding: 12px;
      color: #00d4ff;
      font-weight: 600;
      text-align: left;
      font-size: 12px;
    }
    
    .deal-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      border-bottom: 1px solid rgba(0, 212, 255, 0.1);
      padding: 12px;
      gap: 15px;
    }
    
    .deal-col {
      padding: 8px;
      color: #e0e0e0;
      font-size: 13px;
    }
    
    .deal-value {
      color: #00ffff;
      font-weight: 600;
    }
    
    .deal-discount {
      color: #00d4ff;
      font-weight: 600;
    }
    
    .deal-status {
      color: #00cc33;
      font-weight: 600;
    }
    
    .roi-section {
      background: rgba(0, 212, 255, 0.05);
      border: 1px solid #00d4ff;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
    }
    
    .roi-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(0, 212, 255, 0.1);
    }
    
    .roi-item:last-child {
      border-bottom: none;
    }
    
    .roi-label {
      color: #999;
    }
    
    .roi-value {
      color: #00ffff;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .deal-row {
        grid-template-columns: 1fr 1fr;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>💰 Deal Negotiator - ROI Calculator</h1>
    <p>Real-time deal value calculation and discount optimization</p>
  </div>
  
  <div class="container">
    <div class="calculator-section">
      <h2 style="margin-bottom: 20px; color: #00d4ff;">Build Your Deal</h2>
      
      <div class="input-grid">
        <div class="input-group">
          <label>Number of Seats</label>
          <input type="number" id="seatCount" placeholder="e.g., 500" value="500" min="1">
        </div>
        <div class="input-group">
          <label>Contract Term</label>
          <select id="contractTerm">
            <option value="12">1 Year (5% discount)</option>
            <option value="24" selected>2 Years (15% discount)</option>
            <option value="36">3 Years (25% discount)</option>
          </select>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="color: #00d4ff; font-weight: 600; display: block; margin-bottom: 10px;">Select Modules</label>
        <div class="modules-select">
          ${PRICING_MODULES.map((mod, idx) => `
            <label class="module-checkbox">
              <input type="checkbox" value="${idx}" class="module-check" ${idx < 3 ? 'checked' : ''}>
              <span>${mod.name}</span>
            </label>
          `).join('')}
        </div>
      </div>
      
      <button class="calculate-btn" onclick="calculateDeal()">Calculate Deal Value</button>
      
      <div id="results" style="display: none;">
        <h3 style="color: #00d4ff; margin: 20px 0 15px 0;">Deal Breakdown</h3>
        <div class="results-grid">
          <div class="result-card">
            <div class="result-label">Base Value</div>
            <div class="result-value" id="baseValue">$0</div>
          </div>
          <div class="result-card">
            <div class="result-label">Total Discount</div>
            <div class="result-value" id="totalDiscount">0%</div>
          </div>
          <div class="result-card">
            <div class="result-label">Deal Value</div>
            <div class="result-value" id="dealValue">$0</div>
          </div>
          <div class="result-card">
            <div class="result-label">Annual Value</div>
            <div class="result-value" id="annualValue">$0</div>
          </div>
          <div class="result-card">
            <div class="result-label">Price/Seat/Year</div>
            <div class="result-value" id="pricePerSeat">$0</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('history')">Recent Deals</button>
      <button class="tab-btn" onclick="switchTab('roi')">ROI Benchmarks</button>
    </div>
    
    <div id="history" class="tab-content active">
      <h2 style="margin-bottom: 20px; color: #00d4ff;">Closed Deals</h2>
      <div class="deal-table">
        <div class="deal-row deal-header">
          <div class="deal-col">Company</div>
          <div class="deal-col">Seats</div>
          <div class="deal-col">Modules</div>
          <div class="deal-col">Term</div>
          <div class="deal-col">Deal Value</div>
          <div class="deal-col">Discount</div>
          <div class="deal-col">Status</div>
        </div>
        ${historyHtml}
      </div>
    </div>
    
    <div id="roi" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #00d4ff;">ROI Benchmarks & Business Impact</h2>
      <div class="roi-section">
        <h3 style="color: #00d4ff; margin-bottom: 15px;">Cost Avoidance (Annual)</h3>
        <div class="roi-item">
          <span class="roi-label">Security Breach Prevention</span>
          <span class="roi-value">$4.3M avg</span>
        </div>
        <div class="roi-item">
          <span class="roi-label">Compliance Fine Avoidance</span>
          <span class="roi-value">$500K avg</span>
        </div>
        <div class="roi-item">
          <span class="roi-label">Infrastructure Downtime Prevention</span>
          <span class="roi-value">$50K/hr saved</span>
        </div>
        <div class="roi-item">
          <span class="roi-label">Fraud Detection Value</span>
          <span class="roi-value">$250K avg</span>
        </div>
        <div class="roi-item">
          <span class="roi-label">Security Operations Automation</span>
          <span class="roi-value">$150K savings</span>
        </div>
      </div>
      <div style="margin-top: 15px; padding: 15px; background: rgba(0, 212, 255, 0.1); border-radius: 6px; color: #00d4ff;">
        <strong>Total Potential Value:</strong> $5.2M+ annually per enterprise customer
      </div>
    </div>
  </div>
  
  <script>
    const PRICING_MODULES = ${JSON.stringify(PRICING_MODULES)};
    
    function switchTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      event.target.classList.add('active');
    }
    
    async function calculateDeal() {
      const seats = parseInt(document.getElementById('seatCount').value);
      const contractMonths = parseInt(document.getElementById('contractTerm').value);
      const modules = Array.from(document.querySelectorAll('.module-check:checked')).map(e => parseInt(e.value));
      
      if (seats < 1 || modules.length === 0) {
        alert('Please enter valid seat count and select at least one module');
        return;
      }
      
      try {
        const response = await fetch('/deal-negotiator/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seats, modules, contractMonths })
        });
        const data = await response.json();
        
        document.getElementById('baseValue').textContent = '$' + data.baseValue.toLocaleString();
        document.getElementById('totalDiscount').textContent = data.totalDiscount + '%';
        document.getElementById('dealValue').textContent = '$' + data.discountedValue.toLocaleString();
        document.getElementById('annualValue').textContent = '$' + data.annualizedValue.toLocaleString();
        document.getElementById('pricePerSeat').textContent = '$' + data.pricePerSeat.toLocaleString();
        document.getElementById('results').style.display = 'block';
      } catch (e) {
        alert('Error calculating deal value');
      }
    }
  </script>
</body>
</html>
  `;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
