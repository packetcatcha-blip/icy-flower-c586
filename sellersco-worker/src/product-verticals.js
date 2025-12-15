// Product Verticals - Industry-Specific Solutions & Use Cases
// Tailored security solutions for different business sectors

const VERTICALS = [
  {
    name: "Healthcare",
    icon: "🏥",
    description: "HIPAA-compliant security for patient data protection",
    solutions: ["Patient Data Protection", "Medical Device Security", "Access Control (RBAC)", "Audit Logging", "Encryption at Rest/Transit"],
    challenges: ["HIPAA Compliance", "ransomware threats", "Legacy Systems", "Data Breaches"],
    customers: 450,
    breachPrevention: "$2.3M avg",
    complianceScore: 96
  },
  {
    name: "Financial Services",
    icon: "💰",
    description: "PCI-DSS and SEC-compliant security for financial institutions",
    solutions: ["Payment Card Protection", "Transaction Monitoring", "Fraud Detection", "API Security", "Risk Management"],
    challenges: ["PCI Compliance", "Fraud Detection", "Insider Threats", "Regulatory Audits"],
    customers: 320,
    breachPrevention: "$4.1M avg",
    complianceScore: 98
  },
  {
    name: "Retail & E-commerce",
    icon: "🛍️",
    description: "Protecting customer data and payment processing systems",
    solutions: ["POS System Security", "Payment Protection", "Customer Data", "Inventory Security", "Website Protection"],
    challenges: ["PCI DSS", "Customer Data", "Season Traffic", "Fraud"],
    customers: 680,
    breachPrevention: "$1.8M avg",
    complianceScore: 92
  },
  {
    name: "Manufacturing",
    icon: "🏭",
    description: "Operational Technology (OT) and Industrial IoT security",
    solutions: ["ICS/SCADA Security", "Supply Chain Protection", "Asset Tracking", "Production Monitoring", "IoT Device Security"],
    challenges: ["OT Networks", "Legacy Equipment", "Supply Chain Attacks", "Downtime Cost"],
    customers: 210,
    breachPrevention: "$3.2M avg",
    complianceScore: 88
  },
  {
    name: "Government & Public Sector",
    icon: "🏛️",
    description: "FedRAMP and government compliance for public agencies",
    solutions: ["FedRAMP Compliance", "Classified Data Handling", "Citizens Privacy", "Audit Trail", "Security Clearance Integration"],
    challenges: ["FedRAMP", "Classified Data", "Oversight Audits", "Budget Constraints"],
    customers: 145,
    breachPrevention: "$2.1M avg",
    complianceScore: 99
  },
  {
    name: "Education",
    icon: "🎓",
    description: "FERPA-compliant security for educational institutions",
    solutions: ["Student Data Protection", "Network Security", "Research Data", "Distance Learning", "Compliance Reporting"],
    challenges: ["FERPA Compliance", "Open Networks", "Budget Limits", "Legacy Systems"],
    customers: 380,
    breachPrevention: "$900K avg",
    complianceScore: 91
  }
];

const USE_CASES = [
  {
    vertical: "Healthcare",
    title: "Patient Data Breach Prevention",
    description: "Real-time monitoring and encryption of patient health records",
    outcome: "99.8% breach prevention rate"
  },
  {
    vertical: "Financial Services",
    title: "Fraud Detection & Prevention",
    description: "AI-powered anomaly detection for financial transactions",
    outcome: "87% fraud prevention rate"
  },
  {
    vertical: "Retail & E-commerce",
    title: "PCI Compliance Automation",
    description: "Automated PCI-DSS compliance monitoring and remediation",
    outcome: "100% compliance audit pass rate"
  },
  {
    vertical: "Manufacturing",
    title: "OT Network Segmentation",
    description: "Secure isolation of production networks from IT infrastructure",
    outcome: "Zero unplanned downtime from cyberattacks"
  }
];

