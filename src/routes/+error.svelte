<script>
	import { page } from '$app/stores';
</script>

<h1>Oops! Something went wrong</h1>
<p>Status: {$page.status}</p>
<p>{$page.error?.message || 'An unexpected error occurred.'}</p>

<a href="/">Go back home</a>
