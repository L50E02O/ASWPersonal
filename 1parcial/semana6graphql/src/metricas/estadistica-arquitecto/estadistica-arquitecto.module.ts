import { Module } from '@nestjs/common';
import { EstadisticaArquitectoService } from './estadistica-arquitecto.service';
import { EstadisticaArquitectoResolver } from './estadistica-arquitecto.resolver';

@Module({
  providers: [EstadisticaArquitectoResolver, EstadisticaArquitectoService],
})
export class EstadisticaArquitectoModule {}
