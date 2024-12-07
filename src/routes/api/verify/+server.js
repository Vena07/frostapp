import { db } from '$lib/server/db/index.js';
import { sendVerificationEmail } from '$lib/server/resend';

export async function POST({ request }) {
    try {
        const { token } = await request.json();

        if (!token) {
            return new Response(
                JSON.stringify({ error: 'Token je povinný.' }),
                { status: 400 }
            );
        }

        // Najít uživatele podle tokenu v SQLite
        const [user] = await db.prepare('SELECT * FROM users WHERE verification_token = ?')
                                 .bind(token)
                                 .all();

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Token neexistuje nebo je neplatný.' }),
                { status: 404 }
            );
        }

        // Aktualizovat uživatele na ověřený
        await db.prepare('UPDATE users SET is_email_verified = 1, verification_token = NULL WHERE id = ?')
                 .bind(user.id)
                 .run();

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
