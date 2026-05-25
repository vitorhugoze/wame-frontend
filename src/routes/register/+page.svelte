<script>
	import { goto } from '$app/navigation';
	import { signIn, signUp, getSession } from '$lib/auth/auth-client';
	import Alert from '$lib/components/alerts/Alert.svelte';
	import { loggedIn } from '$lib/stores';
	import { ScrollToTarget } from '$lib/utils/lenis';
	import { onMount } from 'svelte';

	let showPassword = $state(false);

	let name = $state('');
	let email = $state('');
	let password = $state('');

	let empty = $derived(password.length == 0);
	let hasMinimumSize = $derived(password.length >= 8);
	let hasLowerCase = $derived(/[a-z]/.test(password));
	let hasUpperCase = $derived(/[A-Z]/.test(password));
	let hasNumber = $derived(/[0-9]/.test(password));
	let hasSpecialChar = $derived(/[@$!%*?&#]/.test(password));

	let validPassword = $derived(hasMinimumSize && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar);

	let errorMessage = $state();
	let errorKey = $state(0);

	onMount(async () => {
		const session = await getSession();

		if (session.data) {
			goto('/dashboard');
		}
	});

	function Register() {
		signUp.email(
			{
				name: name,
				email: email,
				password: password
			},
			{
				onError: (ctx) => {
					errorMessage = ctx.error.message;
					errorKey++;
				},
				onSuccess: (ctx) => {
					loggedIn.set(true);
					ScrollToTarget('plans', '/');
				}
			}
		);
	}
</script>

{#key errorKey}
	{#if errorMessage}
		<Alert title={'Failed!'} content={errorMessage} />
	{/if}
{/key}

<main class="flex h-screen w-full items-center justify-center">
	<div class="card w-80 border-base-300 bg-neutral card-sm card-border">
		<div class="flex items-center border-b border-dashed border-base-300 p-4">
			<div class="flex items-center gap-2 text-sm font-medium">
				<img src="/images/useradd.svg" alt="Add user" class="size-5 opacity-40" />
				Create new account
			</div>
		</div>

		<div class="card-body gap-3">
			<p class="text-xs opacity-60">Registration is free and only takes a minute</p>
			<label class="validator input">
				<img src="/images/email.svg" alt="E-mail" class="size-4 opacity-40" />
				<input bind:value={email} placeholder="E-mail" type="email" />
			</label>
			<label class="validator input">
				<img src="/images/usersolid.svg" alt="Name" class="size-4 opacity-40" />
				<input bind:value={name} placeholder="Name" type="text" minlength="5" maxlength="60" />
			</label>
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
				<input onclick={() => Register()} type="submit" value="Register" class="btn w-full btn-primary" />
				<a href="/login" class="link text-[11px] text-base-content/60">Already have an account?</a>
			</div>
		</div>
	</div>
</main>
