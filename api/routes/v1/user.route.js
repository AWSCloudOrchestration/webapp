import express from 'express';
import { createUser, getUserInfo, updateUser } from '../../controllers/user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import requestValidationMiddleware from '../../middlewares/validation.middleware.js';
import { getUserById, update } from '../../validations/v1/user.validations.js';

const router = express.Router();

router
    .route('/')
    .post(createUser);

router
    .route('/:userId')
    .get(authMiddleware(), requestValidationMiddleware(getUserById), getUserInfo)
    .put(authMiddleware(), requestValidationMiddleware(update), updateUser);

export default router;
