import getModelInstance from '../../db/sql/getModelInstance.js';
import _ from 'lodash';
import AppError from '../utils/AppError.js';

/**
 * Create product
 * @param {Object} productBody
 * @returns {Object} product
 */
const createProduct = async (productBody, ownerUserId) => {
  const ProductModel = getModelInstance('products');
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
  await ProductModel.update({ ...productBody }, { where: { id } });
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
  await ProductModel.update(updateBody, { where: { id } });
  const product = await ProductModel.findOne({ where: { id } });
  return product;
};

export default {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  patchProduct,
};
