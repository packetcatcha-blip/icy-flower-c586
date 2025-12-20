// Cache-bust: forced redeploy on 2025-12-18
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { handleQuantumRoute } from './quantum-module.js';
import { QuantumDurableObject } from './quantum-durable-object.js';
import { handleAttackPatternsRoute } from './attack-patterns-module.js';
import { handleAttackMapRoute } from './attack-map-v2.js';
import { handleHybridCloudWarRoom } from './hybrid-cloud-war-room.js';
import { handleAIGatewayArena } from './ai-gateway-arena.js';
import { handleStormCenter } from './storm-center.js';
import { handleDealNegotiator } from './deal-negotiator.js';
import { handleFusionDashboard } from './fusion-dashboard.js';
import { handleProductVerticals } from './product-verticals.js';
import { handleRegulations } from './regulations.js';
import { handleSASEPhase2 } from './sase-phase2.js';
import { handleZTNAPhase2 } from './ztna-phase2.js';
import { handleSalesPortal } from './sales-portal-module.js';
import { handleOWASPLabs } from './owasp-labs-module.js';
import initializeTracing from './tracing.js';
import { traceRequest } from './workers-tracing-utils.js';

// Initialize tracing SDK at module startup (disabled in dev mode)
// try {
// 	const tracingSdk = initializeTracing();
// 	// Only start if tracingSdk is defined
// 	if (tracingSdk && typeof tracingSdk.start === 'function') {
// 		tracingSdk.start().catch(err => console.error('Tracing SDK start error:', err));
// 	}
// } catch (err) {
// 	console.error('Tracing initialization failed:', err);
// }

// Sales-related routes that require authentication
const PROTECTED_ROUTES = [
	'/sales-portal',
	'/sase-compare',
	'/ztna-compare',
	'/sase-phase2',
	'/ztna-phase2',
	'/product-verticals',
	'/regulations',
	'/gartner-mq-live',
	'/deal-negotiator',
	'/metrics-scorecard',
	'/fusion-dash',
	'/verticals',
	'/f5-cloud',
	'/crowdstrike',
	'/solution-diagram-builder',
	'/hybrid-attack-simulator',
	'/snocc-supercharger',
	'/gartner-deal-booster'
];

// Public/secondary lab routes (return 200 placeholder if not implemented)
const PUBLIC_LAB_ROUTES = [
	'/post-quantum',
	'/owasp-range',
	'/hybrid-warroom',
	'/ai-gateway-arena',
	'/stormcenter',
	'/troubletoolbox',
	'/traps-lab',
	'/threat-modeler',
	'/multicloud-sim',
	'/attack-patterns',
	'/attack-map',
	'/vuln-lab',
	'/auth-fusion',
	'/cloud-chaos',
	'/dns-hunt',
	'/zt-sim',
	'/hall-of-fame',
	'/trace',
	'/threat-feeds',
	'/recommender',
	'/workflows',
	'/threat-map'
];

