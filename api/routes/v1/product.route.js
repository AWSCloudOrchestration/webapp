import express from 'express';
import { get, create, update, deleteProduct, patch,
  uploadProductImage, getAllProductImages, getProductImageById,
  deleteProductImage,
} from '../../controllers/product.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import requestValidationMiddleware from '../../middlewares/validation.middleware.js';
import multer from 'multer';
import { getProductById,
  updateProduct,
  createProduct,
  patchProduct,
  deleteByProductId,
  uploadImage,
  getAllImages,
  getImage,
  deleteImage,
} from '../../validations/v1/product.validations.js';
// Multer
const upload = multer({ dest: '/tmp/uploads' });

const router = express.Router();

router.route('/')
    .post(authMiddleware(), requestValidationMiddleware(createProduct), create);

router.route('/:productId')
    .get(requestValidationMiddleware(getProductById), get)
    .put(authMiddleware(), requestValidationMiddleware(updateProduct), update)
    .delete(authMiddleware(), requestValidationMiddleware(deleteByProductId), deleteProduct)
    .patch(authMiddleware(), requestValidationMiddleware(patchProduct), patch);

router.route('/:productId/image')
    .post(authMiddleware(), requestValidationMiddleware(uploadImage), upload.single('file'), uploadProductImage)
    .get(authMiddleware(), requestValidationMiddleware(getAllImages), getAllProductImages);

router.route('/:productId/image/:imageId')
    .get(authMiddleware(), requestValidationMiddleware(getImage), getProductImageById)
    .delete(authMiddleware(), requestValidationMiddleware(deleteImage), deleteProductImage);

export default router;
