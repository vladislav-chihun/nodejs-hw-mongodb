import createHttpError from 'http-errors';
import { Contact } from '../models/contact.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  try {
    const contactsQuery = await Contact.find({});
    if (filter.contactType) {
      contactsQuery.where('contactType').equals(filter.contactType);
    }
    const [contactsCount, contacts] = await Promise.all([
      ContactsCollection.find().merge(contactsQuery).countDocuments(),
      contactsQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec(),
    ]);

    const paginationData = calculatePaginationData(
      contactsCount,
      perPage,
      page,
    );

    return {
      data: contacts,
      ...paginationData,
    };
  } catch (error) {
    console.error('Error while fetching contacts:', error);
    throw error;
  }
};

async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error(`Error while fetching contact with id ${contactId}:`, error);
    throw error;
  }
}
async function createContact(contact) {
  try {
    const newContact = await Contact.create(contact);
    return newContact;
  } catch (error) {
    console.error('Error while creating contact:', error);
    throw error;
  }
}

async function updateContact(contactId, contact) {
  try {
    const updatedContact = Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });
    return updatedContact;
  } catch (error) {
    console.error(`Error while updating contact`, error);
    throw error;
  }
}
async function deleteContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  console.log('Contact deleted');
  return contact;
}

export {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
};
