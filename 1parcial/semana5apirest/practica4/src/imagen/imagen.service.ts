import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { UpdateImagenDto } from './dto/update-imagen.dto';
import { Imagen } from './entities/imagen.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ImagenService {

  constructor(@InjectRepository(Imagen)
  private imagenRepository: Repository<Imagen>
  ){}

  async create(createImagenDto: CreateImagenDto) {
    const imagen = this.imagenRepository.create(createImagenDto)
    return await this.imagenRepository.save(imagen)
  }

  async findAll() {
    return this.imagenRepository.find()
  }

  async findOne(id: string) {
    const imagen = await this.imagenRepository.findOneBy({ id_imagen: id });
    if(!imagen){
      throw new NotFoundException("No se encontró el imagen");
    }
    return imagen;
  }

  async update(id: string, updateImagenDto: UpdateImagenDto) {
    const imagen = await this.imagenRepository.findOneBy({ id_imagen: id });
    if(!imagen){
      throw new NotFoundException("No se encontró el imagen");
    }
    await this.imagenRepository.update(id, updateImagenDto);
    return await this.imagenRepository.findOneBy({ id_imagen: id });
  }

  async remove(id: string) {
    const imagen = await this.imagenRepository.findOneBy({id_imagen: id});
    if(!imagen){
      throw new NotFoundException("No se encontró el imagen");
    }
    await this.imagenRepository.delete(id);
    return { message: `imagen con id ${id} eliminado correctamente` };
  }
}
