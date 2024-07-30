import pino from 'pino-http';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import errorHandler from './middlewares/errorHandler.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/contacts.js';
const PORT = process.env.PORT || 3000;

function setupServer() {
  const app = express();

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.use(express.json());

  app.use(cors());

  app.use(pino());

  app.get('/', (req, res) => {
    res.send('Success');
  });

  app.use('*', (req, res, next) => {
    res.status(404).send({ message: 'Not found' });
  });

  app.use((error, req, res, next) => {
    res.status(500).send('Iternal Server Error');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export { setupServer };
