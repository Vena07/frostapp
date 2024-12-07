import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '$lib/server/email';

export async function POST({ request }) {
    try {
        const { email } = await request.json();

        if (!email) {
            return new Response(
                JSON.stringify({ error: 'Email je povinný.' }),
                { status: 400 }
            );
        }

        // Vyhledání uživatele podle emailu
        const [existingUser] = await db
            .select({ email: user.email, isEmailVerified: user.is_email_verified })
            .from(user)
            .where(eq(user.email, email))
            .execute();

        if (!existingUser) {
            return new Response(
                JSON.stringify({ error: 'Tento email není registrován.' }),
                { status: 404 } // Not Found
            );
        }

        // Kontrola, zda je email ověřen
        if (!existingUser.isEmailVerified) {
            return new Response(
                JSON.stringify({ error: 'Váš email nebyl ověřen. Zkontrolujte svůj email.' }),
                { status: 403 } // Forbidden
            );
        }

        // Generování tokenu pro reset hesla
        const resetToken = `reset-${Date.now()}`;
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        // Aktualizace tokenu v databázi
        await db
            .update(user)
            .set({ token: resetToken, token_expires: new Date(Date.now() + 3600 * 1000).toISOString() })
            .where(eq(user.email, email))
            .execute();

        // Odeslání emailu
        await sendVerificationEmail(email, resetLink);

        return new Response(
            JSON.stringify({ success: true, message: 'Email pro změnu hesla byl odeslán.' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Chyba při odesílání emailu:', error);
        return new Response(
            JSON.stringify({ error: 'Chyba při odesílání emailu.' }),
            { status: 500 }
        );
    }
}
