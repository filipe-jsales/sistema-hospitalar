import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/allExceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('Documentação da API com Swagger')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',

    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'X-Requested-With',
      'Content-Type',
      'credentials',
      'Authorization',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // aqui fica o endpoint '/api'
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
