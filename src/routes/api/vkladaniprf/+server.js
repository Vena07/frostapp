import { db } from '$lib/server/db'; // Připojení k databázi
import bcrypt from 'bcrypt'; // Pro hash hesla
import { user } from '$lib/server/schema/user';

export async function POST({ request }) {
  try {
    const body = await request.json();

    const { email, nickname, password } = body;

    if (!email || !nickname || !password) {
      return new Response(JSON.stringify({ error: 'Všechna pole jsou povinná!' }), { status: 400 });
    }

    // Hash hesla
    const passwordHash = await bcrypt.hash(password, 10);

    // Uložení do databáze
    await db.insert(user).values({
      email,
      nickname,
      password_hash: passwordHash,
      is_email_verified: 0,
      is_online: 0,
      created_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
      profile_image: 'default.png', // Můžeš změnit na vlastní default
    });

    return new Response(JSON.stringify({ success: 'Uživatel byl vytvořen.' }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Chyba serveru.' }), { status: 500 });
  }
}
