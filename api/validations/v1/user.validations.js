import Joi from 'joi';

const getUserById = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
};

const create = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
  }),
};

const update = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    first_name: Joi.string(),
    last_name: Joi.string(),
    password: Joi.string(),
  }),
};

export {
  getUserById,
  update,
  create,
};
