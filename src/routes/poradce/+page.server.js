import { db } from '$lib/server/db';
import { user, poradce } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
 
export async function load({ locals }) {
    console.log("pica");
    console.log("locals", locals.user1)
  if (!locals.user1) {
    error(404, {
        
      message: 'Not found',
    });
  }
  console.log("pica1111");
 
  const User1 = await db.select().from(user).where(user.id === locals.user1.id).get();
  const data = await db.select().from(poradce).get();
  console.log('data:', data); // Přidáno logování
 
  if (!User1) {
    error(404, {
      message: 'Not found',
    });
  }
 
  return {
    props: {
      User1: {
        id: User1.id,
        nickname: User1.nickname,
        datum_nar: User1.datum_nar
      },
      data
    }
  };
}
 