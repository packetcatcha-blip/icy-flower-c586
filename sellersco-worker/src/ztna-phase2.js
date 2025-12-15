// ZTNA Phase 2 - Advanced Zero Trust Network Access
// Microsegmentation, continuous authentication, and advanced policies

const TRUST_ZONES = [
  {
    name: "DMZ & Public Facing",
    risk_level: "HIGH",
    devices: 234,
    users: 120,
    applications: 45,
    policy_violations: 3,
    avg_trust_score: 62
  },
  {
    name: "Internal Corporate",
    risk_level: "MEDIUM",
    devices: 1847,
    users: 890,
    applications: 234,
    policy_violations: 12,
    avg_trust_score: 82
  },
  {
    name: "Data Center & Servers",
    risk_level: "CRITICAL",
    devices: 847,
    users: 45,
    applications: 178,
    policy_violations: 1,
    avg_trust_score: 95
  },
  {
    name: "Restricted Research",
    risk_level: "CRITICAL",
    devices: 123,
    users: 34,
    applications: 67,
    policy_violations: 0,
    avg_trust_score: 99
  }
];

const MICROSEGMENTATION_POLICIES = [
  {
    policy: "Database Access Control",
    status: "ENFORCED",
    match_count: 4230,
    blocks: 127,
    allows: 4103
  },
  {
    policy: "API Gateway Protection",
    status: "ENFORCED",
    match_count: 8920,
    blocks: 342,
    allows: 8578
  },
  {
    policy: "Lateral Movement Prevention",
    status: "ENFORCED",
    match_count: 2340,
    blocks: 89,
    allows: 2251
  },
  {
    policy: "Sensitive Data Access",
    status: "ENFORCED",
    match_count: 1567,
    blocks: 0,
    allows: 1567
  }
];

const CONTINUOUS_AUTH_FACTORS = [
  { factor: "Device Posture", status: "VERIFIED", confidence: 98 },
  { factor: "User Behavior", status: "VERIFIED", confidence: 94 },
  { factor: "Network Location", status: "VERIFIED", confidence: 99 },
  { factor: "Time-based Access", status: "VERIFIED", confidence: 97 },
  { factor: "Risk Scoring", status: "VERIFIED", confidence: 92 },
  { factor: "Geolocation Check", status: "VERIFIED", confidence: 96 }
];

const THREAT_VECTORS = [
  { vector: "Lateral Movement", blocked: 234, detected: 18 },
  { vector: "Privilege Escalation", blocked: 156, detected: 4 },
  { vector: "Data Exfiltration", blocked: 78, detected: 2 },
  { vector: "Credential Abuse", blocked: 342, detected: 12 },
  { vector: "Application Exploit", blocked: 89, detected: 3 }
];

const ZERO_TRUST_METRICS = {
  total_sessions: 58340,
  verified_sessions: 57982,
  denied_sessions: 358,
  avg_trust_score: 89.2,
  threat_interventions: 899
};

