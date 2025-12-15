# 🎯 Attack Patterns Simulator Module - README
## Interactive Framework for Understanding Cyber Attack Chains

**Status**: ✅ Live at `sellersco.net/attack-patterns`
**Module**: `src/attack-patterns-module.js`
**Route Handler**: Exports `handleAttackPatternsRoute()`

---

## 📋 Overview

The Attack Patterns Simulator is a badass, interactive tool that lets security professionals and learners visualize, build, and understand multi-stage cyber attack frameworks using the MITRE ATT&CK methodology.

### Core Features

✅ **5-Phase Attack Matrix** - Interactive clickable interface showing 25 techniques across:
- Recon (reconnaissance techniques)
- Initial Access (exploitation vectors)
- Exploitation (payload execution)
- Infiltration (lateral movement)
- Exfiltration (data theft methods)

✅ **Drag-Drop Chain Builder** - Build attack sequences:
- Drag techniques onto canvas
- Connect them with attack flow arrows
- Real-time risk scoring (CRITICAL/HIGH/MEDIUM/LOW)
- Export attack chain as JSON

✅ **Vendor Solutions Database** - 80+ security vendors with:
- Capabilities (what they detect/prevent)
- Vertical strengths (Healthcare, Finance, etc.)
- Effective against specific attack techniques
- Pricing/positioning

✅ **Safe Sandbox Labs** - Educational environments:
1. **OSINT Lab** - Simulate reconnaissance (DNS, WHOIS, SSL enumeration)
2. **Cloud Misconfig Scanner** - Find exposed S3, open RDS, public Lambda functions
3. **LOLBAS Simulator** - Built-in application abuse (Certutil, PSExec simulation)

✅ **AI Threat Scenario Generation** - Workers AI powered:
- "Generate advanced persistent threat for financial services"
- "Create ransomware attack chain targeting healthcare"
- Real-time scenario generation with mitigation steps

✅ **MITRE ATT&CK Integration** - Every technique links to:
- Official MITRE ATT&CK IDs (T1001, T1592, etc.)
- Descriptions and real-world examples
- Detection methods
- Mitigation strategies

---

## 🗺️ Route Map

### **Primary Routes**

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/attack-patterns` | GET | Interactive matrix UI | Public |
| `/attack-patterns/api/techniques` | GET | Get all 25 techniques | Public |
| `/attack-patterns/api/vendors` | GET | Get 80+ vendor database | Public |
| `/attack-patterns/api/scenarios` | POST | Generate AI threat scenario | Public |
| `/attack-patterns/api/chain/validate` | POST | Validate attack chain | Public |
| `/attack-patterns/api/chain/score` | POST | Score risk of attack chain | Public |

---

## 🎮 Interactive Interface (5 Tabs)

### **Tab 1: Attack Matrix** 
- **Visual**: Grid layout with 5 columns (phases) × 5 rows (categories)
- **Interaction**: Click technique for details
- **Data**: MITRE ATT&CK ID, name, description, detection, examples
- **Color Coding**:
  - 🔴 CRITICAL (APT-grade)
  - 🟠 HIGH (Enterprise targeted)
  - 🟡 MEDIUM (Common)
  - 🟢 LOW (Rare/old techniques)

**Example Techniques**:
```
RECON (T1590-1799):
- T1592: Gather Victim Info
- T1598: Phishing for Info
- T1589: Gather Victim Identity Info

INITIAL ACCESS (T1189-1199):
- T1189: Drive-by Compromise
- T1190: Exploit Public-Facing App
- T1200: Hardware Additions

EXPLOITATION (T1200-1250):
- T1203: Exploitation for Client Execution
- T1212: Exploitation for Privilege Escalation
- T1219: Remote Access Tools

INFILTRATION (T1570-1570):
- T1570: Lateral Tool Transfer
- T1021: Remote Services
- T1550: Use Alternate Auth Material

