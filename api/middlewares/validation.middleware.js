import Joi from 'joi';
import _ from 'lodash';
import AppError from '../utils/AppError.js';

/**
 * Validate request object
 * @param {Object} schema
 * @returns
 */
const requestValidationMiddleware = (schema) => (req, res, next) => {
  const reqSchema = _.pick(schema, ['body', 'params', 'query']);
  const requestObject = _.pick(req, _.keys(reqSchema));
  const { value, error } = Joi.compile(reqSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(requestObject);
  if (error) {
    const message = error.details.map((detail) => detail.message);
    return next(new AppError(message, 400));
  }
  Object.assign(req, value); // Replace with validated object
  return next();
};

export default requestValidationMiddleware;
