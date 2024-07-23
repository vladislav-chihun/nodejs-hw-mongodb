import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function initMongoConnection() {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;
    const user = MONGODB_USER;
    const pwd = MONGODB_PASSWORD;
    const url = MONGODB_URL;
    const db = MONGODB_DB;

    await mongoose.connect(
      `mongodb+srv://student1:my_password_dbb@cluster0.kpkhhat.mongodb.net/student1?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(error);
  }
}

export { initMongoConnection };
