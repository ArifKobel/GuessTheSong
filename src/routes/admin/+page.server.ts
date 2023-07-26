import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { Database } from '$lib/classes/database';
import type { song } from '$lib/types/songInterface';
import { ADMIN_PASSWORD, MONGODB_URI } from '$env/static/private';
import youtubedl from "youtube-dl-exec";
export const load = (async ({ params }) => {

}) satisfies PageServerLoad;

export const actions: Actions = {
  async default({ request }) {
    const data = await request.formData();
    const db = new Database(MONGODB_URI);
    if (data.get("secret") !== ADMIN_PASSWORD) {
      throw new Error("Incorrect password");
    }
    if (!db.isConnected) {
      await db.connect();
    }
    const name = data.get("name");
    const artist = data.get("artist");
    const url = data.get("url");
    const res = await youtubedl(url as string, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      audioFormat: "mp3",
      addHeader: [
        'referer:youtube.com',
        'user-agent:googlebot'
      ]
    })
    if (name === null || artist === null || url === null) {
      throw new Error("Missing required fields");
    }
    const song:song = {
      name: name as string,
      artist: artist as string,
      url: url as string,
    }
    const result = await db.AddSong(song);
  }
} satisfies Actions;

