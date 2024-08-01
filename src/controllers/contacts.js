import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

async function getContacts(req, res) {
  try {
    const contacts = await getAllContacts();
    if (!contacts || contacts.length === 0) {
      throw createError(404, 'Contacts not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
}

async function getContactByIdController(req, res) {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
}
async function createContactController(req, res, next) {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  console.log(contact);
  console.log('Contact created');
  const newContact = await createContact(contact);
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

async function deleteContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    await deleteContact(contactId);
    console.log('Contact deleted');
    res.status(204).send();
  } catch {
    res.send(createHttpError(404, 'Contact not found'));
  }
}

export {
  getContacts,
  getContactByIdController,
  createContactController,
  deleteContactController,
};
