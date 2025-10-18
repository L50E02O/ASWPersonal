import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MensajeService {

  constructor(
    @InjectRepository(Mensaje)
    private mensajeRepository: Repository<Mensaje> 
  ){}

  async create(createMensajeDto: CreateMensajeDto) {
    const mensaje = this.mensajeRepository.create(createMensajeDto)
    return await this.mensajeRepository.save(mensaje)
  }

  async findAll() {
   return this.mensajeRepository.find()
  }

  async findOne(id: string) {
    const mensaje = await this.mensajeRepository.findOneBy({ id_mensaje: id });
    if(!mensaje){
      throw new NotFoundException("No se encontró el mensaje");
    }
    return mensaje;
  }

  async update(id: string, updateMensajeDto: UpdateMensajeDto) {
    const mensaje = await this.mensajeRepository.findOneBy({ id_mensaje: id });
    if(!mensaje){
      throw new NotFoundException("No se encontró el mensaje");
    }
    await this.mensajeRepository.update(id, updateMensajeDto);
    return await this.mensajeRepository.findOneBy({ id_mensaje: id });
  }

  async remove(id: string) {
    const mensaje = await this.mensajeRepository.findOneBy({id_mensaje: id});
    if(!mensaje){
      throw new NotFoundException("No se encontró el mensaje");
    }
    await this.mensajeRepository.delete(id);
    return { message: `mensaje con id ${id} eliminado correctamente` };
  }
}
