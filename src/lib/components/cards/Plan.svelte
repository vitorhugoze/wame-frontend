<script>
	import { goto } from '$app/navigation';
	import { getSession } from '$lib/auth/auth-client';
	import { SignUp } from '$lib/utils/stripe';

	const { plan } = $props();
</script>

<div class="card m-5 h-fit w-70 bg-neutral shadow-sm">
	<div class="card-body">
		{#if plan.badge}
			<span class="absolute -mt-4 badge badge-xs">{plan.badge}</span>
		{/if}
		<div class="flex justify-between">
			<h2 class="text-3xl font-bold">{plan.type}</h2>
			<h3 class="text-xl">${plan.price}/mo</h3>
		</div>
		<ul>
			{#each plan.attributes as attribute}
				<li>
					<svg xmlns="http://www.w3.org/2000/svg" class="me-2 inline-block size-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
					<span>{attribute}</span>
				</li>
			{/each}
		</ul>
		<button
			onclick={async () => {
				const session = await getSession();
				if (!session.data) {
					alert('You must be logged in to sign up for a plan.');

					goto('/login');
					return;
				}

				SignUp(plan.stripePriceId, 'subscription', session.data.user.id);
			}}
			class="btn btn-accent">Sign Up</button
		>
	</div>
</div>
