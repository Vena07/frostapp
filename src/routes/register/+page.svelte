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
		{#if notification}
			<div transition:fade class="notification">{notification}</div>
		{/if}

		{#if registrationSuccess}
			<div transition:fade class="notification">Registration successful! Check your email to verify your account.</div>
		{/if}





<form on:submit|preventDefault={register} class="login">
    <h1>REGISTRACE</h1>
    
	<label class="email">
        Jméno
        <input type="text" bind:value={jmeno}  required >
    </label>
	<label class="email">
        Přijmení
        <input type="text" bind:value={prijmeni} required >
    </label>
	
	<label class="nickname">
        Nickname
        <input type="text" bind:value={nickname}  required>
    </label>
    <label class="email">
        E-mail
        <input type="email" bind:value={email} required >
    </label>
    <label>
        Heslo
        <input type="password" bind:value={password} required >
    </label>
    <label>
        Potvrzeni hesla
        <input type="password" bind:value={confirmPassword}  required >
    </label>
	<label>
        Datum 
		<input type="date" bind:value={datum_nar} required >
    </label>
    <button type="submit"><strong>Vytvořit účet</strong></button>
    <div>
        <a href="/login">Již máte učet?</a>
    </div>
	</form>


   <img src="/images/bottom.png" alt="Obrázek" />
<style lang="scss">
    *{
        font-family: "Outfit";
    }
    
    .login{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 600px;
        width: 100%;
        padding: 30px;
        box-sizing: border-box;
        gap: 14px;
        margin: auto;

        button{
            width: 100%;
            height: 50px;
            border-radius: 10px;
            background-color: #67378C;
            color: white;
            border: none;
            cursor: pointer;
        }

        label{
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 4px;
            font-size: 14px;
            font-weight: 500;

            input{
                height: 50px;
                border-radius: 10px;
                padding: 0 10px;
                border: 1.5px solid black;
            }
        }

        div{
            display: flex;
            justify-content: space-between;
            width: 100%;

            a{
                text-decoration: none;
                color: black;
                font-weight: 500;
                transition: ease .3s;

                &:hover{
                    color: rgb(115, 0, 128);
                }
            }
        }
    }

    img{
        width: 100%;
    }
</style>
