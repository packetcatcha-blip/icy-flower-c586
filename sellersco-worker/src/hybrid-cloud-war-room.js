// Hybrid Cloud War Room - Multi-Cloud Threat Detection & Incident Response
// Real-time visibility across AWS, Azure, GCP with incident management

const CLOUD_ENVIRONMENTS = [
  {
    id: "prod-aws",
    provider: "AWS",
    region: "us-east-1",
    status: "HEALTHY",
    instances: 247,
    alerts: 12,
    lastScan: "2 minutes ago",
    services: ["EC2", "S3", "RDS", "Lambda", "VPC"],
    riskScore: 42,
    complianceScore: 87,
    threats: [
      {severity: "CRITICAL", count: 2, example: "Exposed S3 bucket with PII"},
      {severity: "HIGH", count: 5, example: "Unpatched EC2 instances"},
      {severity: "MEDIUM", count: 9, example: "Overly permissive IAM policies"}
    ]
  },
  {
    id: "prod-azure",
    provider: "Azure",
    region: "eastus",
    status: "HEALTHY",
    instances: 156,
    alerts: 8,
    lastScan: "5 minutes ago",
    services: ["VMs", "App Service", "SQL Database", "Key Vault", "Virtual Network"],
    riskScore: 38,
    complianceScore: 91,
    threats: [
      {severity: "CRITICAL", count: 1, example: "Unencrypted database"},
      {severity: "HIGH", count: 4, example: "MFA not enforced"},
      {severity: "MEDIUM", count: 7, example: "Resource group permissions too broad"}
    ]
  },
  {
    id: "prod-gcp",
    provider: "GCP",
    region: "us-central1",
    status: "DEGRADED",
    instances: 89,
    alerts: 23,
    lastScan: "45 seconds ago",
    services: ["Compute Engine", "Cloud Storage", "Cloud SQL", "Cloud Run", "VPC"],
    riskScore: 67,
    complianceScore: 72,
    threats: [
      {severity: "CRITICAL", count: 4, example: "Public Cloud Storage bucket"},
      {severity: "HIGH", count: 8, example: "Service account with excessive scopes"},
      {severity: "MEDIUM", count: 12, example: "Firewall rules too permissive"}
    ]
  }
];

const INCIDENTS = [
  {
    id: "INC-2025-001",
    title: "Lateral Movement Detected in AWS",
    description: "Suspicious lateral movement detected between EC2 instances in private subnet",
    severity: "CRITICAL",
    status: "ACTIVE",
    created: "15 min ago",
    lastUpdated: "2 min ago",
    cloudProvider: "AWS",
    affectedResources: ["i-0a1b2c3d4e5f6g7h8", "i-0z9y8x7w6v5u4t3s"],
    timeline: [
      {time: "15:32", action: "Anomalous network traffic detected", by: "IDS"},
      {time: "15:34", action: "User attempted privilege escalation", by: "EDR"},
      {time: "15:36", action: "Incident escalated to CRITICAL", by: "SOAR"},
      {time: "15:38", action: "Isolated affected instances", by: "Automation"}
    ],
    responseSteps: [
      "✓ Isolated affected instances from network",
      "✓ Captured memory dump for forensics",
      "⧖ Analyzing lateral movement vector",
      "○ Prepare incident report"
    ],
    teamAssigned: ["alice@company.com", "bob@company.com", "carlos@company.com"]
  },
  {
    id: "INC-2025-002",
    title: "Data Exfiltration via Azure App Service",
    description: "Large data transfer detected from Azure SQL Database to external IP",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    created: "48 min ago",
    lastUpdated: "12 min ago",
    cloudProvider: "Azure",
    affectedResources: ["sqldb-prod-01", "appservice-api-01"],
    timeline: [
      {time: "14:44", action: "Unusual egress traffic detected", by: "SIEM"},
      {time: "14:47", action: "Alert escalated to security team", by: "SOC"},
      {time: "14:52", action: "Database queries logged 500GB transfer", by: "DBA"},
      {time: "15:00", action: "Connection blocked, incident opened", by: "Automation"}
    ],
    responseSteps: [
      "✓ Blocked database connections to external IPs",
      "✓ Identified compromised service principal",
      "⧖ Analyzing exfiltrated data scope",
      "○ Notify data protection officer"
    ],
    teamAssigned: ["alice@company.com", "denise@company.com"]
  },
  {
    id: "INC-2025-003",
    title: "Cryptocurrency Mining on GCP Compute Engine",
    description: "Unauthorized cryptomining process detected on 47 GCP instances",
    severity: "HIGH",
    status: "RESOLVED",
    created: "3 hours ago",
    lastUpdated: "1 hour ago",
    cloudProvider: "GCP",
    affectedResources: ["instance-1 through instance-47"],
    timeline: [
      {time: "12:15", action: "Abnormal CPU usage detected", by: "Monitoring"},
      {time: "12:22", action: "Mining process identified in logs", by: "Threat Detection"},
      {time: "12:45", action: "Malicious image terminated", by: "Automation"},
      {time: "13:30", action: "Clean images deployed", by: "DevOps"}
    ],
    responseSteps: [
      "✓ Terminated all infected instances",
      "✓ Deployed clean images to all hosts",
      "✓ Blocked malicious repository access",
      "✓ Incident closed and lessons learned documented"
    ],
    teamAssigned: ["edgar@company.com", "frank@company.com"]
  }
];

