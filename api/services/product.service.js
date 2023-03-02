import getModelInstance from '../../db/sql/getModelInstance.js';
import _ from 'lodash';
import AppError from '../utils/AppError.js';
import s3Client from '../../s3/index.js';
import { v4 as uuidv4 } from 'uuid';


/**
 * Create product
 * @param {Object} productBody
 * @returns {Object} product
 */
const createProduct = async (productBody, ownerUserId) => {
  const ProductModel = getModelInstance('products');
  const existingProductSku = await ProductModel.findOne({ where: { sku: productBody.sku } });
  if (existingProductSku) throw new AppError('sku must be unique', 400);
  const product = await ProductModel.create({
    name: productBody.name,
    description: productBody.description,
    sku: productBody.sku,
    manufacturer: productBody.manufacturer,
    quantity: productBody.quantity,
    owner_user_id: ownerUserId,
  });
  return product;
};

/**
 * Get product by id
 * @param {String} id
 * @returns {Object} product
 */
const getProduct = async (id) => {
  const ProductModel = getModelInstance('products');
  const product = await ProductModel.findOne({ where: { id } });
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

const forbiddenResourceCondition = (productExistingInfo, user) => (+(_.get(productExistingInfo, 'owner_user_id')) !== +(_.get(user, 'id')));

/**
 * Check if requesting user has access to update product
 * @param {String} id productId
 * @param {Object} user
 */
const checkIfUserIsForbidden = async (id, user) => {
  const ProductModel = getModelInstance('products');
  const productExistingInfo = await ProductModel.findOne({ where: { id } });
  // Check if product is in db
  if (!productExistingInfo) throw new AppError('Product not found', 404);
  if (forbiddenResourceCondition(productExistingInfo, user)) throw new AppError('Forbidden resource', 403);
};

/**
 * Update product
 * @param {String} id
 * @param {Object} productBody
 * @param {Object} user
 * @returns {Object}
 */
const updateProduct = async (id, productBody, user) => {
  const ProductModel = getModelInstance('products');
  await checkIfUserIsForbidden(id, user);
  await ProductModel.update({ ...productBody }, { where: { id } }).catch((err) => {
    if (_.get(err, 'parent.errno') === 1062) throw new AppError('sku must be unique', 400);
  });
  const product = await ProductModel.findOne({ where: { id } });
  return product;
};

/**
 * Delete all objects from s3 for the product
 * @param {Object} images
 */
const deleteAllAssociatedS3Objects = async (images) => {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  const keys = _.map(images, (image) => {
    return { 'Key': image.s3_bucket_path };
  });
  await s3Client.deleteObjects(keys, bucket);
};

/**
 * Delete product
 * @param {String} id
 * @param {Object} user
 */
const deleteProduct = async (id, user) => {
  const ProductModel = getModelInstance('products');
  const ImageModel = getModelInstance('images');
  await checkIfUserIsForbidden(id, user);
  const images = await ImageModel.findAll({ where: { product_id: id } });
  // Delete all images associated with the product
  await deleteAllAssociatedS3Objects(images);
  await ImageModel.destroy({ where: { product_id: id } });
  await ProductModel.destroy({ where: { id } });
};

/**
 * Patch product info
 * @param {String} id
 * @param {Object} productBody
 * @param {Object} user
 * @returns {Object}
 */
const patchProduct = async (id, productBody, user) => {
  const updateBody = {};
  const ProductModel = getModelInstance('products');
  await checkIfUserIsForbidden(id, user);
  _.forEach(productBody, (value, key) => {
    if (_.isEmpty(value)) return;
    updateBody[key] = value;
  } );
  await ProductModel.update(updateBody, { where: { id } }).catch((err) => {
    if (_.get(err, 'parent.errno') === 1062) throw new AppError('sku must be unique', 400);
  });
  const product = await ProductModel.findOne({ where: { id } });
  return product;
};

/**
 * Add image for product
 * @param {Object} file
 * @param {String} productId
 * @returns
 */
const addProductImage = async (file, productId, user) => {
  if (_.isEmpty(file)) throw new AppError('No file data provided', 400);
  await checkIfUserIsForbidden(productId, user);
  const ImageModel = getModelInstance('images');
  const uniqKey = uuidv4();
  const key = `${uniqKey}/${file.originalname}`;
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  // Upload to S3
  await s3Client.uploadFile(key, bucket, file);
  const image = await ImageModel.create({
    file_name: file.originalname,
    s3_bucket_path: key,
    product_id: productId,
  });
  return image;
};

/**
 * Get all images for product
 * @param {String} productId
 * @param {String} ownerUserId
 * @returns
 */
const getAllProductImages = async (productId, user) => {
  await checkIfUserIsForbidden(productId, user);
  const ImageModel = getModelInstance('images');
  const image = await ImageModel.findAll({ where: { product_id: productId } });
  return image;
};

/**
 * Get product image by id
 * @param {String} productId
 * @param {String} imageId
 * @param {Object} user
 * @returns {Object}
 */
const getProductImageById = async (productId, imageId, user) => {
  await checkIfUserIsForbidden(productId, user);
  const ImageModel = getModelInstance('images');
  const image = await ImageModel.findOne({ where: { image_id: imageId } });
  if (!image) throw new AppError('Not Found', 404);
  return image;
};

/**
 * Delete product image
 * @param {String} productId
 * @param {String} imageId
 * @param {Object} user
 */
const deleteProductImage = async (productId, imageId, user) => {
  await checkIfUserIsForbidden(productId, user);
  const ImageModel = getModelInstance('images');
  const image = await ImageModel.findOne({ where: { image_id: imageId } });
  if (!image) throw new AppError('Not Found', 404);
  await ImageModel.destroy({ where: { image_id: imageId } });
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  await s3Client.deleteObject(_.get(image, 's3_bucket_path'), bucket);
};

export default {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  patchProduct,
  addProductImage,
  getAllProductImages,
  getProductImageById,
  deleteProductImage,
};
