import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getContactByIdController } from '../controllers/contacts.js';
import { getContacts } from '../controllers/contacts.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({ status: 200, message: 'Success' });
});
router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

export default router;