const RUNBOOKS = [
  {
    name: "Data Exfiltration Response",
    steps: [
      "1. IMMEDIATE: Isolate affected resource from network",
      "2. IMMEDIATE: Kill all active connections",
      "3. Capture logs and network traffic for forensics",
      "4. Identify affected data classification level",
      "5. Notify Data Protection Officer (DPO)",
      "6. Preserve evidence for legal/regulatory",
      "7. Begin forensic investigation",
      "8. Prepare incident report"
    ]
  },
  {
    name: "Lateral Movement Containment",
    steps: [
      "1. IMMEDIATE: Segment network to prevent spread",
      "2. Identify all systems in compromise chain",
      "3. Collect forensic evidence from all systems",
      "4. Reset credentials for compromised accounts",
      "5. Patch exploited vulnerabilities",
      "6. Monitor for C2 communication",
      "7. Analyze attack vector and entry point",
      "8. Close report with mitigation"
    ]
  },
  {
    name: "Cryptomining/Malware Containment",
    steps: [
      "1. IMMEDIATE: Isolate affected instances",
      "2. Dump process memory for malware analysis",
      "3. Identify malicious images/containers",
      "4. Block malicious repositories/sources",
      "5. Deploy clean images to all hosts",
      "6. Verify no persistence mechanisms remain",
      "7. Update threat detection rules",
      "8. Close incident and communicate impact"
    ]
  }
];

