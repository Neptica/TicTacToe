import mongoose from "mongoose";

export async function connectToDatabase(connectionString: string) {
  const db = await mongoose.connect(connectionString);
  return db;
}
