import type { song } from "$lib/types/songInterface";
import { MongoClient } from "mongodb";

export class Database {
  private client: MongoClient | undefined;
  public isConnected = false;
  private connectionString: string;
  constructor(connectionString: string) {
    this.connectionString = connectionString;
  } 
  public async connect() {
    this.client = await MongoClient.connect(this.connectionString);
    this.isConnected = true;
  }
  public async GetRandomSong() {
    if (!this.isConnected) {
      throw new Error("Not connected to database");
    }
    const db = this.client!.db("GuessTheSong");
    const songs = db.collection("songs")
    const allSongs = await songs.find().toArray();
    const randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
    return randomSong;
  }
  public async SearchSongs(searchTerm: string) {
    if (!this.isConnected) {
      throw new Error("Not connected to database");
    }
    const db = this.client!.db("GuessTheSong");
    const songs = db.collection("songs")
    const allSongs = await songs.find().toArray();
    const matchingSongs = allSongs.filter(song => song.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchingSongs;
  }
  public async AddSong(song: song) {
    if (!this.isConnected) {
      throw new Error("Not connected to database");
    }
    const db = this.client!.db("GuessTheSong");
    const songs = db.collection("songs")
    const result = await songs.insertOne(song);
    return result;
  }
}