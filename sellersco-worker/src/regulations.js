// Regulations - Compliance Framework & Standards Management
// Comprehensive regulatory compliance tracking and reporting

const FRAMEWORKS = [
  {
    name: "HIPAA",
    fullName: "Health Insurance Portability and Accountability Act",
    category: "Healthcare",
    coverage: 95,
    status: "COMPLIANT",
    lastAudit: "Nov 15, 2025",
    requirements: [
      "Administrative Safeguards",
      "Physical Safeguards",
      "Technical Safeguards",
      "Organizational Policies",
      "Documentation Requirements"
    ],
    controls: 42,
    implemented: 40,
    pendingReview: 2
  },
  {
    name: "PCI-DSS",
    fullName: "Payment Card Industry Data Security Standard",
    category: "Financial",
    coverage: 98,
    status: "COMPLIANT",
    lastAudit: "Dec 01, 2025",
    requirements: [
      "Network Security",
      "Data Protection",
      "Vulnerability Management",
      "Access Control",
      "Testing & Monitoring"
    ],
    controls: 55,
    implemented: 54,
    pendingReview: 1
  },
  {
    name: "GDPR",
    fullName: "General Data Protection Regulation",
    category: "Data Privacy",
    coverage: 92,
    status: "COMPLIANT",
    lastAudit: "Nov 20, 2025",
    requirements: [
      "Data Subject Rights",
      "Consent Management",
      "Data Protection Impact",
      "Breach Notification",
      "Privacy by Design"
    ],
    controls: 48,
    implemented: 44,
    pendingReview: 4
  },
  {
    name: "SOC 2 Type II",
    fullName: "Service Organization Control Framework",
    category: "Enterprise",
    coverage: 96,
    status: "COMPLIANT",
    lastAudit: "Oct 30, 2025",
    requirements: [
      "Security",
      "Availability",
      "Processing Integrity",
      "Confidentiality",
      "Privacy"
    ],
    controls: 40,
    implemented: 39,
    pendingReview: 1
  },
  {
    name: "FedRAMP",
    fullName: "Federal Risk and Authorization Management Program",
    category: "Government",
    coverage: 99,
    status: "AUTHORIZED",
    lastAudit: "Sep 15, 2025",
    requirements: [
      "System Security Plans",
      "Continuous Monitoring",
      "Incident Response",
      "Access Controls",
      "Audit Logging"
    ],
    controls: 110,
    implemented: 109,
    pendingReview: 1
  },
  {
    name: "ISO 27001",
    fullName: "Information Security Management System",
    category: "Enterprise",
    coverage: 94,
    status: "CERTIFIED",
    lastAudit: "Nov 10, 2025",
    requirements: [
      "Information Security Policies",
      "Organization Controls",
      "Human Resource Security",
      "Asset Management",
      "Cryptography"
    ],
    controls: 114,
    implemented: 107,
    pendingReview: 7
  },
  {
    name: "CMMC 2.0",
    fullName: "Cybersecurity Maturity Model Certification 2.0",
    category: "Defense",
    coverage: 89,
    status: "COMPLIANT",
    lastAudit: "Dec 05, 2025",
    requirements: [
      "Asset Management",
      "Data Protection",
      "System and Communications Protection",
      "Incident Response",
      "Supply Chain Risk Management"
    ],
    controls: 23,
    implemented: 21,
    pendingReview: 2
  },
  {
    name: "NIS2",
    fullName: "Network and Information Security 2 Directive",
    category: "EU Cybersecurity",
    coverage: 85,
    status: "COMPLIANT",
    lastAudit: "Nov 25, 2025",
    requirements: [
      "Governance and Risk Management",
      "Security Operations",
      "Incident Handling",
      "Supply Chain Security",
      "Reporting and Cooperation"
    ],
    controls: 18,
    implemented: 15,
    pendingReview: 3
  },
  {
    name: "DORA",
    fullName: "Digital Operational Resilience Act",
    category: "Financial Services",
    coverage: 88,
    status: "COMPLIANT",
    lastAudit: "Dec 01, 2025",
    requirements: [
      "ICT Risk Management",
      "Testing and Resilience",
      "Third-Party Risk",
      "Incident Reporting",
      "Competency and Governance"
    ],
    controls: 20,
    implemented: 18,
    pendingReview: 2
  },
  {
    name: "SEC Cyber Rules",
    fullName: "SEC Cybersecurity Risk Management Rules",
    category: "Financial Services",
    coverage: 91,
    status: "COMPLIANT",
    lastAudit: "Dec 03, 2025",
    requirements: [
      "Governance and Risk Assessment",
      "Incident Detection",
      "Incident Response",
      "Public Disclosure Requirements",
      "Third-Party Service Provider Management"
    ],
    controls: 15,
    implemented: 14,
    pendingReview: 1
  }
];

