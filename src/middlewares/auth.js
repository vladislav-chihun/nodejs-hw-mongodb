import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { UsersCollection } from '../models/users.js';

async function auth(req, res, next) {
  try {
    if (typeof req.headers.authorization !== 'string') {
      return next(createHttpError(401, 'Wrong authorization header'));
    }

    const [bearer, accessToken] = req.headers.authorization.split(' ', 2);

    if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
      return next(
        createHttpError(401, 'Auth header should be type of a Bearer'),
      );
    }

    const session = await Session.findOne({ accessToken });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      return next(createHttpError(401, 'Access token is expired'));
    }

    const user = await UsersCollection.findOne({ _id: session.userId });
    if (!user) {
      return next(createHttpError(401, 'Session not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export { auth };
