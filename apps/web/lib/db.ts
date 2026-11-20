import mongoose from "mongoose"
import "@/models"

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as unknown as {
  mongoose?: MongooseCache
}

const cached: MongooseCache = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null,
}

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached
}

async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is not defined")
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((m) => {
        cached.conn = m
        return m
      })
      .catch((err) => {
        cached.promise = null
        throw err
      })
  }

  return cached.promise
}

export { connectDB, mongoose }
