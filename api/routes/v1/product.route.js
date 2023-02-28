import express from 'express';
import { get, create, update, deleteProduct, patch,
  uploadProductImage, getAllProductImages, getProductImageById,
  deleteProductImage,
} from '../../controllers/product.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import requestValidationMiddleware from '../../middlewares/validation.middleware.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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

router.route('/:productId/image')
    .post(authMiddleware(), upload.single('file'), uploadProductImage)
    .get(authMiddleware(), getAllProductImages);

router.route('/:productId/image/:imageId')
    .get(authMiddleware(), getProductImageById)
    .delete(authMiddleware(), deleteProductImage);

export default router;
