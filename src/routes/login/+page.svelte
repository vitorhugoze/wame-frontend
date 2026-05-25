<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_FRONTEND_URL } from '$env/static/public';
	import { signIn, getSession, requestPasswordReset } from '$lib/auth/auth-client';
	import Alert from '$lib/components/alerts/Alert.svelte';
	import { loggedIn } from '$lib/stores';
	import { ScrollToTarget } from '$lib/utils/lenis';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	let showPassword = $state(false);

	let email = $state('');
	let password = $state('');

	let message = $state();
	let messageKey = $state(0);
	let title = $state();

	onMount(async () => {
		const session = await getSession();

		if (session.data) {
			goto('/dashboard');
		}
	});

	function Login() {
		signIn.email(
			{
				email: email,
				password: password
			},
			{
				onError: (ctx) => {
					message = ctx.error.message;
					messageKey++;
					title = 'Failed!';
				},
				onSuccess: (ctx) => {
					loggedIn.set(true);

					//TODO if already has a plan goto dashboard else goto plans
					ScrollToTarget('plans', '/');
				}
			}
		);
	}

	function ForgotPassword() {
		requestPasswordReset(
			{
				email: email,
				redirectTo: `${PUBLIC_FRONTEND_URL}/reset-password`
			},
			{
				onSuccess: (ctx) => {
					message = 'Recovery e-mail sent. Please check your inbox.';
					messageKey++;
					title = 'Sent!';
				},
				onError: (ctx) => {
					message = ctx.error.message;
					messageKey++;
					title = 'Failed!';
				}
			}
		);
	}
</script>

{#key messageKey}
	{#if message}
		<Alert {title} content={message} />
	{/if}
{/key}

<main class="flex h-screen w-full items-center justify-center">
	<div class="card w-80 border-base-300 bg-neutral card-sm card-border">
		<div class="flex items-center border-b border-dashed border-base-300 p-4">
			<div class="flex items-center gap-2 text-sm font-medium">
				<img src="/images/useradd.svg" alt="Add user" class="size-5 opacity-40" />
				Login
			</div>
		</div>

		<div class="card-body gap-3">
			<p class="text-xs opacity-60">Check your subscription and your keys</p>
			<label class="validator input">
				<img src="/images/email.svg" alt="E-mail" class="size-4 opacity-40" />
				<input bind:value={email} placeholder="E-mail" type="email" />
			</label>
			<label class="validator input">
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

			<div class="flex flex-col items-end gap-1">
				<input onclick={() => Login()} type="submit" value="Login" class="btn w-full btn-primary" />
				<div class="flex w-full justify-between">
					<button onclick={() => ForgotPassword()} class="link text-[11px] text-base-content/60">Forgot your password?</button>
					<a href="/register" class="link text-[11px] text-base-content/60">Create an account</a>
				</div>
			</div>
		</div>
	</div>
</main>
