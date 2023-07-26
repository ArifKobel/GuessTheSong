import { Database } from '$lib/classes/database';
import type { PageServerLoad } from './$types';
import { MONGODB_URI } from '$env/static/private';
export const load = (async ({ params }) => {
  const db = new Database(MONGODB_URI);
  if (!db.isConnected) {
    await db.connect();
  }
  console.time("GetRandomSong");
  const randomSong = await db.GetRandomSong();
  console.timeEnd("GetRandomSong"); 
  return {
    randomSong: structuredClone(randomSong)
  };
}) satisfies PageServerLoad;