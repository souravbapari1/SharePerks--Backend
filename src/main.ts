import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set global prefix for the API
  app.setGlobalPrefix('api/v1');

  // Use validation pipes globally
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors();

  // Serve static assets
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('SharePerks')
    .setDescription('The SharePerks API description')
    .setVersion('1.0')
    .addTag('sharePerks')
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI with prefix
  SwaggerModule.setup('api/v1/docs', app, document); // Added prefix 'api/v1' to the Swagger docs route

  // Start the application
  await app.listen(7565);
}

bootstrap();
