import { ADVANCED_PRICE_ID, FREE_TRIAL_PRICE_ID, PRO_PRICE_ID, SECRET_STRIPE_KEY, STANDARD_PRICE_ID } from '$env/static/private';
import { pool } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

import Stripe from 'stripe';

const stripe = new Stripe(SECRET_STRIPE_KEY);

export async function POST(req) {
	const userId = req.request.headers.get('userid');

	if (!userId) {
		return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
	}

	let customer = await stripe.customers.retrieve(userId).catch(() => null);
	if (!customer || customer.deleted) {
		return new Response(JSON.stringify({ error: 'Customer not found' }), { status: 404 });
	}

	let subscriptions = await stripe.subscriptions.list({
		customer: userId,
		status: 'all'
	});

	let hasActiveSubscription = false;

	let subscriptionsData = [];
	for (let sub of subscriptions.data) {
		let isActive = sub.status === 'active';

		if (isActive) {
			hasActiveSubscription = true;
		}

		const subData = await fetchOrCreateSubscription(userId, sub.id, sub.items.data[0].price.id, isActive);
		if (subData) {
			subscriptionsData.push(subData);
		}
	}

	if (!hasActiveSubscription) {
		const sessions = await stripe.checkout.sessions.list({
			customer: userId,
			limit: 10
		});

		const freeTierSessions = sessions.data.filter((s) => s.subscription == null);
		if (freeTierSessions.length > 0) {
			let freeTierSub = freeTierSessions[0];

			let id = freeTierSub.id;

			const lineItems = await stripe.checkout.sessions.listLineItems(id, { limit: 1 });
			if (lineItems.data.length > 0) {
				const priceId = lineItems.data[0].price.id;
				const subData = await fetchOrCreateSubscription(userId, id, priceId, true);

				if (subData) {
					subscriptionsData.push(subData);
				}
			}
		}
	}

	return new Response(JSON.stringify({ subs: subscriptionsData }), { status: 200 });
}

const subscriptionTypes = new Map();
subscriptionTypes.set(FREE_TRIAL_PRICE_ID, { name: 'Free Trial', sessions: 1, free: true });
subscriptionTypes.set(STANDARD_PRICE_ID, { name: 'Standard', sessions: 1, free: false });
subscriptionTypes.set(ADVANCED_PRICE_ID, { name: 'Advanced', sessions: 5, free: false });
subscriptionTypes.set(PRO_PRICE_ID, { name: 'Pro', sessions: 30, free: false });

async function fetchOrCreateSubscription(userId, subId, priceId, isActive) {
	let subType = subscriptionTypes.get(priceId);
	if (!subType) {
		return null;
	}

	const subsData = await pool.query('SELECT SUBS_TOKEN, SUBS_ACTIVE FROM TB_SUBS WHERE SUBS_ID = $1 AND USER_ID = $2', [subId, userId]);
	if (subsData.rowCount > 0) {
		return {
			token: subsData.rows[0].subs_token,
			active: Boolean(subsData.rows[0].subs_active),
			name: subType.name,
			sessions: subType.sessions,
			free: subType.free
		};
	}

	if (isActive) {
		const subsToken = generateApiToken();

		const result = await pool.query('INSERT INTO TB_SUBS(SUBS_ID, SUBS_PRICE_ID, SUBS_FREE, SUBS_TOKEN, SUBS_SESSIONS, USER_ID) VALUES($1, $2, $3, $4, $5, $6);', [subId, priceId, subType.free, subsToken, subType.sessions, userId]);
		if (result.rowCount > 0) {
			return {
				token: subsToken,
				active: true,
				name: subType.name,
				sessions: subType.sessions,
				free: subType.free
			};
		}
	}

	return null;
}

function generateApiToken() {
	return nanoid(128);
}
