import { Controller, Post, Body, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { WebhookService, WebhookPayload } from "./webhook.service";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("usuarios")
  @HttpCode(HttpStatus.OK)
  async webhookUsuarios(@Body() payload: { id: string; tipoOperacion: "CREATE" | "UPDATE"; datos: any }) {
    const webhookPayload: WebhookPayload = {
      id: payload.id,
      tipoOperacion: payload.tipoOperacion,
      entidad: "usuario",
      datos: payload.datos,
      timestamp: new Date(),
    };

    await this.webhookService.procesarWebhook(webhookPayload);
    return { success: true, message: "Webhook procesado correctamente" };
  }

  @Post("conferencias")
  @HttpCode(HttpStatus.OK)
  async webhookConferencias(@Body() payload: { id: string; tipoOperacion: "CREATE" | "UPDATE"; datos: any }) {
    const webhookPayload: WebhookPayload = {
      id: payload.id,
      tipoOperacion: payload.tipoOperacion,
      entidad: "conferencia",
      datos: payload.datos,
      timestamp: new Date(),
    };

    await this.webhookService.procesarWebhook(webhookPayload);
    return { success: true, message: "Webhook procesado correctamente" };
  }

  @Post("agendas")
  @HttpCode(HttpStatus.OK)
  async webhookAgendas(@Body() payload: { id: string; tipoOperacion: "CREATE" | "UPDATE"; datos: any }) {
    const webhookPayload: WebhookPayload = {
      id: payload.id,
      tipoOperacion: payload.tipoOperacion,
      entidad: "agenda",
      datos: payload.datos,
      timestamp: new Date(),
    };

    await this.webhookService.procesarWebhook(webhookPayload);
    return { success: true, message: "Webhook procesado correctamente" };
  }
}

