/**
 * Durable Object for Real-Time Multi-User Quantum Entanglement Demos
 * Handles WebSocket connections, shared state, and broadcast entanglement
 */

export class QuantumDurableObject {
	constructor(state, env) {
		this.state = state;
		this.env = env;
		this.users = new Map();
		this.simulationState = {
			qubits: [],
			entanglement: [],
			timestamp: Date.now(),
		};
	}

	async fetch(request) {
		if (request.headers.get('Upgrade') === 'websocket') {
			return this.handleWebSocket(request);
		}

		const url = new URL(request.url);
		const path = url.pathname;

		if (path === '/state') {
			return new Response(JSON.stringify(this.simulationState), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (path === '/update' && request.method === 'POST') {
			const data = await request.json();
			this.simulationState = { ...this.simulationState, ...data };
			this.broadcastUpdate(data);
			return new Response(JSON.stringify({ success: true }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response('Not Found', { status: 404 });
	}

	handleWebSocket(request) {
		const pair = new WebSocketPair();
		const client = pair[1];
		const id = Math.random().toString(36).substring(7);

		this.users.set(id, client);

		client.addEventListener('message', (msg) => {
			try {
				const data = JSON.parse(msg.data);
				this.simulationState = { ...this.simulationState, ...data };
				this.broadcastUpdate(data, id);
			} catch (e) {
				console.error('WebSocket parse error:', e);
			}
		});

		client.addEventListener('close', () => {
			this.users.delete(id);
		});

		client.addEventListener('error', () => {
			this.users.delete(id);
		});

		return new Response(null, { status: 101, webSocket: pair[0] });
	}

	broadcastUpdate(data, exclude = null) {
		const message = JSON.stringify({
			type: 'update',
			data,
			timestamp: Date.now(),
		});

		for (const [id, client] of this.users) {
			if (id !== exclude) {
				try {
					client.send(message);
				} catch (e) {
					console.error('Broadcast error:', e);
				}
			}
		}
	}
}
