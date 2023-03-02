import fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import { imageMimeTypes } from '../api/validations/media/mimeTypes.js';
import _ from 'lodash';
import AppError from '../api/utils/AppError.js';
import { multipartUpload, putObject, deleteObject, deleteObjects } from './commands.js';

const initClient = () => {
  return new S3Client({ region: process.env.S3_REGION, maxRetries: 15 });
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
  const { mimetype, path } = file;
  if (!_.includes(imageMimeTypes, mimetype)) throw new AppError('Media type not supported', 400);
  const fileContent = fs.readFileSync(path);
  if (_.isEmpty(fileContent)) throw new AppError('Malformed file', 400);
  // Append buffer
  _.assign({ buffer: fileContent }, file);
  let uploadResponse = {};
  if (multipartEnabled) {
    uploadResponse = await multipartUpload(Key, Bucket, file);
  } else {
    uploadResponse = await putObject(Key, Bucket, file);
  }
  // Remove file from disk
  fs.unlinkSync(path);
  return uploadResponse;
};

export default {
  initClient,
  uploadFile,
  deleteObject,
  deleteObjects,
};


