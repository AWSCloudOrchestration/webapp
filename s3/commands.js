import s3Client from './index.js';
import _ from 'lodash';
import {
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  UploadPartCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

/**
 * Split file buffer into chunks with params for uploadPart
 * @param {Object} file
 * @param {String} Bucket
 * @param {String} Key
 * @param {String} UploadId
 * @returns {Object}
 */
const collectFileParts = (file, Bucket, Key, UploadId) => {
  const chunkSize = 1 * 1024 * 1024; // 1MB
  const totalParts = Math.ceil(file.buffer.length / chunkSize);
  const fileParts = [];
  for (let i = 0; i < totalParts; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.buffer.length);
    const partParams = {
      Body: file.buffer.slice(start, end),
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
 */
const multipartUpload = async (Key, Bucket, file) => {
  try {
    const { mimetype } = file;
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
    const fileParts = collectFileParts(file, Bucket, Key, UploadId);
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
  const { mimetype } = file;
  const client = s3Client.initClient();
  const command = new PutObjectCommand({ Key, Bucket, Body: file.buffer, ContentType: mimetype });
  return client.send(command);
};

/**
 * Delete object command
 * @param {String} Key
 * @param {String} Bucket
 * @returns {Object}
 */
const deleteObject = async (Key, Bucket) => {
  const client = s3Client.initClient();
  const command = new DeleteObjectCommand({ Key, Bucket });
  return client.send(command);
};

export {
  multipartUpload,
  putObject,
  deleteObject,
};

