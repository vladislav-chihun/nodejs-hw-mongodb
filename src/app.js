import express from 'express';

import { Contact } from './models/contact.js';
const app = express();

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

app.use((req, res, next) => {
  res.status(404).send({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  res.status(500).send({ message: 'Iternal server error' });
});

export default app;
