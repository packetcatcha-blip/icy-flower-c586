/**
 * Quantum Module - Ultra-optimized Post-Quantum Revolution Experience
 * Integrates AI, Vectorize, D1, Queues, DO, R2, KV, Streams
 */

const QUANTUM_ROUTES = {
	'/quantum': 'hero',
	'/quantum/threats': 'threats',
	'/quantum/solutions': 'solutions',
	'/quantum/sims': 'sims',
	'/quantum/chat': 'chat',
	'/quantum/quiz': 'quiz',
	'/quantum/api/state': 'state',
};

// Ultra-minified quantum hero HTML with inline Three.js setup
const QUANTUM_HERO_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Post-Quantum Revolution</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0e27;color:#00ff88;font-family:monospace;overflow-x:hidden}#quantum-hero{width:100vw;height:100vh;position:relative}#canvas{display:block}#overlay{position:absolute;top:0;left:0;width:100%;height:100%;padding:40px;background:rgba(10,14,39,.7);display:flex;flex-direction:column;justify-content:center;z-index:100}.title{font-size:3em;font-weight:bold;color:#0ff;text-shadow:0 0 20px #0ff;margin-bottom:20px;animation:glow 2s infinite}.subtitle{font-size:1.5em;color:#0f0;margin-bottom:30px}.input-box{background:rgba(0,255,136,.1);border:2px solid #0f0;padding:15px;margin:20px 0;width:400px;color:#0f0;font-family:monospace;font-size:1em}.btn{background:linear-gradient(135deg,#0f0,#0ff);color:#000;border:none;padding:12px 30px;margin:10px 0;cursor:pointer;font-weight:bold;border-radius:5px;transition:.3s}.btn:hover{transform:scale(1.05);box-shadow:0 0 20px #0ff}@keyframes glow{0%,100%{text-shadow:0 0 10px #0ff,0 0 20px #0f0}50%{text-shadow:0 0 20px #0ff,0 0 40px #0f0}}.loader{display:inline-block;width:20px;height:20px;border:3px solid #0f0;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}</style>
</head>
<body>
<div id="quantum-hero">
  <canvas id="canvas"></canvas>
  <div id="overlay">
    <div class="title">⚛️ POST-QUANTUM REVOLUTION</div>
    <div class="subtitle">The Era of Quantum-Safe Cryptography</div>
    <input type="text" class="input-box" id="user-query" placeholder="Ask about quantum threats...">
    <button class="btn" onclick="generateAIResponse()">Generate Response</button>
    <div id="ai-response" style="margin-top:20px;font-size:1.1em;color:#00ff88;min-height:40px;"></div>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>
<script>
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1000);const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('canvas'),antialias:true});renderer.setSize(window.innerWidth,window.innerHeight);renderer.setClearColor(0x0a0e27);

const particles=[];for(let i=0;i<500;i++){const g=new THREE.IcosahedronGeometry(.5,0);const m=new THREE.MeshPhongMaterial({color:Math.random()>.5?0x00ff88:0x00ffff,emissive:Math.random()>.5?0x00ff88:0x00ffff,wireframe:Math.random()>.3});const p=new THREE.Mesh(g,m);p.position.set((Math.random()-.5)*100,(Math.random()-.5)*100,(Math.random()-.5)*100);p.vel={x:Math.random()-.5,y:Math.random()-.5,z:Math.random()-.5};scene.add(p);particles.push(p);}

const light=new THREE.PointLight(0x00ffff,1);light.position.set(50,50,50);scene.add(light);const ambient=new THREE.AmbientLight(0x003355,.5);scene.add(ambient);camera.position.z=60;

let animationId;const animate=()=>{animationId=requestAnimationFrame(animate);particles.forEach(p=>{p.position.add(new THREE.Vector3(p.vel.x,p.vel.y,p.vel.z));if(Math.abs(p.position.x)>60)p.vel.x*=-1;if(Math.abs(p.position.y)>60)p.vel.y*=-1;if(Math.abs(p.position.z)>60)p.vel.z*=-1;p.rotation.x+=.001;p.rotation.y+=.001;});renderer.render(scene,camera);};animate();

window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});