const COMPLIANCE_STATUS = {
  totalRequirements: 407,
  implemented: 393,
  inProgress: 10,
  notStarted: 4,
  complianceScore: 96.6
};

export async function handleRegulations(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  if (pathname.startsWith('/regulations/api/')) {
    const apiPath = pathname.slice('/regulations/api/'.length);
    
    if (apiPath === 'frameworks' && request.method === 'GET') {
      return jsonResponse(FRAMEWORKS);
    }
    
    if (apiPath === 'status' && request.method === 'GET') {
      return jsonResponse(COMPLIANCE_STATUS);
    }
  }
  
  return new Response(renderRegulationsUI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderRegulationsUI() {
  const frameworkCards = FRAMEWORKS.map(f => `
    <div class="framework-card">
      <div class="framework-header">
        <h3>${f.name}</h3>
        <span class="status-badge ${f.status.toLowerCase()}">${f.status}</span>
      </div>
      <p style="color: #999; font-size: 12px; margin: 8px 0 10px 0;">${f.fullName}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${f.coverage}%"></div>
      </div>
      <div class="framework-stats">
        <div class="stat">
          <span class="label">Controls</span>
          <span class="value">${f.implemented}/${f.controls}</span>
        </div>
        <div class="stat">
          <span class="label">Coverage</span>
          <span class="value">${f.coverage}%</span>
        </div>
        <div class="stat">
          <span class="label">Last Audit</span>
          <span class="value" style="font-size: 11px;">${f.lastAudit}</span>
        </div>
      </div>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Regulations - Compliance Management</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #0a0a2e 0%, #16213e 100%);
      color: #e0e0e0;
      min-height: 100vh;
    }
    
    .header {
      background: linear-gradient(90deg, #a78bfa 0%, #8b5cf6 100%);
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(167, 139, 250, 0.3);
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
    
    .compliance-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .summary-card {
      background: rgba(167, 139, 250, 0.1);
      border: 2px solid #a78bfa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .summary-label {
      color: #999;
      font-size: 12px;
      margin-bottom: 10px;
    }
    
    .summary-value {
      color: #a78bfa;
      font-size: 28px;
      font-weight: 700;
    }
    
    .framework-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .framework-card {
      background: rgba(167, 139, 250, 0.05);
      border: 2px solid #a78bfa;
      padding: 20px;
      border-radius: 8px;
      transition: all 0.3s;
    }
    
    .framework-card:hover {
      background: rgba(167, 139, 250, 0.15);
      transform: translateY(-3px);
    }
    
    .framework-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }
    
    .framework-card h3 {
      color: #a78bfa;
      font-size: 18px;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }
    
    .status-badge.compliant {
      background: rgba(0, 204, 51, 0.2);
      color: #00cc33;
    }
    
    .status-badge.authorized {
      background: rgba(102, 153, 255, 0.2);
      color: #6699ff;
    }
    
    .status-badge.certified {
      background: rgba(102, 194, 255, 0.2);
      color: #66c2ff;
    }
    
    .progress-bar {
      background: rgba(167, 139, 250, 0.2);
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin: 12px 0;
    }
    
    .progress-fill {
      background: linear-gradient(90deg, #a78bfa 0%, #d8b4fe 100%);
      height: 100%;
      transition: width 0.3s;
    }
    
    .framework-stats {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-top: 12px;
    }
    
    .stat {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    
    .stat .label {
      color: #666;
      font-size: 10px;
    }
    
    .stat .value {
      color: #a78bfa;
      font-size: 14px;
      font-weight: 700;
    }
    
    h2 {
      color: #a78bfa;
      margin-bottom: 25px;
    }
    
    @media (max-width: 768px) {
      .framework-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📋 Regulations - Compliance Frameworks</h1>
    <p>Track and manage compliance across multiple regulatory frameworks</p>
  </div>
  
  <div class="container">
    <h2>Compliance Overview</h2>
    <div class="compliance-summary">
      <div class="summary-card">
        <div class="summary-label">Total Requirements</div>
        <div class="summary-value">${COMPLIANCE_STATUS.totalRequirements}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Implemented</div>
        <div class="summary-value">${COMPLIANCE_STATUS.implemented}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">In Progress</div>
        <div class="summary-value">${COMPLIANCE_STATUS.inProgress}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Compliance Score</div>
        <div class="summary-value">${COMPLIANCE_STATUS.complianceScore}%</div>
      </div>
    </div>
    
    <h2>Regulatory Frameworks</h2>
    <div class="framework-grid">
      ${frameworkCards}
    </div>
  </div>
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
