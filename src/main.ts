import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express from 'express';

import { LoggingMiddleware } from './logging.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({ origin: true });
  // ensure body parsers run before our logging middleware so req.body is populated
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use((req, res, next) => new LoggingMiddleware().use(req, res, next));
  // Swagger setup - automatically picks up decorated routes and DTOs
  const config = new DocumentBuilder()
    .setTitle('Nest REST API')
    .setDescription('API docs (auto-updating when controllers/DTOs are decorated)')
    .setVersion('1.0')
    // add bearer auth so Swagger UI shows the lock and knows the scheme
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      authAction: {
        bearer: {
          name: 'bearer',
          schema: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: '',
        },
      },
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
