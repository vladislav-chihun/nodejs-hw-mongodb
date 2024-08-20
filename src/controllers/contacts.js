import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { createContactSchema } from '../validation/contact.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import createHttpError from 'http-errors';

async function getContacts(req, res) {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contactsData = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });
    if (!contactsData || contactsData.length === 0) {
      throw createError(404, 'Contacts not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contactsData,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
}

async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    console.log(contact._id.toString());
    console.log(req.user._id.toString());
    if (contact.userId.toString() !== req.user._id.toString()) {
      return next(createHttpError(403, 'Contacts not allowed'));
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
  const contactField = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user._id,
  };
  const contact = await createContact(contactField);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}
async function updateContactController(req, res, next) {
  try {
    const { contactId } = req.params;

    const updatedContact = await updateContact(
      contactId,
      req.user._id,
      req.body,
    );

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: error.message,
      data: null,
    });
  }
}

async function deleteContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const deletedContact = await deleteContact(contactId);
    if (!deletedContact) {
      res.status(404).send(createError(404, 'Contact not found'));
    }
    console.log('Contact deleted');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export {
  getContacts,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
};
