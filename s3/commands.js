import s3Client from './index.js';
import _ from 'lodash';
import {
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  UploadPartCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import logger from '../logger/index.js';

/**
 * Split file buffer into parts with params for uploadPart
 * @param {Buffer} buffer
 * @param {String} Bucket
 * @param {String} Key
 * @param {String} UploadId
 * @returns {Object}
 */
const collectFileParts = (buffer, Bucket, Key, UploadId) => {
  const partSize = 5 * 1024 * 1024;
  const totalParts = Math.ceil(buffer.length / partSize);
  const fileParts = [];
  for (let i = 0; i < totalParts; i++) {
    const start = i * partSize;
    const end = Math.min(start + partSize, buffer.length);
    const partParams = {
      Body: buffer.subarray(start, end),
      Bucket,
      Key,
      PartNumber: i + 1,
      UploadId,
    };
    fileParts.push(partParams);
  }
  return fileParts;
};

/**
 * Multipart upload
 * @param {String} Key
 * @param {String} Bucket
 * @param {Object} file
 * @returns {Object}
 * Maximum object size 5 TiB
 * Maximum number of parts per upload 10,000
 * Part numbers 1 to 10,000 (inclusive)
 * Part size 5 MiB to 5 GiB. There is no minimum size limit on the last part of your multipart upload.
 * S3 Upload limits: https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html
 */
const multipartUpload = async (Key, Bucket, file) => {
  try {
    const { mimetype, buffer } = file;
    const client = s3Client.initClient();
    const params = {
      Key,
      Bucket,
      ContentType: mimetype,
    };

    // Get UploadId
    const createMultipartUploadCommand = new CreateMultipartUploadCommand(params);
    const { UploadId } = await client.send(createMultipartUploadCommand);
    // Upload parts
    const fileParts = collectFileParts(buffer, Bucket, Key, UploadId);
    const failedParts = [];
    const Parts = await Promise.all(_.map(fileParts, async (partParams, index) => {
      const command = new UploadPartCommand(partParams);
      const response = await client.send(command);
      if (response && _.get(response, '$metadata.httpStatusCode') === 200) {
        return { ETag: response.ETag, PartNumber: index + 1 };
      } else failedParts.push(partParams); // Add retry logic here
    }));
    const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
      Bucket, Key, UploadId, MultipartUpload: { Parts },
    });
    return client.send(completeMultipartUploadCommand);
  } catch (err) {
    console.error('AWS S3 Client error: ', err);
  }
};

/**
 * Put object command
 * @param {String} Key
 * @param {String} Bucket
 * @param {Object} file
 * @returns {Object}
 */
const putObject = (Key, Bucket, file) => {
  const { mimetype, buffer } = file;
  logger.info(`Uploading object of type: ${mimetype}`);
  const client = s3Client.initClient();
  const command = new PutObjectCommand({ Key, Bucket, Body: buffer, ContentType: mimetype });
  return client.send(command);
};

/**
 * Delete object command
 * @param {String} Key
 * @param {String} Bucket
 * @returns {Object}
 */
const deleteObject = async (Key, Bucket) => {
  logger.info('Deleting s3 object');
  const client = s3Client.initClient();
  const command = new DeleteObjectCommand({ Key, Bucket });
  return client.send(command);
};

/**
 * Delete multiple objects
 * @param {Object} Objects
 * @param {String} Bucket
 * @returns {Object}
 */
const deleteObjects = async (Objects, Bucket) => {
  logger.info('Deleting s3 objects');
  const client = s3Client.initClient();
  const params = {
    Bucket,
    Delete: {
      Objects,
    },
  };
  return client.send(new DeleteObjectsCommand(params));
};

export {
  multipartUpload,
  putObject,
  deleteObject,
  deleteObjects,
};

