import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verificacion } from './entities/verificacion.entity';
import { CreateVerificacionDto } from './dto/create-verificacion.dto';
import { UpdateVerificacionDto } from './dto/update-verificacion.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { RedisService } from '../redis/redis.service';

/**
 * Servicio de Verificación
 * Maneja la lógica de negocio y se comunica con el microservicio de Arquitecto vía RabbitMQ
 * Implementa consumidor idempotente para evitar procesamiento duplicado
 */
@Injectable()
export class VerificacionService {
  private readonly logger = new Logger(VerificacionService.name);

  constructor(
    @InjectRepository(Verificacion)
    private readonly verificacionRepository: Repository<Verificacion>,
    private readonly rabbitMQService: RabbitMQService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Crea una nueva verificación con idempotencia
   * Verifica que el arquitecto exista vía RabbitMQ antes de crear
   */
  async create(createVerificacionDto: CreateVerificacionDto): Promise<Verificacion> {
    const { idempotency_key, arquitecto_id } = createVerificacionDto;

    // Verificar idempotencia
    const processed = await this.redisService.checkIdempotency(idempotency_key);
    if (processed) {
      this.logger.warn(`Solicitud duplicada detectada: ${idempotency_key}`);
      return processed;
    }

    // Verificar que el arquitecto existe vía RabbitMQ
    const arquitectoExists = await this.rabbitMQService.sendMessage('arquitecto.exists', {
      id: arquitecto_id,
    });

    if (!arquitectoExists.exists) {
      throw new BadRequestException(
        `Arquitecto con ID ${arquitecto_id} no existe`,
      );
    }

    // Verificar si ya existe una verificación para este arquitecto
    const existing = await this.verificacionRepository.findOne({
      where: { arquitecto_id },
    });

    if (existing) {
      throw new BadRequestException(
        `Ya existe una verificación para el arquitecto ${arquitecto_id}`,
      );
    }

    // Crear verificación
    const verificacion = this.verificacionRepository.create({
      arquitecto_id: createVerificacionDto.arquitecto_id,
      moderador_id: createVerificacionDto.moderador_id,
      estado: createVerificacionDto.estado,
      fecha_verificacion: new Date(),
    });

    const saved = await this.verificacionRepository.save(verificacion);

    // Guardar clave de idempotencia
    await this.redisService.saveIdempotency(idempotency_key, saved);

    // Publicar evento de verificación solicitada
    await this.rabbitMQService.publishEvent('verificacion.solicitada', {
      id: saved.id,
      arquitecto_id: saved.arquitecto_id,
      estado: saved.estado,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Verificación creada: ${saved.id}`);

    return saved;
  }

  /**
   * Obtiene todas las verificaciones
   */
  async findAll(): Promise<Verificacion[]> {
    return this.verificacionRepository.find();
  }

  /**
   * Obtiene una verificación por ID
   */
  async findOne(id: string): Promise<Verificacion> {
    const verificacion = await this.verificacionRepository.findOne({
      where: { id },
    });

    if (!verificacion) {
      throw new NotFoundException(`Verificación con ID ${id} no encontrada`);
    }

    return verificacion;
  }

  /**
   * Actualiza una verificación con idempotencia
   * Notifica al microservicio de Arquitecto vía RabbitMQ cuando se completa
   */
  async update(
    id: string,
    updateVerificacionDto: UpdateVerificacionDto,
  ): Promise<Verificacion> {
    const verificacion = await this.findOne(id);
    const { idempotency_key, estado } = updateVerificacionDto;

    // Verificar idempotencia si se proporciona clave
    if (idempotency_key) {
      const processed = await this.redisService.checkIdempotency(
        `update:${idempotency_key}`,
      );
      if (processed) {
        this.logger.warn(`Actualización duplicada detectada: ${idempotency_key}`);
        return processed;
      }
    }

    const estadoAnterior = verificacion.estado;

    // Actualizar estado
    if (estado) {
      verificacion.estado = estado;
      verificacion.fecha_verificacion = new Date();
    }

    const updated = await this.verificacionRepository.save(verificacion);

    // Guardar clave de idempotencia si se proporcionó
    if (idempotency_key) {
      await this.redisService.saveIdempotency(`update:${idempotency_key}`, updated);
    }

    // Si el estado cambió a 'verificado' o 'rechazado', notificar al microservicio de Arquitecto
    if (estado && estado !== estadoAnterior && (estado === 'verificado' || estado === 'rechazado')) {
      await this.rabbitMQService.publishEvent('verificacion.completada', {
        arquitecto_id: updated.arquitecto_id,
        estado: updated.estado,
        verificacion_id: updated.id,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Verificación completada: ${updated.id} - Estado: ${updated.estado}`);
    } else {
      await this.rabbitMQService.publishEvent('verificacion.procesada', {
        id: updated.id,
        estado: updated.estado,
        timestamp: new Date().toISOString(),
      });
    }

    return updated;
  }

  /**
   * Obtiene verificaciones por arquitecto
   */
  async findByArquitecto(arquitecto_id: string): Promise<Verificacion | null> {
    return this.verificacionRepository.findOne({
      where: { arquitecto_id },
    });
  }

  /**
   * Crea automáticamente una verificación cuando se crea un arquitecto
   * Este método es llamado por el evento 'arquitecto.creado' vía RabbitMQ
   * @param arquitecto_id - ID del arquitecto recién creado
   * @param usuario_id - ID del usuario que creó el arquitecto (se usa como moderador por defecto)
   */
  async crearVerificacionAutomatica(arquitecto_id: string, usuario_id: string): Promise<Verificacion> {
    // Clave de idempotencia basada en el ID del arquitecto
    // Esto evita crear múltiples verificaciones si el evento llega varias veces
    const idempotency_key = `auto-verificacion-${arquitecto_id}`;

    // Verificar idempotencia
    const processed = await this.redisService.checkIdempotency(idempotency_key);
    if (processed) {
      this.logger.log(`Verificación automática ya existe para arquitecto ${arquitecto_id}`);
      return processed;
    }

    // Verificar si ya existe una verificación para este arquitecto
    const existing = await this.verificacionRepository.findOne({
      where: { arquitecto_id },
    });

    if (existing) {
      this.logger.log(`Ya existe una verificación para el arquitecto ${arquitecto_id}`);
      await this.redisService.saveIdempotency(idempotency_key, existing);
      return existing;
    }

    // Crear verificación automática en estado "pendiente"
    const verificacion = this.verificacionRepository.create({
      arquitecto_id,
      moderador_id: usuario_id, // Usar el usuario que creó el arquitecto como moderador por defecto
      estado: 'pendiente',
      fecha_verificacion: new Date(),
    });

    const saved = await this.verificacionRepository.save(verificacion);

    // Guardar clave de idempotencia
    await this.redisService.saveIdempotency(idempotency_key, saved);

    // Publicar evento de verificación solicitada
    await this.rabbitMQService.publishEvent('verificacion.solicitada', {
      id: saved.id,
      arquitecto_id: saved.arquitecto_id,
      estado: saved.estado,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Verificación automática creada para arquitecto ${arquitecto_id}: ${saved.id}`);

    return saved;
  }
}

