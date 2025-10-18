import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateValoracionDto } from './dto/create-valoracion.dto';
import { UpdateValoracionDto } from './dto/update-valoracion.dto';
import { Valoracion } from './entities/valoracion.entity';

@Injectable()
export class ValoracionService {
  constructor(
    @InjectRepository(Valoracion)
    private valoracionRepository: Repository<Valoracion>,
  ) {}

  async create(createValoracionDto: CreateValoracionDto) {
    const valoracion = this.valoracionRepository.create(createValoracionDto);
    return await this.valoracionRepository.save(valoracion);
  }

  async findAll() {
    return await this.valoracionRepository.find();
  }

  async findOne(id: string) {
    const valoracion = await this.valoracionRepository.findOneBy({ id_valoracion: id });
    if (!valoracion) {
      throw new NotFoundException('No se encontró la valoración con el id proporcionado');
    }
    return valoracion;
  }

  async update(id: string, updateValoracionDto: UpdateValoracionDto) {
    const valoracion = await this.valoracionRepository.findOneBy({ id_valoracion: id });
    if (!valoracion) {
      throw new NotFoundException('No se encontró la valoración con el id proporcionado');
    }
    await this.valoracionRepository.update(id, updateValoracionDto);
    return this.valoracionRepository.findOneBy({ id_valoracion: id });
  }

  async remove(id: string) {
    const valoracion = await this.valoracionRepository.findOneBy({ id_valoracion: id });
    if (!valoracion) {
      throw new NotFoundException('No se encontró la valoración con el id proporcionado');
    }
    await this.valoracionRepository.remove(valoracion);
    return { message: 'Valoración eliminada correctamente' };
  }
}
