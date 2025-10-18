import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // agregar esta línea para habilitar CORS
  app.setGlobalPrefix('api'); // agregar prefijo global "api"
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
  })); // habilitar validación global

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
