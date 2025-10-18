import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Incidencia } from './entities/incidencia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IncidenciaService {

  constructor(
    @InjectRepository(Incidencia)
    private incidenciaRepository: Repository<Incidencia>
  ){}

  async create(createIncidenciaDto: CreateIncidenciaDto) {
    const incidencia = this.incidenciaRepository.create(createIncidenciaDto)
    return await this.incidenciaRepository.save(incidencia)
  }

  async findAll() {
    return this.incidenciaRepository.find()
  }

  async findOne(id: string) {
    const incidencia = await this.incidenciaRepository.findOneBy({ id_incidencia: id });
    if(!incidencia){
      throw new NotFoundException("No se encontró el incidencia");
    }
    return incidencia;
  }

  async update(id: string, updateIncidenciaDto: UpdateIncidenciaDto) {
    const incidencia = await this.incidenciaRepository.findOneBy({ id_incidencia: id });
    if(!incidencia){
      throw new NotFoundException("No se encontró el incidencia");
    }
    await this.incidenciaRepository.update(id, updateIncidenciaDto);
    return await this.incidenciaRepository.findOneBy({ id_incidencia: id });
  }

  async remove(id: string) {
    const incidencia = await this.incidenciaRepository.findOneBy({id_incidencia: id});
    if(!incidencia){
      throw new NotFoundException("No se encontró el incidencia");
    }
    await this.incidenciaRepository.delete(id);
    return { message: `incidencia con id ${id} eliminado correctamente` };
  }
}
