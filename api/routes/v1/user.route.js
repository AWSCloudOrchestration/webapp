import express from 'express';
import { createUser, getUserInfo, updateUser } from '../../controllers/user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();

router
    .route('/')
    .post(createUser)

router
    .route('/:userId')
    .get(authMiddleware(), getUserInfo)
    .put(authMiddleware(), updateUser);

export default router;