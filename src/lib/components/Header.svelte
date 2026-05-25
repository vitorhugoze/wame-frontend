<script>
	import { onMount } from 'svelte';
	import Logo from './Logo.svelte';
	import { ScrollToTarget } from '$lib/utils/lenis';
	import { getSession, revokeSessions } from '$lib/auth/auth-client';
	import { goto } from '$app/navigation';
	import { loggedIn } from '$lib/stores';

	onMount(async () => {
		const session = await getSession();
		if (session.data) {
			loggedIn.set(true);
		}
	});

	async function SignOut() {
		await revokeSessions();
		loggedIn.set(false);

		goto('/');
	}
</script>

<header class="navbar fixed top-0 z-10 items-baseline justify-between bg-base-100 pl-3 lg:pl-12">
	<Logo />
	<div class="flex justify-between">
		<nav class="mr-6 ml-5 flex items-center sm:mr-20">
			<a href="/" class="mr-2 ml-2 font-semibold hover:text-accent sm:mr-12 sm:ml-12">Home</a>
			{#if $loggedIn}
				<a href="/dashboard" class="mr-2 ml-2 font-semibold hover:text-accent sm:mr-12 sm:ml-12">Dashboard</a>
			{/if}
			<button onclick={() => ScrollToTarget('plans', '/')} class="mr-2 ml-2 cursor-pointer font-semibold hover:text-accent sm:mr-12 sm:ml-12">Plans</button>
			<a href="/docs" class="mr-2 ml-2 font-semibold hover:text-accent sm:mr-12 sm:ml-12">Docs</a>
			<button onclick={() => ScrollToTarget('footer')} class="mr-2 ml-2 cursor-pointer font-semibold hover:text-accent sm:mr-12 sm:ml-12">Contact</button>
		</nav>
		{#if $loggedIn}
			<button onclick={() => SignOut()} class="btn hidden btn-outline sm:mr-2 sm:block">Sign out</button>
		{:else}
			<button onclick={() => goto('/login')} class="btn hidden btn-outline sm:mr-2 sm:block">Login</button>
		{/if}
	</div>
</header>
