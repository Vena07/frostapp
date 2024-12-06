<script>
  let email = '';
  let nickname = '';
  let password = '';
  let message = '';

  async function registerUser() {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nickname, password }),
    });

    const data = await response.json();
    message = data.success || data.error;
  }
</script>

<h1>Registrace</h1>
<form on:submit|preventDefault={registerUser}>
  <label>
    Email:
    <input type="email" bind:value={email} required />
  </label>

  <label>
    Přezdívka:
    <input type="text" bind:value={nickname} required />
  </label>

  <label>
    Heslo:
    <input type="password" bind:value={password} required />
  </label>

  <button type="submit">Registrovat</button>
</form>

<p>{message}</p>
