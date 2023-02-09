import Joi from 'joi';

const getProductById = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
};

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    sku: Joi.string().required(),
    manufacturer: Joi.string().required(),
    quantity: Joi.number().integer().min(0).max(100).required(),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    sku: Joi.string().required(),
    manufacturer: Joi.string().required(),
    quantity: Joi.number().integer().min(0).max(100).required(),
  }),
};

const patchProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    sku: Joi.string(),
    manufacturer: Joi.string(),
    quantity: Joi.number().integer().min(0).max(100).required(),
  }),
};

const deleteByProductId = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
};

export {
  getProductById,
  updateProduct,
  createProduct,
  patchProduct,
  deleteByProductId,
};
