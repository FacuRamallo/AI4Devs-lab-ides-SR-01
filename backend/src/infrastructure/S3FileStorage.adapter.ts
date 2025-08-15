import { IFileStorage } from '@domain/IFileStorage.port.js';
import AWS from 'aws-sdk';

export class S3FileStorageAdapter implements IFileStorage {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_S3_ENDPOINT,
      s3ForcePathStyle: true,
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';

    if (!this.bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME is not defined in environment variables.');
    }
  }

  public async upload(file: Buffer, path: string): Promise<string> {
    try {
      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: path,
        Body: file,
        ContentType: 'application/octet-stream',
      };

      await this.s3.upload(params).promise();

      return `https://${this.bucketName}.s3.amazonaws.com/${path}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file to S3.');
    }
  }
}
