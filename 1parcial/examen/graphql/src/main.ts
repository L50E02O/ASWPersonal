import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors({
    origin: "*",
    credentials: true,
  });

  await app.listen(4000);
  console.log("GraphQL API ejecutándose en http://localhost:4000/graphql");
  console.log("Apollo Studio disponible en http://localhost:4000/graphql");
  console.log("Usa la nueva interfaz de Apollo Studio para explorar queries fácilmente");
}
bootstrap();

