import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { UsersCollection } from '../models/users.js';
import createHttpError from 'http-errors';

import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { Session } from '../models/session.js';
import { sendMail } from '../utils/sendMail.js';

import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import * as fs from 'node:fs/promises';

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

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );
  const templateFile = path.join(TEMPLATES_DIR, 'reset-password-email.html');
  const templateSource = await fs.readFile(templateFile, { encoding: 'utf-8' });
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `https://google.com/reset-password?token=${resetToken}`,
  });
  await sendMail({
    from: SMTP.FROM_EMAIL,
    to: email,
    subject: 'Reset your password',
    html,
  });
}

async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await UsersCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UsersCollection.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
  } catch (error) {
    if (
      (error.name === 'TokenExpiredError') |
      (error.name === 'JsonWebTokenError')
    ) {
      throw createHttpError(401, 'Token not valid');
    }
    throw error;
  }
}

export {
  createUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
};
