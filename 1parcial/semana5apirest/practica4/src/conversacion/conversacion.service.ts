import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversacionDto } from './dto/create-conversacion.dto';
import { UpdateConversacionDto } from './dto/update-conversacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversacion } from './entities/conversacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConversacionService {

  constructor(
    @InjectRepository(Conversacion)
    private conversacionRepository: Repository<Conversacion>
  ){}

  async create(createConversacionDto: CreateConversacionDto) {
    const conversacion = this.conversacionRepository.create(createConversacionDto)
    return await this.conversacionRepository.save(conversacion)
  }

  async findAll() {
    return this.conversacionRepository.find()
  }

  async findOne(id: string) {
    const conversacion = await this.conversacionRepository.findOneBy({ id_conversacion: id });
    if(!conversacion){
      throw new NotFoundException("No se encontró el conversacion");
    }
    return conversacion;
  }

  async update(id: string, updateConversacionDto: UpdateConversacionDto) {
    const conversacion = await this.conversacionRepository.findOneBy({ id_conversacion: id });
    if(!conversacion){
      throw new NotFoundException("No se encontró el conversacion");
    }
    await this.conversacionRepository.update(id, updateConversacionDto);
    return await this.conversacionRepository.findOneBy({ id_conversacion: id });
  }

  async remove(id: string) {
    const conversacion = await this.conversacionRepository.findOneBy({id_conversacion: id});
    if(!conversacion){
      throw new NotFoundException("No se encontró el conversacion");
    }
    await this.conversacionRepository.delete(id);
    return { message: `conversacion con id ${id} eliminado correctamente` };
  }
}
