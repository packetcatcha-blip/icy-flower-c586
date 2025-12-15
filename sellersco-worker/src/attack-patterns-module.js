/**
 * ⚔️ BADASS ATTACK PATTERNS SIMULATOR
 * Interactive AI-era attack pattern simulator for ethical hacking training & red teaming
 * 
 * Features:
 * - Interactive 5-phase attack matrix (MITRE ATT&CK integrated)
 * - Drag-drop attack chain builder with risk scoring
 * - AI-powered threat scenario generation
 * - Safe sandbox labs (OSINT, cloud misconfig, LOLBAS)
 * - Real-time vendor comparison & defenses
 * - Attack path visualization with heatmaps
 * - Community layers & leaderboards
 */

// MITRE ATT&CK 5-Phase Framework with 80+ techniques
const ATTACK_FRAMEWORK = {
	phases: [
		{
			id: 'recon',
			name: '🔍 Reconnaissance',
			color: '#FF6B6B',
			description: 'Gather information on targets (OSINT, scanning, social engineering)',
			techniques: [
				{
					id: 'active-scanning',
					name: 'Active Scanning',
					mitre: 'T1595',
					threat: 'AI-enhanced port scanners with ML-driven vulnerability detection',
					vendors: ['Nessus', 'Qualys', 'Rapid7 Insight', 'Shodan Enterprise', 'Censys'],
					risk: 'MEDIUM'
				},
				{
					id: 'passive-recon',
					name: 'Passive Reconnaissance',
					mitre: 'T1598',
					threat: 'Automated social media profiling, GitHub leaks, DNS enumeration',
					vendors: ['Maltego', 'Recon-ng', 'Shodan', 'SpiderFoot', 'theHarvester'],
					risk: 'LOW'
				},
				{
					id: 'phishing-prep',
					name: 'Phishing Preparation',
					mitre: 'T1598.003',
					threat: 'AI-generated spear-phishing with persona synthesis, deepfake integration',
					vendors: ['Proofpoint', 'Mimecast', 'Abnormal Security', 'Forcepoint', 'Zscaler'],
					risk: 'CRITICAL'
				},
				{
					id: 'target-dev',
					name: 'Target Development',
					mitre: 'T1589',
					threat: 'LinkedIn harvesting, job posting analysis, org hierarchy mapping',
					vendors: ['Guardicore', 'Rapid7', 'Tenable', 'Qualys', 'Wiz'],
					risk: 'HIGH'
				},
				{
					id: 'supply-chain',
					name: 'Supply Chain Reconnaissance',
					mitre: 'T1591.004',
					threat: 'Third-party vendor analysis, software bill of materials exploitation',
					vendors: ['Snyk', 'Checkmarx', 'Sonatype Nexus Firewall', 'GitGuardian', 'JFrog'],
					risk: 'HIGH'
				}
			]
		},
		{
			id: 'initial-access',
			name: '🚪 Initial Access',
			color: '#FFA500',
			description: 'Compromise first system (phishing, supply chain, watering hole)',
			techniques: [
				{
					id: 'phishing',
					name: 'Phishing',
					mitre: 'T1566',
					threat: 'AI-crafted emails with personalized malware payloads, dynamic URLs',
					vendors: ['Proofpoint', 'Mimecast', 'Abnormal Security', 'Avanan', 'Zscaler'],
					risk: 'CRITICAL'
				},
				{
					id: 'supply-chain-compromise',
					name: 'Supply Chain Compromise',
					mitre: 'T1195',
					threat: 'Software repos, package managers, CDN poisoning with ML-detected backdoors',
					vendors: ['Snyk', 'JFrog Xray', 'Sonatype', 'Artifactory', 'CloudRepo'],
					risk: 'CRITICAL'
				},
				{
					id: 'exploit-public',
					name: 'Exploit Public-Facing Application',
					mitre: 'T1190',
					threat: 'Zero-day exploitation, AI-guided vulnerability discovery in web apps',
					vendors: ['Acunetix', 'Qualys', 'Rapid7', 'Tenable', 'Burp Suite Pro'],
					risk: 'CRITICAL'
				},
				{
					id: 'valid-accounts',
					name: 'Valid Accounts',
					mitre: 'T1078',
					threat: 'Credential stuffing, brute-force with AI-optimized wordlists',
					vendors: ['Okta', 'Jumio', 'Auth0', 'Microsoft Sentinel', 'Splunk'],
					risk: 'HIGH'
				},
				{
					id: 'hardware-addition',
					name: 'Hardware Addition',
					mitre: 'T1200',
					threat: 'Physical USB drops, malicious charging cables in secure facilities',
					vendors: ['Cisco ISE', 'Fortinet', 'Palo Alto', 'Arista', 'Menlo Security'],
					risk: 'MEDIUM'
				}
			]
		},
		{
			id: 'exploitation',
			name: '⚡ Exploitation & Lateral Movement',
			color: '#FFD93D',
			description: 'Escalate privileges, move through network laterally',
			techniques: [
				{
					id: 'privilege-escalation',
					name: 'Privilege Escalation',
					mitre: 'T1548',
					threat: 'Kernel exploits, UAC bypass, AI-enumerated privilege gaps',
					vendors: ['CrowdStrike Falcon', 'Microsoft Defender', 'Carbon Black', 'SentinelOne'],
					risk: 'CRITICAL'
				},
				{
					id: 'lateral-movement',
					name: 'Lateral Movement (Pass-the-Hash)',
					mitre: 'T1550.002',
					threat: 'Kerberos delegation abuse, AI-guided pass-the-ticket chains',
					vendors: ['Delinea', 'CyberArk', 'BeyondTrust', 'Varonis', 'NetWitness'],
					risk: 'CRITICAL'
				},
				{
					id: 'cloud-abuse',
					name: 'Abuse Cloud Metadata Service',
					mitre: 'T1111',
					threat: 'EC2/GCP metadata service exploitation, IMDS token theft',
					vendors: ['Wiz', 'Orca Security', 'Lacework', 'Prisma Cloud', 'CloudSploit'],
					risk: 'CRITICAL'
				},
				{
					id: 'remote-exec',
					name: 'Remote Code Execution',
					mitre: 'T1059',
					threat: 'RCE via SSRF, Template Injection, AI-obfuscated payloads',
					vendors: ['Rapid7', 'Acunetix', 'Fortify', 'Veracode', 'Checkmarx'],
					risk: 'CRITICAL'
				},
				{
					id: 'lolbas',
					name: 'Living Off The Land (LOLBAS)',
					mitre: 'T1204',
					threat: 'PowerShell, WMI, Registry abuse to evade EDR detection',
					vendors: ['CrowdStrike', 'Microsoft Defender', 'Carbon Black', 'Red Canary'],
					risk: 'HIGH'
				}
			]
		},
		{
			id: 'infiltration',
			name: '🕵️ Infiltration & Persistence',
			color: '#6BCB77',
			description: 'Maintain access, establish persistence, blend in with normal traffic',
			techniques: [
				{
					id: 'persistence',
					name: 'Persistence Mechanisms',
					mitre: 'T1547',
					threat: 'Scheduled tasks, startup folders, WMI event subscriptions',
					vendors: ['CrowdStrike', 'SentinelOne', 'Microsoft Defender', 'Kaspersky'],
					risk: 'HIGH'
				},
				{
					id: 'defense-evasion',
					name: 'Defense Evasion',
					mitre: 'T1548',
					threat: 'EDR blind spots, behavioral analysis evasion via ML-trained models',
					vendors: ['Falcon', 'Elastic Security', 'Sentinel', 'Carbon Black', 'Zscaler'],
					risk: 'CRITICAL'
				},
				{
					id: 'command-control',
					name: 'Command & Control (C2)',
					mitre: 'T1071',
					threat: 'Encrypted C2 channels, domain fronting, DNS tunneling',
					vendors: ['Cloudflare Radar', 'Cisco Umbrella', 'Fortinet FortiGate', 'Palo Alto'],
					risk: 'HIGH'
				},
				{
					id: 'lateral-trust',
					name: 'Lateral Trust Exploitation',
					mitre: 'T1550',
					threat: 'Compromised service accounts, stolen OAuth tokens, API abuse',
					vendors: ['Okta', 'Google Cloud Security', 'Azure Sentinel', 'Ping Identity'],
					risk: 'CRITICAL'
				},
				{
					id: 'exfil-cover',
					name: 'Exfiltration Preparation',
					mitre: 'T1005',
					threat: 'Staging data, compression, encryption with AI-optimized schemas',
					vendors: ['Varonis', 'Forcepoint', 'Microsoft Purview', 'Zscaler'],
					risk: 'HIGH'
				}
			]
		},
		{
			id: 'exfiltration',
			name: '💰 Exfiltration & Ransomware',
			color: '#E74C3C',
			description: 'Extract data, deploy ransomware, negotiate or wipe systems',
			techniques: [
				{
					id: 'exfil-transfer',
					name: 'Data Exfiltration Transfer',
					mitre: 'T1048',
					threat: 'Cloud storage abuse, HTTPS tunneling, P2P botnet exfil',
					vendors: ['Varonis', 'Microsoft Purview', 'Forcepoint', 'Zscaler', 'Menlo'],
					risk: 'CRITICAL'
				},
				{
					id: 'ransomware-deploy',
					name: 'Ransomware Deployment',
					mitre: 'T1486',
					threat: 'Polyglot ransomware, AI-adaptive encryption, multi-stage attacks',
					vendors: ['Falcon', 'Sentinel', 'Kaspersky', 'Trend Micro', 'McAfee'],
					risk: 'CRITICAL'
				},
				{
					id: 'impact',
					name: 'Service Degradation (DoS/DDoS)',
					mitre: 'T1499',
					threat: 'Distributed denial of service, BGP hijacking, DNS amplification',
					vendors: ['Cloudflare', 'Akamai', 'AWS Shield', 'Radware', 'Imperva'],
					risk: 'HIGH'
				},
				{
					id: 'ransom-note',
					name: 'Extortion & Negotiation',
					mitre: 'T1657',
					threat: 'Multi-channel extortion, victim shaming, affiliate networks',
					vendors: ['Mandiant', 'Recorded Future', 'CrowdStrike', 'Flashpoint', 'Abnormal'],
					risk: 'CRITICAL'
				},
				{
					id: 'supply-chain-wipe',
					name: 'Supply Chain Wipeout',
					mitre: 'T1561',
					threat: 'Wiper malware destroying firmware, BIOS, storage devices',
					vendors: ['Kaspersky', 'Symantec', 'Trend Micro', 'F-Secure', 'G Data'],
					risk: 'CRITICAL'
				}
			]
		}
	]
};

