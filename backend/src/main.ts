import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173', 
    'http://localhost:3000',  
  ];
  
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Callback-Token', 'ngrok-skip-browser-warning'],
    optionsSuccessStatus: 200,
  });

  const cspConfig = process.env.CSP_POLICY || (
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.xendit.co; " +
    "style-src 'self' 'unsafe-inline'; " +
    "connect-src 'self' https://*.xendit.co https://*.forter.com wss://cdn0.forter.com https://browser-intake-datadoghq.com https://*.sentry.io https://stats.g.doubleclick.net https://snowplow-collector.iluma.ai https://www.google-analytics.com https://*.cardinalcommerce.com https://kg668dbov0.execute-api.us-east-1.amazonaws.com https://api.ipify.org https://rum.browser-intake-datadoghq.com https://analytics.google.com https://connect.facebook.net https://cdn.growthbook.io https://cloudflareinsights.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "frame-src 'self' https://*.xendit.co; " +
    "object-src 'none'"
  );
  
  app.use((req: any, res: any, next: any) => {
    res.setHeader('Content-Security-Policy', cspConfig);
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("KPopick API")
    .setDescription("K-Pop Products E-Commerce API")
    .setVersion("1.0")
    .addTag("Auth", "Authentication endpoints")
    .addTag("Products", "Product management endpoints")
    .addTag("Categories", "Category management endpoints")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT ?? 3000;
  const minioUrl = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
  const server = await app.listen(port, '0.0.0.0');
  
  console.log(`\n MinIO (Storage)        ${minioUrl}`);
  console.log(`Backend API            http://localhost:${port}`);
  console.log(`Swagger Documentation  http://localhost:${port}/api/docs\n`);

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('Server closed');
      await app.close();
      console.log('Application closed');
      process.exit(0);
    });
    
    setTimeout(() => {
      console.error('Forced shutdown after 10 seconds');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();
