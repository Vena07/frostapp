import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function GET({ url }) {
    const token = url.searchParams.get('token');

    if (!token) {
        return new Response(
            JSON.stringify({ error: 'Token je povinný.' }),
            { status: 400 }
        );
    }

    try {
        const [existingUser] = await db
            .select()
            .from(user)
            .where(eq(user.token, token))
            .execute();

        if (!existingUser) {
            return new Response(
                JSON.stringify({ error: 'Token je neplatný nebo expirovaný.' }),
                { status: 400 }
            );
        }

        await db
            .update(user)
            .set({
                is_email_verified: 1,
                token: null, // Smazání tokenu po ověření
            })
            .where(eq(user.id, existingUser.id))
            .execute();

        return new Response(
            JSON.stringify({ success: true, message: 'Email byl úspěšně ověřen!' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Chyba při ověřování emailu:', error);
        return new Response(
            JSON.stringify({ error: 'Interní chyba serveru.' }),
            { status: 500 }
        );
    }
}
