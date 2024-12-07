<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let message = 'Ověřuji váš email...';
  let token = '';  // Token z URL parametru
  let isVerified = false;

  // Načtení tokenu z URL
  $: {
    token = $page.url.searchParams.get('token');
  }

  // Funkce pro ověření tokenu
  async function verifyEmail() {
    if (!token) {
      message = 'Token je neplatný.';
      return;
    }

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      if (data.success) {
        message = 'Email byl úspěšně ověřen!';
        isVerified = true;
      } else {
        message = data.error || 'Nepodařilo se ověřit email.';
      }
    } catch (error) {
      console.error('Chyba při ověřování:', error);
      message = 'Došlo k chybě při ověřování emailu.';
    }
  }

  // Volání verifyEmail() při načtení komponenty
  onMount(() => {
    verifyEmail();
  });
</script>

<h1>{message}</h1>

{#if isVerified}
  <p>Váš email byl úspěšně ověřen. Můžete se přihlásit.</p>
{/if}

{#if !isVerified && token}
  <p>Ověřování emailu probíhá...</p>
{/if}
