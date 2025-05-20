// import { ContactsCollection } from '../models/contact.js';

// export const getAllContacts = async () => {
//   const contacts = await ContactsCollection.find();
//   return contacts;
// };

// export const getContactById = async (contactId) => {
//   const contact = await ContactsCollection.findById(contactId);
//   return contact;
// };

// export const createContact = async (payload) => {
//   const contact = await ContactsCollection.create(payload);
//   return contact;
// };

// export const updateContact = async (contactId, payload, options = {}) => {
//   const result = await ContactsCollection.findByIdAndUpdate(
//     {
//       _id: contactId,
//     },
//     payload,
//     { new: true, includeResultMetadata: true, ...options },
//   );

//   if (!result || !result.value) return null;

//   return {
//     contact: result.value,
//     isNew: Boolean(result?.lastErrorObject.upserted),
//   };
// };

// export const deleteContact = async (contactId) => {
//   const contact = await ContactsCollection.findOneAndDelete({
//     _id: contactId,
//   });

//   return contact;
// };


import { StudentsCollection } from '../models/students.js';

export const getAllStudents = async () => {
  const students = await StudentsCollection.find();
  return students;
};

export const getStudentById = async (studentId) => {
  const student = await StudentsCollection.findById(studentId);
  return student;
};
