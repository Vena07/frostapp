import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema'; // Opravený import pro správnou tabulku 'user'
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '$lib/server/resend';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const nickname = formData.get('nickname');
  const password = formData.get('password');
  const jmeno = formData.get('jmeno');
  const prijmeni = formData.get('prijmeni');
  const datum_nar = formData.get('datum_nar'); // Formát datumu musí být validní ISO 8601
  const profile_image = formData.get('profile_image'); // Předpokládám, že obrazek je posílán jako URL nebo base64

  // Kontrola povinných polí
  if (!email || !nickname || !password || !jmeno || !prijmeni || !datum_nar || !profile_image) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid input' }), { status: 400 });
  }

  try {
    // Kontrola, jestli už existuje uživatel s tímto e-mailem nebo přezdívkou
    const existingUserByEmail = await db.select().from(user).where(eq(user.email, email)).get();
    const existingUserByNickname = await db.select().from(user).where(eq(user.nickname, nickname)).get();

    if (existingUserByEmail) {
      return new Response(JSON.stringify({ success: false, message: 'This email already exists, please try another one' }), { status: 409 });
    }

    if (existingUserByNickname) {
      return new Response(JSON.stringify({ success: false, message: 'This nickname already exists, please try another one' }), { status: 409 });
    }

    // Hashování hesla
    const passwordHash = await bcrypt.hash(password, 10);

    // Generování unikátního tokenu pro verifikaci e-mailu
    const token = Math.random().toString(36).substr(2);
    const tokenExpires = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(); // Token vyprší za 1 hodinu

    // Vložení nového uživatele do databáze
    await db.insert(user).values({
      email,
      nickname,
      jmeno,
      prijmeni,
      datum_nar, // Očekáváme formát ISO 8601 (např. "1990-01-01")
      password_hash: passwordHash,
      token,
      token_expires: tokenExpires,
      is_email_verified: 0, // Neověřený email
      is_online: 0, // Uživatel není online při registraci
      created_at: new Date().toISOString(), // ISO 8601
      update_at: new Date().toISOString(), // ISO 8601
      profile_image,
    }).run();

    // Získání nového uživatele podle emailu
    const newUser = await db.select().from(user).where(eq(user.email, email)).get();

    if (!newUser) {
      throw new Error('User could not be found after insertion.');
    }

    const userId = newUser.id; // Získání ID nového uživatele

    // Generování odkazu pro verifikaci emailu
    const verificationLink = `https://tvujweb.cz/verify-email?token=${token}&userId=${userId}`;

    // Odeslání verifikačního emailu
    await sendVerificationEmail(email, verificationLink);

    // Odpověď na úspěšnou registraci
    return new Response(JSON.stringify({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.'
    }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: 'An error occurred during registration.' }), { status: 500 });
  }
}
