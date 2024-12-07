<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let token = '';
  let message = 'Probíhá ověřování...';

  onMount(() => {
    const urlParams = new URLSearchParams($page.url.search);
    token = urlParams.get('token');
    console.log('Token načtený z URL:', token);

    if (token) {
      verifyEmail();
    } else {
      message = 'Chybí ověřovací token.';
    }
  });

  async function verifyEmail() {
    try {
      console.log('Ověřuji token přes API:', token);
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      message = data.success
        ? 'Email byl úspěšně ověřen!'
        : data.error || 'Nepodařilo se ověřit email.';
    } catch (error) {
      console.error('Chyba při komunikaci s API:', error);
      message = 'Chyba při ověřování emailu.';
    }
  }
</script>

<h1>{message}</h1>
