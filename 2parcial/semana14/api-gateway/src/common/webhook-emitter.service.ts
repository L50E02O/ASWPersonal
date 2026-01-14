import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';

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
    this.webhookUrl = process.env.N8N_WEBHOOK_URL || '';
    
    if (!this.webhookUrl) {
      this.logger.warn(
        'N8N_WEBHOOK_URL no está configurada. Los webhooks no se enviarán. ' +
        'Configura N8N_WEBHOOK_URL en el archivo .env con la URL del webhook de n8n. ' +
        'Ejemplo: http://localhost:5678/webhook-test/notificacion',
      );
    }
    
    this.httpClient = axios.create({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (this.webhookUrl) {
      this.logger.log(`WebhookEmitterService inicializado. URL: ${this.webhookUrl}`);
    }
  }

  /**
   * Emite un webhook a n8n con el evento y payload especificados
   * 
   * @param evento - Nombre del evento (ej: 'arquitecto.creado', 'verificacion.creada')
   * @param payload - Datos del evento a enviar
   * @returns Promise que se resuelve cuando el webhook se envía exitosamente
   */
  async emit(evento: string, payload: any): Promise<void> {
    // Si no hay URL configurada, no hacer nada
    if (!this.webhookUrl) {
      return;
    }

    try {
      const webhookData = {
        evento,
        timestamp: new Date().toISOString(),
        data: payload,
      };

      this.logger.debug(`Emitiendo webhook: ${evento}`);

      await this.httpClient.post(this.webhookUrl, webhookData);

      this.logger.log(`Webhook emitido exitosamente: ${evento}`);
    } catch (error) {
      // No lanzamos error para no interrumpir el flujo principal
      // Solo registramos el error con información útil
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        const statusText = axiosError.response?.statusText;
        
        if (status === 404) {
          this.logger.error(
            `Webhook no encontrado (404): ${this.webhookUrl}. ` +
            `Verifica que: 1) El workflow esté activo en n8n, 2) La URL sea correcta, ` +
            `3) El path del webhook coincida con el configurado en n8n.`,
          );
        } else {
          this.logger.error(
            `Error al emitir webhook ${evento} (${status} ${statusText}): ${error.message}`,
          );
        }
      } else {
        this.logger.error(
          `Error al emitir webhook ${evento}: ${error.message}`,
          error.stack,
        );
      }
    }
  }
}
