<script>
    import { page } from '$app/stores';
    let token = '';
    let newPassword = '';
    let confirmPassword = ''; // Nové pole pro potvrzení hesla
    let message = 'Zadejte nové heslo.';

    $: {
        token = $page.url.searchParams.get('token');
    }

    function validatePassword(password) {
        const minLength = 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Heslo musí mít alespoň 8 znaků.';
        }
        if (!hasLetter) {
            return 'Heslo musí obsahovat alespoň jedno písmeno.';
        }
        if (!hasNumber) {
            return 'Heslo musí obsahovat alespoň jedno číslo.';
        }
        if (!hasSpecialChar) {
            return 'Heslo musí obsahovat alespoň jeden speciální znak.';
        }
        return '';
    }

    async function resetPassword() {
        if (!token) {
            message = 'Chybí ověřovací token.';
            return;
        }

        if (newPassword !== confirmPassword) {
            message = 'Hesla se neshodují.';
            return;
        }

        const validationMessage = validatePassword(newPassword);
        if (validationMessage) {
            message = validationMessage;
            return;
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            message = data.success
                ? 'Heslo bylo úspěšně změněno!'
                : data.error || 'Nepodařilo se změnit heslo.';
        } catch (error) {
            console.error('Chyba při komunikaci s API:', error);
            message = 'Chyba při resetu hesla.';
        }
    }
</script>

<h1>{message}</h1>

{#if token}
    <form on:submit|preventDefault={resetPassword}>
        <label>
            Nové heslo:
            <input type="password" bind:value={newPassword} required />
        </label>
        <label>
            Potvrzení hesla:
            <input type="password" bind:value={confirmPassword} required />
        </label>
        <button type="submit">Změnit heslo</button>
    </form>
{:else}
    <p>Token pro reset hesla není k dispozici.</p>
{/if}
