<script lang="ts">
	import { login, register } from "./auth";

	//
	let authType = "login";
	let authError = "";

	function handleAuthTypeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		authType = target.value;
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		const statusElement = document.querySelector("#authErrorElement") as HTMLParagraphElement;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const username = formData.get("username") as string;

		if (authType === "login") {
			login({ email, password }, statusElement);
		} else {
			register({ email, password, username }, statusElement);
		}
	}

	$: console.log(authType);
</script>

<h1>Auth</h1>
<form on:submit={handleSubmit}>
	<section>
		<label>
			<input type="radio" name="auth" value="login" checked on:change={handleAuthTypeChange} />
			Login
		</label>
		<label>
			<input type="radio" name="auth" value="register" on:change={handleAuthTypeChange} />
			Register
		</label>
	</section>
	<div>
		<label for="email">Email</label>
		<input type="text" id="email" autocomplete="off" />
	</div>
	<div>
		<label for="password">Password</label>
		<input type="text" id="password" autocomplete="off" />
	</div>
	{#if authType === "register"}
		<div>
			<label for="username">Username</label>
			<input type="text" id="username" autocomplete="off" />
		</div>
	{/if}
	<p id="authErrorElement">{authError}</p>
	<button type="submit">Submit</button>
</form>

<style lang="sass">
	form
		display: flex
		flex-direction: column
		gap: 1rem

		section
			display: flex
			justify-content: center
			gap: 4rem

			label
				font-weight: 500
				cursor: pointer
				border: 1px solid #1a1a1a
				background: #1a1a1a
				padding: 0.5rem 1rem
				border-radius: 0.5rem

				transition: border 0.2s ease, color 0.2s ease

				user-select: none

				@media (prefers-color-scheme: light) 
					background: #f9f9f9
					border-color: #f9f9f9
					color: #000

				input
					display: none

			label:has(:checked)
				color: #646cff
				border-color: #646cff

		div
			display: flex
			flex-direction: column
			gap: 0.5rem

			label
				font-size: 0.8rem
				user-select: none
				color: #666

			input
				padding: 0.5rem
				border: 1px solid #aaa
				border-radius: 0.25rem
				outline: none
				font-size: 1rem

				&:focus-within
					border-color: #646cff
</style>
