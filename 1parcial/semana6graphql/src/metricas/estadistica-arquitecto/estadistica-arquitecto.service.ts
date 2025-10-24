import { Injectable } from '@nestjs/common';
import { CreateEstadisticaArquitectoInput } from './dto/create-estadistica-arquitecto.input';
import { UpdateEstadisticaArquitectoInput } from './dto/update-estadistica-arquitecto.input';

@Injectable()
export class EstadisticaArquitectoService {
  create(createEstadisticaArquitectoInput: CreateEstadisticaArquitectoInput) {
    return 'This action adds a new estadisticaArquitecto';
  }

  findAll() {
    return `This action returns all estadisticaArquitecto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} estadisticaArquitecto`;
  }

  update(id: number, updateEstadisticaArquitectoInput: UpdateEstadisticaArquitectoInput) {
    return `This action updates a #${id} estadisticaArquitecto`;
  }

  remove(id: number) {
    return `This action removes a #${id} estadisticaArquitecto`;
  }
}
