import { PartialType } from '@nestjs/swagger';
import { CreateSolicitudProyectoDto } from './create-solicitudproyecto.dto';

export class UpdateSolicitudproyectoDto extends PartialType(CreateSolicitudProyectoDto) {}
