import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Habilitar CORS
  app.enableCors({
    origin: "*",
    credentials: true,
  });

  await app.listen(3000);
  console.log("Aplicación ejecutándose en http://localhost:3000");
  console.log("WebSocket disponible en ws://localhost:3000");
}
bootstrap();

