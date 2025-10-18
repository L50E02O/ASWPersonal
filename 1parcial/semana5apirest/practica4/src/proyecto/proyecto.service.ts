import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepository: Repository<Proyecto>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto) {
    const proyecto = this.proyectoRepository.create(createProyectoDto);
    return await this.proyectoRepository.save(proyecto);
  }

  async findAll() {
    return await this.proyectoRepository.find();
  }

  async findOne(id: string) {
    const proyecto = await this.proyectoRepository.findOneBy({ id_proyecto: id });
    if (!proyecto) {
      throw new NotFoundException('No se encontró el proyecto con el id proporcionado');
    }
    return proyecto;
  }

  async update(id: string, updateProyectoDto: UpdateProyectoDto) {
    const proyecto = await this.proyectoRepository.findOneBy({ id_proyecto: id });
    if (!proyecto) {
      throw new NotFoundException('No se encontró el proyecto con el id proporcionado');
    }
    await this.proyectoRepository.update(id, updateProyectoDto);
    return this.proyectoRepository.findOneBy({ id_proyecto: id });
  }

  async remove(id: string) {
    const proyecto = await this.proyectoRepository.findOneBy({ id_proyecto: id });
    if (!proyecto) {
      throw new NotFoundException('No se encontró el proyecto con el id proporcionado');
    }
    await this.proyectoRepository.remove(proyecto);
    return { message: 'Proyecto eliminado correctamente' };
  }
}