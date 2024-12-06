import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js'; // Import tabulky
import { eq } from 'drizzle-orm'; // Import filtru
import bcrypt from 'bcrypt'; // Pro porovnání hesel

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email a heslo jsou povinné.' }),
                { status: 400 }
            );
        }

        // Vyhledání uživatele podle emailu
        const [existingUser] = await db
            .select({
                id: user.id,
                email: user.email,
                passwordHash: user.password_hash,
            })
            .from(user)
            .where(eq(user.email, email)) // Oprava použití filtru eq
            .execute();

        if (!existingUser) {
            return new Response(
                JSON.stringify({ error: 'Uživatel nebyl nalezen.' }),
                { status: 401 }
            );
        }

        // Ověření hesla
        const passwordValid = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordValid) {
            return new Response(
                JSON.stringify({ error: 'Nesprávné heslo.' }),
                { status: 401 }
            );
        }

        // Generování tokenu
        const token = `token-${existingUser.id}-${Date.now()}`;
        const tokenExpires = new Date(Date.now() + 3600 * 1000).toISOString();

        // Aktualizace tokenu v databázi
        await db
            .update(user)
            .set({
                token,
                token_expires: tokenExpires,
            })
            .where(eq(user.id, existingUser.id)) // Použití eq pro ID
            .execute();

        return new Response(
            JSON.stringify({ success: true, token }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Chyba při přihlášení:', error);
        return new Response(
            JSON.stringify({ error: 'Interní chyba serveru.' }),
            { status: 500 }
        );
    }
}
