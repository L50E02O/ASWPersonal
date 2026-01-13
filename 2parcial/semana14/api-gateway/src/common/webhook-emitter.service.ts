import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

/**
 * Servicio para emitir webhooks a n8n
 * Permite notificar eventos del sistema a workflows de automatización
 */
@Injectable()
export class WebhookEmitterService {
  private readonly logger = new Logger(WebhookEmitterService.name);
  private readonly httpClient: AxiosInstance;
  private readonly webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/unique-id';
    
    this.httpClient = axios.create({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.log(`WebhookEmitterService inicializado. URL: ${this.webhookUrl}`);
  }

  /**
   * Emite un webhook a n8n con el evento y payload especificados
   * 
   * @param evento - Nombre del evento (ej: 'arquitecto.creado', 'verificacion.creada')
   * @param payload - Datos del evento a enviar
   * @returns Promise que se resuelve cuando el webhook se envía exitosamente
   */
  async emit(evento: string, payload: any): Promise<void> {
    try {
      const webhookData = {
        evento,
        timestamp: new Date().toISOString(),
        data: payload,
      };

      this.logger.debug(`Emitiendo webhook: ${evento}`, webhookData);

      await this.httpClient.post(this.webhookUrl, webhookData);

      this.logger.log(`Webhook emitido exitosamente: ${evento}`);
    } catch (error) {
      // No lanzamos error para no interrumpir el flujo principal
      // Solo registramos el error
      this.logger.error(
        `Error al emitir webhook ${evento}: ${error.message}`,
        error.stack,
      );
    }
  }
}
