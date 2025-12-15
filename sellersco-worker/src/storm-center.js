// Storm Center - Real-Time Threat Intelligence & Feeds
// Aggregated threat intelligence, attack patterns, and IOC tracking

const THREAT_FEEDS = [
  {
    id: "feed-01",
    name: "CISA Alerts & Advisories",
    status: "ACTIVE",
    lastUpdate: "5 min ago",
    alerts: 23,
    criticalCount: 4,
    highCount: 8,
    source: "https://www.cisa.gov"
  },
  {
    id: "feed-02",
    name: "Shodan Vulnerability Index",
    status: "ACTIVE",
    lastUpdate: "12 min ago",
    alerts: 1247,
    criticalCount: 156,
    highCount: 423,
    source: "https://www.shodan.io"
  },
  {
    id: "feed-03",
    name: "Ransomware Tracking Database",
    status: "ACTIVE",
    lastUpdate: "2 min ago",
    alerts: 847,
    criticalCount: 847,
    highCount: 0,
    source: "https://ransomware-tracking.com"
  },
  {
    id: "feed-04",
    name: "Zero-Day Exploit Detection",
    status: "ACTIVE",
    lastUpdate: "18 min ago",
    alerts: 34,
    criticalCount: 12,
    highCount: 22,
    source: "Internal Honeypots"
  },
  {
    id: "feed-05",
    name: "Dark Web IOC Feed",
    status: "ACTIVE",
    lastUpdate: "23 min ago",
    alerts: 156,
    criticalCount: 23,
    highCount: 67,
    source: "Dark Web Monitoring"
  },
  {
    id: "feed-06",
    name: "DDoS Attack Trends",
    status: "ACTIVE",
    lastUpdate: "7 min ago",
    alerts: 456,
    criticalCount: 0,
    highCount: 156,
    source: "NetFlow Analysis"
  }
];

const ACTIVE_THREATS = [
  {
    threatId: "THR-2025-0847",
    name: "BlackCat Ransomware Campaign",
    description: "Organized attack targeting healthcare and manufacturing sectors",
    severity: "CRITICAL",
    firstSeen: "Dec 14, 2025",
    lastSeen: "2 hours ago",
    victimCount: 23,
    countries: ["US", "UK", "Germany", "Canada"],
    indicators: ["IP: 192.168.x.x", "Domain: evil-domain.ru", "Hash: 4a7f3c2e..."],
    mitigation: "Block C2 servers, detect ransom note files, segment networks"
  },
  {
    threatId: "THR-2025-0831",
    name: "ALPHV LockBit Double-Extortion",
    description: "Demanding payments with threats of data release",
    severity: "CRITICAL",
    firstSeen: "Dec 10, 2025",
    lastSeen: "4 hours ago",
    victimCount: 45,
    countries: ["US", "UK", "France", "Australia", "Japan"],
    indicators: ["Domain: lockbit-portal.onion", "Ransom note", "Email: contact@lockbit"],
    mitigation: "Backup verification, threat intelligence integration, law enforcement contact"
  },
  {
    threatId: "THR-2025-0802",
    name: "FIN7 Supply Chain Attack",
    description: "Compromised vendor software distribution for lateral movement",
    severity: "CRITICAL",
    firstSeen: "Dec 8, 2025",
    lastSeen: "6 hours ago",
    victimCount: 127,
    countries: ["US", "UK", "Canada", "Germany", "Netherlands"],
    indicators: ["Compromised installer", "Malicious DLL: xsvk.dll", "C2: command.example.com"],
    mitigation: "Software signing verification, supply chain risk assessment, EDR monitoring"
  },
  {
    threatId: "THR-2025-0756",
    name: "Scattered Spider APT Campaign",
    description: "Sophisticated credential theft and lateral movement operations",
    severity: "HIGH",
    firstSeen: "Dec 1, 2025",
    lastSeen: "12 hours ago",
    victimCount: 89,
    countries: ["US", "UK", "Canada"],
    indicators: ["Phishing emails (10+ variations)", "Mimikatz variants", "RDP exploitation"],
    mitigation: "MFA enforcement, privilege escalation detection, EDR tuning"
  },
  {
    threatId: "THR-2025-0701",
    name: "Log4j Exploitation Surge",
    description: "Mass exploitation of Log4j 2.0-2.14 in public-facing applications",
    severity: "CRITICAL",
    firstSeen: "Nov 25, 2025",
    lastSeen: "1 hour ago",
    victimCount: 3847,
    countries: ["Worldwide"],
    indicators: ["jndi:ldap://", "Log4j WAF bypass payloads", "RCE proof-of-concept"],
    mitigation: "Update Log4j immediately, WAF rules, disable JNDI lookups"
  }
];

