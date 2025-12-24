import mongoose, { Mongoose } from 'mongoose';
import '@/models/node';
import '@/modules/projects/project.model';
import '@/models/account';
import '@/modules/users/user.model';
import '@/modules/rateLimits/rateLimit.model';
import '@/models/member';
import '@/modules/workspaces/workspace.model';
import '@/modules/workspaces/members/member.model';
import '@/modules/tokens/token.model';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI)
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');

// Extend NodeJS global type
declare global {
  var mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

// ✅ Initialize global cache if not already set
const globalCache = global.mongoose ?? {
  conn: null,
  promise: null,
};

global.mongoose = globalCache; // Ensure it’s always defined
const cached = global.mongoose; // ✅ no longer possibly undefined

async function connectDb(): Promise<Mongoose> {
  if (cached.conn) {
    console.log('🟢 MongoDB: Using existing connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🟡 MongoDB: Creating new connection...');
    const opts = { bufferCommands: false };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then(mongoose => {
        console.log('✅ MongoDB: Connected successfully');
        return mongoose;
      })
      .catch(err => {
        console.error('🔴 MongoDB connection error:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDb;
