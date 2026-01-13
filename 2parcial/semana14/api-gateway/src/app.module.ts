import { Module } from '@nestjs/common';
import { ArquitectoModule } from './arquitecto/arquitecto.module';
import { VerificacionModule } from './verificacion/verificacion.module';
import { GeminiModule } from './gemini/gemini.module';
import { WebhookEmitterService } from './common/webhook-emitter.service';

/**
 * Módulo principal del API Gateway
 */
@Module({
  imports: [ArquitectoModule, VerificacionModule, GeminiModule],
  providers: [WebhookEmitterService],
  exports: [WebhookEmitterService],
})
export class AppModule {}

