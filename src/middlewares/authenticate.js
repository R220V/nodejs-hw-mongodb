import createHttpError from 'http-errors';

import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';

export async function authenticate(req, res, next) {
  const { authorization } = req.headers;
  try {
  if (typeof authorization !== 'string') {
    return next(
      new createHttpError.Unauthorized('Please provide access token'),
    );
  }

  const [bearer, accessToken] = authorization.split(' ', 2);
//перевірим, чи токен правильний
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(
      new createHttpError.Unauthorized('Please provide access token'),
    );
  }
//шукаєм в базі сесію з  переданим токеном
  const session = await Session.findOne({ accessToken });

  if (session === null) {
    return next(new createHttpError.Unauthorized('Session not found'));
  }
//перевіримо, чи токен закінчився
  if (session.accessTokenValidUntil < new Date()) {
    return next(new createHttpError.Unauthorized('Access token expired'));
  }
//перевіримо, чи цьому юзеру належить сесія по ID
  const user = await User.findOne({ _id: session.userId });

  if (user === null) {
    return next(new createHttpError.Unauthorized('User not found'));
  }

  req.user = { id: user._id, name: user.name };

   return next();
  } catch (err) {
    return next(err);
}
};
