import { ContactsCollection } from '../models/contacts.js';

//GET
export const getAllContacts = async ({ page, perPage, sortBy, sortOrder }) => {
    const skip = page > 0 ? (page - 1) * perPage : 0;

    const [total, contacts] = await Promise.all([
        ContactsCollection.countDocuments(),
        ContactsCollection.find().sort({[sortBy]:sortOrder}).skip(skip).limit(perPage),
    ]);

    console.log({ total, contacts });

    const totalPages = Math.ceil(total / perPage);

    return {
        contacts,
        total,
        page,
        perPage,
        total,
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
