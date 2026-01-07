import { Module } from '@nestjs/common';
import { ArquitectoModule } from './arquitecto/arquitecto.module';
import { VerificacionModule } from './verificacion/verificacion.module';

/**
 * Módulo principal del API Gateway
 */
@Module({
  imports: [ArquitectoModule, VerificacionModule],
})
export class AppModule {}

