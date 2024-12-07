<script lang="ts">
	import { fade } from 'svelte/transition'; // Importování fade pro přechod

	let registrationSuccess = false;
	let email = '';
	let nickname = '';
	let password = '';
	let confirmPassword = '';
	let jmeno = '';
	let prijmeni = '';
	let datum_nar = '';
	let notification = '';

	// Funkce pro validaci hesla
	function validatePassword(password: string) {
		const errors = [];
		if (!/[A-Z]/.test(password)) {
			errors.push('The password must contain at least one uppercase letter.');
		}
		if (!/[0-9]/.test(password)) {
			errors.push('The password must contain at least one number.');
		}
		if (password.length < 8) {
			errors.push('The password must be at least 8 characters long.');
		}
		return errors;
	}

	// Funkce pro registraci uživatele
	async function register() {
		notification = '';

		// Kontrola, jestli hesla odpovídají
		if (password !== confirmPassword) {
			notification = 'Passwords do not match.';
			return;
		}

		// Validace hesla
		const passwordErrors = validatePassword(password);
		if (passwordErrors.length > 0) {
			notification = passwordErrors.join(' ');
			return;
		}

		// Příprava dat z formuláře
		const formData = new FormData();
		formData.append('email', email);
		formData.append('nickname', nickname);
		formData.append('password', password);
		formData.append('jmeno', jmeno);
		formData.append('prijmeni', prijmeni);
		formData.append('datum_nar', datum_nar);

		try {
			const response = await fetch('/register', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();
			if (response.ok && result.success) {
				registrationSuccess = true;
				notification = result.message;
			} else {
				notification = result.message || 'An error occurred during registration.';
			}
		} catch (error) {
			console.error('Error during registration:', error);
			notification = 'Failed to connect to the server.';
		}
	}
</script>

<svelte:head>
	<title>XP Life - Register</title>
</svelte:head>

<div class="Main">
	<div class="form">
		<h1>Register</h1>
		<form on:submit|preventDefault={register}>
			<input type="email" bind:value={email} placeholder="Email" required />
			<input type="text" bind:value={nickname} placeholder="Nickname" required />
			<input type="text" bind:value={jmeno} placeholder="First Name" required />
			<input type="text" bind:value={prijmeni} placeholder="Last Name" required />
			<input type="date" bind:value={datum_nar} required />
			<input type="password" bind:value={password} placeholder="Password" required />
			<input type="password" bind:value={confirmPassword} placeholder="Confirm Password" required />
			<button type="submit">Register new account</button>
		</form>
		<div class="form-buttons">
			<a href="/" color="grey">Home</a>
			
		</div>
		{#if notification}
			<div transition:fade class="notification">{notification}</div>
		{/if}

		{#if registrationSuccess}
			<div transition:fade class="notification">Registration successful! Check your email to verify your account.</div>
		{/if}
	</div>
</div>

<style>
	.Main {
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
	}

	.form {
		display: flex;
		flex-direction: column;
	}

	input {
		width: 100%;
		padding: 10px;
		margin: 10px 0;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		width: 100%;
		padding: 10px;
		background-color: #4CAF50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}

	.notification {
		color: red;
		margin-top: 10px;
	}

</style>
