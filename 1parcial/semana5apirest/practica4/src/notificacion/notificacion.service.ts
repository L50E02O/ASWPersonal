import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
  ) {}

  async create(dto: CreateNotificacionDto) {
    const notificacion = this.notificacionRepository.create({
      usuario: { id_usuario: dto.id_usuario },
      mensaje: dto.mensaje,
      leido: dto.leido ?? false,
    });
    return await this.notificacionRepository.save(notificacion);
  }

  async findAll() {
    return this.notificacionRepository.find();
  }

  async findOne(id: string) {
    const notificacion = await this.notificacionRepository.findOneBy({ id_notificacion: id });
    if (!notificacion) {
      throw new NotFoundException('No se encontró la notificación con el id proporcionado');
    }
    return notificacion;
  }

  async update(id: string, dto: UpdateNotificacionDto) {
    const notificacion = await this.findOne(id);
    if (dto.id_usuario) notificacion.usuario = { id_usuario: dto.id_usuario } as any;
    if (dto.mensaje) notificacion.mensaje = dto.mensaje;
    if (dto.leido !== undefined) notificacion.leido = dto.leido;
    return await this.notificacionRepository.save(notificacion);
  }

  async remove(id: string) {
    const notificacion = await this.findOne(id);
    await this.notificacionRepository.remove(notificacion);
  }
}
