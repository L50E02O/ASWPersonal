import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors();
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 Servidor GraphQL corriendo en http://localhost:${port}/graphql`);
}
bootstrap();
