import { S3Client, CreateMultipartUploadCommand, CompleteMultipartUploadCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import _ from 'lodash';

const initClient = () => {
  return new S3Client({ region: process.env.S3_REGION, maxRetries: 15, profile: 's3' });
};

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

const uploadFile = async (Key, Bucket, file) => {
  try {
    const { mimetype } = file;
    const client = initClient();
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

export default {
  initClient,
  uploadFile,
};