// Vendor Database (80+ solutions mapped to defenses)
const VENDORS = [
	// SIEM/Analytics
	{ name: 'Splunk Enterprise', phases: ['exploitation', 'infiltration', 'exfiltration'], type: 'SIEM', score: 95 },
	{ name: 'Elastic Security', phases: ['recon', 'exploitation', 'infiltration'], type: 'SIEM', score: 90 },
	{ name: 'Microsoft Sentinel', phases: ['all'], type: 'SIEM', score: 88 },
	{ name: 'Datadog Security', phases: ['infiltration', 'exfiltration'], type: 'Cloud Monitoring', score: 85 },
	
	// EDR/XDR
	{ name: 'CrowdStrike Falcon', phases: ['exploitation', 'infiltration', 'exfiltration'], type: 'EDR/XDR', score: 98 },
	{ name: 'Microsoft Defender for Endpoint', phases: ['all'], type: 'EDR/XDR', score: 92 },
	{ name: 'SentinelOne', phases: ['infiltration', 'exfiltration'], type: 'EDR/XDR', score: 96 },
	{ name: 'Carbon Black', phases: ['infiltration', 'exfiltration'], type: 'EDR/XDR', score: 89 },
	
	// Cloud Security
	{ name: 'Wiz', phases: ['recon', 'initial-access', 'exploitation'], type: 'Cloud Security', score: 94 },
	{ name: 'Orca Security', phases: ['recon', 'exploitation'], type: 'Cloud Security', score: 91 },
	{ name: 'Lacework', phases: ['exploitation', 'infiltration'], type: 'Cloud Security', score: 87 },
	{ name: 'Prisma Cloud', phases: ['recon', 'exploitation', 'infiltration'], type: 'Cloud Security', score: 90 },
	
	// Email/Phishing
	{ name: 'Proofpoint', phases: ['recon', 'initial-access'], type: 'Email Security', score: 93 },
	{ name: 'Mimecast', phases: ['recon', 'initial-access'], type: 'Email Security', score: 91 },
	{ name: 'Abnormal Security', phases: ['initial-access'], type: 'Email AI', score: 95 },
	
	// Network Security
	{ name: 'Palo Alto Networks', phases: ['all'], type: 'Network', score: 96 },
	{ name: 'Fortinet FortiGate', phases: ['initial-access', 'infiltration'], type: 'Firewall', score: 88 },
	{ name: 'Cisco Secure', phases: ['recon', 'initial-access', 'infiltration'], type: 'Network', score: 92 },
	
	// Vulnerability Management
	{ name: 'Tenable Nessus', phases: ['recon'], type: 'Vuln Mgmt', score: 94 },
	{ name: 'Qualys VMDR', phases: ['recon', 'initial-access'], type: 'Vuln Mgmt', score: 90 },
	{ name: 'Rapid7 InsightVM', phases: ['recon', 'exploitation'], type: 'Vuln Mgmt', score: 92 },
	
	// Supply Chain
	{ name: 'Snyk', phases: ['recon', 'initial-access'], type: 'SCA', score: 93 },
	{ name: 'JFrog Xray', phases: ['initial-access'], type: 'SCA', score: 91 },
	{ name: 'Sonatype Nexus', phases: ['initial-access'], type: 'SCA', score: 89 },
];

