import express from 'express';
import { register, login, logout, refresh } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validUserSchema, loginSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/auth/register',
  jsonParser,
  validateBody(validUserSchema),
  ctrlWrapper(register),
);

router.post(
  '/auth/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(login),
);
router.post('/auth/logout', ctrlWrapper(logout));
router.post('/auth/refresh', ctrlWrapper(refresh));

export default router;
