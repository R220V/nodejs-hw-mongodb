
import { getAllContacts, getContactById, deleteContactByid, createContact, updateContact} from '../services/contacts.js';
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
    throw createHttpError('Contact not found');
	}
    res.status(200).json({
		status:200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  };

  export const deleteContactsController = async (req, res) => {
		const {contactId} = req.params;

	const result= await deleteContactByid(contactId);

	if (!contactId) {
    throw new createHttpError.NotFound('fignya');
  }
		res
		.status(200)
		.json({
			status: 200,
			message: `Delete contacts with id ${contactId}`
		})
	//	// res.status(204).end();
  }

  export const  createContactsController = async ( req, res) => {
 const contact = await createContact(req.body);
	 res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
  };

  export const updateContactsController = async (req, res, next) =>{
	const {contactId} = req.params;
	const result = await updateContact(contactId, req.body);
	 if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully updated a contact!`,
    data: result,
  });
};