export async function handleZTNAPhase2(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  if (pathname.startsWith('/ztna-phase2/api/')) {
    const apiPath = pathname.slice('/ztna-phase2/api/'.length);
    
    if (apiPath === 'zones' && request.method === 'GET') {
      return jsonResponse(TRUST_ZONES);
    }
    
    if (apiPath === 'policies' && request.method === 'GET') {
      return jsonResponse(MICROSEGMENTATION_POLICIES);
    }
    
    if (apiPath === 'auth-factors' && request.method === 'GET') {
      return jsonResponse(CONTINUOUS_AUTH_FACTORS);
    }
    
    if (apiPath === 'threats' && request.method === 'GET') {
      return jsonResponse(THREAT_VECTORS);
    }
  }
  
  return new Response(renderZTNAPhase2UI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderZTNAPhase2UI() {
  const zoneRows = TRUST_ZONES.map(z => `
    <div class="zone-row">
      <div class="zone-name">${z.name}</div>
      <div class="risk-level ${z.risk_level.toLowerCase()}">${z.risk_level}</div>
      <div class="metric">${z.devices}</div>
      <div class="metric">${z.users}</div>
      <div class="metric">${z.applications}</div>
      <div class="metric warning">${z.policy_violations}</div>
      <div class="metric trust-score">${z.avg_trust_score}%</div>
    </div>
  `).join('');
  
  const policyRows = MICROSEGMENTATION_POLICIES.map(p => `
    <div class="policy-row">
      <div class="policy-name">${p.policy}</div>
      <div class="status-badge">${p.status}</div>
      <div class="metric">${p.match_count.toLocaleString()}</div>
      <div class="metric blocked">${p.blocks}</div>
      <div class="metric allowed">${p.allows}</div>
    </div>
  `).join('');
  
  const authRows = CONTINUOUS_AUTH_FACTORS.map(a => `
    <div class="auth-row">
      <div class="auth-factor">${a.factor}</div>
      <div class="status-verified">${a.status}</div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="width: ${a.confidence}%"></div>
      </div>
      <div class="confidence-text">${a.confidence}%</div>
    </div>
  `).join('');
  
  const threatRows = THREAT_VECTORS.map(t => `
    <div class="threat-vector-row">
      <div class="vector-name">${t.vector}</div>
      <div class="metric blocked">${t.blocked}</div>
      <div class="metric detected">${t.detected}</div>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZTNA Phase 2 - Advanced Zero Trust</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #0f3a1f 0%, #1a4d2e 100%);
      color: #e0e0e0;
      min-height: 100vh;
    }
    
    .header {
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
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
      background: rgba(16, 185, 129, 0.1);
      border: 2px solid #10b981;
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
      color: #10b981;
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
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 2px solid #10b981;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .tab-btn.active {
      background: #10b981;
      color: white;
    }
    
    .tab-btn:hover {
      background: #10b981;
      color: white;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .zone-row, .policy-row, .threat-vector-row {
      display: grid;
      padding: 12px;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    }
    
    .zone-row {
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 15px;
    }
    
    .policy-row {
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      gap: 15px;
    }
    
    .threat-vector-row {
      grid-template-columns: 2fr 1fr 1fr;
      gap: 15px;
    }
    
    .zone-name, .policy-name, .vector-name {
      color: #e0e0e0;
      font-weight: 500;
    }
    
    .risk-level {
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
      text-align: center;
      font-weight: 600;
    }
    
    .risk-level.critical {
      background: rgba(255, 0, 0, 0.2);
      color: #ff0000;
    }
    
    .risk-level.high {
      background: rgba(255, 107, 53, 0.2);
      color: #ff6b35;
    }
    
    .risk-level.medium {
      background: rgba(255, 170, 0, 0.2);
      color: #ffaa00;
    }
    
    .metric {
      color: #10b981;
      text-align: right;
    }
    
    .metric.warning {
      color: #ff6b35;
      font-weight: 600;
    }
    
    .metric.trust-score {
      color: #10b981;
      font-weight: 600;
    }
    
    .metric.blocked {
      color: #ff6b35;
    }
    
    .metric.allowed {
      color: #10b981;
    }
    
    .metric.detected {
      color: #ffaa00;
    }
    
    .status-badge {
      background: #10b981;
      color: white;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
      text-align: center;
    }
    
    .auth-row {
      display: grid;
      grid-template-columns: 2fr 1fr 2fr 1fr;
      gap: 15px;
      padding: 12px;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    }
    
    .auth-factor {
      color: #e0e0e0;
      font-weight: 500;
    }
    
    .status-verified {
      color: #10b981;
      text-align: center;
      font-weight: 600;
    }
    
    .confidence-bar {
      background: rgba(16, 185, 129, 0.2);
      height: 20px;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .confidence-fill {
      background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
      height: 100%;
    }
    
    .confidence-text {
      color: #10b981;
      text-align: right;
      font-weight: 600;
    }
    
    h2 {
      color: #10b981;
      margin-bottom: 20px;
    }
    
    @media (max-width: 768px) {
      .zone-row, .policy-row {
        grid-template-columns: 1fr 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔐 ZTNA Phase 2 - Advanced Zero Trust Access</h1>
    <p>Microsegmentation, continuous authentication, and threat prevention</p>
  </div>
  
  <div class="container">
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Sessions</div>
        <div class="metric-value">${ZERO_TRUST_METRICS.total_sessions.toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Verified Sessions</div>
        <div class="metric-value">${ZERO_TRUST_METRICS.verified_sessions.toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Denied Sessions</div>
        <div class="metric-value">${ZERO_TRUST_METRICS.denied_sessions}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Trust Score</div>
        <div class="metric-value">${ZERO_TRUST_METRICS.avg_trust_score}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Threat Interventions</div>
        <div class="metric-value">${ZERO_TRUST_METRICS.threat_interventions}</div>
      </div>
    </div>
    
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('zones')">Trust Zones</button>
      <button class="tab-btn" onclick="switchTab('policies')">Segmentation Policies</button>
      <button class="tab-btn" onclick="switchTab('auth')">Continuous Authentication</button>
      <button class="tab-btn" onclick="switchTab('threats')">Threat Prevention</button>
    </div>
    
    <div id="zones" class="tab-content active">
      <h2>Trust Zone Classification & Monitoring</h2>
      <div class="zone-row" style="font-weight: 600; border-bottom: 2px solid #10b981; padding: 15px 12px;">
        <div>Zone</div>
        <div>Risk Level</div>
        <div>Devices</div>
        <div>Users</div>
        <div>Apps</div>
        <div>Violations</div>
        <div>Trust Score</div>
      </div>
      ${zoneRows}
    </div>
    
    <div id="policies" class="tab-content">
      <h2>Microsegmentation Policies</h2>
      <div class="policy-row" style="font-weight: 600; border-bottom: 2px solid #10b981; padding: 15px 12px;">
        <div>Policy</div>
        <div>Status</div>
        <div>Total Matches</div>
        <div>Blocked</div>
        <div>Allowed</div>
      </div>
      ${policyRows}
    </div>
    
    <div id="auth" class="tab-content">
      <h2>Continuous Authentication Factors</h2>
      <div class="auth-row" style="font-weight: 600; border-bottom: 2px solid #10b981; padding: 15px 12px;">
        <div>Factor</div>
        <div>Status</div>
        <div>Confidence Level</div>
        <div>Score</div>
      </div>
      ${authRows}
    </div>
    
    <div id="threats" class="tab-content">
      <h2>Threat Vector Prevention (24H)</h2>
      <div class="threat-vector-row" style="font-weight: 600; border-bottom: 2px solid #10b981; padding: 15px 12px;">
        <div>Threat Vector</div>
        <div>Blocked</div>
        <div>Detected</div>
      </div>
      ${threatRows}
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
