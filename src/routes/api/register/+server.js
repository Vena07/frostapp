import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '$lib/server/email'; // DŮLEŽITÉ: Importujte tuto funkci

export async function POST({ request }) {
    try {
        const { email, nickname, password } = await request.json();

        // Validace vstupů
        if (!email || !nickname || !password) {
            return new Response(
                JSON.stringify({ error: 'Email, přezdívka a heslo jsou povinné.' }),
                { status: 400 }
            );
        }

        // Validace emailu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ error: 'Neplatný formát emailu.' }),
                { status: 400 }
            );
        }

        // Kontrola, zda email již existuje
        const [existingUser] = await db
            .select({ email: user.email })
            .from(user)
            .where(eq(user.email, email))
            .execute();

        if (existingUser) {
            return new Response(
                JSON.stringify({ error: 'Email je již použitý.' }),
                { status: 409 } // Konflikt
            );
        }

        // Validace hesla (minimální délka, čísla, speciální znaky)
        const passwordRequirements = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
        if (!passwordRequirements.test(password)) {
            return new Response(
                JSON.stringify({
                    error: 'Heslo musí mít alespoň 8 znaků, obsahovat číslo a speciální znak (@#$%^&+=!).',
                }),
                { status: 400 }
            );
        }

        // Hashování hesla
        const passwordHash = await bcrypt.hash(password, 10);

        // Generování ověřovacího tokenu
        const verificationToken = `verify-${Date.now()}`;

        // Uložení do databáze
        await db
            .insert(user)
            .values({
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

        // Poslání ověřovacího emailu
        const verificationLink = `http://localhost:5173/verify?token=${verificationToken}`;
        await sendVerificationEmail(email, verificationLink);

        return new Response(
            JSON.stringify({ success: true, message: 'Registrace proběhla úspěšně. Zkontrolujte svůj email.' }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Chyba při registraci:', error);
        return new Response(
            JSON.stringify({ error: 'Interní chyba serveru.' }),
            { status: 500 }
        );
    }
}
