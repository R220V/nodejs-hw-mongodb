import * as fs from 'node:fs/promises';
import path from 'node:path';
import { getEnvVar } from '../utils/getEnvVar.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getAllContacts, getContactById, deleteContactByid, createContact, updateContact, upsertContact } from '../services/contacts.js';

import { parseSortParams } from '../utils/parseSortParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import createHttpError from 'http-errors';

export const helloRoute = (req, res) => {
    res.json({
        message: 'Hello, My World! Its CRUD, Pagination, Auth, email and images!',
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
export const createContactsController = async (req, res, next) => {
    try {
  const APP_DOMAIN = getEnvVar('APP_DOMAIN');

        console.log('req.file:', req.file);
        console.log('req.body:', req.body);

        //for cloud
        let photo = null;

if (req.file) {      
        //якщо завантажуємо картинку в хмару
        if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
            const result = await uploadToCloudinary(req.file.path);
            //видалим нашу картинку, а рез-т запишемо в змінну фото
            await fs.unlink(req.file.path);

            photo = result.secure_url;
        } else {
            //for local
          //інакше змінимо шлях завантаження фото з tmp в папку фото:
            await fs.rename(req.file.path, path.resolve('src', 'uploads', 'photo', req.file.filename));

            photo = `${APP_DOMAIN}/photo/${req.file.filename}`;
        }};
        const contact = await createContact({
            ...req.body,
            userId: req.user.id,
            photo,
        });

        res.status(201).json({
            status: 201,
            message: `Successfully created a contact!`,
            data: contact,
        });
    } catch (error) {
        console.error('Error in createContactsController:', error);
        next(error);
    }
};

//PATCH
export const updateContactsController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        let photo = null;

        if (req.file) {
            const APP_DOMAIN = getEnvVar('APP_DOMAIN');

            if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
                // Завантажуєм нове фото в Cloud
                const result = await uploadToCloudinary(req.file.path);
                // Видаляєм тимчасовий файл
                await fs.unlink(req.file.path);

                photo = result.secure_url;

            } else {
                // Локальне збереження
                await fs.rename(req.file.path, path.resolve('src', 'uploads', 'photo', req.file.filename));
                photo = `${APP_DOMAIN}/photo/${req.file.filename}`;
            }
        }

        // Формуємо оновлені дані
        const updatedData = {
            ...req.body,
            ...(photo && { photo }), //якщо є нове фото-оновимо
        };

        const result = await updateContact(contactId, updatedData, req.user.id);

        if (!result) {
            next(createHttpError(404, 'Contact not found'));
            return;
        }

        res.json({
            status: 200,
            message: `Successfully updated a contact!`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
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
