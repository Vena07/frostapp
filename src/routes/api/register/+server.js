import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema'; // Import tabulky
import bcrypt from 'bcrypt'; // Pro hashování hesel

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { email, nickname, password } = body;

        if (!email || !nickname || !password) {
            return new Response(
                JSON.stringify({ error: 'Email, nickname a heslo jsou povinné.' }),
                { status: 400 }
            );
        }

        // Hashování hesla
        const passwordHash = await bcrypt.hash(password, 10);

        // Uložení do databáze
        const newUser = await db.insert(user).values({
            email,
            nickname,
            password_hash: passwordHash,
            token: '', // Defaultně prázdné
            token_expires: new Date().toISOString(), // Defaultní hodnota
            is_email_verified: 0, // Výchozí hodnota (0 = false v SQLite)
            is_online: 0, // Výchozí hodnota
            created_at: new Date().toISOString(),
            update_at: new Date().toISOString(),
            profile_image: '/default-profile.png', // Výchozí obrázek
        });

        return new Response(JSON.stringify({ success: true, user: newUser }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'Chyba při vytváření uživatele.' }),
            { status: 500 }
        );
    }
}
