import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudproyectoService } from './solicitudproyecto.service';
import { SolicitudproyectoController } from './solicitudproyecto.controller';
import { SolicitudProyecto } from './entities/solicitudproyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SolicitudProyecto])],
  controllers: [SolicitudproyectoController],
  providers: [SolicitudproyectoService],
  exports: [TypeOrmModule],
})
export class SolicitudproyectoModule {}