export async function handleHybridCloudWarRoom(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  // API endpoints
  if (pathname.startsWith('/hybrid-cloud-war-room/api/')) {
    const apiPath = pathname.slice('/hybrid-cloud-war-room/api/'.length);
    
    if (apiPath === 'environments' && request.method === 'GET') {
      return jsonResponse(CLOUD_ENVIRONMENTS.map(env => ({
        id: env.id,
        provider: env.provider,
        region: env.region,
        status: env.status,
        instances: env.instances,
        alerts: env.alerts,
        riskScore: env.riskScore,
        complianceScore: env.complianceScore
      })));
    }
    
    if (apiPath.startsWith('environment/')) {
      const envId = apiPath.slice('environment/'.length);
      const env = CLOUD_ENVIRONMENTS.find(e => e.id === envId);
      if (env) return jsonResponse(env);
      return jsonResponse({error: 'Environment not found'}, 404);
    }
    
    if (apiPath === 'incidents' && request.method === 'GET') {
      return jsonResponse(INCIDENTS);
    }
    
    if (apiPath.startsWith('incident/')) {
      const incId = apiPath.slice('incident/'.length);
      const inc = INCIDENTS.find(i => i.id === incId);
      if (inc) return jsonResponse(inc);
      return jsonResponse({error: 'Incident not found'}, 404);
    }
    
    if (apiPath === 'runbooks' && request.method === 'GET') {
      return jsonResponse(RUNBOOKS);
    }
  }
  
  // Main UI
  return new Response(renderWarRoomUI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderWarRoomUI() {
  const cloudCardsHtml = CLOUD_ENVIRONMENTS.map(env => `
    <div class="cloud-card" onclick="loadEnvironment('${env.id}')">
      <div class="cloud-header">
        <span class="cloud-badge">${env.provider}</span>
        <span class="status-badge status-${env.status.toLowerCase()}">${env.status}</span>
      </div>
      <h3>${env.region}</h3>
      <div class="metrics">
        <div class="metric">
          <span class="label">Instances</span>
          <span class="value">${env.instances}</span>
        </div>
        <div class="metric">
          <span class="label">Alerts</span>
          <span class="value warning">${env.alerts}</span>
        </div>
        <div class="metric">
          <span class="label">Risk Score</span>
          <span class="value danger">${env.riskScore}%</span>
        </div>
      </div>
    </div>
  `).join('');
  
  const incidentsHtml = INCIDENTS.map(inc => `
    <div class="incident-row severity-${inc.severity.toLowerCase()}" onclick="loadIncident('${inc.id}')">
      <div class="incident-id">${inc.id}</div>
      <div class="incident-title">${inc.title}</div>
      <div class="incident-status">${inc.status}</div>
      <div class="incident-age">${inc.lastUpdated}</div>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hybrid Cloud War Room</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
      color: #e0e0e0;
      min-height: 100vh;
    }
    
    .header {
      background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
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
      background: rgba(255, 107, 53, 0.1);
      color: #ff6b35;
      border: 2px solid #ff6b35;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .tab-btn.active {
      background: #ff6b35;
      color: white;
    }
    
    .tab-btn:hover {
      background: #ff6b35;
      color: white;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .cloud-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .cloud-card {
      background: rgba(255, 107, 53, 0.05);
      border: 2px solid #ff6b35;
      padding: 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .cloud-card:hover {
      background: rgba(255, 107, 53, 0.15);
      transform: translateY(-5px);
    }
    
    .cloud-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    
    .cloud-badge {
      background: #ff6b35;
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 12px;
    }
    
    .status-badge {
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 12px;
    }
    
    .status-healthy { background: #00cc33; color: white; }
    .status-degraded { background: #ffaa00; color: white; }
    .status-down { background: #ff0000; color: white; }
    
    .cloud-card h3 {
      color: #ff6b35;
      margin-bottom: 15px;
    }
    
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    
    .metric {
      background: rgba(255, 107, 53, 0.1);
      padding: 10px;
      border-radius: 4px;
      text-align: center;
    }
    
    .metric .label {
      display: block;
      font-size: 11px;
      color: #999;
      margin-bottom: 5px;
    }
    
    .metric .value {
      display: block;
      font-size: 18px;
      font-weight: 700;
      color: #ff6b35;
    }
    
    .metric .value.warning { color: #ffaa00; }
    .metric .value.danger { color: #ff0000; }
    
    .incidents-list {
      background: rgba(0, 0, 0, 0.3);
      border: 2px solid #ff6b35;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .incident-row {
      display: grid;
      grid-template-columns: 120px 1fr 100px 150px;
      padding: 15px 20px;
      border-bottom: 1px solid rgba(255, 107, 53, 0.2);
      cursor: pointer;
      transition: all 0.3s;
      align-items: center;
      gap: 20px;
    }
    
    .incident-row:hover {
      background: rgba(255, 107, 53, 0.1);
    }
    
    .incident-row.severity-critical {
      border-left: 5px solid #ff0000;
    }
    
    .incident-row.severity-high {
      border-left: 5px solid #ffaa00;
    }
    
    .incident-id {
      color: #ff6b35;
      font-weight: 600;
    }
    
    .incident-title {
      color: #e0e0e0;
    }
    
    .incident-status {
      padding: 4px 8px;
      background: rgba(255, 107, 53, 0.2);
      border-radius: 4px;
      font-size: 12px;
      color: #ff6b35;
      text-align: center;
    }
    
    .incident-age {
      color: #999;
      font-size: 12px;
    }
    
    .detail-view {
      display: none;
      background: rgba(0, 0, 0, 0.5);
      border: 2px solid #ff6b35;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .detail-view.active {
      display: block;
    }
    
    .close-btn {
      background: #ff0000;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      float: right;
    }
    
    .close-btn:hover {
      background: #cc0000;
    }
    
    .timeline {
      background: rgba(255, 107, 53, 0.05);
      border-left: 3px solid #ff6b35;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .timeline-event {
      display: flex;
      gap: 15px;
      margin: 15px 0;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(255, 107, 53, 0.2);
    }
    
    .timeline-event:last-child {
      border-bottom: none;
    }
    
    .time {
      color: #ff6b35;
      font-weight: 600;
      min-width: 50px;
    }
    
    .event-text {
      color: #e0e0e0;
    }
    
    .response-steps {
      background: rgba(0, 255, 0, 0.05);
      border-left: 3px solid #00cc33;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .step {
      color: #00cc33;
      padding: 8px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .step .check {
      color: #00cc33;
      font-weight: 700;
    }
    
    @media (max-width: 768px) {
      .incident-row {
        grid-template-columns: 1fr;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 Hybrid Cloud War Room</h1>
    <p>Real-time multi-cloud threat detection, incident management & response automation</p>
  </div>
  
  <div class="container">
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('cloud-overview')">Cloud Overview</button>
      <button class="tab-btn" onclick="switchTab('incidents')">Active Incidents (${INCIDENTS.length})</button>
      <button class="tab-btn" onclick="switchTab('runbooks')">Response Runbooks</button>
      <button class="tab-btn" onclick="switchTab('timeline')">Security Timeline</button>
    </div>
    
    <div id="cloud-overview" class="tab-content active">
      <h2 style="margin-bottom: 20px; color: #ff6b35;">Multi-Cloud Environments</h2>
      <div class="cloud-grid">
        ${cloudCardsHtml}
      </div>
    </div>
    
    <div id="incidents" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #ff6b35;">Incident Timeline</h2>
      <div class="incidents-list">
        ${incidentsHtml}
      </div>
    </div>
    
    <div id="runbooks" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #ff6b35;">Incident Response Runbooks</h2>
      <div style="display: grid; gap: 20px;">
        ${RUNBOOKS.map((rb, idx) => `
          <div style="background: rgba(255, 107, 53, 0.05); border: 1px solid #ff6b35; padding: 20px; border-radius: 8px;">
            <h3 style="color: #ff6b35; margin-bottom: 15px;">📋 ${rb.name}</h3>
            <ol style="color: #e0e0e0; line-height: 2; margin-left: 20px;">
              ${rb.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div id="timeline" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #ff6b35;">Security Events (Last 24H)</h2>
      <div class="timeline">
        <div class="timeline-event">
          <div class="time">15:38</div>
          <div class="event-text">INC-2025-001: Lateral movement contained, instances isolated</div>
        </div>
        <div class="timeline-event">
          <div class="time">15:15</div>
          <div class="event-text">Data exfiltration alert triggered in Azure environment</div>
        </div>
        <div class="timeline-event">
          <div class="time">14:52</div>
          <div class="event-text">Cryptomining malware detected on 47 GCP instances</div>
        </div>
        <div class="timeline-event">
          <div class="time">14:30</div>
          <div class="event-text">Automated threat scanning completed across all clouds</div>
        </div>
        <div class="timeline-event">
          <div class="time">13:45</div>
          <div class="event-text">Vulnerability patch applied to 156 Azure VMs</div>
        </div>
      </div>
    </div>
    
    <div class="detail-view" id="detailView">
      <!-- Incident details loaded here -->
    </div>
  </div>
  
  <script>
    const environments = ${JSON.stringify(CLOUD_ENVIRONMENTS)};
    const incidents = ${JSON.stringify(INCIDENTS)};
    
    function switchTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      event.target.classList.add('active');
    }
    
    function loadEnvironment(envId) {
      const env = environments.find(e => e.id === envId);
      if (!env) return;
      
      let threatsList = '';
      for (let t of env.threats) {
        threatsList += '<div style="margin: 10px 0; padding: 10px; background: rgba(255, 107, 53, 0.1); border-radius: 4px;"><strong style="color: #ff6b35;">' + t.severity + '</strong> (' + t.count + '): ' + t.example + '</div>';
      }
      
      const detail = document.getElementById('detailView');
      detail.innerHTML = '<button class="close-btn" onclick="detail.classList.remove(\'active\')">✕ Close</button><h2>' + env.provider + ' - ' + env.region + '</h2><p style="margin: 15px 0; color: #ff6b35;">Status: <strong>' + env.status + '</strong></p><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 20px 0;"><div style="background: rgba(255, 107, 53, 0.1); padding: 15px; border-radius: 8px; text-align: center;"><div style="color: #999; font-size: 12px; margin-bottom: 10px;">Instances</div><div style="color: #ff6b35; font-size: 24px; font-weight: 700;">' + env.instances + '</div></div><div style="background: rgba(255, 107, 53, 0.1); padding: 15px; border-radius: 8px; text-align: center;"><div style="color: #999; font-size: 12px; margin-bottom: 10px;">Active Alerts</div><div style="color: #ff0000; font-size: 24px; font-weight: 700;">' + env.alerts + '</div></div><div style="background: rgba(255, 107, 53, 0.1); padding: 15px; border-radius: 8px; text-align: center;"><div style="color: #999; font-size: 12px; margin-bottom: 10px;">Risk Score</div><div style="color: #ff6b35; font-size: 24px; font-weight: 700;">' + env.riskScore + '%</div></div><div style="background: rgba(255, 107, 53, 0.1); padding: 15px; border-radius: 8px; text-align: center;"><div style="color: #999; font-size: 12px; margin-bottom: 10px;">Compliance</div><div style="color: #00cc33; font-size: 24px; font-weight: 700;">' + env.complianceScore + '%</div></div></div><div style="margin: 20px 0;"><h3 style="color: #ff6b35; margin-bottom: 15px;">Services</h3><div id="servicesList"></div></div><h3 style="color: #ff6b35; margin: 20px 0 15px 0;">Detected Threats</h3>' + threatsList;
      detail.classList.add('active');
      
      // Populate services list
      const servicesList = document.getElementById('servicesList');
      if (servicesList) {
        servicesList.innerHTML = env.services.map(s => {
          return '<span style="display: inline-block; background: #ff6b35; color: white; padding: 6px 12px; margin: 5px; border-radius: 4px; font-size: 12px;">' + s + '</span>';
        }).join('');
      }
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
    
    function loadIncident(incId) {
      const inc = incidents.find(i => i.id === incId);
      if (!inc) return;
      
      let timeline = '';
      for (let e of inc.timeline) {
        timeline += '<div class="timeline-event"><div class="time">' + e.time + '</div><div><div class="event-text">' + e.action + '</div><div style="color: #999; font-size: 11px;">by ' + e.by + '</div></div></div>';
      }
      
      let steps = '';
      for (let s of inc.responseSteps) {
        steps += '<div class="step"><span class="check">' + s.charAt(0) + '</span><span>' + s.slice(2) + '</span></div>';
      }
      
      let teamList = '';
      for (let email of inc.teamAssigned) {
        teamList += '<span style="background: #ff6b35; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px;">' + email + '</span>';
      }
      
      const detail = document.getElementById('detailView');
      detail.innerHTML = '<button class="close-btn" onclick="detail.classList.remove(\'active\')">✕ Close</button><h2>' + inc.id + ': ' + inc.title + '</h2><div style="display: flex; gap: 20px; margin: 15px 0;"><div><strong>Severity:</strong> <span style="color: #ff0000;">' + inc.severity + '</span></div><div><strong>Status:</strong> <span style="color: #ff6b35;">' + inc.status + '</span></div><div><strong>Cloud:</strong> ' + inc.cloudProvider + '</div></div><p style="margin: 15px 0; color: #e0e0e0;">' + inc.description + '</p><h3 style="color: #ff6b35; margin: 20px 0 15px 0;">📅 Incident Timeline</h3><div class="timeline">' + timeline + '</div><h3 style="color: #ff6b35; margin: 20px 0 15px 0;">✓ Response Actions</h3><div class="response-steps">' + steps + '</div><h3 style="color: #ff6b35; margin: 20px 0 15px 0;">👥 Assigned Team</h3><div style="display: flex; gap: 10px; flex-wrap: wrap;">' + teamList + '</div>';
      detail.classList.add('active');
      window.scrollTo({top: 0, behavior: 'smooth'});
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
