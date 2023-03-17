import _ from 'lodash';
import AppError from '../utils/AppError.js';
import getModelInstance from '../../db/sql/getModelInstance.js';

const forbiddenResourceCondition = (productExistingInfo, user) => (+(_.get(productExistingInfo, 'owner_user_id')) !== +(_.get(user, 'id')));

const productAuthMiddleware = () => async (req, res, next) => {
  const { params: { productId }, user } = req;
  const ProductModel = getModelInstance('products');
  const productExistingInfo = await ProductModel.findOne({ where: { id: productId } });
  // Check if product is in db
  if (!productExistingInfo) return next(new AppError('Product not found', 404));
  if (forbiddenResourceCondition(productExistingInfo, user)) return next(new AppError('Forbidden resource', 403));
  return next();
};

export default productAuthMiddleware;
