import dotenv from "dotenv";
dotenv.config(); // .env file load karega

import { MongoClient } from "mongodb";


const client = new MongoClient(process.env.MONGO_DB_URL);
let db;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db();
    console.log(`Database connected successfully`);
  } catch (error) {
    console.log("error", error);
  }
};

export const dbInstance = () => {
  if (!db) {
    throw new Error("First connect db");
  }
  return db;
};
