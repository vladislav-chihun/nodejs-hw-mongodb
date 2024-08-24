import {
  createUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
  resetPassword,
} from '../services/auth.js';
async function register(req, res, next) {
  const user = await createUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: user.name,
      email: user.email,
      id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const session = await loginUser(email, password);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
}
async function logout(req, res) {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
}
async function refresh(req, res, next) {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    return res.status(401).json({
      status: 401,
      message: 'UnauthorizedError',
      data: {
        message: 'Missing sessionId or refreshToken',
      },
    });
  }

  const session = await refreshUserSession({
    sessionId,
    refreshToken,
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

async function requestResetEmailController(req, res, next) {
  await requestResetEmail(req.body.email);
  res.send({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

async function resetPasswordController(req, res, next) {
  const { password, token } = req.body;

  await resetPassword(password, token);
  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}

export {
  register,
  login,
  logout,
  refresh,
  requestResetEmailController,
  resetPasswordController,
};
