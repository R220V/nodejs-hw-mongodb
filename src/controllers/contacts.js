import {
    getAllContacts,
    getContactById,
    deleteContactByid,
    createContact,
    updateContact,
    upsertContact,
} from '../services/contacts.js';

import { parseSortParams } from '../utils/parseSortParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import createHttpError from 'http-errors';


export const helloRoute = (req, res) => {
    res.json({
        message: 'Hello, My World! Its CRUD, Pagination and Auth'
    });
};


//GET
export const getContactsController = async (req, res, next) => {

    console.log(req.user);

    try {
        const { page, perPage } = parsePaginationParams(req.query);
        // console.log({ page, perPage });

        const { sortBy, sortOrder } = parseSortParams(req.query);
        // console.log({ sortBy, sortOrder });

        const filter = parseFilterParams(req.query);
        // console.log(filter);


        const contactsResult = await getAllContacts({ page, perPage, sortBy, sortOrder, filter, userId: req.user.id });


        res.status(200).json({
            status: 200,
            message: `Successfully found all contacts`,
            data: contactsResult,
        });
    } catch (error) {
        next(error);
    }
};

//GETID
export const getContactsByIdController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        if (!contact) {
            throw createHttpError(404, 'Contact not found');
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

//DELETE
export const deleteContactsController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContactByid(contactId);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    res.status(204).send();
};

//POST
export const createContactsController = async (req, res) => {
    const contact = await createContact({ ...req.body, userId: req.user.id });
    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};

//PATCH
export const updateContactsController = async (req, res, next) => {
    const { contactId } = req.params;
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

//PUT
export const upsertContactsController = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await upsertContact(contactId, req.body, {
        upsert: true,
    });

    if (!result) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully upserted a contact!`,
        data: result.contact,
    });
};
