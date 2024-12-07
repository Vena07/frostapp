import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js';
import { sendVerificationEmail } from '$lib/server/email';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
    const { email } = await request.json();

    if (!email) {
        return new Response(
            JSON.stringify({ error: 'Email je povinný.' }),
            { status: 400 }
        );
    }

    const resetToken = `reset-${Date.now()}`;
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    const tokenExpires = new Date(Date.now() + 24 * 3600 * 1000).toISOString(); // Token platí 24 hodin

    try {
        await db
            .update(user)
            .set({ token: resetToken, token_expires: tokenExpires })
            .where(eq(user.email, email))
            .execute();

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
