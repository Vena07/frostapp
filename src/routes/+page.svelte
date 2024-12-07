<script>
  let email = '';
  let nickname = '';
  let password = '';
  let newPassword = '';
  let message = '';
  let currentForm = 'register'; // Může být 'register', 'login', nebo 'reset'

  async function registerUser() {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nickname, password }),
      });

      const data = await response.json();
      message = data.success ? data.message : data.error;
    } catch (error) {
      console.error('Chyba při registraci:', error);
      message = 'Nepodařilo se provést registraci.';
    }
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
      console.error('Chyba při přihlášení:', error);
      message = 'Nepodařilo se přihlásit.';
    }
  }

  async function resetPassword() {
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      message = data.success ? data.message : data.error;
    } catch (error) {
      console.error('Chyba při odesílání emailu pro reset hesla:', error);
      message = 'Nepodařilo se odeslat email.';
    }
  }
</script>

<h1>{currentForm === 'register' ? 'Registrace' : currentForm === 'login' ? 'Přihlášení' : 'Reset hesla'}</h1>

{#if currentForm === 'register'}
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
{/if}

{#if currentForm === 'login'}
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
{/if}

{#if currentForm === 'reset'}
<form on:submit|preventDefault={resetPassword}>
  <label>
    Email:
    <input type="email" bind:value={email} required />
  </label>
  <button type="submit">Odeslat email pro reset hesla</button>
</form>
{/if}

<p>{message}</p>

<div>
  <button on:click={() => (currentForm = 'register')}>Registrace</button>
  <button on:click={() => (currentForm = 'login')}>Přihlášení</button>
  <button on:click={() => (currentForm = 'reset')}>Reset hesla</button>
</div>
