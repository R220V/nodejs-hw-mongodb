import { 
	helloRoute, 
	getContactsController, 
	getContactsByIdController, 
	deleteContactsController, 
	createContactsController,
	updateContactsController,
	upsertContactsController

} from '../controllers/contacts.js';

import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/ValidateBody.js';


const router = Router();

router.get('/', helloRoute);

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', isValidID, ctrlWrapper(getContactsByIdController));

router.delete('/contacts/:contactId', isValidID, ctrlWrapper(deleteContactsController));

router.post('/contacts', validateBody, ctrlWrapper(createContactsController));

router.patch('/contacts/:contactId', validateBody, isValidID, ctrlWrapper(updateContactsController));

router.put('/contacts/:contactId', isValidID, ctrlWrapper(upsertContactsController));

export default router;