import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

let mongoClientInstance: MongoClient | null = null;

async function getDB() {
  if (!mongoClientInstance) {
    mongoClientInstance = await MongoClient.connect(DATABASE_URL, {
      maxPoolSize: 5,
    });
  }

  return mongoClientInstance.db();
}

export { getDB };
