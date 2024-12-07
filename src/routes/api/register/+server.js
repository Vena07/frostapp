import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js'; // Import tabulky
import bcrypt from 'bcrypt'; // Pro hashování hesel
import { sendVerificationEmail } from '$lib/server/email.js'; // Import funkce pro emaily
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
    try {
        const { email, nickname, password } = await request.json();

        if (!email || !nickname || !password) {
            console.error('Chybí povinné údaje:', { email, nickname, password });
            return new Response(
                JSON.stringify({ error: 'Email, nickname a heslo jsou povinné.' }),
                { status: 400 }
            );
        }

        console.log('Registrace uživatele začíná:', { email, nickname });

        // Hashování hesla
        const passwordHash = await bcrypt.hash(password, 10);

        // Generování ověřovacího tokenu
        const verificationToken = `verify-${Date.now()}`;

        // Uložení uživatele do databáze
        await db.insert(user).values({
            email,
            nickname,
            password_hash: passwordHash,
            token: verificationToken,
            token_expires: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // Token platí 24 hodin
            is_email_verified: 0,
            is_online: 0,
            created_at: new Date().toISOString(),
            update_at: new Date().toISOString(),
            profile_image: '/default-profile.png',
        });

        console.log('Uživatel byl úspěšně vložen do databáze.');

        // Načtení uživatele zpět z databáze pro kontrolu
        const [createdUser] = await db
            .select()
            .from(user)
            .where(eq(user.email, email))
            .execute();

        if (!createdUser) {
            console.error('Uživatel nebyl nalezen po vytvoření.');
            return new Response(
                JSON.stringify({ error: 'Chyba při načítání uživatele po vytvoření.' }),
                { status: 500 }
            );
        }

        console.log('Načtený uživatel z databáze:', createdUser);

        // Odeslání ověřovacího emailu
        const verificationLink = `http://localhost:5173/verify?token=${verificationToken}`;
        await sendVerificationEmail(email, verificationLink);

        console.log('Ověřovací email byl úspěšně odeslán.');

        return new Response(
            JSON.stringify({ success: true, message: 'Registrace úspěšná! Zkontrolujte svůj email.', user: createdUser }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Chyba při registraci:', error);
        return new Response(
            JSON.stringify({ error: 'Chyba při vytváření uživatele.' }),
            { status: 500 }
        );
    }
}
