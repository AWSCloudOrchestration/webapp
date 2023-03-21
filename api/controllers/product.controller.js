import catchAsync from '../utils/catchAsync.js';
import ProductService from '../services/product.service.js';
import responseHandler from '../utils/responseHandler.js';

export const create = catchAsync(async (req, res) => {
  const { body, user: { id } } = req;
  const product = await ProductService.createProduct(body, id);
  responseHandler(req, res, product, 201);
});

export const get = catchAsync(async (req, res) => {
  const { params: { productId } } = req;
  const product = await ProductService.getProduct(productId);
  responseHandler(req, res, product);
});

export const update = catchAsync(async (req, res) => {
  const { params: { productId }, body } = req;
  await ProductService.updateProduct(productId, body);
  responseHandler(req, res, null, 204);
});

export const deleteProduct = catchAsync(async (req, res) => {
  const { params: { productId } } = req;
  await ProductService.deleteProduct(productId);
  responseHandler(req, res, null, 204);
});

export const patch = catchAsync(async (req, res) => {
  const { params: { productId }, body } = req;
  await ProductService.patchProduct(productId, body);
  responseHandler(req, res, null, 204);
});

export const uploadProductImage = catchAsync(async (req, res) => {
  const { file, params: { productId } } = req;
  const image = await ProductService.addProductImage(file, productId);
  responseHandler(req, res, image, 201);
});

export const getAllProductImages = catchAsync(async (req, res) => {
  const { params: { productId } } = req;
  const images = await ProductService.getAllProductImages(productId);
  responseHandler(req, res, images);
});

export const getProductImageById = catchAsync(async (req, res) => {
  const { params: { imageId } } = req;
  const image = await ProductService.getProductImageById(imageId);
  responseHandler(req, res, image);
});

export const deleteProductImage = catchAsync(async (req, res) => {
  const { params: { imageId } } = req;
  await ProductService.deleteProductImage(imageId);
  responseHandler(req, res, null, 204);
});
