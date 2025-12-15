// Fusion Dashboard - Unified Security Metrics & Analytics
// Real-time aggregation of security metrics across all platforms

const DASHBOARD_METRICS = {
  totalEvents: 1247850,
  securityEvents: 45230,
  threats: 384,
  activeIncidents: 12,
  mttd: 4.2,
  mttr: 2.1,
  preventedBreach: 23,
  complianceScore: 94,
  assetCoverage: 99.2
};

const METRICS_TIMELINE = [
  { time: "00:00", events: 1200, threats: 8, incidents: 1 },
  { time: "04:00", events: 980, threats: 5, incidents: 0 },
  { time: "08:00", events: 2340, threats: 15, incidents: 2 },
  { time: "12:00", events: 3100, threats: 22, incidents: 3 },
  { time: "16:00", events: 2800, threats: 18, incidents: 2 },
  { time: "20:00", events: 2450, threats: 12, incidents: 1 }
];

const SECURITY_POSTURE = [
  { category: "Patch Management", score: 92, trend: "+2%" },
  { category: "Access Control", score: 87, trend: "+5%" },
  { category: "Data Protection", score: 95, trend: "stable" },
  { category: "Incident Response", score: 88, trend: "+3%" },
  { category: "Vulnerability Mgmt", score: 82, trend: "-1%" },
  { category: "Threat Intelligence", score: 91, trend: "+4%" }
];

const ASSET_INVENTORY = [
  { type: "Servers", count: 2847, protected: 2841, risk: 6 },
  { type: "Workstations", count: 12450, protected: 12388, risk: 62 },
  { type: "Applications", count: 523, protected: 519, risk: 4 },
  { type: "Databases", count: 187, protected: 187, risk: 0 },
  { type: "APIs", count: 342, protected: 336, risk: 6 }
];

const TOP_THREATS = [
  { name: "Credential Stuffing", events: 4230, status: "BLOCKED", severity: "HIGH" },
  { name: "SQL Injection Attempts", events: 1850, status: "BLOCKED", severity: "CRITICAL" },
  { name: "DDoS Probes", events: 3920, status: "MITIGATED", severity: "MEDIUM" },
  { name: "Malware Downloads", events: 280, status: "BLOCKED", severity: "CRITICAL" },
  { name: "Unauthorized Access", events: 145, status: "ISOLATED", severity: "CRITICAL" }
];

const ALERT_STATUS = {
  critical: 8,
  high: 34,
  medium: 127,
  low: 456
};

