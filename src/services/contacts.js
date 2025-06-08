import { ContactsCollection } from '../models/contacts.js';

//GET
export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter, userId }) => {
    const skip = page > 0 ? (page - 1) * perPage : 0;

const fullFilter = { ...filter, userId };
const contactsQuery = ContactsCollection.find(fullFilter);


    const [totalItems, data] = await Promise.all([
        ContactsCollection.countDocuments(filter),
        contactsQuery.sort({[sortBy]:sortOrder}).skip(skip).limit(perPage),
    ]);

    // console.log({ totalItems, data });

    const totalPages = Math.ceil(totalItems / perPage);
  
    return {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasNextPage: totalPages > page,
        hasPreviousPage: page > 1,
    };
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
export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

//PATCH
export const updateContact = async (contactId, payload) => {
    const contact = await ContactsCollection.findByIdAndUpdate(contactId, payload, { new: true });
    return contact;
};

//PUT
export const upsertContact = async (contactId, contact) => {
    const result = await ContactsCollection.findByIdAndUpdate(contactId, contact, {
        new: true,
        upsert: true,
        includeResultMetadata: true,
    });
    return {
        value: result.value,
        updatedExisting: !result,
    };
};
