import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { Database } from '$lib/classes/database';
import type { song } from '$lib/types/songInterface';
import { ADMIN_PASSWORD, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME, MONGODB_URI } from '$env/static/private';
import youtubedl from "youtube-dl-exec";
import ytdl from 'ytdl-core';
import fs from 'fs';
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET 
});

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
    let url = data.get("url") as string;
    if (name === null || artist === null || url === null) {
      throw new Error("Missing required fields");
    }
    if (url.includes("youtube.com")) {
      const random = Math.random().toString(36).substring(7);
      ytdl(url, {
        filter: "audioonly",
        quality: "highestaudio",
      }).pipe(fs.createWriteStream(`${random}.mp3`));
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await cloudinary.uploader.upload(`${random}.mp3`, {resource_type: "video"});
      url = result.url;
    }
    const song:song = {
      name: name as string,
      artist: artist as string,
      url: url as string,
    }
    const result = await db.AddSong(song);
  }
} satisfies Actions;

