import express from 'express';
import {authenticate} from '../middlewares/authenticate.js';
import authRoutes from './auth.js';
import contactsRoutes from './contacts.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', authenticate, contactsRoutes);

export default router;

