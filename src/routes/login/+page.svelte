<script>
	import { goto } from '$app/navigation'; // Importování goto z SvelteKit
	import { fade } from 'svelte/transition'; // Importování fade pro přechod

	let registrationSuccess = false;
	let email = '';
	let nickname = '';
	let password = '';
  let jmeno = '';
  let prijmeni = "";
	let confirmPassword = '';
	let notification = '';
  let datum_nar = "";

	// Funkce pro validaci hesla
	function validatePassword(){
		const errors = [];
		if (!/[A-Z]/.test(password)) {
			errors.push('The password must contain at least one uppercase letter.');
		} else if (!/[0-9]/.test(password)) {
			errors.push('The password must contain at least one number');
		} else if (password.length < 8) {
			errors.push('The password must be at least 8 characters long');
		}
		return errors;
	}

	// Funkce pro registraci uživatele
	async function register() {
		notification = '';

		// Kontrola, jestli hesla odpovídají
		if (password !== confirmPassword) {
			notification = 'Passwords do not match';
			return;
		}

		// Validace hesla
		const passwordErrors = validatePassword(password);
		if (passwordErrors.length > 0) {
			notification = passwordErrors.join(' ');
			return;
		}

		// Příprava formulářových dat
		const formData = new FormData();
		formData.append('email', email);
		formData.append('nickname', nickname);
		formData.append('password', password);
    formData.append('jmeno', jmeno);
    formData.append('prijmeni', prijmeni);

		// Odeslání dat na backend
		const response = await fetch('/register', {
			method: 'POST',
			body: formData,
		});

		// Zpracování odpovědi z backendu
		if (response.ok) {
			const result = await response.json();
			if (result.success) {
				registrationSuccess = true;
				setTimeout(() => {
					goto('/login'); // Přesměrování na přihlašovací stránku po 1 sekundě
				}, 1000);
			} else {
				notification = result.message;
			}
		} else {
			const errorResult = await response.json();
			notification = errorResult.message;
		}
	}
</script>

<svelte:head>
	<title>rtzui</title>
</svelte:head>

<div class="Main">
	<div class="form">
		<h1>Register</h1>
		<form on:submit|preventDefault={register}>
			<input type="email" bind:value={email} placeholder="Email" required>
			<input type="text" bind:value={nickname} placeholder="Nickname" required>
      <input type="text" bind:value={jmeno} placeholder="Petr" required>
      <input type="text" bind:value={prijmeni} placeholder="Příjmení" required>
			<input type="password" bind:value={password} placeholder="Password" required>
			<input type="password" bind:value={confirmPassword} placeholder="Confirm Password" required>
      <input type="date" bind:value={datum_nar} required>
			<button type="submit">Register</button>
		</form>

		{#if notification}
			<div class="notification" transition:fade>{{ notification }}</div>
		{/if}

		{#if registrationSuccess}
			<div class="success-message" transition:fade>
				<h2>Registration successful!</h2>
				<p>You will be redirected to the login page...</p>
			</div>
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
		align-items: center;
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

	.success-message {
		color: green;
		margin-top: 10px;
	}
</style>
