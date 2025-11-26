import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WSGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  transports: ["websocket", "polling"],
  // Permite que Socket.IO acepte conexiones en la raíz
  namespace: "/",
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger("WebSocketGateway");

  afterInit() {
    this.logger.log("WebSocket Gateway inicializado");
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    // Enviar confirmación de conexión al cliente
    client.emit("connected", { message: "Conexión establecida", clientId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // Handler para mensajes de prueba
  @SubscribeMessage("ping")
  handlePing(@ConnectedSocket() client: Socket): void {
    this.logger.log(`Ping recibido de: ${client.id}`);
    client.emit("pong", { message: "pong", timestamp: new Date().toISOString() });
  }

  // Handler genérico para mensajes
  @SubscribeMessage("message")
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    this.logger.log(`Mensaje recibido de ${client.id}: ${JSON.stringify(data)}`);
    client.emit("message", { received: true, data });
  }

  // Método para emitir eventos globales (sin rooms)
  emitEvent(event: string, data: any) {
    this.logger.log(`Emitiendo evento: ${event}`);
    this.server.emit(event, data);
  }
}

