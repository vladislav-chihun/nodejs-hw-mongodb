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
  console.log(session);
  res.send({
    statusd: 200,
    message: 'Login successfull',
    data: { accessToken: session.accessToken },
  });
}
export { register, login };
