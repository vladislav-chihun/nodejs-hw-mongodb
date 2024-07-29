import pino from 'pino-http';
import cors from 'cors';
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

function setupServer() {
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
