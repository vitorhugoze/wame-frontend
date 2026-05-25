<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PUBLIC_ADVANCED_PRICE_ID, PUBLIC_FREE_TRIAL_PRICE_ID, PUBLIC_PRO_PRICE_ID, PUBLIC_STANDARD_PRICE_ID } from '$env/static/public';
	import { getSession } from '$lib/auth/auth-client';
	import TransactionAlert from '$lib/components/alerts/TransactionAlert.svelte';
	import Plan from '$lib/components/cards/Plan.svelte';
	import { SignUp } from '$lib/utils/stripe';
	import badge from 'daisyui/components/badge';

	var plans = [];
	plans.push({
		type: 'Standard',
		price: '9',
		stripePriceId: PUBLIC_STANDARD_PRICE_ID,
		attributes: ['1 Number connected', 'Send text', 'Send files', 'Send images', 'Send audio']
	});

	plans.push({
		type: 'Advanced',
		price: '15',
		stripePriceId: PUBLIC_ADVANCED_PRICE_ID,
		attributes: ['5 Number connected', 'Send text', 'Send files', 'Send images', 'Send audio', 'Support channel']
	});

	plans.push({
		type: 'Pro',
		price: '29',
		stripePriceId: PUBLIC_PRO_PRICE_ID,
		attributes: ['30 Number connected', 'Send text', 'Send files', 'Send images', 'Send audio', 'Support channel', 'Discord channel'],
		badge: 'Best value'
	});

	const status = page.url.searchParams.get('transaction_status');
	const TRIAL_PRICE_ID = PUBLIC_FREE_TRIAL_PRICE_ID;
</script>

<TransactionAlert {status} />

<section class="flex h-screen w-full">
	<div class="flex h-full w-2/3 flex-wrap">
		<div class="flex h-2/3 w-full items-center pl-3 lg:pl-12">
			<h1 class="text-4xl font-medium sm:text-5xl sm:text-nowrap md:text-7xl lg:text-8xl">
				<span>THE API FOR WHATSAPP</span>
				<br />
				<span>MESSAGING YOUR</span>
				<br />
				<span>BUSINESS NEED</span>
			</h1>
		</div>
		<div class="flex h-1/3 w-full items-end pb-15 pl-3 lg:pl-12">
			<button
				onclick={async () => {
					const session = await getSession();
					if (!session.data) {
						alert('You must be logged in to sign up for a plan.');

						goto('/login');
						return;
					}

					SignUp(TRIAL_PRICE_ID, 'payment', session.data.user.id);
				}}
				class="btn h-16 w-64 text-2xl font-normal tracking-wider btn-accent">Start for free</button
			>
		</div>
	</div>
	<div class="flex h-full w-1/3 items-start justify-center pt-30">
		<img src="/images/iphone.png" alt="Iphone" class="w-full md:w-8/12 lg:w-5/12" />
	</div>
</section>
<!-- Plans -->
<section id="plans" class="flex h-fit w-full items-center justify-center md:h-screen">
	<div class="block md:flex">
		{#each plans as plan}
			<Plan {plan} />
		{/each}
	</div>
</section>
