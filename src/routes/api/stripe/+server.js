import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';
import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import { json } from '@sveltejs/kit';

const stripe = new Stripe(SECRET_STRIPE_KEY);

async function fetchOrCreateCustomer(userId) {
	let customer = await stripe.customers.retrieve(userId).catch(() => null);

	if (customer) {
		if (customer.deleted) {
			return null;
		}

		return customer;
	}

	customer = await stripe.customers.create({
		id: userId
	});

	return customer;
}

export async function POST(req) {
	const priceId = req.request.headers.get('priceid');
	const mode = req.request.headers.get('mode');
	const userId = req.request.headers.get('userid');

	let customer = await fetchOrCreateCustomer(userId);
	if (!customer) {
		return json({ error: 'Customer retrieval/creation failed' }, { status: 500 });
	}

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		mode,
		success_url: `${PUBLIC_FRONTEND_URL}/?transaction_status=success`,
		cancel_url: `${PUBLIC_FRONTEND_URL}/?transaction_status=cancel`,
		customer: userId
	});

	return json({ sessionUrl: session.url });
}
