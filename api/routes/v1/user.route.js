import express from 'express';
import { createUser, getUserInfo } from '../../controllers/user.controller.js';

const router = express.Router();

router
    .route('/')
    .post(createUser)

router
    .route('/:userId')
    .get(getUserInfo);

export default router;