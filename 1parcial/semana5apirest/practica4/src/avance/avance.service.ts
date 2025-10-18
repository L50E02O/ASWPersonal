import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvanceDto } from './dto/create-avance.dto';
import { UpdateAvanceDto } from './dto/update-avance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Avance } from './entities/avance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AvanceService {

  constructor(@InjectRepository(Avance)
  private avanceRepository: Repository<Avance>){}

  async create(createAvanceDto: CreateAvanceDto) {
    const avance = this.avanceRepository.create(createAvanceDto)
    return await this.avanceRepository.save(avance)
  }

  async findAll() {
    return this.avanceRepository.find()
  }

  async findOne(id: string) {
    const avance = await this.avanceRepository.findOneBy({ id_avance: id });
    if(!avance){
      throw new NotFoundException("No se encontró el avance");
    }
    return avance;
  }

  async update(id: string, updateAvanceDto: UpdateAvanceDto) {
    const avance = await this.avanceRepository.findOneBy({ id_avance: id });
    if(!avance){
      throw new NotFoundException("No se encontró el avance");
    }
    await this.avanceRepository.update(id, updateAvanceDto);
    return await this.avanceRepository.findOneBy({ id_avance: id });
  }

  async remove(id: string) {
    const avance = await this.avanceRepository.findOneBy({id_avance: id});
    if(!avance){
      throw new NotFoundException("No se encontró el avance");
    }
    await this.avanceRepository.delete(id);
    return { message: `Avance con id ${id} eliminado correctamente` };
  }
}
