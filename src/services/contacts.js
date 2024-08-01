import createHttpError from 'http-errors';
import { Contact } from '../models/contact.js';

async function getAllContacts() {
  try {
    const contacts = await Contact.find({});
    return contacts;
  } catch (error) {
    console.error('Error while fetching contacts:', error);
    throw error;
  }
}

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
async function deleteContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  console.log('Contact deleted');
  return contact;
}

export { getAllContacts, getContactById, createContact, deleteContact };
