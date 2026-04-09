import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ImageUrlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Transform image URLs in the response
        return this.transformImageUrls(data);
      }),
    );
  }

  private transformImageUrls(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformImageUrls(item));
    } else if (obj !== null && typeof obj === 'object') {
      const transformed = { ...obj };
      for (const key in transformed) {
        if (
          (key === 'imageUrl' || key === 'image' || key === 'photoUrl') &&
          typeof transformed[key] === 'string'
        ) {
          // Debug log
          console.log(`[ImageUrlInterceptor] Processing ${key}: ${transformed[key]}`);
          // If it's a signed Minio URL, convert to public URL
          // If already public, keep as is
          transformed[key] = this.transformMinionUrl(transformed[key]);
          console.log(`[ImageUrlInterceptor] Result: ${transformed[key]}`);
        } else if (typeof transformed[key] === 'object') {
          transformed[key] = this.transformImageUrls(transformed[key]);
        }
      }
      return transformed;
    }
    return obj;
  }

  private transformMinionUrl(url: string): string {
    if (!url) {
      console.log('[ImageUrlInterceptor] URL is empty, returning empty string');
      return url;
    }

    // If URL is from Minio (contains X-Amz-Signature), transform to public bucket URL
    if (
      url.includes('X-Amz-Signature') ||
      url.includes('X-Amz-Credential')
    ) {
      // Extract bucket and object name from Minio URL
      // Format: http://minio:9000/bucket-name/object-name?...query-params
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        console.log(`[ImageUrlInterceptor] Minio URL detected, pathname: ${pathname}`);
        // pathname format: /bucket-name/object-name
        const parts = pathname.split('/').filter((p) => p);
        if (parts.length >= 2) {
          const bucket = parts[0];
          const objectName = parts.slice(1).join('/');
          // Return public URL without signed parameters
          const publicHost = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
          const publicUrl = `${publicHost}/${bucket}/${objectName}`;
          console.log(`[ImageUrlInterceptor] Transformed to: ${publicUrl}`);
          return publicUrl;
        }
      } catch (e) {
        console.error('[ImageUrlInterceptor] Error transforming Minio URL:', e);
      }
    }

    console.log(`[ImageUrlInterceptor] URL passed through as-is: ${url}`);
    return url;
  }
}
