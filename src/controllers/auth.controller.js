
import { registerUser, loginUser, logoutUser, refreshSession, sendResetEmail, resetPwd, loginOrRegister } from '../services/auth.service.js';

import { getOAuthURL, validateCode} from '../utils/googleOAuth.js';

export async function registerController(req, res) {
    const user = await registerUser(req.body);

    res.status(201).json({ status: 201, message: 'Successfully registered a user!', data: user });
}

export async function loginController(req, res) {
    const session = await loginUser(req.body.email, req.body.password);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken,
        },
    });
}

export async function logoutController(req, res) {
    const { sessionId } = req.cookies;

    if (typeof sessionId === 'string') {
        await logoutUser(sessionId);
    }
    //почистимо кукі перед закінченням сесії
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).end();
}
//оновимо сесію
export async function refreshController(req, res) {
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshSession(sessionId, refreshToken);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
        },
    });
}

export async function SendResetEmailController(req, res) {
    const { email } = req.body;

    await sendResetEmail(email);
    // console.log(email);

    res.json({
        status: 200,
        message: 'Reset password email has been successfully send.',
        data: {},
    });
}

export async function resetPwdController(req, res) {
    const { password, token } = req.body;

    // console.log({password, token});

    await resetPwd(password, token);
    res.send({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
    });
}

//викликаємо метод і контролер повертає лінку
export function getOAuthController(req, res) {
    const url = getOAuthURL();

    res.json({
        status: 200,
        message: 'Successfully get OAuth url',
        data: {
            oauth_url: url,
        },
    });
};


export async function confirmOAuthController(req, res) {
    // console.log(req.body.code);
    // console.log('Body:', req.body);
    // console.log('Headers:', req.headers);
    // console.log('Query params:', req.query);

    const ticket = await validateCode(req.body.code)

// console.log(ticket);

const session = await loginOrRegister(
    ticket.payload.email, 
    ticket.payload.name)

     res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.json({
        status: 200,
        message: 'Login with google successfully',
        data: {
            accessToken: session.accessToken,
        },
    })
};