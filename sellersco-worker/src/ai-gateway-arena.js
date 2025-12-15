// AI Gateway Arena - API Security Testing & Threat Simulation
// AI-powered attack pattern generation and API endpoint security validation

const API_ENDPOINTS = [
  {id: "api-001", name: "/api/auth/login", method: "POST", protection: "OAuth2", riskScore: 45, latency: "120ms", requests: 12500},
  {id: "api-002", name: "/api/users/profile", method: "GET", protection: "JWT", riskScore: 62, latency: "85ms", requests: 28400},
  {id: "api-003", name: "/api/payments/charge", method: "POST", protection: "mTLS", riskScore: 28, latency: "340ms", requests: 3200},
  {id: "api-004", name: "/api/data/export", method: "GET", protection: "API Key", riskScore: 78, latency: "220ms", requests: 540},
  {id: "api-005", name: "/api/admin/settings", method: "PATCH", protection: "JWT+RBAC", riskScore: 35, latency: "110ms", requests: 85},
  {id: "api-006", name: "/api/webhooks/events", method: "POST", protection: "Signature", riskScore: 52, latency: "95ms", requests: 15600}
];

const ATTACK_PATTERNS = [
  {
    name: "Credential Brute Force",
    description: "Automated password guessing attack",
    difficulty: "EASY",
    severity: "HIGH",
    methods: ["POST", "GET"],
    payload: "Rapid login attempts with common passwords",
    mitigation: "Rate limiting, account lockout, CAPTCHA"
  },
  {
    name: "JWT Token Forgery",
    description: "Create fake JWT tokens to impersonate users",
    difficulty: "MEDIUM",
    severity: "CRITICAL",
    methods: ["GET", "POST"],
    payload: "Craft unsigned or weak-signed JWT tokens",
    mitigation: "Verify token signature, check expiration, refresh token rotation"
  },
  {
    name: "API Key Leakage",
    description: "Discover hardcoded API keys in responses or logs",
    difficulty: "EASY",
    severity: "CRITICAL",
    methods: ["GET"],
    payload: "Scan error messages and response headers for API keys",
    mitigation: "Rotate keys, use secure storage, mask sensitive data in logs"
  },
  {
    name: "OWASP Injection Attacks",
    description: "SQL, NoSQL, command injection via API parameters",
    difficulty: "MEDIUM",
    severity: "CRITICAL",
    methods: ["POST", "PATCH", "DELETE"],
    payload: "Inject SQL/NoSQL/command syntax in request body",
    mitigation: "Parameterized queries, input validation, escaping"
  },
  {
    name: "Business Logic Bypasses",
    description: "Exploit workflow logic to gain unauthorized access",
    difficulty: "HARD",
    severity: "CRITICAL",
    methods: ["POST", "PATCH"],
    payload: "Manipulate sequences, skip validation steps, modify request order",
    mitigation: "Comprehensive business logic testing, state validation"
  },
  {
    name: "Zero-Day API Vulnerability",
    description: "Discover unknown vulnerabilities in custom APIs",
    difficulty: "HARD",
    severity: "CRITICAL",
    methods: ["POST", "PATCH", "DELETE"],
    payload: "Fuzzing, mutation testing, format string attacks",
    mitigation: "Regular security testing, code review, monitoring"
  }
];

const TEST_SCENARIOS = [
  {
    name: "OWASP API Top 10 Scan",
    description: "Comprehensive test against all OWASP API Security Top 10",
    duration: "15-20 min",
    coverage: "100%",
    vulnerabilitiesFound: 7,
    criticalFindings: 2
  },
  {
    name: "High-Speed Fuzzing",
    description: "Rapid mutation testing of all API parameters",
    duration: "5-10 min",
    coverage: "75%",
    vulnerabilitiesFound: 3,
    criticalFindings: 1
  },
  {
    name: "Authentication Bypass Simulation",
    description: "Test all authentication mechanisms for weaknesses",
    duration: "8-12 min",
    coverage: "95%",
    vulnerabilitiesFound: 4,
    criticalFindings: 2
  },
  {
    name: "Business Logic Testing",
    description: "Execute real business workflows with variations",
    duration: "20-30 min",
    coverage: "85%",
    vulnerabilitiesFound: 6,
    criticalFindings: 3
  }
];

