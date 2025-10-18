import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModeradorDto } from './dto/create-moderador.dto';
import { UpdateModeradorDto } from './dto/update-moderador.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Moderador } from './entities/moderador.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModeradorService {
  constructor(
    @InjectRepository(Moderador)
    private readonly moderadorRepository: Repository<Moderador>,
  ) {}

  async create(createModeradorDto: CreateModeradorDto) {
    const moderador = this.moderadorRepository.create({
      usuario: { id_usuario: createModeradorDto.id_usuario },
    });
    return await this.moderadorRepository.save(moderador);
  }

  async findAll() {
    return this.moderadorRepository.find();
  }

  async findOne(id: string) {
    const moderador = await this.moderadorRepository.findOneBy({ id_moderador: id });
    if (!moderador) {
      throw new NotFoundException('No se encontró el moderador con el id proporcionado');
    }
    return moderador;
  }

  async update(id: string, updateModeradorDto: UpdateModeradorDto) {
    const moderador = await this.findOne(id);
    if (updateModeradorDto.id_usuario) {
      moderador.usuario = { id_usuario: updateModeradorDto.id_usuario } as any;
    }
    return await this.moderadorRepository.save(moderador);
  }

  async remove(id: string) {
    const moderador = await this.findOne(id);
    await this.moderadorRepository.remove(moderador);
  }
}