const ATTACK_TIMELINE = [
  {time: "14:32 UTC", event: "LockBit ransom demand posted on dark web"},
  {time: "13:47 UTC", event: "3,400+ credential stuffing attempts detected"},
  {time: "12:15 UTC", event: "New ransomware variant analysis published"},
  {time: "11:28 UTC", event: "Critical 0-day in Apache Struts 2 disclosed"},
  {time: "10:42 UTC", event: "Botnet command & control sinkholed"},
  {time: "09:56 UTC", event: "Malware samples detected in file sharing platforms"},
  {time: "08:31 UTC", event: "Phishing campaign targeting energy sector begins"},
  {time: "07:19 UTC", event: "Zero-day proof-of-concept released on GitHub"}
];

const THREAT_STATISTICS = {
  totalThreats: 5847,
  criticalThreats: 234,
  activeIncidents: 47,
  blockedAttempts: 128340,
  topThreat: "Ransomware",
  topSector: "Healthcare",
  topCountry: "United States",
  threatIncrease: "+23% vs last week",
  avgDwellTime: "4.2 days"
};

export async function handleStormCenter(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  // API endpoints
  if (pathname.startsWith('/storm-center/api/')) {
    const apiPath = pathname.slice('/storm-center/api/'.length);
    
    if (apiPath === 'feeds' && request.method === 'GET') {
      return jsonResponse(THREAT_FEEDS);
    }
    
    if (apiPath === 'threats' && request.method === 'GET') {
      return jsonResponse(ACTIVE_THREATS);
    }
    
    if (apiPath === 'timeline' && request.method === 'GET') {
      return jsonResponse(ATTACK_TIMELINE);
    }
    
    if (apiPath === 'statistics' && request.method === 'GET') {
      return jsonResponse(THREAT_STATISTICS);
    }
  }
  
  // Main UI
  return new Response(renderStormCenterUI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderStormCenterUI() {
  const feedsHtml = THREAT_FEEDS.map(feed => `
    <div class="feed-card">
      <div class="feed-header">
        <span class="feed-name">${feed.name}</span>
        <span class="feed-status">${feed.status}</span>
      </div>
      <div class="feed-metrics">
        <div class="metric">
          <span class="label">Alerts</span>
          <span class="value">${feed.alerts}</span>
        </div>
        <div class="metric">
          <span class="label">Critical</span>
          <span class="value critical">${feed.criticalCount}</span>
        </div>
        <div class="metric">
          <span class="label">High</span>
          <span class="value warning">${feed.highCount}</span>
        </div>
        <div class="metric">
          <span class="label">Updated</span>
          <span class="value">${feed.lastUpdate}</span>
        </div>
      </div>
      <div class="feed-source">${feed.source}</div>
    </div>
  `).join('');
  
  const threatsHtml = ACTIVE_THREATS.map(threat => `
    <div class="threat-card severity-${threat.severity.toLowerCase()}">
      <div class="threat-header">
        <span class="threat-id">${threat.threatId}</span>
        <span class="threat-severity">${threat.severity}</span>
      </div>
      <h3>${threat.name}</h3>
      <p>${threat.description}</p>
      <div class="threat-stats">
        <div class="stat">
          <span class="stat-label">First Seen</span>
          <span class="stat-value">${threat.firstSeen}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Victims</span>
          <span class="stat-value">${threat.victimCount}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Countries</span>
          <span class="stat-value">${threat.countries.length}</span>
        </div>
      </div>
      <div class="threat-details">
        <strong>Countries:</strong> ${threat.countries.join(', ')}<br>
        <strong>IOCs:</strong> ${threat.indicators.join(', ')}<br>
        <strong>Mitigation:</strong> ${threat.mitigation}
      </div>
    </div>
  `).join('');
  
  const timelineHtml = ATTACK_TIMELINE.map((item, idx) => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-marker"></div>
      <div class="timeline-event">${item.event}</div>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Storm Center - Threat Intelligence</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #1a0000 0%, #330000 100%);
      color: #e0e0e0;
      min-height: 100vh;
    }
    
    .header {
      background: linear-gradient(90deg, #cc0000 0%, #990000 100%);
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(204, 0, 0, 0.3);
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
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px 20px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .stat-box {
      background: rgba(204, 0, 0, 0.1);
      border: 2px solid #cc0000;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .stat-box h3 {
      color: #cc0000;
      font-size: 12px;
      margin-bottom: 10px;
    }
    
    .stat-box .value {
      color: #ff6666;
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
      background: rgba(204, 0, 0, 0.1);
      color: #cc0000;
      border: 2px solid #cc0000;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .tab-btn.active {
      background: #cc0000;
      color: white;
    }
    
    .tab-btn:hover {
      background: #cc0000;
      color: white;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .feed-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .feed-card {
      background: rgba(204, 0, 0, 0.05);
      border: 2px solid #cc0000;
      padding: 15px;
      border-radius: 8px;
      transition: all 0.3s;
    }
    
    .feed-card:hover {
      background: rgba(204, 0, 0, 0.15);
      transform: translateY(-3px);
    }
    
    .feed-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      gap: 10px;
    }
    
    .feed-name {
      color: #cc0000;
      font-weight: 600;
      flex: 1;
    }
    
    .feed-status {
      background: #00cc33;
      color: white;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
    }
    
    .feed-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin: 12px 0;
    }
    
    .metric {
      background: rgba(204, 0, 0, 0.1);
      padding: 8px;
      border-radius: 4px;
      text-align: center;
      font-size: 11px;
    }
    
    .metric .label {
      color: #999;
      display: block;
      margin-bottom: 3px;
    }
    
    .metric .value {
      color: #cc0000;
      font-weight: 700;
      font-size: 14px;
    }
    
    .metric .value.critical { color: #ff0000; }
    .metric .value.warning { color: #ffaa00; }
    
    .feed-source {
      color: #666;
      font-size: 10px;
      margin-top: 8px;
    }
    
    .threat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .threat-card {
      background: rgba(204, 0, 0, 0.05);
      border-left: 5px solid #cc0000;
      padding: 15px;
      border-radius: 6px;
      transition: all 0.3s;
    }
    
    .threat-card.severity-critical {
      border-left-color: #ff0000;
      background: rgba(255, 0, 0, 0.05);
    }
    
    .threat-card.severity-high {
      border-left-color: #ffaa00;
      background: rgba(255, 170, 0, 0.05);
    }
    
    .threat-card:hover {
      transform: translateY(-3px);
    }
    
    .threat-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .threat-id {
      color: #cc0000;
      font-weight: 600;
      font-size: 12px;
    }
    
    .threat-severity {
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .threat-card.severity-critical .threat-severity {
      background: #ff0000;
      color: white;
    }
    
    .threat-card.severity-high .threat-severity {
      background: #ffaa00;
      color: white;
    }
    
    .threat-card h3 {
      color: #cc0000;
      margin: 8px 0;
      font-size: 14px;
    }
    
    .threat-card p {
      color: #999;
      font-size: 12px;
      margin-bottom: 10px;
    }
    
    .threat-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 10px 0;
    }
    
    .stat {
      background: rgba(204, 0, 0, 0.1);
      padding: 8px;
      border-radius: 4px;
      font-size: 10px;
    }
    
    .stat-label {
      color: #666;
      display: block;
      margin-bottom: 3px;
    }
    
    .stat-value {
      color: #cc0000;
      font-weight: 600;
    }
    
    .threat-details {
      color: #999;
      font-size: 11px;
      line-height: 1.6;
      background: rgba(204, 0, 0, 0.05);
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
    }
    
    .threat-details strong {
      color: #cc0000;
    }
    
    .timeline {
      position: relative;
      padding: 20px 0 20px 30px;
      border-left: 3px solid #cc0000;
    }
    
    .timeline-item {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      position: relative;
    }
    
    .timeline-time {
      color: #cc0000;
      font-weight: 600;
      min-width: 80px;
      margin-top: 3px;
    }
    
    .timeline-marker {
      position: absolute;
      left: -38px;
      top: 5px;
      width: 12px;
      height: 12px;
      background: #cc0000;
      border-radius: 50%;
      border: 3px solid #1a0000;
    }
    
    .timeline-event {
      color: #e0e0e0;
      flex: 1;
      padding: 10px;
      background: rgba(204, 0, 0, 0.05);
      border-radius: 4px;
    }
    
    @media (max-width: 768px) {
      .threat-grid {
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
    <h1>⛈️ Storm Center - Threat Intelligence Hub</h1>
    <p>Real-time threat feeds, active campaigns, and attack intelligence</p>
  </div>
  
  <div class="container">
    <div class="stats-grid">
      <div class="stat-box">
        <h3>Total Threats</h3>
        <div class="value">${THREAT_STATISTICS.totalThreats}</div>
      </div>
      <div class="stat-box">
        <h3>Critical Threats</h3>
        <div class="value" style="color: #ff0000;">${THREAT_STATISTICS.criticalThreats}</div>
      </div>
      <div class="stat-box">
        <h3>Active Incidents</h3>
        <div class="value" style="color: #ffaa00;">${THREAT_STATISTICS.activeIncidents}</div>
      </div>
      <div class="stat-box">
        <h3>Blocked (24H)</h3>
        <div class="value">${THREAT_STATISTICS.blockedAttempts.toLocaleString()}</div>
      </div>
      <div class="stat-box">
        <h3>Top Threat</h3>
        <div class="value" style="font-size: 14px;">${THREAT_STATISTICS.topThreat}</div>
      </div>
      <div class="stat-box">
        <h3>Top Sector</h3>
        <div class="value" style="font-size: 14px;">${THREAT_STATISTICS.topSector}</div>
      </div>
    </div>
    
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('feeds')">Threat Feeds (${THREAT_FEEDS.length})</button>
      <button class="tab-btn" onclick="switchTab('threats')">Active Threats (${ACTIVE_THREATS.length})</button>
      <button class="tab-btn" onclick="switchTab('timeline')">Attack Timeline</button>
    </div>
    
    <div id="feeds" class="tab-content active">
      <h2 style="margin-bottom: 20px; color: #cc0000;">Integrated Threat Feeds</h2>
      <div class="feed-grid">
        ${feedsHtml}
      </div>
    </div>
    
    <div id="threats" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #cc0000;">Active Threat Campaigns</h2>
      <div class="threat-grid">
        ${threatsHtml}
      </div>
    </div>
    
    <div id="timeline" class="tab-content">
      <h2 style="margin-bottom: 20px; color: #cc0000;">24-Hour Attack Timeline</h2>
      <div class="timeline">
        ${timelineHtml}
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