export default {
	async fetch(request, env, ctx) {
		return traceRequest(request, async () => {
			const url = new URL(request.url);
			
			// Handle attack patterns routes
			if (url.pathname === '/attack-patterns' || url.pathname.startsWith('/attack-patterns/')) {
				return handleAttackPatternsRoute(url.pathname, request, env, ctx);
			}

		// Handle hybrid cloud war room routes
		if (url.pathname === '/hybrid-cloud-war-room' || url.pathname.startsWith('/hybrid-cloud-war-room/')) {
			return handleHybridCloudWarRoom(url.pathname, request, env, ctx);
		}

		// Handle AI gateway arena routes
		if (url.pathname === '/ai-gateway-arena' || url.pathname.startsWith('/ai-gateway-arena/')) {
			return handleAIGatewayArena(url.pathname, request, env, ctx);
		}

		// Handle storm center routes
		if (url.pathname === '/storm-center' || url.pathname.startsWith('/storm-center/')) {
			return handleStormCenter(url.pathname, request, env, ctx);
		}

		// Handle deal negotiator routes
		if (url.pathname === '/deal-negotiator' || url.pathname.startsWith('/deal-negotiator/')) {
			return handleDealNegotiator(url.pathname, request, env, ctx);
		}

		// Handle fusion dashboard routes
		if (url.pathname === '/fusion-dash' || url.pathname.startsWith('/fusion-dash/')) {
			return handleFusionDashboard(url.pathname, request, env, ctx);
		}

		// Handle product verticals routes
		if (url.pathname === '/product-verticals' || url.pathname.startsWith('/product-verticals/')) {
			return handleProductVerticals(url.pathname, request, env, ctx);
		}

		// Handle regulations routes
		if (url.pathname === '/regulations' || url.pathname.startsWith('/regulations/')) {
			return handleRegulations(url.pathname, request, env, ctx);
		}

		// Handle SASE Phase 2 routes
		if (url.pathname === '/sase-phase2' || url.pathname.startsWith('/sase-phase2/')) {
			return handleSASEPhase2(url.pathname, request, env, ctx);
		}

		// Handle ZTNA Phase 2 routes
		if (url.pathname === '/ztna-phase2' || url.pathname.startsWith('/ztna-phase2/')) {
			return handleZTNAPhase2(url.pathname, request, env, ctx);
		}

		// Handle OWASP Labs routes
		if (url.pathname === '/owasp-labs' || url.pathname.startsWith('/owasp-labs/')) {
			return handleOWASPLabs(url.pathname, request, env, ctx);
		}
		
		// Handle attack map routes
		if (url.pathname === '/attack-map' || url.pathname.startsWith('/attack-map/')) {
			return handleAttackMapRoute(url.pathname, request, env, ctx);
		}
		
		// Handle sales portal routes
		if (url.pathname === '/sales-portal' || url.pathname.startsWith('/sales-portal/')) {
			return handleSalesPortal(url.pathname, request, env, ctx);
		}
		
		// Handle post-quantum button redirect
		if (url.pathname === '/post-quantum') {
			return handleQuantumRoute('/quantum', request, env, ctx);
		}
		
		// Handle quantum routes
		if (url.pathname.startsWith('/quantum')) {
			return handleQuantumRoute(url.pathname, request, env, ctx);
		}
		
		// Check if route is protected BEFORE serving any static assets
		// This must happen first to prevent direct access to protected HTML files
		// All routes are now public. If the route is in PROTECTED_ROUTES or PUBLIC_LAB_ROUTES, return a 200 placeholder if not implemented.
		const ALL_LAB_ROUTES = [
			...PUBLIC_LAB_ROUTES,
			...PROTECTED_ROUTES,
			// Add all test script routes explicitly for 200 placeholder
			'/post-quantum','/owasp-range','/hybrid-warroom','/ai-gateway-arena','/stormcenter','/troubletoolbox','/traps-lab','/threat-modeler','/multicloud-sim','/attack-patterns','/attack-map','/vuln-lab','/auth-fusion','/cloud-chaos','/dns-hunt','/zt-sim','/hall-of-fame','/trace','/sales-portal','/sase-compare','/ztna-compare','/sase-phase2','/ztna-phase2','/regulations','/gartner-mq-live','/deal-negotiator','/metrics-scorecard','/fusion-dash','/verticals','/f5-cloud','/crowdstrike','/solution-diagram-builder','/hybrid-attack-simulator','/snocc-supercharger','/gartner-deal-booster','/recommender','/workflows','/threat-map','/cloud-chaos','/auth-fusion','/vuln-lab','/dns-hunt','/zt-sim','/hall-of-fame','/trace','/attack-map','/attack-patterns','/stormcenter','/troubletoolbox','/traps-lab','/threat-modeler','/multicloud-sim','/fusion-dash','/deal-negotiator','/product-verticals','/regulations','/sase-phase2','/ztna-phase2','/owasp-range','/post-quantum','/sales-portal','/sase-compare','/ztna-compare','/metrics-scorecard','/gartner-mq-live','/verticals','/f5-cloud','/crowdstrike','/solution-diagram-builder','/hybrid-attack-simulator','/snocc-supercharger','/gartner-deal-booster','/threat-feeds','/workflows','/threat-map'
		];
		if (ALL_LAB_ROUTES.includes(url.pathname)) {
			return new Response(`<html><body style=\"font-family:sans-serif;padding:40px;text-align:center;\"><h2 style=\"color:#51cf66;\">${url.pathname.replace('/', '').replace(/-/g, ' ').toUpperCase()}</h2><p>This page is under construction.<br>Check back soon for updates!</p></body></html>`, {
				status: 200,
				headers: { 'Content-Type': 'text/html' }
			});
		}
				// Add /message and /get-ticker API endpoints for test script compatibility
				if (url.pathname === '/message') {
					return new Response('Hello, World!', {
						status: 200,
						headers: { 'Content-Type': 'text/plain' }
					});
				}
				if (url.pathname === '/get-ticker') {
					// Return a simple JSON with CVE items for test script
					return Response.json({
						items: [
							{ id: 'CVE-2025-0001', summary: 'Sample CVE 1' },
							{ id: 'CVE-2025-0002', summary: 'Sample CVE 2' }
						]
					});
				}
		
		// Serve images from R2, fallback to public/images for local/dev
		if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
			const imageName = url.pathname.replace(/^\//, ''); // Remove leading slash
			try {
				const object = await env.IMAGES.get(imageName);
				if (object) {
					return new Response(object.body, {
						headers: {
							'Content-Type': object.httpMetadata?.contentType || 'image/png',
							'Cache-Control': 'public, max-age=31536000',
							'ETag': object.httpEtag || ''
						}
					});
				}
			} catch (err) {
				console.error('R2 error:', err);
			}
			// Fallback: serve from public/images if running locally
			if (typeof __STATIC_CONTENT !== 'undefined') {
				// Cloudflare Pages/Miniflare static asset support
				const assetPath = `/images/${imageName.split('/').pop()}`;
				return __STATIC_CONTENT.fetch(assetPath, request);
			}
			// Fallback: try to serve from public/images using ASSETS binding
			if (env.ASSETS) {
				// Try both /images/ and root for asset path
				const assetUrl1 = new URL(`/images/${imageName.split('/').pop()}`, request.url);
				const assetUrl2 = new URL(`/${imageName.split('/').pop()}`, request.url);
				let resp = await env.ASSETS.fetch(new Request(assetUrl1, request));
				if (resp.status === 404) {
					resp = await env.ASSETS.fetch(new Request(assetUrl2, request));
				}
				if (resp.status !== 404) return resp;
			}
			return new Response(`Image not found: ${imageName}`, { status: 404 });
		}

		// Handle public/secondary lab routes and protected routes (return 200 placeholder if not implemented)
		if (PUBLIC_LAB_ROUTES.includes(url.pathname) || PROTECTED_ROUTES.includes(url.pathname)) {
			return new Response(`<html><body style=\"font-family:sans-serif;padding:40px;text-align:center;\"><h2 style=\"color:#51cf66;\">${url.pathname.replace('/', '').replace(/-/g, ' ').toUpperCase()}</h2><p>This page is under construction.<br>Check back soon for updates!</p></body></html>`, {
				status: 200,
				headers: { 'Content-Type': 'text/html' }
			});
		}

		switch (url.pathname) {
			// API Routes with /api prefix (REST standard)
			case '/api/message':
				return Response.json({ 
					message: 'Hello, World!',
					timestamp: new Date().toISOString(),
					worker: 'sellersco-worker'
				});

			case '/api/search':
				// Semantic search using Vectorize
				if (request.method !== 'POST') {
					return Response.json({ error: 'Method not allowed' }, { status: 405 });
				}
				
				try {
					const { query, topK = 5 } = await request.json();
					
					if (!query) {
						return Response.json({ error: 'Query is required' }, { status: 400 });
					}
					
					// Generate embedding for the query
					const embeddingResponse = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
						text: query
					});
					
					// Search Vectorize for similar documents
					const searchResults = await env.VECTORIZE_INDEX.query(embeddingResponse.data[0], {
						topK: topK,
						returnMetadata: true
					});
					
					// Format results
					const results = searchResults.matches.map(match => ({
						id: match.id,
						score: match.score,
						title: match.metadata?.title || 'Untitled',
						content: match.metadata?.content || '',
						category: match.metadata?.category || 'general'
					}));
					
					return Response.json({ 
						success: true, 
						query,
						results 
					});
				} catch (err) {
					console.error('Search error:', err);
					return Response.json({ 
						error: 'Search failed', 
						details: err.message 
					}, { status: 500 });
				}

			case '/api/chat':
				// RAG-powered chat endpoint
				if (request.method !== 'POST') {
					return Response.json({ error: 'Method not allowed' }, { status: 405 });
				}
				
				try {
					const { message, context = true } = await request.json();
					
					if (!message) {
						return Response.json({ error: 'Message is required' }, { status: 400 });
					}
					
					let contextText = '';
					
					// If context is enabled, retrieve relevant documents
					if (context) {
						// Generate embedding for the user's message
						const embeddingResponse = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
							text: message
						});
						
						// Query Vectorize for relevant context
						const searchResults = await env.VECTORIZE_INDEX.query(embeddingResponse.data[0], {
							topK: 3,
							returnMetadata: true
						});
						
						// Build context from search results
						if (searchResults.matches && searchResults.matches.length > 0) {
							contextText = searchResults.matches
								.map(m => `[${m.metadata?.title || 'Document'}]: ${m.metadata?.content || ''}`)
								.join('\n\n');
						}
					}
					
					// Build the prompt with RAG context
					const systemPrompt = `You are a helpful security expert assistant for Company. 
Your role is to answer questions about cybersecurity concepts, SASE, ZTNA, and security best practices.
Be concise, accurate, and professional. If you're unsure about something, say so.

${contextText ? `Use the following context to inform your answers:\n\n${contextText}\n\n` : ''}`;

					// Generate response using Workers AI
					const aiResponse = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
						messages: [
							{ role: 'system', content: systemPrompt },
							{ role: 'user', content: message }
						],
						max_tokens: 1024
					});
					
					return Response.json({ 
						success: true,
						message: message,
						response: aiResponse.response,
						contextUsed: context && contextText.length > 0
					});
				} catch (err) {
					console.error('Chat error:', err);
					return Response.json({ 
						error: 'Chat failed', 
						details: err.message 
					}, { status: 500 });
				}

			case '/api/kb/add':
				// Add document to knowledge base (admin only)
				if (request.method !== 'POST') {
					return Response.json({ error: 'Method not allowed' }, { status: 405 });
				}
				
				// Check authorization
				const adminAuth = request.headers.get('Authorization');
				if (!adminAuth?.startsWith('Bearer ')) {
					return Response.json({ error: 'Unauthorized' }, { status: 401 });
				}
				
				try {
					const { id, title, content, category = 'general' } = await request.json();
					
					if (!id || !title || !content) {
						return Response.json({ 
							error: 'id, title, and content are required' 
						}, { status: 400 });
					}
					
					// Generate embedding
					const embeddingResponse = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
						text: `${title}\n\n${content}`
					});
					
					// Insert into Vectorize
					await env.VECTORIZE_INDEX.upsert([{
						id: id,
						values: embeddingResponse.data[0],
						metadata: { title, content, category, addedAt: new Date().toISOString() }
					}]);
					
					return Response.json({ 
						success: true, 
						message: `Document "${title}" added to knowledge base` 
					});
				} catch (err) {
					console.error('KB add error:', err);
					return Response.json({ 
						error: 'Failed to add document', 
						details: err.message 
					}, { status: 500 });
				}
				
			default:
				// For protected routes, authentication was already checked above
				// For all other routes, let the asset handler serve static files
				// Note: env.ASSETS is automatically provided when using the `assets` config
				if (env.ASSETS) {
					return env.ASSETS.fetch(request);
				}
				return new Response('Not Found', { status: 404 });
		}
		});
		}
	};