const FINDINGS = [
  {
    finding: "API Key exposed in error message",
    endpoint: "/api/data/export",
    severity: "CRITICAL",
    status: "OPEN",
    discovered: "2 hours ago",
    description: "API key appears in 500 error response when request is malformed"
  },
  {
    finding: "Missing rate limiting on /api/auth/login",
    endpoint: "/api/auth/login",
    severity: "HIGH",
    status: "OPEN",
    discovered: "3 hours ago",
    description: "Endpoint accepts unlimited login attempts from same IP"
  },
  {
    finding: "JWT token expiration too long (90 days)",
    endpoint: "/api/users/profile",
    severity: "HIGH",
    status: "ASSIGNED",
    discovered: "5 hours ago",
    description: "Tokens valid for 90 days, reducing effectiveness of token rotation"
  },
  {
    finding: "IDOR in /api/users/profile",
    endpoint: "/api/users/profile",
    severity: "CRITICAL",
    status: "RESOLVED",
    discovered: "1 day ago",
    description: "User can access any other user's profile by changing user_id parameter"
  },
  {
    finding: "Missing authentication on /api/admin/settings",
    endpoint: "/api/admin/settings",
    severity: "CRITICAL",
    status: "RESOLVED",
    discovered: "2 days ago",
    description: "Admin settings endpoint could be accessed without JWT token"
  }
];

