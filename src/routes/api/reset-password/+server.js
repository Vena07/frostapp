import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST({ request }) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return new Response(
                JSON.stringify({ error: 'Token a nové heslo jsou povinné.' }),
                { status: 400 }
            );
        }

        // Najít uživatele podle tokenu
        const [existingUser] = await db
            .select({
                id: user.id,
                tokenExpires: user.token_expires,
            })
            .from(user)
            .where(eq(user.token, token))
            .execute();

        if (!existingUser) {
            return new Response(
                JSON.stringify({ error: 'Token je neplatný nebo expiroval.' }),
                { status: 400 }
            );
        }

        // Ověřit platnost tokenu
        const tokenExpires = new Date(existingUser.tokenExpires);
        if (isNaN(tokenExpires.getTime()) || tokenExpires < new Date()) {
            return new Response(
                JSON.stringify({ error: 'Token vypršel.' }),
                { status: 400 }
            );
        }

        // Hashování nového hesla
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Aktualizace hesla a vymazání tokenu
        await db
            .update(user)
            .set({
                password_hash: passwordHash,
                token: '', // Vymažeme token
                token_expires: '', // Vymažeme token_expires
            })
            .where(eq(user.id, existingUser.id))
            .execute();

        return new Response(
            JSON.stringify({ success: true, message: 'Heslo bylo úspěšně změněno.' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Chyba při resetu hesla:', error);
        return new Response(
            JSON.stringify({ error: 'Chyba při resetu hesla.' }),
            { status: 500 }
        );
    }
}
