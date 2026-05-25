import { PUBLIC_STRIPE_KEY } from '$env/static/public';
import { loadStripe } from '@stripe/stripe-js';

export async function SignUp(stripePriceId, mode, userId) {
	const stripe = await loadStripe(PUBLIC_STRIPE_KEY);

	const response = await fetch('/api/stripe', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			PriceId: stripePriceId,
			Mode: mode,
			UserId: userId
		}
	});

	const { sessionUrl } = await response.json();
	window.location.href = sessionUrl;
}
