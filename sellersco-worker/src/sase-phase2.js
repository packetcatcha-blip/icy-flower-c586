// SASE Phase 2 - Advanced Secure Access Service Edge
// Continuation of Phase 1 with advanced networking and zero trust integration

const SASE_COMPONENTS = [
  {
    name: "Secure Web Gateway",
    status: "ACTIVE",
    threats_blocked_24h: 34560,
    bandwidth_saving: "23%",
    compliance: 98,
    description: "Cloud-based web filtering and malware protection"
  },
  {
    name: "Cloud Access Security Broker",
    status: "ACTIVE",
    threats_blocked_24h: 12340,
    bandwidth_saving: "15%",
    compliance: 96,
    description: "Visibility and control of SaaS application access"
  },
  {
    name: "Firewall as a Service",
    status: "ACTIVE",
    threats_blocked_24h: 8920,
    bandwidth_saving: "8%",
    compliance: 97,
    description: "Cloud-native next-gen firewall for network protection"
  },
  {
    name: "Zero Trust Network Access",
    status: "ACTIVE",
    threats_blocked_24h: 5670,
    bandwidth_saving: "5%",
    compliance: 99,
    description: "Microsegmentation and continuous trust verification"
  }
];

const PERFORMANCE_DATA = {
  latency_ms: 12.4,
  throughput_gbps: 847.5,
  availability: 99.98,
  cache_hit_ratio: 87.3,
  tcp_optimization: 98.2
};

const ADVANCED_FEATURES = [
  {
    feature: "AI-Powered Threat Detection",
    status: "ENABLED",
    detections_24h: 2340,
    false_positive_rate: 0.3
  },
  {
    feature: "Behavioral Analytics",
    status: "ENABLED",
    anomalies_detected: 156,
    user_risk_score: "Medium"
  },
  {
    feature: "API Security",
    status: "ENABLED",
    apis_monitored: 427,
    vulnerabilities: 3
  },
  {
    feature: "DLP (Data Loss Prevention)",
    status: "ENABLED",
    incidents_prevented: 42,
    data_exfiltration_blocked: "8.4 GB"
  }
];

const SASE_LOCATIONS = [
  { location: "US West", status: "ACTIVE", users: 4230, latency: 8.2 },
  { location: "US East", status: "ACTIVE", users: 5670, latency: 6.1 },
  { location: "Europe", status: "ACTIVE", users: 3450, latency: 9.8 },
  { location: "Asia Pacific", status: "ACTIVE", users: 2890, latency: 15.3 },
  { location: "Middle East", status: "ACTIVE", users: 890, latency: 12.7 }
];

