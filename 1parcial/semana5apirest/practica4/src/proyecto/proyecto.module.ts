import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { Proyecto } from './entities/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto])],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [TypeOrmModule],
})
export class ProyectoModule {}