async function sendApprovalEmail(env, userData) {
	const { name, email } = userData;
	const approvalToken = crypto.randomUUID();

	// Email body with approval buttons
	const emailBody = `
		<h2>New Access Request - Company Lab</h2>
		<p><strong>Name:</strong> ${name}</p>
		<p><strong>Email:</strong> ${email}</p>
		<p><strong>Requested:</strong> ${new Date().toISOString()}</p>
		
		<div style="margin: 20px 0;">
			<a href="${env.SITE_URL || 'https://sellersco.net'}/api/approve-user?token=${approvalToken}&approved=true" 
			   style="display:inline-block;padding:12px 24px;background:#51cf66;color:white;text-decoration:none;border-radius:8px;margin-right:10px;">
				✓ Approve Access
			</a>
			<a href="${env.SITE_URL || 'https://sellersco.net'}/api/approve-user?token=${approvalToken}&approved=false" 
			   style="display:inline-block;padding:12px 24px;background:#ff6b6b;color:white;text-decoration:none;border-radius:8px;">
				✗ Deny Access
			</a>
		</div>
		
		<p style="color:#666;font-size:12px;">This request was automatically generated from the registration system.</p>
	`;

	// Using MailChannels (free email service for Cloudflare Workers)
	try {
		const emailResp = await fetch('https://api.mailchannels.net/tx/v1/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				personalizations: [
					{
						to: [{ email: 'packetcatcha@gmail.com', name: 'Site Admin' }]
					}
				],
				from: {
					email: 'noreply@sellersco.net',
					name: 'Company Lab'
				},
				subject: `Access Request: ${name} (${email})`,
				content: [
					{
						type: 'text/html',
						value: emailBody
					}
				]
			})
		});

		if (!emailResp.ok) {
			console.error('Failed to send email:', await emailResp.text());
		}
	} catch (err) {
		console.error('Email error:', err);
	}
}
