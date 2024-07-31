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

export { getAllContacts, getContactById };
