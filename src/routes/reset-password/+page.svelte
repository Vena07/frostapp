<script>
    import { page } from '$app/stores';
    let token = '';
    let newPassword = '';
    let message = 'Zadejte nové heslo.';

    $: {
        token = $page.url.searchParams.get('token');
    }

    async function resetPassword() {
        if (!token) {
            message = 'Chybí ověřovací token.';
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
        <button type="submit">Změnit heslo</button>
    </form>
{:else}
    <p>Token pro reset hesla není k dispozici.</p>
{/if}
