import * as fs from 'node:fs/promises';
import path from 'node:path';
import { getEnvVar } from '../utils/getEnvVar.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
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
        message: 'Hello, My World! Its CRUD, Pagination and Auth',
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
        const contact = await getContactById(contactId, req.user.id);

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
    const contact = await deleteContactByid(contactId, req.user.id);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    res.status(204).send();
};

//POST/create
export const createContactsController = async (req, res) => {
    //for cloud
    let avatarBoo = null;
    //якщо завантажуємо картинку в хмару
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
        const result = await uploadToCloudinary(req.file.path);
        //видалим нашу картинку, а рез-т запишемо в змінну аватарсС
        await fs.unlink(req.file.path);

        avatarBoo = result.secure_url;
    } else {
        //for local
        //   інакше змінимо шлях завантаження фото з tmp в папку avatars:
        await fs.rename(req.file.path, path.resolve('src', 'uploads', 'avatars', req.file.filename));

        avatarBoo = `http://localhost:7000/avatars/${req.file.filename}`;
    }
    const contact = await createContact({
        ...req.body,
        userId: req.user.id,
        avatarBoo,
    });

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};
//POST
// export const createContactsController = async (req, res) => {
//     const contact = await createContact({ ...req.body, userId: req.user.id });
//     res.status(201).json({
//         status: 201,
//         message: `Successfully created a contact!`,
//         data: contact,
//     });
// };

//PATCH
export const updateContactsController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body, req.user.id);
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
    try {
        const { contactId } = req.params;
        const result = await upsertContact(contactId, req.body, req.user.id);

        if (!result) {
            next(createHttpError(404, 'Contact not found'));
            return;
        }

        res.status(result.updatedExisting ? 200 : 201).json({
            status: result.updatedExisting ? 200 : 201,
            message: `Successfully upserted a contact!`,
            data: result.value,
        });
    } catch (error) {
        next(error);
    }
};
