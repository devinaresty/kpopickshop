import { Injectable, InternalServerErrorException } from '@nestjs/common';

let minioClient: any = null;

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

        this.bucketName = process.env.MINIO_BUCKET_NAME || 'kpopick-bucket';
        console.log('✅ Minio client initialized successfully');
        this.ensureBucketExists();
      }
    } catch (error: any) {
      console.warn('⚠️  Minio initialization warning (non-critical):', error?.message || error);
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

      const objectName = `products/${fileName}`;

      await minioClient.putObject(
        this.bucketName,
        objectName,
        fileBuffer,
        fileBuffer.length,
        {
          'Content-Type': mimeType,
        },
      );

      const baseUrl = `http://${process.env.MINIO_ENDPOINT || 'localhost:9000'}`;
      const fileUrl = `${baseUrl}/${this.bucketName}/${objectName}`;

      console.log(`✅ File uploaded: ${fileUrl}`);

      return {
        fileUrl,
        fileName,
        size: fileBuffer.length,
      };
    } catch (error: any) {
      console.error('Minio upload error:', error?.message || error);
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

      const baseUrl = `http://${process.env.MINIO_ENDPOINT || 'localhost:9000'}`;
      const fileUrl = `${baseUrl}/${this.bucketName}/${objectName}`;

      console.log(`✅ File uploaded to ${folderName}: ${fileUrl}`);

      return {
        fileUrl,
        fileName,
        size: fileBuffer.length,
      };
    } catch (error: any) {
      console.error('Minio upload error:', error?.message || error);
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
      console.log(`✅ File deleted: ${objectName}`);
    } catch (error: any) {
      console.error('Minio delete error:', error?.message || error);
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
