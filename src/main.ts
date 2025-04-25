import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  //swagger implementation
  const config = new DocumentBuilder()
    .setTitle('Banking App API')
    .setDescription('The API documentation for your project')
    .setVersion('1.0')
    .addBearerAuth() // adds JWT auth support in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger URL: /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
