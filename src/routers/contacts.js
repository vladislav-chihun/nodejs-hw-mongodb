import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getContactById } from '../services/contacts.js';
import { getContacts } from '../controllers/contacts.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactId', ctrlWrapper(getContactById));

export default router;
