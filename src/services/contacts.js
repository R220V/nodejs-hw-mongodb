import { ContactsCollection } from '../models/contacts.js';

//GET
export const getAllContacts = async ({page, perPage}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

ContactsCollection.countDocuments();

  const contacts = await ContactsCollection.find().skip(skip).limit(perPage);
  return contacts;
};

//GET_ID
export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

//DELETE
export const deleteContactByid = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};

//POST
export const createContact = async( payload) => {
const contact = await ContactsCollection.create(payload);
return contact;
};

//PATCH
export const updateContact = async(contactId, payload) => {
  const contact = await ContactsCollection.findByIdAndUpdate(contactId, payload, {new: true});
  return contact;
};


//PUT
export const upsertContact = async(contactId, contact)=> {
  const  result = await ContactsCollection.findByIdAndUpdate(contactId,         contact, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
     });
     return {
      value: result.value,
      updatedExisting: !result
     }
};