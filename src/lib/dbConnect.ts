import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function databaseConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log(`ALREADY CONNECTED TO DATABASE !!`);
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log(`DATABASE CONNECTED SUCCESSFULLY !!`);
  } catch (error) {
    console.log(`DATABASE CONNECTION FAILED: `, error);
    process.exit(1);
  }
}