export async function handleFusionDashboard(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  // API endpoints
  if (pathname.startsWith('/fusion-dash/api/')) {
    const apiPath = pathname.slice('/fusion-dash/api/'.length);
    
    if (apiPath === 'metrics' && request.method === 'GET') {
      return jsonResponse(DASHBOARD_METRICS);
    }
    
    if (apiPath === 'timeline' && request.method === 'GET') {
      return jsonResponse(METRICS_TIMELINE);
    }
    
    if (apiPath === 'posture' && request.method === 'GET') {
      return jsonResponse(SECURITY_POSTURE);
    }
    
    if (apiPath === 'assets' && request.method === 'GET') {
      return jsonResponse(ASSET_INVENTORY);
    }
    
    if (apiPath === 'threats' && request.method === 'GET') {
      return jsonResponse(TOP_THREATS);
    }
  }
  
  // Main UI
  return new Response(renderFusionDashboardUI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderFusionDashboardUI() {
  const postureBars = SECURITY_POSTURE.map(item => `
    <div class="posture-item">
      <div class="posture-label">${item.category}</div>
      <div class="posture-bar">
        <div class="posture-fill" style="width: ${item.score}%"></div>
      </div>
      <div class="posture-stats">
        <span class="posture-score">${item.score}%</span>
        <span class="posture-trend ${item.trend.includes('+') ? 'positive' : item.trend === 'stable' ? 'neutral' : 'negative'}">${item.trend}</span>
      </div>
    </div>
  `).join('');
  
  const assetRows = ASSET_INVENTORY.map(asset => `
    <div class="asset-row">
      <div>${asset.type}</div>
      <div>${asset.count.toLocaleString()}</div>
      <div style="color: #00cc33;">${asset.protected.toLocaleString()}</div>
      <div style="color: #ff6b35;">${asset.risk}</div>
      <div>${Math.round((asset.protected / asset.count) * 100)}%</div>
    </div>
  `).join('');
  
  const threatRows = TOP_THREATS.map(threat => `
    <div class="threat-row severity-${threat.severity.toLowerCase()}">
      <div class="threat-name">${threat.name}</div>
      <div class="threat-events">${threat.events.toLocaleString()}</div>
      <div class="threat-status">${threat.status}</div>
      <div class="threat-severity">${threat.severity}</div>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fusion Dashboard - Security Analytics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%);
      color: #e0e0e0;
      min-height: 100vh;
    }
    
    .header {
      background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
    }
    
    .header h1 {
      font-size: 32px;
      color: white;
      font-weight: 700;
    }
    
    .container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 30px 20px;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .metric-card {
      background: rgba(99, 102, 241, 0.1);
      border: 2px solid #6366f1;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .metric-label {
      color: #999;
      font-size: 11px;
      margin-bottom: 10px;
    }
    
    .metric-value {
      color: #6366f1;
      font-size: 26px;
      font-weight: 700;
    }
    
    .metric-unit {
      color: #666;
      font-size: 12px;
      margin-top: 5px;
    }
    
    .tabs {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .tab-btn {
      padding: 12px 24px;
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      border: 2px solid #6366f1;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .tab-btn.active {
      background: #6366f1;
      color: white;
    }
    
    .tab-btn:hover {
      background: #6366f1;
      color: white;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .posture-container {
      display: grid;
      gap: 20px;
    }
    
    .posture-item {
      background: rgba(99, 102, 241, 0.05);
      border: 1px solid #6366f1;
      padding: 15px;
      border-radius: 6px;
    }
    
    .posture-label {
      color: #6366f1;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .posture-bar {
      background: rgba(99, 102, 241, 0.1);
      height: 24px;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    
    .posture-fill {
      background: linear-gradient(90deg, #6366f1 0%, #a78bfa 100%);
      height: 100%;
      transition: width 0.3s;
    }
    
    .posture-stats {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
    
    .posture-score {
      color: #6366f1;
      font-weight: 600;
    }
    
    .posture-trend {
      padding: 2px 8px;
      border-radius: 3px;
      font-weight: 600;
    }
    
    .posture-trend.positive {
      background: rgba(0, 204, 51, 0.2);
      color: #00cc33;
    }
    
    .posture-trend.neutral {
      background: rgba(153, 153, 153, 0.2);
      color: #999;
    }
    
    .posture-trend.negative {
      background: rgba(255, 107, 53, 0.2);
      color: #ff6b35;
    }
    
    .asset-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .asset-header {
      background: rgba(99, 102, 241, 0.1);
      border-bottom: 2px solid #6366f1;
    }
    
    .asset-header div {
      padding: 12px;
      color: #6366f1;
      font-weight: 600;
      text-align: left;
      font-size: 12px;
    }
    
    .asset-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
      border-bottom: 1px solid rgba(99, 102, 241, 0.1);
      padding: 12px;
      gap: 15px;
    }
    
    .asset-row div {
      padding: 8px;
      color: #e0e0e0;
      font-size: 13px;
    }
    
    .threat-table {
      display: grid;
      gap: 10px;
    }
    
    .threat-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 15px;
      padding: 12px;
      background: rgba(99, 102, 241, 0.05);
      border-left: 4px solid #6366f1;
      border-radius: 4px;
    }
    
    .threat-row.severity-critical {
      border-left-color: #ff0000;
      background: rgba(255, 0, 0, 0.05);
    }
    
    .threat-row.severity-high {
      border-left-color: #ff6b35;
      background: rgba(255, 107, 53, 0.05);
    }
    
    .threat-name {
      color: #e0e0e0;
      font-weight: 600;
    }
    
    .threat-events {
      color: #6366f1;
      text-align: right;
    }
    
    .threat-status {
      color: #00cc33;
      text-align: center;
      font-weight: 600;
    }
    
    .threat-severity {
      text-align: right;
      font-weight: 600;
    }
    
    .threat-row.severity-critical .threat-severity {
      color: #ff0000;
    }
    
    .threat-row.severity-high .threat-severity {
      color: #ff6b35;
    }
    
    .alert-summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .alert-box {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border: 2px solid;
    }
    
    .alert-box.critical {
      background: rgba(255, 0, 0, 0.1);
      border-color: #ff0000;
    }
    
    .alert-box.critical .count {
      color: #ff0000;
    }
    
    .alert-box.high {
      background: rgba(255, 107, 53, 0.1);
      border-color: #ff6b35;
    }
    
    .alert-box.high .count {
      color: #ff6b35;
    }
    
    .alert-box.medium {
      background: rgba(255, 170, 0, 0.1);
      border-color: #ffaa00;
    }
    
    .alert-box.medium .count {
      color: #ffaa00;
    }
    
    .alert-box.low {
      background: rgba(102, 153, 255, 0.1);
      border-color: #6699ff;
    }
    
    .alert-box.low .count {
      color: #6699ff;
    }
    
    .alert-label {
      color: #999;
      font-size: 11px;
      margin-bottom: 8px;
    }
    
    .count {
      font-size: 28px;
      font-weight: 700;
    }
    
    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .asset-row {
        grid-template-columns: 1fr 1fr;
      }
      .threat-row {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Fusion Dashboard - Security Analytics</h1>
  </div>
  
  <div class="container">
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Events (24H)</div>
        <div class="metric-value">${DASHBOARD_METRICS.totalEvents.toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Security Events</div>
        <div class="metric-value">${DASHBOARD_METRICS.securityEvents.toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Active Threats</div>
        <div class="metric-value">${DASHBOARD_METRICS.threats}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Open Incidents</div>
        <div class="metric-value">${DASHBOARD_METRICS.activeIncidents}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">MTTD (hours)</div>
        <div class="metric-value">${DASHBOARD_METRICS.mttd}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">MTTR (hours)</div>
        <div class="metric-value">${DASHBOARD_METRICS.mttr}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Breaches Prevented</div>
        <div class="metric-value">${DASHBOARD_METRICS.preventedBreach}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Compliance Score</div>
        <div class="metric-value">${DASHBOARD_METRICS.complianceScore}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Asset Coverage</div>
        <div class="metric-value">${DASHBOARD_METRICS.assetCoverage}%</div>
      </div>
    </div>
    
    <div class="alert-summary">
      <div class="alert-box critical">
        <div class="alert-label">Critical Alerts</div>
        <div class="count">${ALERT_STATUS.critical}</div>
      </div>
      <div class="alert-box high">
        <div class="alert-label">High Alerts</div>
        <div class="count">${ALERT_STATUS.high}</div>
      </div>
      <div class="alert-box medium">
        <div class="alert-label">Medium Alerts</div>
        <div class="count">${ALERT_STATUS.medium}</div>
      </div>
      <div class="alert-box low">
        <div class="alert-label">Low Alerts</div>
        <div class="count">${ALERT_STATUS.low}</div>
      </div>
    </div>
    
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('posture')">Security Posture</button>
      <button class="tab-btn" onclick="switchTab('assets')">Asset Inventory</button>
      <button class="tab-btn" onclick="switchTab('threats')">Top Threats</button>
    </div>
    
    <div id="posture" class="tab-content active">
      <h2 style="margin-bottom: 20px; color: #6366f1;">Security Posture by Category</h2>
      <div class="posture-container">
        ${postureBars}
      </div>
    </div>
    
    <div id="assets" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #6366f1;">Protected Assets & Coverage</h2>
      <div class="asset-table">
        <div class="asset-row asset-header">
          <div>Asset Type</div>
          <div>Total</div>
          <div>Protected</div>
          <div>At Risk</div>
          <div>Coverage</div>
        </div>
        ${assetRows}
      </div>
    </div>
    
    <div id="threats" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #6366f1;">Top Threat Vectors (24H)</h2>
      <div class="threat-table">
        ${threatRows}
      </div>
    </div>
  </div>
  
  <script>
    function switchTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      event.target.classList.add('active');
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
