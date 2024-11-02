import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  resetPasswordController,
  requestPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  requestPasswordSchema,
} from '../validation/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post('/register', jsonParser, validateBody(registerSchema), ctrlWrapper(registerController));
router.post('/login', jsonParser, validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/logout', ctrlWrapper(logoutController));
router.post('/refresh', ctrlWrapper(refreshController));
router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(requestPasswordSchema),
  ctrlWrapper(requestPasswordController),
);

export default router;
