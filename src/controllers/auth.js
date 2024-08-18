import { createUser, loginUser } from '../services/auth.js';
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
    httpOnlu: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', req._id, {
    httpOnlu: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    statusd: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
}
export { register, login };