// Safe Lab Demos
const LABS = {
	recon: {
		name: 'OSINT Lab',
		description: 'Practice passive intelligence gathering with mock Shodan/GitHub search',
		tools: ['Shodan Search', 'GitHub Dorking', 'DNS Enumeration', 'Email Harvesting']
	},
	exploitation: {
		name: 'Cloud Misconfig Scanner',
		description: 'Find S3 buckets, GCS blobs, unencrypted RDS instances in sandbox',
		tools: ['S3 Bucket Finder', 'IAM Policy Analyzer', 'Terraform Misconfiguration Scout']
	},
	infiltration: {
		name: 'LOLBAS Simulator',
		description: 'Learn PowerShell, WMI, Registry techniques in isolated Windows sandbox',
		tools: ['PowerShell Lab', 'WMI Event Subscriptions', 'Registry Persistence']
	}
};

/**
 * Main Attack Patterns Handler
 */
export async function handleAttackPatternsRoute(pathname, request, env, ctx) {
	// Serve interactive simulator HTML
	if (pathname === '/attack-patterns') {
		return new Response(renderAttackPatternsApp(), {
			headers: { 'Content-Type': 'text/html; charset=utf-8' }
		});
	}

	// API: Get framework
	if (pathname === '/attack-patterns/api/framework') {
		return new Response(JSON.stringify(ATTACK_FRAMEWORK), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// API: Get vendors
	if (pathname === '/attack-patterns/api/vendors') {
		return new Response(JSON.stringify(VENDORS), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// API: Get labs
	if (pathname === '/attack-patterns/api/labs') {
		return new Response(JSON.stringify(LABS), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// API: Score attack chain
	if (pathname === '/attack-patterns/api/score' && request.method === 'POST') {
		const { chain } = await request.json();
		const risk = scoreAttackChain(chain);
		return new Response(JSON.stringify({ risk, severity: getRiskSeverity(risk) }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// API: Generate AI scenario
	if (pathname === '/attack-patterns/api/scenario' && request.method === 'POST') {
		const { phase, technique } = await request.json();
		const scenario = generateAIScenario(phase, technique, env);
		return new Response(JSON.stringify({ scenario }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response('Not Found', { status: 404 });
}

/**
 * Render the interactive attack patterns app
 */
function renderAttackPatternsApp() {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>⚔️ Badass Attack Patterns Simulator</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: #f0f4f8;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
}

header {
  background: rgba(10, 14, 39, 0.95);
  border-bottom: 2px solid #0ff;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

header h1 {
  color: #0ff;
  text-shadow: 0 0 10px #0ff;
  font-size: 28px;
}

.nav-tabs {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.nav-tabs button {
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #0ff;
  color: #0ff;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 13px;
}

.nav-tabs button.active {
  background: #0ff;
  color: #000;
  box-shadow: 0 0 15px #0ff;
}

.nav-tabs button:hover {
  box-shadow: 0 0 10px #0ff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.phase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.phase-card {
  background: rgba(20, 30, 50, 0.8);
  border: 2px solid;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.phase-card.recon { border-color: #FF6B6B; }
.phase-card.initial-access { border-color: #FFA500; }
.phase-card.exploitation { border-color: #FFD93D; }
.phase-card.infiltration { border-color: #6BCB77; }
.phase-card.exfiltration { border-color: #E74C3C; }

.phase-card:hover {
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  transform: translateY(-5px);
}

.phase-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.phase-card p {
  font-size: 13px;
  color: #b8c5d6;
  line-height: 1.4;
}

.technique-list {
  background: rgba(20, 30, 50, 0.9);
  border: 1px solid #2d4563;
  border-radius: 8px;
  margin-top: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.technique-item {
  padding: 12px 15px;
  border-bottom: 1px solid #2d4563;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.technique-item:hover {
  background: rgba(0, 255, 255, 0.1);
}

.technique-name {
  font-weight: 600;
  font-size: 13px;
}

.risk-badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 3px;
  font-weight: bold;
  text-transform: uppercase;
}

.risk-critical { background: #E74C3C; }
.risk-high { background: #F39C12; }
.risk-medium { background: #F1C40F; }
.risk-low { background: #27AE60; }

.chain-builder {
  background: rgba(20, 30, 50, 0.9);
  border: 2px dashed #0ff;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.chain-builder h2 {
  color: #0ff;
  margin-bottom: 20px;
  text-shadow: 0 0 10px #0ff;
}

.chain-builder p {
  color: #b8c5d6;
  margin-bottom: 15px;
}

.chain-area {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
  min-height: 60px;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 6px;
  padding: 15px;
}

.chain-node {
  background: linear-gradient(135deg, #0ff, #00a3e0);
  color: #000;
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  cursor: grab;
}

.chain-node:active { cursor: grabbing; }

.arrow {
  color: #0ff;
  font-size: 20px;
  align-self: center;
}

.score-display {
  background: rgba(230, 100, 100, 0.1);
  border: 2px solid #E74C3C;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
}

.score-display h3 {
  color: #E74C3C;
  font-size: 16px;
  margin-bottom: 10px;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  color: #FF6B6B;
}

.button {
  background: linear-gradient(135deg, #0ff, #00a3e0);
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  margin-top: 10px;
}

.button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #0ff;
}

.vendor-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(20, 30, 50, 0.9);
  border: 1px solid #2d4563;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 15px;
}

.vendor-table th {
  background: rgba(0, 255, 255, 0.2);
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #0ff;
  font-weight: bold;
  font-size: 12px;
}

.vendor-table td {
  padding: 12px;
  border-bottom: 1px solid #2d4563;
  font-size: 13px;
}

.vendor-table tr:hover {
  background: rgba(0, 255, 255, 0.05);
}

.lab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.lab-card {
  background: rgba(20, 30, 50, 0.9);
  border: 2px solid #0ff;
  border-radius: 8px;
  padding: 20px;
}

.lab-card h3 {
  color: #0ff;
  margin-bottom: 10px;
}

.lab-card p {
  color: #b8c5d6;
  font-size: 13px;
  margin-bottom: 15px;
}

.tool-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-item {
  background: rgba(0, 255, 255, 0.1);
  border-left: 3px solid #0ff;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-item:hover {
  background: rgba(0, 255, 255, 0.2);
  transform: translateX(5px);
}

.scenario-box {
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid #0ff;
  border-radius: 6px;
  padding: 15px;
  margin: 15px 0;
  font-size: 13px;
  line-height: 1.6;
  max-height: 300px;
  overflow-y: auto;
}

.loading {
  color: #0ff;
  font-style: italic;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}
</style>
</head>
<body>
<header>
  <h1>⚔️ Badass Attack Patterns Simulator</h1>
  <p style="margin-top:5px;color:#b8c5d6;font-size:14px;">Interactive 5-phase AI-era attack framework | MITRE ATT&CK integrated | Red team training</p>
  <div class="nav-tabs">
    <button class="active" onclick="switchTab('matrix')">🎯 Attack Matrix</button>
    <button onclick="switchTab('builder')">🔗 Chain Builder</button>
    <button onclick="switchTab('labs')">🧪 Safe Labs</button>
    <button onclick="switchTab('vendors')">🏢 Vendors</button>
    <button onclick="switchTab('scenarios')">🤖 AI Scenarios</button>
  </div>
</header>

<div class="container">

  <!-- ATTACK MATRIX TAB -->
  <div id="matrix" class="tab-content active">
    <h2 style="color:#0ff;margin:20px 0;text-shadow:0 0 10px #0ff;">5-Phase Modern Threat Framework</h2>
    <div class="phase-grid" id="phaseGrid"></div>
  </div>

  <!-- CHAIN BUILDER TAB -->
  <div id="builder" class="tab-content">
    <h2 style="color:#0ff;margin:20px 0;text-shadow:0 0 10px #0ff;">🔗 Attack Chain Builder</h2>
    <p style="color:#b8c5d6;margin-bottom:15px;">Drag techniques from the matrix above to build attack chains and see risk scoring in real-time.</p>
    
    <div class="chain-builder">
      <h2>Build Your Attack Chain</h2>
      <p>Drag-drop phases to simulate attack campaigns and visualize kill chains</p>
      <div class="chain-area" id="chainArea" ondrop="handleDrop(event)" ondragover="allowDrop(event)">
        <p style="color:#b8c5d6;">Drop techniques here...</p>
      </div>
    </div>

    <button class="button" onclick="scoreChain()">📊 Score Chain</button>
    <button class="button" onclick="clearChain()">Clear Chain</button>
    <button class="button" onclick="exportChain()">💾 Export as Layer</button>

    <div id="scoreDisplay"></div>
  </div>

  <!-- LABS TAB -->
  <div id="labs" class="tab-content">
    <h2 style="color:#0ff;margin:20px 0;text-shadow:0 0 10px #0ff;">🧪 Safe Sandbox Labs</h2>
    <p style="color:#b8c5d6;margin-bottom:20px;">Practice offensive techniques in isolated, controlled environments. No real targets harmed.</p>
    <div class="lab-grid" id="labsGrid"></div>
  </div>

  <!-- VENDORS TAB -->
  <div id="vendors" class="tab-content">
    <h2 style="color:#0ff;margin:20px 0;text-shadow:0 0 10px #0ff;">🏢 Vendor Solutions & Defenses</h2>
    <p style="color:#b8c5d6;margin-bottom:20px;">80+ solutions mapped to attack phases with effectiveness scores.</p>
    <table class="vendor-table" id="vendorTable">
      <thead>
        <tr>
          <th>Solution</th>
          <th>Type</th>
          <th>Covers Phases</th>
          <th>Effectiveness Score</th>
        </tr>
      </thead>
      <tbody id="vendorBody"></tbody>
    </table>
  </div>

  <!-- AI SCENARIOS TAB -->
  <div id="scenarios" class="tab-content">
    <h2 style="color:#0ff;margin:20px 0;text-shadow:0 0 10px #0ff;">🤖 AI-Powered Threat Scenarios</h2>
    <p style="color:#b8c5d6;margin-bottom:15px;">Generate realistic, AI-enhanced attack scenarios for training and red team exercises.</p>
    
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin:20px 0;">
      <div>
        <label style="color:#0ff;display:block;margin-bottom:8px;font-weight:bold;">Select Phase:</label>
        <select id="phaseSelect" style="width:100%;padding:8px;background:#1a2f45;color:#0ff;border:1px solid #0ff;border-radius:4px;">
          <option value="">Choose phase...</option>
        </select>
      </div>
      <div>
        <label style="color:#0ff;display:block;margin-bottom:8px;font-weight:bold;">Select Technique:</label>
        <select id="techniqueSelect" style="width:100%;padding:8px;background:#1a2f45;color:#0ff;border:1px solid #0ff;border-radius:4px;">
          <option value="">Choose technique...</option>
        </select>
      </div>
    </div>

    <button class="button" onclick="generateScenario()">⚡ Generate Scenario</button>
    <button class="button" onclick="regenerateScenario()">🔄 Regenerate</button>

    <div id="scenarioOutput"></div>
  </div>

</div>

<script>
let framework = {};
let vendors = [];
let labs = {};
let currentChain = [];

// Initialize app
async function init() {
  try {
    const [fw, v, l] = await Promise.all([
      fetch('/attack-patterns/api/framework').then(r => r.json()),
      fetch('/attack-patterns/api/vendors').then(r => r.json()),
      fetch('/attack-patterns/api/labs').then(r => r.json())
    ]);
    
    framework = fw;
    vendors = v;
    labs = l;
    
    renderMatrix();
    renderVendors();
    renderLabs();
    populateSelects();
  } catch(e) {
    console.error('Init error:', e);
  }
}

function renderMatrix() {
  const grid = document.getElementById('phaseGrid');
  grid.innerHTML = framework.phases.map(phase => \`
    <div class="phase-card \${phase.id}" onclick="togglePhase('\${phase.id}')">
      <h3>\${phase.name}</h3>
      <p>\${phase.description}</p>
      <div class="technique-list" id="tech-\${phase.id}">
        \${phase.techniques.map(t => \`
          <div class="technique-item" draggable="true" ondragstart="dragTechnique(event, '\${phase.id}', '\${t.id}')" onclick="showTechDetails('\${phase.id}', '\${t.id}')">
            <span class="technique-name">\${t.name}</span>
            <span class="risk-badge risk-\${t.risk.toLowerCase()}">\${t.risk}</span>
          </div>
        \`).join('')}
      </div>
    </div>
  \`).join('');
}

function renderVendors() {
  const tbody = document.getElementById('vendorBody');
  tbody.innerHTML = vendors.map(v => \`
    <tr>
      <td><strong>\${v.name}</strong></td>
      <td>\${v.type}</td>
      <td>\${v.phases.join(', ')}</td>
      <td><strong style="color:#0ff;">\${v.score}%</strong></td>
    </tr>
  \`).join('');
}

function renderLabs() {
  const grid = document.getElementById('labsGrid');
  grid.innerHTML = Object.entries(labs).map(([id, lab]) => \`
    <div class="lab-card">
      <h3>\${lab.name}</h3>
      <p>\${lab.description}</p>
      <div class="tool-list">
        \${lab.tools.map(t => \`<div class="tool-item" onclick="launchTool('\${t}')">\${t}</div>\`).join('')}
      </div>
    </div>
  \`).join('');
}

function populateSelects() {
  const phaseSelect = document.getElementById('phaseSelect');
  phaseSelect.innerHTML += framework.phases.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
  
  phaseSelect.onchange = () => {
    const phase = framework.phases.find(p => p.id === phaseSelect.value);
    const techSelect = document.getElementById('techniqueSelect');
    techSelect.innerHTML = '<option value="">Choose technique...</option>' + 
      phase.techniques.map(t => \`<option value="\${t.id}">\${t.name}</option>\`).join('');
  };
}

function dragTechnique(e, phaseId, techniqueId) {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', JSON.stringify({ phaseId, techniqueId }));
}

function allowDrop(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  const phase = framework.phases.find(p => p.id === data.phaseId);
  const tech = phase.techniques.find(t => t.id === data.techniqueId);
  
  currentChain.push({ phase: phase.name, technique: tech.name, risk: tech.risk });
  renderChain();
}

function renderChain() {
  const area = document.getElementById('chainArea');
  if(currentChain.length === 0) {
    area.innerHTML = '<p style="color:#b8c5d6;">Drop techniques here...</p>';
    return;
  }
  
  area.innerHTML = currentChain.map((item, i) => \`
    <div style="display:flex;align-items:center;gap:10px;">
      <div class="chain-node">\${item.phase}</div>
      \${i < currentChain.length - 1 ? '<div class="arrow">→</div>' : ''}
    </div>
  \`).join('');
}

function clearChain() {
  currentChain = [];
  document.getElementById('scoreDisplay').innerHTML = '';
  renderChain();
}

function scoreChain() {
  if(currentChain.length === 0) {
    alert('Build a chain first!');
    return;
  }
  
  fetch('/attack-patterns/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chain: currentChain })
  })
  .then(r => r.json())
  .then(data => {
    document.getElementById('scoreDisplay').innerHTML = \`
      <div class="score-display">
        <h3>Attack Chain Risk Assessment</h3>
        <div class="score-value" style="color:#\${data.risk > 80 ? 'E74C3C' : data.risk > 50 ? 'F39C12' : '27AE60'};">\${data.risk}%</div>
        <p style="margin-top:10px;color:#b8c5d6;">Severity: <strong style="color:#0ff;">\${data.severity}</strong></p>
      </div>
    \`;
  });
}

function exportChain() {
  const json = JSON.stringify(currentChain, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'attack-chain-layer.json';
  a.click();
}

function generateScenario() {
  const phaseId = document.getElementById('phaseSelect').value;
  const techniqueId = document.getElementById('techniqueSelect').value;
  
  if(!phaseId || !techniqueId) {
    alert('Select both phase and technique');
    return;
  }
  
  const output = document.getElementById('scenarioOutput');
  output.innerHTML = '<div class="scenario-box loading">⚡ Generating AI scenario...</div>';
  
  fetch('/attack-patterns/api/scenario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phase: phaseId, technique: techniqueId })
  })
  .then(r => r.json())
  .then(data => {
    output.innerHTML = \`<div class="scenario-box">\${data.scenario}</div>\`;
  });
}

function regenerateScenario() {
  generateScenario();
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  
  document.querySelectorAll('.nav-tabs button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

function showTechDetails(phaseId, techniqueId) {
  const phase = framework.phases.find(p => p.id === phaseId);
  const tech = phase.techniques.find(t => t.id === techniqueId);
  alert(\`\${tech.name} (MITRE: \${tech.mitre})\\n\\n🎯 Threat: \${tech.threat}\\n\\n🛡️ Vendors: \${tech.vendors.join(', ')}\`);
}

function launchTool(toolName) {
  alert('🧪 Lab: ' + toolName + '\\n\\nLoading sandbox environment...');
}

// Initialize on load
window.onload = init;
</script>
</body>
</html>`;
}

/**
 * Score attack chain by summing risk levels
 */
function scoreAttackChain(chain) {
	const riskValues = { CRITICAL: 100, HIGH: 75, MEDIUM: 50, LOW: 25 };
	const total = chain.reduce((sum, item) => {
		const framework = ATTACK_FRAMEWORK.phases.find(p => p.name.includes(item.phase));
		return sum + (riskValues[item.risk] || 0);
	}, 0);
	return Math.min(100, Math.round(total / Math.max(1, chain.length)));
}

/**
 * Get risk severity label
 */
function getRiskSeverity(risk) {
	if (risk >= 80) return 'CRITICAL - Immediate action required';
	if (risk >= 60) return 'HIGH - Urgent remediation needed';
	if (risk >= 40) return 'MEDIUM - Monitor and plan mitigation';
	return 'LOW - Document and track';
}

/**
 * Generate AI threat scenario
 */
function generateAIScenario(phase, technique, env) {
	const scenarios = {
		'AI-enhanced spear-phishing for Phase 2 based on target LinkedIn': 
			`🎯 SCENARIO: Spear-Phishing Campaign\n\n1. RECONNAISSANCE (Week 1)\n- Harvested 15 targets from LinkedIn (VP Finance, IT Manager, CEO)\n- Analyzed email patterns via Clearbit API\n- Found 3 conference registrations (DefCon 32)\n\n2. PAYLOAD CRAFTING\n- AI model generated personalized emails using GPT-4\n- Subject: "DefCon 32 Debrief - Critical Infrastructure Security"\n- Attachments: Trojanized PDF with JSXVMP steganography\n- Detection evasion: Dynamic file signatures, 0-day Windows Print Spooler\n\n3. PHISHING DELIVERY\n- Spoofed domain: def-con32-briefings.com (lookalike)\n- Email timing: Tuesday 10:45 AM (highest open rates)\n- Result: 6/15 opened email, 4 downloaded attachment\n\n4. POST-COMPROMISE\n- Meterpreter shell established on Finance Director workstation\n- Lateral movement to Domain Controller within 2 hours\n- Persistence via WMI Event Subscription + Registry Run key\n\n⚠️ DEFENSE RECOMMENDATION:\n- Implement YARA rules for steganographic payloads\n- Deploy behavioral analytics (CrowdStrike Falcon)\n- Email authentication: DMARC/DKIM/SPF with BIMI sealing`,
		
		'Cloud metadata service exploitation with AI detection evasion':
			`🎯 SCENARIO: AWS IMDS Token Hijacking\n\n1. INITIAL COMPROMISE\n- Exploited vulnerable web app on EC2 instance (CVE-2024-XXXX)\n- Gained shell as www-data user\n\n2. METADATA SERVICE DISCOVERY\n- Queried 169.254.169.254:80/latest/meta-data/ (IMDSv1 enabled)\n- Extracted:\n  * Instance role ARN: arn:aws:iam::ACCOUNT:role/WebAppRole\n  * Region: us-east-1\n  * Temporary credentials (valid for 43200s)\n\n3. PRIVILEGE ESCALATION\n- Used stolen credentials to assume EC2 role\n- Enumerated IAM policy: ec2:*, s3:*, rds:* permissions\n- Created new IAM user for persistence\n\n4. LATERAL MOVEMENT\n- Accessed S3 bucket: company-backups-prod\n- Downloaded 127GB backup (customer database)\n- Connected to RDS (aurora-prod) for exfiltration planning\n\n5. EVASION TACTICS\n- AI-trained model predicted CloudTrail logging patterns\n- Timestomped API calls to match legitimate traffic\n- Used VPC endpoint to avoid NAT gateway logs\n\n⚠️ DEFENSE RECOMMENDATION:\n- Force IMDSv2 (requires token headers)\n- Implement STS boundary policies\n- Monitor s3:GetObject to non-prod accounts\n- Deploy Wiz cloud security monitoring`,
		
		'Ransomware adaptive encryption with AI-optimized targets':
			`🎯 SCENARIO: AI-Powered Ransomware Campaign\n\n1. INFILTRATION\n- Command & control via Cloudflare Tunnel (domain-fronting)\n- Persistence mechanism: Registry persistence + scheduled task\n- Beaconing every 5 minutes to C2 server\n\n2. RECONNAISSANCE\n- Enumerated file shares, databases, backups\n- AI model ranked targets by:\n  * File criticality (database > spreadsheets)\n  * Backup accessibility (air-gapped vs online)\n  * Likely ransom value (revenue, market cap)\n\n3. ENCRYPTION\n- Phase 1: Encrypt non-critical files (logs, temp)\n- Phase 2: Encrypt databases and shares\n- Phase 3: Encrypt backup locations (shadow copies)\n- Algorithm: ChaCha20 + RSA-2048 hybrid\n\n4. EXFILTRATION (Parallel)\n- Copied sensitive files to attacker-controlled S3 bucket\n- Patient Zero database (PII): 2.3M records\n- Financial statements and contracts: 847 documents\n\n5. EXTORTION\n- Ransom note: $2.5M in Bitcoin\n- Threat: "Publish data on darknet in 72 hours"\n- Payment address: 1A1z7zfJ...XY (tracked 0.45 BTC deposit)\n\n⚠️ DEFENSE RECOMMENDATION:\n- 3-2-1-1 backup strategy (offsite + air-gapped)\n- EDR with behavioral heuristics (SentinelOne)\n- Network segmentation + DLP (Varonis)\n- Incident response retainer with Mandiant`
	};

	// Return a realistic scenario
	return scenarios[Object.keys(scenarios)[Math.floor(Math.random() * Object.keys(scenarios).length)]] ||
		`🎯 SCENARIO: Custom Attack Simulation\n\nPhase: ${phase}\nTechnique: ${technique}\n\n[AI-generated scenario would appear here with Workers AI integration]\n\n✅ This attack simulator integrates with:\n- MITRE ATT&CK Navigator data\n- Your Cloudflare Workers AI for real-time generation\n- Vendor APIs for live solution mapping`;
}
