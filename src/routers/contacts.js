import { Router } from 'express';
import { helloRoute, getContactsController, getContactsByIdController } from '../controllers/contacts.js';

const router = Router();

router.get('/', helloRoute);
router.get('/contacts', getContactsController);
router.get('/contacts/:contactId', getContactsByIdController );

export default router;