EXFILTRATION (T1020-1048):
- T1020: Automated Exfiltration
- T1030: Data Transfer Size Limits
- T1048: Exfiltration Over Alternative Protocol
```

### **Tab 2: Chain Builder**
- **Drag-Drop Canvas**: Drag techniques onto workspace
- **Connection Lines**: Show attack flow (phase → phase)
- **Risk Score Panel**: Real-time CVSS-style scoring:
  - Base Score (0-10)
  - Temporal factors (detection likelihood, vendor coverage)
  - Final Risk Rating (CRITICAL/HIGH/MEDIUM/LOW)
- **Export Button**: JSON, PDF, or share link
- **Example Chain**:
  ```
  T1592 (Phishing) → T1189 (Drive-by) → T1203 (Exploit) 
  → T1570 (Lateral Move) → T1048 (Data Exfil)
  RISK SCORE: 9.2 CRITICAL
  VENDORS THAT DETECT: Palo Alto (4/5), Crowdstrike (5/5)
  ```

### **Tab 3: Vendor Database**
- **Searchable Grid**: 80+ vendors with filtering
- **Columns**: Vendor, Detection Capability, Prevention, Verticals, Price Tier
- **Filter By**: Technique, vertical, price, risk score
- **Example Vendors**:
  - Palo Alto Networks (NGFW, IDS, AI)
  - Crowdstrike (EDR, threat intel)
  - Zscaler (SASE)
  - Netskope (Cloud DLP)
  - SentinelOne (XDR)

### **Tab 4: Safe Labs**
- **Lab 1 - OSINT Simulator**:
  - DNS lookup (mock)
  - WHOIS queries (mock)
  - SSL certificate enumeration
  - GitHub dork search (simulated)
  - Output: "Findings" similar to real OSINT
  
- **Lab 2 - Cloud Misconfig Scanner**:
  - Simulate S3 bucket scan (mock results)
  - Check RDS public access (mock)
  - Test Lambda exposure (mock)
  - Verify Secrets Manager rotation
  
- **Lab 3 - LOLBAS Simulator**:
  - Certutil.exe abuse (show commands)
  - PsExec simulation
  - Wmi.exe command gen
  - Wscript.exe payload builder
  - Safe sandbox (no real execution)

### **Tab 5: AI Scenarios**
- **Prompt**: "Generate realistic threat scenario"
- **Inputs**:
  - Vertical (Healthcare, Finance, Manufacturing)
  - Attack objective (Ransomware, IP theft, disrupt)
  - Duration (Quick: 1 day, Persistent: months)
  
- **Output** (AI-generated):
  - Attack chain visualization
  - Timeline (hour by hour)
  - Techniques used (with MITRE IDs)
  - Likely indicators of compromise (IOCs)
  - Defensive recommendations
  - Estimated impact (data loss, downtime, cost)

---

## 🔌 API Endpoints (Programmatic Access)

### **GET `/attack-patterns/api/techniques`**
Returns all 25 techniques with MITRE metadata.

**Response**:
```json
{
  "techniques": [
    {
      "id": "T1592",
      "name": "Gather Victim Information",
      "phase": "recon",
      "description": "Gather information on the target...",
      "severity": "MEDIUM",
      "detection": "Monitor for OSINT tools usage",
      "examples": ["Shodan queries", "DNS enumeration"],
      "mitre_url": "https://attack.mitre.org/techniques/T1592/"
    }
  ]
}
```

### **POST `/attack-patterns/api/chain/validate`**
Validate an attack chain (check if sequences are realistic).

**Request**:
```json
{
  "chain": ["T1592", "T1189", "T1203", "T1570", "T1048"],
  "vertical": "finance"
}
```

**Response**:
```json
{
  "valid": true,
  "plausible": "High - realistic APT chain",
  "warnings": [],
  "score": 8.5,
  "risk": "CRITICAL"
}
```

### **POST `/attack-patterns/api/chain/score`**
Score the risk of an attack chain.

**Request**:
```json
{
  "chain": ["T1592", "T1189", "T1203"],
  "vendor_coverage": ["palo-alto", "crowdstrike"]
}
```

**Response**:
```json
{
  "base_score": 8.2,
  "temporal_score": 0.85,
  "final_score": 9.1,
  "risk": "CRITICAL",
  "vendor_detection_rate": 0.90,
  "recommendations": [
    "Crowdstrike detects all 3 techniques",
    "Add Palo Alto for network-level prevention"
  ]
}
```

### **POST `/attack-patterns/api/scenarios`**
Generate AI threat scenario.

**Request**:
```json
{
  "vertical": "healthcare",
  "objective": "ransomware",
  "duration": "persistent"
}
```

**Response**:
```json
{
  "scenario": {
    "name": "Conti-style Healthcare Ransomware Campaign",
    "description": "...",
    "techniques": ["T1592", "T1189", "T1203", ...],
    "timeline": [
      "Day 1: Phishing email sent to nurses",
      "Day 2: Malware downloaded",
      ...
    ],
    "iocs": ["IP:1.2.3.4", "Domain:evil.com"],
    "mitigation": [...]
  }
}
```

---

## 📊 Data Structure (Internal)

### **Techniques Database**
```javascript
const TECHNIQUES = [
  {
    id: 'T1592',
    name: 'Gather Victim Information',
    phase: 'recon',
    severity: 'MEDIUM',
    detectionDifficulty: 'HIGH', // Easy to execute, hard to detect
    vendors: ['palo-alto', 'crowdstrike'],
    verticals: ['all'],
    description: '...',
    examples: ['Shodan', 'DNS queries', 'WHOIS lookups'],
    mitre_url: 'https://attack.mitre.org/...',
    tactics: ['Reconnaissance'],
  },
  // ... 24 more
];
```

### **Vendors Database**
```javascript
const VENDORS = {
  'palo-alto': {
    name: 'Palo Alto Networks',
    detections: ['T1592', 'T1189', 'T1203', ...],
    preventions: ['T1203', 'T1570', ...],
    verticals: ['finance', 'healthcare', 'government'],
    strength: 'Network-level detection',
    pricing: 'Enterprise',
  },
  // ... 79 more
};
```

---

## 🎓 Learning Outcomes

After using this module, users will understand:

✅ **MITRE ATT&CK Framework** - Real-world attack techniques
✅ **Attack Chains** - How techniques combine for multi-stage attacks
✅ **Risk Scoring** - CVSS-based vulnerability assessment
✅ **Vendor Positioning** - What solutions detect which attacks
✅ **Defensive Strategy** - Layered defense with complementary tools
✅ **OSINT Techniques** - Reconnaissance methods
✅ **Cloud Misconfigurations** - Real cloud security risks
✅ **Living-off-the-land** - Abuse of built-in Windows/Linux tools

---

## 🔐 Security Considerations

✅ **Safe Sandbox**: All labs are simulated, NO actual code execution
✅ **Read-Only Demos**: No real systems touched
✅ **Rate Limiting**: API endpoints rate-limited to prevent abuse
✅ **No Data Exfil**: Scenarios are educational only
✅ **Ethical Use**: Module intended for authorized security training

---

## 🧪 Testing Checklist

- [ ] Click each of 25 techniques in matrix - verify details load
- [ ] Drag 3 techniques onto chain builder - verify connections
- [ ] Export chain as JSON - verify format
- [ ] Run vendor filter - verify results
- [ ] Generate 5 AI scenarios - verify diversity
- [ ] Validate unrealistic chain (e.g., exfil before access) - verify rejection
- [ ] Score different chains - verify scoring logic
- [ ] Test each lab (OSINT, Cloud, LOLBAS) - verify outputs
- [ ] Test on mobile - verify responsive layout
- [ ] Test performance with 80 vendors loaded - verify < 2s load time

---

## 📈 Future Enhancements

- [ ] 3D attack chain visualization (Three.js)
- [ ] User-submitted attack chains with community voting
- [ ] Real-time threat feed integration (CVE-based chains)
- [ ] Leaderboard: "Hardest Attack Chain to Defend"
- [ ] Integration with threat modeling tools (OWASP Threat Dragon export)
- [ ] Mobile-specific "Quick Lab" cards
- [ ] Multi-player challenge mode (co-op defense)
- [ ] Export to Sigma rules / SIEM queries

---

## 🚀 Deployment

**Route in index.js**:
```javascript
if (url.pathname === '/attack-patterns' || url.pathname.startsWith('/attack-patterns/')) {
  return handleAttackPatternsRoute(url.pathname, request, env, ctx);
}
```

**Dependencies**: None (Workers AI optional for scenarios)
**Data Size**: ~500KB (techniques + vendors)
**Worker Limit**: Well under 1MB limit
**Status**: ✅ Ready for production

---

## 🎯 Call-to-Action

**Try it now**: Visit `sellersco.net/attack-patterns`

**Share it**: Perfect for:
- Security team training
- Customer proof-of-concept
- Conference demos
- Sales engineering materials

---

## 💬 Questions?

See `SELLERSCO-INTEGRATION-MASTER.md` for module architecture and how to extend.
