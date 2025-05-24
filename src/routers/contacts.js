import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { 
	helloRoute, 
	getContactsController, 
	getContactsByIdController, deleteContactsController, 
	createContactsController,
	updateContactsController,
	upsertContactsController

} from '../controllers/contacts.js';


const router = Router();

router.get('/', helloRoute);

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactsByIdController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactsController));

router.post('/contacts', ctrlWrapper(createContactsController));

router.patch('/contacts/:contactId', ctrlWrapper(updateContactsController));

router.put('/contacts/:contactId', ctrlWrapper(upsertContactsController));

export default router;