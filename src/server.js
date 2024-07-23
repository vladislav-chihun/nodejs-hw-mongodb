import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import 'dotenv/config';
import { Contact } from './models/contact.js';

const PORT = process.env.PORT || 3000;

function setupServer() {
  const app = express();

  app.use(cors());

  app.use(pino());

  app.get('/', (req, res) => {
    res.send('Success');
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.send({
        status: res.statusCode,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.log(error);
      res.status('500').send('Iteranl Server Error');
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await Contact.findById(contactId);
      console.log({ contact });
      if (!contact) {
        res.status(404).json({
          message: 'Contact not found',
        });
        return;
      }
      res.send({
        status: res.statusCode,
        message: 'Successfully found contacts!',
        data: contact,
      });
    } catch (error) {
      console.log(error);
      res.send({
        message: 'Contact not found',
      });
      res.status('500').send('Iteranl Server Error');
    }
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
