import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { UsersCollection } from '../models/users.js';
import createHttpError from 'http-errors';
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SMTP,
} from '../constants/index.js';
import { Session } from '../models/session.js';
import { sendMail } from '../utils/sendMail.js';

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

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError(404, 'Wrong password');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');
  console.log();

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

async function refreshUserSession({ sessionId, refreshUserToken }) {
  const session = await Session.findOne({ _id: sessionId, refreshUserToken });
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
  await Session.deleteOne({ _id: sessionId });
}

async function requestResetEmail(email) {
  const user = await UsersCollection.findOne({ email });
  if (user === null) {
    throw createHttpError(404, 'User not found!');
  }
  await sendMail({
    from: SMTP.FROM_EMAIL,
    to: email,
    subject: 'Reset your password',
    html: `To reset password click <a http="https://www.google.com">here</a>`,
  });
}
export {
  createUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
};
