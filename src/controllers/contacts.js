import { getAllContacts, getContactById } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const helloRoute = (req, res) => {
	res.json({
	message: 'Hello, My World! Its CRUD',
  });
};


export const getContactsController = async (req, res, next) => {
	try {
	const contacts = await getAllContacts();
	res.status(200).json({
	  status:200,
	  message: `Successfully found all contacts`, data: contacts,
	});
	} catch (error) {
	next(error);	
	}
  };


  export const getContactsByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);   
    
	if (!contact) {
	//   res.status(404).json({
	// 	  message: 'Contact not found'
	//   });
	next(new Error('Contact not found'));
	  return;
	}
    res.status(200).json({
		status:200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  };