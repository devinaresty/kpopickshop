import { Injectable, InternalServerErrorException } from '@nestjs/common';

let minioClient: any = null;
let minioBucketName: string = '';

@Injectable()
export class StorageService {
  private bucketName: string;

  constructor() {
    try {
      if (!minioClient) {
        const Minio = require('minio');
        
        const endpoint = process.env.MINIO_ENDPOINT || 'localhost:9000';
        const [host, port] = endpoint.split(':');
        const accessKey = process.env.MINIO_ACCESS_KEY || 'miniokpk';
        const secretKey = process.env.MINIO_SECRET_KEY || 'miniokpk120';
        const useSSL = process.env.MINIO_USE_SSL === 'true' ? true : false;
        
        minioClient = new Minio.Client({
          endPoint: host || 'localhost',
          port: parseInt(port || '9000', 10),
          accessKey,
          secretKey,
          useSSL,
        });

        minioBucketName = process.env.MINIO_BUCKET_NAME || 'kpopick-bucket';
        this.ensureBucketExists();
      }
      
      this.bucketName = minioBucketName || 'kpopick-bucket';
    } catch (error: any) {

      this.bucketName = 'kpopick-bucket';
    }
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      if (!minioClient) return;
      
      const exists = await minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await minioClient.makeBucket(this.bucketName, 'us-east-1');
        console.log(`✅ Minio bucket created: ${this.bucketName}`);
      }
    } catch (error: any) {
      console.warn('⚠️  Minio bucket check warning:', error?.message || error);
    }
  }

  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<{
    fileUrl: string;
    fileName: string;
    size: number;
  }> {
    try {
      if (!minioClient) {
        throw new Error('Minio client not initialized');
      }

      const bucketName = this.bucketName || minioBucketName || 'kpopick-bucket';
      
      if (!bucketName || bucketName === 'undefined') {
        throw new Error(`Invalid bucket name: ${bucketName}`);
      }

      const objectName = `products/${fileName}`;

      console.log(`📤 Uploading file: ${objectName} to bucket: ${bucketName}`);

      await minioClient.putObject(
        bucketName,
        objectName,
        fileBuffer,
        fileBuffer.length,
        {
          'Content-Type': mimeType,
        },
      );

      const publicUrl = process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT || 'localhost:9000'}`;
      const fileUrl = `${publicUrl}/${bucketName}/${objectName}`;

      console.log(`✅ File uploaded successfully: ${fileUrl}`);

      return {
        fileUrl,
        fileName,
        size: fileBuffer.length,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to upload file: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async uploadFileWithFolder(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
    folderName: string = 'uploads',
  ): Promise<{
    fileUrl: string;
    fileName: string;
    size: number;
  }> {
    try {
      if (!minioClient) {
        throw new Error('Minio client not initialized');
      }

      const objectName = `${folderName}/${fileName}`;

      await minioClient.putObject(
        this.bucketName,
        objectName,
        fileBuffer,
        fileBuffer.length,
        {
          'Content-Type': mimeType,
        },
      );

      const baseUrl = process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT || 'localhost:9000'}`;
      const fileUrl = `${baseUrl}/${this.bucketName}/${objectName}`;

      console.log(` File uploaded to ${folderName}: ${fileUrl}`);

      return {
        fileUrl,
        fileName,
        size: fileBuffer.length,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to upload file: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      if (!minioClient) {
        throw new Error('Minio client not initialized');
      }

      const objectName = `products/${fileName}`;
      await minioClient.removeObject(this.bucketName, objectName);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to delete file: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  getFileUrl(fileName: string): string {
    const baseUrl = `http://${process.env.MINIO_ENDPOINT || 'localhost:9000'}`;
    return `${baseUrl}/${this.bucketName}/products/${fileName}`;
  }
}
