import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { UsersCollection } from '../models/users.js';
import createHttpError from 'http-errors';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/index.js';
import { Session } from '../models/session.js';

async function createUser(data) {
  const user = await UsersCollection.findOne({ email: data.email });

  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  data.password = await bcrypt.hash(data.password, 10);

  return UsersCollection.create(data);
}
async function loginUser(email, password) {
  const user = await UsersCollection.findOne({ email });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError(404, 'Wrong password');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');
  console.log();

  return Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

async function refreshUserSession({ sessionId, refreshtoken }) {
  const session = await Session.findOne({ _id: sessionId, refreshtoken });
  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }
  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token expired');
  }
  await Session.deleteOne({ _id: session.id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId: session.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

async function logoutUser(sessionId) {
  Session.deleteOne({ _id: sessionId });
}
export { createUser, loginUser, refreshUserSession, logoutUser };
