import { ContactsCollection } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const deleteContactByid = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};

export const createContact = async( payload) => {
  try {
const contact = await ContactsCollection.create(payload);
return contact;
  } catch (error) {
    console.error('Помилка при створенні контакту:', error.message);
    throw error;
}
};
