import { Router } from 'express';
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactByIdController,
  getContacts,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contacts.js';

const jsonPARSE = express.json();

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({ status: 200, message: 'Success' });
});
router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', jsonPARSE, ctrlWrapper(createContactController));

router.patch(
  '/contacts/:contactId',
  jsonPARSE,
  ctrlWrapper(updateContactController),
);

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
