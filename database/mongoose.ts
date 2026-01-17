if (process.env.NEXT_PHASE === "phase-production-build") {
    throw new Error("🚨 MongoDB was accessed during Next.js build");
  }


import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

export async function connectToDatabase() {
  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL must be set");
  }

  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
  }

  const cached = global.mongooseCache;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
