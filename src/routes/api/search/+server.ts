import { LASTFM_API_KEY, MONGODB_URI } from "$env/static/private";
import { Database } from "$lib/classes/database";
import axios from "axios";

export const GET = async ({url}): Promise<Response> => {
  const db = new Database(MONGODB_URI);
  const searchTerm:string = url.searchParams.get("q")!;
  const search = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchTerm}&api_key=${LASTFM_API_KEY}&format=json`)
  if (search.data.results === undefined) {
    return new Response(JSON.stringify([]));
  }
  return new Response(JSON.stringify(search.data.results.trackmatches.track));
}