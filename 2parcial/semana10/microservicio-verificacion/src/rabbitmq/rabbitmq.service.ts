import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import * as amqp from 'amqplib';

/**
 * Servicio RabbitMQ para comunicación con otros microservicios
 * Publica eventos y envía mensajes síncronos
 */
@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private client: ClientProxy;
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly exchange = process.env.RABBITMQ_EXCHANGE || 'arquitecto.exchange';

  /**
   * Inicializa la conexión con RabbitMQ
   */
  async onModuleInit() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672';
      
      // Conexión para publicar eventos
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true });

      // Cliente para enviar mensajes síncronos
      this.client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [url],
          queue: 'arquitecto.queue',
          queueOptions: { durable: true },
        },
      });

      await this.client.connect();

      this.logger.log('Conectado a RabbitMQ exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar con RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Cierra la conexión con RabbitMQ
   */
  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
    }
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.logger.log('Conexión con RabbitMQ cerrada');
  }

  /**
   * Publica un evento de dominio
   * @param routingKey - Clave de enrutamiento (ej: 'verificacion.solicitada')
   * @param payload - Datos del evento
   */
  async publishEvent(routingKey: string, payload: any): Promise<void> {
    try {
      const message = JSON.stringify(payload);
      const published = this.channel.publish(
        this.exchange,
        routingKey,
        Buffer.from(message),
        {
          persistent: true,
          timestamp: Date.now(),
        },
      );

      if (published) {
        this.logger.log(`Evento publicado: ${routingKey}`);
      } else {
        this.logger.warn(`No se pudo publicar evento: ${routingKey}`);
      }
    } catch (error) {
      this.logger.error(`Error al publicar evento ${routingKey}:`, error);
      throw error;
    }
  }

  /**
   * Envía un mensaje síncrono a otro microservicio
   * @param pattern - Patrón del mensaje (ej: 'arquitecto.exists')
   * @param data - Datos del mensaje
   */
  async sendMessage(pattern: string, data: any): Promise<any> {
    try {
      return await this.client.send(pattern, data).toPromise();
    } catch (error) {
      this.logger.error(`Error al enviar mensaje ${pattern}:`, error);
      throw error;
    }
  }
}