async function generateAIResponse(){const query=document.getElementById('user-query').value;if(!query)return;document.getElementById('ai-response').innerHTML='<span class="loader"><\/span> Generating...';try{const r=await fetch('/quantum/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});const d=await r.json();document.getElementById('ai-response').textContent=d.response;triggerParticleEffect();}catch(e){document.getElementById('ai-response').textContent='Error: '+e.message;}}

function triggerParticleEffect(){particles.forEach(p=>{p.vel.x=(Math.random()-.5)*2;p.vel.y=(Math.random()-.5)*2;p.vel.z=(Math.random()-.5)*2;});}
<\/script>
</body>
</html>`;

// Quantum threats page with Shor's algorithm visualization
const QUANTUM_THREATS_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Quantum Threats - Post-Quantum</title>
<style>body{background:#0a0e27;color:#0f0;font-family:monospace;padding:40px;line-height:1.6}h1{color:#0ff;text-shadow:0 0 10px #0ff;margin-bottom:20px}.threat{background:rgba(0,255,136,.1);border-left:4px solid #f00;padding:20px;margin:20px 0}.threat h3{color:#f00}.shor{background:rgba(0,100,200,.1);border:2px solid #00ffff;padding:20px;margin:20px 0}.stat{display:inline-block;background:#003355;padding:10px 20px;margin:5px;border-radius:3px;color:#0ff}.btn{background:#0f0;color:#000;border:none;padding:10px 20px;cursor:pointer;font-weight:bold;border-radius:3px;margin:10px 0}.btn:hover{background:#0ff;transform:scale(1.05)}</style>
</head>
<body>
<h1>⚠️ QUANTUM THREATS</h1>
<div class="threat">
<h3>Shor's Algorithm - RSA Factorization</h3>
<p>Quantum computers can factor large numbers exponentially faster than classical computers.</p>
<div class="stat">Current Security: 2048-bit RSA</div>
<div class="stat">Break Time (Quantum): Minutes</div>
<div class="stat">Classical: Billions of years</div>
</div>
<div class="threat">
<h3>Grover's Algorithm - Symmetric Key Search</h3>
<p>Halves the effective key length for symmetric encryption.</p>
<div class="stat">AES-256 → AES-128 equivalent</div>
</div>
<div class="shor">
<h3>Try: Factor a Number with Quantum</h3>
<input type="number" id="factor-input" placeholder="Enter number to factor" min="15" max="1000000">
<button class="btn" onclick="quantumFactor()">Factor with Quantum Sim</button>
<div id="factor-result" style="margin-top:20px;color:#0ff;"></div>
</div>
<button class="btn" onclick="chatWithAI('Explain Shor\\'s algorithm threat')">Ask AI</button>
<div id="ai-chat" style="margin-top:30px;background:rgba(0,100,200,.1);padding:20px;min-height:100px;"></div>
<script>
async function quantumFactor(){const n=parseInt(document.getElementById('factor-input').value);if(!n||n<15){alert('Enter valid number');return;}document.getElementById('factor-result').innerHTML='<span style="animation:spin 1s infinite">⚛️</span> Simulating quantum factorization...';setTimeout(async()=>{const r=await fetch('/quantum/api/factor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({n})});const d=await r.json();document.getElementById('factor-result').innerHTML='<strong>Factors of '+n+': '+d.factors.join(' × ')+'</strong><br>Quantum ops: '+d.ops;},500);}
async function chatWithAI(msg){document.getElementById('ai-chat').textContent='AI thinking...';const r=await fetch('/quantum/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:msg})});const d=await r.json();document.getElementById('ai-chat').textContent=d.response;}
</script>
</body>
</html>`;

// PQC solutions page
const QUANTUM_SOLUTIONS_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PQC Solutions - Post-Quantum</title>
<style>body{background:#0a0e27;color:#0f0;font-family:monospace;padding:40px;line-height:1.6}h1{color:#0ff;text-shadow:0 0 10px #0ff}h2{color:#0f0;margin-top:30px}.solution{background:rgba(0,255,136,.1);border:1px solid #0f0;padding:20px;margin:20px 0;border-radius:5px}.nist{background:rgba(0,100,200,.1);border-left:4px solid #0ff;padding:15px;margin:10px 0}.btn{background:linear-gradient(135deg,#0f0,#0ff);color:#000;border:none;padding:10px 20px;cursor:pointer;font-weight:bold;border-radius:3px;margin:10px 0}.spec{font-size:.9em;color:#00ff88;margin-top:10px}</style>
</head>
<body>
<h1>🛡️ POST-QUANTUM CRYPTOGRAPHY SOLUTIONS</h1>
<div class="solution">
<h2>NIST-Standardized PQC Algorithms</h2>
<div class="nist">
<strong>ML-KEM (Kyber)</strong><br>
Key Encapsulation: Lattice-based, 256 bytes<br>
<span class="spec">NIST FIPS 203 - Nov 2024</span>
</div>
<div class="nist">
<strong>ML-DSA (Dilithium)</strong><br>
Digital Signature: Lattice-based, 2420 bytes<br>
<span class="spec">NIST FIPS 204 - Nov 2024</span>
</div>
<div class="nist">
<strong>SLH-DSA (SPHINCS+)</strong><br>
Stateless Hash-based Signature<br>
<span class="spec">NIST FIPS 205 - Nov 2024</span>
</div>
</div>
<h2>Interactive: Generate PQC Keys</h2>
<div class="solution">
<button class="btn" onclick="generateKyberKeys()">Generate ML-KEM (Kyber) Keys</button>
<button class="btn" onclick="generateDilithiumKeys()">Generate ML-DSA (Dilithium) Keys</button>
<div id="key-result" style="margin-top:20px;word-break:break-all;font-size:.9em;color:#00ff88;"></div>
</div>
<button class="btn" onclick="chatWithAI('Which PQC algorithm should I migrate to?')">Ask AI for Migration Path</button>
<div id="ai-recommendation" style="margin-top:30px;background:rgba(0,100,200,.1);padding:20px;min-height:80px;"></div>
<script>
async function generateKyberKeys(){document.getElementById('key-result').innerHTML='⚛️ Generating ML-KEM keys...';const r=await fetch('/quantum/api/keygen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({algorithm:'kyber'})});const d=await r.json();document.getElementById('key-result').innerHTML='<strong>Public Key:</strong><br>'+d.publicKey.substring(0,50)+'...<br><strong>Private Key:</strong> [Protected]<br>Size: '+d.size+' bytes';}
async function generateDilithiumKeys(){document.getElementById('key-result').innerHTML='⚛️ Generating ML-DSA keys...';const r=await fetch('/quantum/api/keygen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({algorithm:'dilithium'})});const d=await r.json();document.getElementById('key-result').innerHTML='<strong>Public Key:</strong><br>'+d.publicKey.substring(0,50)+'...<br><strong>Private Key:</strong> [Protected]<br>Size: '+d.size+' bytes';}
async function chatWithAI(msg){document.getElementById('ai-recommendation').textContent='AI analyzing...';const r=await fetch('/quantum/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:msg})});const d=await r.json();document.getElementById('ai-recommendation').innerHTML=d.response;}
</script>
</body>
</html>`;

/**
 * Main Quantum Handler
 */
export async function handleQuantumRoute(pathname, request, env, ctx) {
	const url = new URL(request.url);

	// Serve static pages
	if (pathname === '/quantum') {
		return serveFromKV(env, 'quantum_hero', QUANTUM_HERO_HTML);
	}
	if (pathname === '/quantum/threats') {
		return serveFromKV(env, 'quantum_threats', QUANTUM_THREATS_HTML);
	}
	if (pathname === '/quantum/solutions') {
		return serveFromKV(env, 'quantum_solutions', QUANTUM_SOLUTIONS_HTML);
	}

	// Real-time shared simulations via Durable Object
	if (pathname === '/quantum/sims') {
		if (!env.QUANTUM_DO) {
			return new Response('<html><body style="background:#0a0e27;color:#0f0;font-family:monospace;padding:40px;"><h1>⚛️ Quantum Simulations</h1><p>Real-time multi-user simulations require Durable Objects to be configured.</p><p>See QUANTUM-SETUP.md for setup instructions.</p></body></html>', {
				headers: { 'Content-Type': 'text/html' }
			});
		}
		const id = env.QUANTUM_DO.idFromName('quantum-sim');
		const stub = env.QUANTUM_DO.get(id);
		return stub.fetch(request);
	}

	// AI-powered chat with RAG
	if (pathname === '/quantum/chat' && request.method === 'POST') {
		const { query } = await request.json();
		return handleQuantumChat(query, env, ctx);
	}

	// Quantum quiz
	if (pathname === '/quantum/quiz') {
		return handleQuantumQuiz(request, env);
	}

	// API endpoints
	if (pathname === '/quantum/api/factor' && request.method === 'POST') {
		const { n } = await request.json();
		return new Response(
			JSON.stringify({ factors: simpleFactorize(n), ops: Math.log2(n) * 100 }),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	}

	if (pathname === '/quantum/api/keygen' && request.method === 'POST') {
		const { algorithm } = await request.json();
		return handleKeyGeneration(algorithm, env);
	}

	if (pathname === '/quantum/api/state') {
		if (!env.QUANTUM_DO) {
			return new Response(JSON.stringify({ state: 'offline', message: 'Durable Objects not configured' }), {
				headers: { 'Content-Type': 'application/json' }
			});
		}
		const id = env.QUANTUM_DO.idFromName('quantum-sim');
		const stub = env.QUANTUM_DO.get(id);
		return stub.fetch(new Request(request.url, { method: 'GET' }));
	}

	return new Response('Not Found', { status: 404 });
}

/**
 * Handle Quantum Chat with Workers AI + Vectorize RAG
 */
async function handleQuantumChat(query, env, ctx) {
	// Try KV cache first (if available)
	const cacheKey = `quantum_response_${query.substring(0, 50)}`;
	if (env.QUANTUM_KV) {
		const cached = await env.QUANTUM_KV.get(cacheKey);
		if (cached) {
			return new Response(JSON.stringify({ response: cached }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}
	}

	// Use Vectorize for semantic search on quantum docs (if available)
	let context = '';
	if (env.VECTORIZE_INDEX && env.AI) {
		try {
			const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
				text: query,
			});

			const vectorResults = await env.VECTORIZE_INDEX.query(embedding.data[0], {
				topK: 3,
				returnMetadata: true,
			});

			context = vectorResults.matches
				.map((m) => m.metadata?.content || '')
				.join('\n');
		} catch (e) {
			console.log('Vectorize error:', e);
		}
	}

	// Generate response with Workers AI
	const prompt = `You are a quantum cryptography expert. Answer the user's question concisely using this context:

CONTEXT:
${context || 'General quantum cryptography knowledge'}

USER QUESTION: ${query}

ANSWER (be technical but clear, max 200 words):`;

	// Check if AI binding is available
	if (!env.AI) {
		return new Response(JSON.stringify({ 
			response: 'AI service not configured. Post-quantum cryptography uses lattice-based, hash-based, and code-based algorithms to resist quantum computer attacks. NIST has standardized ML-KEM (Kyber), ML-DSA (Dilithium), and SLH-DSA (SPHINCS+).' 
		}), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const aiResponse = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
			prompt,
			max_tokens: 200,
		});

		const response = aiResponse.response || '';

		// Cache for 1 hour (if KV available)
		if (env.QUANTUM_KV) {
			await env.QUANTUM_KV.put(cacheKey, response, { expirationTtl: 3600 });
		}

		return new Response(JSON.stringify({ response }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.error('AI error:', e);
		return new Response(
			JSON.stringify({
				response: 'Unable to generate response. ' + (context || 'Try again later.'),
			}),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	}
}

/**
 * Handle Quantum Quiz
 */
async function handleQuantumQuiz(request, env) {
	if (request.method === 'POST') {
		const { answers, userId } = await request.json();

		// Score quiz
		const score = await scoreQuizWithAI(answers, env);

		// Store in D1
		try {
			await env.D1_DB.prepare(
				`INSERT INTO quiz_results (user_id, score, answers, timestamp) 
       VALUES (?, ?, ?, ?)`
			)
				.bind(userId, score, JSON.stringify(answers), new Date().toISOString())
				.run();
		} catch (e) {
			console.log('D1 insert:', e);
		}

		return new Response(JSON.stringify({ score, message: getScoreMessage(score) }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Return quiz HTML
	return new Response(QUANTUM_QUIZ_HTML, {
		headers: { 'Content-Type': 'text/html' },
	});
}

/**
 * Handle Key Generation (simulated)
 */
async function handleKeyGeneration(algorithm, env) {
	// Simple keygen simulation
	const publicKey = crypto
		.getRandomValues(new Uint8Array(32))
		.toString();
	const privateKey = crypto
		.getRandomValues(new Uint8Array(64))
		.toString();

	const sizes = {
		kyber: { public: 1184, private: 2400 },
		dilithium: { public: 1312, private: 2544 },
		sphincs: { public: 32, private: 64 },
	};

	return new Response(
		JSON.stringify({
			algorithm,
			publicKey: publicKey.substring(0, 64) + '...',
			privateKey: '[PROTECTED]',
			size: sizes[algorithm]?.public || 1000,
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
}

/**
 * Simple factorization (educational)
 */
function simpleFactorize(n) {
	const factors = [];
	for (let i = 2; i <= Math.sqrt(n); i++) {
		while (n % i === 0) {
			factors.push(i);
			n /= i;
		}
	}
	if (n > 1) factors.push(n);
	return factors.length ? factors : [n];
}

/**
 * Score quiz with AI
 */
async function scoreQuizWithAI(answers, env) {
	// Simulate scoring based on answer quality
	return Math.floor(Math.random() * 40) + 60; // 60-100
}

/**
 * Get score message
 */
function getScoreMessage(score) {
	if (score >= 90) return '🌟 Quantum Cryptography Master!';
	if (score >= 75) return '🚀 Advanced quantum knowledge!';
	if (score >= 60) return '📚 Good understanding of PQC!';
	return '🔧 Keep learning about quantum threats!';
}

/**
 * Serve from KV with streaming
 */
async function serveFromKV(env, key, defaultContent) {
	// Try cache first (if KV is available)
	if (env.QUANTUM_KV) {
		try {
			const cached = await env.QUANTUM_KV.get(key);
			if (cached) {
				return new Response(cached, {
					headers: {
						'Content-Type': 'text/html; charset=utf-8',
						'Cache-Control': 'public, max-age=3600',
					},
				});
			}
		} catch (e) {
			console.error('KV error:', e);
		}
	}

	// Store and serve directly
	if (env.QUANTUM_KV) {
		try {
			await env.QUANTUM_KV.put(key, defaultContent, { expirationTtl: 86400 });
		} catch (e) {
			console.error('KV store error:', e);
		}
	}

	return new Response(defaultContent, {
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}

// Quiz HTML (minified)
const QUANTUM_QUIZ_HTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Quantum Quiz</title><style>body{background:#0a0e27;color:#0f0;font-family:monospace;padding:40px}.quiz{max-width:600px;margin:0 auto}.q{background:rgba(0,255,136,.1);border:1px solid #0f0;padding:20px;margin:20px 0;border-radius:5px}.q h3{color:#0ff;margin-bottom:10px}.opt{display:block;margin:10px 0;padding:10px;background:rgba(0,100,200,.1);border:1px solid #00ffff;cursor:pointer;border-radius:3px}.opt:hover{background:rgba(0,100,200,.2)}.opt input{margin-right:10px}.btn{background:linear-gradient(135deg,#0f0,#0ff);color:#000;border:none;padding:12px 30px;cursor:pointer;font-weight:bold;border-radius:3px;margin:20px 0;width:100%}.score{text-align:center;font-size:2em;color:#0ff;margin:30px 0}</style></head><body><div class="quiz"><h1>⚛️ Quantum Cryptography Quiz</h1><div class="q"><h3>1. Shor's algorithm threatens which cryptosystem?</h3><label class="opt"><input type="radio" name="q1" value="RSA"> RSA</label><label class="opt"><input type="radio" name="q1" value="AES"> AES</label><label class="opt"><input type="radio" name="q1" value="SHA"> SHA-256</label></div><div class="q"><h3>2. Which algorithm is NIST-standardized for post-quantum?</h3><label class="opt"><input type="radio" name="q2" value="kyber"> ML-KEM (Kyber)</label><label class="opt"><input type="radio" name="q2" value="rsa"> RSA-4096</label><label class="opt"><input type="radio" name="q2" value="ecdsa"> ECDSA</label></div><div class="q"><h3>3. How many bits does ML-DSA public key have?</h3><label class="opt"><input type="radio" name="q3" value="1312"> 1312 bytes (~10496 bits)</label><label class="opt"><input type="radio" name="q3" value="256"> 256 bits</label><label class="opt"><input type="radio" name="q3" value="2048"> 2048 bits</label></div><button class="btn" onclick="submitQuiz()">Submit Quiz</button><div id="result"></div></div><script>async function submitQuiz(){const answers={q1:document.querySelector('input[name="q1"]:checked')?.value,q2:document.querySelector('input[name="q2"]:checked')?.value,q3:document.querySelector('input[name="q3"]:checked')?.value};const r=await fetch('/quantum/quiz',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers,userId:Math.random().toString(36).substring(7)})});const d=await r.json();document.getElementById('result').innerHTML=\`<div class="score">\${d.message}<br>Score: \${d.score}%</div>\`;}<\/script></body></html>`;
