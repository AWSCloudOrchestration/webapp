import express from 'express';
import { get, create, update, deleteProduct, patch } from '../../controllers/product.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import requestValidationMiddleware from '../../middlewares/validation.middleware.js';
import { getProductById,
  updateProduct,
  createProduct,
  patchProduct,
  deleteByProductId } from '../../validations/v1/product.validations.js';

const router = express.Router();

router.route('/')
    .post(authMiddleware(), requestValidationMiddleware(createProduct), create);

router.route('/:productId')
    .get(requestValidationMiddleware(getProductById), get)
    .put(authMiddleware(), requestValidationMiddleware(updateProduct), update)
    .delete(authMiddleware(), requestValidationMiddleware(deleteByProductId), deleteProduct)
    .patch(authMiddleware(), requestValidationMiddleware(patchProduct), patch);

export default router;
