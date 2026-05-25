<script>
	import Alert from './Alert.svelte';

	const { status } = $props();
</script>

{#if status}
	{#if status == 'success'}
		<Alert title={'Success!'} content={'Check for the Api Key on your Dashboard!'} />
	{:else}
		<Alert title={'Failed!'} content={'Transaction failed, select a plan and try again!'} />
	{/if}
{/if}
