import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSolicitudProyectoDto } from './dto/create-solicitudproyecto.dto';
import { UpdateSolicitudproyectoDto } from './dto/update-solicitudproyecto.dto';
import { SolicitudProyecto } from './entities/solicitudproyecto.entity';

@Injectable()
export class SolicitudproyectoService {
  constructor(
    @InjectRepository(SolicitudProyecto)
    private solicitudProyectoRepository: Repository<SolicitudProyecto>,
  ) {}

  async create(createSolicitudproyectoDto: CreateSolicitudProyectoDto) {
    const solicitudProyecto = this.solicitudProyectoRepository.create(createSolicitudproyectoDto);
    return await this.solicitudProyectoRepository.save(solicitudProyecto);
  }

  async findAll() {
    return await this.solicitudProyectoRepository.find();
  }

  async findOne(id: string) {
    const solicitudProyecto = await this.solicitudProyectoRepository.findOneBy({ id_solicitud: id });
    if (!solicitudProyecto) {
      throw new NotFoundException('No se encontró la solicitud con el id proporcionado');
    }
    return solicitudProyecto;
  }

  async update(id: string, updateSolicitudproyectoDto: UpdateSolicitudproyectoDto) {
    const solicitudProyecto = await this.solicitudProyectoRepository.findOneBy({ id_solicitud: id });
    if (!solicitudProyecto) {
      throw new NotFoundException('No se encontró la solicitud con el id proporcionado');
    }
    await this.solicitudProyectoRepository.update(id, updateSolicitudproyectoDto);
    return this.solicitudProyectoRepository.findOneBy({ id_solicitud: id });
  }

  async remove(id: string) {
    const solicitudProyecto = await this.solicitudProyectoRepository.findOneBy({ id_solicitud: id });
    if (!solicitudProyecto) {
      throw new NotFoundException('No se encontró la solicitud con el id proporcionado');
    }
    await this.solicitudProyectoRepository.remove(solicitudProyecto);
    return { message: 'Solicitud de proyecto eliminada correctamente' };
  }
}