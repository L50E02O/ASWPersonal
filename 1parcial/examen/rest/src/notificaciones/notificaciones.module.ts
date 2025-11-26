import { Module } from "@nestjs/common";
import { WebSocketModule } from "../websocket/websocket.module";
import { WebhookModule } from "../webhook/webhook.module";

@Module({
  imports: [WebSocketModule, WebhookModule],
  exports: [WebSocketModule, WebhookModule],
})
export class NotificacionesModule {}

