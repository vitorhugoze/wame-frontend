<script>
	import { getSession } from '$lib/auth/auth-client';

	let subscriptions = $state([]);

	async function fetchSubscriptions() {
		const session = await getSession();

		if (!session.data) {
			return;
		}

		const response = await fetch('/api/subscription', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				userid: session.data.user.id
			}
		});

		if (!response.ok) {
			return;
		}

		const data = await response.json();
		if (data && data.subs) {
			subscriptions = data.subs;
		}
	}
	fetchSubscriptions();

	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).then(
			() => {
				alert('Copied to clipboard');
			},
			(err) => {
				alert('Failed to copy text: ', err);
			}
		);
	}
</script>

<main class="flex h-screen w-full items-center justify-center">
	<div class="h-6/12 w-10/12 rounded-lg bg-neutral p-6 shadow-md">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Tier</th>
					<th>Max Sessions</th>
					<th>Api Key</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each subscriptions as sub, index}
					<tr>
						<th>{index + 1}</th>
						<td>{sub.name}</td>
						<td>{sub.sessions}</td>
						<td class="flex overflow-hidden text-nowrap">
							<input type="text" value={sub.token} class="w-50" readonly />
							<button
								onclick={() => {
									copyToClipboard(sub.token);
								}}
								class="btn ml-2 btn-xs">Copy</button
							>
						</td>
						<td>
							{#if sub.active}
								<span class="badge badge-success">Active</span>
							{:else}
								<span class="badge badge-error">Inactive</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
