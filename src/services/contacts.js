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

async function createContact(contactData) {
  try {
    const newContact = new Contact(contactData);
    await newContact.save();
    return newContact;
  } catch (error) {
    console.error('Error while creating a new contact:', error);
    throw error;
  }
}

async function updateContact(contactId, contactData) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      contactData,
      { new: true },
    );
    return updatedContact;
  } catch (error) {
    console.error(`Error while updating contact with id ${contactId}:`, error);
    throw error;
  }
}

async function deleteContact(contactId) {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    console.error(`Error while deleting contact with id ${contactId}:`, error);
    throw error;
  }
}

export {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
