import { registerUser, loginUser, logoutUser, refreshSession, requestResetPassword, resetPassword } from '../services/auth.service.js';

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

export async function requestResetPasswordController(req, res) {
    const { email } = req.body;

    await requestResetPassword (email)
    console.log(email);

    res.json({status: 200, message: "Reset password email sent succesfully"});
}

export async function resetPasswordController(req, res) {
    const { password, token } = req. body; 
    
    // console.log({password, token});

    await resetPassword(password, token)
    res.send({status: 200, message: "Password reset succesfully"});
};