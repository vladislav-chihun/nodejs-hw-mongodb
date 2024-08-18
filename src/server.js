import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import authRoutes from './routers/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/contacts.js';
const PORT = process.env.PORT || 3000;

function setupServer() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use(cors());

  app.use(pino());
  app.use(router);

  app.use(authRoutes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.get('/', (req, res) => {
    res.send('Success');
  });

  app.use('*', (req, res, next) => {
    res.status(404).send({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export { setupServer };
