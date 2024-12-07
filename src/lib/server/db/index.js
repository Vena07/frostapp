import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';

// Kontrola environmentálních proměnných
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!dev && !env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

// Vytvoření klienta
const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
});

// Inicializace Drizzle ORM
export const db = drizzle(client);

// Test připojení k databázi
(async () => {
    try {
        // Ověření připojení pomocí dotazu na SQLite metadata
        const result = await db.select().from('sqlite_master').execute();
        console.log('Připojení k databázi je funkční:', result);
    } catch (error) {
        console.error('Chyba při připojování k databázi:', error);
    }
})();
