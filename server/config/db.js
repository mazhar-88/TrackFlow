import { MongoClient } from "mongodb";


const client = new MongoClient(process.env.MONGO_URI);
let db;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(); // default mydatabase from URL
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
