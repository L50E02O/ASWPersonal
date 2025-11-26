import { Injectable, Logger } from "@nestjs/common";
import { WebSocketGateway } from "../websocket/websocket.gateway";

export interface WebhookPayload {
  id: string;
  tipoOperacion: "CREATE" | "UPDATE";
  entidad: "usuario" | "conferencia" | "agenda";
  datos: any;
  timestamp?: Date;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly webSocketGateway: WebSocketGateway) {}

  async procesarWebhook(payload: WebhookPayload): Promise<void> {
    this.logger.log(
      `Procesando webhook: ${payload.tipoOperacion} en ${payload.entidad} con ID ${payload.id}`
    );

    // Aplicar lógica adicional si corresponde
    const datosEnriquecidos = this.enriquecerDatos(payload);

    // Preparar notificación
    const notificacion = {
      id: payload.id,
      tipoOperacion: payload.tipoOperacion,
      entidad: payload.entidad,
      datos: datosEnriquecidos,
      timestamp: payload.timestamp || new Date(),
    };

    // Emitir evento global a través del WebSocket Gateway
    const eventName = `${payload.entidad}:${payload.tipoOperacion.toLowerCase()}`;
    this.webSocketGateway.emitEvent(eventName, notificacion);

    // También emitir un evento genérico
    this.webSocketGateway.emitEvent("notificacion", notificacion);

    this.logger.log(`Notificación emitida: ${eventName}`);
  }

  private enriquecerDatos(payload: WebhookPayload): any {
    // Lógica adicional: agregar información extra si es necesario
    const datos = { ...payload.datos };

    // Ejemplo: agregar información de contexto
    if (payload.tipoOperacion === "CREATE") {
      datos._metadata = {
        creado: true,
        fechaCreacion: new Date(),
      };
    } else if (payload.tipoOperacion === "UPDATE") {
      datos._metadata = {
        actualizado: true,
        fechaActualizacion: new Date(),
      };
    }

    return datos;
  }
}

