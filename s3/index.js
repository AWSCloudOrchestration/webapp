import fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import { imageMimeTypes } from '../api/validations/media/mimeTypes.js';
import _ from 'lodash';
import AppError from '../api/utils/AppError.js';
import { multipartUpload, putObject, deleteObject, deleteObjects } from './commands.js';
import logger from '../logger/index.js';

let s3client = null;

/**
 * Returns s3 client
 * @returns {S3Client}
 */
const initClient = () => {
  if (!s3client) {
    s3client = new S3Client({ region: process.env.S3_REGION, maxRetries: 15 });
  }
  return s3client;
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
  try {
    const { mimetype, path } = file;
    if (!_.includes(imageMimeTypes, mimetype)) throw new AppError('Media type not supported', 400);
    const fileContent = fs.readFileSync(path);
    if (_.isEmpty(fileContent)) throw new AppError('Malformed file', 400);
    // Append buffer
    _.assign(file, { buffer: fileContent });
    let uploadResponse = {};
    if (multipartEnabled) {
      uploadResponse = await multipartUpload(Key, Bucket, file);
    } else {
      uploadResponse = await putObject(Key, Bucket, file);
    }
    // Remove file from disk
    fs.unlinkSync(path);
    return uploadResponse;
  } catch (err) {
    logger.error('S3Client', { error: err.stack });
    throw new AppError('Upload failed', 400);
  }
};

export default {
  initClient,
  uploadFile,
  deleteObject,
  deleteObjects,
  multipartUpload,
  putObject,
};


