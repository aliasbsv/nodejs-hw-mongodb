import express from 'express';
import contactRouter from './contacts.js';
import authRouter from './auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.use('/contacts', authenticate, contactRouter);
router.use('/auth', authRouter);

export default router;
