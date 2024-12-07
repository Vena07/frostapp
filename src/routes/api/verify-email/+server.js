import { db } from '$lib/server/db'; 
import { usersTable } from '$lib/server/db/schema'; 
import bcrypt from 'bcryptjs'; 
import { sendVerificationEmail } from '$lib/server/db/resend'; 
import { eq } from 'drizzle-orm'; 

export async function POST({ request }) { 
  // Získání dat z formuláře
  const formData = await request.formData();
  const email = formData.get('email');
  const nickname = formData.get('nickname');
  const password = formData.get('password');

  // Kontrola, zda jsou všechna pole vyplněna
  if (!email || !nickname || !password) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid input' }),
      { status: 400 }
    );
  }

  try {
    // Logování pro diagnostiku
    console.log("Form data received: ", { email, nickname, password });

    // Kontrola, zda uživatel s tímto nickname nebo emailem již neexistuje
    const existingUserByNickname = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.nickname, nickname))
      .get();
    const existingUserByEmail = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();

    // Kontrola duplicity
    if (existingUserByNickname) {
      console.log("Nickname already exists.");
      return new Response(
        JSON.stringify({ success: false, message: 'This username already exists, please try another one' }),
        { status: 409 }
      );
    }

    if (existingUserByEmail) {
      console.log("Email already exists.");
      return new Response(
        JSON.stringify({ success: false, message: 'This email already exists, please try another one' }),
        { status: 409 }
      );
    }

    // Hashování hesla
    const passwordHash = await bcrypt.hash(password, 10);

    // Generování tokenu pro ověření emailu
    const token = Math.random().toString(36).substr(2);

    // Vložení nového uživatele do databáze
    await db
      .insert(usersTable)
      .values({
        email,
        nickname,
        passwordHash,
        isEmailVerified: 0, // Neověřený e-mail
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        token,
      })
      .run();

    // Logování úspěšného vložení
    console.log("User inserted successfully");

    // Získání nově vloženého uživatele podle emailu
    const newUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();

    if (!newUser) {
      throw new Error('User could not be found after insertion.');
    }

    const userId = newUser.id;

    // Odeslání ověřovacího e-mailu
    await sendVerificationEmail(email, nickname, token);

    // Vrácení odpovědi
    return new Response(
      JSON.stringify({ success: true, message: 'Registration successful. Please check your email to verify your account.' }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error during registration: ', error); // Logování chyby
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500 }
    );
  }
}