export async function handleProductVerticals(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  if (pathname.startsWith('/product-verticals/api/')) {
    const apiPath = pathname.slice('/product-verticals/api/'.length);
    
    if (apiPath === 'verticals' && request.method === 'GET') {
      return jsonResponse(VERTICALS);
    }
    
    if (apiPath === 'use-cases' && request.method === 'GET') {
      return jsonResponse(USE_CASES);
    }
  }
  
  return new Response(renderProductVerticalsUI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderProductVerticalsUI() {
  const verticalCards = VERTICALS.map(v => `
    <div class="vertical-card" onclick="showVertical('${v.name}')">
      <div class="vertical-icon">${v.icon}</div>
      <h3>${v.name}</h3>
      <p>${v.description}</p>
      <div class="vertical-stats">
        <div class="stat">
          <span class="label">Customers</span>
          <span class="value">${v.customers}</span>
        </div>
        <div class="stat">
          <span class="label">Compliance</span>
          <span class="value">${v.complianceScore}%</span>
        </div>
      </div>
    </div>
  `).join('');
  
  const detailsHtml = VERTICALS.map((v, idx) => `
    <div id="detail-${idx}" class="vertical-detail" style="display: none;">
      <button class="close-btn" onclick="hideVertical()">✕ Close</button>
      <h2>${v.icon} ${v.name}</h2>
      <p style="margin: 15px 0; color: #999;">${v.description}</p>
      
      <h3 style="color: #00d4ff; margin: 20px 0 10px 0;">Key Solutions</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
        ${v.solutions.map(s => '<span style="background: #00d4ff; color: #0a0a2e; padding: 8px 12px; border-radius: 4px; font-size: 12px; text-align: center;">' + s + '</span>').join('')}
      </div>
      
      <h3 style="color: #00d4ff; margin: 20px 0 10px 0;">Industry Challenges</h3>
      <ul style="margin-left: 20px; color: #999;">
        ${v.challenges.map(c => '<li style="margin: 8px 0;">' + c + '</li>').join('')}
      </ul>
      
      <h3 style="color: #00d4ff; margin: 20px 0 10px 0;">Business Impact</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 6px; text-align: center;">
          <div style="color: #666; font-size: 12px;">Active Customers</div>
          <div style="color: #00d4ff; font-size: 20px; font-weight: 700;">${v.customers}</div>
        </div>
        <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 6px; text-align: center;">
          <div style="color: #666; font-size: 12px;">Avg Breach Prevention</div>
          <div style="color: #00d4ff; font-size: 20px; font-weight: 700;">${v.breachPrevention}</div>
        </div>
        <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 6px; text-align: center;">
          <div style="color: #666; font-size: 12px;">Compliance Score</div>
          <div style="color: #00d4ff; font-size: 20px; font-weight: 700;">${v.complianceScore}%</div>
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
  <title>Product Verticals - Industry Solutions</title>
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
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px 20px;
    }
    
    .vertical-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .vertical-card {
      background: rgba(0, 212, 255, 0.05);
      border: 2px solid #00d4ff;
      padding: 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .vertical-card:hover {
      background: rgba(0, 212, 255, 0.15);
      transform: translateY(-5px);
    }
    
    .vertical-icon {
      font-size: 40px;
      margin-bottom: 10px;
    }
    
    .vertical-card h3 {
      color: #00d4ff;
      margin-bottom: 8px;
      font-size: 18px;
    }
    
    .vertical-card p {
      color: #999;
      font-size: 13px;
      margin-bottom: 15px;
    }
    
    .vertical-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .stat .label {
      color: #666;
      font-size: 10px;
    }
    
    .stat .value {
      color: #00d4ff;
      font-size: 14px;
      font-weight: 700;
    }
    
    .vertical-detail {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      overflow-y: auto;
    }
    
    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: #00d4ff;
      color: #0a0a2e;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
    
    .vertical-detail > * {
      margin-left: 20px;
      margin-right: 20px;
    }
    
    .vertical-detail h2 {
      color: #00d4ff;
      font-size: 28px;
      margin: 40px 0 15px 0;
    }
    
    .vertical-detail h3 {
      font-size: 16px;
    }
    
    @media (max-width: 768px) {
      .vertical-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 Product Verticals - Industry Solutions</h1>
    <p>Tailored security solutions for your industry</p>
  </div>
  
  <div class="container">
    <h2 style="margin-bottom: 25px; color: #00d4ff;">Select Your Industry</h2>
    <div class="vertical-grid">
      ${verticalCards}
    </div>
  </div>
  
  <div id="detail-modal">
    ${detailsHtml}
  </div>
  
  <script>
    function showVertical(name) {
      const idx = ${JSON.stringify(VERTICALS.map(v => v.name))}.indexOf(name);
      document.querySelectorAll('.vertical-detail').forEach(d => d.style.display = 'none');
      document.getElementById('detail-' + idx).style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
    
    function hideVertical() {
      document.querySelectorAll('.vertical-detail').forEach(d => d.style.display = 'none');
      document.body.style.overflow = 'auto';
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

const VERTICALS_DATA = VERTICALS;
const USE_CASES_DATA = USE_CASES;
