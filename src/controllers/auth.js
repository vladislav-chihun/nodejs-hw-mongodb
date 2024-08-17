import { createUser } from '../services/auth.js';
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
export { register };
