<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { RegisterCustomRaf } from '$lib/utils/lenis';

	let { children } = $props();

	onMount(RegisterCustomRaf);
</script>

<svelte:head>
	<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23008000' font-family='Arial, sans-serif' font-size='50' font-weight='bold'>W</text></svg>" type="image/svg+xml" />
</svelte:head>

<Header />

{@render children()}

<Footer />
