import { Router } from 'express';
import { getContactById, getContacts } from '../controllers/contacts.js';

const router = Router();

router.get('/contacts', getContacts);

router.get('/contacts/:contactId', getContactById);

export default router;
