import express from 'express';
import router from './routers/contacts.js';
const app = express();

app.use(router);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  res.status(500).send({ message: 'Iternal server error' });
});

export default app;
