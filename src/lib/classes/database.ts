import type { song } from "$lib/types/songInterface";
import { MongoClient } from "mongodb";
import youtubeDl from "youtube-dl-exec";
import ytdl from "ytdl-core";
import fs from "fs";
export class Database {
  private client: MongoClient | undefined;
  public isConnected = false;
  private connectionString: string;
  constructor(connectionString: string) {
    this.connectionString = connectionString;
  } 
  public async connect() {
    this.client = await MongoClient.connect(this.connectionString);
    if (this.client)
    this.isConnected = true;
  }
  public async GetRandomSong() {
    if (!this.isConnected) {
      throw new Error("Not connected to database");
    }
    const db = this.client!.db("GuessTheSong");
    const songs = db.collection("songs")
    const allSongs = await songs.find().toArray();
    let randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
    if (randomSong.url.includes("youtube.com")) {
      db.collection("songs").deleteOne({ _id: randomSong._id });
    }
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