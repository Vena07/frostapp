import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
    try {
        const { token } = await request.json();

        if (!token) {
            return new Response(
                JSON.stringify({ error: 'Chybí ověřovací token.' }),
                { status: 400 }
            );
        }

        console.log('Doručený token:', token);

        // Najdi uživatele s odpovídajícím tokenem
        const [foundUser] = await db
            .select()
            .from(user)
            .where(eq(user.token, token))
            .execute();

        if (!foundUser) {
            console.error('Token neexistuje nebo je neplatný.');
            return new Response(
                JSON.stringify({ error: 'Token neexistuje nebo je neplatný.' }),
                { status: 404 }
            );
        }

        console.log('Nalezený uživatel:', foundUser);

        // Aktualizuj stav uživatele
        await db
            .update(user)
            .set({
                token: '', // Nahraď hodnotu tokenu prázdným řetězcem
                is_email_verified: 1, // Nastav, že email byl ověřen
            })
            .where(eq(user.token, token))
            .execute();

        console.log('Stav uživatele byl úspěšně aktualizován.');

        return new Response(
            JSON.stringify({ success: true, message: 'Email byl úspěšně ověřen.' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Chyba při ověřování emailu:', error);
        return new Response(
            JSON.stringify({ error: 'Chyba při ověřování emailu.' }),
            { status: 500 }
        );
    }
}
