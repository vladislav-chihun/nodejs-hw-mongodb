import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { env } from '../utils/env.js';
dotenv.config();

async function initMongoConnection() {
  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(error);
  }
}

export { initMongoConnection };
