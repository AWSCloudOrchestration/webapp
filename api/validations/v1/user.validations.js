import Joi from 'joi';

const getUserById = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const update = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
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
};
