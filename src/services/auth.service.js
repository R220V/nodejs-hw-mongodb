import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';

export async function registerUser(payload) {
    const user = await User.findOne({ email: payload.email });
    //помилка 409
    if (user !== null) {
        throw new createHttpError.Conflict('Email is already in use');
    }
    //хешуємо пароль в бд
    payload.password = await bcrypt.hash(payload.password, 10);

    return User.create(payload);
}
//логіка для логіна
export async function loginUser(email, password) {
    const user = await User.findOne({ email });
    //помилка 401
    if (user === null) {
        throw new createHttpError.Unauthorized('Email or password is incorrect');
    }
    //перевіряємо пароль з фронту
    const isMatch = await bcrypt.compare(password, user.password);
    //помилка 401
    if (isMatch !== true) {
        throw new createHttpError.Unauthorized('Email or password is incorrect');
    }
    //видалимо стару сесію
    await Session.deleteOne({ userId: user._id });

    return Session.create({
        userId: user._id,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
}
export async function logoutUser(sessionId) {
    await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
    const session = await Session.findOne({ _id: sessionId });
    if (session === null) {
        throw new createHttpError.Unauthorized('Session not found');
    }

    if (session.refreshToken !== refreshToken) {
        throw new createHttpError.Unauthorized('Refresh token is not valid');
    }

    if (session.refreshTokenValidUntil < new Date()) {
        throw new createHttpError.Unauthorized('Refresh token is expired');
    }

    //видалимо стару сесію
    await Session.deleteOne({ _id: session._id });

    return Session.create({
        userId: session._id,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
}
