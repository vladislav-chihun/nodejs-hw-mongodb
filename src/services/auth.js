import bcrypt from 'bcrypt';
import { UsersCollection } from '../models/users.js';
import createHttpError from 'http-errors';
async function createUser(data) {
  const user = await UsersCollection.findOne({ email: data.email });

  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  data.password = await bcrypt.hash(data.password, 10);

  return UsersCollection.create(data);
}
export { createUser };
