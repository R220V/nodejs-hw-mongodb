import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { 
    registerSchema, 
    loginSchema, 
    SendResetEmailSchema, 
    resetPwdSchema, 
    confirmOAuthSchema 
} from '../validation/auth.js';

import {
    registerController,
    loginController,
    logoutController,
    refreshController,
    SendResetEmailController,
    resetPwdController,
    getOAuthController,
    confirmOAuthController
} from '../controllers/auth.controller.js';

const router = express.Router();
const jsonParser = express.json();

router.post('/register', jsonParser, validateBody(registerSchema), ctrlWrapper(registerController));

router.post('/login', jsonParser, validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/send-reset-email', jsonParser, validateBody(SendResetEmailSchema), ctrlWrapper(SendResetEmailController));

//скинемо пароль
router.post('/reset-pwd', jsonParser, validateBody(resetPwdSchema), ctrlWrapper(resetPwdController));

router.get('/get-oauth-url', ctrlWrapper(getOAuthController));

router.post(
  '/confirm-oauth',
  jsonParser,
  validateBody(confirmOAuthSchema),
  ctrlWrapper(confirmOAuthController),
);

export default router;