export async function handleAIGatewayArena(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  // API endpoints
  if (pathname.startsWith('/ai-gateway-arena/api/')) {
    const apiPath = pathname.slice('/ai-gateway-arena/api/'.length);
    
    if (apiPath === 'endpoints' && request.method === 'GET') {
      return jsonResponse(API_ENDPOINTS);
    }
    
    if (apiPath === 'attack-patterns' && request.method === 'GET') {
      return jsonResponse(ATTACK_PATTERNS);
    }
    
    if (apiPath === 'test-scenarios' && request.method === 'GET') {
      return jsonResponse(TEST_SCENARIOS);
    }
    
    if (apiPath === 'findings' && request.method === 'GET') {
      return jsonResponse(FINDINGS);
    }
  }
  
  // Main UI
  return new Response(renderAIGatewayUI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderAIGatewayUI() {
  const endpointsHtml = API_ENDPOINTS.map(api => `
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method method-${api.method.toLowerCase()}">${api.method}</span>
        <span class="endpoint-name">${api.name}</span>
      </div>
      <div class="endpoint-details">
        <div class="detail">
          <span class="label">Protection</span>
          <span class="value">${api.protection}</span>
        </div>
        <div class="detail">
          <span class="label">Risk</span>
          <span class="value risk-${Math.floor(api.riskScore / 33)}">${api.riskScore}%</span>
        </div>
        <div class="detail">
          <span class="label">Latency</span>
          <span class="value">${api.latency}</span>
        </div>
      </div>
    </div>
  `).join('');
  
  const attacksHtml = ATTACK_PATTERNS.map(attack => `
    <div class="attack-card severity-${attack.severity.toLowerCase()}">
      <h3>${attack.name}</h3>
      <p>${attack.description}</p>
      <div class="tags">
        <span class="tag difficulty-${attack.difficulty.toLowerCase()}">${attack.difficulty}</span>
        <span class="tag severity-${attack.severity.toLowerCase()}">${attack.severity}</span>
        <span class="tag">${attack.methods.join(', ')}</span>
      </div>
      <div class="card-details">
        <div><strong>Payload:</strong> ${attack.payload}</div>
        <div><strong>Mitigation:</strong> ${attack.mitigation}</div>
      </div>
    </div>
  `).join('');
  
  const scenariosHtml = TEST_SCENARIOS.map((scenario, idx) => `
    <div class="scenario-card">
      <h3>📊 ${scenario.name}</h3>
      <p>${scenario.description}</p>
      <div class="scenario-stats">
        <div class="stat">
          <span class="stat-label">Duration</span>
          <span class="stat-value">${scenario.duration}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Coverage</span>
          <span class="stat-value">${scenario.coverage}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Findings</span>
          <span class="stat-value">${scenario.vulnerabilitiesFound}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Critical</span>
          <span class="stat-value critical">${scenario.criticalFindings}</span>
        </div>
      </div>
      <button onclick="runTest(${idx})" style="width: 100%; padding: 10px; background: #00d4ff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 15px; font-weight: 600;">▶ Run Test</button>
    </div>
  `).join('');
  
  const findingsHtml = FINDINGS.map(f => `
    <div class="finding-row severity-${f.severity.toLowerCase()} status-${f.status.toLowerCase()}">
      <div class="finding-header">
        <span class="finding-severity">${f.severity}</span>
        <span class="finding-title">${f.finding}</span>
        <span class="finding-status">${f.status}</span>
      </div>
      <div class="finding-endpoint">${f.endpoint}</div>
      <div class="finding-details">${f.description}</div>
      <div class="finding-age">${f.discovered}</div>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Gateway Arena</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%);
      color: #00d4ff;
      min-height: 100vh;
    }
    
    .header {
      background: linear-gradient(90deg, #00d4ff 0%, #0088cc 100%);
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
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
      color: #0a0a0f;
    }
    
    .tab-btn:hover {
      background: #00d4ff;
      color: #0a0a0f;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .endpoint-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .endpoint-card {
      background: rgba(0, 212, 255, 0.05);
      border: 1px solid #00d4ff;
      padding: 15px;
      border-radius: 6px;
      transition: all 0.3s;
    }
    
    .endpoint-card:hover {
      background: rgba(0, 212, 255, 0.15);
      box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
    }
    
    .endpoint-header {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .method {
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .method-post { background: #ff6b9d; color: white; }
    .method-get { background: #00d4ff; color: #0a0a0f; }
    .method-patch { background: #ffa500; color: white; }
    .method-delete { background: #ff4444; color: white; }
    
    .endpoint-name {
      color: #00d4ff;
      font-weight: 600;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .endpoint-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      font-size: 11px;
    }
    
    .detail {
      background: rgba(0, 212, 255, 0.1);
      padding: 8px;
      border-radius: 3px;
    }
    
    .detail .label {
      color: #666;
      display: block;
      margin-bottom: 3px;
    }
    
    .detail .value {
      color: #00d4ff;
      font-weight: 600;
    }
    
    .value.risk-0 { color: #00cc33; }
    .value.risk-1 { color: #ffaa00; }
    .value.risk-2 { color: #ff4444; }
    
    .attack-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .attack-card {
      background: rgba(0, 212, 255, 0.05);
      border-left: 4px solid #00d4ff;
      padding: 15px;
      border-radius: 6px;
      transition: all 0.3s;
    }
    
    .attack-card.severity-critical { border-left-color: #ff4444; background: rgba(255, 68, 68, 0.05); }
    .attack-card.severity-high { border-left-color: #ffaa00; background: rgba(255, 170, 0, 0.05); }
    
    .attack-card h3 {
      color: #00d4ff;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .attack-card p {
      color: #999;
      font-size: 12px;
      margin-bottom: 10px;
    }
    
    .tags {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }
    
    .tag {
      padding: 4px 8px;
      background: rgba(0, 212, 255, 0.2);
      color: #00d4ff;
      border-radius: 3px;
      font-size: 10px;
    }
    
    .tag.difficulty-easy { background: rgba(0, 204, 51, 0.2); color: #00cc33; }
    .tag.difficulty-medium { background: rgba(255, 170, 0, 0.2); color: #ffaa00; }
    .tag.difficulty-hard { background: rgba(255, 68, 68, 0.2); color: #ff4444; }
    
    .tag.severity-critical { background: rgba(255, 68, 68, 0.2); color: #ff4444; }
    .tag.severity-high { background: rgba(255, 170, 0, 0.2); color: #ffaa00; }
    
    .card-details {
      font-size: 11px;
      color: #999;
      line-height: 1.6;
    }
    
    .card-details div {
      margin: 5px 0;
    }
    
    .scenario-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .scenario-card {
      background: rgba(0, 212, 255, 0.05);
      border: 1px solid #00d4ff;
      padding: 20px;
      border-radius: 6px;
    }
    
    .scenario-card h3 {
      color: #00d4ff;
      margin-bottom: 8px;
    }
    
    .scenario-card p {
      color: #999;
      font-size: 12px;
      margin-bottom: 15px;
    }
    
    .scenario-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 15px 0;
    }
    
    .stat {
      background: rgba(0, 212, 255, 0.1);
      padding: 10px;
      border-radius: 4px;
      text-align: center;
      font-size: 11px;
    }
    
    .stat-label {
      display: block;
      color: #666;
      margin-bottom: 5px;
    }
    
    .stat-value {
      display: block;
      color: #00d4ff;
      font-weight: 700;
      font-size: 14px;
    }
    
    .stat-value.critical { color: #ff4444; }
    
    .findings-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .finding-row {
      background: rgba(0, 212, 255, 0.05);
      border-left: 4px solid #00d4ff;
      padding: 15px;
      border-radius: 4px;
      transition: all 0.3s;
    }
    
    .finding-row.severity-critical { border-left-color: #ff4444; background: rgba(255, 68, 68, 0.05); }
    .finding-row.severity-high { border-left-color: #ffaa00; background: rgba(255, 170, 0, 0.05); }
    
    .finding-row.status-resolved { opacity: 0.6; }
    
    .finding-header {
      display: flex;
      gap: 15px;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .finding-severity {
      padding: 4px 8px;
      background: #ff4444;
      color: white;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      min-width: 60px;
      text-align: center;
    }
    
    .finding-title {
      flex: 1;
      color: #00d4ff;
      font-weight: 600;
    }
    
    .finding-status {
      padding: 4px 8px;
      background: rgba(0, 212, 255, 0.2);
      color: #00d4ff;
      border-radius: 3px;
      font-size: 10px;
    }
    
    .finding-endpoint {
      color: #666;
      font-size: 11px;
      margin-bottom: 5px;
    }
    
    .finding-details {
      color: #999;
      font-size: 12px;
      margin-bottom: 5px;
    }
    
    .finding-age {
      color: #555;
      font-size: 10px;
    }
    
    @media (max-width: 768px) {
      .scenario-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚡ AI Gateway Arena</h1>
    <p>AI-Powered API Security Testing & Threat Simulation Platform</p>
  </div>
  
  <div class="container">
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('endpoints')">API Endpoints (${API_ENDPOINTS.length})</button>
      <button class="tab-btn" onclick="switchTab('attacks')">Attack Patterns (${ATTACK_PATTERNS.length})</button>
      <button class="tab-btn" onclick="switchTab('scenarios')">Test Scenarios</button>
      <button class="tab-btn" onclick="switchTab('findings')">Security Findings (${FINDINGS.length})</button>
    </div>
    
    <div id="endpoints" class="tab-content active">
      <h2 style="margin-bottom: 20px; color: #00d4ff;">API Endpoint Security Baseline</h2>
      <div class="endpoint-grid">
        ${endpointsHtml}
      </div>
    </div>
    
    <div id="attacks" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #00d4ff;">AI-Generated Attack Patterns</h2>
      <div class="attack-grid">
        ${attacksHtml}
      </div>
    </div>
    
    <div id="scenarios" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #00d4ff;">Automated Test Scenarios</h2>
      <div class="scenario-grid">
        ${scenariosHtml}
      </div>
    </div>
    
    <div id="findings" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #00d4ff;">Security Findings & Vulnerabilities</h2>
      <div class="findings-list">
        ${findingsHtml}
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
    
    function runTest(idx) {
      alert('Running Test Scenario ' + (idx + 1) + '...\\n\\nThis would execute comprehensive API security testing against your endpoints and generate findings.');
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
