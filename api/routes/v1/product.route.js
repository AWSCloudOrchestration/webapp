import express from 'express';
import { get, create, update, deleteProduct, patch,
  uploadProductImage, getAllProductImages, getProductImageById,
  deleteProductImage,
} from '../../controllers/product.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import productAuthMiddleware from '../../middlewares/product.auth.middleware.js';
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
    .put(authMiddleware(), requestValidationMiddleware(updateProduct), productAuthMiddleware(), update)
    .delete(authMiddleware(), requestValidationMiddleware(deleteByProductId), productAuthMiddleware(), deleteProduct)
    .patch(authMiddleware(), requestValidationMiddleware(patchProduct), productAuthMiddleware(), patch);

router.route('/:productId/image')
    .post(authMiddleware(), requestValidationMiddleware(uploadImage), upload.single('file'), uploadProductImage)
    .get(authMiddleware(), requestValidationMiddleware(getAllImages), productAuthMiddleware(), getAllProductImages);

router.route('/:productId/image/:imageId')
    .get(authMiddleware(), requestValidationMiddleware(getImage), productAuthMiddleware(), getProductImageById)
    .delete(authMiddleware(), requestValidationMiddleware(deleteImage), productAuthMiddleware(), deleteProductImage);

export default router;
