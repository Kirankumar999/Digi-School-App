import mongoose from "mongoose";
import { MOCK_MODE } from "./mockData";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/DigiSchool";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  // In MOCK_MODE we skip the real MongoDB connection entirely so the app
  // can run on machines that have no DB access (corporate VPN, offline, etc.)
  if (MOCK_MODE) {
    return null as unknown as typeof mongoose;
  }

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
