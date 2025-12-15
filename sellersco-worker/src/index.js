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
	'/fusion-dash'
];

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		
		// Handle attack patterns routes
		if (url.pathname === '/attack-patterns' || url.pathname.startsWith('/attack-patterns/')) {
			return handleAttackPatternsRoute(url.pathname, request, env, ctx);
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
		if (PROTECTED_ROUTES.includes(url.pathname)) {
			const authHeader = request.headers.get('Authorization');
			const token = authHeader?.replace('Bearer ', '');
			
			// Simple token validation (you'd want to use JWT in production)
			if (!token || token !== 'valid-token-placeholder') {
				return new Response('Unauthorized - Sales content requires authentication', { 
					status: 401,
					headers: { 
						'Content-Type': 'text/plain',
						'Cache-Control': 'no-store, no-cache, must-revalidate, private'
					}
				});
			}
			// If authenticated, serve the protected asset with no-cache headers
			if (env.ASSETS) {
				const response = await env.ASSETS.fetch(request);
				// Clone response and add no-cache headers
				const headers = new Headers(response.headers);
				headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
				return new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers
				});
			}
		}
		
		// Serve images from R2
		if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
			const imageName = url.pathname.substring(1); // Remove leading slash
			try {
				const object = await env.IMAGES.get(imageName);
				if (object) {
					return new Response(object.body, {
						headers: {
							'Content-Type': object.httpMetadata.contentType || 'image/png',
							'Cache-Control': 'public, max-age=31536000',
							'ETag': object.httpEtag
						}
					});
				}
			} catch (err) {
				console.error('R2 error:', err);
			}
		}

		switch (url.pathname) {
			// API Routes with /api prefix (REST standard)
			case '/api/message':
				return Response.json({ 
					message: 'Hello, World!',
					timestamp: new Date().toISOString(),
					worker: 'sellersco-worker'
				});
				
			case '/api/random':
				return Response.json({ 
					number: Math.floor(Math.random() * 1000),
					uuid: crypto.randomUUID(),
					timestamp: new Date().toISOString()
				});
				
			case '/api/get-ticker':
				return Response.json({
					items: [
						{ title: 'CVE-2024-1234: Critical RCE in Web Framework' },
						{ title: 'New Ransomware Variant Detected' },
						{ title: 'Zero-Day Exploit in Popular CMS' },
						{ title: 'Critical Authentication Bypass Found' },
						{ title: 'SQL Injection in Enterprise Software' }
					]
				});

			// Legacy routes (deprecated - use /api prefix)
			case '/message':
				return new Response('Hello, World!');
				
			case '/random':
				return new Response(crypto.randomUUID());
				
			case '/get-ticker':
				return Response.json({
					items: [
						{ title: 'CVE-2024-1234: Critical RCE in Web Framework' },
						{ title: 'New Ransomware Variant Detected' },
						{ title: 'Zero-Day Exploit in Popular CMS' },
						{ title: 'Critical Authentication Bypass Found' },
						{ title: 'SQL Injection in Enterprise Software' }
					]
				});

			case '/api/register':
				if (request.method !== 'POST') {
					return Response.json({ error: 'Method not allowed' }, { status: 405 });
				}
				
				try {
					const body = await request.json();
					const { name, email, password } = body;
					
					// Validate email domain
					if (!email.endsWith('@nexuminc.com')) {
						return Response.json({ error: 'Only @nexuminc.com emails allowed' }, { status: 400 });
					}
					
					// Send approval email to jsellers@nexuminc.com
					await sendApprovalEmail(env, { name, email });
					
					return Response.json({ 
						success: true, 
						message: 'Registration request submitted. Awaiting approval.' 
					});
				} catch (err) {
					return Response.json({ error: 'Registration failed' }, { status: 500 });
				}

			case '/api/login':
				if (request.method !== 'POST') {
					return Response.json({ error: 'Method not allowed' }, { status: 405 });
				}
				
				try {
					const body = await request.json();
					const { email, password } = body;
					
					// TODO: Implement proper authentication with D1 database
					// For now, return a placeholder token
					if (email.endsWith('@nexuminc.com')) {
						return Response.json({ 
							success: true,
							token: 'valid-token-placeholder',
							message: 'Login successful' 
						});
					} else {
						return Response.json({ error: 'Invalid credentials' }, { status: 401 });
					}
				} catch (err) {
					return Response.json({ error: 'Login failed' }, { status: 500 });
				}

			case '/api/approve-user':
				// This endpoint would be called from the approval email
				const token = url.searchParams.get('token');
				const approved = url.searchParams.get('approved');
				
				if (token && approved === 'true') {
					// TODO: Update user status in D1 database
					return new Response('User approved! They can now login.', { 
						headers: { 'Content-Type': 'text/html' }
					});
				}
				
				return new Response('Invalid approval request', { status: 400 });

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
					const systemPrompt = `You are a helpful security expert assistant for Nexum Inc. 
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
	},
};

// Export Durable Object
export { QuantumDurableObject };

async function sendApprovalEmail(env, userData) {
	const { name, email } = userData;
	const approvalToken = crypto.randomUUID();
	
	// Email body with approval buttons
	const emailBody = `
		<h2>New Access Request - Nexum Inc Lab</h2>
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
		
		<p style="color:#666;font-size:12px;">This request was automatically generated from the Nexum Inc Lab registration system.</p>
	`;

	// Using MailChannels (free email service for Cloudflare Workers)
	try {
		const emailResp = await fetch('https://api.mailchannels.net/tx/v1/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				personalizations: [{
					to: [{ email: 'jsellers@nexuminc.com', name: 'James Sellers' }]
				}],
				from: { 
					email: 'noreply@sellersco.net', 
					name: 'Nexum Inc Lab' 
				},
				subject: `Access Request: ${name} (${email})`,
				content: [{
					type: 'text/html',
					value: emailBody
				}]
			})
		});

		if (!emailResp.ok) {
			console.error('Failed to send email:', await emailResp.text());
		}
	} catch (err) {
		console.error('Email error:', err);
	}
}
