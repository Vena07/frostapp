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

  async function loginUser() {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        message = 'Přihlášení úspěšné!';
        localStorage.setItem('authToken', data.token); // Uložení tokenu
      } else {
        message = data.error;
      }
    } catch (error) {
      console.error('Chyba při komunikaci s API:', error);
      message = 'Chyba při přihlášení.';
    }
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

<h1>Přihlášení</h1>
<form on:submit|preventDefault={loginUser}>
  <label>
    Email:
    <input type="email" bind:value={email} required />
  </label>

  <label>
    Heslo:
    <input type="password" bind:value={password} required />
  </label>

  <button type="submit">Přihlásit</button>
</form>

<p>{message}</p>
