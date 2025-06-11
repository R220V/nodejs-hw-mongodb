import * as fs from 'node:fs'; //модуль для роботи з файловою си-ою
import path from 'node:path';//для роботи з шляхами файлыв
import Handlebars from 'handlebars';// шаблонізатор для HTML-листів
import jwt from 'jsonwebtoken';// створення та перевірка JWT токенів
import crypto from 'node:crypto'; //для генерації токенів
import bcrypt from 'bcrypt'; //для хешування паролів
import createHttpError from 'http-errors'; //створення HTTP помилок

import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';
import { sendMail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';

//шаблон синхронно збережемо в оперативній пам'яті
const RESET_PASSWORD_TEMPLATE = fs.readFileSync(path.resolve('src', 'templates', 'reset-password.hbs'), 'UTF-8');
// console.log(RESET_PASSWORD_TEMPLATE);

//реєстрація корист.
export async function registerUser(payload) {
    const user = await User.findOne({ email: payload.email });
    //помилка 409
    if (user !== null) {
        throw new createHttpError.Conflict('Email in use');
    }
    //хешуємо пароль в бд
    payload.password = await bcrypt.hash(payload.password, 10);
// створення користувача в БД
    return User.create(payload);
}


// логін користувача
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
    //створимо нову з новими токенами
    return Session.create({
        userId: user._id,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 30 * 60 * 60 * 1000),
    });
}
//вихід користувача
export async function logoutUser(sessionId) {
    await Session.deleteOne({ _id: sessionId });
}
//оновлення сесії(новий access та refresh токен))
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
        userId: session.userId,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 30 * 60 * 60 * 1000),
    });
}
//зробимо запит по емейлу для скидання паролю
export async function requestResetPassword(email) {
    const user = await User.findOne({ email });
    if (user === null) {
        throw new createHttpError.NotFound('User not found');
    }
    //передамо токен на фронтенд
    const token = jwt.sign(
        {
            sub: user._id,
            name: user.name,
        },
        getEnvVar('JWT_SECRET'),
        {
            expiresIn: '15m',
        },
    );
    const templateboo = Handlebars.compile(RESET_PASSWORD_TEMPLATE);
    //отримаємо лист по шаблону
    await sendMail(
        user.email,
        'Reset password',
        templateboo({ link: `http://localhost:7000/reset-password/?token=${token}` }),
        //    `<p>To reset password, please follow this <a href=""> link </a> </p>`);
    );
}

export async function resetPassword(password, token) {
    try {
        //знайшли користувача, перевірили токен
        const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
        const user = await User.findById(decoded.sub);
        //якщо він є...
        if (user === null) {
            throw new createHttpError.NotFound('User not found');
        }
        //хешуємо пароль в бд
        const hashedPassword = await bcrypt.hash(password, 10);
        //змінимо пароль кристуувача
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    } catch (error) {
        if (error.name === 'JsonTokenError') {
            throw new createHttpError.Unauthorized('Token is unauthorized');
        }
        if (error.name === 'TokenExpiredError') {
            throw new createHttpError.Unauthorized('Token is expired');
        }
        throw error;
    }
}