export async function handleSASEPhase2(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  if (pathname.startsWith('/sase-phase2/api/')) {
    const apiPath = pathname.slice('/sase-phase2/api/'.length);
    
    if (apiPath === 'components' && request.method === 'GET') {
      return jsonResponse(SASE_COMPONENTS);
    }
    
    if (apiPath === 'performance' && request.method === 'GET') {
      return jsonResponse(PERFORMANCE_DATA);
    }
    
    if (apiPath === 'features' && request.method === 'GET') {
      return jsonResponse(ADVANCED_FEATURES);
    }
    
    if (apiPath === 'locations' && request.method === 'GET') {
      return jsonResponse(SASE_LOCATIONS);
    }
  }
  
  return new Response(renderSASEPhase2UI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderSASEPhase2UI() {
  const componentRows = SASE_COMPONENTS.map(c => `
    <div class="component-row">
      <div class="component-name">${c.name}</div>
      <div class="status-badge">${c.status}</div>
      <div class="metric">${c.threats_blocked_24h.toLocaleString()}</div>
      <div class="metric">${c.bandwidth_saving}</div>
      <div class="metric">${c.compliance}%</div>
    </div>
  `).join('');
  
  const featureRows = ADVANCED_FEATURES.map(f => `
    <div class="feature-row">
      <div class="feature-name">${f.feature}</div>
      <div class="feature-status">${f.status}</div>
      <div class="feature-metric">${typeof f.detections_24h === 'number' ? f.detections_24h.toLocaleString() : (typeof f.anomalies_detected === 'number' ? f.anomalies_detected : (typeof f.apis_monitored === 'number' ? f.apis_monitored : f.incidents_prevented))}</div>
    </div>
  `).join('');
  
  const locationRows = SASE_LOCATIONS.map(l => `
    <div class="location-row">
      <div>${l.location}</div>
      <div>${l.status}</div>
      <div>${l.users.toLocaleString()}</div>
      <div>${l.latency}ms</div>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SASE Phase 2 - Advanced Networking</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #0a1a3e 0%, #1a2847 100%);
      color: #e0e0e0;
      min-height: 100vh;
    }
    
    .header {
      background: linear-gradient(90deg, #ec4899 0%, #f43f5e 100%);
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
    }
    
    .header h1 {
      font-size: 32px;
      color: white;
      font-weight: 700;
    }
    
    .container {
      max-width: 1400px;
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
      background: rgba(236, 72, 153, 0.1);
      border: 2px solid #ec4899;
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
      color: #ec4899;
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
      background: rgba(236, 72, 153, 0.1);
      color: #ec4899;
      border: 2px solid #ec4899;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .tab-btn.active {
      background: #ec4899;
      color: white;
    }
    
    .tab-btn:hover {
      background: #ec4899;
      color: white;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .component-row, .feature-row, .location-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      gap: 15px;
      padding: 12px;
      border-bottom: 1px solid rgba(236, 72, 153, 0.1);
    }
    
    .location-row {
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
    }
    
    .feature-row {
      grid-template-columns: 2fr 1fr 1fr;
    }
    
    .component-name, .feature-name {
      color: #e0e0e0;
      font-weight: 500;
    }
    
    .status-badge {
      background: #00cc33;
      color: white;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
      text-align: center;
    }
    
    .metric {
      color: #ec4899;
      text-align: right;
    }
    
    .feature-status {
      color: #00cc33;
      font-weight: 600;
      text-align: center;
    }
    
    .feature-metric {
      color: #ec4899;
      text-align: right;
    }
    
    h2 {
      color: #ec4899;
      margin-bottom: 20px;
    }
    
    @media (max-width: 768px) {
      .component-row, .feature-row {
        grid-template-columns: 1fr 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌐 SASE Phase 2 - Advanced Networking</h1>
    <p>Enterprise-grade secure access with zero trust integration</p>
  </div>
  
  <div class="container">
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Avg Latency</div>
        <div class="metric-value">${PERFORMANCE_DATA.latency_ms}ms</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Throughput</div>
        <div class="metric-value">${PERFORMANCE_DATA.throughput_gbps}Gbps</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Availability</div>
        <div class="metric-value">${PERFORMANCE_DATA.availability}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Cache Hit Ratio</div>
        <div class="metric-value">${PERFORMANCE_DATA.cache_hit_ratio}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">TCP Optimization</div>
        <div class="metric-value">${PERFORMANCE_DATA.tcp_optimization}%</div>
      </div>
    </div>
    
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('components')">Core Components</button>
      <button class="tab-btn" onclick="switchTab('features')">Advanced Features</button>
      <button class="tab-btn" onclick="switchTab('locations')">Global Locations</button>
    </div>
    
    <div id="components" class="tab-content active">
      <h2>SASE Components & Threat Protection</h2>
      <div class="component-row" style="font-weight: 600; border-bottom: 2px solid #ec4899; padding: 15px 12px;">
        <div>Component</div>
        <div>Status</div>
        <div>Threats Blocked (24H)</div>
        <div>Bandwidth Saved</div>
        <div>Compliance</div>
      </div>
      ${componentRows}
    </div>
    
    <div id="features" class="tab-content">
      <h2>Advanced Security Features</h2>
      <div class="feature-row" style="font-weight: 600; border-bottom: 2px solid #ec4899; padding: 15px 12px;">
        <div>Feature</div>
        <div>Status</div>
        <div>Activity (24H)</div>
      </div>
      ${featureRows}
    </div>
    
    <div id="locations" class="tab-content">
      <h2>Global SASE Points of Presence</h2>
      <div class="location-row" style="font-weight: 600; border-bottom: 2px solid #ec4899; padding: 15px 12px;">
        <div>Location</div>
        <div>Status</div>
        <div>Active Users</div>
        <div>Avg Latency</div>
      </div>
      ${locationRows}
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
