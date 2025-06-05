import {
    helloRoute,
    getContactsController,
    getContactsByIdController,
    deleteContactsController,
    createContactsController,
    updateContactsController,
    upsertContactsController,
} from '../controllers/contacts.js';

import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';

const router = Router();

router.get('/', helloRoute);

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', isValidID, ctrlWrapper(getContactsByIdController));

router.delete('/contacts/:contactId', isValidID, ctrlWrapper(deleteContactsController));

router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactsController));

router.patch(
    '/contacts/:contactId',
    validateBody(updateContactSchema),
    isValidID,
    ctrlWrapper(updateContactsController),
);

router.put('/contacts/:contactId', validateBody(createContactSchema), isValidID, ctrlWrapper(upsertContactsController));

export default router;
