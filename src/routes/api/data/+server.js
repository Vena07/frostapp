// api/data.ts
import { db } from '$lib/server/db';
import { user} from '$lib/server/db/schema';

export async function GET({ url }) {
    const table = url.searchParams.get('table');
    let data;

    try {
        switch (table) {
            case 'user':
                data = await db.select().from(user);
                break;
            default:
                return new Response(JSON.stringify({ error: 'Nenašla se tabulka' }), { status: 400 });
        }

        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Vyskitla se chyb při načítaní tabulek: ',data }), { status: 500 });
    }
}