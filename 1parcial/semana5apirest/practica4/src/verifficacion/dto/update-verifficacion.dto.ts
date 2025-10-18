import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { EstadoVerificacion } from '../entities/verifficacion.entity';

export class UpdateVerificacionDto {
  @IsOptional()
  @IsUUID('4', { message: 'El id_arquitecto debe ser un UUID válido' })
  id_arquitecto?: string;

  @IsOptional()
  @IsUUID('4', { message: 'El id_moderador debe ser un UUID válido' })
  id_moderador?: string;

  @IsOptional()
  @IsEnum(EstadoVerificacion, {
    message: 'El estado debe ser uno de: pendiente, verificado o rechazado',
  })
  estado?: EstadoVerificacion;
}
