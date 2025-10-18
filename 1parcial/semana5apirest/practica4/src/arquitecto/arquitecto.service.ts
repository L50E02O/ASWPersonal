import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArquitectoDto } from './dto/create-arquitecto.dto';
import { UpdateArquitectoDto } from './dto/update-arquitecto.dto';
import { Arquitecto } from './entities/arquitecto.entity';

@Injectable()
export class ArquitectoService {
  constructor(
    @InjectRepository(Arquitecto)
    private arquitectoRepository: Repository<Arquitecto>,
  ) {}

  async create(createArquitectoDto: CreateArquitectoDto) {
    const arquitecto = this.arquitectoRepository.create(createArquitectoDto);
    return await this.arquitectoRepository.save(arquitecto);
  }

  async findAll() {
    return await this.arquitectoRepository.find();
  }

  async findOne(id: string) {
    const arquitecto = await this.arquitectoRepository.findOneBy({ id_arquitecto: id });
    if (!arquitecto) {
      throw new NotFoundException('No se encontró el arquitecto con el id proporcionado');
    }
    return arquitecto;
  }

  async update(id: string, updateArquitectoDto: UpdateArquitectoDto) {
    const arquitecto = await this.arquitectoRepository.findOneBy({ id_arquitecto: id });
    if (!arquitecto) {
      throw new NotFoundException('No se encontró el arquitecto con el id proporcionado');
    }
    await this.arquitectoRepository.update(id, updateArquitectoDto);
    return this.arquitectoRepository.findOneBy({ id_arquitecto: id });
  }

  async remove(id: string) {
    const arquitecto = await this.arquitectoRepository.findOneBy({ id_arquitecto: id });
    if (!arquitecto) {
      throw new NotFoundException('No se encontró el arquitecto con el id proporcionado');
    }
    await this.arquitectoRepository.remove(arquitecto);
    return { message: 'Arquitecto eliminado correctamente' };
  }
}