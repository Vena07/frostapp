<script>
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	// Reaktivní proměnné
	let loginSuccess = false;
	let notification = '';
	let nickname = '';
	let password = '';
	let rememberMe = false; // Přidání stavu pro "Zapamatovat si mě"

	async function login(event) {
		event.preventDefault();
		notification = '';

		const formData = new FormData();
		formData.append('nickname', nickname);
		formData.append('password', password);
		formData.append('rememberMe', rememberMe ? 'true' : 'false'); // Přidáme hodnotu pro "Zapamatovat si mě"

		const response = await fetch('/login', {
			method: 'POST',
			body: formData,
		});

		if (response.ok) {
			const result = await response.json();
			if (result.success) {
				loginSuccess = true;
				setTimeout(() => {
					goto('/profile');
				}, 1000);
			} else if (result.message === 'Please verify your email before logging in.') {
				notification = 'The email has not been verified yet. Please verify it before logging in.';
			} else {
				notification = result.message;
			}
		} else {
			const errorResult = await response.json();
			notification = errorResult.message;
		}
	}
</script>

    <form on:submit={login} class="login">
        <h1>LOGIN</h1>
        <label class="email">
            Nick
            <input type="text" bind:value={nickname} required>
        </label>
        <label>
            Heslo
            <input type="password" bind:value={password} required>
        </label>
        <div class="checkbox">
            <input type="checkbox" bind:checked={rememberMe} />
            <span>Remember me</span>
        </div>
        <button type="submit"><strong>Přihlásit se</strong></button>
        <div>
            <a href="/register">Nová registrace</a>
            <a href="/login/reset-password">Zapomenuté heslo</a>
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

        .checkbox{
            display: flex;
            justify-content: flex-start;
            gap: 10px;
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