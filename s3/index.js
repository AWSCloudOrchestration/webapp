import { S3Client } from '@aws-sdk/client-s3';
import { imageMimeTypes } from '../api/validations/media/mimeTypes.js';
import _ from 'lodash';
import AppError from '../api/utils/AppError.js';
import { multipartUpload, putObject, deleteObject, deleteObjects } from './commands.js';

const initClient = () => {
  return new S3Client({ region: process.env.S3_REGION, maxRetries: 15, profile: 's3' });
};

/**
 * Upload file to S3
 * @param {String} Key
 * @param {String} Bucket
 * @param {Object} file
 * @param {Boolean} multipartEnabled
 * @returns {Object}
 */
const uploadFile = async (Key, Bucket, file, multipartEnabled = false) => {
  const { mimetype } = file;
  if (!_.includes(imageMimeTypes, mimetype)) throw new AppError('Media type not supported', 400);
  if (_.isEmpty(_.get(file, 'buffer', null))) throw new AppError('Malformed file', 400);
  if (multipartEnabled) {
    return multipartUpload(Key, Bucket, file);
  } else {
    return putObject(Key, Bucket, file);
  }
};

export default {
  initClient,
  uploadFile,
  deleteObject,
  deleteObjects,
};

