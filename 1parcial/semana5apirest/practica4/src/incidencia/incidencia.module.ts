import { Module } from '@nestjs/common';
import { IncidenciaService } from './incidencia.service';
import { IncidenciaController } from './incidencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incidencia } from './entities/incidencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Incidencia])],
  controllers: [IncidenciaController],
  providers: [IncidenciaService],
})
export class IncidenciaModule {}
