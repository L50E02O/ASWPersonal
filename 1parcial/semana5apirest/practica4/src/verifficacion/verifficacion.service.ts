import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVerificacionDto } from './dto/create-verifficacion.dto';
import { UpdateVerificacionDto } from './dto/update-verifficacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Verifficacion } from './entities/verifficacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VerifficacionService {
  constructor(
    @InjectRepository(Verifficacion)
    private readonly verifficacionRepository: Repository<Verifficacion>,
  ) {}

  async create(dto: CreateVerificacionDto) {
    const verificacion = this.verifficacionRepository.create({
      arquitecto: { id_arquitecto: dto.id_arquitecto } as any,
      moderador: { id_moderador: dto.id_moderador } as any,
      estado: dto.estado ?? Verifficacion.PENDIENTE,
    });
    return await this.verifficacionRepository.save(verificacion);
  }

  async findAll() {
    return this.verifficacionRepository.find();
  }

  async findOne(id: string) {
    const verifficacion = await this.verifficacionRepository.findOneBy({ id_verificacion: id });
    if (!verifficacion)
      throw new NotFoundException('No se encontró la verificación con el id proporcionado');
    return verifficacion;
  }

  async update(id: string, dto: UpdateVerificacionDto) {
    const verifficacion = await this.findOne(id);
    if (dto.id_arquitecto) verifficacion.arquitecto = { id_arquitecto: dto.id_arquitecto } as any;
    if (dto.id_moderador) verifficacion.moderador = { id_moderador: dto.id_moderador } as any;
    if (dto.estado) verifficacion.estado = dto.estado;
    return await this.verifficacionRepository.save(verifficacion);
  }

  async remove(id: string) {
    const verifficacion = await this.findOne(id);
    await this.verifficacionRepository.remove(verifficacion);
  }
}
