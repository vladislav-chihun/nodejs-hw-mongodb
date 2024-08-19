import createHttpError from 'http-errors';
import { Contact } from '../models/contact.js';
import { SORT_ORDER } from '../constants/index.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  try {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const baseQuery = Contact.find();

    if (filter.contactType) {
      baseQuery.where('contactType').equals(filter.contactType);
    }

    baseQuery.where('userId').equals(userId);

    const contactsCount = await baseQuery.clone().countDocuments();
    console.log('Contacts Count:', contactsCount);

    const contacts = await baseQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    console.log('Contacts:', contacts);

    const paginationData = calculatePaginationData(
      contactsCount,
      perPage,
      page,
    );
    console.log('Pagination Data:', paginationData);

    return {
      data: contacts,
      ...paginationData,
    };
  } catch (error) {
    console.error('Error while fetching contacts:', error);
    throw createHttpError(500, 'Error while fetching contacts');
  }
};

async function getContactById(contactId, userId) {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
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

async function updateContact(contactId, userId, contact) {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      contact,
      { new: true },
    );
    return updatedContact;
  } catch (error) {
    console.error(`Error while updating contact`, error);
    throw error;
  }
}
async function deleteContact(contactId, userId) {
  try {
    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
    console.log('Contact deleted');
    return contact;
  } catch (error) {
    console.error(`Error while deleting contact with id ${contactId}:`, error);
    throw error;
  }
}

export { getContactById, createContact, deleteContact, updateContact };
