import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arquitecto } from './entities/arquitecto.entity';
import { CreateArquitectoDto } from './dto/create-arquitecto.dto';
import { UpdateArquitectoDto } from './dto/update-arquitecto.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

/**
 * Servicio de Arquitecto
 * Maneja la lógica de negocio y publica eventos de dominio
 */
@Injectable()
export class ArquitectoService {
  constructor(
    @InjectRepository(Arquitecto)
    private readonly arquitectoRepository: Repository<Arquitecto>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  /**
   * Crea un nuevo arquitecto y publica evento
   */
  async create(createArquitectoDto: CreateArquitectoDto): Promise<Arquitecto> {
    const arquitecto = this.arquitectoRepository.create(createArquitectoDto);
    const saved = await this.arquitectoRepository.save(arquitecto);

    // Publicar evento de dominio
    await this.rabbitMQService.publishEvent('arquitecto.creado', {
      id: saved.id,
      cedula: saved.cedula,
      usuario_id: saved.usuario_id,
      verificado: saved.verificado,
      timestamp: new Date().toISOString(),
    });

    return saved;
  }

  /**
   * Obtiene todos los arquitectos
   */
  async findAll(): Promise<Arquitecto[]> {
    return this.arquitectoRepository.find();
  }

  /**
   * Obtiene un arquitecto por ID
   */
  async findOne(id: string): Promise<Arquitecto> {
    const arquitecto = await this.arquitectoRepository.findOne({
      where: { id },
    });

    if (!arquitecto) {
      throw new NotFoundException(`Arquitecto con ID ${id} no encontrado`);
    }

    return arquitecto;
  }

  /**
   * Actualiza un arquitecto y publica evento si cambia el estado de verificación
   */
  async update(id: string, updateArquitectoDto: UpdateArquitectoDto): Promise<Arquitecto> {
    const arquitecto = await this.findOne(id);
    const verificadoAnterior = arquitecto.verificado;

    Object.assign(arquitecto, updateArquitectoDto);
    const updated = await this.arquitectoRepository.save(arquitecto);

    // Si cambió el estado de verificación, publicar evento
    if (updateArquitectoDto.verificado !== undefined && updateArquitectoDto.verificado !== verificadoAnterior) {
      await this.rabbitMQService.publishEvent('arquitecto.verificado', {
        id: updated.id,
        verificado: updated.verificado,
        timestamp: new Date().toISOString(),
      });
    } else if (Object.keys(updateArquitectoDto).length > 0) {
      await this.rabbitMQService.publishEvent('arquitecto.actualizado', {
        id: updated.id,
        cambios: updateArquitectoDto,
        timestamp: new Date().toISOString(),
      });
    }

    return updated;
  }

  /**
   * Marca un arquitecto como verificado (usado por eventos de verificación)
   */
  async marcarComoVerificado(arquitectoId: string): Promise<void> {
    const arquitecto = await this.findOne(arquitectoId);
    arquitecto.verificado = true;
    await this.arquitectoRepository.save(arquitecto);

    await this.rabbitMQService.publishEvent('arquitecto.verificado', {
      id: arquitecto.id,
      verificado: true,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Verifica si un arquitecto existe
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.arquitectoRepository.count({ where: { id } });
    return count > 0;
  }
}

