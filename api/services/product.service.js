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
 *
 * @param {String} id
 * @param {Object} user
 */
const deleteProduct = async (id, user) => {
  const ProductModel = getModelInstance('products');
  await checkIfUserIsForbidden(id, user);
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
  await checkIfUserIsForbidden(productId, user);
  const ImageModel = getModelInstance('images');
  const key = uuidv4();
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  // Upload to S3
  const { Location } = await s3Client.uploadFile(key, bucket, file);
  const { mimetype } = file;
  const fileFormat = mimetype.split('/')[1];
  const image = await ImageModel.create({
    file_name: `${key}.${fileFormat}`,
    s3_bucket_path: Location,
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

const getProductImageById = async (productId, imageId, user) => {
  await checkIfUserIsForbidden(productId, user);
  const ImageModel = getModelInstance('images');
  const image = await ImageModel.findOne({ where: { image_id: imageId } });
  return image;
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
};
