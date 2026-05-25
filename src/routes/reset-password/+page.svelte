<script>
	import { goto } from '$app/navigation';
	import { resetPassword } from '$lib/auth/auth-client';
	import Alert from '$lib/components/alerts/Alert.svelte';
	import { loggedIn } from '$lib/stores';
	import { onMount } from 'svelte';

	let showPassword = $state(false);

	let password = $state('');

	//Password validations
	let empty = $derived(password.length == 0);
	let hasMinimumSize = $derived(password.length >= 8);
	let hasLowerCase = $derived(/[a-z]/.test(password));
	let hasUpperCase = $derived(/[A-Z]/.test(password));
	let hasNumber = $derived(/[0-9]/.test(password));
	let hasSpecialChar = $derived(/[@$!%*?&#]/.test(password));

	let validPassword = $derived(hasMinimumSize && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar);

	let title = $state();
	let message = $state();

	function ResetPassword() {
		const token = new URLSearchParams(window.location.search).get('token');

		if (!token) {
			alert('Invalid password reset link!');
			return;
		}

		resetPassword(
			{
				newPassword: password,
				token: token
			},
			{
				onSuccess: (ctx) => {
					title = 'Success!';
					message = 'Password changed, you can now log in with your new password.';
				},
				onError: (ctx) => {
					title = 'Failed!';
					message = ctx.error;
				}
			}
		);
	}
</script>

{#if message}
	<Alert {title} content={message} />
{/if}

<main class="flex h-screen w-full items-center justify-center">
	<div class="card w-80 border-base-300 bg-neutral card-sm card-border">
		<div class="flex items-center border-b border-dashed border-base-300 p-4">
			<div class="flex items-center gap-2 text-sm font-medium">
				<img src="/images/useradd.svg" alt="Add user" class="size-5 opacity-40" />
				Reset your password
			</div>
		</div>

		<div class="card-body gap-3">
			<p class="text-xs opacity-60">Set your brand new password below!</p>
			<div class="gap-1">
				<label class="input">
					<img src="/images/keysolid.svg" alt="Password" class="size-4 opacity-40" />
					<input bind:value={password} placeholder="Password" type={showPassword ? 'text' : 'password'} />
					<button
						onclick={() => {
							showPassword = !showPassword;
						}}
						class="cursor-pointer"
					>
						<img src="/images/eye.svg" alt="Eye" class="size-5 opacity-40" />
					</button>
				</label>
				<div class={empty || validPassword ? 'hidden' : ''}>
					<div class="flex items-center gap-2 px-1 text-[11px]">
						<div class="status status-error"></div>
						{#if !hasMinimumSize}
							<span class="text-base-content/60">At least 8 characters</span>
						{:else if !hasLowerCase}
							<span class="text-base-content/60">At least one lowercase character</span>
						{:else if !hasUpperCase}
							<span class="text-base-content/60">At least one uppercase character</span>
						{:else if !hasNumber}
							<span class="text-base-content/60">At least one number</span>
						{:else if !hasSpecialChar}
							<span class="text-base-content/60">At least one special character</span>
						{/if}
					</div>
				</div>
			</div>

			<div class="flex flex-col items-end gap-1">
				<input onclick={() => ResetPassword()} type="submit" value="Save" class="btn w-full btn-primary" />
			</div>
		</div>
	</div>
</main>
